using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;

namespace Conning.Db.Services
{
    public class EndpointSettings
    {
        public bool enabled { get; set; }
    }

    public class NotificationSettings
    {
        public EndpointSettings phone { get; set; }
        public EndpointSettings email { get; set; }
        public EndpointSettings desktop { get; set; }
    }

    public class OpenIDConnectSettings
    {
        public static string GROUPS_CLAIM = "https://advise.conning.com/groups";
        public static string CUSTOM_CLAIM = "https://advise.conning.com/custom";
        public static string TENANT_ID = "tenant:";
        // default JWT handler map "sub" to ClaimTypes.NameIdentifier
        public static string IDENTITY_CLAIM = ClaimTypes.NameIdentifier;
    }
    
    public class ConningUser
    {
        public string Sub { get; set; }

        public string Email { get; set; }
        public bool EmailVerified { get; set; }
        
        public string Name { get; set; }
        
        public string GivenName { get; set; }
        
        public string FamilyName { get; set; }

        public string FullName { get; set; }

        public string Picture { get; set; }
        
        public string Gender { get; set; }
        
        public string Locale { get; set; }

        public string PhoneNumber { get; set; }
        
        public bool PhoneVerified { get; set; }

        public bool Blocked { get; set; }

        public DateTime LastLogin { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }

        public string Tenant { get; set; }
        
        public dynamic AppMetadata { get; set; }

        public dynamic UserMetadata { get; set; }
    }
    
    abstract public class BaseUserService
    {
        public const string UserBatchLoader = "UserBatchLoader";
        private readonly IOptions<AdviseAppSettings> _settings;
        private readonly IMemoryCache _cache;
        private ILogger<BaseUserService> _log;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private MongoDbService _mongo;
        private bool _isMultiTenant;
        
        
        public BaseUserService(ILogger<BaseUserService> log, IOptions<AdviseAppSettings> settings, IMemoryCache cache, IHttpContextAccessor httpContextAccessor)
        {
            _log = log;
            _settings = settings;
            _cache = cache;
            _httpContextAccessor = httpContextAccessor;
            _isMultiTenant = settings.Value.multiTenant;
        }

        public IHttpContextAccessor GetHttpContext()
        {
            return _httpContextAccessor;
        }

        public bool IsMultiTenant()
        {
            return this._isMultiTenant;
        }
        
        public IMemoryCache GetCache()
        {
            return this._cache;
        }
        
        public ILogger<BaseUserService> GetLogger()
        {
            return this._log;
        }
        
        public AdviseAppSettings GetAppSettings()
        {
            return _settings.Value;
        }
        
        public void SetMongoDbService(MongoDbService mongo)
        {
            this._mongo = mongo;
        }

        public String GetCurrentUserId()
        {
            var user = GetHttpContext().HttpContext?.User;
            return user?.Claims.FirstOrDefault(c => c.Type == OpenIDConnectSettings.IDENTITY_CLAIM)?.Value ?? "";
        }
        
        public abstract void Start(IServiceProvider appServices);
        
        public abstract string GetCurrentTenant();

        public abstract string GetUserTenant(ConningUser user);

        public abstract Task<IDictionary<string, ConningUser>> GetUsers(IEnumerable<string> userIds);

        public abstract Task<List<ConningUser>> GetAllUsers(int? page = null, int? perPage = null,
            bool? includeTotals = null, string sortBy = null, bool sameTenantOnly = true);

        public abstract string GetUserPhone(ConningUser user);

        public abstract NotificationSettings GetUserNotificationSettings(ConningUser user);

        public abstract Task<ConningUser> GetUserAsync(string userId, bool renew = false);

        public abstract Task UnverifyUserEmail(String email);

        public abstract Task InitializeUser(String userId);

        public abstract Task UpdateUserPreference(String userId, JObject userPreference);

        public abstract ClaimsPrincipal ValidateJWT(string token);

        public abstract ConningUser AttachCurrentUserAuthorizationToUser(ConningUser user);

        public abstract Task<License> GetLicense(bool forceRefresh = false);
        
        protected IMongoCollection<dynamic> GetUsersCollection()
        {
            IMongoDatabase db = _mongo.GetUserMongoDb();
            return db.GetCollection<dynamic>(MongoCollections.users);
        }
        
        public JObject GetCurrentUserAuthorization()
        {
            var user = GetHttpContext().HttpContext?.User;
            if (user != null)
            {
                var claim = user.FindFirst(c => c.Type == OpenIDConnectSettings.CUSTOM_CLAIM);
                if (claim != null)
                {
                    return JObject.Parse(claim.Value);
                }
            }

            return new JObject();
        }
    
        public IEnumerable<string> GetCurrentUserPermissions()
        {
            var claim = GetCurrentUserAuthorization();
            if (claim != null)
            {
                if (claim.ContainsKey("authorization"))
                {
                    var authorization = claim["authorization"].Value<JObject>();
                    if (authorization.ContainsKey("permissions"))
                    {
                        return authorization["permissions"].Value<JArray>().Select((value) => value.ToString());
                    }
                }
            }

            return Enumerable.Empty<string>();
        }
    }
}