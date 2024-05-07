using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Conning.Db.Services;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class OmdbMutationGraph : ObjectGraphType
    {
        public OmdbMutationGraph(OmdbService omdb, OmdbGraph omdbGraph, OmdbSubscriptionGraph omdbSubscriptionGraph, OmdbAdminMutationObjectGraph adminGraph)
        {
            Name = "omdb_mutations";

//            var genericObjectGraph = new OmdbGenericMutationsGraph(omdbGraph);
//            AddField(
//                new FieldType()
//                {
//                    ResolvedType = genericObjectGraph,
//                    Name = "raw",
//                    Resolver = new FuncFieldResolver<OmdbGenericMutationsGraph>(ctx => genericObjectGraph)
//                });      

            
            var typedObjectGraph = new OmdbTypedMutationsGraph(omdbGraph);
            AddField(
                new FieldType()
                {
                    ResolvedType = typedObjectGraph,
                    Name = "typed",
                    Resolver = new FuncFieldResolver<OmdbTypedMutationsGraph>(ctx => typedObjectGraph)
                });

            Field<OmdbAdminMutationObjectGraph>()
                .Name("admin")
                .Resolve(ctx =>
                {
                    ctx.GetSecureUserId(out var user, true);
                    //user.HasClaim("")
                    return adminGraph;
                });

            var uiMutationGraph = new OmdbUiMutationGraph(omdbGraph);
            AddField(
	            new FieldType()
	            {
		            ResolvedType = uiMutationGraph,
		            Name = "ui",
		            Resolver = new FuncFieldResolver<OmdbUiMutationGraph>(ctx => uiMutationGraph)
	            });

            var omdbUserTagDefault = new OmdbUserTagDefault(omdbGraph);
            AddField(
	            new FieldType()
	            {
		            ResolvedType = omdbUserTagDefault,
		            Name = "userTagDefault",
		            Resolver = new FuncFieldResolver<OmdbUserTagDefault>(ctx => omdbUserTagDefault)
	            });
        }
    }

    public class OmdbAdminMutationObjectGraph : ObjectGraphType {
        public OmdbAdminMutationObjectGraph(OmdbGraph omdb, MongoDbService mongo)
        {
            Field<StringGraphType>()
                .Name("bootstrapDatabase")
                .ResolveAsync(async ctx =>
                {
                    //await mongo.EnsureCollections();
                    return "Reloaded any empty collections from bootstrap json files.";
                });
        }
    }

    /// <summary>
    /// See also <see cref="OmdbMutationObjectTypeGraph"/>
    /// </summary>
    public class OmdbTypedMutationsGraph : ObjectGraphType
    {
        public OmdbTypedMutationsGraph(OmdbGraph omdbGraph)
        {
            Name = "omdb_typed_mutations";                    
        }
    }
}