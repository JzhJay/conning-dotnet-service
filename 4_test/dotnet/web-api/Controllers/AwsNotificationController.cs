using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;
using Conning.AWS;
using Conning.Db.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Conning.Kui.Web.Controllers
{
    //[Authorize]
    [Route("api/aws")]
    //[ResponseCache(Duration = 300, VaryByHeader = "User-Agent", VaryByQueryKeys = new string[] {"*"})]
    public class AwsController : Controller
    {
        private static string _nextCspCloudWatchEventToken = "";
        private readonly IOptions<AdviseAppSettings> _settings;
        private readonly ILogger<AwsController> _log;
        private readonly MongoDbService _mongo;
        private AwsNotificationService _notificationService;
        private AmazonCloudWatchLogsClient _cspAwsCloudWatchClient = new AmazonCloudWatchLogsClient();
        
        public AwsController(ILogger<AwsController> log, IOptions<AdviseAppSettings> settings,
            MongoDbService mongo, AwsNotificationService notificationService)
        {
            _log = log;
            _settings = settings;
            _mongo = mongo;
            _notificationService = notificationService;
        }               
        
        //[Authorize("read:subscriptions")]
        [HttpGet("notifications/subscriptions")]
        public BsonDocument[] GetNotificationSubscriptions()
        {
            var subscriptions = _mongo.database.GetCollection<BsonDocument>(MongoCollections.notificationSubscriptions);

            return subscriptions.AsQueryable().ToArray();
        }

        [HttpPost("notifications/subscriptions")]
        public async Task<dynamic> PostNotificationSubscription([FromBody] JObject subscription)
        {
            var subscriptions = _mongo.database.GetCollection<BsonDocument>(MongoCollections.notificationSubscriptions);
          
            BsonDocument doc = BsonDocument.Parse(subscription.ToString(Newtonsoft.Json.Formatting.None));
            var id = subscription.ContainsKey("_id") ? subscription.GetValue("_id").ToString() : null;
            
            if (string.IsNullOrEmpty(id))
            {
                if (doc.Names.Contains("_id"))
                {
                    doc.Remove("_id");
                }

                await subscriptions.InsertOneAsync(doc);
                _log.LogDebug($"Created notification {doc.GetValue("_id")}");
                return doc;
            }
            else
            {
                var idObjectId = ObjectId.Parse(id.ToString());
                doc.Set(doc.IndexOfName("_id"), idObjectId);
                subscriptions.ReplaceOne(Builders<BsonDocument>.Filter.Eq("_id", idObjectId), doc);
                _log.LogDebug($"Updated notification {id}");
                return doc;
            }
        }

        [HttpDelete("notifications/subscriptions")]
        public DeleteResult DeleteNotificationSubscription([FromQuery] string id)
        {
            var subscriptions = _mongo.database.GetCollection<BsonDocument>(MongoCollections.notificationSubscriptions);
            var result = subscriptions.DeleteOne(Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id)));
            return result;
        }
        
        [HttpPost("reportCspViolation")]
        public async Task<IActionResult> ReportCspViolation([FromBody] JToken report)
        {
            try
            {
                List<InputLogEvent> logEvents = new List<InputLogEvent>();
                string customerName = Environment.GetEnvironmentVariable("CUSTOMER_NAME");
                if (String.IsNullOrEmpty(customerName))
                {
                    customerName = "";
                }
                
                if (report is JArray)    // chrome
                {
                    foreach (JObject item in (JArray) report)
                    {
                        var log = this.GetCspLogEvent(item, customerName);
                        if (log != null) {
                            logEvents.Add(log);
                        }
                    }
                }
                else
                {   // safari
                    var log = this.GetCspLogEvent((JObject) report, customerName);
                    if (log != null) {
                        logEvents.Add(log);
                    }
                }

                if (logEvents.Any())
                {
                    if (string.IsNullOrEmpty(_nextCspCloudWatchEventToken))
                    {
                        var logStream = await _cspAwsCloudWatchClient.DescribeLogStreamsAsync(new DescribeLogStreamsRequest()
                        {
                            LogGroupName = _settings.Value.aws.cspLogGroupName,
                            LogStreamNamePrefix = "blocked-requests"
                        });
                        _nextCspCloudWatchEventToken = logStream.LogStreams.First().UploadSequenceToken;
                    }
                    
                    var response = await _cspAwsCloudWatchClient.PutLogEventsAsync(new PutLogEventsRequest()
                    {
                        LogGroupName = _settings.Value.aws.cspLogGroupName,
                        LogStreamName = "blocked-requests",
                        LogEvents = logEvents,
                        SequenceToken = _nextCspCloudWatchEventToken
                    });

                    _nextCspCloudWatchEventToken = response.NextSequenceToken;
                }
            }
            catch (Exception e)
            {
                this._log.LogError($"Reporting CSP violation failed: {e.Message} {e.StackTrace}, request body: {report.ToJson()}");
                _nextCspCloudWatchEventToken = "";
            }

            return Ok();
        }

        private InputLogEvent GetCspLogEvent(JObject log, string customerName)
        {
            string blockUrl = "";
            if (log.ContainsKey("csp-report"))    // safari's request (Standard)
            {
                var cspReport = (JObject) log["csp-report"];
                blockUrl = cspReport.ContainsKey("blocked-uri") ? (string) cspReport["blocked-uri"] : "";
            }
            else if (log.ContainsKey("body")) // chrome's request https://developers.google.com/web/updates/2018/09/reportingapi
            {
                var cspReport = (JObject) log["body"];
                blockUrl = cspReport.ContainsKey("blockedURL") ? (string) cspReport["blockedURL"] : "";
            }

            if (!string.IsNullOrEmpty(blockUrl))
            {
                var payload = JsonConvert.SerializeObject(new Dictionary<string, object>
                {
                    {"blockUrl", blockUrl},
                    {"customerName", String.IsNullOrEmpty(customerName) ? "" : customerName},
                });

                return new InputLogEvent()
                {
                    Message = payload,
                    Timestamp = DateTime.Now
                };
            }
                
            this._log.LogWarning($"Cannot get CSP block URL successfully, CSP request body: {log.ToJson()}");
            return null;
        }
    }
}