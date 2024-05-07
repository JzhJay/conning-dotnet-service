using System;
using System.Collections.Generic;
using System.Security;
using System.Threading.Tasks;
using Conning.Db.Services;
using Conning.Models.Notifications;
using GraphQL;
using GraphQL.Types;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class NotificationQueryGraphType : ObjectGraphType
    {
        private MongoDbService _mongo;

        public NotificationQueryGraphType(MongoDbService mongo)
        {
            _mongo = mongo;
            FieldAsync<ListGraphType<NotificationSubscriptionGraph>>(
                "subscriptions", 
                arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>>() {Name = "scope"}
            ), resolve: async ctx => await LoadSubscriptions(ctx));
            
            FieldAsync<ListGraphType<SentNotificationType>>("sent", 
                resolve: async ctx => await LoadSentNotifications(ctx));
        }

        private async Task<List<NotificationSubscription>> LoadSubscriptions(IResolveFieldContext ctx)
        {
            var userId = ctx.GetSecureUserId(out var user);
            var scope = ctx.GetArgument<string>("scope");

            if (string.IsNullOrEmpty(userId))
            {
                throw new SecurityException("You must be authenticated to use this endpoint.");
            }

            var collection = _mongo.database.GetCollection<NotificationSubscription>("notificationSubscriptions");
            var find = await collection.FindAsync(c => c.owner == userId && (c.scope == scope || (scope == "account" && c.scope == null)));
            return await find.ToListAsync();
        }

        private async Task<List<SentNotification>> LoadSentNotifications(IResolveFieldContext ctx)
        {
            var userId = ctx.GetSecureUserId(out var user);

            if (string.IsNullOrEmpty(userId))
            {
                throw new SecurityException("You must be authenticated to use this endpoint.");
            }

            var collection = _mongo.collectionFor<SentNotification>();
            var result = await collection.FindAsync(c => c.owner == userId && c.sentTime > DateTime.Now.AddDays(-30), new FindOptions<SentNotification>
            {
                Sort = Builders<SentNotification>.Sort.Descending("sentTime")
            });
            return await result.ToListAsync();
        }
    }
}