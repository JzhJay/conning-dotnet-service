using System.Threading.Tasks;
using Conning.Db.Services;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.Db.Migrators.DataProcessors
{
    public class PatchSimulationSessionData : DocumentPreprocessor
    {
        private string _sampleSimulationId = "";
        private string _sampleDeletedSimulationId = "";

        public static async Task<PatchSimulationSessionData> init(BaseDatabase database, string collectionName)
        {
            PatchSimulationSessionData instance = new PatchSimulationSessionData(database, collectionName);
            instance._sampleSimulationId = await instance.getSampleSimulationId("Simulation", "Fake_Simulation_1");
            instance._sampleDeletedSimulationId =
                await instance.getSampleSimulationId("DeletedSimulation", "Fake_Simulation_3");
            return instance;
        }
        
        private PatchSimulationSessionData(BaseDatabase database, string collectionName) : base(database, collectionName)
        {
        }

        public override void execute(BsonDocument record)
        {
            if (record.Contains("target") && record["target"].ToString() == "DeletedSimulation")
            {
                record["simulation"] = this._sampleDeletedSimulationId;
                record.Remove("target");
            }
            else
            {
                record["simulation"] = this._sampleSimulationId;
            }
        }

        private async Task<string> getSampleSimulationId(string tableName, string simName)
        {
            var mongoDb = this.database.GetMongoDb();
            var db = mongoDb.GetCollection<BsonDocument>(tableName);
            var filter = Builders<BsonDocument>.Filter;
            var filter1 = filter.Eq("name", simName);
            var projection = Builders<BsonDocument>.Projection
                .Include(s => s["_id"]);

            var findOption = new FindOptions<BsonDocument, BsonDocument> {Projection = projection};

            var query1 = (await db.FindAsync(filter1, findOption)).First();
            return query1["_id"].ToString();
        }
    }
}