using System.Collections.Generic;
using System.Threading.Tasks;
using Conning.Db.Services;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Conning.GraphQL
{
    public static partial class ExtensionMethods
    {
        public static void registerUserTypes(this IServiceCollection services)
        {
            services.AddSingleton<UserQuery>();
            services.AddSingleton<UserQueryResultGraph>();
            services.AddSingleton<ConningUserGraph>();
        }
    }
    
    public class UserQuery : ObjectGraphType
    {
        private readonly ILogger<UserQuery> _log;
        private readonly BaseUserService _userService;
        private IDataLoaderContextAccessor _dataLoader;

        public UserQuery(ILogger<UserQuery> log,IDataLoaderContextAccessor dataLoader, BaseUserService userService)
        {
            _log = log;
            _dataLoader = dataLoader;
            _userService = userService;
            
             AddField(
                new FieldType()
                {        
                    Name="find",
                    Type = typeof(UserQueryResultGraph),
                    Arguments = new QueryArguments(
                        new QueryArgument<IdGraphType>()
                        {
                            Name = "id",
                            Description = "The User's ID"
                        },
                        new QueryArgument<IntGraphType>()
                        {
                            Name = "page",
                            DefaultValue = 0,
                            Description = "The number of elements to skip"
                        },
                        new QueryArgument<IntGraphType>()
                        {
                            Name = "perPage",
                            DefaultValue = 50,
                            Description = "The maximum number of elements to retrieve"
                        },                       
                        new QueryArgument<StringGraphType>()
                        {
                            Name = "sortBy",
                            Description = "Column to sort by",
                            DefaultValue = null
                        },
                        new QueryArgument<StringGraphType>()
                        {
                            Name = "sortOrder",
                            DefaultValue = "1",
                            Description = "asc or desc"
                        }
//                        new QueryArgument(_searchInputGraph)
//                        {
//                            Name = "where",
//                            Description = "{field1: value1, field2: value2 }",
//                            DefaultValue = null
//                        }
                    ),

                    Resolver = new FuncFieldResolver<UserQueryResult>(async ctx =>
                    {
                        var page = ctx.GetArgument<int>("page", default(int));
                        var perPage = ctx.GetArgument<int>("perPage", default(int));
                        var sortBy = ctx.GetArgument<string>("sortBy", default(string));
                        var sortOrder = ctx.GetArgument<string>("sortOrder", default(string));
                       
                        var userId = ctx.GetArgument<string>("id");
                        if (!string.IsNullOrEmpty(userId))
                        {
                            var batchLoader = _dataLoader.Context.GetOrAddBatchLoader<string, ConningUser>(BaseUserService.UserBatchLoader, _userService.GetUsers);
                            var user = await batchLoader.LoadAsync(userId).GetResultAsync();
                            
                            return new UserQueryResult()
                            {
                                users = user != null ? new List<ConningUser>() { user } : null                                
                            };
                        }
                        else
                        {
                            var allUsers = await _userService.GetAllUsers(page, perPage, true, (string) sortBy);
                            
                            return new UserQueryResult()
                            {
                                users = allUsers,
                                page = page,
                                perPage = perPage,
                                sortBy = (string) sortBy,
                                sortOrder = sortOrder
                            };
                        }
                    })
                });
            
            AddField(
                new FieldType()
                {        
                    Name="get",
                    Type = typeof(ConningUserGraph),
                    Arguments = new QueryArguments(
                        new QueryArgument<NonNullGraphType<IdGraphType>>()
                        {
                            Name = "id",
                            Description = "The User's ID"
                        }                      
                    ),
                    Resolver = new FuncFieldResolver<ConningUser>(async ctx =>
                    {
                        var userId = ctx.GetArgument<string>("id", default(string));

                        var batchLoader = _dataLoader.Context.GetOrAddBatchLoader<string, ConningUser>(BaseUserService.UserBatchLoader, _userService.GetUsers);
                        var user = await batchLoader.LoadAsync(userId).GetResultAsync();

                        return user;                    
                    })
                });   
        }
    }

    public class ConningUserGraph : ObjectGraphType<ConningUser>
    {
        public ConningUserGraph()
        {
            Name = "ConningUser";
            Field(x => x.Sub).Name("_id");
            Field(x => x.Email, nullable: true).Name("email");
            Field(x => x.EmailVerified, nullable: true).Name("emailVerified");
            Field(x => x.PhoneNumber, nullable: true).Name("phoneNumber").Resolve(ctx => ctx.Source.PhoneNumber);
            Field(x => x.PhoneVerified, nullable: true).Name("phoneVerified");
            Field(x => x.FullName, nullable: true).Name("fullName");
            Field(x => x.LastLogin, nullable: true).Name("lastLogin");
            Field(x => x.CreatedAt, nullable: true).Name("createdAt");
        }
    }
    
    public class UserQueryResult
    {
        public List<ConningUser> users { get; set; }
        public int page { get; set; }
        public int perPage { get; set; }
        public string sortBy { get; set; }
        public string sortOrder { get; set; }                
    }
    
    public class UserQueryResultGraph : ObjectGraphType<UserQueryResult>
    {
        public UserQueryResultGraph(BaseUserService userService)
        {
            //Name = "UserQueryResult";
            Field(x => x.page, nullable: true);
            Field(x => x.perPage, nullable: true);
            Field(x => x.sortBy, nullable: true);
            Field(x => x.sortOrder, nullable: true);
            Field<ListGraphType<ConningUserGraph>>().Name("users");            
        }
    }
}