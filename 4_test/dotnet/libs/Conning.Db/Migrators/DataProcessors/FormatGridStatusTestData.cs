using MongoDB.Bson;

namespace Conning.Db.Migrators.DataProcessors
{
    public class FormatGridStatusTestData  : DocumentPreprocessor
    {
        public override void execute(BsonDocument d)
        {
            var instanceType = d["instanceType"].ToString();
            d.Remove("instanceType");
            var instances = d["windowsInstances"].AsBsonArray;
            var newInstances = new BsonDocument[instances.Count];
            for (var i = 0; i < instances.Count; ++i)
            {
                newInstances[i] = new BsonDocument
                {
                    {"instanceId", i},
                    {"instanceType", instanceType},
                    {"hostname", "fake_host_name"}
                };
            }

            d["windowsInstances"] = new BsonArray(newInstances);
        }
    }
}