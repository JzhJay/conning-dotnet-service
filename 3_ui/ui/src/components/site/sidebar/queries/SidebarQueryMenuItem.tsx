import { observer } from 'mobx-react';

import {appIcons, i18n, Link, Query, QueryDescriptor} from 'stores';
import { bp, sem, QueryCard, AppIcon, AvailableQueryViewDropdown, QueryContextMenu} from 'components';

import * as commonCss from '../SidebarPanel.css';
import * as css from './SidebarQueryMenuItem.css';

interface MyProps {
	query: Query | QueryDescriptor;
	active?: boolean;
}

@observer
@bp.ContextMenuTarget
export class SidebarQueryMenuItem extends React.Component<MyProps, {}> {
	render() {
		const { query: q, active } = this.props;

		const isSession = q instanceof Query;
		const query = q as Query;

		const isRenaming = q.renamingFrom == 'sidebar';
		const { hasResult } = q;

		//  style={{flexGrow: 1, display: 'flex', flexDirection: 'column', maxWidth: '40%'}}
		// onContextMenu={(e) => query.onContextMenu(e, 'sidebar')}

		return <sem.Menu.Item active={active}
		                      className={classNames(css.menuItem, { [css.isSession]: isSession })}>
			<bp.Popover
				autoFocus={false}
				disabled
				interactionKind={bp.PopoverInteractionKind.HOVER}
				content={<QueryCard query={q} showToolbar isTooltip/>}>

				<div className={commonCss.row}>
					{q.isLoading &&
					 <sem.Loader active inline size="tiny"/>}

					{isRenaming ? <bp.EditableText className={commonCss.editableName} defaultValue={q.name} selectAllOnFocus={true}
					                               ref={this.onEditRef}
					                               onCancel={q.cancelRename}
					                               onConfirm={q.confirmRename}/> : <Link className={commonCss.name} to={q.clientUrl}>{q.name}</Link>
					}

					{false && q.renamingFrom != 'sidebar' &&
					 <bp.Tooltip
						 content={`Rename '${q.name}'`}>
						 <bp.AnchorButton icon="edit" onClick={() => q.renamingFrom = 'sidebar'}/>
					 </bp.Tooltip>}

					<div className={classNames(commonCss.rightButtonGroup, bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP)}>
						{/*{false && hasResult && <sem.Button compact size="tiny" icon="lab" as={Link} to={api.routing.routeFor.queryResult(q.id, q.id)}/>}*/}

						{ /* Not enough room for below */ }
						{/*{isSession && <sem.Label>{query.variables.selected} variable{query.variables.selected != 1 ? 's' : ''}</sem.Label>}*/}

						{/*{q.simulations.map(sim =>*/}
							                   {/*<sem.Label key={sim.id}>*/}
								                   {/*<sem.Icon name="database"/>*/}
								                   {/*{sim.name}*/}
							                   {/*</sem.Label>)}*/}

						{isSession &&
						 <div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
							 {!q.hasResult &&
							  <bp.Tooltip content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RESET(Query.OBJECT_NAME_SINGLE)}>
								 <AppIcon icon={appIcons.queryTool.queryBuilder.resetQuery}
								          onClick={() => query.reset()}
								          disabled={query && query.isRunning}/>
							 </bp.Tooltip>}
							 {!q.hasResult && <bp.Tooltip content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RUN(Query.OBJECT_NAME_SINGLE)}>
								 <bp.Button minimal icon={appIcons.queryTool.queryBuilder.runQuery.name as any}
								            disabled={query && query.isRunning}
								            onClick={async () => await query.run()}/>
							 </bp.Tooltip>}

							 {q.queryResult && <AvailableQueryViewDropdown
								 className={css.viewChooser}
								  vertical showMenuLabel
								 queryResult={q.queryResult}
								 currentView={q.queryResult.currentView}/>}
						 </div>}

						{false && <bp.Tooltip className={commonCss.showOnHover} content={`Delete '${q.name}'`}>
							<bp.Button minimal icon="small-cross" onClick={async () => await q.delete()}/>
						</bp.Tooltip>}
					</div>
				</div>
			</bp.Popover>


			{/*<div className={css.row}>*/}
			{/*<div style={{flexGrow:1}}>*/}
			{/*/!*<AvailableQueryViewDropdown />*!/*/}
			{/*</div>*/}

			{/*<div className={classNames(commonCss.rightButtonGroup, bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP)}>*/}
			{/*<bp.Tooltip*/}
			{/**/}
			{/*content={`Rename '${q.name}'`}>*/}
			{/*<bp.AnchorButton icon="edit" onClick={() => q.renamingFrom = 'sidebar'}/>*/}
			{/*</bp.Tooltip>*/}

			{/*<bp.Popover*/}
			{/*position={bp.Position.RIGHT_TOP}*/}
			{/*popoverClassName={commonCss.sidebarPopover}*/}
			{/*interactionKind={bp.PopoverInteractionKind.HOVER}*/}
			{/*content={<QueryCard query={q} isTooltip/>}>*/}
			{/*<bp.AnchorButton icon="info-sign"/>*/}
			{/*</bp.Popover>*/}
			{/*</div>*/}
			{/*</div>*/}


			{/*<bp.Tooltip  content={`Delete '${q.name}'`}>*/}
			{/*<bp.Button minimal icon="small-cross" onClick={async () => await api.query.deleteQueryDescriptor(q.id)}/>*/}
			{/*</bp.Tooltip>*/}
			{/*</div>*/}
		</sem.Menu.Item>
	}

	renderContextMenu() {
		const { props: { query } } = this;

		return <QueryContextMenu location='sidebar' query={query} />
	}

	componentDidMount() {
		const { active, query } = this.props;

		// if (active && query.isActivePage && query.isSession) {
		// 	setTimeout(() => scrollIntoView(ReactDOM.findDOMNode(this) as HTMLDivElement), 20);
		// }

		// const $node = $(ReactDOM.findDOMNode(this));
		// reaction(() => api.site.pathname, (path) => {
		// 	// Scroll the active query into view
		// 	if (path.indexOf(api.routing.urls.query) != -1) {
		// 		const activeItem = $node.find('.active.item');
		// 		if (activeItem.length > 0) {
		// 			debugger;
		// 			scrollIntoView(activeItem[0])
		// 		}
		// 	}
		// })
		// query_onClick && query_onClick(query);
	}

	onEditRef = (r) => {
		if (r != null && !r.state.isEditing) {
			r.toggleEditing()
		}
	}
}