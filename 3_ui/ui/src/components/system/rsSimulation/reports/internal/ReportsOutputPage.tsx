import type {Option} from 'components';
import {ErrorMessage, LoadingUntil} from 'components';
import {ReportsChartView} from './output/ReportsChartView';
import {ReportsTableView} from './output/ReportsTableView';
import {ReportsSummaryView} from './output/ReportsSummaryView';
import {ReportsPage} from 'components/system/rsSimulation/reports/ReportsPage';
import {action, computed, makeObservable, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import type {ReportOutputView} from 'stores';
import {i18n, Reports, RS_REPORT_STATUS} from 'stores';

import * as css from './ReportsOutputPage.css';

enum VIEW_TYPE{
	SUMMARY = "summary",
	TABLE = "table",
	CHART = "chart"
}

interface ReportsOutputPageProps {
	reports: Reports;
	activePath: string[];
}

@observer
export class ReportsOutputPage extends React.Component<ReportsOutputPageProps, any> {

	@observable private _dispose: Function[] = [];
	@observable _cachedViewData: {[viewName: string]: any} = {};

	constructor(props) {
		super(props);
		makeObservable(this);

		this._dispose.push(reaction(() => this.isReportStatusCompleted, action((isCompleted) => {
			this._cachedViewData = {};
		})));
	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	@computed get options(): Option[] {
		const {reports, activePath} = this.props;
		const interfaceOption = reports.findOption(activePath);
		if (interfaceOption.name != Reports.OUTPUT_PATH_NAME){
			return [interfaceOption];
		} else {
			return interfaceOption.options;
		}
	}

	@computed get isReportStatusCompleted(): boolean {
		return this.reportOutputs?.status === RS_REPORT_STATUS.COMPLETED;
	}

	@computed get reportOutputs() {
		const {reports, activePath} = this.props;
		return reports.getReportOutputsData(activePath);
	}

	render() {

		if (!this.isReportStatusCompleted) {
			return <div className={css.root}>
				<LoadingUntil message={i18n.intl.formatMessage({defaultMessage: `Loading Output Views...`, description: "[ReportsOutputPage] waiting for loading views data"})} />
			</div>
		}

		if (!this.options?.length) {
			return <ErrorMessage message={'Missing Output View Definitions.'} />
		}

		return <div className={css.root}>{
			_.map(this.options, o => <React.Fragment key={`ReportsOutputViews_${o.name}`}>
				<ReportsOutputView option={o} views={this} />
			</React.Fragment>)
		}</div>
	}

}

@observer
export class ReportsOutputView extends React.Component<{option: Option, views: ReportsOutputPage}, any> {

	@observable private _dispose: Function[] = [];
	@observable selectedIndex: number;

	constructor(props) {
		super(props);
		makeObservable(this);

		this.loadViewData();
		this._dispose.push(reaction(() => this.isViewLoaded, action((isViewLoaded) => {
			isViewLoaded && this.loadViewData();
		})));
	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	@computed get isViewLoaded() {
		return !!this.viewData;
	}

	@computed get reportOutputView(): ReportOutputView {
		const currentViewName = this.props.option.name;
		return _.find(this.props.views.reportOutputs?.views, v => v.name == currentViewName);
	}

	@computed get cacheKey() {
		return `${this.reportOutputView.name}_${this.selectedIndex || 0}`;
	}

	@computed get viewData() {
		return this.reportOutputView && this.props.views._cachedViewData[this.cacheKey];
	}

	@action loadViewData = (force: boolean = false) => {
		if (!force && this.isViewLoaded) {
			return;
		}
		const path = this.props.views.props.reports.activeReportPath;
		this.props.views.props.reports.getOutputView(path, this.reportOutputView.name, this.selectedIndex).then(action((resp) => {
			this.props.views._cachedViewData[this.cacheKey] = resp;
		}));
	}

	render() {

		if (!this.isViewLoaded) {
			return <LoadingUntil message={i18n.common.MESSAGE.WITH_VARIABLES.LOADING(this.reportOutputView.label)} />
		}

		const viewType = this.reportOutputView.viewType;

		if (viewType == VIEW_TYPE.SUMMARY) {
			return <ReportsSummaryView errorList={_.get(this.viewData, "failedTests") as string[]} />
		}

		if (viewType == VIEW_TYPE.CHART) {
			return <ReportsChartView view={this} />;
		}

		if (viewType == VIEW_TYPE.TABLE) {
			return <ReportsTableView view={this} />;
		}

		return `${this.reportOutputView.label} - ${viewType}`;
	}
}

