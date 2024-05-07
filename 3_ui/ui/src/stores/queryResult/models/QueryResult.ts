import gql from 'graphql-tag';
import {
    action,
    observable,
    computed,
    ObservableMap,
    runInAction,
    toJS,
    makeObservable,
} from 'mobx';
import {ServerStatus} from '../../../components/system/ExpireDialog/ExpireDialog';
import {JuliaQueryDescriptor} from '../../query/JuliaModels';
import type {QueryResultDescriptor, PivotMetadata, PivotArrangement} from './';
import {
	CorrelationTableData,
	PivotData,
	HighchartsHelper,
	pivotQueryViewAvailability,
	PivotResultHelper,
	ChartData,
	PivotArrangementHelper,
	IHighchartsHelper,
	IPivotArrangementHelper,
	IPivotResultHelper,
	IChartingResult,
	GroupMember,
	StatisticsOptions, QueryViewUserOptions
} from './';
import type {JuliaUser} from 'stores';
import {
	queryResultStore,
	queryStore,
	utility,
	settings,
	site,
	xhr,
	routing,
	simulationStore,
	QueryViewAvailability,
	user,
	UserId,
	mobx,
	apolloStore,
	omdb,
	JuliaQuery,
	Query,
	QueryDescriptor
} from 'stores';
import {QueryResultContextMenu} from "./QueryResultContextMenu";
import type {Bootstrap, Sensitivity} from "./pivot/pivotJuliaModels";

export type QueryResultData = ChartData | PivotData | PivotMetadata | CorrelationTableData | any;

export interface IQueryResult extends IChartingResult {
	//new(descriptor: QueryResultDescriptor);

	subselect?: boolean;
	//dataByUrl: ObservableMap<boolean>;
	dataByUrl: ObservableMap<string, QueryResultData>;
	loadingByUrl: ObservableMap<string, Promise<QueryResultData>>;
	//availableViews;

	pivotMetadata: PivotMetadata;
	id: string;
	name: string;

	clone();

	correlation: { loading: boolean, data?: CorrelationTableData };

	loadMetadata(props: { subpivot?: boolean, arrangement?: PivotArrangement }): Promise<PivotMetadata>;

	descriptor: QueryResultDescriptor;

	pivot: IPivotResultHelper;
	arrangement: IPivotArrangementHelper;

	createdBy?: UserId;
}

/**
 * A query result is stateful in the REST API and thus must be stateful here
 *
 */
export class QueryResult implements IQueryResult {
	constructor(descriptor: QueryResultDescriptor) {
        makeObservable(this);
        this.descriptor = descriptor;
        this.createdBy  = descriptor.createdBy;
    }

	@observable descriptor: QueryResultDescriptor;

	@observable bootstrapEnabled: boolean = false;
	@observable bootstrap: Bootstrap;

	@observable sensitivityEnabled: boolean = false;
	@observable sensitivity: Sensitivity;

	createdBy: UserId

	get createdByUser(): JuliaUser {
		return user.users.get(this.createdBy)
	}

	get isLoaded() {
		return queryResultStore.loadedResults.has(this.id)
	}

	get CSVDownloadLinkUrl() {
		return xhr.createAuthUrl(`${this.apiUrl}/raw/csv`)
	}

	@observable subselect = null;

	@observable dataByUrl    = observable.map<string, QueryResultData>({}, {deep: false});
	@observable loadingByUrl = observable.map<string, Promise<QueryResultData>>({}, {deep: false});

	get isActivePage() {
		return routing.isActive(this.clientUrl)
	}

	@computed.struct
	get availableViews(): Array<QueryViewAvailability> {
		return this._pivotMetadata ? this.pivotMetadata.availableViews
		                           : this.descriptor && this.descriptor.availableViews
		                             ? this.descriptor.availableViews
		                             : [pivotQueryViewAvailability]
	}

	@observable.deep _pivotMetadata: PivotMetadata;

	arrangement: PivotArrangementHelper         = new PivotArrangementHelper(this);
	@observable isUpdatingStatistics            = false;
	@observable statistics: StatisticsOptions[] = null;
	@observable statisticsStateKey              = 0;
	defaultStatistics: StatisticsOptions[]      = [{statistic: "sum", enabled: true}, {statistic: "count", enabled: true}, {statistic: "mean", enabled: true}, {statistic: "varp", enabled: true}, {statistic: "vars", enabled: true}, {statistic: "stdp", enabled: true},
	                     {statistic: "stds", enabled: true}, {statistic: "coeffvar", enabled: true}, {statistic:"skew", enabled: true}, {statistic: "kurtosis", enabled: true}, {statistic: "min", enabled: true}, {statistic: "max", enabled: true},
	                     {statistic: "percentile", "percentiles": [1, 5, 25, 50, 75, 95, 99], enabled: true},
	                     {statistic: "cte", ctes: [{percentile: 1, area: "under"}, {percentile: 5, area: "under"}], enabled: true}];

	get isFavorite() {
		return settings.favorites.queryResult.indexOf(this.id) != -1
	}

	set isFavorite(value: boolean) {
		if (!value) {
			settings.favorites.queryResult = settings.favorites.queryResult.filter(id => id != this.id)
		}
		else {
			settings.favorites.queryResult = [...settings.favorites.queryResult, this.id];
		}
	}

	autoLoadingMetadata = false;

	@computed
	get pivotMetadata(): PivotMetadata {
		const isIgnoreServerStatus = this.query?.isUseCaseQuery || false;
		const isServerInitialized = isIgnoreServerStatus || (this.query?.serverStatus != ServerStatus.notInitialized || KARMA);
		if (this.descriptor.ready && isServerInitialized && !this._pivotMetadata && !this.autoLoadingMetadata) {
			this.autoLoadingMetadata = true;
			setTimeout(() => this.loadMetadata({statisticspivot: this.showStatisticsPivot}), 0);
		}
		return this._pivotMetadata;
	}

	set pivotMetadata(pivotMetadata: PivotMetadata) {
		this._pivotMetadata = pivotMetadata;

		if (!_.includes(this.availableViews.filter(v => v.available).map(v => v.name), this.currentView)) {
			this.setCurrentView('pivot');
		}
	}

	get statisticsPivotMetadata(): Promise<PivotMetadata> {
		return this.loadMetadata({statisticspivot: true})
	}

	get subPivotMetadata(): Promise<PivotMetadata> {
		return this.loadMetadata({subpivot: true})
	}

	get id() {
		return this.descriptor.id
	}

	get name() {
		return this.descriptor.name
	}

	set name(new_name: string) {
		this.descriptor.name = new_name;
	}

	static apiUrlFor(id?: string) {
		return `${queryResultStore.apiUrl}/${id}`;
	}

	routeFor = (viewName?: string) => {
		return routing.routeFor.query(this.id, viewName)
	};

	navigateTo = (viewName?: string) => {
		routing.push(this.routeFor(viewName));
	}

	get clientUrl() {
		return routing.routeFor.query(this.id, this.currentView)
	}

	get query(): QueryDescriptor {
		const {descriptors} = queryStore;
		const {id}          = this;

		let result: QueryDescriptor = descriptors.get(id);

		if (result == null) {
			let juliaDescriptor = apolloStore.client.cache.readQuery({
				query:     omdb.graph.query.get,
				variables: {id: this.id}
			}) as JuliaQueryDescriptor;

			if (juliaDescriptor) {
				result = new QueryDescriptor(juliaDescriptor)
			}
		}

		return result;
	}

	_simulationIdToName = new Map();
	get simulationIdToName() {
		if (this._simulationIdToName.size == 0){
			this.query.simulations.forEach(element => {
				this._simulationIdToName.set(element._id, element.name);
			});
		}
		return this._simulationIdToName
	}

	@computed
	get apiUrl() {
		return QueryResult.apiUrlFor(this.id);
	}

	@action loadFromJulia = <T>(url: string): Promise<T> => {
		const {loadingByUrl, dataByUrl} = this;

		if (!loadingByUrl.has(url)) {
			dataByUrl.delete(url);
			loadingByUrl.set(
				url,
				xhr.get<QueryResultData>(url)
					.then(data => runInAction(() => {
						// runInAction: Remove loading promise
						loadingByUrl.delete(url)
						dataByUrl.set(url, data)
						return data;
					}))
					.catch(err => {
						loadingByUrl.delete(url);
						throw err;
					})
			);
		}

		return loadingByUrl.get(url);
	}

	@action clone = () => {
		return xhr.get<any>(`${this.apiUrl}/clone`).then(data => {
			const {id} = data;
			// Todo - add to available
			//queryResult.availableResults
		});
	}

	@observable renamingFrom: 'sidebar' | 'header' | null = null;
	@action cancelRename                                  = () => this.renamingFrom = null;
	@action confirmRename = async (value: string) => {
		await this.rename(value);
		this.name         = value;
		this.renamingFrom = null;
	}

	@action rename = (new_name: string) => {
		return xhr.post<any>(`${this.apiUrl}/rename`, {name: new_name}).then(data => {
			this.name = data.name;
		});
	}

	/** Correlation **/

	@computed
	get correlationUrl() {
		return `${this.apiUrl}/correlations`;
	}

	@computed
	get correlation() {
		const {correlationUrl: url, dataByUrl, loadingByUrl} = this;

		return {
			data:    dataByUrl.get(url) as CorrelationTableData,
			loading: loadingByUrl.has(url)
		};
	}

	@action loadCorrelation = () => {
		const {correlationUrl: url, dataByUrl, loadingByUrl} = this;

		if (loadingByUrl.has(url)) {
			return this.loadingByUrl.get(url) as Promise<CorrelationTableData>;
		}
		/*else if (dataByUrl.has(url)) {
		// Does not correctly handle selection/rearrangement, would need to include the selectionUID and arrangementUID as part of the url but that seems hacky and a better solution
		// is probably adding a CorrelationResulHelper class that manages its own caching.
			return Promise.resolve(this.dataByUrl.get(url));
		}*/
		else {
			return this.loadFromJulia<CorrelationTableData>(url);
		}
	}

	loadMetadata = (props: { subpivot?: boolean, statisticspivot?: boolean, arrangement?: PivotArrangement, shouldLoadStatistics?: boolean } = {}): Promise<PivotMetadata> => {
		const {subpivot, statisticspivot, arrangement, shouldLoadStatistics} = props;

		let queryParams = '';

		if (subpivot) {
			queryParams += 'subpivot';
		}

		if (statisticspivot) {
			queryParams += 'statisticspivot';
		}

		if (arrangement) {
			const {rowAxes, columnAxes} = arrangement;

			if (queryParams.length > 0) {
				queryParams += '&';
			}

			queryParams += `rowAxes=${JSON.stringify(rowAxes)}&colAxes=${JSON.stringify(columnAxes)}`;
		}

		const {dataByUrl, apiUrl, loadingByUrl} = this;

		let url = `${apiUrl}/metadata?${queryParams}`;

		// runInAction: Load Pivot Metadata (and reset pivot state) for query result
		return runInAction(() => this.loadFromJulia(url).then(async (metadata: PivotMetadata) => {
				// Add id field to axes for lookup
				for (let i = 0; i < metadata.axes.length; i++) {
					let axis = metadata.axes[i];
					axis.id = i;

					if (axis.groupName.label == 'Simulation') {
						(axis.groupMembers as GroupMember[]).forEach(simulationCoord => {
							simulationCoord.label = this.simulationIdToName.get(simulationCoord.label);
						})
					}

				}

				// let result = new QueryResultEntry(id, metadata);
				//
				// this.metadata = metadata;
				//
				// queryResult.outstandingRequests.remove(url);
				//
				// this.updateSelectionState(id, metadata.selectionUID);
				// this.updateArrangementState(id, metadata.arrangementUID);
				// this.updateAvailableViews(id, metadata.availableViews);

				if (shouldLoadStatistics == null || shouldLoadStatistics === true)
					await this.populateStatistics();

				if (statisticspivot) {
					// Always use available views from full pivot
					let fullPivotMetadata: PivotMetadata = await this.loadFromJulia(`${apiUrl}/metadata`);
					metadata.availableViews = fullPivotMetadata.availableViews;
				}

				if (!props.subpivot) {
					// runInAction: Save off the pivot metadata on to the result
					runInAction(() => this.pivotMetadata = metadata);
				}

				this.autoLoadingMetadata = false;
				return metadata;
			}).catch(err => {
				// A number of computed properties hit this route, we don't want to error in an async thread from a timeout...
				this.error = err;
				return null;
				//throw err;
			})
		);
	}

	populateStatistics = async () => {
		this.statistics = await this.getStatistics();
	}

	@observable error: Error;  // Error state
	// @computed get error() {
	// 	return this._error;
	// }
	//
	// set error(err) {
	// 	site.raiseError(err, 'query');
	// 	this._error = err;
	// }

	highcharts = new HighchartsHelper(this);
	pivot      = new PivotResultHelper(this);

	// @action updateAvailableViews(queryResultId: string, availableViews: Array<QueryViewName>) {
	// 	dispatch(updateStore({availableViews: Object.assign({}, getState().queryResult.availableViews, {[queryResultId]: availableViews})}))
	// }
	//
	// @action updateSelectionState(queryResultId: string, selectionUID: string) {
	// 	const store      = getState();
	// 	const newStateID = Object.assign({}, store.queryResult.stateIDs[queryResultId], {selection: selectionUID});
	// 	dispatch(updateStore({stateIDs: Object.assign({}, store.queryResult.stateIDs, {[queryResultId]: newStateID})}));
	// }
	//
	// @action updateArrangementState(queryResultId: string, arrangementUID: string) {
	// 	const store      = getState();
	// 	const newStateID = Object.assign({}, store.queryResult.stateIDs[queryResultId], {arrangement: arrangementUID});
	// 	dispatch(updateStore({stateIDs: Object.assign({}, store.queryResult.stateIDs, {[queryResultId]: newStateID})}));
	// }

	get isSameAsQuerySession() {
		const {querySessionDescriptor, descriptor: {query: {json}}} = this;

		debugger;

		return querySessionDescriptor && _.eq(querySessionDescriptor.querySave, json);
	}

	get querySessionDescriptor() {
		return queryStore.descriptors.get(this.descriptor.query.id);
	}

	@observable currentView = 'pivot';

	@observable switchingTo = null;

	setCurrentView = action((view: string) => {
		site.busy        = true;
		this.switchingTo = view;

		try {
			// if (view == 'query') {
			// 	const {descriptor: {query: {json: queryJson, id: queryId}}, id} = this;
			//
			// 	let query = await queryStore.startQuerySession(queryId);
			// 	//query.reset(queryJson);
			//
			// 	// Todo - persist arrangement
			// 	query.desiredView = this.currentView;
			// }
			this.currentView = view;
		}
		finally {
			this.switchingTo = null;
			site.busy        = false;
		}
	})

	delete = async () => {
		const {isActivePage, query, id} = this;

		isActivePage && query && query.navigateTo();

		await queryResultStore.delete(this.id);
	}

	@computed get contextMenuItems() {
		return QueryResultContextMenu.menuItemsFor(this);
	}

	@action getBootstrapOptions = () => {
		return xhr.get<Bootstrap>(`${this.apiUrl}/bootstrap`).then(data => {
			this.bootstrap = data;
		});
	}

	@action runBootstrap = () => {
		return xhr.post<Bootstrap>(`${this.apiUrl}/bootstrap`, {options: this.bootstrap.bootstrapOptions});
	}

	_outstandingStatisticsRequest;
	@action updateStatistics                    = async () => {
		this.statisticsStateKey++;
		let currrentKey = this.statisticsStateKey;
		const previousOustanding = this._outstandingStatisticsRequest;

		const update = async () => {
			previousOustanding && (await previousOustanding);
			// wait for outstanding pivot data fetch, to avoid changing the back-end state before the request is complete. e.g. The request may have been for 10 columns and our update will reduce to 9
			// which if processed before the outstanding request will cause a back-end OOB error.
			this.pivot.latestDataRequest && (await this.pivot.latestDataRequest);

			// We don't care about this update anymore so just drop it.
			if (currrentKey != this.statisticsStateKey)
				return;

			this.isUpdatingStatistics = true;

			await this.setStatistics(this.statistics);
			await this.loadMetadata({statisticspivot: true, shouldLoadStatistics: false});

			// Only end if there isn't an outstanding update request that was issued after this one.
			if (currrentKey == this.statisticsStateKey)
				this.isUpdatingStatistics = false;
			else
				console.log("Ignoring update")
		}

		this._outstandingStatisticsRequest = update();

	}

	@action setStatistics = async (options: StatisticsOptions[]) => {
		const params = this.sensitivityEnabled ? 'sensitivity=true' : '';
		await xhr.post(`${this.query.apiUrl}/result/statisticsPivot?${params}`, JSON.stringify(options));
	}

	getStatistics = () => {
		const params = this.sensitivityEnabled ? 'sensitivity=true' : '';
		return xhr.get<StatisticsOptions[]>(`${this.query.apiUrl}/result/statisticsPivot?${params}`);
	}

	@computed get showStatisticsPivot() {
		return this.userOptions ? this.userOptions["pivot"]?.showStatisticsPivot : false;
	}

	@computed get showStatisticsPivotBeforeEnableSensitivity() {
		return _.get(this.userOptions, ['pivot', 'showStatisticsPivotBeforeEnableSensitivity'], this.showStatisticsPivot);
	}

	@action toggleStatistics = async () => {
		const isStatisticsEnabled = !this.showStatisticsPivot;

		this.isUpdatingStatistics = true;

		if (isStatisticsEnabled && (this.statistics == null || this.statistics.length == 0))
			await this.setStatistics(this.defaultStatistics);
		else
			await this.setStatistics(this.statistics);

		await this.loadMetadata({statisticspivot: isStatisticsEnabled});

		// Set new value to trigger updates
		await this.updateUserOptions("pivot", {showStatisticsPivot: isStatisticsEnabled});

		this.isUpdatingStatistics = false;
	}
	
	@action saveShowStatisticsPivotBeforeEnableSensitivity = async () => {
		await this.updateUserOptions('pivot', {
			showStatisticsPivotBeforeEnableSensitivity: this.showStatisticsPivot
		});
	}

	@computed get statisticsKey() {
		return this.showStatisticsPivot.toString() + this.statisticsStateKey;
	}

	@action getSensitivityOptions = () => {
		return xhr.get<Sensitivity>(`${queryStore.apiUrlFor(this.id)}/result/sensitivityView`).then(data => {
			this.sensitivity = data;
		});
	}

	@action getSensitivityColumn = (columnIndex) => {
		return xhr.post(`${queryStore.apiUrlFor(this.id)}/result/sensitivityView/column`, { columnIndex }).then((data : any) => {
			this.sensitivity.columnIndex = columnIndex;
			this.sensitivity.unshiftedMean = data.mean;
			this.sensitivity.unshiftedStandardDeviation = data.standardDeviation;
		});
	}

	@action runSensitivity = (mean, standardDeviation) => {
		return xhr.post(`${queryStore.apiUrlFor(this.id)}/result/sensitivityView/apply`, {
			mean,
			standardDeviation
		}).then(({ error, success = false }) => {
			if (success) {
				this.sensitivity.shiftedMean = mean;
				this.sensitivity.shiftedStandardDeviation = standardDeviation;
			} else {
				// possible errors: "extended solve limit", "shift outer solve limit", "shift solve numerical error""
				site.raiseError(new Error(`Unable to solve for shited mean / standard deviation. [${error}]`), 'query');
			}
		});
	}

	@computed get userOptions() {
		return this.descriptor && this.descriptor.userOptions;
	}

	@action updateUserOptions = async (view: string, userOptions: QueryViewUserOptions) => {
		var replace = false;
		if (!this.descriptor.userOptions) {
			this.descriptor.userOptions = {}
			replace                     = true;
		}

		this.descriptor.userOptions[view] = Object.assign(this.descriptor.userOptions[view] || {}, userOptions);

		await omdb.updatePartial(Query.ObjectType, this.id, replace ? {'result.userOptions': this.descriptor.userOptions} : {[`result.userOptions.${view}`]: userOptions})
	}
}
