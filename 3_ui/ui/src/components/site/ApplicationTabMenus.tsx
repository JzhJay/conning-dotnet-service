import * as React from 'react';
import {IOBrowserMenu} from '../system/IO/IOContextMenu';
import {UserFileContextMenu} from '../system/UserFile/UserFileContextMenu';
import * as css from "./ApplicationContainer.css";

import {routing, site, settings, ActiveTool, appIcons, slugs, featureToggles, ioStore, IO} from 'stores'
import {observer} from 'mobx-react';
import {bp, siteActions, LinkMenuItem, ReportContextMenu, utility} from 'components';
import {simulationStore} from "../../stores/simulation";
import {QueryContextMenu} from "../system/query-tool/query-builder/QueryContextMenu";
import {AppIcon} from "../widgets/AppIcon";
import {MenuDivider} from '@blueprintjs/core';

export const tabPopoverProps = {
	position:         bp.Position.BOTTOM_LEFT,
	interactionKind:  bp.PopoverInteractionKind.HOVER,
	hoverOpenDelay:   400,
	hoverCloseDelay:  350,
	popoverClassName: css.tabMenu
}

function renderTabIcon(icon, title) {
	return <span style={{display: "flex"}}>
				<AppIcon key={icon.name} className="iconic-md" icon={icon} iconningSize={24}/>
				<span>{title}</span>
			</span>;
}

@observer
export class SimulationTabMenu extends React.Component<{}, {}> {
	render() {
		return <bp.Popover {...tabPopoverProps}
		                   content={
			                   <bp.Menu>
				                   <bp.MenuItem text="Import" icon="import" onClick={siteActions.showImportSimulationDialog}/>
				                   <LinkMenuItem href={simulationStore.browserUrl} icon={'folder-open'} text='Browse...'/>
				                   {featureToggles.cloudwatchLogViewer && <>
					                   <MenuDivider/>
					                   <LinkMenuItem href={`/${slugs.product}/${slugs.demo}/cloudwatch`} icon='th' text='CloudWatch Logs'/>
				                   </>}
			                   </bp.Menu>}>
			<bp.AnchorButton
				className={classNames(bp.Classes.MINIMAL)}
				href={routing.urls.simulationBrowser}
				onClick={(e) => {
					routing.push(routing.urls.simulationBrowser);
					e.preventDefault();
				}}>
				{renderTabIcon(appIcons.tools.simulations, 'Simulations')}
			</bp.AnchorButton>
		</bp.Popover>
	}
}

@observer
export class QueryTabMenu extends React.Component<{}, {}> {
	render() {
		return <bp.Popover {...tabPopoverProps}
		                   content={<QueryContextMenu location='header'
		                                              {...site.activeTool && site.activeTool.tool == ActiveTool.query && site.activeTool.headerContextMenuProps && site.activeTool.headerContextMenuProps()} />}>
			<bp.AnchorButton
				className={classNames(bp.Classes.MINIMAL)}
				href={routing.urls.query}
				onClick={(e) => {
					routing.push(routing.urls.query);
					e.preventDefault();
				}}>
				{renderTabIcon(appIcons.tools.queries, 'Queries')}
			</bp.AnchorButton>
		</bp.Popover>
	}
}

@observer
export class ReportTabMenu extends React.Component<{}, {}> {
	render() {
		return <bp.Popover {...tabPopoverProps}
		                   content={<ReportContextMenu location='header'
		                                               {...site.activeTool && site.activeTool.tool == ActiveTool.report && site.activeTool.headerContextMenuProps && site.activeTool.headerContextMenuProps()} />}>
			<bp.AnchorButton className={classNames(bp.Classes.MINIMAL)}
			                 href={routing.urls.reportBrowser}
			                 onClick={(e) => {
				                 routing.push(routing.urls.reportBrowser);
				                 e.preventDefault();
			                 }}>
				{renderTabIcon(appIcons.tools.reports, 'Reports')}
			</bp.AnchorButton>
		</bp.Popover>
	}
}

@observer
export class InvestmentOptimizationTabMenu extends React.Component<{}, {}> {
	render() {
		return <bp.Popover {...tabPopoverProps}
		                   content={<IOBrowserMenu/>}>
			<bp.AnchorButton
				className={classNames(bp.Classes.MINIMAL)}
				href={routing.urls.ioBrowser}
				onClick={(e) => {
					routing.push(routing.urls.ioBrowser);
					e.preventDefault();
				}}>
				{renderTabIcon(appIcons.tools.ios, utility.formatLabelText(IO.ObjectType))}
			</bp.AnchorButton>
		</bp.Popover>
	}
}
