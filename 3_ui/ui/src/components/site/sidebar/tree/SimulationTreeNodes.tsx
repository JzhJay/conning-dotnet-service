import * as commonCss from '../SidebarPanel.css';
import * as css from './SidebarTree.css';
import {bp, AppIcon, sem, dialogs, SimulationCard, mobx} from 'components';
import {appIcons, settings, api, QueryDescriptor, Simulation, Query, ActiveTool} from 'stores';
import {observer} from 'mobx-react';
import { action, autorun, computed, observable, reaction, makeObservable } from 'mobx';
import {Link} from 'react-router';
import {SidebarTreeNode, SidebarTreeNodeType} from './SidebarTreeNode';
import {QueryTreeNode} from './QueryTreeNodes';

export class SimulationTreeNode extends SidebarTreeNode {
	@observable tooltipActive = false;

	constructor(public sim: Simulation, extraProps?: any) {
        super({
			id:        sim.id,
			label:     <Link to={sim.clientUrl}>{sim.name}</Link>,
			className: css.simulation,
			//iconName:       'database',
			canRename: true,
			type:      SidebarTreeNodeType.query,
		})

        makeObservable(this);

        Object.assign(this, extraProps);

        this.setupInfoTooltip(() => <SimulationCard isTooltip sim={this.sim}/>);

        // autorun(() => {
        // 	const {queries} = this.sim;
        //
        // 	const queryNodes = this.sim.queries.map(q => new QueryTreeNode(q));
        //
        // 	this.childNodes = queryNodes;
        // })
    }

	get url() { return this.sim.clientUrl }

	onContextMenu = (nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		//this.sim.onContextMenu(e, 'sidebar');
	}
}

export class SimulationsNode extends SidebarTreeNode {
	constructor() {
		super({
			id:             'simulations',
			label:          "Simulations",
			icon:       'database',
			canRename:      false,
			type:           SidebarTreeNodeType.folder,
			secondaryLabel: <bp.Tooltip content="Import Legacy Simulation">
				                <bp.AnchorButton minimal icon="import" onClick={dialogs.importSimulation}/>
			                </bp.Tooltip>
		})

		const {simulations: prefs} = settings.sidebar;

		autorun(() => {
			const {loading, simulations: loaded} = api.simulationStore;

			if (!loading) {
				if (loaded.size == 0) {
					this.childNodes = [
						new SidebarTreeNode({
							id:        'no-sims',
							label:     <i>No Simulations Found</i>,
							canRename: false,
							type:      SidebarTreeNodeType.noneFound
						})
					];
				}
				else {
					this.childNodes = mobx.values(loaded).map(sim => new SimulationTreeNode(sim));
				}
			}

			this.label = <Link to={Simulation.browserUrl}>Simulations ({loading ? 'Loading...' : loaded.size == 0 ? <i>None</i> : loaded.size})</Link>;
		})
	}

	get url() {
		return Simulation.browserUrl;
	}

	onContextMenu = (nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		const {ContextMenu, Menu, MenuItem, MenuDivider} = bp;

		// ContextMenu.show(
		// 	<Menu>
		// 		<MenuItem icon="folder-open" text="Browse Simulations..." onClick={api.simulation.navigateToBrowser}/>
		// 		<MenuDivider/>
		// 		<MenuItem text={`Import Legacy Simulation`} icon="import" onClick={() => dialogs.importSimulation()}/>
		// 	</Menu>, {left: e.clientX - 8, top: e.clientY - 8});
		//
		// e.preventDefault();
	}
}
