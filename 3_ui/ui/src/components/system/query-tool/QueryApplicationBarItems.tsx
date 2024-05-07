import {ButtonGroup, Tooltip} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import * as React from 'react';
import {i18n} from 'stores';
import {GetSimulationQuery, omdb} from 'stores/objectMetadata';
import {Query} from 'stores/query/ui';
import {appIcons, site} from 'stores/site';
import {AppIcon, ApplicationBarErrorMessage, bp, QueryBookMenu, QueryPropertiesDialog, SimulationCard, SingularAxisCoordinates} from '../../index';
import {ArrowNavigation} from '../../widgets/navigation/ArrowNavigation';
import * as css from 'styles/ApplicationBarItems.css';
import {RunButton} from '../toolbar'
import {ApplicationBarWarningMessage} from 'components/system/ApplicationBarWarningMessage/ApplicationBarWarningMessage';

@observer
export class QueryApplicationBarItems extends React.Component<{query: Query}, {}> {
	render() {
		const {query, query: {isQueryPage}} = this.props;

		return <div className={css.applicationBarItems}>
			{!query.isLoading && query instanceof Query && <ArrowNavigation canNavigateLeft={query.canNavigateLeft}
			                 canNavigateRight={query.canNavigateRight}
			                 currentItem={query.currentPage.title}
			                 pageMenu={<QueryBookMenu query={query}/>}
			                 onNext={query.navigateToNext}
			                 onPrevious={query.navigateToPrevious}/>}
			{query.simulations && (
				<div>
					<ButtonGroup minimal>
						{query.simulations.map(
							(sim, index) =>
								<GetSimulationQuery key={`sim_${sim._id}_${index}`} query={omdb.graph.simulation.get} variables={{id: sim._id}}>
									{({data, loading, error}) => {
										if (loading || error) {
											return <span key={sim._id}>...</span>;
										}
										else {
											const {omdb: {typed: {simulation: {get: simulation, get: {name}}}}} = data;

											const simulationInputVersion = this.props.query.simulationInputsVersions?.find(sim => sim.id = simulation._id)?.version
											const hasCorrectVersion = simulationInputVersion != null ? simulationInputVersion == simulation.inputsVersion : true;
											let warningMessage = null;

											if (simulation.status != "Complete") {
												warningMessage = "A referenced simulation is not complete and cannot be queried."
											} else if (!hasCorrectVersion) {
												warningMessage = "A referenced simulation has been updated since it was previously selected. Reselect the simulation to update the query reference.";
											}

											return <>
												<ApplicationBarWarningMessage showWarning={warningMessage != null} message={warningMessage}>
													<bp.Popover
													key={sim._id}
													position={bp.Position.BOTTOM_LEFT}
													interactionKind={bp.PopoverInteractionKind.HOVER}
													transitionDuration={1}
													content={<SimulationCard showToolbar={false} showHeader={false} isTooltip showFavoriteIcon={false} sim={simulation} includeNameInBody={true}/>}>
														<bp.AnchorButton disabled={query.isRunning}
														                 icon={<AppIcon icon={appIcons.tools.simulations}/>} text={name}
														                 onClick={() => {
															                 site.setDialogFn(() =>
																                 <QueryPropertiesDialog
																	                 query={query}
																	                 focusTarget='simulations'/>)
														                 }}/>
													</bp.Popover>
												</ApplicationBarWarningMessage>
											</>
										}
									}}
								</GetSimulationQuery>)}
					</ButtonGroup>
				</div>).props.children}
			{query.hasResult && <SingularAxisCoordinates query={query}/>}

			<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RESET(Query.OBJECT_NAME_SINGLE)}>
				<bp.AnchorButton icon="history"
				                 text={i18n.common.OBJECT_CTRL.RESET}
				                 minimal
				                 onClick={() => query.reset()} disabled={query.busy || query.isRunning}/>
			</bp.Tooltip>
			{query instanceof Query && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(Query.OBJECT_NAME_SINGLE)}>
			<RunButton isDisabled={!query.canRunQuery || query.hasResult && !query.isRunning}
					   isComplete={!query.isRunning}
					   buttonText={query.isRunning ? i18n.common.OBJECT_CTRL.CANCEL_RUN : i18n.common.OBJECT_CTRL.RUN}
					   tooltipContent={""}
					   runCallback={query.run}
					   cancelCallback={query.cancel} />
			</bp.Tooltip>}
			<ApplicationBarErrorMessage errorMessages={[query.errorMessage]} />

			<div className={css.rightGroup}>
				{/*Common buttons here*/}
			</div>
		</div>
	}
}
