using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Conning.Library.Utility;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.CSharp.RuntimeBinder;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    /// <summary>
    /// Dynamically generates a set of CRUD operations for a given specific object type which in turn corresponds to an
    /// underlying mongo table with a schema that implements DbObject
    ///
    /// This graph is dynamically built during server runtime after importing the omdb.graphqls file.
    /// </summary>
    public class OmdbMutationObjectTypeGraph : ObjectGraphType
    {
        private readonly ObjectGraphType GqlType;
        private OmdbUpdateGraphType _updateGraphType;
        private OmdbInsertGraphType _insertGraphType;
        public GraphSchema ParentSchema { get; }
        public OmdbGraph OmdbGraph { get; }
        public OmdbService Omdb => OmdbGraph.Omdb;

        public OmdbMutationObjectTypeGraph(GraphSchema parentSchema, OmdbGraph omdbGraph, ObjectGraphType gqlType)
        {
            GqlType = gqlType;
            ParentSchema = parentSchema;
            OmdbGraph = omdbGraph;
            Name = $"omdb_{gqlType.Name}_mutation";

            _InsertField();
            _UpdateField();
            _DeleteField();
            _ExpireField();

            if (GqlType.Name != "UserTag" && GqlType.Name != "UserTagValue")
            {
                _AddUserTagValueField();
                _DeleteUserTagValueField();
                _UpdateUserTagValueField();
            }
        }

        #region User Tag Values

        private void _UpdateUserTagValueField()
        {
            AddField(
                new FieldType
                {
                    Name = "updateUserTagValues",
                    ResolvedType = OmdbGraph.UnionType,
                    Arguments = new QueryArguments(
                        new QueryArgument<NonNullGraphType<IdGraphType>> {Name = "id", Description = $"The _id field of the underlying {GqlType.Name} record"},
                        new QueryArgument<ListGraphType<NonNullGraphType<IdGraphType>>> {Name = "tagValueIds", Description = "The _id fields of the TagValues to be applied"}),
                    Resolver = new FuncFieldResolver<object>(async ctx =>
                    {
                        var id = ctx.GetArgument<string>("id").TryConvertToObjectId();
                        var tagValueIds = ctx.ArgumentArrayValue<string>("tagValueIds");

                        // Todo - cache the tag/tag values so this check doesn't require two db roundtrips
                        // Verify that this object type supports this tag value
                        /*var tagValues = await OmdbGraph.Omdb.FindAsync("UserTagValue", tagValueIds);

                        for (var i = 0; i < tagValueIds.Count; i++)
                        {
                            var tagValueId = tagValueIds[i];
                            var tagValue = tagValues[i];

                            if (tagValue == null)
                            {
                                throw new ArgumentException($"Unable to find user tag value '{tagValueId}'");
                            }

                            var tag = await OmdbGraph.Omdb.FindOneAsync<dynamic>("UserTag", tagValue.tag);
                            if (tag == null)
                            {
                                throw new ArgumentException($"Unable to find user tag '{tagValue.tag}'");
                            }

                            if (!tag.objectTypes.Contains(GqlType.Name))
                            {
                                throw new ArgumentException($"{tag.name} is not applicable to object type {GqlType.Name}");
                            }
                        }*/

                        var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>(GqlType.Name);
                        var record = await collection
                            .Find(Builders<BsonDocument>.Filter.Eq("_id", id))
                            .Project(Builders<BsonDocument>.Projection.Include(OmdbGraph.UserTagValueField).Include("_id"))
                            .FirstOrDefaultAsync();

                        if (record == null)
                        {
                            throw new ArgumentException($"No record was found in collection '${GqlType.Name}' - _id: '{id}'");
                        }

                        if (record.Contains(OmdbGraph.UserTagValueField) && !record[OmdbGraph.UserTagValueField].IsBsonNull)
                        {
                            var existUserTagValueIds = record[OmdbGraph.UserTagValueField].AsBsonArray
                                .Select(bson => bson.ToString());
                            var diffUserTagValueIds = existUserTagValueIds.Except(tagValueIds).ToList();
                            diffUserTagValueIds.AddRange(tagValueIds.Except(existUserTagValueIds));

                            var tagIds = new HashSet<string>();
                            foreach (var tagValue in await OmdbGraph.Omdb.FindAsync("UserTagValue", diffUserTagValueIds)
                            )
                            {
                                tagIds.Add($"{tagValue.tag}");
                            }

                            foreach (var tag in await OmdbGraph.Omdb.FindAsync("UserTag", tagIds))
                            {
                                dynamic mutable;
                                try
                                {
                                    mutable = tag.mutates;
                                }
                                catch (RuntimeBinderException)
                                {
                                    mutable = true;
                                }

                                if (mutable == false)
                                {
                                    throw new Exception(
                                        $"Tag '{tag.name}' cannot be modified as it is marked mutable: false");
                                }
                            }
                        }

                        await collection.UpdateOneAsync(
                            Builders<BsonDocument>.Filter.Eq("_id", id),
                            new BsonDocument(
                                "$set",
                                new BsonDocument(
                                    OmdbGraph.UserTagValueField,
                                    new BsonArray(tagValueIds.Select(u => u.TryConvertToObjectId()))
                                )));

                        // Avoid the db roundtrip
//                        var result = BsonSerializer.Deserialize<dynamic>(record);
//                        result.tagValueIds = tagValueIds.Select(_id => (new { _id, __typename = "UserTagValue"}).ToDynamic());
//                        result.__typename = GqlType.Name;
//                        return result;
                        return await OmdbGraph.Omdb.FindOneAsync(GqlType.Name, id.ToString());
                    })
                });
        }

        private void _AddUserTagValueField()
        {
            Field<StringGraphType>()
                .Name("addUserTagValue")
                .Argument<NonNullGraphType<IdGraphType>>("id", $"The _id field of the underlying {GqlType.Name} record")
                .Argument<NonNullGraphType<IdGraphType>>("tagValueId", "The _id field of the TagValue to be applied")
                .ResolveAsync(async ctx =>
                {
                    var id = ctx.GetArgument<string>("id", default(string)).TryConvertToObjectId();
                    var tagValueId = ctx.GetArgument<string>("tagValueId", default(string)).TryConvertToObjectId();

                    // Todo - cache the tag/tag values so this check doesn't require two db roundtrips
                    // Verify that this object type supports this tag value
                    var tagValue = await OmdbGraph.Omdb.FindOneAsync<dynamic>("UserTagValue", tagValueId);

                    if (tagValue == null)
                    {
                        throw new ArgumentException($"Unable to find user tag value '{id}'");
                    }

                    var tag = await OmdbGraph.Omdb.FindOneAsync<dynamic>("UserTag", tagValue.tag);
                    if (tag == null)
                    {
                        throw new ArgumentException($"Unable to find user tag '{tagValue.tag}'");
                    }

                    if (!tag.objectTypes.Contains(GqlType.Name))
                    {
                        throw new ArgumentException($"{tag.name} is not applicable to object type {GqlType.Name}");
                    }

                    var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>(GqlType.Name);
                    var record = await collection
                        .Find(Builders<BsonDocument>.Filter.Eq("_id", id))
                        .Project(Builders<BsonDocument>.Projection.Include(OmdbGraph.UserTagValueField).Include("_id"))
                        .FirstOrDefaultAsync();

                    if (record == null)
                    {
                        throw new ArgumentException($"No record was found in collection '${GqlType.Name}' - _id: '{id}'");
                    }

                    if (!record.Contains(OmdbGraph.UserTagValueField))
                    {
                        await collection.UpdateOneAsync(
                            Builders<BsonDocument>.Filter.Eq("_id", id),
                            new BsonDocument(
                                "$set",
                                new BsonDocument(
                                    OmdbGraph.UserTagValueField,
                                    new BsonArray(new[] {tagValueId})
                                )));

                        return $"Added {OmdbGraph.UserTagValueField} field with value of [{tagValueId}]";
                    }
                    else
                    {
                        var array = record.GetValue(OmdbGraph.UserTagValueField) as BsonArray;
                        if (array.Contains(tagValueId))
                        {
                            return $"{OmdbGraph.UserTagValueField} already contains tag value '{tagValueId}'";
                        }
                        else
                        {
                            if (!UtilityMethods.HasProperty(tag, "multiple") || !tag.multiple)
                            {
                                // Verify there are no other tag values for this tag within the array
                                var utvCollection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>("UserTagValue");
                                var tagValueIdRecords = await utvCollection
                                    .Find(Builders<BsonDocument>.Filter.Eq("tag", (ObjectId) tag._id))
                                    .Project(Builders<BsonDocument>.Projection.Include("_id"))
                                    .ToListAsync();

                                var tagValueIds = tagValueIdRecords.Select(doc => doc.GetValue("_id"));

                                if (array.Any(existingTagValueId => tagValueIds.Contains(existingTagValueId)))
                                {
                                    throw new Exception(
                                        $"Cannot add tag value '{tagValue.value}' to {GqlType.Name} '{id}' - another tag value is already applied from the same tag and multiple is set to false.");
                                }
                            }

                            array.Add(BsonValue.Create(tagValueId));
                            await collection.UpdateOneAsync(
                                Builders<BsonDocument>.Filter.Eq("_id", id),
                                new BsonDocument(
                                    "$set",
                                    new BsonDocument(
                                        OmdbGraph.UserTagValueField,
                                        array
                                    )));

                            return $"Updated {OmdbGraph.UserTagValueField} field - added user tag value {tagValueId}";
                        }
                    }
                });
        }

        private void _DeleteUserTagValueField()
        {
            Field<StringGraphType>()
                .Name("removeUserTagValue")
                .Argument<NonNullGraphType<IdGraphType>>("id", $"The _id field of the underlying {GqlType.Name} record")
                .Argument<NonNullGraphType<IdGraphType>>("tagValueId", "The _id field of the TagValue to be applied")
                .ResolveAsync(async ctx =>
                {
                    var id = ctx.GetArgument<string>("id", default(string)).TryConvertToObjectId();
                    var tagValueId = ctx.GetArgument<string>("tagValueId", default(string)).TryConvertToObjectId();

                    // Todo - cache the tag/tag values so this check doesn't require two db roundtrips
                    var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>(GqlType.Name);
                    var record = await collection
                        .Find(Builders<BsonDocument>.Filter.Eq("_id", id))
                        .Project(Builders<BsonDocument>.Projection.Include(OmdbGraph.UserTagValueField).Include("_id"))
                        .FirstOrDefaultAsync();

                    if (record == null)
                    {
                        throw new ArgumentException($"No record was found in collection '${GqlType.Name}' - _id: '{id}'");
                    }

                    var array = record.Contains(OmdbGraph.UserTagValueField) ? record.GetValue(OmdbGraph.UserTagValueField) as BsonArray : null;

                    if (array == null || !array.Contains(tagValueId))
                    {
                        throw new ArgumentException($"{GqlType.Name} is not tagged with user tag value '{tagValueId}");
                    }

                    array.RemoveAt(array.IndexOf(f => f.ToString() == tagValueId.ToString()));

                    await collection.UpdateOneAsync(
                        Builders<BsonDocument>.Filter.Eq("_id", id),
                        new BsonDocument(
                            "$set",
                            new BsonDocument(
                                OmdbGraph.UserTagValueField,
                                array
                            )));

                    return $"Updated {OmdbGraph.UserTagValueField} field - removed user tag value {tagValueId}";
                });
        }

        #endregion

        private void _InsertField()
        {
            _insertGraphType = new OmdbInsertGraphType(GqlType);
            if (_insertGraphType.Fields.Any())
            {
                ParentSchema.RegisterType(_insertGraphType);
                AddField(
                    new FieldType()
                    {
                        Name = "insert",
                        ResolvedType = new ListGraphType(GqlType), //new JsonGraphType(),
                        Arguments = new QueryArguments()
                        {
                            new QueryArgument(new NonNullGraphType(new ListGraphType(_insertGraphType)))
                            {
                                Name = "values"
                            }
                        },
                        Resolver = new FuncFieldResolver<object>(async ctx =>
                        {
                            var userId = ctx.GetSecureUserId(out var user, true);

                            var values = ctx.GetArgument<object[]>("values", default(object[]));

                            var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>(GqlType.Name);

                            var possibleIdFields = _insertGraphType.Fields.Where(f =>
                            {
                                var innerType = f.InnerResolvedType();
                                return innerType is IdGraphType;
                            }).ToArray();

                            values.ForEach(value =>
                            {
                                var dict = value as Dictionary<string, object>;

//                                if (!user.IsJuliaApiUser())
                                if (false)
                                {
                                    if (dict.ContainsKey("createdBy") || dict.ContainsKey("modifiedBy") || dict.ContainsKey("_id"))
                                    {
                                        throw new SecurityException($"Non-Julia Auth0 Users may not directly specify fields 'createdBy' or 'modifiedBy' or '_id'");
                                    }

                                    dict[OmdbTags.createdBy] = userId;
                                    dict[OmdbTags.modifiedBy] = null;
                                }

                                if (!dict.ContainsKey(OmdbTags.createdBy))
                                {
                                    dict[OmdbTags.createdBy] = userId;
                                }

                                if (!dict.ContainsKey(OmdbTags.modifiedBy))
                                {
                                    dict[OmdbTags.modifiedBy] = null;
                                }

                                dict[OmdbTags.createdTime] = DateTime.UtcNow;

                                if (!dict.ContainsKey(OmdbTags.modifiedTime))
                                {
	                                dict[OmdbTags.modifiedTime] = null;
                                }

                                if (GqlType.Name == "Simulation")
                                {
                                    dict["deletedTime"] = null;
                                }

                                foreach (var idField in possibleIdFields)
                                {
                                    if (dict.ContainsKey(idField.Name) && dict[idField.Name] != null)
                                    {
                                        if (dict[idField.Name] is Object[] arr)
                                        {
                                            dict[idField.Name] = arr.Select(v => v.ToString().TryConvertToObjectId());
                                        }
                                        else
                                        {
                                            dict[idField.Name] = dict[idField.Name].ToString().TryConvertToObjectId();
                                        }
                                    }
                                }
                            });

                            var records = values.Select(v => new BsonDocument(v as Dictionary<string, object>)).ToList();


                            await collection.InsertManyAsync(records);

                            return records.Select(r => r.ToDictionary().ToDynamic());
                        })
                    });
            }
        }

        private void verifyUpdatePermission(IResolveFieldContext ctx, Dictionary<string, object> dict)
        {
            var userId = ctx.GetSecureUserId(out var user, true);

            if (!user.IsJuliaApiUser())
            {
                if (GqlType.Name != "UserTag" && GqlType.Name != "UserTagValue" && !Omdb.Settings.karma)
                {
                    var allowedTags = new List<string> {"name", "userTagValues", "comments", "status", "locked"};

                    if (dict.Keys.Where(key => !allowedTags.Contains(key) && !key.StartsWith("result.userOptions")).Count() > 0)
                        throw new SecurityException($"User is only allowed to modify the following tags: {String.Join(", ", allowedTags)}, userOptions");
                }


                if (dict.ContainsKey("createdBy") || dict.ContainsKey("modifiedBy"))
                    throw new SecurityException($"User may not directly specify fields 'createdBy' or 'modifiedBy'");
            }

            if (dict.ContainsKey("_id"))
            {
                throw new SecurityException($"Changing the primary key of a record is not allowed");
            }
        }

        private void _UpdateField()
        {
            _updateGraphType = new OmdbUpdateGraphType(GqlType);
            if (_updateGraphType.Fields.Any())
            {
                ParentSchema.RegisterType(_updateGraphType);
                AddField(
                    new FieldType()
                    {
                        Name = "update",
                        ResolvedType = new JsonGraphType(),
                        Arguments = new QueryArguments()
                        {
                            new QueryArgument<NonNullGraphType<IdGraphType>>()
                            {
                                Name = "id",
                            },
                            new QueryArgument(new NonNullGraphType(_updateGraphType))
                            {
                                Name = "value"
                            },
//                            new QueryArgument<BooleanGraphType>()
//                            {
//                                Name = "replace",
//                                DefaultValue = true
//                            }
                        },

                        Resolver = new FuncFieldResolver<object>(async ctx =>
                        {
                            var userId = ctx.GetSecureUserId(out var user, true);

                            var id = ctx.GetArgument<string>("id");
                            var dict = ctx.GetArgument<Dictionary<string, object>>("value");
                            //var replace = ctx.Argument<bool>("replace");

                            var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>(GqlType.Name);

                            verifyUpdatePermission(ctx, dict);

                            if (!dict.ContainsKey(OmdbTags.modifiedBy))
                            {
                                dict[OmdbTags.modifiedBy] = userId;
                            }

                            if (!dict.ContainsKey(OmdbTags.modifiedTime))
                            {
	                            dict[OmdbTags.modifiedTime] = DateTime.UtcNow;
                            }

                            var possibleIdFields = _insertGraphType.Fields.Where(f =>
                            {
                                var innerType = f.InnerResolvedType();
                                return innerType is IdGraphType;
                            }).ToArray();

                            foreach (var idField in possibleIdFields)
                            {
                                if (dict.ContainsKey(idField.Name) && dict[idField.Name] != null)
                                {
                                    if (dict[idField.Name] is Object[] arr)
                                    {
                                        dict[idField.Name] = arr.Select(v => v.ToString().TryConvertToObjectId());
                                    }
                                    else
                                    {
                                        dict[idField.Name] = dict[idField.Name].ToString().TryConvertToObjectId();
                                    }
                                }
                            }

                            /* To partially update mongo We need to convert from something like
                                From:  { result: { options: { ... } } }
                                To: { "result.options": {...} }
                             */
//                            if (!replace)
//                            {
//                                ReduceDictionary(dict);
//                            }

                            var _id = id.TryConvertToObjectId();
                            var result = await collection.UpdateOneAsync(Builders<BsonDocument>.Filter.Eq("_id", _id), new BsonDocument("$set", new BsonDocument(dict)));

                            // remove default selected values
                            if (GqlType.Name == "UserTag")
                            {
                                var isRequiredUpdate = dict.ContainsKey("required") && (!(dict["required"] is Boolean) || !((Boolean) dict["required"]));
                                var isMultipleUpdate = dict.ContainsKey("multiple") && (dict["multiple"] is Boolean) && ((Boolean) dict["required"]) == false;
	                            if (isRequiredUpdate && isMultipleUpdate)
	                            {
		                            var tagValueCollection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>("UserTagValue");
		                            var updateDict = new Dictionary<String, Object>();
		                            updateDict["isDefault"] = false;
		                            var r = await tagValueCollection.UpdateManyAsync(
			                            Builders<BsonDocument>.Filter.Eq("tag", _id),
			                            new BsonDocument("$set", new BsonDocument(updateDict)));
	                            }
                            }


//                        return result;
                            dict["_id"] = _id;
                            return dict;
                        })
                    });

                _UpdatePartialField();
                _UpdateFolderName();
            }
        }

        private void _DeleteField()
        {
            Field<ListGraphType<JsonGraphType>>()
                .Name("delete")
                .Argument<ObjectIdGraphType>("id", "")
                .ResolveAsync(async ctx =>
                {
                    var userId = ctx.GetSecureUserId(out var user);
                    var itemId = ctx.GetArgument<ObjectId>("id", default(ObjectId));

                    if (GqlType.Name == "UserTag")
                    {
	                    var objectTypes = await GetObjectTypes(itemId);
	                    var userTagValueCollection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>("UserTagValue");
	                    var userTagValueRecords = await userTagValueCollection
		                    .Find(Builders<BsonDocument>.Filter.Eq("tag", itemId))
		                    .Project(Builders<BsonDocument>.Projection.Include("_id"))
		                    .ToListAsync();
	                    var idList = userTagValueRecords.ConvertAll( value => value.GetValue("_id").AsObjectId);
	                    await DeleteUserTagsInUi(itemId.ToString());
	                    await DeleteUserTagValue(objectTypes, idList, userId);
	                    return await Omdb.DeleteObjectAsync(GqlType.Name, itemId, userId);
                    }
                    else if (GqlType.Name == "UserTagValue")
                    {
	                    var userTagValueCollection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>("UserTagValue");
	                    var userTagValueRecord = await userTagValueCollection
		                    .Find(Builders<BsonDocument>.Filter.Eq("_id", itemId))
		                    .FirstOrDefaultAsync();
	                    var objectTypes = await GetObjectTypes(userTagValueRecord.GetValue("tag").AsObjectId);
	                    var idList = new List<ObjectId>{ itemId };
	                    return await DeleteUserTagValue(objectTypes, idList, userId);
                    }
                    else
                    {
                        if (GqlType.Name == "DeletedSimulation" || (!user.IsJuliaApiUser() && !Omdb.Settings.karma))
                        {
                            throw new SecurityException($"Object deletion not allowed");
                        }

	                    return await Omdb.DeleteObjectAsync(GqlType.Name, itemId, userId);
                    }
                });
        }

        private async Task<List<string>> GetObjectTypes(ObjectId userTagId)
        {
	        var userTagCollection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>("UserTag");
	        var userTagRecord = await userTagCollection
		        .Find(Builders<BsonDocument>.Filter.Eq("_id", userTagId))
		        .FirstOrDefaultAsync();
	        var objectTypes = userTagRecord.Contains("objectTypes") ? userTagRecord.GetValue("objectTypes") as BsonArray : null;
	        return objectTypes != null ? objectTypes.ToList().ConvertAll(new Converter<BsonValue, string>(v => v.AsString)) : null;
        }

        private async Task<List<DeleteResult>> DeleteUserTagValue(List<string> objectTypes, List<ObjectId> userTagValueIds, string userId)
        {
	        foreach (var ot in objectTypes)
            {
				var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>(ot);
				var records = await collection
					.Find(Builders<BsonDocument>.Filter.AnyIn(OmdbGraph.UserTagValueField, userTagValueIds))
					.ToListAsync();

				foreach (var record in records)
				{
					var userTagValues = record.GetValue(OmdbGraph.UserTagValueField).AsBsonArray;

					foreach (var inputUserTagValueId in userTagValueIds)
					{
						var idx = userTagValues.IndexOf(f => f.Equals(inputUserTagValueId));
						if (idx >= 0)
						{
							userTagValues.RemoveAt(idx);
						}
					}

					await collection.UpdateOneAsync(
						Builders<BsonDocument>.Filter.Eq("_id", record.GetValue("_id")),
						new BsonDocument(
							"$set",
							new BsonDocument(
								OmdbGraph.UserTagValueField,
								userTagValues
							)));
				}
            }

	        List<DeleteResult> deleteResults = new List<DeleteResult>();
	        foreach (var userTagValueId in userTagValueIds)
	        {
		        deleteResults.AddRange(await Omdb.DeleteObjectAsync("UserTagValue", userTagValueId, userId));
		    }
	        return deleteResults;
		}

        private async Task DeleteUserTagsInUi(string userTagId)
        {
	        var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>("omdb_ui");
	        var records = await collection
		        .Find(Builders<BsonDocument>.Filter.Empty)
		        .ToListAsync();

	        foreach (var record in records)
	        {
		        var isUpdate = false;
		        var catalogTags  = (record.Contains("catalog") && record.GetValue("catalog").AsBsonDocument.Contains("tags")
			        ? record.GetValue("catalog").AsBsonDocument.GetValue("tags").AsBsonArray  : null);
		        var cardSections = (record.Contains("card") && record.GetValue("card").AsBsonDocument.Contains("sections")
			        ? record.GetValue("card").AsBsonDocument.GetValue("sections").AsBsonArray : null);
		        var tableColumns = (record.Contains("table") && record.GetValue("table").AsBsonDocument.Contains("columns")
			        ? record.GetValue("table").AsBsonDocument.GetValue("columns").AsBsonArray : null);

		        if (catalogTags != null)
		        {
			        var idx = catalogTags.IndexOf(tag => tag.IsBsonDocument && tag.AsBsonDocument.Contains("_id") && tag.AsBsonDocument.GetValue("_id").AsString == userTagId);
			        if (idx >= 0)
			        {
				        catalogTags.RemoveAt(idx);
				        isUpdate = true;
			        }
		        }
		        if (cardSections != null)
		        {
			        cardSections.ForEach(section =>
			        {
				        var tags = section["tags"] as BsonArray;
				        if (tags != null)
				        {
					        var idx = tags.IndexOf(tag => tag.IsBsonDocument && tag.AsBsonDocument.Contains("_id") && tag.AsBsonDocument.GetValue("_id").AsString == userTagId);
					        if (idx >= 0)
					        {
						        tags.RemoveAt(idx);
						        isUpdate = true;
					        }
				        }
			        });
		        }
		        if (tableColumns != null)
		        {
			        var idx = tableColumns.IndexOf(tag => tag.IsBsonDocument && tag.AsBsonDocument.Contains("_id") && tag.AsBsonDocument.GetValue("_id").AsString == userTagId);
			        if (idx >= 0)
			        {
				        tableColumns.RemoveAt(idx);
				        isUpdate = true;
			        }
		        }
		        if (isUpdate)
		        {
			        await collection.UpdateOneAsync(
				        Builders<BsonDocument>.Filter.Eq("_id", record.GetValue("_id")),
				        new BsonDocument("$set", record)
				    );
		        }
	        }
        }

        private void _UpdatePartialField()
           {
               AddField(
                   new FieldType()
                   {
                       Name = "updatePartial",
                       ResolvedType = new JsonGraphType(),
                       Arguments = new QueryArguments()
                       {
                           new QueryArgument<NonNullGraphType<IdGraphType>>()
                           {
                               Name = "id",
                           },
                           new QueryArgument(new NonNullGraphType(new JsonGraphType()))
                           {
                               Name = "set"
                           },
                           new QueryArgument<BooleanGraphType>()
                           {
                               Name = "reduce",
                           }
                       },
                       Resolver = Omdb.GetCacheResetFuncFieldResolver<object>(OmdbCacheKeys.RunQuery, async (ctx) =>
                       {
                           var userId = ctx.GetSecureUserId(out var user, true);

                           var id = ctx.GetArgument<string>("id");
                           var set = ctx.Arguments["set"].GetType() == typeof(Dictionary<string, object>) ? ctx.GetArgument<Dictionary<string, object>>("set")  :
                               (ctx.GetArgument<Dictionary<string, object>>("set"));
                           var needReduce = ctx.Arguments.ContainsKey("reduce") ? ctx.GetArgument<bool>("reduce") : false;
                           var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>(GqlType.Name);

                           verifyUpdatePermission(ctx, set);

                           if (!set.ContainsKey(OmdbTags.modifiedBy))
                           {
                               set[OmdbTags.modifiedBy] = userId;
                           }

                           if (!set.ContainsKey(OmdbTags.modifiedTime))
                           {
	                           set[OmdbTags.modifiedTime] = DateTime.UtcNow;
                           }

                           var possibleIdFields = _insertGraphType.Fields.Where(f =>
                           {
                               var innerType = f.InnerResolvedType();
                               return innerType is IdGraphType;
                           }).ToArray();

                           foreach (var idField in possibleIdFields)
                           {
                               if (set.ContainsKey(idField.Name) && set[idField.Name] != null)
                               {
                                   if (set[idField.Name] is Object[] arr)
                                   {
                                       set[idField.Name] = arr.Select(v => v.ToString().TryConvertToObjectId());
                                   }
                                   else
                                   {
                                       set[idField.Name] = set[idField.Name].ToString().TryConvertToObjectId();
                                   }
                               }
                           }

                           /* To partially update mongo We need to convert from something like
                               From:  { result: { options: { ... } } }
                               To: { "result.options": {...} }
                            */

                           var _id = id.TryConvertToObjectId();
                           if(needReduce) ReduceDictionary(set);
                           try
                           {
                               await collection.UpdateOneAsync(Builders<BsonDocument>.Filter.Eq("_id", _id),
                                   new BsonDocument("$set", new BsonDocument(set)));
                           }
                           catch (MongoConnectionException e) // retrying the same update request if there is a MongoConnectionException
                           {
                               await Task.Run(async () =>
                               {
                                   Thread.Sleep(5000);
                                   await collection.UpdateOneAsync(Builders<BsonDocument>.Filter.Eq("_id", _id),
                                       new BsonDocument("$set", new BsonDocument(set)));
                               });
                           }
                           //                        return result;
                           set["_id"] = _id;
                           return set;
                       })
                   });
        }

        private void _UpdateFolderName()
           {
               AddField(
                   new FieldType()
                   {
                       Name = "updateFolderName",
                       ResolvedType = new JsonGraphType(),
                       Arguments = new QueryArguments()
                       {
                           new QueryArgument<NonNullGraphType<StringGraphType>>()
                           {
                               Name = "oldName"
                           },
                           new QueryArgument<NonNullGraphType<StringGraphType>>()
                           {
	                           Name = "newName"
                           }
                       },
                       Resolver = Omdb.GetCacheResetFuncFieldResolver<object>(OmdbCacheKeys.RunQuery, async (ctx) =>
                       {
                           var userId = ctx.GetSecureUserId(out var user, true);
                           var oldName = ctx.GetArgument<string>("oldName");
                           var newName = ctx.GetArgument<string>("newName");
                           if (!oldName.EndsWith("/"))
	                           oldName = $"{oldName}/";

                           oldName = oldName
	                           .Replace("\\", "\\\\")
	                           .Replace("/", "\\/")
	                           .Replace(".", "\\.")
	                           .Replace("*", "\\*")
	                           .Replace("^", "\\^")
	                           .Replace("?", "\\?")
	                           .Replace("$", "\\$")
	                           .Replace("[", "\\[")
	                           .Replace("]", "\\]")
	                           .Replace(" ", "\\s");

                           if (!newName.EndsWith("/"))
	                           newName = $"{newName}/";
                           newName = new Regex("\\/{2,}", RegexOptions.Multiline).Replace(newName, "/");

                           var collection = OmdbGraph.Omdb.db.GetCollection<BsonDocument>(GqlType.Name);
                           var filter = Builders<BsonDocument>.Filter.Regex("name", new BsonRegularExpression($"^{oldName}", "i"));
                           var records = await collection.Find(filter).ToListAsync();

                           if (records.Count == 0)
                               return new Dictionary<string, object>() { { "count", 0 } };
                           
                           var oldNameRegex = new Regex($"^{oldName}", RegexOptions.IgnoreCase);
                           var updateTime = DateTime.UtcNow;

                           var listWrites= new List<UpdateOneModel<BsonDocument>>();
                           var updates = new List<Dictionary<string, object>>();

                           foreach (var record in records)
                           {
	                           var _id = record["_id"];
	                           var updateName = oldNameRegex.Replace(record["name"].ToString(), newName);

	                           var filterDefinition = Builders<BsonDocument>.Filter.Eq(p => p["_id"], _id);
	                           var updateDefinition = Builders<BsonDocument>.Update
		                           .Set(p => p["name"], updateName)
		                           .Set(p => p[OmdbTags.modifiedBy], userId)
		                           .Set(p => p[OmdbTags.modifiedTime], updateTime);

	                           listWrites.Add(new UpdateOneModel<BsonDocument>(filterDefinition, updateDefinition));

	                           updates.Add(new Dictionary<string, object>()
	                           {
		                           { "_id", _id },
		                           { "oldName", record["name"] },
		                           { "newName", updateName }
	                           });
                           };
                           await collection.BulkWriteAsync(listWrites);

                           return new Dictionary<string, object>()
                           {
	                           { "count", listWrites.Count },
	                           { "newName", newName },
	                           { "updates", updates }
                           };
                       })
                   });
        }

        private void _ExpireField()
        {
            AddField(
                new FieldType()
                {
                    Name = "expire",
                    ResolvedType = new JsonGraphType(),
                    Arguments = new QueryArguments()
                    {
                        new QueryArgument<NonNullGraphType<IdGraphType>>()
                        {
                            Name = "id",
                        },
                    },

                    Resolver = new FuncFieldResolver<object>(async ctx =>
                    {
                        var userId = ctx.GetSecureUserId(out var user, true);
                        var db = OmdbGraph.Omdb.db;

                        var id = ctx.GetArgument<string>("id");
                        var collection = db.GetCollection<BsonDocument>(GqlType.Name);

                        var appFieldName = GqlType.Name == "Simulation" ? "simulation" :
                                           GqlType.Name == "InvestmentOptimization" ? "optimization" :
                                                           "climateRiskAnalysis";
                        var appDeletedCollectionName = "Deleted" + GqlType.Name;
                        var appSessionCollectionName = GqlType.Name + "Session";

                        var deletedDocument = await collection.FindAsync(Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id)));
                        await deletedDocument.ForEachAsync(async (d) =>
                        {
                            // Update billing info and delete time for the document that is about to inserted into delete table
                            d["deletedTime"] = DateTime.UtcNow;
                            if (GqlType.Name == "Simulation"){
                                if (d.Contains("billingInformation") && !(d["billingInformation"].IsBsonNull) && d["billingInformation"]["simulationWorkerEndTime"].IsBsonNull)
                                {
                                    d["billingInformation"]["simulationWorkerEndTime"] = new BsonInt32((Int32)(d["deletedTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000));
                                }
                            }
                            else if(GqlType.Name == "InvestmentOptimization"){
                                if (d.Contains("billingInformation") && !(d["billingInformation"].IsBsonNull) && d["billingInformation"]["optimizationEndTime"].IsBsonNull)
                                {
                                    d["billingInformation"]["optimizationEndTime"] = d["deletedTime"];
                                }
                            }
                            else {
                                if (d.Contains("billingInformation") && !(d["billingInformation"].IsBsonNull) && d["billingInformation"]["analysisEndTime"].IsBsonNull)
                                {
                                    d["billingInformation"]["analysisEndTime"] = d["deletedTime"];
                                }
                            }

                            d.Remove("_id");
                            db.GetCollection<BsonDocument>(appDeletedCollectionName).InsertOne(d);
                            // Update the pointer with new id for all entries in session table

                            var filter = Builders<BsonDocument>.Filter.Eq(appFieldName, ObjectId.Parse(id));
                            var update = Builders<BsonDocument>.Update.Set(appFieldName, d["_id"]);
                            await db.GetCollection<BsonDocument>(appSessionCollectionName).UpdateManyAsync(filter, update);
                            if (GqlType.Name == "Simulation"){
                                await db.GetCollection<BsonDocument>("RSSimulationSession").UpdateManyAsync(filter, update);
                            }
                        });

                        return id;
                    })
                });
        }

        /// <summary>
        ///  From:  { result: { options: { deep: ... } } }
        ///  To: { "result.options.deep": {...} }
        /// </summary>
        /// <param name="dict"></param>
        void ReduceDictionary(Dictionary<string, object> dict)
        {
            try
            {
                var toReduce = new List<Dictionary<string, object>> {dict};

                while (toReduce.Any())
                {
                    var d = toReduce.First();
                    foreach (var k in d.Keys.ToArray())
                    {
                        if (dict[k] is Dictionary<string, object> childDict)
                        {
                            foreach (var k2 in childDict.Keys.ToArray())
                            {
                                var newKey = $"{k}.{k2}";
                                dict.Add(newKey, childDict[k2]);
                                toReduce.Add(dict);
                            }
                            dict.Remove(k);
                        }
                        else if (dict[k] is List<object> childArray)
                        {
                            var nonDictionaryList = new List<object>();
                            foreach (var c in childArray)
                            {
//                                var cDictionary = c as Dictionary<string, object>;
                                if (c is Dictionary<string, object> cDictionary)
                                {
                                    var newKey = $"{k}.{cDictionary["index"]}";
                                    dict.Add(newKey, cDictionary);
                                    toReduce.Add(dict);
                                }
                                else // deal with the case where we want to update entire array
                                {
                                    nonDictionaryList.Add(c);
                                }
                            }
                            if (nonDictionaryList.Count == 0)
                            {
                                dict.Remove(k);
                            }
                        }
                    }

                    toReduce.Remove(d);
                }
            }
            catch (Exception e)
            {
                OmdbGraph.Log.LogCritical(e.ToString());
            }
        }
    }

    public class OmdbInsertUpdateGraphType : InputObjectGraphType
    {
        private static readonly Dictionary<String, InputObjectGraphType> _dynamicGeneratedInputObjectGraphTypes = new();

        public OmdbInsertUpdateGraphType(ObjectGraphType gqlType, bool isInsert)
        {
            Name = GetName(gqlType, isInsert);

            foreach (var field in gqlType.Fields)
            {
                var resolvedType = field.InnerResolvedType(out var isNonNull, out var isList, out var isListItemNonNull);

                if (field.Metadata.ContainsKey("internal") || field.InnerResolvedType().Name == OmdbUnionGraphType.TypeName)
                {
                    continue;
                }

                if (field.Name == OmdbTags.id || field.Name == OmdbTags.createdTime )
                {
                    isNonNull = false;
                }
                //   || field.Name == OmdbTags.modifiedTime || field.Name == OmdbTags.createdBy || field.Name == OmdbTags.modifiedBy

                if (resolvedType is GraphQLTypeReference referenceType)
                {
                    var typeName = referenceType.TypeName;
                    var originalType = GraphSchema.Instance.AdditionalTypeInstances.FirstOrDefault(type => type.Name == typeName);
                    if (originalType is ObjectGraphType)
                    {
                        resolvedType = originalType as ObjectGraphType;
                    }
                    else if (originalType is ConningUserGraph)
                    {
                        resolvedType = new IdGraphType();
                    }
                }

                if (resolvedType is ObjectGraphType t)
                {
                    if (t != gqlType && t.Fields.Any(f =>
                    {
                        var innerType = f.InnerResolvedType(out var fieldIsNonNull, out var fieldIsList, out var fieldIsListItemNonNull);

                        return f.InnerResolvedType().Name == gqlType.Name && !fieldIsList;
                    }))
                    {
                        // Referenced object has link back to us that is not 1 -> many, do not include in insert
                        // A -> B and B -> A
                        continue;
                    }

                    if (t.HasField("_id"))
                    {
                        // Linked object type
                        resolvedType = new IdGraphType();
                    }
                    else
                    {
                        var inputObjectGraphTypeName = GetName(t, isInsert);
                        if (!_dynamicGeneratedInputObjectGraphTypes.TryGetValue(inputObjectGraphTypeName,
                                out InputObjectGraphType newInputObjectGraphType))
                        {
                            newInputObjectGraphType = new OmdbInsertUpdateGraphType(t, isInsert);
                            _dynamicGeneratedInputObjectGraphTypes[inputObjectGraphTypeName] = newInputObjectGraphType;
                        }

                        resolvedType = newInputObjectGraphType;
                    }
                }

                // We've corrected the inner type, now build the final wrapped type

                if (isList)
                {
                    if (isListItemNonNull)
                    {
                        resolvedType = new NonNullGraphType(resolvedType);
                    }

                    resolvedType = new ListGraphType(resolvedType);
                }

                if (isInsert && isNonNull)
                {
                    resolvedType = new NonNullGraphType(resolvedType);
                }

                AddField(new FieldType()
                {
                    Name = field.Name,
                    Description = field.Description,
                    ResolvedType = resolvedType,
                    DefaultValue = field.DefaultValue,
                    Resolver = field.Resolver
                });
            }
        }

        private String GetName(ObjectGraphType gqlType, bool isInsert)
        {
            if (isInsert)
            {
                return $"omdb_{gqlType.Name}_insert";
            }
            return $"omdb_{gqlType.Name}_update";
        }
    }

    public class OmdbInsertGraphType : OmdbInsertUpdateGraphType
    {
        public OmdbInsertGraphType(ObjectGraphType gqlType) : base(gqlType, true)
        {
        }
    }

    public class OmdbUpdateGraphType : OmdbInsertUpdateGraphType
    {
        public OmdbUpdateGraphType(ObjectGraphType gqlType) : base(gqlType, false)
        {
        }
    }
}
