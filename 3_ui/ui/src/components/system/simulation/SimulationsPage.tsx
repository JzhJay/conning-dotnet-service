import {ApplicationPage, ApplicationPopoverMenu, ErrorMessage, LoadingIndicator, SimulationBrowser, SimulationContextMenu, simulationFileControl} from 'components';
import {ApplicationShortCuts, ApplicationShortCutsLockerStatus} from 'components/site/ApplicationShortCuts';
import {SimulationUseCaseContextMenu} from 'components/system/simulationUseCaseViewer/SimulationUseCaseContextMenu';
import {SimulationUseCaseViewerApplication} from 'components/system/simulationUseCaseViewer/SimulationUseCaseViewerApplication';
import {SimulationUseCaseViewerApplicationBarItems} from 'components/system/simulationUseCaseViewer/SimulationUseCaseViewerApplicationBarItems';
import {RelatedObjectBrowser} from 'components/widgets/SmartBrowser/RelatedObjectBrowser';
import {action, autorun, computed, makeObservable, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react'
import * as React from 'react';
import {appIcons, ClimateRiskAnalysis, i18n, IO, Query, routing, RSSimulation, rsSimulationStore, settings, SimulationStatus, simulationStore, site} from 'stores';
import {Simulation} from 'stores/simulation';
import {ActiveTool} from 'stores/site';
import {RepositoryApplicationBarItems} from '../Repository/RepositoryApplicationBarItems';
import {RepositoryComponent} from '../Repository/RepositoryComponent';
import {RepositoryContextMenu} from '../Repository/RepositoryContextMenu';
import {RSSimulationApplication} from '../rsSimulation/RSSimulationApplication';
import {RSSimulationApplicationBarItems} from '../rsSimulation/RSSimulationApplicationBarItems';
import {RSSimulationContextMenu} from '../rsSimulation/RSSimulationContextMenu';
import {UserFileUploadComponent} from "../UserFile/UserFileUploadComponent";

import * as css from './SimulationsPage.css';

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	params?: { id?: string, useCaseName?: string }
}

@observer
export class SimulationsPage extends React.Component<MyProps, {}> {
    _toDispose = [];
    @observable browser: any;
    @observable.ref loadError: Error;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
		const {_toDispose} = this;

		_toDispose.push(
			autorun(() => {
				const {simulationId: id} = this;
				runInAction(async () => {
					if (id && !simulationStore.simulations.has(id)) {
						try {
							this.loadError = null
							await simulationStore.loadDescriptor(id);
						}
						catch (err) {
							site.raiseError(err, "simulation")
							this.loadError = err;
						}
					}
				});
			}, {name: 'Load simulation if needed'}));
	}

    componentWillUnmount() {
		this._toDispose.forEach(d => d());
	}

    get preferences() {
		return settings.searchers.simulation
	}

	@computed get simulation(): Simulation {
		return this.simulationId ? simulationStore.simulations.get(this.simulationId) : null;
	}

    @computed get simulationId() {
		return this.props.params.id
	}

    @computed get isBrowser() {
		return this.simulationId == null
	}

	get isRelatedObjectBrowser() {
		// Relies on url check and therefore cannot be made into a mobx computed.
		return !this.isBrowser && RelatedObjectBrowser.isRelatedObjectBrowserURL();
	}

	get isObjectViewer() {
		// Relies on url check and therefore cannot be made into a mobx computed.
		return !this.isBrowser && !this.isRelatedObjectBrowser;
	}

	@computed get isUseCase() {
		return this.simulation ? this.simulation.useCase : document.location.pathname.indexOf(routing.urls.useCaseBrowser) == 0;
	}

	@computed get useCase() {
		if (!this.isUseCase) { return null; }

		const ucName = this.simulation ? this.simulation.useCase : this.props.params.useCaseName;
		return _.find(rsSimulationStore.useCases, uc => uc.name == ucName)
	}

	@computed get applicationTitle() {
		if (this.isObjectViewer && !this.simulation) {
			return site.loadingText(Simulation.OBJECT_NAME_SINGLE);
		}
		let title = Simulation.OBJECT_NAME_SINGLE;
		if (this.isUseCase) {
			title = this.useCase.title;
		}

		return this.isBrowser ? i18n.common.OBJECT_CTRL.WITH_VARIABLES.BROWSER(title) : title;
	}

	@computed get applicationBarItems() {
		if (this.isObjectViewer) {
			const simulation = this.simulation;
			if (!simulation) {
				return null;
			}
			if (simulation.isRepository) {
				return <RepositoryApplicationBarItems repository={simulation.repository} location={this.props.location}/>;
			}
			if (this.isUseCase) {
				return <SimulationUseCaseViewerApplicationBarItems rsSimulation={simulation.rsSimulation}/>;
			}
			if (simulation.isGEMSBased) {
				return <RSSimulationApplicationBarItems rsSimulation={simulation.rsSimulation} location={this.props.location}/>;
			}
		}
		return <div/>;
	}

	@computed get applicationPopoverMenu() {
		const simulation = this.simulation;
		let icon = null, disabled = false;
		if (simulation?.isGEMSBased) {
			disabled =  !simulation?.rsSimulation?.isLoaded;
			if (this.isUseCase) {
				icon = this.useCase?.icon;
			}
		}

		let result =  [
			<ApplicationPopoverMenu disabled={disabled} icon={icon} />
		];

		if (this.browser && !_.isEmpty(this.browser.catalogContext.path)) {
			this.browser.panel.addToBreadcrumbs(result);
		}

		return result;
	}

	@computed get applicationMenuItems() {
		if (this.isObjectViewer) {
			const simulation = this.simulation;
			if (!simulation) {
				return null;
			}
			if (simulation.isRepository) {
				return <RepositoryContextMenu simulation={simulation}/>;
			}
			if (this.isUseCase) {
				return <SimulationUseCaseContextMenu simulation={simulation}/>;
			}
			if (simulation.isGEMSBased) {
				return <RSSimulationContextMenu simulation={simulation}/>;
			}
		}
		return <SimulationContextMenu panel={this.browser?.panel} simulation={this.simulation} location='header'/>;
	}

	@computed get applicationContent() {
		if (this.loadError) {
			return <ErrorMessage message={site.errorText(Simulation.OBJECT_NAME_SINGLE)}/>;
		}

		// create repo from file upload
		if (this.props.location.query.createRepository != null) {
			return <UserFileUploadComponent />
		}
		// object browser
		if (this.isBrowser) {
			return <SimulationBrowser
				ref={action(r => this.browser = r)}
				queryParams={this.props.location.query}
				extraParameters={{
					useCase: this.isUseCase ? this.useCase.name : null
				}}
				multiselect
			/>
		}

		const simulation = this.simulation
		// Related object browser
		if (this.isRelatedObjectBrowser) {
			return <RelatedObjectBrowser model={simulation} defaultRelatedObjectTypes={[Query.ObjectType, IO.ObjectType, ClimateRiskAnalysis.ObjectType]} />
		}

		if (!simulation) {
			return <LoadingIndicator />;
		}
		// object applications for different type of simulation.
		if (simulation.isRepository) {
			return <RepositoryComponent repository={simulation.repository} location={this.props.location}/>;
		}
		if (this.isUseCase) {
			return <SimulationUseCaseViewerApplication rsSimulation={simulation.rsSimulation}/>;
		}
		if (simulation.isGEMSBased) {
			return <RSSimulationApplication rsSimulation={simulation.rsSimulation} location={this.props.location}/>;
		}

		return <ErrorMessage message={"Simulation cannot display."}/>;
	}

	@computed get pageLocker() {
		const simulation = this.simulation;
		if (this.simulation?.isGEMSBased) {
			return {
				objectType : Simulation.ObjectType,
				lockerStatus : simulation.rsSimulation.status == "Running" ? ApplicationShortCutsLockerStatus.RUNNING :
				               simulation.rsSimulation.inputsLocked ? ApplicationShortCutsLockerStatus.LOCKED : ApplicationShortCutsLockerStatus.UNLOCKED,
				lockerUpdater: (locked) => {simulation.rsSimulation.inputsLocked = locked; }
			}
		}
		return {};
	}

	render() {
		const simulation = this.simulation;


		return (
			<ApplicationPage id="simulations-page"
			                 className={classNames({[css.specificSim]: simulation != null})}
			                 tool={ActiveTool.simulation}
			                 tag={() => this.simulation}
			                 title={() => this.applicationTitle}
			                 loaded={true}
			                 renderTitle={() => null}
			                 breadcrumbs={() => this.applicationPopoverMenu}
			                 afterBreadcrumbs={() => this.applicationBarItems}


			                 breadcrumbsRight={() => simulation &&
							      <ApplicationShortCuts
	                                 getName={() => simulationFileControl.getName(simulation)}
	                                 setName={(s) => simulationFileControl.setName(s,simulation)}
	                                 delete={() => simulationFileControl.delete(simulation)}
	                                 copy={simulation.editable ? () => simulationFileControl.copy(simulation) : null}
	                                 copyToNewTab={simulation.editable ? () => simulationFileControl.copy(simulation, true) : null}
	                                 {...this.pageLocker}
	                             />
							 }
			                 applicationButtonText={() => this.applicationTitle}
			                 renderApplicationMenuItems={() => this.applicationMenuItems}
			>
				{this.applicationContent}

			</ApplicationPage>)
	}
}
