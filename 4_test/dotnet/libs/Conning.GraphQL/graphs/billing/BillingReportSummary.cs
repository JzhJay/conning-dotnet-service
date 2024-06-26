using System;
using System.Collections.Generic;
using GraphQL.Types;
using MongoDB.Driver;
using Conning.Db.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Conning.GraphQL
{
    public enum Applications
    {
        Simulation = 0,
        InvestmentOptimization = 1,
        ClimateRiskAnalysis = 2
    }
    public static class BillingReportExtensions
    {
        public static void registerBillingGraphTypes(this IServiceCollection services)
        {
            services.AddSingleton<SimulationBillingDetailsGraph>();
            services.AddSingleton<BillingSummaryGraph>();
//            services.AddSingleton<BillingSimulationGraph>();
            services.AddSingleton<BillingBaseRowGraph>();
            services.AddSingleton<BillingJobGraph>();
        }
    }

    public class BillingReportSummary
    {
        public OmdbService _omdb { get; }

        public IMongoDatabase _db { get; }

        public BaseUserService _userService { get; }
        public DateTime startDate { get; }
        public DateTime endDate { get; }
        public BillingSummary simulationSummary { get; }
        public List<string> users { get; }
        public List<Applications> applications { get; }

        public BillingReportSummary(OmdbService omdb, IMongoDatabase db, BaseUserService userService, DateTime startDateFromInput, DateTime endDateFromInput, List<string> usersFromInput, List<string> applicationsFromInput, Dictionary<string, object> ratesFromDb)
        {
            _omdb = omdb;
            _db = db;
            _userService = userService;
            startDate = startDateFromInput;
            endDate = endDateFromInput;
            users = usersFromInput;
            applications = new List<Applications>();
            applicationsFromInput.ForEach(a => {
                switch(a){
                    case "Simulation":
                        applications.Add(Applications.Simulation);
                        break;
                    case "InvestmentOptimization":
                        applications.Add(Applications.InvestmentOptimization);
                        break;
                    case "ClimateRiskAnalysis":
                        applications.Add(Applications.ClimateRiskAnalysis);
                        break;
                }});
            simulationSummary = new BillingSummary(_omdb, db, _userService, startDateFromInput, endDateFromInput, usersFromInput, applications, ratesFromDb);
        }
    }

    public class BillingReportSummaryGraph : ObjectGraphType<BillingReportSummary>
    {
        public string name;

        public BillingReportSummaryGraph(OmdbService omdb)
        {
            name = "BillingReportGraph";
            Field(_ => _.startDate, nullable:true);
            Field(_ => _.endDate, nullable:true);
            Field<BillingSummaryGraph>()
                .Name("simulationSummary")
                .Resolve(ctx => ctx.Source.simulationSummary);
        }

    }
}
