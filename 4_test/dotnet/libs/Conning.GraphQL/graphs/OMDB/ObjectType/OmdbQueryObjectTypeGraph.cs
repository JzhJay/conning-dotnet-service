using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    /// <summary>
    /// A specific typed object in the query tree
    /// {
    ///     omdb {
    ///         typed {
    ///             simulation { # you are here
    ///                 distinct, find, get,
    ///                 insert, delete, update
    ///         } } } }  
    /// </summary>
    public class OmdbQueryObjectTypeGraph : ObjectGraphType
    {
        public OmdbService Omdb { get; }
        public ILogger<OmdbGraph> Log { get; }
        public ObjectGraphType ObjectType { get; }
        public OmdbQueryInputGraph SearchInputGraph { get; }

        public OmdbQueryObjectTypeGraph(OmdbService omdb, ILogger<OmdbGraph> log, ObjectGraphType objectType, OmdbQueryInputGraph searchInputGraph, IDataLoaderContextAccessor dataLoader)
        {
            Omdb = omdb;
            Log = log;
            ObjectType = objectType;
            SearchInputGraph = searchInputGraph;
            Name = $"omdb_{objectType.Name}";

//            var uiType = new OmdbUiQueryGraph(omdb, objectType, dataLoader);
            Field<OmdbUiQueryGraph>()
                .Name("ui")
                .Description("UI Layout Information for a given object type")
                .ResolveAsync(async ctx =>
                {
                    var batchLoader = dataLoader.Context.GetOrAddBatchLoader<string, OmdbUi>("omdb_ui_byObjectType", omdb.BatchLoadOmdbUi);
                    
                    return await batchLoader.LoadAsync(objectType.Name).GetResultAsync();
                });
                    
            OmdbQueryResultGraph.RegisterField(this);
            OmdbDistinctGraph.RegisterField(this);

            Field<IntGraphType>().Name("count").ResolveAsync(async ctx =>
            {
                return await omdb.db.GetCollection<dynamic>(objectType.Name).CountDocumentsAsync(Builders<dynamic>.Filter.Empty);
            });

            //AddField(
                //new FieldType()
                //{
                //    Name = "tags",
                //    ResolvedType = new ListGraphType(new OmdbTagGraph()),
                //    Resolver = new FuncFieldResolver<object>(ctx =>
                //    {
                //        return objectType.Fields.Select(f => new OmdbTagGraph(f)).ToList();
                //    })
                //});

            Field<ListGraphType<OmdbTagGraph>>().Name("tags").Resolve(ctx =>
            {
                return objectType.Fields;
            });
        }

        public static void RegisterGraph(IObjectGraphType parent, OmdbGraph queryGraph, ISchema schema,
            ObjectGraphType gqlType, OmdbQueryInputGraph searchInputGraphType,
            IDataLoaderContextAccessor dataLoader)
        {
            var omdbGraph = parent.Fields.Find("omdb").ResolvedType as ObjectGraphType;

            omdbGraph = omdbGraph.Fields.Find("typed").ResolvedType as ObjectGraphType;

            var omdbQueryObjectGraph = new OmdbQueryObjectTypeGraph(queryGraph.Omdb, queryGraph.Log, gqlType,
                searchInputGraphType, dataLoader);
            
            schema.RegisterType(omdbQueryObjectGraph);

            var name = gqlType.Name.ToCamelCase();
            if (!omdbGraph.HasField(name))
                omdbGraph.AddField(
                    new FieldType()
                    {
                        Name = name,
                        Description = $"Wrapper for omdb type '{gqlType.Name}'",
                        ResolvedType = omdbQueryObjectGraph,
                        Resolver = new FuncFieldResolver<object>(ctx => { return omdbQueryObjectGraph; })
                    });          
        }    
    }
}