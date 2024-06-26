using MongoDB.Bson;

namespace Conning.Db.RecordUpdater.DataProcessors
{
    public class ConvertSimulationSourceType : RecordPreprocessor
    {
	    private static string TARGET_COLUMN = "sourceType";

	    public ConvertSimulationSourceType(string supportVersion) : base(supportVersion, new string[] { "Simulation", "DeletedSimulation" })
	    {
	    }

	    public override bool Execute(BsonDocument record, string collectionName)
        {
            if (record.Contains(TARGET_COLUMN))
            {
	            var targetValue = record[TARGET_COLUMN].ToString();
	            if (targetValue == "Repository")
	            {
		            record[TARGET_COLUMN] = "User Uploaded File";
		            return true;
	            }
	            if (targetValue != "GEMS" && targetValue.IndexOf("GEMS") >= 0)
	            {
		            record[TARGET_COLUMN] = "GEMS";
		            return true;
	            }
	        }
            return false;
        }

        public override bool Rollback(BsonDocument record, string collectionName)
        {
	        if (record.Contains(TARGET_COLUMN))
	        {
		        var targetValue = record[TARGET_COLUMN].ToString();
		        if (targetValue == "User Uploaded File")
		        {
			        record[TARGET_COLUMN] = "Repository";
			        return true;
		        }
	        }
	        return false;
        }
    }
}
