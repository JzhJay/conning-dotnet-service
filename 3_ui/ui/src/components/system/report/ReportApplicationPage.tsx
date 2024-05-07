import type {IconName} from '@blueprintjs/core';
import {Button, ControlGroup, NavbarDivider, NavbarGroup, NavbarHeading} from '@blueprintjs/core';
import * as css from './ReportApplicationPage.css';
import {ReportBrowser} from './ReportBrowser';
import {ReportItemContextMenu, ApplicationPopoverMenu, ApplicationPage, QueryBuilder, QueryViewComponent, bp, sem, SimulationCard, DropdownCycleButton} from 'components';
import type {QueryViewName} from 'stores';
import {
	utility,
	routing,
	settings,
	reportStore,
	site,
	appIcons,
	ActiveTool,
	Report,
	ReportItem,
	ReportPage,
	ReportQuery,
	Simulation,
	Link,
	ReportPageLayout,
	featureToggles
} from 'stores';
import {observer} from 'mobx-react';
import {
    observable,
    autorun,
    reaction,
    computed,
    runInAction,
    action,
    makeObservable,
} from "mobx";
import {ReportViewer} from './ReportViewer';
import {ReportNavigator} from "./widgets/ReportNavigator";
import {JumpToReportItemMenuItem, ReportPageContextMenu} from "./widgets/ReportPageContextMenu";
import {ReportContextMenu} from "./widgets/ReportContextMenu";
import {IconButton} from "../../blueprintjs/IconButton";

interface QueryString {
	selectedItem?: string;
	view?: QueryViewName;
}

interface MyProps {
	params?: { id?: string, querySlotId?: string, pageId?: string }
	location?: HistoryModule.LocationDescriptorObject;

	gridCellMargin?: { horizontal: number, vertical: number };
}

@observer
export class ReportApplicationPage extends React.Component<MyProps, {}> {
    @observable report: Report;
    @observable reportId;
    @observable reportQueryId;
    @observable pageId;
    @observable queryString: QueryString;

    rowHeight?: number;
    invalidatedViews?: boolean[];
    simulations?: { [key: string]: Simulation };

	constructor(props) {
		super(props);

        makeObservable(this);

		this.updateFromLocation();
		this.loadReportIfNeeded();
		this.syncSiteHeader();
    }

    render() {
		const {report, reportQueryId, pageId, queryString} = this;

		const reportQuery = report && reportQueryId ? report.querySlots.find(s => s.id == reportQueryId) : null;

		return (
			<ApplicationPage id="query-report-page"
			                 data-show-report-tabs={settings.report.showLayoutTabs}
			                 className={classNames(css.root, css.queryReport, {'no-report': !report})}
			                 tool={ActiveTool.report}
			                 tag={() => this.report}
			                 title={() => {
				                 const {report: r} = this;

				                 return !r ? 'Reports' : `${r.name}${r.selectedItem != r ? ` - ${r.selectedItem.name}` : ''}`;
			                 }}
			                 renderTitle={() => {
				                 return null;

				                 const {report} = this;
				                 return report && <ReportNavigator report={report}/>
			                 }}
			                 applicationButtonText={() => {
				                 const {report, reportId, pageId, page} = this;
				                 return report
				                        ? `${report.name}`
				                        : reportId
				                          ? 'Loading...'
				                          : 'Report Browser';
			                 }}
			                 breadcrumbs={() => {
				                 const {report, reportId, page} = this;
				                 const result                   = [];

				                 if (!reportId) {
					                 result.push(<ApplicationPopoverMenu className={classNames(bp.Classes.BREADCRUMB)}/>);
				                 }
				                 else if (!report) {
					                 result.push(<span key='loading' className={bp.Classes.BREADCRUMB}>Loading...</span>);
				                 }
				                 else {
					                 let {selectedItem: item} = report;
					                 let remainder            = [];
					                 while (item) {
						                 const {label, clientUrl, icon} = item;

						                 remainder.push(
							                 <bp.Popover interactionKind={bp.PopoverInteractionKind.HOVER}
							                             className={bp.Classes.BREADCRUMB}
							                             content={<ReportItemContextMenu item={item} location='header'/>}>
								                 <bp.AnchorButton
									                 className={classNames(bp.Classes.MINIMAL)}
									                 icon={icon as IconName}
									                 text={label}
									                 href={clientUrl}
									                 onClick={(e) => {
										                 routing.push(clientUrl);
										                 e.preventDefault();
									                 }}
								                 />
							                 </bp.Popover>);

						                 if (item.type == 'report') {
							                 break;
						                 }

						                 item = item.parent;
					                 }
					                 result.push(...remainder.reverse());
				                 }

				                 return result;
			                 }}
			                 renderApplicationMenuItems={() => {
				                 const {report, pageId, page} = this;

				                 return <ReportContextMenu location='header' report={report}/>;
			                 }}

			                 renderToolbar={() => {
				                 const {report, reportId, page, reportQuery} = this;

				                 if (!reportId) {
					                 return null;
				                 }
				                 else if (reportQuery && reportQuery.query) {
					                 return null; //<QueryBuilderToolbar query={reportQuery.query}/>;
				                 }
				                 else {
					                 return (
						                 <nav className={classNames(css.navbar, bp.Classes.NAVBAR)}>
							                 <NavbarGroup align="left">
								                 {report && report.selectedItem == report &&
								                 (<div>
									                 <bp.Button icon="database" text="Add a Simulation" onClick={() => report.addSimulationSlot()}/>
									                 <NavbarDivider/>
									                 <bp.AnchorButton icon='document' text="Add a Page" onClick={() => report.addPage()}/>
								                 </div>).props.children
								                 }

								                 {page && (<div>
									                 <NavbarHeading>Page {page.index + 1} of {report.pages.length}</NavbarHeading>
									                 <NavbarDivider/>
									                 <bp.Button icon="search" text="Add Query" onClick={() => page.addReportQuery()}/>
									                 <NavbarDivider/>
									                 <bp.AnchorButton icon='paragraph' text="Add Text Block" onClick={() => page.addText()}/>
								                 </div>).props.children}
							                 </NavbarGroup>

							                 {page && report.selectedItem == page && <NavbarGroup align="right">
								                 <bp.Tooltip content="Print">
									                 <bp.AnchorButton icon="print"
									                                  text='Print Page'
									                                  onClick={async () => {
										                                  console.warn('NYI - print page')
									                                  }}/>
								                 </bp.Tooltip>

								                 <NavbarDivider/>
								                 <bp.Tooltip content={`Duplicate Page`}>
									                 <bp.Button text='Duplicate Page' icon="duplicate" onClick={() => page.duplicate()}/>
								                 </bp.Tooltip>

								                 <NavbarDivider/>

								                 <bp.Tooltip content={`Delete Page ${page.index + 1}`}>
									                 <IconButton text='Delete Page' icon={appIcons.report.delete} onClick={() => page.delete()}/>
								                 </bp.Tooltip>
							                 </NavbarGroup>}

							                 {report && report.selectedItem == report &&
							                 <NavbarGroup align={bp.Alignment.RIGHT}>
								                 <bp.Tooltip content="Print">
									                 <bp.AnchorButton icon="print"
									                                  text='Print Report'
									                                  onClick={async () => {
										                                  console.warn('NYI - print report')
									                                  }}/>
								                 </bp.Tooltip>

								                 <NavbarDivider/>
								                 <bp.Tooltip content={`Duplicate Report`}>
									                 <bp.Button text='Duplicate Report' icon="duplicate" onClick={() => report.duplicate()}/>
								                 </bp.Tooltip>

								                 <NavbarDivider/>

								                 <bp.Button text='Delete Report' icon="trash" onClick={() => {
									                 report.delete();
								                 }}/>
							                 </NavbarGroup>
							                 }
						                 </nav>
					                 );
				                 }
			                 }}

			                 renderHeaderToolbarItems={() => {
				                 const {report, pageId, page, reportQuery} = this;
				                 return report && (<div>
					                 {/*{page && <ReportItemPopoverMenu item={page} />}*/}

					                 {/*{page && <span className={bp.Classes.NAVBAR_DIVIDER}/>}*/}

					                 <ReportNavigator report={report}/>

					                 {reportQuery && (
						                 <div>
							                 {reportQuery.query && !reportQuery.query.hasResult && <span className={bp.Classes.NAVBAR_DIVIDER}/>}
							                 {reportQuery.query && !reportQuery.query.hasResult && <span className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
									<bp.Tooltip content="Reset Query">
										<bp.AnchorButton minimal icon='step-backward' onClick={() => reportQuery.query.reset()}/>
									</bp.Tooltip>
									<bp.Tooltip content="Run Query">
										<bp.AnchorButton minimal icon='play' onClick={() => reportQuery.query.run()}/>
									</bp.Tooltip>
								</span>}

							                 {/*{reportQuery.queryResult && <AvailableQueryViewDropdown currentView={reportQuery.view} reportQuery={reportQuery} query={reportQuery.query} queryResult={reportQuery.queryResult} /> }*/}

							                 {/*{reportQuery.query && reportQuery.query.simulation && <span className={bp.Classes.NAVBAR_DIVIDER}/> }*/}

						                 </div>).props.children}
				                 </div>).props.children;
			                 }}
			                 renderHeaderToolbarItemsRight={() => {
				                 const {report, pageId, page, reportQuery} = this;
				                 return report && (<div>
					                 {reportQuery
					                 && reportQuery.query
					                 && reportQuery.query.simulations.map((sim, i) =>
						                 <bp.Popover
							                 key={i}
							                 interactionKind={bp.PopoverInteractionKind.HOVER}
							                 content={<SimulationCard isTooltip showFavoriteIcon={false} sim={sim}/>}>
							                 <sem.Label as={Link} to={Simulation.urlFor(sim._id)}>
								                 <sem.Icon name="database"/>
								                 {sim.name}</sem.Label>
						                 </bp.Popover>)}
					                 {reportQuery && reportQuery.query && reportQuery.query.simulations && <span className={bp.Classes.NAVBAR_DIVIDER}/>}

					                 {false && page && <DropdownCycleButton
						                 label='Page Layout:'
						                 title={`${ReportPage.layoutDescriptors[page.layout].label} Layout`}
						                 menu={<bp.Menu>
							                 {utility.enumerateEnum(ReportPageLayout)
								                 .filter(layout => page.isLayoutValid(layout))
								                 .map(layout =>
									                 <bp.MenuItem key={layout.toString()}
									                              active={page.layout == layout}
									                              text={ReportPage.layoutDescriptors[layout].label}
									                              icon={ReportPage.layoutDescriptors[layout].icon as IconName}
									                              onClick={() => page.setLayout(layout)}/>
								                 )}
						                 </bp.Menu>}
						                 buttonContent={<bp.AnchorButton onClick={() => page.setLayout(null)} icon={ReportPage.layoutDescriptors[page.layout].icon as IconName}/>}
					                 />}

					                 <span className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
		{/* To space out the cycle button - this is kludgy! */}
						                 {false && page && <Button disabled style={{padding: 0, minWidth: 0}}/>}

						                 <bp.Tooltip content="Presentation Mode">
		<IconButton icon={appIcons.report.presentationMode} active={this.inPresentationMode}
		            onClick={this.togglePresentationMode}/>
		</bp.Tooltip>

		<bp.Popover interactionKind={bp.PopoverInteractionKind.HOVER}
		            content={
			            <div className={css.settingsPanel}>
				            <div>
					            <ControlGroup vertical>
					                <bp.Switch label="Show Report Tabs" checked={settings.report.showLayoutTabs} onChange={() => settings.report.showLayoutTabs = !settings.report.showLayoutTabs}/>
						            <bp.Switch label="Show Toolbars" checked={settings.report.showToolbars} onChange={() => settings.report.showToolbars = !settings.report.showToolbars}/>
						            <bp.Switch label="Show Query Sidebars" checked={settings.report.showQuerySidebars}
						                       onChange={() => settings.report.showQuerySidebars = !settings.report.showQuerySidebars}/>
					            </ControlGroup>
				            </div>
			            </div>}>
		<IconButton icon={appIcons.report.settings}/>
		</bp.Popover>
		</span>
				                 </div>).props.children;
			                 }}>
				<div key="report" className={css.pusher}>
					{report == null
					 ? <ReportBrowser queryParams={queryString}/>
					 : <ReportViewer report={report}/>}
				</div>
			</ApplicationPage>
		)
	}

    updateFromLocation = () => {
		// runInAction: Update from URL routing change
		runInAction(() => {
			this.reportId      = this.props.params.id;
			this.pageId        = this.props.params.pageId;
			this.queryString   = this.props.location.query;
			this.reportQueryId = this.props.params.querySlotId;
		});
	}

    componentDidUpdate(oldProps: MyProps) {
		if (oldProps.location != this.props.location || oldProps.params != this.props.params) {
			this.updateFromLocation();
		}
	}

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

    _toDispose: Function[] = [];

    @computed
	get selectedItem(): ReportItem {
		return this.report ? this.report.selectedItem : null;
	}

    updateReport = _.debounce((report: Report) => {

	}, 200, {leading: false});

    loadReportIfNeeded = () => {
		let updateUrlReaction;

		let setViewFromUrl = this.queryString.view != null;

		this._toDispose.push(
			reaction(() => ({id: this.reportId, queryString: this.queryString}),
				() => {
					const {reportId: id, pageId, reportQueryId, queryString} = this;

					runInAction(async () => {
						let report = this.report;

						if (!report || report.id != id) {
							if (report && updateUrlReaction) {
								updateUrlReaction();
								this._toDispose.unshift(updateUrlReaction);
							}

							try {
								report = await reportStore.loadReport(id);
							}
							catch (error) {
								site.raiseError(error)
								reportStore.navigateToBrowser();
							}

							if (setViewFromUrl && queryString.view) {
								setViewFromUrl                     = false;
								const {reportQueryId, reportQuery} = this;

								reportQuery && reportQuery.setView(this.queryString.view);
							}
						}

						if (report) {
							const {pageId, reportQueryId} = this;

							const selectedItemId = queryString.selectedItem || pageId || reportQueryId;

							let selectedItem = selectedItemId ? report.findItem(selectedItemId) : report;

							if (report.selectedItem != selectedItem) {
								report.selectedItem = selectedItem;
							}
						}

						this.report = report;

						if (this.report) {
							updateUrlReaction = reaction(() => this.report.selectedItem, (item: ReportItem) => {
								if (item && this.queryString.selectedItem != item.id && this.reportQueryId != item.id && (this.pageId != item.id || this.reportQueryId)) {
									console.log('Selected report item changed to ', item.label, 'navigating...');
									item && item.navigateTo();
								}
							}, {name: `Update url when selected report item changes`});
							this._toDispose.push(updateUrlReaction);

							// Handled in report.ts
							/* let first = true;
							 this._toDispose.push(
								 autorun(`Serialize report to backend when it changes`, () => {
									 const { report } = this;
									 if (report) {
										 const touchAllProps = JSON.stringify(report);

										 if (first) { first = false }
										 else reportStore.put(report);
									 }
								 })
							 )*/
						}

						// If we're viewing a single report query, changing the active view needs to update the page's url
						if (this.reportQuery) {
							this._toDispose.push(
								reaction(
									() => this.reportQuery && this.reportQuery.view,
									view => {
										if (view) {
											routing.replace(this.reportQuery.routeFor(view))
										}
									}
								));
						}

						if (reportQueryId && !this.reportQuery) {
							site.toaster.show({intent: bp.Intent.WARNING, message: 'The query could not be found.'})
							report.navigateTo();
						}
						else if (pageId && !this.page) {
							site.toaster.show({intent: bp.Intent.WARNING, message: 'The query could not be found.'})
							report.navigateTo();
						}
					});
				}, {name: `Load report for report page`, fireImmediately: true}
			));
	}

    @computed
	get reportQuery() {
		const {reportQueryId, report} = this;

		if (!reportQueryId || !report) {
			return null;
		}
		else {
			const result = report.findItem(reportQueryId) as ReportQuery;

			return result;
		}
	}

    @computed
	get page() {
		const {report, pageId, queryString} = this;

		if (!report) return null;

		if (pageId) {
			const result = report.findItem(pageId) as ReportPage;

			return result;
		}

		if (queryString.selectedItem) {
			const item = report.findItem(pageId);
			if (item instanceof ReportPage) return item;
		}

		return null;
	}

    syncSiteHeader = () => {
		this._toDispose.push(autorun(() => {
			// For autorun to react to:
			const {report, page, reportQuery} = this;
			if (reportQuery) {
				const {query} = reportQuery
				if (query) {
					const {hasResult} = query;
				}
			}
		}, {name: `Sync site header from location URL`}));
	}

    @computed
	get inPresentationMode() {
		return !settings.report.showLayoutTabs && !settings.report.showToolbars && !settings.report.showQuerySidebars;
	}

    @action togglePresentationMode = () => {
		const {inPresentationMode}        = this;
		settings.report.showLayoutTabs    = inPresentationMode;
		settings.report.showToolbars      = inPresentationMode;
		settings.report.showQuerySidebars = inPresentationMode;
	}

    // renderReportTopMenu = () => {
    //     const {report} = this;
    //     const {MenuItem, Menu}             = semanticMenu;
    //
    //     return ([
    //             report != null ?
    //             <MenuItem key="view" menuItemLabel="Views">
    //                 <MenuItem menuItemLabel={`Show Sidebar`}
    //                     key="show-sidebar"
    //                     checked={this.props.showSidebar}
    //                     onClick={() => api.report.ui.toggleShowSidebar()}/>
    //                 <MenuItem menuItemLabel={`Show Toolbars`}
    //                           key="show-toolbars"
    //                           checked={prefs.showSecondaryToolbars}
    //                           onClick={() => api.report.ui.toggleSecondaryToolbars()}/>
    //             </MenuItem> : null
    //         ]
    //     );
    // };

    //reportChooserController:ReportChooserController;

    //modal: ModalDialog;

    // export function updateReportBuilderTitleFromStore() {
    // 	const store = getState();
    //
    // 	const {currentReport, selectedItem} = store.report;
    // 	const {rename: {descriptor: rename}}      = api.site;
    //
    // 	let title = currentReport
    // 		? rename && currentReport.id === rename.id
    // 		            ? rename.value
    // 		            : helpers.labelFor(currentReport)
    // 		: 'Report Browser';
    //
    // 	// let subtitle(currentReport && selectedItem && selectedItem.type !== 'report' && selectedItem)
    // 	//     ? renamingItemDescriptor && selectedItem.id === renamingItemDescriptor.id
    // 	//                    ? renamingItemDescriptor.value
    // 	//                    :helpers.labelFor(selectedItem)
    // 	//     : "";
    //
    // 	Object.assign(api.site.header, {
    // 		label:    title,
    // 		type:     'report',
    // 		editable: currentReport != null,
    // 		id:       currentReport ? currentReport.id : null
    // 	})
    // }

    // /**
    //  * Read the current location (URL) and load the report and set the selected item as necessary.
    //  */
    // export function updateStoreFromUrl(location: LocationDescriptorObject, routeParams?: {id?: string}) {
    // 	const store                         = getState();
    // 	const {currentReport, selectedItem} = store.report;
    //
    // 	const queryString = location.query as IQueryString;
    //
    // 	if (queryString.createReportFromViewList) {
    // 		createFromViewList(queryString.queryResultId, JSON.parse(queryString.views) as string[]);
    // 	}
    // 	else if (routeParams.id === 'new-report') {
    // 		create();
    // 	}
    // 	else if (routeParams.id == null) {
    // 		navigateToReportBrowser();
    // 	}
    // 	else {
    // 		// We have a report id on our path
    // 		const selectedReportItemId = queryString != null ? queryString.selectedItem : null;
    //
    // 		// Do we need to switch to the report?
    // 		if (currentReport == null || currentReport.id !== routeParams.id) {
    // 			open(routeParams.id, selectedReportItemId);
    // 		}
    // 		// Is this report the one we currently have loaded?
    // 		else if (currentReport && currentReport.id === routeParams.id) {
    // 			// But a different selection?
    // 			if (selectedItem && selectedReportItemId && selectedReportItemId !== selectedItem.id) {
    // 				// Select the item indicated by our URL
    // 				api.report.currentReport.selectReportItem(api.report.findItemById(selectedReportItemId));
    // 			}
    // 		}
    // 	}
    // }
}

// return (<div>
// 	{report && (
// 		<bp.MenuItem icon="book" text={report.name} href={report.clientUrl}>
// 			{(<div>
// 				{page && (<div>
// 					<bp.MenuDivider title={`Page ${page.index + 1}`}/>
// 					<bp.MenuItem text="Add Query" disabled={!report} icon="search" onClick={() => page.addReportQuery()}/>
// 					<bp.MenuItem text="Add Text Block" disabled={!report} icon="new-text-box" onClick={() => page.addText()}/>
// 					<bp.MenuDivider/>
// 				</div>).props.children}
//
// 				<bp.MenuItem text='Navigate to...' icon='folder-open' href={report.clientUrl}>
// 					<bp.MenuItem text='Report Overview' href={report.clientUrl}/>
// 				</bp.MenuItem>
//
// 				<bp.MenuDivider/>
//
// 				<bp.MenuItem text="Rename" disabled={!report} icon="edit"/>
// 				<bp.MenuItem text="Export" disabled={!report} icon="export" onClick={() => report.export()}/>
// 				<bp.MenuItem text="Duplicate" disabled={!report} icon="duplicate" onClick={() => report.duplicate(true)}/>
//
// 				<bp.MenuDivider />
// 				<bp.MenuItem text="Delete" disabled={!report} icon="trash" onClick={() => report.delete()}/>
// 			</div>).props.children.filter(c => c) /* Stupid hack for blueprint failing with false/null menuitems */ }
// 		</bp.MenuItem>)}
//
// 	{report && <bp.MenuDivider/>}
//
// 	<bp.MenuItem text="New Report" icon="document" onClick={() => dialogs.newReport()}/>
// 	<bp.MenuItem text="Open Report" icon="folder-open" onClick={dialogs.openReport}/>
// 	<bp.MenuDivider/>
// </div>).props.children