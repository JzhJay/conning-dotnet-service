using System.Linq;
using System.Threading.Tasks;
using GraphQL.Types;
using System;
using System.Collections.Generic;
using Conning.Db.Services;
using GraphQL;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class BillingQueryGraph : ObjectGraphType
    {
        public BillingQueryGraph(OmdbService omdb, BaseUserService userService)
        {
            Name = "BillingQueryGraph";
            Field<BillingReportSummaryGraph>()
                .Name("report")
                .Argument<DateTimeGraphType>("startDate", "Starting date of report")
                .Argument<DateTimeGraphType>("endDate", "Ending date of report")
                .Argument<ListGraphType<StringGraphType>>("users", "Owner of the items to be included in report")
                .Argument<ListGraphType<StringGraphType>>("applications", "Applications to be included in report")
                .ResolveAsync(async ctx =>
                {
                    var startDate = ctx.GetArgument<DateTime>("startDate", default(DateTime));
                    var endDate = ctx.GetArgument<DateTime>("endDate", default(DateTime));
                    List<string> users = null;
                    List<string> applications = null;
                    if (ctx.Arguments.ContainsKey("users"))
                    {
                        users = ctx.ArgumentArrayValue<string>("users");
                    }
                    if (ctx.Arguments.ContainsKey("applications"))
                    {
                        applications = ctx.ArgumentArrayValue<string>("applications");
                    }

                    return await getBillingSummary(omdb, omdb.db, userService, startDate, endDate, users, applications);
                });
        }

        public static async Task<BillingReportSummary> getBillingSummary(OmdbService omdb, BaseUserService userService, DateTime startDate, DateTime endDate, List<string> users, List<string> applications)
        {
            return await BillingQueryGraph.getBillingSummary(omdb, omdb.db, userService, startDate, endDate, users, applications);
        }

        public static async Task<BillingReportSummary> getBillingSummary(OmdbService omdb, IMongoDatabase db, BaseUserService userService, DateTime startDate, DateTime endDate, List<string> users, List<string> applications)
        {
            var rates = getRates(db);
            if (users == null || !users.Any()) // If users is null or empty, return all users in current organization
            {
                users = (await userService.GetAllUsers()).Select(u => u.Sub).ToList();
            }
            if (applications == null || !applications.Any())
            {
                applications = new List<string> {"Simulation", "InvestmentOptimization", "ClimateRiskAnalysis"};
            }
            return new BillingReportSummary(omdb, db, userService, startDate, endDate, users, applications, rates.Result);
        }

        public static async Task<Dictionary<string, object>> getRates(OmdbService omdb)
        {
            return await BillingQueryGraph.getRates(omdb.db);
        }

        public static async Task<Dictionary<string, object>> getRates(IMongoDatabase db)
        {
            var ratesCollection = db.GetCollection<BsonDocument>("Rates");
            var projection = Builders<BsonDocument>.Projection
                .Include(s => s["rates"])
                .Include(s => s["name"]);
            var ratesFromDb = await ratesCollection.FindAsync(FilterDefinition<BsonDocument>.Empty, new FindOptions<BsonDocument, BsonDocument>{Projection = projection});
            var rates = new Dictionary<string, object>();
            await ratesFromDb.ForEachAsync(s =>
            {
                rates.Add(s["name"].AsString, s["rates"]);
            });
            return rates;
        }

        public static string generateCSV(DateTime startDate, DateTime endDate, List<string> users, Boolean expanded)
        {
            var mockCSV = "Total Charge, Compute Charge, Data Serving Charge, Data Storage Charge";
            return mockCSV;
        }
    }
}
