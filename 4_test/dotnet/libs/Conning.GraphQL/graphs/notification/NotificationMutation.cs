using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Conning.Common;
using Conning.Db.Services;
using Conning.Library.Utility;
using Conning.Models.Notifications;
using GraphQL;
using GraphQL.Types;
using MongoDB.Bson;
using MongoDB.Driver;
    
namespace Conning.GraphQL
{
    public class NotificationMutation : ObjectGraphType<object>
    {
        private MongoDbService _mongo;

        public NotificationMutation(MongoDbService mongo, BaseUserService userService, IDesktopNotificationQueue notificationQueue, TestNotificationSubscriptionMutation testNotificationSubscriptionMutation)
        {
            _mongo = mongo;

            Field<TestNotificationSubscriptionMutation>().Name("test").Resolve(ctx => testNotificationSubscriptionMutation);
            
            FieldAsync<ListGraphType<NotificationSubscriptionGraph>>(
                "updateSubscriptions",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<ListGraphType<ModifySubscriptionInputType>>>() {Name = "subscriptions"}
                ),
                resolve: async ctx => await UpdateSubscriptions(ctx));
        }

        private async Task<List<NotificationSubscription>> UpdateSubscriptions(IResolveFieldContext<object> ctx)
        {
            var userId = ctx.GetSecureUserId(out var user);
            
            if (string.IsNullOrEmpty(userId))
            {
                throw new SecurityException("You must be authenticated to use this endpoint.");
            }

            var results = new List<NotificationSubscription>();

            var subscriptionsParam = ctx.GetArgument<object[]>("subscriptions");

            foreach (Dictionary<string, object> inputDict in subscriptionsParam)
            {
                var input = inputDict.ToDynamic();
                string target = input.target;
                string trigger = input.trigger;
                string scope = input.scope;

                //Console.WriteLine(inputDict.ToPrettyString());

                var subscriptions = _mongo.database.GetCollection<BsonDocument>(MongoCollections.notificationSubscriptions);

                var userFilter = Builders<BsonDocument>.Filter.Eq("scope", (string) input.scope);

                // treat missing scopes in DB as account scopes.
                if (scope == "account")
                    userFilter = Builders<BsonDocument>.Filter.Or(userFilter,
                        Builders<BsonDocument>.Filter.Not(Builders<BsonDocument>.Filter.Exists("scope")));

                var filter = Builders<BsonDocument>.Filter.And(Builders<BsonDocument>.Filter.Eq("owner", userId), Builders<BsonDocument>.Filter.Eq("target", input.target),
                    Builders<BsonDocument>.Filter.Eq("trigger", (string) input.trigger), userFilter);

                inputDict["owner"] = userId;

                if (_mongo.IsMultiTenant)
                {
                    inputDict["tenant"] = _mongo.getCurrentTenant();
                }
                
                var update = new BsonDocument("$set", new BsonDocument(inputDict));

                var updated = await subscriptions.UpdateOneAsync(filter, update, new UpdateOptions() {IsUpsert = true});

                results.Add(_mongo.collectionFor<NotificationSubscription>()
                    .AsQueryable()
                    .FirstOrDefault(s => s.target == target && s.trigger == trigger && s.owner == userId && s.scope == scope));
            }

            return results;
        }
    }
}