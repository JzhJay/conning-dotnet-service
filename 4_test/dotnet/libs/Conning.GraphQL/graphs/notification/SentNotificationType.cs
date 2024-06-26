using Conning.Models.Notifications;
using GraphQL.Types;

namespace Conning.GraphQL
{
    public class SentNotificationType : ObjectGraphType<SentNotification>
    {
        public SentNotificationType()
        {
            Field<ObjectIdGraphType>().Name("_id");
            Field(x => x.owner);
            Field<JsonGraphType>().Name("endpoint");
            Field(x => x.messageKey);
            Field(x => x.sentTime);
            Field(x => x.title);
            Field(x => x.delivered, nullable: true);
        }
    }
}