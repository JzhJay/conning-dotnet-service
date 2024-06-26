using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using Conning.Db.Services;
using Conning.Library.Utility;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Resolvers;
using GraphQL.Types;
using GraphQL.Utilities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

/*
 * Schema should be something like:
 *
 * query omdb {
  omdb {
    config {
      server,
      db
    }
    typed {
      simulation {
        find{
          results {
            _id
          }
        }
      }
    }
    generic {
      get,
      find(objectTypes:["Simluation"]) {
        _id
        __typename
      }
      distinct
    }
    objectTypes
  }
}

 */
namespace Conning.GraphQL
{
	public static partial class ExtensionMethods
	{
		public static void registerOmdbTypes(this IServiceCollection services)
		{
			services.AddSingleton<OmdbGraph>();
			services.AddSingleton<OmdbConfigGraph>();

			// For hot reload support
			services.AddSingleton<OmdbQueryGraph>();
			services.AddSingleton<OmdbMutationGraph>();
			services.AddSingleton<OmdbDistinctGraph>();

			services.AddSingleton<BillingQueryGraph>();
            services.AddSingleton<BillingReportSummaryGraph>();

			services.AddSingleton<OmdbSubscriptionGraph>();

			services.AddSingleton<OmdbQueryObjectTypeGraph>();
			services.AddSingleton<OmdbQueryResultGraph>();
			services.AddSingleton<OmdbQueryResultInputGraph>();

			//services.AddSingleton<OmdbDistinctResultGraph>();
			services.AddSingleton<OmdbDistinctInputGraph>();
			services.AddSingleton<OmdbDistinctTagValuesEntryGraph>();
			services.AddSingleton<OmdbTagGraph>();
			services.AddSingleton<OmdbUiQueryGraph>();
			services.AddSingleton<OmdbUiMutationGraph>();
			services.AddSingleton<OmdbUiMutationGraph_catalog>();
			services.AddSingleton<OmdbUiMutationGraph_table>();
			services.AddSingleton<OmdbUiMutationGraph_card>();
			services.AddSingleton<OmdbUiMutationGraph_uniqueName>();
			services.AddSingleton<OmdbUiCatalogTagGraphType>();
			services.AddSingleton<OmdbUiTableColumnGraphType>();
			services.AddSingleton<OmdbUiCardGraphType>();
			services.AddSingleton<OmdbUiCardTagGraphType>();
			services.AddSingleton<OmdbQueryRunInputGraph>();
			services.AddSingleton<OmdbUpdateEventGraph>();
			services.AddSingleton<OmdbUnionGraphType>();
			services.AddSingleton<OmdbGenericGraph>();
			services.AddSingleton<OmdbDistinctNoObjectTypeInputGraph>();
			services.AddSingleton<OmdbObjectTypeDescriptorGraph>();

			services.AddSingleton<TagUiGraph>();
			services.AddSingleton<TagUiGraph_Catalog>();
			services.AddSingleton<TagUiGraph_Table>();
			services.AddSingleton<OmdbTableUiGraph>();
			services.AddSingleton<OmdbAdminMutationObjectGraph>();
			services.AddSingleton<DistinctTagValuesInputGraph>();
			services.AddSingleton<OmdbDistinctResultGraph>();
			services.AddSingleton<FolderItemInputType>();
			services.AddSingleton<JsonObjectGraphType>();

//            services.AddSingleton<OmdbUserTagGraph>();
//            services.AddSingleton<OmdbUserTagValueGraph>();

			BsonTypeMapper.RegisterCustomTypeMapper(typeof(JsonGraphType), new JsonGraphValueTypeMapper());
			//BsonClassMap.RegisterClassMap<JsonGraphValue>(cm =>
			//{
			//    cm.MapProperty(_ => _.Value);
			//});
			// services.AddSingleton<OmdbQueryResultTypedGraph>();
			//services.AddSingleton<OmdbUnionObjectType>();
		}
	}

	public class CustomSchemaBuilder : SchemaBuilder
	{
		private readonly Schema _externalSchema;

		public CustomSchemaBuilder(Schema schema)
		{
			_externalSchema = schema;
		}
		
		protected override Schema CreateSchema()
		{
			return _externalSchema;
		}
	}

	/* Parses and generates OMDB graphQL classes from the omdb.graphqls schema file */
	public class OmdbGraph
	{
		public const string UserTagValueField = "userTagValues";

		private readonly OmdbSubscriptionGraph _subscriptionGraph;
		private readonly ConningUserGraph _conningUserGraph;
		private readonly JsonObjectGraphType _jsonObjectGraphType;
		public OmdbUnionGraphType UnionType { get; private set; }
		public OmdbService Omdb { get; }
		public ILogger<OmdbGraph> Log { get; }
		public IOptions<AdviseAppSettings> Settings { get; }
		public IDataLoaderContextAccessor DataLoader { get; }
		public BaseUserService UserService { get; }
		public Dictionary<string, OmdbBatchDataLoader> BatchDataLoaders = new Dictionary<string, OmdbBatchDataLoader>();
		public Dictionary<string, ObjectGraphType> ObjectTypes = new Dictionary<string, ObjectGraphType>();
		public GraphSchema ParentSchema { get; private set; }
		public static OmdbGraph Instance { get; private set; }

		public OmdbGraph(OmdbService omdb, ILogger<OmdbGraph> log, IOptions<AdviseAppSettings> settings,
			IDataLoaderContextAccessor dataLoader, BaseUserService userService,
			OmdbSubscriptionGraph subscriptionGraph, ConningUserGraph conningUserGraph,
			JsonObjectGraphType jsonObjectGraphType)
		{
			_subscriptionGraph = subscriptionGraph;
			_conningUserGraph = conningUserGraph;
			_jsonObjectGraphType = jsonObjectGraphType;
			Omdb = omdb;
			Log = log;
			Settings = settings;
			DataLoader = dataLoader;
			UserService = userService;
			UnionType = new OmdbUnionGraphType();
			Instance = this;
			Loaded = false;
		}

		private IMongoDatabase db => Omdb.db;

		public IEnumerable<string> DbObjectTypes
		{
			get
			{
				return ObjectTypes.Where(ot => ot.Value.ResolvedInterfaces.Any(i => i.Name == "DbObject"))
					.Select(ot => ot.Key).OrderBy(s => s);
			}
		}

		public bool Loaded { get; private set; }

		public void RegisterOmdbSchema(GraphSchema parentSchema, IObjectGraphType query, IObjectGraphType mutation, IObjectGraphType Subscription)
		{
			Loaded = false;
			ParentSchema = parentSchema;

			ObjectTypes.Clear();
			BatchDataLoaders.Clear();
			UnionType.AddPossibleType(_conningUserGraph);
			UnionType.AddPossibleType(_jsonObjectGraphType);
			
			var schemaContents = File.ReadAllText(Settings.Value.graphQL.schemas.omdb);
			if (Settings.Value.karma)
			{
				schemaContents += File.ReadAllText($"{Settings.Value.graphQL.schemas.omdb}.karma");
			}
			
			var schemaBuilder = new CustomSchemaBuilder(ParentSchema);
			var schema = schemaBuilder.Build(schemaContents);
			
			// restore Query, Mutation, Subscription since schemaBuilder changes the 3 fields' values
			schema.Query = query;
			schema.Mutation = mutation;
			schema.Subscription = Subscription;
			
			// I never see this called, but it IS required to exist
			var dbObject = schemaBuilder.Types.For("DbObject");
			dbObject.ResolveType = o =>
			{
				var i = 0;
				return null;
			};
			dbObject.IsTypeOfFunc = v =>
			{
				if (v is IDictionary<string, object> dict)
				{
					if (!dict.ContainsKey("__typename") || (string) dict["__typename"] == dbObject.Name)
					{
						return true;
					}
				}

				return false;
			};
			var uiType = schemaBuilder.Types.For("UI");
			uiType.ResolveType = o =>
			{
				var i = 0;
				return null;
			};
			uiType.IsTypeOfFunc = v =>
			{
				if (v is IDictionary<string, object> dict)
				{
					if (!dict.ContainsKey("__typename") || (string) dict["__typename"] == uiType.Name)
					{
						return true;
					}
				}

				return false;
			};
			
			RegisterPredefinedTypes(schema);
			// Register all of the types defined in the accompanying schema file and make them able to bind to dynamics and mongo collection fields
			var omdbTypes = schema.AdditionalTypeInstances.OfType<ObjectGraphType>()
				.Where(t => !t.Name.StartsWith("__") && t.Name != "Json").ToList();

			foreach (var gqlType in omdbTypes)
			{
				RegisterOmdbType(parentSchema, gqlType);
			}
			
			parentSchema.RegisterType(UnionType);
			
			var folderMutationGraph = new FolderMutationGraph(Omdb, this);
			var omdbMutations = parentSchema.Mutation.Fields.Find("omdb").ResolvedType as OmdbMutationGraph;
			omdbMutations.AddField(
				new FieldType()
				{
					Name = "folder",
					ResolvedType = folderMutationGraph,
					Resolver = new FuncFieldResolver<FolderMutationGraph>(ctx => folderMutationGraph)
				});

//
//            ((ObjectGraphType) parentSchema.Query.Fields.First(f => f.Name == "omdb").ResolvedType).AddField(
//                new FieldType()
//                {
//                    Name = "get",
//                    ResolvedType = UnionType,
//                    Arguments = new QueryArguments(
//                        new QueryArgument<NonNullGraphType<ObjectIdGraphType>>() {Name = "_id"},
//                        new QueryArgument<NonNullGraphType<StringGraphType>>() {Name = "objectType"}
//                    ),
//
//                    Resolver = new AsyncFieldResolver<dynamic>(async ctx =>
//                    {
//                        var id = ctx.Argument<ObjectId>("_id");
//                        var objectType = ctx.Argument<string>("objectType");
//                        var collection = Omdb.db.GetCollection<BsonDocument>(objectType);
//                        var query = await collection.FindAsync(Builders<BsonDocument>.Filter.Eq("_id", id));
//                        var qr = query.FirstOrDefault();
//                        var result = qr == null ? null : BsonSerializer.Deserialize<dynamic>(qr);
//                        result.__typename = objectType;
//
//                        return Task.FromResult(result);
//                    })
//                });

			_subscriptionGraph.StartCollectionWatches(ObjectTypes.Keys.Where(k => ObjectTypes[k].HasField("_id")));
			
			Loaded = true;
		}

		private FuncFieldResolver<object> CreateDynamicResolver(FieldType field, OmdbBatchDataLoader batchDataLoader, ObjectGraphType gqlType)
		{
			return new FuncFieldResolver<object>(async ctx =>
			{
				var o = ctx.Source as IDictionary<string, object>;
				if (o == null)
				{
					return null;
				}
				
				var fieldValue = !o.ContainsKey(ctx.FieldAst.Name.StringValue) ? null : o[ctx.FieldAst.Name.StringValue];

				var isList = false;
				var type = field.ResolvedType;
				if (type is NonNullGraphType)
				{
					type = (type as NonNullGraphType).ResolvedType;
				}

				if (type is ListGraphType)
				{
					isList = true;
					type = (type as ListGraphType).ResolvedType;
				}

				if (type is NonNullGraphType)
				{
					type = (type as NonNullGraphType).ResolvedType;
				}

				if (type.Name == "ConningUser")
				{
					if (fieldValue != null)
					{
						string id = "";
						if (fieldValue is ExpandoObject fieldValueObject) // for backward compatibility, ex: {_id: "auth0|5b4b84b1a177ac1965fdaa6a", __typename: "Auth0User"})
						{
							var keyValuePair = fieldValueObject.FirstOrDefault(keyValuePair => keyValuePair.Key == "_id");
							if (keyValuePair.Key == "_id")
							{
								id = keyValuePair.Value.ToString();
							}
						}
						else
						{ 
							id = fieldValue.ToString();
						}

						if (!string.IsNullOrEmpty(id))
						{
							return batchDataLoader.LoadUser(id);
						}
					}

					return null;
				}
				else if (gqlType.Name != "UserTag" && type.Name == "UserTagValue")
				{
					// Metadata is not thread safe, so lock on the field before updating.
					lock (field)
					{
					    field.Metadata.TryAdd("internal", true);
					}

					if (fieldValue != null)
					{
						var idList = isList ? (fieldValue as List<object>) : new List<object>{fieldValue};
						var loader = DataLoader.Context.GetOrAddBatchLoader<IEnumerable<string>, IEnumerable<dynamic>>("UserTagValueById",
							Omdb.BatchLoadUserTagValuesById);
						var result = await loader.LoadAsync(idList.Select(s => s.ToString())).GetResultAsync();
						var r = result.Where(f => f != null).ToList();
						return isList ? r : r.Any() ? r[0] : null;
					}

					return null;
				}
				else if (type is ObjectGraphType ogt)
				{
					// Transform this into an array of the resolved type
					var returnType = ObjectTypes.Values.FirstOrDefault(t => t.Name == type.Name);

					if (returnType != null && returnType.HasField("_id"))
					{
						// Todo - potential optimizations include only querying fields we are being asked for, using a cache, getting the data asynchronously, etc
						//var fields = ctx.SubFields && ctx.SubFields.Keys;

						// Object A references Object B
						if (fieldValue != null)
						{
							if (isList)
							{
								var result = await BatchDataLoaders[type.Name].LoadOmdbObjects((fieldValue as List<object>).Select(id => (string) id.ToString()));
								return result;
							}
							else
							{
								return BatchDataLoaders[type.Name].LoadOmdbObject(fieldValue.ToString());
							}
						}
						// Object B references Object A
						else if (returnType != gqlType)
						{
							// Verify there is a reference to us on Object B
							var fieldReferencingUs = returnType.Fields.FirstOrDefault(rf => rf.InnerResolvedType().Name == gqlType.Name);
							if (fieldReferencingUs == null)
							{
								throw new Exception(
									$"There is no field on '{gqlType.Name}' matching '{ctx.FieldAst.Name.StringValue}' nor any link on '{returnType.Name}' that points to '{gqlType.Name}'.  Unable to resolve.");
							}

							var batchLoader = new OmdbReferenceBatchDataLoader(returnType.Name, fieldReferencingUs.Name, DataLoader, Omdb, UserService);
							var results = batchLoader.LoadOmdbObjectReferencing(o["_id"].ToString());

							if (isList)
							{
								return results;
							}
							else
							{
								return (await results.GetResultAsync()).FirstOrDefault();
							}
						}
					}
				}

				return fieldValue;
			});
		}

		internal void RegisterOmdbType(GraphSchema schema, ObjectGraphType gqlType)
		{
			ObjectTypes[gqlType.Name] = gqlType;

			var batchDataLoader = new OmdbBatchDataLoader(gqlType.Name, DataLoader, Omdb, UserService);
			BatchDataLoaders.Add(gqlType.Name, batchDataLoader);
			var dbFields = gqlType.Fields.ToArray();

			// Add support for resolving fields as dynamic
			gqlType.IsTypeOf = v =>
			{
				if (v is object[] arr)
				{
					return arr.Any(t =>
					{
						if (t is IDictionary<string, object> d)
						{
							if (!d.ContainsKey("__typename") || (string) d["__typename"] == gqlType.Name)
							{
								return true;
							}
						}

						return false;
					});
				}

				if (v is IDictionary<string, object> dict)
				{
					if (!dict.ContainsKey("__typename") || (string) dict["__typename"] == gqlType.Name)
					{
						return true;
					}
				}

				return false;
			};

			UnionType.AddPossibleType(gqlType);

			dbFields.ForEach(f => f.Resolver = CreateDynamicResolver(f, batchDataLoader, gqlType));

			// Resolve Auth0's User object as our Auth0Graph
			dbFields.Where(f => f.ResolvedType.Name == "User").ForEach(f => f.ResolvedType = new ConningUserGraph());

			// Types with _id fields are queryable mongo collections
			if (gqlType.HasField("_id"))
			{
				// Register an input type to support querying this mongo collection
				var searchInputGraphType = new OmdbQueryInputGraph(gqlType);
				schema.RegisterType(searchInputGraphType);

				OmdbQueryObjectTypeGraph.RegisterGraph(schema.Query, this, schema, gqlType, searchInputGraphType, DataLoader);

				var omdbMutationObjectGraph = new OmdbMutationObjectTypeGraph(schema, this, gqlType);
				schema.RegisterType(omdbMutationObjectGraph);
				var name = gqlType.Name.ToCamelCase(); // graphql-dotnet will make it lowercased anyways so we have to...

				var mutations = schema.Mutation.Fields.Find("omdb").ResolvedType as ObjectGraphType;
				var typedMutations = mutations.Fields.Find("typed").ResolvedType as OmdbTypedMutationsGraph;

				if (!typedMutations.HasField(name))
				{
					typedMutations.AddField(
						new FieldType()
						{
							Name = name,
							Description = $"Mutations for '{gqlType.Name}'",
							ResolvedType = omdbMutationObjectGraph,
							Resolver = new FuncFieldResolver<object>(ctx => { return omdbMutationObjectGraph; })
						});
				}

				/*
				 Deep graphs of subscriptions doesn't work...

				 var subscriptions = parentSchema.Subscription.Fields.First(f => f.Name == "omdb").ResolvedType as OmdbSubscriptionsGraph;
				var subscriptionGraph = new OmdbSubscriptionObjectTypeGraph(parentSchema, this, gqlType);
				parentSchema.RegisterType(subscriptionGraph);

				_queue = new ReplaySubject<string>(1);

				if (!subscriptions.HasField(name))
				{
				    subscriptions.AddField(
				        new EventStreamFieldType()
				        {
				            Name = name,
				            Description = $"Wrapper for omdb type '{gqlType.Name}'",
				            Arguments = new QueryArguments()
				            {
				                new QueryArgument(typeof(IdGraphType))
				                {
				                    Name = "id"
				                }
				            },
				            Type = typeof(StringGraphType),
				            Resolver = new FuncFieldResolver<string>(context => context.Source as string),

				            Subscriber = new EventStreamResolver<string>(ctx =>
				            {
				                var id = ctx.Argument<string>("id");

				                Task.Run(() =>
				                {
				                    while (true)
				                    {
				                        Task.Delay(5000);
				                        _queue.OnNext($"{id} - {DateTime.Now.ToString()}");
				                    }
				                });

				                return _queue.AsObservable();
				            })
				        });
				}*/
			}

			CustomConfigure(gqlType);

			Log.LogDebug($"Registered OMDB type '{gqlType.Name}'");
		}

		private void CustomConfigure(ObjectGraphType gqlType)
		{
			// Add a synthetic lookup for associated user tags to all db objects
			if (gqlType.Name != "UserTag" && gqlType.Name != "UserTagValue")
			{
				/* var userTagsField = gqlType.AddField(
					new FieldType()
					{
						ResolvedType = new ListGraphType(ObjectTypes["UserTagValue"]),
						Name = "userTagValues",
						Resolver = new AsyncFieldResolver<dynamic, List<dynamic>>(
							async ctx =>
							{
								var objectRecord = ctx.Source as IDictionary<string, object>;

								if (!objectRecord.ContainsKey(UserTagValueField))
								{
									return new List<dynamic>();
								}

								var loader = DataLoader.Context.GetOrAddBatchLoader<IEnumerable<string>, IEnumerable<dynamic>>("UserTagValueById",
									Omdb.BatchLoadUserTagValuesById);
								var listOfIds = (objectRecord[UserTagValueField] as IEnumerable<object>).Select(s => s.ToString());

								var result = await loader.LoadAsync(listOfIds);
								var r = result.Where(f => f != null).ToList();
								return r;
							})
					});
				userTagsField.Metadata.Add("internal", true); */
			}

			if (gqlType.Name == "FolderItem")
			{
				gqlType.ExtendFolderItemType();
			}
			else if (gqlType.Name == "Folder")
			{
				gqlType.ExtendFolderType();
			}
		}

		public void RegisterPredefinedTypes(ISchema schema)
		{
			schema.RegisterType<JsonGraphType>();
			schema.RegisterType(_conningUserGraph);
		}
	}

	public class OmdbUnionGraphType : UnionGraphType
	{
		public static string TypeName = "omdb_union";

		public OmdbUnionGraphType()
		{
			Name = TypeName;
			ResolveType = type => { return TryResolveType(type); };
		}

		private IObjectGraphType TryResolveType(object type)
		{
			if (type is IDictionary<string, object> d && d.ContainsKey("__typename"))
			{
				var typeName = d["__typename"].ToString();

				if (OmdbGraph.Instance.ObjectTypes.TryGetValue(typeName, out var ot))
				{
					return ot;
				}

				OmdbGraph.Instance.Log.LogError($"Undefined GraphQL type '{typeName}'");
				return new JsonObjectGraphType();

			}
			else if (type is String typeAsString)
			{
				if (OmdbGraph.Instance.ObjectTypes.TryGetValue(typeAsString, out var result))
				{
					return result;
				}

				return null;
			}
			else
			{
				return OmdbGraph.Instance.ObjectTypes[type.GetType().Name];
			}
		}
	}

	public class JsonObjectGraphType : ObjectGraphType<dynamic>
	{
		public JsonObjectGraphType()
		{
			Name = "JsonObjectGraph";

			AddField(
				new FieldType()
				{
					Name = "json",
					ResolvedType = new JsonGraphType()
				});
		}
	}
}
