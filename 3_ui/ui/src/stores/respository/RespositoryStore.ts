import {julia} from 'stores/julia';
import {xhr} from 'stores/xhr';
import {site} from 'stores/site';
import {routing, Repository} from 'stores';
import {observable, action, computed, makeObservable} from 'mobx';

export class RepositoryStore {
	constructor() {
        makeObservable(this);
    }

	@observable repositories = observable.map<string, Repository>({}, {deep: false});

	get browserUrl() { return routing.urls.simulationBrowser }

	getPageURLForID = (id, fileId) => `${this.browserUrl}/${id}?edit&page=1${!!fileId ? '&fileId='+fileId : '' }`;
	navigateToBrowser = () => routing.push(this.browserUrl)
	navigateToID = (id, fileId?) => routing.push(this.getPageURLForID(id, fileId));

	@observable loading              = false;

	get apiRoute() {
		return `${julia.url}/v1/repositories`;
	}

	get juliaRoute() {
		return `${julia.url}/v1/repositories`;
	}

	get clientRoute() {
		return routing.urls.simulationBrowser;
	}

	@computed get isActivePage() { return routing.isActive(routing.urls.ioBrowser)}

	createNewRespository = async ( fileId?, name?: string, tagValues?: string[], routingWhenCreated = true) => {
		try {
			site.busy = true;
			let pageURL = routing.pathname;
			let result = await xhr.putUntilSuccess<{ repoId: string}>(this.apiRoute, { name: name, userTagValues: tagValues },
				"repo_id",
				(response, willRetry) => {
					const id = willRetry ? response as string : response.repoId;
					// if (!willRetry) {
					if (id && routingWhenCreated) {
						pageURL = this.getPageURLForID(id, fileId);
						this.navigateToID(id , fileId);
					}
				},
				() => pageURL !== routing.pathname // Cancel if page changes
			);
			return result?.repoId
		}
		finally {
			site.busy = false;
		}
	}

	@action reset = () => {
		this.repositories.clear();
	}

	createTestRepository = async () => {
		const res = await xhr.put<any>(`${repositoryStore.apiRoute}?mock=true`, {});
		let testRepository = new Repository(res.repoId, null);
		return testRepository;
		//routing.push(`${this.browserUrl}/${result.ioId}`);
	}
}

export const repositoryStore = new RepositoryStore();
