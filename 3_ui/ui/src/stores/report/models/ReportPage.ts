import { IReportItemSerializable } from "./models";
import { observable, action, computed, override, makeObservable } from "mobx";
import { ReportItem } from "./ReportItem";
import { IReportQuerySerializable, ReportQuery } from "./ReportQuery";
import { ReportText } from "./ReportText";
import { SimulationSlot, SimulationSlotGuid } from "./SimulationSlot";
import { utility } from 'stores';

export enum ReportPageLayout {
	horizontal, vertical, masterDetail, grid, userDefined
}

export interface IReportPage {
	layout: ReportPageLayout;
	orientation: 'portrait' | 'landscape';
}

export class ReportPage extends ReportItem implements IReportPage {

	type = 'page';

	@observable layout: ReportPageLayout;
	@observable orientation: 'portrait' | 'landscape';

	constructor(o, serialized?: IReportItemSerializable) {
        super(o, serialized, ['expanded', 'orientation', 'layout']);

        makeObservable(this);

        this.expanded = true;
        this.icon = 'page-layout';

        if (!this.layout) this.layout = ReportPageLayout.horizontal;
        if (!this.orientation) this.orientation = 'portrait';
    }

	@observable _deleteIndex = null;  // Used during deletion so that cards can still render while animating
	@override get index() {
		return this._deleteIndex ? this._deleteIndex : this.report.pages.indexOf(this);
	}

	toString() {
		return `${this.label}`;
	}



	@computed
	get reportQueries() {
		return this.children.filter(c => c instanceof ReportQuery) as Array<ReportQuery>
	};


	@action addReportQuery = (simulationSlotIds ?: SimulationSlotGuid[]) => {
		const reportQuery = new ReportQuery({ report: this.report, parent: this, simulationSlotIds: simulationSlotIds });

		this.children.push(reportQuery);

		return reportQuery;
	}

	get clientUrl() {
		return `${this.report.clientUrl}/pages/${this.id}`
	}

	@action addText = () => {
		this.children.push(new ReportText({ report: this.report, parent: this, name: `Text` }));
	}

	@action duplicate = async (addToParent = false) => {
		const newPage = new ReportPage({ report: this.report, parent: this.parent, name: this.name ? `Duplicate of ${this.name}` : null });
		newPage.layout = this.layout;
		newPage.orientation = this.orientation;

		// Duplicate children
		for (var c of this.children.slice()) {
			const newItem = await c.duplicate();
			if (newItem) {
				newPage.children.push(newItem)
			}
		}

		addToParent && this.parent.children.spliceWithArray(this.index + 1, 0,[newPage]);

		return newPage;
	}

	get tooltip() {
		return `${this.index + 1} of ${this.parent.children.length + 1}`;
	}

	@override get label() {
		return _.isEmpty(this.name)
			? `Page ${this.index + 1}`
			: this.name;
	}

	@override delete = () => {
		const { parent } = this;

		this._deleteIndex = this.index;

		if (parent) {
			parent.children.remove(this);
		}
	}

	isLayoutValid = (layout: ReportPageLayout) => {
		if (!this.children) return false;

		switch (layout) {
			case ReportPageLayout.userDefined:
			case ReportPageLayout.horizontal:
			case ReportPageLayout.vertical: {
				return true;
			}

			case ReportPageLayout.masterDetail: {
				return this.children.length == 3;
			}

			case ReportPageLayout.grid: {
				return this.children.length == 4;
			}
		}

		return
	}

	@action setLayout = (layout?: ReportPageLayout) => {
		if (layout == null) {
			if (this.layout == ReportPageLayout.userDefined) {
				layout = ReportPageLayout.horizontal;
			}
			else {
				layout = this.layout + 1;
			}

			const numEnums = utility.enumerateEnum(ReportPageLayout).length;

			while (!this.isLayoutValid(layout)) {
				layout++;
				if (layout == ReportPageLayout.userDefined || layout > numEnums) {
					layout = ReportPageLayout.horizontal;
					break;
				}
			}
		}

		if (this.layout != layout) {
			this.layout = layout;
		}
	}

	static layoutDescriptors = {
		[ReportPageLayout.horizontal]: { label: 'Horizontal', icon: 'horizontal-distribution' },
		[ReportPageLayout.vertical]: { label: 'Vertical', icon: 'vertical-distribution' },
		[ReportPageLayout.masterDetail]: { label: 'Master-Detail (V)', icon: 'page-layout' },
		[ReportPageLayout.grid]: { label: 'Grid', icon: 'grid-view' },
		[ReportPageLayout.userDefined]: { label: 'User-Defined', icon: 'random' }
	}
}

