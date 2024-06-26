using System;
using System.Threading.Tasks;
using Conning.Db.Migrators.DataCheckers;
using Conning.Db.Migrators.DataProcessors;
using Conning.Db.Migrators;
using MongoDB.Driver;
using Conning.Db.Services;
using MongoDB.Bson;

namespace Conning.Db.Migrators
{
    public class MigratorFactory
    {
        public static async Task<BaseMigrator> GetMigrator(BaseDatabase database, string collectionName)
        {
            if (Environment.GetEnvironmentVariable("KARMA_TEST") != "1" && (collectionName == "Simulation" || collectionName == "DeletedSimulation" || collectionName == "SimulationSession") )
            {
                return null;
            }

            BaseMigrator migrator;
            switch (collectionName)
            {
                case "SimulationSession":
                {
                    migrator = new BaseMigrator(database, collectionName);
                    PatchSimulationSessionData patchSimulationSessionData =
                        await PatchSimulationSessionData.init(database, collectionName);
                    migrator.AddBeforeInsertRecordHandlers(patchSimulationSessionData);
                    migrator.AddBeforeInsertRecordHandlers(
                        new UpdateRecordsPreprocessBySchemaVersion(database, collectionName));
                    break;
                }
                case "GridStatus":
                {
                    migrator = new BaseMigrator(database, collectionName);
                    migrator.AddBeforeInsertRecordHandlers(new FormatGridStatusTestData());
                    migrator.AddBeforeInsertRecordHandlers(
                        new UpdateRecordsPreprocessBySchemaVersion(database, collectionName));
                    break;
                }
                case "Simulation":
                case "DeletedSimulation":
                case "InvestmentOptimization":
                {
                    migrator = new BaseMigrator(database, collectionName);
                    migrator.AddBeforeInsertRecordHandlers(
                        new UpdateRecordsPreprocessBySchemaVersion(database, collectionName));
                    break;
                }
                case "omdb_ui":
                {
                    migrator = new InsertUpdateDataMigrator(database, collectionName);
                    ((InsertUpdateDataMigrator) migrator).SetDocumentChecker(new OmdbUiDocumentChecker());
                    break;
                }

                default:
                {
                    migrator = new BaseMigrator(database, collectionName);
                    break;
                }
            }

            return migrator;
        }
    }
}