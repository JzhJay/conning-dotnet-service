using System.Linq;
using System.Text.RegularExpressions;
using MongoDB.Bson;

namespace Conning.Db.RecordUpdater.DataProcessors
{
    public class ConvertQueryFrequencies : RecordPreprocessor
    {
	    public ConvertQueryFrequencies(string supportVersion) : base(supportVersion, new string[] { "Query" })
	    {
	    }

	    public override bool Execute(BsonDocument record, string collectionName)
        {
	        var hasUpdate = false;
	        if (record.Contains("frequencies") && record["frequencies"] is BsonArray arr)
	        {
		        record["frequencies"] = new BsonArray(arr.Select(v =>
			        {
				        var value = v.ToString();
				        var nValue = Regex.Replace(value, "^[a-z]", m => m.Value.ToUpper());
				        hasUpdate = hasUpdate || !value.Equals(nValue);
				        return nValue;
			        })
		        );
	        }
            return hasUpdate;
        }

        public override bool Rollback(BsonDocument record, string collectionName)
        {
	        var hasUpdate = false;
	        if (record.Contains("frequencies") && record["frequencies"] is BsonArray arr)
	        {
		        record["frequencies"] = new BsonArray(arr.Select(v =>
			        {
				        var value = v.ToString();
				        var nValue = Regex.Replace(value, "^[A-Z]", m => m.Value.ToLower());
				        hasUpdate = hasUpdate || !value.Equals(nValue);
				        return nValue;
			        })
		        );
	        }
	        return hasUpdate;
        }
    }
}
