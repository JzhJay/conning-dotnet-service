using Conning.Db.Services;
using MongoDB.Bson;

namespace Conning.Db.Migrators.DataProcessors
{
    public enum DocumentUpdateTypes
    {
        Insert,
        Ignore
    }
    
    public abstract class DocumentPreprocessor
    {
        protected BaseDatabase database;
        protected string collectionName;

        public DocumentPreprocessor()
        {
        }

        public DocumentPreprocessor(BaseDatabase database, string collectionName)
        {
            this.database = database;
            this.collectionName = collectionName;
        }

        public abstract void execute(BsonDocument document);
    }
}