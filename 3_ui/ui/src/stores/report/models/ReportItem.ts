import { DuplicateDirection, IReportDescriptor, IReportItemSerializable, ReportGuid } from './models';
import type { SiteLocation } from 'stores';
import { settings, routing, RestLinks, site, reportStore, Report, ReportItemType, Simulation, UserId } from 'stores';
import type { IObservableArray } from 'mobx';
import { action, computed, isObservableArray, observable, makeObservable } from 'mobx';
import { ItemConfig } from "golden-layout";


export abstract class ReportItem implements IReportItemSerializable {
	serializableFields = ['id', 'type', 'children', 'name', 'expanded', 'includeInExport', 'isPoppedOut', 'goldenLayoutConfig', 'createdTime', 'modifiedTime', 'createdBy'];

	id: string;
	abstract type: ReportItemType | string;
	icon = '';
	@observable children: IObservableArray<ReportItem> = observable.array([]);
	@observable name: string;
	@observable expanded: boolean;
	@observable includeInExport: boolean;
	@observable isPoppedOut: boolean;
	createdTime: Date = new Date();
	@observable modifiedTime: Date = new Date();
	@observable goldenLayoutConfig: string;
	createdBy?: UserId;

	report?: Report;
	parent?: ReportItem;

	constructor(o: { report?: Report, parent?: ReportItem, name?: string, type?: ReportItemType }, serialized?: IReportItemSerializable, additionalSerializedFields?: string[]) {
        makeObservable(this);
        this.id = uuid.v4();
        Object.assign(this, o);

        if (additionalSerializedFields) {
			this.serializableFields.push(...additionalSerializedFields);
		}

        if (serialized) {
			for (var field of this.serializableFields) {
				if (field != 'children' && serialized[field] != null) {
					this[field] = serialized[field];
				}
			}
		}
    }

	navigateTo = () => {
		routing.push(this.clientUrl)
	}

	navigateToPrevious = () => {
		const { report, index, parent } = this;

		if (index > 0) {
			parent.children[index - 1].navigateTo();
		}
		else {
			parent.navigateTo();
		}
	}

	navigateToNext = () => {
		const { report, index, parent } = this;

		if (report.selectedItem == report) {
			// Go to the first page

			report.pages[0].navigateTo();
		}
		else {
			if (index + 1 < parent.children.length) {
				parent.children[index + 1].navigateTo();
			}
			else {
				parent.navigateToNext();
			}
		}
	}

	get tooltip() {
		return this.label;
	}

	@computed get index() {
		return this.parent ? this.parent.children.indexOf(this) : 0;
	}

	@computed
	get isLastChild() {
		return this.index == this.parent.children.length - 1
	}

	toJSON = () => {
		return _.pick(this, this.serializableFields);
	};

	get clientUrl() {
		return `${this.report.clientUrl}?selectedItem=${this.id}`
	}

	enumerateTree = (start?: ReportItem): ReportItem[] => {
		start = start || this;

		if (start.children == null || start.children.length === 0) {
			return [start];
		}
		else {
			return _.flatten([start, _.flatMap(start.children.filter(c => c != null), c => c.enumerateTree(c))]);
		}
	}

	@computed
	get enumeratedTree() {
		return this.enumerateTree()
	}

	enumerateLayoutContentTree = (rootContent: ItemConfig) => {
		if (rootContent.content == null || rootContent.content.length === 0) {
			return [rootContent];
		}
		else {
			return _.flatten([rootContent, _.flatMap(rootContent.content, c => this.enumerateLayoutContentTree(c))]);
		}
	}

	isInSubtree = (id: string) => {
		return _.find(this.enumeratedTree, (item: ReportItem) => (item.id === id)) != null;
	}

	contains = (descendent: ReportItem) => {
		return _.some(this.enumeratedTree, (item: ReportItem) => (item.id === descendent.id));
	}

	isParentOf = (id: string) => {
		return _.find(this.children, (child: ReportItem) => child.id === id) != null;
	}

	findItemAndParent = (parent: ReportItem, item: ReportItem) => {
		if (parent.children != null) {
			parent.children.forEach((child, i) => {
				if (item === child) {
					return { parent: this, i: i }
				} else {
					let result = this.findItemAndParent(child, item);
					if (result != null) {
						return result;
					}
				}
			});
		}

		return null;
	}

	expandSubtree = () => {
		console.warn('NYI');

	}

	collapseSubtree = () => {
		console.warn('NYI');

	}

	clone = (direction: DuplicateDirection) => {
		//const newItem                    = Object.assign({}, item, {id: uuid.v4()});
		//let store                        = getState();
		//let newStore: ReportBuilderStore = currentReport.addReportItem(api.report.findParentOfItem(item.id, store.report.currentReport).id, newItem);
		//let newQueryViewReportItem                 = helpers.findItemById(newItem.id, newStore.currentReport) as QueryViewReportItem;

		console.warn('NYI');
		return null;
	}

	duplicate = async (addToParent = false) : Promise<ReportItem> => {
		return null;
	}

	@computed get label() {
		return this.name ? this.name : '';
	}

	@action toggleExpanded = () => {
		this.expanded = !this.expanded;
	}

	@action delete = () => {
		const { parent } = this;

		if (parent) {
			parent.children.remove(this);
		}
	}

	@observable renamingFrom: SiteLocation;
	@action promptRename = async () => {
		const newName = prompt(`Rename '${this.label}' to:`);
		this.name = newName;
	}
}
