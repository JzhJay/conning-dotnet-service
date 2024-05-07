import { action, observable, computed, ObservableMap, makeObservable } from 'mobx';
import type {QueryResultDescriptor, PivotMetadata, PivotArrangement} from 'stores/queryResult';
import {
	CorrelationTableData, PivotData,
	HighchartsHelper, PivotResultHelper, ChartData, PivotArrangementHelper, QueryResultData, IQueryResult,
	queryResultStore as queryResultStore, Axis, IPivotArrangementHelper, ReconfigurePivotResponse, IHighchartsHelper,
	PdfData, CdfData, PercentileChartData, HistogramData, IPivotResultHelper
} from 'stores/queryResult';
import type {SelectRangeResponse, PivotTooltips, PivotPart} from '../../stores/queryResult/models/pivot/pivotJuliaModels';
import type {SelectOperation} from '../../stores/query/JuliaModels';
import {mockPivotMetaData} from './pivotMetadataMock'

export class QueryResultMock implements IQueryResult {
    @observable subselect = null;

    @observable dataByUrl    = observable.map<string, QueryResultData>();
    @observable loadingByUrl = observable.map<string, Promise<QueryResultData>>();

    constructor() {
        makeObservable(this);
    }

    @computed get availableViews() { return this.pivotMetadata ? this.pivotMetadata.availableViews : ['pivot'] }

    get pivotMetadata(): PivotMetadata {
		return mockPivotMetaData as any;
	}

    get id() { return this.descriptor.id }

    get name() { return this.descriptor.id}

    set name(new_name: string) {
		this.descriptor.name = new_name;
	}

    readonly descriptor: QueryResultDescriptor = {
		"cells":               1155000,
		"axes":                [
			"Price_Index",
			"Economy",
			"Time",
			"Path"
		],
		"periods":             21,
		"modifiedTime":        "2016-09-08T20:25:49.13",
		"shape":               [
			1155000
		],
		"variables":           11,
		"id":                  "023ebb18-840a-44cf-9807-69673b62dc5c",
		"href":                "http://xiaoqi-restapi.advise-conning.com:8002/v1/query-results/023ebb18-840a-44cf-9807-69673b62dc5c",
		"name":                'Mock Query Result',
		"description":         "(1_155_000,1) 5000 scenarios, 21 years, Module=Economies,Projection=Core,Economic_Variable=Price_Indices,Measure=Rate,Component=Value,Method=Annualized,Time_Frame=Current,Frequency=Simulation,Simulation=Example",
		"scenarios":           5000,
		"createdTime":         "2016-09-08T20:25:49.13",
		"default_arrangement": {
			"rows":       5000,
			"rowAxes":    [
				1
			],
			"columns":    231,
			"columnAxes": [
				0,
				2,
				3
			]
		},
		"frequency":           "annual",
		"short_description":   "Inflation Rate 21 years 4 economies",

		query: {id: "mock-query-id", json: null}
	}

    @action clone = () => {
		return Promise.resolve(null);
	}

    /* Correlation */
    @computed get correlation() {
		return null;
		//return Promise.resolve({loading: true, data: null});
		// return {
		// 	data:    dataByUrl.get(url) as CorrelationTableData,
		// 	loading: loadingByUrl.has(url)
		// };
	}

    @action loadMetadata = (props: {subpivot?: boolean, arrangement?: PivotArrangement} = {}): Promise<PivotMetadata> => {
		return Promise.resolve(null);
	}

    highcharts  = new HighchartsHelperMock(this);
    pivot       = new PivotResultHelperMock(this);
    arrangement = new PivotArrangementHelperMock(this);

    // @action updateAvailableViews(queryResultId: string, availableViews: Array<QueryViewName>) {
    // 	dispatch(updateStore({availableViews: Object.assign({}, getState().queryResult.availableViews, {[queryResultId]: availableViews})}))
    // }
    //
    // @action updateSelectionState(queryResultId: string, selectionUID: string) {
    // 	const store      = getState();
    // 	const newStateID = Object.assign({}, store.queryResult.stateIDs[queryResultId], {selection: selectionUID});
    // 	dispatch(updateStore({stateIDs: Object.assign({}, store.queryResult.stateIDs, {[queryResultId]: newStateID})}));
    // }
    //
    // @action updateArrangementState(queryResultId: string, arrangementUID: string) {
    // 	const store      = getState();
    // 	const newStateID = Object.assign({}, store.queryResult.stateIDs[queryResultId], {arrangement: arrangementUID});
    // 	dispatch(updateStore({stateIDs: Object.assign({}, store.queryResult.stateIDs, {[queryResultId]: newStateID})}));
    // }
}

class PivotArrangementHelperMock implements IPivotArrangementHelper {
	constructor(private queryResult: QueryResultMock) {}

	columnAxes: Axis[];
	rowAxes: Axis[];
	isDefault: boolean;
	isRearranging: boolean = false;

	reset() {
	}

	rearrange(arrangement: PivotArrangement): Promise<ReconfigurePivotResponse> {
		return undefined;
	}

	flip(): Promise<ReconfigurePivotResponse> {
		return undefined;
	}

	allToRows(): Promise<ReconfigurePivotResponse> {
		return undefined;
	}

	allToColumns(): Promise<ReconfigurePivotResponse> {
		return undefined;
	}
}

class HighchartsHelperMock implements IHighchartsHelper {
	getPdfData(smoothingIndex: number, percentiles: number[]): Promise<PdfData> {
		return undefined;
	}

	getCdfData(): Promise<CdfData> {
		return undefined;
	}

	getPercentileChartData(percentiles: number[], noUnderlyingData): Promise<PercentileChartData> {
		return undefined;
	}

	getHistogramData(): Promise<HistogramData> {
		return undefined;
	}

	constructor(private queryResult: QueryResultMock) {}

}

class PivotResultHelperMock implements IPivotResultHelper {

	getData(params: { x?: number, columns?: number, y?: number, rows?: number, subpivot?: boolean }): Promise<PivotData> {
		const {x, columns, y, rows} = params;
		let detailCells             = [];
		let colCoords               = [];
		let rowCoords               = [];

		for (let r = y; r < y + rows; r++) {
			const rowData = [];
			for (let c = x; c < x + columns; c++) {

				if (r == y)
					colCoords.push([`${c}`]);

				const cell = {
					data:     `${r} ${c}`,
					format:   null,
					selected: false,
					exists:   true
				}
				rowData.push(cell)
			}

			rowCoords.push([`${r}`])
			detailCells.push(rowData);
		}

		// Simulate latency
		return new Promise((accept) => {
			window.setTimeout(() => accept({detailCells, colCoords, rowCoords}), 50);
		});
	}

	loadTooltips(args: { rowSamples: number, columnSamples: number, rowsVisible: number, columnsVisible: number }): Promise<PivotTooltips> {
		return Promise.resolve(null);
	};

	selectRange(target: PivotPart, operation: SelectOperation, cells: { y, rows, x, columns }): Promise<SelectRangeResponse> {
		return Promise.resolve(null);
	};

	constructor(private queryResult: QueryResultMock) {}
}


//