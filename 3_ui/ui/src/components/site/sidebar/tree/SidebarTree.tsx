import * as commonCss from '../SidebarPanel.css';
import * as css from './SidebarTree.css';

import {bp, sem, dialogs, SimulationCard, ApplicationPopoverMenu, LoadingIndicator} from 'components';
import {api, routing, QueryDescriptor, Simulation, Query, site} from 'stores';
import {observer} from 'mobx-react';
import { action, autorun, computed, observable, reaction, makeObservable } from 'mobx';
import {Link} from 'react-router';
import {SidebarTreeNode, SidebarTreeNodeType} from './SidebarTreeNode';
import {SimulationsNode} from './SimulationTreeNodes';
import {QuerySessionsTreeNode} from './QueryTreeNodes';
import {UsersNode} from './UserTreeNodes';
import {FavoritesTreeNode} from './FavoritesTreeNode';

@observer
export class SidebarTree extends React.Component<{}, {}> {
	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {nodes, loading} = this;

		// Touch every property
		SidebarTreeNode.recurseTouch(nodes);

		return (
			<sem.Menu.Item className={classNames(css.root, {[css.loading]: loading})}>
				<sem.Menu.Header>
					<Link className="ui fluid" to={routing.urls.home}>
						<sem.Icon name="folder outline"/>
						{site.productName}</Link>

					<div className={bp.Classes.BUTTON_GROUP}>
						<ApplicationPopoverMenu />
					</div>
				</sem.Menu.Header>

				{loading
					? <sem.Loader active indeterminate content="Loading..."/>
					: <bp.Tree
					 contents={nodes.slice()}
					 onNodeDoubleClick={this.onNodeDoubleClick}
					 onNodeClick={this.handleNodeClick}
					 onNodeCollapse={this.handleNodeCollapse}
					 onNodeExpand={this.handleNodeExpand}
					 onNodeContextMenu={this.onNodeContextMenu}
					 className={classNames(bp.Classes.ELEVATION_0)}
				 />}
			</sem.Menu.Item>
		)
	}

    @computed
	get loading() : boolean {
		return !api.simulationStore.hasLoadedDescriptors || !api.queryResultStore.hasLoadedDescriptors || !api.queryStore.hasLoadedDescriptors;
	}

    componentDidMount() {
		autorun(() => {
			this.forEachNode(this.nodes, (n, parentNodes) => {
				n.isSelected = routing.pathname == (n as SidebarTreeNode).url;
				if (n.isSelected && parentNodes) {
					parentNodes.forEach(pnode => pnode.isExpanded = true)
				}
			});
			this.forceUpdate();

			// Todo - scroll to the selected node
		}, {name: `Select corresponding tree node when the site url changes`})
	}

    private onNodeDoubleClick = (nodeData: bp.ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		nodeData.isExpanded = !nodeData.isExpanded;
		this.forceUpdate();
	}

    private handleNodeClick = (nodeData: bp.ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		const originallySelected = nodeData.isSelected;
		if (!e.shiftKey) {
			this.forEachNode(this.nodes, (n) => n.isSelected = false);
		}
		nodeData.isSelected = originallySelected == null ? true : !originallySelected;
		nodeData instanceof SidebarTreeNode && nodeData.select();

		this.forceUpdate();
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

    private onNodeContextMenu = (node: SidebarTreeNode, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		node.onContextMenu(nodePath, e);
	}

    @computed
	get nodes(): bp.ITreeNode[] {
		return this.loading ? [] : [
			new FavoritesTreeNode(),
			new SimulationsNode(),
			new QuerySessionsTreeNode(),

			// new FavoritesTreeNode(),
			// {
			// 	id:         2,
			// 	iconName:   "folder-close",
			// 	isExpanded: true,
			// 	label:      "Conning, Inc.",
			// 	childNodes: [
			// 		new SimulationsNode(),
			// 		new QuerySessionsTreeNode(),
			// 		new QueryResultsNode(),
			// 		//new SavedQueryTreeNodes(),
			//
			// 		// {id: 3, iconName: "document", label: "Item 0"},
			// 		// {id: 4, iconName: "pt-icon-tag", label: 'bar'},
			// 		// {
			// 		// 	id:         5,
			// 		// 	hasCaret:   true,
			// 		// 	iconName:   "pt-icon-folder-close",
			// 		// 	label:      <bp.Tooltip content="foo">Folder 2</bp.Tooltip>,
			// 		// 	childNodes: [
			// 		// 		{id: 6, label: "No-Icon Item"},
			// 		// 		{id: 7, iconName: "pt-icon-tag", label: "Item 1"},
			// 		// 		{
			// 		// 			id:         8, hasCaret: true, iconName: "pt-icon-folder-close", label: "Folder 3",
			// 		// 			childNodes: [
			// 		// 				{id: 9, iconName: "document", label: "Item 0"},
			// 		// 				{id: 10, iconName: "pt-icon-tag", label: "Item 1"},
			// 		// 			],
			// 		// 		},
			// 		// 	],
			// 		// },
			// 	],
			// },
			new UsersNode()
		];
	}
}