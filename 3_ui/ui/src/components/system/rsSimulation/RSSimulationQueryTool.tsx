import {RSSimulationEmptyOutput} from 'components/system/rsSimulation/RSSimulationOutput';
import {StepNavigationItem} from 'components/system/rsSimulation/StepNavigator';
import {computed, when, reaction, observable, action, autorun, makeObservable, runInAction} from 'mobx';
import { observer } from 'mobx-react';

import { bp, LoadingIndicator, siteActions, ErrorMessage } from 'components';
import * as React from 'react';
import {Query, QueryDescriptor, QueryPage} from '../../../stores/query/ui';
import {queryStore, routing, simulationStore} from 'stores';
import { ObjectCatalogContext } from '../../../stores/objectMetadata';
import {RSSimulation} from '../../../stores/rsSimulation';
import {QueryPanel} from '../query-tool/query-builder/QueryPanel';

import * as css from './RSSimulationQueryTool.css';

interface MyProps {
	rsSimulation: RSSimulation;
}

@observer
export class RSSimulationQueryTool extends React.Component<MyProps, {}> {
	@observable loadingText = 'Check if there is an existing query ...';
	@observable private _queryToolError: string;

	@computed get queryToolError() { return this._queryToolError; }
	set queryToolError(s) { action(() => this._queryToolError = s)(); }

	_toDispose: Function[] = [];

	constructor(props) {
        super(props);

        makeObservable(this);

        const { rsSimulation } = this.props;
        if (!rsSimulation.queryId) {
			const catalogContext = new ObjectCatalogContext({objectTypes: [{id: Query.ObjectType}]});
			catalogContext.extraWhere = {simulations: [rsSimulation._id]};

			this._toDispose.push(
				when(() => rsSimulation.isComplete, action(async() => {
					await catalogContext.refresh();
					await when(() => !!(catalogContext.pageResults));

					const pageResults = catalogContext.pageResults;
					if (pageResults.length === 0) {
						await this.newQuery();
					} else {
						await this.loadQuery(pageResults[0]._id);
					}
					catalogContext.dispose();
				}))
			);
		}

        this._toDispose.push(this.watchQueryIdInUrlAndStartSessionIfNeeded());
	}

	setRSSimulationNavigateItem = (page: QueryPage) => {
		const { rsSimulation } = this.props;
		const queryPageId = page.id.replace(/\./g, '_');
		const rsSimulationPageId = _.get(rsSimulation.stepNavigationController.activeItem, 'name', '');

		if (queryPageId != rsSimulationPageId) {
			const path     = ['query', queryPageId];
			const pageItem = rsSimulation.stepNavigationController.getExecutableItemByPathStringAry(path);
			rsSimulation.stepNavigationController.setActiveByItem(pageItem);
		}
	}

	@computed
	get view() {
		const { rsSimulation } = this.props;
		const query = rsSimulation.query as Query;
		return query?.currentPage?.view == "result" ? _.get(query, ['queryResult', 'currentView'], 'pivot') : query?.currentPage?.view;
	}

	newQuery = action(async () => {
		this.loadingText = 'Creating a new query ...';
		const { rsSimulation } = this.props;
		const simulation = simulationStore.simulations.get(rsSimulation._id);
		const queryId = await queryStore.createQuerySessionDescriptor(`${simulation.name}'s Query`, [rsSimulation._id], null, false);
		this.props.rsSimulation.queryId = queryId;
	})

	loadQuery = action(async (queryId: string) => {
		this.loadingText = 'Loading an existing query ...';
		this.props.rsSimulation.queryId = queryId;
	})

	watchQueryIdInUrlAndStartSessionIfNeeded = () => {
		let queryConfigured = false;

		return (
			autorun(async () => {
				const { view } = this;
				const { query, queryId: id } = this.props.rsSimulation;

				if (id && (!queryStore.querySessions.has(id) || !queryStore.querySessions.get(id).hasSession)) {
					try {
						if (view === 'query') {
							try {
								if (query instanceof Query) {
									await query.startSession();
								}
								else {
									// Wait until we know if we have a result or not
									await queryStore.startQuerySession(id);
								}
							}
							catch(e) {
								throw(e);
							}
						} else {
							const _query = await queryStore.getQuery(id);
							await _query.initializeQuerySession(); // Initialize session to get SSE updates.
						}
					}
					catch (err) {
						this.queryToolError = `Could not initialize query \'${id}\'`;;
					}
				}
				else {
					this.queryToolError = null;
				}

				if (!queryConfigured && query instanceof Query) {
					queryConfigured = true;
					query.updateURLFromNavigation = false;
					// Run in timeout to give step navigator an opportunity to rebuild pages if needed.
					query.onNavigateToPage = (page: QueryPage) => setTimeout(() => this.setRSSimulationNavigateItem(page), 1);
				}

				//this.updateToolbar();
			}, {name: `Start Query Session from URL`})
		);
	}

	componentWillUnmount() {
		this._toDispose.forEach(f => f());
		if (this.props.rsSimulation.query instanceof Query) {
			this.props.rsSimulation.query.onNavigateToPage = null;
			this.props.rsSimulation.query.dispose();
		}
	}

	render() {
		const { loadingText, queryToolError, view } = this;
		const { rsSimulation, rsSimulation: { query } } = this.props;
		const isQueryLoading = _.get(query, 'isLoading', true);

		return(
			<div className={css.root}>
				{ !rsSimulation.isComplete && <RSSimulationEmptyOutput />}

				{ rsSimulation.isComplete &&
				 <div className={classNames(css.queryToolResult, { [css.loading]: isQueryLoading })}>
					{ !isQueryLoading ? <QueryPanel query={query} view={view} /> :
					<LoadingIndicator text={loadingText} /> }
				 </div>
				}
				{queryToolError && <ErrorMessage message={queryToolError}/>}
			</div>
		);
	}
}