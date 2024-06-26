import { QueryContextMenu, sem, bp, ReactSelect, QueryCard, SimulationCard, AvailableQueryViewDropdown, AvailableQueryViewMenuItems, AppIcon, FormWarnings, VerticalDragHandle } from 'components';
import { observer } from "mobx-react";
import { Link, utility, Report, ReportQuery, viewDescriptors, ReportQueryStatus, queryStore, simulationStore, routing, appIcons, SimulationSlotGuid, Query } from 'stores';
import { computed, observable, reaction, makeObservable } from "mobx";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import * as css from './QuerySlots.css'
import { QuerySlotComponent, SortableQuerySlot } from "./QuerySlot";
import { ReportCardPanel } from "./ReportCardPanel";
import FlipMove from 'react-flip-move';

interface MyProps {
	report: Report;
	style?: React.CSSProperties;
	showTitle?: boolean;
}

@observer
class QuerySlots extends React.Component<{ disableAnimation: boolean, report: Report, isTooltip?: boolean }, {}> {
	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed
	get warnings() {
		const { slotComponents, props: { report: { querySlots } } } = this;

		const warnings = [];
		querySlots.forEach((slot, i) => {
			const { id, label, simulationSlots } = slot;

			if (simulationSlots && _.some(simulationSlots, ss => !ss || !ss.simulationId)) {
				warnings.push(
					<li className="content" key={`${id}-needs-sim`}>
						<a onClick={() => slotComponents[id].simulationSelect.focus()}>{label}</a> is bound to a slot, but not a simulation.
					</li>)
			}
		});
		return warnings;
	}

    slotComponents: { [id: string]: QuerySlotComponent } = {};

    render() {
		const { warnings, slotComponents, props: { disableAnimation, isTooltip, report, report: { querySlots } } } = this;
		return <FlipMove className={classNames(css.queries, "content")} maintainContainerHeight disableAllAnimations={disableAnimation}>
			{querySlots.length == 0 && <NoQuerySlotsCardContent key="no-queries" {...this.props} />}
			{querySlots.map((reportQuery, i) => <SortableQuerySlot index={i} key={reportQuery.id} reportQuery={reportQuery} componentRef={r => slotComponents[reportQuery.id] = r} {...this.props} />)}

			{false && warnings.length > 0 && <FormWarnings key="warnings" messages={warnings}/>}
		</FlipMove>
	}
}

const SortableQueries = SortableContainer(QuerySlots);

@observer
export class QuerySlotsCard extends React.Component<MyProps, {}> {
    @observable disableAnimation = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const { disableAnimation, props: { style, showTitle, report, report: { querySlots } } } = this;

		return (
			<ReportCardPanel style={style} className={css.root}
			                 title='Queries'
			                 actions={(
				                 <div>
					                 <bp.AnchorButton icon='plus' text="New Query" onClick={() => report.addReportQuery()}/>
				                 </div>).props.children}
			                 icon={<bp.Icon icon='document' />}>

				<SortableQueries {...this.props} useDragHandle axis='y'
				                 disableAnimation={disableAnimation}
				                 helperClass='sortable-drag'
				                 onSortStart={() => {
					                 console.log('sort start');
					                 this.disableAnimation = true
				                 }}
				                 onSortEnd={this.onReorderQueries}/>
			</ReportCardPanel>)
	}

    onReorderQueries = (e: { oldIndex: number, newIndex: number }) => {
		console.log('reorder queries', e);

		this.disableAnimation = false
	}
}


class NoQuerySlotsCardContent extends React.Component<MyProps, {}> {
	render() {
		const { report } = this.props;

		return <sem.Card.Content extra>
			<sem.Form as="div">
				<sem.Form.Field>
					Your report does not have any queries defined.<br/> <a
					onClick={() => report.addReportQuery()}>Add a Query Slot</a>
				</sem.Form.Field>
			</sem.Form>
		</sem.Card.Content>
	}
}
