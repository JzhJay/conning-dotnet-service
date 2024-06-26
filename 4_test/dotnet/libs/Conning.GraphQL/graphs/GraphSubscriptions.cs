using GraphQL.Types;
using Microsoft.Extensions.Logging;

namespace Conning.GraphQL
{
    public class GraphSubscriptions : ObjectGraphType<object>
    {
        private ILogger<GraphSubscriptions> _log;
        
        public GraphSubscriptions(ILogger<GraphSubscriptions> log, OmdbSubscriptionGraph omdb, NotificationSubscriptionGraph notificationGraph)
        {
            _log = log;           
            Name = "GraphSubscriptions";
         
            notificationGraph.RegisterNotificationField(this);
            
            omdb.RegisterField(this);
//            AddField(new FieldType()
//            {
//                Name = "omdb",
//                ResolvedType = omdb,
//                Resolver = new FuncFieldResolver<object>(ctx => omdb)
//            });
        }    
    }
}