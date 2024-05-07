import {observer} from 'mobx-react';
import {FormattedMessage} from 'react-intl';
import {api, routing, site, user, org, ActiveTool, i18n, appIcons} from 'stores';
import * as sem from 'semantic-ui-react';
import * as bp from '@blueprintjs/core'
import * as mobx from 'mobx';
import {dialogs} from '..';
import {Link} from "react-router";
import {Query, QueryDescriptor} from 'stores/query';
import {downloadFile} from '../../../utility';

import * as css from './SidebarPanel.css';
import FlipMove from 'react-flip-move';

@observer
export class StoredQueries extends React.Component<{}, {}> {
	render() {
		const {
			      queryStore: {querySessions, descriptors},
			      user:  {settings: {sidebar: prefs, sidebar: {queries: {showStoredQueries}}}},
			      site:  {activeTool}
		      } = api;

		const tag                  = activeTool && activeTool.tag && activeTool.tag();
		const selectedQuery: Query = tag as Query;
		const isQuery              = activeTool.tool == ActiveTool.query && selectedQuery;

		let sortedQueries = mobx.values(descriptors);

		return (
			<sem.Menu.Item key="stored-queries" className={classNames(css.sidebarPanel)} active={activeTool.tool == ActiveTool.query}>
				<sem.Menu.Header>
					<Link className="ui fluid" to={api.routing.routeFor.queryBrowser}>
						<sem.Icon name="search"/>
						<FormattedMessage defaultMessage={"Stored Queries"} description={"[StoredQueries] a panel title"}/>
					</Link>

					{/*<Button basic floated="right" compact size="small" icon="add"*/}
					{/*data-tooltip="Start a New Session" data-position={bp.Position.BOTTOM}*/}
					{/*onClick={() => dialogs.newQuery} /></Menu.Header>*/}

					<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
						<bp.Tooltip  content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(Query.OBJECT_NAME_SINGLE)}>
							<bp.Button minimal icon="plus" onClick={() => dialogs.newQuery()}/>
						</bp.Tooltip>
					</div>
				</sem.Menu.Header>
				<sem.Menu vertical>
					<FlipMove>
						{sortedQueries.length == 0 && <sem.Menu.Item key="no-queries"
						                                             content={'No queries available'}
						                                             className={css.noResults}/>}
						{sortedQueries.map(q =>
							<sem.Menu.Item key={q.id} active={tag && tag.id === q.id}>
								<Link onContextMenu={(e) => this.query_onContextMenu(e, q)}
								      className="ui fluid"
								      to={api.routing.routeFor.query(q.id)}>
									<bp.Tooltip  content={`${q.name}'`}>
										{q.name}
									</bp.Tooltip>
								</Link>

								{/*<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>*/}
									{/*<bp.Tooltip  content={`Run Query '${q.name}' for ${q.variables.selected} variables`}>*/}
										{/*<bp.Button minimal icon="play" onClick={async () => await q.run()}/>*/}
									{/*</bp.Tooltip>*/}

									{/*<bp.Tooltip  content={`Delete '${q.name}'`}>*/}
										{/*<bp.Button minimal icon="small-cross" onClick={async () => await api.query.deleteQueryDescriptor(q.id)}/>*/}
									{/*</bp.Tooltip>*/}
								{/*</div>*/}
							</sem.Menu.Item>
						)}
					</FlipMove>
				</sem.Menu>
			</sem.Menu.Item>
		)
	}

	query_onContextMenu = (e: React.MouseEvent<any>, query: Query | QueryDescriptor) => {
		if (query instanceof Query) {
			e.preventDefault();
			bp.ContextMenu.show(
				<bp.Menu>
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
}
