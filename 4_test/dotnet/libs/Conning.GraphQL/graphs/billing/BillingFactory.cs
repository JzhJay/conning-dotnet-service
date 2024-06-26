using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Auth0.ManagementApi.Models;
using Conning.Db.Services;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public abstract class BillingFactory
    {
        public OmdbService _omdb { get; }
        
        public IMongoDatabase _db { get; }
        
        public BaseUserService _userService { get; }
        public DateTime startDateTime { get; }
        public DateTime endDateTime { get; }
        public Dictionary<string, object> rates{ get; }
        public List<string> userIds { get; }
        public Dictionary<string, ConningUser> _users { get; }
        
        public BillingFactory(BaseUserService userService, OmdbService omdb, IMongoDatabase db, DateTime startDateFromInput, DateTime endDateFromInput,
            List<string> usersFromInput, Dictionary<string, object> rates, Dictionary<string, ConningUser> users)
        {
            _omdb = omdb;
            _db = db;
            _userService = userService;
            startDateTime = startDateFromInput;
            endDateTime = endDateFromInput;
            userIds = usersFromInput;
            _users = users;
            this.rates = rates;
        }

        public abstract Task createBillingEntries(List<BillingEntry> billingEntries);
    }
}
