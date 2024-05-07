import type {QueryResultDescriptor} from './models';
import type { ChartUserOptions, ChartType } from './models';
import { PivotFormat, StepPattern, StatisticsType, GridlinesType, DataFormat } from './models';
import { observable, action, computed, ObservableMap, runInAction, makeObservable } from 'mobx';
import * as mobx from 'mobx'
import { site as site } from 'stores/site';
import { routing } from 'stores/routing';
import { xhr } from 'stores/xhr';
import { julia as julia } from 'stores/julia'
import { QueryResult } from './models/QueryResult';
import type { QueryGuid } from 'stores';
import { api, settings } from 'stores';

export class QueryResultStore {
    constructor() {
        makeObservable(this);
    }

    @computed
	get apiUrl() {
		return `${julia.url}/v1/query-results`
	}

    get clientRoute() {
		return routing.urls.queryResult;
	}


    @computed
	get isActivePage() {
		return routing.isActive(routing.urls.queryResult)
	}

    @observable loadedResults = observable.map<string, QueryResult>({}, {deep: false});

    private _loadingDescriptorPromise = null;
    @observable hasLoadedDescriptors = false;

    @computed
	get recentQueryResults() {
		return _.take(_.sortBy(mobx.values(this.loadedResults), (d: QueryResultDescriptor) => d.modifiedTime).reverse(), settings.maxRecentItems);
	}

    @action loadResultDescriptors = (): Promise<QueryResult[]> => {
		if (!this._loadingDescriptorPromise) {
			return this._loadingDescriptorPromise = xhr.get<{ queryResults: QueryResultDescriptor[] }>(this.apiUrl)
			                                           .then(results => results.queryResults.map(descriptor => new QueryResult(descriptor)))
			                                           .then(results => {
				                                           // runInAction: Query Result Descriptors loaded
				                                           return runInAction(() => {
					                                           this.loadedResults.clear();

					                                           // Map the array of query results into a dictionary keyed on their id
					                                           results.forEach(r => this.loadedResults.set(r.id, r));
					                                           this._loadingDescriptorPromise = null;
					                                           this.hasLoadedDescriptors = true;
					                                           return results;
				                                           });
			                                           })
			                                           .catch(error => {
				                                           this._loadingDescriptorPromise = null;
				                                           throw error;
			                                           })
		}
		else {
			return this._loadingDescriptorPromise;
		}
	}

    loadIfNeeded = (id) => {
		if (!id) return null;

		const result = this.loadedResults.get(id);

		if (!result) {
			setTimeout(() => this.loadResult(id));
		}

		return result;
	}

    @action resetStore = () => {
		this.loadedResults.clear();
		this.hasLoadedDescriptors = false;
		this._loadingDescriptorPromise = null;
	}

    get browserUrl() {
		return routing.urls.queryResult
	}

    // get = (id: string) => {
    // 	if (!id) { return null }
    //
    // 	let result = this.loadedResults.get(id);
    // 	if (!result) {
    // 		setTimeout(() => this.loadResult(id), 0);
    // 	}
    //
    // 	return result;
    // }

    // Guard against multiple outstanding loads for the same ID
    _outstandingLoads: { [id: string ]: Promise<QueryResult> } = {};

    loadResult = (id, loadDefaultArrangement = false): Promise<QueryResult> => {
		// runInAction: Load query result
		return runInAction(async () => {
			if (!id) {
				return null
			}

			const { loadedResults, _outstandingLoads } = this;

			let promise: Promise<QueryResult>;

			if (loadedResults.has(id)) {
				promise = Promise.resolve(loadedResults.get(id))
			}
			if (_outstandingLoads[id]) {
				return _outstandingLoads[id];
			}
			else {
				try {
					const url = QueryResult.apiUrlFor(id);

					promise = xhr.get<QueryResultDescriptor>(url)
					             .then(result => new QueryResult(result))
					             .then(qr => runInAction(() => {
						             // runInAction: Query Result Descriptor loaded
						             loadedResults.set(id, qr);
						             delete _outstandingLoads[id];
						             return qr;

						             // // Reload the descriptor if we're not ready
						             // if (!qr.descriptor.ready) {
						             //    console.trace('Polling for ready query result...', this)
						             //    setTimeout(() => this.loadResult(id), 1000);
						             // }
						             // return qr;
					             })).catch(error => {
							if (error.status === api.HTTP_STATUS_CODES.notFound) {
								throw new Error(this.errors.queryResultNotFound(id));
							}
							throw error;
						});
				}
				finally {

				}
				_outstandingLoads[id] = promise;
			}

			return !loadDefaultArrangement
				? promise
				: promise.then(qr => qr.loadMetadata({statisticspivot: qr.showStatisticsPivot}).then(metadata => qr));
		});
	}

    @action delete = (id: QueryGuid) => {
		if (!id) {
			return Promise.resolve(null);
		}

		const { loadedResults } = this;

		if (loadedResults.has(id)) loadedResults.delete(id);

		return xhr.delete(QueryResult.apiUrlFor(id));
	}

    @action deleteAll = async () => {
		for (var d of mobx.values(this.loadedResults)) {
			console.warn(`Deleting query result '${d.id}'`)
			await this.delete(d.id);
		}
	}

    getAssociatedQueryResults = (queryId: QueryGuid) => {
		return mobx.values(this.loadedResults).filter(d => d.descriptor.query.id == queryId);
	}

    errors = {
		queryResultNotFound: function (id: QueryGuid) {
			return `The query result '${id}' was not found`;
		}
	}
    charting = {
		degreeOfSmoothingAPIValues: [.25, .5, 1, 2, 4],
		descriptors:                {
			['scatter']:   {name: 'Scatter', chartType: 'scatter'},
			['box']:       {name: 'Box', chartType: 'box'},
			['cdf']:       {name: 'CDF', chartType: 'cdf'},
			['cone']:      {name: 'Cone', chartType: 'cone'},
			['pdf']:       {name: 'PDF', chartType: 'pdf'},
			['histogram']: {name: 'Histogram', chartType: 'histogram'},
			['line']:	   {name: 'Line', chartType: 'line'},
			['bar']:	   {name: 'Bar', chartType: 'bar'},
			['beeswarm']:  {name: 'Beeswarm', chartType: 'beeswarm'}
		},
		defaultUserOptions:         (chartType: ChartType) => ({
			panOrZoom:              'zoom',
			markerSize:             5,
			lineWidth:              5,
			fontSize:               12,
			fontSizes:              [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96],
			canResetZoom:           false,
			isInverted:             false,
			percentiles:            [0, 1, 5, 25, 50],
			colorSet:               ["0,98,37", "138,32,3"],
			gridLine:               chartType === 'beeswarm' ? GridlinesType.None : GridlinesType.Horizontal,
			showLines:        		chartType === 'line',
			showMarkers:            true,
			showMeanValues:         true,
			columnMode:             '',
			moments:                {moment: 4, x: 5, y: 50},
			statistics:             StatisticsType.MeanOnly,
			areaOpacity:            null,
			stepPattern:            StepPattern.Horizontal,
			paths:                  [],
			verticalAxisDirection:  'top',
			horizontalAxisDirection:'left',
			degreeOfSmoothingIndex: chartType === 'histogram' ? 1 : 2,
			plotWidth:              0,
			plotHeight:             0,
			showRegressionLine:     false,
			highchartsOptions:      null
		} as ChartUserOptions)
	}

    pivot = {
		defaultUserOptions:         () => ({
			showStatisticsPivot:    false,
			showStatisticsPivotBeforeEnableSensitivity:    false
		})
	}

    formats: { [format: string]: { paddedLength?: number, precision?: number, scale?: number } } = {
		[DataFormat.Currency]: { paddedLength: 13, precision: 0, scale: 1 },
		[DataFormat.Return]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.Rate]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.Margin]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.Fraction]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.Factor]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.Ratio]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.Draw]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.Integer]: { paddedLength: 9, precision: 0, scale: 1 },
		[DataFormat.Integer_Small]: { paddedLength: 3, precision: 0, scale: 1 },
		[DataFormat.Exposure]: { paddedLength: 20, precision: 8, scale: 1 },
		[DataFormat.Currency_PUE]: { paddedLength: 20, precision: 8, scale: 1 },
		[DataFormat.Frequency]: { paddedLength: 9, precision: 0, scale: 1 },
		[DataFormat.Frequency_PUE]: { paddedLength: 20, precision: 8, scale: 1 },
		[DataFormat.Mean_Frequency]: { paddedLength: 13, precision: 5, scale: 1 },
		[DataFormat.Price]: { paddedLength: 13, precision: 3, scale: 1 },
		[DataFormat.Price_2]: { paddedLength: 10, precision: 2, scale: 1 },
		[DataFormat.Price_Short]: { paddedLength: 6, precision: 3, scale: 1 },
		[DataFormat.Years]: { paddedLength: 13, precision: 3, scale: 1 },
		[DataFormat.Years_Short]: { paddedLength: 6, precision: 3, scale: 1 },
		[DataFormat.Years_Squared]: { paddedLength: 13, precision: 3, scale: 1 },
		[DataFormat.Boolean]: { paddedLength: 3, precision: 0, scale: 1 },
		[DataFormat.Transgressions]: { paddedLength: 3, precision: 0, scale: 1 },
		[DataFormat.Shares]: { paddedLength: 13, precision: 4, scale: 1 },
		[DataFormat.Area]: { paddedLength: 13, precision: 4, scale: 1 },
		[DataFormat.User_Value]: { paddedLength: 20, precision: 8, scale: 1 },
		[DataFormat.ID]: { paddedLength: 12, precision: 0, scale: 1 },
		[DataFormat.ID_Short]: { paddedLength: 7, precision: 0, scale: 1 },
		[DataFormat.Error]: { paddedLength: 13, precision: 9, scale: 1 },
		[DataFormat.SID]: { paddedLength: 25 },
		[DataFormat.User_ID]: { paddedLength: 25 },
		[DataFormat.Security]: { paddedLength: 25 },
		[DataFormat.CMO_User_ID]: { paddedLength: 40 },
		[DataFormat.Economy]: { paddedLength: 12 },
		[DataFormat.Symbol]: { paddedLength: 25 },
		[DataFormat.Accounting_Treatment]: { paddedLength: 25 },
		[DataFormat.Property]: { paddedLength: 12 },
		[DataFormat.Quality]: { paddedLength: 12 },
		[DataFormat.Portfolio]: { paddedLength: 20 },
		[DataFormat.Entity]: { paddedLength: 20 },
		[DataFormat.Common_Stock]: { paddedLength: 15 },
		[DataFormat.Market_Index]: { paddedLength: 25 },
		[DataFormat.Instrument]: { paddedLength: 20 },
		[DataFormat.Credit_Rating]: { paddedLength: 25 },
		[DataFormat.Rating]: { paddedLength: 6, precision: 0, scale: 1 },
		[DataFormat.Special_Category]: { paddedLength: 6 },
		[DataFormat.OID_Flag]: { paddedLength: 3, precision: 0, scale: 1 },
		[DataFormat.Class]: { paddedLength: 13 },
		[DataFormat.Class_Short]: { paddedLength: 6 },
		[DataFormat.Pool]: { paddedLength: 17 },
		[DataFormat.Prepayment_Model]: { paddedLength: 17 },
		[DataFormat.CMO_Rating]: { paddedLength: 10, precision: 0, scale: 1 },
		[DataFormat.PAC]: { paddedLength: 10 },
		[DataFormat.Group]: { paddedLength: 10, precision: 2, scale: 1 },
		[DataFormat.Level]: { paddedLength: 12, precision: 2, scale: 1 },
		[DataFormat.Jump]: { paddedLength: 4, precision: 0, scale: 1 },
		[DataFormat.Spread]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.Rating_M]: { paddedLength: 15 },
		[DataFormat.Forward_Object]: { paddedLength: 10 },
		[DataFormat.Strategy]: { paddedLength: 21 },
		[DataFormat.f9_6]: { paddedLength: 9, precision: 6, scale: 1 },
		[DataFormat.f10_2]: { paddedLength: 10, precision: 2, scale: 1 },
		[DataFormat.f4_0]: { paddedLength: 4, precision: 0, scale: 1 },
		[DataFormat.GDP]: { paddedLength: 17, precision: 0, scale: 1 }
	}
}

export const queryResultStore = new QueryResultStore();