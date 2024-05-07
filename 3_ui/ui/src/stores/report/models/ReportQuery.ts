import { DuplicateDirection, IReportItemSerializable } from "./models";
import {
    observable,
    action,
    computed,
    runInAction,
    autorun,
    reaction,
    override,
    makeObservable,
} from "mobx";
import {mobx} from 'components'
import { ReportItem } from "./ReportItem";
import { queryStore, queryResultStore, QueryViewUserOptions, simulationStore, site, Query, viewDescriptors } from "stores";
import type { QueryViewName } from 'stores/query';
import { SimulationSlotGuid } from "./SimulationSlot";
import { ReportPage } from "./ReportPage";
import { Intent } from '@blueprintjs/core';

export type ReportQueryStatus = 'creating' | 'created' | 'loading' | 'starting' | 'started' | 'renaming' | 'renamed' | 'switchingSims' | 'switchedSims' | 'duplicating' | 'duplicated' | 'deleting' | 'deleted' | 'error';

export interface IReportQuerySerializable extends IReportItemSerializable {
	simulationSlotIds?: SimulationSlotGuid[];
}

const msBetweenStatusUpdates = 3000;

export class ReportQuery extends ReportItem implements IReportQuerySerializable {
	@observable queryId?: string;
	@observable simulationSlotIds: SimulationSlotGuid[];
	@observable status?: ReportQueryStatus;

	@observable userOptions = observable.map<QueryViewUserOptions>();
	            type        = 'query';
	            icon    = 'search';

	@observable dirty = false;

	constructor(o, serialized?: IReportQuerySerializable) {
        super(o, serialized, ['simulationSlotIds', 'queryId', 'showSettings', 'userOptions', '_view', 'dirty'])

        makeObservable(this);

        if (!this.simulationSlotIds) {
			this.simulationSlotIds = []
		}

        //this._toDispose.push(
        reaction(() => ({ simulationIds: this.simulationIds /*, simulationSlotIds: this.simulationSlotIds, name: this.name */ }),
		         () => {

			         // If simulation ids changed but slots did not, then the report simulation have been globally changed
			         //this.dirty = true;
			         this.manageQuerySession();
		         }
		);
        //));

        this.manageQuerySession();
    }

	@override delete = async () => {
		// Remove associated query?
		// Todo - discuss behaviors, perhaps prompt the user in some cases?  Is this query used in other reports?  Are pages open to it in standalone?
		// Also will likely be dependent upon how the query ended up here.  If we added it/dragged it in from a standalone query, don't delete it.
		const { queryId, query } = this;
		if (queryId) {
			queryStore.deleteQueryDescriptor(queryId);
		}

		this.page.children.remove(this);
	}

	@computed
	get page() {
		return this.parent as ReportPage
	}

	@computed
	get clientUrl() {
		const { query, report, view } = this;
		return `${report.clientUrl}/query/${this.id}?view=${view}`;

		//return !query ? null : !query.queryResult ? query.clientUrl : query.queryResult.clientUrl;
	}

	@computed
	get viewDescriptor() {
		return viewDescriptors[this.view];
	}

	@observable _view: QueryViewName;

	@computed
	get view() {
		const { _view, query, queryResult } = this;

		if (_view) {
			return _view;
		}
		if (queryResult) {
			return queryResult.currentView
		}
		else {
			return 'query';
		}
	}

	@computed
	get loaded() {
		return (!this.queryId || this.query != null) && (!this.query.hasResult || this.queryResult != null);
	}

	setView = async (view?: QueryViewName) => {
		this._view = view;

		const { queryId, query } = this;

		if (queryId) {
			let q = query ? query : await queryStore.getQuery(queryId);

			if (q.hasResult) {
				let qr = q.queryResult ? q.queryResult : await queryResultStore.loadResult(q.id);
				qr.setCurrentView(view)
			}
			else {
				if (view != 'query') {
					q.desiredView = view;
				}
			}
		}
	}


	routeFor = (view?: QueryViewName) => {
		const { query, report } = this;
		return `${report.clientUrl}/query/${this.id}?view=${view ? view : this.view}`;
	}

	@computed
	get query() {
		// if (!this.queryId && this.simulation && this.status != 'creatingQuery') {
		// 	setTimeout(this.createAssociatedQuerySession, 0);
		// }

		const { queryId } = this;
		const result      = queryId ? queryStore.querySessions.get(queryId) : null;

		if (queryId && !result) {
			return queryStore.descriptors.get(queryId);
		}

		return result;
	}

	@computed
	get queryDescriptor() {
		const { queryId } = this;
		return queryId ? queryStore.descriptors.get(queryId) : null;
	}

	@computed
	get queryResult() {
		const { query } = this;

		if (query && query.hasResult) {
			if (!queryResultStore.loadedResults.has(query.id)) {
				setTimeout(() => queryResultStore.loadResult(query.id), 0);
			}

			return queryResultStore.loadedResults.get(query.id);
		}
		return null;
	}

	@computed
	get simulationIds() {
		return this.simulations.map(s => s.id);
	}

	@action setStatusThenClearIt = (original: ReportQueryStatus) => {
		this.status = original;
		setTimeout(() => {
			if (this.status == original) {
				this.status = null;
			}
		}, msBetweenStatusUpdates)
	}

	manageQuerySession = async () => {
		const { simulationIds, simulationSlotIds, simulations, label, name, status, report, setStatusThenClearIt } = this;

		if (!report.busy && simulationStore.hasLoadedDescriptors) {
			try {
				if (simulationIds.length > 0 && simulations.length == simulationSlotIds.length) {
					if (!this.queryId && this.status != 'creating' && this.status != 'switchingSims' && this.status != 'error') {
						report.busy = true;
						this.status = 'creating';
						console.info(`Creating associated query session for report '${report.name}' - query slot '${label}' - simulation(s) ${simulations.map(s => s.name).join(', ')}...`);
						const newQueryId = await queryStore.createQuerySessionDescriptor(label, simulationIds)
						await queryStore.startQuerySession(newQueryId);

						console.info(`Query Created - query ID ${newQueryId}`);

						this.queryId = newQueryId;
						setStatusThenClearIt('created')
					}
					else if (this.status != 'switchingSims' && this.query &&
					         !_.isEqual(this.query.simulationIds.slice(), simulationIds)) {
						this.status = 'switchingSims';

						console.info(`Switching simulation for query slot '${name}' - simulation(s) ${simulationIds.join(', ')}...`);
						await this.query.switchSimulations(simulationIds);

						setStatusThenClearIt('switchedSims');
					}
				}
				// We have a query session and they just removed the simulationSlot
				else if (simulationSlotIds.length == 0 && this.queryId) {
					report.busy = true;
					console.log('Removing associated query for query slot')
					this.status = 'deleting';

					this.query && (await this.query.delete());
					this.queryId = null;
					setStatusThenClearIt('deleted');
				}
				else {
					this.status = null;
				}

				if (this.query && name && this.query.name != name) {
					this.status = 'renaming';
					await this.query.rename(name);
					setStatusThenClearIt('renamed');
				}
				// Start up the associated query session if needed
				if (this.queryId && !(this.query instanceof Query) && status != 'error') {
					report.busy = true;

					if (this.query && this.query.hasSession) {
						this.status = 'loading'
					}
					else {
						this.status = 'starting';
					}

					try {
						const query = await queryStore.startQuerySession(this.queryId);
						setStatusThenClearIt('started');
					}
					catch (err) {
						console.error('Unable to load query ', this.queryId);

						// If the query wasn't found (it's been deleted)
						//this.queryId = null;
						this.status = "error";
						if (err.status == 404) {
							site.toaster.show({ message: 'Creating a new query...', intent: Intent.PRIMARY })
							this.status  = null;
							this.queryId = null;

							// Create a new one
							return await this.manageQuerySession();
						}
						else {
							throw err;
						}
					}
				}
			}
			finally {
				report.busy = false;
				this.dirty  = false;
			}
		}

		return this.query;
	}

	@action duplicate = async (addToParent: boolean = false) => {
		site.busy   = true;
		this.status = 'duplicating';

		try {
			const { report, index, simulationSlotIds, name, query } = this;

			let queryId = null;

			if (query) {
				// Duplicate the query
				const newQuery = await query.duplicate();
				queryId        = newQuery.id;
			}
			const newSlot = new ReportQuery({ report: this.report, parent: this.parent, name: `Duplicate of ${name}`, simulationSlotIds: simulationSlotIds, queryId: queryId })
			report.querySlots.splice(index + 1, 0, newSlot);

			newSlot.setView(this.view);

			if (addToParent) {
				let page = this.parent as ReportPage;
				page.children.push(newSlot);
			}

			return newSlot;
		}
		finally {
			site.busy   = false;
			this.status = null;
		}
	}

	@computed
	get simulationSlots() {
		const { simulationSlotIds } = this;
		return simulationSlotIds ? simulationSlotIds.map(id => this.report.simulationSlots.find(slot => slot.id == id)) : [];
	}

	@computed
	get simulations() {
		return this.simulationSlots ? this.simulationSlots.map(slot => slot ? slot.simulation : null).filter(s => s) : []
	}

	@override get label() {
		const { name, report: { querySlots } } = this;
		return name ? name : 'Untitled Query';  // `Query ${querySlots.indexOf(this) + 1}`;
	}

	unlink = () => {

	}

	get canUnlink(): boolean {
		return this.queryId == null
			? false
			: this.enumerateTree().filter((i: ReportQuery) => i.type === 'view' && i.queryId === this.queryId).length > 1;
	}

	clone = (direction: DuplicateDirection) => {
		//const newItem                    = Object.assign({}, item, {id: uuid.v4()});
		//let store                        = getState();
		//let newStore: ReportBuilderStore = currentReport.addReportItem(api.report.findParentOfItem(item.id, store.report.currentReport).id, newItem);
		//let newQueryViewReportItem                 = helpers.findItemById(newItem.id, newStore.currentReport) as QueryViewReportItem;

		let report = this.report;
		let page   = this.parent as ReportPage;
		return page.addReportQuery(this.simulationSlotIds)
	}
}
