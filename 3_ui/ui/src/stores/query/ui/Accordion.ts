import type {SelectOperation} from 'stores';
import {AccordionPanel, AxisCoordinate, Query, site, simulationStore, utility} from 'stores';
import type { SortOrder } from 'stores/site';
import {
    observable,
    action,
    computed,
    runInAction,
    reaction,
    autorun,
    makeObservable,
} from 'mobx';
import { QueryAxisWrapper } from "./wrappers/QueryAxisWrapper";
import {Analytics} from 'client';

export class AccordionValue {
	coordinate: AxisCoordinate;
	@observable selected: boolean;
	@observable available: boolean;

	@computed get label() {
		const {coordinate, axis} = this;

		let label = coordinate.label;
		if (axis.label == 'Simulation') {
			const sim = simulationStore.simulations.get(label);
			if (sim) { label = sim.name }
		}

		return label;
	}

	constructor(private axis : QueryAxisWrapper, coordinate: AxisCoordinate, selected: boolean, available: boolean) {
        makeObservable(this);
        this.coordinate = coordinate;
        this.selected = selected;
        this.available = available;
    }

	toString() {
		const { coordinate, selected, available } = this;

		return `${coordinate.label} - ${selected ? 'selected' : 'unselected'} - ${available ? 'available' : 'unavailable'}`;
	}
}

export interface IAccordionComponent {
	focusedIndex: number;
	scrollTo();
	scrollToFocusedItem();
	attractUsersAttention(coordinate?: AxisCoordinate);
	unfocusAndClearSelection();
	focusAccordionValue(value?: 'first' | 'last' | AccordionValue, scrollIntoView?: boolean);
}

export class Accordion {
	constructor(private query: Query, public axisId: number, public panel: AccordionPanel, clauseAxisLength: number) {
        makeObservable(this);
        const { part, clause: { id: clauseId } } = panel;

        const { route, clauseAxis } = this;

        if (part === "scenarios" || clauseAxisLength === 1) {
			clauseAxis.expanded = true;
		}

        if (clauseAxis.expanded) {
			this.expanded = clauseAxis.expanded;
		}
        if (clauseAxis.sortOrder) {
			this.sortOrder = clauseAxis.sortOrder;
		}

        // Why was this ever needed? Results in accordions not be closable when rendered initially open. WEB-2477
        /*
		if (this.expanded && !this._everExpanded) {
			this._everExpanded = true;
		}*/

        this._toDispose.push(
			autorun( () => {
				const { values } = this;

				this.updateDerivedValues();
			}, {name: `Update derived selected/available after values change`}));

        // autorun(`Map coordinates for clause ${clauseId}-${this.axis.label} to accordion values`, () => {
        // 	const selected  = _.keyBy(this.clauseAxis.selected);
        // 	const available = _.keyBy(this.clauseAxis.available);
        //
        // 	// Walk all coordinates of our associated axis and map them to accordion values
        // 	this.values = this.axis.coordinates.map(c => new AccordionValue(this.panel, c, c.id in selected, c.id in available));
        // 	this.sort();
        // });
    }

	_toDispose : Array<() => void> = [];

	@observable disposed = false;
	dispose = () => {
		this._toDispose.forEach(f => f());
		this._toDispose = [];
		this.disposed = true;
	}

	@action updateDerivedValues = () => {
		let totalSelected = 0;
		let totalAvailable = 0;
		let totalAvailableAndSelected = 0;

		this.values.forEach(({ selected, available }) => {
			if (selected) {
				totalSelected++;
			}
			if (available) {
				totalAvailable++;
			}

			if (selected && available) {
				totalAvailableAndSelected++;
			}
		});

		this.selected = totalSelected;
		this.available = totalAvailable;
		this.availableAndSelected = totalAvailableAndSelected;

		if (this.areNoAvailableValuesSelected) {
			this.expanded = true;
		}
	}

	@computed get values(): Array<AccordionValue> {
		const selected = _.keyBy(this.clauseAxis.selected);
		const available = _.keyBy(this.clauseAxis.available);


		// Walk all coordinates of our associated axis and map them to accordion values
		return this.axis ? this.axis.coordinates.map(c => new AccordionValue(this.axis, c, c.id in selected, c.id in available)) : [];
	}

	get route() {
		return `${this.panel.route}/${this.axisId}`;
	}

	get part() {
		return this.panel.part;
	}

	@computed get axis() {
		return this.query.axisById(this.axisId)
	}

	component: IAccordionComponent;

	@computed get clauseAxis() {
		return this.panel.clause.axes.get(this.axisId.toString())
	}

	logInfo() {
		console.table({
			              label: this.label,
			              areNoAvailableValuesSelected: this.areNoAvailableValuesSelected,
			              'areAllAvailableSelected': this.areAllAvailableSelected,
			              areSomeButNotAllSelected: this.areSomeButNotAllSelected,
			              indeterminate: this.indeterminate,
			              availableAndSelected: this.availableAndSelected,
			              isOnlyAvailableItemSelected: this.isOnlyAvailableItemSelected,
			              available: this.available,
			              selected: this.selected,
		              })
	}

	@action toggleSortOrder() {
		const { sortOrder } = this;

		this.sortOrder = sortOrder === 'initial' ? 'asc' : sortOrder === 'asc' ? 'desc' : 'initial'
	}

	get id() {
		return this.axis.id
	}

	get label() {
		return this.axis.label
	}

	// @observable values : Array<AccordionValue>;
	@computed get sortedValues(): Array<AccordionValue> {
		return this.sort();
	}

	@computed get showSortOrder() {
		return false
	} //return this.values.length > 0 }

	get allowInitialSortOrder() {
		return !_.isEqual(this.sort('initial').map(v => v.coordinate.id), this.sort('asc').map(v => v.coordinate.id));
	}

	@action resetSortOrder() {
		this.setSortOrder(this.allowInitialSortOrder ? 'initial' : 'asc');
	}

	@action setSortOrder(sortOrder: SortOrder) {
		this.sortOrder =
			!this.allowInitialSortOrder && sortOrder === 'initial' ? 'asc' : sortOrder;
		this.sort(this.sortOrder);
	}

	sort = (sortOrder?: SortOrder) => {
		sortOrder = sortOrder ? sortOrder : this.sortOrder;

		//return _.orderBy(this.values, [sortOrder === 'initial' ? 'coordinate.id' : 'coordinate.label']);

		// Removing sort by availability
		return _.orderBy(this.values.slice(),
		                 ['available', sortOrder === 'initial' ? 'coordinate.id' : 'coordinate.label'],
		                 ['desc', sortOrder === 'initial' ? 'asc' : sortOrder]
		);
	}

	@observable sortOrder: SortOrder = 'asc';

	@computed get unavailable() {
		return _.every(this.values, v => !v.available);
	}

	@computed get areAllAvailableSelected() {
		return this.availableAndSelected === this.available;
	}

	@computed get areSomeButNotAllSelected() {
		return this.selected > 0 && this.selected < this.values.length;
	}

	@computed get indeterminate() {
		return this.selected < this.values.length && this.selected > 0 && !this.areAllAvailableSelected;
	}

	get hasChoicesToMake() {
		return !this.unavailable && !this.isOnlyAvailableItemSelected
	}

	get isImplied() {
		return this.available == 0 || this.isOnlyAvailableItemSelected
	}

	@computed get isOnlyAvailableItemSelected() {
		return this.available === 1 && _.every(this.values, v => !v.available || v.available && v.selected);
	}

	@computed get areNoAvailableValuesSelected() {
		return this.availableAndSelected === 0 && this.available > 0;
	}

	@observable selected: number;
	@observable available: number;
	@observable availableAndSelected: number;

	get canCollapse() {
		return !this.areNoAvailableValuesSelected
	}

	selectValues = async (operation: SelectOperation, values?: AccordionValue[]) => {
		try {
			const { panel } = this;

			site.busy = true;
			const currentlyNothingSelected = this.areNoAvailableValuesSelected;

			await utility.requestAnimationFrame();

			// runInAction: Update internal coordinate values
			runInAction(() => {
				switch (operation) {
					case 'All': {
						if (!this.areAllAvailableSelected) {
							this.values.forEach(v => {
								if (v.available || _.isEmpty(values)) {
									v.selected = true;
								}
							});
						}

						values = [];

						break;
					}

					case 'None': {
						if (this.selected !== 0) {
							this.values.forEach(v => {
								v.selected = false;
							});
						}

						values = [];

						break;
					}

					case 'Only': {
						//this.clauseAxis.selected = [];
						this.values.forEach(v => v.selected = false)
						for (const v of values) {
							if (v.available) {
								//this.clauseAxis.selected.push(v.coordinate.id);
								v.selected = true;
							}
						}

						break;
					}

					case 'Except': {
						this.values.forEach(v => v.selected = true)
						for (const v of values) {
							if (v.available) {
								v.selected = false;
							}
						}

						break;
					}

					case 'With': {
						for (const v of values) {
							if (v.available) {
								v.selected = true;
							}
						}

						break;
					}

					case 'Without': {
						for (const v of values) {
							if (v.available) {
								v.selected = false;
							}
						}

						break;
					}

					default: {
						console.error('Unhandled select operation - ' + operation)
					}
				}
			});

			let result = null;

			await utility.requestAnimationFrame(); // Allow the UI to update

			this.updateDerivedValues();

			switch (this.part) {
				case 'variables':
				case 'time-steps':
				case 'scenarios': {
					if (!this.areNoAvailableValuesSelected) {
						if (currentlyNothingSelected) {
							// We prevented earlier selection to avoid telling Julia that no items are selected, now do an 'only'
							result = await this.panel.clause.selectCoordinates('Only', this.axis, this.values.filter(v => v.selected).map(v => v.coordinate));
						}
						else {
							// Regular operation
							result = await this.panel.clause.selectCoordinates(operation, this.axis, values.map(v => v.coordinate));
						}
					}
					else {
						console.warn("Don't tell Julia we don't have any values available")
					}

					break;
				}

				case 'views': {
					//dispatch(api.query.views.selectViews(panel.queryId, values.map(v => v.coordinate.label) as string[], panel.checkedLabels));
					break;
				}
			}
		}
		finally {
			site.busy = false;
		}
	}

	toggleValue = (value) => {
		const { axis: { id }, part, areNoAvailableValuesSelected } = this;

		this.selectValues(
			value.selected
				? "Without"
				: part === 'variables' && areNoAvailableValuesSelected         // When we have nothing selected treat selection as an 'only' operation
				? "Only"
				: "With",
			[value]
		)
	}

	@observable _everExpanded;

	@computed get everExpanded() {
		return this.expanded || this._everExpanded
	}

	@observable expanded = false;

	@action collapse = () => {
		this.expanded = false;
	}

	@action expand = () => {
		this.expanded = true;
	}

	@action toggleExpandCollapse = () => {
		this.expanded = !this.expanded;
		Analytics.event({category: 'Query', action: `Expand/collapse axis (query: ${this.query.id}, axis: ${this.id})`})
	}
}
