using System.Collections.Generic;
using MongoDB.Bson;

namespace Conning.Db.Migrators.DataCheckers
{
    public enum DocumentStatus
    {
        Exist,
        NotExist
    }
    
    public interface IDocumentChecker
    {
        DocumentStatus Check(List<BsonDocument> legacyDocuments, BsonDocument newDocument);
    }
}