using Conning.GraphQL.QueryTool;
using Microsoft.Extensions.DependencyInjection;

namespace Conning.GraphQL
{
    public static partial class ExtensionMethods
    {
        public static void registerQueryToolGraph(this IServiceCollection services)
        {
            services.AddSingleton<QueryToolMutationGraph>();
            services.AddSingleton<QuerySessionMutationGraph>();
            services.AddSingleton<StartQuerySessionResult>();
        }
    }
}