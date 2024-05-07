import {ReportCard} from 'components';
import {ObjectLink, ObjectLinkProps} from 'components/widgets/SmartBrowser/ObjectLink';
import {appIcons, Report, ReportDescriptor, reportStore} from 'stores';

export class ReportObjectLink extends React.Component<ObjectLinkProps<ReportDescriptor>, any>{

	render() {
		return <ObjectLink<ReportDescriptor>
			objectType={Report.ObjectType}
			icon={appIcons.cards.simulation.cardIcon}
			modelLoader={async (id) => reportStore.descriptors?.has(id) ? reportStore.descriptors.get(id) : reportStore.loadDescriptors().then(reports => _.find(reports, report => report.id == id))}
			popupContent={(model) => <ReportCard report={model} showHeader={false} isTooltip/> }

			linkTo={model => model.clientUrl}
			linkContent={model => model.name}

			{...this.props}
		/>;
	}
}