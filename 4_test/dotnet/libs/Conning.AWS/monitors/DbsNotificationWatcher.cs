using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading;
using System.Threading.Tasks;
using Conning.Db.Services;
using Conning.Library.Utility;
using Conning.Models.Notifications;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.AWS.monitors
{
    public delegate void NotificationsChanged(IEnumerable<NotificationSubscription> list);
    
    public class DbsNotificationWatcher : ScheduleMonitor
    {
        private ConcurrentDictionary<string, IAsyncCursor<ChangeStreamDocument<NotificationSubscription>>>
            _allDbWatches =
                new ConcurrentDictionary<string, IAsyncCursor<ChangeStreamDocument<NotificationSubscription>>>();

        private ConcurrentDictionary<string, ConcurrentDictionary<string, NotificationSubscription>> _allSubscriptions = new ConcurrentDictionary<string, ConcurrentDictionary<string, NotificationSubscription>>();
        
        private Subject<ConcurrentDictionary<string, ConcurrentDictionary<string, NotificationSubscription>>> _allSubscriptionsSubject = new Subject<ConcurrentDictionary<string, ConcurrentDictionary<string, NotificationSubscription>>>();
        
        public NotificationsChanged OnNotificationsChanged { get; set; }
        
        public DbsNotificationWatcher(AwsNotificationService service) : base(service)
        {
            this.Timer = 5000;
            this.RetryTimer = 5000;

            _allSubscriptionsSubject.Throttle(TimeSpan.FromSeconds(10))
                .Subscribe(this.TriggerNotificationChanged);
        }

        public void LoadAllSubscriptions(BaseDatabase baseDatabase)
        {
            var database = baseDatabase.GetMongoDb();
            ILogger<AwsNotificationService> log = this.AwsService.getLogger();
            log.LogInformation($"Database {database.DatabaseNamespace} is connected, start to get get all subscriptions and initialize subscribe service");

            MongoDbService mongo = this.AwsService.GetMongoDbService();
            var collection = database.GetCollection<NotificationSubscription>(MongoCollections.notificationSubscriptions);
            var subscriptions =
                new ConcurrentDictionary<string, NotificationSubscription>(collection.AsQueryable()
                    .ToDictionary(c => c._id.ToString()));
            
            this.UpdateSubscriptions(baseDatabase.TenantName, subscriptions);
            
            var options = new ChangeStreamOptions()
            {
                FullDocument = ChangeStreamFullDocumentOption.UpdateLookup,
                MaxAwaitTime = TimeSpan.FromSeconds(10)
            };

            //The operationType can be one of the following: insert, update, replace, delete, invalidate
            var pipeline =
                new EmptyPipelineDefinition<ChangeStreamDocument<NotificationSubscription>>().Match(
                    "{ operationType: { $in: [ 'replace', 'insert', 'update', 'delete' ] } }");
            
            var watch = collection.Watch(pipeline, options);
            
            this._allDbWatches[baseDatabase.TenantName] = watch;

            if (!this.IsMonitoring())
            {
                this.StartMonitor();   
            }
        }
        
        public override async Task Monitoring(CancellationTokenSource cancellationTokenSource)
        {
            ILogger<AwsNotificationService> log = this.AwsService.getLogger();

            Dictionary<Task, KeyValuePair<string, IAsyncCursor<ChangeStreamDocument<NotificationSubscription>>>> taskDic = new Dictionary<Task, KeyValuePair<string, IAsyncCursor<ChangeStreamDocument<NotificationSubscription>>>>();
            this._allDbWatches.ForEach((watch) =>
            {
                var task = watch.Value.MoveNextAsync(cancellationTokenSource.Token);
                taskDic.Add(task, watch);
            });

            await Task.WhenAll(taskDic.Keys);
            foreach (var taskWatch in taskDic)
            {
                var watch = taskWatch.Value;
                string tenant = watch.Key;
                
                try
                {
                    var task = taskWatch.Key;
                    if (task.IsFaulted)
                    {
                        throw task.Exception;
                    }
                    
                    var dbWatch = watch.Value;
                    if (dbWatch.Current != null && dbWatch.Current.Any())
                    {
                        foreach (var current in dbWatch.Current)
                        {
                            var operationType = current.OperationType;
                            switch (operationType)
                            {
                                case ChangeStreamOperationType.Delete:
                                {
                                    string subscriptionObjectId = current.DocumentKey["_id"].ToString();
                                    log.LogInformation($"Delete tenant [{tenant}] NotificationSubscription {subscriptionObjectId}");
                                    this.RemoveSubscription(tenant, subscriptionObjectId);
                                    break;
                                }

                                case ChangeStreamOperationType.Insert:
                                case ChangeStreamOperationType.Replace:
                                case ChangeStreamOperationType.Update:
                                {
                                    log.LogInformation($"Update Document {current.FullDocument.ToJson()}");
                                    this.AddUpdateSubscription(tenant, current.FullDocument);
                                    break;
                                }
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    log.LogError(
                        $"An exception occured when watching notification subscriptions of tenant '{tenant}': {e.ToString()}");
                }
            }
        }

        private void UpdateSubscriptions(string tenant, ConcurrentDictionary<string,NotificationSubscription> subscriptions)
        {
            this._allSubscriptions[tenant] = subscriptions;
            this._allSubscriptionsSubject.OnNext(this._allSubscriptions);
        }
       
        private void RemoveSubscription(string tenant, string subscriptionObjectId)
        {
            this._allSubscriptions[tenant].Remove(subscriptionObjectId, out var removedSubscription);
            this._allSubscriptionsSubject.OnNext(this._allSubscriptions);
        }
        
        private void RemoveTenantSubscriptions(string tenant)
        {
            this._allSubscriptions.Remove(tenant, out var removedSubscription);
            this._allSubscriptionsSubject.OnNext(this._allSubscriptions);
        }
        
        private void AddUpdateSubscription(string tenant, NotificationSubscription subscription)
        {
            this._allSubscriptions[tenant][subscription._id.ToString()] = subscription;
            this._allSubscriptionsSubject.OnNext(this._allSubscriptions);
        }

        private void TriggerNotificationChanged(ConcurrentDictionary<string, ConcurrentDictionary<string, NotificationSubscription>> subscriptions)
        {
            this.AwsService.getLogger().LogInformation($"Notification subscriptions are updated");
            this.OnNotificationsChanged?.Invoke(this.UpdateReturnSubscriptions());
        }
        
        private IEnumerable<NotificationSubscription> UpdateReturnSubscriptions()
        {
            foreach (var tenantSubscriptions in this._allSubscriptions)
            {
                string tenant = tenantSubscriptions.Key;
                foreach (var subscription in tenantSubscriptions.Value.Values)
                {
                    subscription.tenant = tenant;
                    yield return subscription;
                }
            }
        }
        
        public void OnDbIdle(BaseDatabase db)
        {
            string tenant = db.TenantName;
            this.RemoveTenantSubscriptions(tenant);
            this._allDbWatches.TryRemove(tenant, out var removedWatcher );
            if (removedWatcher != null)
            {
                Task.Run(async () =>
                {
                    try
                    {
                        // Avoid exception that object is already disposed because monitoring may still use the watch
                        await Task.Delay(120000);
                        removedWatcher.Dispose();
                    }
                    catch (Exception e)
                    {
                        this.AwsService.getLogger().LogError(
                            $"An error occured when disposing collections watchers of tenant '{tenant}': {e.ToString()}");
                    }
                });
            }
            
            if (this._allDbWatches.Count == 0 && this.IsMonitoring())
            {
                this.StopMonitor();
            }
        }
        
        public void OnDbRestoreIdle(BaseDatabase db)
        {
            this.AwsService.getLogger().LogInformation($"Tenant {db.TenantName} is restored from idle mode.");
            this.LoadAllSubscriptions(db);
        }
    }
}