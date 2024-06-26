import { observer } from 'mobx-react';
import * as React from 'react';
import {i18n} from 'stores';
import { RWRecalibration } from '../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';
import { bp } from 'components';

import * as css from "./ModelTree.css";

interface MyProps {
	recalibration: RWRecalibration;
}

@observer
export class ModelTree extends React.Component<MyProps, {}> {

	handleNodeSelect = (node, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		const isMultiSelect = e.ctrlKey || e.metaKey;
		this.props.recalibration.selectTreeNode(node, isMultiSelect);
	}

	handleNodeExpand = (node) => {
		this.props.recalibration.expandTreeNode(node, true);
	}

	handleNodeCollapse = (node) => {
		this.props.recalibration.expandTreeNode(node, false);
	}

	openContextMenu = (node, path: number[], e) => {
		e.preventDefault();
		// invoke static API, getting coordinates from mouse event
		bp.ContextMenu.show(
			<bp.Menu>
				<bp.MenuItem icon="join-table" text={i18n.intl.formatMessage({defaultMessage: "Combine tables", description: "[recalibration][ModelTree] menu tree contextmenu for operate axis organization"})}
				             onClick={this.getChangeAxisCategoryCallback('combine')} />
				<bp.MenuItem icon="th-disconnect" text={i18n.intl.formatMessage({defaultMessage: "Split tables", description: "[recalibration][ModelTree] menu tree contextmenu for operate axis organization"})}
				             onClick={this.getChangeAxisCategoryCallback('split')} />
				<bp.MenuItem icon="th" text={i18n.intl.formatMessage({defaultMessage: "Restore default setting", description: "[recalibration][ModelTree] menu tree contextmenu for operate axis organization"})}
				             onClick={this.getChangeAxisCategoryCallback('default')} />
			</bp.Menu>,
			{ left: e.clientX, top: e.clientY }
		);
	}

	getChangeAxisCategoryCallback = (mode) => {
		return async () => {
			await this.props.recalibration.changeAxisCategoryByTreeNode(mode);
		}
	}

	render() {
		const { tree, showTree } = this.props.recalibration;

		return (
			<div className={classNames(css.root, {[css.hideTree]: !showTree})}>
				<bp.Tree
					contents={tree.childNodes}
					onNodeClick={this.handleNodeSelect}
					onNodeExpand={this.handleNodeExpand}
					onNodeCollapse={this.handleNodeCollapse}
					onNodeContextMenu={this.openContextMenu}
				/>
			</div>
		);
	}
}