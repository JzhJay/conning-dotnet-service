using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conning.Db.Services;
using Conning.Library.Utility;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class OmdbQueryResultGraph : ObjectGraphType<OmdbQueryResult>
    {
        public OmdbQueryResultGraph(IGraphType omdbType = null)
        {
            if (omdbType == null)
            {
                Name = $"omdb_queryResult";
                Field<ListGraphType<JsonGraphType>>()
                    .Name("resultsRaw")
                    .Resolve(ctx => ctx.Source.results);

                Field<ListGraphType<OmdbUnionGraphType>>()
                    .Name("results")
                    .Resolve(ctx => ctx.Source.results);
            }
            else
            {
                Name = $"omdb_{omdbType.Name}_queryResult";
                AddField(new FieldType()
                {
                    Name = "results",
                    ResolvedType = new ListGraphType(omdbType),
                    Resolver = new FuncFieldResolver<object>(ctx => { return (ctx.Source as OmdbQueryResult).results; })
                });

                Field<ListGraphType<JsonGraphType>>()
                    .Name("resultsRaw")
                    .Resolve(ctx => ctx.Source.results);
            }

            Field(x => x.skipped);
            Field<OmdbQueryRunInputGraph>().Name("input");
            Field(x => x.total);
        }

        /**
         * Find for a specific object type
         */
        internal static void RegisterField(OmdbQueryObjectTypeGraph parent)
        {
            var genericField = parent; // parent.Fields.Find("generic").InnerResolvedType() as ObjectGraphType;

            var inputType = new OmdbQueryResultInputGraph(parent);
            genericField.AddField(
                new FieldType()
                {
                    Name = "find",
                    ResolvedType = new OmdbQueryResultGraph(parent.ObjectType),
                    Arguments = new QueryArguments(
                        new QueryArgument(inputType)
                        {
                            Name = "input",
                            //DefaultValue = input
                        }
                    ),

                    Resolver = new FuncFieldResolver<OmdbQueryResult>(async ctx =>
                    {
                        var input = ctx.GetArgument<Dictionary<string, object>>("input");
                        var skip = input.CoerceGraphQlValue("skip", 0);
                        var limit = input.CoerceGraphQlValue("limit", int.MaxValue);
                        var searchText = input.CoerceGraphQlValue("searchText", "");
                        var sortBy = input.CoerceGraphQlValue("sortBy", "");
                        var sortOrder = input.CoerceGraphQlValue("sortOrder", "asc");
                        var whereParams = input.CoerceGraphQlValue<Dictionary<string, object>>("where");
                        var searchTags = input.CoerceGraphQlArrayValue<string>("searchTags");
                        var favorites = input.CoerceGraphQlArrayValue<string>("favorites");
                      
                        var result = await parent.Omdb.RunQueryAsync(new[] {parent.ObjectType.Name}, whereParams, skip, limit, searchText, sortBy, sortOrder, searchTags, favorites);
                        return result;
                    })
                });

            genericField.AddField(
                new FieldType()
                {
                    Name = "get",
                    ResolvedType = parent.ObjectType,
                    Arguments = new QueryArguments(
                        new QueryArgument<NonNullGraphType<IdGraphType>>() {Name = "_id"}
                    ),

                    Resolver = new FuncFieldResolver<dynamic>(async ctx =>
                    {
                        var id = ctx.GetArgument<string>("_id");

                        var result = await parent.Omdb.FindOneAsync(parent.ObjectType.Name, id);

                        return result == null ? null : result;
                    })
                });

            genericField.AddField(
                new FieldType()
                {
                    Name = "gets",
                    ResolvedType = new ListGraphType(parent.ObjectType),
                    Arguments = new QueryArguments(
                        new QueryArgument<NonNullGraphType<ListGraphType<NonNullGraphType<IdGraphType>>>>() {Name = "_ids"}
                    ),

                    Resolver = new FuncFieldResolver<dynamic>(async ctx =>
                    {
                        var ids = ctx.ArgumentArrayValue<string>("_ids");

                        if (!ids.Any())
                        {
                            return null;
                        }

                        var results = await parent.Omdb.FindAsync(parent.ObjectType.Name, ids);

                        return results;
                    })
                });
        }

        /**
         * 
         */
        internal static void RegisterField(OmdbGraph omdbGraph, ObjectGraphType parent)
        {
            parent.Field<OmdbUnionGraphType>()
                .Name("get")
                .Argument<NonNullGraphType<IdGraphType>>("_id", "")
                .Argument<NonNullGraphType<StringGraphType>>("objectType", "")
                .ResolveAsync(async ctx =>
                {
                    var id = ctx.GetArgument<string>("_id");

                    if (String.IsNullOrEmpty(id))
                    {
                        throw new ArgumentException("_id must be specified.");
                    }

                    var objectType = ctx.GetArgument<string>("objectType");
                    var result = await omdbGraph.Omdb.FindOneAsync(objectType, id);

                    return result == null ? null : result;
                });
            parent.Field<ListGraphType<OmdbUnionGraphType>>()
                .Name("gets")
                .Argument<NonNullGraphType<ListGraphType<NonNullGraphType<IdGraphType>>>>("_ids", "")
                .Argument<NonNullGraphType<StringGraphType>>("objectType", "")
                .ResolveAsync(async ctx =>
                {
                    var ids = ctx.ArgumentArrayValue<string>("_ids");

                    if (!ids.Any())
                    {
                        throw new ArgumentException("_ids must be specified.");
                    }

                    var objectType = ctx.GetArgument<string>("objectType");

                    var results = await omdbGraph.Omdb.FindAsync(objectType, ids);
                    return results;
                });

            // Generic Find
            parent.AddField(
                new FieldType()
                {
                    Name = "find",
                    ResolvedType = new OmdbQueryResultGraph(),
                    Arguments = new QueryArguments(
                        new QueryArgument(new OmdbQueryResultInputGraph())
                        {
                            Name = "input"
                        }),
                    Resolver = new FuncFieldResolver<OmdbQueryResult>(async ctx =>
                    {
                        var input = ctx.GetArgument<Dictionary<string, object>>("input");

                        var objectTypes = input.CoerceGraphQlArrayValue<string>("objectTypes");
                        var skip = input.CoerceGraphQlValue("skip", 0);
                        var limit = input.CoerceGraphQlValue("limit", int.MaxValue);
                        var searchText = input.CoerceGraphQlValue("searchText", "");
                        var sortBy = input.CoerceGraphQlValue("sortBy", "");
                        var sortOrder = input.CoerceGraphQlValue("sortOrder", "asc");
                        var whereParams = input.CoerceGraphQlValue<Dictionary<string, object>>("where");
                        var searchTags = input.CoerceGraphQlArrayValue<string>("searchTags");
                        var favorites = input.CoerceGraphQlArrayValue<string>("favorites");
                        var path = input.CoerceGraphQlValue<string>("path", null);

                        if (!objectTypes.Any())
                        {
                            objectTypes = omdbGraph.DbObjectTypes.ToArray();
                        }

                        var results = await omdbGraph.Omdb.RunQueryAsync(objectTypes, whereParams, skip, limit, searchText, sortBy, sortOrder, searchTags, favorites, path);

                        return results;
                    })
                });
        }
    }

    public class OmdbQueryResultInputGraph : InputObjectGraphType
    {
        public OmdbQueryResultInputGraph(OmdbQueryObjectTypeGraph parent = null)
        {
            Field<IntGraphType>().Name("skip").DefaultValue(0).Description("The number of elements to skip");
            Field<IntGraphType>().Name("limit").DefaultValue(int.MaxValue).Description("The maximum number of elements to retrieve");
            Field<StringGraphType>().Name("searchText").Description("Text to search for (case-insensitive)").DefaultValue("");
            Field<StringGraphType>().Name("sortBy").Description("Column to sort by").DefaultValue("");
            Field<StringGraphType>().Name("sortOrder").DefaultValue("asc").Description("asc or desc");
            var whereField = Field<JsonGraphType>().Name("where").Description("{field1: value1). field2: value2 }");

            if (parent == null)
            {
                Name = $"omdb_queryResultInput";
                Field<ListGraphType<StringGraphType>>().Name("objectTypes");
            }
            else
            {
                Name = $"omdb_{parent.ObjectType.Name}_queryResultInput";
                whereField.FieldType.ResolvedType = parent.SearchInputGraph;
            }

            Field<ListGraphType<StringGraphType>>().Name("searchTags").DefaultValue(null).Description("Searchable tags");
            Field<ListGraphType<StringGraphType>>().Name("favorites").DefaultValue(null).Description("Favorite values to be ordered first in result");
            Field<StringGraphType>().Name("path").DefaultValue(null).Description("path/directory that is being queried");
        }
    }

    public class OmdbQueryRunInputGraph : ObjectGraphType<OmdbQueryRunInput>
    {
        public OmdbQueryRunInputGraph()
        {
            Name = "omdb_queryRun_input";
            Field(x => x.searchText);
            Field(x => x.limit);
            Field(x => x.sortBy);
            Field(x => x.objectTypes, true);
            Field<JsonGraphType>().Name("where").Resolve(ctx => ctx.Source.where.ToDynamic());
            Field(x => x.sortOrder);
        }
    }

    /*
     * System.NullReferenceException: Object reference not set to an instance of an object.
   at GraphQL.GraphQLExtensions.IsValidLiteralValue(IGraphType type, IValue valueAst, ISchema schema)
   at GraphQL.GraphQLExtensions.<>c__DisplayClass7_3.<IsValidLiteralValue>b__3(FieldType field)
   at GraphQL.EnumerableExtensions.Apply[T](IEnumerable`1 items, Action`1 action)
     */
//    public class OmdbQueryResultTypedGraph : ObjectGraphType<OmdbQueryResult>
//    {
//        public OmdbQueryResultTypedGraph()
//        {
//            Name = $"omdb_queryResultTyped";
//            Field<ListGraphType<OmdbUnionObjectType>>().Name("results").Resolve(ctx =>
//            {
//                var results = new List<dynamic>();
//                foreach (var r in ctx.Source.results)
//                {
//                    r.value.objectType = r.objectType;
//                    results.Add(r.value);
//                }
//
//                return results; //return results.Keys.Select(k => new OmdbQueryResultForObjectType() { objectType = k, results = results[k]}).ToList();
//            });
//        }
//    }
}