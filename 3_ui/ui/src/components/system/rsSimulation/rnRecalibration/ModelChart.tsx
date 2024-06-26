import {HighchartsComponent, LoadingIndicator, inputSpecification, InputSpecificationComponent, Option} from 'components';
import {getHighchartsRecalibrationObject} from 'components/system/highcharts/dataTemplates/recalibrationTemplate';
import {computed, observable, reaction, toJS, makeObservable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {HighchartsHelper, i18n, RSSimulation} from 'stores';
import {formatLabelText, convertMonthToYM } from 'utility';
import * as css from "./ModelChart.css";
import { RNRecalibration } from 'ui/src/stores/rsSimulation/rnRecalibration/RNRecalibration';
import {findOption} from 'components/system/IO/internal/inputs/utility';
import { IModelChartingResult } from '../internal/RecalibrationChartingModels';

export interface RecalibrationChartProps {
	rnRecalibration: RNRecalibration;
	rsSimulation?: RSSimulation;
	path: string[];
}

interface ChartDefaultMapping {
	series?: string[];
	x: string;
	y: { computed: string; target: string }[];
	getYAxisTitle?: (optionByName: { [key: string]: Option}) => string;
	getYValue?: (column: string, data: any) => number;
}

export class ModelChartingResult implements IModelChartingResult {
	static NONE_SERIES_KEY = "_";

	static USER_INPUT_CHART_KEY = "chart";
	static USER_INPUT_X_AXIS_KEY = "x";
	static USER_INPUT_SERIES_KEY = "series";

	static CHART_DEFAULT_MAPPING: {[key: string]: ChartDefaultMapping} = {
		"riskFree.swapCurve.marketData.swapCouponCurve": {
			x: "maturity",
			y: [{target: "market", computed: "computedYield"}]
		},
		"riskFree.swaption.marketData.swaptionVolatilities": {
			x: "option",
			y: [{target: "volatility", computed: "computedVolatility"}]
		},
		"marketData.optionPrices": {
			x: "option",
			y: [{target: "callPrice", computed: "computedPrice"}, {target: "putPrice", computed: "computedPrice"}, {target: "callVolatility", computed: "computedVolatility"}, {target: "putVolatility", computed: "computedVolatility"}],
			getYValue: (column, data) => {
				return 	column == "callPrice" && data["callPrice"] <= data["putPrice"] ? data["callPrice"] :
						column == "putPrice" && data["putPrice"] <= data["callPrice"] ? data["putPrice"] :
						column == "callVolatility" && data["callVolatility"] <= data["putVolatility"] ? data["callVolatility"] :
						column == "putVolatility" && data["putVolatility"] <= data["callVolatility"] ? data["putVolatility"] :
						(column == "computedPrice" || column == "computedVolatility") ? data[column] :
						null;
			},
			getYAxisTitle: (optionsByName) => optionsByName["callPrice"].applicable ?
				i18n.intl.formatMessage({defaultMessage: "Price", description: "[ModelChart] chart label for the price of an investment"}) :
				i18n.intl.formatMessage({defaultMessage: "Volatility", description: "[ModelChart] chart label for the volatility of an investment"})
		},
		"corporateBonds.marketData.couponCurve": {
			x: "maturity",
			y: [{target: "a", computed: "computedA"}, {target: "aa", computed: "computedAa"}, {target: "aaa", computed: "computedAaa"}, {target: "bbb", computed: "computedBbb"}, {target: "highYield", computed: "computedHighYield"}],
			getYAxisTitle: () => i18n.intl.formatMessage({defaultMessage: "Yield", description: "[ModelChart] chart label for the yield of an investment"})
		},
		"inflationLinked.beirCurve.marketData.beirCurve": {
			x: "maturity",
			y: [{target: "rate", computed: "computedRate"}],
		},
		"inflationLinked.inflationLinkedOptions.marketData.inflationLinkedOptions": {
			x: "option",
			y: [{target: "price", computed: "computedPrice"}],
		}
	}

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

	recalibration: RNRecalibration;
	path: string[];

	constructor(props: RecalibrationChartProps) {
        makeObservable(this);
        this.recalibration = props.rnRecalibration;
		this.path = props.path;
    }

	@computed get userInterfaceOption(): Option {
		const nodeOption = findOption((this.recalibration.userInterface.inputOptions as any).calibrationInputs, this.path.slice(1));
		return nodeOption;
	}

	@computed get userInterfaceInputs() : Array<{[key: string]: any}>{
		const tableInputs = _.get(this.recalibration.userInterface.userInputs, this.path);
		return tableInputs;
	}

	get name() : string {
		return this.path.join(".");
	}

	@computed get applicableDefinitions() {
		return this.userInterfaceOption.options.filter(option => option.applicable && !this.yAxisNodeNames.includes(option.name));
	}

	get axisDefinitions() {
		return this.userInterfaceOption.options.filter(option => option.applicable)
	}

	@computed get chartDefaults() {
		return _.values(_.pickBy(ModelChartingResult.CHART_DEFAULT_MAPPING, (object, key) => this.name.endsWith(key)))[0];
	}

	@computed get yAxisNodeNames() {
		return _.uniq(_.flatMap(this.chartDefaults.y, (y => [y.target, y.computed])).filter(y => this.optionByName[y].applicable));
	}

	@computed get applicableGroupingDefinitions() {
		return _.filter(
			this.applicableDefinitions,
			def => {
				if (def.name == this.chartXAxisKey || (this.chartDefaults.series && this.chartDefaults.series.includes(def.name))) {
					return false;
				}
				const data = _.map(this.tableData, d => d[def.name]);
				return _.uniq(data).length > 1;
			}
		);
	}

	@computed get xAxisDefinition() {
		const {applicableDefinitions, xAxisUserInputPath: path} = this;
		if (!applicableDefinitions?.length) {
			return null;
		}
		const key = _.get(this.recalibration.chartSettings, path, this.chartDefaults.x);
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
		runInAction(() => _.set(this.recalibration.chartSettings, this.xAxisUserInputPath, key));
	}

	@computed get yAxisTitle() {
		if (this.chartDefaults.y.length == 1) {
			const option = this.userInterfaceOption.options.find(option => option.name == this.chartDefaults.y[0].target)
			return option.hints.percent ? `${option.title} (%)` : option.title;
		}
		else {
			return this.chartDefaults.getYAxisTitle(this.optionByName);
		}
	}

	@computed get seriesGroupDefinitions() : Option[] {
		if (!this.applicableGroupingDefinitions) {
			return null;
		}
		const definitions = [];
		_.forEach(this.applicableGroupingDefinitions, def => {
			if (def.name != this.chartXAxisKey && this.chartSeriesStatus[def.name]) {
				definitions.push(def);
			}
		});
		return definitions;
	}

	@computed get chartSeriesStatus(): {[key: string]: boolean} {
		const {canGroup, applicableGroupingDefinitions} = this;
		if (!canGroup) {
			return null;
		}
		const rtn = {};
		let noneOptionStatus = true;
		let chartSeriesStatus = _.get(this.recalibration.chartSettings, this.seriesUserInputPath, {[ModelChartingResult.NONE_SERIES_KEY]: true});
		chartSeriesStatus = chartSeriesStatus && _.isObject(chartSeriesStatus) ? chartSeriesStatus : {};
		_.forEach(applicableGroupingDefinitions, (def) => {
			const status = _.get(chartSeriesStatus, def.name, this.chartDefaults.series != null && _.includes(this.chartDefaults.series, def.name));
			rtn [def.name] = status;
			noneOptionStatus = noneOptionStatus && !status;
		});
		rtn[ModelChartingResult.NONE_SERIES_KEY] = noneOptionStatus;
		return rtn;
	}

	set chartSeriesStatus(updates) {
		let chartSeriesStatus = _.get(this.recalibration.chartSettings, this.seriesUserInputPath);
		chartSeriesStatus = chartSeriesStatus && _.isObject(chartSeriesStatus) ? chartSeriesStatus : {};

		if (_.has(updates, ModelChartingResult.NONE_SERIES_KEY)) {
			const updateStatus = !updates[ModelChartingResult.NONE_SERIES_KEY];
			updates = {};
			_.forEach(this.applicableGroupingDefinitions, def => {
				updates[def.name] = updateStatus;
			});
		}

		runInAction(() => {
			_.set(this.recalibration.chartSettings, this.seriesUserInputPath, _.assign(chartSeriesStatus, updates));
		})
	}

	getValueDisplay(dataObj: any, axisDefinition): string {
		let data = dataObj[axisDefinition.name];
		const selectedSubOption = _.find( axisDefinition.options, option => _.isEqual(option.name, data));
		if (axisDefinition.hints?.maturity) {
			data = convertMonthToYM(data);
		}
		return selectedSubOption ? selectedSubOption.title : data;
	}

	getSeriesTitle(tableRow): string {
		const seriesGroupDefinitions = this.seriesGroupDefinitions;
		if(!seriesGroupDefinitions) {
			return "dummyGroup";
		}
		const titles = [];
		_.forEach(seriesGroupDefinitions, def => {
			const data = _.map(this.tableData, d => d[def.name]);
			if (_.uniq(data).length > 1) {
				titles.push(`${def.title}: ${this.getValueDisplay(tableRow, def)}`)
			}
		})
		return titles.join(', ');
	}

	@computed get tableData() {
		return this.userInterfaceInputs;
	}

	@computed get categories(): string[] {
		const {xAxisDefinition, tableData} = this;
		if (!xAxisDefinition || !tableData) {
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

	@computed get optionByName() {
		return _.keyBy(this.userInterfaceOption.options, option => option.name);
	}

	@computed get yMap() {
		return this.chartDefaults.y.map(group => ({...group, targetTitle: this.optionByName[group.target].title, computedTitle: this.optionByName[group.computed]?.title})).filter(group => this.optionByName[group.target].applicable);
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
			_.forEach( this.yAxisNodeNames, colName => rtnObj[colName] = [] );

			const xGroup = _.groupBy(yGroupData, data => data[xAxisDefinition.name]);
			_.forEach(Object.values(xGroup), xGroupData => {
				const category = this.getValueDisplay(xGroupData[0], xAxisDefinition);
				const categoryIdx = categories.indexOf(category);
				_.forEach( this.yAxisNodeNames, colName => {
					const option = this.optionByName[colName];
					rtnObj[colName].push([categoryIdx, _.sum(_.map(xGroupData, d => {
						let value = this.chartDefaults.getYValue != null ? this.chartDefaults.getYValue(colName, d) : d[colName]

						if (value != null && option?.hints?.percent)
							value = value * 100;

						return value;
					}))]);
				});
			});
			return rtnObj;
		});
	}
}

@observer
export class ModelChart extends React.Component<RecalibrationChartProps, {}> {
    @observable modelChartingResult = new ModelChartingResult(this.props);
    chartUserOptions = toJS(this.props.rnRecalibration.getChartUserOptions(this.modelChartingResult.name));
    chartRef = null;
    _dispose = [];

    constructor(props: RecalibrationChartProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {

		this._dispose.push(reaction(() => {
			const result = this.modelChartingResult;
			const rtn = {
				x: result.chartXAxisKey,
				categories: result.categories,
				yMaps: result.yMap
			};
			_.map(result.seriesGroupDefinitions, def => {
				rtn[def.name] = _.uniq(_.map(result.tableData, data => data[def.name]));
			});
			return JSON.stringify(rtn);
		} , (data) => {
			setTimeout(()=> {
				const newResult = new ModelChartingResult(this.props);

				const xAxisTitle = _.get(newResult, "xAxisDefinition.title");
				const xDisplayUnitTitle = _.get(this.chartUserOptions, "xAxis.displayUnits.0.title");

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
			_.map(result.yAxisNodeNames, key => {
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

    updateUserOptions = (updateObj) => {
		Object.assign(this.chartUserOptions, updateObj);
		this.props.rnRecalibration.updateChartUserOptions(this.modelChartingResult.name, updateObj);
	}

    render() {
		const {modelChartingResult, props:{rnRecalibration}} = this;
		const title = modelChartingResult.userInterfaceOption?.title || '';
		return <div className={""}>
			{ rnRecalibration.isLoaded ?
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
export class ModelChartAdvanceOptions extends React.Component<RecalibrationChartProps, {}> {
    modelChartingResult = new ModelChartingResult(this.props);

    @observable userOptions = this.props.rnRecalibration.getChartUserOptions(this.modelChartingResult.name);

    constructor(props: RecalibrationChartProps) {
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
		const name = this.modelChartingResult.name;
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
		return <div className={classNames(css.settings)}>
			<InputSpecificationComponent
				// className={settingCss.input}
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