using System.Collections.Generic;
using GraphQL.Utilities.Federation;
using GraphQLParser.AST;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace Conning.GraphQL
{
    public class JsonGraphValueTypeMapper : ICustomBsonTypeMapper
    {
        public JsonGraphValueTypeMapper()
        {
        }

        public bool TryMapToBsonValue(object value, out BsonValue bsonValue)
        {
            if (value is Dictionary<string, object>)
            {
                var jsonString = JsonConvert.SerializeObject(value);

                bsonValue = BsonDocument.Parse(jsonString);
                return true;
            }
            bsonValue = null;
            return false;
        }
    }
    
    public class JsonGraphType : AnyScalarGraphType
    {
        public JsonGraphType()
        {
            Name = "Json";
        }

        public override object? ParseLiteral(GraphQLValue value) => value switch
        {
            GraphQLObjectValue v => base.ParseLiteral(v),
            GraphQLListValue v => base.ParseLiteral(v),
            GraphQLNullValue _ => null,
            _ => ThrowLiteralConversionError(value)
        };
    }
}