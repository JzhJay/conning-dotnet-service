using System;
using MongoDB.Driver;

namespace Conning.Db.Services
{
    public class TenantDatabase : BaseDatabase
    {
        public TenantDatabase(MongoDbService service, string tenant) : base(service, tenant)
        {
        }

        public TenantDatabase(PostgreService service, string tenant) : base(service, tenant)
        {
        }
        
        protected override String GetDatabaseName(string connectionString)
        {
            return MongoUrl.Create(connectionString).DatabaseName + "_" + this.TenantName;
        }
    }
}