using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Conning.Db.Services;
using Conning.GraphQL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.Kui.Web.Controllers
{
    public class AwsInstanceTypeDescriptor
    {
        public string desc { get; set; }
        public double gbVcpu { get; set; }
        public double hourlyRate { get; set; }
    }

    public class DiscountDescriptor
    {
        public int? min { get; set; }
        public int? max { get; set; }
        public double discount { get; set; }
    }

    public class BillingInfo
    {
        public ObjectId _id { get; set; }
        public DateTime? licenseStart { get; set; }
        public double fixedCostPerYear { get; set; }
        public Dictionary<string, AwsInstanceTypeDescriptor> instanceTypes { get; set; }
        public double gbServedRate { get; set; }
        public double gbStoredRate { get; set; }
        public double queryPerHour { get; set; }
        public DiscountDescriptor[] discounts { get; set; }
    }

    public class CalculateBillPayload
    {
        public DateTime from { get; set; }
        public DateTime to { get; set; }
        public string[] userIds { get; set; }
    }

    public class DownloadBillPayload
    {
        [StringLength(26),Required]
        public string startDate { get; set; }
        [StringLength(26),Required]
        public string endDate { get; set; }
        [StringLength(64)]
        public string userIds { get; set; }
        [StringLength(50)]
        public string applications { get; set; }
        public Boolean expanded { get; set; }
        [StringLength(4),Required]
        public string fileType {get; set;}
        [StringLength(50),Required]
        public string separators {get; set;}
    }

    public class CalculatedBill
    {
        public double total { get; set; }
        public double fixedCost { get; set; }
    }

    [Authorize]
    [Route("api/[controller]")]
    public class BillingController : Controller
    {
        public BillingController(IOptions<AdviseAppSettings> settings, MongoDbService mongo, OmdbService omdb, BaseUserService userService)
        {
            _settings = settings;
            _mongo = mongo;
            _omdb = omdb;
            _userService = userService;
        }

        private readonly MongoDbService _mongo;
        private readonly OmdbService _omdb;
        private readonly BaseUserService _userService;
        private readonly IOptions<AdviseAppSettings> _settings;


        [Authorize]
        [HttpGet("download")]
        public async Task<IActionResult> Download([Bind("fileType,separators,startDate,endDate, userIds,applications,expanded")] DownloadBillPayload payload)
        {
            var fileType = payload.fileType;
            var separators = payload.separators;
            var start = Uri.UnescapeDataString(payload.startDate);
            var end = Uri.UnescapeDataString(payload.endDate);
            var startDate = DateTime.Parse(start, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal);
            var endDate = DateTime.Parse(end, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal);
            var userIds = payload.userIds?.Split(',').ToList();
            if (userIds == null)
            {
                var allUsers = await _userService.GetAllUsers();
                userIds = allUsers.Select(x => x.Sub).ToList();
            }
            var applicationsString = payload.applications?.Split(',').ToList();
            if (applicationsString == null)
            {
                applicationsString = new List<String>();
                applicationsString.Add("Simulation");
                applicationsString.Add("InvestmentOptimization");
                applicationsString.Add("ClimateRiskAnalysis");
            }
            var applications = new List<Applications>();
            applicationsString.ForEach(a => {
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

            var billingExport = new BillingExport(_omdb, _userService, startDate, endDate, userIds, applications, _settings);
            Stream stream = null;
            if (fileType == null || fileType.ToLower() != "xlsx")
            {
				// var csv = BillingQueryGraph.generateCSV(startDate, endDate, userIds, payload.expanded);
	            // var stream = new MemoryStream(Encoding.UTF8.GetBytes(csv));
                stream =  await billingExport.GenerateFileStreamFromJulia(payload.expanded, "csv", separators);
                fileType = "csv";
            }
            else
            {
	            stream =  await billingExport.GenerateFileStreamFromJulia(payload.expanded, "xlsx");
            }
            return File(stream, "application/octet-stream", $"{startDate}_{endDate}_bill.{fileType}");
        }


        [Authorize("read:billing")]
        [HttpGet("")]
        public BillingInfo Index()
        {
            var billing = _mongo.database.GetCollection<BillingInfo>("billingInfo");
            return billing.Find(Builders<BillingInfo>.Filter.Empty).FirstOrDefault();
        }

        [Authorize("read:billing")]
        [HttpPost("calculate-bill")]
        public CalculatedBill CalculateBill([FromBody][Bind("from,to,userIds")] CalculateBillPayload payload)
        {
            var from = payload.from;
            var to = payload.to;
            var userIds = payload.userIds;

            if (payload.to < payload.from)
            {
                throw new ArgumentException($"{to} must be ahead of {from}");
            }

            // Todo - Managers can query anyone, everyone else only themselves - need to verify user is in role

            var billing = _mongo.database.GetCollection<BillingInfo>("billingInfo");
            var billingInfo = billing.Find(Builders<BillingInfo>.Filter.Empty).FirstOrDefault();

            // Todo - get individual billing events


            // 1-2-2017 -> 3-4-2018
            // totalMonths = 30/31 + 13 + 4/30

            var months = to.Subtract(from).Days / (365.25 / 12);
            var fixedCost =     billingInfo.fixedCostPerYear / 12 * months;

            var total = fixedCost;

            return new CalculatedBill()
            {
                total = total,
                fixedCost = fixedCost
            };
        }

    }
}
