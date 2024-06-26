import {reportStore} from 'stores/report';
import {user} from 'stores/user';

export class SiteActions {
	newReport = async (navigate = true) => {
		let name = `${user.currentUser.name}'s Report`;

		// Make sure the name is unique
		const autoReports = reportStore.myReports.filter(r => r.name.startsWith(name));
		if (autoReports.length > 0) {
			let i = autoReports.length + 1;

			let newReportName = `${name} (${i})`;
			while (_.some(reportStore.myReports, r => r.name == newReportName)) {
				i++;
				newReportName = `${name} (${i})`;
			}

			name = newReportName;
		}

		const report = await reportStore.createReport(name);

		if (navigate) { report.navigateTo() }
		return report;
	}
}