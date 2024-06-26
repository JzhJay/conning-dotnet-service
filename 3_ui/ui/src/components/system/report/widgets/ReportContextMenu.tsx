import { ApplicationPage, QueryBuilder, QueryViewComponent, bp, LinkMenuItem, ReportCard } from 'components';
import type { SiteLocation } from 'stores';
import { utility, routing, settings, reportStore, site, appIcons, Report, ReportDescriptor, mobx } from 'stores';
import { observer } from 'mobx-react';
import { observable, autorun, reaction, computed, runInAction } from "mobx";
import * as React from "react";
import { JumpToReportItemMenuItem } from "./ReportPageContextMenu";
import { AppIcon } from "../../../widgets/AppIcon";

interface MyProps {
	report: Report | ReportDescriptor;
	location?: SiteLocation | 'card'
}

@observer
export class ReportContextMenu extends React.Component<MyProps, {}> {
	render() {
		const {location, report} = this.props;

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

			{location == 'header' && !report && (<div>
				<bp.MenuItem text="New Report" icon="document" onClick={() => site.actions.newReport()}/>
				{!routing.isActive(reportStore.browserUrl) && <LinkMenuItem href={reportStore.browserUrl} icon={'folder-open'} text='Browse...'/> }
				<bp.MenuItem icon='folder-shared-open' text='Open Recent...'>
					<bp.Menu>
						{reportStore.loadedReports.size == 0 && <bp.MenuItem text='No reports found.' className='italic' disabled />}
						{_.take(
							_.sortBy(mobx.values(reportStore.loadedReports), 'createdTime'),
							settings.maxRecentItems
						)
						  .map(r =>
							       <bp.Tooltip key={r.id}  position={bp.Position.RIGHT} popoverClassName={'no-padding'} content={<ReportCard isTooltip report={r}/>}>
								       <LinkMenuItem  href={r.clientUrl} icon="book" text={r.name}/>
							       </bp.Tooltip>
						  )}
					</bp.Menu>
				</bp.MenuItem>
			</div>).props.children}

			{ report && (<div>
				{location == 'header' && report instanceof Report && <JumpToReportItemMenuItem report={report}/> }
				{location == 'header' && report && <bp.MenuDivider/> }

				{location != 'builder' && report instanceof Report && <bp.MenuItem text={`Rename Report`} icon='edit' onClick={() => report.promptRename()} /> }
				<bp.MenuItem text='Open in New Tab' icon='link' onClick={() => utility.openInNewTab(report.clientUrl)} />

				<bp.MenuDivider />

				{/*<bp.MenuItem text='Rename' icon='edit' onClick={this.props.onRename} />*/}

				{report instanceof Report && <bp.MenuItem text={`Duplicate Report`} icon="duplicate" onClick={async () => {
					const newReport = await report.duplicate();
					newReport.navigateTo();
				}}/>}
				<bp.MenuItem text={`Delete '${report.name}'`} labelElement={<AppIcon icon={appIcons.report.delete} className="iconic-sm"/>} onClick={() => report.delete()}/>

				<bp.MenuDivider/>

				<bp.MenuItem text='Report Settings' icon='settings'>
					<bp.MenuItem text='Show Layout Tabs'
					             icon={settings.report.showLayoutTabs ? 'tick' : 'blank'}
					             onClick={() => settings.report.showLayoutTabs = !settings.report.showLayoutTabs} />
					<bp.MenuItem text='Show Toolbars'
					             icon={settings.report.showToolbars ? 'tick' : 'blank'}
					             onClick={() => settings.report.showToolbars = !settings.report.showToolbars} />
					<bp.MenuItem text='Show Query Sidebar'
					             icon={settings.report.showQuerySidebars ? 'tick' : 'blank'}
					             onClick={() => settings.report.showQuerySidebars = !settings.report.showQuerySidebars} />
				</bp.MenuItem>
			</div>).props.children}

		</bp.Menu>
	}
}