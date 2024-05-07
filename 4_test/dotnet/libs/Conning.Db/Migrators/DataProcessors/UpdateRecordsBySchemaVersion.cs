using Conning.Db.Services;
using MongoDB.Bson;

namespace Conning.Db.Migrators.DataProcessors
{
    public class UpdateRecordsPreprocessBySchemaVersion : DocumentPreprocessor
    {
        private string _schemaVersion;
        
        public UpdateRecordsPreprocessBySchemaVersion(BaseDatabase database, string collectionName) : base(database, collectionName)
        {
            this._schemaVersion = this.database.GetMongoDbService().getSchemaVersion();
        }

        public override void execute(BsonDocument record)
        {
            record["version"] = this._schemaVersion;
        }
    }
}