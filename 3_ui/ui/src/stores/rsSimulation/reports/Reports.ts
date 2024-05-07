import {Option} from 'components';
import {findOption} from 'components/system/IO/internal/inputs/utility';
import {ProgressMessage} from 'components/system/Progress/model';
import {action, computed, makeObservable, observable, runInAction, toJS} from 'mobx';
import {ChartUserOptions, GridlinesType, i18n, RSSimulation, site, xhr} from 'stores';
import {ChangeMessage, UserInterfaceResponse} from 'stores/rsSimulation/models';
import {buildURL} from 'utility';

export enum RS_REPORT_STATUS{
	READY,
	RUNNING,
	FINISHING,
	COMPLETED,
	LOADING_OUTPUT_VIEWS,
	CANCELING = -1,
	CANCELED = -2,
	FAILED = -99,
}

interface ReportProgressMessage extends ProgressMessage{
	reportPath: string[];
}

interface UserInterface {
	inputOptions: {
		[key: string]: Option
	};
	userInputs: {
		[key: string]: any
	};
	axes: {
		[key: string]: {
			orderIndicies: number[],
			paths: string[][],
			values: { [key: number]: string }
		}
	};
	validationMessages: any[];
	completedReportPaths: string[][];
}

export interface ReportOutputView {
	label: string,
	name: string,
	viewType: string,
	dataset?: string[]
}

export class Reports {

	static FIRST_PATH_NAME = "reports";
	static INPUT_PATH_NAME = "inputs";
	static OUTPUT_PATH_NAME = "output";
	static OUTPUT_FOLDER_TITLE = "Report Outputs";
	static get RN_OBJECT_NAME_SINGLE() { return i18n.intl.formatMessage({defaultMessage: "Report", description: "sub-object name - Reports (single)"}) };
	static get RN_OBJECT_NAME_MULTI() { return i18n.intl.formatMessage({defaultMessage: "Reports", description: "sub-object name - Reports (multi)"}) };

	@observable isLoaded: boolean = false;
	@observable isUserInterfaceLoading: boolean = false;
	@observable userInterface: UserInterface = null;
	@observable webLocalChartUserOptions: { [viewName: string]: ChartUserOptions } = {};

	@observable reportOutputsDataCollection: {[reportPathString: string]: { status: RS_REPORT_STATUS, views?: ReportOutputView[], progress?: ReportProgressMessage} } = {};

	constructor(public rsSimulation: RSSimulation) {
		makeObservable(this);
	}

	get apiUrl() {
		return `${RSSimulation.apiUrlFor(this.rsSimulation.id)}/reports`;
	}

	@computed get activeReportPath() {
		const treeNodePath = this.rsSimulation.stepNavigationController.activeItem.itemPath;
		return this.getReportRootPath(treeNodePath);
	}

	@computed get runButtonProps() {
		const {activeReportPath} = this;
		console.log(this.reportOutputsDataCollection)
		console.log(this.hasReportRunning)
		return {

		}
	}

	isReportRunning(status: RS_REPORT_STATUS) {
		return _.includes([RS_REPORT_STATUS.RUNNING, RS_REPORT_STATUS.FINISHING, RS_REPORT_STATUS.CANCELING], status);
	}

	isReportCompleted(status: RS_REPORT_STATUS) {
		return status == RS_REPORT_STATUS.COMPLETED;
	}

	@computed get hasReportRunning() {
		return _.some(_.values(this.reportOutputsDataCollection), output => this.isReportRunning(output.status));
	}

	@computed get RunningProgressMessage() :ReportProgressMessage {
		return _.find(_.values(this.reportOutputsDataCollection), output => this.isReportRunning(output.status))?.progress;
	}

	getUserInterface = async (forceUpdate: boolean = false) => {
		if (!this.userInterface || forceUpdate) {
			runInAction(() => { this.isUserInterfaceLoading = true; })
			await xhr.get<UserInterface>(`${this.apiUrl}/user-interface`).then(action((resp) => {
				this.userInterface = resp;
				this.isLoaded = true;

				_.forEach(this.userInterface?.completedReportPaths, path => this.getOutputViews(path));

			})).finally(action(() => {
				this.isUserInterfaceLoading = false;
			}));
		}
		return this.userInterface;
	}

	updateUserInputs = async (userInputs) => {
		site.busy = true;

		const assignValue = action ((targetMap, valueMap) => {
			_.forEach(valueMap, (v, k) => {
				if (!_.isObject(v)) {
					targetMap[k] = v;
				} else {
					if (targetMap[k] == null) {
						targetMap[k] = {};
					}
					assignValue(targetMap[k], v);
				}
			})
		})
		assignValue(this.userInterface.userInputs, userInputs);

		const treeNodePath = this.rsSimulation.stepNavigationController.activeItem.itemPath;
		return await xhr.post<UserInterfaceResponse>(`${this.apiUrl}/user-interface`,{
			userInput: JSON.stringify(userInputs),
			treeNodePath: treeNodePath,
			dynamic_structure_row_paths: [],
			timeStamp: new Date()
		}).then(action(state => {
			if (state.changeMessages) {
				state.changeMessages.forEach((m: ChangeMessage) => {
					_.set(this.userInterface.userInputs, m.targetPath, m.targetValue);
				});
			}

			if (state.userInputs) {
				runInAction(() => _.assign(_.get(this.userInterface.userInputs, treeNodePath.slice(0, -1)), state.userInputs));
			}

			if(state.validationMessages)
				this.userInterface.validationMessages = state.validationMessages;

			if (state.inputOptions) {
				const optionPath = treeNodePath.slice(1);
				const updateOption = findOption(this.userInterface.inputOptions[Reports.FIRST_PATH_NAME], optionPath);
				runInAction(() => _.assign(updateOption, state.inputOptions));
			}

			this.setReportStatus(treeNodePath, RS_REPORT_STATUS.READY);
		})).finally(action (() => {
			site.busy = false;
		}));
	}

	@action getChartUserOptions = (viewName: string): ChartUserOptions => {
		let cuo = _.get<ChartUserOptions>(this.webLocalChartUserOptions as any, viewName, null);
		if (!cuo) {
			cuo = {
				// ChartUserOptions
				panOrZoom:               'zoom',
				fontSize:                14,
				fontSizes:               [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96],
				isInverted:              false,
				percentiles:             [0, 1, 5, 25, 50],
				colorSet:                ["0,98,37", "138,32,3"],
				gridLine:                GridlinesType.Horizontal,
				showMeanValues:          true,
				verticalAxisDirection:   'top',
				horizontalAxisDirection: 'left',
				plotWidth:               0,
				plotHeight:              0,
				highchartsOptions:       null
			};
			_.set(this.webLocalChartUserOptions, viewName, cuo);
		}

		return cuo;
	}

	updateChartUserOptions = (viewName: string, updateObj: any) => {
		let cuo = this.getChartUserOptions(viewName);
		_.assign(cuo, updateObj);
	}

	@action getOutputViews = async (reportPath: string[])=> {
		reportPath = this.getReportRootPath(reportPath);
		if (!reportPath) {
			return null;
		}
		const reportOption = this.findOption(reportPath);
		_.remove(reportOption.options, o => o.name == Reports.OUTPUT_PATH_NAME);

		const outputOption: Option = {
			"name": Reports.OUTPUT_PATH_NAME,
			"title": Reports.OUTPUT_FOLDER_TITLE,
			"hints": { "tab": "horizontal" },
			"applicable": true,
			"description": ""
		};
		reportOption.options.push(outputOption as any);
		this.setReportStatus(reportPath, RS_REPORT_STATUS.LOADING_OUTPUT_VIEWS);
		await xhr.get<{views: ReportOutputView[]}>(`${this.apiUrl}/output/${reportPath.join('.')}/views`).then((resp) => {
			this.handleOutputViewsResponse(resp, reportPath)
		}).finally(action(() => {
			this.setReportStatus(reportPath, RS_REPORT_STATUS.COMPLETED);
		}));
	}

	@action handleOutputViewsResponse = (resp: {views: ReportOutputView[]}, reportPath: string[]) => {
		reportPath = this.getReportRootPath(reportPath);
		this.getReportOutputsData(reportPath).views = resp.views;
		this.findOption([...reportPath, Reports.OUTPUT_PATH_NAME]).options = _.map<ReportOutputView, Option>(resp.views, view => {
			return {
				"name": view.name,
				"title": view.label,
				"dataType": 'outputView',
				"description": '',
				"applicable": true,
			}
		});
	}

	@action getOutputView = async(reportPath: string[], viewName:string, dataset_index?: number) => {
		let baseUrl = `${this.apiUrl}/output/${reportPath.join('.')}/views/${viewName}`;
		if (dataset_index != null) {
			baseUrl = buildURL(baseUrl, {dataset_index});
		}
		return await xhr.get(baseUrl);
	}

	@action run = async (reportPath: string[]) => {
		reportPath = this.getReportRootPath(reportPath);
		if (!reportPath) {
			return null;
		}

		this.setReportStatus(reportPath, RS_REPORT_STATUS.RUNNING, {
			type: "launch_simulation",
			label: i18n.common.MESSAGE.STARTING,
			currentMessage: "",
			progress: { numerator: 0, denominator: 1 },
			reportPath: reportPath
		});

		return xhr.post(
			`${this.apiUrl}/run`,
			{reportPath: reportPath}
		);
	}

	@action handleProgressMessage = (progress: ReportProgressMessage) => {
		const isComplete = progress.progress.denominator == progress.progress.numerator;
		const reportPath = progress.reportPath;
		this.setReportStatus(
			reportPath,
			isComplete ? RS_REPORT_STATUS.RUNNING : RS_REPORT_STATUS.FINISHING,
			progress
		);
		isComplete && this.handleRan(reportPath);
	}

	@action handleRan = (reportPath: string[]) => {
		this.getOutputViews(reportPath);
	}

	@action cancel = async (reportPath: string[]) => {

	}

	getReportOutputsData = (reportPath: string[]) => {
		const path = this.getReportRootPath(reportPath);
		return path ? this.reportOutputsDataCollection[path.join('.')] : { status: RS_REPORT_STATUS.READY };
	}

	@action setReportStatus = (reportPath: string[], status: RS_REPORT_STATUS, progress: ReportProgressMessage = null) => {
		reportPath = this.getReportRootPath(reportPath);
		const path = reportPath.join('.');
		if (!this.reportOutputsDataCollection[path]) {
			this.reportOutputsDataCollection[path] = {status}
		} else {
			if (this.reportOutputsDataCollection[path].status == RS_REPORT_STATUS.COMPLETED && status != RS_REPORT_STATUS.COMPLETED) {
				const reportOption = this.findOption(reportPath);
				_.remove(reportOption.options, o => o.name == Reports.OUTPUT_PATH_NAME);
			}
			this.reportOutputsDataCollection[path].status = status;
			this.reportOutputsDataCollection[path].progress = progress;
		}
	}

	getReportRootPath = (reportPath: string[]) => {
		if (reportPath[0] == Reports.FIRST_PATH_NAME) {
			reportPath = reportPath.slice(1);
		}
		const rtnPath = [Reports.FIRST_PATH_NAME];

		let testOption = _.get(this.userInterface?.inputOptions, Reports.FIRST_PATH_NAME);
		let isIncluded = Reports.optionIsReport(testOption);
		_.forEach(reportPath, p => {
			if (!isIncluded && testOption) {
				testOption = _.find(testOption.options, o => o.name == p);
				testOption && rtnPath.push(testOption.name);
				isIncluded = Reports.optionIsReport(testOption);
			}
		});
		return isIncluded ? rtnPath : null;
	}

	findOption = (path: string[]): Option => {
		const rootOption = _.get(this.userInterface?.inputOptions, Reports.FIRST_PATH_NAME, {});
		return findOption(rootOption, path.slice(1));
	}

	static optionIsReport = (option: Option) => {
		return _.get(option, "hints.uiCustomizationType") === "report";
	}
}
