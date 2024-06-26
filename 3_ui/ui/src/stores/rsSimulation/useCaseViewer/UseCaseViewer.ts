import {ApiPage} from 'stores/book/model';
import { RSSimulation } from "../RSSimulation";
import {Book} from 'stores/book/Book';
import {routing, xhr, UserOptions, rsSimulationStore} from 'stores';
import {IAPIUseCase, IViewDefinitions} from 'stores/rsSimulation/useCaseViewer/models';
import {action, flow, makeObservable, observable, runInAction, IReactionDisposer, when, reaction} from 'mobx';
import {BookPage} from 'stores/book/BookPage';

interface QueryRunProgress {
	title: string;
	querySpecificationFileName: string;
	lastQueryProgressLogMessage: string;
	isComplete: boolean;
	numerator: number;
	message: string;
}

export class UseCaseViewer {
	@observable book: Book;
	viewDefinitions: IViewDefinitions;
	@observable queriesProgress: { [queryId: string]: QueryRunProgress } = {};
	@observable lastQueriesProgressUpdate = Date.now();
	@observable areQueriesRunning = false;
	@observable areQueriesComplete = false;
	@observable isLoaded = false;
	_disposes :IReactionDisposer[] = [];

	defaultPageConfig: ApiPage = {additionalControls: `{"scrollMode":true, "showViewToolbars": null}`};
	defaultViewConfig: {[key:string]: any} = {"displayMode":"verbose","verboseMode":true};

	constructor(public rsSimulation: RSSimulation) {
		makeObservable(this);
	}

	get title() {
		return _.find(rsSimulationStore.useCases, uc => uc.name == this.rsSimulation.useCase).title;
	}

	@flow.bound
	*loadPages() {
		const { rsSimulation } = this;
		const apiUseCase = yield xhr.get<IAPIUseCase>(`${rsSimulation.apiUrl}/use-case/pages`);
		const { viewDefinitions, pages, queries, areQueriesComplete } = apiUseCase;
		this.viewDefinitions = viewDefinitions;
		this.book = new Book(
			() => _.clone(this.defaultViewConfig),
			this.availableViews,
			this.sendPageUpdate.bind(this),
			() => true,
			rsSimulation.clientUrl
		);

		this.book.defaultPageConfig = this.defaultPageConfig

		_.forEach(pages, page => {
			_.forEach(_.keys(this.defaultPageConfig), k => {
				if (!_.has(page, k) || page[k] == null || page[k] === "" ) {
					page[k] = this.defaultPageConfig[k];
				}
			})
			this.book.pages.push(new BookPage(this.book, page))
		});

		if (this.book.pages?.length > 0) {
			const routingPage = _.toString(routing.query.page);
			this.book.currentPageNumber = Math.max((parseInt(routingPage) - 1) || 0, 0);
		}
		
		this.areQueriesComplete = areQueriesComplete;
		if (this.rsSimulation.isComplete) {
			yield this.setQueries(queries);
		}

		this.isLoaded = true;
	}

	get availableViews() {
		let views = {};
		const addViews = (definitionSection, isInput) => {
			for (const def of definitionSection) {
				views[def.title] = {name: def.title, label: def.title, isInput: isInput, height: !isInput && def.queryView != "Pivot" ? .3 : null}
			}
		};

		addViews(this.viewDefinitions.inputs, true);
		addViews(this.viewDefinitions.outputs, false);

		return views;
	}

	// required to work with BookValidationSidebar
	get validationMessages() {
		return this.rsSimulation.validationMessages;
	}

	// required to work with BookValidationSidebar
	get views() {
		return this.availableViews;
	}

	async sendPageUpdate(pages) {
		const res = await xhr.post(this.rsSimulation.apiUrl + '/use-case/pages', pages);
		this.book.currentPage && runInAction(() => Object.assign(this.book.currentPage, (res as any)[this.book.currentPageNumber]));
		return res;
	}

	setQueriesToViewDefinitions(queries) {
		_.forOwn(queries, (queryId, querySpecificationFile) => {
			const output = this.viewDefinitions.outputs.find(o => o.querySpecificationFile === querySpecificationFile);
			if (output) {
				output.queryID = queryId;
			}
		});
	}

	isQueryComplete(queryProgress: QueryRunProgress) {
		return queryProgress.isComplete;
	}

	getInitialQueryProgress = action((queryId, querySpecificationFile) => {
		const output = this.viewDefinitions.outputs.find(o => o.querySpecificationFile === querySpecificationFile);
		const queryProgress = observable({
			title: output?.title || querySpecificationFile,
			querySpecificationFileName: querySpecificationFile,
			lastQueryProgressLogMessage: null,
			isComplete: false,
			numerator: 20,
			message: 'Query Session is initializing ...'
		});
		this.queriesProgress[queryId] = queryProgress;
		this._disposes.push(reaction(
			() => queryProgress,
			() => this.lastQueriesProgressUpdate = Date.now(),
			{ fireImmediately: true }));
		return queryProgress;
	})

	@flow.bound
	*setQueries(queries) {
		this.setQueriesToViewDefinitions(queries);
		if (this.areQueriesComplete) {
			yield Promise.all(_.map(queries, (queryId, querySpecificationFile) => this.initializeQuery(queryId, querySpecificationFile,false)));
			this.closeQueryProgress();
		} else {
			_.forOwn(queries, (queryId, querySpecificationFile) => {
				if (!this.queriesProgress[queryId]) {
					this.getInitialQueryProgress(queryId, querySpecificationFile);
				}
			});
		}		
	}

	@flow.bound
	*initializeQuery(queryId: string, querySpecificationFile: string, isNeedToUpdateProgress: boolean = true) {
		// let query = queryStore.querySessions.has(queryId) ? queryStore.querySessions.get(queryId) : queryStore.descriptors.get(queryId);
		// if (!query) {
		// 	query = yield queryStore.getQuery(queryId);
		// }

		if (isNeedToUpdateProgress) {
			let queryProgress = this.queriesProgress[queryId];
			if (!queryProgress) {
				queryProgress = this.getInitialQueryProgress(queryId, querySpecificationFile);
			}
	
			//query.isUseCaseQuery = true;
			//queryProgress.query = query;

			// await query.initializeQuerySession();
			queryProgress.numerator += 20;
			queryProgress.message = 'Running ...';

			this._disposes.push(reaction(
				() => queryProgress.lastQueryProgressLogMessage,
				action(() => {
					const newNumerator = queryProgress.numerator + 20;
					if (newNumerator < 100) {
						queryProgress.numerator = newNumerator;
					}
					queryProgress.message = queryProgress.lastQueryProgressLogMessage;
				})
			), when(
				() => this.isQueryComplete(queryProgress),
				() => this.setQueryProgressComplete(queryProgress)
			));
		}
	}

	setQueryProgressComplete = action((queryProgress: QueryRunProgress, completeTimeout = 30_000) => {
		queryProgress.numerator = 100;
		queryProgress.message = 'Query result generated.';

		const queryProgresses = _.values(this.queriesProgress);
		if (queryProgresses.length == this.viewDefinitions.outputs.length && queryProgresses.every(this.isQueryComplete)) {
			this._disposes.push(when(
				() => this.areQueriesComplete,
				this.closeQueryProgress,
				{ timeout: completeTimeout }));
		}
	})

	closeQueryProgress = action(() => {
		this.areQueriesRunning = false;
		this.queriesProgress = {};
	});

	cleanup = () => {
		this._disposes.forEach(f => f());
		//_.values(this.queriesProgress).forEach(q => q.query.dispose());
	}
}