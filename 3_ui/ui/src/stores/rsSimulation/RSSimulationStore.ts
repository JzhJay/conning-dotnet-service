import {julia} from 'stores/julia';
import {xhr} from 'stores/xhr';
import {site} from 'stores/site';
import {routing, omdb, Simulation} from 'stores';
import {observable, computed, makeObservable, action} from 'mobx';
import {ISimulationUseCase, ITemplateFilter, TemplateOptions} from 'stores/rsSimulation/models';

export class RSSimulationStore {
    @observable pendingSessions = new Set();
    @observable currentSimulation: {_id: string, status?: string};
    @observable loading = false;
	@observable useCases: ISimulationUseCase[] = null;

    private openAfterLoadedId = false;

    constructor() {
        makeObservable(this);
		this.loadUseCases();
    }

    get browserUrl() { return routing.urls.simulationBrowser }

    getPageURLForID = (id: string, page = 1) => `${this.browserUrl}/${id}?edit&page=${page == 2 ? 2 : 1}`;

    navigateToBrowser = () => routing.push(this.browserUrl);
    navigateToID = (id, page?: number) => routing.push(this.getPageURLForID(id, page));
    navigateToExisting = (page = 1) =>  this.navigateToID(this.currentSimulation._id, page);

    get apiRoute() {
		return `${julia.url}/v1/rs-simulation`;
	}

    get clientRoute() {
		return routing.urls.simulationBrowser;
	}

    @computed get currentSimulationId() {
		return this.currentSimulation ?  this.currentSimulation._id : null;
	}

    async loadSimulationId(openAfterLoadedId: boolean = false) {
		this.loading = true;
		await omdb.runQuery({
			objectTypes: ["Simulation"],
			sortBy:      'modifiedTime',
			sortOrder:   'desc',
			where: {sourceType: Simulation.SOURCE_TYPE.GEMS}
		}).then((value) => {
			if (!value.result.results.length) {
				this.currentSimulation = null;
				return;
			}
			this.currentSimulation = value.result.results[0];
		}).finally(() => {
			this.loading = false;
		});
	}

    @computed get canOpen() {
		return !!this.currentSimulationId;
	}

	createNewObject = async (type: string = "GEMS", name: string = "Untitled", file: string = null, dfaFile: string = null, tagValues?: string[], templateFilter?: ITemplateFilter, useCase?: string, parameterizationMeasure = Simulation.FIRM_PARAMETERIZATION_MEASURE.REAL_WORLD) => {
		try {
			site.busy = true;
			this.currentSimulation = null;
			let pageURL = null;
			await xhr.putUntilSuccess<{ id: string}>(this.apiRoute, {data: {
				name: name,
				importFile: file,
				importDFAFile: dfaFile,
				userTagValues: tagValues,
				sourceType: type,
				templateInputs: templateFilter,
				useCase: useCase,
				parameterizationMeasure: parameterizationMeasure
			}},
			"id",
			(response, willRetry) => {
				const id = willRetry ? response as string : response.id;

				if (!willRetry) {
					this.pendingSessions.delete(id);
				}
				else {
					this.pendingSessions.add(id);
				}

				this.currentSimulation = {_id: id};
				pageURL = this.getPageURLForID(id);
				this.navigateToID(id);
			},
				() => pageURL && pageURL !== routing.pathname
			);

			return this.currentSimulation._id;
		}
		finally {
			site.busy = false;
		}
	}

	async loadTemplateOptions() {
		return xhr.get<TemplateOptions>(`${this.apiRoute}/template`);
	}

	async loadUseCases() {
		if (this.useCases == null) {
			return xhr.get<{useCases: ISimulationUseCase[]}>(`${this.apiRoute}?include_use_cases=true`).then(action((response) => {
				this.useCases = response["useCases"];
			}));
		}
	}}

export const rsSimulationStore = new RSSimulationStore();
