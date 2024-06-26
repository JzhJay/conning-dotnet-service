// import { ReportPage, Report, SimulationSlotGuid } from "./";
// import { QueryGuid, queryStore, simulationStore, site } from 'stores';
//
// import { action, autorun, computed, observable, autorunAsync, runInAction } from "mobx";
//
// export type QuerySlotGuid = string;
//
// export interface IQuerySlot {
// 	simulationSlotId?: SimulationSlotGuid;
// 	queryId?: QueryGuid;
// 	id?: QuerySlotGuid;
// 	name?: string;
// }
//
// export type QuerySlotStatus = 'creatingQuery' |	'startingQuerySession' | 'renamingQuery' | 'switchingQuerySimulation' | 'duplicating' | 'cannotLoadQuery';
//
// export class QuerySlot implements IQuerySlot{
// 	id = uuid.v4();
//
// 	@observable queryId: QueryGuid;
// 	@observable slotId: SimulationSlotGuid;
// 	@observable simulationSlotId: SimulationSlotGuid;
// 	@observable name: string;
// 	@observable status?:QuerySlotStatus;
//
// 	@computed get busy() {
// 		const {status, query} = this;
// 		return (query && query.isRunning) || (status && status != 'cannotLoadQuery');
// 	}
//
// 	_toRemove = [];
// 	serializableFields = ['id', 'name', 'queryId', 'simulationSlotId'];
//
// 	toJSON = () => {
// 		return _.pick(this, this.serializableFields);
// 	};
//
// 	get report() { return this.page.report }
//
// 	constructor(public page: ReportPage, serialized: IQuerySlot) {
// 		Object.assign(this, serialized);
// 		const {report} = page;
// 		if (!this.simulationSlotId && report.simulationSlots.length == 1) {
// 			this.simulationSlotId = report.simulationSlots[0].id;
// 		}
// 	}
//
// 	@computed get clientUrl() {
// 		const {query, report} = this;
// 		return `${report.clientUrl}/query/${this.id}`;
//
// 		//return !query ? null : !query.queryResult ? query.clientUrl : query.queryResult.clientUrl;
// 	}
//
// 	@computed get query() {
// 		// if (!this.queryId && this.simulation && this.status != 'creatingQuery') {
// 		// 	setTimeout(this.createAssociatedQuerySession, 0);
// 		// }
//
// 		const {queryId} = this;
// 		const result = queryId ? queryStore.loadedQueries.get(queryId) : null;
//
// 		if (queryId && !result) {
// 			queryStore.startQuerySession(queryId);
// 		}
//
// 		return result;
// 	}
//
// 	@computed get queryDescriptor() {
// 		const {queryId} = this;
// 		return queryId ? queryStore.descriptors.get(queryId) : null;
// 	}
//
// 	@computed get queryResult() {
// 		return this.query ? this.query.queryResult : null;
// 	}
//
// 	@action delete = async () => {
// 		this._toRemove.forEach(f => f());
//
// 		// Remove associated query?
// 		// Todo - discuss behaviors, perhaps prompt the user in some cases?  Is this query used in other reports?  Are pages open to it in standalone?
// 		// Also will likely be dependent upon how the query ended up here.  If we added it/dragged it in from a standalone query, don't delete it.
// 		const {queryId, query} = this;
// 		if (queryId) {
// 			queryStore.deleteQueryDescriptor(queryId);
// 		}
//
// 		this.page.querySlots.remove(this);
// 	}
//
// 	createAssociatedQuerySession = () => {
// 		const { simulationSlotId, simulation, name, queryId, query, status, report } = this;
//
// 		runInAction(async () => {
// 			if (simulation && !_.isEmpty(name)) {
// 				if (!queryId && this.status != 'creatingQuery') {
// 					this.status = 'creatingQuery';
// 					console.info(`Creating associated query session for report '${report.name}' - query slot '${name}' - simulation ${simulation.name}`);
// 					const newQuery = await queryStore.createQuerySessionDescriptor(name, [simulation.id])
// 					await queryStore.startQuerySession(newQuery.id);
// 					this.queryId = newQuery.id;
// 					this.status = null;
// 				}
// 				else if (query) {
// 					if (query.simulation != simulation && this.status != 'switchingQuerySimulation') {
// 						this.status = 'switchingQuerySimulation';
//
// 						await query.switchSimulation(simulation);
//
// 						this.status = null;
// 						// // Todo use xiaoqi's new route
// 						// query.delete();
// 						// this.queryId = null;
// 						// this.createAssociatedQuerySession();
// 					}
// 				}
// 			}
// 			// We have a query session and they just removed the simulationSlot
// 			else if (!simulationSlotId && queryId) {
// 				query && query.delete();
// 				this.queryId = null;
// 			}
// 			else {
// 				this.status = null;
// 			}
//
// 			// Start up the associated query session if needed
// 			if (queryId && !query && status != 'cannotLoadQuery') {
// 				this.status = 'startingQuerySession';
//
// 				try {
// 					const query = await queryStore.startQuerySession(queryId);
// 					this.status = null;
// 				}
// 				catch (err) {
// 					console.log(err);
// 					// If the query wasn't found (it's been deleted)
// 					this.queryId = null;
// 					this.status = "cannotLoadQuery";
// 				}
// 			}
// 		});
// 	}
//
// 	@computed get index() {
// 		return this.page.querySlots.findIndex(s => s == this);
// 	}
//
// 	@action duplicate = async () => {
// 		site.busy = true;
// 		this.status = 'duplicating';
//
// 		try {
// 			const { report, index, simulationSlotId, name, query } = this;
//
// 			let queryId = null;
//
// 			if (query) {
// 				// Duplicate the query
// 				const newQuery = await query.duplicate();
// 				queryId = newQuery.id;
// 			}
// 			const newSlot = new QuerySlot(this.page, { name: `Duplicate of ${name}`, simulationSlotId: simulationSlotId, queryId: queryId })
// 			report.querySlots.splice(index + 1, 0, newSlot);
// 		}
// 		finally {
// 			site.busy = false;
// 			this.status = null;
// 		}
// 	}
//
// 	get simulationSlot() {
// 		const { simulationSlotId } = this;
// 		return simulationSlotId ? this.report.simulationSlots.find(slot => slot.id == simulationSlotId) : null;
// 	}
//
// 	get simulation() { return this.simulationSlot ? this.simulationSlot.simulation : null}
//
// 	@computed get errors() {
// 		return {
// 			name: this.name == null || this.name.length == 0,
// 			simulation: simulationStore.hasLoadedDescriptors && !this.simulation,
// 			cannotLoadQuery: this.status == 'cannotLoadQuery'
// 		}
// 	}
//
// 	@computed get label() {
// 		const { name, report: { querySlots } } = this;
// 		return name ? name : `Query Slot ${querySlots.indexOf(this) + 1}`;
// 	}
// }