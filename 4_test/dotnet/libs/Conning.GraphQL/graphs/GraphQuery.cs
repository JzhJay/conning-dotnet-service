using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.Logging;

namespace Conning.GraphQL
{
    public class GraphQuery : ObjectGraphType
    {
        private ILogger<GraphQuery> _logger;

        public OmdbQueryGraph Omdb { get; }

        public GraphQuery(ILogger<GraphQuery> log, NotificationQueryGraphType notification, UserQuery userQuery, OmdbQueryGraph omdb, BillingQueryGraph billing, ConfigGraph config)
        {
            Omdb = omdb;
            _logger = log;

            Field<ConfigGraph>("config", resolve: ctx =>
                {
                    ctx.GetSecureUserId(out var user, true);

                    // Todo authorize for admin


                    return config;
                });

            Field<NotificationQueryGraphType>("notification", resolve: ctx => notification);
            Field<UserQuery>("user", resolve: ctx => userQuery);

            AddField(new FieldType()
            {
                Name = "omdb",
                ResolvedType = omdb,
                Resolver = new FuncFieldResolver<object>(ctx =>
                {
                    var userId = ctx.GetSecureUserId(out var user, true);

                    return omdb;
                })
            });

            AddField(new FieldType()
            {
                Name = "billing",
                ResolvedType = billing,
                Resolver = new FuncFieldResolver<object>(ctx => { return billing; })
            });
        }
    }
}