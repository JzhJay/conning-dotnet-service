using System.Collections.Generic;
using System.Threading.Tasks;
using Conning.Db.Migrators.DataCheckers;
using Conning.Db.Migrators.DataProcessors;
using Conning.Db.Services;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.Db.Migrators {
    public class InsertUpdateDataMigrator : BaseMigrator
    {
        private List<BsonDocument> _documents = null;
        private IDocumentChecker _checker = null;    
        
        public InsertUpdateDataMigrator(BaseDatabase database, string collectionName) : base(
            database, collectionName)
        {
        }

        public void SetDocumentChecker(IDocumentChecker checker)
        {
            this._checker = checker;
        }
        
        private async Task GetAllDocuments()
        {
            this._documents = await this._mongoDbCollection.Find(new BsonDocument()).ToListAsync();
        }
        
        protected override async Task<bool> IsProcessDataMigration()
        {
            await this.GetAllDocuments();
            return true;
        }

        protected override DocumentUpdateTypes GetDocumentUpdateType(BsonDocument record)
        {
            if (this._documents == null || this._documents.Count == 0)  // no legacy data
            {
                return DocumentUpdateTypes.Insert;
            }
            
            DocumentStatus documentStatus = this._checker.Check(this._documents, record);
            if (documentStatus.Equals(DocumentStatus.Exist)) 
            {
                return DocumentUpdateTypes.Ignore;
            }
            else
            {
                return DocumentUpdateTypes.Insert;
            }
        }
        
        protected override void LogDataMigrationMessage()
        {
            this._database.GetMongoDbService().getLogger().LogInformation(
                $"The collection '{this._collectionName}' needs to check if there is any new document to insert or update");
        }
    }
}