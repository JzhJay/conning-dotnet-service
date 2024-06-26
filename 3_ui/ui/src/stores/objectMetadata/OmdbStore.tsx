import gql from 'graphql-tag';
import { action, computed, observable, runInAction, makeObservable } from 'mobx';
import {fragments} from '../graphQL/Fragments';
import {routing, xhr, apolloStore, omdbGraph} from '../index';
import type {OmdbObjectSchema} from './OmdbTag';
import {IDistinctTagValue, OmdbTag, DistinctTagValue, IOmdbUpdateRecord} from './OmdbTag';
import type {IOmdbQueryResult} from './ObjectCatalogContext';
import type {OmdbObjectType} from './OmdbObjectType';
import {ObservableQuery, WatchQueryOptions} from '@apollo/client';

const GRAPHQL = true;

export interface IOmdbChangedEvent {
	data: {
		omdb_changed: {
			objectType: string;
			operation: string;
			_id: string;
		}
	}
}

export interface IOmdbQueryResultGraph {
	omdb: {
		raw: {
			find?: IOmdbQueryResult
			get?: any
		}
	}
}

export interface QueryRefresher {
	id?: string;
	objectTypes: string[];
	refresher: () => void;
}

class OmdbStore {
    constructor() {
        makeObservable(this);
    }

    get apiRoute() {
		return `${routing.rootUrl}/api/omdb`;
	}

    get graph() {
		return omdbGraph;
	}

    @observable schema = observable.map<string, OmdbObjectSchema>({}, {deep: false});

    @action reset = () => {
		//this.tags.clear();
		this.schema.clear();

	}

    @action startup = () => {
		this.reset();

		var omdbChangeSub = apolloStore.client.subscribe({
			query: gql`subscription omdb {
				omdb_changed {
					_id
					operation
					objectType
				}
			}`
		});
		omdbChangeSub.subscribe(
			this.onOmdbChanged,   // We will be notified about object we are in the middle of inserting/updating/deleting.  Wait until we're done with the outstanding operation before doing anything else
			this.onOmdbError);
	}

    private onOmdbError = (error) => {
		console.error(error);
	}

	@observable private _lastOmdbChanged: { objectType: string; operation: string; _id: string; } = null;
	@computed public get lastOmdbChanged() { return this._lastOmdbChanged; }

    private onOmdbChanged = async (value: IOmdbChangedEvent) => {
		const {data: {omdb_changed, omdb_changed: {objectType, _id, operation}}} = value;
		if (!objectType || objectType == "Folder" || objectType == "FolderItem") {
			return;
		}

		const lowerCaseObjectType = objectType.toLowerCase();
		const fragmentKey = _.keys(fragments).find(key => key.toLowerCase() === lowerCaseObjectType);
		const fragment = fragments[fragmentKey];

		if (fragment) {
			setTimeout(async () => {
				console.log("omdb_changed: ", objectType, _id, operation);
				runInAction(() => {this._lastOmdbChanged = omdb_changed});

				if (operation == 'Insert') {
					// If we already know about the object then we did the inserting

					var cache = apolloStore.client.cache['data'].data;
					if (!cache[`${objectType}:${_id}`]) {
						await this.findSingle(objectType, _id, true);
					}
				}
				else if (operation == 'Replace') {
					await this.findSingle(objectType, _id, true);
				}
				else {
					//(apolloStore.client.cache as any).data.delete(`${objectType}:${_id}`);
				}

				//apolloStore.client.reFetchObservableQueries();
			}, 200);
		}
	}

    @action getDistinctTagValues = async (objectTypes: string[], tags: string[], searchText = "", where: any = {}, path = null) => {
		var results: { [objectType: string]: DistinctTagValue[] } = {};

		// if (GRAPHQL) {
		let observableQuery = await apolloStore.client.watchQuery<{ omdb: { raw: { distinct: { input: any, results: Array<{ objectType: string, tags: IDistinctTagValue[] }> } } } }>({
			query:        gql`
				${fragments.DistinctFields_untyped}

				query omdbDistinctTagValues($input: OmdbDistinctInput!) {
					omdb {
						raw {
							distinct(input: $input) {
								...distinctFields_untyped
							}
						}
					}
				}
			`,
			variables:    {input: {objectTypes: objectTypes, tags, searchText, where, path}},
			fetchPolicy: "network-only"
		});

		var resp = await observableQuery.result();
		const {data: {omdb: {raw: {distinct}}}} = resp;
		for (const ot of distinct.results) {
			results[ot.objectType] = ot.tags.map(e => new DistinctTagValue(e));
		}

		return {results: results, input: distinct.input};
		// }
		// else {
		// 	var distinct = await xhr.get<{ [objectType: string]: IDistinctTagValue[] }>(`${this.apiRoute}/tags/distinct?objectTypes=${encodeURI(objectTypes.join(','))}&tags=${encodeURI(tags.join(','))}&searchText=${encodeURI(searchText)}`);
		//
		// 	return runInAction(
		// 		`Process distinct tag values for ${JSON.stringify(objectTypes)} - ${JSON.stringify(searchText)}`,
		// 		() => {
		// 			for (var key of _.keys(distinct)) {
		// 				results[key] = distinct[key].map(e => new DistinctTagValue(e))
		// 			}
		// 			return results;
		// 		});
		// }
	}

    @action runQuery = async (input: { objectTypes?: string[], skip?: number, limit?: number, sortBy?: string, sortOrder?: string, searchText?: string, where?: any, favorites?: string[] }): Promise<{ result: IOmdbQueryResult, observableQuery?: ObservableQuery<IOmdbQueryResultGraph> }> => {
		if (GRAPHQL) {
			//console.log(input);

			var queryOptions : WatchQueryOptions = {
				query:        this.graph.catalogQuery,
				variables:    {input: input},
			};

			//if (_.includes(input.objectTypes, "Query") || _.includes(input.objectTypes, "InvestmentOptimization"))
			// Disable caching to account for object insert/delete which will be overridden by apollo's staled cache result.
			queryOptions.fetchPolicy = "network-only";

			var watch = await apolloStore.client.watchQuery<IOmdbQueryResultGraph>(queryOptions);

			const result = await watch.result();
			const {omdb: {raw: {find}}} = result.data;

			// find.results.forEach(r => {
			// 	var fragment = this.fragments[r.__typename];
			//
			// 	fragment && apolloStore.apolloClient.cache.writeFragment({
			// 		id: r._id,
			// 		fragment,
			// 		data: r
			// 	})
			// })

			return {result: find, observableQuery: watch};
		}
		else {
			const {limit, objectTypes, skip, sortBy, sortOrder, searchText, where} = input;
			let url = `${this.apiRoute}/objects?objectTypes=${encodeURI(objectTypes.join(','))}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&searchText=${searchText}`;

			for (var key of Object.keys(where)) {
				var value = where[key];
				if (value) {
					url += `&${encodeURI(key)}=${encodeURI(value.join ? value.join(',') : value)}`
				}
			}

			var result = await xhr.get<IOmdbQueryResult>(url);

			return {result};
		}
	}

    @action findObjectIdList = async (input: { objectTypes?: string[], skip?: number, limit?: number, sortBy?: string, sortOrder?: string, searchText?: string, where?: any, favorites?: string[] }) : Promise<string[]> => {
		const resp = await apolloStore.client.query<IOmdbQueryResultGraph>({
			query: gql`
				query runOmdbQuery($input: omdb_queryResultInput!) {
					omdb {
						raw {
							find(input: $input) {
								input {
									limit,
									where
									searchText
									sortBy
									sortOrder
									objectTypes
								}
								skipped
								total
								#results: resultsRaw
								results {
									...dbObject
								}
							}
						}
					}
				}
				${fragments.dbObject}
			`,
			variables:    {input: input}
		});

		const {data: {omdb: {raw: {find: {results}}}}} = resp;

		return _.map(results, data => data._id);
	}

    @action
	async findSingle<T>(objectType: OmdbObjectType, id: string, ignoreCache = false) {
		var resp = await apolloStore.client.query<IOmdbQueryResultGraph>({
			query:        gql`
				query omdbGet($id: ID!, $objectType: String!) {
					omdb {
						raw {
							get(_id: $id, objectType: $objectType) {
								...userFile
								...query
								...simulation
								...investmentOptimization
								...folder
								...climateRiskAnalysis
							}
						}
					}
				}
				${fragments.userFile}
				${fragments.climateRiskAnalysis}
				${fragments.query}
				${fragments.folder}
				${fragments.investmentOptimization}
			`,
			fetchPolicy:  ignoreCache ? 'network-only' : 'cache-first',
			variables:    {id, objectType}
		});

		const {data: {omdb: {raw: {get}}}} = resp;
		return get as T;

		//
		//
		// var qr = await this.runQuery({objectTypes: [objectType], limit: 1, skip: 0,  where: queryParams});
		// if (_.isEmpty(qr.results)) {
		// 	throw new Error(`Unable to find object of type '${objectType} : ${JSON.stringify(queryParams)}`);
		// }
		//
		// return qr.results.length == 0 ? null : qr.results[0] as T;
	}

    @action update = async (record: IOmdbUpdateRecord) => {
		var result = await xhr.post(`${this.apiRoute}/objects`, record);
		return result;
	}

    updateDatabaseUi = (objectType: string, fragment: any) => {
		xhr.post(`${this.apiRoute}/ui`, {objectType: objectType, fragment: fragment});
	}

    updateTags = async (tags: Array<OmdbTag>) => {
		xhr.post(`${this.apiRoute}/tags`, tags);
	}

	private activeQueryRefreshers: Set<QueryRefresher> = new Set<QueryRefresher>();

	registerQueryRefreshers = (qr: QueryRefresher): string => {
		(!qr.id) && (qr.id = uuid.v4());
		this.activeQueryRefreshers.add(qr);
		return qr.id;
	}

	removeSavedQueryRefreshers = (rmObj: QueryRefresher | string) => {
		if (_.isString(rmObj)) {
			rmObj = _.find(Array.from(this.activeQueryRefreshers), aqr => aqr.id == rmObj);
		}
		this.activeQueryRefreshers.delete(rmObj);
	}

	executeQueryRefreshers = (objectType?: string): void => {
		let qrs: QueryRefresher[] = null;
		if (!objectType)
			qrs = Array.from(this.activeQueryRefreshers);
		else
			qrs = Array.from(this.activeQueryRefreshers)?.filter( aqr => _.includes(aqr.objectTypes, objectType));

		_.each(qrs, qr => {
			try {
				qr.refresher();
			} catch (e) {
				console.error(e);
			}
		})
	}

	updatePartial = async (objectType: string, objectId: string, updateSet: object) : Promise<any> => {
		return apolloStore.client.mutate({
			mutation:  gql`
				mutation updatePartial($id: ID!, $set: Json!) {
					omdb {
						typed {
							${_.camelCase(objectType)} {
								updatePartial(id: $id, set: $set)
							}
						}
					}
				}
			`,
			variables: {id: objectId, set: updateSet}
		}).then(result => {
			let rtn = _.get(result, `data.omdb.typed.${_.camelCase(objectType)}.updatePartial`, {});
			delete rtn["_id"];
			return rtn;
		});
	}

	updateFolderName = async (objectType: string, oldName: string, newName: string) : Promise<any> => {
		return apolloStore.client.mutate({
			mutation:  gql`
				mutation updateFolderName($oldName: String!, $newName: String!) {
					omdb {
						typed {
							${_.camelCase(objectType)} {
								updateFolderName(oldName: $oldName, newName: $newName)
							}
						}
					}
				}
			`,
			variables: {oldName: oldName, newName: newName}
		}).then(result => {
			let rtn = _.get(result, `data.omdb.typed.${_.camelCase(objectType)}.updateFolderName`, {});
			return rtn;
		});
	}

}

export const omdb = new OmdbStore();

//Ain';t n