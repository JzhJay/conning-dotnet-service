using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Conning.Db;
using Conning.Library.Utility;
using Conning.Models.OMDB;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Resolvers;
using GraphQL.Types;
using MongoDB.Bson;
using MongoDB.Driver;

/**
 * GraphQL API
 * Mutations:
 * omdb {
 *     folder {
 *         addItems(folderId: "parent-id", items: [{itemId: "sim-id", objectType: "Simulation"}])
 *         
 *     }
 * }
 */
namespace Conning.GraphQL
{
    public static class FolderQueryTypeExtensions
    {
        public static void ExtendFolderType(this ObjectGraphType gqlType)
        {
            var omdbGraph = OmdbGraph.Instance;
            var omdb = omdbGraph.Omdb;

            var hasChildrenField = gqlType.Field<BooleanGraphType>()
                .Name("hasChildren")
                .ResolveAsync(async ctx =>
                {
                    var col = OmdbGraph.Instance.Omdb.db.GetCollection<FolderItem>("FolderItem");
                    var source = ctx.Source as dynamic;
                    var id = (ObjectId) source._id;

                    var count = await col.CountAsync(Builders<FolderItem>.Filter.Where(fi => fi._folder == id));
                    return count > 0;
                });
            hasChildrenField.FieldType.Metadata.Add("internal", true);

            /*var descendantsField = gqlType.AddField(
                new FieldType()
                {
                    Name = "descendants",
                    ResolvedType = new ListGraphType(omdbGraph.ObjectTypes["FolderItem"]),
                    Arguments = new QueryArguments()
                    {
                        new QueryArgument<BooleanGraphType>() {Name = "recurse", DefaultValue = false}
                    },
                    Resolver = new AsyncFieldResolver<object>(async ctx =>
                    {
                        var recurse = ctx.Argument<bool>("recurse");
                        var folder = ctx.Source;
                        

//                        var includedFolders = await omdb.FolderCollection
//                            .Find(f => f.path == path || (recurse && f.path.StartsWith(path)))
//                            .Project(Builders<Folder>.Projection.Include(f => f._id))
//                            .ToListAsync();
//                        
//
//                        if (includedFolders == null)
//                        {
//                            throw new Exception($"Unable to find any folders with path {path}");
//                        }

                        var result = new List<dynamic>();

                        return result;
                    })
                });

            descendantsField.Metadata.Add("internal", true);
            */
        }

        public static void ExtendFolderItemType(this ObjectGraphType gqlType)
        {
            // Override name to resolve the child object's name if null
            gqlType.AddField(
                new FieldType()
                {
                    ResolvedType = OmdbGraph.Instance.UnionType,
                    Name = "item",
                    Resolver = new FuncFieldResolver<dynamic>(ctx =>
                    {
                        //
                        var folderItem = ctx.Source as dynamic;

                        var objectType = (string) folderItem.itemType;
                        var id = folderItem.itemId;

                        if (!OmdbGraph.Instance.ObjectTypes.ContainsKey(objectType))
                        {
                            return null;
                            //throw new Exception($"Invalid object type '{objectType}' ");
                        }

                        // Get the corresponding object
                        var batchLoader = OmdbGraph.Instance.BatchDataLoaders[objectType];
                        return batchLoader.LoadOmdbObject(id.ToString());
                    })
                });   
        }
    }
    
    #region Mutations
    public class FolderItemInput
    {
        public ObjectId itemId { get; set; }
        public string objectType { get; set; }
    }

    public class FolderItemInputType : InputObjectGraphType<FolderItemInput>
    {
        public FolderItemInputType()
        {
            Field<ObjectIdGraphType>().Name("itemId");
            Field(_ => _.objectType);
        }
    }

    public class FolderMutationGraph : ObjectGraphType
    {
        public OmdbService Omdb { get; }
        public OmdbGraph OmdbGraph { get; }

        public FolderMutationGraph(OmdbService omdb, OmdbGraph omdbGraph)
        {
            Omdb = omdb;
            OmdbGraph = omdbGraph;
            Name = "omdb_folder_mutations";

            Register_NewFolderField();
            Register_RenameField();
            //Register_DeleteFolderItemField();

            Field<JsonGraphType>()
                .Name("addItems")
                .Argument<NonNullGraphType<ObjectIdGraphType>>("folderId", "")
                .Argument<NonNullGraphType<ListGraphType<NonNullGraphType<FolderItemInputType>>>>("items", "")
                .ResolveAsync(async ctx =>
                {
                    var folderId = ctx.GetArgument<ObjectId>("folderId");
                    var items = (ctx.GetArgument<object[]>("items")).Select(i =>
                    {
                        var dict = (Dictionary<string, object>) i;

                        if (!dict.ContainsKey("itemId") || !dict.ContainsKey("objectType"))
                        {
                            throw new ArgumentException("Every folder item specified must include an item ID and objectType");
                        }
                        
                        return new FolderItemInput()
                        {
                            itemId = (ObjectId) dict["itemId"],
                            objectType = dict["objectType"].ToString()
                        };
                    }).ToImmutableArray();

                    var userId = ctx.GetSecureUserId(out var user);
                    var folder = await Omdb.FolderCollection.Find(Builders<Folder>.Filter.Where(f => f._id == folderId)).FirstOrDefaultAsync();

                    var existingFolderItems = await Omdb.FolderItemsCollection.Find(Builders<FolderItem>.Filter.Where(fi => fi._folder == folderId)).ToListAsync();
                    var existingFolderItemsDict = existingFolderItems.ToDictionary(fi => fi.itemId);
                    var itemsToInsert = new List<FolderItem>();

                    foreach (var item in items.Where(item => !existingFolderItemsDict.ContainsKey(item.itemId)))
                    {
                        itemsToInsert.Add(new FolderItem()
                        {
                            itemId = item.itemId,
                            _folder = folderId,
                            createdBy = userId,
                            createdTime = DateTime.UtcNow,
                            itemType = item.objectType
                        });
                    }

                    await Omdb.FolderItemsCollection.InsertManyAsync(itemsToInsert.ToArray());
                    return itemsToInsert;
                });
        }

       
        private void Register_NewFolderField()
        {
            AddField(
                new FieldType()
                {
                    Name = "newFolder",
                    ResolvedType = OmdbGraph.Instance.ObjectTypes["Folder"],
                    Arguments = new QueryArguments(
                        new QueryArgument<StringGraphType>() {Name = "path"},
                        new QueryArgument<NonNullGraphType<StringGraphType>>() {Name = "name"}
                    ),
                    Resolver = new FuncFieldResolver<object>(async ctx =>
                    {
                        var userId = ctx.GetSecureUserId(out var user);

                        var path = ctx.GetArgument<string>("path");
                        var name = ctx.GetArgument<string>("name");

                        var folder = new Folder
                        {
                            name = name,
                            path = path,
                            createdBy = userId,
                            createdTime = DateTime.UtcNow
                        };

                        await Omdb.FolderCollection.InsertOneAsync(folder);

                        // Add a child folder item pointing to us to our parent
                        if (!String.IsNullOrEmpty(path))
                        {
                            var pathIds = String.IsNullOrEmpty(path) ? null : path.Split(".").Select(ObjectId.Parse);

                            var parentId = pathIds.Last();
                            await Omdb.FolderItemsCollection.InsertOneAsync(new FolderItem
                            {
                                _folder = parentId,
                                itemId = folder._id,
                                itemType = "Folder",
                                createdBy = userId,
                                createdTime = DateTime.UtcNow
                            });
                        }

                        return folder.ToDynamic();
                    })
                });
        }

        private void Register_RenameField()
        {
            AddField(
                new FieldType
                {
                    ResolvedType = OmdbGraph.ObjectTypes["Folder"],
                    Name = "rename",
                    Arguments = new QueryArguments
                    {
                        new QueryArgument<NonNullGraphType<ObjectIdGraphType>> {Name = "id"},
                        new QueryArgument<NonNullGraphType<StringGraphType>> {Name = "name"}
                    },
                    Resolver = new FuncFieldResolver<dynamic>(async ctx =>
                    {
                        var id = ctx.GetArgument<ObjectId>("id");
                        var name = ctx.GetArgument<string>("name");

                        var modifiedBy = ctx.GetSecureUserId(out var user);

                        var result = await Omdb.FolderCollection.FindOneAndUpdateAsync<Folder>(
                            f => f._id == id,
                            Builders<Folder>.Update
                                .Set(u => u.name, name)
                                .Set(u => u.modifiedBy, modifiedBy)
                                .Set(u => u.modifiedTime, DateTime.UtcNow),
                            new FindOneAndUpdateOptions<Folder> {ReturnDocument = ReturnDocument.After});
                                                    

                        if (result == null)
                        {
                            throw new Exception($"Unable to find folder with id '{id}'");
                        }

                        return result.ToDynamic();
                    })
                });
        }

        /*private void Register_DeleteFolderItemField()
        {
            Field<StringGraphType>()
                .Name("deleteFolderItem")
                .Argument<NonNullGraphType<ObjectIdGraphType>>("id", "")
                .Argument<NonNullGraphType<StringGraphType>>("type", "")
                .ResolveAsync(async ctx =>
                {
                    var id = ctx.Argument<ObjectId>("id");
                    var type = ctx.Argument<string>("type");

                    DeleteResult foldersDeleted = null;
                    var deletedFolders = new List<ObjectId>();
                    if (type == "Folder")
                    {
                        // Lookup the path
                        var folderBson = await Omdb.FolderCollection.Find(f => f._id == id).Project(Builders<Folder>.Projection.Include(f => f.path)).FirstOrDefaultAsync();

                        if (folderBson == null)
                        {
                            throw new Exception($"Unable to find folder with id {id}");
                        }

                        var path = folderBson["path"].ToString();

                        var pathIncludingFolder = path + "." + id.ToString();

                        deletedFolders = await Omdb.FolderCollection
                            .Find(f => f._id == id || f.path.StartsWith(pathIncludingFolder))
                            .Project(p => p._id)
                            .ToListAsync();

                        // Delete our folder as well as any descendants                      
                        foldersDeleted = await Omdb.FolderCollection.DeleteManyAsync(f => deletedFolders.Contains(f._id));
                    }

                    // Remove the folder items
                    var itemsDeleted = await Omdb.FolderItemsCollection
                        .DeleteManyAsync(fi => fi.itemId == id || deletedFolders.Contains(fi._folder));

                    var result = new {itemsDeleted, folderDeleted = foldersDeleted};
                    return result.ToDynamic();
                });
        }*/
    }
    
    #endregion
}