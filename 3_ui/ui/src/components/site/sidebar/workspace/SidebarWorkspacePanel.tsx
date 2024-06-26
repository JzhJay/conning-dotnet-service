import {observer} from 'mobx-react';

import {api, user, org, ActiveTool} from 'stores';
import {sem, bp, dialogs} from 'components';
import {Link} from "react-router";
import {Query, QueryDescriptor} from 'stores/query';

import * as css from '../SidebarPanel.css';
import {WorkspaceMenuItem} from './';
import FlipMove from 'react-flip-move';

@observer
export class SidebarWorkspacePanel extends React.Component<{}, {}> {
	render() {
		const {
			      workspace:   {workspaces},
			      user:        {settings: {sidebar: prefs, sidebar: {queries: {showQuerySessions, showStoredQueries}}}},
			      site:        {activeTool}
		      } = api;

		const tag                  = activeTool && activeTool.tag && activeTool.tag();
		const selectedQuery: Query = tag as Query;

		return (
			<sem.Menu.Item key="workspace"
			               className={classNames(css.sidebarPanel)}
			               style={{borderTop: 0}}
			               active={activeTool.tool == ActiveTool.query}>
				<sem.Menu.Header>
					<Link className="ui fluid" to={api.routing.urls.home}>
						<sem.Icon name="feed"/>
						Workspaces
					</Link>

					<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
						<bp.Tooltip  content="New Workspace">
							<bp.Button minimal icon="plus" onClick={() => api.workspace.newWorkspace()}/>
						</bp.Tooltip>
					</div>
				</sem.Menu.Header>
				<sem.Menu vertical>
					<FlipMove>
						{workspaces.length == 0 &&
						<sem.Menu.Item key="no-workspaces" className={css.noResults}>
							No workespaces are currently loaded.
						</sem.Menu.Item>}

						{workspaces.map((ws, i) => <WorkspaceMenuItem key={i.toString()} workspace={ws}/>)}
					</FlipMove>
				</sem.Menu>
			</sem.Menu.Item>
		)
	}
}
