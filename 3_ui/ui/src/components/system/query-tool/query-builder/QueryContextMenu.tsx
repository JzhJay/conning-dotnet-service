import {Menu, MenuItem} from '@blueprintjs/core';
import {bp, JumpToReportItemMenuItem, QueryPropertiesDialog, dialogs, LinkMenuItem, QueryCard, SortableCardsPanel, AppIcon} from 'components';
import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import type { SiteLocation } from 'stores';
import {appIcons, ReportQuery, Query, QueryDescriptor, routing, queryStore, site, mobx, omdb, api, i18n} from 'stores';
import { observer } from 'mobx-react';
import { observable, makeObservable } from 'mobx';
import * as React from "react";
import {openInNewTab} from "../../../../utility";
import { ReportLayoutManager } from "../../report/detailPane/ReportLayoutManager";
import { queryMessages } from '../../../../stores/i18n/queryMessages';

import * as css from './QueryContextMenu.css';

interface MyProps {
	reportQuery?: ReportQuery;
	className?: string;
	query?: QueryDescriptor | Query;
	currentView?: string;
	location?: SiteLocation
	panel?: SortableCardsPanel;
	layoutManager?: ReportLayoutManager;
	onRename?: () => void;
}

@observer
export class QueryContextMenu extends React.Component<MyProps, {}> {
	render() {
		const { formatMessage } = i18n.intl;
		let { className, children, panel, currentView, location, reportQuery, layoutManager, onRename } = this.props;
		let query = this.props.query as Query;
		// if (reportQuery) {
		// 	query = reportQuery.query
		// }

		if (!query && panel && panel.selectedItems.size == 1) {
			query = panel.selectedItems.values()[0];
		}

		const queryResult = query ? query.queryResult : null;
		const allowLayoutDuplicating = reportQuery && layoutManager;
		currentView = currentView ? currentView : queryResult ? queryResult.currentView : 'query';

		const url = reportQuery ? reportQuery.clientUrl : query ? query.clientUrl : null;
		const name = reportQuery ? reportQuery.name : query ? query.name : queryResult ? queryResult.name : '';
		const isUseCaseQueryResult = queryResult && query.isUseCaseQuery;

		if (query && query.isRunning) {
			return <bp.MenuItem text="Query is Running.  Please Wait"/>;
		}

		return <bp.Menu className={classNames(css.root, className)}>
			<bp.MenuItem disabled={true} text="">
				<bp.MenuItem text="" />
			</bp.MenuItem>


			{(location == 'header' || (panel && location != 'card')) && !query && (<div>
				<bp.MenuItem
					text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(Query.OBJECT_NAME_SINGLE)}
					icon={<AppIcon icon={appIcons.file.create} />}
					onClick={() => dialogs.newQuery()}
				/>
			</div>).props.children}

			{panel && panel.selectedItems.size > 1 && !query && (
				<div>
					{<bp.MenuDivider title={`${panel.selectedItems.size} Queries Selected`}/>}
					<bp.MenuItem icon="multi-select" text="Open Individual Queries" onClick={() => mobx.values(panel.selectedItems).forEach(q => openInNewTab(q.clientUrl))} />
					<bp.MenuItem text={`Delete Selected Queries`} icon='trash' onClick={() => queryStore.deleteQueryDescriptors(Array.from(panel.selectedItems.keys()))}/>
				</div>).props.children}


			{location == 'header' && !query && (<div>
				{!routing.isActive(queryStore.browserUrl()) && <LinkMenuItem href={queryStore.browserUrl()} icon={'folder-open'} text='Browse...'/>}
				<bp.MenuItem
					text={i18n.common.OBJECT_CTRL.OPEN_RECENT}
					icon={<AppIcon icon={appIcons.file.open} />}
					disabled = {!queryStore.recentQueries || queryStore.recentQueries.length == 0}>
					<RecentQueryMenu />
				</bp.MenuItem>

				{reportQuery && <JumpToReportItemMenuItem report={reportQuery.report}/>}
			</div>).props.children}

			{isUseCaseQueryResult ? children :
			query && !isUseCaseQueryResult && (<div>

				{children}

				{queryResult && queryResult.contextMenuItems}

				{allowLayoutDuplicating && <bp.MenuItem text="Duplicate Horizontally" icon="arrows-horizontal" onClick={e => layoutManager.onDuplicateView(reportQuery, 'right')}/>}
				{allowLayoutDuplicating && <bp.MenuItem text="Duplicate Vertically" icon="arrows-vertical" onClick={e => layoutManager.onDuplicateView(reportQuery, 'down')}/>}
				{allowLayoutDuplicating && <bp.MenuDivider/>}

				<MenuItem
					text={i18n.common.OBJECT_CTRL.BOOK}
					icon={<AppIcon icon={appIcons.investmentOptimizationTool.pages}/>}
					popoverProps={{hoverCloseDelay: 100}}
				>
					<QueryBookMenu query={query as Query}/>
				</MenuItem>
				<bp.MenuDivider/>

				<bp.MenuItem
					text={i18n.intl.formatMessage({defaultMessage: 'Variables Layout', description: '[QueryContextMenu] item title - Indicates a Query Tool Variables Layout setting block'})}
					icon={"list-columns"}
				>
					<bp.MenuItem
						active={!query.shouldExpandVariables}
						text={i18n.intl.formatMessage({defaultMessage: 'Collapsed (Vertical)', description: '[QueryContextMenu] Variables Layout sub-item title - Query Tool Variables Layout - Vertical'})}
						onClick={() => query.setVariablesLayout(false)}/>
					<bp.MenuItem
						active={query.shouldExpandVariables}
						text={i18n.intl.formatMessage({defaultMessage: 'Expanded (Horizontal)', description: '[QueryContextMenu] Variables Layout sub-item title - Query Tool Variables Layout - Horizontal'})}
						onClick={() => query.setVariablesLayout(true)}/>
				</bp.MenuItem>
				{query && <bp.MenuItem
					text={i18n.intl.formatMessage({defaultMessage: 'Change Queried Simulation(s)', description: "[QueryContextMenu] item title - open properties dialog to change simulation setting"})}
					disabled={!query || query.busy}
					icon={<AppIcon icon={appIcons.tools.simulations} iconningSize={20} style={{width:16, height:16}} />}
					onClick={this.onChangeSimulations}
				/>}
				{query instanceof Query && <bp.MenuItem
					text={i18n.intl.formatMessage({defaultMessage: "Reset Query Specification", description: "[QueryContextMenu] item title - reset all inputs configuration"})}
					disabled={!query || query.busy}
					icon="history"
					onClick={() => query.reset()}
				/>}
				<bp.MenuItem
					text={i18n.intl.formatMessage({defaultMessage: "Run Query Specification", description: "[QueryContextMenu] item title - execute for the query result"})}
					disabled={!query || query.busy || query.hasResult}
					icon="play"
					onClick={async () => {
						if (panel) {
							query.navigateTo();
						}
						const qr = await query.run();
						reportQuery && reportQuery.setView('pivot');
					}
				}/>
				<bp.MenuDivider />
				<bp.MenuItem text={i18n.common.FILE_CTRL.EXPORT} icon={<AppIcon icon={appIcons.queryTool.download} style={{width:16, height:16}}/>}>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Query Specification", description: "[QueryContextMenu] export sub-item title - a inputs Specification JSON file"})}
						onClick={() => query.downloadQueryDefinition()}/>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Variables List", description: "[QueryContextMenu] export sub-item title - a currently variables list file"})}
						onClick={() => query.exportVariableList(false)}/>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Variables List (with ampersands)", description: "[QueryContextMenu] export sub-item title - a currently variables list file (with ampersands)"})}
						onClick={() => query.exportVariableList(true)}/>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Batch Import Files", description: "export sub-item title - a csv file include all data in this Query object"})}
						onClick={() => query.batchExportVariables()}/>
				</bp.MenuItem>
				{query && <bp.MenuItem text={formatMessage(queryMessages.importQuerySpecification)} disabled={!query || query.busy}
				                       icon={<AppIcon icon={appIcons.queryTool.upload} iconicDataAttribute={{"data-transfer-direction": "upload"}} iconningSize={20} style={{width:16, height:16}} />}
				                       onClick={() => site.setDialogFn(() => <QueryPropertiesDialog query={this.props.query} focusTarget='querySpecification'/>)}/>}

				<bp.MenuDivider />
				<bp.MenuItem text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(Query.OBJECT_NAME_SINGLE)} icon={<AppIcon icon={appIcons.file.create} />} onClick={() => queryFileControl.create() }/>
				{location != 'card' && !reportQuery && <bp.MenuItem text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RENAME(Query.OBJECT_NAME_SINGLE)} icon={<AppIcon icon={appIcons.file.rename} />} disabled={!query || query.busy} onClick={() => onRename ? onRename() : queryFileControl.promptRename(query) }/>}
				<bp.MenuItem text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DUPLICATE(Query.OBJECT_NAME_SINGLE)} icon={<AppIcon icon={appIcons.file.copy} />} onClick={this.onDuplicate}/>
				{reportQuery
				 ? <bp.MenuItem text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.REMOVE(Query.OBJECT_NAME_SINGLE)} icon={<AppIcon icon={appIcons.file.delete} />} onClick={() => reportQuery.delete()}/>
				 : query && <bp.MenuItem text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(Query.OBJECT_NAME_SINGLE)} icon={<AppIcon icon={appIcons.file.delete} />} disabled={!query || query.busy} onClick={() => queryFileControl.delete(query)}/>}
			</div>).props.children}

			{reportQuery && !query && <bp.MenuItem text='Clear Simulation(s)' icon='cross' onClick={() => reportQuery.simulationSlotIds = []}/>}

			{panel && (<div>
				<bp.MenuDivider />
				<bp.MenuItem text={`Select All`} icon='tick'
				             onClick={() => panel.selectAll()}/>
				<bp.MenuItem text={`Clear Selection`} icon='square'
				             onClick={() => panel.selectedItems.clear()}/>

			</div>).props.children}


			{/*{reportQuery && <bp.MenuDivider/>}*/}
			{/*{reportQuery && <bp.MenuItem text='Report Settings' icon='settings'>*/}
			{/*<bp.MenuItem text='Show Layout Tabs'*/}
			{/*icon={settings.report.showLayoutTabs ? 'tick' : 'blank'}*/}
			{/*onClick={() => settings.report.showLayoutTabs = !settings.report.showLayoutTabs}/>*/}
			{/*<bp.MenuItem text='Show Toolbars'*/}
			{/*icon={settings.report.showToolbars ? 'tick' : 'blank'}*/}
			{/*onClick={() => settings.report.showToolbars = !settings.report.showToolbars}/>*/}
			{/*<bp.MenuItem text='Show Query Sidebar'*/}
			{/*icon={settings.report.showQuerySidebars ? 'tick' : 'blank'}*/}
			{/*onClick={() => settings.report.showQuerySidebars = !settings.report.showQuerySidebars}/>*/}
			{/*</bp.MenuItem>}*/}
		</bp.Menu>
	}

	onChangeSimulations = () => {
		site.setDialogFn(() =>
			                 <QueryPropertiesDialog
				                 query={this.props.query}
				                 focusTarget='simulations'/>)
	}

	onDuplicate = async () => {
		const { location, query, reportQuery } = this.props;
		if (reportQuery) {
			reportQuery.duplicate();
		}
		else {
			const newQuery = await  query.duplicate();
			if (location == 'builder' || location == 'header') {
				newQuery.navigateTo();
			}
		}
	}

}

@observer
class RecentQueryMenu extends React.Component<{}, {}> {
    @observable recentQueries = queryStore.recentQueries;

    constructor(props: {}) {
        super(props);
        makeObservable(this);
    }

    render() {
		return <bp.Menu>
			{this.recentQueries.map(q => <RecentQueryMenuItem key={q.id} q={q} />)}
		</bp.Menu>
	}
}

@observer
class RecentQueryMenuItem extends React.Component<{q:QueryDescriptor}, {}> {
    @observable query = null;
    @observable isQueryNotFound = false;

    constructor(props: {q:QueryDescriptor}) {
        super(props);
        makeObservable(this);

	    const id = this.props.q.id;
	    omdb.runQuery({objectTypes: ['Query'], where: {_id:id}}).then(
		    value => {
			    if (value.result.results.length) {
				    this.query = new QueryDescriptor(value.result.results[0]);
				    queryStore.updateRecentQuery(id, this.query);
			    } else {
				    queryStore.deleteRecentQuery(id);
				    this.isQueryNotFound = true;
			    }
		    });
    }

    render() {
		const q = this.props.q;
		return <bp.Tooltip key={q.id} position={bp.Position.RIGHT} popoverClassName={'no-padding'} content={this.tooltipContent} intent={this.isQueryNotFound ? bp.Intent.DANGER : bp.Intent.NONE }>
				<LinkMenuItem href={q.clientUrl} icon="search" text={this.queryName}/>
			</bp.Tooltip>
	}

    get tooltipContent() {
		if (this.query == null) {
			return this.isQueryNotFound ? "Query is deleted" : "Loading";
		}
		return <QueryCard isTooltip query={this.query}/>;
	}

    get queryName() {
		if (this.query == null) {
			return `${this.props.q.name}`;
		}
		return `${this.query.name}`;
	}
}

@observer
export class QueryBookMenu extends React.Component<{query: Query}, {}> {
	render() {
		const {query} = this.props;

		return <Menu>
			{query.pages.map(page => <MenuItem key={page.id} text={page.title} disabled={!page.enabled} onClick={() => query.navigateToPage(page)}/>)}
		</Menu>
	}
}

export class QueryFileControl {

	getName(query:(QueryDescriptor | Query)) {return query.name;}

	async setName(s:string, query:(QueryDescriptor | Query)) {
		return await ObjectNameCheckerDialog.saveUniqueNameOrDialog({
			model: Object.assign({__typename: Query.ObjectType }, query),
			newName: s,
			onRename: query.rename
		});
	}

	promptRename(query:(QueryDescriptor | Query)) {
		api.site.setDialogFn(() => <ObjectNameCheckerDialog
			model={Object.assign({__typename: Query.ObjectType }, query)}
			newName={query.name}
			onRename={query.rename}
		/>);
	}

	create() { dialogs.newQuery() }

	delete(query:(QueryDescriptor | Query)) { query.delete(); }

	async copy( query:(QueryDescriptor | Query) ) {
		const newQuery = await  query.duplicate();
		newQuery.navigateTo()
	}

	async copyToNewTab(query:(QueryDescriptor | Query)) {
		const newQuery = await query.duplicate();
		window.open(newQuery.clientUrl);
	}

}

export const queryFileControl = new QueryFileControl();