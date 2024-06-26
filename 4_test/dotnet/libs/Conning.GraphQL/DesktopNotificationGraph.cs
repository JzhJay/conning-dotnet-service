using Conning.Models.Notifications;
using GraphQL.Types;

namespace Conning.GraphQL
{
   public class DesktopNotificationGraph : ObjectGraphType<DesktopNotificationEvent>
    {
        public DesktopNotificationGraph()
        {
            Name = "DesktopNotification";
            
            Field(o => o.message).Description("Message text to display");
            Field(o => o.timeout).Description("Time in ms before fading out");
            Field(o => o.title);
            Field(o => o.userId).Description("Should always match the bearer's ID");
        }
    }
}
