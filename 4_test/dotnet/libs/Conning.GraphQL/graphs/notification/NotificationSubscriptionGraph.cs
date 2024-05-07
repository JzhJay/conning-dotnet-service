using System;
using System.Security;
using Conning.Common;
using Conning.Models.Notifications;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace Conning.GraphQL
{
    public class NotificationSubscriptionGraph : ObjectGraphType<NotificationSubscription>
    {
        private readonly IDesktopNotificationQueue _notificationQueue;

        public NotificationSubscriptionGraph(IDesktopNotificationQueue notificationQueue)
        {
            _notificationQueue = notificationQueue;
            Name = "NotificationSubscription";

            Field<ObjectIdGraphType>().Name("_id").Description("Unique ID");
            //Field<ListGraphType<NotificationEndpoint>>().Name("endpoints");
            Field<NotificationTarget>().Name("target").Description("The category (system/billing/simulation) for the subscription.");
            Field<StringGraphType>().Name("trigger").Description("The specific event (grid powered off, simulation finished, etc...)");
            Field<StringGraphType>().Name("severity").Description("The severity level of the trigger");
            Field<JsonGraphType>().Name("extra").Description("Any additional parameters (dollar threshold, timespan, etc)");
            Field(o => o.email, nullable: true);
            Field(o => o.emailSecondary, nullable: true);
            Field(o => o.desktop, nullable: true);
            Field(o => o.mobile, nullable: true);
        }

        public void RegisterNotificationField(GraphSubscriptions graphSubscriptions)
        {
            graphSubscriptions.AddField(new FieldType
            {
                Name = "notification",
                Type = typeof(DesktopNotificationGraph),
                Resolver = new FuncFieldResolver<DesktopNotificationEvent>(context => context.Source as DesktopNotificationEvent),
                StreamResolver = new SourceStreamResolver<DesktopNotificationEvent>(context =>
                {
                    var userId = context.GetSecureUserId(out var user);

                    if (userId == null)
                    {
                        throw new SecurityException("You must be authenticated to subscribe to this endpoint.");
                    }

                    return _notificationQueue.NotificationsForUser(userId);
                })
            });

        }          
    }
}