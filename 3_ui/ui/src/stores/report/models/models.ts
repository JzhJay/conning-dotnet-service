import type {QueryViewName, ChartType} from 'stores';
import {QueryOptions, RestLinks, Simulation} from 'stores';
import {Report, ReportQuery, ReportItem} from './';
import {action, computed, observable} from 'mobx';
import {ItemConfig} from "golden-layout";

import { ISimulationSlot } from "./SimulationSlot";
import { IReportPage } from "./ReportPage";

export type MoveTarget = void | "above" | "inside" | "below";

export type DuplicateDirection = "down" | "right" | "tab";
export type ReportItemType = "page" | 'folder' | 'report' | 'querySlot' | 'query';

export interface IReportItemSerializable {
	id?: string;
	type?: ReportItemType | string;
	children?: IReportItemSerializable[];
	name?: string;
	expanded?: boolean;
	includeInExport?: boolean;
	isPoppedOut?: boolean;
	layout?: string;
	goldenLayoutConfig?: string;
	createdTime?: Date;
	modifiedTime?: Date;
}

export interface ReportLayoutManagerController {
    setPageLayout?: {
        tabs?: (item: ReportItem) => void;
        horizontal?: (item: ReportItem) => void;
        vertical?: (item: ReportItem) => void;
        masterDetail?: (item: ReportItem) => void;
        detailMaster?: (item: ReportItem) => void;
        twobyTwo?: (item: ReportItem) => void;
    };
    onCloneView?: (originalView: ReportQuery, clonedView: ReportQuery, direction: DuplicateDirection) => void;
    onDeleteReportItem?: (item: ReportItem, parent: ReportItem) => void;
    onAddReportItem?: (item: ReportItem, parent: ReportItem) => void;
    onUnlinkReportItem?: (originalId: string, item: ReportItem) => void;
}

export type ReportGuid = string;

export interface IReportDescriptor {
    name: string;
    id: ReportGuid;
    links?: RestLinks;
	createdTime?: Date;
    modifiedTime?: Date;
}

export type Color = string;


export interface QueryViewUiDescriptor {
    name: QueryViewName;
    label: string;
    semRotated?: 'clockwise' | 'counterclockwise'
    chartType?: ChartType
    hasSecondaryToolbar?: boolean;
    ordinal?: number;
    hide?: boolean;
}

export interface SelectableQueryView extends QueryViewUiDescriptor {
	available: boolean;
	selected: boolean;
}

// export class QueryViewInstance implements QueryView {
//     constructor(config?: ReportQuery) {
//         Object.assign(this, config);
//
//         if (!this.userOptions['query']) {
//             this.userOptions['query'] = _.clone(defaultQueryOptions);
//         }
//
//         //if (!this.userOptions[this.view])
//         //    this.userOptions[this.view] = QueryView.defaultChartOptions
//     }
//
//     //static defaultChartOptions = defaultChartOptions;
//
//     // We need an id to have a key for react as two views can have the same backend guid
//
//     /**
//      * key differs from guid in that a report can have two items on the same page pointing to the same backend GUID (but in different views or configurations)
//      * key is out unique key for react
//      */
//     //key:ViewID;
//
//     name: string;
//     queryId                       = null;
//     queryResultId                 = null;
//     key: string;
//     showSettings                  = true;
//     type: ReportItemType          = 'view';
//     viewName: QueryViewName;
//     report: () => Report;
//     isPoppedOut                   = false;
//     _simulationIds: Array<string> = null;
//     get simulationIds() { return this._simulationIds}
//
//     _hidden = false;
//
//     userOptions: {[key: string]: QueryViewUserOptions} = {};//Object.assign({}, defaultChartOptions);
// }


export interface IQueryString {
    report?: string;
    selectedItem?: string;
    isSidebarPinned?: string;

    // Create report from views
    createReportFromViewList?: boolean;
    queryResultId?: string;
    viewNames?: string;
}
