using System.Collections.Generic;
using System.Dynamic;
using Conning.Db.Services;
using GraphQL.Resolvers;
using GraphQL.Types;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class BillingJob
    {
        public List<BillingBaseRow> details { get; }
        public BillingBaseRow total { get; protected set; }
        
        protected BaseUserService _userService { get; }
        protected OmdbService _omdb { get; }
        
        protected IMongoDatabase _db { get; }
        
        public BillingEntry billingEntry { get; }
        
        public BillingJob(BaseUserService userService, OmdbService omdb, IMongoDatabase db, BillingEntry billingEntry)
        {
            _userService = userService;
            _omdb = omdb;
            _db = db;
            this.billingEntry = billingEntry;
            details = billingEntry.details;
            total = billingEntry.total;
        }

        public List<BillingBaseRow> getAllRows()
        {
            var result = new List<BillingBaseRow>();
            result.Add(total);
            result.AddRange(details);
            return result;
        }

        public dynamic fetchSource(BillingEntry entry)
        {
            dynamic obj = new ExpandoObject();
            obj._id = entry.sourceId;
            obj.name = entry.name;
            obj.gridName = entry.gridName;
            obj.createdBy = entry.createdBy;
            return obj;
        }
        
    }

    public class BillingJobGraph : ObjectGraphType<BillingJob>
    {
        public BillingJobGraph(OmdbService omdb)
        {
            Field<ListGraphType<BillingBaseRowGraph>>()
                .Name("details");
            Field<BillingBaseRowGraph>()
                .Name("total");

            this.AddFieldLazy(omdbGraph => new FieldType
            {
                Name = "additionalInformation",
                ResolvedType = omdbGraph.ObjectTypes["BillingAdditionalInformation"],
                Resolver = new FuncFieldResolver<BillingJob, object>(ctx =>
                {
                    var result = ctx.Source.fetchSource(ctx.Source.billingEntry);
                    result.__typename = "BillingAdditionalInformation"; // hack: this field is used by someone to convert dynamic data to ObjectGraphType. Simulation is a recognized keyword but DeletedSimulation is not.
                    return result;
                })
            });
        }
    }


}
