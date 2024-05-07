import { IReportItemSerializable } from "./models";
import { observable, action, computed, makeObservable } from "mobx";
import { ReportItem } from "./ReportItem";
import { IReportQuerySerializable, ReportQuery } from "./ReportQuery";


export class ReportFolder extends ReportItem {
	constructor(o, serialized?: IReportItemSerializable) {
        super(o, serialized, ['expanded']);
        makeObservable(this);
        this.icon = 'folder';
        this.expanded = true;
    }

	type = 'folder'

	@action duplicate = async (addToParent = false) => {
		const newFolder = new ReportFolder({ report: this.report, parent: this.parent, name: `Duplicate of ${this.name}` });

		for (var c of this.children.slice()) {
			const newItem = await c.duplicate();
			if (newItem) {
				newFolder.children.push(newItem)
			}
		}

		addToParent && this.parent.children.spliceWithArray(this.index + 1, 0,[newFolder]);

		return newFolder;
	}
}
