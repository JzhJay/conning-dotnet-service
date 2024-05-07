using Conning.Db.Services;
using MongoDB.Bson;

namespace Conning.Db.RecordUpdater.DataProcessors
{
    public abstract class RecordPreprocessor
    {
        protected BaseDatabase database;
        public string supportVersion { get; protected set; }
        public string[] supportCollections { get; protected set; }

        public RecordPreprocessor(string[] supportCollections )
        {
	        this.supportCollections = supportCollections;
        }

        public RecordPreprocessor(string supportVersion, string[] supportCollections ): this(supportCollections)
        {
	        this.supportVersion = supportVersion;
        }

        public RecordPreprocessor(string supportVersion, string[] supportCollections, BaseDatabase database): this(supportVersion, supportCollections)
        {
	        this.database = database;
        }

        public abstract bool Execute(BsonDocument document, string collectionName);

        public virtual bool Rollback(BsonDocument document, string collectionName)
        {
	        return false;
        }
    }
}
