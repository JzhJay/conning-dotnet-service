using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Types;

namespace Conning.GraphQL
{
    public class OmdbFieldBinding
    {
        public FieldType Field { get; set; }
        public ObjectGraphType Type { get; set; }        
    }

    public class OmdbTagGraph : ObjectGraphType<OmdbFieldBinding>
    {
        
        public OmdbTagGraph(OmdbService omdb)
        {
            Name = "omdb_tag";

            Field<StringGraphType>()
                .Name("name")
                .Resolve(ctx => ctx.Source.Field.Name);

            Field<StringGraphType>()
                .Name("description")
                .Resolve(ctx => ctx.Source.Field.Description);

            Field<StringGraphType>()
                .Name("defaultValue")
                .Resolve(ctx => ctx.Source.Field.DefaultValue?.ToString());

            Field<BooleanGraphType>()
                .Name("required")
                .Resolve(ctx => ctx.Source.Field.ResolvedType is NonNullGraphType);

            Field<BooleanGraphType>()
                .Name("multiple")
                .Resolve(ctx => ctx.Source.Field.ResolvedType is ListGraphType
                                || (ctx.Source.Field.ResolvedType is NonNullGraphType
                                    && (ctx.Source.Field.ResolvedType as NonNullGraphType).ResolvedType is ListGraphType));

            Field<StringGraphType>()
                .Name("type")
                .Resolve(ctx => ctx.Source.Field.InnerResolvedType().Name);

            Field<BooleanGraphType>()
                .Name("reserved")
                .Resolve(ctx => !ctx.Source.Field.Metadata.ContainsKey("UserTag"));

            // How should this field be displayed in cards / tables headers?
            Field<StringGraphType>()
                .Name("label")
                .Resolve(ctx =>
                {
                    //await omdb.BatchLoadOmdbUi(ctx.)
                    return ctx.Source.Field.Name;
                });


            Field<TagUiGraph>()
                .Name("ui")
                .Resolve(ctx => ctx.Source);
//            
//            var uiField = new TagUiGraph(gqlType, omdb);
//
//            AddField(
//                new FieldType()
//                {
//                    Name = "ui",
//                    ResolvedType = uiField,
//                    Resolver = new FuncFieldResolver<object>(ctx => uiField)
//                });

            // Wrap text
            // classname


            //Field<BooleanGraphType>()
            //.Name("visible")
            //.ResolveAsync(async ctx => {
            //omdb    
            //return true;
            //));
        }
    }

    public class TagUiGraph : ObjectGraphType<OmdbFieldBinding>
    {
        public TagUiGraph(OmdbService omdb)
        {
            Field<TagUiGraph_Catalog>()
                .Name("catalog")
                .ResolveAsync(async ctx => { return await _BatchLoadSection(ctx); });
                        
            Field<TagUiGraph_Table>()
                .Name("table")
                .ResolveAsync(async ctx => { return await _BatchLoadSection(ctx); });
            
//            Field<TagUiGraph_Catalog>()
//                .Name("card")
//                .ResolveAsync(async ctx => { return await _BatchLoadSection(ctx); });
        }

        private async Task<object> _BatchLoadSection(IResolveFieldContext<OmdbFieldBinding> ctx)
        {
            var batch = OmdbGraph.Instance.BatchDataLoaders[ctx.Source.Type.Name];
            var catalogUi = await batch.LoadUiSection(ctx.FieldAst.Name.StringValue).GetResultAsync();
            return new TagUiGraphUiBinding()
            {
                Type = ctx.Source.Type,
                Field = ctx.Source.Field,
                UI = catalogUi
            };
        }
    }
   
    public class TagUiGraphUiBinding : OmdbFieldBinding
    {
        public IDictionary<string, object> UI { get; set; }
    }
    
    public class TagUiGraph_Catalog : ObjectGraphType<TagUiGraphUiBinding>
    {     
        public TagUiGraph_Catalog()
        {
            Field<IntGraphType>()
                .Name("index")
                .Resolve(ctx =>
                {
                    var ui = ctx.Source.UI;
                    if (ui != null)
                    {
                        if (ui.TryGetValue("tags", out var tagsRaw))
                        {
                            if (tagsRaw is IEnumerable<object> tags)
                            {
                                return Array.IndexOf(tags.ToArray(), ctx.Source.Field.Name);                                
                            }
                        }
                    }

                    return null;
                });
        }   
    }
    
    public class TagUiGraph_Table : ObjectGraphType<TagUiGraphUiBinding>
    {      
        public TagUiGraph_Table()
        {
            Field<IntGraphType>()
                .Name("index")
                .Resolve(ctx =>
                {
                    var ui = ctx.Source.UI;
                    if (ui != null)
                    {
                        if (ui.TryGetValue("columns", out var columnsRaw))
                        {
                            if (columnsRaw is IEnumerable<object> columns)
                            {
                                return columns.IndexOf((dynamic c) => c.name == ctx.Source.Field.Name);                                
                            }
                        }

                        if (ui.TryGetValue("tags", out var tagsRaw))
                        {
                            if (tagsRaw is IEnumerable<object> tags)
                            {
                                return Array.IndexOf(tags.ToArray(), ctx.Source.Field.Name);                                
                            }
                        }
                    }

                    return null;
                });
            
            Field<JsonGraphType>()
                .Name("props")
                .Resolve(ctx =>
                {
                    var ui = ctx.Source.UI;
                    if (ui != null)
                    {
                        if (ui.TryGetValue("columns", out var columnsRaw))
                        {
                            if (columnsRaw is IEnumerable<object> columns)
                            {
                                var result = columns.FirstOrDefault((dynamic c) => c.name == ctx.Source.Field.Name);
                                return result;
                            }
                        }                       
                    }

                    return null;
                });
        }   
    }

}