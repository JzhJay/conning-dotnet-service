using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Conning.Db.Migrators.DataProcessors;
using Conning.Db.Services;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Conning.Db.Migrators
{
    public class BaseMigrator
    {
        protected BaseDatabase _database;
        protected string _collectionName;
        protected IMongoCollection<BsonDocument> _mongoDbCollection;
        protected List<DocumentPreprocessor> _preprocessHandlers = new List<DocumentPreprocessor>();
        
        public BaseMigrator(BaseDatabase database, string collectionName)
        {
            this._database = database;
            this._collectionName = collectionName;
        }

        public void AddBeforeInsertRecordHandlers(DocumentPreprocessor preprocessHandler)
        {
            this._preprocessHandlers.Add(preprocessHandler);   
        }

        protected virtual async Task<bool> IsProcessDataMigration()
        {
            var any = await this._mongoDbCollection.AsQueryable().AnyAsync();
            return !any;
        }
        
        protected virtual DocumentUpdateTypes GetDocumentUpdateType(BsonDocument record)
        {
            return DocumentUpdateTypes.Insert;
        }
        
        public async Task Migrate(FileInfo sourceFile)
        {
            var mongoDb = this._database.GetMongoDb();
            var collectionName = this._collectionName;
            var log = this._database.GetMongoDbService().getLogger();
            var col = mongoDb.GetCollection<BsonDocument>(collectionName);
            this._mongoDbCollection = col;
            var isProcessDataMigration = await this.IsProcessDataMigration();
            string userid = this._database.GetMongoDbService().getCurrentUserId();
            log.LogInformation($"Tenant: '{this._database.TenantName}', UserId: '{userid}'");

            if (isProcessDataMigration)
            {
                this.LogDataMigrationMessage();
                
                string text = System.IO.File.ReadAllText(sourceFile.FullName);
                if (userid != "")
                {
                    text = text.Replace("auth0|5b4b84b1a177ac1965fdaa6a", userid);
                }
                
                var jsonObjects = text.Replace("\r", "").Split("\n}\n").Where(json => json.IndexOf("{") != -1)
                    .ToArray();

                log.LogInformation($"# of tags: {jsonObjects.Length}");

                foreach (var jsonOrig in jsonObjects)
                {
                    var json = jsonOrig;

                    if (!json.EndsWith("\n}"))
                    {
                        json += "\n}";
                    }

                    log.LogInformation($"Parsing {json}");
                    try
                    {
                        var record = BsonSerializer.Deserialize<BsonDocument>(json);

                        foreach (DocumentPreprocessor preProcessors in this._preprocessHandlers)
                        {
                            preProcessors.execute(record);
                        }


                        var updateType = this.GetDocumentUpdateType(record);

                        if (updateType.Equals(DocumentUpdateTypes.Insert))
                        {
                            col.InsertOne(record);
                            log.LogInformation($"Inserted record into '{collectionName}':", json);
                        }
                        else
                        {
                            log.LogInformation($"The document already existed. Ignored it into '{collectionName}':", json);
                        }
                    }
                    catch (Exception e)
                    {
                        log.LogError(
                            $"Unable to insert record into collection '{collectionName}' - record: {json}");
                        log.LogError(e.ToString());
                    }
                }
            }
            else
            {
                log.LogInformation(
                    $"'{collectionName}' on tenant '{this._database.TenantName}' already exists - no bootstrap records will be imported");
            }
        }
        
        protected virtual void LogDataMigrationMessage()
        {
            this._database.GetMongoDbService().getLogger().LogInformation(
                $"The collection '{this._collectionName}' does not exist or is empty.  Importing initial list from local file...");
        }
    }
}