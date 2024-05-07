import {Query, ArrangementOperation, StatisticsClause, QueryPart, julia} from 'stores/query';
import { computed, observable, action, toJS, autorun, makeObservable } from 'mobx';
import {api, site} from 'stores/index';

export class StatisticsWrapper implements julia.StatisticsState {
	dispose = () => {
	}

	toLabel() {
		return <div>
			{this.clauses.length} clauses
		</div>
	}

	private updateState = (state: julia.QueryState) => {
		delete state.variables;
		if (state.statistics && state.statistics.metadata) {
			delete state.statistics.metadata;
		}

		this.query.updateState(state);
		this.clearPendingRequest();
	};

	constructor(private query: Query, state: julia.StatisticsState) {
        makeObservable(this);
        this.metadata      = state.metadata;
        this.clauses       = state.clauses;
        this.axesAvailable = state.axesAvailable;
    }

	metadata: julia.StatisticsMetadata[];

	@observable axesAvailable: number[];
	@observable clauses: julia.StatisticsClause[];
	@observable hasPendingRequest = false;

	private urlFor_StatisticsClause(clauseId?: number) {
		return `${this.query.apiUrl}/statistics${clauseId != null ? `/${clauseId}` : ''}`
	}

	private urlFor_StatisticsClauseWithStatistic(clauseId: number, statisticID: number) {
		return `${this.urlFor_StatisticsClause(clauseId)}/${statisticID}`;
	}

	@action addClause = (axisId: number) => {
		if (!this.hasPendingRequest) {
			this.query.invalidateQueryResult();
			this.setPendingRequest();

			const promise = api.xhr.post<julia.QueryState>(
				this.urlFor_StatisticsClause(axisId),
				{operation: 'AxisAdd', targetAxis: 0}).then(this.updateState);

			// Optimistic update
			this.clauses.push({axis: axisId, statistics: [], axes_available: this.axesAvailable});
			return promise;
		}
	}

	@action removeClause = async (axisId: number) => {
		if (!this.hasPendingRequest) {
			this.query.invalidateQueryResult();
			this.setPendingRequest();
			const promise = api.xhr.delete(this.urlFor_StatisticsClause(axisId)).then(this.updateState);

			// Optimistic update
			this.clauses = this.clauses.filter(c => c.axis !== axisId);

			return promise;
		}
	}

	@action switchClauseAxis = (clause: julia.StatisticsClause, newAxisId: number) => {
		if (newAxisId !== clause.axis && !this.hasPendingRequest) {
			this.query.invalidateQueryResult();
			this.setPendingRequest();
			const promise = api.xhr.post<julia.QueryState>(
				this.urlFor_StatisticsClause(clause.axis),
				{operation: 'AxisSwitch', targetAxis: newAxisId}).then(this.updateState);

			clause.axis = newAxisId;    // Optimistic update

			return promise;
		}
	}

	@action addStatistic = (clause: julia.StatisticsClause, number: number) => {
		if (!this.hasPendingRequest) {
			this.query.invalidateQueryResult();
			this.setPendingRequest();

			const promise = api.xhr.post<julia.QueryState>(
				this.urlFor_StatisticsClauseWithStatistic(clause.axis, number),
				{operation: 'StatisticAdd', targetStatistics: 0}).then(this.updateState);

			// Optimistic update
			clause.statistics.push(number);

			return promise;
		}
	}

	@action removeStatistic = (clause: julia.StatisticsClause, statistic: number) => {
		if (!this.hasPendingRequest) {
			this.query.invalidateQueryResult();
			this.setPendingRequest();
			const promise = api.xhr.delete<julia.QueryState>(
				this.urlFor_StatisticsClauseWithStatistic(clause.axis, statistic))
				.then(this.updateState);

			// Optimistic update
			clause.statistics = clause.statistics.filter(s => s !== statistic);

			return promise;
		}
	}

	@action switchStatistic = (clause: julia.StatisticsClause, statistic: number, targetStatistic: number) => {
		if (statistic !== targetStatistic && !this.hasPendingRequest) {
			this.query.invalidateQueryResult();
			this.setPendingRequest();

			const promise = api.xhr.post<julia.QueryState>(
				this.urlFor_StatisticsClauseWithStatistic(clause.axis, statistic),
				{operation: 'StatisticSwitch', targetStatistics: targetStatistic})
				.then(this.updateState);

			// Optimistic update
			clause.statistics = clause.statistics.map(s => s === statistic ? targetStatistic : s);

			return promise;
		}
	}

	@action moveStatisticAxis = (oldIndex: number, newIndex: number) => {
		this.query.invalidateQueryResult();
		this.setPendingRequest();
		this.query.statistics.clauses.move(oldIndex, newIndex);
		const newOrder = this.query.statistics.clauses.map(c => c.axis);

		// return api.xhr.post<julia.QueryState>(
		// 	this.urlFor_StatisticsClause(oldIndex),
		// 	{operation: 'StatisticSwitch', targetStatistics: targetStatistic})
		// 	.then(this.updateState);

		if (newIndex === 0) {
			return api.xhr.post<julia.QueryState>(
				this.urlFor_StatisticsClause(this.query.statistics.clauses[0].axis), {
					operation:  'AxisMoveFirst',
					targetAxis: 0
				})
				.then(this.updateState);
		} else {
			return api.xhr.post<julia.QueryState>(
				this.urlFor_StatisticsClause(this.query.statistics.clauses[newIndex].axis), {
					operation:  'AxisMoveAfter',
					targetAxis: this.query.statistics.clauses[newIndex - 1].axis
				})
				.then(this.updateState);
		}
		// // return api.xhr.post<julia.QueryState>(
		// // 	this.urlFor_StatisticsClause(oldIndex),
		// // 	{operation: 'StatisticSwitch', targetStatistics: targetStatistic})
		// // 	.then(this.updateState);

		// console.warn(`moveStatisticAxis() is not yet implemented in julia`);
	}

	@action moveStatistic = (clause: StatisticsClause, oldIndex: number, newIndex: number) => {
		this.query.invalidateQueryResult();
		this.setPendingRequest();
		clause.statistics.move(oldIndex, newIndex);

		if (newIndex === 0) {
			return api.xhr.post<julia.QueryState>(
				this.urlFor_StatisticsClauseWithStatistic(clause.axis, clause.statistics[0]), {
					operation:        'StatisticMoveFirst',
					targetStatistics: 0
				})
				.then(this.updateState);
		} else {
			return api.xhr.post<julia.QueryState>(
				this.urlFor_StatisticsClauseWithStatistic(clause.axis, clause.statistics[newIndex]), {
					operation:        'StatisticMoveAfter',
					targetStatistics: clause.statistics[newIndex - 1]
				})
				.then(this.updateState);
		}
		// console.warn(`moveStatistic() is not yet implemented in julia`);
		//const newOrder = this.query.statistics.clauses.map(c => c.axis);
	}

	@action setPendingRequest() {
		this.hasPendingRequest = true;
		site.busy = true;
	}

	@action clearPendingRequest() {
		this.hasPendingRequest = false;
		site.busy = false;
	}
}
