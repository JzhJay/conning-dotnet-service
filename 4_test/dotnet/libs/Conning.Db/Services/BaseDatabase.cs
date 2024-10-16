using System;
using System.IO;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Amazon.SimpleSystemsManagement.Model;
using Conning.Db.Migrators;
using Conning.Db.RecordUpdater;
using MongoDB.Driver;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;
using Npgsql;
using MongoDB.Bson;

namespace Conning.Db.Services
{
    public class BaseDatabase
    {
        private static string _globalConnectionString = "";
        private static string _globalPostgresConnectionString = "";
        private static Lazy<MongoClient> _singletonMongoClient = new Lazy<MongoClient>(() => new MongoClient(BaseDatabase._globalConnectionString));
        private static Lazy<NpgsqlConnection> _singletonPostgresClient = new Lazy<NpgsqlConnection>(() => new NpgsqlConnection(BaseDatabase._globalPostgresConnectionString));
        public String TenantName { get; private set; }
        private MongoDbService _service;
        private PostgreService _postgreService;
        private IMongoDatabase _database;
        private NpgsqlConnection _sqlDatabase;
        private bool _isIdle;
        private bool _isAutoIdle;
        private int _idleTimeoutMS;
        private Subject<DateTime> _checkIdleSubject;
        protected virtual bool IsEnsureDefaultData => true;
        protected virtual bool IsEventsEnabled => true;

        protected virtual bool IsUpdateRecordsByVersion => true;
        private bool IsOnPremK8s = Environment.GetEnvironmentVariable("ON_PREM_K8S") == "1";

        public BaseDatabase(MongoDbService service, string tenant)
        {
            this._service = service;
            this.TenantName = tenant;

            if (this._service.IsMultiTenant)
            {
                this._isAutoIdle = this._service.IsAutoIdleTenant;
                if (this._isAutoIdle)
                {
                    this._idleTimeoutMS = this._service.IdleTimeoutMS;
                    _checkIdleSubject = new Subject<DateTime>();

                    // If users didn't execute any db actions within 2 minutes, start to calculate idle time.
                    _checkIdleSubject.Throttle(TimeSpan.FromMilliseconds(this._idleTimeoutMS))
                        .Subscribe(this.StartIdleCheck);
                    _checkIdleSubject.OnNext(DateTime.Now);
                }
            }

            this.Connect();
        }

        // TODO: 1. Retool BaseDatabase to make it as a real base class, then derive MongoDatabase and PostgreDatabase from it.
        // TODO: 2. Create a new base class called BaseDatabaseService, which will be used to manage different database services.
        public BaseDatabase(PostgreService service, string tenant)
        {
            this._postgreService = service;
            this.TenantName = tenant;

            if (this._postgreService.IsMultiTenant)
            {
                this._isAutoIdle = this._postgreService.IsAutoIdleTenant;
                if (this._isAutoIdle)
                {
                    this._idleTimeoutMS = this._postgreService.IdleTimeoutMS;
                    _checkIdleSubject = new Subject<DateTime>();
                    // If users didn't execute any db actions within 2 minutes, start to calculate idle time.
                    _checkIdleSubject.Throttle(TimeSpan.FromMilliseconds(this._idleTimeoutMS))
                        .Subscribe(this.StartIdleCheck);
                    _checkIdleSubject.OnNext(DateTime.Now);
                }
            }

            this.postgreConnect();

        }

        private string GetPostgresConnectionString()
        {
            if (string.IsNullOrEmpty(BaseDatabase._globalPostgresConnectionString))
            {
                string connectString = "Host=localhost;Port=5433;Database=ferretdb;Username=rwuser;Password=Conning2026!";
                BaseDatabase._globalPostgresConnectionString = connectString;
                Console.WriteLine("IsOnPremK8s, return connectString: '{0}' directly", connectString);
            }

            return BaseDatabase._globalPostgresConnectionString;
        }

        private string GetConnectionString()
        {
            if (String.IsNullOrEmpty(BaseDatabase._globalConnectionString))
            {
                var ssmMongoCredentialsPath = Environment.GetEnvironmentVariable("SSM_MONGO_CREDENTIALS_PATH");
                string connectString;
                var settings = this._service.getAppSettings();
                var ssm = this._service.getSSMClient();

                if (IsOnPremK8s){
                    connectString = settings.mongo.connectionString;
                    Console.WriteLine("IsOnPremK8s, return connectString: '{0}' directly", connectString);
                }
                else{
                    if (!string.IsNullOrEmpty(ssmMongoCredentialsPath))
                    {
                        // New method, retrieve credentials from SSM parameter store
                        var request = new GetParameterRequest
                        {
                            Name = ssmMongoCredentialsPath,
                            WithDecryption = true
                        };
                        using (var response = ssm.GetParameterAsync(request))
                        {
                            var mongoCredentials = JsonConvert.DeserializeObject<MongoSettings.MongoCredentials>(response.Result.Parameter.Value);
                            connectString = settings.mongo.connectionString.Replace("{username}", mongoCredentials.username).Replace("{password}", mongoCredentials.password);
                        }
                    } else
                    {
                            var s3 = this._service.s3;
                            var request = new GetObjectRequest
                            {
                                BucketName = settings.aws.scriptBucketName,
                                Key = settings.aws.mongoCredentialsJsonFile
                            };
                            using (var response = s3.GetObjectAsync(request).Result)
                            using (var responseStream = response.ResponseStream)
                            using (var reader = new StreamReader(responseStream))
                            {
                                var stream = reader.ReadToEnd();
                                var mongoCredentials = JsonConvert.DeserializeObject<MongoSettings.MongoCredentials>(stream);
                                connectString = settings.mongo.connectionString.Replace("{username}", mongoCredentials.username)
                                    .Replace("{password}", mongoCredentials.password);
                            }
                    }
                }
                BaseDatabase._globalConnectionString = connectString;
            }

            return BaseDatabase._globalConnectionString;
        }

        protected virtual String GetDatabaseName(string connectionString)
        {
            return MongoUrl.Create(connectionString).DatabaseName;
        }

        public PostgreService GetPostgreService()
        {
            return _postgreService;
        }

        public MongoDbService GetMongoDbService()
        {
            return _service;
        }

        public IMongoDatabase GetMongoDb()
        {
	        this._service.getLogger().LogDebug("Get Tenant: " + this.TenantName);

            if (this._isAutoIdle)
            {
                if (this._service.IsUserOperateDb()) {
                    this._checkIdleSubject.OnNext(DateTime.Now);
                }

                if (this._isIdle)
                {
                    this.RestoreIdle();
                }
            }

            return this._database;
        }

        public NpgsqlConnection GetPostgres()
        {
            this._postgreService.getLogger().LogDebug("Get Tenant: " + this.TenantName);

            if (this._isAutoIdle)
            {
                if (this._service.IsUserOperateDb()) {
                    this._checkIdleSubject.OnNext(DateTime.Now);
                }

                if (this._isIdle)
                {
                    this.RestoreIdle();
                }
            }

            return this._sqlDatabase;
        }

        protected void postgreConnect()
        {
            ILogger<PostgreService> log = this._postgreService.getLogger();
            string connectionString = this.GetPostgresConnectionString();
            NpgsqlConnection conn = BaseDatabase._singletonPostgresClient.Value;
            try
            {
                conn.Open();
            }
            catch (NpgsqlException ex)
            {
                throw new Exception($"Unable to connect to PostgreSQL at {connectionString}");
            }

            //TODO: parse the database name from the postgresql connection string
            string databasename = "ferretdb";
            conn.ChangeDatabase(databasename);
            this._sqlDatabase = conn;
            log.LogInformation("Connected to PostgreSQL at {0} - Database '{1}'",
                connectionString, databasename);

            if (this.IsEventsEnabled)
            {
                this._postgreService.OnDbConnection?.Invoke(this);
            }

        }

        protected void Connect()
        {
            ILogger<MongoDbService> log = this._service.getLogger();
            String connectionString = this.GetConnectionString();
            // singleton MongoClient based on offical document's suggestions
            MongoClient mongo = BaseDatabase._singletonMongoClient.Value;
            if (mongo == null)
            {
                throw new Exception($"Unable to connect to MongoDb at {connectionString}");
            }

            string databaseName = this.GetDatabaseName(connectionString);
            this._database = mongo.GetDatabase(databaseName);

            log.LogInformation("Connected to MongoDB at {0} - Database '{1}'",
                String.Join(",", mongo.Settings.Servers.Select(s => s.ToString())),
                this._database.DatabaseNamespace.DatabaseName);

            if (this.IsEnsureDefaultData)
            {
                EnsureCollections().Wait();
                EnsureIndices();

                log.LogInformation($"Collection Statistics (startup):");
                var collections = this._database.ListCollections().ToList();
                if (collections.Count == 0)
                {
                    throw new Exception(
                        $"Database {this._database.DatabaseNamespace.DatabaseName} is empty on {connectionString}");
                }

                foreach (var c in collections)
                {
                    var name = c["name"].ToString();
                    var col = this._database.GetCollection<BsonDocument>(name);
                    log.LogInformation("       {0}:  {1} items", name, col.AsQueryable().Count());
                }
            }

            if (this.IsUpdateRecordsByVersion)
            {
	            UpdateRecordsByVersion().Wait();
            }

            if (this.IsEventsEnabled)
            {
                this._service.OnDbConnection?.Invoke(this);
            }
        }

        protected async Task EnsureCollections()
        {
            var env = _service.GetEnv();
            var settings = this._service.getAppSettings();
            var d = new DirectoryInfo($"db/baseload/{env.EnvironmentName}");

            string[] fallback_folders = {"Production", "Development"};
            if (settings.auth.provider == "keycloak" && ! d.Exists)
            {
                foreach (var fallback_folder in fallback_folders)
                {
                    d = new DirectoryInfo($"db/keycloak/{fallback_folder}");
                    if (d.Exists)
                    {
                        Console.WriteLine("Found the path: " + d.FullName);
                        break;
                    }
                }
            }

            if (d.Exists)
            {
                var files = d.GetFiles("*.json");
                swapSimulationAndSimulationSession(files);

                foreach (var f in files)
                {
                    var collectionName = f.Name.Substring(0, f.Name.Length - 5);

                    BaseMigrator migrator = await MigratorFactory.GetMigrator(this, collectionName);
                    if (migrator != null)
                    {
                        await migrator.Migrate(f);
                    }
                }
            }
        }

        protected async Task UpdateRecordsByVersion()
        {
	        BaseUpdater updater = await RecordUpdaterFactory.GetUpdater(this);
	        if (updater != null)
	        {
		        await updater.Update();
	        }
        }

        private void EnsureIndices()
        {
            ILogger<MongoDbService> log = this._service.getLogger();
            // Create indices of tags from omdb_ui. Indicies are needed for sorting large documents. e.g. Simulations
            var omdbUi = this._database.GetCollection<BsonDocument>("omdb_ui");
            var objects = omdbUi.AsQueryable().ToArray();

            foreach (var obj in objects)
            {
                var indexes = this._database.GetCollection<BsonDocument>(obj["objectType"].ToString()).Indexes;
                var indexNameSet = indexes.List().ToList().Select(index => index["key"].ToBsonDocument().Names.First()).ToHashSet();
                BsonArray tags = obj["catalog"]["tags"].AsBsonArray;

                var keys = tags.Where(t => !indexNameSet.Contains(t.ToString())).Select(t =>
                    new CreateIndexModel<BsonDocument>(Builders<BsonDocument>.IndexKeys.Ascending(t.ToString())));
                if (keys.Any())
                {
                    indexes.CreateMany(keys);
                }
            }

            // Create indexes for Collection GridStatus
            var gridStatus = this._database.GetCollection<BsonDocument>("GridStatus");
            var gridStatusIndexes = gridStatus.Indexes.List().ToList();
            string gridStatusIndexName1 = "gridName_asc_timeStamp_asc";
            string gridStatusIndexName2 = "gridName_asc_timeStamp_desc";
            if (!gridStatusIndexes.Any(index => index["name"] == gridStatusIndexName1))
            {
                log.LogInformation($"Collection GridStatus Index {gridStatusIndexName1} doesn't exist, create it.");
                gridStatus.Indexes.CreateOne(new CreateIndexModel<BsonDocument>(
                    Builders<BsonDocument>.IndexKeys.Ascending("gridName").Ascending("timeStamp"), new CreateIndexOptions
                    {
                        Name = gridStatusIndexName1
                    }));
            }

            if (!gridStatusIndexes.Any(index => index["name"] == gridStatusIndexName2))
            {
                log.LogInformation($"Collection GridStatus Index {gridStatusIndexName2} doesn't exist, create it.");
                gridStatus.Indexes.CreateOne(new CreateIndexModel<BsonDocument>(
                    Builders<BsonDocument>.IndexKeys.Ascending("gridName").Descending("timeStamp"), new CreateIndexOptions
                    {
                        Name = gridStatusIndexName2
                    }));
            }
        }

        private void Idle()
        {
            if (this.IsEventsEnabled)
            {
                this._service.OnDbIdle?.Invoke(this);
            }
            this._isIdle = true;
        }

        private void postgresIdle()
        {
            if (this.IsEventsEnabled)
            {
                this._postgreService.OnDbIdle?.Invoke(this);
            }
            this._isIdle = true;
        }

        private void RestoreIdle()
        {
            this._isIdle = false;
            if (this.IsEventsEnabled)
            {
                this._service.OnDbRestoreIdle?.Invoke(this);
            }
        }

        private void postgresRestoreIdle()
        {
            this._isIdle = false;
            if (this.IsEventsEnabled)
            {
                this._postgreService.OnDbRestoreIdle?.Invoke(this);
            }
        }

        private void swapSimulationAndSimulationSession(FileInfo[] files)
        {
            var fileNames = files.Select(s => s.Name).ToArray();
            var simulationIndex = Array.IndexOf(fileNames, "Simulation.json");
            var simulationSessionIndex = Array.IndexOf(fileNames, "SimulationSession.json");
            var deletedSimulationIndex = Array.IndexOf(fileNames, "DeletedSimulation.json");
            var targetIndex = Math.Max(simulationIndex, deletedSimulationIndex);
            if (simulationSessionIndex < targetIndex) // only swap if simulationSession comes before simulation
            {
                var temp = files[targetIndex];
                files[targetIndex] = files[simulationSessionIndex];
                files[simulationSessionIndex] = temp;
            }
        }

        private void StartIdleCheck(DateTime lastDbUseTime)
        {
            this._service.getLogger().LogInformation($"Users of tenant '{this.TenantName}' didn't execute any actions for a long time. Turn on idle mode. Last use DB time: {lastDbUseTime}");
            this.Idle();
        }

        private void StartPostgresIdleCheck(DateTime lastDbUseTime)
        {
            this._postgreService.getLogger().LogInformation($"Users of tenant '{this.TenantName}' didn't execute any actions for a long time. Turn on idle mode. Last use DB time: {lastDbUseTime}");
            this.postgresIdle();
        }
    }
}
