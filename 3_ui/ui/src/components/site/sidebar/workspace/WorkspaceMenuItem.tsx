import {observer} from 'mobx-react';

import {api, routing, site, user, org, ActiveTool} from 'stores';
import {Link} from "react-router";
import {Workspace} from 'stores/workspace';

import * as css from '../SidebarPanel.css';
import {dialogs, sem, bp, AvailableQueryViewDropdown} from 'components';

interface MyProps {
	workspace: Workspace;
	active?: boolean;
}

@observer
export class WorkspaceMenuItem extends React.Component<MyProps, {}> {
	render() {
		const {workspace: ws, active} = this.props;

		return <sem.Menu.Item active={active}>
			<Link
			      className="ui fluid"
			      to={api.workspace.route}>
				{ws.name}
			</Link>
		</sem.Menu.Item>
	}

}