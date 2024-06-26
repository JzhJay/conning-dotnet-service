import {
	QueryPropertiesDialog,
	bp,
	sem,
	ApplicationPage,
	QueryBrowser,
	QueryContextMenu,
	ErrorMessage,
	semanticMenu,
	ApplicationPopoverMenu,
	queryFileControl,
	QueryPanel
} from 'components';
import {ApplicationShortCuts} from 'components/site/ApplicationShortCuts';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {api, routing, settings, julia, user, site, queryStore, HTTP_STATUS_CODES, appIcons, Query, ActiveTool, QueryDescriptor, i18n} from 'stores';
import {
    observable,
    computed,
    autorun,
    action,
    runInAction,
    makeObservable,
} from 'mobx';
import {observer} from 'mobx-react'
import {downloadFile} from 'utility';
import {QueryApplicationBarItems} from '../QueryApplicationBarItems';
import * as css from './StandaloneQueryPage.css';
import {Switch, ControlGroup, Navbar} from '@blueprintjs/core';

const {Message} = sem;

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	params?: { queryId?: string }
}

interface QueryString {
	view?: string
}

@observer
export class StandaloneQueryPage extends React.Component<MyProps, {}> {
    @observable browser: any;

    constructor(props: MyProps) {
        super(props);
	    this.queryId = this.props.params.queryId;

		makeObservable(this);

	    this._toDispose.push(autorun(this.syncSiteHeader));
	    this.watchQueryIdInUrlAndStartSessionIfNeeded();
    }

	@computed get title() {
		const {isQueryBrowser} = this;
		return isQueryBrowser
		       ? i18n.common.OBJECT_CTRL.WITH_VARIABLES.BROWSER(Query.OBJECT_NAME_SINGLE)
		       : i18n.intl.formatMessage({defaultMessage: "Query Tool", description: "[StandaloneQueryPage] the page title display on an object viewer, system application menu and the page's top-left button"})
	}

	@computed get languages(){
		return {
			expertSearchMode: i18n.intl.formatMessage({
				defaultMessage: "Expert Search Mode",
				description:    "[StandaloneQueryPage][renderExtraSettingsMenuItems] a trigger which control Query's Expert Search Mode"
			}),
			animateChanges: i18n.intl.formatMessage({
				defaultMessage: "Animate Changes",
				description: "[StandaloneQueryPage][renderExtraSettingsMenuItems] a trigger which control is there had animate when query has change"
			})
		}
	}

    render() {
		const {isQueryBrowser, isDeletingCurrentQuery, query, queryId: id, error, view, props: {location}} = this;
		const queryWithoutSimulations = query && query.simulations.length == 0;



		//!julia.connected
		return (
			<ApplicationPage id="standalone-query-page"
			                 className={classNames(css.root, {[css.error]: !julia.connected && error != null})}
			                 loaded={true}
			                 tool={ActiveTool.query}
			                 activeItem={query}
			                 tag={() => this.query}
			                 title={() => this.title}
			                 breadcrumbs={() => {
				                 const {query, view, queryId} = this;

				                 let result = [];

				                 // result.push(<Link to={queryStore.browserUrl} activeClassName='pt-breadcrumb-current' className={bp.Classes.BREADCRUMB}>
				                 // 	            Queries
				                 //             </Link>);

				                 //if (!query) {
					                 result.push(<ApplicationPopoverMenu/>)
				                 /*}
				                 else {
					                 result.push(
						                 <bp.Popover position={bp.Position.BOTTOM}
						                             interactionKind={bp.PopoverInteractionKind.CLICK}
						                             className={bp.Classes.BREADCRUMB}
						                             content={<QueryContextMenu query={query} currentView={this.view} location='builder'/>}>
							                 <IconButton
								                 className={classNames(bp.Classes.MINIMAL)}
								                 icon={appIcons.tools.queries}
								                 rightIcon="caret-down"
								                 text={query.name}
								                 href={query.clientUrl}
								                 onClick={(e) => {
									                 query.navigateTo();
									                 e.preventDefault();
								                 }}
							                 />
						                 </bp.Popover>);
				                 }*/
				                 // if (queryId) {
				                 // 	result.push(<ApplicationPopoverMenu />);
				                 // 	//<bp.MenuItem key={queryId} text={query ? query.name : 'Loading...'}
				                 // 	//             href={query ? query.clientUrl : null} />);
				                 // }

				                 if (this.browser && !_.isEmpty(this.browser.catalogContext.path)) {
					                 this.browser.panel.addToBreadcrumbs(result);
				                 }

				                 return result;
			                 }}
			                 afterBreadcrumbs={() => {
				                 const {query} = this;

				                 return query && <QueryApplicationBarItems query={this.query as Query}/>
			                 }}
			                 breadcrumbsRight={() => this.query && <ApplicationShortCuts
				                 isBusy={this.query.busy}
				                 getName={() => queryFileControl.getName(this.query)}
				                 setName={(s) => queryFileControl.setName(s,this.query)}
				                 updateNameOnlyBlur={true}
				                 copy={() => queryFileControl.copy(this.query)}
				                 copyToNewTab={() => queryFileControl.copyToNewTab(this.query)}
				                 delete={() => queryFileControl.delete(this.query)}
			                 />}
			                 applicationButtonText={() => this.title}
			                 renderApplicationMenuItems={() => {
				                 const {query, view} = this;

				                 return <QueryContextMenu query={query} currentView={view} location='header'/>

				                 //
				                 // return (
				                 // 	<div>
				                 // 		{queryResult &&
				                 // 		 (<div>
				                 // 				 <AvailableQueryViewMenuItems query={query} queryResult={queryResult} currentView={view}/>
				                 // 				 <bp.MenuDivider/>
				                 // 			 </div>
				                 // 		 ).props.children}
				                 //
				                 // 		<bp.MenuItem text="Reset Query" disabled={!query || query.busy} icon="step-backward" onClick={() => query.reset()}/>
				                 // 		{!query.hasResult && <bp.MenuItem text="Run Query" disabled={query.busy} icon="play" onClick={() => query.run()}/>}
				                 //
				                 // 		<bp.MenuDivider/>
				                 //
				                 // 		<bp.MenuItem text="Rename" icon="edit" onClick={() => query.promptRename()}/>
				                 // 		<bp.MenuItem text="Save Unbound" icon="floppy-disk" target="download" href={query ? `${query.definitionLinkUrl}` : null}/>
				                 // 		<bp.MenuItem text="Move to Report" disabled={!query} icon="book" onClick={this.addToNewReport}/>
				                 // 		<bp.MenuItem text="Duplicate" disabled={!query || query.busy} icon="duplicate" onClick={() => this.duplicateQuery()}/>
				                 // 		<bp.MenuDivider/>
				                 // 		<bp.MenuItem text="Delete" disabled={!query || query.busy} icon="trash" onClick={() => this.deleteQuery()}/>
				                 //
				                 //
				                 // 	</div>
				                 // ).props.children;
			                 }}
			                 renderExtraSettingsMenuItems={() => {
				                 return <>
					                 {/*<Switch label="Hide Implied Axes" checked={preferences.query.hideImpliedAxes} onClick={() => preferences.query.hideImpliedAxes = !preferences.query.hideImpliedAxes}/>*/}
					                 <bp.MenuItem
						                 icon={settings.query.expertMode ? 'tick' : 'blank'}
						                 text={this.languages.expertSearchMode}
						                 onClick={() => settings.query.expertMode = !settings.query.expertMode}/>
					                 <bp.MenuItem
						                 icon={settings.query.animate ? 'tick' : 'blank'}
						                 text={this.languages.animateChanges}
						                 onClick={() => settings.query.animate = !settings.query.animate}/>

				                 </>
			                 }}
			                 renderHeaderToolbarItemsRight={() => {
				                 //return null;

				                 const {query, queryId, runQueryLocation} = this;
				                 const {recentQueries}                    = queryStore;

				                 if (!query) {
					                 return null;
				                 }
				                 return (
					                 <div>
						                 {/*<QuerySessionStatusIndicator query={query}/>*/}

						                 {/*<span className='pt-navbar-divider'/>*/}

						                 <bp.Popover
							                 position={bp.Position.BOTTOM}
							                 interactionKind={bp.PopoverInteractionKind.CLICK}
							                 content={this.renderQuerySettings()}>
							                 <bp.AnchorButton minimal icon="cog"/>
						                 </bp.Popover>
					                 </div>).props.children;
			                 }}
			                 >
				{error
				 ? <ErrorMessage message={error}/>
				 : isQueryBrowser
				   ? <QueryBrowser queryParams={location.query} ref={action(r => this.browser = r)} /> // property remove: onOpenQuery & allowDelete are not been used anymore.
				   : view == 'query' && queryWithoutSimulations ? <Message warning><Message.Content content={i18n.intl.formatMessage({
							defaultMessage: "Simulation required to modify or view query settings",
							description:    "[StandaloneQueryPage] warning message - query can not loaded because the Simulation required to modify or view query settings"
						})}/></Message> : <QueryPanel deleting={isDeletingCurrentQuery} query={query} view={view} onSetCurrentView={view => query.queryResult && routing.push(query.queryResult.routeFor(view))}/>
					// <DraggableQueryBuilder queryId={id}/>
				}


			</ApplicationPage>)
	}

    get queryString(): QueryString {
		return this.props.location.query
	}

    @computed
	get query(): Query | QueryDescriptor {
		return this.isDeletingCurrentQuery ? null : queryStore.querySessions.has(this.queryId) ? queryStore.querySessions.get(this.queryId) : queryStore.descriptors.get(this.queryId);
	}

    @observable queryId;

    @computed
	get isQueryBrowser() {
		return this.queryId == null
	}

    @computed
	get view() {
		const {query, queryId, queryString} = this;

		if (queryString.view) {
			return queryString.view;
		} else if (query) {
			if (query.queryResult) {
				return query.queryResult.currentView;
			}
			else if (query.hasResult) {
				return 'pivot'
			}
		}

		return 'query';
	}

    renderToolbar = () => {
		const {query, runQueryLocation} = this;
		const {sidebar}                 = settings;

		return query && (<Navbar className="wrap">
			<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)}>
				{query instanceof Query && <div className={bp.Classes.BUTTON_GROUP}>
					<label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}>Arrangement:</label>
					<bp.AnchorButton icon="arrow-down" text="Rows" onClick={query.arrangement.allToRows}/>
					<bp.AnchorButton icon="pivot-table" text="Flip" onClick={query.arrangement.flip}/>
					<bp.AnchorButton icon="arrow-right" text="Columns" onClick={query.arrangement.allToColumns}/>
				</div>}


				{/*<div className={bp.Classes.BUTTON_GROUP}>*/}
				{/*<bp.AnchorButton icon="document" title="New Query" onClick={siteActions.newQuery}/>*/}
				{/*<bp.AnchorButton icon="folder-open" title="Open Query" onClick={() => StandaloneQueryPage.runQuery(query)}/>*/}
				{/*<bp.AnchorButton icon="floppy-disk" title="Save Query to Disk" target="download" href={query ? `${query.definitionUrl}` : null}/>*/}
				{/*</div>*/}


				{/*<div className={bp.Classes.BUTTON_GROUP}>*/}
				{/*<bp.AnchorButton icon="" text="" onClick={null}/>*/}
				{/*</div>*/}
			</div>
		</Navbar>)
	}

    @observable error: string;

    _toDispose: Function[] = [];

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
		this.query && this.query.dispose();
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		runInAction(() => this.queryId = this.props.params.queryId );
	}

    syncSiteHeader = () => {
		const {query, queryId: id, isQueryBrowser} = this;
		const name                                 = query ? query.name : i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(Query.OBJECT_NAME_SINGLE);
		const hasResult                            = query ? query.hasResult : false;

		// runInAction: Update site header for current query
		runInAction(() => {
			const {site} = api;
			site.header  = {
				type:   'query',
				id:     id,
				status: !query || isQueryBrowser ? '' : 'All changes saved',
			}
		})
	}

    @action addToNewReport = async () => {
		const {query} = this;

		const report  = await site.actions.newReport();
		const simSlot = report.addSimulationSlot();

		simSlot.simulationId = query.simulationIds[0];

		const page          = report.addPage();
		const reportQuery   = page.addReportQuery();
		reportQuery.queryId = query.id;
	}

    modifyQueryProperties = (focus: 'name' | 'simulations' = 'simulations') => {
		site.setDialogFn(() => <QueryPropertiesDialog query={this.query} focusTarget={focus}/>)
	}

    duplicateQuery = async () => {
		site.busy = true;
		try {
			const newQuery = await this.query.duplicate()
			newQuery.navigateTo();
		}
		finally {
			site.busy = false;
		}
	}

    deleteQuery = async () => {
		const {query} = this;

		if (await site.confirm(
			`${i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(`"${query.name}"`)}?`,
			i18n.intl.formatMessage({defaultMessage: 'This action cannot be undone.', description: "[StandaloneQueryPage] warning message - confirm message before delete"}),
			<sem.Icon size='large' name='trash'/>,
			i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE( Query.OBJECT_NAME_SINGLE)
		)) {
			this._toDispose.forEach(f => f())
			queryStore.navigateTo();
			setTimeout(() => query.delete(), 200);
		}
	}

    renderQuerySettings = () => {
		const {query, runQueryLocation} = this;

		return <div className={css.settingsPanel}>
			<h5><FormattedMessage defaultMessage={"Settings"} description={"[StandaloneQueryPage] the extra setting menu title"}/></h5>

			<div>
				<ControlGroup vertical>
					{/*<Switch label="Hide Implied Axes" checked={preferences.query.hideImpliedAxes} onClick={() => preferences.query.hideImpliedAxes = !preferences.query.hideImpliedAxes}/>*/}
					<Switch label={this.languages.expertSearchMode} checked={settings.query.expertMode} onChange={() => settings.query.expertMode = !settings.query.expertMode}/>

					<Switch label={this.languages.animateChanges} checked={settings.query.animate} onChange={() => settings.query.animate = !settings.query.animate}/>
				</ControlGroup>
			</div>
		</div>
	}

    @observable isDeletingCurrentQuery = false;

    processingMissingSimulation = false;
    watchQueryIdInUrlAndStartSessionIfNeeded = () => {
		this._toDispose.push(
			autorun(async () => {
				const {queryId: id, query, view} = this;
				const {hostname}                 = julia;
				const {isLoggedIn}               = user;

				if (this.processingMissingSimulation) {
					return;
				}

				if (query && query.status == 'deleting') {
					this.isDeletingCurrentQuery = true;
				}

				if (query && query.simulations.length == 0 && view == 'query') {
					await this.handleMissingSimulation(id, query);
					return;
				}

				if (id && (!queryStore.querySessions.has(id) || !queryStore.querySessions.get(id).hasSession)) {
					try {
						if (this.isDeletingCurrentQuery) {
							setTimeout(() => queryStore.navigateToBrowser(), 2000);
						}
						else {

							if (!query) {
								// Load descriptor and setup event source to get progress updates during session loading.
								let descriptor = await queryStore.loadDescriptor(id);
								descriptor.initEventSource();
							}

							if (view == 'query') {
								try {
									if (query instanceof Query) {
										await query.startSession();
									}
									else {
										// Wait until we know if we have a result or not
										await queryStore.startQuerySession(id);
									}
								}
								catch(e) {
									if (e.status == 406 && e.response.body.hasSimulation === false) {
										await this.handleMissingSimulation(id, query);
									}
									else
										throw(e);
								}
							}
							else {
								let query = await queryStore.getQuery(id);
								query.initializeQuerySession(); // Initialize session to get SSE updates.
							}
						}
					}
					catch (err) {
						//console.error(err);
						// runInAction: Update standalone query error state
						runInAction(() => {
							if (err.status === HTTP_STATUS_CODES.notFound) {
								this.error = `Could not find query \'${id}\'. Redirecting to query browser...`;
								if (!DEV_BUILD) {
									setTimeout(() => routing.push(routing.routeFor.queryBrowser), 2000);
								}
							}
							else {
								this.error = err.message;
							}
						});
					}
				}
				else {
					runInAction(() => {
						this.error = null;

						// Ensure that the event source is initialized when navigating to existing query that has a session.
						if (queryStore.querySessions.has(id) && queryStore.querySessions.get(id).eventSource == null) {
							queryStore.querySessions.get(id).initEventSource();
						}
					});
				}

				//this.updateToolbar();
			}, {name: `Start Query Session from URL`}));
	}

    async handleMissingSimulation(id, query) {
		this.processingMissingSimulation = true;
		if (!query) {
			query = await queryStore.getQuery(id);
		}
		site.setDialogFn(() =>
			<QueryPropertiesDialog
				query={query}
				onClosing={() => this.processingMissingSimulation = false}
				focusTarget='simulations'/>)
	}

    get runQueryLocation() {
		return settings.query.runQueryInNewTab
	}

    //
    // private updateToolbar = () => {
    // 	const {query, openInNewTab} = this;
    //
    // 	return;
    // 	site.renderToolbar = !query ? null : () => {

    // }

    private siteMenu_saveAs = () => {
		const {isQueryBrowser, query} = this;

		return (<semanticMenu.MenuItem menuItemLabel={`Save As...`} key="save-as"
		                               disabled={isQueryBrowser} download
		                               onClick={() => query && downloadFile(query.definitionLinkUrl)}
		                               systemIcon={appIcons.queryTool.save}/>);
	}

    onOpenQuery = (query) => {
		//this.context.router.push(routing.routeFor.query(query.id)))
		routing.push(routing.routeFor.query(query.id));
	}

    // static async runQuery(query: Query, runQueryInNewTab?: boolean) {
    // 	let toastKey;
    // 	if (runQueryInNewTab == null) {
    // 		runQueryInNewTab = settings.query.runQueryInNewTab;
    // 	}
    //
    // 	try {
    // 		//const RUN_QUERY_WITHOUT_CONFIRM_VARIABLE_THRESHOLD = 20;
    //
    // 		//const variableCount = query.variables.selected;
    // 		// if (variableCount <= RUN_QUERY_WITHOUT_CONFIRM_VARIABLE_THRESHOLD
    // 		// 	|| await site.confirm(`Are you sure you want to run this query for ${variableCount} variables?`)) {
    //
    // 		// toastKey = site.toaster.show({
    // 		// 	timeout: -1,
    // 		// 	message: <div className={css.runQueryProgressControl}>
    // 		// 		         <ProgressBar
    // 		// 			         className={classNames("docs-toast-progress")}
    // 		// 			         intent={Intent.PRIMARY}
    // 		// 			         value={100}
    // 		// 		         />
    // 		// 		         <span className="text">Querying {query.variables.selected} variables...</span>
    // 		// 	         </div>
    // 		// })
    //
    // 		site.busy = true;
    //
    // 		if (!runQueryInNewTab) {
    // 			const result = await query.run();
    // 			result.navigateTo()
    // 		}
    // 		else {
    // 			// We can't asynchronously wait on the operation here as then we count as a popup
    // 			utility.openInNewTab(routing.routeFor.runQueryInWindow(query));
    // 		}
    //
    // 		//}
    // 	}
    // 	finally {
    // 		site.busy = false;
    // 		toastKey && site.toaster.dismiss(toastKey);
    // 	}
    // }
}