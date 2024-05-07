import { dialogs, QueryBrowser, bp, QueryContextMenu } from 'components';
import type { SiteLocation } from 'stores';
import { api, utility, appIcons, viewDescriptors, Query, ReportPage, ReportQuery, ReportText, Report, ReportItem, QueryViewUiDescriptor, QueryDescriptor } from 'stores';
import { observer } from 'mobx-react'
import { ReportItemNode } from "components/site/sidebar/reports";
import { ReportPageContextMenu } from "./ReportPageContextMenu";
import { ReportTextContextMenu } from "./ReportTextContextMenu";
import { ReportLayoutManager } from "../detailPane/ReportLayoutManager";
import { ReportContextMenu } from "./ReportContextMenu";
import { QueryViewAvailability } from "../../../../stores/query";

interface MyProps {
	node?: ReportItemNode;
	item?: ReportItem;
	layoutManager?: ReportLayoutManager;
	location?: SiteLocation
}

@observer
export class ReportItemContextMenu extends React.Component<MyProps, {}> {
	render() {
		let { location, item, node, children, layoutManager, ...props } = this.props;
		if (!item) {
			if (node) {
				item = node.item;
			}
			else {
				throw new Error("Node or Report Item is required.")
			}
		}
		const reportQuery: ReportQuery = null;

		const type = item ? item.type : node.id;

		switch (type) {
			case 'report': {
				return <ReportContextMenu report={item as Report} location={location}/>
			}
			case 'page': {
				return <ReportPageContextMenu page={item as ReportPage} location={location}/>
			}

			case 'query': {
				const reportQuery = item as ReportQuery;
				return <QueryContextMenu reportQuery={reportQuery} currentView={reportQuery.view} location={location} layoutManager={layoutManager}/>
			}

			case 'text': {
				return <ReportTextContextMenu reportText={item as ReportText} location={location} layoutManager={layoutManager}/>
			}

			default: {
				break;
			}
		}

		const m = {
			addReport: <bp.MenuItem
				key="add-report"
				text='New Report'
				icon="book"
				onClick={() => dialogs.newReport()}/>,

			addFolder: <bp.MenuItem
				key="add-folder"
				text='New Folder'
				icon="folder-close"
				onClick={this.onCreateFolder}/>,

			addPage: <bp.MenuItem
				key="add-page"
				text={`New Page`}
				icon="document"
				onClick={this.onCreatePage}/>,

			newQuery: <bp.MenuItem
				key="new-query"
				icon="search"
				text={`New Query`}
				onClick={this.onNewQuery}/>,
			addQuery: <bp.MenuItem key="add-existing-query"
			                       icon="folder-open"
			                       text="Import Query"
			                       onClick={() => this.onBrowseAddQuery()}/>,

			// pageLayout: item && <bp.MenuItem key="page-layout" text="Page Layout">
			// 	            <bp.Menu>
			// 		            <bp.MenuItem text={`Tabs`}
			// 		                         disabled={item.children.length <= 1}
			// 		                         onClick={() => report.layoutController.setPageLayout.tabs(item)}/>
			// 		            <bp.MenuItem text={`Horizontal`}
			// 		                         disabled={item.children.length <= 1}
			// 		                         onClick={() => report.layoutController.setPageLayout.horizontal(item)}/>
			// 		            <bp.MenuItem text={`Vertical`}
			// 		                         disabled={item.children.length <= 1}
			// 		                         onClick={() => report.layoutController.setPageLayout.vertical(item)}/>
			// 	            </bp.Menu>
			//             </bp.MenuItem>,

			rename: null,
			deleteItem: item && <bp.MenuItem
				key="delete"
				icon="trash"
				text={`Delete`}
				onClick={item.delete}/>,

			switchActiveQueryView: reportQuery && <bp.MenuItem key="switch-view"
			                                                   text={`Switch '${viewDescriptors[reportQuery.view].label}' to...`}>
				<bp.Menu>
					{_.map(reportQuery.queryResult.availableViews, (v: QueryViewAvailability) => viewDescriptors[v.name])
					  .filter(v => v.name !== reportQuery.view && !v.hide && v.name !== 'query')
					  .map(view =>
						       <bp.MenuItem key={view.name}
						                    text={`${view.label}`}
						                    onClick={() => reportQuery.setView(view.name)}/>
					  )}

				</bp.Menu>
			</bp.MenuItem>,

			cloneHor: reportQuery && layoutManager && <bp.MenuItem key="cloneHor" text="Clone Horizontally" onClick={e => layoutManager.onDuplicateView(reportQuery, 'right')}/>,
			cloneVer: reportQuery && layoutManager && <bp.MenuItem key="cloneVer" text="Clone Vertically" onClick={e => layoutManager.onDuplicateView(reportQuery,'down')}/>,

			expandSubtree: item && <bp.MenuItem key="expandSubtree" text={`Expand Subtree`} onClick={() => item.expandSubtree()}/>,
			collapseSubtree: item && <bp.MenuItem key="collapseSubtree" text={`Collapse Subtree`} onClick={() => item.collapseSubtree()}/>
		}

		return (<bp.Menu {...props} >
			{!type && [m.addReport]}
			{(type == 'report' || type == 'folder') && [m.addPage]}
			{(type == 'folder' || type == 'page') && [m.addQuery]}
			<bp.MenuDivider/>
			<bp.MenuItem text={`Open in New Tab`} onClick={() => this.openLink(item, 'tab')}/>
			<bp.MenuDivider/>
			{type && [m.deleteItem, m.rename]}

			{reportQuery != null && reportQuery.queryId != null && <bp.MenuItem text={`Open as Standalone Query`}
			                                                                    onClick={() => this.openAsStandaloneQuery(reportQuery)}/>}

			{/*<MenuItem menuItemLabel={`Open in New Window`}*/}

		</bp.Menu>)
	}

	onCreateFolder = () => {
		const { node: { item } } = this.props;
		item.children.push(Report.defaults.newFolder(item.report, item))
	}

	onCreatePage = () => {
		const { node: { item } } = this.props;
		item.children.push(Report.defaults.newPage(item.report, item))
	}

	onNewQuery = () => {
		const { node: { item } } = this.props;
		item.children.push(Report.defaults.newQuery(item.report, item))
	}

	onAddQuery_Modal = (query: QueryDescriptor) => {
		const { node: { item } } = this.props;
		let newItem = Report.defaults.newQuery(item.report, item) as ReportQuery;
		newItem.queryId = query.id;
		newItem.setView("query");
		newItem.name = query.name

		// api.report.currentReport.additem(item.id, newView, true);
	}

	onBrowseAddQuery = () => {
		const { node: { item } } = this.props;
		api.site.setDialogFn(() => {
			return (
				<QueryBrowser onSelect={(query: Query) => this.onAddQuery_Modal(query)} />
			)
		});
	}

	openAsStandaloneQuery = (view: ReportQuery) => {
		const url = api.routing.routeFor.query(view.queryId);

		let win = window.open(url, '_blank');
		win.focus();
	}

	openLink = (reportItem: ReportItem, where: 'tab' | 'window') => {
		// const location = api.report.locationFor(currentReport ? currentReport.id : null, reportItem);
		// const url      = utility.locationToUrl(location);
		//
		// if (where === 'tab') {
		// 	let win = window.open(url, '_blank');
		// 	win.focus();
		// }
		// else {
		// 	let win = window.open(url, '_blank', `width=${window.innerWidth},height=${window.outerHeight}`);
		// 	win.focus();
		// }
	}

}
