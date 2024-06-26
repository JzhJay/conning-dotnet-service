using System;
using System.ComponentModel.DataAnnotations;
using Conning.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using React;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

public class RenderPayload
{
    [StringLength(50),Required]
    public string component { get; set; }
    public dynamic props { get; set; }
}

namespace Conning.Kui.Web.Controllers
{
    public class ReactController : Controller
    {
        private IMemoryCache _cache;
        private readonly IOptions<AdviseAppSettings> _settings;
        private readonly ILogger<ReactController> _log;
        public ReactController(IMemoryCache memoryCache, IHostingEnvironment hostingEnvironment, ILogger<ReactController> log, IOptions<AdviseAppSettings> settings)
        {
            _log = log;
            _settings = settings;
            _cache = memoryCache;
//            var fileStream = new FileStream(Path.Combine(hostingEnvironment.ContentRootPath, "wwwroot", "ui", "index.html"), FileMode.Open);
//            _cache.Set("index", new FileStreamResult(fileStream, "text/html"));
        }

        public IActionResult Index()
        {
            //return _cache.Get("index") as IActionResult;

            if (HttpContext.Request.Method == "POST")
                return StatusCode(405); // Reject posts with a 405 instead of the 404 that would be returned if the method was marked with [HttpGet]

            var debugBuild = false;
#if DEBUG
            debugBuild = true;
#endif


            var settings = _settings.Value;
            string customerName = Environment.GetEnvironmentVariable("CUSTOMER_NAME");

            return View(new GlobalSettings()
            {
                debugBuild = debugBuild,
                clientGlobals = new ClientGlobals()
                {
                    authProvider = settings.auth.provider,
                    authClientId = settings.auth.clientId,
                    authDomain = settings.auth.domain,
                    sentryDsn = settings.sentryIo.dsn,
                    sentryServerDsn = settings.sentryIo.serverDsn,
                    product = "Risk Solutions",
                    features = settings?.clientFeatures,
                    multiTenant = settings.multiTenant,
                    isOnPrem = Environment.GetEnvironmentVariable("ON_PREM_K8S") == "1",
                    customerName = string.IsNullOrEmpty(customerName) ? settings.product : customerName,
                    licenseExpireTime = settings.auth.license.expMilliseconds
                },
                settings = settings
            });
        }

        [HttpPost("internal/render")]
        public dynamic render([FromBody][Bind("component,props")] RenderPayload payload)
        {
            if (HttpContext.Request.Headers["x-forwarded-port"] == "81")
            {
                return ReactRenderService.renderComponentInternal(payload.component, payload.props);
            }

            return NotFound();
        }

    }
}
