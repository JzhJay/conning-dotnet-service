import {ClimateRiskAnalysisCard} from 'components/system/ClimateRiskAnalysis/ClimateRiskAnalysisCard';
import {ObjectLink, ObjectLinkProps} from 'components/widgets/SmartBrowser/ObjectLink';
import {appIcons, ClimateRiskAnalysis, climateRiskAnalysisStore} from 'stores';

export class ClimateRiskAnalysisObjectLink extends React.Component<ObjectLinkProps<ClimateRiskAnalysis>, any> {
	render() {
		return <ObjectLink<ClimateRiskAnalysis>
			objectType={ClimateRiskAnalysis.ObjectType}
			icon={appIcons.cards.climateRiskAnalysis.cardIcon}
			modelLoader={async (id) => climateRiskAnalysisStore.climateRiskAnalyses?.has(id) ? climateRiskAnalysisStore.climateRiskAnalyses.get(id) : climateRiskAnalysisStore.loadDescriptor(id)}

			popupContent={(model) => <ClimateRiskAnalysisCard  climateRiskAnalysis={model} showHeader={false} isTooltip/> }

			linkTo={model => model.clientUrl}
			linkContent={model => model.name}

			{...this.props}
		/>;
	}
}