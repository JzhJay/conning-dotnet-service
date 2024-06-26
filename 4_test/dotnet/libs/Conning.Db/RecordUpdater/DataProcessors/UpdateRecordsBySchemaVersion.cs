using Conning.Db.Services;
using MongoDB.Bson;

namespace Conning.Db.RecordUpdater.DataProcessors
{
    public class UpdateRecordsPreprocessBySchemaVersion : RecordPreprocessor
    {
	    public UpdateRecordsPreprocessBySchemaVersion(BaseDatabase database) : base(
		    database.GetMongoDbService().getSchemaVersion(), null)
	    {
	    }

	    public override bool Execute(BsonDocument record, string collectionName)
        {
	        var emptyVersion = !record.Contains(BaseUpdater.SCHEMA_VERSION_COLUMN);
	        var recordVersion = emptyVersion ? null : record[BaseUpdater.SCHEMA_VERSION_COLUMN].ToString();
	        if (emptyVersion || supportVersion != recordVersion)
	        {
		        record[BaseUpdater.SCHEMA_VERSION_COLUMN] = this.supportVersion;
		        return true;
	        }
	        return false;
        }

        public override bool Rollback(BsonDocument record, string collectionName)
        {
	        var emptyVersion = !record.Contains(BaseUpdater.SCHEMA_VERSION_COLUMN);
	        var recordVersion = emptyVersion ? null : record[BaseUpdater.SCHEMA_VERSION_COLUMN].ToString();
	        if (!emptyVersion && supportVersion.CompareTo(recordVersion) < 0 )
	        {
		        record[BaseUpdater.SCHEMA_VERSION_COLUMN] = this.supportVersion;
		        return true;
	        }

	        return false;
        }

    }
}
