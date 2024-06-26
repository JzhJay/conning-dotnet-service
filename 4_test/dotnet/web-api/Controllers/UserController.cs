using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Threading.Tasks;
using Conning.Db.Services;
using Conning.GraphQL;
using Conning.Models.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;

namespace Conning.Kui.Web.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        public UserController(ILogger<UserController> log, IOptions<AdviseAppSettings> settings, MongoDbService mongo,
            OmdbService omdb, BaseUserService userService)
        {
            _log = log;
            _settings = settings;
            _mongo = mongo;
            _omdb = omdb;
            _userService = userService;
        }

        private readonly ILogger<UserController> _log;
        private readonly MongoDbService _mongo;
        private readonly OmdbService _omdb;
        private readonly BaseUserService _userService;
        private readonly IOptions<AdviseAppSettings> _settings;

        [Authorize]
        [HttpPost("initialize")]
        public async Task<IActionResult> Initialize()
        {
            string userId = _userService.GetCurrentUserId();
            try
            {
                if (!String.IsNullOrEmpty(userId))
                {
                    this._log.LogWarning($"Initialize User: '{userId}'");
                    await InitUserBillingNotification(userId, _userService.GetCurrentTenant());
                    await _userService.InitializeUser(userId);
                }
            }
            catch (Exception e)
            {
                this._log.LogError($"Initializing User '{userId}' failed: {e.Message} {e.StackTrace}");
            }

            return Ok();
        }
        
        [Authorize]
        [HttpPost("userMetadata")]
        public async Task<IActionResult> UpdateUserMetadata([FromBody]JObject userMetaData)
        {
            string userId = _userService.GetCurrentUserId();
            try
            {
                if (!String.IsNullOrEmpty(userId))
                {
                    await _userService.UpdateUserPreference(userId, userMetaData);
                }
            }
            catch (Exception e)
            {
                this._log.LogError($"Updating user '{userId}' user metadata failed: {e.Message} {e.StackTrace}");
                throw e;
            }

            return Ok();
        }
        
        [Authorize]
        [HttpGet("userInfo")]
        public async Task<IActionResult> userInfo()
        {
            string userId = _userService.GetCurrentUserId();
            try
            {
                var customClaims = _userService.GetCurrentUserAuthorization();
                return Ok(new JObject()
                {
                    { "sub", userId },
                    { "email", customClaims["email"] },
                    { "appMetadata", new JObject()
                        {
                            {"authorization", customClaims["authorization"]},
                            {"userInitialized", customClaims["userInitialized"] ?? false}
                        }
                    }
                });
            }
            catch (Exception cE)
            {
                this._log.LogWarning($"No custom claims found! Ensure custom claims rule is enabled and updated on Auth0 tenant: {cE.Message} {cE.StackTrace}");
                ConningUser user = null;
                try
                {
                    user = await GetCurrentUserProfile();
                }
                catch (Exception e)
                {
                    this._log.LogError($"Load user info of from access token' failed: {e.Message} {e.StackTrace}");
                    throw e;
                }
                
                if (user != null)
                {
                    return Ok(new JObject()
                    {
                        { "sub", user.Sub },
                        { "email", user.Email },
                        { "email_verified", user.EmailVerified }, // email_verified is for Julia. Doesn't need to modify it temporarily
                        { "appMetadata", user.AppMetadata }
                    });
                }
            }
            
            return NotFound();
        }
        
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> LoadProfile()
        {
            ConningUser userProfile = null;
            try
            {
                userProfile = await GetCurrentUserProfile();
            }
            catch (Exception e)
            {
                this._log.LogError($"Loading User '{_userService.GetCurrentUserId()}' profile failed: {e.Message} {e.StackTrace}");
                throw e;
            }
            
            if (userProfile != null)
            {
                return Ok(userProfile);
            }
            
            return NotFound();
        }
        
        
        [Authorize]
        [HttpGet("allUsers")]
        public async Task<List<ConningUser>> GetAllUsers()
        {
            try
            {
                return await _userService.GetAllUsers();
            }
            catch (Exception e)
            {
                this._log.LogError($"Getting all users failed: {e.Message} {e.StackTrace}");
                throw e;
            }
        }
        
        private async Task InitUserBillingNotification(string userId, string tenant)
        {
            var notificationSubscription =
                _mongo.GetMongoDbByTenant(tenant).GetCollection<NotificationSubscription>("notificationSubscriptions");

            var cursor = await notificationSubscription.FindAsync(c =>
                c.owner == userId && c.target == "billing" && c.trigger == "billing_usage_threshold");
            
            if (!cursor.Any()) // no existing billing notification
            {
                dynamic extra = new ExpandoObject();
                extra.threshold = "2000";
                var subscription = new NotificationSubscription
                {
                    owner = userId,
                    scope = "user",
                    target = "billing",
                    trigger = "billing_usage_threshold",
                    extra = extra,
                    email = true,
                    severity = "info",
                    desktop = true,
                    mobile = false
                };

                if (_mongo.IsMultiTenant)
                {
                    subscription.tenant = tenant;
                }

                await notificationSubscription.InsertOneAsync(subscription);
               
                this._log.LogInformation($"Add billing notification subscription for user: '{userId}' successfully");
            }
            else
            {
                this._log.LogInformation($"User: '{userId}' already has billing notification");
            }
        }
        
        private async Task<ConningUser> GetCurrentUserProfile()
        {
            string userId = _userService.GetCurrentUserId();
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userService.GetUserAsync(userId);
                return _userService.AttachCurrentUserAuthorizationToUser(user);
            }

            return null;
        }
    }
}
