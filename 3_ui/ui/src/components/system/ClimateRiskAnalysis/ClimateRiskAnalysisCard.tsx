import {ClimateRiskAnalysisBrowser} from 'components/system/ClimateRiskAnalysis/ClimateRiskAnalysisBrowser';
import {IOmdbTag, OmdbCardTag} from '../../../stores/objectMetadata/OmdbTag';
import * as css from './ClimateRiskAnalysisCard.css'
import {appIcons, omdb, ObjectTypeQuery, ClimateRiskAnalysis, site, OmdbCardSection, Simulation, i18n} from "stores";
import { observer } from 'mobx-react'
import { bp, SmartCard, SmartCardProps, SortableCardsPanel} from 'components';
import { makeObservable } from "mobx";
import { IconButton } from "../../blueprintjs/IconButton";

interface MyProps extends SmartCardProps {
	climateRiskAnalysis?: ClimateRiskAnalysis;
	panel?: SortableCardsPanel;
	availableTags?: Array<IOmdbTag>;
	objectKey?: string;
}

@observer
export class ClimateRiskAnalysisCard extends React.Component<MyProps, {}> {

    getSections(data) {

		const newSections: OmdbCardSection[] = [];
		_.forEach( data.omdb.objectType.ui.card.sections , (section: OmdbCardSection) => {
			const newTags: OmdbCardTag[] = [];
			_.forEach(section.tags , (tag:OmdbCardTag) => {
				if (_.some(ClimateRiskAnalysisBrowser.SIMULATION_TAG, t => t == tag.name)) {
					newTags.push({
						...tag,
						type: Simulation.ObjectType
					});
				} else {
					newTags.push(tag);
				}
			})
			if (newTags.length) {
				newSections.push({
					label: section.label,
					tags: newTags
				})
			}
		});
		return newSections;
	}

    render() {
		const { props: { className, panel, isTooltip, climateRiskAnalysis, onDelete, onDuplicate, ...props } } = this;


		return (
			<ObjectTypeQuery query={omdb.graph.objectType} variables={{objectType: ClimateRiskAnalysis.ObjectType}}>
				{({loading, error, data}) => {
					return !loading && <SmartCard
						loading={loading}
						className={classNames(css.root, className)}
						appIcon={appIcons.cards.climateRiskAnalysis.cardIcon}
						panel={panel}
						isTooltip={isTooltip}
						{...props}
						onRename={async (value) => await climateRiskAnalysis.rename(value)}
						model={climateRiskAnalysis}
						titleIcons={<ClimateRiskAnalysisCardToolbarButtons disabled={loading} climateRiskAnalysis={climateRiskAnalysis} isTooltip={isTooltip} onDelete={onDelete} onDuplicate={onDuplicate}/>}
						title={{name: 'name'}}
						sections={!loading && this.getSections(data)}/>
				}}
			</ObjectTypeQuery>);

	}
}

@observer
export class ClimateRiskAnalysisCardToolbarButtons extends React.Component<{ disabled?: boolean, isTooltip?: boolean, climateRiskAnalysis: ClimateRiskAnalysis, className?: string, onDelete: (id:string) => void, onDuplicate: (io) => void}, {}> {
	render() {
		const { props: { isTooltip, className, climateRiskAnalysis, disabled, onDelete, onDuplicate } } = this;

		return <bp.ButtonGroup className={classNames(className)}>
			<bp.Tooltip content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.OPEN(ClimateRiskAnalysis.OBJECT_NAME_SINGLE)}>
				<IconButton icon={appIcons.cards.open}  onClick={(e) => {
					climateRiskAnalysis.navigateTo();
					e.preventDefault()
				}}/>
			</bp.Tooltip>

			{!isTooltip && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DUPLICATE(ClimateRiskAnalysis.OBJECT_NAME_SINGLE)}>
				<IconButton icon={appIcons.cards.clone} disabled={disabled} onClick={async () => {
					try {
						site.busy = true;
						let r = await ClimateRiskAnalysis.duplicate(climateRiskAnalysis) as string;
						onDuplicate && onDuplicate(r);
					}
					finally {
						site.busy = false;
					}
				}}/>
			</bp.Tooltip>}
			{!isTooltip && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(ClimateRiskAnalysis.OBJECT_NAME_SINGLE)}>
				<IconButton icon={appIcons.cards.delete} disabled={disabled} onClick={async () => {
					let r = await ClimateRiskAnalysis.delete(climateRiskAnalysis);
					r != null && onDelete && onDelete(climateRiskAnalysis._id);

				}}/>
			</bp.Tooltip>}
		</bp.ButtonGroup>
	}
}
