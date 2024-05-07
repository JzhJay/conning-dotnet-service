using System;
using System.Net;
using CommandLine;

namespace Veracode.Rest.App
{
	public interface ICommand
	{
		void Execute();
	}
	
	[Verb("dynamicAnalysis", HelpText = "Execute dynamic analysis")]
	public class DynamicAnalysisScan : ICommand
	{
		[Option('u', "url", Required = true, HelpText = "The url is going to be scanned.")]
		public string Url { get; set; }

		[Option('n', "name", Required = false, HelpText = "Dynamic analysis name")]
		public string Name { get; set; }
		
		public void Execute()
		{
			Console.WriteLine($"Executing dynamic analysis with url: {Url}");
			string ApiId = Environment.GetEnvironmentVariable("VERACODE_API_ID");
			string ApiKey = Environment.GetEnvironmentVariable("VERACODE_SECRET_KEY");
			if (string.IsNullOrEmpty(ApiId) || string.IsNullOrEmpty(ApiKey))
			{
				Console.WriteLine("API Id or API Secret Key is missing in environment. Please set it.");
				return;
			}

			const string urlBase = "api.veracode.com";
			string analysisName = Name;
			if (string.IsNullOrEmpty(analysisName))
			{
				analysisName = "Veracode API Analysis";
			}
			
			var webClient = new WebClient
			{
				BaseAddress = $"https://{urlBase}"
			};
			
			try
            {
	            const string urlPath = "/was/configservice/v1/analyses";
	            var urlParams = String.Empty;
	            const string httpVerb = "POST";
	            var authorization = HmacAuthHeader.HmacSha256.CalculateAuthorizationHeader(ApiId, ApiKey, urlBase, urlPath, urlParams, httpVerb);
                string requestJson = string.Format(
                    "{{\"name\": \"{0}\"," +
                    "\"scans\": [{{\"scan_config_request\": {{\"target_url\": {{\"url\": \"{1}\"}}}}}}]," +
                    "\"schedule\": {{\"duration\": {{\"length\": 1, \"unit\": \"DAY\"}}, \"scheduled\": false,\"now\": true}}}}", analysisName, Url);
                    webClient.Headers.Add("Authorization", authorization);
                    webClient.Headers.Add("Content-type", "application/json");
                string result = webClient.UploadString(urlPath, requestJson);
                Console.WriteLine(result);
				Console.WriteLine("Send request successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{ex.Message}: {ex.StackTrace}");
            }
		}
	}
}