# Query Tool <-> Query Result Unification (4/17)

Currently queries and results live in alternate routes.  When a query is "run" a new QueryResult is created and the Query Definition at that moment is captured and stored with the result.  Running a query multiple times results in one query (session) and numerous query results.

We propose dispensing with the concept of separate queries and results and instead consider results as just another view of a given query object.

## Ol Scheme

| Route | Description | Params | Content | Comments
| :------------: | --- | --- |--- | --- 
| __/simulations__ | List of simulation descriptors
| __/queries__ | List of query descriptors | | { id, name, simulationIds, createdTime, modifiedTime, links } | Is a session active?  Who created it?  Who is it shared with?  Does a result exist?  What views are available?   
| __/queries__/_query-guid_ | Specific query session | | {  ..., __state__: { arrangement, axes, statistics, variables } } | No way to know if a result exists.  No way to know the query result ID for run-query in advance.      
| __/query-results__ | List of result descriptors | | { axes, cells, createdTime, default_arrangement, description, file, frequency, href, id, modifiedTime, name, periods, query, ready, scenarios, shape, short_description, simulation_id, variables } | Far more than we need for a chooser. | Remove this route and roll it into query/id/result  
| __/query-results__/_query-result-guid_ | Specific result (does not load pivot) | | Same as above | 
| __/query-results__/_query-result-guid_/metadata | Constructs a pivots.jl object and arranges it.  Must be called before calling other result routes.  Also tracks selection. | subpivot | { allSelected, arrangementUID, availableViews, axes, columnAxes, columns, formats, rowAxes, rows, sleectionUID } | Axes do not match up with query axes. 
| __/query-results__/_query-result-guid_/data | Retrieves a window of pivot data |  x y columns rows | { colCoors, detailsCells, rowCoords } |
| __/query-results__/_query-result-guid_/scrollTooltips | rowSamples columnSamples rowsVisible columnsVisibile | Tooltips for pivot | { colCoors, detailsCells, rowCoords } |
| __/query-results__/_query-result-guid_/percentileChart | percentiles noUnderlyingData | 
  
  
  ## New Route Scheme
  
