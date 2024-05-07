import { Report } from "./Report";
import { ReportPage } from "./ReportPage";

export class ReportNavigation {
	constructor(public report : Report) {}

	first = () => {
		const {report, report: {selectedItem}} = this;
		report.selectedItem = report;
	}

	last = () => {
		const {report, report: {selectedItem}} = this;
		report.selectedItem = _.last(report.pages);
	}
}