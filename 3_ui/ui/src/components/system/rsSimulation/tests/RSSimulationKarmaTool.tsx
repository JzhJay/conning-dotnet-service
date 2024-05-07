import {when} from 'mobx';
import {RSSimulation, rsSimulationStore, julia, Simulation, user, xhr} from 'stores';
import {RWRecalibration} from 'stores/rsSimulation/rwRecalibration/RWRecalibration';
import {sleep} from 'test';
import {BaseEventSource} from 'utility';

class RSSimulationKarmaTool {
	loadTimeout = 10 * 60 * 1000;

	public savedRSSimulation: RSSimulation = null;

	// for local testing. let not create new object every run.
	private testId;

	log = ( func:string, message:string, sim?:RSSimulation ) => {
		console.log(`[RSSimulationKarmaTool][${func}]${sim ? `[${sim._id}]` : "" } ${message}.`);
	}

	getRSSimulation = async (createNewSimulation: boolean = false): Promise<RSSimulation> => {

		if (this.savedRSSimulation ? true : (this.savedRSSimulation && !createNewSimulation && !this.testId)) {
			this.log("getRSSimulation",`return saved RS simulation`, this.savedRSSimulation);
			return this.savedRSSimulation;
		}

		let url = window.location.href;
		try {
			let rsSimulation = null;
			if (this.testId) {
				rsSimulation = new RSSimulation(this.testId, null, "GEMS", null);
				this.log("getRSSimulation",`load by test ID`, rsSimulation);
			} else {
				this.log("getRSSimulation",`create new one RS simulation`);
				await rsSimulationStore.createNewObject();

				rsSimulation = new RSSimulation(rsSimulationStore.currentSimulationId, null, "GEMS", null);
				this.log("getRSSimulation",`created`, rsSimulation);

				await sleep(1000);
				await rsSimulationKarmaTool.resetSse(rsSimulation, true, false);
			}

			setTimeout(() => {
				if (!rsSimulation.isLoaded) {
					rsSimulationKarmaTool.resetSse(rsSimulation, true, false);
				}
			}, 30 * 1000);

			await rsSimulation.loadExistingRSSimulation();
			await when(() => rsSimulation.isLoaded);
			this.log("getRSSimulation",`loaded`, rsSimulation);

			this.savedRSSimulation = rsSimulation;
			return rsSimulation;
		} finally {
			if (url != window.location.href) {
				history.replaceState(null, null, url);
			}
		}
	}

	getRecalibration = async (createNewRSSimulation: boolean = false): Promise<RWRecalibration> => {
		const rsSimulation = await this.getRSSimulation(createNewRSSimulation);
		rsSimulation.recalibration?.getRecalibration();
		await when(() => rsSimulation.recalibration?.isLoaded);

		setTimeout(() => {
			if (!rsSimulation.recalibration?.isLoaded) {
				rsSimulation.recalibration?.getRecalibration(true);
				rsSimulationKarmaTool.resetSse(rsSimulation, true, false);
			}
		}, 30 * 1000);

		this.log("getRecalibration",`loaded`, rsSimulation);
		return rsSimulation.recalibration;
	}

	resetSse = async (rsSimulation: RSSimulation, resetReact: boolean = true, resetJulia: boolean = true) => {
		if (!rsSimulation) {
			return;
		}
		const readyState = rsSimulation.eventSource?.es?.readyState;
		this.log("resetSse",`readyState:${readyState}`, rsSimulation);
		// resetJulia && await xhr.post(`${julia.url}/dev-only/sse/reset`, {key: rsSimulation._id});

		if (resetReact && (readyState == null || readyState >= 2)) {
			rsSimulation.eventSource?.dispose();
			rsSimulation.initEventSource();
		}
	}

	resetRecalibrationAxisOrganization = async (recalibration: RWRecalibration, updateTreeNode?: any) => {
		const axis = [ "economy", "model" ];
		await recalibration.getAxisOrganization();

		_.map(recalibration.axisOrganization.treeHierarchy, async e => {
			if (!_.some(axis, t => t == e)) {
				await recalibration.reorderAxis({axis: e, axisType: 'table', index: 0});
			}
		});

		_.map([
			...recalibration.axisOrganization.separateByDefault,
			...recalibration.axisOrganization.separateAlways
		], async e => {
			if (!_.some(axis, t => t == e)) {
				await recalibration.updateAxisCategory({axis: e, category: 'combine_by_default'});
			}
		});

		_.map(axis, async (e,i) => {
			await recalibration.reorderAxis({axis: e, axisType: 'tree', index: i});

			if (!_.some(recalibration.axisOrganization.separateByDefault, t => t == e)) {
				await recalibration.updateAxisCategory({axis: e, category: 'separate_by_default'});
			}
		});

		if (updateTreeNode) {
			await recalibration.updateTreeNode(updateTreeNode);
		}

		await recalibration.getRecalibration(true);

		// resetCombinatorialAddRowsUserInputs
		const { profile } = user;
		const newUserMetadata = _.merge({}, profile.userMetadata );
		_.set(newUserMetadata, `ui.rsSimulation.combinatorialAddRows`, {});

		await user.updateUserMetadata(newUserMetadata);
	}
}

export const rsSimulationKarmaTool = new RSSimulationKarmaTool();