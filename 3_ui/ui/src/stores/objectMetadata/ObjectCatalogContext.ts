import * as bp from '@blueprintjs/core';
import type {ITreeNode} from '@blueprintjs/core';
import {ObjectCatalogSearchModel} from 'components/system/ObjectCatalog/internal/ObjectCatalogSearchModel';
import type {IObservableArray} from 'mobx';
import {
    action,
    autorun,
    computed,
    isObservableArray,
    observable,
    ObservableMap,
    reaction,
    runInAction,
    toJS,
    makeObservable,
} from 'mobx';
import type {IObjectTypeDescriptor} from '../index';
import {
	apolloStore,
	DistinctTagValue,
	OmdbFolder,
	OmdbFolderItem,
	omdb,
	OmdbDistinctValue,
	site,
	user,
	IO, UserFile, ClimateRiskAnalysis
} from '../index';
import * as mobx from 'mobx'
import {QueryDescriptor, queryStore} from '../query';
import {JuliaSimulation, Simulation, simulationStore} from '../simulation';
import type {OmdbObjectType} from './OmdbObjectType';
import * as utility from 'utility';
import type {IRowIndices} from '@blueprintjs/table/lib/esm/common/grid';
import { lowerFirst } from 'lodash';
import { Subscription } from 'zen-observable-ts';

export interface FolderTreeNode extends bp.ITreeNode {
	folder?: OmdbFolder;
	isExpanded?: boolean;
	parent?: FolderTreeNode;
}

export interface FolderItemTreeNode extends bp.ITreeNode {
	parent?: FolderTreeNode;
	folderItem?: OmdbFolderItem;
}

export interface IObjectCatalogContext {
	objectTypes?: IObjectTypeDescriptor[];
	view?: string;
}

export interface IOmdbQueryResultRecord {
	__typename: string
}

export interface IOmdbQueryResult {
	//results?: Array<IOmdbQueryResultRecord & any>;
	results?: Array<IOmdbQueryResultRecord & any>;
	resultsRaw?: Array<any>;
	skipped: number;
	total: number;
	input: {
		limit: number;
		sortBy?: string;
		sortOrder?: string;
		searchText?: string;
		where?: any;
	}
}

const objectTypeConstructors = {
	Simulation: (data) => { return new Simulation(data); },
	InvestmentOptimization: (data) => { return new IO(data); },
	UserFile: (data) => new UserFile(data),
	ClimateRiskAnalysis: (data) => new ClimateRiskAnalysis(data),
	Query:      (data) => {
		const {_id} = data;
		if (queryStore.querySessions.has(_id)) {
			var qs = queryStore.querySessions.get(_id);
			Object.assign(qs, data);
			return qs;
		}
		else {
			if (_.isArray(data.simulations)) {
				data.simulations = data.simulations.map(s => _.isString(s) ? ({_id: s}) : s)
			}
			var qd = new QueryDescriptor(data);
			queryStore.descriptors.set(qd.id, qd);
			return qd;
		}
	}
}

const TABLE_PAD_ROWS = 15;

export class ObjectCatalogContext {
	querySubscription: Subscription;
	@observable tableViewRange: IRowIndices = null;
	@observable _view: 'table' | 'card' = 'card';
	@computed get view() { return this._view; }
	set view(v) { runInAction(() => this._view = v); }

	@observable isLoadingDistinct: boolean;
	favorites;
	hiddenFilters: string[] = [];
	searchModel: ObjectCatalogSearchModel;

	@computed get dirty() {
		return this.lastQueryResult && !_.isEmpty(this.lastQueryResult.input.where);
	}

	@computed get noDistinctValues() {
		const {distinctTagValues, allDistinctTagValues} = this;

		return distinctTagValues && _.flatMap(Array.from(distinctTagValues.values()), v => Array.from(v.values())).filter(v => v.distinct.length > 1).length == 0
		//_.flatMap(Array.from(allDistinctTagValues.values()), v => Array.from(v.values())).filter(v => v.distinct.length > 1).length == 0
	}

	@computed get selectedTagValuesObject() {
		const selectedTagValuesMap: Map<string, Array<string>> = toJS(this.selectedTagValues);
		return Array.from(selectedTagValuesMap.entries()).reduce((main, [key, value]) => ({...main, [key]: value}), {});
	}

	constructor(o: IObjectCatalogContext = {}) {
        makeObservable(this);
        Object.assign(this, o);
        this.searchModel = new ObjectCatalogSearchModel(this);
    }

	initialize = () => {
		if (this.initialized) throw new Error("Already initialized");

		this._toDispose.push(reaction(() => [user.settings.favorites.simulation, user.settings.favorites.query, user.settings.favorites.investmentOptimization, this.path], async () => {
			await this.runQuery();
		}));

		this._toDispose.push(
			autorun(async () => {
				const {error, distinctTagValuesError, isLoadingDistinct, loadedDistinct, pageResults, pagedIndex, selectedTagValuesObject, searchText, itemsPerPage, sortBy, sortOrder, isRunningQuery, lastQueryResult: lqr, lastDistinctSearchText, distinctTagValues, view, tableViewRange, extraWhere} = this;
				const {searchModel: {selectedResultFilter}} = this;
				if (!error && !isRunningQuery) {
					if (!lqr && loadedDistinct) { // Currently need to have distinct values loaded so we can check things so we can determine our where clause.  Todo: switch to using the query string directly
						// Run initial query'
						this.runQuery();
					}
					else if (lqr) {
						if (lqr.input.searchText != searchText) {
							// runInAction: Running query (debounced) due to search text change
							runInAction(() => {
								this._RerunQuery_debounced();
							})
						}
						else if (lqr.input.sortBy != sortBy ||
							(lqr.input.sortOrder != sortOrder && sortOrder != null && sortOrder != "") ||
							!_.isEqual(lqr.input.where, Object.assign({}, selectedTagValuesObject, selectedResultFilter, extraWhere))  ) {
							this.runQuery();
						}
						else if ((view == 'card' && itemsPerPage > lqr.input.limit) || (view == 'table' && tableViewRange)) {

							this._maybeRerunQuery();
						}
						else if (view == 'card') {
							if (pageResults && !_.isEmpty(pageResults)) {
								var firstMissing = pageResults.findIndex(pr => pr == null);
								if (firstMissing != -1) {
									// Need to fetch more data
									// Fetch to next page boundary?
									this.runQuery(false, firstMissing + pagedIndex)
								}
							}
						}
						// else {
						// 	this._maybeRerunQuery();
						// }
					}

				}

				if (!distinctTagValuesError) {
					if ((!loadedDistinct && !isLoadingDistinct) || lastDistinctSearchText != searchText ) {
						this._ReloadDistinct_debounced();
					}
					else if (this.lastDistinctInput && !_.isEqual(this.lastDistinctInput.where, Object.assign({}, selectedTagValuesObject, selectedResultFilter, extraWhere) )) {
						this._ReloadDistinct_debounced();
					}
				}
			}, {name: `Watch for changes (search text, sort order, sort column, selected catalog tag values) and re-query accordingly`}));

		this.initialized = true;
	}

	@observable initialized = false;

	dispose = () => {
		this._toDispose.forEach(f => f());
		this.querySubscription?.unsubscribe();
	}

	@observable error;
	@observable distinctTagValuesError;

	/** Folder Tree State **/
	@observable.ref focusedFolderTreeNode: ITreeNode;
	@observable selectedTreeNodes = observable.map<string | number, FolderTreeNode | FolderItemTreeNode | ITreeNode>({}, {deep: false});

	lastQueryRunInput = null;  // If the server doesn't echo our input we can get caught in an infinite loop

	public _maybeRerunQuery = () => {
		const {lastQueryResult: q, page, itemsPerPage, searchText, view, tableViewRange, queryResults, isRunningQuery} = this;

		//console.log(`START _maybeRerunQuery()`, {view, runningQuery, numResults: queryResults.size}, (view == 'table') ? toJS(tableViewRange) : {page, itemsPerPage},)

		if (isRunningQuery) {
			//console.log(`END _maybeRerunQuery() - Already running query`)
			return;
		}

		var params: any = {};
		var reset = searchText != q.input.searchText;
		if (view == 'table' && tableViewRange) {
			if (!q || q.total == 0) {
				return;
			}

			let {rowIndexStart, rowIndexEnd} = tableViewRange;
			if (reset) {
				params.skip = rowIndexStart - Math.round(TABLE_PAD_ROWS/2);
				params.limit = rowIndexEnd + Math.round(TABLE_PAD_ROWS/2);
			} else {
				if (!_.isNumber(rowIndexStart)) { rowIndexStart = 0; }
				if (!_.isNumber(rowIndexEnd)) { rowIndexEnd = rowIndexStart + (TABLE_PAD_ROWS*2); }
				rowIndexEnd = Math.min( rowIndexEnd , q.total);

				if (rowIndexStart > rowIndexEnd) {
					rowIndexStart = Math.max(0, rowIndexEnd - (TABLE_PAD_ROWS*2));
				}

				for ( rowIndexStart ; rowIndexStart < rowIndexEnd ; rowIndexStart++) {
					if(!queryResults.has(_.toString(rowIndexStart))) {
						break;
					}
				}

				if(rowIndexStart == rowIndexEnd && queryResults.has(_.toString(rowIndexStart))) {
					// console.log('skip: table rows already loaded');
					return;
				}

				for ( rowIndexEnd ; rowIndexEnd < q.total && (rowIndexEnd - rowIndexStart) < (TABLE_PAD_ROWS*2) ; rowIndexEnd++) {
					if(queryResults.has(_.toString(rowIndexEnd))) {
						break;
					}
				}

				params.skip = rowIndexStart;
				params.limit = rowIndexEnd - rowIndexStart;
			}

			params.skip = Math.max( 0, Math.min(q.total, params.skip));
			params.limit = Math.max( 0, Math.min(q.total - params.skip, params.limit));

			if (params.limit == 0) {
				// console.log('skip: all rows loaded');
				return;
			}
		}
		else {
			params.skip = page * itemsPerPage;
		}

		if (params.skip != null) {
			this.runQuery(reset, params.skip, params);
			//console.log(`END _maybeRerunQuery() - Asked to run query`)
		}
		else {
			//console.log(`END _maybeRerunQuery() - No Action`)
		}
	}

	@observable.shallow unfilteredSelectedTagValues = {};

	@observable lastDistinctSearchText = "";

	@observable _sortBy = "";
	@computed get sortBy() { return this._sortBy; }
	set sortBy(s) { runInAction(() => this._sortBy = s); }

	@observable _sortOrder: '' | 'asc' | 'desc' = "asc";
	@computed get sortOrder() { return this._sortOrder; }
	set sortOrder(s) { runInAction(() => this._sortOrder = s); }

	@computed get pagedIndex() {
		return this.page * this.itemsPerPage;

	}

	_toDispose = [];

	@observable searchText = "";
	@observable loadedDistinct = false;
	@observable distinctTagValues = observable.map<string, ObservableMap<string, DistinctTagValue>>();
	@observable allDistinctTagValues = observable.map<string, ObservableMap<string, DistinctTagValue>>();

	@observable objectTypes = observable.array<IObjectTypeDescriptor>([], {deep: false});
	@action replaceNewObjectTypes(descriptors: IObjectTypeDescriptor[]) {
		descriptors.forEach( ot => {
			ot.userTags && ot.userTags.forEach( ut => {
				if (ut.values && ut.values.length) {
					const isObservable = isObservableArray(ut.values);
					let utvs = isObservable ? ut.values.slice() : ut.values;
					utvs.sort((a, b) => {
						return (a.order || -1) - (b.order || -1)
					});
					isObservable && (ut.values as any).replace(utvs);
				}
			})
		})
		this.objectTypes.replace(descriptors);
	}

	/**
	 * tag -> value(s)
	 * Object type is not included
	 **/
	@observable selectedTagValues = observable.map<string, IObservableArray<string>>({}, {deep: true});
	@observable path = "";

	// @computed get selectedTagValues() {
	// 	var result: any = {};
	//
	// 	_.flatMap(Array.from(this.distinctTagValues.values()), v => Array.from(v.values())).filter(t => t.selected.length > 0).forEach(t => {
	// 		result[t.tagName] = t.selected;
	// 	})
	//
	// 	return result;
	// }

	@computed get queryParams() {
		var params: any = Object.assign({}, _.cloneDeep(this.selectedTagValuesObject), this.searchModel.selectedResultFilter);

		params.searchText = this.searchText;
		if (!_.isEmpty(this.sortBy)) {
			params.sortBy = this.sortBy;
		}

		if (!_.isEmpty(this.sortOrder)) {
			params.sortOrder = this.sortOrder;
		}

		return params;
	}

	@observable.shallow queryResults = observable.map<any>({}, {deep: false}); // RowIndex -> Instantiated Result
	@observable hasRunInitialQuery = false;
	@computed get isRunningQuery() { return this.outstandingRequests > 0; }

	@observable.shallow lastQueryResult: IOmdbQueryResult = null;

	@observable private _page = 0;
	@computed get page() { return this._page; }
	set page(numOfPage) { runInAction(() => this._page = numOfPage); }

	@computed get pageCount() {
		const {lastQueryResult, itemsPerPage} = this;
		if (!lastQueryResult) { return 0 }
		else { return lastQueryResult.total / itemsPerPage}
	}

	@observable.ref previousPageResults = [];

	extraWhere: any = {}

	@computed get pageResults() {
		const {page, itemsPerPage, queryResults, lastQueryResult, pagedIndex} = this;
		if (!lastQueryResult) { return null; }

		var end = Math.min(pagedIndex + itemsPerPage, lastQueryResult.total);
		var results = [];
		for (var i = (pagedIndex || 0); i < end; i++) {
			results.push(queryResults.get(i.toString()));
		}
		return results;
	}

	forceRunning = false;
	@observable outstandingRequests = 0;
	@action runQuery = async (replace = true, skip = -1, where = {}, forceCallback?: ()=>boolean ) => {
		if (this.isRunningQuery) {
			console.warn('Already running query');
			await(utility.waitUntil(() => !this.isRunningQuery, 120_000));
		}
		const force = forceCallback != null;
		if (force)
			this.forceRunning = true;

		this.error = null;

		// Todo - move all this into the react tree
		// if (this.querySubscription) {
		// 	this.querySubscription.unsubscribe();
		// }

		const {objectTypes, view, sortBy, sortOrder, itemsPerPage, queryParams, extraWhere, searchText, tableViewRange} = this;

		if (skip < 0) {
			if (view == 'card') {
				skip = this.pagedIndex;
			} else {
				skip = 0;
			}
		}

		const mergedWhere = _.omit(
			Object.assign({}, queryParams, where, extraWhere),
			['limit', 'skip', 'sortBy', 'sortOrder', 'itemsPerPage', 'searchText'])
		var params = {
			objectTypes: objectTypes.map(ot => ot.id),
			limit:       view == 'card' ? itemsPerPage : where["limit"] || TABLE_PAD_ROWS * 2,
			skip:        skip,
			sortBy:      sortBy,
			sortOrder:   sortOrder,
			searchText:  searchText,
			path:        this.path,
			favorites:   _.flatMap(this.objectTypes, o => {
				const favoriteId = lowerFirst(o.id);
				return user.settings.favorites[favoriteId];
			}),
			where:       mergedWhere
		};

		// If queryParams changes between queries then reset the skip since it might no longer be valid. e.g. In a list of 100 items a selection might yield a result < limit which makes page beyond the first invalid.
		if ( this.lastQueryResult && !_.isEqual(mergedWhere, this.lastQueryRunInput.where)) {
			this.page = 0;
			params.skip = 0;
		}

		if (_.isEqual(this.lastQueryRunInput, params) && !force) {
			// This could happen when runQuery is re-triggered while a request is in flight. If the params have not changed we can ignore this request. e.g. in this case
			// runQuery is called 3 times. First for the initial request, second for the new request, third when the first request completes (isRunningQuery = false) and lqr still doesn't match
			// current state since second request is still outstanding.
			// Note: This is very round about and it would be better if runQuery wasn't even called in this case.

			//this.error = new Error("Query ran but did not produce equivalent input.  Stopping query run execution.");
			//debugger;

			console.log("Skip:", searchText, this.lastQueryRunInput.searchText);

			return;
		}

		//console.log("Request:", searchText);
		//console.log("Outstanding:", this.outstandingRequests)
		// runInAction: Running omdb query
		runInAction( async () => {
			!force && (this.outstandingRequests += 1);
			try {
				this.querySubscription && this.querySubscription.unsubscribe(); // Clear any prior subscriptions. Also why are we even subscribing? result.result would work just as well.
				this.lastQueryRunInput = params;
				var result = await omdb.runQuery(params);

				//this.processQueryResult(result.result, {replace: replace, constructObjects: true});
				this.querySubscription = result.observableQuery.subscribe(({data, errors, loading}) => {
					if (errors) {
						throw errors;
					}
					else if (!loading) {
						//console.log('force:', force);
						//console.log(searchText, data.omdb.raw.find.input.searchText);
						let forceCallbackResult;
						if (forceCallback) {
							forceCallbackResult = forceCallback();
							//console.log('callback:', forceCallbackResult);
						}
						if (!force || forceCallbackResult)
							this.processQueryResult(data.omdb.raw.find, {replace: replace, constructObjects: true});
					}
					!force && ( runInAction(() => this.outstandingRequests -= 1) );
					this.forceRunning = false;
				})
			}
			catch (err) {
				!force && ( this.outstandingRequests -= 1);
				this.forceRunning = false;
				this.error = err;
				throw err;
			}
		});
	}

	@action sort(sortBy: string, sortOrder: 'asc' | 'desc') {
		this.sortBy = sortBy;
		this.sortOrder = sortOrder;
	}

	onDistinctTagsLoaded : Function

	lastDistinctInput;
	_RerunQuery_debounced = _.debounce(this.runQuery, 50, {leading: true, trailing: true})
	@action loadDistinctTagValues = async (tags: string[] = []) => {
		try {
			const {searchText, selectedTagValues, distinctTagValues, onDistinctTagsLoaded, searchModel:{selectedResultFilter}, extraWhere} = this;
			this.lastDistinctSearchText = searchText;
			this.isLoadingDistinct = true;
			var resp = await omdb.getDistinctTagValues(this.objectTypes.map(t => t.id), tags, searchText, Object.assign({}, _.cloneDeep(this.selectedTagValuesObject), selectedResultFilter, extraWhere), this.path);
			const {results, input} = resp;

			// runInAction: Save input from distinct result before processing
			await runInAction(() => {
				this.lastDistinctInput = input;
			})

			// runInAction: Process loaded distinct values
			await runInAction(() => {
				distinctTagValues.clear();
				_.keys(results).forEach(objectType => {
					var fields = observable.map<string, DistinctTagValue>();
					const distinctByTag = results[objectType];
					distinctByTag.forEach(v => fields.set(v.tagName, v));

					if(selectedResultFilter && Object.keys(selectedResultFilter).length) {
						fields.forEach((distinctTagValue) => {
							const distinctKey = distinctTagValue.tagType == "userTag" ? "userTagValues" : distinctTagValue.tagName;
							if (selectedResultFilter[distinctKey]) {
								distinctTagValue.distinct = distinctTagValue.distinct.filter(d => _.some( selectedResultFilter[distinctKey], v => v == d.value));
							}
						});
					}

					fields.forEach( this._doQueryDistinctTagDisplayValue );
					distinctTagValues.set(objectType, fields);

					onDistinctTagsLoaded && onDistinctTagsLoaded();
				});
				this.loadedDistinct = true;

				if (_.isEmpty(searchText)) {
					this.allDistinctTagValues.clear();
					mobx.keys(this.distinctTagValues).forEach(key => this.allDistinctTagValues.set(key, this.distinctTagValues.get(key)));
				}
				this.isLoadingDistinct = false;
			});
		} catch (err) {
			site.raiseError(err);
			this.distinctTagValuesError = err;
			this.isLoadingDistinct = false;
		}
	}

	_doQueryDistinctTagDisplayValue(dtv: DistinctTagValue) {
		const {tagType, distinct } = dtv;

		switch(tagType) {
			case Simulation.ObjectType: {
				let searchIds = [];
				distinct.forEach( otv => {
					const id = otv.value;
					if (!id) {
						return;
					}
					if (simulationStore.simulations.has(id)) {
						otv.label = simulationStore.simulations.get(id).name;
					} else {
						runInAction( () => otv.isLoading = true );
						searchIds.push(id);
					}
				});

				simulationStore.bulkLoadDescriptors(searchIds).then(() => {
					distinct.forEach( otv => {
						if (otv.isLoading) {
							const id = otv.value;
							if (simulationStore.simulations.has(id)) {
								otv.label = simulationStore.simulations.get(id).name;
							} else {
								otv.missingMapping = true;
								otv.label = `[Deleted ${Simulation.ObjectType}]`;
							}
							runInAction( () => otv.isLoading = false );
						}
					});
				});

				break;
			}

			case "ConningUser": {
				distinct.forEach(otv => {
					let id = otv.value;
					if (typeof id !== 'string') {
						id = _.get(id, '_id', ''); 	// for backward compatibility, ex: {_id: "auth0|5b4b84b1a177ac1965fdaa6a", __typename: "Auth0User"})
					}

					if (!id) {
						return;
					}

					if (user.users.has(id)) {
						otv.label = user.users.get(id).fullName;
					} else {
						runInAction( () => otv.isLoading = true );
						user.loadDescriptor(id).then(user => {
							otv.label = user.fullName;
						}).catch( () => {
							otv.missingMapping = true;
							otv.label = `[Deleted User]`;
						}).finally(action(() => {
							otv.isLoading = false;
						}))
					}
				})

				break;
			}
		}
	}

	@action private _ReloadDistinct = async () => {
		const {distinctTagValues} = this;
		if (_.isEmpty(this.lastDistinctSearchText)) {
			this.unfilteredSelectedTagValues = _.cloneDeep(this.selectedTagValuesObject);
		}

		var tags : string[] = _.flatMap(this.objectTypes.slice(), ot => distinctTagValues.has(ot as string) ? Array.from(distinctTagValues.get(ot as string).keys()) : []);
		await this.loadDistinctTagValues(tags);
	}

	private _ReloadDistinct_debounced = _.debounce(this._ReloadDistinct, 50, {leading: true, trailing: true})

	@action reloadDistinct = () => this._ReloadDistinct_debounced();

	@action processQueryResult = (qr: IOmdbQueryResult, options: { replace: boolean, constructObjects: boolean } = {replace: true, constructObjects: true}) => {
		try {
			const {queryResults} = this;
			const {replace, constructObjects} = options;

			if (replace) {
				queryResults.clear();
			}

			this.lastQueryResult = qr;

			qr.results.forEach((r, i) => {
				var cons = objectTypeConstructors[r.__typename];

				let index = qr.skipped + i;

				if (constructObjects) {
					queryResults.set(index.toString(), cons ? cons(r) : r);
				}
				else {
					queryResults.set(index.toString(), this._lookupObjectInStore(r.__typename, r));
				}
			})

			if (this.pagedIndex > qr.total) {
				this.page = 0
			}

			this.hasRunInitialQuery = true;
			this.lastQueryResult = qr;
			this.previousPageResults = this.pageResults;
		}
		catch (err) {
			this.error = err;
			throw err;
		}
	}

	private _lookupObjectInStore(type: OmdbObjectType, value: any) {
		switch (type) {
			case 'Simulation':
				return simulationStore.simulations.get(value._id);
			case 'Query':
				return queryStore.descriptors.get(value._id);
		}
	}

	@observable private _itemsPerPage = 20;
	@computed get itemsPerPage() { return this._itemsPerPage; }
	set itemsPerPage(numOfItems) { runInAction(() => this._itemsPerPage = numOfItems); }

	@computed get hasMore() {
		const {itemsPerPage, lastQueryResult} = this;

		return !lastQueryResult || (lastQueryResult.skipped + lastQueryResult.results.length < lastQueryResult.total);
	}

	@action reset = async () => {
		this._itemsPerPage = 20;
		this.page = 0;
		this.searchText = "";
		const {distinctTagValues} = this;
		if (distinctTagValues) {
			var allFields = _.flatMap(Array.from(distinctTagValues.values()), v => Array.from(v.values()));

			allFields.forEach(v => v.distinct.forEach(v => v.checked = false));
		}
		this.selectedTagValues.clear();
		this.allDistinctTagValues.clear();

		await this.runQuery(true);
	}

	@action addItemsToFolder = async (node: FolderTreeNode & FolderItemTreeNode & any, items: any[]) => {
		var m = await apolloStore.client.mutate({
			mutation: omdb.graph.folder.mutation.addItems,
			variables:      {
				folderId: node.folder._id,
				items:    items.map(item => ({itemId: item._id, objectType: item.__typename}))
			},
			refetchQueries: [{query: omdb.graph.folder.query.concreteFolderItem, variables: {id: node.folder._id, type: "Folder"}}]
		});
	}

	isSelected = (tag: string, distinctValueEntry: OmdbDistinctValue) => {
		const {selectedTagValues: sel} = this;

		return sel.has(tag) && sel.get(tag).indexOf(distinctValueEntry.value) != -1;
	}

	getObjectType = (objectType: String) => {
		return this.objectTypes.find(ot => ot.id == objectType);
	}

	@action delete = (id:string) => {

		let {queryResults, lastQueryResult} = this;

		let tempSavedData = {};
		let deleteIndex = -1;
		queryResults.forEach((v, k) => {
			tempSavedData[k] = v;
			if (v.id == id)
				deleteIndex = parseInt(k);
		});
		if (deleteIndex < 0 ) {
			return;
		}

		// Shift keys after deleted keys
		_.each(Object.keys(tempSavedData), key => {
			let currentKey = parseInt(key);
			if (currentKey == deleteIndex) {
				queryResults.delete(key);
			} else if (currentKey > deleteIndex) {
				queryResults.set((currentKey - 1).toString(), tempSavedData[key]);
				queryResults.delete(key);
			}
		});

		lastQueryResult.total -= 1;

		if (this.pageResults.length == 0 && this.page != 0) {
			this.page -= 1;
		}

		// TODO If not on the last page make a new request to fetch data to fill in deleted object.

		this._ReloadDistinct_debounced();
	}

	highlightItem: string;
	@action insert = async (id:string) => {

		this.highlightItem = id;

		if (!this.lastQueryRunInput) {
			await this.reset();
			return;
		}
		await this.refresh();
		try {
			site.busy = true;
			const params = { ...this.lastQueryRunInput, skip: 0, limit: this.lastQueryResult.total+1};
			await omdb.findObjectIdList(params).then((result) => {
				const index = _.indexOf(result, id);
				if (this.view == 'card') {
					if (index >= 0) {
						this.page = Math.floor(index / this.itemsPerPage);
					}
				}
			});
		} finally {
			site.busy = false;
		}
		await this._ReloadDistinct_debounced();
	}

	@action refresh = async () => {
		await this.runQuery(undefined, undefined, undefined, () => true);
	}

	@action filterByUser(enable) {
		if (enable)
			this.selectedTagValues.set("createdBy", observable([user.currentUser.sub]));
		else
			this.selectedTagValues.delete("createdBy");
	}

	@computed get userFilter() {
		const createdBy = this.selectedTagValues.get("createdBy");
		return createdBy && createdBy.length == 1 && user.currentUser && createdBy[0] == user.currentUser.sub;
	}

	@computed get canFilterByMe() {
		let canFilter = false;

		user.currentUser && Array.from(this.allDistinctTagValues.values()).forEach(ot => {
			Array.from(ot.values()).forEach( distincts => {
				if (distincts.tagName == "createdBy" && (distincts.distinct.find(d => d.value == user.currentUser.sub) != null))
					canFilter = true;
			})
		})

		return canFilter;
	}

	get isHierarchicalViewEnabled() {
		return this.path != null;
	}

	nestedObjectName(name: string, path: string = this.path) {
		if (path == "") {
			return name;
		} else {
			name = name.replace(path + "/", "");
			if (name) {
				return name;
			} else {
				return "Untitled Folder";
			}
		}
	}

	@action enableFolder(enable: boolean) {
		this.path = enable ? "" : null;
	}

	@action setPath(path) {
		this.path = path;
		this._ReloadDistinct_debounced();
	}

	@action addToPath(name) {
		this.path = name == "" ? "" : this.path + (this.path != "" ? "/" : "") + name;
	}

}
