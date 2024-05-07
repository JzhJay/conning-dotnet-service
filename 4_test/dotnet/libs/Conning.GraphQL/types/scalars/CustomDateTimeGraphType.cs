using System;
using System.Globalization;
using GraphQL.Types;
using MongoDB.Bson;

namespace Conning.GraphQL
{
    /// <summary>
    /// The DateTime scalar graph type represents a date and time in accordance with the ISO-8601 standard.
    /// By default <see cref="SchemaTypes"/> maps all <see cref="DateTime"/> .NET values to this scalar graph type.
    /// </summary>
    public class CustomDateTimeGraphType : DateTimeGraphType
    {
        public CustomDateTimeGraphType()
        {
            Name = "DateTime";
            Description =
                "The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps " +
                "to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.";
        }
        
        public override object? Serialize(object? value) => value switch
        {
            // ISO-8601 format
            // Note that the "O" format is similar but always prints the fractional parts
            // of the second, which is not required by ISO-8601
            DateTime d => d.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK", DateTimeFormatInfo.InvariantInfo), // ISO-8601 format (without unnecessary decimal places, allowed by ISO-8601)
            string s => DateTime.TryParseExact(s, "yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK", DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var date) ? s : ThrowSerializationError(value),
            null => null,
            _ => ThrowSerializationError(value)
        };
    }
}
