import {observable, computed, reaction, toJS, autorun} from 'mobx';

export class OrganizationStore {
	name = 'Aetna';
	label = null;
}

export const org = new OrganizationStore();
