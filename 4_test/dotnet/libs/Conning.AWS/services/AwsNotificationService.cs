using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using Amazon;
using Amazon.CloudFormation;
using Amazon.SimpleEmail;
using Amazon.SimpleNotificationService;
using Amazon.SQS;
using Amazon.SQS.Model;
using Conning.Db.Services;
using Conning.Models.Notifications;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Amazon.EC2;
using Conning.AWS.monitors;
using Conning.Library.Utility;
using Conning.Common;
using Conning.GraphQL;
using Amazon.Organizations;
using Amazon.Organizations.Model;
using Amazon.SecurityToken;
using Amazon.SecurityToken.Model;
using Amazon.SimpleSystemsManagement;

namespace Conning.AWS
{
    public class AwsNotificationService
    {
        private readonly IOptions<AdviseAppSettings> _settings;
        private readonly ILogger<AwsNotificationService> _log;
        private readonly MongoDbService _mongo;
        private readonly OmdbService _omdb;

        private IEnumerable<NotificationSubscription> _subscriptions = Enumerable.Empty<NotificationSubscription>();

        private readonly IDesktopNotificationQueue _notificationQueue;
        private BaseUserService _userService;
        private CancellationToken _watchNotificationSubscriptionsToken;
        private CancellationToken _watchBouncedEmailQueueToken;
        private CancellationToken _watchNotificationQueueToken;

        public AmazonSQSClient sqs { get; private set; }
        public AmazonSimpleNotificationServiceClient sns { get; private set; }
        public AmazonSimpleEmailServiceClient email { get; private set; }
        public AmazonEC2Client ec2 { get; private set; }
        public AmazonOrganizationsClient organization { get; private set; }

        public AmazonSecurityTokenServiceClient sts { get; private set; }

        private AmazonSimpleSystemsManagementClient _ssmClient { get; set; }

        private const int WAIT_AFTER_ERROR_MS = 10000;

        private readonly ReactRenderService _renderService;

        private DbsNotificationWatcher _dbsNotificationWatcher;
        private SendMessageService _messageService;

        private BillingScheduleMonitor _billingScheduleMonitor;

        public AwsNotificationService(ILogger<AwsNotificationService> log, IOptions<AdviseAppSettings> settings,
            MongoDbService mongo, IDesktopNotificationQueue notificationQueue, BaseUserService userService, OmdbService omdb,
            ReactRenderService renderService, SendMessageService messageService)
        {
            _log = log;
            _settings = settings;
            _mongo = mongo;
            _notificationQueue = notificationQueue;
            _userService = userService;
            _omdb = omdb;
            _renderService = renderService;
            _messageService = messageService;
            RegionEndpoint region = this.settings.aws.region;
            _ssmClient =  new AmazonSimpleSystemsManagementClient(region);
        }

        private AdviseAppSettings settings
        {
            get { return _settings.Value; }
        }

        public ILogger<AwsNotificationService> getLogger()
        {
            return this._log;
        }

        private IMongoDatabase _database
        {
            get { return _mongo.database; }
        }

        public OmdbService GetOmdbService()
        {
            return this._omdb;
        }

        public MongoDbService GetMongoDbService()
        {
            return this._mongo;
        }

        public BaseUserService GetUserService()
        {
            return this._userService;
        }

        public void Start(IServiceProvider appServices)
        {
            // Watch the SQS queue for notifiable events
            Task.Run(() =>
            {
                // https://docs.aws.amazon.com/sdkfornet/v3/apidocs/items/Util/TEC2InstanceMetadata.html
                // RegionEndpoint region = RegionEndpoint.GetBySystemName(EC2Metadata.GetData("/instance-id"));
                RegionEndpoint region = this.settings.aws.region;
                RegionEndpoint ses_region = this.settings.email.region;
                sqs = new AmazonSQSClient(region);
                sns = new AmazonSimpleNotificationServiceClient(ses_region);
                email = new AmazonSimpleEmailServiceClient(ses_region);
                cloudFormation = new AmazonCloudFormationClient(region);
                ec2 = new AmazonEC2Client(region);
                organization = new AmazonOrganizationsClient(region);
                sts = new AmazonSecurityTokenServiceClient(region);
                if (!string.IsNullOrEmpty(settings.aws.sesSourceArn))
                {
                    Console.WriteLine("Found sesSourceArn " + settings.aws.sesSourceArn);
                }

                Task.Run(async () =>
                {
                    try
                    {
                        var organizationResponse = await organization.DescribeOrganizationAsync(new DescribeOrganizationRequest {}, new CancellationTokenSource().Token);
                        String masterAccountEmail = organizationResponse.Organization.MasterAccountEmail;
                        Console.WriteLine("email: " + masterAccountEmail);
                        var stsResponse = await sts.GetCallerIdentityAsync(new GetCallerIdentityRequest {}, new CancellationTokenSource().Token);
                        string account = stsResponse.Account;
                        string body =
                            "advise/dotnet/libs/Conning.AWS/services/AwsNotificationService.cs can send emails on behalf of<br>&nbsp;&nbsp;&nbsp;&nbsp; Account: " +
                            account;
                        String subject = "dotnet started - " + account.Substring(0, 4) + "xxxxxxxx";
                        Console.WriteLine("email subject: " + subject);
                        Console.WriteLine("email body: " + body);
                        await _messageService.sendEmail(masterAccountEmail, subject, body);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Error in sendEmail: \n" + e);
                    }
                });
//            Task.Run(() =>
//            {
//                var n = 1;
//                while (true)
//                {
//                    _notificationQueue.AddNotificationEvent(
//                        new NotificationEvent()
//                        {
//                            message = $"Noah Test - {n} - Current Time: {DateTime.Now}",
//                            title = $"Desktop Notification {n}",
//                            userId = "google-oauth2|113496205501185249519" // Noah Shipley
//                        });
//                    _notificationQueue.AddNotificationEvent(
//                        new NotificationEvent()
//                        {
//                            message = $"Rashaine Test - {n} - Current Time: {DateTime.Now}",
//                            title = $"Desktop Notification {n}",
//                            userId = "google-oauth2|111174857101538761898" // Rashaine
//                        });
//                    Thread.Sleep(10000);
//                    n++;
//                }
//            });
                this._dbsNotificationWatcher = new DbsNotificationWatcher(this);
                this._billingScheduleMonitor = new BillingScheduleMonitor(this);
                this._mongo.OnDbConnection += this._dbsNotificationWatcher.LoadAllSubscriptions;
                this._mongo.OnDbIdle += this._dbsNotificationWatcher.OnDbIdle;
                this._mongo.OnDbRestoreIdle += this._dbsNotificationWatcher.OnDbRestoreIdle;

                this._dbsNotificationWatcher.OnNotificationsChanged += this.UpdateSubscriptions;
                this._dbsNotificationWatcher.OnNotificationsChanged += this._billingScheduleMonitor.UpdateSubscriptions;

                // Start notifications watcher manually for default db (non-tenant db)
                if (!this._dbsNotificationWatcher.IsMonitoring())
                {
                    this._dbsNotificationWatcher.LoadAllSubscriptions(this._mongo.GetBaseDatabaseByTenant(""));
                }


                if (!String.IsNullOrEmpty(settings.julia.hostname) && !settings.multiTenant)
                {
                    Task.Run(() =>
                    {
                        try
                        {
                            StartGridMetricsMonitor();
                        }
                        catch (Exception e)
                        {
                            _log.LogError(e.ToString());
                        }
                    });
                }
                else
                {
                    _log.LogWarning("No julia hostname is set or multitenant is on.  Threshold notifications will not be triggered.");
                }

                if (!String.IsNullOrEmpty(settings.aws.notificationQueueUrl))
                {
                    _watchNotificationQueueToken = new CancellationToken();
                    Task.Run(() => { WatchNotificationQueue(); }, _watchNotificationQueueToken);
                }
                else
                {
                    _log.LogWarning("No aws.notificationQueueUrl is set.  Notification events will not be monitored.");
                }


                if (!String.IsNullOrEmpty(settings.aws.bouncedEmailQueueUrl))
                {
                    _watchBouncedEmailQueueToken = new CancellationToken();
                    Task.Run(() => { WatchBouncedEmailQueue(); }, _watchBouncedEmailQueueToken);
                }
                else
                {
                    _log.LogWarning("No aws.bouncedEmailQueueUrl is set.  Bounced e-mail events will not be monitored.");
                }
            });
        }

        private void UpdateSubscriptions(IEnumerable<NotificationSubscription> subscriptions)
        {
            this._subscriptions = subscriptions;
        }

        const int SECONDS_IN_HOUR = 60 * 60;

        private async void StartGridMetricsMonitor()
        {
            var handler = new HttpClientHandler();

            HttpClient client = new HttpClient(handler);

            // Set forwarded port to allow request to be authenticated in Julia
            client.DefaultRequestHeaders.Add("x-forwarded-port", "81");
            while (true)
            {
                var sleepTime = 5 * 60 * 1000;

                var hostname = settings.julia.hostname;

                try
                {
                    var response = await client.GetAsync($"http://{hostname}/julia/internal/activeGridMetrics");
                    response.EnsureSuccessStatusCode();
                    var subscriptions = this._subscriptions;

                    dynamic gridMetrics =
                        (dynamic) JsonConvert.DeserializeObject<List<ExpandoObject>>(
                            (await response.Content.ReadAsStringAsync()));
                    var gridSubscribers = subscriptions.Where(sub =>
                    {
                        return sub.target == "system" && sub.trigger == "grid_uptime_threshold";
                    });
                    var simulationSubscribers = subscriptions.Where(sub =>
                    {
                        return sub.target == "simulation" && sub.trigger == "runtime_threshold";
                    });

                    foreach (var gridMetric in gridMetrics)
                    {
                        foreach (var gridSubscriber in gridSubscribers)
                        {
                            if (gridSubscriber.extra == null || gridSubscriber.extra.threshold == null)
                            {
                                continue;
                            }

                            var threshold = Double.Parse(gridSubscriber.extra.threshold) * SECONDS_IN_HOUR;
                            var uptime = gridMetric.gridUptime;
                            if (uptime >= threshold)
                            {
                                var gridname = gridMetric.gridName;
                                var gridStartTime = gridMetric.gridStartTime;
                                var gridOwner = gridMetric.createdBy;

                                var messageKey =
                                    $"Grid-{gridname.ToString()}-{gridStartTime.ToString()}-{gridSubscriber.owner}";
                                var count = _mongo.MongoGet(db =>
                                {
                                    var sentNotificationsCollection =
                                        db.GetCollection<BsonDocument>(MongoCollections.sentNotifications);
                                    return sentNotificationsCollection.Count(
                                        Builders<BsonDocument>.Filter.Eq("messageKey", messageKey));
                                });

                                // Only send notification if we haven't already sent one
                                if (count == 0)
                                {
                                    await processNotification(new NotificationSubscription[] {gridSubscriber},
                                        new NotificationMessageParam()
                                        {
                                            gridName = gridname, gridUptime = uptime,
                                            messageType = "grid_uptime_threshold", owner = gridOwner
                                        }, messageKey);
                                }
                            }
                            else
                            {
                                sleepTime = (int) Math.Min(sleepTime,
                                    (threshold - uptime) * 1000);
                                _log.LogInformation(sleepTime.ToString());
                            }
                        }

                        foreach (var job in gridMetric.activeJobs)
                        {
                            foreach (var simulationSubscriber in simulationSubscribers)
                            {
                                if (simulationSubscriber.extra == null ||
                                    simulationSubscriber.extra.threshold == null)
                                {
                                    continue;
                                }

                                var threshold = Double.Parse(simulationSubscriber.extra.threshold) *
                                                SECONDS_IN_HOUR;
                                var runTime = job.runTime;
                                if (runTime >= threshold)
                                {
                                    var messageKey =
                                        $"Simulation-{job.jobID.ToString()}-{simulationSubscriber.owner}";
                                    var count = _mongo.MongoGet(db =>
                                    {
                                        var sentNotificationsCollection =
                                            db.GetCollection<BsonDocument>(MongoCollections.sentNotifications);
                                        return sentNotificationsCollection.Count(
                                            Builders<BsonDocument>.Filter.Eq("messageKey", messageKey));
                                    });

                                    // Only send notification if we haven't already sent one
                                    if (count == 0)
                                    {
                                        var sim = getSimulation(job.jobID);
                                        await processNotification(new[] {simulationSubscriber},
                                            new NotificationMessageParam()
                                            {
                                                gridName = gridMetric.gridName, runTime = runTime,
                                                jobID = job.jobID, messageType = "runtime_threshold",
                                                owner = sim["createdBy"].ToString()
                                            }, messageKey);
                                    }
                                }
                                else
                                {
                                    sleepTime = (int) Math.Min(sleepTime,
                                        (threshold - runTime) * 1000);
                                }
                            }
                        }
                    }

                    //_log.LogInformation((String)(gridMetrics[0].grid_name));
                    await Task.Delay(sleepTime);
                }
                catch (OperationCanceledException e)
                {
                    _log.LogError(e.ToString());
                    _log.LogError($"Unable to contact Julia host specified:  {settings.julia.hostname}");
                    await Task.Delay(60000);
                }
                catch (HttpRequestException e)
                {
                    _log.LogError(e.ToString());

                    if (e.Message.IndexOf(" 502") != -1 || e.Message.IndexOf(" 504") != -1 || e.InnerException is SocketException) // Bad Gateway
                    {
                        _log.LogError($"Unable to contact Julia host specified:  {settings.julia.hostname}");
                        await Task.Delay(60000);
                    }
                    else
                    {
                        await Task.Delay(5000);
                    }
                }
                catch (Exception e)
                {
                    _log.LogError(e.ToString());
                    await Task.Delay(5000);
                }
            }
        }

        private async void WatchBouncedEmailQueue()
        {
            _log.LogInformation($"Watching bounced email SQS queue at {settings.aws.bouncedEmailQueueUrl}");
            while (true)
            {
                try
                {
                    var messages = await sqs.ReceiveMessageAsync(
                        new ReceiveMessageRequest()
                        {
                            QueueUrl = settings.aws.bouncedEmailQueueUrl,
                            WaitTimeSeconds = 20
                        },
                        CancellationToken.None);

                    foreach (var m in messages.Messages)
                    {
                        _log.LogInformation(JsonConvert.SerializeObject(m));
                        var body = m.Body.JsonToDynamic();

                        if (((IDictionary<String, object>) body).ContainsKey("Subject"))
                        {
                            var message = ((string) body.Message).JsonToDynamic();

                            if (message.bounce.bounceType == "Permanent")
                            {
                                foreach (var resp in message.bounce.bouncedRecipients)
                                    await _userService.UnverifyUserEmail(resp.emailAddress);

                                // Update sent notification to indicate failure
                                _mongo.MongoSend(db =>
                                {
                                    var sentNotificationsCollection = db.GetCollection<BsonDocument>(MongoCollections.sentNotifications);
                                    sentNotificationsCollection.UpdateOne(
                                        Builders<BsonDocument>.Filter.Eq("messageID", message.mail.messageId),
                                        Builders<BsonDocument>.Update.Set("delivered", false));
                                });
                            }
                        }

                        await sqs.DeleteMessageAsync(
                            new DeleteMessageRequest(settings.aws.notificationQueueUrl, m.ReceiptHandle),
                            CancellationToken.None);
                    }
                }
                catch (Exception e)
                {
                    _log.LogError(e.ToString());
                }
                finally
                {
                    await Task.Delay(5000, _watchBouncedEmailQueueToken);
                }
            }
        }

        private async void WatchNotificationQueue()
        {
            _log.LogInformation($"Watching notification SQS queue at {settings.aws.notificationQueueUrl}");
            while (true)
            {
                try
                {
                    var messages = await sqs.ReceiveMessageAsync(
                        new ReceiveMessageRequest()
                        {
                            QueueUrl = settings.aws.notificationQueueUrl,
                            WaitTimeSeconds = 20
                        },
                        CancellationToken.None);

                    var subscriptions = this._subscriptions;
                    foreach (var m in messages.Messages)
                    {
                        _log.LogInformation(JsonConvert.SerializeObject(m));
                        var body = JsonConvert.DeserializeObject<NotificationMessageParam>(m.Body);
                        // m.Body.JsonToDynamic();

                        var subscribers = subscriptions.Where(sub => { return $"{sub.target}-{sub.trigger}" == body.messageType; });

                        if (body.owner == null && body.jobID != null)
                        {
                            var sim = getSimulation(body.jobID);
                            if (sim != null)
                                body.owner = sim["createdBy"].ToString();
                        }

                        await processNotification(subscribers, body, Guid.NewGuid().ToString());

                        await sqs.DeleteMessageAsync(
                            new DeleteMessageRequest(settings.aws.notificationQueueUrl, m.ReceiptHandle),
                            CancellationToken.None);
                    }


                    if (messages.Messages.Any())
                    {
                        _log.LogTrace($"Processed {messages.Messages.Count} messages from notification queue");
                    }
                }
                catch (Exception e)
                {
                    _log.LogError(e.ToString());
                }
                finally
                {
                    await Task.Delay(5000, _watchNotificationQueueToken);
                }
            }
        }

        private dynamic getSimulation(string jobID)
        {
            var simulations = _mongo.MongoGet(db =>
                       {
                           var simulationCollection = db.GetCollection<BsonDocument>("Simulation");
                           return simulationCollection.FindSync(Builders<BsonDocument>.Filter.AnyEq("jobIds", jobID)).ToList();
                       });
            return simulations.FirstOrDefault();
        }

        private dynamic getSimulationAttribute(dynamic simulation, string field)
        {
            return simulation.Contains(field) ? simulation[field] : null;
        }

        private string formatTimeSpan(double seconds)
        {
            TimeSpan span = TimeSpan.FromSeconds(seconds);
            return $"{Math.Floor(span.TotalHours)} hrs, {span.Minutes} mins, {span.Seconds} secs";
        }

        public async Task<Dictionary<string, string>> getNotificationMessage(NotificationMessageParam param, Boolean isEmail)
        {
            var simulation = string.IsNullOrEmpty(param.jobID) ? null : getSimulation(param.jobID);
            // The simulation field will always contain the simulation name when we switch to OMDB but right now it does not.
            string simulationName = simulation != null && simulation["name"] != null ? simulation["name"].ToString() : param.simulationName;
            //Debug.Assert(simulationName != null, "Missing simulation name in AwsNotificationService.getNotificationMessage");
            var gridName = param.gridName ?? (simulation != null ? simulation["gridName"].ToString() : null);
            var customerName = Environment.GetEnvironmentVariable("CUSTOMER_NAME");

            Dictionary<string, string> message = null;
            string shortText = null;
            switch (param.messageType)
            {
                case "simulation-start":
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Simulation Started (Customer: {customerName})"},
                        {"body", $"Simulation: {simulationName} Job: {param.jobID} on Grid: {gridName} has started."}
                    };
                    break;
                case "simulation-parse":
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Simulation Parsed (Customer: {customerName})"},
                        {"body", $"Simulation: {simulationName} Job: {param.jobID} on Grid: {gridName} was successfully parsed."}
                    };
                    break;
                case "simulation-compile":
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Simulation Compiled (Customer: {customerName})"},
                        {"body", $"Simulation: {simulationName} Job: {param.jobID} on Grid: {gridName} was successfully compiled."}
                    };
                    break;
                case "simulation-stored":
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Simulation Stored (Customer: {customerName})"},
                        {"body", $"Simulation: {simulationName} Job: {param.jobID} on Grid: {gridName} was successfully stored to disk."}
                    };
                    break;
                case "simulation-failed":
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Simulation {(param.status == "f" ? "Failed" : "Canceled")} (Customer: {customerName})"},
                        {
                            "body",
                            $"Simulation: {simulationName} Job: {param.jobID} on Grid: {gridName} {(param.status == "f" ? "failed" : "was canceled")}."
                        }
                    };
                    break;
                case "runtime_threshold":
                    var runningText =$"has been running for {formatTimeSpan((double) param.runTime)}.";
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Simulation Runtime Threshold Surpassed (Customer: {customerName})"},
                        {
                            "body", $"Simulation: {simulationName} Job: {param.jobID} on Grid: {gridName} {runningText}"
                        }
                    };
                    shortText = $"Simulation {runningText}";
                    break;
                case "system-grid_on":
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Grid On (Customer: {customerName})"},
                        {
                            "body", $"Grid: {gridName} has been turned on."
                        }
                    };
                    break;
                case "system-grid_off":
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Grid Off (Customer: {customerName})"},
                        {
                            "body", $"Grid: {gridName} has been turned off."
                        }
                    };
                    break;
                case "grid_uptime_threshold":
                    var uptimeText =$"has been on for {formatTimeSpan((double) param.gridUptime)}.";
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Grid Uptime Threshold Surpassed (Customer: {customerName})"},
                        {
                            "body", $"Grid: {gridName} {uptimeText}"
                        }
                    };
                    shortText = $"Grid {uptimeText}";
                    break;
                case "billing_usage_threshold":
                    message = new Dictionary<string, string>
                    {
                        {"title", $"Billing Usage Target (Customer: {customerName})"},
                        {
                            "body", $"Monthly {(param.owner == null ? "account" : "user")} bill has surpassed the specified increase target of {formatCurrency(param.threshold.Value)}. Monthly balance is {formatCurrency(param.billTotal.Value)}"
                        }
                    };
                    break;
                default:
                    throw new ArgumentException("unkonwn message type");
            }

            if (isEmail)
            {
                message["body"] = await generateEmail(simulation, message, shortText, gridName, param.jobID, customerName);
            }

            return message;
        }

        public async Task<string> generateEmail(dynamic simulation, Dictionary<string, string> message, string shortText, string gridName, string jobID, string customerName)
        {
            Dictionary<string, dynamic> table = null;
            string detail = shortText;

            if (simulation != null)
            {
                table = new Dictionary<string, dynamic>
                {
                    {"title", "Simulation Details"},
                    {"entries", new List<dynamic> {
                        new {title  = "Name",                  value = getSimulationAttribute(simulation, "name")},
                        new {title  = "Customer",                 value = customerName},
                        new {title  = "Grid",                  value = gridName},
                        new {title  = "Job",                   value = jobID},
                        new {title  = "Economies",             value = getSimulationAttribute(simulation, "economies")},
                        new {title  = "Frequency",             value = getSimulationAttribute(simulation, "frequencies")},
                        new {title  = "Modules",               value = getSimulationAttribute(simulation, "modules")},
                        new {title  = "Number of Scenarios",   value = getSimulationAttribute(simulation, "scenarios")},
                        new {title  = "Number of Variables",   value = getSimulationAttribute(simulation, "variables")},
                        new {title  = "Time Period",           value = getSimulationAttribute(simulation, "periods")?.ToDictionary()},
                        new {title  = "Data Elements",         value = getSimulationAttribute(simulation, "elements")},
                        new {title  = "Start time",            value = getSimulationAttribute(simulation, "createdTime")},
                        new {title  = "Created By",            value = (await _userService.GetUserAsync(getSimulationAttribute(simulation, "createdBy").ToString())).FullName}}
                    }
                };
            }
            else if (gridName != null)
            {
                table = new Dictionary<string, dynamic>
                {
                    {"title", "Grid Details"},
                    {"entries", new List<dynamic> {new {title = "Name", value = gridName}, new {title = "Customer", value = customerName}}}
                };
            }
            else if (detail == null)
            {
                detail = message["body"];
            }

            var prop = new
            {
                banner = message["title"], table, detail
            };

            var noReply = $"Please do not reply directly to this email. If you have any questions or comments regarding this email, please contact us at {settings.email.support}";
            var html = await _renderService.renderComponent("NotificationEmail", prop);

            return $"{html}<br/><div>{noReply}</div>";
        }

        public string formatCurrency(double value)
        {
            return value.ToString("C", new CultureInfo("en-US"));
        }

        public async Task processNotification(IEnumerable<NotificationSubscription> subscribers,
            NotificationMessageParam param, String messageKey = "", string tenant = null)
        {
            // Filter list to remove user scoped notifications that aren't associated with target owner
            subscribers = subscribers.Where(s => s.scope != "user" || (s.scope == "user" && param.owner == s.owner));

            var users = subscribers.Select(s => s.owner).Distinct()
                .Select(async s => await _userService.GetUserAsync(s)).Select(s => s.Result).Where(s => s != null && !s.Blocked)
                .ToDictionary(t => t.Sub);

            foreach (var s in subscribers
                .Where(s => s.email == true)
                .Distinct().Where(s => users.ContainsKey(s.owner) && users[s.owner].EmailVerified == true)
                .Where(s => s != null))
            {
                try
                {
                    if (_userService.GetUserNotificationSettings(users[s.owner]).email.enabled)
                    {
                        var message = await getNotificationMessage(param, true);
                        var sentTime = DateTime.UtcNow;
                        var resp = await _messageService.sendEmail(users[s.owner].Email, $"{s.severity.ToUpper()}: {message["title"]}", message["body"]);
                        var _tenant = tenant ?? _userService.GetUserTenant(users[s.owner]);
                        await _mongo.MongoAsync(_tenant, db =>
                        {
                            var sentNotificationsCollection = _mongo.collectionFor<SentNotification>(db);
                            return sentNotificationsCollection.InsertOneAsync(
                                new SentNotification()
                                {
                                    title = message["title"],
                                    sentTime = sentTime,
                                    owner = s.owner,
                                    endpoint = new Models.Notifications.Endpoint()
                                    {
                                        type = "email",
                                        value = users[s.owner].Email
                                    },
                                    messageID = resp.MessageId,
                                    messageKey = messageKey
                                });
                        });

                        _log.LogDebug("Sent e-mail");
                    }
                }
                catch (Exception e)
                {
                    _log.LogDebug("Error processing e-mail");
                    _log.LogError(e.ToString());
                }
            }

            /*
            foreach (var ownerId in subscribers
                .Where(s => s.mobile == true && users.ContainsKey(s.owner))
                .Select(s => s.owner)
                .Distinct()
                .Where(s => s != null))
            {
                try
                {
                    if (_userService.GetUserNotificationSettings(users[ownerId]).phone.enabled)
                    {
                        var message = await getNotificationMessage(param, false);
                        var phoneNumber = _userService.GetUserPhone(users[ownerId]);
                        await _messageService.sendText(phoneNumber, $"{message["title"]} - {message["body"]}");
                        var _tenant = tenant ?? _userService.GetUserTenant(users[ownerId]);
                        await _mongo.MongoAsync(_tenant, db =>
                        {
                            var sentNotificationsCollection = _mongo.collectionFor<SentNotification>();
                            return sentNotificationsCollection.InsertOneAsync(new SentNotification()
                            {
                                title = message["title"],
                                sentTime = DateTime.UtcNow,
                                owner = ownerId,
                                endpoint = new Models.Notifications.Endpoint() {type = "mobile", value = phoneNumber},
                                messageKey = messageKey
                            });
                        });

                        _log.LogDebug("Sent sms");
                    }
                }
                catch (Exception e)
                {
                    _log.LogDebug("Error processing sms");
                    _log.LogError(e.ToString());
                }
            }
            */

            foreach (var id in subscribers
                .Where(s => s.desktop == true)
                .Select(s => s.owner)
                .Distinct())
            {
                try
                {
                    if (_userService.GetUserNotificationSettings(users[id]).desktop.enabled)
                    {
                        var message = await getNotificationMessage(param, false);

                        _notificationQueue.AddNotificationEvent(
                            new DesktopNotificationEvent()
                            {
                                message = message["body"],
                                title = message["title"],
                                userId = id
                            });

                        var _tenant = tenant ?? _userService.GetUserTenant(users[id]);
                        await _mongo.MongoAsync(_tenant, db =>
                        {
                            var sentNotificationsCollection = _mongo.collectionFor<SentNotification>();
                            return sentNotificationsCollection.InsertOneAsync(new SentNotification()
                            {
                                title = message["title"],
                                sentTime = DateTime.UtcNow,
                                owner = id,
                                endpoint = new Models.Notifications.Endpoint() {type = "desktop"},
                                messageKey = messageKey
                            });
                        });
                    }
                }
                catch (Exception e)
                {
                    _log.LogDebug("Error processing desktop notification");
                    _log.LogError(e.ToString());
                }
            }
        }

        public AmazonCloudFormationClient cloudFormation { get; private set; }

    }
}
