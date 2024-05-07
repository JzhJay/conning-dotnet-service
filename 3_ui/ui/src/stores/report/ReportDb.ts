// import {ReportItem, Report, ReportQuery, reportItemDefaults} from "./models";
// import {api} from 'stores';
// import {feathersClient} from 'stores/db'
// import {ReportDescriptor} from './models/models';
//
// export class ReportDb {
// 	db = feathersClient.service<Report>('report');
//
// 	constructor() {
// 		this.db.on('created', function (report: Report) {
// 			console.log('Report Created', report);
// 		});
//
// 		this.db.on('updated', function (report: Report) {
// 			console.log('Report updated', report);
// 		});
// 	}
//
// 	createReport(report: Report) {
// 		const date = new Date();
//
// 		// return api.db.horizonAsPromised(horizon => horizon("reports").insert({name: report.name, createdTime: date, modifiedTime: date})).then((obj: any) => {
// 		// 	report.id = obj.id;
// 		// 	return api.report.db.reportItem.addItems(Object.assign({}, report, {createdTime: date, modifiedTime: date})).then(() => obj.id);
// 		// })
// 	}
//
// 	report = {
// 		load(id: string) {
// 			return api.report.db.reportItem.findAll(id).then(reportItems => {
// 				let report: Report = null;
//
// 				// Build a map of the report ids to reportItems
// 				let reportItemsById = {};
// 				reportItems.forEach(reportItem => {
// 					reportItemsById[reportItem.id] = reportItem;
// 				})
//
// 				reportItems.forEach((reportItem) => {
// 					// Database stores a parentId, but its not a part of ReportItem and we won't need it beyond this point.
// 					delete reportItem["parentId"];
//
// 					if (reportItem.children) {
// 						// reportItem.children = reportItem.children.map((childId: string) => {
// 						//     return reportItemsById[childId];
// 						// })
// 					}
//
// 					if (reportItem.type === "report") {
// 						//report = reportItem;
// 					}
// 				})
//
// 				return report;
// 			})
// 		},
//
// 		find(id: string) {
// 			return api.db.horizonAsPromised(horizon => horizon("reports").find(id).fetch());
// 		},
//
// 		updateModifiedTime(reportId: string, reportItem: ReportItem)
// 		{
// 			const modifiedTime = new Date();
//
// 			// Keep our copy of the report time in sync.
// 			if (reportItem && reportItem.id === reportId)
// 				reportItem.modifiedTime = modifiedTime;
//
// 			return api.db.horizonAsPromised(horizon => horizon("reportItems").update({id: reportId, modifiedTime: modifiedTime}));
// 		},
//
// 		updateModifiedTimeAfterAction(actionPromise: Promise<any>, reportId: string, reportItem: ReportItem)
// 		{
// 			// Updates the modified time after an action is complete and return the original input promise
// 			return actionPromise.then(() => {
// 				return api.report.db.report.updateModifiedTime(reportId, reportItem).then(() => actionPromise)
// 			})
// 		},
//
// 		rename(reportId, name)
// 		{
// 			const actionPromise = api.db.horizonAsPromised(h => h("reportItems").update({id: reportId, name: name}));
//
// 			return api.report.db.report.updateModifiedTimeAfterAction(actionPromise, reportId, null);
// 		},
//
// 		remove(id: string) {
// 			api.db.horizon("reports").remove({id: id});
//
// 			let reportItemTable = api.db.horizon("reportItems");
// 			api.db.observableToPromise(api.db.horizon("reportItems").findAll({reportId: id}).fetch()).then((items: ReportItem[]) => {
// 				items.forEach(item => {
// 					reportItemTable.remove(item)
// 				})
// 			});
// 		}
// 	}
//
// 	reportItem = {
// 		add(reportId: string, reportItem: ReportItem) {
// 			const actionPromise = api.db.horizonAsPromised(horizon => horizon("reportItems").insert(api.report.db.reportItem.get(reportId, reportItem)));
// 			return api.report.db.report.updateModifiedTimeAfterAction(actionPromise, reportId, reportItem);
// 		},
//
// 		addItems(report: Report) {
// 			let reportItems = report.enumerateTree();
// 			return Promise.all(reportItems.map((reportItem) => {
// 				return api.report.db.reportItem.add(report.id, reportItem);
// 			}))
// 		},
//
// 		findAll(id: string): Promise<ReportItem[]> {
// 			return api.db.horizonAsPromised(h => h("reportItems").findAll({reportId: id}).fetch())
// 		},
//
// 		get(reportId: string, reportItem: ReportItem) {
// 			return Object.assign({}, reportItem, {
// 				reportId: reportId,
// 				children: reportItem.children ? reportItem.children.map(child => child.id) : null
// 			})
// 		},
//
// 		replace (reportId: string, reportItem: ReportItem) {
// 			const actionPromise = api.db.horizonAsPromised(horizon => horizon("reportItems").replace(api.report.db.reportItem.get(reportId, reportItem)));
// 			return api.report.db.report.updateModifiedTimeAfterAction(actionPromise, reportId, reportItem);
// 		},
//
// 		remove(id: string) {
// 			const actionPromise = api.db.horizonAsPromised(horizon => horizon("reportItems").remove({id: id}));
// 			return api.report.db.report.updateModifiedTimeAfterAction(actionPromise, id, null);
// 		}
// 	}
//
// 	/**
// 	 * Generate new uuids for all the report item ids and update any stored references
// 	 * @param report
// 	 */
// 	updateReportIds = (report: ReportItem) => {
// 		const items = report.enumerateTree();
//
// 		// Build a map of old to new ids
// 		let oldIdsToNew = {};
// 		items.forEach((item, i) => {
// 			if (item.id) {
// 				oldIdsToNew[item.id] = uuid.v4();
// 			}
// 		})
//
// 		// Replace all occurrence of the old id with the new id
// 		items.forEach((item) => {
// 			item.id = oldIdsToNew[item.id];
//
// 			if (item.layout) {
// 				let layout = JSON.parse(item.layout);
//
// 				// WEB-866 - save as breaks here due to layout.content being empty
// 				if (layout.content && layout.content.length > 0) {
// 					report.enumerateLayoutContentTree(layout.content[0]).forEach((item) => {
// 						if (oldIdsToNew[item.key]) {
// 							item.key = oldIdsToNew[item.key];
// 						}
// 					})
// 				}
//
// 				item.layout = JSON.stringify(layout);
// 			}
//
// 		})
//
// 	}
// }
