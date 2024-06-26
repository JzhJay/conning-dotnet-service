import {Query, AccordionPanel, julia} from 'stores/query'
import {
    computed,
    observable,
    action,
    toJS,
    autorun,
    runInAction,
    transaction,
    makeObservable,
} from 'mobx';
import {api} from 'stores/index';
import {ScenariosWrapper, TimestepsWrapper} from "stores/query/ui/wrappers";
import * as mobx from 'mobx'

export class VariablesWrapper {
	dispose = () => {
		this.scenarios.dispose();
		this.timesteps.dispose();
		this.clauses.forEach(c => c.dispose())
	}

	@observable collapsed: boolean;
	@observable clauses = observable.map<string, VariableClauseWrapper>({});
	@observable _selected: number;
	@computed get selected() {
		return _.some(mobx.values(this.clauses), c => c.hasAnyEmptyAxes) ? 0 : this._selected;
	}

	@observable total: number;

	@observable scenarios: ScenariosWrapper;
	@observable timesteps: TimestepsWrapper;

	lastRequestId: number = 0;

	constructor(private query: Query, variables: julia.Variables) {
        makeObservable(this);
        this.initialize(variables);
    }

	/**
	 * Called by creating or resetting a query
	 * @param variables
	 */
	initialize = (variables: julia.Variables) => {
		this.clauses.clear();
		this.collapsed = variables.collapsed;
		this._selected = variables.selected;
		this.total     = variables.total;

		variables.clauses.forEach(c => this.clauses.set(c.id.toString(), new VariableClauseWrapper(this.query, c, this.clauses.size)));

		const {query, zeroClause} = this;

		this.scenarios = new ScenariosWrapper(query, zeroClause);
		this.timesteps = new TimestepsWrapper(query, zeroClause);
	}

	processState = (state: julia.QueryState, lastRequestId?: number) => {
		// Only process the last state response. This will prevent issues where intermediate states from the back-end will override our accurate internal state with a stale state when multiple requests are outstanding.
		// E.g. A stale response could reference a deleted clauses which causes us to re-add the clause or a recently checked coordinate could be marked as unchecked in a stale response which results in the UI
		// temporarily displaying the old state.
		if (lastRequestId && lastRequestId != this.lastRequestId)
			return;

		const {
			      variables, arrangement, statistics,
			      variables: {clauses}
		      } = state;

		this._selected = variables.selected;
		this.total     = variables.total;

		for (const stateClause of clauses) {
			const id = stateClause.id.toString();

			if (!this.clauses.has(id)) {
				const clause = new VariableClauseWrapper(this.query, stateClause, this.clauses.size);
				this.clauses.set(id, clause);
			}
			else {
				const clause = this.clauses.get(id);

				clause._selected = stateClause.selected;
				for (const stateAxis of stateClause.axes) {
					const clauseAxis = clause.axes.get(stateAxis.id.toString());

					if (!_.isEqual(clauseAxis, stateAxis))
						Object.assign(clauseAxis, stateAxis);
				}
			}
		}

		// Remove clauses not present in the new state.
		for (const clause of mobx.keys(this.clauses)) {
			if (clauses.find(stateClause => stateClause.id.toString() === clause) == null)
				this.clauses.delete(clause);
		}

		if (!_.isEqual(this.query.arrangement.rows, arrangement.rows) || !_.isEqual(this.query.arrangement.columns, arrangement.columns))
			Object.assign(this.query.arrangement, arrangement);

		delete statistics.metadata;

		if (!_.isEqual(this.query.statistics.axesAvailable, statistics.axesAvailable) || !_.isEqual(this.query.statistics.clauses, statistics.clauses) )
			Object.assign(this.query.statistics, statistics);
	}

	get url() { return `${this.query.apiUrl}/variables`}

	get zeroClause() { return this.clauses.get("0")}

	// We always have the special 0 clause + at least one variable clause so...
	get hasMultipleVariableClauses() { return this.clauses.size > 2 }

	@action addClause = async() => {
		this.query.busy = true;
		this.query.invalidateQueryResult();

		try {
			const requestId = this.setOutstandingRequest();
			const delta = await api.xhr.post<julia.QueryState>(this.url);
			this.processState(delta, requestId);
			if (this.query.shouldExpandVariables) {
				this.query.navigateToPage(this.query.pages.find(page => page.clause == parseInt(_.last(mobx.keys(this.clauses)))));
			}
		}
		finally {
			this.query.busy = false;
		}
	}

	@action deleteClause = async(clauseId: number) => {
		this.query.busy = true;
		this.query.invalidateQueryResult();

		try {
			const requestId = this.setOutstandingRequest();

			this.clauses.delete(clauseId.toString());

			const delta = await api.xhr.delete<julia.QueryState>(`${this.url}/${clauseId}`);
			this.processState(delta, requestId);
		}
		finally {
			this.query.busy = false;
		}
	}

	@action toggleCollapsed = () => {
		const value = !this.collapsed;

		this.collapsed = value;
		return api.xhr.post<julia.QueryState>(`${this.url}`, {action: 'setCollapsed', collapsed: value});
	}

	setOutstandingRequest = () => {
		return ++this.lastRequestId;
	}
}

export class VariableClauseWrapper {
	@observable id: number;
	@observable axes = observable.map<string, julia.ClauseAxis>();
	@observable _selected: number;
	@observable showImpliedAxes: boolean;

	panel: AccordionPanel;

	constructor(private query: Query, clause: julia.VariableClause, index: number) {
        makeObservable(this);
        this.id              = clause.id;
        this._selected       = clause.selected;
        this.showImpliedAxes = clause.showImpliedAxes;

        clause.axes.forEach(a => this.axes.set(a.id.toString(), a));

        this.panel = new AccordionPanel(
			query, {
				index:  index,
				part:   'variables',
				clause: this
			});
    }

	dispose = () => {
		this.panel.dispose();
	}

	@computed get hasAnyEmptyAxes() {
		return _.some(this.panel.accordions, acc => acc.areNoAvailableValuesSelected);
	}

	@computed get selected() {
		return this.hasAnyEmptyAxes ? 0 : this._selected;
	}

	get url() {
		return `${this.query._variables.url}/${this.id}`;
	}

	selectCoordinates = async(operation: julia.SelectOperation, axis: julia.QueryAxis, coordinates: Array<julia.AxisCoordinate> = []) => {
		const payload: julia.SelectAxisCoordinatesPayload = {
			operation:   operation,
			coordinates: coordinates ? coordinates.map(c => c.id).sort() : []
		}

		this.query.busy = true;
		this.query.invalidateQueryResult();
		const requestId = this.query._variables.setOutstandingRequest();

		try {
			// http://keith.advise-conning.com:8002/v1/queries/f764bfdd-5539-421e-9dc3-71b747793a89/queryState/variables/clauses/:clause/statuses/:axis/selected
			const state = await api.xhr.post<julia.QueryState>(`${this.url}/${axis.id}/selected`, payload);
			delete state.statistics.metadata;
			// runInAction: selectCoordinates for query
			runInAction(() => this.query._variables.processState(state, requestId));
		}
		finally {
			this.query.busy = false;
		}
	}

	toggleShowImpliedAxes = () => {
		return runInAction(() => {
			this.showImpliedAxes = !this.showImpliedAxes;
			api.xhr.post<void>(`${this.url}`, {showImpliedAxes: this.showImpliedAxes})
		});
	}
}