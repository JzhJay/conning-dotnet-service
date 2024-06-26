import {GenericNameEditor} from 'components/system/ObjectNameChecker/GenericNameEditor';
import {GenericCommentsEditor} from 'components/widgets/SmartBrowser/GenericCommentsEditor';
import type {SimulationGuid} from 'stores';
import {queryStore, settings, site, QueryDescriptor, utility, ObjectTypeQuery, Report} from 'stores';
import {SortableCardsPanel, bp, QueryContextMenu, siteActions, LoadingIndicator, ErrorMessage, ObjectBrowserProps} from 'components'
import {Observer, observer} from 'mobx-react'
import { autorun, computed, makeObservable } from 'mobx';
import {QueryCardToolbarButtons} from './QueryCard';
import {Query} from "../../../stores/query/ui";
import {ObjectCatalogContext} from '../../../stores/objectMetadata';
import {omdb, Simulation} from '../../../stores';

interface MyProps extends ObjectBrowserProps<QueryDescriptor>{
	sims?: SimulationGuid[];
}

@observer
@bp.ContextMenuTarget
export class QueryBrowser extends React.Component<MyProps, {}> {
    static SIMULATION_TAG = ["simulations"];
    static REPORT_TAG = ["reportQueries"];

	constructor(props) {
		super(props);

        makeObservable(this);

		this._toRemove.push(
			autorun(() => {
				const {hasLoadedDescriptors, descriptors} = queryStore;
				if (!this.catalogContext.hasRunInitialQuery && hasLoadedDescriptors) {
					//this.catalogContext.queryResults.replace(descriptors);
					this.catalogContext.hasRunInitialQuery = true;
				}
			}));

		const {props: {sims, queryParams}, catalogContext} = this;
		if (!_.isEmpty(sims)) {
			catalogContext.extraWhere = {simulations: sims};

			if (queryParams && queryParams.activeSessions)
				catalogContext.extraWhere._id = queryParams.activeSessions.split(",");
		}
    }

    @computed get preferences() {
		return settings.searchers.query
	}

    // @computed
    // get queries(): Array<QueryDescriptor> {
    // 	const { props: { restrictTo, exclude, sims } } = this;
    //
    // 	const { descriptors, loadedQueries, hasLoadedQueryDescriptors } = queryStore;
    //
    // 	if (!hasLoadedQueryDescriptors) {
    // 		return null;
    // 	}
    //
    // 	let queries = descriptors.values()
    // 	                         .map(q => loadedQueries.has(q.id) ? loadedQueries.get(q.id) : q)
    // 	                         .filter(q => restrictTo == null || restrictTo.indexOf(q.id) !== -1)
    // 	                         .filter(q => exclude == null || exclude.indexOf(q.id) === -1);
    //
    // 	if (!_.isEmpty(sims)) {
    // 		queries = queries.filter(q => _.some(q.simulationIds, id => sims.indexOf(id) != -1));
    // 	}
    //
    // 	return _.orderBy(queries,
    // 	                 ['loading', 'isActivePage', 'state', 'isSession', 'hasResult', 'name', 'numOfVariable'],
    // 	                 ['desc', 'desc', 'asc', 'desc', 'desc', 'asc', 'desc']
    // 	);
    //
    // }

    panel: SortableCardsPanel;
    catalogContext = new ObjectCatalogContext({objectTypes: [{id: Query.ObjectType}]});

    rename = (query) => {
		return async (val) => {
			try {
				site.busy = true;
				await query.rename(val);
				if (this.catalogContext && this.catalogContext.isHierarchicalViewEnabled) {
					await this.catalogContext.refresh();
				}
			} finally {
				site.busy = false;
			}
		}
	}

	getObjectTypeForRender = _.memoize((objectType) => {
		const newObjectType = _.cloneDeep(objectType);
		const { ui } = newObjectType;
		const tableColumns = ui.table && ui.table.columns ? ui.table.columns.slice() : [];
		tableColumns.forEach( column => {
			if (column.name == SortableCardsPanel.NAME_FIELD) {
				column.renderValue = (model) => <GenericNameEditor model={model} catalogContext={this.catalogContext} />;

			} else if (column.name == SortableCardsPanel.ACTIONS_FIELD) {
				column.renderValue = (query) => <QueryCardToolbarButtons query={query} className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)} onDelete={this.catalogContext.delete} onDuplicate={this.catalogContext.insert}/>;

			} else if (_.some(QueryBrowser.SIMULATION_TAG, tagName => column.name == tagName)) {
				column.type = Simulation.ObjectType;

			} else if (_.some(QueryBrowser.REPORT_TAG, tagName => column.name == tagName)) {
				column.type = Report.ObjectType;
				
			} else if (column.name == SortableCardsPanel.COMMENTS_FIELD) {
				column.renderValue = (model) => <GenericCommentsEditor model={model} panel={this.panel} />;
			}
		});
		ui.table.columns = tableColumns;
		return newObjectType;
	})

    render() {
		return <ObjectTypeQuery query={omdb.graph.objectType} variables={{objectType: Query.ObjectType}}>
			{({loading, error, data}) => {
				if (loading) {
					return <LoadingIndicator/>
				} else if (error) {
					return <ErrorMessage error={error}/>
				}

				setTimeout(() => this.catalogContext.replaceNewObjectTypes([this.getObjectTypeForRender(data.omdb.objectType)]));

				return <Observer>
					{() => {
						const {preferences, catalogContext, props:{ view: propsView, sims}} = this;
						const multiselect = catalogContext.hasRunInitialQuery && catalogContext.queryResults.size > 1;
						const objectType = this.getObjectTypeForRender(data.omdb.objectType);
						const {ui} = objectType;

						// WEB-1586
						// tabs={[{label: 'Active', enabled: queryStore.loadedQueries.size > 0, }]}
						return <SortableCardsPanel ref={panel => this.panel = panel}
						                           objectType={Query.ObjectType}
						                           {...this.props}
						                           multiselect={multiselect}
						                           selectable={multiselect}
						                           view={propsView || preferences.view}
						                           onSetView={v => preferences.view = v}

						                           catalogContext={catalogContext}
						                           createItemLink={<a onClick={() => siteActions.newQuery(sims)}>Start a new query</a>}
						                           showUserFilter={true}
						                           hideToolbar={propsView != null}


						                           filters={[
							                           /*{key: 'queries', icon: 'search', text: 'Sessions', applyFilter: (queries) => queries.filter(q => !q.hasResult)},
							                           {key: 'results', icon: 'chart', text: 'Results', applyFilter: queries => queries.filter(q => q.hasResult)},
							                           {key:            'report-queries',
								                           icon:        'book',
								                           text:        'Used in Report?',
								                           type:        'checkbox',
								                           applyFilter: queries => queries.filter(q => q.reportQueries.length > 0)
							                           }*/
						                           ]}
						                           uiDefinition={ui}
						                           tableColumns={ui.table.columns}
						/>
					}}
				</Observer>;
			}}
		</ObjectTypeQuery>;
	}

    renderContextMenu(e) {
		if (!utility.isHyperlink(e.target)) {
			return <QueryContextMenu location='browser' panel={this.panel}/>
		}
	}

    _toRemove = [];

    componentWillUnmount() {
		this._toRemove.forEach(f => f());
		this.catalogContext?.dispose();
	}

    static defaultProps = {
		title:       'Available Queries',
		allowNew:    true,
		showActions: true,
	}
}
