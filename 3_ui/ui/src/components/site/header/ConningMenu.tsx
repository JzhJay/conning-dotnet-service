// import * as css from './SiteHeader.css'
//
// import { AppIcon, semanticMenu } from 'components';
// import { api, applicationIcons, iconUrls, icons } from "stores";
// import { observer } from 'mobx-react';
// import {routing} from 'stores/routing';
//
// interface StoreProps {
// 	currentReport?: Report;
// 	showSidebar?: boolean;
// 	recentReports?: ReportDescriptor[];
// 	showSecondaryToolbars?: boolean;
// }
//
// @observer
// export class ConningMenu extends React.Component<StoreProps, {}> {
// 	render() {
// 		const { currentReport }                      = this.props;
// 		const {db, julia} = api;
//
// 		const connected                                                                                        = julia.connected && db.connected;
// 		const { MenuItem, Menu, Divider }                                                                      = semanticMenu;
// 		const { currentUser }                                                                                  = api.site;
//
// 		return (
// 			<MenuItem dropdown={true} openOn={prefs.menuOpenOn}
// 					  className={classNames(css.conningMenu, {[css.connected]: connected})}>
//
// 				{/*<Icon className={css.iconicGrid} systemIcon={SystemIcon.iconicGrid} iconicDataState="three-up"/>*/}
// 				<InlineSVG
// 					className="logo icon"
// 					src={iconUrls.conningLogo}/>
//
// 				<Menu className="vertical">
// 					{/*{!connected ? <MenuItem header={true} menuItemLabel="Connection Issues"/> : null }*/}
// 					{/*{!julia.connected ? <MenuItem systemIcon={icons.semWarning}*/}
// 												 {/*menuItemLabel="ADVISE is not connected"*/}
// 												 {/*to={routing.urls.preferences}*/}
// 												 {/*title={`Host:  ${julia.hostname}`}/> : null}*/}
// 					{/*{!db.connected ? <MenuItem systemIcon={icons.semWarning}*/}
// 												   {/*menuItemLabel="Horizon is not connected"*/}
// 												   {/*to={routing.urls.preferences}*/}
// 												   {/*title={`Host:  ${db.horizonOptions.hostname}`}/> : null}*/}
// 					{/*{!connected ? <Divider/> : null }*/}
//
// 					<MenuItem header={true} menuItemLabel="System Tools"/>
// 					{/*<MenuItem menuItemLabel="Reports" systemIcon={applicationIcons.queryReport} to={routing.routeFor.reportBrowser}/>*/}
// 					<MenuItem menuItemLabel="Queries" systemIcon={applicationIcons.query} to={routing.routeFor.queryBrowser}/>
// 					<MenuItem menuItemLabel="Query Results" systemIcon={applicationIcons.queryResult} to={routing.routeFor.queryResultBrowser}/>
//
// 					{/*
// 					 {extraMenuItems ? <MenuDivider /> : null }
// 					 {extraMenuItems ? extraMenuItems() : null}
// 					 {extraMenuItems ? <MenuDivider /> : null }
// 					 */}
//
// 					{/*<MenuItem menuItemLabel={`Confirm Deletes`}*/}
// 					{/*checked={this.props.confirmDeleteActions}*/}
// 					{/*onClick={() =>dispatch(toggleConfirmDeleteActions())}/>*/}
//
// 					{/*<MenuDivider />*/}
// 					<MenuItem header={true} menuItemLabel="System Configuration"/>
// 					<MenuItem menuItemLabel={`Preferences`} systemIcon={applicationIcons.preferences}
// 							  to={api.routing.urls.preferences}/>
//
// 					{/*{NODE_ENV !== 'production' ? <MenuDivider /> : null }*/}
// 					{/*{NODE_ENV !== 'production' ? <MenuItem menuItemLabel={`Popout Redux Dev Tools`}*/}
// 					{/*systemIcon={SystemIcon.semCode}*/}
// 					{/*onClick={this.showDevToolsPopout}/> : null }*/}
//
// 					<Divider />
// 					<MenuItem header={true}
// 							  className={css.productMenuItem}
// 							  menuItemLabel={
//                                     <span>
//                                         {PRODUCT}<sup>®</sup> - v{VERSION}
//                                     </span>}/>
// 				</Menu>
// 			</MenuItem>
// 		);
// 	}
// }
