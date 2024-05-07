import * as React from 'react';
import type {JuliaSimulation, Economy, SimulationGuid, SimulationPeriods} from 'stores/simulation';
import {simulationStore} from 'stores/simulation';
import { action, computed, observable, runInAction, makeObservable } from 'mobx';
import {
	xhr,
	site,
	utility,
	routing,
	queryStore,
	settings,
	QueryDescriptor,
	Repository, repositoryStore, ObjectNameChecker, OmdbUserTagValue, i18n
} from 'stores';
import type {ConningUser} from 'stores';
import {BlueprintDialog} from '../../components/widgets/BlueprintDialog';
import {RSSimulation} from '../rsSimulation';
import {SimulationStatus} from './models';
import * as mobx from 'mobx';
import { FormattedMessage } from 'react-intl';

export class Simulation implements JuliaSimulation {
	static ObjectType = 'Simulation';
	static get OBJECT_NAME_SINGLE() { return i18n.intl.formatMessage({defaultMessage: "Simulation", description: "objectName - Simulation (single)"}) };
	static get OBJECT_NAME_MULTI() { return i18n.intl.formatMessage({defaultMessage: "Simulations", description: "objectName - Simulation (multi)"}) };

	static SOURCE_TYPE = {
		CLASSIC: "Classic",
		REPOSITORY: "User Uploaded File",
		INTERMEDIATE_RESULT: "IntermediateResult",
		GEMS: "GEMS",
		FIRM: "FIRM"
	}

	static translateSourceType(type) {
		return _.get(i18n.databaseLookups.tagValues, [type], type);
	}

	static FIRM_PARAMETERIZATION_MEASURE = {
		REAL_WORLD: "Real World",
		RISK_NEUTRAL: "Risk Neutral"
	}

	constructor(simulation: JuliaSimulation) {
        makeObservable(this);
        utility.migrateField(simulation, 'id', this, '_id');
        utility.migrateField(simulation, 'numberOfSubPaths', this, 'subPaths');
        utility.migrateField(simulation, 'numOfVariables', this, 'variables');
        utility.migrateField(simulation, 'numberOfScenarios', this, 'scenarios');
        utility.migrateField(simulation, 'frequency', this, 'frequencies');

        Object.assign(this, simulation);

		// TODO: The initial design probably allowed the repository and rsSimulation objects to be lazy loaded, however now that they are always being created up front, it probably
		// makes sense to refactor into an inheritance design where Repository and RSSimulation inherrit from Simulation, this way we don't have to worry about keeping the status in sync.
        if (this.isRepository)
			this.repository = new Repository(this.id, this.status, this.updateStatus);

		if (this.isGEMSBased) {
			this.rsSimulation = new RSSimulation(this.id, this.status, this.sourceType, this.useCase, simulation.locked, this.updateStatus);
		}

        simulationStore.simulations.set(this.id, this);
    }

	_id: SimulationGuid;
	get id() { return this._id }

	@observable name: string;
	dfsPath: string;
	subPaths: number;
	model: string;
	@observable description: string;
	path: string;
	modules: string[];

	@observable variables;

	scenarios: number;

	economies: Economy[];
	timestamp: string;
	version: string;
	frequencies: string[];
	periods: SimulationPeriods;
	@observable createdTime: string;
	@observable modifiedTime: string;
	createdBy: ConningUser;
	createdBy_external: string;
	@observable modifiedBy: ConningUser;
	@observable modifiedBy_external: string;
	@observable status : SimulationStatus;
	@observable userTagValues: OmdbUserTagValue[];
	@observable comments: string;
	sourceType: string;
	useCase:    string;
	parameterizationMeasure: string;

	repository: Repository;
	rsSimulation: RSSimulation;

	// get createdByUser(): JuliaUser {
	// 	let result: JuliaUser = user.users.get(this.createdBy);
	//
	// 	const {createdBy_external} = this;
	// 	if (!result && createdBy_external) {
	//
	// 		if (this.createdBy_external == user.settings.externalID)
	// 			result = user.profile as any; // Link to current user profile instead of searching/using the possible stale users list
	// 		else {
	// 			result = _.filter(mobx.values(user.users), (u) => createdBy_external == (u.externalID))[0];
	// 		}
	//
	// 		if (result)
	// 			this.createdBy = result.user_id;
	// 	}
	//
	// 	// reset the createdBy if the current user modifies their externalID
	// 	if (createdBy_external && result && result.user_id == user.profile.user_id && createdBy_external != user.settings.externalID) {
	// 		this.createdBy = null;
	// 		result         = null;
	// 	}
	//
	// 	return result;
	// }

	// get modifiedByUser(): JuliaUser {
	// 	let result: JuliaUser = user.users.get(this.modifiedBy);
	//
	// 	const {modifiedBy_external} = this;
	//
	// 	if (!result && modifiedBy_external) {
	//
	// 		if (modifiedBy_external == user.settings.externalID)
	// 			result = user.profile as any; // Link to current user profile instead of searching/using the possible stale users list
	// 		else {
	// 			result = _.filter(mobx.values(user.users), (u) => modifiedBy_external == (u.externalID))[0];
	// 		}
	//
	// 		if (result)
	// 			this.modifiedBy = result.user_id;
	// 	}
	//
	// 	if (result && modifiedBy_external && result.user_id == user.profile.user_id && modifiedBy_external != user.settings.externalID) {
	// 		this.modifiedBy = null;
	// 		result          = null;
	// 	}
	//
	// 	return result;
	// }

	@action updateStatus = (status) => {
		this.status = status;
	}

	static apiUrlFor(id: SimulationGuid) {
		return `${simulationStore.apiRoute}/${id}`;
	}

	get apiUrl() {
		return Simulation.apiUrlFor(this.id);
	}

	static get browserUrl() { return routing.urls.simulationBrowser; }

	static urlFor(id: SimulationGuid) {
		return `${Simulation.browserUrl}/${id ? id : ''}`;
	}

	static urlForRelatedObjectPage (id:string, relatedObjectType?: string, relatedTag?: string) {
		return `${Simulation.urlFor(id)}?relatedObject${relatedObjectType ? `=${relatedObjectType}` : ""}${relatedTag ? `&relatedTag=${relatedTag}` : ""}`;
	}

	get clientUrl() {
		return this.editable ? repositoryStore.getPageURLForID(this.id, null) : null;
	}

	get icon() {
		return 'database'
	}

	// get id() {
	// 	return this._id;
	// }

	navigateTo = () => { routing.push(this.clientUrl)}

	static delete     = async (sim: JuliaSimulation, force = false, soft = false) => {
		const {name, _id} = sim;
		if (force || KARMA || (await site.confirm(i18n.common.MESSAGE.WITH_VARIABLES.DELETE_CONFIRMATION(Simulation.OBJECT_NAME_SINGLE, name)))) {
			// runInAction: Deleting simulation
			return runInAction(async () => {
				try {
					site.busy = true;
					const rtnMessage = await xhr.delete(Simulation.apiUrlFor(sim._id) + (soft ? "?soft" : ""));
					KARMA && console.log(`delete simulation: ${JSON.stringify(rtnMessage)}`);
					if (simulationStore.simulations.has(_id)) {
						const deletedSim = simulationStore.simulations.get(_id);
						if (deletedSim.isRepository) {
							deletedSim.repository.eventSource?.dispose();
						} else if (deletedSim.isRSSimulation) {
							deletedSim.rsSimulation.eventSource?.dispose();
						}
						simulationStore.simulations.delete(_id); // only delete simulation entry after server deletes the sim
					}
					return true;
				}
				catch (err) {
					const activeSessions = err.response.body.activeQuerySessions;
					if (err.status == 406 && activeSessions){
						site.setDialogFn(() =>
							<BlueprintDialog title={i18n.intl.formatMessage({defaultMessage: "{simulation} In Use", description: "[Simulation] dialog title to indicate that the simulation is being used/referenced by other objects"}, {simulation: Simulation.OBJECT_NAME_SINGLE})}
							                 okText={i18n.intl.formatMessage({defaultMessage: "View Active Queries", description: "[Simulation] button to view query objects that reference the current simulation"})}
							                 icon="error"
							                 ok={async () => {routing.push(`${Simulation.urlFor(sim._id)}?activeSessions=${activeSessions}`); return true;}}>
								<FormattedMessage defaultMessage="The simulation is in use by active query sessions and cannot be deleted" description="[Simulation] message to inform the user that a simulation object is in use and cannot be deleted"/>
							</BlueprintDialog>)

						// Pass along in Karma for testing purposes.
						if (KARMA)
							throw err;
					}
					else
						throw err
				}
				finally {
					site.busy = false;
				}
			})
		}
	}

	static duplicate = async (sim: JuliaSimulation) => {
		const newName = await new ObjectNameChecker({nameForCopyObject: true}).getAvailableName(Simulation.ObjectType, sim.name);
		return xhr.get(`${Simulation.apiUrlFor(sim._id)}/clone?name=${encodeURIComponent(newName)}`);
	}

	@observable renamingFrom: 'sidebar' | 'header' | null = null;
	@action cancelRename                                  = () => this.renamingFrom = null;
	@action confirmRename = async (value: string) => {
		await Simulation.rename(this, value);
		this.renamingFrom = null;
	}

	static rename = async (sim: JuliaSimulation, name: string) => {
		const original = sim.name;

		try {
			sim.name = name;
			await simulationStore.rename(sim._id, name);
		}
		catch (err) {
			sim.name = original;
			throw err;
		}
	}

	// @action add = (simulation: Simulation) => {
	// 	const date = new Date();
	// 	return db.horizonAsPromised(horizon => horizon("simulations").insert(Object.assign({}, simulation, {createdTime: date, modifiedTime: date})));
	// }
	//
	// @action delete = (simulation: Simulation) => {
	// 	const date = new Date();
	// 	return db.horizonAsPromised(horizon => horizon("simulations").insert(Object.assign({}, simulation, {createdTime: date, modifiedTime: date})));
	// }

	static newQuery = async (sim: JuliaSimulation) => {
		site.busy     = true;
		const queryId = await queryStore.createQuerySessionDescriptor(`Untitled`, [sim._id], null, true);
		queryId && routing.push(routing.routeFor.query(queryId));
		//query.renamingFrom = 'sidebar';
		site.busy = false;
	}

	// onContextMenu = (e: React.MouseEvent<HTMLElement>, location: "sidebar" | "header" = "sidebar") => {
	// 	const {name} = this;
	//
	// 	ContextMenu.show(
	// 		<Menu>
	// 			<MenuItem text={`View '${name}'`} icon="document-open" onClick={() => this.navigateTo()}/>
	// 			<MenuItem text={`Query '${name}'`} icon="search" onClick={() => Simulation.newQuery(this)}/>
	// 			<MenuItem text="Rename Simulation" icon="edit" onClick={() => this.renamingFrom = location}/>
	// 			<MenuDivider/>
	// 			<MenuItem icon="trash" text={`Delete '${name}'`} onClick={() => Simulation.delete(this)}/>
	// 		</Menu>, {left: e.clientX - 8, top: e.clientY - 8});
	//
	// 	e.preventDefault();
	// }

	get isFavorite() { return settings.favorites.simulation.indexOf(this.id) != -1 }

	set isFavorite(value: boolean) {
		if (!value) {
			settings.favorites.simulation = settings.favorites.simulation.filter(id => id != this.id)
		}
		else {
			settings.favorites.simulation = [...settings.favorites.simulation, this.id];
		}
	}

	/* GUI Only */
	@observable isSelected = false;

	@computed get queries(): QueryDescriptor[] {
		return mobx.values(queryStore.descriptors).filter(v => v.simulationIds && v.simulationIds.find(id => id == this.id))
	}

	get displayPath() {
		let folder = "";

		if (this.dfsPath) {
			const slashIndex = this.dfsPath.lastIndexOf("/");
			if (slashIndex != -1)
				folder = this.dfsPath.substring(0, slashIndex + 1);
		}

		return folder + this.name;
	}

	static isRepository = (sim: JuliaSimulation) => sim?.sourceType == Simulation.SOURCE_TYPE.REPOSITORY;

	static isRSSimulation = (sim: JuliaSimulation) => sim?.sourceType == Simulation.SOURCE_TYPE.GEMS;

	static isGEMSBased = (sim: JuliaSimulation) => sim?.sourceType == Simulation.SOURCE_TYPE.GEMS || sim?.sourceType == Simulation.SOURCE_TYPE.FIRM;

	static editable = (sim: JuliaSimulation) => {
		return Simulation.isGEMSBased(sim) || Simulation.isRepository(sim);
	}

	get isRepository() { return Simulation.isRepository(this) }
	get isRSSimulation() { return Simulation.isRSSimulation(this) }
	get isGEMSBased() { return Simulation.isGEMSBased(this) }
	get editable() { return Simulation.editable(this) }
}
