import { ApplicationPage, QueryBuilder, QueryViewComponent, bp } from 'components';
import type { SiteLocation } from 'stores'; 
import { reportStore, site, appIcons, ReportText, utility, settings } from 'stores';
import { observer } from 'mobx-react';
import { observable, autorun, reaction, computed, runInAction } from "mobx";
import * as React from "react";
import { ReportLayoutManager } from "../detailPane/ReportLayoutManager";
import { AppIcon } from "../../../widgets/AppIcon";

interface MyProps {
	reportText: ReportText;
	location?: SiteLocation
	layoutManager?: ReportLayoutManager;
}

@observer
export class ReportTextContextMenu extends React.Component<MyProps, {}> {
	render() {
		const {location, reportText, reportText: {report}, layoutManager} = this.props;
		const allowLayoutDuplicating = reportText && layoutManager;

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

			{allowLayoutDuplicating && <bp.MenuItem text="Duplicate Horizontally" icon="arrows-horizontal" onClick={e => layoutManager.onDuplicateView(reportText,'right') }/> }
			{allowLayoutDuplicating && <bp.MenuItem text="Duplicate Vertically" icon="arrows-vertical" onClick={e => layoutManager.onDuplicateView(reportText, 'down') } /> }
			{allowLayoutDuplicating && <bp.MenuDivider /> }

			<bp.MenuItem text='Open in New Tab' icon='link' onClick={() => utility.openInNewTab(reportText.clientUrl)} />
			<bp.MenuDivider />
			<bp.MenuItem text='Rename' icon='edit' onClick={() => reportText.promptRename()} />

			<bp.MenuItem text="Duplicate" icon="duplicate" onClick={async () => {
				await reportText.duplicate();
			}}/>
			<bp.MenuItem text="Delete" labelElement={<AppIcon icon={appIcons.report.delete} className="iconic-sm"/>} onClick={() => reportText.delete()}/>

			<bp.MenuDivider />
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
		</bp.Menu>
	}
}