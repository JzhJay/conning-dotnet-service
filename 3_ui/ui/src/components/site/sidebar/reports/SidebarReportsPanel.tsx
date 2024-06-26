import {observer} from 'mobx-react';
import {api, settings, routing, reportStore, Report, ReportDescriptor, site} from 'stores';
import {sem, bp, ReportItemContextMenu, mobx} from 'components';
import {Link} from "react-router";
import * as css from '../SidebarPanel.css';
import {computed, reaction, autorun, makeObservable} from 'mobx';
import {ReportDescriptorTreeNode, ReportItemNode, ReportNode} from './reportTreeNodes';

import * as styles from './SidebarReportsPanel.css'

@observer
export class SidebarReportsPanel extends React.Component<{}, {}> {
	constructor(props) {
		super(props);

		makeObservable(this);
	}

    @computed get sortedReports() : Array<Report | ReportDescriptor> {
		const {loadedReports, descriptors} = reportStore;

		const loaded = mobx.values(loadedReports.values);

		const reports = settings.sidebar.reports.filter ? loaded : [...loaded, ...mobx.values(descriptors).filter(s => !loadedReports.has(s.id))];

		return _.orderBy(reports,
			['loading', 'isActivePage', 'name'],
			['desc', 'desc', 'asc']);
	}

    componentDidUpdate() {
		const {tree, treeContents} = this;

		const allNodes = [];
		const addNodeAndChildren = n => {
			allNodes.push(n);
			n.childNodes && n.childNodes.forEach(addNodeAndChildren);
		}
		treeContents.forEach(addNodeAndChildren);

		//console.log(allNodes);

		allNodes.forEach(n => {
			const element = tree.getNodeContentElement(n.id);
			//console.log(n.id, element)

			if (n instanceof ReportItemNode) {
				n.setContentElement(element);
			}
		})
	}

    tree: bp.Tree;

    render() {
		const {sidebar: {reports: sidebarPrefs}} = settings;

		const {sortedReports, treeContents} = this;

		return (
			<sem.Menu.Item key="reports"
			               className={classNames(styles.root, css.sidebarPanel, {[css.noResults]: _.isEmpty(sortedReports)})}
			               active={routing.isActive(routing.urls.reportBrowser)}>
				<sem.Menu.Header>
					<span className="ui fluid">
						<sem.Icon name="folder outline"/>Reports
					</span>

					{/*<ToggleSidebarButton className="right floated" />*/}


					<div className={classNames(bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP, css.rightButtonGroup)}>

						<bp.Tooltip content="Show Report Tabs" >
							<bp.AnchorButton className={bp.Classes.MINIMAL}
							                 icon='changes' active={settings.report.showLayoutTabs}
							                 onClick={() => settings.report.showLayoutTabs = !settings.report.showLayoutTabs}/>
						</bp.Tooltip>

						<bp.Tooltip content="Navigate to Browser" >
							<Link to={reportStore.browserUrl} className={classNames(bp.Classes.BUTTON, "bp3-icon-folder-open")}/>
						</bp.Tooltip>

						<bp.Tooltip content="New Report" >
							<bp.Button icon="plus" onClick={() => site.actions.newReport()}/>
						</bp.Tooltip>
					</div>

					{/*<Button basic floated="right" compact size="small" icon="add"*/}
					{/*data-tooltip="Start a New Session" data-position={bp.Position.BOTTOM}*/}
					{/*onClick={() => dialogs.newQuery} /></Menu.Header>*/}

					{/*<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>*/}
						{/*<bp.Tooltip  content={sidebarPrefs.filter ? 'Show Available Results' : 'Hide Unopened Results' }>*/}
							{/*<bp.Button minimal icon='filter' active={sidebarPrefs.filter} onClick={() => sidebarPrefs.filter = !sidebarPrefs.filter}/>*/}
						{/*</bp.Tooltip>*/}


						{/*<bp.Tooltip  content="New Report">*/}
							{/*<bp.Button minimal icon="plus" onClick={() => dialogs.newReport()}/>*/}
						{/*</bp.Tooltip>*/}
					{/*</div>*/}
				</sem.Menu.Header>
				<bp.Tree
					ref={tree => this.tree = tree}
						contents={treeContents}
						onNodeDoubleClick={this.onNodeDoubleClick}
						onNodeClick={this.handleNodeClick}
						onNodeCollapse={this.handleNodeCollapse}
						onNodeExpand={this.handleNodeExpand}
						onNodeContextMenu={this.onNodeContextMenu}
						className={classNames(bp.Classes.ELEVATION_0)}
					/>
			</sem.Menu.Item>
		)
	}

    @computed get treeContents(): bp.ITreeNode[] {
		//if (!api.report.hasLoadedDescriptors) result.push('Loading...');

		return [];

		const { loadedReports, descriptors} = reportStore;

		const loaded = Array.from(loadedReports.values());

		let reports = settings.sidebar.reports.filter
			? loaded
			: [...loaded, ...mobx.values(descriptors.values).filter((s:ReportDescriptor) => !loadedReports.has(s.id))];

		reports = _.orderBy(reports,
		                    ['loading', 'isActivePage', 'name'],
		                    ['desc', 'desc', 'asc']);

		return reports.map(
				(r: ReportDescriptor | Report) => {
					if (r instanceof ReportDescriptor) {
						return new ReportDescriptorTreeNode(r);
					}
					else if (r instanceof Report) {
						return new ReportNode(r);
					}
				});
	}

    _toDispose = [];

    componentDidMount() {
		const {_toDispose} = this;

		_toDispose.push(autorun(() => {
			this.recurseTouch(this.treeContents)
			this.forceUpdate();
		}, {name: `Force Update due to underlying report tree change`}))
	}

    componentWillUnmount() {
		this.treeContents.forEach(tc => tc instanceof ReportItemNode && tc.dispose())
		this._toDispose.forEach(f => f());
	}

    recurseTouch = (nodes: bp.ITreeNode[]) => {
		if (nodes == null) return;

		nodes.forEach(n => {
			this.recurseTouch(n.childNodes);

			// Access all properties of the object
			const clone = Object.assign({}, n); //_.cloneDeep(n);
		});
	}

    private onNodeDoubleClick = (nodeData: ReportDescriptorTreeNode | ReportItemNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		nodeData.isExpanded = !nodeData.isExpanded;
		this.forceUpdate();
	}

    private handleNodeClick = (nodeData: ReportDescriptorTreeNode | ReportItemNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		if (nodeData && nodeData.url) {
			routing.push(nodeData.url)
		}

		// const originallySelected = nodeData.isSelected;
		// if (!e.shiftKey) {
		// 	this.forEachNode(this.treeContents, (n) => n.isSelected = false);
		// }
		// nodeData.isSelected = originallySelected == null ? true : !originallySelected;
		//
		// nodeData.select();
		//
		// this.forceUpdate();
	}

    private handleNodeCollapse = (nodeData: bp.ITreeNode) => {
		nodeData.isExpanded = false;
		this.forceUpdate();
	}

    private handleNodeExpand = (nodeData: bp.ITreeNode) => {
		nodeData.isExpanded = true;
		this.forceUpdate();
	}

    private forEachNode(nodes: bp.ITreeNode[], callback: (node: bp.ITreeNode, parentNodes: bp.ITreeNode[]) => void, parentNodes?: bp.ITreeNode[]) {
		if (nodes == null) {
			return;
		}

		for (const node of nodes) {
			callback(node, parentNodes);
			this.forEachNode(node.childNodes, callback, parentNodes ? [...parentNodes, node] : [node]);
		}
	}

    private onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
		bp.ContextMenu.show(<ReportItemContextMenu location='sidebar' />, {left: e.clientX - 8, top: e.clientY - 8});
		e.preventDefault();
	}

    private onNodeContextMenu = (node: ReportItemNode, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		bp.ContextMenu.show(<ReportItemContextMenu location='sidebar' node={node}  />, {left: e.clientX - 8, top: e.clientY - 8});
		e.preventDefault();
		e.stopPropagation();
	}
}


/*

		const menuItems = [];
		if (!hasLoadedDescriptors) {
			menuItems.push(<sem.Menu.Item key="loading" className={css.noResults}>
				<sem.Loader active inline size="tiny"/>
				Reports are loading...
			</sem.Menu.Item>);
		}

		if (hasLoadedDescriptors && loadedReports.size == 0 && descriptors.size > 0 && !sidebarPrefs.filter) {
			menuItems.push(<sem.Menu.Item key="no-open-reports" className={css.noResults}>
				No reports are currently open.
			</sem.Menu.Item>)
		}

		if (hasLoadedDescriptors) {
			sortedReports.forEach(r => {
				menuItems.push(<ReportSidebarMenuItem key={r.id} report={r}/>)
			});
		}

 */