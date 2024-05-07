import { appIcons, user, julia, HTTP_STATUS_CODES } from 'stores';
import { action, autorun, computed, observable, runInAction, toJS, makeObservable } from 'mobx';
import { ReportQuery, ReportItem, Report, ReportDescriptor, IReportDescriptor } from './';
import { routing, simulationStore, queryStore, xhr, SimulationSlot, ReportText, site } from 'stores';
import { IReportItemSerializable, IReportSerializable, ReportGuid, ReportPage } from "./models";
import * as mobx from 'mobx';

class ReportStore {
	@observable loadedReports = observable.map<string, Report>();
	@observable descriptors = observable.map<string, ReportDescriptor>();
	@observable hasLoadedDescriptors = false;

	constructor() {
        makeObservable(this);
    }

	@computed
	get apiUrl() {
		return `${julia.url}/v1/reports`
	}

	apiUrlFor(id: ReportGuid) {
		return `${this.apiUrl}${id != null ? `/${id}` : ''}`;
	}

	/* Do not make this an action or autorun will not track it */
	put = <T>(report: Report) : Promise<T> => {
		return xhr.put<T>(this.apiUrlFor(report.id), report.toJSON());
	}

	@action delete = (id: ReportGuid) => {
		reportStore.descriptors.delete(id);
		reportStore.loadedReports.delete(id);

		xhr.delete(this.apiUrlFor(id));
	}

	@computed
	get myReports() {
		return mobx.values(this.loadedReports).filter(r => r.createdBy == user.currentUser.sub)
	}

	@computed
	get isActivePage() {
		return routing.isActive(routing.urls.reportBrowser)
	}

	get browserUrl() {
		return Report.clientUrlFor()
	}

	navigateToBrowser = () => routing.push(this.browserUrl)

	//db = FEATHERS_DB && new ReportDb();

	reset = () => {
		this.loadedReports.clear();
		this.descriptors.clear();
		this.hasLoadedDescriptors = false;
	}

	private static deserializeReportItem(serialized: IReportItemSerializable, report?: Report, parent?: ReportItem): ReportItem {
		try {
			let result: ReportItem;

			switch (serialized.type) {
				case 'report': {
					result = new Report(serialized.name, serialized);
					report = result as Report;
					break;
				}

				case 'page': {
					result = new ReportPage({ report: report, parent: parent }, serialized);
					break;
				}

				// case 'folder': {
				// 	result = new ReportFolder({report: report, parent:parent}, serialized)
				// 	break;
				// }

				case 'text': {
					result = new ReportText({ report: report, parent: parent }, serialized)
					break;
				}

				// case 'querySlot': {
				// 	result = new ReportPageQuerySlot({report: report, parent:parent}, serialized);
				// 	break;
				// }

				case 'query': {
					result = new ReportQuery({ report: report, parent: parent }, serialized);
					break;
				}

				default: {
					console.error('Unknown report item type: ', serialized.type, serialized);
					return null;
					//result = new ReportItem({report: report, parent: parent}, serialized);
				}
			}
			const { children, ...rest } = serialized;

			result.children = observable(children.map(c => ReportStore.deserializeReportItem(c, report, result)))

			return result;
		}
		catch (err) {
			site.raiseError(err);
		}

		return null;
	}

	@observable _loadingByUrl = observable.map<string, Promise<Report>>({}, {deep: false});

	loadReport = async (reportId: string): Promise<Report> => {
		if (!reportId) {
			return null
		}
		const {loadedReports, _loadingByUrl} = this;

		if (loadedReports.has(reportId)) {
			return loadedReports.get(reportId);
		} else {
			const url = this.apiUrlFor(reportId);
			if (_loadingByUrl.has(url)) {
				return _loadingByUrl.get(url);
			}
			else {
				let result = mobx.values(loadedReports).find(r => r.slug == reportId);
				if (result) return result;

				const promise = xhr.get<IReportSerializable>(url)
				                   .then(serialized => {
					                   const report = ReportStore.deserializeReportItem(serialized) as Report;

					                   loadedReports.set(report.id, report);
					                   _loadingByUrl.delete(url)
					                   return report;
				                   }).catch(err => {
						_loadingByUrl.delete(url)

						if (err.status == HTTP_STATUS_CODES.notFound) {
							throw new Error(`Report ${reportId} does not exist`);
						}
						else throw err;
					});

				_loadingByUrl.set(url, promise);
				return promise;
			}
		}
	}

	private _loadingDescriptorPromise = null;
	loadDescriptors = async (): Promise<ReportDescriptor[]> => {
		this.hasLoadedDescriptors = true;

		if (!this._loadingDescriptorPromise) {
			return this._loadingDescriptorPromise = xhr.get<IReportDescriptor[]>(this.apiUrl)
			                                           .then(descriptors => descriptors.map(descriptor => new ReportDescriptor(descriptor)))
			                                           .then(results => {
				                                           // runInAction: Report Descriptors loaded
				                                           return runInAction(() => {
					                                           this.descriptors.clear();

					                                           // Map the array of query results into a dictionary keyed on their id
					                                           results.forEach(r => this.descriptors.set(r.id, r));

					                                           //results.forEach(r => this.loadReport(r.id))

					                                           this._loadingDescriptorPromise = null;
					                                           this.hasLoadedDescriptors = true;
					                                           return results;
				                                           });


			                                           })
			                                           .catch(error => {
				                                           this._loadingDescriptorPromise = null;
				                                           throw error;
			                                           })
		}
		else {
			return this._loadingDescriptorPromise;
		}
	}

	@action createReport = async (name: string): Promise<Report> => {
		const report = new Report();
		report.name = name;
		report.createdBy = user.profile.sub;

		// Julia overwrites our ID with its own
		report.id = await xhr.post<string>(this.apiUrl, _.omit(report, 'id'));

		this.loadedReports.set(report.id, report);
		this.descriptors.set(report.id, new ReportDescriptor(report));


		//this.db.createReport(report);
		return Promise.resolve(report);
	}


// 	deleteReport = async (report: ReportDescriptor) => {
// // 	// Delete any associated query sessions
// // 	return store.report.db.report.find(id).then(report => {
// // 		if (report) {
// // 			const items = helpers.enumerateReportTree(report);
// //
// // 			items.filter(item => item.type === "view")
// // 			     .forEach((item: ReportQuery) => {
// // 				     if (item.viewName === 'query' && item.queryId) {
// // 					     api.query.deleteQueryDescriptor(item.queryId);
// // 				     }
// // 			     });
// // 		}
// // 	}).then(report => {
// // 		// Remove from the reports table then remove all report items
// // 		store.report.db.report.remove(id);
// // 	})
// // }
// //
// 	}
}

export const reportStore = new ReportStore();

