import { observer } from 'mobx-react';
import FlipMove from 'react-flip-move';
import {queryResultStore, queryStore, routing, Query, QueryDescriptor, site, settings, org, ActiveTool, appIcons, i18n} from 'stores';
import { sem, bp, dialogs, mobx } from 'components';
import {downloadFile} from '../../../../utility';
import { SidebarQueryMenuItem, LINE_HEIGHT } from './index';
import { Link } from "react-router";
import * as css from '../SidebarPanel.css';
import * as styles from './SidebarQueriesPanel.css';
import { computed, reaction, autorun, makeObservable } from 'mobx';
import { QuerySessionsTreeNode, MyQueriesTreeNode, QueriesSharedWithMeTreeNode, SavedQueriesTreeNode } from "../tree/QueryTreeNodes";
import { BlueprintTree } from "../../../widgets";

@observer
export class SidebarQueryPanel extends React.Component<{}, {}> {
	constructor(props) {
		super(props);

		makeObservable(this);
	}

    @computed get activeQueries() {
		const { querySessions, descriptors } = queryStore;

		const loaded = mobx.values(querySessions);

		// Sort the queries
		const sortedQueries = _.orderBy(loaded,
		                                ['loading', 'isActivePage', 'state', 'name'],
		                                ['desc', 'desc', 'asc', 'asc']
		);

		return sortedQueries;
	}

    render() {
		const { hasLoadedDescriptors } = queryStore;

		const { sidebar: prefs, sidebar: { queries: { showStoredQueries } } } = settings;

		const { activeTool } = site;

		const { activeQueries } = this;

		const treeNodes = this.nodes.slice();

		const menuItems = [];
		!hasLoadedDescriptors &&
		menuItems.push(<sem.Menu.Item key="loading-queries" className={css.noResults}>
			<sem.Loader active inline size="tiny"/>
			Queries are loading...
		</sem.Menu.Item>);

		hasLoadedDescriptors && activeQueries.length == 0 &&
		menuItems.push(<sem.Menu.Item key="no-queries" className={css.noResults}>
			No queries are currently open.
			{/*<br/>Click <a>here</a> (or double click) to begin a query session.*/}
		</sem.Menu.Item>)

		hasLoadedDescriptors &&
		activeQueries.forEach(q => {
			menuItems.push(<SidebarQueryMenuItem active={q.isActivePage} query={q} key={q.id}/>);

			if (q.isRunning) {
				const { queryResult: qr } = q;
				menuItems.push(
					<sem.MenuItem style={{ paddingLeft: 20 }} key={q.id + '-running'}>
						Query is running...
						{/*<sem.Loader active inline size="tiny"/>*/}
					</sem.MenuItem>)
			}
		});

		// const {nodes} = this;
		//
		// // Touch every property
		// SidebarTreeNode.recurseTouch(nodes);

		return (
			<sem.Menu.Item key="queries"
			               className={classNames(css.sidebarPanel, { [css.noResults]: _.isEmpty(activeQueries) })}
			               active={routing.isActive(queryStore.browserUrl()) || routing.isActive(queryResultStore.browserUrl)}>
				<sem.Menu.Header>
					<Link className="ui fluid" to={routing.routeFor.queryBrowser}>
						<sem.Icon name="search"/>
						{Query.OBJECT_NAME_MULTI}
					</Link>

					{/*<Button basic floated="right" compact size="small" icon="add"*/}
					{/*data-tooltip="Start a New Session" data-position={bp.Position.BOTTOM}*/}
					{/*onClick={() => dialogs.newQuery} /></Menu.Header>*/}

					<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
						{/*<bp.Tooltip  content={'List Active Sessions' }>*/}
						{/*<bp.Button minimal icon='applications' active={showQuerySessions} onClick={() => prefs.queries.showQuerySessions = !showQuerySessions}/>*/}
						{/*</bp.Tooltip>*/}

						{/*<bp.Tooltip  content={'Show Stored Queries'}>*/}
						{/*<bp.Button minimal icon='floppy-disk' active={showStoredQueries} onClick={() => prefs.queries.showStoredQueries = !showStoredQueries}/>*/}
						{/*</bp.Tooltip>*/}

						{/*<bp.Tooltip  content="Stored Queries">*/}
						{/*<bp.Button minimal icon="folder-open" onClick={() => dialogs.openQuery()}/>*/}
						{/*</bp.Tooltip>*/}

						<bp.Tooltip content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(Query.OBJECT_NAME_SINGLE)}>
							<bp.Button minimal icon="plus" onClick={() => dialogs.newQuery()}/>
						</bp.Tooltip>
					</div>
				</sem.Menu.Header>

				<sem.Menu vertical as={FlipMove} className={styles.activeQueries}>
					{/*<sem.Menu.Header content="Active Query Sessions" />*/}
					{menuItems}
				</sem.Menu>

				<BlueprintTree nodes={this.nodes} />
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
					<bp.MenuDivider/>
					<bp.MenuItem
						text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RESET(Query.OBJECT_NAME_SINGLE)}
						disabled={!query || query.busy} icon={appIcons.queryTool.queryBuilder.resetQuery.name as any} onClick={() => query.reset()}/>
					<bp.MenuItem
						text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RUN(Query.OBJECT_NAME_SINGLE)}
						disabled={!query || query.busy} icon={appIcons.queryTool.queryBuilder.runQuery.name as any} onClick={() => query.run()}/>
				</bp.Menu>, { left: e.clientX, top: e.clientY });
		}
	}

    get prefs() {
		return settings.sidebar.queries;
	}

    componentWillUnmount() {
		this.nodes.forEach(n => n.dispose());
	}

    nodes = [
		//new QuerySessionsTreeNode(),
		//new FavoriteQuerySessionsNode(),
		new MyQueriesTreeNode(),
		new QueriesSharedWithMeTreeNode(),
		new SavedQueriesTreeNode()
	];
}

//
// {/*<Button className={classNames("pt-minimal", css.collapseExpand)} icon={"chevron-down"}*/}
// {/*onClick={() => prefs.queries.expanded = !expanded}/>*/}
//
// {/*<bp.Popover*/}
// {/*position={bp.Position.RIGHT_TOP}*/}
// {/*interactionKind={bp.PopoverInteractionKind.CLICK}*/}
// {/*popoverClassName={css.sidebarPopover}*/}
// {/*canEscapeKeyClose={true}*/}
// {/*content={*/}
// {/*true*/}
// {/*? <sem.Menu vertical>*/}
// {/*<sem.Menu.Item>*/}
// {/*<sem.Input placeholder='Search...'/>*/}
// {/*</sem.Menu.Item>*/}
//
// {/*<sem.Menu.Item>*/}
// {/*<sem.Menu.Header content="Query Tool"/>*/}
// {/*<sem.Menu.Menu>*/}
// {/*<sem.Menu.Item content="New Query" icon="file outline" onClick={() => dialogs.newQuery()}/>*/}
// {/*<sem.Menu.Item content="Open Query" icon="folder open" onClick={dialogs.openQuery}/>*/}
// {/*</sem.Menu.Menu>*/}
// {/*</sem.Menu.Item>*/}
//
// {/*<sem.Menu.Item>*/}
// {/*<sem.Menu.Header content="Saved Queries"/>*/}
// {/*<sem.Menu.Menu>*/}
// {/*<sem.Menu.Item content="Query A" icon="search"/>*/}
// {/*<sem.Menu.Item content="Query B" icon="search"/>*/}
// {/*<sem.Menu.Item content="Query C" icon="search"/>*/}
// {/*<sem.Dropdown item text='More...'>*/}
// {/*<sem.Dropdown.Menu>*/}
// {/*<sem.Dropdown.Item>More Queries 1</sem.Dropdown.Item>*/}
// {/*<sem.Dropdown.Item>More Queries 2</sem.Dropdown.Item>*/}
// {/*<sem.Dropdown.Item>More Queries 3</sem.Dropdown.Item>*/}
// {/*</sem.Dropdown.Menu>*/}
// {/*</sem.Dropdown>*/}
// {/*</sem.Menu.Menu>*/}
// {/*</sem.Menu.Item>*/}
// {/*</sem.Menu>*/}
// {/*: <bp.Menu>*/}
// {/*<bp.MenuDivider title="Query Tool"/>*/}
// {/*<bp.MenuItem text="New Query" icon="document" onClick={() => dialogs.newQuery()}/>*/}
// {/*<bp.MenuItem text="Open Query" icon="folder-open" onClick={dialogs.openQuery}/>*/}
// {/*/*<bp.MenuItem text="Browse Queries..." icon="folder-close" onClick={() => routing.push(routing.routeFor.queryBrowser)}/>*/*/}
// {/*<bp.MenuDivider title="Saved Queries"/>*/}
// {/*<bp.MenuItem text="Query A" icon="search"/>*/}
// {/*<bp.MenuItem text="Query B" icon="search"/>*/}
// {/*<bp.MenuItem text="Query C" icon="search"/>*/}
// {/*<bp.MenuItem text="More..." icon="blank">*/}
// {/*<bp.Menu>*/}
// {/*{savedQueries.map(q => <bp.MenuItem text={q.name} onClick={q.navigateTo()}/>)}*/}
// {/*</bp.Menu>*/}
// {/*</bp.MenuItem>*/}
//
// {/*/*<bp.MenuDivider title="Active Queries" />*/*/}
// {/*/*{loadedQueriesSorted.map(q =>*/*/}
// {/*/*<bp.MenuItem text={q.name}>*/*/}
// {/*/*<bp.Menu>*/*/}
// {/*/*<bp.MenuItem text="Reset Query" disabled={q.busy} icon="step-backward" onClick={() => q.reset()}/>*/*/}
// {/*/*<bp.MenuDivider />*/*/}
// {/*/*<bp.MenuItem text="Run Query" disabled={q.busy} icon="play" onClick={() => q.run()}/>*/*/}
// {/*/*<bp.MenuItem text="Run Query (Open in New Tab)" disabled={q.busy} icon="play" onClick={() => q.run()}/>*/*/}
// {/*/*<bp.MenuDivider />*/*/}
// {/*/*<bp.MenuItem text="Save Query Definition..." icon="saved" target="download" href={q ? `${q.definitionUrl}` : null}/>*/*/}
// {/*/*</bp.Menu>*/*/}
// {/*/*</bp.MenuItem>)}*/*/}
// {/*</bp.Menu>}>*/}
// {/*<bp.Button rightIcon="caret-right"/>*/}
// {/*</bp.Popover>*/}
