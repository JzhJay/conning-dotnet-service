using System.Collections.Generic;
using System.Threading.Tasks;
using Conning.Db.RecordUpdater.DataProcessors;
using Conning.Db.Services;

namespace Conning.Db.RecordUpdater
{
    public class RecordUpdaterFactory
    {
        public static async Task<BaseUpdater> GetUpdater(BaseDatabase database)
        {
            BaseUpdater updater = new BaseUpdater(database);

            updater.AddPreprocessHandler(new ConvertSimulationSourceType("0.2"));
            updater.AddPreprocessHandler(new ConvertQueryFrequencies("0.3"));
            updater.AddPreprocessHandler(new OmdbUiUpdater("0.3.1", new List<UpdateRecord>
            {
	            new UpdateRecord { ObjectType = "Simulation", FieldName = "parameterizationMeasure", TagsInTargetSection = new []{"status", "sourceType", "useCase"}, insertToCard = true, insertToTable = true},
	            new UpdateRecord { FieldName = "_id", TagsInTargetSection = new [] {"comments"}, NewSectionInsertionIndexDelta = 0, insertToCard = true, insertToTable = true},
	            new UpdateRecord { FieldName = "comments", insertToCard = true, insertToTable = true}
            }));

            return updater;
        }
    }
}
