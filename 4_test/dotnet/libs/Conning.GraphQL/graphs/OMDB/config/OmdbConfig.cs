using System;
using GraphQL.Types;
using Microsoft.Extensions.Options;
using System.Linq;

namespace Conning.GraphQL
{
    public class OmdbConfigGraph : ObjectGraphType
    {
        public OmdbConfigGraph(IOptions<AdviseAppSettings> settings, OmdbService omdb)
        {
            Field<StringGraphType>().Name("server").Resolve(ctx => String.Join(',', omdb.db.Client.Settings.Servers.Select(server => $"{server.Host}:{server.Port}")));
            Field<StringGraphType>().Name("db").Resolve(ctx => omdb.db.DatabaseNamespace.DatabaseName);
        }
    }
}
