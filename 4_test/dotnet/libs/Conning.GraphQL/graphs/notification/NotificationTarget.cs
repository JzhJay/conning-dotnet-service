using GraphQL.Types;

namespace Conning.GraphQL
{
    public class NotificationTarget : EnumerationGraphType
    {
        public NotificationTarget()
        {
            Add("billing", "billing", "Billing Events");
            Add("simulation", "simulation", "Simulation Events");
            Add("system", "system", "System Events");
        }
    }
}