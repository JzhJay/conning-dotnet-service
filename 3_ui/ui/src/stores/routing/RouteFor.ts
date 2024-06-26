import {RoutingStore} from './RoutingStore';
import {Query} from '../query/ui';
import {UserId} from '../user';
import {slugs} from '../';

export class RouteFor {
	constructor(private store : RoutingStore) {}

	runQueryInWindow = (q: Query) => `${this.store.urls.queryResult}?action=run-query&name=${q.name}&id=${q.id}`;

	query = (queryId?: string, view?: string) => {
		let result = `${this.queryBrowser}/${queryId ? queryId : ''}`;

		if (view) {
			result += `?view=${view}`;
		}

		return result;
	}

	get queryBrowser() { return  this.store.urls.query; }
	get userBrowser() { return this.store.urls.userBrowser; }
	get reportBrowser() { return  this.store.urls.reportBrowser; }


	user = (userId?: UserId) => `${this.userBrowser}${userId ? userId : ''}`;


	report = (reportId?: string) => `${this.reportBrowser}${reportId}`;
	get newReport() { return `${this.store.urls.reportBrowser}new-report`; }

	/**
	 * URL Handling
	 *
	 * Report Browser:                          /ADVISE/pages/query-tool/report
	 * Specific Report (Report Summary Page):   /ADVISE/pages/query-tool/report/report-guid
	 * Specific Report (With query options):    /ADVISE/pages/query-tool/report/report-guid?selectedItem=key
	 *
	 */
	// locationFor = (reportId?: string, selectedItem?: ReportItem) => {
	// 	let query = {};
	//
	// 	if (reportId && selectedItem) {
	// 		Object.assign(query, {selectedItem: selectedItem.id})
	// 	}
	//
	// 	return {
	// 		pathname: `${routing.urls.reportBrowser}${reportId ? reportId : ''}`,
	// 		query:    query
	// 	}
	// }

}