using GraphQL.Types;

namespace Conning.GraphQL
{
    public class ModifySubscriptionInputType : InputObjectGraphType
    {
        public ModifySubscriptionInputType()
        {
            Name = "ModifySubscriptionInput";
            Field<NotificationTarget>().Name("target");
            Field<StringGraphType>().Name("trigger");
            Field<StringGraphType>().Name("severity");
            Field<BooleanGraphType>().Name("email");
            Field<BooleanGraphType>().Name("emailSecondary");
            Field<BooleanGraphType>().Name("mobile");
            Field<BooleanGraphType>().Name("desktop");
            Field<JsonGraphType>().Name("extra");
            Field<StringGraphType>().Name("scope");
        }
    }
}