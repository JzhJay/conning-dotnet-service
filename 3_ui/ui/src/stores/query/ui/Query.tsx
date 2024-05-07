import {LoadingStatusMessage} from 'components';
import type {ArrangementOperation, QueryState, QuerySave, JuliaSimulation} from '../'
import {buildURL, BaseEventSource, waitUntil} from 'utility';
import {
	computed,
	observable,
	action,
	runInAction,
	when,
	override,
	makeObservable,
} from 'mobx';
import type {UserId, JuliaUser, SimulationGuid} from 'stores';
import {
	queryResultStore,
	queryStore,
	routing,
	user,
	settings,
	xhr,
	site,
	QueryResult,
	reportStore,
	mobx,
	utility, ObjectNameChecker, OmdbUserTagValue, i18n, simulationStore
} from 'stores';
import * as julia from '../JuliaModels';
import {QueryAxisWrapper, VariablesWrapper, StatisticsWrapper } from './wrappers';
import type {QueryViewAvailability} from '../JuliaModels';
import * as bp from '@blueprintjs/core';
import {Analytics} from 'client';
import { ProgressStepMessage } from '../../../components/system/Progress/ProgressStepMessage';
import {ServerStatus} from '../../../components/system/ExpireDialog/ExpireDialog';

export type QueryGuid = string;

export interface QueryEventSourceData {
	hasResult?: boolean;
	hasSession?: boolean;
	isRunning?: boolean;
	cancelled?: boolean;
	hasError?: boolean;
	serverStatus?: ServerStatus;

	progress?: { [name: string]: ProgressStepMessage };
	reset?: boolean;
}

export interface QueryPage {
	view: string;
	part?: string;
	clause?: number;
	title: string;
	enabled: boolean;
	id: string;
}

export class QueryDescriptor implements julia.JuliaQueryDescriptor {
	@observable lastProgressLogMessage: string = '';
	@observable isUseCaseQuery = false;

	constructor(query?: julia.JuliaQueryDescriptor) {
        makeObservable(this);
        if (query['id']) {
			this._id = query['id'];
			delete query['id'];
		}

        this.adjustJuliaSimulationsIds(query);

        Object.assign(this, query);

        if (query.isRunning) {
			this.initEventSource();
		}

        queryStore.descriptors.set(this.id, this);
    }

	_toDispose = [];

	adjustJuliaSimulationsIds(query) {
		query.simulations = query.simulations.map((s: any) => ({_id: s.id, ...s}));  // Julia renames _id to id
	}

	get apiUrl() {
		return queryStore.apiUrlFor(this.id);
	}

	get clientUrl() {
		return queryStore.clientUrlFor(this.id);
	}

	get eventSourceUrl() {
		return `${this.apiUrl}/status?sessionId=${this.sessionId}&${user.VALIDATION_ID}=${user.validationId}&accessToken=${user.accessToken}`;
	}

	@observable simulations: Array<JuliaSimulation> = [];

	/*
	@computed get totalVariables() {
		return _.sum(this.simulations.map(s  => s.variables));
	}*/

	@computed get CSVDownloadLinkUrl() {
		let url = xhr.createAuthUrl(buildURL(`${this.apiUrl}/result/raw/csv`, {statisticspivot: null, enabled: this.queryResult.showStatisticsPivot}), true)
		let separators: any = utility.getCsvSeparators(user.region);
		separators = separators ? JSON.stringify(separators) : null;
		return url + `&separators=${separators}`;
	}

	@computed get XLSXDownloadLinkUrl() {
		return xhr.createAuthUrl(buildURL(`${this.apiUrl}/result/raw/xlsx`, {statisticspivot: null, enabled: this.queryResult.showStatisticsPivot}), true);
	}

	@computed get correlationCSVDownloadLinkUrl() {
		let url = xhr.createAuthUrl(`${QueryResult.apiUrlFor(this.id)}/correlations/csv`);
		let separators: any = utility.getCsvSeparators(user.region);
		separators = separators ? JSON.stringify(separators) : null;
		return url + `&separators=${separators}`;
	}

	@computed get correlationXLSXDownloadLinkUrl() {
		return xhr.createAuthUrl(`${QueryResult.apiUrlFor(this.id)}/correlations/xlsx`)
	}

	routeFor = (view?: string) => {
		return routing.routeFor.query(this.id, view);
	}

	@computed
	get reportQueries() {
		return _.flatMap(mobx.values(reportStore.loadedReports).map(r => r.querySlots.filter(q => q.queryId == this.id)));
	}

	/**
	 * Returns a url that can be used with links to correctly authenticate requests.
	 * This link provides the validation id for the JWT which should be sent in the header(cookie) to the server
	 * @returns {string}
	 */
	get definitionLinkUrl() {
		return xhr.createAuthUrl(`${this.apiUrl}/queryDefinition.json`)
	}

	@observable availableViews: QueryViewAvailability[] = [];

	_id: QueryGuid;
	get id() { return this._id; }

	@observable status?: 'running' | 'duplicating' | 'creating' | 'resetting' | 'deleting';

	@observable isRunning = false;
	@observable cancelled = false;
	@observable isLoading = false;
	@observable busy      = false;
	@observable name: string;
	@observable createdTime;
	@observable modifiedTime;
	@observable hasResult?: boolean;
	@observable hasSession?: boolean;
	@observable variables?: number;
	@observable serverStatus: ServerStatus = ServerStatus.notInitialized;
	@observable isReconnecting;
	@observable userTagValues: OmdbUserTagValue[];
	@observable comments: string;
	createdBy: UserId;
	sessionId: string;
	simulationInputsVersions: Array<{id: string, version: number}>;

	get createdByUser(): JuliaUser {
		return user.users.get(this.createdBy)
	}

	@observable querySave?: QuerySave;

	@action startSession = async () => {
		this.isStartingSession = true;
		await queryStore.startQuerySession(this.id);
		this.isStartingSession = false;
	}

	@computed
	get isActivePage() {
		return routing.isActive(this.clientUrl)
	}

	@computed get simulationIds() {
		return this.simulations.map(s => s._id)
	}

	// @computed
	// get simulations() {
	// 	var result                   = [];
	// 	const {simulationIds}        = this;
	// 	const {simulations, loading} = simulationStore;
	//
	// 	if (!_.isEmpty(simulationIds)) {
	// 		for (var id of simulationIds) {
	// 			var sim = simulations.get(id);
	//
	// 			if (!sim && !loading) {
	// 				setTimeout(() => simulationStore.loadDescriptor(id), 10);
	// 			}
	// 		}
	// 	}
	// 	return !this.simulationIds ? [] :
	// 	       this.simulationIds.map(id => simulationStore.simulations.get(id))
	// 		       .filter(sim => sim);  // Only get sims that we know about
	// }

	@computed
	get queryResult() {
		return this.hasResult ? queryResultStore.loadIfNeeded(this.id) : null;
	}

	async initializeQuerySession() {
		if(!this.sessionId){
			await this.sessionExtend();
			// Remove any existing event source and replace with a new one that has this session ID.
			this.eventSource && this.eventSource.dispose();
			this.eventSource = null;
			this.initEventSource();
		}
		return this;
	}

	@action getQuerySave = (): Promise<QuerySave> => {
		return xhr.get(`${this.apiUrl}/queryDefinition.json`);

	}

	downloadQueryDefinition = async () => {
		await utility.downloadFile(this.definitionLinkUrl);
	}

	exportVariableList = async (with_ampersand: boolean) => {
		try {
			site.busy = true;
			await utility.downloadFile(xhr.createAuthUrl(`${this.apiUrl}/export-variables/text${with_ampersand ? "?with-ampersand" : ""}`));
		}
		finally {
			site.busy = false;
		}
	}

	batchExportVariables = async () => {
		try {
			site.busy = true;
			await utility.downloadFile(xhr.createAuthUrl(`${this.apiUrl}/export-variables/batch`));
		}
		finally {
			site.busy = false;
		}
	}

	reset = () => {
		// Cannot reset query descriptor
	}

	@observable isStartingSession = false;

	duplicate = () => {
		this.status = 'duplicating';
		// runInAction: Duplicate query
		return runInAction(async () => {
			Analytics.event({category: 'Query', action: `duplicate(${this.id})`})
			try {
				const newId = await this.duplicateWithoutSession();
				return await queryStore.startQuerySession(newId);
			}
			finally {
				this.busy   = false;
				this.status = null;
			}
		})
	}

	duplicateWithoutSession = async () => {
		const newName = await new ObjectNameChecker({nameForCopyObject: true}).getAvailableName(Query.ObjectType, this.name);
		return xhr.post<string>(`${this.apiUrl}/clone?name=${encodeURIComponent(newName)}`);
	}

	get isFavorite() {
		return settings.favorites.query.indexOf(this.id) != -1
	}

	set isFavorite(value: boolean) {
		if (!value) {
			settings.favorites.query = settings.favorites.query.filter(id => id != this.id)
		}
		else {
			settings.favorites.query = [...settings.favorites.query, this.id];
		}
	}

	@computed
	get progress() {
		return this.eventSource && this.progressMap;
	}

	get variablesPanel() {
		return mobx.values((this as any)._variables.clauses).filter(c => c.id !== 0).map(c => c.panel);
	}

	@observable renamingFrom: 'sidebar' | 'header' | null = null;
	@action cancelRename                                  = () => this.renamingFrom = null;
	@action confirmRename = async (value: string) => {
		await this.rename(value);
		this.renamingFrom = null;
	}

	@action rename = async (name: string) => {
		this.busy = true;

		const original = this.name;

		try {
			this.name = name;
			await queryStore.rename(this, name);
		}
		catch (err) {
			this.name = original;
			throw err;
		}
		finally {
			this.busy = false;
		}
	}

	delete = async (force = false) => {
		if (force || (await site.confirm(i18n.common.MESSAGE.WITH_VARIABLES.DELETE_CONFIRMATION(Query.OBJECT_NAME_SINGLE, this.name)))) {
			this.busy   = true;
			this.status = 'deleting';
			this.eventSource && this.eventSource.dispose();
			this.eventSource = null;
			try {
				return queryStore.deleteQueryDescriptor(this.id);
			}
			finally {
				this.status = null;
				this.busy   = false;
			}
		}
	}

	get icon() {
		return "search"
	}

	@observable desiredView = 'pivot'; // Todo - this needs to go on the descriptor

	@observable loadingStatusMessages: LoadingStatusMessage[] = [];

	@action initEventSource = () => {
		this.loadingStatusMessages = [];
		if (!this.eventSource) {
			this.eventSource = new BaseEventSource({
				url: this.eventSourceUrl,
				onConnect: this.onEventSourceConnect,
				onMessage: this.onRecieveEventSourceMessage,
				onError: () => {
					this.eventSource.setEventSourceUrl(this.eventSourceUrl);
				}
			});
		}
	}

	@observable progressMap = observable.map<string, ProgressStepMessage>();
	onEventSourceConnect = ()=> {
		this.progressMap.clear();
	}

	onRecieveEventSourceMessage = async (event) => {
		const query = this;
		const data: QueryEventSourceData = JSON.parse(event.data);
		//console.log(`Query SSE Message - ${query.id}:`, data);
		// runInAction: Process SSE message
		data && runInAction( action(async () => {
			try {
				const { progress, reset, ...state } = data;

				this.loadingStatusMessages.push(data as any);

				// console.log(data);

				Object.assign(query, state);

				if (!reset && state.hasResult) {
					queryResultStore.loadResult(query.id);
				}

				if (reset) {
					this.progressMap.clear();
				}

				if (state.hasError) {
					// SSE says hasError -> regetQuery -> Error will be returned and state reset
					// Todo - this flow will change per Keith
					const error      = new Error(`Error during SSE with query ${query.id}`);
					const juliaError = await queryStore.getQuery(query.id, true, true) as any;
					console.error(juliaError);
					query.hasError = false;
					throw juliaError;
				}

				// Ignore 'after the fact' messages from runQuery
				if (progress && !query.hasResult) {
					_.keys(progress).forEach(key => {
						const message = progress[key];
						if (!this.progressMap.has(key)) {
							this.progressMap.set(key, new ProgressStepMessage(message));
						}
						else {
							const pm = this.progressMap.get(key);
							Object.assign(pm, _.omit(message, 'log'));
							if (message && message.log) {
								pm.log.push(...message.log);
								this.lastProgressLogMessage = _.last(message.log);
							}
						}
					})
				}

				if (data.serverStatus) {
					query.loadingStatusMessages.push({type:"status", data: `${data.serverStatus}`});
					if (data.serverStatus === ServerStatus.closed) {
						this.eventSource.dispose();
					}
				}
			}
			catch (err) {
				site.raiseError(err);
			}
		}));
	}

	@observable hasError: boolean;
	@observable errorMessage: string;
	@observable eventSource: BaseEventSource;

	run = (): Promise<QueryResult> => {
		return this._run();
	}

	_run = (): Promise<QueryResult> => {
		//const existingResults = queryResultStore.descriptors.values().filter(d => d.descriptor.query.id == this.id);

		this.cancelled = false;
		this.isRunning = true;
		this.status    = 'running';
		this.busy      = true;

		// runInAction: RunQuery and produce a result
		return runInAction(async () => {
			try {
				Analytics.event({category: 'Query', action: `run(${this.id})`})
				this.hasResult = false;
				this.hasError = false;
				this.errorMessage = null;
				const queryResultId = await xhr.post<string>(
					`${this.apiUrl}/result`,
					{timeout: settings.query.runQueryTimeout}, {allowRetry: true}
				);

				queryResultStore.loadedResults.delete(this.id);

				// this.createEventSource();

				await waitUntil(() => (!this.isRunning && this.hasResult) || this.cancelled || this.hasError, settings.query.runQueryTimeout * 10);

				if (this instanceof Query)
					this.navigateToPage(_.last(this.pages));
				else if (routing.isActive(this.clientUrl)) {
					routing.push(routing.routeFor.query(this.id, 'pivot'));
				}

				if (this.hasError) {
					// Retrieve the error
					await queryStore.getQuery(this.id, true);
				}

				if (this.hasResult) {
					let queryResult: QueryResult;
					queryResult = await queryResultStore.loadResult(this.id);

					return queryResult;
				}

				const errorMsgString = 'Query stopped running without creating a result';
				this.errorMessage = errorMsgString;
				throw new Error(errorMsgString);

				// let queryDescr = await queryStore.getQueryDescriptor(this.id, true);
				//
				// // Poll the query descriptor until 'is-running' is false
				// while (queryDescr.isRunning ) {
				// 	console.trace('Polling for run-query result...', this)
				// 	await utility.sleep(1000)
				//
				// 	queryDescr = await queryStore.getQueryDescriptor(this.id, true);
				// }
				//
				// if (!queryDescr.hasResult) {
				// 	throw new Error('Query has finished running, but no result was generated');
				// }
				//
				// this.hasResult = true;
				//
				// let queryResult = await queryResultStore.loadResult(this.id);
				// while (!queryResult.descriptor.ready) {
				// 	console.trace('Polling for ready query result...', this)
				// 	await utility.sleep(1000)
				//
				// 	queryResult = await queryResultStore.loadResult(this.id, true);
				// }
				//
				// if (routing.isActive(queryStore.browserUrl())) {
				// 	queryResult.navigateTo();
				// }

				//return queryResult;
			}
			catch (err) {
				site.raiseError(err);
			}
			finally {
				this.isRunning = false;
				this.status    = null;
				this.busy      = false;
			}
		})
	}

	cancel = async () => {
		return xhr.post<string>(`${this.apiUrl}/cancel`, null, {allowRetry: true});
	}

	navigateTo = (view?: string) => {
		return routing.push(this.routeFor(view));
	}

	onContextMenu = (e: React.MouseEvent<HTMLElement>, location: "sidebar" | "header" = "sidebar") => {
		const {navigateTo, busy, name} = this;
		const query                    = this instanceof Query && this as Query;

		bp.ContextMenu.show(
			<bp.Menu>
				<bp.MenuItem text={`Open '${name}'`} icon="document-open" onClick={() => navigateTo()}/>
				<bp.MenuDivider/>

				{query &&
				<bp.MenuItem text={`Run Query`} icon="play" disabled={query._variables.selected == 0}
				             onClick={() => query.run()}/>}
				{query &&
				<bp.MenuItem text="Reset Query" disabled={busy} icon="step-backward" onClick={() => query.reset()}/>}
				{query && <bp.MenuDivider/>}

				<bp.MenuItem text
					             ="Rename" icon="edit" onClick={() => this.renamingFrom = location}/>
				<bp.MenuDivider/>
				<bp.MenuItem icon="trash" text="Delete" onClick={() => this.delete()}/>

			</bp.Menu>, {left: e.clientX - 8, top: e.clientY - 8});

		e.preventDefault();
	}

	get associatedQueryResults(): QueryResult[] {
		return queryResultStore.getAssociatedQueryResults(this.id);
	}

	get isSession() {
		return this instanceof Query;
	}

	@action async switchSimulations(sims: SimulationGuid[], autoPrestartSession?: boolean) {
		const result = await xhr.putUntilSuccess<julia.JuliaQuery>(`${this.apiUrl}`, {hasSession: true, simulationIds: sims}, "transactionId");
		delete result["id"];
		const hasMissingVariables = () => {
			const currentSimulationVariables       = _.get(this, ['state', 'variables']);
			const currentSimulationAxesDescriptors = _.get(this, ['state', 'axes']);
			const newSimulationAxesDescriptors     = _.get(result, ['state', 'axes']);

			if (currentSimulationVariables && currentSimulationAxesDescriptors && newSimulationAxesDescriptors) {
				for (let clause of currentSimulationVariables.clauses) {
					for (let axis of clause.axes) {
						const axisDescriptor   = currentSimulationAxesDescriptors.find(a => a.id == axis.id);
						const currentAxisLabel = axisDescriptor?.label;
						for (let selectedCoordinateID of axis.selected) {
							const selectedCoordinateLabel = axisDescriptor.coordinates.find(c => c.id == selectedCoordinateID)?.label;

							// Find the selected axis and coordinate in the new simulation
							const newSimulationAxis = newSimulationAxesDescriptors.find(a => a.label == currentAxisLabel);
							if (newSimulationAxis && newSimulationAxis.coordinates.find(c => c.label == selectedCoordinateLabel)) {
								continue; // Found matching coordinate
							}

							// New simulation is missing axis or coordinate
							return true;
						}
					}
				}
			}
			return false;
		}

		// Warn the user if there are selected variables missing from the new simulation.
		if (hasMissingVariables())
			site.toaster.show({message: 'Some selected variables are not available in the specified simulation output.', intent: bp.Intent.WARNING, timeout: 0});

		this.adjustJuliaSimulationsIds(result);
		Object.assign(this, result);
		return result;
	}

	async sessionExtend() {
		try {
			site.busy = true;
			this.sessionId = await xhr.post<string>(this.apiUrl + '/extend-session', {sessionId: this.sessionId}, {allowRetry: true});
		}
		finally {
			site.busy = false;
		}
	}

	async sessionReconnect() {
		try {
			site.busy = true;
			this.isReconnecting = true;
			this.sessionId = "";
			this.eventSource.dispose();
			this.eventSource = null;
			await this.sessionExtend();
			this.initEventSource();
			await when(() => this.serverStatus == ServerStatus.created); // Proceed after server is started so that subsequent request is less likely to timeout
			this.isReconnecting = false;
		}
		finally {
			site.busy = false;
		}
	}

	dispose = () => {
		this._toDispose.forEach(f => f());
		this.eventSource && this.eventSource.dispose();
		this.eventSource = null;
	}
}

export class Query extends QueryDescriptor {
	static ObjectType = "Query";
	static get OBJECT_NAME_SINGLE() { return i18n.intl.formatMessage({defaultMessage: "Query", description: "objectName - Query (single)"}) };
	static get OBJECT_NAME_MULTI() { return i18n.intl.formatMessage({defaultMessage: "Queries", description: "objectName - Query (multi)"}) };

	constructor(query?: julia.JuliaQuery) {
        super(query);

        makeObservable(this);

        if (query.state) {
			this.setupQueryFromJuliaState(query.state);
		}

		// Set current page based on urls query param
		runInAction(() => {
			const currentPage = this.pages.find(page => page.view == routing.query.view && page.part == routing.query.part && (_.toString(page.clause) || null) == routing.query.clause);

			if (currentPage != null)
				this._currentPageId = currentPage.id;
			else // if no page is found, use results page or query page
				this._currentPageId = routing.query.view != "query" && this.hasResult ? _.last(this.pages).id : this.pages[0].id;
		})

		this.setVariablesLayout(user.settings.query.shouldExpandVariables);

		simulationStore.bulkLoadDescriptors(this.simulationIds);

		// if (query.isRunning) {
        // 	this.createEventSource();
        // }
        // queryStore.querySessions.set(this.id, this);
    }

	@observable shouldExpandVariables = false;
	@observable _currentPageId = null;

	onNavigateToPage = null;
	updateURLFromNavigation = true;

	@action setVariablesLayout(shouldExpandVariables: boolean) {
		this.shouldExpandVariables = shouldExpandVariables === true;
		this.adjustCurrentPage();
	}

	lastResultView = "pivot";

	@action setupQueryFromJuliaState = (state: QueryState) => {
		this.availableViews = state.availableViews;

		this._variables && this._variables.dispose();
		this.statistics && this.statistics.dispose();
		this.arrangement && this.arrangement.dispose();

		this.axes.clear();

		state.axes.forEach(a => {
			const axis = new QueryAxisWrapper(a);
			this.axes.set(a.id.toString(), axis);
		});

		this._variables  = new VariablesWrapper(this, state.variables);
		this.statistics  = new StatisticsWrapper(this, state.statistics);
		this.arrangement = new ArrangementWrapper(this, state.arrangement);
	}

	@action invalidateQueryResult = () => {
		this.hasResult = false;
	}

	@observable axes = observable.map<string, QueryAxisWrapper>({});

	@observable showToolbar   = true;
	@action toggleShowToolbar = () => {
		this.showToolbar = !this.showToolbar
	}

	axisById = (id: number) => {
		const result = this.axes.get(id.toString());

		if (!result) {
//			console.error(`Unable to find axis with id '${id}' in axis list`, toJS(this.axes));
		}

		return result;
	}

	axisByLabel = (label: string) => {
		const result = this._axisByLabel[label];

		if (!result) {
			//		console.error(`Unable to find axis with label '${label}'`, toJS(this.axes));
		}

		return result;
	}

	@computed
	get _axisByLabel(): { [label: string]: QueryAxisWrapper } {
		let axisByLabel = {}

		mobx.values(this.axes).forEach((a: QueryAxisWrapper) => axisByLabel[a.label] = a);

		return axisByLabel;
	}

	axisByCode = (code: string) => {
		const result = this._axisByCode[code];
		return result;
	}

	@computed
	get _axisByCode(): { [code: string]: QueryAxisWrapper } {
		let axisByLabel = {}

		mobx.values(this.axes).forEach((a: QueryAxisWrapper) => axisByLabel[a.code] = a);

		return axisByLabel;
	}

	@computed
	get canRunQuery() {
		const {busy, isRunning, _variables} = this;

		return !busy && !isRunning && _variables && _variables.clauses && !_.some(Array.from(_variables.clauses.values()),
			c => c.hasAnyEmptyAxes) && _.every(this.simulations, sim => simulationStore.simulations.get(sim._id)?.status == "Complete")
	}

	run = async (): Promise<QueryResult> => {
		if (this._variables.selected < 1000 || (await site.confirm(`Are you sure you want to run the query with ${utility.numberWithCommas(this._variables.selected)} variables?`)))
			return this._run();
	}

	@action updateState = (state: julia.QueryState) => {
		Object.assign(this.arrangement, state.arrangement);
		Object.assign(this.statistics, state.statistics);
	}

	@observable _variables: VariablesWrapper;
	@observable statistics: StatisticsWrapper;
	@observable arrangement: ArrangementWrapper;

	// @action saveAs = (payload: { path: string, name: string }) => {
	// 	return xhr.post(`${this.apiUrl}/saveAs`, payload)
	// }

	// @observable undoQueue = observable.array<Function>([])
	// @observable redoQueue = observable.array<Function>([])
	//
	// undo = async () => {
	//
	// }

	@override async switchSimulations(sims: SimulationGuid[]) {
		const newState = await super.switchSimulations(sims);
		this.setupQueryFromJuliaState(newState.state);
		return newState;
	}

	reset = async (queryJson?: QuerySave) => {
		if (KARMA || queryJson || (await site.confirm('Reset query to initial state?'))) {
			this.busy   = true;
			!queryJson && (this.status = 'resetting');

			this.invalidateQueryResult();

			try {
				// const undoDefinition = await this.saveQueryDefinition();
				// this.undoQueue.push(() => {
				// 	console.log('Undo', undoDefinition)
				// })

				const state = await xhr.post<julia.QueryState>(`${this.apiUrl}/reset`, queryJson &&
					{queryDefinition: queryJson}, {allowRetry: true});

				// runInAction: Query state has been reset
				runInAction(() => {
					this._variables.initialize(state.variables);
					Object.assign(this.arrangement, state.arrangement);
					Object.assign(this.statistics, state.statistics);
				})
			}
			finally {
				this.status = null;
				this.busy   = false;
			}
		}
	}

	@computed get pages() : QueryPage[] {
		let pages = [];

		const addPage = (page) => {
			page.title = `${pages.length + 1}. ${page.title}`;
			page.id = `${page.view}.${page.part}.${page.clause}`;
			pages.push(page);
		}

		const pageName_variables = i18n.intl.formatMessage({defaultMessage: "Variables", description: "[Query] the query book's one of page name"});
		const pageName_variablesWithClause = (clause: number) => i18n.intl.formatMessage({defaultMessage: "Variables (Clause {clause})", description: "[Query] the query book's one of page name"}, {clause:clause});
		const pageName_configuration = i18n.intl.formatMessage({defaultMessage: "Configuration", description: "[Query] the query book's one of page name"});
		const pageName_result = i18n.intl.formatMessage({defaultMessage: "Result", description: "[Query] the query book's one of page name"});

		if (this.shouldExpandVariables) {
			const clauses = mobx.values(this._variables.clauses).filter(c => c.id !== 0);
			if (clauses.length == 1)
				addPage({view: "query", part: "variables", title: pageName_variables, clause: clauses[0].id, enabled: true});
			else
				clauses.forEach((clause, i) => addPage({view: "query", part: "variables", clause: clause.id, title: pageName_variablesWithClause(i+1), enabled: true}));

			addPage({view: "query", part: "specification", title: pageName_configuration, enabled: true});
		}
		else {
			addPage({view: "query", title: pageName_configuration, enabled: true});
		}

		addPage({view: "result", title: pageName_result, enabled: this.hasResult});

		return pages;
	}

	adjustCurrentPage() {
		// Resets the current page ID if its no longer valid
		if (this.currentPage == null) {
			this._currentPageId = this.pages[0].id;
		}
	}

	@computed get currentPage() : QueryPage {
		return this.pages.find(page => page.id == this._currentPageId)
	}

	@computed get previousPage() {
		const pageIndex = this.pages.findIndex(page => page.id == this.currentPage.id);
		return pageIndex > 0 && this.pages[pageIndex - 1].enabled ? this.pages[pageIndex - 1] : null;
	}

	@computed get nextPage() {
		const pageIndex = this.pages.findIndex(page => page.id == this.currentPage.id);
		return pageIndex < this.pages.length - 1 && this.pages[pageIndex + 1].enabled ? this.pages[pageIndex + 1] : null;
	}

	@computed get canNavigateLeft() {
		return this.previousPage != null;
	}

	@computed get canNavigateRight() {
		return this.nextPage != null;
	}

	@action navigateToPrevious = () => {
		this.previousPage && this.navigateToPage(this.previousPage);
	}

	@action navigateToNext = () => {
		this.nextPage && this.navigateToPage(this.nextPage);
	}

	@action navigateToPage = (page: QueryPage) => {
		const toQuery = page.view == "query";
		if (toQuery && !this.isQueryPage && routing.query.view)
			this.lastResultView = routing.query.view as string;

		if (this.updateURLFromNavigation) {
			const url = buildURL(this.clientUrl,
				{view: toQuery ? "query" : this.lastResultView},
				{part: page.part, enabled: page.part != null},
				{clause: page.clause, enabled: page.clause != null}
			);

			routing.push(url);
		}
		this._currentPageId = page.id;
		this.onNavigateToPage && this.onNavigateToPage(page);
	}

	get isQueryPage() {
		return routing.query.view == "query" || (routing.query.view == null && !this.hasResult);
	}

	get isVariablesPage() {
		return this.shouldExpandVariables && this.currentPage.part == "variables";
	}
}

class ArrangementWrapper implements julia.Arrangement {
	@observable rows: number[];
	@observable columns: number[];

	constructor(private query: Query, arrangement: julia.Arrangement) {
        makeObservable(this);
        this.rows    = arrangement.rows;
        this.columns = arrangement.columns;
    }

	dispose = () => {

	}

	private urlFor_Arrangement() {
		return `${this.query.apiUrl}/arrangement`
	}

	@action updateArrangement = (operation: ArrangementOperation, axis?: number, targetAxis?: number) => {
		this.query.invalidateQueryResult();

		// Optimistically update
		let rows    = this.rows.slice();
		let columns = this.columns.slice();

		switch (operation) {
			case 'Columns': {
				columns = [...columns, ...rows];
				rows    = [];

				break;
			}
			case 'Rows': {
				rows    = [...rows, ...columns];
				columns = [];

				break;
			}
			case 'Transpose': {
				const temp = rows;
				rows       = columns;
				columns    = temp;
				break;
			}

			case 'FirstRow':
			case 'FirstColumn':
			case 'MoveAfter': {
				columns = columns.filter(a => a !== axis);
				rows    = rows.filter(a => a !== axis);

				if (operation === 'FirstRow') {
					rows = [axis, ...rows];
				}
				else if (operation === 'FirstColumn') {
					columns = [axis, ...columns];
				}
				else {
					// Find the axis to move after
					const insertIndex = rows.indexOf(targetAxis);
					if (insertIndex !== -1) {
						rows.splice(insertIndex + 1, 0, axis);
					}
					else {
						columns.splice(columns.indexOf(targetAxis) + 1, 0, axis);
					}
				}
				break;
			}
		}

		this.rows            = rows;
		this.columns         = columns;
		this.query.hasResult = false;

		return xhr.post<julia.QueryState>(
			this.urlFor_Arrangement(),
			{operation, axis, targetAxis}
		)
			.then(response => {
				const {arrangement} = response;

				// runInAction: Set new arrangement
				return runInAction(() => {
					this.rows    = arrangement.rows;
					this.columns = arrangement.columns;
				})
			});
	}

	@action flip = () => {
		this.updateArrangement('Transpose');
	}

	@action allToRows = () => {
		this.updateArrangement('Rows');
	}

	@action allToColumns = () => {
		this.updateArrangement('Columns');
	}

	// @action reset = () => {
	// 	this.updateArrangement('Columns');
	// }
}
