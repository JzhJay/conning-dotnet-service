using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Types;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class OmdbUiQueryGraph : ObjectGraphType<OmdbUi>
    {
        private OmdbService _omdb;

        public OmdbUiQueryGraph(OmdbService omdb, IDataLoaderContextAccessor dataLoader)
        {
            Name = $"omdb_ui_object";
            _omdb = omdb;

            Field<StringGraphType>("objectType", resolve: ctx => ctx.Source.objectType);

            // var catalogGraph = new UiCatalogGraph(omdb, gqlType);
            // Todo - use a batch loader to get the underlying UI object once and then resolve the respective field
            Field<JsonGraphType>()
                .Name("catalog")
                .Resolve(ctx => { return ctx.Source.catalog; });

            Field<JsonGraphType>()
                .Name("card")
                .Resolve(ctx =>
                {
                    var cardUi = ctx.Source.card;
                    if (cardUi != null && cardUi.sections != null)
                    {
                        var gqlType = OmdbGraph.Instance.ObjectTypes[ctx.Source.objectType];
                        foreach (var section in ctx.Source.card.sections)
                        {
                            if (section.tags != null)
                            {
                                foreach (var tag in section.tags)
                                {
                                    var tagAsDict = tag as IDictionary<string, object>;
                                    if (tag.name != null && (!tagAsDict.ContainsKey("internal") || (bool) tagAsDict["internal"] != true))
                                    {
                                        var name = (string) tag.name;
                                        var field = gqlType.Fields.Find(name);
                                        if (field != null)
                                        {
                                            var type = field.InnerResolvedType(out var isNonNull, out var isList, out var isListItemNonNull);
                                            tag.type = type.Name;
                                            tag.multiple = isList;
                                            tag.required = isNonNull;
                                        }
                                        else
                                        {
                                            OmdbGraph.Instance.Log.LogError($"Unknown UI field '{HttpUtility.UrlEncode(name)}' on object type '{HttpUtility.UrlEncode(ctx.Source.objectType)}");
                                        }
                                    }
                                }
                            }
                        }
                    }

                    return ctx.Source.card;
                });

            Field<OmdbTableUiGraph>()
                .Name("table")
                .Resolve(ctx =>
                {
                    return ctx.Source.table;
                });

            Field<BooleanGraphType>().Name("uniqueName");
        }
    }

    public class OmdbTableUiGraph : ObjectGraphType<dynamic>
    {
        public OmdbTableUiGraph()
        {
            Field<IntGraphType>()
                .Name("frozenColumns")
                .Resolve(ctx =>
                {
                    var dict = ctx.Source as IDictionary<string, object>;
                    if (dict.TryGetValue("frozenColumns", out var frozenColumns))
                    {
                        return frozenColumns;
                    }

                    return null;
                });

            Field<JsonGraphType>()
                .Name("columns")
                .Resolve(ctx =>
                {
                    var dict = ctx.Source as IDictionary<string, object>;
                    if (dict.TryGetValue("columns", out var columns))
                    {
                        return columns;
                    }

                    return null;
                });
        }
    }

    public class OmdbUiMutationGraph : ObjectGraphType<dynamic>
    {
	    public OmdbUiMutationGraph(OmdbGraph omdbGraph)
	    {
		    Name = $"omdb_ui_mutation";

		    Field<OmdbUiMutationGraph_catalog>()
			    .Name("catalog")
			    .Resolve((ctx) => new OmdbUiMutationGraph_catalog(omdbGraph));

		    Field<OmdbUiMutationGraph_table>()
			    .Name("table")
			    .Resolve((ctx) => new OmdbUiMutationGraph_table(omdbGraph));

		    Field<OmdbUiMutationGraph_card>()
			    .Name("card")
			    .Resolve((ctx) => new OmdbUiMutationGraph_card(omdbGraph));

		    Field<OmdbUiMutationGraph_uniqueName>()
			    .Name("uniqueName")
			    .Resolve((ctx) => new OmdbUiMutationGraph_uniqueName(omdbGraph));
	    }
    }

    public class OmdbUserTagDefault : ObjectGraphType<dynamic>
    {

	    public OmdbUserTagDefault(OmdbGraph omdbGraph)
	    {
		    Name = $"omdb_user_tag_default";

		    Field<JsonGraphType>()
			    .Name("set")
			    .Argument<StringGraphType>("tagId", "")
			    .ResolveAsync( async (ctx) =>
			    {
				    var tagId = ctx.GetArgument<string>("tagId", default(string)).TryConvertToObjectId();

				    var collection = omdbGraph.Omdb.db.GetCollection<BsonDocument>("UserTag");
				    var tag = await collection
					    .Find(Builders<BsonDocument>.Filter.Eq("_id", tagId))
					    .SingleAsync();
				    if (tag == null )
				    {
					    throw new ArgumentException($"No record was found in collection 'Tag' - id: '{tagId}'");
				    }
				    var ObjectTypes = tag.GetValue("objectTypes").AsBsonArray.Select(ot => ot.AsString);

				    collection = omdbGraph.Omdb.db.GetCollection<BsonDocument>("UserTagValue");
				    var tagValues = await collection
					    .Find(Builders<BsonDocument>.Filter.Eq("tag", tagId))
					    .ToListAsync();

				    if (tagValues == null || tagValues.Count == 0)
				    {
					    throw new ArgumentException($"No record was found in collection 'UserTag' - tag: '{tag.GetValue("name")}'");
				    }
				    var valueIds = tagValues.Select( document => document.GetValue("_id"));
				    var defaultValueIds = tagValues
					    .Where(document =>
					    {
						    return document.Contains("isDefault") && document.GetValue("isDefault").AsBoolean;

					    })
					    .Select( document => document.GetValue("_id"));

				    var updateCounts = new Dictionary<String, int>();
				    var updateDict = new Dictionary<String, Object>();
				    foreach (var objectType in ObjectTypes)
				    {
					    var otCollection = omdbGraph.Omdb.db.GetCollection<BsonDocument>(objectType);
					    var records = await otCollection.Find(Builders<BsonDocument>.Filter.AnyNin("userTagValues", valueIds)).ToListAsync();
					    foreach (var record in records)
					    {
						    List<BsonValue> userTagValues = null;
						    if (record.Contains("userTagValues") && record.GetValue("userTagValues") is BsonArray)
						    {
							    userTagValues = record.GetValue("userTagValues").AsBsonArray.ToList();
							    userTagValues.AddRange(defaultValueIds);
						    }
						    else
						    {
							    userTagValues = defaultValueIds.ToList();
						    }
						    updateDict.Clear();
						    updateDict.Add("userTagValues", userTagValues);
						    await otCollection.UpdateOneAsync(Builders<BsonDocument>.Filter.Eq("_id", record.GetValue("_id")), new BsonDocument("$set", new BsonDocument(updateDict)));
						}
					    updateCounts.Add(objectType, records.Count);
				    }

				    return updateCounts.ToJson();
			    });
	    }
    }

    public class OmdbUiMutationGraph_catalog : ObjectGraphType<dynamic>
    {

	    public OmdbUiMutationGraph_catalog(OmdbGraph omdbGraph)
	    {
		    Name = $"omdb_ui_catalog_mutation";

		    Field<JsonGraphType>()
			    .Name("update")
			    .Argument<StringGraphType>("objectType", "")
			    .Argument<ListGraphType<OmdbUiCatalogTagGraphType>>("tags", "")
			    .ResolveAsync( async (ctx) =>
			    {
				    var objectType = ctx.GetArgument<string>("objectType", default(string));
				    var dict = new Dictionary<string, dynamic>();
				    dict["objectType"] = objectType;
				    dict["catalog"] = new Dictionary<string, dynamic>();
				    dict["catalog"]["tags"] = ctx.ArgumentArrayValue<Dictionary<String,Object>>("tags");

				    var collection = omdbGraph.Omdb.db.GetCollection<BsonDocument>("omdb_ui");
				    var record = await collection
					    .Find(Builders<BsonDocument>.Filter.Eq("objectType", objectType))
					    .FirstOrDefaultAsync();

				    if (record == null)
				    {
					    throw new ArgumentException($"No record was found in collection 'omdb_ui' - objectType: '{objectType}'");
				    }
				    var result = await collection.UpdateOneAsync(Builders<BsonDocument>.Filter.Eq("objectType", objectType), new BsonDocument("$set", new BsonDocument(dict)));
				    return result;
			    });
	    }
    }

    public class OmdbUiMutationGraph_table : ObjectGraphType<dynamic>
    {

	    public OmdbUiMutationGraph_table(OmdbGraph omdbGraph)
	    {
		    Name = $"omdb_ui_table_mutation";

		    Field<JsonGraphType>()
			    .Name("update")
			    .Argument<StringGraphType>("objectType", "")
			    .Argument<IntGraphType>("frozenColumns", "")
			    .Argument<ListGraphType<OmdbUiTableColumnGraphType>>("columns", "")
			    .ResolveAsync( async (ctx) =>
			    {
				    var objectType = ctx.GetArgument<string>("objectType", default(string));
				    var frozenColumns = ctx.GetArgument<int>("frozenColumns", default(int));
				    var columns = ctx.ArgumentArrayValue<Dictionary<String,Object>>("columns");
				    var dict = new Dictionary<string, dynamic>();
				    dict["objectType"] = objectType;
				    dict["table"] = new Dictionary<string, dynamic>();
				    dict["table"]["frozenColumns"] = frozenColumns;
				    dict["table"]["columns"] = columns;

				    var collection = omdbGraph.Omdb.db.GetCollection<BsonDocument>("omdb_ui");
				    var record = await collection
					    .Find(Builders<BsonDocument>.Filter.Eq("objectType", objectType))
					    .FirstOrDefaultAsync();

				    if (record == null)
				    {
					    throw new ArgumentException($"No record was found in collection 'omdb_ui' - objectType: '{objectType}'");
				    }
				    var result = await collection.UpdateOneAsync(Builders<BsonDocument>.Filter.Eq("objectType", objectType), new BsonDocument("$set", new BsonDocument(dict)));
				    return result;
			    });
	    }
    }

    public class OmdbUiMutationGraph_card : ObjectGraphType<dynamic>
    {

	    public OmdbUiMutationGraph_card(OmdbGraph omdbGraph)
	    {
		    Name = $"omdb_ui_card_mutation";

		    Field<JsonGraphType>()
			    .Name("update")
			    .Argument<StringGraphType>("objectType", "")
			    .Argument<ListGraphType<OmdbUiCardGraphType>>("sections", "")
			    .ResolveAsync( async (ctx) =>
			    {
				    var objectType = ctx.GetArgument<string>("objectType", default(string));
				    var dict = new Dictionary<string, dynamic>();
				    dict["objectType"] = objectType;
				    dict["card"] = new Dictionary<string, dynamic>();
				    dict["card"]["sections"] = ctx.ArgumentArrayValue<Dictionary<String,Object>>("sections");

				    var collection = omdbGraph.Omdb.db.GetCollection<BsonDocument>("omdb_ui");
				    var record = await collection
					    .Find(Builders<BsonDocument>.Filter.Eq("objectType", objectType))
					    .FirstOrDefaultAsync();

				    if (record == null)
				    {
					    throw new ArgumentException($"No record was found in collection 'omdb_ui' - objectType: '{objectType}'");
				    }
				    var result = await collection.UpdateOneAsync(Builders<BsonDocument>.Filter.Eq("objectType", objectType), new BsonDocument("$set", new BsonDocument(dict)));
				    return result;
			    });
	    }
    }

    public class OmdbUiMutationGraph_uniqueName : ObjectGraphType<dynamic>
    {

	    public OmdbUiMutationGraph_uniqueName(OmdbGraph omdbGraph)
	    {
		    Name = $"omdb_ui_uniqueName_mutation";

		    Field<JsonGraphType>()
			    .Name("update")
			    .Argument<StringGraphType>("objectType", "")
			    .Argument<BooleanGraphType>("uniqueName", "")
			    .ResolveAsync( async (ctx) =>
			    {
				    var objectType = ctx.GetArgument<string>("objectType", default(string));
				    var dict = new Dictionary<string, dynamic>();
				    dict["objectType"] = objectType;
				    dict["uniqueName"] = ctx.GetArgument<bool>("uniqueName", default(bool));

				    var collection = omdbGraph.Omdb.db.GetCollection<BsonDocument>("omdb_ui");
				    var record = await collection
					    .Find(Builders<BsonDocument>.Filter.Eq("objectType", objectType))
					    .FirstOrDefaultAsync();

				    if (record == null)
				    {
					    throw new ArgumentException($"No record was found in collection 'omdb_ui' - objectType: '{objectType}'");
				    }
				    var result = await collection.UpdateOneAsync(Builders<BsonDocument>.Filter.Eq("objectType", objectType), new BsonDocument("$set", new BsonDocument(dict)));
				    return result;
			    });
	    }
    }

    public class OmdbUiCatalogTagGraphType : InputObjectGraphType
    {
        public OmdbUiCatalogTagGraphType()
        {
            Name = $"omdb_UiCatalogTag_update";
            Field<StringGraphType>().Name("_id");
            Field<StringGraphType>().Name("name");
            Field<BooleanGraphType>().Name("reserved");
        }
    }

    public class OmdbUiTableColumnGraphType : InputObjectGraphType
    {
	    public OmdbUiTableColumnGraphType()
	    {
		    Name = $"omdb_UiTableColumn_update";
		    Field<StringGraphType>().Name("_id");
		    Field<StringGraphType>().Name("name");
		    Field<StringGraphType>().Name("align");
		    Field<IntGraphType>().Name("defaultWidth");
		    Field<BooleanGraphType>().Name("internal");
		    Field<BooleanGraphType>().Name("wordWrap");
		    Field<BooleanGraphType>().Name("canSort");
		    Field<BooleanGraphType>().Name("reserved");
	    }
    }

    public class OmdbUiCardGraphType : InputObjectGraphType
    {
	    public OmdbUiCardGraphType()
	    {
		    Name = $"omdb_UiCard_update";
		    Field<StringGraphType>().Name("label");
		    Field<ListGraphType<OmdbUiCardTagGraphType>>().Name("tags");
		}
    }

    public class OmdbUiCardTagGraphType : InputObjectGraphType
    {
	    public OmdbUiCardTagGraphType()
	    {
		    Name = $"omdb_UiCardTag_update";
		    Field<StringGraphType>().Name("_id");
		    Field<StringGraphType>().Name("name");
		    Field<BooleanGraphType>().Name("reserved");
		    Field<BooleanGraphType>().Name("hide");
		    Field<ListGraphType<StringGraphType>>().Name("viewableBy");
	    }
    }

}
