import { QueryContextMenu, sem, bp, QueryCard, SimulationCard, AvailableQueryViewDropdownBp,  SimulationContextMenu } from 'components';
import FlipMove from 'react-flip-move';
import Select from 'react-select';
import { observer } from "mobx-react";
import { Link, utility, Report, ReportQuery, viewDescriptors, ReportQueryStatus, SimulationSlot, simulationStore, routing, appIcons, SimulationSlotGuid, Query } from 'stores';
import { computed, observable, reaction, makeObservable } from "mobx";
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import * as css from './QuerySlot.css'
import { IconButton } from "../../../blueprintjs/IconButton";

interface MyProps {
	reportQuery: ReportQuery;
	showActionButtons?: boolean;
	componentRef?: (ref: QuerySlotComponent) => void;
}

const DragHandle = SortableHandle(() => <bp.Icon icon='search' className={classNames(css.dragHandle, 'draggable')} />)

@observer
@bp.ContextMenuTarget
export class QuerySlotComponent extends React.Component<MyProps, {}> {
	nameInput: any;
	simulationSelect: any;

	static defaultProps = { showActionButtons: true }

	constructor(props) {
        super(props);
        makeObservable(this);
        this.props?.componentRef && this.props.componentRef(this);
    }

	updateQueryName = () => {
		const { props: { reportQuery: { query, name } } } = this;

		if (query && query.name != name) {
			query.rename(name);
		}
	}

	@computed
	get status() {
		const { errors, simulationSelect }                                                                                     = this;
		const { reportQuery, reportQuery: { dirty, status, query, queryId, simulations, simulationSlots, simulationSlotIds } } = this.props;
		const qr                                                                                                               = query ? query.queryResult : null;

		const queryLink = query && reportQuery
			? <bp.Popover interactionKind={bp.PopoverInteractionKind.HOVER} content={<QueryCard isTooltip query={query}/>}>
			                  <Link to={reportQuery.clientUrl}>{query.name}</Link>
		                  </bp.Popover>
			: null;
		if (status == 'creating') {
			return `'${reportQuery.name}' is being created...`;
		} else if (status == 'starting') {
			return 'Starting session...';
		}
		else if (status == 'switchingSims') {
			return <span>Updating '{queryLink}'...</span>;
		}
		else if (status == 'switchedSims') {
			return <span>Updated '{queryLink}'</span>;
		}
		else if (status == 'deleting') {
			return <span>Deleting '{queryLink}'...</span>;
		}
		else if (status == 'deleted') {
			return <span>Deleted associated query</span>;
		}
		else if (status == 'renaming') {
			return <span>Renaming '{queryLink}'...</span>;
		}
		else if (status == 'renamed') {
			return <span>Renamed '{queryLink}'</span>;
		}
		else if (status == 'created') {
			return <span>
				'{queryLink}' has been created
			       </span>
		}

		if (status == 'error') {
			return 'Error loading query.';
		}

		if (errors.simulations) {
			if (_.isEmpty(simulationSlotIds)) {
				return 'A simulation is required.'
			}

			const unboundSimSlots = simulationSlots.filter(s => s && !s.simulation);

			if (unboundSimSlots.length > 0) {
				return <sem.Message>
					<sem.Message.Content>
						<sem.Message.List>
							{unboundSimSlots.map(slot =>
								                     <sem.Message.Item key={slot.id}>
									                     <a onClick={() => {
										                     slot.component.simulationSelect.focus();
										                     slot.component.simulationSelect.focusStartOption();
									                     }}>{slot.label}</a> is bound to a slot, but not a simulation.
								                     </sem.Message.Item>
							)}
						</sem.Message.List>
					</sem.Message.Content>
				</sem.Message>
			}
		}

		if (dirty) {
			if (simulationSelect.state.isFocused) {
				return 'Choose simulations...'
			}
			if (!queryId) {
				return <span>Your query does not exist.  <a onClick={() => reportQuery.manageQuerySession()}>Create it</a></span>
			}
			else {
				return <span>'{queryLink}' is out of date.  <a onClick={() => reportQuery.manageQuerySession()}>Update</a></span>
			}
		}

		if (queryId && !query) {
			// return true ? 'Loading query...' <span>
			// 			<a onClick={() => reportQuery.manageQuerySession()}>Start Query Session</a>
			//        </span>
		}
		else if (query) {
			if (query.isRunning) {
				return <span>'{queryLink}' is running...</span>
			}

			if (qr) {
				if (!qr.descriptor.ready) {
					return 'Your result is loading...'
				}
				else {
					return <div className={css.queryStatus}>
						<span className={css.name}>'{queryLink}':  </span>
						<AvailableQueryViewDropdownBp query={query} reportQuery={reportQuery} />
					</div>
				}
			}
			else if (query instanceof Query) {
				var { _variables, _variables: { timesteps, scenarios, clauses }, arrangement } = query;
				return <div className={css.queryStatus}>
					<span className={css.name}>'{queryLink}' is ready</span>
					{/*<ul className={css.details}>*/}
						{/*<li>{variables.selected.toLocaleString()} variable{variables.selected != 1 ? 's' : ''}</li>*/}
						{/*<li>{scenarios.selected} scenario{scenarios.selected != 1 ? 's' : ''}</li>*/}
						{/*<li>{timesteps.selected.toLocaleString()} timestep{timesteps.selected ? 's' : ''} </li>*/}
					{/*</ul>*/}
				</div>
			}
			else if (query.hasSession) {
				return <span>Query '{queryLink}'</span>;
			}
			else {
				return <span>'{queryLink}' is inactive.  <a onClick={() => reportQuery.manageQuerySession()}>Start the Session</a></span>
			}
		}
		else {
			if (!status) {
				return '';
				// return <span>
				// 	<a onClick={() => reportQuery.manageQuerySession()}>Create Query Session</a>
				// </span>
			}
		}

		return '';
	}

	@computed
	get errors() {
		const { name, simulations, simulationSlots, status } = this.props.reportQuery;
		return {
			name           : false, // Allow name not to be set  //name == null || name.length == 0,
			simulations    : (simulationStore.hasLoadedDescriptors && simulations.length != simulationSlots.length) || simulationSlots.length == 0,
			cannotLoadQuery: status == 'error'
		}
	}

	render() {
		const {
			      nameInput, simulationSelect, errors, status,
			      props: { showActionButtons, reportQuery, reportQuery: { simulationSlotIds, report, simulations, simulationSlots, query, queryId } }
		      } = this;

		const qr = query && query.queryResult;

		const whyNoQueryMessage =
			      query ? null : !simulationSlotIds ? 'Simulation Slot is Required' : !_.some(simulationSlots, slot => !slot || !slot.simulation) ? 'Simulation is Required' : status;

		const simulationSlotsOptions = report.simulationSlots.map(s => ({ label: `${s.label}`, value: s.id }));

		return (
			<sem.Card.Content extra
			                  className={css.root}
			                  onContextMenu={(e) => {
				                  const $target = $(e.target);

				                  // Don't override hyperlinks
				                  if (!$target.is('a[href]') && $target.parents('a[href]').length == 0) {
					                  bp.ContextMenu.show(<QueryContextMenu location='builder' currentView={reportQuery.view} reportQuery={reportQuery}/>, { left: e.clientX - 8, top: e.clientY - 8 });
					                  e.preventDefault();
				                  }
			                  }}>
				<sem.Form as="div" error={_.some(_.values(errors))}>
					<sem.Form.Group>
						<sem.Form.Field>
							<label/>
							<DragHandle/>
						</sem.Form.Field>
						<sem.Form.Field error={errors.name} width={3}>
							<label>Query Name</label>
							<sem.Input value={reportQuery.name}
							           placeholder={`Query ${reportQuery.index + 1}`}
							           ref={r => this.nameInput = r}
							           onChange={(e, data) => reportQuery.name = data.value}
							           onBlur={() => reportQuery.manageQuerySession()}
							           onKeyDown={e => {
								           if (e.keyCode == utility.KeyCode.Escape && query) {
									           reportQuery.name = query.name
								           }
								           else if (e.keyCode == utility.KeyCode.Enter) {
									           this.nameInput.inputRef.blur();
								           }
							           }}
							/>
						</sem.Form.Field>

						{/* Simulation (Slot) */}
						<sem.Form.Field width={6} error={errors.simulations}>
							<label>Query Simulations</label>
							<Select value={simulationSlotIds ? simulationSlotsOptions.filter( s => simulationSlotIds.indexOf(s.value) >= 0) : null}
							             className={css.simulations}
								         classNamePrefix={css.simulations}
							             ref={r => this.simulationSelect = r}
							             isMulti openMenuOnFocus
							             onBlur={() => reportQuery.manageQuerySession()}
							             onChange={(options) => {
								             reportQuery.simulationSlotIds = options ? options.map(o => o.value) : null
							             }}
							             formatOptionLabel={(option) => <SimulationSlotOptionValue slot={report.findSimulationSlot(option.value)}/>}
							             placeholder={"Select simulations..."}
							             options={simulationSlotsOptions}/>
						</sem.Form.Field>

						<sem.Form.Field as={FlipMove} width={5} className={css.statusField}>
							<label>Query Status</label>
							<span key={reportQuery.status}>{status}</span>
						</sem.Form.Field>

						{showActionButtons && <sem.Form.Field style={{ textAlign: 'right' }}>
							<label/>
							<div className={bp.Classes.BUTTON_GROUP}>
								{qr == null && <bp.Tooltip key='run-query' content={!query && status ? status : `Run Query`} position={bp.Position.BOTTOM}>
									<bp.AnchorButton icon="play"
									                 disabled={!query}
									                 loading={query && query.busy}
									                 onClick={() => query.run()}/>
								</bp.Tooltip>}

								{/*<bp.Popover content={query ? <QueryCard isTooltip query={query}/> : 'No Query Session'}*/}
								{/*popoverClassName={!query && 'pt-tooltip'}*/}
								{/*isOpen={showInfoCard}*/}
								{/*position={query ? bp.Position.RIGHT : bp.Position.BOTTOM}*/}
								{/*interactionKind={bp.PopoverInteractionKind.HOVER}>*/}
								{/*<bp.AnchorButton onMouseEnter={() => this.showInfoCard = true} onMouseLeave={() => this.showInfoCard = false} style={{ background: 'transparent' }} disabled={!query} icon="info-sign"/>*/}
								{/*</bp.Popover>*/}

								{/*<bp.Tooltip content='Jump to Query'*/}
								{/*>*/}
								{/*<Link to={reportQuery.clientUrl} className={classNames('pt-button pt-icon-link')}/>*/}
								{/*</bp.Tooltip>*/}


								<bp.Tooltip content='Duplicate'
								>
									<bp.AnchorButton icon="duplicate" onClick={() => reportQuery.duplicate()}
									                 disabled={!query} />
								</bp.Tooltip>

								<bp.Tooltip content="Remove Query">
									<IconButton icon={appIcons.report.remove} onClick={() => reportQuery.delete()} />
								</bp.Tooltip>
							</div>
						</sem.Form.Field>}
					</sem.Form.Group>
				</sem.Form>
			</sem.Card.Content>)
	}

	renderContextMenu() {
		return <QueryContextMenu location='builder' reportQuery={this.props.reportQuery} onRename={() => this.nameInput.focus()}/>
	}
}

const _SortableQuerySlot = SortableElement(QuerySlotComponent);
export const SortableQuerySlot = _SortableQuerySlot;

@bp.ContextMenuTarget
@observer
export class SimulationSlotOptionValue extends React.Component<{ slot: SimulationSlot }, {}> {
	render() {
		const { slot } = this.props;

		return (
			<bp.Popover
				position={bp.Position.BOTTOM} interactionKind={bp.PopoverInteractionKind.HOVER}
				modifiers={{ offset: { offset: "0,10px" } }}
				popoverClassName={classNames({ [bp.Classes.TOOLTIP]: slot.errors.simulation })}
				enforceFocus={false}
				content={slot.errors.simulation ? 'A bound simulation is required' : <SimulationCard readonly isTooltip sim={slot.simulation} showToolbar={false} showFavoriteIcon={false} slot={slot}/>}>
										             <span className={classNames(css.simulationOptionValue, { [css.error]: slot.errors.simulation })} onMouseDown={(e) => {
											             if (slot.errors.simulation) {
												             e.stopPropagation();
												             e.preventDefault();

												             // I tried a variety of ways to tell the react-select to open, including using a timeout and eating the event propagation.  Nothing worked.
												             setTimeout(() => {
													             const { simulationSelect } = slot.component;
													             simulationSelect.focus();
												             }, 50)
											             }
										             }}>
														<sem.Icon name='database'/>
										                <span className='text'>{slot.label}</span>
													</span>
			</bp.Popover>);
	}


	renderContextMenu() {
		return <SimulationContextMenu slot={this.props.slot}/>
	}
}