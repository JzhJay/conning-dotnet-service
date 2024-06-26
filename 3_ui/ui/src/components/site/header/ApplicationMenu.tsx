import * as React from 'react';
import {appIcons, ClimateRiskAnalysis, featureToggles, rsSimulationStore, i18n, IO, Query, routing, Simulation, site, slugs, UserFile} from '../../../stores';
import {
	AppIcon,
	bp,
	ControlPanelPage,
	dialogs,
	InstallerDownloadPage,
	LinkMenuItem,
	NewSimulationDialog,
	NotificationSettingsPage, OmdbAdminPage,
	SoftwareNoticesPage,
} from 'components';
import {user} from "stores";
import {observer} from 'mobx-react'
import {Menu, MenuDivider, MenuItem, Popover} from '@blueprintjs/core';

@observer
export class Applicationenu extends React.Component<{}, {}> {

	render() {
		const simulationUseCases = rsSimulationStore.useCases;
		const showIO = user.isIOLicensed;
		const showCRA = user.isCRALicensed;
		const enableGEMSOnlyMode = user.enableGEMSOnlyMode;
		const isOnPrem = site.isOnPrem;

		return (<Popover
				position={bp.Position.BOTTOM_RIGHT}
				interactionKind={bp.PopoverInteractionKind.CLICK}
				disabled={!user.isLoggedIn}
				popoverClassName={'header-popover'}
				canEscapeKeyClose={true}
				content={
					<Menu>
						<MenuDivider title={i18n.intl.formatMessage({defaultMessage: "Browse", description: "[ApplicationMenu] Indicates menu sub-group title - Browse objects"})} />
						<MenuItem onClick={() => routing.push(routing.urls.simulationBrowser)} icon={<AppIcon icon={appIcons.tools.simulations}/> } text={Simulation.OBJECT_NAME_MULTI}/>
						{_.map(simulationUseCases, useCase =>
							<MenuItem key={`useCase_${useCase.name}_browser`} onClick={() => routing.push(`${routing.urls.simulationBrowser}?useCase=${useCase.name}`)} icon={<AppIcon icon={useCase.icon}/> } text={useCase.title}/>
						)}
						<MenuItem onClick={() => routing.push(routing.urls.query)} icon={<AppIcon icon={appIcons.tools.queries} style={{width: 20, height: 20}}/> } text={Query.OBJECT_NAME_MULTI}/>
						{showIO && <MenuItem onClick={() => routing.push(routing.urls.ioBrowser)} icon={<AppIcon icon={appIcons.tools.ios}/> } text={IO.OBJECT_NAME_MULTI}/>}
						{showCRA && <MenuItem onClick={() => routing.push(routing.urls.climateRiskAnalysisBrowser)} icon={<AppIcon icon={appIcons.tools.climateRiskAnalyses} style={{width: 20, height: 20}}/> } text={ClimateRiskAnalysis.OBJECT_NAME_MULTI}/>}
						<MenuItem onClick={() => routing.push(routing.urls.userFileBrowser)} icon={<AppIcon icon={appIcons.tools.userFiles} style={{width: 20, height: 20}}/> } text={UserFile.OBJECT_NAME_MULTI}/>

						<MenuDivider title={i18n.intl.formatMessage({defaultMessage: "New", description: "[ApplicationMenu] Indicates menu sub-group title - create new object"})} />
						<MenuItem onClick={() => site.setDialogFn(() => <NewSimulationDialog type={user.enableGEMSOnlyMode? "GEMS" : user.isESGLicensed ? null : 'Repository'}/>)}
						          icon={<AppIcon icon={appIcons.tools.simulations}/>} text={Simulation.OBJECT_NAME_SINGLE}/>
						{_.map(simulationUseCases, useCase =>
							<MenuItem key={`useCase_${useCase.name}_create`} onClick={() => rsSimulationStore.createNewObject("FIRM", "Untitled", null, null, null, null, useCase.name)} icon={<AppIcon icon={useCase.icon}/> } text={useCase.title}/>
						)}
						<MenuItem onClick={() => dialogs.newQuery()} icon={<AppIcon icon={appIcons.tools.queries} style={{width: 20, height: 20}}/>} text={Query.OBJECT_NAME_SINGLE}/>
						{showIO && <MenuItem onClick={() => dialogs.newIO()} icon={<AppIcon icon={appIcons.tools.ios}/>} text={IO.OBJECT_NAME_SINGLE}/>}
						{showCRA && <MenuItem onClick={() => dialogs.newClimateRiskAnalysis()} icon={<AppIcon icon={appIcons.tools.climateRiskAnalyses} style={{width: 20, height: 20}}/>} text={ClimateRiskAnalysis.OBJECT_NAME_SINGLE}/>}
						<MenuItem onClick={() => dialogs.newUserFile()} icon={<AppIcon icon={appIcons.tools.userFiles} style={{width: 20, height: 20}}/> } text={UserFile.OBJECT_NAME_SINGLE}/>

						<MenuDivider title={i18n.intl.formatMessage({defaultMessage: "View", description: "[ApplicationMenu] Indicates menu sub-group title - View"})} />
						{!site.isMultiTenant && <LinkMenuItem text={ControlPanelPage.APPLICATION_TITLE} icon="control" href={routing.urls.controlPanel}/>}
						{!isOnPrem && <LinkMenuItem text={NotificationSettingsPage.APPLICATION_TITLE} icon={appIcons.tools.notifications.name} href={routing.urls.notifications}/>}
						{(!enableGEMSOnlyMode && !isOnPrem) && <LinkMenuItem text={i18n.intl.formatMessage({defaultMessage: "Billing", description: "[ApplicationMenu] MenuDivider - Browse Billing Report"})}  icon={appIcons.tools.billing.name} href={routing.urls.billing}/>}
						<LinkMenuItem text={OmdbAdminPage.APPLICATION_TITLE_LONG} icon='database' href={routing.urls.objectSchemasPage}/>

						{!site.isMultiTenant && !site.isOnPrem && <>
							<MenuDivider title={i18n.intl.formatMessage({defaultMessage: "Download", description: "[ApplicationMenu] Indicates menu sub-group title - Download"})}/>
							{user.isLoggedIn && <LinkMenuItem href={routing.urls.installer} text={InstallerDownloadPage.APPLICATION_TITLE} icon="download" />}
						</>}

						<MenuDivider title={i18n.intl.formatMessage({defaultMessage: "Support", description: "[ApplicationMenu] Indicates menu sub-group title - Support"})} />
						<MenuItem onClick={() => dialogs.about()} icon="info-sign" text={i18n.intl.formatMessage({defaultMessage: "About {productName}", description: "[ApplicationMenu] Indicates menu item which show a dialog with some product information"}, {productName: site.productName})}/>
						<MenuItem onClick={() => dialogs.support()} icon="help" text={i18n.intl.formatMessage({defaultMessage: "Contact {productName} Support", description: "[ApplicationMenu] Indicates menu item which show the ways to get the supports"}, {productName: site.productName})}/>

						<MenuDivider title={i18n.intl.formatMessage({defaultMessage: "Links", description: "[ApplicationMenu] Indicates menu sub-group title - Links"})} />
						<MenuItem onClick={() => routing.push(routing.urls.noticesPage)} text={SoftwareNoticesPage.APPLICATION_TITLE} />
						<MenuItem text="Conning Documentation Library" href={"https://softwaredoclibrary.conning.com"}/>
						<MenuItem text="Conning.com" href={"https://conning.com"}/>

						{DEV_BUILD && <>
							<MenuDivider title="System Administration"/>
							<LinkMenuItem href={routing.urls.devOnly} icon='ninja' text='Developer Only'/>
							{featureToggles.cloudwatchLogViewer && <LinkMenuItem href={`/${slugs.product}/${slugs.demo}/cloudwatch`} icon='th' text='CloudWatch Logs'/>}
							<LinkMenuItem href={`/${slugs.product}/${slugs.demo}/${slugs.omdb}`} icon='database' text='OMDB Catalog'/>
							<LinkMenuItem href={routing.urls.iconography} icon="paragraph" text="Iconography"/>

							{/*<LinkMenuItem href={`/${slugs.admin}/${slugs.migrateSchema}`} icon='dashboard' text='Migrate Schema'/>*/}
						</>}

					</Menu>}>

				{<bp.AnchorButton minimal icon='menu'/>}
			</Popover>
		);

		// return (<div className={classNames(css.userMenu, {[css.noProfile]: !currentUser})}>
		// 	{currentUser
		// 		? <MenuItem key="user-menu"
		// 		            menuItemLabel={currentUser.email}
		// 		            title={currentUser.name}>
		//
		// 		 {/* Uncomment if you want an image for the user
		// 		  hideDropdownIcon={true}
		// 		  menuItemLabel={
		// 		  <span className={css.userImage}
		// 		  style={{backgroundImage:`url(${currentUser.picture})`}}
		// 		  title={currentUser.name} />}*/}
		//
		//
		// 		 {/*<div className="user-photo" style={{backgroundImage: `url('${userProfile.picture}')`}} title={`${userProfile.email}`}/>*/}
		// 		 {/*<MenuItem dropdownAction={DropdownAction.nothing} menuItemLabel={`${userProfile.email}`} />*/}
		// 		 {/*<MenuDivider />*/}
		// 		 {/*<MenuItem menuItemLabel={`Your profile`} to="/user/profile" />*/}
		// 		 <MenuItem menuItemLabel={`Sign-out ${currentUser.email}`}
		// 		           onClick={api.site.auth.logout}/>
		// 	 </MenuItem>
		// 		: auth.isLoggedIn ? <MenuItem key="loading-user-info" menuItemLabel={`Loading...`}/>
		// 		 : <MenuItem key="login-menu" menuItemLabel={`Login to ${PRODUCT}`} to={api.routing.urls.login} onClick={api.site.auth.login}/>
		// 	}
		// </div>)
	}
}

/*
 {userProfile == null ? null : [
 <div key="profile-header" className="ui item header" style={{textTransform:'none'}}>
 <span className="text" style={{flex:'1 1 auto'}}>{userProfile.name}</span>
 <div className={css.userPhoto} style={{backgroundImage: `url('${userProfile.picture}')`}} title={`${userProfile.email}`}/>
 </div>,
 <SemanticMenuItem key="your-profile" menuItemLabel={`Edit Profile`}
 to={routing.urls.preferences}/>,
 <SemanticMenuItem key="sign-out" menuItemLabel={`Sign-out`}
 onClick={() => dispatch(auth.signOut())}/>
 ]}*/