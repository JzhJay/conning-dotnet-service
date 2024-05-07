

// export const currentReport = {
// 	/**
// 	 * The item linked to the sidebar context menu
// 	 */
// 	setContextItem: createAction('Set the report browser context menu item') as (reportItem?: ReportItem) => void,
//
// 	/**
// 	 * Change which report item is the currently active one in the tree
// 	 * @param reportItem
// 	 * @returns {(dispatch:Redux.Dispatch)=>undefined}
// 	 */
// 		selectReportItem(reportItem?: ReportItem) {
// 		dispatch({type: `selectReportItem(${reportItem ? reportItem.id : null}`})
//
// 		// If we're currently renaming an item and switch away, commit the rename
//
// 		if (api.site.rename.descriptor) {
// 			api.site.rename.done();
// 		}
//
// 		dispatch(_selectReportItem(reportItem));
// 		updateUrlFromStore();
// 		updateReportBuilderTitleFromStore();
// 	},
// 	saveAs           (name?: string)  {
// 		const store = getState();
// 		if (!store.report.currentReport) {
// 			throw new Error("You must have a report loaded in order to save a copy.");
// 		}
//
// 		if (name == null) {
// 			// This is problematic in that it blocks the ui from animating out the menu.
// 			setTimeout(() => {
// 				let name = prompt('Name the new report:');
// 				if (name != null) {
// 					return currentReport.saveAs(name);
// 				}
// 			}, 100);
// 		}
// 		else {
// 			const linkColors = store.report.linkColors;
//
// 			// Save a copy of the report
// 			createReport_start();
//
// 			const report = Object.assign({}, store.report.currentReport, {name: name});
//
// 			// Update all report ids and any stored references
// 			store.report.db.updateReportIds(report);
//
// 			// Restore link colors
// 			dispatch(updateStore({linkColors: linkColors}));
//
// 			return store.report.db.report.add(report, store).then(id => {
// 				return api.report.open(id);
// 				dispatch(updateStore({currentReport: report}));
// 				updateReportBuilderTitleFromStore();
// 			}).catch(error => {
// 				createReport_error(report, error);
//
// 				throw error;
// 			});
// 		}
// 	},
//
// 	/**
// 	 * Unlinks a report item from its peers by cloning the underlying pivot and pointing to it instead
// 	 * @param item
// 	 * @returns {(dispatch:Redux.Dispatch)=>undefined}
// 	 */
// 		unlinkReportItem(item: ReportQuery) {
//
// 		// let originalId = item.queryResultId;
// 		//
// 		// // Clone the pivot we're linked to and then relink ourselves to the new one
// 		// api.queryResult.clone(item.queryResultId).then(newReportItemId => {
// 		// 	// Copy across the result data we have to the new GUID
// 		//
// 		// 	let pivots = store.queryResult.pivots;
// 		//
// 		// 	let existingPivot = store.queryResult.pivots[item.queryResultId];
// 		// 	if (existingPivot != null) {
// 		// 		pivots                          = _.clone(pivots);
// 		// 		const newPivot: PivotStoreEntry = _.cloneDeep(existingPivot);
// 		// 		pivots[newReportItemId]         = newPivot;
// 		//
// 		// 		dispatch(api.queryResult.updateStore({pivots: pivots}))
// 		// 	}
// 		//
// 		// 	// Todo - we may want to prompt the user for a new name
// 		// 	let newName = helpers.labelFor(item);
// 		//
// 		// 	registerLinkColors(newReportItemId);
// 		// 	reportItem.update(item.id, {
// 		// 		name:          newName,
// 		// 		queryResultId: newReportItemId
// 		// 	});
// 		//
// 		// 	if (store.report.layoutController) {
// 		// 		store.report.layoutController.onUnlinkReportItem(originalId, item);
// 		// 	}
// 		//
// 		// 	return newReportItemId;
// 		// });
// 	},
//
// 	/**
// 	 * Clones a query result view
// 	 * @param item
// 	 * @returns {(dispatch:Redux.Dispatch, getStore:()=>ApplicationStore)=>undefined}
// 	 */
// 		cloneReportItem(item: ReportQuery, direction: 'tab' | 'right' | 'down') {
// 		dispatch({type: `cloneReportItem(${item.id}, ${direction}`})
// 		// Todo - verify that the result item is shared within the report - otherwise the query result could be orphaned!
// 		//return clonePivot(item.queryResultId).then((data) => {
// 		const newItem                    = Object.assign({}, item, {id: uuid.v4()});
// 		let store                        = getState();
// 		let newStore: ReportBuilderStore = currentReport.addReportItem(api.report.findParentOfItem(item.id, store.report.currentReport).id, newItem);
// 		let newReportQuery                 = helpers.findItemById(newItem.id, newStore.currentReport) as ReportQuery;
//
// 		if (store.report.layoutController) {
// 			store.report.layoutController.onCloneView(item, newReportQuery, direction)
// 		}
// 	},
//
// 	/**
// 	 * Add a new report item to the report.  Note that this causes a completely new report to be generated (same keys though)
// 	 * @param parentId
// 	 * @param item
// 	 */
// 		addReportItem(parentId: string, item: ReportItem, selectItem = false, index?: number) {
// 		if (!item.id) {
// 			item.id = uuid.v4();
// 		}
//
// 		const report = _.clone(store.report.currentReport);
// 		const parent = helpers.findItemById(parentId, report);
//
// 		if (!index) {
// 			parent.children = update(parent.children, {$push: [item]});
// 		}
// 		else {
// 			parent.children = update(parent.children, {$splice: [[index, 0, item]]});
// 		}
// 		store.report.db.reportItem.replace(report.id, parent);
//
// 		let newStore = {currentReport: report};
// 		if (selectItem) {
// 			Object.assign(newStore, {selectedItem: item});
// 		}
//
// 		dispatch(updateStore(newStore));
//
// 		if (item.type === "view") {
// 			const view = item as ReportQuery;
// 			if (view.queryResultId && !store.report.linkColors[view.queryResultId]) {
// 				registerLinkColors(view.queryResultId);
// 			}
// 		}
//
// 		return store.report.db.reportItem.add(report.id, item).then(dbItem => {
// 			if (store.report.layoutController) {
// 				store.report.layoutController.onAddReportItem(item, parent);
// 			}
//
// 			if (selectItem) {
// 				api.site.rename.start({id: item.id, type: 'report', element: 'tree'});
// 			}
// 		});
// 	},
//
// 	/**
// 	 * Remove a report item from the report and free any database entries associated with it (queries/query results)
// 	 */
// 		async deleteReportItem(item: ReportItem, force?: boolean) {
// 		let store = getState();
// 		dispatch({type: `deleteReportItem(item: ${item.id})`})
//
// 		if (force || !prefs.confirmDeleteActions || await api.site.confirm(`Are you sure you want to delete the ${item.type} '${item.name ? item.name : (item as any).id}'?`)) {
// 			const existingParent = helpers.findParentOfItem(item.id);
// 			const index          = _.findIndex(existingParent.children, v => v === item);
//
// 			// Create a new report instance without the item in it
// 			const report = _.cloneDeep(store.report.currentReport);
// 			const parent = helpers.findItemById(existingParent.id, report);
//
// 			parent.children = update(parent.children, {$splice: [[index, 1]]});
//
// 			store.report.db.reportItem.replace(report.id, parent);
//
// 			if (store.report.layoutController) {
// 				store.report.layoutController.onDeleteReportItem(item, parent);
// 			}
//
// 			dispatch(updateStore({currentReport: report, selectedItem: parent}));
//
// 			store.report.db.reportItem.remove(item.id);
//
// 			return reportItem.update(report.id, report);
// 		}
// 	},
//
// 	expandSubTree:   createAction(`Expand a report item's subtree`) as (reportItem: ReportItem) => void,
// 	collapseSubTree: createAction(`Collapses a report item's subtree`) as (reportItem: ReportItem) => void,
// }
//
//
// export function rename(id: string, name: string) {
// 	dispatch({type: `report.rename(${id}, ${name})`});
//
// 	let store = getState();
//
// 	let {reports, currentReport} = store.report;
//
// 	const report = Object.assign({}, reports[id], {name: name});
//
// 	// Optimistically update our local name
// 	dispatch(updateStore({
// 		                     reports:       Object.assign({}, reports, {[id]: report}),
// 		                     currentReport: currentReport && id === currentReport.id ? Object.assign({}, currentReport, {name: name}) : store.report.currentReport
// 	                     }));
//
// 	api.report.reportItem.update(id, {name: name});
//
// 	return store.report.db.report.rename(id, name).then((updated) => {
// 		// Todo - this is way overkill - we need only load/update the last changed
// 		console.log(updated);
// 		return loadAvailable();
//
// 	});
// }
//
// export function open(id: string, selectedId?: string) {
// 	openReport_start(id);
//
// 	return store.report.db.report.load(id).then(report => {
// 		// Map all the unique report guids to their own link colors
// 		const uniqueResultIds = _.uniq(helpers.enumerateReportTree(report).filter((i: ReportQuery) => i.type === 'view' && i.queryResultId != null).map((v: ReportQuery) => v.queryResultId));
//
// 		if (uniqueResultIds.length > 0) {
// 			registerLinkColors(uniqueResultIds);
// 		}
//
// 		openReport_done(report, selectedId);
//
// 		//helpers.report.preFetchReportData(report, dispatch);;
//
// 		return report;
// 	}).catch(err => {
// 		openReport_error(id, err);
//
// 		throw err;
// 	});
// }
//
// export function createFromViewList(queryResultId: string, viewList: string[]) {
// 	const report: Report = {
// 		name:     'Query Report',
// 		type:     'report',
// 		expanded: true,
// 		id:       uuid.v4(),
// 		children: [reportItemDefaults.newPage()]
// 	};
//
// 	let page = report.children[0];
// 	page.id  = uuid.v4();
// 	viewList.forEach((viewName) => {
// 		let view: ReportQuery = {
// 			name:          viewName,
// 			type:          'view',
// 			viewName:      viewName,
// 			queryResultId: queryResultId,
// 			id:            uuid.v4(),
// 			userOptions:   {}
// 		};
//
// 		page.children.push(view);
// 	})
//
// 	// Select the page
// 	create(report).then(() => {
// 		api.report.currentReport.selectReportItem(api.report.findItemById(page.id));
// 	})
// }
//
// /**
//  * Create a new report.
//  *
//  * During report creation we show a loading spinner as we create the report and the query session in the backend
//  */
// export function create(report?: Report) {
// 	const store = getState();
//
// 	if (!report) {
// 		report = reportItemDefaults.newReport();
// 	}
//
// 	dispatch({type: "Create a new report", payload: report});
//
// 	createReport_start()
//
// 	return store.report.db.report.add(report).then((id) => {
// 		report = Object.assign({}, report, {id: id});
//
// 		report_loaded(report);
//
// 		return report;
// 	}, (err) => {
// 		console.error(err)
// 		console.log(err.stack);
//
// 		createReport_error(report, err);
//
// 		throw err;
// 	})
// }
//

//
// export const reportItem = {
// 	update(id: string, updatedProperties?: any)  {
// 		let store = getState();
//
// 		let item: ReportItem;
// 		if (store.report.currentReport) {
// 			item = Object.assign({}, helpers.findItemById(id), updatedProperties);
//
// 			//dispatch({type: `updateReportItem(${item.id}, updatedProperties: ${JSON.stringify(updatedProperties)})`})
//
// 			// Updating the report itself?
// 			if (item.type === 'report' && store.report.currentReport.id === item.id) {
// 				dispatch(updateStore({currentReport: item}));
// 				store = getState();
// 			}
// 			else {
// 				// Update the parent item in order to change this report item
// 				store = getState();
//
// 				const originalParent = helpers.findParentOfItem(item.id, store.report.currentReport);
// 				const report         = Object.assign({}, store.report.currentReport);
//
// 				if (originalParent != null) {
// 					const parent = helpers.findItemById(originalParent.id, report);
// 					const index  = _.findIndex(parent.children, v => v.id === item.id);
//
// 					// Todo - replace with a $set
//
// 					parent.children[index] = item;
// 				}
//
// 				dispatch(updateStore(Object.assign(
// 					{currentReport: report},
// 					item.id === store.report.selectedItem.id ? {selectedItem: item} : null)));
// 			}
// 		}
//
// 		else {
// 			item = Object.assign({}, store.report.reports[id], updatedProperties);
// 			dispatch(updateStore({reports: Object.assign({}, store.report.reports, {[id]: item})}))
// 		}
//
// 		updateReportBuilderTitleFromStore();
//
// 		return store.report.db.reportItem.replace(store.report.currentReport.id, item);
// 	}
// }

// export const queryView = {
// 	switchView(view: ReportQuery, viewName: QueryViewName) {
// 		return reportItem.update(view.id, {viewName: viewName});
// 	},
//
// 	updateUserOption(view: ReportQuery, viewOptions: QueryViewUserOptions) {
// 		let userOptions            = Object.assign({}, view.userOptions);
// 		userOptions[view.viewName] = viewOptions;
//
// 		return reportItem.update(view.id, {userOptions: userOptions});
// 	}
// }
//
// reportBuilderReducer[updateStore as any] = (state, props) => Object.assign({}, state, props);
//
// Object.assign(reportBuilderReducer, {
// 	[ui.setIsSidebarShowing as any]:       (store: ReportBuilderStore, show?: boolean) => Object.assign({}, store, {showSidebar: show}),
// 	[ui.toggleShowSidebar]:                (store: ReportBuilderStore) => Object.assign({}, store, {showSidebar: !store.showSidebar}),
// 	[ui.toggleSecondaryToolbars]:          (store: ReportBuilderStore) => Object.assign({}, store, {showSecondaryToolbars: !store.showSecondaryToolbars}),
// 	[currentReport.setContextItem as any]: (store: ReportBuilderStore, item?: ReportItem) => Object.assign({}, store, {contextItem: item}),
// });
//
// function createReport_start() {
// 	dispatch(updateStore({isCreatingReport: true, currentReport: null, linkColors: {}}))
// }
//
// function createReport_error(report: Report, error: Error) {
// 	dispatch(updateStore({loadingReportId: null, isCreatingReport: false}));
// 	api.site.toaster.show({message: `The report '${report.name}' could not be created.`, intent: api.site.Intent.DANGER});
// }
// function report_loaded(report: Report) {
// 	dispatch(updateStore({
// 		                     currentReport:    report,
// 		                     selectedItem:     null,
// 		                     loadingReportId:  null,
// 		                     isCreatingReport: false
// 	                     }));
//
// 	updateUrlFromStore()
// 	updateReportBuilderTitleFromStore();
// }
//
// /**
//  * Open a Report
//  *
//  * **/
// function openReport_start(id: string) {
// 	dispatch(updateStore({
// 		                     currentReport:   null,
// 		                     selectedItem:    null,
// 		                     loadingReportId: id,
// 		                     linkColors:      {}
// 	                     }));
// }
//
// function openReport_done(report: Report, selectedItemId?: string) {
// 	dispatch(updateStore({
// 		                     currentReport:    report,
// 		                     selectedItem:     !selectedItemId ? report : helpers.findItemById(selectedItemId, report),
// 		                     loadingReportId:  null,
// 		                     isCreatingReport: false
// 	                     }));
//
// 	api.report.updateUrlFromStore();
//
// 	// Update the title and subtitle
// 	updateReportBuilderTitleFromStore()
// }
//
//
// function openReport_error(id: string, err: Error) {
// 	api.site.raiseError(err, 'report');
// 	dispatch(updateStore({
// 		                     loadingReportId: null
// 	                     }));
//
// 	api.site.toaster.show({message: `The report '${id}' could not be found.`, intent: api.site.Intent.WARNING});
//
// 	navigateToReportBrowser();
// }
//
//
// /**
//  * Query Result GUIDs -> Colors of the Link
//  */
// const registerLinkColors: (guid: string | string[], color?: Color | Color[]) => void = createAction('Register color mapping(s) for Query Result(s)')
// Object.assign(reportBuilderReducer, {
// 	[registerLinkColors as any]: (store: ReportBuilderStore, guids: string | string[], colors?: Color | Color[]) => {
// 		let linkColors = Object.assign({}, store.linkColors);
//
// 		if (guids instanceof Array) {
// 			for (let i = 0; i < guids.length; i++) {
// 				linkColors[guids[i]] = colors != null && colors.length === guids.length ? colors[i] : store.linkColorPalette[_.keys(linkColors).length % store.linkColorPalette.length];
// 			}
// 		}
// 		else if (typeof guids === 'string') {
// 			let color = colors as string;
//
// 			linkColors[guids] = color ? color : store.linkColorPalette[_.keys(linkColors).length % store.linkColorPalette.length];
// 		}
//
// 		return Object.assign({}, store, {linkColors: linkColors});
// 	}
// })
//
//
// /**
//  * Tell the layout manager about certain events
//  */
// export const setReportLayoutManagerController: (controller?: ReportLayoutManagerController) => void = createAction('Set the layout manager controller', arg => arg, arg => ({silent: true}));
// Object.assign(reportBuilderReducer, {
// 	[setReportLayoutManagerController as any]: (store: ReportBuilderStore, layoutController?: ReportLayoutManagerController) => Object.assign({}, store,
// 	                                                                                                                                          {layoutController: layoutController} as ReportBuilderStore),
// });
//
// const _selectReportItem = createAction("Select a report item");
// Object.assign(reportBuilderReducer, {
// 	[_selectReportItem as any]: (store: ReportBuilderStore, item?: ReportItem) => Object.assign({}, store, {
// 		selectedItem: item
// 	} as ReportBuilderStore)
// })
// //////  End SelectReportItem()
//
//
//

// api.report.setReportLayoutManagerController({
// 	                                                     setPageLayout: {
// 		                                                     tabs:       (page: ReportItem) => {
// 			                                                     if (page.type !== 'page') {
// 				                                                     throw new Error(`Layout operations are valid only on pages.  '${page.name}' is of type '${page.type}'`)
// 			                                                     }
// 			                                                     if (page.children.length < 1) {
// 				                                                     throw new Error(`Horizontal Layout can only be set on pages with more than one item.`)
// 			                                                     }
//
// 			                                                     this.setState({
// 				                                                                   glContent: {
// 					                                                                   type:    'stack',
// 					                                                                   title:   api.report.labelFor(page),
// 					                                                                   key:     page.id,
// 					                                                                   content: page.children.map(c => this.createGoldenLayoutContent(c))
// 				                                                                   }
// 			                                                                   });
// 		                                                     },
// 		                                                     horizontal: (page: ReportItem) => {
// 			                                                     if (page.type !== 'page') {
// 				                                                     throw new Error(`Layout operations are valid only on pages.  '${page.name}' is of type '${page.type}'`)
// 			                                                     }
// 			                                                     if (page.children.length < 1) {
// 				                                                     throw new Error(`Horizontal Layout can only be set on pages with more than one item.`)
// 			                                                     }
//
// 			                                                     this.setState({
// 				                                                                   glContent: {
// 					                                                                   type:    'row',
// 					                                                                   title:   api.report.labelFor(page),
// 					                                                                   key:     page.id,
// 					                                                                   content: page.children.map(c => this.createGoldenLayoutContent(c))
// 				                                                                   }
// 			                                                                   });
// 		                                                     },
//
// 		                                                     vertical: (page: ReportItem) => {
// 			                                                     if (page.type !== 'page') {
// 				                                                     throw new Error(`Layout operations are valid only on pages.  '${page.name}' is of type '${page.type}'`)
// 			                                                     }
// 			                                                     if (page.children.length < 1) {
// 				                                                     throw new Error(`Vertical Layout can only be set on pages with more than one item.`)
// 			                                                     }
//
// 			                                                     this.setState({
// 				                                                                   glContent: {
// 					                                                                   type:    'column',
// 					                                                                   title:   api.report.labelFor(page),
// 					                                                                   key:     page.id,
// 					                                                                   content: page.children.map(c => this.createGoldenLayoutContent(c))
// 				                                                                   }
// 			                                                                   });
// 		                                                     },
// 	                                                     },
//
// 	                                                     onCloneView:        this.onCloneView,
// 	                                                     onDeleteReportItem: (item: ReportItem, parent: ReportItem) => {
// 		                                                     if (this.goldenLayoutComponent) {
// 			                                                     const contentItem = this.goldenLayoutComponent.findContentItem(item.id);
//
// 			                                                     if (contentItem) {
// 				                                                     let contentItemStack = contentItem.parent;
// 				                                                     contentItemStack.removeChild(contentItem);
//
// 				                                                     let stackParent = contentItemStack.parent;
// 				                                                     if (stackParent && stackParent.contentItems.find(ci => ci === contentItemStack) != null) {
// 					                                                     stackParent.removeChild(contentItemStack);
// 				                                                     }
// 			                                                     }
//
// 			                                                     // Not using container.close so we can close items not marked as closable as is the case on
// 			                                                     // single item views. - can re-enable if we disable closing/cloning on such views
// 			                                                     //contentItem.container.close();
// 		                                                     }
// 	                                                     },
// 	                                                     onAddReportItem:    (item: ReportItem, parent: ReportItem) => {
// 		                                                     if (this.goldenLayoutComponent) {
// 			                                                     if (!this.goldenLayoutComponent.findContentItem(item.id)    // Doesn't already exist
// 			                                                         && api.report.isInSubtree(this.props.item, item.id)) {    // Is relevant to the object we're bound to
// 				                                                     // Add items are are not present in the layout but are in the tree. e.g. from a move.
// 				                                                     const topItem = this.goldenLayoutComponent.findContentItem(this.props.item.id);
//
// 				                                                     const {newItemLayoutLocation} = prefs.report;
//
// 				                                                     let done = false;
// 				                                                     if (parent.children.length === 2) {
// 					                                                     if (topItem.type === "stack") {
// 						                                                     if (newItemLayoutLocation === "tab") {
// 							                                                     // Add another tab to the stack
// 							                                                     topItem.addChild(this.createGoldenLayoutContent(item));
// 							                                                     done = true;
// 						                                                     }
// 					                                                     }
// 				                                                     }
//
// 				                                                     if (!done) {
// 					                                                     if (topItem.type === "stack") {
// 						                                                     topItem.addChild(this.createGoldenLayoutContent(item));
// 					                                                     }
// 					                                                     else {
// 						                                                     topItem.addChild({
// 							                                                                      type:    'stack',
// 							                                                                      title:   api.report.labelFor(item),
// 							                                                                      key:     item.id,
// 							                                                                      content: [this.createGoldenLayoutContent(item)]
// 						                                                                      });
// 					                                                     }
// 				                                                     }
// 			                                                     }
// 		                                                     }
// 	                                                     },
// 	                                                     onUnlinkReportItem: (originalId: string, item: ReportItem) => {
// 		                                                     // let contentItem      = this.goldenLayoutComponent.findContentItem(item.id);
// 		                                                     // assert(contentItem.config.props.id)
// 		                                                     // contentItem.config.props = this.getLayoutItemProps(item)
// 	                                                     }
//                                                      }))