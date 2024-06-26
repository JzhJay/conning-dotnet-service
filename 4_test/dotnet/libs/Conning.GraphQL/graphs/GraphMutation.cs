using Conning.GraphQL.QueryTool;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace Conning.GraphQL
{
    public class GraphMutation : ObjectGraphType<object>
    {
        public GraphMutation(NotificationMutation notificationMutation, QueryToolMutationGraph queryTool, OmdbMutationGraph omdb)
        {
            Field<NotificationMutation>("notification", resolve: ctx => notificationMutation);
            //Field<StringGraphType>("notification", resolve: ctx => "foo");
            
            Field<QueryToolMutationGraph>("queryTool", resolve: ctx => queryTool);
            AddField(new FieldType()
            {
                Name = "omdb",
                ResolvedType = omdb,
                Resolver = new FuncFieldResolver<object>(ctx => omdb)
            });                      
        }
    }
}
