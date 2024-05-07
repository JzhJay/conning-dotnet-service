using GraphQL.Types;
using GraphQLParser.AST;
using MongoDB.Bson;

namespace Conning.GraphQL
{
    internal class ObjectIdGraphType : ScalarGraphType
    {
        public ObjectIdGraphType()
        {
            Name = "ObjectId";
        }

        public override object Serialize(object value)
        {
            return value.ToString();
        }

        public override object ParseValue(object value)
        {
            if (value == null)
            {
                return null;
            }

            if (ObjectId.TryParse(value.ToString(), out var objectId))
            {
                return objectId;
            }

            return value;
        }

        public override object ParseLiteral(GraphQLValue value)
        {
            if (value is GraphQLNullValue)
            {
                return null;
            }
            
            if (value is GraphQLStringValue stringValue)
            {
                return ParseValue(stringValue.Value);
            }
            
            return ThrowLiteralConversionError(value);
        }
    }
}