import type { SimulationGuid } from "stores";
import { appIcons, simulationStore, queryStore, reportStore, Report, ISimulationSlotComponent, SimulationSlot, Link, user } from "stores";
import { observer } from 'mobx-react'
import { sem, bp,  SimulationCard,ReportSimulationSlotContextMenu, SimulationContextMenu} from 'components';
import Select from 'react-select';
import * as css from './SimulationSlot.css';
import {ButtonGroup, ContextMenuTarget} from "@blueprintjs/core";
import { observable, makeObservable } from "mobx";

import {SortableContainer, SortableElement, SortableHandle, arrayMove, SortableElementProps} from 'react-sortable-hoc';
import { IconButton } from "../../../blueprintjs/IconButton";

interface SimulationRowProps {
	slot: SimulationSlot;
	report: Report;
	style?: React.CSSProperties;
	showTitle?: boolean;
	onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
	readonly?: boolean;
}

const DragHandle = SortableHandle(() => <sem.Icon className='draggable' size='large' fitted name="database"/>)

@bp.ContextMenuTarget
@observer
class SortableSimulationSlot extends React.Component<SimulationRowProps & SortableElementProps, {}> {
    nameInput?: any;
    simulationSelect?: any;
    @observable tooltipOpen = false;
    @observable selectOpen = false;
    @observable isEditing;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentDidMount() {
		this.props.slot.component = this;
	}

    componentWillUnmount() {
		this.props.slot.component = null;
	}

    renderContextMenu() {
		return <SimulationContextMenu slot={this.props.slot} />
	}

    render() {
		const useSemanticForm = true;
		const { isEditing, tooltipOpen, props: { readonly, report, slot, slot: { name, index, errors, simulation } } } = this;

		const { simulationOptions } = simulationStore;

		const tooltipMouseEvents = {
			onMouseEnter: () => {
				if (!this.selectOpen) this.tooltipOpen = true;
			},
			onMouseLeave: () => this.tooltipOpen = false
		}
		if (useSemanticForm) {
			return <sem.Card.Content extra className={css.simulationSlot}>
				<sem.Form as="div">
					<sem.Form.Group>
						<sem.Form.Field>
							<label></label>
							<DragHandle/>
						</sem.Form.Field>
						<sem.Form.Field width={5}>
							<label>Name</label>
							<sem.Input width={6}
							           disabled={readonly}
							           placeholder={`Simulation ${slot.index + 1}`}
							           value={slot.name}
							           ref={r => this.nameInput = r}
							           onChange={(e, data) => slot.name = data.value}/>
						</sem.Form.Field>

						<sem.Form.Field width={9} error={errors.simulation}>
							<label>Simulation</label>
							{/*<ReactSelect value={slot.simulationId}*/}
							{/*onOpen={() => this.selectOpen = true}*/}
							{/*onClose={() => this.selectOpen = false}*/}
							{/*multi*/}
							{/*ref={r => this.simulationSelect = r}*/}
							{/*{...tooltipMouseEvents}*/}
							{/*onChange={(option: ReactSelect.Option<SimulationGuid>[]) => slot.simulationId = option ? _.first(option).value : null}*/}
							{/*placeholder="Select a simulation..."*/}
							{/*options={simulationOptions}/>*/}


							<bp.Popover
								position={bp.Position.BOTTOM_LEFT} interactionKind={bp.PopoverInteractionKind.HOVER}
								popoverClassName={classNames({ [bp.Classes.TOOLTIP]: slot.errors.simulation })}
								enforceFocus={false} disabled={this.selectOpen}
								content={slot.errors.simulation ? 'A bound simulation is required' : <SimulationCard readonly isTooltip sim={slot.simulation} showHeader={false} slot={slot}/>}>
								<Select value={simulationOptions.filter(s => s.value == slot.simulationId)}
								         isDisabled={readonly}
								         onMenuOpen={() => this.selectOpen = true}
							             onMenuClose={() => this.selectOpen = false}
							             ref={r => this.simulationSelect = r}
							             openMenuOnFocus
							             {...tooltipMouseEvents}
							             onChange={(option: ReactSelect.Option<SimulationGuid>) => slot.simulationId = option ? option.value : null}
							             placeholder="Select a simulation..."
							             options={simulationOptions}
							            className={css.reactSelect}
							            classNamePrefix={css.reactSelect}/>
							</bp.Popover>
						</sem.Form.Field>

						<sem.Form.Field style={{ textAlign: 'right' }}>
							<label>
							</label>
							<div className={classNames("right floated", bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)} {...tooltipMouseEvents}>
								<bp.Tooltip content="Remove Slot">
									<IconButton icon={appIcons.report.remove} onClick={() => slot.delete()}/>
								</bp.Tooltip>
							</div>
						</sem.Form.Field>
					</sem.Form.Group>
				</sem.Form>
			</sem.Card.Content>
		}
		else {
			return (
				<div className={css.slotCard}>
					<div className={css.header}>
						<DragHandle/>
						<span className={css.title} data-is-editing={isEditing}>
						{<bp.EditableText isEditing={isEditing}
						                  disabled={isEditing == null}
						                  selectAllOnFocus
						                  placeholder={`Simulation ${index + 1}`}
						                  defaultValue={name}
						                  onCancel={() => this.isEditing = null}
						                  onConfirm={newValue => {
							                  if (newValue != slot.name) {
								                  slot.name = newValue;
							                  }

							                  this.isEditing = null;
						                  }}/>}
					</span>

						<ButtonGroup className={classNames(css.actions)}>
							<bp.Tooltip content="Rename" >
								<bp.AnchorButton icon="edit"
								                 active={isEditing}
								                 onClick={() => this.isEditing = isEditing ? null : true}/>
							</bp.Tooltip>

							<bp.Tooltip content="Delete" >
								<bp.AnchorButton icon='cross' onClick={() => slot.delete()}/>
							</bp.Tooltip>
						</ButtonGroup>
					</div>

					<div className={css.contents}>
						<label>Simulation:</label>
						<Select value={simulationOptions.filter(s => s.value == slot.simulationId)}
						             onMenuOpen={() => this.selectOpen = true}
						             onMenuClose={() => this.selectOpen = false}
						             ref={r => this.simulationSelect = r}
						             openMenuOnFocus
						             {...tooltipMouseEvents}
						             onChange={(option: ReactSelect.Option<SimulationGuid>) => slot.simulationId = option ? option.value : null}
						             placeholder="Select a simulation..."
						             options={simulationOptions}
						        className={css.reactSelect}
						        classNamePrefix={css.reactSelect}
						/>
					</div>
				</div>
			)
		}
	}

    // moveSimulationSlot = (order, sortable, event) => {
    // 	const { newIndex, oldIndex } = event;
    // 	const { report } = this.props;
    // 	report.simulationSlots.move(oldIndex, newIndex);
    //
    // 	this.disableAnimation = false
    // }
}

export const SortableSimulationSlotElement = SortableElement(SortableSimulationSlot);

export const AddASimulationSlot = (props: { report: Report, className?: string }) => {
	const { report, className } = props;
	return (
		<sem.Card.Content extra lassName={classNames(className, css.addASim)} onClick={(e) => {
			e.stopPropagation();
			report.addSimulationSlot()
		}}>
			<sem.Form as="div">
				<sem.Form.Group>
					<sem.Form.Field>
						<label></label>
						<DragHandle/>
					</sem.Form.Field>
					<sem.Form.Field width={5}>
						<label></label>
						<sem.Input width={6}
						           readonly
						           placeholder="Add a Simulation"
						/>
					</sem.Form.Field>
				</sem.Form.Group>
			</sem.Form>
		</sem.Card.Content>)
}

@observer
@ContextMenuTarget
class SimulationSlotComponent extends React.Component<{ slot: SimulationSlot }, {}> {
	renderContextMenu() {
		return <ReportSimulationSlotContextMenu slot={this.props.slot}/>
	}

	render() {
		const { props: { slot, slot: { simulation, simulationId, id, name } } } = this;

		return (
			<div key={id} className={css.simulationSlot}>
				<div className={css.contents}>
													<span className={css.slotName}>
														<sem.Icon name='edit'/>
														{name}
													</span>
					<bp.Popover   interactionKind={bp.PopoverInteractionKind.HOVER}
					            disabled={!simulation}
					            content={<SimulationCard isTooltip sim={simulation}/>}>
													<span className={css.slotSim}>
														<sem.Icon name='database'/>
														<span className={css.simName}>
															{simulation ? simulation.name
																// ? <ReactSelect value={simulationId}
																//                onChange={(option: ReactSelect.Option<SimulationGuid>) => slot.simulationId = option ? option.value : null}
																//                placeholder="Select a simulation..."
																//                options={simulationStore.simulationOptions}/>
																: simulationId
																 ? 'Loading Simulation...'
																 : 'Unbound'}
														</span>
													</span>
					</bp.Popover>
				</div>
			</div>
		)
	}
}

/*
Using grid layout for the slot instead of semantic
display:grid;
    grid-template-areas: "handle name simulation actions";
    grid-template-columns: auto 2fr 3fr 30px;
    grid-column-gap: 1em;
    margin-bottom:1em;

    [data-area="handle"], :global(.draggable) {
        grid-area:handle;
    }

    [data-area="name"] {
        grid-area:name;
    }

    [data-area="simulations"] {
        grid-area:simulations;
    }

    [data-area="actions"] {
        grid-area:actions;
    }

	<DragHandle data-area="handle"/>
				<sem.Input data-area="name"
				           placeholder={`Simulation ${slot.index + 1}`}
				           value={slot.name}
				           ref={r => this.nameInput = r}
				           onChange={(e, data) => slot.name = data.value}/>

				<ReactSelect data-area="simulations"
				             value={slot.simulationId}
				             onOpen={() => this.selectOpen = true}
				             onClose={() => this.selectOpen = false}
				             ref={r => this.simulationSelect = r}
				             openOnFocus
				             {...tooltipMouseEvents}
				             onChange={(option: ReactSelect.Option<SimulationGuid>) => slot.simulationId = option ? option.value : null}
				             placeholder="Select a simulation..."
				             options={simulationOptions}/>

				<div data-area="actions"
				     className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)} {...tooltipMouseEvents}>
					<bp.Tooltip content="Remove Slot"
					            position={bp.Position.BOTTOM_RIGHT}>
						<bp.AnchorButton icon="cross" onClick={() => slot.delete()}/>
					</bp.Tooltip>
				</div>
 */