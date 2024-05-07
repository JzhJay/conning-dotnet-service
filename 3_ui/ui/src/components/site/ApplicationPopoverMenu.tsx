import * as css from './ApplicationPopoverMenu.css'
import {site, user, routing, ActiveTool, simulationStore, queryStore, utility, ioStore, userFileStore, climateRiskAnalysisStore} from 'stores';
import { LinkMenuItem, bp} from 'components';
import { siteActions } from '../';
import {appIcons} from 'stores';
import { observer } from 'mobx-react';
import type { IApplicationIcon } from "../../stores/site/iconography/icons";
import { IconButton } from "../blueprintjs/IconButton";
import {Popover} from '@blueprintjs/core';

interface Tool {
	text?:string
	icon?:IApplicationIcon
	href?:string
}

const bpTools:{[id:number]:Tool} = {
	[ActiveTool.query]:       { text: 'Queries', icon: appIcons.tools.queries, href: queryStore.browserUrl() },
	[ActiveTool.report]:      { text: 'Reports', icon: appIcons.tools.reports, href: routing.routeFor.reportBrowser },
	[ActiveTool.simulation]:  { text: 'Simulations', icon: appIcons.tools.simulations, href: simulationStore.browserUrl },
	[ActiveTool.io]:          { text: 'Allocation Optimizations', icon: appIcons.tools.ios, href: ioStore.browserUrl },
	[ActiveTool.userFile]:    { text: 'User Files', icon: appIcons.tools.userFiles, href: userFileStore.browserUrl },
	[ActiveTool.climateRiskAnalysis]:    { text: 'Climate Risk Analyses', icon: appIcons.tools.climateRiskAnalyses, href: climateRiskAnalysisStore.browserUrl },
	[ActiveTool.preferences]: { text: 'Preferences', icon: appIcons.tools.settings,  href: routing.urls.preferences },
	[ActiveTool.user]:        { text: 'Users', icon: appIcons.tools.user, href: routing.urls.userBrowser },
	[ActiveTool.notifications]: {text: 'Notification Settings', icon: appIcons.tools.notifications, href: routing.urls.notifications},
}

// _.values(bpTools).forEach(v => {
// 	v['onClick'] = (e) => {
// 		routing.push(v['href'])
// 		e.preventDefault();
// 	}
// })

@observer
export class ApplicationPopoverMenu extends React.Component<{ className?: string, inSidebar?: boolean, disabled?: boolean, icon?: IApplicationIcon }, {}> {
	render() {
		const { currentUser, settings, settings: { sidebar } } = user;
		const { activeTool } = site;

		const appMenuItems = activeTool && activeTool.renderApplicationMenuItems && activeTool.renderApplicationMenuItems();
		const extraSettings = activeTool && activeTool.renderExtraSettingsMenuItems && activeTool.renderExtraSettingsMenuItems();
		const { maxRecentItems } = settings;

		//console.log(extraSettings);

		const { inSidebar, className } = this.props;

		const toolProps:Tool = inSidebar ? {} : bpTools[activeTool && activeTool.tool != null ? activeTool.tool : ActiveTool.preferences];

		if (toolProps == null && activeTool && activeTool.tool) {
			console.warn(`No settings found for tool ${ActiveTool[activeTool.tool]}`);
		}

		const buttonText = activeTool && activeTool.applicationButtonText ? activeTool.applicationButtonText() : toolProps ? toolProps['text'] : '';
		const icon = this.props.icon ? this.props.icon : !_.isEmpty(toolProps) && toolProps.icon;

		return (
			<Popover
				className={classNames(css.root, className)}
				onOpened={this.onPopoverDidOpen}
				position={bp.Position.BOTTOM_LEFT}
				minimal
				disabled={this.props.disabled}
				hoverOpenDelay={300} hoverCloseDelay={600}
				interactionKind={bp.PopoverInteractionKind.CLICK}
				popoverClassName={classNames(css.popover, utility.doNotAutocloseClassname)}
				canEscapeKeyClose
				content={<BlueprintApplicationMenu appMenuItems={appMenuItems} extraSettings={extraSettings}/>}>
				<IconButton className={classNames(css.title, bp.Classes.MINIMAL)} icon={icon} iconicSize="md" text={buttonText} rightIcon="caret-down" disabled={this.props.disabled}/>
			</Popover>
		);
	}

	onPopoverDidOpen = () => {
		const $popover = $(`.${css.popover}`);
		const $button = $(ReactDOM.findDOMNode(this)).find('.bp3-button.bp3-minimal');

		$popover.css('min-width', $button.outerWidth() + 2);
	}
}

class BlueprintApplicationMenu extends React.Component<{ appMenuItems: React.ReactNode[] | React.ReactNode, extraSettings: React.ReactNode[] | React.ReactNode }, {}> {
	render() {
		const { appMenuItems, extraSettings } = this.props;
		const { activeTool } = site;

		const tools = bpTools;
		return <bp.Menu>
			{appMenuItems}

			{(activeTool.tool == ActiveTool.preferences || activeTool.tool == ActiveTool.user || activeTool.tool == ActiveTool.notifications) && <SettingsMenuItems /> }
		</bp.Menu>
	}
}

const SettingsMenuItems = () => {
	return <bp.Menu>
		<LinkMenuItem icon="wrench" href={routing.urls.preferences} text="Preferences"/>
		<LinkMenuItem icon="document" href={routing.urls.releaseNotes} text="Release Notes"/>
		<LinkMenuItem href={routing.urls.userBrowser} icon="user" text="Users"/>
		{DEV_BUILD && <LinkMenuItem href={routing.urls.iconography} icon="paragraph" text="Iconography"/> }
	</bp.Menu>
}
