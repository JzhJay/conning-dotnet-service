import {SimulationCard} from 'components';
import {ObjectLink, ObjectLinkProps} from 'components/widgets/SmartBrowser/ObjectLink';
import {appIcons, Simulation, simulationStore} from 'stores';

export class SimulationObjectLink extends React.Component<ObjectLinkProps<Simulation>, any>{

	render() {
		return <ObjectLink<Simulation>
			objectType={Simulation.ObjectType}
			icon={appIcons.cards.simulation.cardIcon}
			modelLoader={async (id) => simulationStore.simulations?.has(id) ? simulationStore.simulations.get(id) : simulationStore.loadDescriptor(id)}
			popupContent={(model) => <SimulationCard sim={model} showHeader={false} isTooltip/> }

			linkTo={model => model.clientUrl}
			linkContent={model => model.name}

			{...this.props}
		/>;
	}
}