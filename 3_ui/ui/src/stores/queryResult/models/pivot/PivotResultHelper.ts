import { xhr } from 'stores/xhr';
import type { PivotData, PivotTooltips, PivotPart, SelectRangeResponse, IQueryResult } from 'stores/queryResult';
import { QueryResult } from 'stores/queryResult';
import type { SelectOperation} from 'stores/query';
import { action, observable, computed, runInAction, makeObservable } from 'mobx';
import { PivotArrangementHelper } from './';
import { queryResultStore } from "../../index";
import { buildURL } from "../../../../utility/utility";
import { CompactPivotData } from "./pivotJuliaModels";
//import isNumber = wijmo.isNumber;

export interface IPivotResultHelper {
	getData(params: { x?: number, columns?: number, y?: number, rows?: number, subpivot?: boolean }): Promise<PivotData>;
	loadTooltips(args: { rowSamples: number, columnSamples: number, rowsVisible: number, columnsVisible: number }): Promise<PivotTooltips>;
	selectRange(target: PivotPart, operation: SelectOperation, cells: { y, rows, x, columns }): Promise<SelectRangeResponse>;
}

export interface PivotGetDataParams {
	x?: number, columns?: number, y?: number, rows?: number, subpivot?: boolean, statisticspivot?: boolean
}

/**
 * Pivot Specific methods for query results
 */
export class PivotResultHelper implements IPivotResultHelper {
	constructor(public queryResult: QueryResult) {
        makeObservable(this);
    }

	latestDataRequest = null;

	@computed get url() {
		return this.queryResult.apiUrl
	}

	@action getData = (params: PivotGetDataParams) => {
		const { x, columns, y, rows, subpivot, statisticspivot } = params;

		/*
		 if (!isNumber(x) || !isNumber(y) || !isNumber(columns) || !isNumber(rows)) {
		 throw new Error('Non-numeric data in input')
		 }*/

		//console.trace(`pivot.loadData(${this.queryResult.id} - x: ${x}, y: ${y}, rows: ${rows}, columns: ${columns}, SubSelectOnly:  ${subpivot})`);

		let url = `${this.url}/data`;

		if (x != null) {
			url += `?x=${x}&columns=${columns}&y=${y}&rows=${rows}`;
		}

		if (subpivot) {
			url += (x == null ? '?' : '&') + 'subpivot';
		}

		if (statisticspivot) {
			url += (x == null ? '?' : '&') + 'statisticspivot';
		}

		if (this.queryResult.sensitivityEnabled) {
			url += (x == null ? '?' : '&') + 'sensitivity=true';
		}

		return (this.latestDataRequest = this.queryResult.loadFromJulia<PivotData>(url));
	}

	@action getDataCompact = () => {
		return this.queryResult.loadFromJulia<CompactPivotData>(buildURL(`${this.url}/data`, {dataonly: true}));
	}


	@action loadTooltips = (args: { rowSamples: number, columnSamples: number, rowsVisible: number, columnsVisible: number, statisticspivot: boolean }) => {
		//console.trace(`getPivotTooltips(${JSON.stringify(args)})`);

		const { rowSamples, columnSamples, rowsVisible, columnsVisible, statisticspivot } = args;

		let url = `${this.url}/scrollTooltips?rowSamples=${rowSamples}&columnSamples=${columnSamples}&rowsVisible=${rowsVisible}&columnsVisible=${columnsVisible}`;

		if (statisticspivot) {
			url += '&statisticspivot';
		}

		if (this.queryResult.sensitivityEnabled) {
			url += '&sensitivity=true';
		}

		// Currently throws an error:
		/* 2016-12-26 17:30:03.676 0 127.0.0.1 GET /v1/query-results/cf13312d-33ea-4523-934c-c33e97225dc3/scrollTooltips?rowSamples=9&columnSamples=100&rowsVisible=9&columnsVisible=100
		 arraysize: dimension out of range
		 in _writejson(::Base.AbstractIOBuffer{Array{UInt8,1}}, ::JSON.State{false}, ::Array{Int64,0}) at /Users/noahshipley/.julia/v0.5/JSON/src/JSON.jl:231
		 in _writejson(::Base.AbstractIOBuffer{Array{UInt8,1}}, ::JSON.State{false}, ::Dict{String,Array{Int64,0}}) at /Users/noahshipley/.julia/v0.5/JSON/src/JSON.jl:191
		 in _writejson(::Base.AbstractIOBuffer{Array{UInt8,1}}, ::JSON.State{false}, ::Array{Dict{String,Array{Int64,0}},1}) at /Users/noahshipley/.julia/v0.5/JSON/src/JSON.jl:204
		 in _writejson(::Base.AbstractIOBuffer{Array{UInt8,1}}, ::JSON.State{false}, ::Dict{Any,Any}) at /Users/noahshipley/.julia/v0.5/JSON/src/JSON.jl:191
		 in print(::Base.AbstractIOBuffer{Array{UInt8,1}}, ::Dict{Any,Any}, ::Int64) at /Users/noahshipley/.julia/v0.5/JSON/src/JSON.jl:264
		 */
		return xhr.get<PivotTooltips>(url);

		// return Promise.reject(`${url} is currently broken - WEB-1171`);
	}

	@action selectRange = (target: PivotPart, operation: SelectOperation, cells: { y, rows, x, columns }) => {
		const apiTarget = target === 'columns' ? "columnCoordinates" :
		                  target === 'rows' ? "rowCoordinates" : "dataCells"

		let url = `${this.url}/selectRange?operation=${operation}&target=${apiTarget}`;
		if (cells != null) {
			const { x, y, rows, columns } = cells;

			url += `&y=${y}&rows=${rows}&x=${x}&columns=${columns}`;
		}

		return xhr.get<SelectRangeResponse>(url).then(response => {

			// runInAction: Update pivot metadata selection
			runInAction(() => {
				const {queryResult, queryResult:{pivotMetadata}} = this;

				pivotMetadata.allSelected = response.allSelected;
				pivotMetadata.selectionUID = response.selectionUID
				pivotMetadata.availableViews = response.availableViews;
				if (queryResult.descriptor) {
					queryResult.descriptor.availableViews = response.availableViews;
				}
			})

			return response;
		});
	}
}

export class PivotResultHelperMock implements IPivotResultHelper {
	constructor(public queryResult: IQueryResult) {
        makeObservable(this);
    }

	@action getData = (params: { x?: number, columns?: number, y?: number, rows?: number, subpivot?: boolean }) => {
		return Promise.resolve(null)
	}

	@action loadTooltips = (args: { rowSamples: number, columnSamples: number, rowsVisible: number, columnsVisible: number }) => {
		return Promise.resolve(null)
	}

	@action selectRange(target: PivotPart, operation: SelectOperation, cells: { y, rows, x, columns }) {
		return Promise.resolve(null)
	}
}