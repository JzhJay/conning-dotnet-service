import {NavbarDivider} from '@blueprintjs/core';
import {GenericNameEditor} from 'components/system/ObjectNameChecker/GenericNameEditor';
import {GenericCommentsEditor} from 'components/widgets/SmartBrowser/GenericCommentsEditor';
import {ObjectTypeQuery} from '../../../stores/objectMetadata/OmdbGraph';
import {settings, simulationTestData, Simulation, simulationStore, ObjectCatalogContext, mobx, omdb, UserFile, site} from "stores";
import {dialogs, bp, SimulationContextMenu, LoadingUntil, ErrorMessage, ObjectBrowserProps} from 'components';
import { SortableCardsPanel } from 'components/widgets/SmartBrowser/SortableCardsPanel';
import {Observer, observer} from 'mobx-react'
import {observable, makeObservable, action} from 'mobx';
import {SimulationCardToolbarButtons} from "./SimulationCard";

interface MyProps extends ObjectBrowserProps<Simulation>{
	controller?: (controller: SimulationBrowserController) => void;
	selectedSimulationIds?: string[];
	extraParameters?: {
		userFileId?: string; // moved to relatedObjectBrowser.
		useCase?: string;
		parameterizationMeasure?: string;
	}

}

export interface SimulationBrowserController {
	getSelectedSimulationIds(): string[];
}

@observer
@bp.ContextMenuTarget
export class SimulationBrowser extends React.Component<MyProps, {}> {

	static USERFILE_TAG = ["userFile"];

	get preferences() {
		return settings.searchers.simulation
	}

	@observable selectedSimulationIds: string[];
	@observable isImportingTestData = false;
	@observable panel: SortableCardsPanel;
	@observable catalogContext      = new ObjectCatalogContext({objectTypes: [{id: Simulation.ObjectType}]});

	// @computed
	// get simulations() {
	// 	return this.props.simulations ? map(_.keyBy(this.props.simulations, s => s.id)) : simulationStore.simulations;
	// }

	rename = (sim) => {
		return async (val) => {
			try {
				site.busy = true;
				await Simulation.rename(sim, val);
				if (this.catalogContext && this.catalogContext.isHierarchicalViewEnabled) {
					await this.catalogContext.refresh();
				}
			} finally {
				site.busy = false;
			}
		}
	}

	getObjectTypeForRender = _.memoize((objectType) => {
		const { catalogContext } = this;
		const newObjectType = _.cloneDeep(objectType);
		const { ui } = newObjectType;
		ui.table.columns.forEach( column => {
			if (column.name == SortableCardsPanel.NAME_FIELD) {
				column.renderValue = (sim) => <GenericNameEditor model={sim} catalogContext={catalogContext} />;

			} else if (column.name == SortableCardsPanel.ACTIONS_FIELD) {
				column.renderValue = (sim) => <SimulationCardToolbarButtons sim={sim} className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)} onDelete={catalogContext.delete} onDuplicate={catalogContext.insert}/>

			} else if (column.name == SortableCardsPanel.COMMENTS_FIELD) {
				column.renderValue = (sim) => <GenericCommentsEditor model={sim} panel={this.panel} />;

			} else if (_.some(SimulationBrowser.USERFILE_TAG, tagName => column.name == tagName)) {
				column.type = UserFile.ObjectType;
			}
		});
		return newObjectType;
	})

	render() {
		const {preferences, catalogContext, props:{ view: propsView }} = this;

		return <ObjectTypeQuery query={omdb.graph.objectType} variables={{objectType: Simulation.ObjectType}}>
			{({loading, error, data}) => {
				if (!loading && !error) {
					setTimeout(() => catalogContext.replaceNewObjectTypes([this.getObjectTypeForRender(data.omdb.objectType)]), 0);
				}

				return <LoadingUntil loaded={!loading}>
					{error ? <ErrorMessage error={error}/>
					: <Observer>{() => {
						const objectType = this.getObjectTypeForRender(data.omdb.objectType);
						const { ui } = objectType;

						// if (uiDefinition && uiDefinition.catalog && _.isArray(tags)) {
						// 	tableFields.push(...uiDefinition.catalog.tags.map(f => tags.find(t => t.name == f.name)));
						// 	tableFields = tableFields.filter(f => f.canSort != false);
						// }

						return <SortableCardsPanel ref={action(panel => this.panel = panel)}
						                           {...this.props}
						                           objectType={Simulation.ObjectType}
						                           selectable
						                           view={propsView || preferences.view}
						                           onSetView={v => preferences.view = v}

						                           catalogContext={catalogContext}
						                           createItemLink={<a onClick={() => dialogs.importSimulation()}>Import one</a>}
						                           hideToolbar={propsView != null}
						                           extraHotkeys={[
							                           {
														   global: true,
								                           label: "Query Simulation(s)",
								                           group: "Actions",
								                           combo: "q",
								                           onKeyDown: this.querySelectedSimulations
							                           }
						                           ]}
						                           showUserFilter={true}
						                           toolbarChildrenRight={() => {
							                           const {panel} = this;

							                           /* WEB - 1577 - move these actions into the context menu and application menu bar */
							                           return false && <div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
								                           {panel && <bp.AnchorButton
									                           text={`Query ${panel.selectedItems.size > 1 ? `${panel.selectedItems.size} ` : ''}${panel.selectedItems.size < 2 ? 'Simulation' : 'Simulations'}`}
									                           icon="search" disabled={panel.selectedItems.size == 0}
									                           onClick={this.querySelectedSimulations}/>}

								                           <NavbarDivider />

								                           {/*{panel && <bp.AnchorButton text={`Delete ${panel.selectedItems.size < 2 ? 'Simulation' : 'Simulations'}`}*/}
								                           {/*icon="trash" disabled={panel.selectedItems.size == 0}*/}
								                           {/*onClick={this.deleteSelectedSimulations}/>}*/}

								                           {DEV_BUILD && <bp.Button text="Import Simulation" icon="import" onClick={() => dialogs.importSimulation()}/>}

								                           {DEV_BUILD
								                           && simulationStore.hasLoadedDescriptors
								                           && simulationTestData.testSimulations.some(s => !mobx.values(simulationStore.simulations).some(v => v.path == s.path))
								                           && <bp.Button text="Import Test Simulations" disabled={this.isImportingTestData}
								                                         icon="import"
								                                         onClick={action(async () => {
									                                         this.isImportingTestData = true;
									                                         await simulationTestData.registerTestSimulations();
									                                         this.isImportingTestData = false;
								                                         })}/>}
							                           </div>
						                           }}
						                           tags={data.omdb.objectType.tags}
						                           uiDefinition={ui}

						/>
					}}</Observer>}
				</LoadingUntil>
			}}
		</ObjectTypeQuery>
	}

	querySelectedSimulations = () => {
		const simIds = Array.from(this.panel.selectedItems.keys());
		dialogs.newQuery(simIds)
	}

	renderContextMenu() {
		return <SimulationContextMenu location='browser' panel={this.panel}/>
	}

	static defaultProps = {
		allowDelete: true,
		showObjectToolbar: true
		//className: 'ui segment',
		//title: 'Simulations',
	}

	constructor(props: MyProps, state) {
        super(props, state);

		makeObservable(this);

		this.selectedSimulationIds = props.selectedSimulationIds;

		let {props: {queryParams, extraParameters}, catalogContext} = this;
		const extraWhere: any = {};
		if (!_.isEmpty(extraParameters?.userFileId)) {
			extraWhere.userFile = extraParameters.userFileId;

			if (queryParams && queryParams.activeSessions)
				extraWhere._id = queryParams.activeSessions.split(",");
		}

		if (!_.isEmpty(extraParameters?.useCase)) {
			extraWhere.useCase = extraParameters?.useCase;
		}

		if (!_.isEmpty(extraParameters?.parameterizationMeasure)) {
			extraWhere.parameterizationMeasure = extraParameters?.parameterizationMeasure;
		}

		if (!_.isEmpty(extraWhere)) {
			catalogContext.extraWhere = extraWhere;
		}
	}

	$node: JQuery;
	_toRemove = [];

	componentWillUnmount() {
		this._toRemove.forEach(f => f());
		this.catalogContext?.dispose();
	}

	componentDidMount() {
		this.$node = $(ReactDOM.findDOMNode(this))

		if (this.props.controller) {
			this.props.controller({
				getSelectedSimulationIds: () => _.uniq([...this.props.selectedSimulationIds, ...this.selectedSimulationIds])
			})
		}
	}

	private onSimulationSelected = (simulation: Simulation, isChecked: boolean) => {
		let {selectedSimulationIds} = this;

		if (selectedSimulationIds) {
			if (isChecked) {
				selectedSimulationIds.push(simulation.id);
			} else {
				_.remove(selectedSimulationIds, id => id === simulation.id)
			}
		}
		else {
			selectedSimulationIds = [simulation.id];
		}

		this.selectedSimulationIds = _.uniq(selectedSimulationIds);

		//this.setState({selectedSimulationIds: selectedSimulationIds}, () => this.props.onSelectSimulationIds(selectedSimulationIds));
	}
}
