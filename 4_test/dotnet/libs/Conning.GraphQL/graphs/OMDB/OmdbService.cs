using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Conning.Db.Services;
using Conning.Library.Utility;
using Conning.Models.OMDB;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Authorize = Microsoft.AspNetCore.Authorization;

namespace Conning.GraphQL
{
    #region Type Definitions

    public class OmdbQueryResult
    {
        public OmdbQueryResult()
        {
            results = new List<dynamic>();
        }

        public List<dynamic> results { get; set; }
        public long total { get; set; }
        public int skipped { get; set; }
        public OmdbQueryRunInput input { get; set; }
    }

    public class OmdbQueryRunInput
    {
        public int limit { get; set; }
        public string sortBy { get; set; }
        public string sortOrder { get; set; }
        public string searchText { get; set; }
        public List<string> objectTypes { get; set; }
        public Dictionary<string, object> where { get; set; }
    }

    public class DistinctTagValuesEntry
    {
        public string tagType { get; set; }
        public string tag { get; set; }
        public bool isUserTag { get; set; }
        public IEnumerable<dynamic> distinct { get; set; }
    }

    public class OmdbTag
    {
        public ObjectId _id { get; set; }
        public string[] objectTypes { get; set; }
        public string type { get; set; }
        public bool? mutates { get; set; }
        public string name { get; set; }
        public string label { get; set; }
        public bool? visible { get; set; }
        public bool? hierarchy { get; set; }
        public bool? multiple { get; set; }
        public bool? required { get; set; }
        public bool? canSearch { get; set; }
        public bool? canSort { get; set; }
        public bool? reserved { get; set; }
        public object @default { get; set; }
        public dynamic values { get; set; }
    }

    public class OmdbCardTag
    {
        public string name { get; set; }
        public bool? hideEmpty { get; set; }
        public string align { get; set; }
        public bool? wrapText { get; set; }
        public string[] classNames { get; set; }
        public string[] viewableBy { get; set; }
    }

//    public class OmdbUserTag
//    {
//        public ObjectId _id { get; set; }
//        public string name { get; set; }
//        public string label { get; set; }
//        public IEnumerable<string> objectTypes { get; set; }
//        public bool multiple { get; set; }
//        public string createdBy { get; set; }
//        public string modifiedBy { get; set; }
//        public DateTime createdTime { get; set; }
//        public DateTime? modifiedTime { get; set; }
//    }
//
//    public class OmdbUserTagValue
//    {
//        public ObjectId _id { get; set; }
//        public ObjectId tag { get; set; }
//        public string value { get; set; }
//        public string label { get; set; }
//        public string background { get; set; }
//        public string color { get; set; }
//        public string align { get; set; }
//        public string createdBy { get; set; }
//        public string modifiedBy { get; set; }
//        public DateTime createdTime { get; set; }
//        public DateTime? modifiedTime { get; set; }
//    }
    public class UiCardLayoutDefinitionSection
    {
        public ObjectId _id { get; set; }
        public string label { get; set; }
        public OmdbCardTag[] tags { get; set; }
    }

    public class OmdbUi
    {
        public ObjectId _id { get; set; }
        public string objectType { get; set; }
        public dynamic catalog { get; set; }
        public dynamic card { get; set; }
        public dynamic table { get; set; }

        public bool? uniqueName { get; set; }

        public string version { get; set; }
    }

    public class OmdbUpdateRecordTag
    {
        public string tag_id { get; set; }
        public string tag_name { get; set; }
        public object value { get; set; }
    }


    public class OmdbUpdateRecord
    {
        public string collection { get; set; }
        public string _id { get; set; }
        public OmdbUpdateRecordTag[] tags { get; set; }
    }

    public class OmdbUpdateUiRequest
    {
        public string objectType { get; set; }
        public dynamic fragment { get; set; }
    }

    #endregion

    public class OmdbService
    {
        public const int DEFAULT_QUERY_LIMIT = 20;

        private OmdbCache _cache;

        private MongoDbService _mongo;
        public ILogger<OmdbService> log;
        public const string UI_COLLECTION = "omdb_ui";

        public IMongoCollection<Folder> FolderCollection => db.GetCollection<Folder>("Folder");
        public IMongoCollection<FolderItem> FolderItemsCollection => db.GetCollection<FolderItem>("FolderItem");

        private readonly IOptions<AdviseAppSettings> _settings;

        public readonly string schemaVersion;

        public OmdbService(IMemoryCache cache, MongoDbService mongo, ILogger<OmdbService> _log, IOptions<AdviseAppSettings> settings)
        {
            _cache = new OmdbCache(this, cache);
            _mongo = mongo;
            log = _log;
            _settings = settings;
            schemaVersion = _settings.Value.omdb.schemaVersion;
            log.LogInformation($"OMDB schema version is {schemaVersion}");
        }

        public IMongoDatabase db => _mongo.database;

        public IEnumerable<string> ObjectTypes
        {
            get { return GetTags().SelectMany(t => t.objectTypes).Distinct(); }
        }

        [Authorize("read:tags")]
        public List<OmdbTag> GetTags(string objectType = null)
        {
            var tags = db.GetCollection<OmdbTag>("tags");

            var filter = Builders<OmdbTag>.Filter.Empty;

            /*
            // Throws System.InvalidOperationException: {document} is not supported.
            if (!string.IsNullOrEmpty(objectType))
            {
                filter = Builders<BsonDocument>.Filter.ElemMatch(
                    x => x.GetValue("objectTypes"),
                    ot => ot != null && ot.Contains(objectType));
            }
            */

            var results = tags
                .Find(filter)
                .ToList();

            // Do the filtering client-side due to error above :(
            if (!string.IsNullOrEmpty(objectType))
            {
                results = results.Where(t => t.objectTypes != null && t.objectTypes.Contains(objectType)).ToList();
            }

            return results.ToList();
        }

        public MongoDbService MongoService => this._mongo;

        public AdviseAppSettings Settings => _settings.Value;

        public static FilterDefinition<T> TryConvertRelatedSimulationFilter<T>(string fieldName, object fieldValue, ObjectGraphType gqlType)
        {
	        if (fieldName != "_relatedSimulation_")
	        {
		        return null;
	        }

	        fieldValue = fieldValue?.ToString().TryConvertToObjectId();
	        if (fieldValue == null)
	        {
		        return null;
	        }

	        FilterDefinition<T> innerQuery = null;
	        var filterBuilder = Builders<T>.Filter;

	        foreach (var field in new string[] {"simulation", "simulations", "assetReturnsSimulation", "companyDataSimulation", "companyDataRepository"})
	        {
		        if (gqlType.HasField(field))
		        {

			        var builder = field != "simulations" ? filterBuilder.Eq(field, fieldValue) : filterBuilder.AnyIn(field, new []
				        { fieldValue });
			        if (innerQuery == null)
			        {
				        innerQuery = builder;
			        }
			        else
			        {
				        innerQuery |= builder;
			        }
		        }
	        }

			return innerQuery;
        }

        private List<BsonDocument> GetAggregateAsyncPipeline(string objectType, IDictionary<string, object> whereParams, string searchText = "",
	        IEnumerable<string> searchTags = null)
        {
	        var gqlType = OmdbGraph.Instance.ObjectTypes[objectType];

	        var pipeline = new List<BsonDocument>();

	        // Add Fields
	        pipeline.Add(new BsonDocument{{"$addFields", new BsonDocument{{"__typename", objectType}}}});
	        pipeline.Add(new BsonDocument(
		        "$addFields",
		        new BsonDocument(
			        "_idString",
			        new BsonDocument( "$toString", "$_id")
		        )
	        ));
	        pipeline.Add(new BsonDocument
	        {
		        {
			        "$lookup",
			        new BsonDocument
			        {
				        { "from", "UserTagValue" },
				        { "localField", "userTagValues" },
				        { "foreignField", "_id" },
				        { "as", "userTagValuesResolved" }
			        }
		        }
	        });

	        var filterBuilder = Builders<BsonDocument>.Filter;
	        var query = CreateLinkObjectFilter(filterBuilder.Empty, whereParams);
	        if (whereParams != null && whereParams.Keys.Count > 0)
	        {
		        var tags = whereParams.Keys;

		        foreach (var tagIn in tags)
		        {
			        var tag = tagIn;
			        var tagValue = whereParams[tag];

			        if (tag == "userTagValues")
			        {
				        if (tagValue != null)
				        {
					        var userTagValueGroup = tagValue as Dictionary<dynamic, IEnumerable<object>>;
					        if (userTagValueGroup.Count > 0)
					        {
						        foreach (var userTagValues in userTagValueGroup.Values)
						        {
							        if (userTagValues != null && userTagValues.Any())
							        {
								        query = filterBuilder.And(
									        query,
									        filterBuilder.AnyIn(tag, userTagValues)
								        );
							        }
						        }
					        }
				        }

				        continue;
			        }

			        var relatedSimulationFilter = TryConvertRelatedSimulationFilter<BsonDocument>(tag, tagValue, gqlType);
			        if (relatedSimulationFilter != null)
			        {
				        query = filterBuilder.And(query ,relatedSimulationFilter);
				        continue;
			        };

			        if (!gqlType.HasField(tag))
			        {
				        continue;
			        }

			        // Todo - refactor this
			        var fieldValues = tagValue == null ? new string[] { } :
				        tagValue is ObjectId ? new[] { tagValue } :
				        tagValue is IEnumerable<object> ? ((IEnumerable<object>)tagValue).Select(i =>
					        i?.ToString().TryConvertToObjectId()).ToArray() :
				        tagValue is String ? tagValue.ToString().Split(',') : tagValue as object[];

			        if (tagValue == null || fieldValues == null)
			        {
				        fieldValues = new[] { tagValue };
			        }

			        // Ignore tags table
//                            if (!tagsByName.ContainsKey(tag))
//                            {
//                                throw new Exception($"{ot} does not have any tags named '{tag}' defined.");
//                            }

			        if (fieldValues != null && fieldValues.Any())
			        {
				        var field = gqlType.Fields.Find(tag);
				        var innerType = field.InnerResolvedType(out var isNonNull, out var isList,
					        out var isListItemNonNull);

				        query = filterBuilder.And(query,
					        isList
						        ? filterBuilder.AnyIn(tag, fieldValues)
						        : filterBuilder.Or(fieldValues.Select(v =>
							        v == null
								        ? filterBuilder.Or(filterBuilder.Exists(tag, false),
									        filterBuilder.Eq<object>(tag, null))
								        : filterBuilder.Eq(tag, ConvertTagValue(innerType, v.ToString())))));
			        }
		        }
	        }

	        // If we have a regex then we need to also match our regex on at least one of our selected fields
	        if (!string.IsNullOrEmpty(searchText))
	        {
		        var regexSearchTags = searchTags;

		        if (regexSearchTags == null || !regexSearchTags.Any())
		        {
			        // Search all string fields
			        regexSearchTags = gqlType.Fields.Where(f =>
			        {
				        var innerType = f.InnerResolvedType();

				        return innerType is StringGraphType;
			        }).Select(f => f.Name);
		        }

		        regexSearchTags = regexSearchTags.Append("_idString").Append("userTagValuesResolved.value");

		        var searchTextRegex = new BsonRegularExpression(Regex.Escape($"{searchText}"), "i");

		        FilterDefinition<BsonDocument> regexFilter = null;
		        bool first = true;

		        foreach (var tag in regexSearchTags)
		        {
			        var regexClause = filterBuilder.Regex(tag, searchTextRegex);

			        if (first)
			        {
				        regexFilter = regexClause;
				        first = false;
			        }
			        else
			        {
				        regexFilter = filterBuilder.Or(regexFilter, regexClause);
			        }
		        }

		        query = filterBuilder.And(query, regexFilter);
	        }

	        var collection = _mongo.database.GetCollection<BsonDocument>(objectType);
	        pipeline.Add(new BsonDocument
	        {
		        {
			        "$match",
			        query.Render(collection.DocumentSerializer, collection.Settings.SerializerRegistry)
		        }
		    });

	        return pipeline;
        }

        public async Task<OmdbQueryResult> RunQueryAsync(IEnumerable<string> objectTypes, IDictionary<string, object> whereParams, int skip = 0,
            int limit = DEFAULT_QUERY_LIMIT, string searchText = "",
            string sortBy = "", string sortOrder = "asc", IEnumerable<string> searchTags = null, IEnumerable<string> favorites = null, string path = null)
        {
            if (limit == 0)
            {
                limit = DEFAULT_QUERY_LIMIT;
            }

            var tenant = _mongo.getCurrentTenant();
            var cacheKey = $"{OmdbCacheKeys.RunQuery}_" + JsonConvert.SerializeObject(new {objectTypes, whereParams, skip, limit, searchText, sortBy, sortOrder, searchTags, favorites, tenant, path});
            var sortOrderIsDesc = !string.IsNullOrEmpty(sortOrder) && sortOrder.ToLower() == "desc";

            log.LogInformation($"Try to get query result from key: {cacheKey}");
            return await _cache.GetValue(cacheKey, async entry =>
            {
                log.LogInformation($"Cannot found data in cache, store query result by key: {cacheKey}, tenant: {tenant}");
                var result = new OmdbQueryResult()
                {
                    input = new OmdbQueryRunInput()
                    {
                        objectTypes = objectTypes.ToList(),
                        limit = limit,
                        searchText = searchText,
                        sortBy = sortBy,
                        sortOrder = sortOrder,
                        where = (Dictionary<string, object>)whereParams
                    }
                };

                if (objectTypes == null)
                {
                    objectTypes = ObjectTypes;
                }

                whereParams = ConvertWhereParamsForQuery(objectTypes, whereParams);

                BsonArray sortByUserTag = null;
                if (!string.IsNullOrEmpty(sortBy))
                {
	                var userTagCollection = db.GetCollection<dynamic>("UserTag");
	                var userTagDocuments = userTagCollection.Find(Builders<dynamic>.Filter.Eq("name", sortBy)).ToList();
	                if (userTagDocuments.Count > 0)
	                {
		                // sortBy = "";
		                sortByUserTag = new BsonArray(userTagDocuments.Select<dynamic,ObjectId>(doc => doc._id));
		            }
                }


                var objectType = "omdb_ui";
                var pipeline = new List<BsonDocument>();

                if (objectTypes.Count() == 1)
                {
	                objectType = objectTypes.First();
	                pipeline = GetAggregateAsyncPipeline(objectType, whereParams, searchText, searchTags);
                }
                else if (objectTypes.Count() > 0)
                {
	                pipeline = new List<BsonDocument>
	                {
						new BsonDocument {{"$addFields", new BsonDocument {{"__objectType", "Root"}}}},
						new BsonDocument {{"$limit", 1}},
						new BsonDocument {{"$project", new BsonDocument {{"_id", 1}}}},
						new BsonDocument {{"$project", new BsonDocument {{"_id", 0}}}}
	                };

	                objectTypes.ForEach(ot =>
	                {
		                pipeline.Add(new BsonDocument {{"$lookup", new BsonDocument
		                {
			                {"from", ot},
			                {"as", ot},
			                {"pipeline", new BsonArray(GetAggregateAsyncPipeline(ot, whereParams, searchText, searchTags))}
		                }}});
	                });

	                pipeline.Add(new BsonDocument {{"$project", new BsonDocument {{"Union", new BsonDocument {{"$concatArrays", new BsonArray(objectTypes.Select( ot => $"${ot}"))}}}}}});
	                pipeline.Add(new BsonDocument {{"$unwind", "$Union"}});
	                pipeline.Add(new BsonDocument {{"$replaceRoot", new BsonDocument {{"newRoot", "$Union"}}}});
                }
                else
                {
	                return null;
                }
                var collection = _mongo.database.GetCollection<BsonDocument>(objectType);


		        if (path != null)
		        {
			        if (!string.IsNullOrEmpty(path))
			        {
				        var filterBuilder = Builders<BsonDocument>.Filter;
				        var query = filterBuilder.Empty;

				        var pathRegex = new BsonRegularExpression($"^{path}/");
				        var regexClause = filterBuilder.Regex("name", pathRegex);
				        query = filterBuilder.And(query, regexClause);

				        pipeline.Add(new BsonDocument
				        {
					        {
						        "$match",
						        query.Render(collection.DocumentSerializer, collection.Settings.SerializerRegistry)
					        }
				        });
			        }

			        var level = path == "" ? 0 : path.Count(f => f == '/') + 1;
			        pipeline = pipeline.Concat(new List<BsonDocument>
			        {
				        new BsonDocument
				        {
					        {
						        "$group",
						        new BsonDocument
						        {
							        {
								        "_id",
								        new BsonDocument
								        {
									        {
										        "$cond",
										        new BsonArray
										        {
											        new BsonDocument
											        {
												        {
													        "$gt",
													        new BsonArray
													        {
														        new BsonDocument
														        {
															        {
																        "$size",
																        new BsonDocument
																	        { { "$split", new BsonArray { "$name", "/" } } }
															        }
														        },
														        level + 1
													        }
												        }
											        },
											        new BsonDocument
											        {
												        {
													        "$arrayElemAt",
													        new BsonArray
													        {
														        new BsonDocument
															        { { "$split", new BsonArray { "$name", "/" } } },
														        { level }
													        }
												        }
											        },
											        "$_id"
										        }
									        }
								        }
							        },
							        { "result", new BsonDocument { { "$mergeObjects", "$$ROOT" } } },
							        { "numObjects", new BsonDocument { { "$sum", 1 } } },
							        { "createdTime", new BsonDocument { { "$max", "$createdTime" } } },
							        { "modifiedTime", new BsonDocument { { "$max", "$modifiedTime" } } }
						        }
					        }
				        },
				        new BsonDocument
				        {
					        {
						        "$replaceRoot",
						        new BsonDocument
						        {
							        {
								        "newRoot",
								        new BsonDocument
								        {
									        {
										        "$cond",
										        new BsonArray
										        {
											        new BsonDocument
											        {
												        {
													        "$or",
													        new BsonArray
													        {
														        new BsonDocument
															        { { "$gt", new BsonArray { "$numObjects", 1 } } },
														        new BsonDocument
															        { { "$ne", new BsonArray { "$_id", "$result._id" } } }
													        }
												        }
											        },
											        new BsonDocument
											        {
												        {
													        "$mergeObjects",
													        new BsonArray
													        {
														        "$$ROOT", new BsonDocument
														        {
															        { "name", "$_id" },
															        { "_isObjectFolder", true },
															        { "createdTime", "$createdTime" },
															        { "modifiedTime", "$modifiedTime" }
														        }
													        }
												        }
											        },
											        new BsonDocument
												        { { "$mergeObjects", new BsonArray { "$$ROOT", "$result" } } }
										        }
									        }
								        }
							        }
						        }
					        }
				        }
			        }).ToList();
		        }

                if (sortByUserTag == null)
                {

					if (sortBy == "modifiedTime" )
					{
	                    // sort by modifiedTime, but if modifiedTime is null, using createdTime.
	                    pipeline.Add(new BsonDocument
	                    {
		                    {
			                    "$addFields",
			                    new BsonDocument
			                    {
				                    {
					                    "_sort_modifiedTime",
					                    new BsonDocument
					                    {
						                    {
							                    "$cond", new BsonArray { new BsonDocument
							                    {
								                    {
									                    "$gt", new BsonArray { "$modifiedTime", "$createdTime" }
								                    }
							                    }, "$modifiedTime", "$createdTime" }
						                    }
					                    }
				                    }
			                    }
		                    }
	                    });
	                    sortBy = "_sort_modifiedTime";
                    }

					// sort by column
					pipeline.Add(new BsonDocument
					{
						{
							"$sort",
							new BsonDocument
								{ { string.IsNullOrEmpty(sortBy) ? "_id" : sortBy, sortOrderIsDesc ? -1 : 1 } }
						}
					});
                }
                else
                {
                    // sort by userTagValues
                    var tempColName = "userTagValueSort";
                    pipeline = pipeline.Concat(new List<BsonDocument>
                    {
	                    new BsonDocument
	                    {
		                    {
			                    "$lookup", // Covert userTagValue ids to user tag value documents
			                    new BsonDocument
			                    {
				                    {"from", "UserTagValue"},
				                    {"let", new BsonDocument {{"utv", "$userTagValues"}}},
				                    {
					                    "pipeline", new BsonArray
					                    {
						                    new BsonDocument
						                    {
							                    {
								                    "$match",
								                    new BsonDocument
								                    {
									                    {
										                    "$expr",
										                    new BsonDocument
										                    {
											                    {
												                    "$and",
												                    new BsonArray
												                    {
													                    new BsonDocument {{"$isArray", "$$utv"}},
													                    new BsonDocument {{"$in", new BsonArray {"$tag", sortByUserTag}}},
													                    new BsonDocument {{"$in", new BsonArray {"$_id", "$$utv"}}},
												                    }
											                    }
										                    }
									                    }
								                    }
							                    }
						                    },
						                    new BsonDocument {{"$sort", new BsonDocument {{"order", 1}}}}
					                    }
				                    },
				                    {"as", tempColName}
			                    }
		                    }
	                    },

	                    new BsonDocument
	                    {
		                    {
			                    "$addFields", // Convert userTagValue array to string, ex: ["ABC","1234"] => "ABC,1234". if userTagValue is empty, set as "zzzzz" to make line in the end of list.
			                    new BsonDocument
			                    {
				                    {
					                    tempColName,
					                    new BsonDocument
					                    {
						                    {
							                    "$cond",
							                    new BsonDocument
							                    {
								                    {
									                    "if",
									                    new BsonDocument
									                    {
										                    {
											                    "$gt", new BsonArray { new BsonDocument {{"$size", $"${tempColName}"}}, 0}
										                    }
									                    }
								                    },
								                    {
									                    "then",
									                    new BsonDocument
									                    {
										                    {
											                    "$reduce",
											                    new BsonDocument
											                    {
												                    {
													                    "input",
													                    new BsonDocument
													                    {
														                    {
															                    "$map",
															                    new BsonDocument
															                    {
																                    {"input", $"${tempColName}"},
																                    {"as", "el"},
																                    {"in", "$$el.value"}
															                    }
														                    }
													                    }
												                    },
												                    { "initialValue", ""},
												                    {
													                    "in",
													                    new BsonDocument{{ "$concat", new BsonArray { "$$value","$$this","," }}}
												                    }
											                    }
										                    }
									                    }
								                    },
								                    {"else", "zzzzzz,"}
							                    }
						                    }
					                    }

				                    }
			                    }
		                    }
	                    },

	                    new BsonDocument {{"$sort", new BsonDocument
	                    {
		                    {tempColName, sortOrderIsDesc ? -1 : 1},
		                    {"_id", sortOrderIsDesc ? -1 : 1}
	                    }}}
                    }).ToList();
				}

                pipeline = pipeline.Concat(new List<BsonDocument>
                {
                    new BsonDocument
                    {
                        {
                            "$addFields",
                            new BsonDocument
                            {
                                {"isFavorite", new BsonDocument {{"$in", new BsonArray{"$_id", new BsonArray(favorites.Select(f => f.TryConvertToObjectId())) }}}}
                            }
                        }
                    },
                    new BsonDocument
                    {
                        {
                            "$sort",
                            new BsonDocument
                            {
                                {"isFavorite", -1}
                            }
                        }
                    },
                    new BsonDocument
                    {
	                    {
		                    "$sort",
		                    new BsonDocument
		                    {
			                    {"_isObjectFolder", -1}
		                    }
	                    }
                    },
                    new BsonDocument
                    {
                        {
                            "$facet",
                            new BsonDocument
                            {
                                {
                                    "results",
                                    new BsonArray
                                    {
                                        new BsonDocument
                                        {
                                            {"$skip", skip}
                                        },
                                        new BsonDocument
                                        {
                                            {"$limit", limit}
                                        }

                                    }
                                },
                                {
                                    "totalCount",
                                    new BsonArray {new BsonDocument {{"$count", "count"}}}
                                }
                            }
                        }
                    }
                }).ToList();

                // Throws an exception if the collection doesn't exist
                /*async Task processResult (IFindFluent<BsonDocument, BsonDocument> queryResults)
                    {
                        try
                        {
                            var totalForCollection = (int) queryResults.CountDocuments();
                            result.total += totalForCollection;

                            if (!string.IsNullOrEmpty(sortBy))
                            {
                                var sortBuilder = Builders<BsonDocument>.Sort;
                                SortDefinition<BsonDocument> sort = null;
                                if (string.IsNullOrEmpty(sortOrder) || sortOrder.ToLower() == "asc")
                                {
                                    sort = sortBuilder.Ascending(f => f[sortBy]);
                                }
                                else
                                {
                                    sort = sortBuilder.Descending(f => f[sortBy]);
                                }

                                queryResults = queryResults.Sort(sort);
                            }

                            if (remainingSkip < totalForCollection)
                            {
                                queryResults = queryResults.Skip(remainingSkip).Limit(remainingLimit);
                                var qrCount = (int) queryResults.CountDocuments();

                                remainingSkip = 0;
                                if (remainingLimit > 0)
                                {
                                    remainingLimit -= qrCount;

//#if DEBUG
//                            _log.LogDebug(
//                                $"'Omdb query '{ot}' - skip: {skip}, limit: {limit}, searchText: {searchText} tags: {result.input.where.ToPrettyString()}");
//#endif
                                    var collectionResults = await queryResults.ToListAsync();
                                    result.results.AddRange(collectionResults
                                        .Select(qr =>
                                        {
                                            var record = BsonSerializer.Deserialize<dynamic>(qr);
                                            record.__typename = ot;
                                            return record;
                                        }));
                                }
                            }
                            else
                            {
                                remainingSkip -= totalForCollection;
                            }
                        }
                        catch (NullReferenceException)
                        {
                            _log.LogWarning($"Tried to query non-existent object type '{ot}'");
                        }
                    };*/
                var aggResult = (await collection.AggregateAsync<BsonDocument>(pipeline, new AggregateOptions() {  Collation = new Collation("en") } )).ToList()[0];
                var parsedResult = BsonSerializer.Deserialize<dynamic>(aggResult);
                var totalForCollection =  parsedResult.totalCount.Count > 0 ? parsedResult.totalCount[0].count : 0;
                var results = (List<object>) parsedResult.results;
                result.total += totalForCollection;

                result.results.AddRange(results
                    .Select((dynamic qr) =>
                    {
                        var record = qr;
                        if (((IDictionary<String, object>) record).ContainsKey("_isObjectFolder"))
                        {
                            record.name = path == "" ? record.name : path + "/" + record.name;
                            record.__typename = "HierarchyGroup";
                        }

                        return record;
                    })
                );

                result.skipped = skip;

	            if (string.IsNullOrEmpty(sortBy) && sortOrderIsDesc)
                {
                    result.results.Reverse();
                }

                entry.AbsoluteExpiration = Settings.omdb.watchCollections ? DateTimeOffset.UtcNow.AddMilliseconds(Settings.omdb.cache.runQuery) : DateTimeOffset.UtcNow.AddMilliseconds(1);

                return result;
            });
        }

        /*
        public static IFindFluent<TDocument, TDocument> SecureFind<TDocument>(
            IMongoCollection<TDocument> collection,
            FilterDefinition<TDocument> filter,
            FindOptions options = null)
        {
            return collection.Find(filter, options);
        }

        secureQuery(FilterDefinition<TDocument> filter)*/


        public async Task<Dictionary<string, List<DistinctTagValuesEntry>>> getDistinctTagValues(ObjectGraphType[] objectTypes, IEnumerable<string> tags, string searchText,
            Dictionary<string, object> where, string path)
        {
            var objectTypeNames = objectTypes.Select(ot => ot.Name).ToArray();

            where = (Dictionary<string, object>) ConvertWhereParamsForQuery(objectTypeNames, new Dictionary<string, object>(where));

            var tenant = _mongo.getCurrentTenant();
            var cacheKey = $"{OmdbCacheKeys.GetDistinctTagValues}_" + JsonConvert.SerializeObject(new {objectTypes = objectTypeNames, tags, searchText, where, path, tenant});
            return await _cache.GetValue(cacheKey, async entry =>
            {
                var result = new Dictionary<string, List<DistinctTagValuesEntry>>();
                foreach (var objectType in objectTypes)
                {
	                var collection = db.GetCollection<dynamic>(objectType.Name);
	                OmdbQueryPipelineBuilder pipelineBuilder = new OmdbQueryPipelineBuilder(collection, objectType);
	                pipelineBuilder.SetSearchText(searchText);
	                pipelineBuilder.SetPath(path);
	                pipelineBuilder.SetWhereFilters(where);
	                
	                var entries = new List<DistinctTagValuesEntry>();
                    result.Add(objectType.Name, entries);
                    
                    var tagsList = tags.ToList();
                    var fields = objectType.Fields.ToDictionary(f => f.Name);
                    var queryTags = new List<string>();
                    var tagsInWhere = new List<string>();
                    var queryUserTags = new List<string>();
                    var invisibleTags = new List<string>();
                    var invisibleUserTags = new List<string>();
                    var displayTagsSet = await GetOmdbUiVisibleTags(objectType.Name);

                    if (tagsList.Contains("userTagValues"))
                    {
	                    var tempCollection = db.GetCollection<dynamic>("UserTag");
	                    var filterDef =
		                    Builders<dynamic>.Filter.AnyIn("objectTypes", new List<string> { objectType.Name });
	                    tempCollection.Find(filterDef).ToList().ForEach((ut) =>
	                    {
		                    var _id = ut._id.ToString();
		                    if (displayTagsSet.Contains(_id))
		                    {
			                    queryUserTags.Add(_id);
			                    return;
		                    }
		                    invisibleUserTags.Add(_id);
	                    });
	                    tagsList.Remove("userTagValues");
                    }

                    foreach (var tag in tagsList)
                    {
	                    if (fields.ContainsKey(tag))
	                    {
		                    if (displayTagsSet.Contains(tag))
		                    {
			                    if (where != null && where.ContainsKey(tag))
			                    {
				                    tagsInWhere.Add(tag);
				                    continue;
			                    }
			                    queryTags.Add(tag);
		                    }
		                    else
		                    {
			                    invisibleTags.Add(tag);
		                    }
	                    }
                    }
                    
                    var fieldsFacetDocument = new BsonDocument();
                    var userTagFacetDocument = new BsonDocument();
                    var whereFacetDocument = new BsonDocument();
                    var allWhereFilter = pipelineBuilder.ProcessWhere();
                    var queryPipelines = pipelineBuilder.GeneratePipelines(includeUserTagWhereFilter: false, includeWhereFilter: false);
                    var queryPipelinesIncludeWhere = new List<BsonDocument>(queryPipelines);
                    if (allWhereFilter != Builders<dynamic>.Filter.Empty)
                    {
	                    queryPipelinesIncludeWhere.Add(new BsonDocument(
		                    "$match",
		                    allWhereFilter.Render(collection.DocumentSerializer, collection.Settings.SerializerRegistry)
	                    ));
                    }

                    foreach (string userTagId in queryUserTags)
                    {
	                    var fieldPipeline = new BsonArray();
	                    var fieldTagName = "userTagValues";
	                    var whereFilter = pipelineBuilder.ProcessUserTagInWhereForTagDistinctValues(userTagId);
	                    if (whereFilter != Builders<dynamic>.Filter.Empty)
	                    {
		                    fieldPipeline.Add(new BsonDocument(
			                    "$match",
			                    whereFilter.Render(collection.DocumentSerializer,
				                    collection.Settings.SerializerRegistry)
		                    ));
	                    }
                        fieldPipeline.AddRange(new[]
                        {
                            new BsonDocument(
                                "$lookup", // Covert userTagValue ids to user tag value documents
                                new BsonDocument
                                {
                                    { "from", "UserTagValue" },
                                    { "let", new BsonDocument { { "utv", $"${fieldTagName}" } } },
                                    {
                                        "pipeline", new BsonArray
                                        {
                                            new BsonDocument(
                                                "$match",
                                                new BsonDocument(
                                                    "$expr",
                                                    new BsonDocument(
                                                        "$and",
                                                        new BsonArray
                                                        {
                                                            new BsonDocument("$isArray", "$$utv"),
                                                            new BsonDocument(
                                                                "$eq",
                                                                new BsonArray { "$tag", new ObjectId(userTagId) }
                                                            ),
                                                            new BsonDocument
                                                            (
                                                                "$in",
                                                                new BsonArray { "$_id", "$$utv" }
                                                            )
                                                        }
                                                    )
                                                )
                                            )
                                        }
                                    },
                                    { "as", fieldTagName }
                                }
                            ),
                            new BsonDocument(
                                "$addFields",
                                new BsonDocument(
                                    fieldTagName,
                                    new BsonDocument(
                                        "$map",
                                        new BsonDocument
                                        {
                                            { "input", $"${fieldTagName}" },
                                            { "as", "el" },
                                            { "in", "$$el._id" }
                                        }
                                    )
                                )
                            )
                        });

                        AddFieldSumCountPipeline(fieldPipeline, fields[fieldTagName], fieldTagName);
                        userTagFacetDocument[userTagId] = fieldPipeline;
                    }
                    userTagFacetDocument = new BsonDocument("$facet", userTagFacetDocument);

                    foreach (string fieldTagName in queryTags)
                    {
	                    var fieldPipeline = new BsonArray();
	                    ProjectSourceType(fieldTagName, fieldPipeline);
	                    AddFieldSumCountPipeline(fieldPipeline, fields[fieldTagName], fieldTagName);
	                    fieldsFacetDocument[fieldTagName] = fieldPipeline;
                    }
                    fieldsFacetDocument = new BsonDocument("$facet", fieldsFacetDocument);
                    
                    foreach (string fieldTagName in tagsInWhere)
                    {
	                    var fieldPipeline = new BsonArray();
	                    var whereFilter = pipelineBuilder.ProcessWhereForTagDistinctValues(fieldTagName);
	                    if (whereFilter != Builders<dynamic>.Filter.Empty)
	                    {
		                    fieldPipeline.Add(new BsonDocument(
			                    "$match",
			                    whereFilter.Render(collection.DocumentSerializer,
				                    collection.Settings.SerializerRegistry)
		                    ));
	                    }
                        
	                    ProjectSourceType(fieldTagName, fieldPipeline);
	                    AddFieldSumCountPipeline(fieldPipeline, fields[fieldTagName], fieldTagName);
	                    whereFacetDocument[fieldTagName] = fieldPipeline;
                    }
                    whereFacetDocument = new BsonDocument("$facet", whereFacetDocument);
                    
                    AddDefaultDistinctTagValue(entries, invisibleTags, false);
                    AddDefaultDistinctTagValue(entries, invisibleUserTags, true);
                    
                    await Task.WhenAll(
	                    this.RunDistinctTagValuesAggregationPipeline(entries, collection, queryPipelinesIncludeWhere.Concat(new [] {fieldsFacetDocument}).ToList(),
		                    fields, queryTags, false),
	                    this.RunDistinctTagValuesAggregationPipeline(entries, collection, queryPipelinesIncludeWhere.Concat(new [] {userTagFacetDocument}).ToList(),
		                    fields, queryUserTags, true),
	                    this.RunDistinctTagValuesAggregationPipeline(entries, collection, queryPipelines.Concat(new [] {whereFacetDocument}).ToList(),
		                    fields, tagsInWhere, false)
                    );
                }

                entry.SlidingExpiration = Settings.omdb.watchCollections ? TimeSpan.FromMilliseconds(Settings.omdb.cache.distinctValues) : TimeSpan.FromMilliseconds(1000);

                return result;
            });
        }
		
        private async Task<HashSet<string>> GetOmdbUiVisibleTags(string objectType)
        {
	        var collection = db.GetCollection<BsonDocument>("omdb_ui");
	        var doc = await collection
		        .Find(Builders<BsonDocument>.Filter.Eq("objectType", objectType)).FirstOrDefaultAsync();;
	        var visibleTags = new HashSet<string>();
	        if (doc != null && doc.Contains("catalog"))
	        {
		        var catalog = doc["catalog"] as BsonDocument;
		        if (catalog != null && catalog.Contains("tags") && catalog["tags"] != null)
		        {
			        (catalog["tags"] as BsonArray).ForEach((v) =>
			        {
				        if (v is BsonDocument tagDoc)
				        {
					        visibleTags.Add(tagDoc.Contains("_id") ? tagDoc["_id"].ToString() : tagDoc["name"].ToString());
				        } else if (v is BsonString tag)
				        {
					        visibleTags.Add(tag.ToString());
				        }
			        });
		        }
	        }
	        return visibleTags;
        }

        private void AddFieldSumCountPipeline(BsonArray fieldPipeline, FieldType field, string fieldTagName)
        {
	        field.InnerResolvedType(out var isNonNull, out var isList, out var isListItemNonNull);
	        if (isList || isNonNull || isListItemNonNull)
	        {
		        fieldPipeline.Add(new BsonDocument(
			        "$match", 
			        new BsonDocument(
				        fieldTagName, 
				        new BsonDocument("$not", new BsonDocument("$type", BsonType.Null))
			        )
		        ));
	        }
	        if (isList)
	        {
		        // Break up array items so that we can individual group on entries
		        fieldPipeline.Add(new BsonDocument("$unwind", $"${fieldTagName}"));
	        }
	        else
	        {
		        fieldPipeline.Add(new BsonDocument(
			        "$match", 
			        new BsonDocument(
				        fieldTagName, 
				        new BsonDocument("$ne", BsonNull.Value))
		        ));
	        }
                        
	        fieldPipeline.Add(
		        new BsonDocument(
			        "$group",
			        new BsonDocument
			        {
				        { "_id", $"${fieldTagName}" },
				        { "count", new BsonDocument { { "$sum", 1 } } }
			        }
		        ));
        }
        
        
        private async Task RunDistinctTagValuesAggregationPipeline(List<DistinctTagValuesEntry> entries, IMongoCollection<dynamic> collection, List<BsonDocument> queryPipelines, Dictionary<string, FieldType> fields, IEnumerable<string> tags, bool isUserTag)
        {
	        if (!tags.Any())
            {
                return;
            }
            
            var resultAggregate = await collection.AggregateAsync<BsonDocument>(queryPipelines);
            var distinctList = await resultAggregate.ToListAsync();
            var distinctDict = distinctList.First();
            foreach (string tag in tags)
            {
                var fieldTagName = isUserTag ? "userTagValues" : tag;
                var field = fields[fieldTagName];
                var innerType = field.InnerResolvedType();
                var distinct = distinctDict[tag].AsBsonArray.Select(value => (BsonDocument)value).ToArray();
                
                if (innerType is StringGraphType)
                {
                    Array.Sort(distinct,
                        (a, b) => (a.GetValue("_id").ToString()).CompareTo(b.GetValue("_id").ToString()));
                }
                else if (innerType is IntGraphType)
                {
                    Array.Sort(distinct, (a, b) => ((int)a.GetValue("_id")).CompareTo((int)b.GetValue("_id")));
                }
                else if (innerType is DateGraphType or DateTimeGraphType)
                {
                    Array.Sort(distinct,
                        (a, b) => ((DateTime)a.GetValue("_id")).CompareTo((DateTime)b.GetValue("_id")));
                }
                lock (entries)
                {
                    entries.Add(new DistinctTagValuesEntry()
                    {
                        tag = tag, isUserTag = isUserTag,
                        distinct = distinct.Select(bson => BsonSerializer.Deserialize<dynamic>(bson))
                    });
                }
            }
        }
        private void AddDefaultDistinctTagValue(List<DistinctTagValuesEntry> entries, List<string> tags, bool isUserTag)
        {
            foreach (string tag in tags)
            {
                entries.Add(new DistinctTagValuesEntry()
                {
                    tag = tag, isUserTag = isUserTag,
                    distinct = new List<dynamic>()
                });
            }
        }

        private void ProjectSourceType(string fieldTagName, BsonArray pipeline)
        {
	        if (fieldTagName == "sourceType")
	        {
		        pipeline.Add(new BsonDocument
		        {
			        {
				        "$project",
				        new BsonDocument
				        {
					        {$"{fieldTagName}", new BsonDocument {{"$ifNull", new BsonArray{$"${fieldTagName}", "Classic"}}}}
				        }
			        }
		        });
	        }
        }
        
        #region Helpers

        /*
        public Dictionary<string, OmdbTag> findTagsForObjectType(IEnumerable<string> tags, IEnumerable<string> objectTypes)
        {
            var cacheKey = "Omdb_findTagsForObjectType_" + JsonConvert.SerializeObject(new {objectTypes, tags});
            return _cache.GetOrCreate(cacheKey, entry =>
            {
                _cacheKeys.Add(cacheKey);
                IQueryable<OmdbTag> q = db.GetCollection<OmdbTag>("tags").AsQueryable();

                if (tags.Any())
                {
                    q = q.Where(t => tags.Contains(t.name));
                }

                if (objectTypes.Any())
                {
                    q = q.Where(t => t.objectTypes.Length == 0 || objectTypes.Any(searchType => t.objectTypes.Contains(searchType)));
                }

                return q.ToDictionary(t => t.name);
            });
        }*/

        public static object ConvertTagValue(IGraphType graphType, string value)
        {
            if (graphType is IdGraphType)
            {
                return value.TryConvertToObjectId();
            }
            else if ((graphType == null || graphType is IntGraphType) && Int32.TryParse(value, out var i))
            {
                return i;
            }
            else if ((graphType == null || graphType is BooleanGraphType) && Boolean.TryParse(value, out var b))
            {
                return b;
            }
            else
            {
                return value.TryConvertToObjectId();
                ;
            }
        }

        #endregion

        public UpdateResult updateSingleRow(string collection, string id, OmdbUpdateRecordTag[] tags)
        {
            // Todo - security check on the row itself

            //_log.LogInformation(updateRecord.ToString());
            if (string.IsNullOrEmpty(collection))
            {
                throw new ArgumentException("collection field is required");
            }

            if (tags.Length == 0)
            {
                throw new ArgumentException("No tags specified");
            }

            // Verify the tags are correct and relevent to the object type specified

            IQueryable<OmdbTag> tagQuery = db.GetCollection<OmdbTag>("tags").AsQueryable();
            var tagIds = tags.Select(f => new ObjectId(f.tag_id));

            tagQuery = tagQuery
                .Where(t => tagIds.Contains(t._id))
                .Where(t => t.objectTypes.Contains(collection));

            var notMutable = tagQuery.FirstOrDefault(t => t.mutates == false);
            if (notMutable != null)
            {
                throw new Exception($"Tag '{notMutable.name}' cannot be modified as it is marked mutable: false");
            }

            var tagsDict = tagQuery.ToDictionary(q => q._id.ToString());

            log.LogInformation(tagsDict.ToJson());
            var setsDict = new Dictionary<string, object>();
            foreach (var f in tags)
            {
                var tag = tagsDict[f.tag_id];
                if (tag == null)
                {
                    throw new Exception($"Unable to find tag '{f.tag_id}'  ('{f.tag_name}')");
                }

                if (tag.multiple == true)
                {
                    if (!(f.value is JArray))
                    {
                        throw new Exception(
                            $"Field {tag.name} is marked as multiple but specified value {f.value.ToJson()} is not an array.");
                    }
                }

                if (tag.name != f.tag_name)
                {
                    log.LogWarning($"'{f.tag_name}' does not match db value '{tag.name}' for tag id '{tag._id}'");
                }

                // Convert string ids to object IDs
                if (tag.type == "id")
                {
                    if (tag.multiple == true)
                    {
                        f.value = ((JArray) f.value).Select(valueId => new ObjectId(valueId.ToString()));
                    }
                    else
                    {
                        f.value = new ObjectId(f.value.ToString());
                    }
                }

                setsDict.Add(tag.name, f.value);
            }

            var col = db.GetCollection<BsonDocument>(collection);
            return col.UpdateOne(
                Builders<BsonDocument>.Filter.Eq("_id", id.TryConvertToObjectId()),
                new BsonDocument("$set", new BsonDocument(setsDict)));
        }

        public async Task<IDictionary<string, OmdbUi>> BatchLoadOmdbUi(IEnumerable<string> objectTypes)
        {
            var find = db.GetCollection<OmdbUi>(UI_COLLECTION);
            var queryResults = await find.FindAsync(Builders<OmdbUi>.Filter.In("objectType", objectTypes));
            var result = queryResults.ToEnumerable().ToDictionary(r => (string) r.objectType);

            return result;
        }

        public async Task<List<OmdbUi>> LoadUi(IEnumerable<string> objectTypes = null)
        {
            return await _cache.GetValue(OmdbCacheKeys.Ui, async entry =>
            {
                var ui = db.GetCollection<OmdbUi>(UI_COLLECTION);

                var filterBuilder = Builders<OmdbUi>.Filter;
                var filter = filterBuilder.Empty;
                if (objectTypes != null && objectTypes.Any())
                {
                    filter = filterBuilder.And(filter, filterBuilder.Or(objectTypes.Select(v => filterBuilder.Eq(x => x.objectType, v))));
                }

                var result = await ui.FindAsync(filter);

                entry.SlidingExpiration = Settings.omdb.watchCollections ? TimeSpan.FromMinutes(5) : TimeSpan.FromMilliseconds(5000);

                return await result.ToListAsync();
            });
        }

        public void ResetCache(string tenant)
        {
            this._cache.ResetCacheByTenant(tenant);
        }

        public async Task<T> FindOneAsync<T>(string collectionName, object id)
        {
            // Need to invalidate caches if insert/update happens to tag/tagvalues
            return await _cache.GetValue($"{OmdbCacheKeys.FindOneAsyncDynamic}_" + JsonConvert.SerializeObject(new {collectionName, id}), async entry =>
            {
                var collection = db.GetCollection<BsonDocument>(collectionName);
                var query = await collection.FindAsync(Builders<BsonDocument>.Filter.Eq("_id", id));
                var qr = query.FirstOrDefault();
                var result = qr == null ? default(T) : BsonSerializer.Deserialize<T>(qr);

                entry.SlidingExpiration = Settings.omdb.watchCollections ? TimeSpan.FromMinutes(1) : TimeSpan.FromMilliseconds(100);
                return result;
            });
        }

        public async Task<dynamic> FindOneAsync(string collectionName, string id)
        {
            var collection = db.GetCollection<BsonDocument>(collectionName);
            var query = await collection.FindAsync(Builders<BsonDocument>.Filter.Eq("_id", id.TryConvertToObjectId()));
            var qr = query.FirstOrDefault();
            var result = qr == null ? null : BsonSerializer.Deserialize<dynamic>(qr);
            if (result != null)
            {
                result.__typename = collectionName;
            }

            return result;
        }

        public async Task<IEnumerable<dynamic>> FindAsync(string collectionName, IEnumerable<string> ids)
        {
            var collection = db.GetCollection<BsonDocument>(collectionName);
            var query = await collection.FindAsync(Builders<BsonDocument>.Filter.In("_id", ids.Select(v => v.TryConvertToObjectId())));
            var docs = await query.ToListAsync();
            var results = docs.Select(qr => BsonSerializer.Deserialize<dynamic>(qr));
            foreach (var r in results)
            {
                if (r != null)
                {
                    r.__typename = collectionName;
                }
            }

            return results;
        }

        public async Task<ILookup<string, dynamic>> BatchLoadUserTagsByObjectType(IEnumerable<string> objectTypes)
        {
            var collection = db.GetCollection<dynamic>("UserTag");
            var query = await collection.FindAsync(Builders<dynamic>.Filter.AnyIn("objectTypes", objectTypes));
            var docs = await query.ToListAsync();

            return docs.SelectMany(tag => (tag.objectTypes as IEnumerable<object>).Select(objectType => new {objectType, tag}))
                .ToLookup(t => t.objectType.ToString(), t => t.tag);
        }

        public async Task<ILookup<string, dynamic>> BatchLoadUserTagValuesByUserTag(IEnumerable<string> tags)
        {
            var collection = db.GetCollection<dynamic>("UserTagValue");
            var query = await collection.FindAsync(Builders<dynamic>.Filter.In("tag", tags.Select(t => t.TryConvertToObjectId())));
            var docs = await query.ToListAsync();

            return docs.ToLookup(tv => ((ObjectId) tv.tag).ToString());
        }

        public async Task<IDictionary<IEnumerable<string>, IEnumerable<dynamic>>> BatchLoadUserTagValuesById(IEnumerable<IEnumerable<string>> idLists)
        {
            var ids = idLists.SelectMany(list => list).Distinct();

            var collection = db.GetCollection<dynamic>("UserTagValue");
            var query = await collection.FindAsync(Builders<dynamic>.Filter.In("_id", ids.Select(t => t.TryConvertToObjectId())));
            var docs = await query.ToListAsync();

            var lookup = docs.ToDictionary(tv => tv._id.ToString());

            var result = new Dictionary<IEnumerable<string>, IEnumerable<dynamic>>();
            foreach (var list in idLists)
            {
                var translated = list.Select(l => lookup.ContainsKey(l) ? lookup[l] : null).ToList();
                result.Add(list, translated);
            }

            return result;
        }

        public async Task<IDictionary<string, dynamic>> BatchLoadUserTagsById(IEnumerable<string> ids)
        {
            var collection = db.GetCollection<dynamic>("UserTag");
            var query = await collection.FindAsync(Builders<dynamic>.Filter.In("_id", ids.Select(id => id.TryConvertToObjectId())));
            var docs = await query.ToListAsync();

            return docs.ToDictionary(tag => ((ObjectId) tag._id).ToString());
        }

        public IDictionary<string, object> ConvertWhereParamsForQuery(IEnumerable<string> objectTypes, IDictionary<string, object> whereIn)
        {
            if (whereIn == null)
                return null;

            var whereParams = whereIn.ToDictionary(e => e.Key, e => e.Value);

            if (whereParams.ContainsKey("sourceType"))
            {
	            var paramValue = whereParams["sourceType"];
	            var paramValueList = (paramValue is IEnumerable<object> ? ((IEnumerable<object>)paramValue).ToList() : new List<object>() {paramValue}).Select(v => v.ToString());
	            whereParams["sourceType"] = paramValueList.Select( v => v == "Classic" ? null : v);
            }

            var userTagCollection = db.GetCollection<dynamic>("UserTag");
            var filter = Builders<dynamic>.Filter;
            var matchingUserTagValueQuery = filter.AnyIn("objectTypes", objectTypes);

            var userTags = userTagCollection
	            .Find(matchingUserTagValueQuery).ToList();

            if (userTags.Count == 0)
            {
	            if (whereParams.ContainsKey("userTagValues"))
		            whereParams.Remove("userTagValues");
	            return whereParams;
            }

            var userTagIdsByName = userTags.GroupBy(o => o.name)
	            .ToDictionary(x => x.First().name, x => x);

            var mappingUserTagValues = new List<dynamic>();
            var userTagValueCollection = db.GetCollection<dynamic>("UserTagValue");
            foreach (var param in whereParams.ToList())
            {
                var paramKey = param.Key;
                var paramValues = (param.Value is IEnumerable<object> ? ((IEnumerable<object>)param.Value).ToList() : new List<object>() {param.Value}).Select(v => v.ToString());

                if ("userTagValues".Equals(paramKey))
                {
	                var allUserTagIds = userTags.Select(userTag => userTag._id);
	                var tagValueIds = paramValues.Select(v => v.TryConvertToObjectId()).Where(v => v != null);
	                matchingUserTagValueQuery = filter.And(filter.In("tag", allUserTagIds), filter.In("_id", tagValueIds));
	                mappingUserTagValues.AddRange(userTagValueCollection.Find(matchingUserTagValueQuery).ToList());
	                whereParams.Remove(paramKey);
                }
				else if (userTagIdsByName.ContainsKey(paramKey))
                {
	                var userTagIds = userTagIdsByName[paramKey].Select(userTag => userTag._id);

	                matchingUserTagValueQuery = filter.And(filter.In("tag", userTagIds), filter.In("value", paramValues));
	                mappingUserTagValues.AddRange(userTagValueCollection.Find(matchingUserTagValueQuery).ToList());
	                whereParams.Remove(paramKey);
                }
            }


            if (mappingUserTagValues.Count > 0)
            {
	            var userTagValuesByTag = mappingUserTagValues
		            .GroupBy(userTagValue => userTagValue.tag)
		            .ToDictionary(
			            group => group.First().tag.ToString(),
			            group => group.Select(t => t._id)
		            );
	            whereParams.Add("userTagValues", userTagValuesByTag);
	    	}
            return whereParams;
        }

        public async Task<List<DeleteResult>> DeleteObjectAsync(string objectType, ObjectId itemId, string userId)
        {
            var collection = db.GetCollection<BsonDocument>(objectType);
            var result = new List<DeleteResult>();


            var folders = new List<ObjectId>();

            // For folders we need to delete all children folders as well
            if (objectType == "Folder")
            {
                var folder = await FolderCollection.Find(f => f._id == itemId).FirstAsync();
                var path = folder.path + "." + folder._id;

                folders = await FolderCollection
                            .Find(f => f.path == path || f.path.StartsWith(path))
                            .Project(f => f._id)
                            .ToListAsync();

            }
            else if (objectType == "Simulation") // if deleting simulation, move the entry from Simulation table to DeleteSimulation table
            {
                await DeleteSimulation(itemId);
            }
            else if (objectType == "InvestmentOptimization")
            {
                await DeleteInvestmentOptimization(itemId);
            }
            else if (objectType == "ClimateRiskAnalysis")
            {
                await DeleteClimateRiskAnalysis(itemId);
            }

            // Delete the item(s) from the folder hierarchy
            result.Add(await FolderItemsCollection.DeleteManyAsync(fi => (fi.itemId == itemId && fi.itemType == objectType)
                                                                         || folders.Contains(fi._folder)));

            // Delete the item itself
            result.Add(await collection.DeleteOneAsync(Builders<BsonDocument>.Filter.Eq("_id", itemId)));

            return result;
        }

        private async Task DeleteSimulation(ObjectId itemId)
        {
            var simulationCollection = db.GetCollection<BsonDocument>("Simulation");
            var deletedSimulationCollection = db.GetCollection<BsonDocument>("DeletedSimulation");
            var deletedDocument = await simulationCollection.FindAsync(Builders<BsonDocument>.Filter.Eq("_id", itemId));
            // Move deleted simulation to DeletedSimulation table
            await deletedDocument.ForEachAsync(d =>
            {

                d["deletedTime"] = DateTime.UtcNow;
                if (d.Contains("billingInformation") && !(d["billingInformation"].IsBsonNull))
                {
	                var billingInformation = d["billingInformation"].AsBsonDocument;
	                if (!billingInformation.Contains("simulationWorkerEndTime") || billingInformation["simulationWorkerEndTime"].IsBsonNull)
	                {
		                d["billingInformation"]["simulationWorkerEndTime"] =
			                new BsonInt32((Int32) (d["deletedTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000));
	                }
                }
                deletedSimulationCollection.InsertOneAsync(d);
            });

            // Delete simulation id from query descriptors
            var queryCollection = db.GetCollection<BsonDocument>("Query");
            await queryCollection.UpdateManyAsync(Builders<BsonDocument>.Filter.Empty, Builders<BsonDocument>.Update.Pull("simulations", itemId));
        }

        private async Task DeleteInvestmentOptimization(ObjectId itemId)
        {
            var investmentOptimizationCollection = db.GetCollection<BsonDocument>("InvestmentOptimization");
            var deletedInvestmentOptimizationCollection = db.GetCollection<BsonDocument>("DeletedInvestmentOptimization");
            var deletedDocument = await investmentOptimizationCollection.FindAsync(Builders<BsonDocument>.Filter.Eq("_id", itemId));
            // Move deleted simulation to DeletedSimulation table
            await deletedDocument.ForEachAsync(d =>
            {
                d["deletedTime"] = DateTime.UtcNow;
                if (d.Contains("billingInformation") && d["billingInformation"]["optimizationEndTime"].IsBsonNull)
                {
                    d["billingInformation"]["optimizationEndTime"] = DateTime.UtcNow;
                }
                deletedInvestmentOptimizationCollection.InsertOneAsync(d);
            });
        }

        private async Task DeleteClimateRiskAnalysis(ObjectId itemId)
        {
            var climateRiskAnalysisCollection = db.GetCollection<BsonDocument>("ClimateRiskAnalysis");
            var deletedClimateRiskAnalysisCollection = db.GetCollection<BsonDocument>("DeletedClimateRiskAnalysis");
            var deletedDocument = await climateRiskAnalysisCollection.FindAsync(Builders<BsonDocument>.Filter.Eq("_id", itemId));
            // Move deleted climateRiskAnalysis to DeletedClimateRiskAnalysis table
            await deletedDocument.ForEachAsync(d =>
            {
                d["deletedTime"] = DateTime.UtcNow;
                if (d.Contains("billingInformation") && !d["billingInformation"].IsBsonNull && d["billingInformation"]["analysisEndTime"].IsBsonNull)
                {
                    d["billingInformation"]["analysisEndTime"] = DateTime.UtcNow;
                }
                deletedClimateRiskAnalysisCollection.InsertOneAsync(d);
            });
        }

        public FuncFieldResolver<TReturnType> GetCacheResetFuncFieldResolver<TReturnType>(
            string cacheKey, Func<IResolveFieldContext, Task<TReturnType>> resolver)
        {
            return new FuncFieldResolver<TReturnType>(async entry =>
            {
                var result = await resolver(entry);
                _cache.ResetCacheKeyByTenant(MongoService.getCurrentTenant(), cacheKey);
                return result;
            });
        }
        
        public FilterDefinition<BsonDocument> CreateLinkObjectFilter(FilterDefinition<BsonDocument> distinctFilter, IDictionary<string,object> whereFilters)
        {
	        if (whereFilters != null && whereFilters.ContainsKey("isLink") && (bool) whereFilters["isLink"])
	        {
		        // no restriction if isLink = true
	        }
	        else
	        {
		        distinctFilter &= Builders<BsonDocument>.Filter.Or(
			        Builders<BsonDocument>.Filter.Exists("isLink", false),
			        Builders<BsonDocument>.Filter.Eq("isLink", false));
	        }

	        return distinctFilter;
        }
        
    }
}
