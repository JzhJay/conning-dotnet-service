using System;
using System.Threading.Tasks;
using Conning.Db.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Conning.Kui.Web.Controllers
{

    [Route("api/[controller]")]
    public class LicenseController : Controller
    {
        public LicenseController(ILogger<LicenseController> log, IOptions<AdviseAppSettings> settings, BaseUserService userService)
        {
            _log = log;
            _settings = settings;
            _userService = userService;
        }

        private readonly ILogger<LicenseController> _log;
        private readonly IOptions<AdviseAppSettings> _settings;
        private readonly BaseUserService _userService;

        [HttpGet]
        public async Task<License> GetLicense()
        {
            try
            {
                return await _userService.GetLicense();
            }
            catch (Exception e)
            {
                this._log.LogError($"Get license fails: {e.Message} {e.StackTrace}");
                throw e;
            }
        }
        
        [HttpPost("update")]
        public async Task<License> LicenseUpdate()
        {
            try
            {
                return await _userService.GetLicense(true);
            }
            catch (Exception e)
            {
                this._log.LogError($"Refresh license fails: {e.Message} {e.StackTrace}");
                throw e;
            }
        }
    }
}
