import { Color, ReportQuery, ReportItem, ReportLayoutManagerController, ReportGuid, ReportPage } from './';
import { action, autorun, computed, observable, override, makeObservable } from 'mobx';
import type { SimulationGuid } from 'stores';
import { routing, settings, reportStore, Simulation, simulationStore, user, site } from 'stores';
import { IReportDescriptor, IReportItemSerializable } from './';
import { SimulationSlot, ISimulationSlot, SimulationSlotGuid } from "./SimulationSlot";
import { ReportNavigation } from "./ReportNavigation";
import { ReportFolder } from "./ReportFolder";
import type { JuliaUser } from "../../user/User";
import { waitUntil } from 'utility'
import {Icon} from 'semantic-ui-react';

export interface IReportSerializable extends IReportItemSerializable {
	simulationSlots?: ISimulationSlot[];
}

export class Report extends ReportItem implements IReportDescriptor {
	static ObjectType = "Report";

	@observable linkColors = observable.map<Color>();
	@observable linkColorPalette = ['#7cb5ec', '#90ed7d', '#434348', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']

	@observable simulationSlots = observable.array<SimulationSlot>([]);

	type = 'report';
	icon = 'book';

	@observable busy = false;  // Todo - remove once async support exists in backend

	@computed
	get pages(): Array<ReportPage> {
		return this.children.filter(c => c instanceof ReportPage) as Array<ReportPage>;
	}

	navigate: ReportNavigation;
	serializationPromise: Promise<string>;

	navigateTo = () => routing.push(this.clientUrl);

	constructor(name = 'Query Report', serialized?: IReportSerializable) {
        super({ name: name, type: 'report' }, serialized, ['simulationSlots']);
        makeObservable(this);
        this.report = this;
        this.selectedItem = this;
        Object.assign(this, serialized);  // Doesn't work in base class due to default booleans

        if (serialized && serialized.simulationSlots) {
			this.simulationSlots.replace(serialized.simulationSlots.map(slot => new SimulationSlot(this, slot)))
		}

        this.navigate = new ReportNavigation(this);

        this.serializableFields.push('createdBy')

        let first = true;
        this._toDispose.push(
			autorun( () => {
				const touchAllProps = JSON.stringify(this);

				if (first) {
					first = false
				}
				else {
					this.serializationPromise = reportStore.put<string>(this);
				}
			}, {name: `Serialize report to backend when it changes`}))
    }

	static clientUrlFor(slug?: string) {
		return `${routing.urls.reportBrowser}/${slug ? slug : ''}`;
	}

	private _toDispose = [];


	static defaults = {
		newQuery: (report: Report, parent: ReportItem) => new ReportQuery({
			                                                                  report: report,
			                                                                  parent: parent,
			                                                                  name: settings.query.defaultQueryName
		                                                                  }),
		newPage: (report: Report, parent: ReportItem) => new ReportPage({
			                                                                report: report,
			                                                                parent: parent,
			                                                                name: 'New Page', type: 'page'
		                                                                }),
		newFolder: (report: Report, parent: ReportItem) => new ReportFolder({
			                                                                    report: report,
			                                                                    parent: parent,
			                                                                    name: 'New Folder', type: 'folder'
		                                                                    })
	}

	get createdByUser(): JuliaUser {
		return user.users.get(this.createdBy)
	}

	@action export = () => {
		throw new Error('report.duplicate() is NYI');
	}

	@action duplicate = async (navigateToNewReport?: boolean) => {
		const report = await reportStore.createReport(`Duplicate of ${this.name}`);

		const simSlotMappings = {};

		for (let slot of this.simulationSlots) {
			const newSlot = new SimulationSlot(report, _.omit(slot, ['id', 'simulation']));
			report.simulationSlots.push(newSlot);
			simSlotMappings[slot.id] = newSlot.id;
		}

		// const querySlotMappings = {};
		// this.querySlots.forEach(slot => {
		// 	const newSlot = new QuerySlot(report, Object.assign(_.omit(slot, ['id', 'simulationSlotId', 'simulationSlot', 'query', 'queryId', 'label', 'errors', 'simulation']),
		// 	                                                    { simulationSlotId: simSlotMappings[slot.simulationSlotId] }));
		// 	report.querySlots.push(newSlot);
		// 	querySlotMappings[slot.id] = newSlot.id;
		// })

		const pageMappings = {};
		for (let page of this.pages) {
			const newPage = new ReportPage(report);
			Object.assign(newPage, _.omit(page, ['id', 'children', 'clientUrl', 'tooltip', 'label']));

			report.children.push(newPage);

			for (let c of page.children) {
				if (c instanceof ReportQuery) {
					const newReportQuery = newPage.addReportQuery(c.simulationSlotIds.map(id => simSlotMappings[id]));
					newReportQuery.name = c.name;
					await waitUntil(() => newReportQuery.query != null, 30000);

					// Reset the query to match that of our duplicated query
					newReportQuery.query.reset()
				}

				console.warn('clone nyi')
				//newPage.children.push(c.clone());
			}
		}

		if (navigateToNewReport) {
			report.navigateTo();
		}
		return report;
	}

	@computed
	get slug(): string {
		return this.name.toLowerCase().replace("'s", '').replace(/ /g, '-');
	}

	//@observable slug: string;

	@computed
	get clientUrl() {
		const { id, slug } = this;

		//return Report.clientUrlFor(this.slug);
		return Report.clientUrlFor(this.id);
	}

	@computed
	get simulationsUrl() {
		return `${this.clientUrl}?selectedItem=simulations`
	}

	reportSimulationUrl(sim: Simulation) {
		return `${this.clientUrl}?selectedItem=${sim.id}`
	}

	@action
	addSimulationSlot(): SimulationSlot {
		const slot = new SimulationSlot(this, { name: `Simulation ${this.simulationSlots.length + 1}` });
		if (simulationStore.simulations.size == 1) {
			slot.simulationId = simulationStore.simulations.values()[0].id;
		}
		this.simulationSlots.push(slot);

		return slot;
	}

	findSimulationSlot(simulationSlotId: SimulationSlotGuid) {
		return this.simulationSlots.find((slot) => slot.id == simulationSlotId)
	}

	@computed
	get simIds(): SimulationGuid[] {
		const queryViewItems = this.enumerateTree().filter(i => i instanceof ReportQuery);
		let simIds = [];

		queryViewItems.forEach((qvi: ReportQuery) => {
			const { query, queryResult: qr } = qvi;

			if (qr) {
				simIds.push(qr.descriptor.simulation_id);
			} else if (query) simIds.push(...query.simulationIds);
		});
		return _.uniq(simIds);
	}

	@computed
	get querySlots() : ReportQuery[] {
		return _.flatMap(this.pages.map(p => p.reportQueries.slice()))
	}

	findQuerySlot(id: string) {
		return this.querySlots.find(s => s.id == id);
	}

	@action newQueryForSimulation = (simulationSlot: SimulationSlot, p?: ReportPage) => {
		const page = p ? p : this.addPage();
		page.addReportQuery([simulationSlot.id])
	}

	@action addReportQuery = (p?: ReportPage) => {
		const page = p ? p : this.addPage();
		page.addReportQuery()
	}

	@action addPage = (index?: number) => {
		const page = new ReportPage({ report: this, parent: this });
		if (!index) {
			this.children.push(page);
		}
		else {
			this.children.splice(index, 0, page);
		}
		return page;
	}

	@action movePage = (initialIndex: number, newIndex: number) => {
		assert(initialIndex < this.pages.length && newIndex < this.pages.length);
		this.children.move(initialIndex, newIndex)
	}

	layoutController: ReportLayoutManagerController;

	findItem = (id: ReportGuid): ReportItem => {
		return this.enumerateTree().find(i => i.id === id);
	}

	indexInParent = (id: string) => {
		let parent = this.findParentOfItem(id);
		if (parent == null) {
			return null
		}

		return parent.children.map(item => item.id).indexOf(id);
	}

	findParentOfItem = (itemId: string, report?: Report): ReportItem => {
		return null;
		//report = !report ? this.currentReport : report;

		//return this.enumerateReportTree(report).find((item: ReportItem) => _.some(item.children, (c: ReportItem) => c.id === itemId));
	}

	@action promptDelete = async () => {
		if (await site.confirm(`Delete '${this.name}'?`, 'This action cannot be undone.', <Icon size='large' name='trash'/>, "Delete Report")) {
			if (routing.isActive(this.clientUrl)) {
				reportStore.navigateToBrowser();
			}
			this.delete();
		}
	}

	@override delete = async () => {
		this._toDispose.forEach(f => f())
		return reportStore.delete(this.id);
	}

	@computed
	get areAllPagesExpanded() {
		return _.every(this.pages, p => p.expanded);
	}

	@action toggleExpandAll = () => {
		const { areAllPagesExpanded, pages } = this;
		this.pages.forEach(p => p.expanded = !areAllPagesExpanded)
	}

	/* Used to signal around the UI in response to things like the user mousing over an item - not serialized */
	@observable selectedItem?: ReportItem;
	@observable mousedOverTreeItem?: ReportItem;
	@observable editingItem?: ReportItem;

}

