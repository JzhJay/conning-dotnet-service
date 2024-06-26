import {appIcons} from 'stores';
import { action, observable, makeObservable } from 'mobx';
import {ItemConfig} from 'golden-layout';
import {routing} from '../routing';
import {site} from '../site';
import {xhr} from '../xhr';

class WorkspaceStore {
    @observable workspaces = observable.array<Workspace>();

    reset = () => {
		this.workspaces.clear();
	}

    newWorkspace = () => {
		this.workspaces.push({
			name: `New Workspace ${this.workspaces.length + 1}`
		})
	}

    constructor() {
        makeObservable(this);
    }

    get route() {
		return routing.urls.workspace;
	}
}

export class Workspace {
	name: string;

}

export const workspace = new WorkspaceStore();
