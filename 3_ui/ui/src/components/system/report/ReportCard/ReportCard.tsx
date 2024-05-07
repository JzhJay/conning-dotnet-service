import {
	appIcons,
	simulationStore,
	queryStore,
	reportStore,
	Report,
	ReportDescriptor,
	omdb,
	ObjectTypesQuery, ObjectTypeQuery
} from "stores";
import {observer} from 'mobx-react'
import {sem, bp, SmartCard, SmartCardProps, SortableCardsPanel, ReportContextMenu} from 'components';
import {Query} from '../../../../stores/query/ui';
import * as css from './ReportCard.css';

import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import {ReportSimulations} from "./Simulations";
import {QuerySlotsCard} from "./QuerySlots";
import {ReportPages} from "./Pages";
import {ReportSecurityCard} from "./SecurityInfo";
import {IconButton} from "../../../blueprintjs/IconButton";

interface MyProps extends SmartCardProps {
	report: Report | ReportDescriptor;
	panel?: SortableCardsPanel;
}

@observer
@bp.ContextMenuTarget
export class ReportCard extends React.Component<MyProps, {}> {
	render() {
		const {props: {className, panel, isTooltip, report, report: {name}, ...props},} = this;

		const {Card, Segment, Icon, List} = sem;

		const icons = appIcons.cards.simulation;

		return <ObjectTypeQuery query={omdb.graph.objectType} variables={{objectType: Report.ObjectType}}>
			{({loading, error, data}) => {
				if (loading || error) {
					return null
				}
				const {ui} = data.omdb.objectType[0];

				return <SmartCard
					className={classNames(css.reportCard, className)}
					appIcon={appIcons.cards.report.cardIcon}
					panel={panel}
					isTooltip={isTooltip}
					{...props}
					onRename={value => {
						report.name = value;
						report instanceof Report && reportStore.put(report);  // Otherwise, we cannot update the item...  TODO
					}}
					model={report}
					titleIcons={<ReportCard_TitleIcons {...this.props} />}
					title={{name: 'name'}}
					sections={[...ui.card.sections]}>
					{!isTooltip && !panel && report instanceof Report &&
					<sem.Card.Content extra>
						<ReportSimulations showTitle report={report}/>
					</sem.Card.Content>}
					{!isTooltip && !panel && report instanceof Report &&
					<sem.Card.Content extra>
						<ReportPages style={{gridArea: 'pages', flexGrow: 1}} report={report}/>
					</sem.Card.Content>}

					{/*{report instanceof Report &&*/}
					{/*<sem.Card.Content extra>*/}
					{/*<div className={css.cardLayoutGrid}>*/}
					{/*<ReportSimulationsCard style={{gridArea:'simulations'}} showTitle report={report}/>*/}
					{/*<QuerySlotsCard style={{gridArea:'queries'}} showTitle report={report}/>*/}
					{/*<ReportPagesCard2 style={{gridArea:'pages'}} report={report} />*/}
					{/*</div>*/}
					{/*</sem.Card.Content>}*/}

					{/*{report instanceof Report && <sem.Card.Content extra>*/}
					{/*<ReportSecurityCard report={report}/>*/}
					{/*</sem.Card.Content>}*/}

					{/*{report instanceof Report && <ReactSortable onChange={this.moveSimulationSlot}
				                                            className={css.simulations}
				                                            options={{
					                                            animation: 400,
					                                            draggable: `.${css.simulationSlot}`,
					                                            filter: `.${css.addASim}`,
					                                            group: 'simulationSlots',
					                                            forceFallback: true,
					                                            fallbackOnBody: true,
					                                            scroll: true,
					                                            scrollSensitivity: 10,
					                                            scrollSpeed: 15,
				                                            }}>
					<ReactFlipMove className={css.simulations}>
						{isTooltip && report.simulationSlots.length == 0 && <sem.List.Item content="No simulations."/>}
						{report.simulationSlots.map(slot => <SimulationSlotComponent slot={slot}/>)}
						{!isTooltip && <AddASimulationSlot report={report}/>}
					</ReactFlipMove>
				</ReactSortable>}*/}
				</SmartCard>
			}}
		</ObjectTypeQuery>

		// onRename={value => api.simulation.rename(sim.id, value) }
		// 	titleIcons={
		// 	<span className={bp.Classes.BUTTON_GROUP}>
		// 				              <bp.Tooltip  content={path}>
		// 			 				    <bp.Button minimal icon="cloud" />
		// 	                        </bp.Tooltip>
		// 		                </span>
		// }
	}

	renderContextMenu() {
		return <ReportContextMenu report={this.props.report} location='card'/>
	}
}

@observer
export class ReportCard_TitleIcons extends React.Component<MyProps, {}> {
	render() {
		const {className, report, isTooltip} = this.props;

		return <div className={className}>
			{/*<bp.Tooltip content="Print" >*/}
			{/*<bp.AnchorButton icon="print"*/}
			{/*onClick={async () => {*/}
			{/*console.warn('NYI - print report')*/}
			{/*}}/>*/}
			{/*</bp.Tooltip>*/}

			<bp.Tooltip content="Open Report">
				<IconButton icon={appIcons.cards.open} onClick={() => report.navigateTo()}/>
			</bp.Tooltip>

			{report instanceof Report && <bp.Tooltip content={`Duplicate Report`}>
				<IconButton icon={appIcons.cards.clone} onClick={() => report.duplicate()}/>
			</bp.Tooltip>}

			{!isTooltip && <bp.Tooltip content={`Delete`}>
				<IconButton icon={appIcons.cards.delete} onClick={() => {
					report.delete();
				}}/>
			</bp.Tooltip>}
		</div>
	}
}
