import {AssetClassesReturnsToolBarItem} from 'components/system/highcharts/toolbar/toolbar-items/assetClassesReturnsToolBarItem';
import {DataLabelSwitchToolbarItem} from 'components/system/highcharts/toolbar/toolbar-items/DataLabelSwitchToolbarItem';
import {FillOpacityToolbarItem} from 'components/system/highcharts/toolbar/toolbar-items/FillOpacityToolbarItem';
import {LineOpacityToolbarItem} from 'components/system/highcharts/toolbar/toolbar-items/LineOpacityToolbarItem';
import {SeriesSwitchToolbarItem} from 'components/system/highcharts/toolbar/toolbar-items/SeriesSwitchToolbarItem';
import {Toolbar} from '../../toolbar/Toolbar';
import {HighchartsComponent} from '../highchartsComponent'
import {
	FontSizeToolbarItem, GridLinesToolbarItem, RegressionLineToolbarItem,
	RemoveTooltipsToolbarItem, PanOrZoomToolbarItem, VerticalAxisDirectionToolbarItem, HorizontalAxisDirectionToolbarItem, ZoomButtonsToolbarItem,
	AreaOpacityToolbarItem, SmoothingToolbarItem, ResetZoomButtonToolbarItem,
	PercentileColorsToolbarItem, PercentilesToolbarItem, StepPatternToolbarItem,
	PathsToolbarItem, InvertToolbarItem, MeanValuesToolbarItem,
	StatisticsToolbarItem, MomentsToolbarItem, ChartMenuToolbarItem, MarkerSizeToolbarItem, LineSizeToolbarItem, DonutSizeToolbarItem, DatasetToolbarItem,
	AssetGroupsToolbarItem, AllocationSelectionComponent, ChartHorizonToolbarItem, FormatAxisPaneToolbarItem
} from './toolbar-items/index';
import * as React from 'react';

import * as css from './highchartsToolbar.css';
import type {ChartType, ChartData, ChartUserOptions, IChartingResult} from 'stores/queryResult';
import {observer} from 'mobx-react';
import {LineMarkerToolbarItem} from "./toolbar-items/LineMarker";
import { StackColumnToolbarItem } from "./toolbar-items/StackColumn";
import { QueryResult } from "../../../../stores/queryResult/models/QueryResult";
import { ToggleBootstrapToolbarItem } from "./toolbar-items/toggleBootstrap";
import ToggleSensitivityToolbarItem from "./toolbar-items/toggleSensitivity";
import {bp} from 'components';

export interface ToolbarItemProps {
	chartType: ChartType
	chartData?: ChartData;
	guid?: string;
	chartComponent: HighchartsComponent
	//fontSize: IFontSize;
	selectionFontSize: number;
	userOptions: ChartUserOptions;
	queryResult: IChartingResult;
	id?: string;

	onResetZoom();

	onUpdateUserOptions(userOptions: ChartUserOptions);
}

interface ChartToolbarProps extends ToolbarItemProps {
	additionalToolbarItems?: JSX.Element[];
	show?: boolean;
}

@observer
export class ChartToolbar extends React.Component<ChartToolbarProps, {}> {
	static defaultProps = {
		additionalToolbarItems: [],
		show:                   true
	};

	showPercentiles(chartData, chartType: ChartType) {
		switch (chartType) {
			case 'box':
			case 'cone':
			case 'cdf':
			case 'ioBox':
			case 'throughTimeStatistics':
			case 'craBox':
				return true;
			case 'beeswarm':
			case 'pdf':
				return chartData.series.length === 1
		}
	}

	showPercentileColors(chartData, chartType: ChartType) {
		switch (chartType) {
			case 'box':
			case 'cone':
				return !chartData.multipleGroupings;
			case 'cdf':
				return chartData.series.length === 1;
			case 'ioBox':
				return true;
		}
	}

	render() {
		const {additionalToolbarItems, show, ...props} = this.props;
		const {chartType, chartComponent:{chart}, chartData} = props;
		const {bootstrapEnabled} = this.props.queryResult;
		const queryResult = props.queryResult instanceof QueryResult ? props.queryResult : null;

		const showTooltips         = _.includes(['scatter', 'line', 'beeswarm', 'efficientFrontier'], chartType);
		const showRegression       = _.includes(['scatter'], chartType);
		const showLineMarkerSize   = _.includes(['line', 'scatter'], chartType);
		const showAreaOpacity      = _.includes(['histogram', 'pdf', 'bar', 'beeswarm'], chartType) && chartData;
		const showSmoothing        = _.includes(['histogram', 'pdf'], chartType);
		const showLineMarker       = _.includes(['line', 'scatter'], chartType);
		const showStackedToggle    = _.includes(['bar', 'beeswarm'], chartType);
		const showPercentiles      = chartData && this.showPercentiles(chartData, chartType);
		const showPercentileColors = chartData && this.showPercentileColors(chartData, chartType);
		const showPaths            = queryResult && _.includes(['box', 'cone'], chartType) && chartData && !chartData.multipleGroupings &&
		                             (queryResult.pivotMetadata.rowAxes.length == 1 && queryResult.pivotMetadata.axes[queryResult.pivotMetadata.rowAxes[0]].groupType == "Scenario") &&
		                             (!bootstrapEnabled && chartData && !chartData.bootstrapped);
		const showStepPattern      = _.includes(['cdf'], chartType);
		const showDonutSize        = _.includes(['efficientFrontier'], chartType);
		const showDataset          = _.includes(['ioBox', 'assetAllocation'], chartType);
		const showAssetGroups      = _.includes(['efficientFrontier', 'assetAllocation'], chartType);
		const showAllocationComponent     = _.includes(['efficientFrontier'], chartType);
		// Statistics are only valid if there is one and only one series
		const showStatistics       = _.includes(['cdf', 'pdf', 'histogram', 'beeswarm'], chartType) && chartData && chartData.series.length === 1;
		const showMeanValues       = _.includes(['box', 'cone', 'ioBox', 'craBox'], chartType);
		const showHorizonPicker    = _.includes(['distributionsAtHorizon', 'throughTimeStatistics', "craBox", "financialDamage", "volatilityShock"], chartType);
		const showFillOpacityPicker= _.includes(['throughTimeStatistics'], chartType);
		const showLineOpacityPicker= _.includes(['throughTimeStatistics'], chartType);
		const showSeriesSwitch     = _.includes(['throughTimeStatistics'], chartType);
		const showDataLabelSwitch  = _.includes(['assetAllocation', 'ioBox'], chartType);
		const showAssetClassesReturnsToolBarItem  = _.includes(['assetClassesReturnsChart'], chartType);

		let showToggleBootstrap = false;
		let showToggleSensitivity = false;
		if (queryResult) {
			const view                = queryResult.pivotMetadata.availableViews.filter((view) => {
				return view.name === this.props.chartType;
			});
			showToggleBootstrap = view[0].bootstrappable;
			showToggleSensitivity = view[0].sensitivity;
		}

		return (
			<Toolbar className={css.highchartsToolbar}
				left={chart && <>
					{additionalToolbarItems}
					{queryResult && showToggleBootstrap && <ToggleBootstrapToolbarItem {...props} queryResult={queryResult}/>}
					{queryResult && showToggleBootstrap && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{queryResult && showToggleSensitivity && <ToggleSensitivityToolbarItem {...props} queryResult={queryResult}/>}
					{queryResult && showToggleSensitivity && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{/*TODO: Duplicated pattern, add wrapper component*/}
					{showAllocationComponent && <AllocationSelectionComponent key="allocationComponent" {...props} />}
					{showAllocationComponent && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showDataset && <DatasetToolbarItem key="showDataset" {...props} />}
					{showDataset && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showStackedToggle && <StackColumnToolbarItem key="stackColumns" {...props} />}
					{showStackedToggle && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showTooltips && <RemoveTooltipsToolbarItem key="removeTooltips" {...props} />}
					{showTooltips && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showLineMarker && (<LineMarkerToolbarItem key="lineMarker" {...props} />)}
					{showLineMarker && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showLineMarkerSize && <MarkerSizeToolbarItem key="markerSize" {...props} />}
					{showLineMarkerSize && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showLineMarkerSize && <LineSizeToolbarItem key="lineSize" {...props} />}
					{showLineMarkerSize && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showRegression && <RegressionLineToolbarItem key="regressionLine" {...props}  />}
					{showRegression && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showPercentiles && <PercentilesToolbarItem key="percentiles" {...props} />}
					{showPercentiles && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showMeanValues && <MeanValuesToolbarItem key="meanValues" {...props} />}
					{showMeanValues && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showAreaOpacity && <AreaOpacityToolbarItem key="areaOpacity" {...props} />}
					{showAreaOpacity && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showSmoothing && <SmoothingToolbarItem key="smoothing" {...props} />}
					{showSmoothing && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showPaths && <PathsToolbarItem key="paths" {...props} pivotMetadata={queryResult.pivotMetadata}/>}
					{showPaths && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showPercentileColors && <PercentileColorsToolbarItem key="percentileColors" {...props} />}
					{showPercentileColors && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showStepPattern && <StepPatternToolbarItem key="stepPattern" {...props} />}
					{showStepPattern && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showStatistics && <StatisticsToolbarItem key="statistics" {...props} />}
					{showStatistics && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showStatistics && <MomentsToolbarItem key="moments" {...props} />}
					{showStatistics && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showDonutSize && <DonutSizeToolbarItem key="donutSize" {...props} />}
					{showDonutSize && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showAssetGroups && <AssetGroupsToolbarItem key="assetGroups" {...props} />}
					{showAssetGroups && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showHorizonPicker && <ChartHorizonToolbarItem key="horizonPicker" {...props} />}
					{showHorizonPicker && <span className={bp.Classes.NAVBAR_DIVIDER}/> }

					{showFillOpacityPicker && <FillOpacityToolbarItem key="fillOpacityPicker" {...props} />}
					{showFillOpacityPicker && <span className={bp.Classes.NAVBAR_DIVIDER}/>}

					{showLineOpacityPicker && <LineOpacityToolbarItem key="lineOpacityPicker" {...props} />}
					{showLineOpacityPicker && <span className={bp.Classes.NAVBAR_DIVIDER}/>}

					{showSeriesSwitch && <SeriesSwitchToolbarItem key="seriesSwitch" {...props} />}
					{showSeriesSwitch && <span className={bp.Classes.NAVBAR_DIVIDER}/>}

					{showDataLabelSwitch && <DataLabelSwitchToolbarItem key="dataLabelSwitch" {...props} />}
					{showDataLabelSwitch && <span className={bp.Classes.NAVBAR_DIVIDER}/>}

					{showAssetClassesReturnsToolBarItem && <AssetClassesReturnsToolBarItem key="assetClassesReturnsToolBarItem" {...props} />}
					{showAssetClassesReturnsToolBarItem && <span className={bp.Classes.NAVBAR_DIVIDER}/>}

				</>}
				right={chart && <>
					<GridLinesToolbarItem key="gridLines" {...props} />
					<span className={bp.Classes.NAVBAR_DIVIDER}/>

					<FontSizeToolbarItem key="adjustFontSize" {...props} />
					<span className={bp.Classes.NAVBAR_DIVIDER}/>

					<div className={bp.Classes.BUTTON_GROUP}>
                        <HorizontalAxisDirectionToolbarItem key="horizontalAxisDirection" {...props} />

						<VerticalAxisDirectionToolbarItem key="verticalAxisDirection" {...props} />

						<InvertToolbarItem key="invert" {...props} />
					</div>

					<span className={bp.Classes.NAVBAR_DIVIDER}/>

					<FormatAxisPaneToolbarItem key="formatAxis" {...props} />

					<PanOrZoomToolbarItem key="panOrZoom" {...props} />
					<span className={bp.Classes.NAVBAR_DIVIDER}/>

					<ZoomButtonsToolbarItem key="zoomButtons" {...props} />
					<span className={bp.Classes.NAVBAR_DIVIDER}/>
					<ResetZoomButtonToolbarItem key="resetZoom" {...props} />
					<span className={bp.Classes.NAVBAR_DIVIDER}/>
					<ChartMenuToolbarItem {...props} />

					<span className={bp.Classes.NAVBAR_DIVIDER}/>
				</>}
			/>
		);
	}
}
