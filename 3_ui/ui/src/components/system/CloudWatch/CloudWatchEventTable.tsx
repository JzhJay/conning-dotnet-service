import * as css from './CloudWatchEventTable.css'
import {observer} from 'mobx-react';
import {ReactJson, TimeAgo} from 'components'
import {} from 'stores'
import {bp} from '../../index';
import {SortableCardsPanel} from '../../widgets/SmartBrowser/SortableCardsPanel';
import {Cell, Column, ColumnHeaderCell, RowHeaderCell, SelectionModes, Table2} from '@blueprintjs/table';
import { action, observable, makeObservable } from 'mobx';
import {CloudWatchStreamEvent} from '../../../stores/aws';
import {LegacyProcessLogMessage} from '../../../stores/aws/legacy/LegacySimulationMonitor';
import {AnchorButton, Button, ButtonGroup, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Popover, Tooltip} from '@blueprintjs/core';
import {CloudWatchStreamNode} from './CloudWatchTree';
import {CloudWatchPageContext} from './CloudWatchPageContext';

interface MyProps {
	context: CloudWatchPageContext;
}

interface IColumn {
	header: string,
	align?: 'left' | 'center' | 'right';
	width?: number,
	renderCell: (CloudWatchStreamEvent) => React.ReactNode
}

@observer
export class CloudWatchEventTable extends React.Component<MyProps, {}> {
    table: Table2;

    @observable columnWidths = []

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {props: {context, context: {sortedAndFiltered}}} = this;

		const columns: Array<IColumn> = [
			{header: 'Process', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['process'] ? e.legacyEvent['process'] : e.message.target},
			{header: 'Block', align: 'right', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['block']},
			{header: 'Time', align: 'right',renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['time']},
			{header: 'Level', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['logLevel']},
			{header: '', width: 250,  renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['logMessage']},

			{header: 'Step', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['step']},
			{header: 'Task', renderCell: (e: CloudWatchStreamEvent) => e.message.target},
			{header: 'Used', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['memUsed'] && e.legacyEvent['memUsed'].toLocaleString()},
			{header: 'Allocated', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['memAllocated']&& e.legacyEvent['memAllocated'].toLocaleString()},
			{header: 'Mapped', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent && e.legacyEvent['memMapped'] && e.legacyEvent['memMapped'].toLocaleString()},
			{header: 'Timestamp', width:200, renderCell: (e: CloudWatchStreamEvent) => new Date(e.timestamp).toString()}, //<TimeAgo datetime={Date.parse(e.timestamp)}/>},
			//{header: 'Raw', renderCell: (e: CloudWatchStreamEvent) => <ReactJson src={e} collapsed/>},
		];

		const alertColumns: Array<IColumn> = [
			{header: 'Block', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent['block']},
			{header: 'Time', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent['time']},
			{header: 'Level', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent['logLevel']},
			{header: 'Message', renderCell: (e: CloudWatchStreamEvent) => e.legacyEvent['logMessage']},
			{header: 'Raw', renderCell: (e: CloudWatchStreamEvent) => <ReactJson src={e} collapsed/>}
		];

		return (
			<div className={css.root}>
				<Table2 ref={r => this.table = r}
				       numRows={sortedAndFiltered.length}
				       columnWidths={columns.map(c => c.width ? c.width : 100)}
				       className={css.blueprintTable}
				       numFrozenColumns={2}
				       enableRowHeader={true}
				       selectionModes={SelectionModes.ROWS_ONLY}
				       defaultRowHeight={30}
				       enableRowResizing
				       rowHeaderCellRenderer={r => {
					       const event = sortedAndFiltered[r]

					       return <RowHeaderCell>
						       {/*{event.legacyEvent instanceof Legacy
						       LogMessage ? <Button icon="plus"/> : ''}*/}
					       </RowHeaderCell>
				       }}
				>
					{columns.map(
						(col, cIndex) => {
							return <Column key={cIndex.toString()}
							               name={col.header}
							               columnHeaderCellRenderer={(c) =>
								               <ColumnHeaderCell index={c} enableColumnReordering>
									               <div className={css.columnCell}>
										               <span className={css.columnHeaderText}>{col.header}</span>
										               {/*{sortBy != col.binding*/}
										               {/*? null*/}
										               {/*: <span className={`wj-glyph-${sortOrder == 'asc' ? 'up' : 'down'}`}/>}*/}
									               </div>
								               </ColumnHeaderCell>}

							               cellRenderer={
								               (r, c) => {
									               var event = sortedAndFiltered[r];

									               return <Cell interactive className={classNames(col.align)}>
										               <Popover interactionKind={bp.PopoverInteractionKind.HOVER}
										                        disabled={c != 0}
										                        modifiers={{keepTogether: {enabled: false}, preventOverflow: {enabled: false}}}
										                        position={bp.Position.RIGHT}
										                        content={<EventTableTooltip e={event}/>}>
											               <div>
												               {columns[c].renderCell(event)}
											               </div>
										               </Popover>
									               </Cell>;
								               }}
							/>;
						})}
				</Table2>
			</div>
		);
	}
}

@observer
export class EventTableTooltip extends React.Component<{ e: CloudWatchStreamEvent }, {}> {
	render() {
		const {e} = this.props;

		return e ? <div className={css.tooltip}><ReactJson src={e.message}/></div> : null;
	}
}