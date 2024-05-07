using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using Amazon;
using Amazon.CloudWatchLogs;
using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;
using Conning.AWS;
using Conning.Common;
using Conning.Db.Services;
using Conning.Kui.Web.Authorization;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;
using Conning.Library.Utility;
using Conning.GraphQL;
using JavaScriptEngineSwitcher.V8;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using MongoDB.Integrations.JsonDotNet.Converters;
using Newtonsoft.Json.Serialization;
using React.AspNet;
using Amazon.Util; // Amazon.Util.EC2InstanceMetadata
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;
using System.Runtime.InteropServices;
using Conning.GraphQL.Authentication;
using GraphQL;
using GraphQL.Server.Transports.AspNetCore;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Routing;
using MongoDB.Bson;
using GraphQL.Server.Ui.Playground;
using GraphQL.Server.Ui.GraphiQL;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;

// https://mariusschulz.com/blog/detecting-the-operating-system-in-net-core
public static class OperatingSystem
{
    public static bool IsWindows() =>
        RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

    public static bool IsMacOS() =>
        RuntimeInformation.IsOSPlatform(OSPlatform.OSX);

    public static bool IsLinux() =>
        RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
}

namespace Conning.Kui.Web
{
    public class Startup
    {
        // get rid of ssm if we are IsOnPremK8s
        public Startup(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            IdentityModelEventSource.ShowPII = true;
            Configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
            IsOnPremK8s = Environment.GetEnvironmentVariable("ON_PREM_K8S") == "1";
            Console.WriteLine($"get ON_PREM_K8S: {IsOnPremK8s}");
            if (!IsOnPremK8s)
            {
                _ssm =  new AmazonSimpleSystemsManagementClient(this.getRegion());
            }
        }
        private IConfiguration Configuration { get; set; }
        private IHostingEnvironment _hostingEnvironment { get; set; }
        private AwsNotificationService AwsNotificationService { get; set; }
        private Auth0Service Auth0Service { get; set; }

        private BaseUserService _userService { get; set; }

        private AmazonSimpleSystemsManagementClient _ssm { get; set; }
        private bool IsOnPremK8s;

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.Configure<AdviseAppSettings>(Configuration.GetSection("ADVISE"));

            services.Configure<AdviseAppSettings>(settings =>
            {
                settings.auth.license = new License();
	            if (settings.aws == null)
                {
                    settings.aws = new AwsSettings();
                }

	            settings.omdb.schemaVersion = "0.3.1";

                // Override values with environment variables (if present)
              	var adviseProduct = Environment.GetEnvironmentVariable("ADVISE_PRODUCT");
	            if (!string.IsNullOrEmpty(adviseProduct))
	            {
		            settings.product = adviseProduct;
	            }

                var awsStackName = Environment.GetEnvironmentVariable("CLOUDMANAGER_STACK_NAME");
                if (!string.IsNullOrEmpty(awsStackName))
                {
                    settings.aws.bouncedEmailConfigurationSet = $"{awsStackName}-BouncedEmails";
                }

                var gridLogQueueUrl = Environment.GetEnvironmentVariable("GRID_LOG_QUEUE_URL");
                if (!string.IsNullOrEmpty(gridLogQueueUrl))
                {
                    settings.aws.gridLogQueueUrl = gridLogQueueUrl;
                }

                var notificationQueueUrl = Environment.GetEnvironmentVariable("NOTIFICATION_QUEUE_URL");
                if (!string.IsNullOrEmpty(notificationQueueUrl))
                {
                    settings.aws.notificationQueueUrl = notificationQueueUrl;
                }

                var sesSourceArn = Environment.GetEnvironmentVariable("SES_SOURCE_ARN");
                if (!string.IsNullOrEmpty(sesSourceArn))
                {
                    settings.aws.sesSourceArn = sesSourceArn;
                }

                var bouncedEmailQueueUrl = Environment.GetEnvironmentVariable("BOUNCED_EMAIL_QUEUE_URL");
                if (!string.IsNullOrEmpty(bouncedEmailQueueUrl))
                {
                    settings.aws.bouncedEmailQueueUrl = bouncedEmailQueueUrl;
                }

                var bouncedEmailConfigurationSet = Environment.GetEnvironmentVariable("BOUNCED_EMAIL_CONFIGURATION_SET");
                if (!string.IsNullOrEmpty(bouncedEmailConfigurationSet))
                {
                    settings.aws.bouncedEmailConfigurationSet = bouncedEmailConfigurationSet;
                }

                var scriptBucketName = Environment.GetEnvironmentVariable("CLUSTER_SCRIPT_BUCKET");
                if (!string.IsNullOrEmpty(scriptBucketName))
                {
                    settings.aws.scriptBucketName = scriptBucketName;
                }

                settings.aws.region = this.getRegion(); // private function below

                var sesRegion = Environment.GetEnvironmentVariable("EMAIL_REGION");
                if (!string.IsNullOrEmpty(sesRegion))
                {
                    settings.email.region = RegionEndpoint.GetBySystemName(sesRegion);
                } else {
                    settings.email.region = RegionEndpoint.USEast1;
                }

                // Old method, read client secret directly from envvar.
                // var sharedSecret = Environment.GetEnvironmentVariable("JULIA_DOTNET_SHARED_SECRET");
                // if (!string.IsNullOrEmpty(sharedSecret))
                // {
                //     settings.julia.sharedSecret = sharedSecret;
                // }

                var enableMultiTenant = Environment.GetEnvironmentVariable("ENABLE_MULTI_TENANT");
                if (!string.IsNullOrEmpty(enableMultiTenant))
                {
                    settings.multiTenant = enableMultiTenant == "1";
                }

                // New method, read client secret from secure storage.
                var juliaDotnetSharedSecretPath = Environment.GetEnvironmentVariable("JULIA_DOTNET_SHARED_SECRET_PATH");
                if (!string.IsNullOrEmpty(juliaDotnetSharedSecretPath))
                {
                    if (IsOnPremK8s)
                    {
                        settings.julia.sharedSecret = readSecret(juliaDotnetSharedSecretPath);
                    }
                    else
                    {
                        var sharedSecretRequest = new GetParameterRequest
                        {
                            Name = juliaDotnetSharedSecretPath,
                            WithDecryption = true
                        };
                        settings.julia.sharedSecret = _ssm.GetParameterAsync(sharedSecretRequest).Result.Parameter.Value;
                    }
                }

                var supportEmail = Environment.GetEnvironmentVariable("SUPPORT_EMAIL");
                if (!string.IsNullOrEmpty(supportEmail))
                {
                    settings.email.support = supportEmail;
                }

                var notificationEmail = Environment.GetEnvironmentVariable("NOTIFICATION_EMAIL");
                if (!string.IsNullOrEmpty(supportEmail))
                {
                    settings.email.notification = notificationEmail;
                }

                var authProvider = Environment.GetEnvironmentVariable("AUTH_PROVIDER");
                if (!string.IsNullOrEmpty(authProvider))
                {
                    settings.auth.provider = authProvider;
                }

                if (settings.auth.provider == "auth0")
                {
                    var auth0TenantDomain = Environment.GetEnvironmentVariable("AUTH0_TENANT_DOMAIN");
                    if (!string.IsNullOrEmpty(auth0TenantDomain))
                    {
                        settings.auth.domain = auth0TenantDomain;
                    }

                    settings.auth.tenant = settings.auth.domain.Split(".").First();

                    var auth0ClientId = Environment.GetEnvironmentVariable("AUTH0_BROWSER_CLIENT_ID");
                    if (!string.IsNullOrEmpty(auth0ClientId))
                    {
                        settings.auth.clientId = auth0ClientId;
                    }

                    // Old method, read client secret directly from envvar.
                    var auth0ClientClient = Environment.GetEnvironmentVariable("AUTH0_BROWSER_CLIENT_SECRET");
                    if (!string.IsNullOrEmpty(auth0ClientClient))
                    {
                        settings.auth.clientSecret = auth0ClientClient;
                    }

                    // New method, read client secret from secure storage.
                    var auth0BrowserClientSecretPath =
                        Environment.GetEnvironmentVariable("AUTH0_BROWSER_CLIENT_SECRET_PATH");
                    if (!string.IsNullOrEmpty(auth0BrowserClientSecretPath))
                    {
                        var auth0BrowserRequest = new GetParameterRequest
                        {
                            Name = auth0BrowserClientSecretPath,
                            WithDecryption = true
                        };
                        if (!IsOnPremK8s)
                        {
                          settings.auth.clientSecret = _ssm.GetParameterAsync(auth0BrowserRequest).Result.Parameter.Value;
                        }
                    }

                    var auth0RestClientId = Environment.GetEnvironmentVariable("AUTH0_REST_CLIENT_ID");
                    if (!string.IsNullOrEmpty(auth0RestClientId))
                    {
                        settings.auth.restClientId = auth0RestClientId;
                    }

                    // Old method, read client secret directly from envvar.
                    var auth0RestClientSecret = Environment.GetEnvironmentVariable("AUTH0_REST_CLIENT_SECRET");
                    if (!string.IsNullOrEmpty(auth0RestClientSecret))
                    {
                        settings.auth.restSecret = auth0RestClientSecret;
                    }

                    // New method, read client secret from secure storage.
                    var auth0RestClientSecretPath = Environment.GetEnvironmentVariable("AUTH0_REST_CLIENT_SECRET_PATH");
                    if (!string.IsNullOrEmpty(auth0RestClientSecretPath))
                    {
                        var auth0RestRequest = new GetParameterRequest
                        {
                            Name = auth0RestClientSecretPath,
                            WithDecryption = true
                        };
                        if (!IsOnPremK8s)
                        {
                            settings.auth.restSecret = _ssm.GetParameterAsync(auth0RestRequest).Result.Parameter.Value;
                        }
                    }
                }

                var isKarma = Environment.GetEnvironmentVariable("KARMA_TEST");
                if (!string.IsNullOrEmpty(isKarma))
                {
                    settings.karma = true;
                }

                var customerName = Environment.GetEnvironmentVariable("CUSTOMER_NAME");
                if (settings.karma || customerName == "End-to-End Testing")
                {
                    settings.isTestingEnvironment = true;
                }

                var mongoConnectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING");
                if (!string.IsNullOrEmpty(mongoConnectionString))
                {
                    if (IsOnPremK8s)
                    {
                        Console.WriteLine("on prem k8s, Getting MongoDB ConnectionString from secret/mongo");
                        settings.mongo.connectionString = getNewConnectionString();
                    }
                    else
                    {
                        settings.mongo.connectionString = mongoConnectionString;
                    }
                }

                if (settings.opsgenie == null)
                {
                    settings.opsgenie = new OpsGenieSettings();
                }

                var opsGenieKey = Environment.GetEnvironmentVariable("OPSGENIE_KEY");
                if (!string.IsNullOrEmpty(opsGenieKey))
                {
                    settings.opsgenie.key = opsGenieKey;
                }

                if (settings.splunk == null)
                {
                    settings.splunk = new SplunkSettings();
                }

                var splunkKey = Environment.GetEnvironmentVariable("SPLUNK_KEY");
                if (!string.IsNullOrEmpty(splunkKey))
                {
                    settings.splunk.key = splunkKey;
                }

                var cspLogGroupName = Environment.GetEnvironmentVariable("CSP_LOG_GROUP_NAME");
                if (!string.IsNullOrEmpty(cspLogGroupName))
                {
                    settings.aws.cspLogGroupName = cspLogGroupName;
                }
            });


            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies
                // is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpContextAccessor();

            var appSettings = services.BuildServiceProvider().GetService<IOptions<AdviseAppSettings>>().Value;
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                if (appSettings.auth.provider == "keycloak")
                {
                    if (appSettings.auth.ignoreSslCertCheck)
                    {
                        options.BackchannelHttpHandler = new HttpClientHandler()
                        {
                            ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) => true
                        };
                    }
                    bool ValidateIssuerStatus = !IsOnPremK8s;
                    Console.WriteLine("ValidateIssuerStatus: "+ValidateIssuerStatus);
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidIssuer = $"https://{appSettings.auth.domain}",
                        ValidateIssuer = ValidateIssuerStatus,
                        ValidateAudience = false
                    };
                }
                else
                {
                    options.Audience = "https://kui/api";
                }

                options.Authority = $"https://{appSettings.auth.domain}";
                options.TokenValidationParameters.ValidateIssuerSigningKey = true;
#if DEBUG
                // Only needed for debugging to prevent SecurityTokenInvalidSignatureException in JwtSecurityTokenHandler.cs when processing requests from Julia
                // In release these errors are ignored and the AuthQL layer performs the actual validation with the correct key for requests on port 81.
                options.IncludeErrorDetails = true;
                options.TokenValidationParameters.IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(appSettings.julia.sharedSecret));
#endif
                if (IsOnPremK8s)
                {
                    Console.WriteLine("Use SymmetricSecurityKey for IsOnPremK8s");
                    options.IncludeErrorDetails = true;
                    options.TokenValidationParameters.IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.ASCII.GetBytes(appSettings.julia.sharedSecret));
                }
            });

            services.AddAuthorization(options =>
            {
                String[] permissions =
                {
                    "read:tags", "edit:objects", "edit:ui", "unrestricted:dev", "unrestricted:kui", "edit:tags",
                    "read:billing"
                };

                foreach (var permission in permissions)
                {
                    options.AddPolicy(permission,
                        policy => policy.Requirements.Add(new HasPermissionRequirement(permission)));
                }
            });

            // register the permission authorization handler
            services.AddSingleton<IAuthorizationHandler, HasPermissionHandler>();

            // http
            GraphSchema.RegisterInjectableTypes(services);

            services.AddSingleton<GraphQLHttpMiddlewareOptions>();
            services.AddGraphQL(builder => builder
                .AddSchema<GraphSchema>()
                .AddAutoClrMappings()
                .ConfigureExecution((opt, next) =>
                {
                    opt.EnableMetrics = true;
                    return next(opt);
                })
                .AddNewtonsoftJson()
                .AddDataLoader()
                .AddUserContextBuilder(context =>
                {
                    return new Dictionary<string, object>
                        { { "user", context.User.Identity!.IsAuthenticated ? context.User : null } };
                })
                .AddGraphTypes(typeof(GraphSchema).Assembly)
                .AddWebSocketAuthentication<JwtWebSocketAuthenticationService>()
            );

            services.AddMvc(option => option.EnableEndpointRouting = false).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.Converters.Add(
                    new Newtonsoft.Json.Converters.StringEnumConverter {CamelCaseText = true});
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                options.SerializerSettings.Formatting = Formatting.Indented;


                // Adds automatic json parsing to BsonDocuments.
                options.SerializerSettings.Converters.Add(new BsonArrayConverter());
                options.SerializerSettings.Converters.Add(new BsonMinKeyConverter());
                options.SerializerSettings.Converters.Add(new BsonBinaryDataConverter());
                options.SerializerSettings.Converters.Add(new BsonNullConverter());
                options.SerializerSettings.Converters.Add(new BsonBooleanConverter());
                options.SerializerSettings.Converters.Add(new BsonObjectIdConverter());
                options.SerializerSettings.Converters.Add(new BsonDateTimeConverter());
                options.SerializerSettings.Converters.Add(new BsonRegularExpressionConverter());
                options.SerializerSettings.Converters.Add(new BsonDocumentConverter());
                options.SerializerSettings.Converters.Add(new BsonStringConverter());
                options.SerializerSettings.Converters.Add(new BsonDoubleConverter());
                options.SerializerSettings.Converters.Add(new BsonSymbolConverter());
                options.SerializerSettings.Converters.Add(new BsonInt32Converter());
                options.SerializerSettings.Converters.Add(new BsonTimestampConverter());
                options.SerializerSettings.Converters.Add(new BsonInt64Converter());
                options.SerializerSettings.Converters.Add(new BsonUndefinedConverter());
                options.SerializerSettings.Converters.Add(new BsonJavaScriptConverter());
                options.SerializerSettings.Converters.Add(new BsonValueConverter());
                options.SerializerSettings.Converters.Add(new BsonJavaScriptWithScopeConverter());
                options.SerializerSettings.Converters.Add(new BsonMaxKeyConverter());
                options.SerializerSettings.Converters.Add(new ObjectIdConverter());
            });

            services.AddControllers(options =>
            {
                var jsonInputFormatter = options.InputFormatters
                    .OfType<NewtonsoftJsonInputFormatter>()
                    .First(i => i.SupportedMediaTypes.Contains("application/json"));

                jsonInputFormatter.SupportedMediaTypes.Add("application/csp-report");
            });

            //services.AddHttpsRedirection(options => { });

            services.AddResponseCompression();
            services.AddMemoryCache();
            services.AddCors();

            services.AddResponseCaching();

#if DEBUG
            services.AddDirectoryBrowser();
#endif

            services.AddLogging(builder => builder.SetMinimumLevel(LogLevel.Trace));

            // Add S3 to the ASP.NET Core dependency injection framework.
            services.AddAWSService<Amazon.S3.IAmazonS3>();

            services.AddSingleton<MongoDbService>();
            services.AddSingleton<OmdbService>();

            if (appSettings.auth.provider == "keycloak")
            {
                services.AddSingleton<KeycloakService>();
                services.AddSingleton<BaseUserService>((svc) => { return svc.GetRequiredService<KeycloakService>(); });
            } else {
                services.AddSingleton<Auth0Service>();
                services.AddSingleton<BaseUserService>((svc) => { return svc.GetRequiredService<Auth0Service>(); });
            }

            services.AddSingleton<AwsNotificationService>();
            services.AddSingleton<SendMessageService>();
            services.AddSingleton<ReactRenderService>();

            //services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // https://docs.aws.amazon.com/sdk-for-net/v3/developer-guide/net-dg-config-netcore.html
            services.AddDefaultAWSOptions(Configuration.GetAWSOptions());
            services.AddAWSService<IAmazonCloudWatchLogs>();

//            services.AddHttpsRedirection(options =>
//            {
//                options.RedirectStatusCode = StatusCodes.Status301MovedPermanently;
//                options.HttpsPort = 5001;
//            });

            services.AddJsEngineSwitcher(options => options.DefaultEngineName = V8JsEngine.EngineName)
                .AddV8();

            services.AddReact();

            return services.BuildServiceProvider();
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApplicationLifetime appLifetime,
            ILoggerFactory loggerFactory)
        {
            //if (env.IsDevelopment()) {
            //    app.UseDeveloperExceptionPage();
            //}


//            app.UseHsts();
//            app.UseHttpsRedirection();

            // Initialise ReactJS.NET. Must be before static files.
            app.UseReact(config =>
            {
                // If you want to use server-side rendering of React components,
                // add all the necessary JavaScript files here. This includes
                // your components as well as all of their dependencies.
                // See http://reactjs.net/ for more information. Example:
                //config
                //    .AddScript("~/Scripts/First.jsx")
                //    .AddScript("~/Scripts/Second.jsx");

                // If you use an external build too (for example, Babel, Webpack,
                // Browserify or Gulp), you can improve performance by disabling
                // ReactJS.NET's version of Babel and loading the pre-transpiled
                // scripts. Example
                //config.AddScriptWithoutTransform("~/ui/client-ssr.js");

                config
                    .AddScript("~/SSR/NotificationEmail.jsx")
                    .SetJsonSerializerSettings(new JsonSerializerSettings
                    {
                        StringEscapeHandling = StringEscapeHandling.EscapeHtml,
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    });

            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();
            //app.UseMiddleware(typeof(ErrorHandlingMiddleware));
            app.UseResponseCompression();

            var options = Configuration.GetAWSOptions();
            loggerFactory.AddAWSProvider(Configuration.GetAWSLoggingConfigSection());

            var uiPath = Path.Combine(env.ContentRootPath, "wwwroot", "ui");
            var settings = app.ApplicationServices.GetService<IOptions<AdviseAppSettings>>().Value;

            if (!Directory.Exists(uiPath))
            {
                Directory.CreateDirectory(uiPath);
            }

            string cspReportTo = settings.csp.reportTo.ToJson();
            var cspPolicyCollection = new HeaderPolicyCollection()
                .AddContentSecurityPolicy(builder =>
                {
                    var cspConnectSrc = String.Join(" ", settings.csp.connectSrc);
                    if (env.IsDevelopment())
                    {
                        cspConnectSrc += " ws://localhost:5001 ws://advise.test:5001";
                    }

                    string cspFrameSrc = String.Join(" ", settings.csp.frameSrc);
                    string cspScriptSrc = String.Join(" ", settings.csp.scriptSrc);
                    string cspStyleSrc = String.Join(" ", settings.csp.styleSrc);
                    string cspFontSrc = String.Join(" ", settings.csp.fontSrc);
                    string cspImgSrc = String.Join(" ", settings.csp.imgSrc);

                    if (settings.auth.provider == "auth0") {
                        cspScriptSrc += $" {settings.auth.domain}";
                        cspConnectSrc += $" {settings.auth.domain}";
                        cspFrameSrc += $" {settings.auth.domain}";
                    }

                    builder.AddFrameAncestors() // frame-ancestors 'self'
                        .Self();

                    builder.AddDefaultSrc() // default-src 'self'
                        .Self();

                    builder.AddReportUri().To("/api/aws/reportCspViolation");
                    builder.AddCustomDirective("report-to", "csp-endpoint");

                    builder.AddConnectSrc() // connect-src
                        .Self()
                        .From(cspConnectSrc);

                    builder.AddFrameSource() // frame-src 'self'
                        .Self()
                        .From(cspFrameSrc);

                    builder.AddStyleSrc() // style-src 'self'
                        .Self()
                        .From(cspStyleSrc);

                    builder.AddFontSrc()
                        .Self()
                        .From(cspFontSrc);

                    builder.AddImgSrc()
                        .Self()
                        .From(cspImgSrc);

                    var scriptSourceDirectiveBuilder = builder.AddScriptSrc() // script-src 'self' 'nonce-<base64-value>'
                        .Self()
                        .WithNonce()
                        .WithHashTagHelper()
                        .From(cspScriptSrc);
                    if (env.IsDevelopment())
                    {
                        scriptSourceDirectiveBuilder.UnsafeEval(); // 'unsafe-inline' for webpack hot reload
                    }
                })
                .AddXssProtectionBlock()
                .AddFrameOptionsSameOrigin()
                .AddContentTypeOptionsNoSniff()
                .AddCustomHeader("Strict-Transport-Security", "max-age=631138519; includeSubDomains")
                .AddCustomHeader("report-to", cspReportTo);

            app.UseSecurityHeaders(cspPolicyCollection);

            // Serve images
            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = (StaticFileResponseContext ctx) =>
                {
                    cacheStaticFilesHandler(ctx);
                }
            });

            app.UseStaticFiles(new StaticFileOptions()
            {
                ServeUnknownFileTypes = true,
                FileProvider = new PhysicalFileProvider(uiPath),
                RequestPath = new PathString("/ui"),
                /* Tells the client to cache results */
                OnPrepareResponse = (StaticFileResponseContext ctx) =>
                {
                    cacheStaticFilesHandler(ctx);
                }
            });

            // Enabled [VaryByQueryKeys] in controller methods. Note: Being added after static file middleware so static files aren't cached. This allows us to pick up static file changes without a restart
            app.UseResponseCaching();

            //app.UseHttpsRedirection();
            //app.UseCookiePolicy();
#if DEBUG
            app.UseCors(builder => builder.AllowAnyOrigin());
#endif
            SetupGraphqlService(app);

            app.UseMvc(routes =>
            {
                routes.MapRoute("Favorite Icon", "favicon.ico");
                routes.MapRoute("default", "{controller}/{action}");
                routes.MapRoute("Unknown api call", "api/{*url}", new NotFoundResult());

                if (env.IsDevelopment())
                {
                    routes.MapMiddlewareGet("/ui/{*url}",  _app =>
                    {
                        _app.UseSpa(spa =>
                        {
                            var webpackServerHostName = Environment.GetEnvironmentVariable("REMOTE_CONTAINERS") == "true"
                                ? "advise.test"
                                : "localhost";
                            spa.UseProxyToSpaDevelopmentServer($"http://{webpackServerHostName}:5001");
                        });
                    });

                    routes.MapRoute("React", "{*url}", defaults: new {controller = "React", action = "Index"});
                }
                else
                {
                    routes.MapRoute("React", "{*url}", defaults: new {controller = "React", action = "Index"});
                }
            });

            appLifetime.ApplicationStarted.Register(() =>
            {
                var log = app.ApplicationServices.GetService<ILogger<Startup>>();
                log.LogInformation($"Application Config:");
                log.LogInformation($"Environment:  {env.EnvironmentName}");
                log.LogInformation("\n" + settings.ToPrettyString());

                if (!IsOnPremK8s)
                {
                    AwsNotificationService = app.ApplicationServices.GetService<AwsNotificationService>();
                    AwsNotificationService.Start(app.ApplicationServices);
                }

                _userService = app.ApplicationServices.GetService<BaseUserService>();
                _userService.Start(app.ApplicationServices);

                Mongo = app.ApplicationServices.GetService<MongoDbService>();
            });
        }

        private void cacheStaticFilesHandler(StaticFileResponseContext ctx)
        {
            var requestPath = ctx.Context.Request.Path.Value;


            bool cacheResponse = true;

            // For developers the files that get rebuilt constantly are client.css, client.css.map, client.js, and client.js.map
            // Tell the web browser not to cache these
            // UPDATE: 7/22/19 - RAJ: Re-add caching. Cache busting will detect the change and client will request new version. Should speed up refresh in debug when bundle hasn't changed.
            /*
#if DEBUG
            cacheResponse = !(requestPath.EndsWith("conning-ui.css")
                              || requestPath.EndsWith("conning-ui.js")
                              || requestPath.EndsWith("conning-ui-karma.js")
                              || requestPath.EndsWith("conning-ui-karma.js.map")
                              || requestPath.EndsWith("conning-ui.js.map") ||
                              requestPath.EndsWith("conning-ui.css.map"));
#endif

            */

            if (cacheResponse)
            {
                ctx.Context.Response.Headers.Append(HeaderNames.CacheControl, "public,max-age=2592000");
            }
            else
            {
                ctx.Context.Response.Headers.Append(HeaderNames.CacheControl, "no-cache");
            }
        }

        public MongoDbService Mongo { get; private set; }

        // used in this class once for ssm region detection and once for the settings.aws.region detection
        private RegionEndpoint getRegion(){
            RegionEndpoint retVal;
            var region = Environment.GetEnvironmentVariable("AWS_REGION");
            if (!string.IsNullOrEmpty(region))
            {
                retVal = RegionEndpoint.GetBySystemName(region);
                Console.WriteLine("Env variable AWS_REGION overwrote region to \"" + retVal.SystemName + "\"");
            } else if(OperatingSystem.IsMacOS()){
                retVal = RegionEndpoint.USEast1;
                Console.WriteLine("Localpresence (MacOs) hardcoded region to \"" + retVal.SystemName + "\"");
            } else {
                retVal = EC2InstanceMetadata.Region;
                Console.WriteLine("EC2InstanceMetadata reported region to be \"" + retVal.SystemName + "\"");
            }
            return retVal;
        }

        private void SetupGraphqlService(IApplicationBuilder app)
        {
            app.ApplicationServices.GetService<GraphSchema>(); // To initialize GraphSchema in advance or first graphql request will need to wait

            app.UseWebSockets();

            // configure the graphql endpoint at "/graphql"
            app.UseGraphQL<ConningGraphQLHttpMiddleware<GraphSchema>>("/graphql");

#if DEBUG
            app.UseGraphQLPlayground(
                "/dev/playground",
                new PlaygroundOptions
                {
                    GraphQLEndPoint = "/graphql",         // url of GraphQL endpoint
                    SubscriptionsEndPoint = "/graphql",   // url of GraphQL endpoint
                });

//                app.UseGraphQLVoyager(new GraphQLVoyagerOptions()
//                {
//                    GraphQLEndPoint = "/graphql",
//                    Path = "/dev/voyager"
//                });

            // configure the GraphiQL endpoint at "/ui/graphql"
            app.UseGraphQLGraphiQL(
                "/ui/graphql",
                new GraphiQLOptions()
                {
                    GraphQLEndPoint = "/graphql",
                    SubscriptionsEndPoint = "/graphiql"
                });
#endif
        }

        private string readSecret(string path){
            StreamReader sr = new StreamReader(path,Encoding.Default);
            String line;
            String res = "";
            while ((line = sr.ReadLine()) != null)
            {
                res+=line;
            }
            return res;
        }

        private string getNewConnectionString(){

            string pattern = @"(?<=[@]).*";
            string newConnectionString = readSecret("/secret/mongo/connectionString.standardSrv");
            string newUserName = readSecret("/secret/mongo/username");
            string newPassword = readSecret("/secret/mongo/password");
            Match ConnectionStringSurfix = Regex.Match(newConnectionString, pattern);
            string result = "mongodb+srv://" + newUserName.Trim() + ":" + newPassword.Trim() + "@" + ConnectionStringSurfix;
            if (!string.IsNullOrEmpty(result))
            {
                Console.WriteLine("on prem k8s, new mongoDB connectionString: '{0}'", result);
            }
            else
            {
                Console.WriteLine("on prem k8s, failed to get new mongoDB connectionString from secret k8s");

            }
            return newConnectionString;
        }
    }
}
