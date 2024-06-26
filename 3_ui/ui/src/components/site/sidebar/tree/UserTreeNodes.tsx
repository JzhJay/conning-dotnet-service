import * as commonCss from '../SidebarPanel.css';
import * as css from './SidebarTree.css';
import type {JuliaUser} from 'stores';
import {api, user, settings, routing, Link, QueryDescriptor, mobx, ActiveTool} from 'stores';
import {action, autorun, computed, observable, reaction} from 'mobx';
import {SidebarTreeNode, SidebarTreeNodeType} from './SidebarTreeNode';


export class UserTreeNode extends SidebarTreeNode {
	constructor(public user: JuliaUser) {
		super({
			id:             user._id,
			label:          <Link to={routing.routeFor.user(user._id)}>{user.fullName}</Link>,
			//iconName:       'user',
			canRename:      false,
			type:           SidebarTreeNodeType.user,
			secondaryLabel: <img src={user.picture} className={commonCss.userPicture} />
		})

		// to: routing.routeFor.user(this.user.user_id)
	}

	get url() {
		return routing.routeFor.user(this.user._id);
	}
}

export class UsersNode extends SidebarTreeNode {
	constructor() {
		const {users: prefs} = settings.sidebar;

		super({id: 'Users', label: "Users", icon: 'user', canRename: false, type: SidebarTreeNodeType.folder})

		// reaction(() => api.site.activeTool.tool, tool => {
		// 	this.active = tool == ActiveTool.User;
		// });

		autorun(() => {
			const {users: loaded, loading} = user;

			if (loaded.size == 0) {
				this.childNodes = [
					new SidebarTreeNode({
						id:        'no-users',
						label:     <i>No Users Found</i>,
						canRename: false,
						type:      SidebarTreeNodeType.noneFound
					})
				];
			}
			else {
				this.childNodes = mobx.values(loaded).map(user => new UserTreeNode(user));
			}

			this.label      = <Link to={routing.routeFor.userBrowser}>Users ({loading ? <i>Loading</i> : loaded.size == 0 ? <i>None</i> : loaded.size})</Link>;
		})
	}

	get url() {
		return routing.routeFor.userBrowser;
	}
}
