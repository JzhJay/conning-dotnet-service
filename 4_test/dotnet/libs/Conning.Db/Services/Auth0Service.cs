using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Auth0.AuthenticationApi;
using Auth0.AuthenticationApi.Models;
using Auth0.Core.Collections;
using Auth0.Core.Exceptions;
using Auth0.ManagementApi;
using Auth0.ManagementApi.Models;
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
    public class Auth0Service : BaseUserService
    {
        private CancellationToken _watchSyncUserMetadataToken;

        private ManagementApiClient _managementClient { get; set; }
        
        private DateTime _managementTokenExpiration;
        
        private JwtSecurityTokenHandler _jsonSecurityTokenHandler  = new JwtSecurityTokenHandler();
        
        public Auth0Service(ILogger<Auth0Service> log, IOptions<AdviseAppSettings> settings, IMemoryCache cache, IHttpContextAccessor httpContextAccessor): 
            base(log, settings, cache, httpContextAccessor)
        {
        }
        
        public override void Start(IServiceProvider appServices)
        {
            if (GetAppSettings().auth.isSyncUserData)
            {
                Task.Run(() =>
                {
                    this._watchSyncUserMetadataToken = new CancellationToken();
                    this.SyncUserPreferenceToMongo();
                }, this._watchSyncUserMetadataToken);
            }
        }
        
        public override string GetCurrentTenant()
        {
            // if multi-tenant is off, always use empty tenant.
            if (!IsMultiTenant())
            {
                return "";
            }
            
            var user = GetHttpContext().HttpContext?.User; //(ClaimsPrincipal)Thread.CurrentPrincipal;
            var tenant = user?.Claims.Where(c => c.Type == OpenIDConnectSettings.GROUPS_CLAIM && c.Value.StartsWith(OpenIDConnectSettings.TENANT_ID))
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

            return user.AppMetadata?.authorization?.groups != null ? (user.AppMetadata.authorization.groups as JArray).Where(g => ((string) g).StartsWith(OpenIDConnectSettings.TENANT_ID)).Select(g =>
                ((string)g).Substring(OpenIDConnectSettings.TENANT_ID.Length)).SingleOrDefault() : null;
        }
        
        public string GetUserTenant(User auth0User)
        {
            // if multi-tenant is off, always use empty tenant.
            if (!IsMultiTenant())
            {
                return "";
            }

            return auth0User.AppMetadata?.authorization?.groups != null ? (auth0User.AppMetadata.authorization.groups as JArray).Where(g => ((string) g).StartsWith(OpenIDConnectSettings.TENANT_ID)).Select(g =>
                ((string)g).Substring(OpenIDConnectSettings.TENANT_ID.Length)).SingleOrDefault() : null;
        }
        
        public async Task<ManagementApiClient> GetManagementClient()
        {
            if (DateTime.Now > _managementTokenExpiration)
            {
                AdviseAppSettings settings = GetAppSettings();           
                var authenticationApiClient = new AuthenticationApiClient(settings.auth.domain);
                
                // Get the access token
                var token = await authenticationApiClient.GetTokenAsync(new ClientCredentialsTokenRequest
                {
                    ClientId = settings.auth.restClientId,
                    ClientSecret = settings.auth.restSecret,
                    Audience = $"https://{settings.auth.domain}/api/v2/"
                });

                _managementTokenExpiration = DateTime.Now.AddSeconds(token.ExpiresIn);
                _managementClient = new ManagementApiClient(token.AccessToken, new Uri($"https://{settings.auth.domain}/api/v2"));
            }

            return _managementClient;
        }

        public override async Task<ConningUser> GetUserAsync(string userId, bool renew = false)
        {
            if (renew)
                GetCache().Remove(userId);
            
            return await GetCache().GetOrCreateAsync<ConningUser>(userId, async entry =>
            {
                var client = await GetManagementClient();
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
            var client = await GetManagementClient();
            User auth0User;
            IMongoCollection<dynamic> userCollection = GetUsersCollection();
            var result = (await userCollection.FindAsync(Builders<dynamic>.Filter.Eq("user_id", userId))).ToList();
            if (result.Any())
            {
                string fields =
                    "phone_number,email,email_verified,picture,username,user_id,name,nickname,created_at,identities,app_metadata,last_ip,last_login,logins_count,updated_at,blocked,family_name,given_name";
                auth0User = await client.Users.GetAsync(userId, fields); // exclude field user_metadata in auth0 profile
                var preference = result.First().preference;
                auth0User.UserMetadata = preference != null ? JObject.FromObject(preference) : null;
            }
            else
            {
                auth0User = await client.Users.GetAsync(userId);
            }

            ConningUser user = NormalizeUser(auth0User);
            return EnsureFullName(user);
        }

        public override async Task UnverifyUserEmail(String email)
        {
            var client = await GetManagementClient();
            var user = (await client.Users.GetUsersByEmailAsync(email)).First();
            await client.Users.UpdateAsync(user.UserId, new UserUpdateRequest {EmailVerified = true});
        }

        public override async Task<IDictionary<string, ConningUser>> GetUsers(IEnumerable<string> userIds)
        {
            var result = new Dictionary<string, ConningUser>();

            ManagementApiClient client = null;

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
                            client = await GetManagementClient();
                        }

                        entry.SlidingExpiration = TimeSpan.FromMinutes(1);
                        try
                        {
                            return await GetUserEnsureFullName(id);
                        }
                        catch (ApiException e)
                        {
                            GetLogger().LogError($"Unable to find user id '{id}'.");
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

        public override async Task<List<ConningUser>> GetAllUsers(int? page = null, int? perPage = null, bool? includeTotals = null, string sortBy = null, bool sameTenantOnly = true )
        {
            var client = await GetManagementClient();
            bool isError = false;
            IObservable<List<ConningUser>> allUsersObservable = Observable
                .Create<List<ConningUser>>(async o =>
                {
                    if (isError)
                    { 
                        await Task.Delay(TimeSpan.FromSeconds(2));
                    }

                    IPagedList<User> allAuth0Users = null;

                    if (page != null)
                    {
                         allAuth0Users = await client.Users.GetAllAsync(page, perPage, includeTotals, sortBy);
                    }
                    else
                    {
                         allAuth0Users = await this.GetAuth0AllUsers(client);
                    }

					var allUsers = allAuth0Users.Select(this.NormalizeUser);

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

        private async Task<IPagedList<User>> GetAuth0AllUsers(ManagementApiClient client)
        {
            IPagedList<User> allUsers = await client.Users.GetAllAsync(page: 0, includeTotals: true);
            int totalCount = allUsers.Paging.Total;
            int retrievedCount = allUsers.Count;
            int currentPageNumber = 0;
            while (retrievedCount < totalCount)
            {
                currentPageNumber += 1;
                var partialUsers = await client.Users.GetAllAsync(page: currentPageNumber, includeTotals: true);
                foreach(var user in partialUsers)
                {
                    allUsers.Add(user);
                }
                
                retrievedCount += partialUsers.Count;
            }
            
            return allUsers;
        }
        
        public ConningUser EnsureFullName(ConningUser user)
        {
            if (user.UserMetadata?.name != null)
                user.FullName = user.UserMetadata.name;
            
            return user;
        }

        public override string GetUserPhone(ConningUser user)
        {
            return user.UserMetadata["ui"]["notifications"]["endpoints"]["phone"]["phoneNumber"];
        }

        public override NotificationSettings GetUserNotificationSettings(ConningUser user)
        {
            return JsonConvert.DeserializeObject<NotificationSettings>(user.UserMetadata["ui"]["notifications"]["endpoints"].ToString());
        }

        public override async Task InitializeUser(String userId)
        {
            var client = await GetManagementClient();
            dynamic appMetadata = new ExpandoObject();
            appMetadata.userInitialized = true;
            await client.Users.UpdateAsync(userId, new UserUpdateRequest
            {
                AppMetadata = appMetadata
            });
        }

        public override async Task UpdateUserPreference(String userId, JObject userPreference)
        {
            if (!GetAppSettings().isTestingEnvironment)
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
            else
            {
                var user = await this.GetUserAsync(userId, renew: true);
                user.UserMetadata = userPreference;
            }
        }

        private async Task SyncUserPreferenceToMongo()
        {
            GetLogger().LogInformation($"Regularly sync userMetadata fro auth0 every {GetAppSettings().auth.syncIntervalMilliseconds} millisecond");
            while (true)
            {
                try
                {
                    List<ConningUser> users = await this.GetAllUsers(sameTenantOnly: false);
                    IMongoCollection<dynamic> collection = this.GetUsersCollection();
                    int totalUserCount = users.Count;
                    int bulkSize = 100;
                    int totalPageNumber = (int) Math.Ceiling(Decimal.Divide(totalUserCount, bulkSize));
                    for (int i = 0; i < totalPageNumber; i++)
                    {
                        int start = i * bulkSize;
                        int end = (i + 1)*bulkSize;
                        if (end > totalUserCount)
                        {
                            end = totalUserCount;
                        }
                        
                        var listWrites= new List<UpdateOneModel<dynamic>>();
                        
                        for (int j = start; j < end; j++)
                        {
                            var user = users[j];
                            BsonDocument userDocument = BsonDocument.Parse(JsonConvert.SerializeObject(user));
                            var userMetadata = userDocument["UserMetadata"];
                            userDocument.Remove("UserMetadata");
                            var updateDefinition = new BsonDocument()
                            {
                                {"$setOnInsert", new BsonDocument("preference", userMetadata)},
                                {"$set", userDocument }
                            };
                            
                            listWrites.Add(
                                new UpdateOneModel<dynamic>(Builders<dynamic>.Filter.Eq("user_id", user.Sub), updateDefinition)
                            {
                                IsUpsert = true
                            });
                        }
                        
                        await collection.BulkWriteAsync(listWrites, new BulkWriteOptions(){ IsOrdered = false }, this._watchSyncUserMetadataToken);
                    }
                }
                catch (Exception e)
                {
                    GetLogger().LogError($"Sync userMetadata from Auth0 to MongoDb failed: {e.Message} {e.StackTrace}");
                }
                finally
                {
                    await Task.Delay(GetAppSettings().auth.syncIntervalMilliseconds, this._watchSyncUserMetadataToken);
                }
            }
        }

        private ConningUser NormalizeUser(User auth0User)
        {
            return new ConningUser()
            {
                Sub = auth0User.UserId,
                Name = auth0User.FullName,
                GivenName = auth0User.FirstName,
                FamilyName = auth0User.LastName,
                FullName = auth0User.FullName,
                Email = auth0User.Email,
                EmailVerified = auth0User.EmailVerified == true,
                Picture = auth0User.Picture,
                Gender = "",
                Locale = auth0User.Locale,
                PhoneNumber = auth0User.PhoneNumber,
                PhoneVerified = auth0User.PhoneVerified,
                Blocked = auth0User.Blocked,
                LastLogin = auth0User.LastLogin,
                CreatedAt = auth0User.CreatedAt,
                UpdatedAt = auth0User.UpdatedAt,
                Tenant = GetUserTenant(auth0User),
                AppMetadata = auth0User.AppMetadata,
                UserMetadata = auth0User.UserMetadata
            };
        }

        public override ClaimsPrincipal ValidateJWT(string token)
        {
            var domain = this.GetAppSettings().auth.domain;
            var authDomain = $"https://{domain}/";
            var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                $"{authDomain}.well-known/openid-configuration",
                new OpenIdConnectConfigurationRetriever(),
                new HttpDocumentRetriever());

            var discoveryDocument = configurationManager.GetConfigurationAsync().Result;
            var signingKeys = discoveryDocument.SigningKeys;

            return _jsonSecurityTokenHandler.ValidateToken(token, new TokenValidationParameters()
            {
                IssuerSigningKeys = signingKeys,
                RequireSignedTokens = true,
                ValidateAudience = true,
                ValidAudience = "https://kui/api",
                ValidateIssuer =  true,
                ValidIssuer = authDomain,
                ValidateIssuerSigningKey = true // verify that the key used to sign the incoming token is part of a list of trusted keys (Only for embedded keys)
            }, out SecurityToken validatedToken);
        }
        
        public override ConningUser AttachCurrentUserAuthorizationToUser(ConningUser user)
        {
            var authorization = GetCurrentUserAuthorization();
            var appMetadata = user.AppMetadata as JObject ?? new JObject();
            foreach (var keyValue in authorization)
            {
                appMetadata[keyValue.Key] = keyValue.Value;
            }
            user.AppMetadata = appMetadata;
            return user;
        }
        
        public override async Task<License> GetLicense(bool forceRefresh = false)
        {
            return GetAppSettings().auth.license;
        }
        
    }
}
