using GraphQL.Types;
using MongoDB.Bson;

namespace Conning.GraphQL
{
    /// <summary>
    /// The ID scalar graph type represents a string identifier, not intended to be human-readable. It is one of the five built-in scalars.
    /// When expected as an input type, any string or integer input value will be accepted as an ID.
    /// By default <see cref="SchemaTypes"/> maps all <see cref="Guid"/> .NET values to this scalar graph type.
    /// </summary>
    public class CustomIdGraphType : IdGraphType
    {
        public override object? ParseValue(object? value)
        {
            if (value is ObjectId) {
                return value;
            }

            return base.ParseValue(value);
        }
    }
}
