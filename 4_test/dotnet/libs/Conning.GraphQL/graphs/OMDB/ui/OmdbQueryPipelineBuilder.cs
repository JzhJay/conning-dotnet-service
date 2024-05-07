using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using GraphQL.Types;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class OmdbQueryPipelineBuilder
    {
        private readonly IMongoCollection<dynamic> _collection;

        private readonly ObjectGraphType _objectType;

        private readonly FilterDefinitionBuilder<dynamic> _filterBuilder = Builders<dynamic>.Filter;

        private string _path;

        private BsonRegularExpression _searchTextRegex;

        private Dictionary<string, object> _whereFilters;

        public OmdbQueryPipelineBuilder(IMongoCollection<dynamic> collection, ObjectGraphType objectType)
        {
            _collection = collection;
            _objectType = objectType;
        }

        public void SetSearchText(string searchText)
        {
            _searchTextRegex =
                string.IsNullOrEmpty(searchText) ? null : new BsonRegularExpression(Regex.Escape($"{searchText}"), "i");
        }

        public void SetWhereFilters(Dictionary<string, object> whereFilters)
        {
            _whereFilters = whereFilters;
        }

        public void SetPath(string path)
        {
            _path = path;
        }

        public List<BsonDocument> GeneratePipelines(bool includeUserTagWhereFilter = true, bool includeWhereFilter = true)
        {
            var nameFilter = ProcessPath();
            var searchTextFilter = ProcessSearchText();
            var pipeline = new List<BsonDocument>();

            if (nameFilter != _filterBuilder.Empty)
                pipeline.Add(new BsonDocument(
                    "$match",
                    nameFilter.Render(_collection.DocumentSerializer, _collection.Settings.SerializerRegistry)
                ));

            if (includeWhereFilter)
            {
                var whereFilter = ProcessWhere();
                if (whereFilter != _filterBuilder.Empty)
                    pipeline.Add(new BsonDocument(
                        "$match",
                        whereFilter.Render(_collection.DocumentSerializer, _collection.Settings.SerializerRegistry)
                    ));
            }

            if (includeUserTagWhereFilter)
            {
                var userTagDistinctFilter = ProcesUserTagInWhere();
                if (userTagDistinctFilter != _filterBuilder.Empty)
                    pipeline.Add(new BsonDocument(
                        "$match",
                        userTagDistinctFilter.Render(_collection.DocumentSerializer,
                            _collection.Settings.SerializerRegistry)
                    ));
            }
            
            if (searchTextFilter != _filterBuilder.Empty)
                pipeline.AddRange(new[]
                {
	                new BsonDocument(
		                "$addFields",
		                new BsonDocument(
			                "_idString",
			                new BsonDocument(
				                "$toString",
				                "$_id"
			                )
		                )
	                ),
	                new BsonDocument(
                        "$lookup",
                        new BsonDocument
                        {
                            { "from", "UserTagValue" },
                            { "localField", "userTagValues" },
                            { "foreignField", "_id" },
                            { "as", "userTagValuesResolved" }
                        }
                    ),
                    new BsonDocument(
                        "$addFields",
                        new BsonDocument(
                            "userTagValuesResolved",
                            new BsonDocument(
                                "$map",
                                new BsonDocument
                                {
                                    { "input", "$userTagValuesResolved" },
                                    { "as", "el" },
                                    { "in", "$$el.value" }
                                }
                            )
                        )
                    ),
                    new BsonDocument(
                        "$match",
                        searchTextFilter.Render(_collection.DocumentSerializer,
                            _collection.Settings.SerializerRegistry)
                    )
                });

            return pipeline;
        }

        private FilterDefinition<dynamic> ProcesUserTagInWhere()
        {
            var userTagFilter = _filterBuilder.Empty;
            if (_whereFilters != null && _whereFilters.ContainsKey("userTagValues"))
            {
                var userTagValueGroup = _whereFilters["userTagValues"] as Dictionary<dynamic, IEnumerable<object>>;
                if (userTagValueGroup != null)
                    foreach (var userTagValues in userTagValueGroup.Values)
                        if (userTagValues != null && userTagValues.Any())
                            userTagFilter &= _filterBuilder.AnyIn("userTagValues", userTagValues);
            }

            return userTagFilter;
        }

        public FilterDefinition<dynamic> ProcessWhere()
        {
            var distinctFilter = _filterBuilder.Empty;
            distinctFilter = CreateLinkObjectFilter(distinctFilter);
            if (_whereFilters != null)
            {
                var qqlType = OmdbGraph.Instance.ObjectTypes[_objectType.Name];
                foreach (var whereTag in _whereFilters.Keys)
                {
                    if (whereTag == "userTagValues") continue;
                    distinctFilter = CreateNotTagFieldFilter(distinctFilter, whereTag, qqlType);
                }
            }

            return distinctFilter;
        }

        public FilterDefinition<dynamic> ProcessUserTagInWhereForTagDistinctValues(string userTagId)
        {
            var userTagFilter = _filterBuilder.Empty;
            if (_whereFilters != null && _whereFilters.ContainsKey("userTagValues"))
            {
                var userTagValueGroup = _whereFilters["userTagValues"] as Dictionary<dynamic, IEnumerable<object>>;
                if (userTagValueGroup != null && !userTagValueGroup.ContainsKey(userTagId))
                    foreach (var userTagValues in userTagValueGroup.Values)
                        if (userTagValues != null && userTagValues.Any())
                            userTagFilter &= _filterBuilder.AnyIn("userTagValues", userTagValues);
            }

            return userTagFilter;
        }
        
        public FilterDefinition<dynamic> ProcessWhereForTagDistinctValues(string fieldTagName)
        {
            var distinctFilter = _filterBuilder.Empty;
            if (_whereFilters != null)
            {
                var qqlType = OmdbGraph.Instance.ObjectTypes[_objectType.Name];
                foreach (var whereTag in _whereFilters.Keys)
                {
                    if (whereTag == fieldTagName) continue;

                    distinctFilter = CreateNotTagFieldFilter(distinctFilter, whereTag, qqlType);
                }
            }

            return distinctFilter;
        }

        private FilterDefinition<dynamic> CreateLinkObjectFilter(FilterDefinition<dynamic> distinctFilter)
        {
            if (_whereFilters != null && _whereFilters.ContainsKey("isLink") && (bool) _whereFilters["isLink"])
            {
                // no restriction if isLink = true
            }
            else
            {
                distinctFilter &= Builders<dynamic>.Filter.Or(
                    Builders<dynamic>.Filter.Exists("isLink", false),
                    Builders<dynamic>.Filter.Eq("isLink", false));
            }

            return distinctFilter;
        }
        
        private FilterDefinition<dynamic> CreateNotTagFieldFilter(FilterDefinition<dynamic> distinctFilter,
            string fieldName, ObjectGraphType qqlType)
        {
            var relatedSimulationFilter = OmdbService.TryConvertRelatedSimulationFilter<dynamic>(fieldName, _whereFilters[fieldName], qqlType);
            if (relatedSimulationFilter != null)
            {
                distinctFilter = _filterBuilder.And(distinctFilter ,relatedSimulationFilter);
                return distinctFilter;
            };
            
            IEnumerable<object> values;
            if (_whereFilters[fieldName] is string)
            {
                var stringValues = _whereFilters[fieldName].ToString().Split(",");
                values = stringValues.Select(v => v != null ? OmdbService.ConvertTagValue(null, v) : null);
            }
            else
            {
                values = _whereFilters[fieldName] as IEnumerable<object>;
            }

            if (values != null && values.Any())
                distinctFilter &= _filterBuilder.Or(values.Select(v =>
                    v == null
                        ? _filterBuilder.Exists(fieldName, false)
                        : _filterBuilder.Eq(fieldName, v)));

            return distinctFilter;
        }

        private FilterDefinition<dynamic> ProcessSearchText()
        {
            var searchTextFilter = _filterBuilder.Empty;
            if (_searchTextRegex != null)
            {
                // Search all string fields
                var regexSearchTags = _objectType.Fields.Where(f =>
                {
                    var innerType = f.InnerResolvedType();

                    return innerType is StringGraphType;
                }).Select(f => f.Name);

                // for search id
                regexSearchTags = regexSearchTags.Append("_idString");

                var first = true;
                FilterDefinition<dynamic> regexFilter = null;

                foreach (var tag in regexSearchTags)
                {
                    var regexClause = _filterBuilder.Regex(tag, _searchTextRegex);

                    if (first)
                    {
                        regexFilter = regexClause;
                        first = false;
                    }
                    else
                    {
                        regexFilter = _filterBuilder.Or(regexFilter, regexClause);
                    }
                }

                regexFilter = _filterBuilder.Or(regexFilter,
                    _filterBuilder.Regex("userTagValuesResolved", _searchTextRegex));
                searchTextFilter = _filterBuilder.And(searchTextFilter, regexFilter);

            }

            return searchTextFilter;
        }

        private FilterDefinition<dynamic> ProcessPath()
        {
            var nameFilter = _filterBuilder.Empty;

            if (!string.IsNullOrEmpty(_path))
            {
                var pathRegex = new BsonRegularExpression($"^{_path}/");
                var regexClause = _filterBuilder.Regex("name", pathRegex);
                nameFilter = _filterBuilder.And(nameFilter, regexClause);
            }

            return nameFilter;
        }
    }
}