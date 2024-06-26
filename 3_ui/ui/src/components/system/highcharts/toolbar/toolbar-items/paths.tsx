import type {ChartData, ChartType, ChartUserOptions, PivotMetadata} from '../../../../../stores/charting';
import {QueryResult} from '../../../../../stores/queryResult/models';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {HighchartsComponent, LoadingIndicator} from "components";
import {getUnderylingDataUpdateObject} from "../../dataTemplates/percentileTemplate"
import { observable, autorun, toJS, makeObservable } from 'mobx';
import {observer} from 'mobx-react';

interface MyProps {
	chartType: ChartType;
	chartComponent: HighchartsComponent;
	userOptions: ChartUserOptions;
	onUpdateUserOptions(userOptions: ChartUserOptions);
	chartData?: ChartData;
	pivotMetadata: PivotMetadata;
}

@observer
export class PathsToolbarItem extends React.Component<MyProps, {}> {
    @observable fetchedIndividualScenarios = false;
    input                      = {value: ''};

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentDidMount() {
		if (this.shouldPrefetchUnderlyingData()) {
			this.getUnderlyingData();
		}

		this._toDispose.push(autorun(() => {
			if (this.input) {
				this.input.value = this.props.userOptions.paths.join();
			}
		}))
	}

    _toDispose = [];

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

    shouldPrefetchUnderlyingData() {
		return this.props.chartData && !this.fetchedIndividualScenarios
			&& this.props.pivotMetadata != null
			&& this.props.pivotMetadata.rows < 100000;
	}

    getUnderlyingData() {
		let {chartComponent, pivotMetadata} = this.props;

		this.fetchedIndividualScenarios = true;

		// Pull the underlying data in the background.
		chartComponent.syncActions(() => chartComponent.highchartsStore.getPercentileChartData([0], false)).then(data => {
			let newData = getUnderylingDataUpdateObject(data, pivotMetadata, chartComponent.chartData);

			chartComponent.updateChartData(newData);

			if (this.input) {
				this.input.value = this.props.userOptions.paths.join();
				this.setPaths(toJS(this.props.userOptions.paths))
				//this.onChange();
			}
		})
	}

    render() {
		let pathsEnabled = this.props.chartData && this.props.chartData.individualScenarios;

		return (
			<div className="ui labeled input paths" onClick={this.onMainContainerClick}>
				<div className={classNames("ui label", {clickable: !pathsEnabled})}>
					Show Scenarios:
				</div>
				{!pathsEnabled ? <input key="download-scenarios" disabled={!pathsEnabled} className="ui input"
				                                placeholder={"Loading Scenarios..."}
				                        value={this.fetchedIndividualScenarios ? '' : "Not Available - Click To Download Scenarios"}
				                        onChange={this.onChange}/>
					: <input key="add-scenarios" ref={input => this.input = input} className="ui input"
					         placeholder="Add Scenarios"
					         onChange={this.onChange} /> }
			</div>
		)
	}

    onMainContainerClick = () => {
		if (!this.props.chartData.individualScenarios && !this.fetchedIndividualScenarios)
			this.getUnderlyingData();
	}

    onChange = () => {
		let valueString = this.input.value.replace(/(^,)|(,$)/g, "");
		let values      = _.map(valueString.split(','), (v: string) => parseInt(v));
		values          = values.filter((value) => Number.isInteger(value));

		if (!_.isEqual(values, this.props.userOptions.paths.slice()))
			this.setPaths(values);
	}

    setPaths = (values: number[]) => {
		this.props.onUpdateUserOptions({paths: values})

		// Map scenarios to their indicies in the row list
		const indicies = values.map((v) => _.flatten(this.props.chartComponent.chartData.rowNames).indexOf(`${v}`))
		this.props.chartComponent.extender.updateChartToMatchShowPathList(indicies);
	}
}
