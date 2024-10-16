using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Security;
using System.Threading;
using System.Threading.Tasks;
using Conning.Db.Services;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using ChangeStreamOptions = MongoDB.Driver.ChangeStreamOptions;

namespace Conning.GraphQL
{
    public class OmdbSubscriptionGraph : OmdbUpdateEventGraph
    {
        private readonly OmdbService _omdb;
        private readonly ILogger<OmdbSubscriptionGraph> _log;
        private readonly IOptions<AdviseAppSettings> _settings;

        //public ConcurrentStack<DesktopNotificationEvent> NotificationsQuery { get; }

        private readonly Dictionary<string, ISubject<OmdbUpdateEvent>> _omdbUpdates =
            new Dictionary<string, ISubject<OmdbUpdateEvent>>();

        private ConcurrentDictionary<string, DbCollectionsWatch> _tasks = new ConcurrentDictionary<string, DbCollectionsWatch>();
        
        private IEnumerable<string> _watchedObjectTypes = Enumerable.Empty<string>();

        private bool _isWatchCollections;
        
        public OmdbSubscriptionGraph(OmdbService omdb, ILogger<OmdbSubscriptionGraph> log, IOptions<AdviseAppSettings> settings)
        {
            Name = "omdb_subscriptions";

            _omdb = omdb;
            _log = log;
            _settings = settings;
            _isWatchCollections = _settings.Value.omdb.watchCollections;

            this.SubscribeDatabaseEvents();
        }

        private void SubscribeDatabaseEvents()
        {
            if (_isWatchCollections)
            {
                _log.LogInformation("Watching collections is enabled.");
                MongoDbService service = _omdb.MongoService;
                service.OnDbConnection += this.HandleOnDatabaseConnect;
                service.OnDbRestoreIdle += this.HandleOnDatabaseConnect;
                service.OnDbIdle += this.CancelDatabaseWatch;
            }
        }
        
        public void StartCollectionWatches(IEnumerable<string> objectTypes)
        {
            _watchedObjectTypes = objectTypes.Concat(new[] {"omdb_ui"});

            if (_isWatchCollections)
            {
                // TODO: Remove the following line once testing is done
                var db = _omdb.PostgreService.baseDatabase;
                // trigger manually for default database; May not need it if can get _watchedObjectTypes in initialization
                this.HandleOnDatabaseConnect(_omdb.MongoService.baseDatabase);
            }
        }

        private void HandleOnDatabaseConnect(BaseDatabase db)
        {
            if (!_watchedObjectTypes.Any())
            {
                return;
            }
            
            // string tenant = db.TenantName;
            // _log.LogInformation($"Start to watch collections, tenant: {tenant}, collections=[{String.Join(",", _watchedObjectTypes)}]");
            // _tasks.AddOrUpdate(tenant, (key) => RunDatabaseWatch(tenant, db.GetMongoDb(), _watchedObjectTypes), (key, oldTask) =>
            // {
            //     if (!oldTask.cancelToken.IsCancellationRequested)
            //     {
            //         oldTask.cancelToken.Cancel();
            //     }

            //     return RunDatabaseWatch(tenant, db.GetMongoDb(), _watchedObjectTypes);
            // });
        }
        
        private DbCollectionsWatch RunDatabaseWatch(string tenant, IMongoDatabase db, IEnumerable<string> watchedCollections)
        {
            var cancellationTokenSource = new CancellationTokenSource();
            var watchers = this.GetDbCollectionsWatchers(db, watchedCollections);
            Task.Run(async () =>
            {
                _log.LogDebug($"Watching tenant [{tenant}]'s database collections.");
                while (!cancellationTokenSource.IsCancellationRequested)
                {
                    try
                    {
                        var tasks = new List<Task>();
                        foreach (var watch in watchers)
                        {
                            try
                            {
                                tasks.Add(this.RunCollectionWatch(tenant, watch.Key, watch.Value,
                                    cancellationTokenSource));
                            }
                            catch (Exception e)
                            {
                                _log.LogError(
                                    $"Error occured when starting to watch collection '{watch.Key}' of tenant '{tenant}': {e.Message} {e.StackTrace}");
                            }
                        }

                        await Task.WhenAll(tasks);
                    }
                    catch (Exception e)
                    {
                        // In case thread is cancelled after checking cancel token
                        _log.LogError(
                            $"An error occured when processing collection changes of tenant '{tenant}': {e.Message} {e.StackTrace}");
                        await Task.Delay(5000);
                    }
                }
            }, cancellationTokenSource.Token);

            return new DbCollectionsWatch()
            {
                cancelToken = cancellationTokenSource,
                watchers = watchers
            };
        }

        private async Task RunCollectionWatch(string tenant, string collectionName, IAsyncCursor<ChangeStreamDocument<BsonDocument>> cursor, CancellationTokenSource cancelToken) 
        {
            try
            {
                await cursor.MoveNextAsync(cancelToken.Token);
                if (cursor.Current != null && cursor.Current.Any())
                {
                    foreach (var e in cursor.Current)
                    {
                        _log.LogInformation($"Collection '{collectionName}' changed ({e.OperationType.ToString()}) in tenant '{tenant}'");
                        
                        if (collectionName == "omdb_ui")
                        {
                            _omdb.ResetCache(tenant);
                        }
                        else
                        {
                            var id = e.DocumentKey.GetValue("_id");
                            string createdBy = null;
                            
                            try
                            {
                                if (e.FullDocument != null)
                                {
                                    e.FullDocument.TryGetValue("createdBy", out BsonValue value);
                                    if (value != null)
                                    {
                                        createdBy = value.ToString();
                                    }
                                }
                            }
                            catch (InvalidCastException ex)
                            {
                                _log.LogWarning($"OperationType {e.OperationType} is not able to get FullDocument of document id '{id} from collection '{collectionName}' of tenant '{tenant}', the document may already be removed.");
                            }
                            // We push the notification to the frontend by creating an OmdbUpdateEvent
                            // We care about all the updates except for omdb_ui
                            var operationType = (ChangeStreamOperationType) e.OperationType;
                            var updateEvent = new OmdbUpdateEvent()
                            {
                                _id = id?.ToString(),
                                objectType = collectionName,
                                operation = operationType.ToString()
                            };

                            _omdb.ResetCache(tenant);

                            foreach (var subscriber in ValidSubscribersFor(collectionName, id,
                                createdBy))
                            {
                                subscriber.Value.OnNext(updateEvent);
                            }
                        }
                    }
                }
            }
            catch (OperationCanceledException e)
            {
                _log.LogWarning($"Watching collection '{collectionName}' of tenant '{tenant}' has been canceled");
            }
            catch (Exception e)
            {
                _log.LogError($"An error occured when watching collection '{collectionName}' changes of tenant '{tenant}': {e.Message} {e.StackTrace}");
            }
        }

        private void CancelDatabaseWatch(BaseDatabase db)
        {
            string tenant = db.TenantName;
            _log.LogInformation($"Users of tenant '{tenant}' didn't execute any actions for a long time. Stopped watching collections.");
            
            if (_tasks.TryRemove(tenant, out var dbCollectionsWatch))
            {
                dbCollectionsWatch.cancelToken.Cancel();
                Task.Run(async()=> {
                    try
                    {
                        // Avoid exception that object is already disposed because monitoring may still use the watch
                        await Task.Delay(180000);
                        foreach (var watch in dbCollectionsWatch.watchers.Values)
                        {
                            watch.Dispose();
                        }
                    }
                    catch (Exception e)
                    {
                        _log.LogError($"An error occured when disposing collections watchers of tenant '{tenant}': {e.Message} {e.StackTrace}");
                    }
                });
            }
            _omdb.ResetCache(tenant);
        }

        private Dictionary<string, IAsyncCursor<ChangeStreamDocument<BsonDocument>>> GetDbCollectionsWatchers(IMongoDatabase db, IEnumerable<string> watchedCollections)
        {
            var dict = new Dictionary<string, IAsyncCursor<ChangeStreamDocument<BsonDocument>>>();
            var options = new ChangeStreamOptions()
            {
                FullDocument = ChangeStreamFullDocumentOption.UpdateLookup,
                MaxAwaitTime = TimeSpan.FromSeconds(20)
            };

            //The operationType can be one of the following: insert, update, replace, delete, invalidate
            var pipeline =
                new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>().Match(
                    "{ operationType: { $in: [ 'replace', 'insert', 'update', 'delete' ] } }");
            
            foreach (var collectionName in watchedCollections)
            {
                var collection = db.GetCollection<BsonDocument>(collectionName);
                dict[collectionName] = collection.Watch(pipeline, options);
            }

            return dict;
        }
        
        public void RegisterField(GraphSubscriptions parent)
        {
            parent.AddField(
                new FieldType()
                {
                    Name = "omdb_changed",
                    Type = typeof(OmdbUpdateEventGraph),
                    Resolver = new FuncFieldResolver<OmdbUpdateEvent>(context => context.Source as OmdbUpdateEvent),
                    StreamResolver = new SourceStreamResolver<OmdbUpdateEvent>(context =>
                    {
                        var userId = context.GetSecureUserId(out var user);

                        if (userId == null)
                        {
                            throw new SecurityException("You must be authenticated to access this endpoint.");
                        }

                        if (!_omdbUpdates.ContainsKey(userId))
                        {
                            _omdbUpdates.Add(userId, new ReplaySubject<OmdbUpdateEvent>(1));
                        }
                        
                        return _omdbUpdates[userId].AsObservable();
                    })
                });
        }
        
        private List<KeyValuePair<string, ISubject<OmdbUpdateEvent>>> ValidSubscribersFor(string ot, BsonValue id, string createdBy)
        {
            return _omdbUpdates.ToList();
        }
    }

    public class DbCollectionsWatch
    {
        public CancellationTokenSource cancelToken { get; set; }
        public Dictionary<string, IAsyncCursor<ChangeStreamDocument<BsonDocument>>> watchers { get; set; }
    }
    
    public class OmdbUpdateEvent
    {
        public string objectType { get; set; }
        public string _id { get; set; }
        public string operation { get; set; }
    }

    public class OmdbUpdateEventGraph : ObjectGraphType<OmdbUpdateEvent>
    {
        public OmdbUpdateEventGraph()
        {
            Field(_ => _.objectType);
            Field(_ => _._id);
            Field(_ => _.operation);
        }
    }
}