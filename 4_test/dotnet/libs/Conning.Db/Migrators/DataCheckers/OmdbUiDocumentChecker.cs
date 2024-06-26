using System.Collections.Generic;
using MongoDB.Bson;

namespace Conning.Db.Migrators.DataCheckers
{
    public class OmdbUiDocumentChecker : IDocumentChecker
    {
        public DocumentStatus Check(List<BsonDocument> legacyDocuments, BsonDocument newDocument)
        {
            bool isExist = legacyDocuments.Exists(document => document["objectType"] == newDocument["objectType"]);
            return isExist ? DocumentStatus.Exist : DocumentStatus.NotExist;
        }    
    }
}