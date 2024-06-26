using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conning.Db.RecordUpdater.DataProcessors;
using Conning.Db.Services;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Conning.Db.RecordUpdater
{
    public class BaseUpdater
    {
	    public static string SCHEMA_VERSION_COLUMN = "version";

	    protected BaseDatabase _database;
	    protected SortedDictionary<string, List<RecordPreprocessor>> _handlersByCollection;
	    private UpdateRecordsPreprocessBySchemaVersion _versionUpdater;

	    public BaseUpdater(BaseDatabase database)
        {
            this._database = database;
            this._handlersByCollection = new SortedDictionary<string, List<RecordPreprocessor>>();
            this._versionUpdater = new UpdateRecordsPreprocessBySchemaVersion(database);
        }

        public void AddPreprocessHandler(RecordPreprocessor handler)
        {
	        if (!(handler?.supportCollections?.Length > 0))
	        {
		        this._database.GetMongoDbService().getLogger().LogError("Unable to add record preprocessor without any supported collection.");
		        return;
	        }

	        foreach (var supportCollection in handler.supportCollections)
	        {
		        if (!this._handlersByCollection.ContainsKey(supportCollection))
		        {
			        this._handlersByCollection.Add(supportCollection, new List<RecordPreprocessor>());
		        }
		        this._handlersByCollection[supportCollection].Add(handler);
	        }
        }

        public string[] GetHandlerCollectionNames()
        {
	        return this._handlersByCollection.Keys.ToArray();
        }

        protected virtual async Task<bool> IsCollectionQueryable(IMongoCollection<BsonDocument> collection)
        {
	        return (await collection.AsQueryable().AnyAsync());
        }

        public async Task Update()
        {
            var mongoDb = this._database.GetMongoDb();
            var currentSchemaVersion = this._database.GetMongoDbService().getSchemaVersion();
            var log = this._database.GetMongoDbService().getLogger();

            var isRollback = Environment.GetEnvironmentVariable("ROLLBACK_SCHEMA_VERSION") == "1";

            if (isRollback)
            {
	            log.LogWarning($"start rollback ");
            }

            foreach (var collectionName in GetHandlerCollectionNames())
            {
	            var collection = mongoDb.GetCollection<BsonDocument>(collectionName);
	            var updatingDataList = (await IsCollectionQueryable(collection)) ?
		            !isRollback ?
		            collection.Find(Builders<BsonDocument>.Filter.Or(new []
		            {
			            Builders<BsonDocument>.Filter.Lt(SCHEMA_VERSION_COLUMN, currentSchemaVersion),
			            Builders<BsonDocument>.Filter.Not(Builders<BsonDocument>.Filter.Exists(SCHEMA_VERSION_COLUMN)),
		            })).ToList() :
		            collection.Find(Builders<BsonDocument>.Filter.Gt(SCHEMA_VERSION_COLUMN, currentSchemaVersion)).ToList() :
		            null;

	            var handlers = _handlersByCollection[collectionName].Where(
		            handler => string.IsNullOrEmpty(handler.supportVersion) || (isRollback
			            ? handler.supportVersion.CompareTo(currentSchemaVersion) <= 0
			            : handler.supportVersion.CompareTo(currentSchemaVersion) >= 0)
	            ).ToList();

	            if (updatingDataList?.Count > 0 && handlers.Count > 0)
	            {
		            handlers.Add(this._versionUpdater);
		            if (isRollback)
		            {
			            handlers.Reverse();
		            }

		            var updatedRecordCount = 0;
		            foreach (var record in updatingDataList)
		            {
			            var _id = record["_id"];
			            try
			            {
				            var executeHandlers = new List<String>();
				            foreach (RecordPreprocessor handler in handlers)
				            {
					            var supportVersion = handler.supportVersion;

					            if (string.IsNullOrEmpty(supportVersion) &&
					                !isRollback ?
						                handler.Execute(record, collectionName) :
						                handler.Rollback(record, collectionName))
					            {
						            executeHandlers.Add(handler.GetType().Name);
						            continue;
					            }

					            var emptyVersion = !record.Contains(SCHEMA_VERSION_COLUMN);
					            var recordVersion = emptyVersion ? null : record[SCHEMA_VERSION_COLUMN].ToString();
					            if (!isRollback)
					            {
						            if ((emptyVersion || supportVersion.CompareTo(recordVersion) >= 0) &&
						                handler.Execute(record, collectionName))
						            {
							            executeHandlers.Add(handler.GetType().Name);
						            }
					            }
					            else
					            {
						            if (supportVersion.CompareTo(recordVersion) < 0 &&
						                handler.Rollback(record, collectionName))
						            {
							            executeHandlers.Add(handler.GetType().Name);
						            }
					            }
				            }

				            if (executeHandlers.Count > 0)
				            {
					            collection.UpdateOne(Builders<BsonDocument>.Filter.Eq("_id", _id),
						            new BsonDocument("$set", record));;
					            // log.LogInformation($"[{(isRollback ? "rollback" : "update")}] {collectionName} record '{_id}' with {executeHandlers.ToJson()} handler(s)");
					            updatedRecordCount++;
				            }
				            else
				            {
					            // log.LogInformation($"[ignore] {collectionName} record '{_id}' without applying any handlers");
				            }

			            }
			            catch (Exception e)
			            {
				            log.LogError(
					            $"Unable to {(isRollback ? "rollback" : "update")} {collectionName} record '{_id}': {record.ToJson()}");
				            log.LogError(e.ToString());
			            }
		            }

		            log.LogWarning(
			            $"'{collectionName}' on tenant '{this._database.TenantName}' - {(isRollback ? "rollbacked" : "updated")} ({updatedRecordCount} of {updatingDataList.Count}) records.");
	            }
	            else
	            {
		            log.LogInformation(
			            $"'{collectionName}' on tenant '{this._database.TenantName}' does not exist or no records under version #{currentSchemaVersion}. skip record updating");
	            }

            }
        }
    }
}
