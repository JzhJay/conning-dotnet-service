import { IReportItemSerializable } from "./models";
import { observable, action, computed, makeObservable } from "mobx";
import { ReportItem } from "./ReportItem";

export class ReportText extends ReportItem {
	constructor(o, serialized?: IReportItemSerializable) {
        super(o, serialized, ['text'])
        makeObservable(this);
    }

	icon = 'annotation';
	type = 'text';

	@observable text : string;

	@action duplicate = async (addToParent = false) => {
		const newText = new ReportText({ report: this.report, parent: this.parent, name: `Duplicate of ${this.name}` });
		newText.text = this.text;

		addToParent && this.parent.children.push(newText)
		return newText;
	}

	@action clear = () => {
		this.text = '';
	}

	@computed
	get errors() {
		return {
			emptyText: _.isEmpty(this.text)
		}
	}
}
