import {observer} from 'mobx-react';

import {api, settings, SidebarView, sidebar, ActiveTool,SidebarViewMode, routing, SidebarPanelModel, reportStore} from 'stores';
import {sem, bp, dialogs, scrollIntoView, siteActions} from 'components';
import {Link} from "react-router";
import * as css from './SidebarPanel.css';
import {computed, reaction, autorun} from 'mobx';
import RoutePattern = ReactRouter.RoutePattern;
import { simulationStore } from "../../../stores/simulation";

interface MyProps {
	showChooser?: boolean;
	icon: React.ReactNode;
	title: string;
	active?: boolean;
	to?: RoutePattern;
	titleButtons?: React.ReactNode | React.ReactNode[];
}

@observer
export class SidebarPanel extends React.Component<MyProps, {}> {
	render() {
		const {props: {showChooser, to, active, icon, title, titleButtons}} = this;

		return (
			<sem.Menu.Item
				active={active}
				className={classNames(css.sidebarPanel)}>
				<sem.Menu.Header>
					{ showChooser
						? <SidebarPanelChooser icon={icon} title={title} titleButtons={titleButtons}/>
						: <Link to={to} className="ui fluid">{icon}{title}</Link> }

					{/*<Link className="ui fluid" to={api.Simulation.browserUrl}></Link>*/}


					<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
						{titleButtons}
					</div>
				</sem.Menu.Header>
				{this.props.children}
			</sem.Menu.Item>
		)
	}
}

@observer
export class SidebarPanelChooser extends React.Component<SidebarPanelModel, {}> {
	render() {
		const {title, icon} = this.props;

		const { site:        {activeTool} } = api;

		if (!activeTool) return null;

		const {renderMenuItems, tool} = activeTool;
		const appMenuItems            = activeTool.renderApplicationMenuItems && activeTool.renderApplicationMenuItems();

		return (
			<bp.Popover
				className={classNames('ui fluid', css.panelChooser)}
				interactionKind={bp.PopoverInteractionKind.HOVER}
				canEscapeKeyClose={true}
				content={
					<bp.Menu>
						{appMenuItems}

						<bp.MenuItem text="Query Tool" icon="search">
							<bp.Menu>
								<bp.MenuItem text="New Query" icon="document" onClick={() => dialogs.newQuery()}/>
								<bp.MenuItem text="Open Query" icon="folder-open" onClick={dialogs.openQuery}/>
								<bp.MenuItem text="Browse Queries..." icon="folder-close" onClick={() => routing.push(routing.routeFor.queryBrowser)}/>
							</bp.Menu>
						</bp.MenuItem>
						{/*<bp.MenuItem text="Query Browser" icon="search" onClick={() => routing.push(routing.routeFor.queryBrowser)}/>*/}
						<bp.MenuItem text="Simulations" icon="database">
							<bp.Menu>
								<bp.MenuItem text="Browse Simulations..." icon="folder-close" onClick={simulationStore.navigateToBrowser}/>
								<bp.MenuItem text="Import"
								          icon="database"
								          onClick={siteActions.showImportSimulationDialog}/>
							</bp.Menu>
						</bp.MenuItem>

						<bp.MenuItem text="Reports" icon="book">
							<bp.Menu>
								<bp.MenuItem text="New Report" icon="document" onClick={() => dialogs.newReport()}/>
								<bp.MenuItem text="Open Report" icon="folder-open" onClick={dialogs.openReport}/>
								<bp.MenuItem text="Browse Reports..." icon="folder-close" onClick={reportStore.navigateToBrowser}/>
							</bp.Menu>
						</bp.MenuItem>

						<bp.MenuDivider />
						<bp.MenuItem text="Users" icon="user" onClick={() => routing.push(routing.urls.userBrowser)} />
						<bp.MenuItem
							icon="cog"
							text="Settings"
							onClick={() => api.routing.push(api.routing.urls.preferences)}/>

						{/*<bp.MenuDivider />*/}
						{/*{currentUser && <bp.MenuItem icon="log-out" text={`Log out`}/> }*/}

						<bp.MenuDivider />

						<bp.MenuItem text="Show Sidebar Panels"
						             icon={sidebar.viewMode == SidebarViewMode.accordion ? 'tick' : 'blank'}
						             onClick={() => sidebar.viewMode = sidebar.viewMode == SidebarViewMode.accordion ? SidebarViewMode.chooser : SidebarViewMode.accordion }
						/>
					</bp.Menu>}>
				<bp.Button rightIcon="caret-down">
					{icon}
					{title}
				</bp.Button>
			</bp.Popover>
		);
	}
}