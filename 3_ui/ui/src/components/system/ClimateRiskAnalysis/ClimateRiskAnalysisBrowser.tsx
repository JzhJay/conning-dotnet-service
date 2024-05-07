import {GenericNameEditor} from 'components/system/ObjectNameChecker/GenericNameEditor';
import {GenericCommentsEditor} from 'components/widgets/SmartBrowser/GenericCommentsEditor';
import {ObjectTypeQuery} from '../../../stores/objectMetadata/OmdbGraph';
import {ClimateRiskAnalysis} from '../../../stores/climateRiskAnalysis';
import {settings, ObjectCatalogContext, omdb, site, Simulation } from "stores";
import {SortableCardsPanel, bp, LoadingUntil, ErrorMessage, ObjectBrowserProps} from 'components';
import {Observer, observer} from 'mobx-react'
import { observable, makeObservable } from 'mobx';
import {ClimateRiskAnalysisCardToolbarButtons} from "./ClimateRiskAnalysisCard";

@observer
export class ClimateRiskAnalysisBrowser extends React.Component<ObjectBrowserProps<ClimateRiskAnalysis>, {}> {
    static SIMULATION_TAG = ["simulation"];

    constructor(props) {
        super(props);

		if (!settings.searchers.climateRiskAnalysis){
			settings.searchers.climateRiskAnalysis = {};
		}

        makeObservable(this);
    }

    componentDidMount() {
		this.$node = $(ReactDOM.findDOMNode(this))
	}

    get preferences() {
		return settings.searchers.climateRiskAnalysis;
	}

    panel: SortableCardsPanel;
    @observable catalogContext      = new ObjectCatalogContext({objectTypes: [{id: ClimateRiskAnalysis.ObjectType}]});

    rename = (climateRiskAnalysis) => {
		return async (val) => {
			try {
				site.busy = true;
				await climateRiskAnalysis.rename(val);
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
				column.renderValue = (climateRiskAnalysis) => <ClimateRiskAnalysisCardToolbarButtons climateRiskAnalysis={climateRiskAnalysis} className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)} onDelete={catalogContext.delete} onDuplicate={catalogContext.insert}/>;

			} else if (column.name == SortableCardsPanel.COMMENTS_FIELD) {
				column.renderValue = (model) => <GenericCommentsEditor model={model} panel={this.panel} />;

			} else if (_.some(ClimateRiskAnalysisBrowser.SIMULATION_TAG, tagName => column.name == tagName)) {
				column.type = Simulation.ObjectType;
			}
		});
		return newObjectType;
	})
	
    render() {
		const {preferences, catalogContext, props:{ view: propsView}} = this;

		return <ObjectTypeQuery query={omdb.graph.objectType} variables={{objectType: ClimateRiskAnalysis.ObjectType}}>
			{({loading, error, data}) => {
				if (!loading && !error) {
					setTimeout(() => catalogContext.replaceNewObjectTypes([this.getObjectTypeForRender(data.omdb.objectType)]), 0);
				}

				return <LoadingUntil loaded={!loading}>
					{error ? <ErrorMessage error={error}/>
					: <Observer>{() => {
						const newObjectType = this.getObjectTypeForRender(data.omdb.objectType);
						const {ui} = newObjectType;

						return <SortableCardsPanel ref={panel => this.panel = panel}
						                           objectType={ClimateRiskAnalysis.ObjectType}
						                           {...this.props}
						                           selectable
						                           view={propsView || preferences?.view}
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
	}

    $node: JQuery;
    _toRemove = [];

    componentWillUnmount() {
		this._toRemove.forEach(f => f());
		this.catalogContext?.dispose();
	}
}
