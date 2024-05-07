import * as css from './CloudWatchDetails.css'
import {observer} from 'mobx-react';
import {sem, bp} from 'components'
import {CloudWatchStream} from 'stores'
import ReactJson from 'react-json-view';
import {LoadingUntil} from '../../widgets';
import type { TabId } from '@blueprintjs/core';
import {
	AnchorButton,
	Button,
	ButtonGroup,
	Checkbox,
	Navbar,
	NavbarDivider,
	NavbarGroup,
	NavbarHeading,
	Popover,
	PopoverInteractionKind,
	ProgressBar,
	Tab,
	Tabs,
	Tooltip
} from '@blueprintjs/core';
import { observable, makeObservable } from 'mobx';
import {CloudWatchStreamEvent} from '../../../stores/aws';
import {CloudWatchEventTable} from './CloudWatchEventTable';
import {CloudWatchPageContext, ISimulationStepDescriptor, simulationSteps} from './CloudWatchPageContext';
import {CloudWatchStreamNode} from './CloudWatchTree';
import {LoadingIndicator} from '../../semantic-ui';
import {CloudWatchToolbar} from './CloudWatchToolbar';
import {LegacyAlertLogMessage, LegacyProcessLogMessage} from '../../../stores/aws/legacy/LegacySimulationMonitor';
import {StorageBlockTable} from './StorageBlockTable';
import {EventTable_Wijmo} from './EventTable_Wijmo';

const {Step, Progress, Message} = sem;

@observer
export class CloudWatchEventList extends React.Component<{ context: CloudWatchPageContext }, {}> {
	render() {
		const {props, props: {context: {events, view}}} = this;

		switch (view) {
			case 'table':
				//return <CloudWatchEventTable {...props} />
				return <EventTable_Wijmo {...props} />

			case 'raw':
				return <div className={css.rawViewContainer}>
					{events && events.map((e, i) => <ReactJson key={i.toString()} src={e} collapsed/>)}
				</div>;
		}
	}
}

interface MyProps {
	context: CloudWatchPageContext;
}

@observer
export class CloudWatchDetails extends React.Component<MyProps, {}> {
    @observable selectedTab: TabId = 'table';

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {selectedTab, props: {context, context: {percentComplete, streamInstance, groupInstance, eventsParsed, descriptor}}} = this;

		var contents: React.ReactNode;
		if (streamInstance) {
			const {events, hasLoadedEvents} = streamInstance;

			contents = <LoadingUntil className={css.loadingPanel}
			                                   message="Loading events..."
			                                   loaded={hasLoadedEvents}>
				{false && <div>
					<p>
						There should be an additional static area at the top with the following information: maximum memory used by parser, compiler and worker processes (max over whole
						simulation),
						total elasped time, current and max memory consumption on each grid node (or max over nodes if there are too many of them) (this would be the total memory consumed per
						window
						task manager, not just what our system is using), current disk space used by sim, extrapolated remaining needed
					</p>

					<p>
						There should be a separate view that shows only warning/error messages - currnetly those are just displayed as they come in the overall message list, and quickly scroll
						off
						the screen
					</p>
				</div>}

				<CloudWatchSimulationToolbar context={context}/>

				<div className={css.stepsToolbar}>
					<Step.Group className={css.steps}>
						<SimulationLogStep context={context} step={simulationSteps.parse}/>
						<SimulationLogStep context={context} step={simulationSteps.compile}/>
						<SimulationLogStep context={context} step={simulationSteps.simulate}/>
						<SimulationLogStep context={context} step={simulationSteps.finalize}/>
					</Step.Group>
					<ButtonGroup vertical>
						<AnchorButton text="Pause Simulation" disabled icon="pause"/>
						<AnchorButton text="Cancel Simulation" disabled icon="cross"/>
						<AnchorButton text="Query Simulation" disabled icon="search"/>
					</ButtonGroup>
				</div>

				<Progress className={css.simulationProgress} percent={percentComplete} color='blue' progress='percent'/>

				<CloudWatchToolbar context={context}/>

				<div className={css.tables}>
					<StorageBlockTable context={context}/>
					<CloudWatchEventList context={context}/>
				</div>
			</LoadingUntil>
		}
		else {
			contents = <Message icon='pointing left' header='Choose a CloudWatch Log' content='Select a stream from the tree to my left.' />
		}

		return (
			<div className={css.root}>
				{contents}
			</div>
		)
	}
}

@observer
class SimulationLogStep extends React.Component<{ context: CloudWatchPageContext, step: ISimulationStepDescriptor }, {}> {
	render() {
		const {step, context, context: {eventsParsed}} = this.props;

		const info = eventsParsed[step.step];

		const stepClasses = classNames('step', {
			active:    context.selectedSteps.has(step.step),
			completed: info.percent >= 1
		});

		return (<Popover interactionKind={PopoverInteractionKind.HOVER}
		                 content={<SimulationStepInformation context={context} step={step}/>}
		                 className={stepClasses}>
				<div className={stepClasses}
				     onClick={() => context.step_onClick(step.step)}>

					<sem.Icon name={info.percent != null ? 'ellipsis horizontal' : step.icon}/>
					<Step.Content>
						<Step.Title>{step.title}</Step.Title>
					</Step.Content>
				</div>
			</Popover>
		);
	}
}

@observer
class SimulationStepInformation extends React.Component<{ context: CloudWatchPageContext, step?: ISimulationStepDescriptor }, {}> {
	render() {
		const {step, context} = this.props;
		var messages          = context.eventsParsed[step.step].logMessages;

		var max = {used: 0, allocated: 0, mapped: 0};
		messages.forEach(m => {
			if (m.legacyEvent instanceof LegacyAlertLogMessage) {
				max.used      = Math.max(max.used, m.legacyEvent.memUsed)
				max.allocated = Math.max(max.allocated, m.legacyEvent.memAllocated)
				max.mapped    = Math.max(max.mapped, m.legacyEvent.memMapped)
			}
		})

		var lastLogEvent = _.findLast(messages, m => m.legacyEvent instanceof LegacyAlertLogMessage);

		return <div className={bp.Classes.TOOLTIP}>
			<div style={{display: 'flex', flexDirection: 'row'}}>
				<div>
					<table className={classNames(css.stepTable, bp.Classes.HTML_TABLE)}>
						<thead>
						<th/>
						<th>Memory Used</th>
						<th>Memory Allocated</th>
						<th>Memory Mapped</th>
						</thead>
						<tbody>
						{!lastLogEvent
						 ? <tr>
							 <td>No Log Messages</td>
						 </tr>
						 : <>
							 <tr>
								 <td>Last:</td>
								 <td>{lastLogEvent.legacyEvent['memUsed'].toLocaleString()}</td>
								 <td>{lastLogEvent.legacyEvent['memAllocated'].toLocaleString()}</td>
								 <td>{lastLogEvent.legacyEvent['memMapped'].toLocaleString()}</td>
							 </tr>
							 <tr>
								 <td>Maximum:</td>
								 <td>{max.used.toLocaleString()}</td>
								 <td>{max.allocated.toLocaleString()}</td>
								 <td>{max.mapped.toLocaleString()}</td>
							 </tr>
						 </>}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	}
}

@observer
class CloudWatchSimulationToolbar extends React.Component<{ context?: CloudWatchPageContext }, {}> {
	render() {
		const {context: {jobId, descriptor, percentComplete}} = this.props;

		return <>
			<Navbar className={css.simulationToolbar}>
				<NavbarGroup align={bp.Alignment.LEFT}>
					<NavbarHeading><label>Job:</label>{jobId}</NavbarHeading>
				</NavbarGroup>
				<NavbarGroup align={bp.Alignment.RIGHT}>
					<NavbarHeading><label>Path:</label> <a href={`file://${descriptor.dfs}`}>{descriptor.dfs}</a></NavbarHeading>
				</NavbarGroup>
			</Navbar>
			<Navbar className={css.simulationToolbar}>
				<NavbarGroup align={bp.Alignment.LEFT}>
					<NavbarHeading><label>Time Periods:</label>{descriptor.minTime} to {descriptor.maxTime}</NavbarHeading>
					<NavbarDivider/>
					<NavbarHeading><label>Blocks:</label>{descriptor.blocks}</NavbarHeading>
				</NavbarGroup>
			</Navbar>
		</>
	}
}