import {GenericNameEditor} from 'components/system/ObjectNameChecker/GenericNameEditor';
import {GenericCommentsEditor} from 'components/widgets/SmartBrowser/GenericCommentsEditor';
import {ObjectTypeQuery} from '../../../stores/objectMetadata/OmdbGraph';
import {settings, ObjectCatalogContext, omdb, IO, Simulation, site} from "stores";
import {bp, LoadingUntil, ErrorMessage, ObjectBrowserProps} from 'components';
import { SortableCardsPanel } from 'components/widgets/SmartBrowser/SortableCardsPanel';
import {Observer, observer} from 'mobx-react'
import { observable, makeObservable } from 'mobx';
import {IOCardToolbarButtons} from "./IOCard";

@observer
//@bp.ContextMenuTarget
export class IOBrowser extends React.Component<ObjectBrowserProps<IO>, {}> {
    static SIMULATION_TAG = ["assetReturnsSimulation", "companyDataSimulation", "companyDataRepository"];

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    get preferences() {
		return settings.searchers.ioRun
	}

    @observable panel: SortableCardsPanel;
    @observable catalogContext      = new ObjectCatalogContext({objectTypes: [{id: IO.ObjectType}]});

    // @computed
    // get simulations() {
    // 	return this.props.simulations ? map(_.keyBy(this.props.simulations, s => s.id)) : simulationStore.simulations;
    // }

    rename = (io) => {
		return async (val) => {
			try {
				site.busy = true;
				await io.rename(val);
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
				column.renderValue = (model) => <GenericNameEditor model={model} catalogContext={catalogContext} />;

			} else if (column.name == SortableCardsPanel.ACTIONS_FIELD) {
				column.renderValue = (io) => <IOCardToolbarButtons investmentOptimization={io} className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)} onDelete={catalogContext.delete} onDuplicate={catalogContext.insert}/>

			} else if (column.name == SortableCardsPanel.COMMENTS_FIELD) {
				column.renderValue = (model) => <GenericCommentsEditor model={model} panel={this.panel} />;

			} else if (_.some(IOBrowser.SIMULATION_TAG, tagName => column.name == tagName)) {
				column.type = Simulation.ObjectType;
			}
		});
		return newObjectType;
	});

    render() {
		const {preferences, catalogContext, props:{ view: propsView}} = this;

		return <ObjectTypeQuery query={omdb.graph.objectType} variables={{objectType: IO.ObjectType}}>
			{({loading, error, data}) => {
				if (!loading && !error) {
					setTimeout(() => catalogContext.replaceNewObjectTypes([this.getObjectTypeForRender(data.omdb.objectType)]), 0);
				}

				return <LoadingUntil loaded={!loading}>
					{error ? <ErrorMessage error={error}/>
					: <Observer>{() => {
						const newObjectType = this.getObjectTypeForRender(data.omdb.objectType);
						const { ui } = newObjectType;

						// if (uiDefinition && uiDefinition.catalog && _.isArray(tags)) {
						// 	tableFields.push(...uiDefinition.catalog.tags.map(f => tags.find(t => t.name == f.name)));
						// 	tableFields = tableFields.filter(f => f.canSort != false);
						// }

						return <SortableCardsPanel ref={panel => this.panel = panel}
						                           objectType={IO.ObjectType}
						                           {...this.props}
						                           selectable
						                           view={propsView || preferences.view}
						                           onSetView={v => preferences.view = v}

						                           catalogContext={catalogContext}
						                           hideToolbar={propsView != null}
						                           showUserFilter={true}
						                           uiDefinition={ui}
						                           tags={data.omdb.objectType.tags}

						/>
					}}</Observer>}
				</LoadingUntil>
			}}
		</ObjectTypeQuery>
	}

    static defaultProps = {
		allowDelete: true,
		showObjectToolbar: true,
		//className: 'ui segment',
		//title: 'Simulations',
	}

    $node: JQuery;
    _toRemove = [];

    autoLoaderInterval = null;

    componentWillUnmount() {
		this._toRemove.forEach(f => f());
		this.catalogContext?.dispose();
		clearInterval(this.autoLoaderInterval);
		this.autoLoaderInterval = null;
		console.log("Timer canceled");
	}

    componentDidMount() {
		this.$node = $(ReactDOM.findDOMNode(this))
	}
}
