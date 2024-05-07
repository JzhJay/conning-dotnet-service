import {IconNames} from '@blueprintjs/icons';
import {bp, HighchartsComponent} from 'components';
import {getHighchartsRSSimulationReportObject} from 'components/system/highcharts/dataTemplates/rsSimulationReportTemplate';
import {ReportsOutputView} from '../ReportsOutputPage';
import {action, computed, makeObservable, reaction, toJS} from 'mobx';
import {observer} from 'mobx-react';
import {Select} from '@blueprintjs/select';
import {ChartUserOptions, HighchartsHelper, IChartingResult} from 'stores';

import * as css from './ReportsChartView.css';

@observer
export class ReportsChartView extends React.Component<{view: ReportsOutputView}, any>{

	chartRef: HighchartsComponent;
	chartingResult: IChartingResult;
	chartUserOptions: ChartUserOptions;

	private _dispose: Function[] = [];

	constructor(props) {
		super(props);
		makeObservable(this);

		const {reportOutputView, viewData} = this.props.view;
		this.chartingResult = _.assign({id: uuid.v4()}, viewData);
		this.chartingResult.highcharts = new HighchartsHelper(this.chartingResult);
		this.chartUserOptions = toJS(this.reports.getChartUserOptions(reportOutputView.name));

		this._dispose.push(reaction(() => this.props.view.viewData, (data) => {
			if (data?.series) {
				const updates = getHighchartsRSSimulationReportObject(data, this.chartUserOptions);
				this.chartRef?.chart.update({series: updates.series}, false);
			} else {
				this.chartRef?.chart.update({series: []}, false);
			}
			this.chartRef?.chart.yAxis[0].setExtremes(null,null, true, true);
		}));
	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	get reports () {
		return this.props.view.props.views.props.reports;
	}

	@computed get selectedIndex() {
		return this.props.view.selectedIndex || 0;
	}

	@computed get additionalToolbarItems(): JSX.Element[] {
		const {reportOutputView: {dataset}} = this.props.view;
		const activeItem = dataset[this.selectedIndex];
		return [<Select
					key={"additionalToolbarItems_select"}
					items={dataset}
					activeItem={activeItem}
			        itemRenderer={(item, {handleClick, modifiers}) => {
						return <bp.MenuItem key={item} text={item} icon={modifiers.active ? IconNames.TICK: IconNames.BLANK} onClick={handleClick}/>
			        }}
			        onItemSelect={action((item) => {
				        this.props.view.selectedIndex = dataset.indexOf(item);
				        this.props.view.loadViewData(true);
			        })}
			        popoverProps={{ minimal: true }}
			        filterable={false}
		        >
			        <bp.Button text={activeItem} rightIcon={IconNames.CARET_DOWN} />
		        </Select>]
	}

	render() {
		const {reportOutputView} = this.props.view;

		return  <div className={css.root}>
			<HighchartsComponent
				ref={r=> this.chartRef = r}
				id={reportOutputView.name}
				key={reportOutputView.name}
				guid={reportOutputView.viewType}
				inlineToolbar={true}
				disableSelections={false}
				className={""}
				chartType={'rsSimulationReport'}
				userOptions={this.chartUserOptions}
				onUserOptionsUpdated={(userOptions)=>{ this.reports.updateChartUserOptions(reportOutputView.name, userOptions)}}
				allowScrollwheelZoom={false}
				chartingResult={this.chartingResult}
				additionalToolbarItems={this.additionalToolbarItems}
			/>
		</div>;
	}
}