import {ApplicationPage, QueryBuilder, QueryViewComponent, bp, QueryPanel, sem, SimulationCard, DropdownCycleButton} from 'components';
import type { SiteLocation } from 'stores';
import {utility, routing, settings, reportStore, site, appIcons, ActiveTool, Report, ReportItem, ReportPage, ReportQuery, Simulation, Link, ReportPageLayout} from 'stores';
import {observer} from 'mobx-react';
import {observable, autorun, reaction, computed, runInAction} from "mobx";
import * as React from "react";
import {AppIcon} from "../../../widgets/AppIcon";

interface MyProps {
	page: ReportPage;
	location?: SiteLocation
	onRename?: () => void;
}

const _JumpToReportItemMenuItem = observer((props: { report: Report }) => {
	const {report} = props;
	return <bp.MenuItem text='Jump to...' icon='folder-open'>
		<bp.MenuItem onClick={() => routing.push(report.clientUrl)} active={routing.isActive(report.clientUrl)}
		             text="Overview" icon="home"/>
		{report.pages.map(p => <bp.MenuItem key={p.id} onClick={() => routing.push(p.clientUrl)}
		                                    icon='document'
		                                    active={routing.isActive(p.clientUrl)}
		                                    text={p.label}/>)}
	</bp.MenuItem>
});
export const JumpToReportItemMenuItem = _JumpToReportItemMenuItem;

@observer
export class ReportPageContextMenu extends React.Component<MyProps, {}> {
	render() {
		const {onRename, location, page, page: {report}} = this.props;

		return <bp.Menu>
			{/*<div className={bp.Classes.BUTTON_GROUP}>*/}
			{/*Layout:*/}
			{/*{utility.enumerateEnum(ReportPageLayout)*/}
			{/*.filter(page.isLayoutValid)*/}
			{/*.map(l => <bp.Button key={l.toString()} active={l == page.layout}*/}
			{/*title={ReportPage.layoutDescriptors[l].label}*/}
			{/*icon={ReportPage.layoutDescriptors[l].iconName}*/}
			{/*onClick={() => page.setLayout(l)}/>)}*/}
			{/*</div>*/}

			{/*<bp.MenuDivider />*/}

			{location == 'header' && <bp.MenuDivider title={`Page ${page.index + 1} of ${report.pages.length}`}/>}

			{location == 'header' && <JumpToReportItemMenuItem report={report}/>}
			{location == 'header' && <bp.MenuDivider/>}

			{location == 'builder' && <bp.MenuItem text='Open Page' icon='link' onClick={() => page.navigateTo()}/>}
			<bp.MenuItem text='Open Page New Tab' icon='link' onClick={() => utility.openInNewTab(page.clientUrl)}/>

			<bp.MenuDivider/>

			{location == 'builder' && <bp.MenuItem text="New Report Page" icon="document" onClick={() => page.report.addPage(page.index)}/>}
			{location == 'builder' && <bp.MenuDivider/>}


			<bp.MenuItem text="New Query" icon="search" onClick={() => page.addReportQuery()}/>
			<bp.MenuItem text="New Text Block" icon="new-text-box" onClick={() => page.addText()}/>

			<bp.MenuDivider/>

			<bp.MenuItem text="Page Layout" icon="page-layout" shouldDismissPopover={false}>
				<bp.Menu>
					{utility.enumerateEnum(ReportPageLayout)
						.filter(page.isLayoutValid)
						.map(l => <bp.MenuItem key={l.toString()}
						                       text={ReportPage.layoutDescriptors[l].label}
						                       shouldDismissPopover={false}
						                       icon={l == page.layout ? 'tick' : 'blank'}
						                       onClick={() => page.setLayout(l)}/>)}
				</bp.Menu>
			</bp.MenuItem>

			<bp.MenuDivider/>

			<bp.MenuItem text='Report Settings' icon='settings'>
				<bp.MenuItem text='Show Layout Tabs'
				             icon={settings.report.showLayoutTabs ? 'tick' : 'blank'}
				             onClick={() => settings.report.showLayoutTabs = !settings.report.showLayoutTabs}/>
				<bp.MenuItem text='Show Toolbars'
				             icon={settings.report.showToolbars ? 'tick' : 'blank'}
				             onClick={() => settings.report.showToolbars = !settings.report.showToolbars}/>
				<bp.MenuItem text='Show Query Sidebar'
				             icon={settings.report.showQuerySidebars ? 'tick' : 'blank'}
				             onClick={() => settings.report.showQuerySidebars = !settings.report.showQuerySidebars}/>
			</bp.MenuItem>

			<bp.MenuDivider/>

			<bp.MenuItem text={`Rename Page`} icon='edit' onClick={() => onRename ? onRename() : page.promptRename()}/>

			<bp.MenuItem text="Duplicate Page" icon="duplicate" onClick={async () => {
				const newPage = await page.duplicate();
			}}/>

			{/*<bp.MenuItem text='Rename' icon='edit' onClick={this.props.onRename} />*/}

			<bp.MenuItem text="Delete Page" labelElement={<AppIcon icon={appIcons.report.delete} className="iconic-sm"/>} onClick={() => page.delete()}/>
		</bp.Menu>
	}
}

@observer
export class ReportPagesContextMenu extends React.Component<{ report: Report }, {}> {
	render() {
		const {report} = this.props;

		return <bp.Menu>
			<bp.MenuItem text="New Report Page" icon="document" onClick={() => report.addPage()}/>

			<bp.MenuDivider/>

			<bp.MenuItem text='Report Settings' icon='settings'>
				<bp.MenuItem text='Show Layout Tabs'
				             icon={settings.report.showLayoutTabs ? 'tick' : 'blank'}
				             onClick={() => settings.report.showLayoutTabs = !settings.report.showLayoutTabs}/>
				<bp.MenuItem text='Show Toolbars'
				             icon={settings.report.showToolbars ? 'tick' : 'blank'}
				             onClick={() => settings.report.showToolbars = !settings.report.showToolbars}/>
				<bp.MenuItem text='Show Query Sidebar'
				             icon={settings.report.showQuerySidebars ? 'tick' : 'blank'}
				             onClick={() => settings.report.showQuerySidebars = !settings.report.showQuerySidebars}/>
			</bp.MenuItem>
		</bp.Menu>
	}
}