using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Conning.Db.Services;
using MongoDB.Driver;

namespace Conning.Kui.Web.Controllers
{
    [Route("api/karma")]
    public class KarmaController : Controller
    {
        private readonly IOptions<AdviseAppSettings> _settings;
        private readonly MongoDbService _mongo;

        public KarmaController(IOptions<AdviseAppSettings> settings, MongoDbService mongo)
        {
            _settings = settings;
            _mongo = mongo;
        }

        private AdviseAppSettings settings
        {
            get { return _settings.Value; }
        }
        
        [HttpDelete("database/{databaseName}")]
        public dynamic DeleteDatabase(string databaseName)
        {
            if (settings.karma)
            {
                _mongo.database.Client.DropDatabase(databaseName);
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }
    }
}