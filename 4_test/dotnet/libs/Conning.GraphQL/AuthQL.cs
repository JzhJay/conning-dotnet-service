using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Conning.Db.Services;
using GraphQL;
using GraphQL.Server.Transports.AspNetCore;
using GraphQL.Server.Transports.AspNetCore.Errors;
using GraphQL.Transport;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace Conning.GraphQL
{
    public class ConningGraphQLHttpMiddleware<TSchema> : GraphQLHttpMiddleware<TSchema>
        where TSchema : ISchema
    {
        private AdviseAppSettings _settings;
        private BaseUserService _userService;
        private readonly ILogger _logger;
        private readonly GraphQLHttpMiddlewareOptions _options;
        
        public ConningGraphQLHttpMiddleware(
            RequestDelegate next,
            IGraphQLTextSerializer serializer,
            IDocumentExecuter<TSchema> documentExecuter,
            IServiceScopeFactory serviceScopeFactory,
            GraphQLHttpMiddlewareOptions options,
            IHostApplicationLifetime hostApplicationLifetime,
            IOptions<AdviseAppSettings> settings,
            BaseUserService baseUserService,
            ILogger<GraphQLHttpMiddleware<TSchema>> logger)
            : base(next, serializer, documentExecuter, serviceScopeFactory, options, hostApplicationLifetime)
        {
            _settings = settings.Value;
            _userService = baseUserService;
            _logger = logger;
            _options = options;
            options.AuthorizationRequired = true;   // to enable WebSocket's authentication
        }
        
        protected override async ValueTask<bool> HandleAuthorizeAsync(HttpContext context, RequestDelegate next)
        {
            // Use original authentication flow to validate WebSocket connection
            if (context.WebSockets.IsWebSocketRequest)
            {
                return await base.HandleAuthorizeAsync(context, next);
            }

            var user = BuildUserContext(context);
            var success = user != null;
            if (!success)
            {
                context.Response.ContentType = "application/json";
                WriteErrorResponseAsync(context, HttpStatusCode.Unauthorized, new AccessDeniedError("token"));
            }

            return !success;
        }

        protected override async Task HandleRequestAsync(
            HttpContext context,
            RequestDelegate next,
            GraphQLRequest gqlRequest)
        {
            // Normal execution with single graphql request
            var userContext = await BuildUserContextAsync(context, null);
            var result = await ExecuteRequestAsync(context, gqlRequest, context.RequestServices, userContext);
            
            HttpStatusCode statusCode = HttpStatusCode.OK;
            if (result.Errors != null && result.Errors.Any())
            {
                statusCode = HttpStatusCode.BadRequest;
                _logger.LogError($"Error responding to GraphQL request:  ");
                foreach (var e in result.Errors)
                {
                    _logger.LogError(e.InnerException != null ? e.InnerException.ToString() : e.ToString());
                }
            }
            
            await WriteJsonResponseAsync(context, statusCode, result);
        }
        
        protected override async Task HandleBatchRequestAsync(
            HttpContext context,
            RequestDelegate next,
            IList<GraphQLRequest> gqlRequests)
        {
            var userContext = await BuildUserContextAsync(context, null);
            var results = new ExecutionResult[gqlRequests.Count];
            if (gqlRequests.Count == 1)
            {
                results[0] = await ExecuteRequestAsync(context, gqlRequests[0], context.RequestServices, userContext);
            }
            else
            {
                // Batched execution with multiple graphql requests
                if (_options.ExecuteBatchedRequestsInParallel)
                {
                    var resultTasks = new Task<ExecutionResult>[gqlRequests.Count];
                    for (int i = 0; i < gqlRequests.Count; i++)
                    {
                        resultTasks[i] = ExecuteScopedRequestAsync(context, gqlRequests[i], userContext);
                    }
                    await Task.WhenAll(resultTasks);
                    for (int i = 0; i < gqlRequests.Count; i++)
                    {
                        results[i] = await resultTasks[i];
                    }
                }
                else
                {
                    for (int i = 0; i < gqlRequests.Count; i++)
                    {
                        results[i] = await ExecuteRequestAsync(context, gqlRequests[i], context.RequestServices, userContext);
                    }
                }
            }

            var statusCode = HttpStatusCode.OK;
            if (results.Any(r => r.Errors?.Any() == true))
            {
                statusCode = HttpStatusCode.BadRequest;
                _logger.LogError($"Error responding to GraphQL request:  ");
                foreach (var executionResult in results.Where(r => r.Errors != null))
                {
                    foreach (var e in executionResult.Errors)
                    {
                        _logger.LogError(e.InnerException != null ? e.InnerException.ToString() : e.ToString());
                    }
                }
            }
            
            await WriteJsonResponseAsync(context, statusCode, results);
        }
        
        // Authorization for regular HTTP requests (queries, mutations)
        private ClaimsPrincipal BuildUserContext(HttpContext context)
        {
            var tokenRaw = context.Request.Headers["authorization"];
            var port = context.Request.Headers["x-forwarded-port"];
            ClaimsPrincipal user = null;
            if (!string.IsNullOrEmpty(tokenRaw))
            {
                var token = tokenRaw.ToString();
                if (!token.StartsWith("Bearer "))
                {
                    throw new SecurityException("Authentication Tokens should start with 'bearer '");
                }

                token = token.Substring(7);

                try
                {
                    if (context.User != null)
                    {
                        if (port == "81")
                        {
                            var jwtHandler = new JwtSecurityTokenHandler();
                            SecurityToken validatedToken = null;
                            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_settings.julia.sharedSecret));
                            user = jwtHandler.ValidateToken(token, new TokenValidationParameters()
                            {
                                IssuerSigningKey = signingKey,
                                ValidateIssuerSigningKey = true, // verify that the key used to sign the incoming token is part of a list of trusted keys (Only for embedded keys)
                                ValidateAudience = false,
                                ValidateIssuer =  false,
                            }, out validatedToken);
                        }
                        else
                        {
                            // Note: We could have relied on the JwtBearer middleware to handle the authentication and simply validated
                            // (context.User?.Identity.IsAuthenticated == true) here. However websocket authentication doesn't pass through the middleware and
                            // still needs to be manually validated. Hence we'll use the same method here.
                            user = _userService.ValidateJWT(token);
                        }

                        context.User = user;
                        Thread.CurrentPrincipal = user;
                    }
                }
                catch (SecurityTokenExpiredException expired)
                {
                    _logger.LogWarning("User HTTP GraphQL token is expired.");
                }
                catch (Exception e)
                {
                    _logger.LogError(e.StackTrace);
                }
            }

            return user;
        }
    }
    /*
    
    public class AddAuthenticator : IPostConfigureOptions<ExecutionOptions<GraphSchema>>
    {
        private readonly IOperationMessageListener _authenticator;

        public AddAuthenticator(ITokenListener tokenListener)
        {
            _authenticator = tokenListener;
        }

        public void PostConfigure(string name, ExecutionOptions<GraphSchema> options)
        {
            options.MessageListeners.Insert(0, _authenticator);
        }
    }

    public interface ITokenListener : IOperationMessageListener
    {
    }

    public class TokenListener : ITokenListener
    {
        public IOptions<AdviseAppSettings> Settings { get; }
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ILogger<TokenListener> _log;
        private List<string> expiredTokens;
        private BaseUserService _userService;
        
        internal static TokenListener Instance { get; private set; }

        public TokenListener(IHttpContextAccessor httpContextAccessor, ILogger<TokenListener> log, IOptions<AdviseAppSettings> settings, BaseUserService userService)
        {
            Instance = this;

            Settings = settings;
            _httpContextAccessor = httpContextAccessor;
            _log = log;
            expiredTokens = new List<string>();
            _userService = userService;
        }

        // Authorization for Subscriptions. e.g. Websocket connections
        public Task BeforeHandleAsync(MessageHandlingContext context)
        {
            if (context.Message.Type == MessageType.ConnectionInit)
            {
                var token = context.Message.Payload.Value<string>("authorization"); //graphIQL sends us this
                if (string.IsNullOrEmpty(token))
                {
                    token = context.Message.Payload.Value<string>("Authorization");
                }

                if (!string.IsNullOrEmpty(token))
                {
                    if (token.StartsWith("Bearer "))
                    {
                        token = token.Substring(7);
                    }

                    try
                    {
                        try
                        {
                            JwtSecurityToken jwt = _userService.ValidateJWT(token);
                            _httpContextAccessor.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity(jwt.Claims));
                        }
                        catch (SecurityTokenExpiredException expired)
                        {
                            _httpContextAccessor.HttpContext.User = null;

                            if (!expiredTokens.Contains(token))
                                _log.LogWarning("User GraphQL subscription token is expired.");

                            // Store a list of expired tokens to avoid spamming the log if client attempts to reconnect with the same token.
                            if (expiredTokens.Count >= 100)
                                expiredTokens.RemoveAt(0);
                            expiredTokens.Add(token);
                        }
                    }
                    catch (JsonReaderException)
                    {
                        _log.LogWarning($"Unable to decode jwt {token}");
                        _httpContextAccessor.HttpContext.User = null;
                    }
                    catch (Exception e)
                    {
                        _log.LogWarning($"Unable to decode jwt {token}");
                        _log.LogError($"{e.Message}: {e.StackTrace}");
                        _httpContextAccessor.HttpContext.User = null;
                    }
                }
                else
                {
                    _log.LogWarning("No token provided");
                    _httpContextAccessor.HttpContext.User = null;
                }
            }

            // Add the user information to every request (It is only set at the first connection event)

            context.Properties["user"] = _httpContextAccessor.HttpContext.User;

            return Task.FromResult(true);
        }

        public Task HandleAsync(MessageHandlingContext context)
        {
            return Task.CompletedTask;
        }

        public Task AfterHandleAsync(MessageHandlingContext context)
        {
            return Task.CompletedTask;
        }

        // Authorization for regular HTTP requests (queries, mutations)
        public object BuildUserContext(HttpContext context)
        {
            var tokenRaw = context.Request.Headers["authorization"];
            var port = context.Request.Headers["x-forwarded-port"];

            if (!string.IsNullOrEmpty(tokenRaw))
            {
                var token = tokenRaw.ToString();
                if (!token.StartsWith("Bearer "))
                {
                    throw new SecurityException("Authentication Tokens should start with 'bearer '");
                }

                token = token.Substring(7);

                try
                {
                    if (context.User != null)
                    {
                        var jwtHandler = new JwtSecurityTokenHandler();
                        JwtSecurityToken jwt;

                        if (port == "81")
                        {
                            SecurityToken validatedToken = null;
                            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Instance.Settings.Value.julia.sharedSecret));
                            jwtHandler.ValidateToken(token, new TokenValidationParameters()
                            {
                                IssuerSigningKey = signingKey,
                                ValidateIssuerSigningKey = true, // verify that the key used to sign the incoming token is part of a list of trusted keys (Only for embedded keys)
                                ValidateAudience = false,
                                ValidateIssuer =  false,
                            }, out validatedToken);

                            jwt = (JwtSecurityToken) validatedToken;
                        }
                        else
                        {
                            // Note: We could have relied on the JwtBearer middleware to handle the authentication and simply validated
                            // (context.User?.Identity.IsAuthenticated == true) here. However websocket authentication doesn't pass through the middleware and
                            // still needs to be manually validated. Hence we'll use the same method here.
                            jwt = _userService.ValidateJWT(token);
                        }

                        var user = new ClaimsPrincipal(new ClaimsIdentity(jwt.Claims));
                        context.User = user;
                        Thread.CurrentPrincipal = user;
                        return user;
                    }
                }
                catch (SecurityTokenExpiredException expired)
                {
                    Console.WriteLine("User HTTP GraphQL token is expired.");
                    return null;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    return null;
                }
            }

            return null;
        }
    }*/
}