import * as css from './Simulations.css';
import {sem, bp, FormWarnings, SortableSimulationSlotElement} from 'components';
import { observer } from "mobx-react";
import { Report, simulationStore } from 'stores';
import { computed, observable, makeObservable } from "mobx";
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc';
import FlipMove from 'react-flip-move';

interface MyProps {
	report: Report;
	style?: React.CSSProperties;
	className?: string;
	showTitle?: boolean;
}

@observer
class SortableSimulations extends React.Component<{ readonly?: boolean, disableAnimation?: boolean, report: Report, isTooltip?: boolean } & SortableContainerProps, {}> {
	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed
	get warnings() {
		const warnings = [];

		const {props: { report: { simulationSlots } } } = this;

		simulationSlots.forEach((slot, i) => {
			const { label, id } = slot;

			if (!slot.simulationId || (simulationStore.hasLoadedDescriptors && !slot.simulation)) {
				warnings.push(<li className="content" key={`${id}-needs-sim`}><a onClick={() => {
					slot.component.simulationSelect.focus();
				}}>{label}</a> needs a simulation.</li>)
			}
		});

		return warnings;
	}

    render() {
		const { warnings, props: { readonly, disableAnimation, isTooltip, report, report: { simulationSlots } } } = this;
		return <FlipMove className={classNames(css.simulations)} maintainContainerHeight disableAllAnimations={disableAnimation}>
			{simulationSlots.length == 0 && <NoSimulationSlots key="no-slots" {...this.props as any} />}
			{simulationSlots.map((slot, i) => <SortableSimulationSlotElement index={i} key={i.toString()} slot={slot} {...this.props} />)}
			{/*{!readonly && !isTooltip && <AddASimulationSlot key='add' report={report}/>}*/}

			{false && warnings.length > 0 && <FormWarnings key="warnings" messages={warnings}/>}
		</FlipMove>
	}
}

const SortableSimulationContainer = SortableContainer(SortableSimulations);

@observer
export class ReportSimulations extends React.Component<MyProps, {}> {
    @observable disableAnimation = false;
    @observable dragging = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const { dragging, disableAnimation, props: { className, showTitle, style, report, report: { simulationSlots } } } = this;

		return (
			<sem.Card style={style} className={classNames(css.root, className, { [css.noDrag]: report.simulationSlots.length < 2, [css.dragging]: dragging })}>
				{showTitle && <sem.Card.Content>
					<sem.Card.Header className={css.header}>
						{/*<sem.Icon className="left floated" size='large' fitted name='database'/>*/}
						<span className={css.title}>Simulations</span>
						<span className={bp.Classes.BUTTON_GROUP}>
							<bp.Button icon="plus" text="Add a Simulation" onClick={() => report.addSimulationSlot()}/>
						</span>
					</sem.Card.Header>
				</sem.Card.Content>}

				<sem.Card.Content>
					<SortableSimulationContainer {...this.props} useDragHandle axis='xy'
					                     helperClass='sortable-drag'
					                     shouldCancelStart={() => report.simulationSlots.length < 2}
					                     disableAnimation={disableAnimation}
					                     onSortStart={() => {
						                     this.dragging = true;
						                     this.disableAnimation = true
					                     }}
					                     onSortEnd={this.onReorderSimulations}/>
				</sem.Card.Content>
			</sem.Card>)
	}

    onReorderSimulations = (e: { oldIndex: number, newIndex: number }) => {
		this.dragging = false;
		const { newIndex, oldIndex } = e;
		//console.log(order, sortable, event);
		this.props.report.simulationSlots.move(oldIndex, newIndex);
		this.disableAnimation = false;
	}
}


class NoSimulationSlots extends React.Component<MyProps, {}> {
	render() {
		const { report } = this.props;

		return <sem.Card.Content>
			<sem.Message className={css.emptyPage} warning>
				<sem.Message.Header>Your report does not have any simulations defined.</sem.Message.Header>
				<sem.Message.Content>
					<sem.Message.List>
						<sem.Message.Item>
							<a
								onClick={() => report.addSimulationSlot()}>Add a Simulation</a>
						</sem.Message.Item>
					</sem.Message.List>
				</sem.Message.Content>
			</sem.Message>
		</sem.Card.Content>
	}
}


