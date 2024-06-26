import type { QueryGuid, JuliaQuery, JuliaQueryDescriptor, QuerySave } from './'
import { computed, observable, action, runInAction, makeObservable } from 'mobx';
import { Query, QueryDescriptor } from './';
import type {SimulationGuid} from 'stores';
import {xhr, site, julia, api, settings, routing, QueryResult, omdb} from 'stores';

export class QueryStore {
	constructor() {
        makeObservable(this);
    }

	@action resetStore = () => {
		this.querySessions.forEach((value: Query) => {
			value.dispose();
		})
		this.querySessions.clear();
		this.descriptors.clear();
		this._loadingByUrl.clear();
	}

	@computed
	get isActivePage() {
		return routing.isActive(routing.urls.query)
	}

	defaultUserOptions = { views: ['pivot'] };

	@observable pendingSessions: string[] = [];
	@observable.shallow querySessions = observable.map<string, Query>({}, {deep: false});

	@observable hasLoadedDescriptors = false;
	@observable.shallow descriptors  = observable.map<string, QueryDescriptor>({}, {deep: false});

	@observable _loadingByUrl = observable.map<string, Promise<Query> | Promise<QueryDescriptor> | Promise<QueryDescriptor[]>>({}, {deep: false});

	@computed
	get recentQueries() {
		return JSON.parse(localStorage.getItem('recentQueries')) || [];
	}

	setRecentQuery(id: QueryGuid) {
		let recentQueries = this.recentQueries;
		recentQueries.forEach((r,i) => {
			if (r.id == id) {
				recentQueries.splice(i, 1);
			}
		});
		const newRecentQuery = this.descriptors.get(id);
		newRecentQuery && recentQueries.unshift({id: newRecentQuery.id, name: newRecentQuery.name, clientUrl: newRecentQuery.clientUrl});
		if (recentQueries.length > settings.maxRecentItems) {
			recentQueries.splice(settings.maxRecentItems, recentQueries.length-settings.maxRecentItems);
		}
		localStorage.setItem('recentQueries', JSON.stringify(recentQueries));
	}

	@action	deleteRecentQuery(id: QueryGuid) {
		let recentQueries = this.recentQueries;
		recentQueries.forEach((r,i) => {
			if (r.id == id) {
				recentQueries.splice(i, 1);
				localStorage.setItem('recentQueries', JSON.stringify(recentQueries));
			}
		});
	}

	@action updateRecentQuery(id: QueryGuid, updateQueryDescriptor: QueryDescriptor) {
		let recentQueries = this.recentQueries;
		recentQueries.forEach(r => {
			if (r.id == id) {
				if (r.name != updateQueryDescriptor.name) {
					r.name = updateQueryDescriptor.name;
					localStorage.setItem('recentQueries', JSON.stringify(recentQueries));
				}
				return;
			}
		});
	}

	@action getQuery = async (id: QueryGuid, forceReload = false, retrievingError = false): Promise<Query> => {
		const { _loadingByUrl: loadingByUrl, querySessions } = this;
		const url                                            = this.apiUrlFor(id);

		if (!forceReload && querySessions.has(id)) {
			return Promise.resolve(querySessions.get(id));
		}

		if (forceReload || !loadingByUrl.has(url)) {
			loadingByUrl.set(
				url,
				xhr.get<JuliaQuery>(url).then((resp) => {
					// runInAction: load Query Descriptor
					return runInAction(async () => {
						if (!retrievingError) {
							let q = querySessions.get(id);
							if(!q){
								q = new Query(resp);
								querySessions.set(id, q);
							}
							loadingByUrl.delete(url);
							return q;
						}
						else {
							if (resp.resultWarning) {
								throw new Error(resp.resultWarning);
							}
							else {
								throw new Error(resp.toString());
							}
						}
					})
				}).catch(err => {
					loadingByUrl.delete(url);
					throw err;
				})
			);
		}

		return loadingByUrl.get(url) as Promise<Query>;
	}

	get isLoadingDescriptors() {
		return this._loadingByUrl.has(this.apiUrl)
	}

	@action loadDescriptors = (): Promise<QueryDescriptor[]> => {
		const { _loadingByUrl: loadingByUrl, descriptors } = this;
		const url                                          = this.apiUrl;

		if (!loadingByUrl.has(url)) {
			loadingByUrl.set(
				url,
				xhr.get<JuliaQueryDescriptor[]>(url).then(juliaDescriptors => {
					// runInAction: Query Session Descriptors Loaded
					return runInAction(() => {
						descriptors.clear();
						const queries: QueryDescriptor[] = juliaDescriptors.map(q => new QueryDescriptor(q));

						queries.forEach(q => descriptors.set(q.id, q));
						this.hasLoadedDescriptors = true;
						loadingByUrl.delete(url);
						return queries;
					})
				}).catch(err => {
					loadingByUrl.delete(url);
					this.hasLoadedDescriptors = false;
					throw err;
				})
			);
		}

		return loadingByUrl.get(url) as Promise<QueryDescriptor[]>;
	}

	@action createQuerySessionDescriptor = async (name: string, simulationIds: Array<SimulationGuid>, queryDefinition: QuerySave = null, routingWhenCreated = false, tagValues?: string[]): Promise<QueryGuid> => {
		let pageURL = null;
		let result = await xhr.postUntilSuccess<QueryGuid>(
			this.apiUrl,
			{
				name: name,
				simulationIds: simulationIds,
				userTagValues: tagValues,
				...(queryDefinition ? {queryDefinition: queryDefinition} : null)
			},
			"query_id",
			(response, willRetry) => {
				const id = response as string;
				if ( willRetry ) {
					if (!_.includes(this.pendingSessions, id)) {
						this.pendingSessions.push(id);
					}
				} else {
					_.remove(this.pendingSessions, s => s == id);
				}
				if( routingWhenCreated ){
					const url = routing.routeFor.query(id);
					if(!willRetry || location.href.indexOf(url) < 0) {
						routing.push(url);
						pageURL = url;
					}
				}
			},
			() => pageURL && pageURL !== routing.pathname
		);
		return result;
	}

	@action loadDescriptor = async (id: QueryGuid): Promise<QueryDescriptor> => {
		let queryResult = await omdb.findSingle<JuliaQuery>('Query', id);
		if (!queryResult) {
			throw new Error(`Unable to locate query with id: '${id}'`);
		}

		queryResult = _.cloneDeep(queryResult);
		const result = new QueryDescriptor(queryResult);
		return result;
	}

	getQuerySession = async (id: QueryGuid) => {
		if (!id) {
			return null;
		}
		let result = this.querySessions.get(id);
		return result ? result : await this.startQuerySession(id);
	}

	loadIfNeeded = (id, isUseCaseQuery = false) => {
		const result = this.querySessions.get(id);

		if (!result) {
			setTimeout(() => this.getQuerySession(id));
		}

		if (result) {
			result.isUseCaseQuery = isUseCaseQuery;
		}

		return result;
	}


	@action startQuerySession = (id): Promise<Query> => {
		if (!id) {
			return Promise.resolve(null);
		}

		const { _loadingByUrl: loadingByUrl, descriptors, querySessions } = this;
		const url                                                         = this.apiUrlFor(id);

		if (!loadingByUrl.has(url)) {
			const descriptor = descriptors.get(id);
			if (descriptor) descriptor.isLoading = true;

			loadingByUrl.set(
				url,
				xhr.putUntilSuccess<JuliaQuery>(this.apiUrlFor(id), { hasSession: true }, "transactionId")
				   .then(
					   action((juliaQuery: JuliaQuery) => {
						   Object.assign(juliaQuery, { id: id });

						   let query = querySessions.get(id)
						   if (!query) {

							   // Cleanup descriptor which will be replaced with as Query
							   if (descriptor)
								   descriptor.dispose();

							   query = new Query(juliaQuery);

							   // runInAction: Query has been loaded
							   runInAction(() => {
								   // The query has been created, however we need to go back to the server for the information
								   descriptors.set(id, query);
								   querySessions.set(id, query);
								   loadingByUrl.delete(url);
							   });
						   }
						   else {
							   query.hasSession = juliaQuery.hasSession;
							   query.updateState(juliaQuery.state);
						   }
						   loadingByUrl.delete(url);
						   query.isLoading = false;
						   return query.initializeQuerySession();
					   })
				   ).catch(err => {
					loadingByUrl.delete(url);

					throw err;
				})
			);
		}

		return loadingByUrl.get(url) as Promise<Query>;
	}

	@action closeEventSourceAndRemoveSession = (id: QueryGuid) => {
		const { querySessions } = this;
		if (querySessions.has(id)) {
			querySessions.get(id).dispose();
			querySessions.delete(id);
		}
	}

	@action killQuerySession = async (id:QueryGuid): Promise<boolean>=>{
		const url = this.apiUrlFor(id);
		await xhr.delete(url.concat("/session"));
		await queryStore.getQuery(id).then((query:Query)=>query.dispose());
		this.closeEventSourceAndRemoveSession(id);
		this.descriptors.delete(id);
		this._loadingByUrl.delete(url);
		return true;
	}

	@action deleteQueryDescriptors = async (ids: QueryGuid[]) => {
		const { descriptors, querySessions } = this;

		return Promise.all(ids.map(id => {
			descriptors.has(id) && descriptors.delete(id);
			this.closeEventSourceAndRemoveSession(id);

			return xhr.delete(this.apiUrlFor(id));
		}));
	}

	@action deleteQueryDescriptor = async (id: QueryGuid) => {
		if (!id) {
			return Promise.resolve(null);
		}

		const { descriptors, querySessions } = this;

		descriptors.has(id) && descriptors.delete(id);
		this.closeEventSourceAndRemoveSession(id);
		this.deleteRecentQuery(id);

		return xhr.delete(this.apiUrlFor(id));
	}

	@action deleteAllQueryDescriptors = () => {
		let length = this.descriptors.size;
		if (length > 0) {
			this.descriptors.forEach(d => {
				console.warn(`Deleting query '${d.id}'`)
				this.deleteQueryDescriptor(d.id);
			})

			site.toaster.show({ message: `${length} ${length === 1 ? 'query' : 'queries'} deleted` });
		}

	}

	rename = async (query: QueryDescriptor, name: string) => {
		const resp = await api.xhr.put<JuliaQuery>(`${query.apiUrl}/name`, { name: name });
		// runInAction: Rename query
		runInAction(() => {
			delete resp['id']; // omdb temp bridging (todo)
			delete resp['simulations']; // same as above, the simulation _id field isn't present in the response and there is no need to override the simulations we already have.
			delete resp['userTagValues']; // temp workaround, julia's response is not sufficent to render UI components correctly
			let desc = this.descriptors.get(query.id);
			Object.assign(desc, resp);

			const session = this.querySessions.get(query.id)
			if (session) {
				Object.assign(query, resp);
			}
		})
	}

	runQuery = async (id?: string): Promise<QueryResult> => {
		const query = this.querySessions.has(id) ? this.querySessions.get(id) : await this.startQuerySession(id);
		return await query.run();
	}

	apiUrlFor(id: QueryGuid) {
		return `${this.apiUrl}${id != null ? `/${id}` : ''}`;
	}

	get apiUrl() {
		return `${julia.url}/v1/queries`;
	}

	navigateTo = (id?: QueryGuid, view?: string) => {
		routing.push(this.clientUrlFor(id, view));
	}

	clientUrlFor(id?: QueryGuid, view?: string) {
		return `${routing.urls.query}/${id ? id : ''}${view ? `?view=${view}` : ''}`;
	}

	browserUrl(flag?: 'active' | 'mine' | 'shared-with-me' | 'saved') {
		let result = routing.urls.query;
		if (flag) {
			result += `?${flag}`
		}

		return result;
	}

	navigateToBrowser = () => routing.push(this.browserUrl())
}

export const queryStore = new QueryStore();