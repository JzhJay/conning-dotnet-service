using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Types;

namespace Conning.GraphQL
{
    public class DistinctTagValuesInput
    {
        public IEnumerable<string> tags { get; set; }
        public string searchText { get; set; }
        public dynamic where { get; set; }
    }

    public class DistinctTagValuesInputGraph : ObjectGraphType<DistinctTagValuesInput>
    {
        public DistinctTagValuesInputGraph()
        {
            Name = "DistinctTagValuesInput";
            Field(x => x.tags);
            Field(x => x.searchText, nullable:true);
            Field<JsonGraphType>().Name("where").Resolve(ctx => ctx.Source.where);
        }
    }
    
    public class DistinctTagValues
    {
        public string objectType { get; set; }
        public List<DistinctTagValuesEntry> tags { get; set; }
    }

    public class OmdbDistinctResult {
        public DistinctTagValuesInput input { get; set; }
        public IEnumerable<DistinctTagValues> results { get; set; }
    }
    
    public class OmdbDistinctResultGraph : ObjectGraphType<OmdbDistinctResult>
    {
        public OmdbDistinctResultGraph()
        {
            Field<ListGraphType<OmdbDistinctGraph>>()
                .Name("results")
                .Resolve(ctx => ctx.Source.results);
            
            Field<DistinctTagValuesInputGraph>()
                .Name("input")
                .Resolve(ctx => ctx.Source.input);
        }
    }
    
    public class OmdbDistinctGraph : ObjectGraphType<DistinctTagValues>
    {
        public OmdbDistinctGraph()
        {
            Name = "omdb_distinct_untyped";

            Field(x => x.objectType, true);
            Field<ListGraphType<OmdbDistinctTagValuesEntryGraph>>().Name("tags");
        }

        public static void RegisterField(OmdbQueryObjectTypeGraph parent)
        {
            var distinctField = parent
                .Field<OmdbDistinctResultGraph>()
                .Name("distinct");

            distinctField.FieldType.Arguments = new QueryArguments(
                new QueryArgument<ListGraphType<StringGraphType>>()
                {
                    Name = "tags",
                    Description = "The tags to select values for",
                    DefaultValue = parent.ObjectType.ValidOmdbDistinctFields()
                },
                new QueryArgument<StringGraphType>()
                {
                    Name = "searchText",
                    Description = "Text to search for (case-insensitive)",
                    DefaultValue = ""
                },
                new QueryArgument(parent.SearchInputGraph)
                {
                    Name = "where",
                    Description = "{field1: value1, field2: value2 }",
                    DefaultValue = null
                }
            );
            distinctField.ResolveAsync(async ctx =>
            {
                var tags = ctx.ArgumentArrayValue<string>("tags");
                var searchText = ctx.GetArgument<string>("searchText", default(string));
                var where = ctx.HasArgument("where")
                    ? ctx.GetArgument<Dictionary<string, object>>("where")
                    : new Dictionary<string, object>();
                var path = ctx.GetArgument<string>("path", default(string));

                var userId = ctx.GetSecureUserId(out var user);
                var results = new List<DistinctTagValues>();

                var input = new DistinctTagValuesInput()
                {
                    tags =  tags,
                    where = where,
                    searchText = searchText
                };
                
                var gqlType = parent.ObjectType;

                if (!tags.Any())
                {
                    // Get the tags for the specified object type
                    tags = gqlType.ValidOmdbDistinctFields().ToList();
                }

                var distinctForObjectType = await parent.Omdb.getDistinctTagValuesPostgres(new[] {gqlType}, tags, searchText, where, path);
                var distinctTags = distinctForObjectType[gqlType.Name];
                foreach (var tag in distinctTags)
                {
                    var field = gqlType.Fields.Find(tag.tag);
                    tag.tagType = field.Type != null ? field.Type.Name : field.InnerResolvedType().Name;
                }


                results.Add(new DistinctTagValues {objectType = gqlType.Name, tags = distinctTags});

                return new OmdbDistinctResult
                {
                    input = input,
                    results = results
                };
            });


//            parent.AddField(
//                new FieldType()
//                {
//                    Name = "distinct",
//                    ResolvedType = new ListGraphType(new OmdbDistinctGraph()),
//                    Arguments = new QueryArguments(
//                        new QueryArgument<ListGraphType<StringGraphType>>()
//                        {
//                            Name = "tags",
//                            Description = "The tags to select values for",
//                            DefaultValue = parent.ObjectType.ValidOmdbDistinctFields()
//                        },
//                        new QueryArgument<StringGraphType>()
//                        {
//                            Name = "searchText",
//                            Description = "Text to search for (case-insensitive)",
//                            DefaultValue = ""
//                        },
//                        new QueryArgument(parent.SearchInputGraph)
//                        {
//                            Name = "where",
//                            Description = "{field1: value1, field2: value2 }",
//                            DefaultValue = null
//                        }
//                    ),
//
//                    Resolver = new AsyncFieldResolver<object>(async ctx =>
//                    {
//                        var tags = ctx.ArgumentArrayValue<string>("tags");
//                        var searchText = (string) ctx.Arguments["searchText"];
//                        var whereParams = ctx.HasArgument("where")
//                            ? (Dictionary<string, object>) ctx.Arguments["where"]
//                            : new Dictionary<string, object>();
//
//
//                        var dictResult = await parent.Omdb.getDistinctTagValues(parent.ObjectType.Name, tags, searchText, whereParams);
//
//                        var results = new List<DistinctTagValues>();
//                        var distinctTags = dictResult[parent.ObjectType.Name];
//                        
//                        foreach (var tag in distinctTags)
//                        {
//                            
//                            var field = parent.ObjectType.Fields.Find(tag.tag);                            
//                            tag.tagType = field.Type != null ? field.Type.Name : field.InnerResolvedType().Name;
//                        }
//
//                        results.Add(new DistinctTagValues() {objectType = parent.ObjectType.Name, tags = distinctTags});
//
//                        return results;
//                    })
//                });
        }

        public static void RegisterField(OmdbGraph omdbGraph, ObjectGraphType parent)
        {
            parent
                .Field<OmdbDistinctResultGraph>()
                .Name("distinct")
                .Description("Group by the specified tags and detemine unique values and counts.  Suitable for use in a catalog sidebar drilldown component.")
                .Argument<NonNullGraphType<OmdbDistinctInputGraph>>("input", "")
                .ResolveAsync(async ctx =>
                {
                    var input = ctx.GetArgument<Dictionary<string, object>>("input", default(Dictionary<string, object>));

                    var objectTypes = input.CoerceGraphQlArrayValue<string>("objectTypes").ToArray();
                    var inputTags = input.CoerceGraphQlArrayValue<string>("tags");
                    var searchText = input.CoerceGraphQlValue<string>("searchText");
                    var where = input.CoerceGraphQlValue<Dictionary<string, object>>("where") ??
                                new Dictionary<string, object>();
                    var path = input.CoerceGraphQlValue<string>("path");

                    var userId = ctx.GetSecureUserId(out var user);
                    var results = new List<DistinctTagValues>();

                    if (!objectTypes.Any())
                    {
                        objectTypes = omdbGraph.DbObjectTypes.OrderBy(s => s).ToArray();
                    }

                    await Task.WhenAll(objectTypes.Select(ot =>
                        Task.Run(async () =>
                        {
                            Thread.CurrentPrincipal = ctx.UserContext as IPrincipal;
                            var gqlType = omdbGraph.ObjectTypes[ot];

                            var tags = inputTags.Any() ? inputTags : gqlType.ValidOmdbDistinctFields();

                            var distinctForObjectType = await omdbGraph.Omdb.getDistinctTagValues(new[] {gqlType}, tags, searchText, where, path);
                            var distinctTags = distinctForObjectType[ot];
                            foreach (var tag in distinctTags)
                            {
                                if (tag.isUserTag)
                                {
                                    tag.tagType = "String";
                                }
                                else if(tag.tagType != "userTag")
                                {
                                    var field = gqlType.Fields.Find(tag.tag);
                                    tag.tagType = field.Type != null ? field.Type.Name : field.InnerResolvedType().Name;
                                    tag.isUserTag = false;
                                }
                            }


                            results.Add(new DistinctTagValues() {objectType = ot, tags = distinctForObjectType[ot]});
                        })
                    ));

                    return new OmdbDistinctResult {results = results, input = new DistinctTagValuesInput {searchText = searchText, tags = inputTags, where = where}};
                });
        }
    }

    public class OmdbDistinctTagValuesEntryGraph : ObjectGraphType<DistinctTagValuesEntry>
    {
        public OmdbDistinctTagValuesEntryGraph()
        {
            Name = "omdb_distinct_tagValues";
            Field(x => x.tag).Name("tagName");
            Field(x => x.isUserTag);
            Field(x => x.tagType);
            Field<ListGraphType<JsonGraphType>>().Name("distinct").Resolve(ctx => { return ctx.Source.distinct.ToList(); });
            ;
        }
    }
}