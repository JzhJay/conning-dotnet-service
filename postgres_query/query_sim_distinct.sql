CREATE VIEW matchResult AS
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
	coalesce((_jsonb->>'Physical')::jsonb, NULL) AS parameterizationMeasure,
	coalesce((_jsonb->>'useCase')::jsonb, NULL) AS useCase,
	'Latest' AS productVersion,
	'Classic' AS sourceType
FROM ferretdb.simulation_4e6c5d36
WHERE NOT EXISTS 
(
  SELECT 1
  FROM jsonb_each(_jsonb)
  WHERE key='isLink'
)
OR _jsonb->>'isLink'='false';

CREATE VIEW createdByFacet AS
SELECT
	createdBy AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE createdBy IS NOT NULL
GROUP BY createdBy;

CREATE VIEW economiesFacet AS
SELECT 
	e.economie->0 AS _id,
	COUNT(*) AS count
FROM
(
	SELECT jsonb_array_elements(economies) AS economie
	FROM matchResult
	WHERE economies IS NOT NULL
) AS e
GROUP BY e.economie;

CREATE VIEW frequenciesFacet AS
SELECT 
	e.frequencie->0 AS _id,
	COUNT(*) AS count
FROM
(
	SELECT jsonb_array_elements(frequencies) AS frequencie
	FROM matchResult
	WHERE frequencies IS NOT NULL
) AS e
GROUP BY e.frequencie;

CREATE VIEW gridNameFacet AS
SELECT
	gridName AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE gridName IS NOT NULL
GROUP BY gridName;

CREATE VIEW modifiedByFacet AS
SELECT
	modifiedBy AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE modifiedBy IS NOT NULL
GROUP BY modifiedBy;

CREATE VIEW modulesFacet AS
SELECT 
	e.module->0 AS _id,
	COUNT(*) AS count
FROM
(
	SELECT jsonb_array_elements(modules) AS module
	FROM matchResult
	WHERE modules IS NOT NULL
) AS e
GROUP BY e.module;

CREATE VIEW parameterizationMeasureFacet AS
SELECT
	parameterizationMeasure AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE parameterizationMeasure IS NOT NULL
GROUP BY parameterizationMeasure;

CREATE VIEW productVersionFacet AS
SELECT
	productVersion AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE productVersion IS NOT NULL
GROUP BY productVersion;

CREATE VIEW scenariosFacet AS
SELECT
	scenarios AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE scenarios IS NOT NULL
GROUP BY scenarios;

CREATE VIEW sourceTypeFacet AS
SELECT
	sourceType AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE sourceType IS NOT NULL
GROUP BY sourceType;

CREATE VIEW statusFacet AS
SELECT
	status AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE status IS NOT NULL
GROUP BY status;

CREATE VIEW useCaseFacet AS
SELECT
	useCase AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE useCase IS NOT NULL
GROUP BY useCase;

CREATE VIEW variablesFacet AS
SELECT
	variables AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE variables IS NOT NULL
GROUP BY variables;

CREATE VIEW versionFacet AS
SELECT
	version AS _id,
	COUNT(*) AS count
FROM matchResult
WHERE version IS NOT NULL
GROUP BY version;

CREATE VIEW aggFacet AS 
SELECT jsonb_agg(e.agg)
FROM
(
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM createdByFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM economiesFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM frequenciesFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM gridNameFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM modifiedByFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM modulesFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM parameterizationMeasureFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM productVersionFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM scenariosFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM sourceTypeFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM statusFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM useCaseFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM variablesFacet
	UNION ALL
	SELECT jsonb_agg(jsonb_build_object('_id',_id,'count',count)) AS agg FROM versionFacet
) e;

SELECT jsonb_build_object('createdBy',jsonb_agg->0,
						  'economies',jsonb_agg->1,
						  'frequencies',jsonb_agg->2,
						  'gridName',jsonb_agg->3,
						  'modifiedBy',jsonb_agg->4,
						  'modules',jsonb_agg->5,
						  'parameterizationMeasure',jsonb_agg->6,
						  'productVersion',jsonb_agg->7,
						  'scenarios',jsonb_agg->8,
						  'sourceType',jsonb_agg->9,
						  'status',jsonb_agg->10,
						  'useCase',jsonb_agg->11,
						  'variables',jsonb_agg->12,
						  'version',jsonb_agg->13)
FROM aggFacet














	

