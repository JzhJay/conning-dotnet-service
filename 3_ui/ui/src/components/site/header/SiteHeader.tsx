import screenfull from 'screenfull';
import {Applicationenu} from './ApplicationMenu';
import * as css from "./SiteHeader.css";
import {Classes, Position, AnchorButton, Tooltip} from "@blueprintjs/core";
import {ConningLogo, UserMenu} from './';
import {site, api, routing} from 'stores';
import {observer} from 'mobx-react';
import {bp} from 'components';
import { user } from "../../../stores/user";

@observer
export class SiteHeader extends React.Component<{}, {}> {
	render() {
		const {site: {activeTool}, user: {settings: {sidebar}}, routing, julia: {connected}} = api;

		let headerToolbarItems      = activeTool && activeTool.renderHeaderToolbarItems && activeTool.renderHeaderToolbarItems();
		let headerToolbarItemsRight = activeTool && activeTool.renderHeaderToolbarItemsRight && activeTool.renderHeaderToolbarItemsRight();

		const navigationButtons = () =>
			<div className={classNames(Classes.BUTTON_GROUP, Classes.MINIMAL, css.navButtons)}>
				<Tooltip position={Position.BOTTOM} content="Go Back">
					<AnchorButton
						icon="arrow-left"
						onClick={() => routing.history.goBack()}/>
				</Tooltip>

				<Tooltip position={Position.BOTTOM} content="Go Forward">
					<AnchorButton
						icon="arrow-right"
						onClick={() => routing.history.goForward()}/>
				</Tooltip>
			</div>;

		return (<nav className={classNames(Classes.NAVBAR, css.navbar)}
		             style={{display: 'flex', zIndex: 20, overflow: 'hidden'}}>
			<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)} style={{flexGrow: 1, paddingLeft: 0}}>
				<div className={css.logoContainer}>
					<ConningLogo />

					<div className="fluid" />
					{site.isInElectron && navigationButtons() }
				</div>

				{/*<ToggleSidebarButton className={css.sidebarToggle}/>*/}

				{/*{site.isInElectron && navigationButtons() }*/}
				{/*{site.isInElectron && !sidebar.show && <div className={bp.Classes.NAVBAR_DIVIDER}/> }*/}


				{/*<QueryToolPopoverMenu />*/}
				{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}

				{/*<KuiApplicationMenu />*/}

				{/*<ReportPopoverMenu />*/}
				{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}
				{activeTool && activeTool.renderHeaderToolbarItems && activeTool.renderHeaderToolbarItems()}
				{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}

			</div>

			{ screenfull.isEnabled && <div className={classNames(Classes.NAVBAR_HEADING, css.titleNavbarHeading)} style={{margin: '0 auto'}} onDoubleClick={() => screenfull.isEnabled && screenfull.toggle()}>
				{/*<DocumentTitle />*/}
				{site.productName}
			</div> }

			<div className={classNames(Classes.NAVBAR_GROUP, Classes.ALIGN_RIGHT)}>
				{/*<ApplicationMenuDropdown />*/}

				{/*<ApplicationPopoverMenu className={css.appMenu}/>*/}

				{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}

				{headerToolbarItemsRight}
				{headerToolbarItemsRight && <span className={bp.Classes.NAVBAR_DIVIDER}/>}


				{/*<Tooltip position={Position.BOTTOM} content={julia.connected ? 'Connected to ADVISE+' : "Not connected.  (Why?)  - Todo"}>*/}
				{/*/!*<AnchorButton className={classNames("pt-minimal", css.connectionStatus, {[css.connected]: julia.connected})} icon="cloud" />*!/*/}
				{/*<AnchorButton className={classNames("pt-minimal", css.connectionStatus, {[css.connected]: connected})} icon={connected ? 'pulse' : 'warning'}/>*/}
				{/*</Tooltip>*/}

				{/*<Tooltip position={Position.BOTTOM} content="Notifications"><button className="pt-button pt-minimal pt-icon-notifications"/></Tooltip>*/}
				{/*<button className="pt-button pt-minimal pt-icon-user"/>*/}

				{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}

				{/*<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>*/}
				{/*/!*<Tooltip content="Reset the Query to the Initial State" position={Position.BOTTOM_RIGHT}>*!/*/}
				{/*/!*<Button icon="step-backward"/>*!/*/}
				{/*/!*</Tooltip>*!/*/}

				{/*<Tooltip content={`Query 197 variables`} position={Position.BOTTOM}>*/}
				{/*/!*<a className="pt-button pt-icon-play" role="button">Run Query</a>*!/*/}
				{/*<Button minimal icon="play"/>*/}
				{/*</Tooltip>*/}
				{/*</div>*/}

				{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}

				{/*<ApplicationMenu />*/}
				{/*<button className="pt-button pt-minimal pt-icon-database">Simulations</button>*/}
				{/*<button className="pt-button pt-minimal pt-active pt-icon-search">Query Tool</button>*/}
				{/*<span className={bp.Classes.NAVBAR_DIVIDER}></span>*/}
				{/*{!IS_PROD ? <JuliaServerChooser /> : null }*/}


				{/*<ToggleFullScreenButton />*/}

				{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}

				{user.isLoggedIn && <UserMenu /> }
				{user.isLoggedIn && <Applicationenu/>}
			</div>
		</nav>);
	}
}