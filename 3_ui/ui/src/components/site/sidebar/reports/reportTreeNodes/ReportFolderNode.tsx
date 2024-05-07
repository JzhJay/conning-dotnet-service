import type {IconName} from '@blueprintjs/core';
import { bp } from 'components';
import { Link, Report, appIcons, ReportItem, ReportDescriptor, ReportQuery, routing, viewDescriptors, api, settings, Simulation, simulationStore, reportStore, SimulationSlot } from 'stores';
import { autorun, computed, observable, makeObservable } from 'mobx';

import { ReportItemNode } from "./ReportItemNode";


export class FolderNode extends ReportItemNode {
    @observable icon : IconName = 'folder-close' as IconName;
    // if (icon == null && childNodes.length > 0) {
    // 	this.icon = isExpanded ? 'folder-open' : 'folder-closed';
    // }

	constructor(props) {
		super(props);

		makeObservable(this);
	}
}
