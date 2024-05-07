import {AnchorButton, Breadcrumb, Icon, Popover, Tab, Tabs} from '@blueprintjs/core';
import {ClimateRiskAnalysisObjectLink} from 'components/system/ClimateRiskAnalysis/ClimateRiskAnalysisObjectLink';
import {IOObjectLink} from 'components/system/IO/IOObjectLink';
import {QueryObjectLink} from 'components/system/query-tool/QueryObjectLink';
import {SimulationObjectLink} from 'components/system/simulation/SimulationObjectLink';
import {action, observable, makeObservable, computed} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {ClimateRiskAnalysis, i18n, IO, Query, Simulation, utility} from '../../stores';
import {controlPanelStore} from '../../stores/controlPanel';
import {site} from '../../stores/site';
import * as appBar from '../../styles/ApplicationBarItems.css';
import {kTimestampToUnixTimestamp} from '../../utility';
import {bp} from '../index';
import {ApplicationPage} from '../site';
import * as css from './ControlPanelPage.css';

@observer
export class ControlPanelPage extends React.Component<{}, {}> {

	static get APPLICATION_TITLE() { return i18n.intl.formatMessage({defaultMessage: "Control Panel", description:"[ControlPanelPage] the page title display on the browser tab, system application menu and the page's top-left button"}) }

	constructor(props, state) {
        super(props, state);

        makeObservable(this);

        controlPanelStore.loadProcesses();
        controlPanelStore.loadGrids();
        controlPanelStore.loadGridJobs();
    }

	@observable selectedTabId: string = "apps";

	@action refresh = async () => {
		if (this.isGridJobsTab) {
			await controlPanelStore.loadGrids();
			await controlPanelStore.loadGridJobs();
		}
		else if (this.isWorkerManagerAppsTab) {
			await controlPanelStore.loadProcesses();
		}
	}

	get isGridJobsTab() {
		return this.selectedTabId == "gridJobs";
	}

	get isWorkerManagerAppsTab() {
		return this.selectedTabId == "apps";
	}

	@action tabChange = (tabId) => {
		this.selectedTabId = tabId;
	}

	render() {
		return <ApplicationPage
				className={css.root}
				title={() => ControlPanelPage.APPLICATION_TITLE}
				breadcrumbs={() => [
					<Breadcrumb className={css.breadcrumb} text={<><Icon title="Control Panel" icon="control"/>{ControlPanelPage.APPLICATION_TITLE}</>}/>
				]}
				afterBreadcrumbs={() => <div className={classNames(appBar.applicationBarItems, css.applicationBar)}>
					<bp.AnchorButton
						icon={"refresh"}
						minimal={true}
						text={i18n.intl.formatMessage({defaultMessage: "Refresh", description:"[ControlPanelPage] button text - ask renew the application/grid status from the back-end"})}
						onClick={this.refresh}>
					</bp.AnchorButton>
					{this.isGridJobsTab && <GridPicker/>}
					<Tabs id="controlPanel" selectedTabId={this.selectedTabId} onChange={this.tabChange} large={true}>
						<Tab id="apps" title={i18n.intl.formatMessage({defaultMessage: "Worker Manager Apps", description:"[ControlPanelPage] tab text - a page shows working applications on the back-end"})} />
						<Tab id="gridJobs" title={i18n.intl.formatMessage({defaultMessage: "Grid Jobs", description:"[ControlPanelPage] tab text - a page shows processing grid jobs on the back-end"})} />
					</Tabs>
				</div>}>
			{this.isWorkerManagerAppsTab && <WorkerManager/>}
			{this.isGridJobsTab && <GridJobs/>}
		</ApplicationPage>
	}
}

@observer
class WorkerManager extends React.Component<{}, {}> {
    @action delete = async (name, id) => {
		if (await site.confirm(i18n.intl.formatMessage(
			{
				defaultMessage: `Are you sure you want to delete the {name} with ID: {id}?`,
				description:"[WorkerManager] confirm message before delete an application"
			},
			{name, id}
		))) {
			controlPanelStore.delete(name, id);
		}
	}

    constructor(props: {}) {
        super(props);
        makeObservable(this);
    }

	objectNameMapping = (p) => {
		switch (p.name) {
			case 'RepoToolServer':
			case 'SimulationServer':
			case 'RSSimulationServer':
				return <SimulationObjectLink id={p.guid.split('-')[0]} />;
			case 'QueryServer':
				return <QueryObjectLink id={p.guid} />;
			case 'IOMonitorServer':
				return <IOObjectLink id={p.guid} />;
			case'ClimateRiskAnalyzerServer':
				return <ClimateRiskAnalysisObjectLink id={p.guid} />;
			default:
				return "";
		}
	}

	@computed get processes() {
		return _.sortBy(controlPanelStore.processes, ["checkin"]);
	}

    render() {
		return <table className={classNames(bp.Classes.HTML_TABLE, bp.Classes.HTML_TABLE_STRIPED)}>
			<thead>
			<tr>
				<th>{i18n.common.WORDS.NAME}</th>
				<th>{i18n.common.WORDS.ID}</th>
				<th><FormattedMessage defaultMessage={"Object Name"} description={"[WorkerManager] table column - Indicates the object name which related by the application"} /></th>
				<th><FormattedMessage defaultMessage={"Workers Requested"} description={"[WorkerManager] table column - Indicates the numbers of the application workers requested"} /></th>
				<th><FormattedMessage defaultMessage={"Workers Ready"} description={"[WorkerManager] table column - Indicates the numbers of the application workers is ready to work"} /></th>
				<th><FormattedMessage defaultMessage={"Last Check In"} description={"[WorkerManager] table column - Indicates the time that this process last checked in to report that it was alive"} /></th>
				<th><FormattedMessage defaultMessage={"Timeout (mins)"} description={"[WorkerManager] table column - Indicates the setting of minutes past to close the application if there is no request anymore"} /></th>
			</tr>
			</thead>
			<tbody>
			{this.processes.map(p => {
				return (
					<tr className={css.process} key={p.guid + p.name}>
						<td>{p.name} <Icon className={css.delete} icon="delete" iconSize={20} onClick={() => this.delete(p.name, p.guid)}/></td>
						<td>{p.guid}</td>
						<td>{this.objectNameMapping(p)}</td>
						<td>{p.workers.length}</td>
						<td>{p.workers.filter(w => w).length}</td>
						<td>{new Date(p.checkin + "Z").toLocaleString()}</td>
						<td>{p.timeoutMins || "N/A"}</td>
					</tr>)
			})}
			</tbody>
		</table>
	}
}

@observer
class GridPicker extends React.Component<{}, {}> {
    @action setGrid = (grid) => {
		controlPanelStore.selectedGrid = grid;
		controlPanelStore.loadGridJobs();
	}

    constructor(props: {}) {
        super(props);
        makeObservable(this);
    }

    render() {
		return <Popover
			position={bp.Position.BOTTOM_LEFT}
			minimal
			hoverOpenDelay={300} hoverCloseDelay={600}
			interactionKind={bp.PopoverInteractionKind.CLICK}
			popoverClassName={classNames(css.popover, utility.doNotAutocloseClassname)}
			canEscapeKeyClose
			content={<bp.Menu>{controlPanelStore.grids.map(g => <bp.MenuItem key={g} text={g} onClick={() => this.setGrid(g)} />)}</bp.Menu>}>
			<AnchorButton className={classNames(bp.Classes.MINIMAL, css.pageNumberButton)} rightIcon="caret-down" text={controlPanelStore.selectedGrid}/>
		</Popover>
	}
}

@observer
class GridJobs extends React.Component<{}, {}> {
	cancelJob = async (job) => {
		if (await site.confirm(i18n.intl.formatMessage(
			{
				defaultMessage: `Are you sure you want to cancel the {jobType} job?`,
				description:"[GridJobs] confirm message before cancel a Grid job"
			},
			{jobType: job.jobType}
		))) {
			controlPanelStore.cancelJob(job.id);
		}
	}

	render() {
		return <table className={classNames(bp.Classes.HTML_TABLE, bp.Classes.HTML_TABLE_STRIPED)}>
			<thead>
			<tr>
				<th><FormattedMessage defaultMessage={"Job Type"} description={"[GridJobs] table column - Indicates the type of the job"} /></th>
				<th><FormattedMessage defaultMessage={"Status"} description={"[GridJobs] table column - Indicates the status of the job"} /></th>
				<th><FormattedMessage defaultMessage={"Submitted By"} description={"[GridJobs] table column - Indicates who request this job"} /></th>
				<th><FormattedMessage defaultMessage={"Version"} description={"[GridJobs] table column - Indicates the version of the job"} /></th>
				<th><FormattedMessage defaultMessage={"Started"} description={"[GridJobs] table column - Indicates the time that this job start."} /></th>
			</tr>
			</thead>
			<tbody>
			{controlPanelStore.gridJobs.map(job => {
				return <tr className={css.process} key={job.id}>
						<td>{job.jobType} <Icon className={css.delete} icon="stop" iconSize={20} onClick={() => this.cancelJob(job)}/></td>
						<td>{job.status}</td>
						<td>{job.user}</td>
						<td>{job.version}</td>
						<td>{kTimestampToUnixTimestamp(job.started).toLocaleString()}</td>
				</tr>
			})}
			</tbody>
		</table>
	}
}
