import { xhr } from 'stores/xhr';
import type { IQueryResult, PivotArrangement, ReconfigurePivotResponse } from 'stores/queryResult';
import { QueryResult } from 'stores/queryResult';
import { observable, action, computed, runInAction, makeObservable } from 'mobx';
import {buildURL} from '../../../../utility';
import {Axis} from './pivotJuliaModels';

export interface IPivotArrangementHelper {
	columnAxes: Axis[];
	rowAxes: Axis[];
	isDefault: boolean;
	reset();
	rearrange(arrangement: PivotArrangement): Promise<ReconfigurePivotResponse>;
	flip(): Promise<ReconfigurePivotResponse>;
	allToRows(): Promise<ReconfigurePivotResponse>;
	allToColumns(): Promise<ReconfigurePivotResponse>;
	isRearranging: boolean;
}

export class PivotArrangementHelper implements IPivotArrangementHelper {
	constructor(private queryResult: QueryResult) {
        makeObservable(this);
    }

	@observable isRearranging = false;

	@computed get pivotMetadata() {
		return this.queryResult.pivotMetadata;
	}

	@computed get columnAxes() : Array<Axis>{
		return _.map(this.pivotMetadata.columnAxes, id => this.pivotMetadata.axes[id]);
	}

	@computed get rowAxes() : Array<Axis>{
		return _.map(this.pivotMetadata.rowAxes, id => this.pivotMetadata.axes[id]);
	}

	/**
	 * Has the arrangement changed from the default for this pivot ID?
	 * @returns {boolean}
	 */
	@computed get isDefault() {
		const { queryResult: { pivotMetadata, descriptor: { default_arrangement: defaultArrangement } } } = this;

		if (defaultArrangement != null && pivotMetadata != null) {
			return (_.isEqual(defaultArrangement.rowAxes, pivotMetadata.rowAxes)
					&& _.isEqual(defaultArrangement.columnAxes, pivotMetadata.columnAxes))
		}

		return true;
	}

	/* Be wary of trying to wrap arrangement actions with @action as we need to be able to trigger reactions on arrangement */
	reset = async () => {
		return this.rearrange(this.queryResult.descriptor.default_arrangement);
	}

	async rearrange(arrangement: PivotArrangement) {
		const { columnAxes, rowAxes } = arrangement;
		const { queryResult }         = this;

		this.isRearranging = true;
		let response = await xhr.get<ReconfigurePivotResponse>(
			buildURL(`${queryResult.apiUrl}/reconfigure`, {rowAxes: JSON.stringify(rowAxes)}, {colAxes: JSON.stringify(columnAxes)}, {statisticspivot: null, enabled: queryResult.showStatisticsPivot})
		);

		// runInAction: Updating query result pivot metadata from a rearrange
		runInAction(() => {
			queryResult.dataByUrl.clear();
			queryResult.pivotMetadata = Object.assign({}, queryResult.pivotMetadata, arrangement, response);
			queryResult.subselect = null;
			if (queryResult.descriptor) {
				queryResult.descriptor.availableViews = response.availableViews;
			}
		})

		this.isRearranging = false;
		return response;
	}

	flip = async () => {
		const { columnAxes, rowAxes } = this.queryResult.pivotMetadata;
		return this.rearrange({ rowAxes: columnAxes, columnAxes: rowAxes });
	}

	allToRows = async () => {
		const { columnAxes, rowAxes } = this.queryResult.pivotMetadata;
		return this.rearrange({
								  rowAxes:    [...rowAxes, ...columnAxes],
								  columnAxes: []
							  });
	}

	allToColumns = async () => {
		const { columnAxes, rowAxes } = this.queryResult.pivotMetadata;
		return this.rearrange({
								  rowAxes:    [],
								  columnAxes: [...columnAxes, ...rowAxes]
							  });
	}
}

export class PivotArrangementHelperMock implements IPivotArrangementHelper {
	constructor(private queryResult: IQueryResult) {
        makeObservable(this);
    }

	isRearranging = false;

	get columnAxes() {
		return null;
	}

	get rowAxes() {
		return null;
	}

	/**
	 * Has the arrangement changed from the default for this pivot ID?
	 * @returns {boolean}
	 */
	@computed get isDefault() {
		return false;
	}

	@action
	async reset() {
		return null;
	}

	@action
	async rearrange(arrangement: PivotArrangement) {
		return null;
	}

	@action
	async flip() {
		const {columnAxes, rowAxes} = this.queryResult.pivotMetadata;
		return this.rearrange({rowAxes: columnAxes, columnAxes: rowAxes});
	}

	@action
	async allToRows() {
		const {columnAxes, rowAxes} = this.queryResult.pivotMetadata;
		return this.rearrange({
			rowAxes:    [...rowAxes, ...columnAxes],
			columnAxes: []
		});
	}

	@action
	async allToColumns() {
		const {columnAxes, rowAxes} = this.queryResult.pivotMetadata;
		return this.rearrange({
			rowAxes:    [],
			columnAxes: [...columnAxes, ...rowAxes]
		});
	}
}
