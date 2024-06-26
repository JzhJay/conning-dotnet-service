using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conning.Db.Services;
using GraphQL.DataLoader;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class OmdbBatchDataLoader
    {
        private readonly IDataLoaderContextAccessor _dataLoader;
        private readonly OmdbService _omdb;
        private readonly BaseUserService _userService;
        private readonly string _omdbType;

        public OmdbBatchDataLoader(string omdbType, IDataLoaderContextAccessor dataLoader, OmdbService omdb, BaseUserService userService)
        {
            _omdbType = omdbType;
            _dataLoader = dataLoader;
            _omdb = omdb;
            _userService = userService;
        }

        public async Task<List<dynamic>> LoadOmdbObjects(IEnumerable<string> objectIds)
        {
            var lookups = objectIds.Select(this.LoadOmdbObject).Select(loader => loader.GetResultAsync());
            var result = await Task.WhenAll(lookups);
            return result.ToList();
        }

        public IDataLoaderResult<ConningUser> LoadUser(string userId)
        {
            var dataLoader = _dataLoader.Context.GetOrAddBatchLoader<string, ConningUser>(BaseUserService.UserBatchLoader, _userService.GetUsers);
            return dataLoader.LoadAsync(userId);
        }

        public IDataLoaderResult<dynamic> LoadOmdbObject(string id)
        {
            var dataLoader = _dataLoader.Context.GetOrAddBatchLoader<string, dynamic>(_omdbType, BatchLoadOmdbObjectsById);
            return dataLoader.LoadAsync(id);
        }

        private async Task<IDictionary<string, dynamic>> BatchLoadOmdbObjectsById(IEnumerable<string> objectIds)
        {
            var find = _omdb.db.GetCollection<dynamic>(_omdbType);
            
            var objectIdsParsed = objectIds.Select(id => id.TryConvertToObjectId());
            
            var queryResults = await find.FindAsync(Builders<dynamic>.Filter.In("_id", objectIdsParsed));
            var result = queryResults.ToEnumerable().ToDictionary(r => (string) r._id.ToString());
            foreach (var v in result.Values)
            {
                v.__typename = _omdbType;
            }
            
            return result;
        }
                
        public IDataLoaderResult<dynamic> LoadUiSection(string section)
        {
            var dataLoader = _dataLoader.Context.GetOrAddBatchLoader<string, object>($"{_omdbType}.ui.{section}", BatchLoadOmdbUiBySection);
            return dataLoader.LoadAsync(section);
        }
        
        private async Task<IDictionary<string, dynamic>> BatchLoadOmdbUiBySection(IEnumerable<string> sections)
        {
            var col = _omdb.db.GetCollection<OmdbUi>(OmdbService.UI_COLLECTION);
            var find = col.Find(Builders<OmdbUi>.Filter.Eq("objectType", _omdbType));
            // Get only the fields we are using
            var resultBson = await find.Project(Builders<OmdbUi>.Projection.Combine(sections.Select(s => Builders<OmdbUi>.Projection.Include(s)))).FirstOrDefaultAsync();

            var result = resultBson == null ? null : BsonSerializer.Deserialize<dynamic>(resultBson);
            var resultDict = result as IDictionary<string, object>;
            
            var dictResult = new Dictionary<string, dynamic>(sections.Select(section =>
            {
                
                return new KeyValuePair<string, dynamic>(
                    section,
                    result == null
                        ? null
                        : resultDict.ContainsKey(section) ? resultDict[section] : null);
            }));

            return dictResult;
        }
    }

    /// <summary>
    /// For loading rows from tables which point <i>back</i> to an original type
    ///
    /// Example:
    ///    type UserTag {
    ///        _id: ID!
    ///        name: String!
    ///        values: [UserTagValue!]!
    /// 
    ///    type UserTagValue {
    ///       _id: ID!
    ///       tag: UserTag!
    ///    }
    ///
    ///    In the db, the tag value actually points to the user tag, the tag itself does not have an array of values 
    ///    
    /// </summary>
    class OmdbReferenceBatchDataLoader
    {
        private readonly string _collection;
        private readonly string _field;
        private readonly IDataLoaderContextAccessor _dataLoader;
        private readonly OmdbService _omdb;
        private readonly BaseUserService _userService;

        public OmdbReferenceBatchDataLoader(string collection, string field, IDataLoaderContextAccessor dataLoader, OmdbService omdb, BaseUserService userService)
        {
            _collection = collection;
            _field = field;
            _dataLoader = dataLoader;
            _omdb = omdb;
            _userService = userService;
        }

        private string LoaderName => _collection + "_to_" + _field;

        public IDataLoaderResult<List<dynamic>> LoadOmdbObjectReferencing(string objectId)
        {
            var dataLoader = _dataLoader.Context.GetOrAddBatchLoader<string, List<object>>(LoaderName, BatchLoadOmdbObjectsReferencingById);
            return dataLoader.LoadAsync(objectId);
        }

        private async Task<IDictionary<string, List<dynamic>>> BatchLoadOmdbObjectsReferencingById(IEnumerable<string> objectIds)
        {
            var find = _omdb.db.GetCollection<dynamic>(_collection);
            var objectIdsParsed = objectIds.Select<string, object>(id =>
            {
                ObjectId objectId;
                if (!ObjectId.TryParse(id, out objectId))
                {
                    return id;
                }

                return objectId;
            });
            
            var queryResults = await find.FindAsync(Builders<dynamic>.Filter.In(_field, objectIdsParsed));

            var result = new Dictionary<string, List<dynamic>>();
            foreach (var qr in queryResults.ToEnumerable())
            {
                var eo = qr as IDictionary<string, object>;
                var localId = eo[_field].ToString();
                if (!result.ContainsKey(localId))
                {
                    result.Add(localId, new List<dynamic>());
                }

                result[localId].Add(qr);
            }

            return result;
        }
    }
}