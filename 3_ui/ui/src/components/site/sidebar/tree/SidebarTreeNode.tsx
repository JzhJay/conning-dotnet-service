import type {IconName} from '@blueprintjs/core';
import { bp, SimulationCard, AppIcon } from 'components';
import { api, routing, appIcons, settings } from 'stores';
import { action, autorun, computed, observable, reaction, makeObservable } from 'mobx';
import { Link } from 'react-router';
import * as css from './SidebarTree.css';

export enum SidebarTreeNodeType {
	folder,
	noneFound,
	model,
	query,
	queryResult,
	simulation,
	user
}

/*
Todo:  Handle garbage collection when tree is unmounted
 */

export class SidebarTreeNode implements bp.ITreeNode {
	static recurseTouch(nodes: bp.ITreeNode[]) {
		if (nodes == null) return;

		nodes.forEach(n => {
			this.recurseTouch(n.childNodes);

			// Access all properties of the object
			Object.assign({}, n);
		});
	}

	id = uuid.v4();
	@observable label = this.id;
	@observable hasCaret = false;
	@observable secondaryLabel = null;

	/* console.warning(`No URL is set for '${this.label}'`);  */
	get url() {
		return null;
	}

	@observable childNodes: SidebarTreeNode[] = [];

	@observable canRename = false;

	@observable icon : IconName;
	@observable isExpanded = null;
	type = SidebarTreeNodeType.folder;

	@observable className;

	_toDispose = [];

	dispose() {
		this._toDispose.forEach(f => f());
	}

	constructor(node?: bp.ITreeNode | SidebarTreeNode) {
        makeObservable(this);
        Object.assign(this, node);

        this.isExpanded = settings.sidebarTree.expanded[this.id];

        this._toDispose.push(
			autorun(() => {
				const { icon, childNodes, isExpanded } = this;

				this.hasCaret = node.hasCaret || childNodes.length > 0;
				this.isSelected = routing.isActive(this.url, false);
			}));
    }

	setupInfoTooltip(showInfoTooltip?: () => React.ReactElement<any>) {
		this.secondaryLabel = showInfoTooltip ? (
			<div className={classNames(css.showOnHover, bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP)}>
				<bp.Popover   interactionKind={bp.PopoverInteractionKind.HOVER}
				            canEscapeKeyClose
				            hoverCloseDelay={500}
				            content={showInfoTooltip()}>
					<AppIcon style={{ background: 'transparent' }} className={classNames(bp.Classes.BUTTON)} icon={appIcons.info}/>
				</bp.Popover>
			</div>) : null;
	}

	@observable isSelected;

	select = () => {
		if (this.url) {
			api.routing.push(this.url);
		}
	}

	onContextMenu = (nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		//console.log('Context Menu', nodePath, this)
		//e.preventDefault();
	}

	/* Set manually by the tree container */
	element: HTMLDivElement;
}