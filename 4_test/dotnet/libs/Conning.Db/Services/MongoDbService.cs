using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Options;
using System.IO;
using System.Threading.Tasks;
using Conning.Models.Notifications;
using GraphQL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;
using GraphQL.Types;
using Newtonsoft.Json;
using Amazon;
using Amazon.Util; // Amazon.Util.EC2InstanceMetadata
using Tag = Amazon.S3.Model.Tag;

namespace Conning.Db.Services
{
    public delegate void OnDbConnect(BaseDatabase database);

    public delegate void OnDbIdle(BaseDatabase db);

    public delegate void OnDbRestoreIdle(BaseDatabase db);

    public static class MongoCollections
    {
        public static string notificationSubscriptions = "notificationSubscriptions";
        public static string sentNotifications = "sentNotifications";
        public static string users = "users";
    }

    public class MongoDbService
    {
        IOptions<AdviseAppSettings> _settings;
        ILogger<MongoDbService> _log;
        private readonly IHostingEnvironment _env;
        private ConcurrentDictionary<string, Lazy<BaseDatabase>> _databases = new ConcurrentDictionary<string, Lazy<BaseDatabase>>();
        private Lazy<UserDatabase> _userDatabase;
        private BaseUserService _userService;

        public OnDbConnect OnDbConnection { get; set; }

        public OnDbIdle OnDbIdle { get; set; }

        public OnDbRestoreIdle OnDbRestoreIdle { get; set; }

        public AmazonS3Client s3 { get; private set; }
        private AmazonSimpleSystemsManagementClient _ssm { get; set; }

        public bool IsMultiTenant { get; private set; }

        public bool IsAutoIdleTenant  { get; private set; }

        public int IdleTimeoutMS  { get; private set; }

        public MongoDbService(IOptions<AdviseAppSettings> settings, ILogger<MongoDbService> log, IHostingEnvironment env, BaseUserService userService)
        {
            _settings = settings;
            _log = log;
            _env = env;
            _userService = userService;
            IsAutoIdleTenant = this.settings.mongo.autoIdleTenant ?? false;
            IdleTimeoutMS = this.settings.mongo.idleTimeoutMS ?? 7200000;
            IsMultiTenant = this.settings.multiTenant;
            
            RegionEndpoint region = this.settings.aws.region;
            // RegionEndpoint ses_region = this.settings.email.region;
            s3 = new AmazonS3Client(region);
            _ssm =  new AmazonSimpleSystemsManagementClient(region);
            _userDatabase = new Lazy<UserDatabase>(() => new UserDatabase(this, this.settings.auth.tenant));
            _userService.SetMongoDbService(this);
        }

        public IHostingEnvironment GetEnv()
        {
            return this._env;
        }

        public string getCurrentUserId()
        {
	        return _userService.GetCurrentUserId() ?? "";
        }

        public string getCurrentTenant()
        {
            return _userService.GetCurrentTenant() ?? "";
        }

        public MongoClient mongo { get; private set; }

        public IMongoDatabase database
        {
            get
            {
                // Create and cache database connection
                return this.GetMongoDbByTenant(this.getCurrentTenant());
            }
        }

        public BaseDatabase baseDatabase
        {
            get
            {
                // Create and cache baseDatabase
                return this.GetBaseDatabaseByTenant(this.getCurrentTenant());
            }
        }

        public IMongoDatabase[] activeDatabases
        {
            get
            {
                return _databases.Values.Select((baseDatabase) => baseDatabase.Value.GetMongoDb()).ToArray();
            }
        }

        public ILogger<MongoDbService> getLogger()
        {
            return this._log;
        }

        public string getSchemaVersion()
        {
            return _settings.Value.omdb.schemaVersion;
        }

        public AdviseAppSettings getAppSettings()
        {
            return this.settings;
        }

        private AdviseAppSettings settings
        {
            get { return _settings.Value; }
        }

        public AmazonSimpleSystemsManagementClient getSSMClient()
        {
            return this._ssm;
        }

        public T MongoGet<T>(Func<IMongoDatabase, T> cb)
        {
            try
            {
                return cb(database);
            }
            catch (Exception e)
            {
                _log.LogError(e.ToString());
                throw;
            }
        }

        public bool IsUserOperateDb()
        {
            string tenant = _userService.GetCurrentTenant();
            return !String.IsNullOrEmpty(tenant);
        }

        public IMongoDatabase GetMongoDbByTenant(string tenantKey)
        {
            return _databases.GetOrAdd(tenantKey ?? "",
                key => new Lazy<BaseDatabase>(() =>
                    String.IsNullOrEmpty(key) ? new BaseDatabase(this, key) : new TenantDatabase(this, key)
                )).Value.GetMongoDb();
        }
        
        public IMongoDatabase GetUserMongoDb()
        {
            return _userDatabase.Value.GetMongoDb();
        }
        
        public BaseDatabase GetBaseDatabaseByTenant(string tenantKey)
        {
            return _databases.GetOrAdd(tenantKey,
                key => new Lazy<BaseDatabase>(() =>
                    String.IsNullOrEmpty(key) ? new BaseDatabase(this, key) : new TenantDatabase(this, key)
                )).Value;
        }

        public void MongoSend(Action<IMongoDatabase> cb)
        {
            try
            {
                cb(database);
            }
            catch (Exception e)
            {
                _log.LogError(e.ToString());
                throw;
            }
        }

        public Task MongoAsync<Task>(string tenant, Func<IMongoDatabase, Task> cb)
        {
            try
            {
                return cb(GetMongoDbByTenant(tenant));
            }
            catch (Exception e)
            {
                _log.LogError(e.ToString());
                throw;
            }
        }

        public IMongoCollection<T> collectionFor<T>(IMongoDatabase db = null)
        {
            db = db ?? this.database;
            if (typeof(T) == typeof(NotificationSubscription))
            {
                return db.GetCollection<T>(MongoCollections.notificationSubscriptions);
            }
            else if (typeof(T) == typeof(SentNotification))
            {
                return db.GetCollection<T>(MongoCollections.sentNotifications);
            }

            return db.GetCollection<T>(typeof(T).Name);
        }
    }
}
