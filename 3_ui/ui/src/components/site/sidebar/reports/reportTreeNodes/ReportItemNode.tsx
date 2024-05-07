import type {IconName} from '@blueprintjs/core';
import { SidebarTreeNode, SidebarTreeNodeType } from 'components/site/sidebar/tree/SidebarTreeNode';
import { Link, Report, appIcons, ReportItem, ReportDescriptor, ReportQuery, routing, viewDescriptors, api, settings, Simulation, simulationStore, reportStore, SimulationSlot, ReportPage, ReportText } from 'stores';
import { bp, sem, SimulationCard, AppIcon, AvailableQueryViewDropdown, QueryCard, QueryViewRequirementsTooltip } from 'components';
import { autorun, computed, observable, makeObservable } from 'mobx';
import { ReportSimulationsNode, ReportPagesNode, ReportPageNode, ReportQueryNode, ReportTextNode } from './';
import * as css from './ReportTreeNode.css';

export class ReportItemNode extends SidebarTreeNode {
	/* console.warning(`No URL is set for '${this.label}'`);  */

	get url() {
		return this.item.clientUrl;
	}

	@observable canRename = false;

	select = () => {
		this.isExpanded = true;

		this.item.report.selectedItem = this.item;
	}

	constructor(public item: ReportItem) {
        super({ id: item.id, label: item.name });

        makeObservable(this);

        this._toDispose.push(
			autorun(() => {
				const { name, label, children, clientUrl, renamingFrom, report: { selectedItem } } = item;

				const { isSelected, canRename, icon } = this;

				if (!selectedItem) {
					this.dispose();
					return;
				}

				this.label = <div className={css.treeNodeLabel}>
					{icon && <span className='bp3-tree-node-icon'>{icon}</span>}
					{renamingFrom != 'sidebar' || true
						? <Link key="label" to={clientUrl}>{label}</Link>
						: <bp.EditableText key="label" defaultValue={label}
						                   isEditing confirmOnEnterKey selectAllOnFocus
						                   onCancel={() => item.renamingFrom = null}
						                   onConfirm={(text) => {
							                   item.renamingFrom = null
						                   }}
					 />}
				</div>;

				this.isExpanded = item.expanded || this.isSelected || item.contains(selectedItem);

				this.hasCaret = children.length > 0;

				let derivedChildNodes = [];  // Dynamic children
				item instanceof Report && derivedChildNodes.push(new ReportSimulationsNode(item),
				                                                 new ReportPagesNode(item)
				);

				this.childNodes = [
					...derivedChildNodes,
					...children
						.filter(c => c.type != 'page')
						.map(c => {
							if (c instanceof ReportPage) {
								return new ReportPageNode(c);
							}
							else if (c instanceof ReportQuery) {
								return new ReportQueryNode(c);
							}
							else if (c instanceof ReportText) {
								return new ReportTextNode(c);
							}
							else {
								console.warn(`unhandled view type - ${c.type} - on object - ${c.name}`, c);

								return new ReportItemNode(c);
							}
						})
				];
			}));
    }

	elem: HTMLElement;

	dispose() {
		super.dispose();

		const { elem } = this;
		if (elem) {
			elem.removeEventListener('mouseenter', this.onMouseEnter);
			elem.removeEventListener('mouseleave', this.onMouseLeave);
		}
	}

	setContentElement = (elem: HTMLElement) => {
		this.elem = elem;
		if (elem) {
			elem.addEventListener('mouseenter', this.onMouseEnter);
			elem.addEventListener('mouseleave', this.onMouseLeave);
		}
	}

	onMouseEnter = () => {
		const { item, item: { report } } = this;
		report.mousedOverTreeItem = item;
	}

	onMouseLeave = () => {
		const { item, item: { report } } = this;
		if (report.mousedOverTreeItem == item) {
			report.mousedOverTreeItem = null;
		}
	}
}
