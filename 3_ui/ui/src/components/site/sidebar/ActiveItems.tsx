import {observer} from 'mobx-react';
import {FormattedMessage} from 'react-intl';
import {api, user, org, Query, Link, i18n, appIcons} from 'stores';
import {bp, sem} from 'components';
import {downloadFile} from '../../../utility';
import * as css from './SidebarPanel.css';
import * as mobx from 'mobx';
import FlipMove from 'react-flip-move';

@observer
export class ActiveWorkspacePanel extends React.Component<{}, {}> {
	render() {
		const {
			      queryStore:       {querySessions},
			      queryResultStore: {loadedResults},
				  user:        {settings: {sidebar: prefs, sidebar: {queries: {}}}},
			      site:        {activeTool}
		      } = api;

		const tag = activeTool && activeTool.tag && activeTool.tag();

		return (
			<sem.Menu.Item className={classNames(css.sidebarPanel)}>
				<sem.Menu.Header>
					<Link className="" to={api.routing.routeFor.queryBrowser}>
						<sem.Icon name="home"/>
						<FormattedMessage defaultMessage={"Active Workspace"} description={"[ActiveItems] a panel title"}/>
					</Link>

					<bp.Popover
					         className="ui fluid"
					         transitionDuration={200}
					         interactionKind={bp.PopoverInteractionKind.HOVER}
					         content={
						         <bp.Menu>
							         <bp.MenuItem text="Add Query"/>
						         </bp.Menu>
					         }>

						<bp.Button text="Active Items" minimal rightIcon="caret-down"/>
					</bp.Popover>
				</sem.Menu.Header>

				<sem.Menu vertical>
					<Collapse isOpened={true}>
						<FlipMove>
							{mobx.values(querySessions).map(q =>
								<sem.Menu.Item key={q.id} active={tag && tag.id === q.id}>
									<sem.Icon name="search" />
									<Link onContextMenu={(e) => this.query_onContextMenu(e, q)}
									      className="ui fluid"
									      to={api.routing.routeFor.query(q.id)}>{q.name} ({q._variables.selected})</Link>

									<bp.Tooltip content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(`"${q.name}"`)}>
										<bp.Button minimal icon="small-cross" onClick={async () => await api.queryStore.deleteQueryDescriptor(q.id)}/>
									</bp.Tooltip>
								</sem.Menu.Item>
							)}

							{mobx.values(loadedResults).map(qr =>
								<sem.Menu.Item key={qr.id} active={tag && tag.id === qr.id}>
									<sem.Icon name="lab" />
									<Link
										className="ui fluid"
										to={qr.clientUrl}>{qr.name}</Link>

									<bp.Tooltip content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(`"${qr.name}"`)}>
										<bp.Button minimal icon="small-cross" onClick={async () => await api.queryResultStore.delete(qr.id)}/>
									</bp.Tooltip>
								</sem.Menu.Item>
							)}
						</FlipMove>
					</Collapse>
				</sem.Menu>
			</sem.Menu.Item>
		)
	}

	query_onContextMenu = (e: React.MouseEvent<any>, query: Query) => {
		e.preventDefault();

		// mouse position is available on event
		bp.ContextMenu.show(<bp.Menu>
			<bp.MenuDivider title={query.name}/>
			<bp.MenuItem
				text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.SAVE(Query.OBJECT_NAME_SINGLE)}
				icon={appIcons.sidebar.tree.savedQueries.name as any} target="download" onClick={() => downloadFile(query.definitionLinkUrl)}/>
			<bp.MenuDivider />
			<bp.MenuItem
				text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RESET(Query.OBJECT_NAME_SINGLE)}
				disabled={!query || query.busy} icon={appIcons.queryTool.queryBuilder.resetQuery.name as any} onClick={() => query.reset()}/>
			<bp.MenuItem
				text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RUN(Query.OBJECT_NAME_SINGLE)}
				disabled={!query || query.busy} icon={appIcons.queryTool.queryBuilder.runQuery.name as any} onClick={() => query.run()}/>
		</bp.Menu>, {left: e.clientX, top: e.clientY});
	}
}