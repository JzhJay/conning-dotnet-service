import * as css from './CloudWatchEventTable.css'
import {observer} from 'mobx-react';
import {ReactJson} from 'components'
import {} from 'stores'
import {bp} from '../../index';
import {SortableCardsPanel} from '../../widgets/SmartBrowser/SortableCardsPanel';
import { action, computed, observable, makeObservable } from 'mobx';
import {CloudWatchStreamEvent} from '../../../stores/aws';
import {LegacyAlertLogMessage, LegacyProcessLogMessage} from '../../../stores/aws/legacy/LegacySimulationMonitor';
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
export class EventTable_Wijmo extends React.Component<MyProps, {}> {
    @observable columnWidths = []

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    @computed get logEvents() {
		const {sortedAndFiltered}= this.props.context;

		return sortedAndFiltered.filter(e => e.legacyEvent instanceof LegacyAlertLogMessage).map(e => e.legacyEvent);
	}

    render() {
		const {logEvents, props: {context, context: {sortedAndFiltered}}} = this;
		return (
			<div className={css.root}>
				<Wj.FlexGrid
					isReadOnly
					selectionMode={wijmo.grid.SelectionMode.None}
					autoGenerateColumns={false}
					columns={[
						{header: 'Timestamp', width: '*',  binding: 'event.timestamp', dataType: 'Date', format: "MM/dd/yyyy hh:mm:ss"},
						{header: 'Target', binding: 'target', dataType: 'String'},
						{header: 'Process', binding: 'process', dataType: 'String'},
						{header: 'Block', binding: 'block', dataType: 'Number'},
						{header: 'Time', binding: 'time', dataType: 'Number' },
						{header: 'Level', binding: 'logLevel', dataType: 'String'},
						{header: ' ', width: '*', binding: 'logMessage', dataType: 'String'},
					]}
					itemFormatter={(panel: wijmo.grid.GridPanel, row: number, column: number, cell: HTMLElement) => {
						//console.log(panel, row, column, cell)
					}}
					itemsSource={logEvents}
				/>
			</div>
		);
	}
}
