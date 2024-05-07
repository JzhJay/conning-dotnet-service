import {HighchartsComponent, LoadingIndicator, inputSpecification, Option, InputSpecificationComponent} from 'components';
import type {RecalibrationComponentProps} from 'components/system/rsSimulation/rwRecalibration/ModelSettings';
import {getHighchartsRecalibrationObject} from 'components/system/highcharts/dataTemplates/recalibrationTemplate';
import {computed, observable, reaction, toJS, makeObservable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {HighchartsHelper, i18n, IChartingResult} from 'stores';
import type {IModelDataset, ITableRow} from 'stores/rsSimulation/rwRecalibration/models';
import type {IModelDefinition} from 'stores/rsSimulation/rwRecalibration/models';
import {RWRecalibration} from 'stores/rsSimulation/rwRecalibration/RWRecalibration';
import {formatLabelText, convertMonthToYM } from 'utility';
import * as css from "./ModelChart.css";
import * as settingCss from "./TableSetting.css";
import { IModelChartingResult } from '../internal/RecalibrationChartingModels';

export class ModelChartingResult implements IModelChartingResult {

	static CALCULATOR_COLUMNS = ['targetValue', 'simulatedValue', 'valueBasedOnCurrentParameters', 'valueBasedOnPreviousParameters'];

	static NONE_SERIES_KEY = "_";
	static DEFAULT_CHART_X_AXIS = "tenor";

	static USER_INPUT_CHART_KEY = "chart";
	static USER_INPUT_X_AXIS_KEY = "x";
	static USER_INPUT_SERIES_KEY = "series";

	static get TITLES(){
		return {
			[ModelChartingResult.USER_INPUT_CHART_KEY]: i18n.intl.formatMessage({defaultMessage: "Chart", description: "[ModelChart] chart advance setting root path name"}),
			[ModelChartingResult.USER_INPUT_X_AXIS_KEY]: i18n.intl.formatMessage({defaultMessage: "X", description: "[ModelChart] chart advance setting path name for the x axis"}),
			[ModelChartingResult.USER_INPUT_SERIES_KEY]: i18n.intl.formatMessage({defaultMessage: "Series", description: "[ModelChart] chart advance setting path name for the y axis"}),
		}
	}

	id = uuid.v4();
	chartType = "rsSimulationRecalibration";
	highcharts = new HighchartsHelper(this);

	xAxisUserInputPath = `${ModelChartingResult.USER_INPUT_CHART_KEY}.${ModelChartingResult.USER_INPUT_X_AXIS_KEY}`;
	seriesUserInputPath = `${ModelChartingResult.USER_INPUT_CHART_KEY}.${ModelChartingResult.USER_INPUT_SERIES_KEY}`;

	recalibration: RWRecalibration;
	@observable dataset: IModelDataset;

	constructor(props: RecalibrationComponentProps) {
        makeObservable(this);
        this.recalibration = props.recalibration;
        this.dataset = props.dataset;
    }

	@computed get applicableDefinitions(): IModelDefinition[] {
		const {recalibration, dataset: {name}} = this;
		return _.filter<IModelDefinition>(
			recalibration.getTableInterface(name)?.options,
			option => {
				return option.applicable !== false && !_.some(ModelChartingResult.CALCULATOR_COLUMNS, colName => colName == option.name);
			}
		);
	}

	@computed get applicableGroupingDefinitions(): IModelDefinition[] {
		return _.filter<IModelDefinition>(
			this.applicableDefinitions,
			def => {
				if (def.name == this.chartXAxisKey) {
					return false;
				}
				const data = _.map(this.tableData, d => d[def.name]);
				return _.uniq(data).length > 1;
			}
		);
	}

	@computed get xAxisDefinition() :IModelDefinition {
		const {applicableDefinitions, xAxisUserInputPath: path, dataset:{settings}} = this;
		if (!applicableDefinitions?.length) {
			return null;
		}
		const key = _.get(settings, path, ModelChartingResult.DEFAULT_CHART_X_AXIS);
		const definition = _.find(applicableDefinitions, def => def.name == key);
		if (definition) {
			return definition;
		}
		return _.first(applicableDefinitions);
	}

	@computed get chartXAxisKey(): string {
		return this.xAxisDefinition?.name;
	}

	set chartXAxisKey(key: string) {
		_.set(this.dataset.settings, this.xAxisUserInputPath, key);
	}

	@computed get seriesGroupDefinitions(): IModelDefinition[] {
		if (!this.applicableGroupingDefinitions) {
			return null;
		}
		const rtn: IModelDefinition[] = [];
		_.forEach(this.applicableGroupingDefinitions, def => {
			if (def.name != this.chartXAxisKey && this.chartSeriesStatus[def.name]) {
				rtn.push(def);
			}
		});
		return rtn;
	}

	@computed get chartSeriesStatus(): {[key: string]: boolean} {
		const {canGroup, applicableGroupingDefinitions} = this;
		if (!canGroup) {
			return null;
		}
		const rtn = {};
		let noneOptionStatus = true;
		let chartSeriesStatus = _.get(this.dataset.settings, this.seriesUserInputPath);
		chartSeriesStatus = chartSeriesStatus && _.isObject(chartSeriesStatus) ? chartSeriesStatus : {};
		_.forEach(applicableGroupingDefinitions, (def) => {
			const status = _.get(chartSeriesStatus, def.name, true) !== false;
			rtn [def.name] = status;
			noneOptionStatus = noneOptionStatus && !status;
		});
		rtn[ModelChartingResult.NONE_SERIES_KEY] = noneOptionStatus;
		return rtn;
	}

	set chartSeriesStatus(updates) {
		let chartSeriesStatus = _.get(this.dataset.settings, this.seriesUserInputPath);
		chartSeriesStatus = chartSeriesStatus && _.isObject(chartSeriesStatus) ? chartSeriesStatus : {};

		if (_.has(updates, ModelChartingResult.NONE_SERIES_KEY)) {
			const updateStatus = !updates[ModelChartingResult.NONE_SERIES_KEY];
			updates = {};
			_.forEach(this.applicableGroupingDefinitions, def => {
				updates[def.name] = updateStatus;
			});
		}

		runInAction(() => {
			_.set(this.dataset.settings, this.seriesUserInputPath, _.assign(chartSeriesStatus, updates));
		})
	}

	getValueDisplay(dataObj: any, axisDefinition): string{
		let data = dataObj[axisDefinition.name];
		const selectedSubOption = _.find( axisDefinition.options, option => _.isEqual(option.name, data));
		if (axisDefinition.name === 'tenor' || axisDefinition.name === 'horizon') {
			data = convertMonthToYM(data);
		}
		return selectedSubOption ? selectedSubOption.title : data;
	}

	getSeriesTitle(dataObj: ITableRow): string {
		const seriesGroupDefinitions = this.seriesGroupDefinitions;
		if(!seriesGroupDefinitions) {
			return "dummyGroup";
		}
		const titles = [];
		_.forEach(seriesGroupDefinitions, def => {
			const data = _.map(this.tableData, d => d[def.name]);
			if (_.uniq(data).length > 1) {
				titles.push(`${def.title}: ${this.getValueDisplay(dataObj, def)}`)
			}
		})
		return titles.join(', ');
	}

	@computed get tableData() {
		return this.dataset.table;
	}

	@computed get categories(): string[] {
		const {xAxisDefinition, tableData} = this;
		if (!xAxisDefinition) {
			return [];
		}
		const group = _.groupBy(tableData, data => data[xAxisDefinition.name]);
		return _.map(_.values(group), groupData => this.getValueDisplay(groupData[0], xAxisDefinition));
	}

	@computed get canGroup() {
		return this.applicableDefinitions.length > 1;
	}

	@computed get hasGroupedSeries() {
		return this.canGroup && _.get(this.chartSeriesStatus, ModelChartingResult.NONE_SERIES_KEY, false) != true;
	}

	@computed get data() {
		const {xAxisDefinition, seriesGroupDefinitions, categories, tableData} = this;
		const yGroup =
			seriesGroupDefinitions ?
			_.groupBy(toJS(tableData), data => _.map(seriesGroupDefinitions, def => data[def.name]).join(",")) :
			{[ModelChartingResult.NONE_SERIES_KEY] : toJS(tableData)};

		return _.map(Object.values(yGroup), yGroupData => {
			const rtnObj: any =  {
				title: this.getSeriesTitle(yGroupData[0])
			};
			_.forEach( ModelChartingResult.CALCULATOR_COLUMNS, colName => rtnObj[colName] = [] );

			if (xAxisDefinition) {
				const xGroup = _.groupBy(yGroupData, data => data[xAxisDefinition.name]);
				_.forEach(Object.values(xGroup), xGroupData => {
					const category = this.getValueDisplay(xGroupData[0], xAxisDefinition);
					const categoryIdx = categories.indexOf(category);
					_.forEach(ModelChartingResult.CALCULATOR_COLUMNS, colName => {
						rtnObj[colName].push([categoryIdx, _.sum(_.map(xGroupData, d => d[colName]))]);
					});
				});
			}
			return rtnObj;
		});
	}
}

@observer
export class ModelChart extends React.Component<RecalibrationComponentProps, {}> {
    @observable modelChartingResult = new ModelChartingResult(this.props);
    chartUserOptions = toJS(this.props.recalibration.getChartUserOptions(this.props.dataset.name));
    chartRef = null;
    _dispose = [];

    constructor(props: RecalibrationComponentProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {

		this._dispose.push(reaction(() => {
			const result = this.modelChartingResult;
			const rtn ={
				x: result.chartXAxisKey,
				categories: result.categories
			};
			_.map(result.seriesGroupDefinitions, def => {
				rtn[def.name] = _.uniq(_.map(result.tableData, data => data[def.name]));
			});
			return JSON.stringify(rtn);
		} , (data) => {
			setTimeout(()=>{
				const newResult = new ModelChartingResult(this.props);

				const xAxisTitle = _.get(newResult, "xAxisDefinition.title");
				const xDisplayUnitTitle = _.has(this.chartUserOptions, "xAxis.displayUnits.0.title") ?
				                          _.get(this.chartUserOptions, "xAxis.displayUnits.0.title") :
				                          null;

				// remove saved display unit information if Axis changed.
				if(xDisplayUnitTitle && (xAxisTitle != xDisplayUnitTitle)) {
					_.set(this.chartUserOptions, "xAxis.displayUnits", []);
				}

				runInAction(() => this.modelChartingResult = newResult);
			}, 0)
		}));

		this._dispose.push(reaction(() => {
			const result = this.modelChartingResult;
			const rtn = {};
			_.map(ModelChartingResult.CALCULATOR_COLUMNS, key => {
				rtn[key] = _.sum(_.map(this.modelChartingResult.tableData, row => row[key]));
			})
			return JSON.stringify(rtn);
		}, (data) => {
			setTimeout(()=>{
				const newResult = getHighchartsRecalibrationObject(this.modelChartingResult, this.chartUserOptions);
				this.chartRef.chart.update({series: newResult.series});
				this.chartRef.chart.yAxis[0].setExtremes();
			}, 0)
		}));
	}
    componentWillUnmount() { this._dispose.forEach(  d => d() )}

    componentDidUpdate(prevProps: Readonly<RecalibrationComponentProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (this.props.dataset != prevProps.dataset) {
			runInAction(() => this.modelChartingResult.dataset = this.props.dataset);
		}
	}

    updateUserOptions = (updateObj) => {
		Object.assign(this.chartUserOptions, updateObj);
		this.props.recalibration.updateChartUserOptions(this.props.dataset.name, updateObj);
	}

    render() {
		const {modelChartingResult, props:{recalibration, dataset: {name}}} = this;
		const tableDefinitionOption = recalibration.getTableInterface(name);
		const title = tableDefinitionOption?.title || '';
		return <div className={""}>
			{ recalibration.isLoaded ?
			<div className={css.root}>
				<HighchartsComponent
					ref={r=>this.chartRef = r}
					id={this.modelChartingResult.id}
					key={this.modelChartingResult.id}
					guid={title}
					inlineToolbar={true}
					disableSelections={false}
					className={""}
					chartType={modelChartingResult.chartType}
					userOptions={this.chartUserOptions}
					onUserOptionsUpdated={this.updateUserOptions}
					allowScrollwheelZoom={false}
					chartingResult={modelChartingResult}/>
			</div> :
			<LoadingIndicator active={true}>Loading {title} Chart...</LoadingIndicator>}
		</div>;
	}
}

@observer
export class ModelChartAdvanceOptions extends React.Component<RecalibrationComponentProps, {}> {
    modelChartingResult = new ModelChartingResult(this.props);

    @observable userOptions = this.props.dataset.settings.chartUserOptions;

    constructor(props: RecalibrationComponentProps) {
        super(props);
        makeObservable(this);
    }

    @computed get userInputs () {
		const result = this.modelChartingResult;
		return {
			[ModelChartingResult.USER_INPUT_CHART_KEY] : {
				[ModelChartingResult.USER_INPUT_X_AXIS_KEY] : result.chartXAxisKey,
				[ModelChartingResult.USER_INPUT_SERIES_KEY] : result.chartSeriesStatus
			}
		};
	}

    @computed get specification() {
		const name = this.props.dataset.name;
		return  inputSpecification(name, {options: {[name]: {
			"name": ModelChartingResult.USER_INPUT_CHART_KEY,
			"title": ModelChartingResult.TITLES[ModelChartingResult.USER_INPUT_CHART_KEY],
			"description": "",
			"applicable": true,
			"options": [
				{
					"name": ModelChartingResult.USER_INPUT_X_AXIS_KEY,
					"title": ModelChartingResult.TITLES[ModelChartingResult.USER_INPUT_X_AXIS_KEY],

					"description": "",
					"applicable": true,
					"inputType": "exclusive",
					"options": _.map(this.modelChartingResult.applicableDefinitions, c => ({
						"name": c.name,
						"title": c.title,
						"description": "",
						"applicable": true,
						"inputType": "string"
					}))
				},
				{
					"name": ModelChartingResult.USER_INPUT_SERIES_KEY,
					"title": ModelChartingResult.TITLES[ModelChartingResult.USER_INPUT_SERIES_KEY],
					"description": "",
					"applicable": this.modelChartingResult.canGroup,
					"options": [
						{
							"name": ModelChartingResult.NONE_SERIES_KEY,
							"title": "None",
							"description": "",
							"applicable": true,
							"indent": false,
							"inputType": "boolean"
						},
						..._.map(this.modelChartingResult.applicableGroupingDefinitions,  c => ({
							"name": c.name,
							"title": c.title,
							"description": "",
							"applicable": c.name != this.modelChartingResult.chartXAxisKey,
							"disableApplicable": !this.modelChartingResult.hasGroupedSeries,
							"indent": false,
							"inputType": "boolean"
						}))
					]
				}
			]
		}}}, false, this.preProcess);
	}

    preProcess = (inputNode:Option) => {
		if (!inputNode.title) {
			inputNode.title = formatLabelText(inputNode.name);
		}
		switch (inputNode.name) {
			case ModelChartingResult.USER_INPUT_X_AXIS_KEY:
			case ModelChartingResult.USER_INPUT_SERIES_KEY:
				inputNode.indent = true;
				break;
		}
	}

    applyUpdates = (updates) => {
	    updates = _.get(updates, ModelChartingResult.USER_INPUT_CHART_KEY);
		_.forEach(_.keys(updates), key => {
			switch (key) {
				case ModelChartingResult.USER_INPUT_X_AXIS_KEY:
					this.modelChartingResult.chartXAxisKey = updates[key];
					break;
				case ModelChartingResult.USER_INPUT_SERIES_KEY:
					this.modelChartingResult.chartSeriesStatus = updates[key];
					break;
			}
		})
	}

    updateUserOptions = (updates) => {
		// console.log(updates);
	}

    render() {
		// console.log(this.specification);
		return <div className={classNames(settingCss.root, css.settings)}>
			<InputSpecificationComponent
				className={settingCss.input}
				allowScrolling={false}
				showToolbar={false}
				showViewTitle={true}
				userOptions={{verboseMode: false}}

				inputs={this.userInputs}
				specification={this.specification}
				applyUpdate={this.applyUpdates}
				updateUserOptions={this.updateUserOptions}
				validations={{}}
			/>
		</div>;
	}
}