import { observer } from 'mobx-react';
import {api, user, routing, org, site, ActiveTool, simulationStore, ReportDescriptor} from 'stores';
import { Simulation } from 'stores/simulation';
import * as css from '../SidebarPanel.css';
import { bp, sem, SimulationCard, dialogs, siteActions, mobx} from 'components';
import { observable, action, makeObservable } from 'mobx';
import { SidebarSimulationMenuItem } from './SidebarSimulationMenuItem';
import { SidebarPanel } from '../SidebarPanel';
import FlipMove from 'react-flip-move';

const { Dropdown, Header, Menu, Icon, Input, Label } = sem;

@observer
export class SidebarSimulationsPanel extends React.Component<{}, {}> {
    @observable renamingSim: Simulation;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {
			site: { activeTool },
			routing: { urls },
			simulationStore: { hasLoadedDescriptors },
			user: { settings: { sidebar: prefs, sidebar: { simulations: {} } } }
		} = api;

		const simulations = mobx.values(simulationStore.simulations.values) as ReadonlyArray<Simulation>;

		return (
			<SidebarPanel
				icon={<sem.Icon name="database"/>}
				title={`Simulations (${simulations.length})`}
				to={urls.simulationBrowser}
				active={routing.isActive(routing.urls.simulationBrowser)}
				titleButtons={
					(<div>
						<bp.Tooltip  content="Import Simulation">
							<bp.Button minimal icon="plus" onClick={() => dialogs.importSimulation()}/>
						</bp.Tooltip>
					</div>).props.children
				}>
				<Menu vertical>
					<FlipMove>
						{/* Comes last as we can be directly on a specific simulation page and have loaded THAT sim, but not ALL sims... */}
						{!hasLoadedDescriptors && <sem.Menu.Item key="loading" className={css.noResults}>
							<sem.Loader active inline size="tiny"/>
							Loading simulations...
						</sem.Menu.Item>}

						{hasLoadedDescriptors && simulations.length == 0 &&
						 <sem.Menu.Item key="no-sims" className={css.noResults}>
							 <i>No simulations found.</i>
							 {/*<br/>Click <a>here</a> (or double click) to begin a query session.*/}
						 </sem.Menu.Item>}

						{hasLoadedDescriptors && simulations.map((s:Simulation) => <SidebarSimulationMenuItem key={s.id} simulation={s}/>)}
					</FlipMove>
				</Menu>
			</SidebarPanel>
		)
	}
}