using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Conning.Db
{
    public static class ExtensionMethods
    {
        public static List<dynamic> ToDynamicList(this List<BsonDocument> value)
        {
            return value.Select(s => BsonSerializer.Deserialize<dynamic>(s)).ToList();
        }
        
        public static dynamic ToDynamic(this object value)
        {
            if (value is BsonDocument bson)
            {
                return BsonSerializer.Deserialize<dynamic>(bson);
            }
                       
            IDictionary<string, object> expando = new ExpandoObject();

            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(value.GetType()))
                expando.Add(property.Name, property.GetValue(value));

            return expando as ExpandoObject;
        }
        
        public static IFindFluent<TDocument, TDocument> FindSecure<TDocument>(
            this IMongoCollection<TDocument> collection,
            FilterDefinition<TDocument> filter,
            FindOptions options = null)
        {
            return collection.Find(filter, options);
        }

    }
}