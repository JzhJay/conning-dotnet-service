import {bp} from 'components';
import { observer } from "mobx-react";
import * as css from './BlueprintTree.css';
import { autorun } from "mobx";
import { SidebarTreeNode } from "../site/sidebar/tree/SidebarTreeNode";

interface MyProps {
	nodes:  bp.ITreeNode[];
	className?: string;
}

@observer
export class BlueprintTree extends React.Component<MyProps, {}> {
	render() {
		const {nodes, className} = this.props;

		return <bp.Tree
			contents={nodes}
			onNodeDoubleClick={this.onNodeDoubleClick}
			onNodeClick={this.handleNodeClick}
			onNodeCollapse={this.handleNodeCollapse}
			onNodeExpand={this.handleNodeExpand}
			onNodeContextMenu={this.onNodeContextMenu}
			className={classNames(css.root, className, bp.Classes.ELEVATION_0)}
		/>
	}

	_toDispose = [];

	componentDidMount() {
		const {_toDispose} = this;

		_toDispose.push(autorun(() => {
			this.recurseTouch(this.props.nodes)
			this.forceUpdate();
		}, {name: `Force Update due to underlying report tree change`}))
	}

	recurseTouch = (nodes: bp.ITreeNode[]) => {
		if (nodes == null) return;

		nodes.forEach(n => {
			this.recurseTouch(n.childNodes);

			// Access all properties of the object
			const clone = Object.assign({}, n); //_.cloneDeep(n);
		});
	}

	componentWillUnmount() {
		this.props.nodes.forEach(tc => tc instanceof SidebarTreeNode && tc.dispose())
		this._toDispose.forEach(f => f());
	}

	private onNodeDoubleClick = (nodeData: bp.ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		nodeData.isExpanded = !nodeData.isExpanded;
		this.forceUpdate();
	}

	private handleNodeClick = (nodeData: bp.ITreeNode | any, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		const {nodes} = this.props;
		const originallySelected = nodeData.isSelected;
		if (!e.shiftKey) {
			this.forEachNode(nodes, (n) => n.isSelected = false);
		}
		nodeData.isSelected = originallySelected == null ? true : !originallySelected;
		nodeData.select && nodeData.select();

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

	private onNodeContextMenu = (node: any, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		node.onContextMenu && node.onContextMenu(nodePath, e);
	}
}