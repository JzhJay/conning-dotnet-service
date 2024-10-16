using System;

namespace Conning.Db.Services
{
    public class UserDatabase : BaseDatabase
    {
        protected override bool IsEnsureDefaultData => false;
        protected override bool IsEventsEnabled => false;
        protected override bool IsUpdateRecordsByVersion => false;

        public UserDatabase(MongoDbService service, string tenant) : base(service, tenant)
        {
        }

        public UserDatabase(PostgreService service, string tenant) : base(service, tenant)
        {
        }

        protected override String GetDatabaseName(string connectionString)
        {
            return "auth_" + this.TenantName;
        }
    }
}
