import {settings, user, SidebarViewMode} from 'stores';
import { observable, action, reaction, computed, runInAction, makeObservable } from 'mobx';

export enum SidebarView { query, queryResult, simulation, Users, tree, report, workspace, ActiveWorkspace, admin }

export interface SidebarPanel {
	content: React.ReactNode;
}


export class SidebarStore {
    @observable currentView : SidebarView = SidebarView.query;

    minWidth                 = 275;
    maxWidth                 = 600;
    defaultWidth             = 325;
    resizerWidth = 3;
    @observable isDragging   = false;

    constructor() {
        makeObservable(this);
    }

    get viewMode() { return this.settings.viewMode }
    set viewMode(value: SidebarViewMode) {this.settings.viewMode = value}
    get show() { return this.settings.show && user.isLoggedIn }
    get width() { return this.settings.width }
    get settings() { return settings.sidebar}
}

export const sidebar = new SidebarStore();
