using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Conning.Db.Services;
using CsvHelper;
using CsvHelper.Configuration;

namespace Conning.GraphQL
{
    public class BillingExport
    {
        private BillingSummary _billingSummary { get; }
        private readonly IOptions<AdviseAppSettings> _adviseAppSettings;
        private AdviseAppSettings Settings => _adviseAppSettings.Value;

        public BillingExport(OmdbService omdb,  BaseUserService userService, DateTime startDateFromInput, DateTime endDateFromInput,
            List<string> usersFromInput, List<Applications> applicationsFromInput, IOptions<AdviseAppSettings> adviseAppSettings)
        {
            var rates = BillingQueryGraph.getRates(omdb);
            _billingSummary = new BillingSummary(omdb, userService, startDateFromInput, endDateFromInput, usersFromInput, applicationsFromInput, rates.Result);
            _adviseAppSettings = adviseAppSettings;
        }



        public async Task<Stream> GenerateCsvStream(Boolean expanded)
        {
            var resultStream = new MemoryStream();
            var streamWriter = new StreamWriter(resultStream);
            var writer = new CsvWriter(streamWriter);
            writer.Configuration.RegisterClassMap<BillingBaseRowMap>();
            writer.WriteHeader<BillingBaseRow>();
            writer.NextRecord();
            await _billingSummary.waitForCalculationDone();
            writer.WriteRecord(_billingSummary.totalRows);
            writer.NextRecord();
            var records = expanded
                ? _billingSummary.billingJobRows.Select(s => s.getAllRows()).SelectMany(s => s)
                : _billingSummary.billingJobRows.Select(s => s.total);
            writer.WriteRecords(records);
            streamWriter.Flush();
            resultStream.Seek(0, SeekOrigin.Begin);
            return resultStream;
        }

        public async Task<Stream> GenerateFileStreamFromJulia(Boolean expanded, string type ,string separators = null)
        {
	        var resultStream = GenerateCsvStream(expanded).Result;
	        if (type == "csv" && (separators == null || separators == ""))
	        {
		        return resultStream;
	        }
	        var data = new List<Array>();
	        var sendData = new Dictionary<string,object>();
	        sendData["separators"] = separators;
	        sendData["data"] = data;

	        using (var reader = new CsvReader(new StreamReader(resultStream)))
	        {
		        reader.Configuration.HasHeaderRecord = false;
		        while (reader.Read())
		        {
			        data.Add(reader.Context.Record);
		        }
	        }

	        var handler = new HttpClientHandler();
	        var client = new HttpClient(handler);

	        // Set forwarded port to allow request to be authenticated in Julia
	        client.DefaultRequestHeaders.Add("x-forwarded-port", "81");
	        var hostname = Settings.julia.hostname;
            bool IsOnPremK8s = Environment.GetEnvironmentVariable("ON_PREM_K8S") == "1";
            if(IsOnPremK8s){
				hostname = "restapi-svc.default.svc.cluster.local:8002";
				Console.WriteLine("hostname: " + hostname);
			}
	        using (var content = new StringContent(JsonConvert.SerializeObject(sendData), System.Text.Encoding.UTF8, "application/json"))
	        {
		        var response = client.PostAsync($"http://{hostname}/julia/internal/export/{type}", content).Result;
		        response.EnsureSuccessStatusCode();

		        return response.Content.ReadAsStreamAsync().Result;
	        }
        }
    }

    public sealed class BillingBaseRowMap : ClassMap<BillingBaseRow>
    {
	    public BillingBaseRowMap()
	    {
		    Map(m => m.totalCharge).Name("Total Charge").Index(0);
		    Map(m => m.computationCharge).Name("Compute Charge").Index(1);
		    Map(m => m.dataServingCharge).Name("Data Serving Charge").Index(2);
		    Map(m => m.dataStorageCharge).Name("Data Storage Charge").Index(3);
		    Map(m => m.ongoingDataStorageChargePerDay).Name("Ongoing Storage Charge per Day").Index(4);
		    Map(m => m.dataElements).Name("Data Elements (Billions)").Index(5);
		    Map(m => m.simulationName).Name("Name").Index(6);
		    Map(m => m.gridName).Name("Grid").Index(7).Default("");
		    Map(m => m.chargeType).Name("Charge Type").Index(8).ConvertUsing(m =>
			    String.Compare(m.chargeType, "Total") == 0 ? "" : m.chargeType);
		    Map(m => m.user.FullName).Name("User").Index(9);
		    Map(m => m.startDateTime).Name("Start (UTC)").Index(10).ConvertUsing(m =>
			    String.Compare(m.chargeType, "Total") == 0 ? "" : m.startDateTime.ToString());
		    Map(m => m.finishDateTime).Name("Finish (UTC)").Index(11).ConvertUsing(m =>
			    String.Compare(m.chargeType, "Total") == 0 ? "" : m.finishDateTime.ToString());
		    Map(m => m.duration).Name("Duration (DDD:HH:MM)").Index(12).ConvertUsing(m =>
			    String.Compare(m.chargeType, "Total") == 0 ? "" : m.duration.ToString());
		    Map(m => m.maximumVCPUs).Name("Maximum Number of vCPUs").Index(13);
		    Map(m => m.totalCPUTime).Name("Total CPU time").Index(14);
		    Map(m => m.instanceType).Name("Instance Type").Index(15);
		    Map(m => m.dataServingChargePerHour).Name("Data Serving Charge per Hour").Index(16);
		    Map(m => m.dataStorageChargePerDay).Name("Data Storage Charge per Day").Index(17);
	    }
    }
}
