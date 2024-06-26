using System;
using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace Conning.Kui.Web
{
    public class Program
    {
        private static string BasePath;

        public static void Main(string[] args)
        {
            var baseDir = new DirectoryInfo(Directory.GetCurrentDirectory());
            if (baseDir.GetFiles("appsettings.json").Length != 1)
            {
                var kuiSubdir = baseDir.GetDirectories("kui");
                if (kuiSubdir.Length == 1)
                {
                    baseDir = kuiSubdir[0];
                    var webApiDir = baseDir.GetDirectories("web-api");
                    if (webApiDir.Length == 1)
                    {
                        baseDir = webApiDir[0];
                    }
                    else
                    {
                        throw new Exception(
                            "Web ADVISE+ must be run from a directory containing appsettings.json or a parent thereof");
                    }
                }
                else
                {
                    throw new Exception(
                        "Web ADVISE+ must be run from a directory containing appsettings.json or a parent thereof.");
                }
            }

            BasePath = baseDir.FullName;

            Console.WriteLine($"Base path for web-server is '{BasePath}'");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(BasePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile(
                    $"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json",
                    optional: true)
                .Build();


            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Verbose()
                .ReadFrom.Configuration(configuration)
                .Enrich.FromLogContext()
                .Enrich.WithThreadId()
                .CreateLogger();
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseContentRoot(BasePath)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var env = hostingContext.HostingEnvironment;
                    config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                        .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);

                    if (Environment.GetEnvironmentVariable("KARMA_TEST") == "1")
                        config.AddJsonFile("appsettings.Karma.json", optional: true, reloadOnChange: true);

                    config.AddEnvironmentVariables();
                })
                .UseSerilog()
                .UseUrls("http://*:5000")
                //           .ConfigureLogging((hostingContext, logging) => {
                //logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                //logging.AddConsole();
                //    logging.AddDebug();
                //})
                .UseStartup<Startup>()
                .Build();
    }
}
