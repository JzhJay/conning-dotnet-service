import { IReportDescriptor, Report, ReportGuid } from "./";
import type {JuliaUser} from 'stores';
import {routing, user, reportStore, RestLinks, UserId} from 'stores';
import { action, observable, makeObservable } from "mobx";
import { ISimulationSlot } from "./SimulationSlot";

export class ReportDescriptor implements IReportDescriptor {
	constructor(o: IReportDescriptor) {
        makeObservable(this);
        Object.assign(this, o);
    }

	navigateTo = () => {
		routing.push(this.clientUrl)
	}

	@observable name: string;
	id: ReportGuid;
	links?: RestLinks;
	createdTime: Date = new Date();
	createdBy: UserId;
	@observable modifiedTime: Date = new Date();
	@observable simulationSlots?: ISimulationSlot[];

	get clientUrl() {
		return Report.clientUrlFor(this.id);
	}

	@action delete = () => {
		reportStore.delete(this.id)
	}

	get createdByUser(): JuliaUser {
		return user.users.get(this.createdBy)
	}
}
