import {observer} from 'mobx-react';

import {Report, ReportDescriptor} from 'stores';
import {bp, sem} from 'components';
import {Link} from "react-router";
import * as css from './ReportSidebarMenuItem.css';
import * as commonCss from '../SidebarPanel.css';
import { computed, makeObservable } from 'mobx';
import {SidebarTreeNode} from '../tree/SidebarTreeNode';
import { ReportNode } from "./reportTreeNodes";

interface MyProps {
	report: Report | ReportDescriptor;
	active?: boolean;
}

@observer
export class ReportSidebarMenuItem extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {nodes, props: {report: r, active}} = this;

		// Touch every property
		SidebarTreeNode.recurseTouch(nodes);

		const isRenaming = false; //q.renamingFrom == 'sidebar';
		const isLoading  = false;

		const report = r instanceof Report ? r as Report : null;

		// <ReportItemTreeNode item={report} level={1}/>

		return <sem.Menu.Item active={active}
		                      className={classNames(css.root)}>
			{report
				? <bp.Tree
				 contents={nodes.slice()}
				 onNodeDoubleClick={this.onNodeDoubleClick}
				 onNodeClick={this.handleNodeClick}
				 onNodeCollapse={this.handleNodeCollapse}
				 onNodeExpand={this.handleNodeExpand}
				 onNodeContextMenu={this.onNodeContextMenu}
				 className={classNames(bp.Classes.ELEVATION_0)}
			 />
				: <div className={commonCss.row}>
				 {isLoading &&
				 <sem.Loader active inline size="tiny"/>}

				 {/*{isRenaming ? <bp.EditableText className={commonCss.editableName} defaultValue={q.name} selectAllOnFocus={true}*/}
				 {/*ref={this.onEditRef}*/}
				 {/*onCancel={q.cancelRename}*/}
				 {/*onConfirm={q.confirmRename}/> : */}
				 {/*}*/}

				 <Link className={commonCss.name} to={r.clientUrl}>{r.name}</Link>

				 <div className={classNames(commonCss.rightButtonGroup, bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP)}>
				 </div>

				 {/*<ReportTreeContextMenu setController={c => this.sidebarContextMenuController = c}/>*/}
			 </div>
			}
		</sem.Menu.Item>
	}

    @computed
	get nodes(): bp.ITreeNode[] {
		const {report} = this.props;

		return report instanceof Report ? [
			//new ReportNode(report)
		] : [];
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
}