import { SidebarTreeNode, SidebarTreeNodeType } from 'components/site/sidebar/tree/SidebarTreeNode';
import { Link, Report, simulationStore, SimulationSlot } from 'stores';
import { bp, SimulationCard } from 'components';
import { autorun, computed, makeObservable } from 'mobx';

export class ReportSimulationsNode extends SidebarTreeNode {
	constructor(public report: Report) {
        super({ id: 'reports', label: '', icon: 'database' });

        makeObservable(this);

        autorun( () => {
			const { simulations } = this;
			this.label = <Link to={this.url}>Simulations
				({report.simulationSlots.length})</Link>;
			this.childNodes = report.simulationSlots.map((sim: SimulationSlot) => new ReportSimulationSlotNode(sim, report));
		}, {name: `Update Report Simulations Treenode`})
    }

	@computed
	get simulations() {
		return this.report.simIds.map(id => simulationStore.simulations
		                                                   .get(id))
		           .filter(sim => sim)
	}

	get url() {
		return this.report.simulationsUrl
	}
}


export class ReportSimulationSlotNode extends SidebarTreeNode {
	constructor(public slot: SimulationSlot, public report: Report) {
		super({
			      id: slot.id,
			      icon: 'database',
			      label: null,
			      className: 'simulation',
			      canRename: true,
			      type: SidebarTreeNodeType.simulation,
			      //showInfoTooltip: () => <SimulationCard isTooltip sim={this.sim}/>
		      });

		const { simulation } = slot;

		this.label = <bp.Popover  interactionKind={bp.PopoverInteractionKind.HOVER}
		                         disabled={!simulation}
		                         content={<SimulationCard isTooltip sim={simulation}/>}>
			<Link to={this.url}>{slot.name}</Link>
		</bp.Popover>;
	}

	get url() {
		return this.report.clientUrl;
	}
}
