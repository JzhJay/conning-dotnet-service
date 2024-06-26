import { SidebarTreeNode, SidebarTreeNodeType } from 'components/site/sidebar/tree/SidebarTreeNode';
import { Link, Report, appIcons, ReportItem, ReportDescriptor, ReportQuery, routing, viewDescriptors, api, settings, Simulation, simulationStore, reportStore, SimulationSlot } from 'stores';
import { bp, sem, SimulationCard, AppIcon, AvailableQueryViewDropdown, QueryCard, QueryViewRequirementsTooltip } from 'components';
import { autorun, computed, observable } from 'mobx';

export class ReportDescriptorTreeNode extends SidebarTreeNode {
	get url() {
		return this.descriptor.clientUrl;
	}

	constructor(public descriptor: ReportDescriptor) {
		super({ id: descriptor.id, label: descriptor.name, icon: 'book' });

		this._toDispose.push(
			autorun(() => {
				this.label = <Link to={descriptor.clientUrl}>{descriptor.name}</Link>;
			}));
	}
}
