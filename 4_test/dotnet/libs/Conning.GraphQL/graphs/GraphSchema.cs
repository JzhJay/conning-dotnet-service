using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Conning.Common;
using Conning.Db.Services;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Conning.GraphQL
{
    public class GraphSchema : Schema
    {
        private readonly OmdbGraph _omdb;
        public MongoDbService _mongo { get; private set; }
        public IServiceProvider _serviceProvider { get; private set; }
        public ILogger<GraphSchema> _log { get; private set; }
        public static GraphSchema Instance { get; private set; }

        private Lazy<List<IGraphType>> _typesLooksUp;
        
        public GraphSchema(IServiceProvider serviceProvider, IOptions<AdviseAppSettings> settings,
            ILogger<GraphSchema> log, OmdbGraph omdb, MongoDbService mongoService): base(serviceProvider)
        {
            Instance = this;
            _omdb = omdb;
            _serviceProvider = serviceProvider;
            _log = log;
            _mongo = mongoService;
            
            InitializeInternal();
        }

        internal void InitializeInternal()
        {
            try
            {
                _log.LogInformation($"Initializing {GetType().Name}");
                Query = (GraphQuery)_serviceProvider.GetRequiredService(typeof(GraphQuery)) ??
                        throw new InvalidOperationException();
                Mutation = (GraphMutation)_serviceProvider.GetRequiredService(typeof(GraphMutation)) ??
                           throw new InvalidOperationException();
                Subscription = (GraphSubscriptions)_serviceProvider.GetRequiredService(typeof(GraphSubscriptions)) ??
                               throw new InvalidOperationException();
                
                _typesLooksUp = new Lazy<List<IGraphType>>(CreateTypesLookup);
                
                // Our Version of GraphQL is missing method to convert Int64 to Double
                // https://github.com/graphql-dotnet/graphql-dotnet/issues/840
                ValueConverter.Register(
                    typeof(long),
                    typeof(double),
                    value => Convert.ToDouble((long)value, NumberFormatInfo.InvariantInfo));
                
                this.RegisterType(new CustomIdGraphType());  // replace original IdGraphType for MongoDb's ObjectId field
                this.RegisterType(new CustomDateTimeGraphType()); // replace original DateTimeGraphType for backward compatibility
                 
                _omdb.RegisterOmdbSchema(this, Query, Mutation, Subscription);
            }
            catch (Exception e)
            {
                _log.LogError(e.ToString());
            }
        }
        
        public void ResetTypesLookup()
        {
            _typesLooksUp = new Lazy<List<IGraphType>>(CreateTypesLookup);
        }
        
        public IGraphType FindType(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentOutOfRangeException(nameof(name), "A type name is required to lookup.");
    
            // return _lookup.Value[name];
            return _typesLooksUp.Value.First(type => type.Name == name);
        }
        
        private List<IGraphType> CreateTypesLookup()
        {
            var allTypes = AllTypes.Where(x => x != null)
                .ToList();
                
            allTypes.Add(Query);    
            allTypes.Add(Mutation);    
            allTypes.Add(Subscription);

            return allTypes;
        }

        public void UnregisterType(IGraphType type)
        {
            this._typesLooksUp.Value.Remove(type);
        }
        
        public static void RegisterInjectableTypes(IServiceCollection services)
        {
            // https://github.com/graphql-dotnet/graphql-dotnet/blob/master/docs/src/dataloader.md
            services.AddSingleton<IDataLoaderContextAccessor, DataLoaderContextAccessor>();
            services.AddSingleton<DataLoaderDocumentListener>();
            services.AddSingleton<DataLoaderContext>();
//            var accessor = new DataLoaderContextAccessor();
//            accessor.Context = new DataLoaderContext();
//            services.AddSingleton<IDataLoaderContextAccessor>(accessor);
//
            services.AddSingleton<IDesktopNotificationQueue, DesktopNotificationQueue>();
            services.AddSingleton<GraphQuery>();
            services.AddSingleton<GraphMutation>();
            services.AddSingleton<GraphSubscriptions>();
            services.AddSingleton<UserQuery>();
            services.AddSingleton<JsonGraphType>();
            services.AddSingleton<ObjectIdGraphType>();
            services.AddSingleton<ConfigGraph>();
            services.registerUserTypes();
            services.registerOmdbTypes();
            services.registerNotificationTypes();
            services.registerQueryToolGraph();
            services.registerBillingGraphTypes();
        }
    }
}
