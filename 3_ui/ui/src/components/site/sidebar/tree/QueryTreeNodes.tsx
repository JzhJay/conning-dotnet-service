import type {IconName} from '@blueprintjs/core';
import * as commonCss from '../SidebarPanel.css';
import { bp, sem, QueryCard, mobx } from 'components';
import { site, appIcons, QueryDescriptor, Query, queryStore, user } from 'stores';
import { observer } from 'mobx-react';
import { autorun} from 'mobx';
import { Link } from 'react-router';
import { SidebarTreeNode, SidebarTreeNodeType } from './SidebarTreeNode';

export class QueryTreeNode extends SidebarTreeNode {
	constructor(public query: Query | QueryDescriptor, extraProps?: any) {
		super({
			      id: query.id,
			      label: query.name,
			      canRename: true,
			      isSelected: site.activeTool && query.id == site.activeTool.activeItem,
			      type: SidebarTreeNodeType.query,
			      secondaryLabel: <bp.Popover  interactionKind={bp.PopoverInteractionKind.HOVER}
			                                  content={<QueryCard isTooltip query={query}/>}>
			      	                <div className={classNames(commonCss.showOnHover, bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP)}>
			      		                <bp.Tooltip content="Open" >
					                        <bp.AnchorButton icon='search' onClick={() => query.navigateTo()} />
				                        </bp.Tooltip>

				                        <bp.Tooltip content="Duplicate" >
					                        <bp.AnchorButton icon='duplicate' onClick={() => query.duplicate()} />
				                        </bp.Tooltip>

				                        <bp.Tooltip content="Delete" >
					                        <bp.AnchorButton icon='cross' onClick={() => query.delete()} />
				                        </bp.Tooltip>
			      	                </div>
			                      </bp.Popover>
		      })

		Object.assign(this, extraProps)

		this.setupInfoTooltip(() => <QueryCard isTooltip showToolbar query={this.query}/>)
	}

	get url() {
		return this.query.clientUrl
	}

	// onContextMenu = (nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
	// 	this.query.onContextMenu(e, 'sidebar');
	// }
}


export class QuerySessionsTreeNode extends SidebarTreeNode {
	constructor() {
		super({
			      id: 'query-sessions',
			      label: <Link to={queryStore.browserUrl('active')}>Active Sessions</Link>,
			      icon: appIcons.sidebar.tree.querySessions.name as IconName,
			      canRename: false,
			      type: SidebarTreeNodeType.folder
		      })

		autorun( () => {
			const { querySessions: loaded, hasLoadedDescriptors } = queryStore;

			this.secondaryLabel = <sem.Label content={loaded.size == 0 ? !hasLoadedDescriptors ? '...' : '0' : loaded.size} />
			this.childNodes = mobx.values(loaded).map(q => new QueryTreeNode(q));
		}, {name: `Update 'Active Sessions' tree node`})
	}

	get url() {
		return queryStore.browserUrl('active')
	}
}

export class MyQueriesTreeNode extends SidebarTreeNode {
	constructor() {
		super({
			      id: 'my-queries',
			      label: <Link to={queryStore.browserUrl('mine')}>My Queries</Link>,
			      icon: 'user',
			      canRename: false
		      })

		autorun( () => {
			const { descriptors, hasLoadedDescriptors } = queryStore;

			const myQueries = mobx.values(descriptors).filter(q => q.createdBy == user.currentUser.sub);
			this.secondaryLabel = <sem.Label content={myQueries.length == 0 ? !hasLoadedDescriptors ? '...' : '0' : myQueries.length} />
			this.childNodes = myQueries.map(q => new QueryTreeNode(q));
		}, {name: `Update 'My Queries' tree node`})
	}

	get url() {
		return queryStore.browserUrl('mine')
	}
}

export class QueriesSharedWithMeTreeNode extends SidebarTreeNode {
	constructor() {
		super({
			      id: 'shared-with-me-queries',
			      label: <Link to={queryStore.browserUrl('shared-with-me')}>Shared with Me</Link>,
			      icon: 'share',
			      canRename: false
		      })

		autorun(() => {
			const { descriptors, hasLoadedDescriptors } = queryStore;

			const queries = mobx.values(descriptors).filter(q => q.createdBy != user.currentUser.sub);
			this.secondaryLabel = <sem.Label content={queries.length == 0 ? !hasLoadedDescriptors ? '...' : '0' : queries.length} />
			this.childNodes = queries.map(q => new QueryTreeNode(q));
		}, {name: `Updated 'shared with me' tree node`})
	}

	get url() {
		return queryStore.browserUrl('shared-with-me')
	}
}

export class SavedQueriesTreeNode extends SidebarTreeNode {
	constructor() {
		super({
			      id: 'saved-queries',
			      label: <Link to={queryStore.browserUrl('saved')}>Saved Queries</Link>,
			      icon: appIcons.sidebar.tree.savedQueries.name as IconName,
			      canRename: false,
			      type: SidebarTreeNodeType.folder
		      })

		autorun(() => {
			const { descriptors: loaded, hasLoadedDescriptors } = queryStore;

			const filtered = mobx.values(loaded).filter(q => _.isEmpty(q.simulationIds));

			this.secondaryLabel = <sem.Label content={filtered.length == 0 ? !hasLoadedDescriptors ? '...' : '0' : filtered.length} />
			this.childNodes = filtered.map(q => new QueryTreeNode(q));
		}, {name: `Update 'Saved Queries' tree node`})
	}

	get url() {
		return queryStore.browserUrl('saved')
	}
}