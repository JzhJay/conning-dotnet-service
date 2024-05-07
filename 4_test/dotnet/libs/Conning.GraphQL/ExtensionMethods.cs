using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Security.Claims;
using System.Threading.Tasks;
using Conning.Db.Services;
using GraphQL;
using GraphQL.Types;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public static partial class ExtensionMethods
    {
        public static string GetSecureUserId(this IResolveFieldContext context, out ClaimsPrincipal user, bool throwIfNull = false)
        {
            user = null;

            /*
            if (context.UserContext is MessageHandlingContext)
            {
                var messageHandlingContext = context.UserContext.As<MessageHandlingContext>();

                user = messageHandlingContext.Get<ClaimsPrincipal>("user");
            }
            */
            if (context.User is ClaimsPrincipal)
            {
                user = context.User;
            }
            
            if (user != null && user.Claims.Any())
            {
                var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == OpenIDConnectSettings.IDENTITY_CLAIM);
                if (userIdClaim == null)
                {
                    throw new SecurityException(
                        "The JWT token specified is invalid as it does not include a 'sub' claim.");
                }

                return userIdClaim.Value;
            }

            if (throwIfNull)
            {
                throw new SecurityException("You must be authenticated to access this endpoint.");
            }

            return null;
        }

        public static List<T> ArgumentArrayValue<T>(this IResolveFieldContext context, string name)
        {
            if (context.Arguments.ContainsKey(name))
            {
                var r = context.GetArgument<IEnumerable<object>>(name);
                if (r != null)
                {
                    if (r is IEnumerable<object>)
                    {
                        return (r as IEnumerable<object>).Select(v => (T)v).ToList();
                    }
                    else
                    {
                        throw new Exception($"{name} is not an array type, is {r.GetType().Name}");
                    }
                }
            }

            return new List<T>();
        }

        public static T CoerceGraphQlValue<T>(this Dictionary<string, object> input, string name, T defaultValue = default(T))
        {
            if (input.ContainsKey(name))
            {
                var r = input[name];

                if (r is object[])
                {
                    throw new Exception($"{name} returned an object[].  Use CoerceGraphQlArrayValue() instead");
                }

                if (r != null)
                {
                    return (T) r;
                }
            }

            return defaultValue;
        }

        public static IEnumerable<T> CoerceGraphQlArrayValue<T>(this Dictionary<string, object> input, string name)
        {
            if (input.ContainsKey(name))
            {
                var r = input[name];
                if (r is IEnumerable<object>)
                {
                    return (r as IEnumerable<object>).Select(v => (T) v);
                }
                else
                {
                    throw new Exception($"{name} is not an array type, is {r.GetType().Name}");
                }
            }

            return new List<T>();
        }


        public static IGraphType InnerResolvedType(this FieldType field, out bool isNonNull, out bool isList, out bool isListItemNonNull)
        {
            var resolvedType = field.ResolvedType;
            isNonNull = false;
            if (resolvedType is NonNullGraphType)
            {
                isNonNull = true;
                resolvedType = (resolvedType as NonNullGraphType).ResolvedType;
            }

            isList = false;
            isListItemNonNull = false;
            if (resolvedType is ListGraphType)
            {
                isList = true;
                resolvedType = (resolvedType as ListGraphType).ResolvedType;

                if (resolvedType is NonNullGraphType)
                {
                    isListItemNonNull = true;
                    resolvedType = (resolvedType as NonNullGraphType).ResolvedType;
                }
            }

            return resolvedType;
        }

        public static IGraphType InnerResolvedType(this IFieldType field)
        {
            var resolvedType = field.ResolvedType;
            //isNonNull = false;
            if (resolvedType is NonNullGraphType)
            {
                //  isNonNull = true;
                resolvedType = (resolvedType as NonNullGraphType).ResolvedType;
            }

            //isList = false;
            //isListItemNonNull = false;
            if (resolvedType is ListGraphType)
            {
                //  isList = true;
                resolvedType = (resolvedType as ListGraphType).ResolvedType;

                if (resolvedType is NonNullGraphType)
                {
                    //    isListItemNonNull = true;
                    resolvedType = (resolvedType as NonNullGraphType).ResolvedType;
                }
            }

            return resolvedType;
        }

        public static IEnumerable<string> ValidOmdbDistinctFields(this ObjectGraphType graph)
        {
            return graph.Fields
                .Where(f =>
                {
                    // Todo - add uniqueness constraint check in mongo/metadata - return false if the field is guaranteed distinct per record (ie unique)
                    if (f.Name == "_id" || f.InnerResolvedType().Name == "Json")
                    {
                        return false;
                    }
                    else
                    {
                        var type = f.InnerResolvedType(out var isNonNull, out var isList, out var isListItemNonNull);
                        if (type is DateGraphType or DateTimeGraphType)
                        {
                            return false;
                        }

                        if (type is IdGraphType)
                        {
                            return false;
                        }

                        if (type is ObjectGraphType og)
                        {
                            return og.HasField("_id");
                        }
                    }

                    return true;
                })
                .OrderBy(f => f.Name)
                .Select(f => f.Name);
        }

        public static object TryConvertToObjectId(this string s)
        {
            if (ObjectId.TryParse(s, out var objectId))
            {
                return objectId;
            }

            return s;
        }

        public static FieldType Find(this IEnumerable<FieldType> fields, string name)
        {
            return fields.FirstOrDefault(f => f.Name == name);
        }

        public static bool IsJuliaApiUser(this ClaimsPrincipal user)
        {
            return user.IsInRole("julia:api:service");
        }

        public static int IndexOf<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate) {

            var index = 0;
            foreach (var item in source) {
                if (predicate.Invoke(item)) {
                    return index;
                }
                index++;
            }

            return -1;
        }

        public static void DelayedAddInstance<T>(this ObjectGraphType<T> graph, string instance)
        {
            Task.Run(async () =>
            {
                while (true)
                {
                    if (OmdbGraph.Instance != null)
                    {
                        var dbObject = OmdbGraph.Instance.ParentSchema.FindType("dbObject") as InterfaceGraphType;
                        if (dbObject != null)
                        {
                            graph.AddResolvedInterface(dbObject);
                            break;
                        }
                    }

                    await Task.Delay(100);
                }
            });
        }

        /// <summary>
        /// We require OMDB types be loaded before we can specify a graph which involves them.  Since the omdb schema is loaded dynamically at runtime (and is hot-swappable!) we need to lookup the
        /// omdb types later than we would when doing a straight injectable
        ///
        /// Use this function if you need to return OMDB schema types
        /// </summary>
        /// <param name="graph"></param>
        /// <param name="f"></param>
        /// <returns></returns>
        public static void AddFieldLazy<T>(this ObjectGraphType<T> graph, Func<OmdbGraph, FieldType> f)
        {
            var omdb = OmdbGraph.Instance;
            if (omdb != null && omdb.Loaded)
            {
                graph.AddField(f(omdb));
            }
            else
            {
                // Omdb isn't ready yet, wait until it is
                var t = new System.Timers.Timer();
                t.Elapsed += (o, c) =>
                {
                    if (OmdbGraph.Instance != null && OmdbGraph.Instance.Loaded)
                    {
                        t.AutoReset = false;
                        graph.AddField(f(omdb));
                    }
                };
                t.Interval = 50;
                t.Start();
            }
        }
        
        public static IMongoCollection<BsonDocument> GetCollectionWithSecondaryPref(this IMongoDatabase db, string collectionName)
        {
            return db.GetCollection<BsonDocument>(collectionName, new MongoCollectionSettings() { ReadPreference = ReadPreference.SecondaryPreferred });
        }
    }
}
