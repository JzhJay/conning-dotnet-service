import { bp, QueryPanel, sem, SimulationCard, DropdownCycleButton } from 'components';
import type { SiteLocation } from 'stores';
import { utility, routing, settings, reportStore, site, appIcons, ActiveTool, Report, SimulationSlot, ReportPage, ReportQuery, Simulation, Link, ReportPageLayout } from 'stores';
import { observer } from 'mobx-react';
import { observable, autorun, reaction, computed, runInAction } from "mobx";
import * as React from "react";

interface MyProps {
	slot: SimulationSlot;
	location?: SiteLocation
}

@observer
export class ReportSimulationSlotContextMenu extends React.Component<MyProps, {}> {
	render() {
		const {location, slot, slot: {report}} = this.props;

		return <bp.Menu>
			{location != 'builder' && <bp.MenuItem text={`Rename`} icon='edit' onClick={() => slot.promptRename()} /> }

			<bp.MenuItem text="Delete" icon="trash" onClick={() => slot.delete()}/>
		</bp.Menu>
	}
}