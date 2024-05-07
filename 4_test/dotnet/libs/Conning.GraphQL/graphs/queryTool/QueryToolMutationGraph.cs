using System;
using System.Threading.Tasks;
using GraphQL.Types;

namespace Conning.GraphQL.QueryTool
{
    public class QueryToolMutationGraph : ObjectGraphType
    {
        public QueryToolMutationGraph()
        {
            Field<StartQuerySessionResult>()
                .Name("startQuerySession")
                .Argument<NonNullGraphType<ListGraphType<NonNullGraphType<StringGraphType>>>>("simulationIds", "The simulations being queried")
                .ResolveAsync(ctx => null);
            
            Field<QuerySessionMutationGraph>()
                .Name("querySession")
                .Argument<StringGraphType>("id", "The query session ID")
                .ResolveAsync(ctx => null);
        }
    }

    public class QuerySessionMutationGraph : ObjectGraphType
    {
        public QuerySessionMutationGraph()
        {
            Field<StringGraphType>().Name("selectAxisValue").Resolve(ctx => "tbd");
            Field<StringGraphType>().Name("runQuery").Resolve(ctx => "tbd");
        }
    }

    public class StartQuerySessionResult : ObjectGraphType
    {
        public StartQuerySessionResult()
        {
            Field<StringGraphType>().Name("tbd").Resolve(ctx => "tbd");
        }
    }
}