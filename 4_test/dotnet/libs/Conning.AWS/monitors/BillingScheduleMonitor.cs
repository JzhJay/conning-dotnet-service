using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Conning.Db.Services;
using Conning.GraphQL;
using Conning.Models.Notifications;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.AWS.monitors
{
    public class BillingScheduleMonitor : ScheduleMonitor
    {
        private IEnumerable<NotificationSubscription> _subscriptions = Enumerable.Empty<NotificationSubscription>();

        public BillingScheduleMonitor(AwsNotificationService service) : base(service)
        {
        }

        public override async Task Monitoring(CancellationTokenSource cancellationTokenSource)
        {
            var log = this.AwsService.getLogger();
            var omdb = this.AwsService.GetOmdbService();
            var userService = this.AwsService.GetUserService();
            var mongo = this.AwsService.GetMongoDbService();
            var subscriptions = this._subscriptions;
            
            foreach (var billingSubscriber in subscriptions)
            {
                if (!this.IsBillingSubscription(billingSubscriber))
                {
                    continue;
                }

                var tenant = billingSubscriber.tenant ?? "";
                var db = mongo.GetMongoDbByTenant(tenant);
                var now = DateTime.UtcNow;
                var startOfMonth = new DateTime(now.Year, now.Month, 1);
                var result = await BillingQueryGraph.getBillingSummary(omdb, db, userService, startOfMonth, now,
                    billingSubscriber.scope == "user" ? new List<string> {billingSubscriber.owner} : null, null);
                
                log.LogInformation($"Complete get billing result, tenant '{tenant}'");

                await result.simulationSummary.waitForCalculationDone();
                if (billingSubscriber.extra == null || billingSubscriber.extra.threshold == null)
                {
                    continue;
                }
                
                log.LogInformation($"Complete simulationSummary, tenant: '{tenant}'");
                
                var threshold = Double.Parse(billingSubscriber.extra.threshold);
                var billTotal = result.simulationSummary.totalRows.totalCharge;
                var multiple = Math.Floor(billTotal / threshold);
                if (multiple >= 1)
                {
                    var messageKey =
                        $"Billing-usage_threshold-{now.Year}-{now.Month}-{threshold}-{multiple}-{billingSubscriber.owner}-{billingSubscriber.scope}";
                    var sentNotificationsCollection =
                        db.GetCollection<BsonDocument>(MongoCollections.sentNotifications);
                    long count = sentNotificationsCollection.Count(
                        Builders<BsonDocument>.Filter.Eq("messageKey", messageKey));

                    // Only send notification if we haven't already sent one
                    if (count == 0)
                    {
                        await this.AwsService.processNotification(
                            new NotificationSubscription[] {billingSubscriber},
                            new NotificationMessageParam()
                            {
                                billTotal = billTotal, threshold = threshold,
                                messageType = "billing_usage_threshold",
                                owner = billingSubscriber.scope == "user" ? billingSubscriber.owner : null
                            }, messageKey, tenant);
                    }
                }
            }
        }

        private bool IsBillingSubscription(NotificationSubscription sub)
        {
            return sub.target == "billing" && sub.trigger == "billing_usage_threshold";
        }
        
        public void UpdateSubscriptions(IEnumerable<NotificationSubscription> subscriptions)
        {
            this._subscriptions = subscriptions;
            if (this._subscriptions.Any())
            {
                if (!this.IsMonitoring())
                {
                    this.StartMonitor();
                }
            } else if (this.IsMonitoring())
            {
                this.StopMonitor();
            }
        }
    }
}