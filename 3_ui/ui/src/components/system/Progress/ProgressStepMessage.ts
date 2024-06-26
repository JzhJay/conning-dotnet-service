import { observable, computed, makeObservable } from 'mobx';

interface IProgressMessage {
	numerator?: number;
	denominator?: number;
	grade?: number;
	label?: string;
	description?: string;
	log?: string[];
}

export class ProgressStepMessage implements IProgressMessage {
	@observable numerator: number;
	@observable denominator: number;
	@observable grade: number;
	@observable label: string;
	@observable description: string;
	@observable log: string[];

	constructor(pm: IProgressMessage) {
        makeObservable(this);
        Object.assign(this, pm);
        this.log = this.log ? this.log : [];
    }

	@computed get isComplete() { return this.numerator == this.denominator}
}