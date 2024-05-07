/// <reference path="./highcharts-extensions.d.ts" />

import {AssetClassesReturnChartHighchartsExtender} from 'components/system/highcharts/extenders/assetClassesReturn.hc.extender';
import {RecalibrationChartHighchartsExtender} from 'components/system/highcharts/extenders/calibration.hc.extender';
import {LineWithHorizonChartExtender} from 'components/system/highcharts/extenders/lineWithHorizon.hc.extender';
import {RSSimulationReportsChartExtender} from 'components/system/highcharts/extenders/rsSimulationReports.hc.extender';
import {ThroughTimeStatisticsChartHighchartsExtender} from 'components/system/highcharts/extenders/throughTimeStatistics.hc.extender';
import {FormatAxisDrawer} from 'components/system/highcharts/internal-components/FormatAxisDrawer';
import { computed, observable, toJS, action, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {site} from "../../../stores/site";
import {i18n} from "../../../stores/i18n";
import {remToPixels} from '../../../utility';
import {QueryContextMenu} from "../query-tool/query-builder";
import {ChartToolbar} from './toolbar/highchartsToolbar';

import * as css from './highchartsComponent.css'
import * as chartToolBarCSS from './toolbar/highchartsToolbar.css';
import * as reportCss from '../../../utility/pdfExport.css';

import {
	HighchartsExtender,
	BoxChartHighchartsExtender,
	CDFChartHighchartsExtender,
	HistogramChartHighchartsExtender,
	PDFChartHighchartsExtender,
	PercentileChartHighchartsExtender,
	ScatterChartExtender,
	EfficientFrontierChartExtender,
	IOBoxChartHighchartsExtender,
	StatusChartHighchartsExtender, AssetAllocationChartHighchartsExtender, DistributionAtHorizonHighchartsExtender, CRABoxChartHighchartsExtender
} from './extenders/index'

import {AppIcon, LoadingIndicator, bp, mobx} from "components";
import {utility, api, IChartingResult, IO, IOPage} from 'stores';
import type {ChartType, ChartData, ChartUserOptions, PivotStateID} from 'stores/queryResult';
import {queryResultStore, GridlinesType, QueryResult} from 'stores/queryResult';
import {LoadingEllipsis} from '../../widgets/loaders/LoadingEllipsis';
import {LineChartExtender} from "./extenders/line.hc.extender";
import {BarChartExtender} from "./extenders/bar.hc.extender";
import { ChartDataMap, ChartDataRef } from "../../../stores/charting/chartComponentModels";
import { BeeswarmChartExtender } from "./extenders/beeswarm.hc.extender";
import { DensityHighchartsExtender } from "./extenders/density.hc.extender";

import {AutoResizeComponent} from "components/widgets/layout/AutoResizeComponent";
import * as craPageCss from '../ClimateRiskAnalysis/ClimateRiskAnalysisPage.css';

const {KeyCode} = utility;

interface HighchartsProps extends React.Props<HighchartsComponent> {
	guid?: string; //TODO remove property and pull from queryResult.id
	name?: string;
	style?: React.CSSProperties;
	className?: string;
	chartType: ChartType;
	chartData?: ChartData; // Optional prop to provide chart data externally
	stateID?: PivotStateID;
	additionalToolbarItems?: JSX.Element[];
	inlineToolbar?: boolean;
	hideHeader?: boolean;
	debounce_OnResizeMs?: number;
	onLoaded?: () => void;
	isLayoutDragging?: boolean;
	userOptions?: ChartUserOptions;
	chartingResult?: IChartingResult;
	onUserOptionsUpdated?: (userOptions: ChartUserOptions) => void;
	onContextMenu?: (e, evaluationIndex, viewID) => void;
	id?: string;
	page?: IOPage;
	disableSelections?: boolean;
	allowScrollwheelZoom?: boolean;
	isShowViewCaption?: boolean;
	viewCaptionIndex?: number;
	isReportMainBlock?: boolean;
	disableFormatAxis?: boolean;
}

@observer
@bp.ContextMenuTarget
export class HighchartsComponent extends AutoResizeComponent<HighchartsProps, {}> {
	constructor(props, state) {
        super(props, state);
        makeObservable(this);
        const {chartingResult, chartType } = props;

        this.userOptions = props.userOptions ? props.userOptions :
		                   chartingResult && chartingResult.userOptions && chartingResult.userOptions[chartType] ? chartingResult.userOptions[chartType] :
		                                                                                                  queryResultStore.charting.defaultUserOptions(this.props.chartType);
        this.selectionFontSize = parseFloat(_.get(this.userOptions, "highchartsOptions.chart.style.fontSize", this.userOptions.fontSize.toString()));
    }
	@observable _busy = false;
	@observable chart: HighchartsChartObject  = null;
	@observable userOptions: ChartUserOptions = null;
	@observable selectionFontSize: number     = null;
	@observable loadingText: string           = null;
	@observable canRemoveTooltips: boolean    = false;

	static defaultProps = {
		showToolbar:         true,
		allowScrollwheelZoom: true,
		//inlineToolbar: true,
		debounce_OnResizeMs: 50,
		//userOptions: _.cloneDeep(defaultChartOptions),
		onUpdateUserOptions: (options: ChartUserOptions) => {
			console.log(options);
		}
	}

	renderContextMenu(e) {
		if (this.axisDrawer) {
			let axis;
			const $target = $(e.target).parent();
			if ($target.is('.highcharts-axis')) {
				console.log(_.get(this.chart, "axes"))
				axis = _.find(_.get(this.chart, "axes"), axis => _.get(axis, "axisGroup.element") == $target[0]);
			} else if ($target.is('.highcharts-axis-labels')) {
				axis = _.find(_.get(this.chart, "axes"), axis => _.get(axis, "labelGroup.element") == $target[0]);
			} else {
				const selections = this.chart.selections;
				if (selections.length == 1 && selections[0].target?.parentAxis) {
					if ($(e.target).is(`rect[stroke="black"][stroke-width="1"]`)) {
						axis = selections[0].target.parentAxis;
					}
				}
			}

			if (axis) {
				const disabled = !FormatAxisDrawer.canModify(axis);
				return <bp.Menu>
					<bp.MenuItem icon={<AppIcon icon={FormatAxisDrawer.ICON}/>} text={i18n.intl.formatMessage({defaultMessage:'Format Axis...', description: '[highcharts] Text of menu item Format Axis'})} disabled={disabled} onClick={action(() => this.axisDrawer.axis = axis as any)}/>
				</bp.Menu>
			}
		}

		const {chartingResult: cr, chartType} = this.props;
		return cr && cr instanceof QueryResult ? <QueryContextMenu location='builder' currentView={chartType} query={cr.query}/> : null
	}

	@computed get busy() {
		return this._busy;
	}

	set busy(value) {
		this._busy = value
		api.site.busy = value;
	}

	chartDiv: Element;
	extender: HighchartsExtender;
	toolbarComponent: ChartToolbar;

	@action onViewCaptionChange = (val: string) => {
		this.onUpdateUserOptions({ viewCaption: val });
	}

	renderToolbar() {
		const {chartType, additionalToolbarItems} = this.props;

		return <ChartToolbar
			key={chartType}
			ref={(c) => {this.toolbarComponent = c}}
			chartData={this.chartData}
			chartComponent={this}
			guid={this.props.guid}
			queryResult = {this.props.chartingResult}
			chartType={chartType}
			additionalToolbarItems={additionalToolbarItems}
			userOptions={this.userOptions}
			selectionFontSize={this.selectionFontSize}
			onResetZoom={this.resetZoom}
			onUpdateUserOptions={this.onUpdateUserOptions}
			id={this.props.id}
		/>
	}

	axisDrawer: FormatAxisDrawer = null;

	render() {
		const {busy, props: {className, inlineToolbar, style, chartType, isLayoutDragging, id, isShowViewCaption = false, viewCaptionIndex = 0, isReportMainBlock = false }} = this;
		const showLoader = !(this.props.chartingResult instanceof IO); // Don't show loaders for IO charts. Introduces unneeded resizing which slows down EF chart.

		return (
			<div
				className={classNames(className, css.highchartsComponent, chartType)}
				style={style}
				onContextMenu={(e) => this.chart.hoverPoint && this.props.onContextMenu(e, this.chart.hoverPoint.options.connEvalIndex, id) }>
				{!isLayoutDragging && this.renderToolbar()}
				{isLayoutDragging &&
					<div className="content">
						<div className="center aligned header icon">
							<AppIcon icon={api.queryResultStore.charting.descriptors[chartType].icon}/>
							{name}
						</div>
					</div>}
				{showLoader && <LoadingIndicator active={this.extender == null || !this.extender.isFullyLoaded}>
					{this.loadingText}
				</LoadingIndicator>}
				<div className={chartToolBarCSS.highchartPopoverToolbarContainer} id={chartToolBarCSS.highchartPopoverToolbarContainer}></div>
				{ isShowViewCaption &&
					<div className={craPageCss.viewCaption}>
						<div className={craPageCss.viewCaptionIndex}>
							{`Figure ${viewCaptionIndex} `}
						</div>
						<div className={craPageCss.viewCaptionInput}>
							<bp.EditableText value={this.userOptions.viewCaption} onChange={this.onViewCaptionChange} multiline={true} />
						</div>
					</div>}
				<div ref={c => this.chartDiv = c} className={classNames(css.chart, {[reportCss.viewMainBlock]: isReportMainBlock})}/>
				{this.props.disableFormatAxis !== true && <FormatAxisDrawer highchartsComponent={this} ref={r => this.axisDrawer = r} />}
			</div>
		);
	}

	@action private setupChart(data: ChartData) {
		try {
			// Validate that the chart div actually exists - otherwise we get a highcharts error 13:  http://www.highcharts.com/errors/13
			if (!document.contains(this.chartDiv) || !data.series) {
				//console.warn('Chart div is not in the document')
				return;
			}

			data = _.cloneDeep(data);

			_.merge(data, {
				chart: {
					renderTo: this.chartDiv,
					// See highchartsExtender for event handling
					// events: {
					// 		load: function(event) {
					// 				debugger;
					// 				if (this.props.onLoaded) { this.props.onLoaded(); }
					//    }
					// }
				}
			});

			const { hideHeader, chartType } = this.props;

			if (hideHeader) {
				data.title    = { text: null };
				data.subtitle = { text: null };
			}

			if (data.series && data.series.length === 1) {
				if (data.legend)
					data.legend.enabled = false;
			}

			this.setupHighchartExtensions(data);

			this.chart = new Highcharts.Chart(data)
			delete data.chart.renderTo; // Remove after rendering to allow serialization of chart data.

			if ((chartType === 'scatter' || chartType === 'pdf') && this.userOptions.gridLine == null) {
				this.onUpdateUserOptions({ gridLine: GridlinesType.Both });
			}

			this.chart.selections = [];

			this.loadingText = null;
			this.onResize()
		}
		catch (err) {
			site.raiseError(err);
		}
	}

	isLegendEnabled
	componentDidUpdate(prevProps: Readonly<HighchartsProps>, prevState: Readonly<{}>, snapshot?: any) {
		const newProps = this.props;
		if (newProps.chartData != this.props.chartData) {
			this.setupChart(newProps.chartData);        // Todo - we need to be smarter about updating the existing chart without creating a whole new one
		}

		if (newProps.isLayoutDragging !== this.props.isLayoutDragging && this.chart) {
			// Show the chart as is for very big chart to avoid slow redraws. TODO: Try to reuse the exiting chart and modify the DOM directly.
			if (this.chart.series.length * this.chart.series[0].options.data.length > 1000)
				return;

			let axes = this.chart.xAxis.concat(this.chart.yAxis);

			if (!newProps.isLayoutDragging) {
				// Reset axis visibility
				axes.forEach((axis) => {
					axis.update({visible: true});
					;
				});

				// re-add legend
				if (this.isLegendEnabled) {
					//this.extender.addLegend();
					this.chart.update({legend:{enabled:true}})
				}

				this.chart.reflow()

			}
			else {
				// Hide axes
				axes.forEach((axis) => {
					axis.update({visible: false});
				});

				// remove legend
				this.isLegendEnabled = this.chart.legend.options.enabled;
				if (this.isLegendEnabled) {
					//this.extender.removeLegend();
					this.chart.update({legend:{enabled:false}})
				}

				//this.chart.reflow()
			}
		}

		if (newProps.inlineToolbar !== this.props.inlineToolbar && this.chart) {
			let toolbarNode = ReactDOM.findDOMNode(this.toolbarComponent) as Element;

			// Add class to reset padding and min/max heights
			$(toolbarNode).addClass("pending-transition");

			let minHeight           = 0;
			let maxHeight           = remToPixels(parseFloat($(toolbarNode).css("--toolbar-height")));
			let toolbarNewHeight    = newProps.inlineToolbar ? maxHeight : minHeight;
			const animationDuration = 500;
			const easing            = "linear";

			// Hide or show toolbar
			$(toolbarNode).animate({height: toolbarNewHeight}, {duration: animationDuration, easing, complete: () => {
				if (newProps.inlineToolbar) {
					$(toolbarNode).removeClass("collapsed");
				} else {
					$(toolbarNode).addClass("collapsed");
				}

				$(toolbarNode).removeClass("pending-transition");
			}, progress: () => {
				this.chart.reflow()
			}});
		}

		if (!_.isEqual(newProps.userOptions, this.props.userOptions)) {
			this.userOptions = newProps.userOptions;
		}

		if (newProps.disableSelections === true) {
			this.chart?.selections && this.clearSelections();
		}
	}

	@action onUpdateUserOptions = (userOptions: ChartUserOptions) => {
		// Combine the new userOptions with existing options.
		// Note: assigning the new options to this.userOptions an observable will also make the new options an observable which is undesired, so lets clone it first.
		// JSON stringify then parse to strip out mobX observables which screws up merging of axis arrays
		mobx.set(this.userOptions, toJS(userOptions));

		if (this.props.onUserOptionsUpdated) {
			this.props.onUserOptionsUpdated(this.userOptions);
		}
	}

	node: Element;

	componentDidMount() {
		super.componentDidMount();

		// console.time("time" + this.props.chartType);

		document.addEventListener("keyup", this.documentKeyUp), false;

		this.node = ReactDOM.findDOMNode(this) as Element;

		// Note: we use addEventListener to capture the events instead of letting it bubble up.
		this.chartDiv.addEventListener("click", this.chartClick, true);

		// Bind scroll wheel for zooming
		$(this.chartDiv).bind("mousewheel DOMMouseScroll", (e) => {
			const {chartingResult, page} = this.props;
			if (!this.props.allowScrollwheelZoom)
				return;

			let consumed = this.extender && this.extender.mouseWheel(e);

			if (!consumed)
				this.mouseWheelZoom(e);
			e.preventDefault();
		});

		const {chartData, chartType, guid, chartingResult} = this.props
		if (chartData != null) {
			this.setupChart(chartData);
		} else if (chartingResult) {
			this.loadChartData(guid, chartingResult, chartType);
		} else {
			throw new Error(i18n.intl.formatMessage({
				defaultMessage: 'HighchartsComponent requires either chartData passed as prop or a query result from which it can query data.',
				description: '[hightcharts] Error message for missing to pass chart data'
			}));
		}

		const loadingLabels = {
			box: i18n.highcharts.chart.box,
			cone: i18n.highcharts.chart.cone,
			scatter: i18n.highcharts.chart.scatter,
			pdf: i18n.highcharts.chart.pdf,
			cdf: i18n.highcharts.chart.cdf,
			gboxplot: i18n.highcharts.chart.gboxplot,
			craBox: i18n.highcharts.chart.craBox,
			rsSimulationRecalibration: i18n.highcharts.chart.rsSimulationRecalibration,
		}
		const loadingLabel = loadingLabels[chartType];
		action(() => this.loadingText = i18n.highcharts.loadingChart({ chart: loadingLabel || api.utility.camelToRegular(chartType)}));
	}

	isUnmounting = false;

	componentWillUnmount() {
		super.componentWillUnmount();

		const {extender, chartDiv, chart, props: {chartingResult}} = this;

		if (extender) extender.cleanup();
		document.removeEventListener("keyup", this.documentKeyUp, false);
		chartDiv.removeEventListener("click", this.chartClick);

		// Sync the stored chart options state with the saved chart data.
		if (chart && chartingResult) {
			chartingResult.highcharts.updateChartData(this.getChartDataKeyFromCurrentState(), this.getChartDataFromChartOptions() as any);
		}

		// Release chart key
		this.chartDataKey = null;
		//this.chart = null;
		this.node         = null;
		this.isUnmounting = true;

		try {
			if (chart) {
				chart.destroy();
			}
		}
		catch (e) {
			// Scatter chart cleanup fails after inversion.
			// TODO: reproduce in jFiddle and write up highcharts bug.
		}
	}

	private documentKeyUp = (e) => {
		if (e.keyCode === KeyCode.Escape) {
			const {chart} = this;

			if (chart && chart.mouseIsDown) {
				chart.mouseIsDown             = false;
				chart.pointer.selectionMarker = chart.pointer.selectionMarker.destroy();
			}
		}
	}

	private chartClick = ($event) => {
		let chart = this.chart;

		// clear all selections on click. If needed they will be re-added by the appropriate
		// click handlers
		if (chart && chart.selections) {
			this.clearSelections();
			this.extender.setSelectionFontSize(this.extender.getChartFontSize(chart));
		}
	}

	clearSelections = () => {
		let chart = this.chart;

		$.each(chart.selections, (index, selection) => {
			selection.border.destroy();
		});
		chart.selections.length = 0;
	}

	onResize() {
		const {chart, extender} = this;

		if (this.props.chartingResult instanceof IO &&
			(!this.props.page.isViewActive(this.props.chartType) || this.props.chartingResult.book.isPageAnimating() || this.props.page != this.props.chartingResult.currentPage))
			return;

		if (chart && chart.hasLoaded) {
			chart.reflow();
		}

		if (extender) {
			extender.resize();
		}
	}

	get regressionSeries() {
		if (this.chart == null) {
			return [];
		}
		else {
			return _.filter(this.chart.series, s => s.options.isRegressionLine);
		}
	}

	@action loadChartData = (guid: string, chartingResult: IChartingResult, chartType: ChartType) => {
		const {userOptions} = this;
		const {highcharts}  = chartingResult;
		const pivotMetadata = chartingResult instanceof QueryResult ? chartingResult.pivotMetadata : null;

		if ((pivotMetadata && !_.some(pivotMetadata.availableViews.slice(), v => v.name === queryResultStore.charting.descriptors[chartType].name.toLowerCase()))
			|| guid == null) {
			if (guid != null) {
				// Invalid chart type for the pivot arrangement
				console.error(`Chart type ${chartType} is unavailable for the current pivot arrangement.`);
			}
			else {
				/*HighchartsApi.getMockData(chartType, 1)
				 .then(chartData => {
				 this.setupChart(chartData)
				 return chartData;
				 });*/
			}
		}
		else {
			this.loadingText = i18n.intl.formatMessage({
				defaultMessage: 'Loading chart data...',
				description: '[hightcharts] Loading message while loading chart data'
			});

			userOptions.plotHeight = userOptions.plotWidth = 0;
			highcharts.getPrebuiltDataTemplate(chartType, userOptions).then(data => {
				this.chartDataKey = Object.keys(data)[0];
				this.setupChart(data[this.chartDataKey].chartData);
			}, (error) => {
				// Display error and clear spinner.
				this.chartDiv.innerHTML = i18n.intl.formatMessage({
					defaultMessage: 'Chart data fetch failed',
					description: '[hightcharts] Error message for failing to fetch chart data'
				});
				throw error;
			});
		}
	}

	setupHighchartExtensions = (data) => {
		const {chartType} = this.props;

		switch (chartType) {
			case 'scatter': {
				this.extender = new ScatterChartExtender(this, data);
				break;
			}

			case 'cone': {
				this.extender = new PercentileChartHighchartsExtender(this, data);
				break;
			}

			case 'box': {
				if (!data.multipleGroupings) {
					this.extender = new PercentileChartHighchartsExtender(this, data);
				} else {
					this.extender = new BoxChartHighchartsExtender(this, data);
				}

				break;
			}

			case 'cdf': {
				this.extender = new CDFChartHighchartsExtender(this, data);
				break;
			}

			case 'pdf': {
				const PDF     = PDFChartHighchartsExtender(DensityHighchartsExtender(HighchartsExtender));
				this.extender = new PDF(this, data, true)
				break;
			}

			case 'histogram': {
				this.extender = new HistogramChartHighchartsExtender(this, data);
				break;
			}

			case 'beeswarm': {
				this.extender = new BeeswarmChartExtender(this, data);
				break;
			}

			case 'line': {
				this.extender = new LineChartExtender(this, data);
				break;
			}

			case 'bar': {
				this.extender = new BarChartExtender(this, data);
				break;
			}

			case 'efficientFrontier' : {
				this.extender = new EfficientFrontierChartExtender(this, data);
				break;
			}

			case 'ioBox' : {
				this.extender = new IOBoxChartHighchartsExtender(this, data);
				break;
			}

			case 'status': {
				this.extender = new StatusChartHighchartsExtender(this, data);
				break;
			}

			case 'assetAllocation': {
				this.extender = new AssetAllocationChartHighchartsExtender(this, data);
				break;
			}

			case 'assetClassesReturnsChart': {
				this.extender = new AssetClassesReturnChartHighchartsExtender(this, data);
				break;
			}

			case 'distributionsAtHorizon': {
				this.extender = new DistributionAtHorizonHighchartsExtender(this, data);
				break;
			}

			case 'throughTimeStatistics' : {
				this.extender = new ThroughTimeStatisticsChartHighchartsExtender(this, data);
				break;
			}

			case 'craBox': {
				this.extender = new CRABoxChartHighchartsExtender(this, data);
				break;
			}

			case 'financialDamage':
			case 'volatilityShock':{
				this.extender = new LineWithHorizonChartExtender(this, data);
				break;
			}

			case 'rsSimulationRecalibration': {
				this.extender = new RecalibrationChartHighchartsExtender(this, data);
				break;
			}

			case 'rsSimulationReport': {
				this.extender = new RSSimulationReportsChartExtender(this, data);
				break;
			}

			default: {
				this.extender = new HighchartsExtender(this, data);
			}
		}
	}

	get highchartsStore() {
		return this.props.chartingResult.highcharts;
	}

	getArrangementKey() {
		const queryResult = this.props;
		const pivotMetadata = queryResult.chartingResult instanceof QueryResult ? queryResult.chartingResult.pivotMetadata : null;
		if (this.props.chartingResult instanceof IO && this.userOptions) {
			return `${this.userOptions.showEfficientFrontier} ${this.userOptions.showAdditionalPoints}`;
		}
		else if (pivotMetadata) {
			const { rowAxes, columnAxes } = pivotMetadata;
			return JSON.stringify(rowAxes) + JSON.stringify(columnAxes);
		} else {
			return null;
		}
	}

	/**
	 * Notifies the chart component that the stored axis limits has been updated, which might require a UI update.
	 * e.g. enabling/disabling reset zoom
	 */
	adjustStoredAxisLimits() {
		// Most chart operations update the userOptions which triggers an implicit re-render but this action does not.
		// Ideally updates are done through the state, however the axis limits are apart of the highcharts object. This pattern is not to be followed
		// without good reason.
		this.forceUpdate();
	}

	/**
	 * Zooms in on the chart center by setting new x and y extremes
	 * @param {type} e      click event
	 * @returns {undefined}
	 */
	zoomIn = () => {
		let chart  = this.chart;
		let xEx    = chart.xAxis[0].getExtremes(),
		    yEx    = chart.yAxis[0].getExtremes(),
		    factor = 1 - 0.8,
		    rx     = (xEx.max - xEx.min) * factor / 2,
		    ry     = (yEx.max - yEx.min) * factor / 2; //new ranges

		chart.xAxis[0].setExtremes(xEx.min + rx, xEx.max - rx, false);
		chart.yAxis[0].setExtremes(yEx.min + ry, yEx.max - ry, false);

		chart.redraw(false);
	}

	/**
	 * Zooms out on the chart center by setting new x and y extremes
	 * @param {type} e      click event
	 * @returns {undefined}
	 */
	zoomOut = () => {
		let chart = this.chart;

		let xEx    = chart.xAxis[0].getExtremes(),
		    yEx    = chart.yAxis[0].getExtremes(),
		    factor = .25,
		    rx     = (xEx.max - xEx.min) * factor / 2,
		    ry     = (yEx.max - yEx.min) * factor / 2; //new ranges

		chart.xAxis[0].setExtremes(
			Math.max(xEx.min - rx, this.extender.getAxisZoomMin(chart.xAxis[0])),
			Math.min(xEx.max + rx, this.extender.getAxisZoomMax(chart.xAxis[0])),
			false
		);
		chart.yAxis[0].setExtremes(
			Math.max(yEx.min - ry, this.extender.getAxisZoomMin(chart.yAxis[0])),
			Math.min(yEx.max + ry, this.extender.getAxisZoomMax(chart.yAxis[0])),
			false
		);
		chart.redraw(false); // set "false" to disable animation
	};

	/**
	 * Resets the zoom level by setting the axes extremes to the data min/max
	 * @param {type} e      click event
	 * @returns {undefined}
	 */
	resetZoom = () => {
		let chart = this.chart;

		// Set extremes will set our canResetZoom option
		chart.xAxis[0].setExtremes(chart.xAxis[0].userOptions.connInitialMin, chart.xAxis[0].userOptions.connInitialMax, false);
		chart.yAxis[0].setExtremes(chart.yAxis[0].userOptions.connInitialMin, chart.yAxis[0].userOptions.connInitialMax, false);
		chart.redraw(false); // set "false" to disable animation
	};

	/**
	 * Interprets the mouse wheel event as a zoom operation
	 * @param {type} e      click event
	 * @param {type} chart  The chart being updated
	 * @returns {undefined}
	 */
	mouseWheelZoom = (e) => {
		if (!this.chart || (this.extender && !this.extender.canZoom)) { return }

		let chart        = this.chart,
		    delta,
		    xEx          = chart.xAxis[0].getExtremes(),
		    yEx          = chart.yAxis[0].getExtremes(),
		    rx           = xEx.max - xEx.min,
		    ry           = yEx.max - yEx.min,
		    newRX,
		    newRY,
		    xMin, xMax, yMin, yMax, xShift, yShift,
		    x, y,
		    forcedHovers = chart.forcedHovers;

		// remove active points for a tooltip
		if (forcedHovers && forcedHovers.length > 0) {
			this.extender.pointMouseOut({
				series: {
					chart: chart
				}
			});
		}

		if (chart.tooltip)
			chart.tooltip.hide();

		e = chart.pointer.normalize(e);

		let chartX = chart.inverted ? e.chartY : e.chartX;
		let chartY = chart.inverted ? e.chartX : e.chartY;

		// Firefox uses e.detail, WebKit and IE uses wheelDelta
		delta = Math.pow(1.25, e.detail || -(e.originalEvent.wheelDelta / 120));
		newRX = rx * delta;
		newRY = ry * delta;
		if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
			chart.tooltip && chart.tooltip.hide();
			x = chart.xAxis[0].toValue(chartX);
			y = chart.yAxis[0].toValue(chartY);

			// Zoom around the point (e.g. as though the point is the center)
			xMin = x - newRX / 2;
			xMax = x + newRX / 2;
			yMin = y - newRY / 2;
			yMax = y + newRY / 2;

			// Calculate the shift to get the point back to its previous location.
			// The old location of the point - the new center location * the scaling factor
			// (to update the distance for the new scaled coordinate system)
			xShift = (x - (xEx.min + rx / 2)) * delta;
			yShift = (y - (yEx.min + ry / 2)) * delta;

			// Prevent the user from zooming beyond initial levels.
			const xZoomMin = this.extender.getAxisZoomMin(chart.xAxis[0]),
			      xZoomMax = this.extender.getAxisZoomMax(chart.xAxis[0]),
			      yZoomMin = this.extender.getAxisZoomMin(chart.yAxis[0]),
			      yZoomMax = this.extender.getAxisZoomMax(chart.yAxis[0])
			xMin           = Math.min(Math.max(xMin - xShift, xZoomMin), xZoomMax)
			xMax           = Math.max(Math.min(xMax - xShift, xZoomMax), xZoomMin)
			yMin           = Math.min(Math.max(yMin - yShift, yZoomMin), yZoomMax)
			yMax           = Math.max(Math.min(yMax - yShift, yZoomMax), yZoomMin)

			chart.xAxis[0].setExtremes(xMin, xMax, false);
			chart.yAxis[0].setExtremes(yMin, yMax, false);

			// Fixes a bug in highcharts where the last hoverpoint is saved
			// thus causing the tooltip to appear during the chart redraw.
			if (chart.hoverPoint) {
				this.extender.pointMouseOut.call(chart.hoverPoint);
				chart.hoverPoint = null;
			}

			chart.redraw(false);
		}
	}

	toggleInversion = () => {
		const inverted = !this.userOptions.isInverted;
		this.onUpdateUserOptions({isInverted: inverted});

		this.setChartInversion(inverted);
	}

	setChartInversion(inverted: boolean) {
		const {chart} = this;

		chart.xAxis.concat(chart.yAxis).forEach((axis, number) => {
			// Ensure that horizontal(soon to be vertical) axes respect the vertical axis direction and reset the state on vertical(soon to be horizontal) axes
			axis.update({reversed: axis.horiz ? this.userOptions.verticalAxisDirection === "bottom" : this.userOptions.horizontalAxisDirection === "right"}, false);
		});

		chart.update({chart: {inverted: inverted, polar: false}});

		// The markers on line/scatter series don't get updated correctly using this inversion method,
		// So force them to be fully redrawn/recalculated by toggling the series type.
		/*
		 chart.series.forEach((series: HighchartsSeriesObject, index) => {
		 if ((series.type === 'line' || series.type === 'scatter') && (series.options.marker.enabled == null || series.options.marker.enabled || series.options.isRegressionLine)) {
		 let properties = {};
		 let seriesType = series.type;

		 let toggleSeriesType = "scatter";
		 series.update({type: toggleSeriesType});
		 series.update({type: seriesType});

		 for (let property in properties) {
		 series[property] = properties[property];
		 }
		 }
		 });*/

		//chart.redraw();

		// Destroy the selection on inversion since the target might have been destroyed.
		chart.selections.forEach((selection, index) => {
			selection.border.destroy();
		});
		chart.selections.length = 0;
	}

	// Track the state(chartData) updates to ensure the computed is udpated when the key remains the same but the chartData changes. e.g. loading underlying data lazily in box chart.
	// TODO: making chartDataMap an observable will fix this but it might break other code.
	@observable _state = 1;
	@computed get chartData() {
		return this.chartDataKey && this._state ? this.highchartsStore.chartDataMap[this.chartDataKey].chartData : null;
	}

	@observable _chartDataKey: string;

	@computed get chartDataKey() {
		return this._chartDataKey;
	}

	set chartDataKey(key) {
		this._state++;
		if (key === this._chartDataKey) {
			return;
		}

		// release previous ref
		if (this._chartDataKey && this.highchartsStore.chartDataMap[this._chartDataKey]) {
			this.highchartsStore.updateChartDataRefCount(this._chartDataKey, false);
		}

		this._chartDataKey = key;

		// Add new ref
		if (key) {
			this.highchartsStore.updateChartDataRefCount(this._chartDataKey, true);
		}
	}

	getChartDataKeyFromCurrentState() {
		const {userOptions}     = this;
		const {guid, chartType} = this.props;

		return this.highchartsStore.getChartDataKey(chartType, userOptions);
	}

	getChartDataFromChartOptions() {
		let chartData;

		if (this.chart) {

			// The chart.options series isn't correctly updated via series.update() actions, so lets build our own series options from the userOptions.
			// Note using the userOptions instead of options to preserve any custom settings we applied e.g. sticky series in cone/box
			// Also use the plotOptions from userOptions because the chart options also includes chart specific defaults which overrides the generic series options
			// e.g. If we applied plotOptions: {series: {turboThreshold: 25}} then the default scatter specific plotOptions: {scatter: {turboThreshold: 25}},
			// will override our setting and cause issues with re-mounting. (WEB-2560)
			const series = this.chart.series.map((series) => series.userOptions)

			chartData                = Object.assign({}, this.chartData, this.chart.options, {series: series, plotOptions: this.chart.userOptions.plotOptions}) as HighchartsOptions;
			chartData.chart.renderTo = null;

			// Stringify then back to strip out event callbacks which link to chart instances and would cause a memory
			// leak if the chartData was stored.
			chartData = toJS(chartData);
		}

		return chartData;
	}

	updateChartData(chartDataProps, newChartDataKey:string = null) {
		const chartData = this.chartData;

		// Race condition where user navigates away before this function is called. e.g. Calling from an API request.
		// The complete already stored chart data might have been deleted and therefore we cannot create a new complete chartData for the update.
		if (this.isUnmounting) {
			return;
		}

		if (newChartDataKey == null)
			newChartDataKey = this.getChartDataKeyFromCurrentState();

		if (chartDataProps["zAxis"])
			chartDataProps["zAxis"] = null; // How is a z-axis getting into our data?

		this.highchartsStore.updateChartData(newChartDataKey, Object.assign({}, chartData, chartDataProps));
		this.chartDataKey = newChartDataKey;
	}

	async fetchChartData() {
		let data      = await this.highchartsStore.getPrebuiltDataTemplate(this.props.chartType, this.userOptions);
		return (_.values(data)[0] as ChartDataRef).chartData as ChartData;
	}

	refetchData(fitAxisToData:boolean = true) {
		return this.highchartsStore.getPrebuiltDataTemplate(this.props.chartType, this.userOptions).then(async (data: ChartDataMap) => {
			let chartData          = (_.values(data)[0] as ChartDataRef).chartData as ChartData;
			chartData.bootstrapped = this.props.chartingResult instanceof QueryResult ? this.props.chartingResult.bootstrapEnabled : false;

			this.updateChartData(chartData);
			this.chart.update(chartData, false); // Do not redraw here. Causes percentile stacks to be calculated multiple times and screws up stacking.
			let xAxis = this.chart.xAxis[0];
			let yAxis = this.chart.yAxis[0];

			if (fitAxisToData && this.props.chartType != "box") {
				(xAxis as any).getSeriesExtremes();
				(yAxis as any).getSeriesExtremes();
			}

			let xAxisExtremes = xAxis.getExtremes();
			let yAxisExtremes = yAxis.getExtremes();
			xAxis.userOptions.connInitialMin = fitAxisToData ? xAxis.dataMin : xAxisExtremes.min;
			xAxis.userOptions.connInitialMax = fitAxisToData ? xAxis.dataMax : xAxisExtremes.max;
			yAxis.userOptions.connInitialMin = fitAxisToData ? yAxis.dataMin : yAxisExtremes.min;
			yAxis.userOptions.connInitialMax = fitAxisToData ? yAxis.dataMax : yAxisExtremes.max;


			xAxis.setExtremes(xAxis.userOptions.connInitialMin, xAxis.userOptions.connInitialMax);
			yAxis.setExtremes(yAxis.userOptions.connInitialMin, yAxis.userOptions.connInitialMax);

			if (this.props.chartType == "cdf") {
				(this.extender as CDFChartHighchartsExtender).reset(chartData);
			}

			// WEB-2226 Hack to fix an issue in EF chart where the point order doesn't match the order its set in and causes points to be connected that shouldn't be.
			this.chart.series.forEach((s, i) => {
				if (s.name == "underlyingDonutSeries" || s.name == "fullFrontierSeries")
					s.setData(chartData.series[i].data, true, false, false);
			});

			this.chart.redraw();
			this.extender.updateChartAxisDisplay(xAxis as any);
			this.extender.updateChartAxisDisplay(yAxis as any);
			return true;
		})
	}

	outstandingActions:Array<Promise<any> > = [];
	async syncActions(f:() => any) {
		await this.waitOutstanding();

		let request = f();
		let i = this.outstandingActions.push(request) - 1;
		try {
			await request;
		} finally {
			this.outstandingActions.splice(i, 1);
		}


		return request;
	}

	async waitOutstanding() {
		if (this.outstandingActions.length > 0)
			await Promise.all(this.outstandingActions);
	}

	async performBusyAction(f:() => any) {
		try {
			api.site.busy = true;
			this.busy = true;
			//TODO: Update chart busy component directly so it appears faster.
			await utility.sleep(1); // Give the busy indicator a chance to be shown.
			f();
		}
		finally {
			api.site.busy = false;
			this.busy = false;
		}
	}
}
