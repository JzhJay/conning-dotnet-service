using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Conning.Db.Services;
using Conning.GraphQL;
using Npgsql;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;

namespace Conning.Kui.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class omdbController : Controller
    {
        private readonly IOptions<AdviseAppSettings> _settings;
        private readonly ILogger<omdbController> _log;
        private readonly MongoDbService _mongo;
        private OmdbService _omdb;

        public omdbController(ILogger<omdbController> log, IOptions<AdviseAppSettings> settings, MongoDbService mongo, OmdbService omdb)
        {
            _log = log;
            _settings = settings;
            _mongo = mongo;
            _omdb = omdb;
        }

        private AdviseAppSettings settings
        {
            get { return _settings.Value; }
        }


        private IMongoDatabase _database
        {
            get { return _mongo.database; }
        }

        //[Authorize("read:tags")]
        [HttpGet("tags")]
        public List<OmdbTag> GetTags([FromQuery] string objectType)
        {
            return _omdb.GetTags(objectType);
        }

        [Authorize("edit:tags")]
        [HttpPost("tags")]
        public dynamic UpdateTags([FromBody] dynamic updateTags)
        {
            var tagsCollectionBson = _database.GetCollection<BsonDocument>("tags");
            var tagsCollection = _database.GetCollection<OmdbTag>("tags");
            List<Dictionary<string, string>> objectTypeUpdates = new List<Dictionary<string, string>>();
            var existingUpdateIDs = new List<ObjectId>();


            // Validation
            foreach (var updateTag in updateTags)
            {
                var isNewTag = updateTag["_id"] == "";

                var prevTag = (OmdbTag) null;
                if (!isNewTag)
                {
                    var tagID = new ObjectId(updateTag["_id"].ToString());
                    prevTag = tagsCollection.AsQueryable().First(item => item._id == tagID);
                    existingUpdateIDs.Add(tagID);
                }

                var tagName = updateTag["name"].ToString();

                if (tagName == "")
                    throw new Exception("Missing tag name");

                var updateTagCount = ((JArray) updateTags).Where(t => t["name"].ToString() == tagName).Count();
                if (updateTagCount > 1)
                    throw new Exception("Update contains multiple tags with the same name");

                var existingTagCount = tagsCollectionBson.Count(Builders<BsonDocument>.Filter.Eq("name", tagName));
                if (existingTagCount > 0 && (isNewTag || prevTag.name != tagName))
                    throw new Exception("Tag name already in use");


                if (updateTag["default"] != null && updateTag["type"] != null && updateTag["default"].Type.ToString() != updateTag["type"].ToString())
                    throw new Exception("Default value for tag does not match tag datatype");

                if (updateTag["required"] == true && (isNewTag || !prevTag.required))
                {
                    // Make sure every object that the tag is required for has the tag or we have a default value
                    foreach (var oT in updateTag["objectTypes"])
                    {
                        var objectType = oT.ToString();
                        var missingCount = _database.GetCollection<BsonDocument>(objectType).Count(Builders<BsonDocument>.Filter.Exists(tagName, false));

                        if (missingCount > 0)
                        {
                            if (updateTag["default"] == null)
                                throw new Exception($"There are objects missing required {tagName} Tag. To apply this tag to these objects a default value is required.");


                            objectTypeUpdates.Add(new Dictionary<string, string>()
                            {
                                {"objectType", objectType},
                                {"tagName", tagName},
                                {"tagValue", updateTag["default"].Value}
                            });

                            //var update = Builders<BsonDocument>.Update.Set(tagName, updateTag["default"].Value);
                            //_database.GetCollection<BsonDocument>(objectType).UpdateMany(Builders<BsonDocument>.Filter.Exists(tagName, false), update);
                        }
                    }
                }

                if (!isNewTag && updateTag["type"] != prevTag.type)
                {
                    throw new Exception($"Datatype cannot be updated on existing {tagName} tag");
                }

                if (!isNewTag && updateTag["multiple"] == false && prevTag.multiple == true)
                {
                    // we need to see if any multiples exist and reject this update if
                    // they do.
                }
            }

            // Apply object type updates that were determined during validation
            foreach (var oTUpdate in objectTypeUpdates)
            {
                var update = Builders<BsonDocument>.Update.Set(oTUpdate["tagName"], oTUpdate["tagValue"]);
                _database.GetCollection<BsonDocument>(oTUpdate["objectType"]).UpdateMany(Builders<BsonDocument>.Filter.Exists(oTUpdate["tagName"], false), update);
            }


            // Delete tags not present in update
            var tagsToDelete = tagsCollection.Find(Builders<OmdbTag>.Filter.Not(Builders<OmdbTag>.Filter.In("_id", existingUpdateIDs))).ToList();

            foreach (var omdbTag in tagsToDelete)
            {
                foreach (var oT in omdbTag.objectTypes)
                {
                    _database.GetCollection<BsonDocument>(oT)
                        .UpdateMany(Builders<BsonDocument>.Filter.Exists(omdbTag.name, true), Builders<BsonDocument>.Update.Unset(omdbTag.name));
                }

                tagsCollection.DeleteOne(t => t._id == omdbTag._id);
            }

            foreach (var updateTag in updateTags)
            {
                var fragment = BsonDocument.Parse(JsonConvert.SerializeObject(updateTag));
                fragment.Remove("_id"); // Remove ID which is immutable and cannot be updated

                if (updateTag["_id"] == "")
                {
                    // Insert
                    tagsCollectionBson.InsertOneAsync(fragment);
                }
                else
                {
                    var tagID = new ObjectId(updateTag["_id"].ToString());
                    var prevTag = tagsCollection.AsQueryable().First(item => item._id == tagID);

                    // Update Tag
                    tagsCollectionBson.ReplaceOne(
                        Builders<BsonDocument>.Filter.Eq("_id", tagID),
                        fragment);

                    var newTagName = updateTag["name"].ToString();

                    if (prevTag.name != newTagName)
                    {
                        // Update tag uses in other tables
                        // TODO batch updates to the same collection
                        foreach (var objectType in prevTag.objectTypes)
                        {
                            try
                            {
                                var update = Builders<BsonDocument>.Update.Rename(prevTag.name, newTagName);
                                _database.GetCollection<BsonDocument>(objectType).UpdateMany(Builders<BsonDocument>.Filter.Exists(prevTag.name, true), update);
                            }
                            catch (Exception e)
                            {
                                _log.LogWarning($"{objectType} tag rename failed");
                                _log.LogError(e.ToString());
                            }
                        }
                    }
                }
            }

            return true;
        }

//        [Authorize("read:tags")]
//        [HttpGet("tags/distinct")]
//        public async Task<Dictionary<string, List<DistinctTagValuesEntry>>> GetDistinctTagValues([FromQuery] string objectTypes = "",
//            [FromQuery] string tags = "", [FromQuery] string searchText = null)
//        {
//            return await _omdb.getDistinctTagValues(objectTypes, string.IsNullOrEmpty(tags) ? new string[] { } : tags.Split(","), searchText,
//                Request.Query.ToDictionary(r => r.Key, r => r.Value as object));
//        }

        [HttpGet("objects")]
        public async Task<OmdbQueryResult> RunQueryAsync([FromQuery] string objectTypes = "", [FromQuery] int skip = 0,
            [FromQuery] int limit = OmdbService.DEFAULT_QUERY_LIMIT, [FromQuery] string searchText = "",
            [FromQuery] string sortBy = "", [FromQuery] string sortOrder = "asc")
        {
            return await _omdb.RunQueryAsync(objectTypes.Split(","), Request.Query.ToDictionary(r => r.Key, r => (object) r.Value.ToString()), skip, limit, searchText, sortBy, sortOrder);
        }

        [HttpGet("ui")]
        public List<OmdbUi> GetUi([FromQuery] string objectTypes)
        {
            IQueryable<OmdbUi> q = _database.GetCollection<OmdbUi>(OmdbService.UI_COLLECTION)
                .AsQueryable();

            if (!string.IsNullOrEmpty(objectTypes))
            {
                var types = objectTypes.Split(",");
                q = q.Where(t => types.Contains(t.objectType));
            }

            return q.ToList();
        }

        [Authorize("edit:objects")]
        [HttpPost("objects")]
        public dynamic UpdateSingle([FromBody] OmdbUpdateRecord updateRecord)
        {
            return _omdb.updateSingleRow(updateRecord.collection, updateRecord._id, updateRecord.tags);
        }

        [Authorize("edit:ui")]
        [HttpPost("ui")]
        public dynamic UpdateUI([FromBody] OmdbUpdateUiRequest updateRequest)
        {
            var objectType = updateRequest.objectType;
            var fragment = BsonDocument.Parse(JsonConvert.SerializeObject(updateRequest.fragment));

            // Todo - security check on the row itself

            if (string.IsNullOrEmpty(objectType))
            {
                throw new ArgumentException("objectType field is required");
            }

            var uiCollectionBson = _database.GetCollection<BsonDocument>(OmdbService.UI_COLLECTION);
            var uiCollection = _database.GetCollection<OmdbUi>(OmdbService.UI_COLLECTION);

            // Get the current record
            var existing = uiCollection.AsQueryable().First(item => item.objectType == objectType);

            var stats = uiCollectionBson.UpdateOne(
                Builders<BsonDocument>.Filter.Eq("objectType", objectType),
                new BsonDocument("$set", fragment));
            
            _log.LogInformation($"Updated UI Entry for Object Type '{EscapeCrLfForLog(objectType)}':\n\t{EscapeCrLfForLog(fragment.ToString())}");
            // Verify we can still deserialize the UI record
            try
            {
                var updated = uiCollection.AsQueryable().First(item => item.objectType == objectType);
                return updated;
            }
            catch (FormatException e)
            {
                uiCollection.ReplaceOne(row => row.objectType == objectType, existing);
                _log.LogWarning($"Update produced bad UI Object - rolled back to original.");
                throw e;
            }
        }

        public async Task<bool> CollectionExistsAsync(string collectionName)
        {
            var filter = new BsonDocument("name", collectionName);
            //filter by collection name
            var collections = await _database.ListCollectionsAsync(new ListCollectionsOptions {Filter = filter});
            //check for existence
            return await collections.AnyAsync();
        }

        #region Stress Testing

        [
            HttpGet("test/stress/naive")]
        public async Task<string> StressTest_SingleThread_OneAtATime()
        {
            var objectTable = _database.GetCollection<dynamic>("objects");
            var start = DateTime.Now;

            var items = 500;
            for (var i = 0; i < items; i++)
            {
                var mock = new MockSimulationObject();
                //Console.WriteLine($"Adding mock {mock.GUID}");
                await objectTable.InsertOneAsync(mock);
            }

            var elapsed = DateTime.Now.Subtract(start);
            return
                $"{(items / elapsed.TotalSeconds).ToString("N2")}  t/s - Took {elapsed.TotalMilliseconds}ms to insert {items.ToString("N0")} rows";
        }

        [
            HttpGet("test/stress/naive_batched")]
        public async Task<string> StressTest_SingleThread_Batched()
        {
            var objectTable = _database.GetCollection<dynamic>("objects");
            var start = DateTime.Now;

            var items = 5000;
            var batch = 100;

            for (var i = 0; i < items / batch; i++)
            {
                var mocks = Enumerable.Range(1, batch).Select(index => new MockSimulationObject());
                await objectTable.InsertManyAsync(mocks);
            }

            var elapsed = DateTime.Now.Subtract(start);
            return
                $"{(items / elapsed.TotalSeconds).ToString("N2")}  t/s - Took {elapsed.TotalMilliseconds}ms to insert {items.ToString("N0")} rows";
        }

        [
            HttpGet("test/stress/threaded_batched")]
        public string StressTest_Threaded_Batched()
        {
            var objectTable = _database.GetCollection<dynamic>("objects");
            var start = DateTime.Now;

            var items = 50000;
            var batch = 100;
            var threads = 10;

            var tasks = new List<Task>();

            for (var t = 0; t < threads; t++)
            {
                tasks.Add(
                    Task.Factory.StartNew(() =>
                    {
                        for (var i = 0; i < items / batch; i++)
                        {
                            var mocks = Enumerable.Range(1, batch).Select(index => new MockSimulationObject());
                            objectTable.InsertMany(mocks);
                        }
                    }));
            }

            Task.WaitAll(tasks.ToArray());
            var elapsed = DateTime.Now.Subtract(start);

            var totalItems = items * threads;

            return
                $"{(totalItems / elapsed.TotalSeconds).ToString("N2")}  t/s - Took {elapsed.TotalMilliseconds}ms to insert {totalItems.ToString("N0")} rows";
        }

        [
            HttpGet("test/queries")]
        public string RunSomeQueries()
        {
            var result = new StringBuilder();

            var objects = _database.GetCollection<IDbObject>("objects").AsQueryable();
            var stopWatch = new Stopwatch();

            stopWatch.Start();
            var withScenarios = from o in objects
                where o.Scenarios == 277296121940926124
                select o;

            foreach (var o in withScenarios)
            {
                // Console.WriteLine(o);
            }

            stopWatch.Stop();
            result.Append($"Selected {withScenarios.Count()} items in {stopWatch.ElapsedMilliseconds}ms\n");

            stopWatch.Restart();
            var firstWithGuid = (from o in objects where o.GUID == "99907" select o).First();
            stopWatch.Stop();
            result.Append($"Found first object with specified guid in {stopWatch.ElapsedMilliseconds}ms\n");

            stopWatch.Restart();
            var firstWithName = (from o in objects where o.Name == "Name99507" select o).First();
            stopWatch.Stop();
            result.Append($"Found first object with specified name in {stopWatch.ElapsedMilliseconds}ms\n");

            return result.ToString();
        }

        [
            HttpGet("test/queries2")]
        public string RunSomeQueries2()
        {
            var result = new StringBuilder();

            var objects = _database.GetCollection<IDbObject>("objects").AsQueryable();

            var stopWatch = new Stopwatch();

            stopWatch.Start();
            var withScenarios = objects.Where(o => o.Scenarios == 277296121940926124).Select(o => o.GUID);
            foreach (var o in withScenarios)
            {
                //Console.WriteLine(o);
            }

            stopWatch.Stop();
            result.Append($"Selected {withScenarios.Count()} items in {stopWatch.ElapsedMilliseconds}ms\n");

            stopWatch.Restart();
            var firstWithGuid = objects.Where(o => o.GUID == "99907").First();
            stopWatch.Stop();
            result.Append($"Found first object with specified guid in {stopWatch.ElapsedMilliseconds}ms\n");

            stopWatch.Restart();
            var firstWithName = objects.Where(o => o.Name == "Name99507").First();
            stopWatch.Stop();
            result.Append($"Found first object with specified name in {stopWatch.ElapsedMilliseconds}ms\n");

            return result.ToString();
        }

        private string EscapeCrLfForLog(string str)
        {
            return str.Replace("\r", "_").Replace("\n", "_");
        }
        
        #endregion
    }

    public class IDbObject
    {
        public ObjectId _id { get; set; }
        public string Owner { get; set; }
        public string Created { get; set; }
        public string Touched { get; set; }
        public Int64 Size { get; set; }
        public Int64 Variables { get; set; }
        public Int64 Scenarios { get; set; }
        public string ObjectType { get; set; }
        public bool Archived { get; set; }
        public string GUID { get; set; }
        public string Name { get; set; }
    }
}

class MockSimulationObject
{
    public Guid GUID = Guid.NewGuid();
    public DateTime Created = DateTime.Now;
    public DateTime Touched = DateTime.Now;
    public int Variables;
    public int Size;
    public int Scenarios;
    public bool Archived = false;
    public string Name = Guid.NewGuid().ToString();
    public string ObjectType = "Simulation";

    public MockSimulationObject()
    {
        var r = new Random();
        Variables = r.Next(10000);
        Size = r.Next(10000);
        Scenarios = r.Next(10000);
    }
}
