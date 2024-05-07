import {api, utility} from 'stores/index'
import {
	Query, QueryPart, AxisCoordinate, Accordion, SelectAxisCoordinatesPayload, VariableClause, VariableStatus, QueryAxis, AxisCoordinateSearchModel
} from 'stores/query';
import type { SortOrder } from 'stores/site';
import {
    action,
    observable,
    computed,
    autorun,
    runInAction,
    reaction,
    makeObservable,
} from 'mobx';
import {VariableClauseWrapper} from './wrappers';

interface IAccordionPanel {
	id?: number;    // Clause ID
	index?: number; // Ordinal Index to display on screen
	part: QueryPart;
	clause: VariableClauseWrapper;
	accordions?: Accordion[];
	// virtualize?: boolean;
	// sortOrder?: SortOrder;
	// sortable?: boolean;
	// isDeleting?: boolean;
	// searchText?: string;
	// showImpliedAxes?: boolean;
}

export interface IAccordionPanelComponent {
	node: HTMLElement;
}

export class AccordionPanel implements IAccordionPanel {
	constructor(public query: Query, config?: IAccordionPanel) {
        makeObservable(this);
        Object.assign(this, config);

        const {clause, index, part} = config;

        let clauseAxes: any[] = Array.from(this.clause.axes.values());

        if (part === 'scenarios') {
			clauseAxes = clauseAxes.filter(s => query.axisById(s.id).code === 'Scenario');
		}
		else if (part === 'time-steps') {
			clauseAxes = clauseAxes.filter(s => query.axisById(s.id).code === 'Time');
		}

        this.accordions  = clauseAxes.map(clauseAxis => new Accordion(query, clauseAxis.id, this, clauseAxes.length))
        this.searchModel = new AxisCoordinateSearchModel(this);

		this._toDispose.push(autorun(() => {
			if (query.shouldExpandVariables && query._variables.clauses.has(this.id.toString())) {
				this.expand();
			}
		}))
    }

	_toDispose = [];

	dispose = () => {
		this._toDispose.forEach(f => f());
		this.accordions.forEach(acc => acc.dispose());
	}

	get id() { return this.clause ? this.clause.id : -1; }

	index = 0;

	clause: VariableClauseWrapper;

	part: QueryPart;
	@observable isDeleting = false;
	component: IAccordionPanelComponent;

	searchModel: AxisCoordinateSearchModel;

	sortable = true;

	accordions: Accordion[] = [];

	get axes() { return this.query.axes }

	@computed get _accordionByAxisId(): { [id: number]: Accordion } {
		return _.keyBy(this.accordions, acc => acc.axis.id);
	}

	@computed get _accordionByLabel(): { [label: string]: Accordion } {
		return _.keyBy(this.accordions, acc => acc.axis.label);
	}

	accordionByAxisId(id: number): Accordion {
		return this._accordionByAxisId[id];
	}

	accordionByLabel(label: string): Accordion {
		return this._accordionByLabel[label];
	}

	get virtualize() { return this.part === 'scenarios'; }

	get showToolbar() {
		return this.part !== 'views';
	}

	get showSortOrder() {
		return false;
		//
		// const {part} = this;
		//
		// return part !== 'statistics' && part !== 'scenarios' && part !== 'views' && this.axes.size > 1;
	}

	get allowSelectAll() {
		return this.part !== 'statistics';
	}

	get areSomeButNotAllSelected() {
		return _.some(this.accordions, (acc: Accordion) => acc.areSomeButNotAllSelected)
	}

	get areAllChecked() {
		return _.every(this.accordions, acc => acc.areAllAvailableSelected);
	}

	get length() {
		return this.accordions.length;
	}

	@action toggleSortOrder() {
		this.sortOrder = this.sortOrder === 'initial' ? this.sortOrder = 'asc' : this.sortOrder === 'asc' ? 'desc' : 'initial'
	}

	@computed get canDelete() {
		return this.part === 'variables' && this.query._variables.clauses.size > 2;  // >2 because we have a special 0th clause
	}

	get route() { return `${this.query.apiUrl}/variables/${this.id}` }

	@computed get selected() { return this.clause.selected; }

	@observable sortOrder: SortOrder = 'initial';

	@computed get sortedAccordions(): Accordion[] {
		const {accordions, sortOrder} = this;

		return _.orderBy(accordions,
			//['areNoAvailableValuesSelected', 'areSomeButNotAllSelected', 'isOnlyAvailableItemSelected', sortOrder === 'initial' ? 'id' : 'label'],
			sortOrder === 'initial' ? ['axis.sortIndex', 'id'] : ['label'],
			//'desc', 'desc', 'asc',
			[sortOrder === 'initial' ? 'asc' : sortOrder]);
	}

	@computed get impliedAxes() {
		const {part, sortedAccordions} = this;

		return (part === 'variables')
			? sortedAccordions.filter(acc => acc.isImplied)
			: sortedAccordions;
	}

	@action expand = () => {
		api.site.busy = true;
		this.sortedAccordions.forEach(acc => acc.expand());
		api.site.busy = false;
	}

	@action collapse = () => {
		api.site.busy = true;
		this.sortedAccordions.forEach(acc => acc.collapse());
		api.site.busy = false;
	}

	@action toggleShowImpliedAxes = () => {
		this.clause.toggleShowImpliedAxes();
	}

	@action checkAll = () => {
		if (!this.areAllChecked) {
			this.accordions.forEach(acc => {
				if (!acc.areAllAvailableSelected) {
					this.accordions
						.filter(acc => !acc.areAllAvailableSelected)
						.forEach(() => acc.selectValues("All", []));
				} else {
					if (this.part !== 'variables') {
						// Uncheck everyone

						this.accordions
							.filter(acc => acc.selected !== 0)
							.forEach(() => acc.selectValues("None", []));
					}
				}
			})
		}
	}
}
