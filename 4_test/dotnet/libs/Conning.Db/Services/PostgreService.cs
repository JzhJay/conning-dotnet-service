using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Options;
using System.IO;
using System.Threading.Tasks;
using Conning.Models.Notifications;
using GraphQL;
using Npgsql;
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
    public delegate void OnPostgresDbConnect(BaseDatabase database);

    public delegate void OnPostgresDbIdle(BaseDatabase db);

    public delegate void OnPostgresDbRestoreIdle(BaseDatabase db);

    public class PostgreService
    {
        IOptions<AdviseAppSettings> _settings;
        ILogger<PostgreService> _log;
        private readonly IHostingEnvironment _env;
        private ConcurrentDictionary<string, Lazy<BaseDatabase>> _databases = new ConcurrentDictionary<string, Lazy<BaseDatabase>>();
        private ConcurrentDictionary<string, Lazy<BaseDatabase>> _sqlDatabases = new ConcurrentDictionary<string, Lazy<BaseDatabase>>();
        private Lazy<UserDatabase> _userDatabase;
        private BaseUserService _userService;

        public OnPostgresDbConnect OnDbConnection { get; set; }

        public OnPostgresDbIdle OnDbIdle { get; set; }

        public OnPostgresDbRestoreIdle OnDbRestoreIdle { get; set; }

        public bool IsMultiTenant { get; private set; }

        public bool IsAutoIdleTenant  { get; private set; }

        public int IdleTimeoutMS  { get; private set; }

        public PostgreService(IOptions<AdviseAppSettings> settings, ILogger<PostgreService> log, IHostingEnvironment env, BaseUserService userService)
        {
            _settings = settings;
            _log = log;
            _env = env;
            _userService = userService;
            IsAutoIdleTenant = this.settings.postgres.autoIdleTenant ?? false;
            IdleTimeoutMS = this.settings.postgres.idleTimeoutMS ?? 7200000;
            IsMultiTenant = this.settings.multiTenant;
            
            _userDatabase = new Lazy<UserDatabase>(() => new UserDatabase(this, this.settings.auth.tenant));
            _userService.SetPostgreService(this);
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

        public NpgsqlConnection sqlDatabase
        {
            get
            {
                // Create and cache database connection
                return this.GetPostgresByTenant(this.getCurrentTenant());
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

        public NpgsqlConnection[] activeDatabases
        {
            get
            {
                return _databases.Values.Select((baseDatabase) => baseDatabase.Value.GetPostgres()).ToArray();
            }
        }

        public ILogger<PostgreService> getLogger()
        {
            return this._log;
        }

        public AdviseAppSettings getAppSettings()
        {
            return this.settings;
        }

        private AdviseAppSettings settings
        {
            get { return _settings.Value; }
        }

        public bool IsUserOperateDb()
        {
            string tenant = _userService.GetCurrentTenant();
            return !String.IsNullOrEmpty(tenant);
        }

        public NpgsqlConnection GetPostgresByTenant(string tenantKey)
        {
            return _databases.GetOrAdd(tenantKey ?? "",
                key => new Lazy<BaseDatabase>(() =>
                    String.IsNullOrEmpty(key) ? new BaseDatabase(this, key) : new TenantDatabase(this, key)
                )).Value.GetPostgres();
        }
        
        public NpgsqlConnection GetUserPostgres()
        {
            return _userDatabase.Value.GetPostgres();
        }
        
        public BaseDatabase GetBaseDatabaseByTenant(string tenantKey)
        {
            return _databases.GetOrAdd(tenantKey,
                key => new Lazy<BaseDatabase>(() =>
                    String.IsNullOrEmpty(key) ? new BaseDatabase(this, key) : new TenantDatabase(this, key)
                )).Value;
        }
    }
}
