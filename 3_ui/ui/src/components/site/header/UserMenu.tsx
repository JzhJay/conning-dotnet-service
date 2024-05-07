import {i18n, routing, site} from '../../../stores';
import * as css from './UserMenu.css'
import {bp, LinkMenuItem} from 'components';
import {user} from "stores";
import {observer} from 'mobx-react';
import {Menu, MenuDivider, MenuItem, Popover} from '@blueprintjs/core';

@observer
export class UserMenu extends React.Component<{}, {}> {
	render() {
		return (<Popover
				position={bp.Position.BOTTOM_RIGHT}
				interactionKind={bp.PopoverInteractionKind.CLICK}
				disabled={!user.isLoggedIn}
				className={classNames(css.userMenu, {[css.noProfile]: !user.currentUser})}
				popoverClassName={'header-popover'}
				canEscapeKeyClose={true}
				content={
					<Menu>
						{/*<bp.MenuItem text="Sidebar" icon={settings.sidebar.show ? 'tick' : 'blank'}*/}
						{/*onClick={() => settings.sidebar.show = !settings.sidebar.show}/>*/}

						{/*<bp.MenuDivider/>*/}

						<LinkMenuItem text={i18n.intl.formatMessage({defaultMessage: 'Profile', description: '[UserMenu] Profile'})} icon="user" href={routing.urls.profile}/>
						{/*<LinkMenuItem text="Preferences" icon="settings"*/}
						              {/*href={routing.urls.preferences}/>*/}
						<MenuDivider/>

						<MenuItem text={i18n.intl.formatMessage({defaultMessage: 'Sign-out', description: '[UserMenu] Sign-out'})} onClick={() => user.logout()}/>

					</Menu>}>

				{user.isLoggedIn
				 ? <bp.AnchorButton minimal text={user.currentUser ? user.currentUser.name : ''} rightIcon="caret-down"/>
				 : <bp.AnchorButton minimal text={`Login`} onClick={() => user.login()}/>
				}
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
