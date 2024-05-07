using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Conning.Db.Services;
using GraphQL;
using GraphQL.Server.Transports.AspNetCore.WebSockets;
using GraphQL.Transport;

namespace Conning.GraphQL.Authentication
{
    /// <summary>
    /// Authenticates WebSocket connections via the 'payload' of the initialization packet.
    /// This is necessary because WebSocket connections initiated from the browser cannot
    /// authenticate via HTTP headers.
    /// <br/><br/>
    /// This class is not used when authenticating over GET/POST.
    /// </summary>
    public class JwtWebSocketAuthenticationService : IWebSocketAuthenticationService
    {
        private readonly IGraphQLSerializer _graphQLSerializer;
        private readonly BaseUserService _baseUserService;
        
        public JwtWebSocketAuthenticationService(IGraphQLSerializer graphQLSerializer, BaseUserService baseUserService)
        {
            _graphQLSerializer = graphQLSerializer;
            _baseUserService = baseUserService;
        }

        public Task AuthenticateAsync(IWebSocketConnection connection, string subProtocol, OperationMessage operationMessage)
        {
            try
            {
                // for connections authenticated via HTTP headers, no need to reauthenticate
                if (connection.HttpContext.User.Identity?.IsAuthenticated ?? false)
                    return Task.CompletedTask;

                // attempt to read the 'Authorization' key from the payload object and verify it contains "Bearer: XXXXXXXX"
                var authPayload = _graphQLSerializer.ReadNode<AuthPayload>(operationMessage.Payload);
                if (authPayload != null && authPayload.Authorization != null && authPayload.Authorization.StartsWith("Bearer ", StringComparison.Ordinal))
                {
                    // pull the token from the value
                    var token = authPayload.Authorization.Substring(7);
                    // set the ClaimsPrincipal for the HttpContext; authentication will take place against this object
                    connection.HttpContext.User = _baseUserService.ValidateJWT(token);
                }
            }
            catch
            {
                // no errors during authentication should throw an exception
                // specifically, attempting to validate an invalid JWT token will result in an exception, which may be logged or simply ignored to not generate an inordinate amount of logs without purpose
                connection.HttpContext.User = null;
            }

            return Task.CompletedTask;
        }

        private class AuthPayload
        {
            public string Authorization { get; set; }
        }
    }
}