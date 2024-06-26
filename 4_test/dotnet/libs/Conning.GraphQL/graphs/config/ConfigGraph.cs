using System;
using GraphQL.Types;
using Microsoft.Extensions.Options;

namespace Conning.GraphQL
{
    public class ConfigGraph : ObjectGraphType
    {
        public IOptions<AdviseAppSettings> Settings { get; }

        public ConfigGraph(IOptions<AdviseAppSettings> settings)
        {
            Settings = settings;
            
            Field<NonNullGraphType<OmdbConfigGraph>>()
               .Name("omdb")
               .Resolve(ctx =>
               {
                return Settings.Value.mongo.connection;
               });
        }
    }
}
