
using System;
using System.Net;
using System.Threading.Tasks;
using Conning.Common;
using Conning.Db.Services;
using Conning.Models.Notifications;
using GraphQL.Types;
using Microsoft.Extensions.Logging;

namespace Conning.GraphQL
{    
    public class TestNotificationSubscriptionMutation : ObjectGraphType
    {
        private readonly BaseUserService _userService;
        private readonly SendMessageService _sendMessageService;
        private ILogger<TestNotificationSubscriptionMutation> _log;
        
        public TestNotificationSubscriptionMutation(ILogger<TestNotificationSubscriptionMutation> log, BaseUserService userService, IDesktopNotificationQueue notificationQueue, SendMessageService sendMessageService)
        {
	        _log = log;
	        _userService = userService;
            _sendMessageService = sendMessageService;
            Field<DesktopNotificationGraph>().Name("sendTestDesktopNotification").Resolve(ctx =>
            {
                var userId = ctx.GetSecureUserId(out var user, true);
                
                return notificationQueue.AddNotificationEvent(new DesktopNotificationEvent() { userId = userId, message = "This is a test", title = "This is a title" });
            });
            
            Field<StringGraphType>().Name("sendTestEmail").ResolveAsync(async ctx =>
            {
                return await SendEmailRequest(ctx.GetSecureUserId(out var user, true));
            });
            
            Field<StringGraphType>().Name("sendTestText").ResolveAsync(async ctx =>
            {              
                return await SendTextRequest(ctx.GetSecureUserId(out var user, true));
            });
        }

        async Task<String> SendEmailRequest(string userId)
        {
	        var user = await _userService.GetUserAsync(userId);
	        if (user.EmailVerified == false)
	        {
		        return $"Email '{user.Email}' unverified";
	        }
	        try
	        {
		        await _sendMessageService.sendEmail(user.Email, "Notification test message", "This is a notification test message");
		        return "";
		    }
	        catch (Exception e)
	        {
		        _log.LogError($"Unexpected failure occurs when sending test e-mail: {e.ToString()}");
		        return "Sending test e-mail fails.";
	        }
        }
        
        async Task<String> SendTextRequest(string userId)
        {
	        try
	        {
		        var user = await _userService.GetUserAsync(userId, true);
		        var resp = await _sendMessageService.sendText(_userService.GetUserPhone(user), "This is a notification test message");
		        if (resp.HttpStatusCode != HttpStatusCode.OK)
		        {
			        throw new Exception($"Message service sends test text message fails: ${resp.HttpStatusCode}");
		        }
		        return "";
	        }
	        catch (Exception e)
	        {
		        _log.LogError($"Unexpected failure occurs when sending test text message: {e.ToString()}");
		        return "Sending test text message fails.";
	        }
        }
    }
}