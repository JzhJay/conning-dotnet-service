import {QueryCard} from 'components';
import {ObjectLink, ObjectLinkProps} from 'components/widgets/SmartBrowser/ObjectLink';
import {appIcons, Query, QueryDescriptor, queryStore} from 'stores';

export class QueryObjectLink extends React.Component<ObjectLinkProps<Query>, any>{

	render() {
		return <ObjectLink<QueryDescriptor>
			objectType={Query.ObjectType}
			icon={appIcons.cards.query.cardIcon}
			modelLoader={async (id) => queryStore.descriptors?.has(id) ? queryStore.descriptors.get(id) : queryStore.loadDescriptor(id)}

			popupContent={(model) => <QueryCard query={model} showHeader={false} isTooltip/> }

			linkTo={model => model.clientUrl}
			linkContent={model => model.name}

			{...this.props}
		 />;
	}
}