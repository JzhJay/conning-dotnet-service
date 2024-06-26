import {LoadingUntil} from 'components';
import {Progress} from 'components/system/Progress/Progress';
import {ReportsInputPage} from './internal/ReportsInputPage';
import {ReportsOutputPage} from './internal/ReportsOutputPage';
import {ReportsSummaryPage} from './internal/ReportsSummaryPage';
import {computed, makeObservable, observable, reaction, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RSSimulation, Reports, i18n} from 'stores';

import * as css from './ReportsPage.css';

@observer
export class ReportsPage extends React.Component<{rsSimulation: RSSimulation}, any> {

	_dispose: Function[] = [];
	@observable activePath: string[];

	runningMonitorTitle = i18n.intl.formatMessage({
		defaultMessage: 'Simulation Monitor',
		description: '[RSSimulation] Main title of Simulation Running Progress'
	});

	constructor(props) {
		super(props);
		makeObservable(this);

		const {rsSimulation} = this.props;

		if (!rsSimulation.reports) {
			runInAction(() => rsSimulation.reports = new Reports(rsSimulation));
		}

		if (!rsSimulation.reports.isLoaded) {
			rsSimulation.reports.getUserInterface();
		}

		this.activePath = rsSimulation.stepNavigationController?.activeItem.itemPath as string[];
		this._dispose.push(reaction(() => rsSimulation.stepNavigationController?.activeItem , activeItem => {
			if (activeItem) {
				runInAction(() => this.activePath = activeItem.itemPath as string[]);
			}
		}))
	}

	componentWillUnmount() {
		_.each(this._dispose, d => d());
	}

	@computed get reports(): Reports { return this.props.rsSimulation.reports; }

	@computed get pageDisabled() { return _.isEmpty(this.activePath) || _.first(this.activePath) != Reports.FIRST_PATH_NAME; }

	render() {

		if (this.pageDisabled || !this.reports.isLoaded) {
			return <LoadingUntil message={i18n.common.MESSAGE.WITH_VARIABLES.LOADING(Reports.RN_OBJECT_NAME_MULTI)}/>;
		}

		if (this.reports.hasReportRunning) {
			const pm = this.reports.RunningProgressMessage;
			return pm ?
			       <Progress title={this.runningMonitorTitle} progressMessages={[pm]}/> :
			       <LoadingUntil message={i18n.common.MESSAGE.WITH_VARIABLES.STARTING(Reports.RN_OBJECT_NAME_MULTI)}/>;
		}

		const specificationOption = this.reports.findOption(this.activePath);
		if (!_.includes([Reports.INPUT_PATH_NAME, Reports.OUTPUT_PATH_NAME], specificationOption.name) && _.get(specificationOption, "hints.tab")) {
			return <div className={css.root}>
				<ReportsSummaryPage
					reports={this.reports}
					activePath={this.activePath}
					onNavigate={this.props.rsSimulation.stepNavigationController.setActiveByPathString} />
			</div>
		}

		if (specificationOption.name == Reports.OUTPUT_PATH_NAME || specificationOption.dataType === 'outputView') {
			return <div className={css.root}>
				<ReportsOutputPage
					reports={this.reports}
					activePath={this.activePath} />
			</div>;
		}

		return <div className={css.root}>
			<ReportsInputPage
				reports={this.reports}
				activePath={this.activePath} />
		</div>;

	}
}

