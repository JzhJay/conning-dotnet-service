import { action, computed, observable, makeObservable } from "mobx";
import type { SimulationGuid } from "stores";
import { simulationStore } from "stores";
import { Report } from "./";

export type SimulationSlotGuid = string;

export interface ISimulationSlot {
	id?: SimulationSlotGuid;
	name?: string;
	simulationId?: SimulationGuid;
}

export interface ISimulationSlotComponent {
	nameInput?: HTMLInputElement;
	simulationSelect?: any;
}

export class SimulationSlot implements ISimulationSlot {
	id = uuid.v4();
	@observable name : string;
	@observable simulationId : SimulationGuid;

	serializableFields = ['id', 'name', 'simulationId'];

	toJSON = () => {
		return _.pick(this, this.serializableFields);
	};

	constructor(public report: Report, slot?: ISimulationSlot) {
        makeObservable(this);
        Object.assign(this, slot);
    }

	@action delete = () => {
		// Remove this slot from any queries it is being used in

		this.report.querySlots.forEach(qs => {
			qs.simulationSlotIds = qs.simulationSlotIds.filter(id => id != this.id);
		})

		this.report.simulationSlots.remove(this);
	}


	@computed get simulation() {
		const {simulationId} = this;
		return simulationId ? simulationStore.simulations.get(simulationId) : null;
	}

	@computed get label() {
		const { name, report: { simulationSlots } } = this;
		return name ? name : `Simulation ${simulationSlots.indexOf(this) + 1}`;
	}

	@action promptRename = async () => {
		const newName = prompt(`Rename '${this.label}' to:`);
		this.name = newName;
	}

	@computed
	get errors() {
		return {
			simulation: this.simulationId == null
		}
	}

	@computed
	get index() {
		return this.report.simulationSlots.findIndex(s => s == this);
	}

	@observable.ref component : ISimulationSlotComponent;
}

