import {IOCard} from 'components/system/IO/IOCard';
import {ObjectLink, ObjectLinkProps} from 'components/widgets/SmartBrowser/ObjectLink';
import {appIcons, IO, ioStore} from 'stores';

export class IOObjectLink extends React.Component<ObjectLinkProps<IO>, any> {
	render() {
		return <ObjectLink<IO>
			objectType={IO.ObjectType}
			icon={appIcons.cards.ios.cardIcon}
			modelLoader={async (id) => ioStore.ios?.has(id) ? ioStore.ios.get(id) : ioStore.loadDescriptor(id)}

			popupContent={(model) => <IOCard  investmentOptimization={model} showHeader={false} isTooltip/> }

			linkTo={model => model.clientUrl}
			linkContent={model => model.name}

			{...this.props}
		/>;
	}
}