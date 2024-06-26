using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Amazon.SimpleNotificationService.Model;
using Auth0.ManagementApi.Models;
using Conning.Db;
using Conning.Db.Services;
using Conning.Library.Utility;
using GraphQL.Types;
using GraphQLParser;
using GraphQLParser.AST;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.GraphQL
{

    public class BillingSummaryGraph : ObjectGraphType<BillingSummary>
    {
        public BillingSummaryGraph()
        {

            Field<ListGraphType<BillingJobGraph>>()
                .Name("billingJobRows")
                .ResolveAsync(async ctx =>
                {
                    await ctx.Source.waitForCalculationDone();
                    return ctx.Source.billingJobRows;
                });
            Field<BillingBaseRowGraph>()
                .Name("total")
                .ResolveAsync(async ctx =>
                {
                    await ctx.Source.waitForCalculationDone();
                    return ctx.Source.totalRows;
                });
        }
    }

    public class BillingSummary
    {
        public List<SimulationBillingDetails> simulationDetails { get; }
        public List<BillingJob> billingJobRows { get; }
        public BillingBaseRow totalRows { get; set; }
        private OmdbService _omdb { get; }

        private IMongoDatabase _db { get; }

        private BaseUserService _userService { get; }
        private DateTime startDateTime { get; }
        private DateTime endDateTime { get; }
        private Dictionary<string, object> rates{ get; }
        private List<string> users { get; }
        private List<Applications> applications { get; }
        private Task calculating { get; set; }
        private List<BillingFactory> _factories { get; }
        private List<BillingEntry> _billingEntries { get; }

        public BillingSummary(OmdbService omdb,  BaseUserService userService, DateTime startDateFromInput, DateTime endDateFromInput,
            List<string> usersFromInput, List<Applications> applicationsFromInput, Dictionary<string, object> rates)
            : this(omdb, omdb.db, userService, startDateFromInput, endDateFromInput, usersFromInput, applicationsFromInput, rates)
        {
        }

        public BillingSummary(OmdbService omdb, IMongoDatabase db,  BaseUserService userService, DateTime startDateFromInput, DateTime endDateFromInput,
            List<string> usersFromInput, List<Applications> applicationsFromInput, Dictionary<string, object> rates)
        {
            _factories = new List<BillingFactory>();
            _omdb = omdb;
            _db = db;
            _userService = userService;
            startDateTime = startDateFromInput;
            endDateTime = endDateFromInput;
            users = usersFromInput;
            applications = applicationsFromInput;

//            simulationDetails = getSimulationBillingDetails(omdb, startDateFromInput, endDateFromInput, usersFromInput);
            _billingEntries = new List<BillingEntry>();
            billingJobRows = new List<BillingJob>();
            this.rates = rates;
            calculating = generateBillingReportAsync();
        }

        public Task waitForCalculationDone()
        {
            calculating.Wait();
            return Task.FromResult(0);
        }

        /// <summary>
        /// This function access Mongo to get Simulation and SimulationSession data. It then performs calculation and populates billingJobRows.
        /// </summary>
        /// <returns></returns>
        public async Task generateBillingReportAsync()
        {
            if (!billingJobRows.Any())
            {
                var allUsers = await getAllUsers();

                if (applications.Contains(Applications.Simulation))
                {
                    _factories.Add(new SimulationFactory(_userService, _omdb, _db, startDateTime, endDateTime, users, rates, allUsers));
                }

                if (applications.Contains(Applications.InvestmentOptimization))
                {
                    _factories.Add(new IOFactory(_userService, _omdb, _db, startDateTime, endDateTime, users, rates, allUsers));
                }

                if (applications.Contains(Applications.ClimateRiskAnalysis))
                {
                    _factories.Add(new CRAFactory(_userService, _omdb, _db, startDateTime, endDateTime, users, rates, allUsers));
                }

                await generateBillingEntries();
                _billingEntries.ForEach(billingEntry => { billingEntry.calculateCharges(); billingJobRows.Add(new BillingJob(_userService, _omdb, _db, billingEntry));});
                totalRows = new BillingTotalRow(null, startDateTime, endDateTime, billingJobRows.Select(s => s.total).ToList());

                // Populate total rows at the end
            }
        }

        private async Task generateBillingEntries()
        {
            var tasks = new List<Task>();
            if (!billingJobRows.Any()) {
                _factories.ForEach(factory => tasks.Add(factory.createBillingEntries(_billingEntries)));
            }
            await Task.WhenAll(tasks);
        }

        private async Task<Dictionary<string, ConningUser>> getAllUsers()
        {
            var allUsers = await _userService.GetAllUsers(sameTenantOnly: false);
            return allUsers.ToDictionary(x => x.Sub, x => x);
        }
    }
}
