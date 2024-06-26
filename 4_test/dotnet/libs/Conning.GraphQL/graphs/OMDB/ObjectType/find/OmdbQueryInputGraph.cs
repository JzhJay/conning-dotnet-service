using System.Collections.Generic;
using System.Linq;
using Conning.Library.Utility;
using GraphQL.Types;

namespace Conning.GraphQL
{
    public class OmdbQueryInputGraph : InputObjectGraphType
    {
        public OmdbQueryInputGraph(ObjectGraphType omdbType)
        {
            Name = $"omdb_{omdbType.Name}_input";
            //Field<StringGraphType>("test");

            // These are equivelent to where clauses with multiple values (or'd together) for purposes of implementing the catalog drilldown
            omdbType.Fields.Where(f => !f.Metadata.ContainsKey("internal") && f.InnerResolvedType().Name != OmdbUnionGraphType.TypeName)
                .ForEach(f =>
                {
                    // Make no fields be required (ie unwrap 'non-null' graph types)
                    var resolved = f.ResolvedType;

                    if (resolved is NonNullGraphType)
                    {
                        resolved = (resolved as NonNullGraphType).ResolvedType;
                    }

                    if (resolved is ListGraphType)
                    {
                        resolved = (resolved as ListGraphType).ResolvedType;
                        if (resolved is NonNullGraphType)
                        {
                            resolved = (resolved as NonNullGraphType).ResolvedType;
                        }
                    }

                    if (resolved is IObjectGraphType)
                    {
                        resolved = new IdGraphType();
                    }

                    resolved = new ListGraphType(resolved);
                    var fieldType = new FieldType()
                    {
                        Description = f.Description,
                        Name = f.Name,
                        ResolvedType = resolved,
                        DefaultValue = f.DefaultValue,
                        DeprecationReason = f.DeprecationReason
                    };
                    f.CopyMetadataTo(fieldType);
                    
                    AddField(fieldType);                    
                });

//            omdbType.Fields.ForEach(f => AddField(f));            
//                new FieldType()
//                {
//                  Arguments  = f.Arguments,
//                  Description  = f.Description,
//                    Name = f.Name,
//                    ResolvedType = f.ResolvedType,
//                    Metadata = f.Metadata,
//                    Resolver = f.Resolver,
//                    Type = f.Type,
//                    DefaultValue = f.DefaultValue,
//                    DeprecationReason = f.DeprecationReason
//                }));            
        }
        
        /* TODO: suspect it's a not cirremt;y used function
        public IDictionary<string, string> ToDictionary()
        {
            var result = new Dictionary<string, string>();

            foreach (var f in Fields)
            {
                // var v = f.GetValue();
                var v = f.DefaultValue;
                if (v != null)
                {
                    // Need to handle array type or switch omdb.runQuery to use the resolved types instead of raw strings
                    result.Add(f.Name, v.ToString());
                }
            }

            return result;
        }*/
    }
}