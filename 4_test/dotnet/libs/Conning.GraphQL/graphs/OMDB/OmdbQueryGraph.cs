using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conning.Library.Utility;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.IdentityModel.Tokens;

/*
query omdb {
  omdb {
    config {
      server
      db
    }
    objectTypes
    raw {
      ind(input: {objectTypes: ["Simulation"], searchText: "is a test"}) {
       f results {
          ... on Simulation {
            _id
            name
          }
        }
        resultsRaw
        input {
          searchText
          objectTypes
        }
      }
      shouldBeNull: get(_id: "", objectType: "Simulation") {
        ... on Simulation {
          _id
          name
        }
      }
      get(_id: "5aa6bcfc1cc6d10c214fce20", objectType: "Simulation") {
        ... on Simulation {
          _id
          name
        }
      }
    }
    typed {
      simulation {
        find(input: {searchText: "is a test"}) {

          results {
            _id
            name
          }
        }
        shouldBeNull: get(_id: "") {
          _id
          name
        }
        get(_id: "5aa6bcfc1cc6d10c214fce20") {
          _id
          name
        }
      }
    }
  }
}
 */

namespace Conning.GraphQL
{
    public class OmdbQueryGraph : ObjectGraphType
    {
        public OmdbService Omdb { get; }
        public OmdbGraph OmdbGraph { get; }

        /// <summary>
        /// </summary>
        public OmdbQueryGraph(OmdbService omdb, OmdbGraph omdbGraph, OmdbConfigGraph config)
        {
            Name = "OmdbQuery";
            Omdb = omdb;
            OmdbGraph = omdbGraph;

            Field<OmdbConfigGraph>()
                .Name("config")
                .Resolve(ctx => { return config; });

            Field<ListGraphType<OmdbObjectTypeDescriptorGraph>>()
                .Name("objectTypes")
                .Argument<ListGraphType<NonNullGraphType<StringGraphType>>>("ids", "")
                .Resolve(ctx =>
                {
                    var userId = ctx.GetSecureUserId(out var user);
                    var ids = ctx.ArgumentArrayValue<string>("ids");

                    return omdbGraph.DbObjectTypes
                        .Where(s => !ids.Any() || ids.Contains(s))
                        .Select(ot => omdbGraph.ObjectTypes[ot]);
                });

            Field<OmdbObjectTypeDescriptorGraph>()
                .Name("objectType")
                .Argument<NonNullGraphType<StringGraphType>>("id", "")
                .Resolve(ctx =>
                {
                    var userId = ctx.GetSecureUserId(out var user);
                    var objectType = ctx.GetArgument<string>("id", default(string));
                    return omdbGraph.ObjectTypes[objectType];
                });

            var genericObjectGraph = new OmdbGenericGraph(omdbGraph);
            AddField(
                new FieldType()
                {
                    ResolvedType = genericObjectGraph,
                    Name = "raw",
                    Resolver = new FuncFieldResolver<OmdbGenericGraph>(ctx => genericObjectGraph)
                });

            var typedObjectGraph = new OmdbTypedGraph(omdbGraph);
            AddField(
                new FieldType()
                {
                    ResolvedType = typedObjectGraph,
                    Name = "typed",
                    Resolver = new FuncFieldResolver<OmdbTypedGraph>(ctx => typedObjectGraph)
                });

//            Field<ListGraphType<OmdbUiQueryGraph>>()
//                .Name("ui")
//                .Argument<ListGraphType<StringGraphType>>("objectTypes", "")
//                .ResolveAsync(async ctx =>
//                {
//                    var objectTypes = ctx.ArgumentArrayValue<string>("objectTypes");
//                    return await omdb.LoadUi(objectTypes);
//                });


            // ui gets added after object types are added


            //Field<UserTagQueryGraph>().Name("userTags").Resolve(ctx => new UserTagQueryGraph());
        }
    }

    public class OmdbDistinctInputGraph : InputObjectGraphType
    {
        public OmdbDistinctInputGraph()
        {
            Name = "OmdbDistinctInput";
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<StringGraphType>>>>("objectTypes", "The object types to search");
            Field<ListGraphType<StringGraphType>>("tags", "The tags to select values for");
            Field<StringGraphType>("searchText", "Text to search for (case-insensitive)");
            Field<JsonGraphType>("where", "{field1: value1, field2: value2 }");
            Field<StringGraphType>("path", "search folder path");
        }
    }

    public class OmdbDistinctNoObjectTypeInputGraph : InputObjectGraphType
    {
        public OmdbDistinctNoObjectTypeInputGraph()
        {
            Name = "OmdbDistinctInput";
            Field<ListGraphType<StringGraphType>>("tags", "The tags to select values for");
            Field<StringGraphType>("searchText", "Text to search for (case-insensitive)");
            Field<JsonGraphType>("where", "{field1: value1, field2: value2 }");
        }
    }


    public class OmdbGenericGraph : ObjectGraphType
    {
        public OmdbGenericGraph(OmdbGraph omdbGraph)
        {
            Name = "omdb_generic_graph";

            OmdbDistinctGraph.RegisterField(omdbGraph, this);
            OmdbQueryResultGraph.RegisterField(omdbGraph, this);
        }
    }

    public class OmdbTypedGraph : ObjectGraphType
    {
        public OmdbTypedGraph(OmdbGraph omdbGraph)
        {
            Name = "omdb_typed_graph";
        }
    }


    public class OmdbObjectTypeDescriptorGraph : ObjectGraphType
    {
        private Dictionary<string, string[]> allowedTags = new Dictionary<string, string[]>
        {
            {
                "Simulation", new [] {
                    "scenarios", "frequencies", "periods", "modules", "economies", "variables", "axes", "economies",
                    "status", "gridName", "dfsPath", "version", "elements", "size", "sourceType", "useCase", "economies",
                    "productVersion", "userFile", "scenarioSummary", "userTagValues", "parameterizationMeasure"

                }

            },
            {
                "Query", new [] {
                    "simulations", "variables", "hasResult", "result", "scenarios", "periods", "frequencies", "economies", "version", "scenarioSummary", "userTagValues"
                }

            },
            {
                "InvestmentOptimization", new [] {
                    "simulations", "variables", "hasResult", "result", "scenarios", "status", "gridName", "path", "version", "size", "assetReturnsSimulation", "companyDataSimulation", "companyDataRepository",
                    "scenarioSummary", "userTagValues"
                }

            },
            {
                "UserFile", new [] {
                    "type", "status", "hasResult", "version", "scenarioSummary", "userTagValues"

                }

            },
            {
                "ClimateRiskAnalysis", new [] {
                    "status", "userTagValues", "simulation"
                }

            }
        };

        private string[] commonTags = {"_id", "name", "createdBy", "createdTime", "modifiedBy", "modifiedTime", "comments"};

        public OmdbObjectTypeDescriptorGraph(OmdbService omdb, IDataLoaderContextAccessor dataLoader)
        {
            Name = "OmdbObjectType";
            Field<StringGraphType>().Name("id").Resolve(ctx => (ctx.Source as ObjectGraphType).Name);

            Field<ListGraphType<OmdbTagGraph>>()
                .Name("tags")
                .Resolve(ctx =>
                {
                    var source = ctx.Source as ObjectGraphType;
                    return source.Fields.Where(f => (allowedTags.ContainsKey(source.Name) && allowedTags[source.Name].Contains(f.Name)) || commonTags.Contains(f.Name)).Select(f => new OmdbFieldBinding {Field = f, Type = source});
                });

            Task.Run(() =>
            {
                UtilityMethods.WaitFor(() => OmdbGraph.Instance != null && OmdbGraph.Instance.ObjectTypes.ContainsKey("UserTag"));
                AddField(
                    new FieldType()
                    {
                        Name = "userTags",
                        ResolvedType = new ListGraphType(OmdbGraph.Instance.ObjectTypes["UserTag"]),
                        Resolver = new FuncFieldResolver<ObjectGraphType, dynamic>(async ctx =>
                        {
                            var batchLoader = dataLoader.Context.GetOrAddCollectionBatchLoader<string, dynamic>("omdb_userTags", omdb.BatchLoadUserTagsByObjectType);
                            var result = batchLoader.LoadAsync(ctx.Source.Name);
                            return result;
                        })
                    });
            });

            Field<OmdbUiQueryGraph>()
                .Name("ui")
                .ResolveAsync(async ctx =>
                {
                    var objectTypeName = (ctx.Source as ObjectGraphType).Name;
                    var batchLoader = dataLoader.Context.GetOrAddBatchLoader<string, OmdbUi>("omdb_ui", omdb.BatchLoadOmdbUi);
                    return batchLoader.LoadAsync(objectTypeName);
                });
        }
    }

//    public class OmdbUserTagGraph : ObjectGraphType<OmdbUserTag>
//    {
//        public OmdbUserTagGraph(OmdbService omdb, IDataLoaderContextAccessor dataLoader)
//        {
//            Name = "UserTag";
//
//            this.DelayedAddInstance("dbObject");
//
//            Field<IdGraphType>().Name("_id").Resolve(ctx => ctx.Source._id.ToString());
//            Field(x => x.name);
//            Field(x => x.label, nullable: true);
//            Field(x => x.objectTypes);
//            Field(x => x.multiple, nullable:true);
//            Field<ListGraphType<OmdbUserTagValueGraph>>().Name("values").ResolveAsync(async ctx =>
//            {
//                var batchLoader = dataLoader.Context.GetOrAddCollectionBatchLoader<string, OmdbUserTagValue>("omdb_userTagValues", omdb.BatchLoadUserTagValuesByUserTag);
//                var result = await batchLoader.LoadAsync(ctx.Source._id.ToString());
//                return result;
//            });
//
//        }
//    }
//
//    public class OmdbUserTagValueGraph : ObjectGraphType<OmdbUserTagValue>
//    {
//        public OmdbUserTagValueGraph(OmdbService omdb, IDataLoaderContextAccessor dataLoader)
//        {
//            Name = "UserTagValue";
//
//            this.DelayedAddInstance("dbObject");
//
//            Field<IdGraphType>().Name("_id").Resolve(ctx => ctx.Source._id.ToString());
//            Field(x => x.value);
//            Field(x => x.label, nullable:true);
//            Field(x => x.background, nullable:true);
//            Field(x => x.color, nullable:true);
//            Field(x => x.align, nullable:true);
//
//            Field<IdGraphType>().Name("tagId").Resolve(ctx => ctx.Source.tag.ToString());
//            Field<OmdbUserTagGraph>().Name("tag").ResolveAsync(async ctx =>
//            {
//                var batchLoader = dataLoader.Context.GetOrAddBatchLoader<string, OmdbUserTag>("omdb_userTag", omdb.BatchLoadUserTagsById);
//                var result = await batchLoader.LoadAsync(ctx.Source.tag.ToString());
//                return result;
//            });
//
//
//        }
//    }
}
