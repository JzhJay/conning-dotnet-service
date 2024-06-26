import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {buildURL} from '../../../utility/utility';
import * as css from './BillingReportPage.css'
import {observer} from 'mobx-react';
import {bp, ApplicationPage, LoadingUntil, ErrorBoundary, AppIcon, ResizeSensorComponent, IconButton} from 'components'
import {settings, user, billingGraph, apolloStore, cg, appIcons, utility} from 'stores'
import { action, autorun, computed, observable, runInAction, makeObservable } from 'mobx';
import {ActiveTool, routing, i18n} from 'stores';
import {Alignment, AnchorButton, Navbar, NavbarGroup, NavbarHeading, Tooltip, HTMLTable} from '@blueprintjs/core';
import {DateRangeInput} from '@blueprintjs/datetime'
import {IDateRangeInputProps} from '@blueprintjs/datetime/lib/esm/dateRangeInput';
import {UserChooser} from './UserChooser';
import { BillingApplicationChooser} from './BillingApplicationChooser';
import { i18nMessages } from './i18nMessages';
import MomentLocaleUtils from "react-day-picker/moment";

import * as moment from 'moment'

interface BillingReportContextProps {
	initStartDate?: Date;
	initEndDate?: Date;
}

export class BillingReportContext {
	constructor(params : BillingReportContextProps = {}) {
        makeObservable(this);
        const { initStartDate, initEndDate } = params;
        this.endDate = initEndDate || new Date();

        if (initStartDate) {
			this.startDate = initStartDate;
		} else {
			var oneWeekAgo = new Date(this.endDate);
			oneWeekAgo.setDate(this.endDate.getDate() - 6);
			this.startDate = oneWeekAgo;
		}
    }

	@observable startDate = null;
	@observable endDate = null;
	@observable selectedUsers = [];
	@observable detailMode:DetailMode = DetailMode.collapsed;

	@observable isDirty = true;
}

enum DetailMode {
	unset,
	expanded,
	collapsed
}

interface MyProps {
	initStartDate?: Date;
	initEndDate?: Date;
	location?: HistoryModule.LocationDescriptorObject;
}

@observer
export class BillingReportPage extends React.Component<MyProps, {}> {
	@observable pageContext = new BillingReportContext(this.props);
	_toDispose = [];
	@observable billingInfo; //: BillingInfo = null;

	$printPortal;
	@observable isPrinting = false;

	dateInputProps : IDateRangeInputProps = {
		formatDate: date => date.toLocaleDateString(),
		parseDate:  date => new Date(date),
		contiguousCalendarMonths: true,
		maxDate: new Date(),
		allowSingleDayRange: true,
		shortcuts: this.customDateRange(),
		className: css.dateRange
	}

	constructor(props) {
        super(props);
        makeObservable(this);
        this.$printPortal = $('<div>').addClass(css.printPortal);

		this.startUp();
    }

	afterPrintListener = () => { this.isPrinting = false; }

	componentDidMount() {
		/*runInAction(async () => {
			let billingInfo = await billing.loadInfo();
			if (!(billingInfo.licenseStart instanceof Date)) {
				billingInfo.licenseStart = new Date(billingInfo.licenseStart)
			}
			this.billingInfo = billingInfo;
		});*/
		this.$printPortal.appendTo(document.body);
		window.addEventListener('afterprint', this.afterPrintListener);
	}

	startUp() {
		/*var setToCurrentUserOnLogin = autorun(() => {
			const {users, currentUser, hasLoadedUsers} = user;


			if (currentUser && hasLoadedUsers) {
				this.pageContext.selectedUsers.set(user.currentUser.user_id, user.users.get(user.currentUser.user_id));
				setToCurrentUserOnLogin && setToCurrentUserOnLogin();
			}
		}, {name: `setToCurrentUserOnLogin`});*/

		this._toDispose.push(
			autorun(() => {
				const {query: {start, end, user}} = routing;
				runInAction(() => {
				});
			}, {name: `Watch URL for changes`}))

		// 	const {pageContext, preferences: {selectedObjectType}} = this;
		// 	pageContext.catalogContext.objectTypes.replace([selectedObjectType]);
		// 	if (omdb.loadedUi && omdb.loadedTags) {
		// 		var schema = omdb.schema.get(selectedObjectType);
		// 		var ui     = omdb.ui.get(selectedObjectType);
		//
		// 		if (schema == null) {
		// 			schema = {objectType: selectedObjectType, tags: observable.array<OmdbTag>([]), userTags: observable.array<OmdbTag>()};
		// 			omdb.schema.set(selectedObjectType, schema);
		// 		}
		//
		// 		if (ui == null) {
		// 			ui = observable<IOmdbUi>({
		// 				objectType: name,
		// 				catalog:    {tags: []},
		// 				card:       {sections: observable.array<OmdbCardSection>([]), title: null},
		// 				table:      {columns: []}
		// 			});
		//
		// 			omdb.ui.set(selectedObjectType, ui);
		// 		}
		//
		// 		pageContext.schema = schema;
		// 		pageContext.ui     = ui;
		// 	}

		this.runReport();
	}

	componentWillUnmount() {
		this._toDispose.forEach(f => f());
		this.$printPortal && this.$printPortal.remove();
		window.removeEventListener('afterprint', this.afterPrintListener);
	}

	getStartDate() {
		var startDate = new Date(this.pageContext.startDate)
		// set local time to begin of day
		startDate.setHours(0, 0, 0, 0)
		// adjust date since apollo will convert the date to UTC date when querying
		return new Date(startDate.getTime() - startDate.getTimezoneOffset()*60*1000);
	}

	getEndDate() {
		var endDate = new Date(this.pageContext.endDate)
		// set local time to end of day
		endDate.setHours(23, 59, 59, 999);
		// adjust date since apollo will convert the date to UTC date when querying
		return new Date(endDate.getTime() - endDate.getTimezoneOffset()*60*1000);;
	}

	downloadFile = async (fileType) => {
		let startDate = this.getStartDate().toISOString();
		let endDate = this.getEndDate().toISOString();
		let separators: any = utility.getCsvSeparators(user.region);
		separators = separators ? JSON.stringify(separators) : null;
		let url = buildURL(`${routing.rootUrl}/api/billing/download`, {startDate: encodeURIComponent(startDate)},
																					{endDate: encodeURIComponent(endDate)},
																					{userIds: `${this.selectedUsers}`, enabled:this.selectedUsers != null},
																					{expanded: this.detailsTableRef.hasExpandedEntry()},
																					{separators: separators},
																					{fileType: fileType});

		await utility.downloadFile(url, true, `${this.exportFileName}.${fileType}`);
	}

	get exportFileName(){ return `${this.getDate(this.getStartDate().toISOString())}_${this.getDate(this.getEndDate().toISOString())}_bill`; }

	getDate = d => d.slice(0, 10);

	@observable bill; //: CalculatedBill;
	userChooserRef: UserChooser;
	billingApplicationChooserRef: BillingApplicationChooser;
	detailsTableRef: SimulationBillingDetailsTable;
	detailMode:DetailMode;


	render() {
		const {bill, pageContext, billingInfo, userChooserRef, preferences: p, data, loading, error} = this;
		const isManager = user.isInRole("admin") || user.isInRole('manager');

		return <ApplicationPage className={css.root}
				                 title={() => i18n.intl.formatMessage(i18nMessages.billingReport)}
				                 tool={ActiveTool.billing}
				                 loaded={user.isLoggedIn && user.currentUser}
				                 breadcrumbs={() => [
					                 <div key="bc" className={bp.Classes.BREADCRUMB}>
						                <AnchorButton className={bp.Classes.MINIMAL} icon={<AppIcon icon={appIcons.tools.billing} />}>
											<FormattedMessage {...i18nMessages.billingReport} />
										</AnchorButton>
					                 </div>
				                 ]}>
					<Navbar className={css.toolbar}>
						{/*<NavbarGroup>
							<NavbarHeading>Licensed Since: <b>1/1/2018{false && billingInfo.licenseStart.toLocaleDateString()}</b></NavbarHeading>
						</NavbarGroup>*/}

						<NavbarGroup>
							<div className={css.innerHeaderGroup}>
								<NavbarHeading><FormattedMessage {...i18nMessages.reportRange} /></NavbarHeading>
								<DateRangeInput value={[pageContext.startDate, pageContext.endDate]}
												onChange={action(range => {
													pageContext.startDate = range[0];
													pageContext.endDate = range[1];
													pageContext.isDirty = true;
												})} {...this.dateInputProps}
												locale={i18n.intl.locale}
												localeUtils={MomentLocaleUtils}
												/>
							</div>

							<div className={css.innerHeaderGroup}>
								<NavbarHeading><FormattedMessage {...i18nMessages.users} /></NavbarHeading>
								<UserChooser ref = {r => this.userChooserRef = r} multiple />
							</div>

							<div className={css.innerHeaderGroup}>
								<NavbarHeading><FormattedMessage {...i18nMessages.applications} /></NavbarHeading>
								<BillingApplicationChooser ref={r => this.billingApplicationChooserRef = r}/>
							</div>

							<div className={css.innerHeaderGroup}>
								<bp.Tooltip content={i18n.intl.formatMessage(i18nMessages.runReport)} position={bp.Position.BOTTOM_RIGHT}>
									<AnchorButton disabled={!pageContext.isDirty} onClick={this.runReport} text={i18n.intl.formatMessage(i18nMessages.runReport)} icon="play"/>
								</bp.Tooltip>
							</div>
						</NavbarGroup>

						<NavbarGroup align={Alignment.RIGHT}>
							<div className={css.innerHeaderGroup}>
								<bp.ButtonGroup>
									<bp.Tooltip content={i18n.intl.formatMessage(i18nMessages.collapseAll)} position={bp.Position.BOTTOM_RIGHT}>
										<AnchorButton onClick={() => this.pageContext.detailMode = DetailMode.collapsed} text={i18n.intl.formatMessage(i18nMessages.collapseAll)} icon="collapse-all"/>
									</bp.Tooltip>
									<bp.Tooltip content={i18n.intl.formatMessage(i18nMessages.expandAll)} position={bp.Position.BOTTOM_RIGHT}>
										<AnchorButton onClick={() => this.pageContext.detailMode = DetailMode.expanded} text={i18n.intl.formatMessage(i18nMessages.expandAll)} icon="expand-all"/>
									</bp.Tooltip>
								</bp.ButtonGroup>
							</div>
							<div className={css.innerHeaderGroup}>
								<bp.ButtonGroup>
									<bp.Tooltip content={i18n.common.FILE_CTRL.PRINT} position={bp.Position.BOTTOM_RIGHT}>
										<AnchorButton onClick={()=>{ this.isPrinting = true; }} text={i18n.common.FILE_CTRL.PRINT} icon="print"/>
									</bp.Tooltip>

										<bp.Popover position={bp.Position.BOTTOM_RIGHT}
										            interactionKind={bp.PopoverInteractionKind.CLICK}
										>
											<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.FILE_CTRL.DOWNLOAD}>
											<IconButton icon={appIcons.investmentOptimizationTool.download} text={i18n.common.FILE_CTRL.DOWNLOAD} target="download"/>
											</bp.Tooltip>
											<bp.Menu>
												<bp.MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.CSV)} onClick={() => this.downloadFile('csv')}/>
												<bp.MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.XLSX)} onClick={() => this.downloadFile('xlsx')}/>
											</bp.Menu>
										</bp.Popover>

								</bp.ButtonGroup>
							</div>
						</NavbarGroup>

					</Navbar>
					<ErrorBoundary error={error}>
						<LoadingUntil className={css.details} loaded={!loading}>
							{!loading && <>
							{/*<BillingTotals total={data.billing.report.simulationSummary.simulationTotal}/> */}

								<SimulationBillingDetailsTable ref={r => this.detailsTableRef = r} summary={data.billing.report.simulationSummary} pageContext={pageContext}/>
							</>}
						</LoadingUntil>
						{/*<code>{JSON.stringify(data.billing)}</code>*/}
					</ErrorBoundary>

					{this.isPrinting && !loading && ReactDOM.createPortal([
							<div className={css.printTitle}><FormattedMessage {...i18nMessages.printModeTitle} /></div>,
							<div className={css.printDuration}>{`${this.getStartDate().toUTCString()} ~ ${this.getEndDate().toUTCString()}`}</div>,
							<SimulationBillingDetailsTable summary={data.billing.report.simulationSummary} pageContext={pageContext} printMode={true}/>,
							<div className={css.printFooter}><FormattedMessage {...i18nMessages.printModeFooter} /></div>
						],
						this.$printPortal[0]
					)}
				</ApplicationPage>
	}

	renderContextMenu() {
		return null; //<SimulationContextMenu location='browser' panel={this.panel}/>
	}

	get preferences() {
		return settings.pages.billing
	}

	data;
	@observable loading = false;
	error;

	get selectedUsers() {
		return this.userChooserRef && this.userChooserRef.selectedUsers.length > 0 ? this.userChooserRef.selectedUsers.map(u => u._id) : null;
	}

	get selectedApplications() {
		return this.billingApplicationChooserRef && this.billingApplicationChooserRef.selectedApplications.length > 0 ? this.billingApplicationChooserRef.selectedApplications : null;
	}

	@action
	private runReport = async () => {
		const startDate = this.getStartDate();
		const endDate = this.getEndDate();
		const userIds = this.selectedUsers;
		const applications = this.selectedApplications;

		this.loading = true;
		this.error = null;
		try {
			this.data = (await apolloStore.client.query<cg.RunBillingReportQuery>({
				query:     billingGraph.runBillingReport,
				variables: { startDate, endDate, userIds, applications}
			})).data;
		}
		catch (e) {
			this.error = e;
		}

		this.loading = false;
	}

	// Based on createDefaultShortcuts in dateRangePicker.js
	customDateRange() {
		const today = new Date();
		var createShortcut = (label, dateRange) => { return { dateRange: dateRange, label: label };}

		var makeDate = (action, delta = 1) => {
			var returnVal = new Date(today);
			action(returnVal);
			returnVal.setDate(returnVal.getDate() + delta);
			return returnVal;
		}

		var yesterday = makeDate(function (d) { return d.setDate(d.getDate() - 2); });
		var oneWeekAgo = makeDate(function (d) { return d.setDate(d.getDate() - 7); });
		var oneMonthAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 1); });
		var threeMonthsAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 3); });
		var sixMonthsAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 6); });
		var oneYearAgo = makeDate(function (d) { return d.setFullYear(d.getFullYear() - 1); });
		var twoYearsAgo = makeDate(function (d) { return d.setFullYear(d.getFullYear() - 2); });
		var thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
		var lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
		var lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1);
		var yearStart = new Date(today.getFullYear(), 0, 1);

		return [
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutToday), [today, today]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutYesterday), [yesterday, yesterday]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutThisMonth), [thisMonthStart, today]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutLastMonth), [lastMonthStart, lastMonthEnd]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutThisYear), [yearStart, today]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutPastWeek), [oneWeekAgo, today]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutPastMonth), [oneMonthAgo, today]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutPast3Months), [threeMonthsAgo, today]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutPast6Months), [sixMonthsAgo, today]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutPastYear), [oneYearAgo, today]),
			createShortcut(i18n.intl.formatMessage(i18nMessages.datePickerShortcutPast2Years), [twoYearsAgo, today]),
		];
	}

}

@observer
class BillingTotals extends React.Component<{ precision?: number, total: any /*cg.RunBillingReport.Total*/ }, {}> {
	static defaultProps = {
		precision: 7
	}

	render() {
		const {props: {precision, total: {dataElements, dataStorageCharge, dataServingChargeSimulation, simulationCharge, ongoingDataStorageChargePerDay}}} = this;
		return <div className={css.totals}>
			<HTMLTable small bordered striped>
				<tbody>
				<tr>
					<td style={{fontWeight:'bold'}}>Total (in period)</td>
					{/*<td><Tooltip content={dataElements.toFixed(precision)}>{_.round(dataElements, precision)}</Tooltip></td>*/}
					<td />
				</tr>
				<tr>
					<td>Simulation</td>
					<td><Tooltip content={simulationCharge.toFixed(precision)}>{_.round(simulationCharge, precision)}</Tooltip></td>
				</tr>
				<tr>
					<td>Data Serving</td>
					<td><Tooltip content={dataServingChargeSimulation.toFixed(precision)}>{_.round(dataServingChargeSimulation, precision)}</Tooltip></td>
				</tr>
				<tr>
					<td>Query</td>
					<td>NYI</td>
				</tr>
				<tr>
					<td>Storage (in period)</td>
					<td><Tooltip content={dataStorageCharge.toFixed(precision)}>{_.round(dataStorageCharge, precision)}</Tooltip></td>
				</tr>
				<tr>
					<td>Volume Discount</td>
					<td>???</td>
				</tr>
				<tr>
					<td>Storage (ongoing / day)</td>
					<td><Tooltip content={ongoingDataStorageChargePerDay.toFixed(precision)}>{_.round(ongoingDataStorageChargePerDay, precision)}</Tooltip></td>
				</tr>
				</tbody>
			</HTMLTable>


		</div>
	}
}

interface BillingRow extends cg.BillingBaseRowGraph {
	isSimulationTotalRow?: boolean;
	simulationID?: string;
	name?: string;
	gridName?: string;
}

@observer
class SimulationBillingDetailsTable extends React.Component<{ summary: cg.BillingSummaryGraph, precision?: number, chargePrecision?: number, ratePrecision?:number, pageContext:BillingReportContext, printMode?:boolean }, {}> {
	static defaultProps = {
		precision: 7,
		chargePrecision: 2,
		ratePrecision: 4,
	}

	_toDispose = [];

	constructor(props, state) {
        super(props, state);
        makeObservable(this);
        this.calculateBillingRows();

		this._toDispose.push(
			autorun(() => {
				const {detailMode} = this.props.pageContext;
				// runInAction: Detail mode update
				runInAction(() => {
					if (detailMode != DetailMode.unset)
						Array.from(this.expandedRows.keys()).forEach((k) => this.expandedRows.set(k, detailMode == DetailMode.expanded))

					this.props.pageContext.detailMode = DetailMode.unset
				});
			})
		);
    }

	componentDidMount(): void {
		this.props.printMode && window.print();
	}

	componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

	expandedRows = observable.map<string, boolean>();
	billingRows:BillingRow[] = observable([]);

	hasExpandedEntry() {
		return _.some(Array.from(this.expandedRows.values()), a => a);
	}

	calculateBillingRows = () =>
	{
		const {summary, pageContext} = this.props;
		const shouldSetExpansion = this.expandedRows.size == 0;
		let {billingRows} = this;
		billingRows.length = 0;

		let expandedSimulations = summary.billingJobRows.map((b) => {
			const total = Object.assign({}, b.total, { name: b.additionalInformation.name, gridName: b.additionalInformation.gridName, isSimulationTotalRow: true, simulationID: b.additionalInformation._id, user: b.total.user.fullName});
			return Object.assign({}, b, {total: total})
		})

		// Sort the simulation based on the specified sort order and field
		let sortedSimulations = expandedSimulations.sort((a, b) => {
			const field = this.sortOrder.column;
			const mult = this.sortOrder.ascending ? 1 : -1;

			if (a.total[field] > b.total[field])
				return mult;

			if (a.total[field] < b.total[field])
				return mult * -1;

			return 0;
		})

		// Generate billing rows
		billingRows.push(summary.total as any);

		sortedSimulations.forEach((billingRow) => {
			billingRows.push(billingRow.total);
			const simulationID = billingRow.total.simulationID;

			if (shouldSetExpansion)
				this.expandedRows.set(simulationID, pageContext.detailMode == DetailMode.expanded || this.props.printMode);

			billingRow.details.forEach(d => billingRows.push(Object.assign({}, d, {name: billingRow.total.name, gridName: billingRow.total.gridName, simulationID: simulationID, user: d.user.fullName})))
		})

		return billingRows;
	}

	sortOrder:{column?:string, ascending?:boolean} = observable({column: "", ascending: false});

	sort = (column) => {
		let {sortOrder} = this;

		if (sortOrder.column != column) {
			sortOrder.column = column;
			sortOrder.ascending = true;
		}
		else {
			sortOrder.ascending = !sortOrder.ascending;
		}

		this.calculateBillingRows()
	}

	toLocaleDateString = (content, defaultString = "") => {
		// Remove milliseconds portion if preset e.g. 2018-11-08T15:34:55.188Z => 2018-11-08T15:34:55
		content = content ? _.split(content.toLocaleString(), ".")[0] : defaultString;
		if (this.props.printMode) {
			const t = content.indexOf('T');
			content = <>{content.substr(0,t)}<br/>{content.substr(t+1)}</>
		}
		return content;
	}


	round = (content, isRate=false) => {
		const precision = isRate ? this.props.ratePrecision : this.props.chargePrecision;
		return content != null ?_.round(content, precision).toLocaleString('en-US', { minimumFractionDigits:precision, maximumFractionDigits: precision }) : "";
	}

	fixed = (content) => {
		return content ? content.toFixed(this.props.precision) : "";
	}

	pad = (number) => {
		return number < 10 ? '0' + number : number;
	}

	formatDuration = (duration, defaultString = "") => {
		if(duration == null) return defaultString;
		const m = moment.duration(Math.round(duration * 60), 'minutes');
		return Math.floor(m.asDays()).toFixed(0) + ":" + this.pad(m.hours()) + ":" + this.pad(m.minutes());
	}

	formatFootnotesChargeType = (flags) => {
		const activeResource = flags.includes("*");
		return <span>
			{activeResource && <Tooltip content={"The specified resource was still active at time of reporting."}>
				<sup>*</sup>
			</Tooltip>}
		</span>
	}

	checkTruncatedStartTime = (flags) => {
		return flags.includes("†");
	}

	checkTruncatedEndTime = (flags) => {
		return flags.includes("‡");
	}


	NumberCell = (props) => {
		const {value, child, isRate} = props;
		return <td className={bp.Classes.ALIGN_RIGHT}>{child}{value != null && !isNaN(value) ? <Tooltip content={this.fixed(value)}>{this.round(value, isRate)}</Tooltip> : value}</td>
	}

	SortableHeader = (props) => {
		const {sortOrder, sort} = this;
		const {field, children} = props;

		return <th onClick={() => sort(field)}>{children} {sortOrder.column == field && <i className={classNames('dropdown icon', {[css.sortAscending]:sortOrder.ascending})}> </i> }</th>
	}

	onScroll = () => {
		let root = $(`.${css.simulationDetails}`).get(0);
		$(`.${css.action}`).css("margin-top", -(root.scrollTop + 10));
	}

	componentDidUpdate() {
		this.onScroll();
	}

	getStartDate() {
		let startDate = new Date(this.props.pageContext.startDate)
		startDate.setUTCHours(0, 0, 0, 0)
		return this.toLocaleDateString(startDate.toISOString());
	}

	getEndDate() {
		let endDate = new Date(this.props.pageContext.endDate)
		endDate.setUTCHours(23, 59, 59, 999);
		return this.toLocaleDateString(endDate.toISOString());
	}

	@observable headerHeight = 0;
	onHeaderResize = (e) => {
		this.headerHeight = $(`.${css.simulationDetails}`).find('thead').height() + 8 ;
	}

	render() {
		const {billingRows, toLocaleDateString, NumberCell, SortableHeader, expandedRows} = this;

		return <div className={css.simulationDetails} onScroll={this.onScroll}>
			{!this.props.printMode && <div className={css.expandedCover} style={{height:this.headerHeight}} />}
			<HTMLTable small bordered>
				<thead>
				<tr>
					<SortableHeader field={"totalCharge"}>{!this.props.printMode && <ResizeSensorComponent onResize={this.onHeaderResize} />}<FormattedMessage {...i18nMessages.totalCharge} /></SortableHeader>
					<SortableHeader field={"computationCharge"}><FormattedMessage {...i18nMessages.computeCharge} /></SortableHeader>
					<SortableHeader field={"dataServingCharge"}><FormattedMessage {...i18nMessages.dataServingCharge} /></SortableHeader>
					<SortableHeader field={"dataStorageCharge"}><FormattedMessage {...i18nMessages.dataStorageCharge} /></SortableHeader>
					<SortableHeader field={"ongoingDataStorageChargePerDay"}><FormattedMessage {...i18nMessages.storageChargePerDay} /></SortableHeader>
					<SortableHeader field={"dataElements"}><FormattedMessage {...i18nMessages.dataElements} /></SortableHeader>

					<SortableHeader field={"name"}><FormattedMessage {...i18nMessages.name} /></SortableHeader>
					<SortableHeader field={"gridName"}><FormattedMessage {...i18nMessages.grid} /></SortableHeader>

					<SortableHeader field={"chargeType"}><FormattedMessage {...i18nMessages.chargeType} /></SortableHeader>
					<SortableHeader field={"user"}><FormattedMessage {...i18nMessages.user} /></SortableHeader>
					<SortableHeader field={"startDateTime"}><FormattedMessage {...i18nMessages.startUTC} /></SortableHeader>
					<SortableHeader field={"finishDateTime"}><FormattedMessage {...i18nMessages.finishUTC} /></SortableHeader>
					<SortableHeader field={"duration"}><FormattedMessage {...i18nMessages.duration} /></SortableHeader>
					<SortableHeader field={"maximumVCPUs"}><FormattedMessage {...i18nMessages.maxCpuNum} /></SortableHeader>
					<SortableHeader field={"totalCPUTime"}><FormattedMessage {...i18nMessages.totalCpuTime} /></SortableHeader>
					<SortableHeader field={"instanceType"}><FormattedMessage {...i18nMessages.instanceType} /></SortableHeader>
					<SortableHeader field={"dataServingChargePerHour"}><FormattedMessage {...i18nMessages.dataServingChargePerHour} /></SortableHeader>
					<SortableHeader field={"dataStorageChargePerDay"}><FormattedMessage {...i18nMessages.dataStorageChargePerDay} /></SortableHeader>
				</tr>
				</thead>
				<tbody>
				{billingRows.filter((r) => r.chargeType == "Total" || r.isSimulationTotalRow || expandedRows.get(r.simulationID)).map((d, i) => {
					const isTotalRow = d.chargeType == "Total";

					return <tr key={i} className={classNames({[css.simulationTotal]: d.isSimulationTotalRow, [css.total]: isTotalRow})}>
						<NumberCell value={d.totalCharge} child={d.isSimulationTotalRow && <span className={classNames({[css.action]: true, [css.expanded]: expandedRows.get(d.simulationID)}) } onClick={() => expandedRows.set(d.simulationID, !expandedRows.get(d.simulationID))} ><i className={'dropdown icon'}> </i></span>}/>
						<NumberCell value={d.computationCharge}/>
						<NumberCell value={d.hasDataServingCharge ? (d.dataElements > 0 ? d.dataServingCharge : "TBD") : null}/>
						<NumberCell value={d.hasDataStorageCharge ? (d.dataElements > 0 ? d.dataStorageCharge : "TBD") : null}/>
						<NumberCell value={d.hasDataStorageCharge ? (d.dataElements > 0 ? d.ongoingDataStorageChargePerDay : "TBD") : null}/>
						<NumberCell value={d.hasDataStorageCharge || d.hasDataServingCharge ? (d.dataElements > 0 ? d.dataElements : "TBD") : null}/>

						{isTotalRow ? <td colSpan={12}><FormattedMessage {...i18nMessages.totalInPeriod} /></td> :
						<>
							<td>{d.name}</td>
							<td>{d.gridName}</td>

							<td>{d.chargeType}{this.formatFootnotesChargeType(d.flags)}</td>
							<td>{d.user}</td>
							<td>{this.checkTruncatedStartTime(d.flags) ? !this.props.printMode ? <span style={{color:"lightgray"}}>Start of reporting period</span> : this.getStartDate() : toLocaleDateString(d.startDateTime)}</td>
							<td>{this.checkTruncatedEndTime(d.flags) ?   !this.props.printMode ? <span style={{color:"lightgray"}}>End of reporting period</span>   : this.getEndDate()   : toLocaleDateString(d.finishDateTime)}</td>
							<td className={bp.Classes.ALIGN_RIGHT}> {<Tooltip content={this.fixed(d.duration)}>{this.formatDuration(d.duration, "Still Running")}</Tooltip>} </td>
							<td className={bp.Classes.ALIGN_RIGHT}>{d.maximumVCPUs}</td>
							<td className={bp.Classes.ALIGN_RIGHT}>{d.totalCPUTime}</td>
							<td>{d.instanceType}</td>
							<NumberCell isRate={true} value={d.hasDataServingCharge ? (d.dataElements > 0 ? d.dataServingChargePerHour : "TBD") : null}/>
							<NumberCell isRate={true} value={d.hasDataStorageCharge ? (d.dataElements > 0 ? d.dataStorageChargePerDay : "TBD") : null}/>
						</>}
					</tr>;
				})}
				</tbody>
			</HTMLTable>
		</div>
	}
}