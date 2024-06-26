using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

namespace Conning.GraphQL
{
    public static class NotificationExtensionMethods
    {
        public static void registerNotificationTypes(this IServiceCollection services)
        {
            services.AddSingleton<DesktopNotificationGraph>();
            services.AddSingleton<NotificationQueryGraphType>();
            services.AddSingleton<SimulationPhase>();
            services.AddSingleton<NotificationTarget>();

            services.AddSingleton<SentNotificationType>();

            services.AddSingleton<NotificationSubscriptionGraph>();
            services.AddSingleton<ModifySubscriptionInputType>();
            services.AddSingleton<NotificationMutation>();
            services.AddSingleton<TestNotificationSubscriptionMutation>();
        }
    }

//    public class NotificationTrigger : EnumerationGraphType
//    {
//        public NotificationTrigger()
//        {
//            AddValue("grid_on", "", "");
//            AddValue("Usage", "", "Usage");
//            AddValue("Event", "Elapsed Time", "Event");
//            AddValue("Threshold", "Elapsed Time", "Threshold");
//            AddValue("Failure", "Elapsed Time", "Failure");
//        }
//    }

    public class SimulationPhase : EnumerationGraphType
    {
        public SimulationPhase()
        {
            Add("Compile",  "Compile", "");
            Add("Parse",  "Parse", "");
            Add("Simulate",  "Simulate", "");
            Add("QueryReady",  "QueryReady", "");
            Add("Stored",  "Stored", "");
        }
    }
}