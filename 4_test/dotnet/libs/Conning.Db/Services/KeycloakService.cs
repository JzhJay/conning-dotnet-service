using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Auth0.Core.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Conning.Db.Services
{
    public class KeycloakAttributes
    {
        public bool UserInitialized { get; set; }
        public List<string> Permission { get; set; }
        public List<string> Tenant { get; set; }
    }
    
    public class KeycloakUser
    {
        public string Id { get; set; }
        public string Username { get; set; }
        
        public string FirstName { get; set; }
        
        public string LastName { get; set; }
        
        public string Gender { get; set; }
        
        public string PhoneNumber { get; set; }
        
        public string Picture { get; set; }
        public bool Enabled { get; set; }
        public bool Totp { get; set; }
        public String Email { get; set; }
        public bool EmailVerified { get; set; }
        public KeycloakAttributes Attributes { get; set; }
        
        public dynamic UserMetadata { get; set; }
        
        public DateTime CreatedTimestamp { get; set; }
        
        public DateTime LastAccess { get; set; }
    }

    public class KeycloakService : BaseUserService
    {
        private ILogger<KeycloakService> _log;

        private string _accessToken;

        private DateTime _accessTokenExpiration;

        private JwtSecurityTokenHandler _jsonSecurityTokenHandler = new JwtSecurityTokenHandler();

        private string _adminRestApiUrl;

        private string _licenseRestApiUrl;

        private bool _ignoreSslCertCheck;

        private readonly string _licenseCacheKey = "conning_license_cache_key";
        
        public KeycloakService(ILogger<KeycloakService> log, IOptions<AdviseAppSettings> settings, IMemoryCache cache,
            IHttpContextAccessor httpContextAccessor) :
            base(log, settings, cache, httpContextAccessor)
        {
            
            _log = log;
            _adminRestApiUrl = $"https://{GetAppSettings().auth.domain.Replace("realms", "admin/realms")}";
            _licenseRestApiUrl = $"https://{GetAppSettings().auth.domain}/advise-license-rest/license";
            _ignoreSslCertCheck = settings.Value.auth.ignoreSslCertCheck;
        }

        public override void Start(IServiceProvider appServices)
        {
            var task = GetLicense();
            task.Wait();
        }

        public override string GetCurrentTenant()
        {
            // if multi-tenant is off, always use empty tenant.
            if (!IsMultiTenant())
            {
                return "";
            }

            var user = GetHttpContext().HttpContext?.User; //(ClaimsPrincipal)Thread.CurrentPrincipal;
            var tenant = user?.Claims.Where(c =>
                    c.Type == OpenIDConnectSettings.GROUPS_CLAIM && c.Value.StartsWith(OpenIDConnectSettings.TENANT_ID))
                .Select(c => c.Value.Substring(OpenIDConnectSettings.TENANT_ID.Length)).SingleOrDefault();

            return tenant;
        }

        public override string GetUserTenant(ConningUser user)
        {
            // if multi-tenant is off, always use empty tenant.
            if (!IsMultiTenant())
            {
                return "";
            }

            var groups = user.AppMetadata?.authorization?.groups as List<string>;
            string tenant = "";
            if (groups != null)
            {
                tenant = groups.Where(g => g.StartsWith(OpenIDConnectSettings.TENANT_ID))
                    .Select(g => g.Substring(OpenIDConnectSettings.TENANT_ID.Length)).SingleOrDefault();
            }

            return tenant;
        }

        public async Task<HttpClient> GetKeycloakHttpClient()
        {
            if (DateTime.Now > _accessTokenExpiration)
            {
                AdviseAppSettings settings = GetAppSettings();
                string domain = settings.auth.domain;
                string restClientId = settings.auth.restClientId;
                string restSecret = settings.auth.restSecret;
                var data = new Dictionary<string, string>()
                {
                    { "client_id", restClientId },
                    { "client_secret", restSecret },
                    { "grant_type", "client_credentials" }
                };

                HttpClient client = GetHttpClient();
                var response = await client.PostAsync($"https://{domain}/protocol/openid-connect/token",
                    new FormUrlEncodedContent(data));
                response.EnsureSuccessStatusCode();
                var jwt = JObject.Parse(await response.Content.ReadAsStringAsync());
                _accessToken = jwt["access_token"].ToString();
                var parsedJwt = _jsonSecurityTokenHandler.ReadJwtToken(_accessToken);
                _accessTokenExpiration = parsedJwt.ValidTo;
            }

            HttpClient keycloakHttpClient = GetHttpClient();
            keycloakHttpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_accessToken}");

            return keycloakHttpClient;
        }

        public override async Task<ConningUser> GetUserAsync(string userId, bool renew = false)
        {
            if (renew)
                GetCache().Remove(userId);

            return await GetCache().GetOrCreateAsync(userId, async entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromMinutes(1);

                int retries = 3;
                while (true)
                {
                    try
                    {
                        return await GetUserEnsureFullName(userId);
                    }
                    catch (ApiException e)
                    {

                        if (e.StatusCode == HttpStatusCode.NotFound)
                            return null;
                        else if (--retries == 0)
                        {
                            GetLogger().LogError(e.ToString());
                            throw;
                        }
                        else
                            await Task.Delay(50);
                    }
                }
            });
        }

        private async Task<ConningUser> GetUserEnsureFullName(string userId)
        {
            var httpClient = await GetKeycloakHttpClient();
            var requestUrl = $"{_adminRestApiUrl}/users/{userId}";
            var response = await httpClient.GetAsync(requestUrl);
            var keycloakUser = await GetJsonResult(response);
            var keycloakUserSessions = await GetUserSessions(httpClient, userId);
            dynamic preference = new ExpandoObject();

            IMongoCollection<dynamic> userCollection = GetUsersCollection();
            var result = (await userCollection.FindAsync(Builders<dynamic>.Filter.Eq("user_id", userId))).ToList();
            if (result.Any())
            {
                preference = result.First().preference;
                if (preference != null)
                {
                    preference = JObject.FromObject(preference);
                }
            }

            return NormalizeUser(CreateKeycloakUser((JObject)keycloakUser, keycloakUserSessions, preference));
        }

        public override async Task UnverifyUserEmail(String email)
        {
            var httpClient = await GetKeycloakHttpClient();
            var requestUrl = $"{_adminRestApiUrl}/users?email={email}";
            var response = await httpClient.GetAsync(requestUrl);
            var allKeycloakUsersJson = await response.Content.ReadAsStringAsync();
            var allKeycloakUsers = JArray.Parse(allKeycloakUsersJson);
            var unverifyUserEmailPayload = new StringContent(new JObject()
            {
                { "emailVerified", true }
            }.ToString(), Encoding.UTF8, "application/json");

            foreach (var keycloakUser in allKeycloakUsers)
            {
                string id = keycloakUser["id"].ToString();
                string updateUserRequestUrl = $"{_adminRestApiUrl}/users/{id}";
                await httpClient.PutAsync(updateUserRequestUrl, unverifyUserEmailPayload);
            }
        }

        public override async Task<IDictionary<string, ConningUser>> GetUsers(IEnumerable<string> userIds)
        {
            var result = new Dictionary<string, ConningUser>();

            HttpClient client = null;

            // Todo - this is a very slow way of looking up users
            // Instead periodically refresh the user list into a cache behind the scenes and then directly look things up there.
            foreach (var id in userIds)
            {
                if (!result.ContainsKey(id))
                {
                    var user = await GetCache().GetOrCreateAsync(id, async entry =>
                    {
                        if (client == null)
                        {
                            client = await GetKeycloakHttpClient();
                        }

                        entry.SlidingExpiration = TimeSpan.FromMinutes(1);
                        try
                        {
                            return await GetUserEnsureFullName(id);
                        }
                        catch (ApiException e)
                        {
                            GetLogger().LogError($"Unable to find user id '{HttpUtility.UrlEncode(id)}'.");
                            //_log.LogError(e.ToString());
                            return null;
                        }
                    });

                    if (user != null)
                    {
                        result[id] = user;
                    }
                }
            }

            if (IsMultiTenant())
            {
                return result.Where(u => GetUserTenant(u.Value) == GetCurrentTenant())
                    .ToDictionary(u => u.Key, u => u.Value);
            }

            return result;
        }

        public override async Task<List<ConningUser>> GetAllUsers(int? page = null, int? perPage = null,
            bool? includeTotals = null, string sortBy = null, bool sameTenantOnly = true)
        {
            // TODO: Not sure how to deal with sortBy in Keycloak
            var client = await GetKeycloakHttpClient();
            bool isError = false;
            IObservable<List<ConningUser>> allUsersObservable = Observable
                .Create<List<ConningUser>>(async o =>
                {
                    if (isError)
                    {
                        await Task.Delay(TimeSpan.FromSeconds(2));
                    }

                    string requestUrl = $"{_adminRestApiUrl}/users";
                    if (page != null && perPage != null)
                    {
                        requestUrl = $"{requestUrl}?first={page}&max={perPage}";
                    }

                    var responses = await client.GetAsync(requestUrl);
                    var allKeycloakUsers = (JArray)await GetJsonResult(responses);
                    var allUsers = new List<ConningUser>();
                    var emptyPreferenece = new ExpandoObject();
                    foreach (var keycloakUser in allKeycloakUsers)
                    {
                        string userId = keycloakUser["id"].ToString();
                        var userSession = await GetUserSessions(client, userId);
                        allUsers.Add(NormalizeUser(CreateKeycloakUser((JObject)keycloakUser, userSession,
                            emptyPreferenece)));
                    }

                    // filter users by tenant
                    if (sameTenantOnly && IsMultiTenant())
                    {
                        o.OnNext(allUsers.Where(u => u.Tenant == GetCurrentTenant()).ToList());
                    }
                    else
                    {
                        o.OnNext(allUsers.ToList());
                    }

                    o.OnCompleted();
                })
                .Catch((Exception e) =>
                {
                    isError = true;
                    GetLogger().LogError($"Unable to get all users: {e.ToString()}");
                    return Observable.Throw<List<ConningUser>>(e);
                })
                .Retry(3)
                .Catch((Exception e) => Observable.Return(new List<ConningUser>()));

            return await allUsersObservable.ToTask();
        }

        public override string GetUserPhone(ConningUser user)
        {
            return user.UserMetadata["ui"]["notifications"]["endpoints"]["phone"]["phoneNumber"];
        }

        public override NotificationSettings GetUserNotificationSettings(ConningUser user)
        {
            return JsonConvert.DeserializeObject<NotificationSettings>(
                user.UserMetadata["ui"]["notifications"]["endpoints"].ToString());
        }

        public override async Task InitializeUser(String userId)
        {
            var client = await GetKeycloakHttpClient();
            var requestUrl = $"{_adminRestApiUrl}/users/{userId}";
            var userResponse = await client.GetAsync(requestUrl);
            var keycloakUserJson = await userResponse.Content.ReadAsStringAsync();
            var keycloakUser = JObject.Parse(keycloakUserJson);
            var currentAttributes = keycloakUser["attributes"];
            currentAttributes["userInitialized"] = true;

            var requestPayload = new StringContent(new JObject() { { "attributes", currentAttributes } }.ToString(),
                Encoding.UTF8, "application/json");
            await client.PutAsync(requestUrl, requestPayload);
        }

        public override async Task UpdateUserPreference(String userId, JObject userPreference)
        {
            var updateFields = new BsonDocument()
            {
                { "user_id", userId },
                { "preference", BsonDocument.Parse(userPreference.ToString()) }
            };

            IMongoCollection<dynamic> userCollection = this.GetUsersCollection();
            await userCollection.UpdateOneAsync(Builders<dynamic>.Filter.Eq("user_id", userId),
                new BsonDocument(
                    "$set",
                    updateFields
                ),
                new UpdateOptions { IsUpsert = true });

            GetCache().Remove(userId);
        }

        private KeycloakUser CreateKeycloakUser(JObject keycloakUser, JArray userSessions, dynamic userMetadata)
        {
            KeycloakAttributes attributes = new KeycloakAttributes()
            {
                UserInitialized = false,
                Permission = new List<string>(),
                Tenant = new List<string>()
            };

            var keycloakUserAttributes = keycloakUser["attributes"];
            if (keycloakUserAttributes != null)
            {
                if (keycloakUserAttributes["userInitialized"] != null)
                {
                    attributes.UserInitialized =
                        Boolean.Parse(keycloakUserAttributes["userInitialized"].First().ToString());
                }

                if (keycloakUserAttributes["permission"] != null)
                {
                    attributes.Permission = keycloakUserAttributes["permission"].ToObject<List<string>>();
                }

                if (keycloakUserAttributes["tenant"] != null)
                {
                    attributes.Tenant = keycloakUserAttributes["tenant"].ToObject<List<string>>();
                }
            }

            var createdTimestamp = GetDateTimeFromMilliseconds(keycloakUser["createdTimestamp"].ToString());

            return new KeycloakUser()
            {
                Id = keycloakUser["id"].ToString(),
                CreatedTimestamp = createdTimestamp,
                LastAccess = userSessions.Any()
                    ? GetDateTimeFromMilliseconds(userSessions.First()["lastAccess"].ToString())
                    : createdTimestamp,
                Username = keycloakUser["username"].ToString(),
                FirstName = keycloakUser["firstName"] != null ? keycloakUser["firstName"].ToString() : "",
                LastName = keycloakUser["lastName"] != null ? keycloakUser["lastName"].ToString() : "",
                Gender = keycloakUser["gender"] != null ? keycloakUser["gender"].ToString() : "",
                PhoneNumber = keycloakUser["phone_number"] != null ? keycloakUser["phone_number"].ToString() : "",
                Picture = keycloakUser["picture"] != null ? keycloakUser["picture"].ToString() : "",
                Enabled = Boolean.Parse(keycloakUser["enabled"].ToString()),
                Totp = Boolean.Parse(keycloakUser["totp"].ToString()),
                Email = keycloakUser["email"].ToString(),
                EmailVerified = Boolean.Parse(keycloakUser["emailVerified"].ToString()),
                Attributes = attributes,
                UserMetadata = userMetadata
            };
        }

        private ConningUser NormalizeUser(KeycloakUser keycloakUser)
        {
            dynamic appMetadata = new ExpandoObject();
            appMetadata.userInitialized = keycloakUser.Attributes.UserInitialized;
            appMetadata.authorization = new ExpandoObject();
            appMetadata.authorization.groups = keycloakUser.Attributes.Tenant;
            appMetadata.authorization.permissions = keycloakUser.Attributes.Permission;

            return new ConningUser()
            {
                Sub = keycloakUser.Id,
                Name = keycloakUser.Username,
                GivenName = keycloakUser.FirstName,
                FamilyName = keycloakUser.LastName,
                FullName = $"{keycloakUser.FirstName} {keycloakUser.LastName}",
                Email = keycloakUser.Email,
                EmailVerified = keycloakUser.EmailVerified,
                Picture = keycloakUser.Picture,
                Gender = keycloakUser.Gender,
                Locale = "",
                PhoneNumber = keycloakUser.PhoneNumber,
                PhoneVerified = true,
                Blocked = !keycloakUser.Enabled,
                LastLogin = keycloakUser.LastAccess,
                CreatedAt = keycloakUser.CreatedTimestamp,
                UpdatedAt = keycloakUser.LastAccess,
                Tenant = keycloakUser.Attributes.Tenant.Any() ? keycloakUser.Attributes.Tenant.First() : "",
                AppMetadata = appMetadata,
                UserMetadata = keycloakUser.UserMetadata
            };
        }

        public override ConningUser AttachCurrentUserAuthorizationToUser(ConningUser user)
        {
            var authorization = GetCurrentUserAuthorization();
            var appMetadata = (user.AppMetadata ?? new ExpandoObject()) as IDictionary<string, object>;
            foreach (var keyValue in authorization)
            {
                appMetadata[keyValue.Key] = keyValue.Value;
            }

            user.AppMetadata = appMetadata;
            return user;
        }
        
        public override ClaimsPrincipal ValidateJWT(string token)
        {
            string domain = GetAppSettings().auth.domain;
            var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                $"https://{domain}/.well-known/openid-configuration",
                new OpenIdConnectConfigurationRetriever(),
                new HttpDocumentRetriever(GetHttpClient()));

            var discoveryDocument = configurationManager.GetConfigurationAsync().Result;
            var signingKeys = discoveryDocument.SigningKeys;
            
            string issuerDomain = domain;
            if (domain.StartsWith("keycloak-helm"))
            {
                // Inside the cluster the domain to get the openid-configuration is different
                // from the domain issuer...
                issuerDomain = GetAppSettings().auth.issuerDomain;;
            }
            return _jsonSecurityTokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                RequireSignedTokens = true,
                ValidIssuer = $"https://{issuerDomain}",
                IssuerSigningKeys = signingKeys,
                ValidateAudience = false,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false
            }, out SecurityToken validatedToken);
        }
        
        private HttpClient GetHttpClient() 
        {
            if (_ignoreSslCertCheck)
            {
                return new HttpClient(new HttpClientHandler()
                {
                    ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) => true
                });
            }

            return new HttpClient();
        }

        private DateTime GetDateTimeFromMilliseconds(string timestamp)
        {
            return (new DateTime(1970, 1, 1)).AddMilliseconds(double.Parse(timestamp));
        }

        private async Task<JArray> GetUserSessions(HttpClient httpClient, string userId)
        {
            var sessionsRequestUrl = $"{_adminRestApiUrl}/users/{userId}/sessions"; 
            var sessionsResponse = await httpClient.GetAsync(sessionsRequestUrl);
            return (JArray) await GetJsonResult(sessionsResponse);
        }

        private async Task<JToken> GetJsonResult(HttpResponseMessage response)
        {
            response.EnsureSuccessStatusCode();
            if (response.Content.Headers.ContentType.MediaType == "application/json")
            {
                string json = await response.Content.ReadAsStringAsync();
                return JToken.Parse(json);
            }
            
            throw new Exception($"HTTP Response {response.StatusCode.ToString()} from {response.RequestMessage.RequestUri.ToString()} was invalid and cannot be deserializable.");
        }

        
        public override async Task<License> GetLicense(bool forceRefresh = false)
        {
            if (forceRefresh)
            {
                GetCache().Remove(_licenseCacheKey);
            }
            
            if (!GetCache().TryGetValue(_licenseCacheKey, out License result))
            {
                try
                {
                    var httpClient = await GetKeycloakHttpClient();
                    var response = await httpClient.GetAsync(this._licenseRestApiUrl);
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        var licenseJson = await response.Content.ReadAsStringAsync();
                        var license = JObject.Parse(licenseJson);
                        var product = license["product"].ToString();
                        var customer = license["customer"].ToString();
                        var start = license["start"].ToObject<long>();
                        var exp = license["exp"].ToObject<long>();

                        var auth = GetAppSettings().auth;
                        auth.license.product = product;
                        auth.license.customer = customer;
                        auth.license.startMilliseconds = start;
                        auth.license.expMilliseconds = exp;
                        auth.license.start = FormatDateTimeMilliseconds(start);
                        auth.license.exp = FormatDateTimeMilliseconds(exp);
                        return auth.license;
                    }
                }
                catch (Exception e)
                {
                    _log.LogError("Cannot get license information, keycloak service mayn't start correctly: {0}", e.Message);
                }
            }

            return result;
        }
        
        
        private String FormatDateTimeMilliseconds(long dateTimeMilliseconds)
        {
            TimeSpan timeSpan = TimeSpan.FromMilliseconds(dateTimeMilliseconds);
            return new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).Add(timeSpan).ToString();
        }
    }
}