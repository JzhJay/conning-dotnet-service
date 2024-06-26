import {observer} from 'mobx-react';
import {Simulation,  Link, routing} from 'stores';
import * as css from '../SidebarPanel.css';
import {bp, sem, SimulationCard} from 'components';
import {observable, action} from 'mobx';

interface MyProps {
	simulation: Simulation;
	active?: boolean;
}

@observer
export class SidebarSimulationMenuItem extends React.Component<MyProps, {}> {
	render() {
		const {simulation: s, active} = this.props;

		return <sem.Menu.Item
			className={classNames(css.menuItem, "show-on-hover")}
			// onContextMenu={(e) => s.onContextMenu(e, 'sidebar')}
		    active={routing.isActive(s.clientUrl)}
		>
			<bp.Popover
				popoverClassName={css.sidebarPopover}
				autoFocus={false}
				interactionKind={bp.PopoverInteractionKind.HOVER}
				content={<SimulationCard sim={s} isTooltip/>}>
				<div className={css.row}>
					{s.renamingFrom == 'sidebar'
						? <bp.EditableText className={css.editableName} defaultValue={s.name}
						                   isEditing={true}
						                   selectAllOnFocus={true}
						                   onCancel={() => s.renamingFrom = null}
						                   onConfirm={newName => s.confirmRename(newName)}/>
						: <Link className={css.name} to={s.clientUrl}>{s.name}</Link> }

					<div className={classNames(css.rightButtonGroup, bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP)}>
						{/*<bp.Tooltip*/}
							{/**/}
							{/*content={`Rename '${s.name}'`}>*/}
							{/*<bp.AnchorButton icon="edit" onClick={() => s.renamingFrom = 'sidebar'}/>*/}
						{/*</bp.Tooltip>*/}

						{/*<bp.Tooltip*/}
							{/**/}
							{/*content="Query Simulation">*/}
							{/*<bp.AnchorButton icon="search" onClick={s.newQuery}/>*/}
						{/*</bp.Tooltip>*/}

						<sem.Label><sem.Icon name="signal"/>{s.variables.toLocaleString('en-US')}</sem.Label>
						<sem.Label><sem.Icon name="random"/>{s.scenarios.toLocaleString('en-US')}</sem.Label>
					</div>


					{/*<bp.Tooltip  content={`Delete '${s.name}'`}>*/}
					{/*<bp.AnchorButton minimal icon="small-cross" disabled/>*/}
					{/*</bp.Tooltip>*/}
					{/*</div>*/}
				</div>
			</bp.Popover>
		</sem.Menu.Item>
	}
}