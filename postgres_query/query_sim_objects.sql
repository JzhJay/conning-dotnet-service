CREATE VIEW simulationUserTagValues AS 
SELECT 
	jsonb_array_elements_text(coalesce((_jsonb->>'userTagValues')::jsonb, '[null]')) AS userTagValues,
	_jsonb
FROM ferretdb.simulation_4e6c5d36;

CREATE VIEW lookupResult AS
SELECT 
	_jsonb->>'_id' AS _id,
	_jsonb->>'scenarios' AS scenarios,
	(_jsonb->>'modules')::jsonb AS modules,
	(_jsonb->>'jobsIds')::jsonb AS jobsIds,
	_jsonb->>'createdBy' AS createdBy,
	_jsonb->>'elements' AS elements,
	(_jsonb->>'axes')::jsonb AS axes,
	_jsonb->>'gridName' AS gridName,
	(_jsonb->>'periods')::jsonb AS periods,
	_jsonb->>'size' AS size,
	(_jsonb->>'economies')::jsonb AS economies,
	_jsonb->>'path' AS path,
	_jsonb->>'modifiedTime' AS modifiedTime,
	_jsonb->>'name' AS name,
	_jsonb->>'variables' AS variables,
	_jsonb->>'createdTime' AS createdTime,
	_jsonb->>'deletedTime' AS deletedTime,
	_jsonb->>'status' AS status,
	_jsonb->>'archived' AS archived,
	(_jsonb->>'billingInformation')::jsonb AS billingInformation,
	(_jsonb->>'frequencies')::jsonb AS frequencies,
	_jsonb->>'modifiedBy' AS modifiedBy,
	_jsonb->>'version' AS version,
	(_jsonb->>'userTagValues')::jsonb AS userTagValues,
	'Simulation' AS __typename,
	_jsonb->>'_id' AS _idString,
	(
		SELECT jsonb_agg(_jsonb)
		FROM ferretdb.usertagvalue_eb2a1c13
		WHERE _jsonb->>'_id' IN (simulationUserTagValues.userTagValues)
	) AS userTagValuesResolved
FROM simulationUserTagValues
WHERE NOT EXISTS 
(
  SELECT 1
  FROM jsonb_each(_jsonb)
  WHERE key='isLink'
)
OR _jsonb->>'_id'='false';

CREATE VIEW mergeLookup AS 
SELECT 
	CASE
		WHEN ARRAY_LENGTH(string_to_array(name,'/'),1) > 1 THEN split_part(name,'/',1)
		ELSE _id
	END AS _id,
	createdtime AS createdTime,
	modifiedtime AS modifiedTime,
	jsonb_build_object('_id',_id,
					'scenarios',scenarios,
					'modules',modules,
					'jobsIds',jobsids,
					'createdBy',createdby,
					'elements',elements,
					'axes',axes,
					'gridName',gridname,
					'periods',periods,
					'size',size,
					'economies',economies,
					'path',path,
					'modifiedTime',modifiedtime,
					'name',name,
					'variables',variables,
					'createdTime',createdtime,
					'deletedTime',deletedtime,
					'status',status,
					'archived',archived,
					'billingInformation',billinginformation,
					'frequencies',frequencies,
					'modifiedBy',modifiedby,
					'version',version,
					'userTagValues',usertagvalues,
					'__typename',__typename,
					'_idString',_idString,
					'userTagValuesResolved',userTagValuesResolved) AS jsonb
FROM lookupResult;

CREATE VIEW groupResult AS
SELECT 
	_id,
	jsonb_agg(jsonb)->0 result,COUNT(_id) numobjects,createdtime,modifiedtime
FROM mergeLookup
GROUP BY _id,createdtime,modifiedtime;

CREATE VIEW addSortByModifiedTime AS
SELECT 
	*,
	CASE 
		WHEN (modifiedTime > createdTime) THEN modifiedTime
		ELSE createdTime
	END AS _sort_modifiedTime
FROM groupResult
ORDER BY _sort_modifiedtime DESC;

CREATE VIEW addFavoriteTag AS
SELECT 
	*,
	CASE 
		WHEN _id LIKE '%[]%' THEN true
		ELSE false
	END AS isFavorite
FROM addSortByModifiedTime
ORDER BY isfavorite DESC;

CREATE VIEW replaceRoot AS 
SELECT 
	CASE
		WHEN(numobjects > 1 OR _id <> result->>'_id') THEN jsonb_build_object('_id',_id,
																		 'result',result,
																		 'numObjects',numobjects,
																		 'createdTime',createdtime,
																		 'modifiedTime',modifiedtime,
																		 'name',_id,
																		 '_isObjectFolder',true,
																		 '_sort_modifiedTime',_sort_modifiedtime,
																		 'isFavorite',isfavorite)
		ELSE jsonb_build_object('_id',_id,
							 'result',result,
							 'numObjects',numobjects,
							 'createdTime',createdtime,
							 'modifiedTime',modifiedtime,
							 'scenarios',result->>'scenarios',
							'modules',(result->>'modules')::jsonb,
							'jobsIds',(result->>'jobsIds')::jsonb,
							'createdBy',result->>'createdBy',
							'elements',result->>'elements',
							'axes',(result->>'axes')::jsonb,
							'gridName',result->>'gridName',
							'periods',(result->>'periods')::jsonb,
							'size',result->>'size',
							'economies',(result->>'economies')::jsonb,
							'path',result->>'path',
							'name',result->>'name',
							'variables',result->>'variables',
							'deletedTime',result->>'deletedTime',
							'status',result->>'status',
							'archived',result->>'archived',
							'billingInformation',(result->>'billingInformation')::jsonb,
							'frequencies',(result->>'frequencies')::jsonb,
							'modifiedBy',result->>'modifiedBy',
							'version',result->>'version',
							'userTagValues',(result->>'userTagValues')::jsonb,
							'__typename',result->>'__typename',
							'_idString',result->>'_idString',
							'userTagValuesResolved',(result->>'userTagValuesResolved')::jsonb,
							'_sort_modifiedTime',_sort_modifiedtime,
							'isFavorite',isfavorite)
	END AS agg
FROM addFavoriteTag;

CREATE VIEW sortByFolder AS
SELECT * 
FROM replaceRoot
ORDER BY agg->>'_isObjectFolder' ASC;

CREATE VIEW facetResult AS
SELECT jsonb_agg(agg), COUNT(*)  FROM sortByFolder
LIMIT 20 
OFFSET 0;

CREATE VIEW aggFacetResult AS
SELECT 
	jsonb_agg(jsonb_agg) AS results, 
	jsonb_agg(jsonb_build_object('count',count)) AS totalCount 
FROM facetResult;

SELECT jsonb_build_object('results',results->0,'totalCount',totalCount)
FROM aggFacetResult;


