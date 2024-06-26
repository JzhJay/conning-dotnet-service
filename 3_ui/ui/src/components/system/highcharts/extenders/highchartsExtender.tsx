/*
 * This class extends the behaviour and functionality of Highcharts
 */
import {Axis} from 'highcharts';
import {IO, IOView} from '../../../../stores/io';
import * as utility from '../../../../utility';
import {HighchartsComponent} from "../highchartsComponent";
import {AxisAlignmentType, GridlinesType, ChartTargetType as TargetType, Statistics, ChartAxisDisplayUnit} from 'stores/queryResult';
import {QueryResult} from 'stores/queryResult';
import {action, computed, observable, reaction, makeObservable} from 'mobx';

const uuid:any = require('uuid');
const plotPadding = 20;

export class HighchartsExtender {
    constructor(protected chartComponent: HighchartsComponent, protected highchartsOptions, private shouldGroupLegendItems: boolean = false) {
        makeObservable(this);
        this.addChartCallbacks(highchartsOptions);

        Highcharts.setOptions({
            lang: {
               thousandsSep: ','
            }
        });

        // Define a custom symbol path
        Highcharts.SVGRenderer.prototype.symbols.cross = (x, y, w, h) => {
            // Ratio of the cross marker width to column width
            const widthRatio = 0.25;
            let width = 0;
            const series = this.chart && this.chart.series;
            if (!series || this.isLegend) {
                return ['M', x, y, 'L', x + w, y + h, 'M', x + w, y, 'L', x, y + h, 'z'];
            }
            const type = this.chartComponent.props.chartType;
            if (type == 'box') {
                const s = (((this.chart.series).find(s => s.name !== 'mean') as any));
                width = s && s.columnMetrics && s.columnMetrics.width || 0;
            } else if (type == 'cone') {
                const data = series[0].data;
                if (data[0] && data[1]) {
                    width = ((data[1].plotX || 0) - (data[0].plotX || 0)) * 0.75
                }
            }
            const w1 = widthRatio * Math.min(100, width) || w,
                h1 = w1,
                x1 = x + (w / 2) - w1 / 2,
                y1 = y + (h / 2) - h1 / 2;
            return ['M', x1, y1, 'L', x1 + w1, y1 + h1, 'M', x1 + w1, y1, 'L', x1, y1 + h1, 'z'];
        }


        if (this.chartComponent.props.chartingResult instanceof IO) {
		    let {chartingResult, chartType, page, id} = this.chartComponent.props;
		    let io: IO = this.chartComponent.props.chartingResult;

		    this._toDispose.push(reaction(() => Array.from(page.plotExtremes.values()).map(p => [p.marginLeft, p.marginRight]), () => {
		    	const {plotExtremes} = page;
		    	if (page == io.currentPage && plotExtremes.length == page.selectedViews.length && this.chart.series &&
			        page.getView(id) != null) {
		    		const marginRight = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginRight));
		    		const marginLeft = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginLeft));
		    		const legendPadding = plotPadding;
		    		const legendX =  -(marginRight - legendPadding - this.chart.legend.legendWidth);
		    		const currentOptions = this.chart.options as HighchartsOptions;

		    		if ((marginRight != currentOptions.chart.marginRight || marginLeft != currentOptions.chart.marginLeft || legendX != currentOptions.legend.x) && chartType != "efficientFrontier")
			            this.chart.update({chart: {marginLeft: marginLeft, marginRight: marginRight},
						                           legend: {x: -(marginRight - legendPadding - this.chart.legend.legendWidth)} });
			    }
		    }))
	    }
    }

    get queryResult() : QueryResult {
        // Todo
	    return null;
    }

	_toDispose = [];
    static wrappedMethods = [];
    additionalSelectableTargets = [];
    chart:HighchartsChartObject;
    @observable _isFullyLoaded:boolean = false;
    @observable fullfilledLoadedRequirements = true;

	@computed get isFullyLoaded() {
		return this._isFullyLoaded;
	}

	set isFullyLoaded(value) {

		if (this.fullfilledLoadedRequirements) {
			this._isFullyLoaded = value;

			if (value) {
				console.log(`Chart [${this.chartComponent.props.chartType}] fully loaded!`);
				// console.timeEnd("time" + this.chartComponent.props.chartType);

				// Delay the loaded callback to give the chart toolbar which requires the presence of the chart a chance to load
				if (this.chartComponent.props.onLoaded) {
					window.setTimeout(this.chartComponent.props.onLoaded, 1);
				}
			}

			// check display area size to avoid the size change during chart creation.
			window.setTimeout(() => this.chartComponent.onResize(), 0);

			// Give the loader a chance to be dismissed before reporting extremes.
			window.setTimeout(() => this.reportPlotExtremes(), 0);
		}
	}

	//lastYAxisWidth = null;
	@action reportPlotExtremes(clear:boolean = false) {
		if (this.chartComponent.props.chartingResult instanceof IO) {
			let {chartingResult, chartType, id} = this.chartComponent.props;
			let view = this.chartComponent.props.page.getView(id) as IOView;

			if (clear) {
				view.plotExtremes = null;
			}
			else {
				let {chart} = this;

				let plotLeft = chartType != "efficientFrontier" && chart.yAxis && chart.yAxis[0].axisGroup ? chart.yAxis[0].axisGroup.getBBox().width + plotPadding : 0;
				let plotRight = chartType != "efficientFrontier" && chart.legend ? chart.legend.legendWidth + plotPadding : 0;

				view.plotExtremes = {marginLeft: plotLeft, marginRight: plotRight};
			}
		}
	}

    /**
     *  Resets Highchart to the state it was initially in before being extended by this class.
     */
    cleanup()
    {
        this.unwrapMethods();
	    this._toDispose.forEach(f => f());
    }

    /**
     * Adds callback methods to the chart. These callbacks will be fired by HighCharts and allows us to extend the built it functionality.
     * @param {type} chartInit    The object that will be passed to highchart to create chart
     * @returns {undefined}
     */
    addChartCallbacks(chartInit) {
        let _thisClass = this;

       if (!chartInit.customTooltips) {
            chartInit.customTooltips = {
                iterator: 0
            };
        }

        chartInit.chart.events = {};

        // Add should work in theory but it doesn't e.g. Highcharts.addEvent(chartInit.chart, "redraw", function(events) {redraw(events)});
        // so override the required callbacks.
        chartInit.chart.events.redraw = function (events) {
            _thisClass.redraw(this, events);
        };

        chartInit.chart.events.load = function () {
            _thisClass.load(this);
        };

        chartInit.chart.events.click = function (event) {
            _thisClass.chartClick(event);
        }

	    chartInit.chart.events.beforePrint = function () {
		    _thisClass.beforePrint();
	    }

	    chartInit.chart.events.afterPrint = function () {
		    _thisClass.afterPrint();
	    }

	    chartInit.chart.events.selection = function () {
		    _thisClass.selection();
	    }

        if (chartInit.tooltip) {
            chartInit.tooltip.formatter = function () {
                return _thisClass.toolTipFormatter(this);
            };
        }

        _.concat(chartInit.xAxis, chartInit.yAxis).forEach((axisObj:any) => {
            if (axisObj) {
	            if (!axisObj.categories) {
		            if (!axisObj.labels)
			            axisObj.labels = {};
		            axisObj.labels.formatter = function (events) {
			            return _thisClass.axisFormatter(this);
		            };
	            }

	            // Set axis to not start nor end on tick to allow for smooth panning.
	            axisObj.startOnTick = false;
	            axisObj.endOnTick   = false;

	            if (!axisObj.events)
		            axisObj.events = {};

	            axisObj.events.afterSetExtremes = function (event) {
		            _thisClass.afterSetExtremes(this, event);
	            };
            }
        });

        if (chartInit.plotOptions && chartInit.plotOptions.series) {
            if (!chartInit.plotOptions.series.point)
                chartInit.plotOptions.series.point = {};

            if (!chartInit.plotOptions.series.point.events)
                chartInit.plotOptions.series.point.events = {};

            chartInit.plotOptions.series.point.events.click = function (events) {
                _thisClass.pointClick(this);
            };

            chartInit.plotOptions.series.point.events.mouseOver = function (events) {
	            _thisClass.pointMouseOver(this);
            };

            chartInit.plotOptions.series.events = {};
            chartInit.plotOptions.series.events.click = function (events) {
                _thisClass.seriesClick(this);
            };

            chartInit.plotOptions.series.events.mouseOver = function (events) {
                _thisClass.seriesMouseOver(this);
            };

            chartInit.plotOptions.series.events.mouseOut = function (events) {
                _thisClass.seriesMouseOut(this);
            };

            chartInit.plotOptions.series.point.events.mouseOut = function (events) {
                _thisClass.pointMouseOut(this);
            };

            /*
	        chartInit.plotOptions.series.dataLabels.formatter = function () {
		        _thisClass.dataLabelsFormatter(this);
	        };*/
        }

        // Add a unique ID that can be used to associate the chart options stored within Highcharts Chart object to the one stored within this class.
	    chartInit.connChartID = uuid.v4();

        _thisClass.wrapHighchart();
    }

    highchartsUserOptions;
    updateHighchartsUserOptions(userOptions)
    {
        if (this.highchartsUserOptions == null)
            this.highchartsUserOptions = this.chartComponent.userOptions.highchartsOptions;

        this.highchartsUserOptions = _.assign({}, this.highchartsUserOptions, userOptions);
        this.chartComponent.onUpdateUserOptions({highchartsOptions:this.highchartsUserOptions});
    }

    /**
     * chart click callback. Fired when the chart is clicked.
     * @param {type} event  common event information
     * @returns {undefined}
     */
    chartClick(event){

    }

    /**
     * Point click callback. Fired when a point is clicked.
     * @param {type} event  common event information
     * @returns {undefined}
     */
     pointClick(point) {
    }

    /**
     * Point mouse over callback. Fired when the mouse enters the areas close to the point.
     * @param point The target point
     * @returns {undefined}
     */
    pointMouseOver(point) {
    }

	resize(){

	}

	canUseSavedZoom() {
    	return true;
	}

    /**
     * Adds the required callbacks to the category axis labels.
     * @param chart The chart to be updated
     */
    addAxisLabelCallbacks(chart)
    {
        let _thisClass = this;

        Highcharts.each(chart.axes, function (axis) {
            if (axis.labelGroup && axis.labelGroup.element.children) {
                Highcharts.each(axis.labelGroup.element.children, function (label) {
                    label.chart = chart;
                    label.onmouseover = function (e) {
                        _thisClass.axisLabelOnMouseOver(axis, this, e);
                    }
                    label.onmouseout = function (e) {
                        _thisClass.axisLabelOnMouseOut(axis, this, e);
                    }
                });
            }
        });
    }

	/**
	 * Gets a new font size based on the current font size and the user operation.
	 * @param entireChartSelection  Indicates that the entire chart is being updated
	 * @param isChartTitle          Signals that the selected element is the chart title
	 * @param fontSizes             Array of font sizes to pick from
	 * @param currentFontSize       Target elements current font size
	 * @param targetFontSize        Font size that has been requested
	 * @param increase              True to increase the font size, false to reduce it
	 * @returns {number}            The new font size to apply to element
	 */
	getNewFontSize(entireChartSelection: boolean, isChartTitle: boolean, fontSizes: Array<number>, currentFontSize: number, targetFontSize: number, increase: boolean) {
		// Scale the current font size
		let factor = entireChartSelection && isChartTitle ? 1.5 : 1;

		if (increase != null && !entireChartSelection) {
			if (isNaN(currentFontSize))
				currentFontSize = 12;

			targetFontSize = this.getAdjacentFontSize(fontSizes, increase, currentFontSize);
		}

		return targetFontSize * factor;
	}

    /**
     * Gets a new font size based on the current font size. We attempt to locate the current font size in the provided
     * array, then either return the next or previous font size.
     * @param fontSizes     Array of font sizes to pick from
     * @param increase      True to increase the font size, false to reduce it
     * @param currentValue  The current font size
     * @returns {number}    A font size found in the input array
     */
    getAdjacentFontSize(fontSizes, increase, currentValue)
    {
	    let fontSize = 0;

	    if (increase != null) {
            for (let i = 0; i < fontSizes.length; i++) {
                if (increase && fontSizes[i] > currentValue) {
                    fontSize = fontSizes[i];
                    break;
                }
                else if (!increase && fontSizes[i] >= currentValue && i > 0) {
                    fontSize = fontSizes[i - 1];
                    break;
                }
            }

            if (fontSize === 0)
                fontSize = currentValue;
        }

        return fontSize;
    }

    /**
     * The current chart font size
     * @param chart The chart in question
     * @returns (number) The current chart font size or the default value.
     */
    getChartFontSize(chart)
    {
        let currentFontSize = chart.options.chart.style ? parseFloat(chart.options.chart.style.fontSize) : NaN;

        if (isNaN(currentFontSize))
            currentFontSize = 12;

        return currentFontSize;
    }

    /**
     * Updates the control to reflect the selection font size.
     * @param fontSize  The new font size
     */
    setSelectionFontSize(fontSize:number)
    {
    	this.chartComponent.selectionFontSize = fontSize;
    }

    /**
     * Updates the font sizes of the currently selected items. If there is no selection
     * All text parts will be updated.
     * @param chart     The chart to update.
     * @param fontSizes Array of possible chart font sizes to use when increasing/decreasing the font size.
     * @param increase  True to increase all sizes in relation to their current sizes. False to decrease and null to use a specific font size
     * @param fontSize  The font size to use for the update. Null if performing a relative update.
     */
    setFontSize(chart, fontSizes, increase, fontSize)
    {
    	//TODO: function is way too long, needs refactoring.

        let selections = chart.selections;
        let style;
        let _thisClass = this;
        let entireChartSelection = selections.length === 0;
        let currentValue = 0;

        // Create dummy selections for all chart parts with text
        if (selections.length === 0) {
            selections = [];
            currentValue = _thisClass.getChartFontSize(chart);


            if (chart.title)
                selections.push({target: {label: chart.title, targetType: TargetType.ChartTitle}});

            if (chart.subtitle)
                selections.push({target: {label: chart.subtitle, targetType: TargetType.ChartSubtitle}});

            if (chart.legend.options.enabled)
                selections.push({target: {label: chart.legend.group, targetType: TargetType.ChartLegend}});

            $.each(chart.xAxis.concat(chart.yAxis), function (index, axis: any) {
                selections.push({
                    target: {
                        label: axis.axisTitle, targetType: TargetType.AxisTitle, parentAxis: axis
                    }
                });

                selections.push({
                    target: {
                        label: axis.labelGroup, targetType: TargetType.AxisLabels, parentAxis: axis
                    }
                });
            });

            if (this.additionalSelectableTargets.length > 0)
                selections = selections.concat(this.additionalSelectableTargets);
        }

        if (entireChartSelection) {
            if (increase != null) {
                fontSize = _thisClass.getAdjacentFontSize(fontSizes, increase, currentValue);
            }

            if (chart.options.chart.style == null)
                chart.options.chart.style = {};

            chart.options.chart.style.fontSize = fontSize + "px";

            this.setSelectionFontSize(fontSize);

            // The chart options object is pretty big and includes the chart element, so let's just
            // store what we need
            this.updateHighchartsUserOptions({chart:{style:chart.options.chart.style}});
        }

		// Update data labels which do not yet support selection
	    let newDataLabelFontSize = _thisClass.getNewFontSize(entireChartSelection, false, fontSizes, parseFloat(chart.options.plotOptions.series?.dataLabels?.style?.fontSize), fontSize, increase);
	    const updateObj = _.set({}, "plotOptions.series.dataLabels.style.fontSize", `${newDataLabelFontSize}px`);
	    chart.update(updateObj, false);
	    this.updateHighchartsUserOptions(updateObj);

        // Update the font sizes of all selected parts
        Highcharts.each(selections, (selection) => {
            style = this.getTargetStyle(chart, selection.target);

			let newFontSize = _thisClass.getNewFontSize(entireChartSelection, selection.target.targetType === TargetType.ChartTitle, fontSizes, parseFloat(style.fontSize), fontSize, increase);
 			style.fontSize = `${newFontSize}px`;

            if (!entireChartSelection)
                this.setSelectionFontSize(parseFloat(style.fontSize));

            if (selection.target.targetType === TargetType.ChartLegend)
            {
                // Highcharts doesn't allow for dynamic legend updating, so lets
                // do that here.

                // Destroy the legend
                /*Highcharts.each(chart.legend.allItems, (legendItem) => {
                    legendItem.legendItem = "";
                });
                chart.legend.title = "";
                chart.legend.group.destroy();
                chart.legend.group = null;


                //Re-render with correct sizes
                chart.options.legend.title.style.fontSize = style.fontSize;
                chart.legend.itemHiddenStyle["fontSize"] = style.fontSize;
                chart.legend.render();*/

                chart.legend.baseline = null; // Reset the baseline(text measurements) so highcharts can recompute at the new height. Without this reset, legend labels will overlap in box. TODO: report to highcharts so they can blow away baseline on height changed.
	            chart.legend.update({title:{style:{fontSize:style.fontSize}}, itemHiddenStyle:{fontSize:style.fontSize}, symbolWidth: fontSize}, false)
                this.updateHighchartsUserOptions({legend:chart.options.legend});
            }
            else {

                // Set the new font size
                switch (selection.target.targetType) {
                    case TargetType.ChartTitle:
                        chart.setTitle(chart.options.title, null, false);
                        this.updateHighchartsUserOptions({title: _.omit(chart.options.title, "text")});
                        break;
                    case TargetType.ChartSubtitle:
                        chart.setTitle(null, chart.options.subtitle, false);
                        this.updateHighchartsUserOptions({subtitle: _.omit(chart.options.subtitle, "text")});
                        break;
                    case TargetType.AxisTitle:
                        selection.target.parentAxis.setTitle({style: {fontSize: style.fontSize}}, false);
                        this.updateHighchartsUserOptions(this.getAxesUserOptions(selection.target.parentAxis.coll));
                        break;
                    case TargetType.AxisLabels:
                        selection.target.parentAxis.update({labels:{style:{fontSize: style.fontSize}}}, false);
                        this.updateHighchartsUserOptions(this.getAxesUserOptions(selection.target.parentAxis.coll));
                        break;
                    case TargetType.StatisticsBox:
                        let tag = selection.target.label.div.lastChild;
                        $(selection.target.label.div).attr({width:tag.clientWidth + 5, height:tag.clientHeight + 5});
                        //TODO: update to this.moments when moments functionality is moved out of density charts
                        this["moments"].fontSize = parseFloat(style.fontSize);
                        this.chartComponent.onUpdateUserOptions({moments:this["moments"]});
                        break;
                }
            }
        });

        chart.redraw();

        // After redrawing the chart, update the selection targets which might have changed and re-draw the selection
        Highcharts.each(selections, (selection) => {

            switch (selection.target.targetType) {
                case TargetType.ChartTitle:
                    selection.target.label = chart.title;
                    break;
                case TargetType.ChartSubtitle:
                    selection.target.label = chart.subtitle;
                    break;
                case TargetType.AxisTitle:
                    selection.target.label = selection.target.parentAxis.axisTitle;
                    break;
                case TargetType.AxisLabels:
                    selection.target.label = selection.target.parentAxis.labelGroup;
                    break;
                case TargetType.ChartLegend:
                    return;
            }

            if (selection.border) {
                selection.border.destroy();
                _thisClass.drawTargetSelection(chart, selection);
            }
        });

        // Re-add the callbacks since the old parts that already had the callbacks might have been re-created.
        this.addChartTitleSelectingCallbacks(chart);

	    this.reportPlotExtremes();
    }

    getAxesUserOptions(axisName:string)
    {
        let axes = this.chart[axisName].map((axis) => {
        	let reducedOptions = _.cloneDeep(axis.userOptions);
            delete reducedOptions.categories;
            delete reducedOptions.title.text;
            return reducedOptions;
        });
        return {[axisName]:axes};
    }

    /**
     * Get the style object of the specified target
     * @param chart     The chart in question
     * @param target    The target in question
     * @returns {any}
     */
    getTargetStyle(chart, target)
    {
        switch (target.targetType) {
            case TargetType.ChartTitle:
                return chart.options.title.style;
            case TargetType.ChartSubtitle:
                return chart.options.subtitle.style;
            case TargetType.AxisTitle:
                return target.parentAxis.options.title.style;
            case TargetType.ChartLegend:
                return chart.options.legend.itemStyle;
            case TargetType.AxisLabels:
                return target.parentAxis.options.labels.style;
            case TargetType.StatisticsBox:
                return target.label.div.lastChild.lastChild.style;
        }
    }

    /**
     * Adds the required callback to the chart parts to allow selecting.
     * @param chart The chart to be updated
     */
    addChartTitleSelectingCallbacks(chart)
    {
        // Build a list of the labels that need an on click callback.
        let labels = [];

        // TODO: create a label target class and create targets using a constructor
        // Also create a selections class
        if (chart.title)
            labels.push({label: chart.title, targetType: TargetType.ChartTitle});

        if (chart.subtitle)
            labels.push({label: chart.subtitle, targetType: TargetType.ChartSubtitle});

        Highcharts.each(chart.xAxis.concat(chart.yAxis), (axis) => {
            if (axis.axisTitle) {
                labels.push({
                    label: axis.axisTitle, targetType: TargetType.AxisTitle, parentAxis: axis
                });
            }

            if (axis.labelGroup) {
                labels.push({
                    label: axis.labelGroup, targetType: TargetType.AxisLabels, parentAxis: axis
                });
            }
        });

        // Add the selection callback
        Highcharts.each(labels, (labelTarget) => {
            this.addLabelSelectionCallback(chart, labelTarget);
        });

        // Also re-add the axis label callbacks which might have been erased.
        this.addAxisLabelCallbacks(chart);
    }

    /**
     * Gets the bounding box of an element by caclulating the bounding boxes of its children
     * @param node  The node/element to retreive a bounding box for.
     * @returns the calculated bounding box
     */
    getMaxBBoxOfChildren(node)
    {
        let box = {x:999999, y: 999999, x2:-1, y2:-1};

        Highcharts.each(node.children, (child) => {
            let currentBox = child.getBBox();

            if (currentBox.width === 0 || currentBox.height === 0)
                return;

            if (currentBox.x < box.x)
                box.x = currentBox.x;

            if (currentBox.y < box.y)
                box.y = currentBox.y;

            if (currentBox.x + currentBox.width> box.x2)
                box.x2 = currentBox.x + currentBox.width;

            if (currentBox.y + currentBox.height > box.y2)
                box.y2 = currentBox.y + currentBox.height;
        });

        return {x:box.x, y:box.y, width:box.x2-box.x, height:box.y2-box.y};
    }

    /**
     * Draws the selection border for a chart part and records the selection font size.
     * @param chart The chart being updated.
     * @param selection The selection object that needs to be drawn
     */
    drawTargetSelection(chart, selection) {
        let labelTarget = selection.target;
        let box = labelTarget.label.element.getBBox();

        if (labelTarget.targetType === TargetType.AxisTitle && labelTarget.label.rotation) {

            // use the Highcharts getBBox() to set the label width/height because the SVG one doesn't account
            // for the rotation
            let parentElementBox = labelTarget.label.getBBox();

            // For some reason, the yAxis label is wrapped in another element which has the correct bounding box
            // retrieve it here.
            //if (labelTarget.parentAxis.coll === "yAxis")
            //    box = labelTarget.label.parentGroup.getBBox();

            // The x/y attribute seems to be the center of the shape and is fairly accurate, adjust to top left
            box.x = labelTarget.label.element.getAttribute("x") - parentElementBox.width/2;
            box.y = labelTarget.label.element.getAttribute("y") - parentElementBox.height/2;

            box.width = parentElementBox.width;
            box.height = parentElementBox.height;

            box.y -= 5;
            box.x -= 5;

            box.width += 10;
            box.height += 10;
        }
        else if (labelTarget.targetType === TargetType.AxisLabels && labelTarget.parentAxis.opposite)
        {
            box = this.getMaxBBoxOfChildren(labelTarget.label.element);

            box.y -= 5;
            box.x -= 5;

            box.width += 10;
            box.height += 10;
        }
        else if (labelTarget.targetType === TargetType.ChartLegend) {
            box.x = labelTarget.label.translateX + 5;
            box.y = labelTarget.label.translateY;

            box.y -= 5;
            box.height += 10;
        }
        else if (labelTarget.targetType === TargetType.StatisticsBox)
        {
            box.x = labelTarget.label.translateX;
            box.y = labelTarget.label.translateY;
            let bounds = labelTarget.label.div.getBoundingClientRect();
            box.height = bounds.height;
            box.width = bounds.width;
        }
        else {
            box.x -= 5;
            box.width += 10;
        }

        selection.border = chart.renderer.rect(box.x, box.y, box.width, box.height, 0)
            .attr({
                'stroke-width': 1,
                stroke: 'black',
                fill: 'rgba(0,0,0,0)',
                zIndex: 3
            })
            .add();
    }

    /**
     * Adds the selection callback for the indicated label
     * @param chart The chart being updated
     * @param labelTarget   The label requiring the callback.
     */
    addLabelSelectionCallback(chart, labelTarget)
    {
        let label = labelTarget.label.element;

        label.chart = chart;

        label.onclick = (e) => {
            let selection = {target:labelTarget};
            this.drawTargetSelection(chart, selection);
            chart.selections.push(selection);

            if (chart.tooltip)
                chart.tooltip.hide();

            // Update the UI with the selection size.
            let style = this.getTargetStyle(chart, labelTarget);
            if (style.fontSize)
                this.setSelectionFontSize(parseFloat(style.fontSize));
            else
                this.setSelectionFontSize(12);
        }
    }

    /**
     * Refreshes a tooltip that has custom content. Most of this code is taken from Highcharts' refresh method.
     * @param tooltip       tooltip to be refreshed
     * @param textConfig    tooltip text configuration to be passed to tooltip formatter
     * @param mouseEvent    The mouse event triggering the toolip.
     */
    refresh (tooltip, textConfig, mouseEvent) {
        let chart = tooltip.chart,
            label = tooltip.label,
            options = tooltip.options,
            x,
            y,
            text,
            formatter = options.formatter || tooltip.defaultFormatter,
            borderColor;

        clearTimeout(tooltip.hideTimer);

        if (!label)
            label = tooltip.getLabel();

        text = formatter.call(textConfig, tooltip);

        tooltip.distance = 16;

        // update the inner HTML
        if (text === false) {
            tooltip.hide();
        } else {

            // show it
            Highcharts.stop(label);
            label.attr('opacity', 1).show();

            // update text
            label.attr({
                text: text
            });

            // set the stroke color of the box
            borderColor = options.borderColor || '#606060';
            label.attr({
                stroke: borderColor
            });

            // Ensure that the label doesn't run off the plot area.
            let labelBBox = label.getBBox();
            let chartX = Math.min(mouseEvent.chartX, ((chart.plotLeft + chart.plotWidth) - labelBBox.width));
            let chartY = Math.min(mouseEvent.chartY, ((chart.plotTop + chart.plotHeight) - labelBBox.height));

            /*
            tooltip.updatePosition({
                plotX: plotX,
                plotY: chart.inverted ? mouseEvent.chartY - chart.plotTop : mouseEvent.chartY,
            });*/

            tooltip.label.attr({x:chartX, y:chartY});


            tooltip.isHidden = false;

            Highcharts.fireEvent(chart, 'tooltipRefresh', {
                text: text,
                x: x + chart.plotLeft,
                y: y + chart.plotTop,
                borderColor: borderColor
            });
        }
    }

    /**
     * Activates or disables gridlines to reflect the specified state.
     * @param chart         The chart being updated
     * @param gridlineType  The new gridlineType(GridlinesType.*).
     */
    setGridlines(chart, gridlineType)
    {
        chart.xAxis.concat(chart.yAxis).forEach(function (axis, i) {
            let enable = (gridlineType === GridlinesType.Both) || (axis.isXAxis && gridlineType === GridlinesType.Vertical) ||
                         (!axis.isXAxis && gridlineType === GridlinesType.Horizontal)
            let axisWidth = enable ? 0 : 1; // only enable if the gridline is off

            if (axis === chart.xAxis[0] || axis === chart.yAxis[0])
                axis.update({gridLineWidth:enable ? 1: 0}, false);

            axis.update({tickWidth:axisWidth, lineWidth:axisWidth}, false);
        });

        this.updateHighchartsUserOptions(Object.assign({}, this.getAxesUserOptions("xAxis"), this.getAxesUserOptions("yAxis")));

        chart.redraw();
    }

    /**
     * Load Callback. Fires when the chart is finished loading.
     * @returns {undefined}
     */
    load(chart) {
	    const chartBackup = this.chart;
        if (!this.chart || chart.options.chart.forExport)
            this.chart = chart;

        if (chart.options.chart.forExport){
	        this.updateChartAxisDisplay(chart.yAxis[0]);
        }

        chart.selections = [];
        this.addAxisLabelCallbacks(chart);

        this.addChartTitleSelectingCallbacks(chart);

        chart.exportSVGElements = [];
        chart.exportDivElements = [];

        // set offsets for tooltip labels:
        Highcharts.addEvent(chart, "tooltipRefresh", (e) => {
        	let c = e.target, //chart
                label = c.tooltip.label,
                box = label.element.children[0].getBBox(),
                textNode = label.element.getElementsByTagName("text")[0],
                tspanNodes = textNode.getElementsByTagName("tspan"),
                padding = 10,
                cBox; // child bbox

	        // Don't allow y to go off the chart
	        if (label.attr('y') < 0)
	            label.attr({y:0});

            // center & apply text decoration:
            $.each(tspanNodes, (index, child) => {

                if (child.style.fontWeight === 'bold')
                    child.style["font-weight"] = "bold";

                if (child.style.textAnchor === "middle") {
                    child.setAttribute("x", box.width / 2);
                }
                else if (child.style.textAnchor === "end")
                {
                   child.setAttribute("x", box.width - padding);
                }

            });
        });

	    ["xAxis", "yAxis"].forEach((value) => {
            const axis = chart[value][0],
                extremes = axis.getExtremes();
            const currentArrangementKey = this.chartComponent.getArrangementKey();

			// Clear display unit if the saved axis title doesn't match the current title. E.g. when switching between market price and implied volatility in the recalibration tool
			const displayUnit = this.getDisplayUnits(axis);
			if (displayUnit && displayUnit.title != axis.userOptions.title.text) {
				_.set(this.chartComponent.userOptions, [axis.coll, "displayUnits"], null);
			}

            //TODO: Store min/max as member variables, instead of adding to highcharts userOptions
            axis.userOptions.connInitialMin = extremes.min;
            axis.userOptions.connInitialMax = extremes.max;

            const options = this.chartComponent.userOptions;
            const axisOption = options[value];

            // Only re-apply saved axis limits if the arrangement and dataMin/Max are still the same.
            if (axisOption &&
	            this.canUseSavedZoom() &&
	            currentArrangementKey === axisOption.arrangementKey &&
	            this.axisToFixed(extremes.dataMin) === axisOption.dataMin && this.axisToFixed(extremes.dataMax) === axisOption.dataMax) {
                axis.setExtremes(_.max([options[value].min, extremes.min]), _.min([options[value].max, extremes.max]), false);
            }
            else {
                // Set the user extremes to prevent resizing from added series.
                axis.setExtremes(axis.userOptions.connInitialMin, axis.userOptions.connInitialMax, false);
            }
        });

        chart.options.exporting.sourceWidth = chart.chartWidth;
        chart.options.exporting.sourceHeight = this.chartComponent.props.chartingResult instanceof IO ? $("body").height() : chart.chartHeight;

        chart.redraw();

		// When a chart loads, Chart.prototype.firstRender will populate the boosted series(Boost.series) without actually rendering then fire load and render events.
	    // Boost is designed to tie into the render event and perform the actual first rendering.
	    // If the load event triggers a redraw() then that redraw will flush the boosted series after it completes and when Boost receives the render event it will render an empty series and blow away the series rendering.
	    // Triggering a render here will get Highcharts back to a good state (with a populated Boost.series) so the render event is handled as expected
	    if (chart.options.plotOptions?.series?.boostThreshold > 0)
	        chart.renderSeries();


	    if (chart.options.chart.forExport)
		    this.chart = chartBackup;

	    this.isFullyLoaded = true;
    }

    beforePrint() {
	    this.chart.setSize(1000, 1000, false);
    }

    afterPrint() {
	    this.chart.setSize(null, null, false);
    }

	selection() {

	}

    updateAxisDirection(reverse, isHoriz:boolean)
    {
        let chart = this.chartComponent.chart;

        chart.xAxis.concat(chart.yAxis).forEach((axis)=> {
            if (!!axis.horiz === isHoriz)
                axis.update({reversed:reverse})})
    }

    /**
     * Axis label on mouse over callback. Fired when the mouse enters the areas close to the axis label.
     * @params axis         The target axis
     * @params axisLabel    The target label
     * @params e            The associated event
     * @returns {undefined}
     */
    axisLabelOnMouseOver(axis, axisLabel, e){
    }

    /**
     * Axis label on mouse out callback. Fired when the mouse leaves the areas close to the axis label.
     * @params axis         The target axis
     * @params axisLabel    The target label
     * @params e            The associated event
     * @returns {undefined}
     */
    axisLabelOnMouseOut(axis, axisLabel,e){
    }

    /**
     * Point mouse out callback. Fired when the mouse leaves the areas close to the point.
     * @param point   The target point
     * @returns {undefined}
     */
    pointMouseOut(point) {
    }

    /**
     * Series click callback. Fired when the series is clicked.
     * @param series   The target series
     * @returns {undefined}
     */
    seriesClick(series) {
    }

    /**
     * Series mouse over callback. Fired when the mouse enters the areas close to the series.
     * @param series   The target series
     * @returns {undefined}
     */
    seriesMouseOver(series) {
    }

    /**
     * Series mouse out callback. Fired when the mouse leaves the areas close to the series.
     * @param series   The target series
     * @returns {undefined}
     */
    seriesMouseOut(series) {
    }

	/**
	 * Series mouse out callback. Fired when the mouse leaves the areas close to the series.
	 * @param series   The target series
	 * @returns {undefined}
	 */
	dataLabelsFormatter() {

	}

    /**
     * Provides the expected/extended functionality for the runPointActions Highchart's method.
     * @param originalFunction  The original Highchart's runPointActions method
     * @param pointer           The pointer object
     * @param e                 The associated event
     * @returns {undefined}
     */
    runPointActions(originalFunction, pointer, e, point) {
        originalFunction.call(pointer, e, point);
    }

    /**
     * Provides the expected functionality when the mouse leaves a container
     * @param originalFunction  The original Highchart's onContainerMouseMove method
     * @param pointer           The pointer object
     * @param e                 The associated event
     * @returns {undefined}
     */
    onContainerMouseMove(originalFunction, pointer, e) {
        originalFunction.call(pointer, e);
    }

    /**
     * Special handler for mouse move that will hide the tooltip when the mouse leaves the plotarea.
     * @param originalFunction  The original Highchart's onContainerMouseMove method
     * @param pointer           The pointer object
     * @param e                 The associated event
     * @returns {undefined}
     */
    onDocumentMouseMove(originalFunction, pointer, e) {

        // This seems to cause more issues than it fixes so i'm disabling it : RAJ 10/31/2016
        // Its meant to hide tooltips when the pointer is outside of the plot area, however it only
        // gets added to the DOM when using highchart's internal runPointAction and it SOMETIMES incorrectly hides
        // tooltip shown when hovering over an axis labe.

        //originalFunction.call(pointer, e);
    }

    /**
     * Hide the tooltip.
     * @param originalFunction  The original Highchart's onContainerMouseMove method
     * @param tooltip           The tooltip object
     * @param delay
     * @returns {undefined}
     */
    hideTooltip(originalFunction, tooltip, delay) {
        originalFunction.call(tooltip, delay);
    }

    /**
     * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
     * @param point The point(s) to be included in the tooltip
     * @returns the formatted tooltip string
     */
    toolTipFormatter(point) {
    }

    setState(point, series, state, forced) {}

    removeTooltips() {};

	/**
	 * Draws a legend symbol
	 */
	drawLegendSymbol(originalFunction, series, legend, item) {
		originalFunction.apply(series, [].slice.call(arguments, 2));
	}

    /**
     * Redraw callback. Called everytime the chart is redrawn. e.g. because of a resizing or zooming.
     * @param {type} e  redraw event
     * @returns {undefined}
     */
    redraw(chart, e) {
        let _thisClass = this;

        // Redraw selections on redraw since their positions might have changed.
	    chart.selections && Highcharts.each(chart.selections, function(selection) {
            if (selection.target && selection.target.label.element) {
                selection.border.destroy();
                _thisClass.drawTargetSelection(chart, selection);
            }
        })
    }

    isLegend = null;
	renderItem(originalFunction, legend, item) {
		if (item.name == "mean") {
			this.isLegend = true;
			if (this.chart == null) {
				this.chart = legend.chart;
			}
		}
		try {
			originalFunction.call(legend, item);
		} finally {
			this.isLegend = null;
		}
	}

    /**
     * Determines the number of decimal places in the provided input
     * @param {type} num    number being examined
     * @returns number of decimal places in input
     */
    public static decimalPlaces(num) {
        let match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) {
            return 0;
        }
        return Math.min(Math.max(
            0,
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
                // Adjust for scientific notation.
            - (match[2] ? +match[2] : 0)), 20);
    }

    /**
     * Parses a localized float that might contain commas
     * @param stringValue localized float
     * @returns {number} parsed result
     */
    parseLocaleFloat(stringValue)
    {
        return parseFloat(stringValue.replace(/,/g,''));
    }

    formatters = {};

    /**
     * Gets a value that has been formatted to the precision of the axis
     * @returns the formatted axis value
     */
    getPrecisionFromAxis = (value, axis, extendDecimal=true) => {
    	let tickInteval = axis.tickInterval;
		const displayUnit = this.getDisplayUnits(axis);
		if (displayUnit && displayUnit.scale != 1 && displayUnit.scale != 0) {
			value = value / displayUnit.scale;
		    tickInteval = tickInteval / displayUnit.scale;
	    }

        let dec = HighchartsExtender.decimalPlaces(tickInteval);

        dec = extendDecimal ? dec + 1: dec;

        if (dec < 0) {
            dec = 0;
        } else if (dec > 20) {
            dec = 20;
        }

        // Optimization when dec == 0 to use the pre-allocated formatter. This saves ~ 1ms per format.
        let formatter = this.formatters[dec] || (this.formatters[dec] = Intl.NumberFormat('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec}));

	    return isNaN(value) ? value : formatter.format(value.toFixed(dec));
    }

	/**
	 * Axis formatter callback. Called to format an axis label. Value is given by this.value.
	 * @returns the formatted axis value
	 */
	axisFormatter(axisLabel) {
		return this.getPrecisionFromAxis(axisLabel.value, axisLabel.axis, false);
	}

    @observable canResetZoom = false;

    @action _canResetZoom()
    {
        let canResetZoom = false;
        if (this.chart)
        {
            let chart = this.chart;
            [chart.xAxis[0], chart.yAxis[0]].forEach((axis:any) => {
                let e = axis.getExtremes();
                canResetZoom = canResetZoom || !this.hasDefaultExtremes(e, axis);
            })
        }

        return canResetZoom && this.canZoom;
    }

    hasDefaultExtremes(e, axis)
    {
        return ((e.userMin == null && e.userMax == null) || (e.userMin === axis.userOptions.connInitialMin && e.userMax === axis.userOptions.connInitialMax));
    }

	axisToFixed(value) {
		// Cap precision to 20 decimal places to avoid underflow exception in dynamo
		return _.isNumber(value) ? +value.toFixed(20) : value;
	}

	customizeDisplayUnitsEnabled: boolean = true;
	automaticDisplayUnitsEnabled: boolean = false;
	automaticDisplayUnits = new Map();

	getUserOptionAxis(axis: Axis): {displayUnits: ChartAxisDisplayUnit[]} {
		return this.chartComponent.userOptions[axis.coll];
	}

	getDisplayUnits(axis: Axis): ChartAxisDisplayUnit {

		if (axis.categories?.length > 0) {
			_.set(this.chartComponent.userOptions, [axis.coll, "displayUnits"], []);
			return null;
		}

		if (!this.customizeDisplayUnitsEnabled) {
			_.set(this.chartComponent.userOptions, [axis.coll, "displayUnits"], []);
			return null
		}

		const userOptionAxis = this.getUserOptionAxis(axis);
		const opposite = axis.options.opposite || false;

		let userOptionsDisplayUnit = _.find(userOptionAxis?.displayUnits, displayUnit => displayUnit.opposite == opposite);
		if (userOptionsDisplayUnit) {
			return userOptionsDisplayUnit;
		}

		if(!this.automaticDisplayUnitsEnabled) {
			return null;
		}

		const axisKey = this.getAxisKey(axis);
		if (this.automaticDisplayUnits.has(axisKey)) {
			return this.automaticDisplayUnits.get(axisKey);
		}

		// displayUnit created by max value
		let displayUnit = { ...utility.displayUnit((axis as any).dataMax), opposite, title: axis.userOptions.title.text};
		this.automaticDisplayUnits.set(axisKey, displayUnit);
		return displayUnit;
	}


    setDisplayUnit(axis: Axis, displayUnit: {scale: number, unit: string}) {
	    const axisColl = axis.coll;
		const opposite = axis.options.opposite || false;
	    const UserOptionAxis = this.getUserOptionAxis(axis);
		const currentDisplayUnit = this.getDisplayUnits(axis);


		const nDisplayUnit: ChartAxisDisplayUnit = {
			...displayUnit,
			title: _.get(currentDisplayUnit, "title" ,axis.userOptions.title.text),
			opposite: opposite,
			showUnit: currentDisplayUnit?.showUnit
		}

		let UserOptionDisplayUnits;
		if (!UserOptionAxis?.displayUnits?.length) {
			UserOptionDisplayUnits = [nDisplayUnit];
		} else {
			UserOptionDisplayUnits = [...(_.filter(UserOptionAxis.displayUnits, du => du.opposite != opposite)), nDisplayUnit];
		}
	    this.chartComponent.onUpdateUserOptions({[axisColl]: _.assign({}, UserOptionAxis, {displayUnits: UserOptionDisplayUnits})} );
	    this.updateChartAxisDisplay(axis);
    }

	setDisplayUnitShowUnit(axis: Axis, showUnit: boolean) {
		const displayUnit = this.getDisplayUnits(axis);
		if (displayUnit.showUnit !== showUnit) {
			displayUnit.showUnit = showUnit;
			this.setDisplayUnit(axis, displayUnit);
		}
	}
	updateChartAxisDisplay(axis: Axis) {
		const displayUnit = this.getDisplayUnits(axis);
 		if (!displayUnit)
			return;

		let updateText;
		const baseTitle = _.get(displayUnit, "title" ,axis.userOptions.title.text);
		if (displayUnit.showUnit !== false && displayUnit.unit) {
			updateText = `${baseTitle} (${displayUnit.unit})`;
		} else {
			updateText = baseTitle;
		}
		if (axis.userOptions.title.text != updateText) {
			axis.update({title: {text: updateText}});
		} else {
			axis.chart.redraw(false);
		}
	}

	getAxisKey(axis) {
		return `${axis.coll} ${axis.opposite}`;
	}

    /**
     * Check if the chart is for exporting
     * @param chart The chart in question
     * @returns (boolean) The current chart is generated internally by highcharts for exporting
     */
	isForExport(chart)
	{
		return !!chart.options?.chart?.forExport || !!chart.userOptions?.chart?.forExport;
	}

    /**
     * After set extremes callback. Fired after the final min and max values are computed.
     * @param {type} e  event object
     * @returns {undefined}
     */
	@action afterSetExtremes(axis, e) {

    	// Only save extremes if zoom is allowed and the axis is a primary axis.
        this.canZoom && !axis.opposite && this.chart && this.chartComponent.onUpdateUserOptions({
	        [axis.coll]: {
				min: this.axisToFixed(e.userMin),
		        max: this.axisToFixed(e.userMax),
		        dataMin: this.axisToFixed(e.dataMin),
		        dataMax: this.axisToFixed(e.dataMax),
		        arrangementKey: this.chartComponent.getArrangementKey(),
	            displayUnits: this.chartComponent.userOptions[axis.coll]?.displayUnits
	        }
        });

        this.canResetZoom = this._canResetZoom();

        this.updateChartAxisDisplay(axis);
        //console.log('afterSetExtremes()', axis, e)

        // sync the range on secondary axes
        if (axis.coll === "yAxis" && !axis.opposite && axis.chart.yAxis.length > 1)
            axis.chart.yAxis[1].setExtremes(e.userMin, e.userMax);

        if (axis.coll === "xAxis" && !axis.opposite && axis.chart.xAxis.length > 1)
            axis.chart.xAxis[1].setExtremes(e.userMin, e.userMax);

        this.addAxisLabelCallbacks(axis.chart);
        this.addChartTitleSelectingCallbacks(axis.chart);
    }

    adjustStoredAxisLimits() {
        const yAxis = this.chartComponent.chart.yAxis[0];
        let extremes = yAxis.getExtremes();

        yAxis.userOptions.connInitialMax = extremes.dataMax + yAxis.tickInterval;

        this.chartComponent.adjustStoredAxisLimits();
    }

    resetToDefaultAxisLimits(redraw = false) {
		const { chart } = this;

		if (chart.xAxis && chart.yAxis) {	// chart is not initialized in some situations
			[chart.xAxis[0], chart.yAxis[0]].forEach((axis:any) => {
				if (axis.userMax == axis.userOptions.connInitialMax && axis.userMin == axis.userOptions.connInitialMin) {
					axis.setExtremes(null, null, redraw);
					axis.userOptions.connInitialMin = null;
					axis.userOptions.connInitialMax = null;
				}
			})
		}
    }

    /**
     * Gets an axis alignment type while taking inversion into account.
     * @param chart The chart in question
     * @param axis  The axis in question
     * @returns {AxisAlignmentType}  The axis alignment
     */
    getAxisAlignmentType(chart, axis)
    {
        let axisAlignmenType:AxisAlignmentType = null;

        if (axis.isXAxis)
            axisAlignmenType = (!axis.opposite) ? AxisAlignmentType.Bottom : AxisAlignmentType.Top;
        else
            axisAlignmenType = (!axis.opposite) ? AxisAlignmentType.Left : AxisAlignmentType.Right;

        if (chart.inverted)
        {
            if (axisAlignmenType === AxisAlignmentType.Left)
                axisAlignmenType = AxisAlignmentType.Bottom;
            else if (axisAlignmenType === AxisAlignmentType.Bottom)
                axisAlignmenType = AxisAlignmentType.Left;
            else if (axisAlignmenType === AxisAlignmentType.Right)
                axisAlignmenType = AxisAlignmentType.Top;
            else if (axisAlignmenType === AxisAlignmentType.Top)
                axisAlignmenType = AxisAlignmentType.Right;
        }

        return axisAlignmenType;
    }

    positionAxisLabelTooltip(axis, axisLabel, e)
    {
        // Adjust the event pointer location so the generated tooltip doesn't block the other labels
        let $event = $.Event(e.type, e);

        let axisAlignmentType = this.getAxisAlignmentType(axis.chart, axis);
        let chartRect = this.chartComponent.chartDiv.getBoundingClientRect();

        if (axisAlignmentType === AxisAlignmentType.Bottom || axisAlignmentType === AxisAlignmentType.Top)
        {
            $event.pageY = chartRect.top + axisLabel.getBBox().y + (axisAlignmentType === AxisAlignmentType.Top? 100 : -100);
            $event.pageX = chartRect.left + axisLabel.getBBox().x + axisLabel.getBBox().width / 2;
        }
        else if (axisAlignmentType === AxisAlignmentType.Left || axisAlignmentType === AxisAlignmentType.Right)
        {
            $event.pageY = chartRect.top  + axisLabel.getBBox().y + axisLabel.getBBox().height / 2;
            $event.pageX = chartRect.left + axisLabel.getBBox().x + (axisAlignmentType === AxisAlignmentType.Left ? 100 : -100);
        }

        e = axisLabel.chart.pointer.normalize($event);

        return e;
    }

    stickyPointTooltip(point) {

    }

    setPercentileColor(colorSet:string[]) {

    }

    updateChartToMatchShowPathList(list) {

    }

    setPercentiles(percentileValues){

    }

    setStatistics(statisticType, statistics : Statistics) {
    }

    showMomentsBox(numMoments, x, y, fontSize, statistics){}

    getAxisZoomMin(axis)
    {
        return axis.dataMin == null ? axis.userOptions.connInitialMin : Math.min(axis.userOptions.connInitialMin, axis.dataMin);
    }

    getAxisZoomMax(axis)
    {
        return axis.dataMax == null ? axis.userOptions.connInitialMax : Math.max(axis.userOptions.connInitialMax, axis.dataMax);
    }

    get canZoom() {
    	return true;
    }

	onDrag() {

	}

	/**
	 * Handles the mouse wheel event
	 * @param e
	 * @returns true if the event is being consumed in which case it should be ignored outside of this method, false otherwise
	 */
	mouseWheel(e) {
        const chart = this.chartComponent.chart;

        // Scroll the tooltip if the contenxt is being truncated
        if (chart && chart.tooltip && !chart.tooltip.isHidden) {

        	const labelHeight = chart.tooltip.label.height;
	        let $text = $(chart.tooltip.label.element).find('text').first();

	        let delta = e.detail || -(e.originalEvent.wheelDelta / 120);
	        const topMargin = 20;
	        const oldY = parseInt($text.attr('y'));
	        const newY = Math.max(-(labelHeight - $(chart.container).height() - topMargin), Math.min(oldY - 100 * delta, topMargin));

	        if (oldY != newY && labelHeight > $(chart.container).height()) {
		        $text.attr({y: newY})
		        return true;
	        }
        }

        return false;
	}

    /**
     * Remove the legend from a chart
     */
    removeLegend()
    {
        // Highcharts doesn't support post load modification of the legend so this is a bit hacky.

        // Highchart assumes that if a legend was created on intial render it will always exist so
        // to visually remove it, lets float the legend so it doesn't take up space then destroy the svg.
        this.chart.legend.options.floating = true;
        this.chart.legend.destroy();
    }

    /**
     * Adds the legend to the chart
     */
    addLegend()
    {
        // Highcharts doesn't support post load modification of the legend so this is a bit hacky.

        let legend = this.chart.legend;

        // Remove floating legend
        legend.destroy();

        // Must destroy all the legend items which are bound to the old svg so they can be recreated
        this.chart.series.forEach( (series) => {
            legend.destroyItem(series);
        });

        // Unset the float
        legend.options.floating = false;

        legend.render();
    }

	legendItems = []; // stores the items in the legend

	renderNewLegend()
	{
		//Note: API does not expose legend
		const chart = (this.chartComponent.chart as any);
		this.destroyLegendItems(chart.legend, false);
		chart.legend.render();
	}

	destroyLegendItems(legend, keepItems:boolean  = true)
	{
		_.forEach(legend.allItems, item => {
			legend.destroyItem(item);
		});

		if (!keepItems)
			this.legendItems.length = 0;

	}

	/**
	 * Determines if a series should be visible based on the legend state
	 * @param series        The series in question
	 * @returns {boolean}   True if the series should be visible, false otherwise.
	 */
	shouldSeriesBeVisible(series) : boolean
	{
		let stackVisible = series.options.stack == null;
		let uniquesVisible = false;

		// Check the corresponding stack and percentile legend items to see if they are enabled.
		this.legendItems.forEach(function (legendItem) {
			if (series.options.name === legendItem.name) {
				uniquesVisible = legendItem.visible;
			}
			else if (series.options.stack === legendItem.name) {
				stackVisible = legendItem.visible;
			}
		});

		return uniquesVisible && stackVisible;
	}

	/**
	 * Creates a legend item based
	 * @param item
	 * @returns {*}
	 */
	createLegendItem(chart, options) {
		let _thisClass = this;

		// Create a new series to represent the legend item
		let newLegendItem = chart.initSeries(Object.assign({}, {data:[]}, options));
		chart.series.pop(); // initSeries() adds the series to the chart which we don't want, so remove it
		let setVisibleOriginal = newLegendItem.setVisible;

		// redefine the setVisible method to set the visibility of all associated series
		newLegendItem.setVisible = function () {
			setVisibleOriginal.call(this);

			// Find all series in the stack
			chart.series.forEach((series) => {
				if (_thisClass.shouldSeriesBeVisible(series) !== series.visible) {
					series.setVisible(undefined, false);
				}
			});
			chart.redraw();
		};

		return newLegendItem;
	}

	getFormattedLegendItem(item, inStack) : HighchartsSeriesObject {
		throw new Error(`Must be overriden in subclass`);
	}

	/**
	 * Extend existing highchart methods/functionality by wrapping the methods
	 */
	getAllItems = (p, legend) => {
		// save item visible status
		const itemsVisibleStatus = _.map(legend.allItems, item => !!item.visible);

		/* The condition is for invoking from chart.destroy while exporting chart.
		   JS error will be thrown if continue to create custom legends since series are already destroyed */
		if (this.isForExport(legend.chart) && legend.chart.hasLoaded) {
			return this.legendItems;
		}

		// Destroy previous legend items
		this.destroyLegendItems(legend);

		const customLegend = legend.chart.userOptions.iconningLegend;
		if (_.isArray(customLegend) && customLegend.length > 0) {
			this.legendItems = customLegend.map( v => this.createLegendItem(legend.chart, v));

		} else {
			this.legendItems = p.call(legend);
			if (this.legendItems.length > 0) {
				let topGroupItems = {};
				let stackItems = {};
				this.legendItems.forEach((item) => {

					// Build the legend item for unique stacks
					if (item.options.stack && !stackItems[item.options.stack]) {
						stackItems[item.options.stack] = this.getFormattedLegendItem(item, true);
						stackItems[item.options.stack].visible = item.visible;
					} else if (item.options.stack)
						stackItems[item.options.stack].visible = stackItems[item.options.stack].visible || item.visible;

					// Build the legend item for unique items in top legend group
					if (!topGroupItems[item.options.name]) {
						topGroupItems[item.options.name] = this.getFormattedLegendItem(item, false);
						topGroupItems[item.options.name].visible = item.visible;
					} else
						topGroupItems[item.options.name].visible = topGroupItems[item.options.name].visible || item.visible;
				});

				// Set the last unique legend item height to separate the unique group from the stack legend items.
				let topGroupItemValues = _.values(topGroupItems);
				let lastUniqueItem = (topGroupItemValues.slice(-1)[0] as any);

				if (lastUniqueItem.name == "mean" && topGroupItemValues.length > 1)
					lastUniqueItem = (topGroupItemValues.slice(-2)[0] as any);

				lastUniqueItem.legendItemHeight = parseInt(legend.itemStyle.fontSize) * 2;

				this.legendItems = _.values(topGroupItems).concat(_.values(stackItems));
			}
		}

		//For grouped legend items, back up initial visibilities and then reset here
		if (this.legendItems?.length > 0 && this.legendItems.length == itemsVisibleStatus.length) {
			_.forEach(this.legendItems, (item, index) => {
				item.visible = itemsVisibleStatus[index];
			});
		}

		return this.legendItems;
	}


	findClosestPoints(e)
	{
		let series = this.chart.series;
		let kdpointT;
		let kdpoints = [];
		let distance = this.chart.chartWidth,
			kdpoint;

		// Find nearest points on all series (taken from Highchart's lib)
		Highcharts.each(series, function (s) {
			if (s.visible && Highcharts.pick(s.options.enableMouseTracking, true)) { // #3821
				s.options.kdNow = true; // build the tree synchronously to avoid not showing tooltips when the tree was previously destroyed
				kdpointT = s.searchPoint(e, s.kdDimensions === 1); // #3828
				if (kdpointT) {
					kdpoints.push(kdpointT);
				}
			}
		});
		// Find absolute nearest point
		Highcharts.each(kdpoints, function (p) {
			if (p && typeof p.dist === 'number' && p.dist < distance) {
				distance = p.dist;
				kdpoint = p;
			}
		});

		return {kdpoint, kdpoints};
	}

	findMatchingCategoryPoints(chart, category){
		let matches = [];
		chart.series.forEach((s) => {
			s.points.forEach((p) => {
				const pointCat = _.isArray(p.category) ? p.category.join(", ") : p.category;
				if (pointCat && _.toLower(pointCat) == _.toLower(category))
					matches.push(p);
			})
		})

		return matches;
	}

    /**
     * Wraps a method using the Highchart.wrap technique. Also backs up the original Highchart methods
     * so they can be restored.
     * @param {String} chartLookupString properties that can be appended to the this pointer
     *                 to yield the chart, e.g. if this.prop1.chart is the owner chart, then prop1.chart should be
     *                 be provided as the lookup string.
     * @param {Object} object           The context object that the method belongs to
     * @param {String} fnName           The name of the method to extend
     * @param {Function} newFunction    A wrapper function callback. This function is called with the same arguments
     * as the original function, except that the original function is unshifted and passed as the first
     * argument.
     */
    wrap(chartLookupString, object, fnName, newFunction) {
        let wrappedMethod = null;

        $.each(HighchartsExtender.wrappedMethods, (index, value) => {
            if (value.object === object && value.fnName === fnName) {
                wrappedMethod = value;
                return false;
            }
        })

        if (!wrappedMethod) {
            wrappedMethod = {
                chartLookupString: chartLookupString,
                object: object,
                fnName: fnName,
                originalFn: object[fnName],
                instances: [],
            }
            HighchartsExtender.wrappedMethods.push(wrappedMethod);

            Highcharts.wrap(object, fnName, function (args) {

                let obj = this;
                let currentChart = obj;

                // Find the chart using the lookup string
                $.each(chartLookupString.split("."), (index, prop) => {
                    if (prop !== "")
                        currentChart = currentChart[prop];
                })

                // Map the wrapped method to the correct function
                for (let i = 0; i < HighchartsExtender.wrappedMethods.length; i++) {
                    let wrappedMethod = HighchartsExtender.wrappedMethods[i];

                    if (wrappedMethod.object === object && wrappedMethod.fnName === fnName) {
                        for (let j = 0; j < wrappedMethod.instances.length; j++) {
                            let instance = wrappedMethod.instances[j];

                            if (instance.extenderObj.highchartsOptions.connChartID === currentChart.userOptions.connChartID) {
                                return instance.newFunction.apply(obj, arguments);
                            }
                        }

                        //failed to locate a matching instance so simply dispatch to original function
                        let args = Array.prototype.slice.call(arguments);
                        return wrappedMethod.originalFn.apply(obj, args.slice(1));
                    }
                }
            });
        }

        wrappedMethod.instances.push({extenderObj: this, newFunction: newFunction})
    }

    /**
     * Unwraps methods that were wrapped to the backed up functions.
     */
    unwrapMethods () {

        for(let i = HighchartsExtender.wrappedMethods.length - 1; i >= 0; i--) {
            let wrappedMethod = HighchartsExtender.wrappedMethods[i];

            for (let j = wrappedMethod.instances.length - 1; j >= 0; j--) {
                let instance = wrappedMethod.instances[j];

                // remove instance that corresponds to the extender obj being cleaned up
                const {chart} = this.chartComponent;

                if (chart != null && chart.userOptions.connChartID === instance.extenderObj.highchartsOptions.connChartID) {
                    wrappedMethod.instances.splice(j, 1);
                }
            }

            // fully unwrap the method if no instances remain
            if (wrappedMethod.instances.length === 0) {
                HighchartsExtender.wrappedMethods.splice(i, 1);
                wrappedMethod.object[wrappedMethod.fnName] = wrappedMethod.originalFn;
            }
        }
    }

    // Extend existing highchart methods/functionality by wrapping the methods
    // as recommended by highcharts. Note: some of these methods are unexposed
    // in the API, ergo this code is highly susceptible to breaking from HighChart library updates.
    wrapHighchart() {
        let _thisClass = this;

        (function (H) {
            // Remove default zoom button:
            _thisClass.wrap("", H.Chart.prototype, "showResetZoom", function () {
            });


            // Remove export button
            _thisClass.wrap("", H.Chart.prototype, "addButton", function () {
            });

            // Manage zoom & pan at the same time, by buttons
            _thisClass.wrap("chart", H.Pointer.prototype, "drag", function (p, e) {
                if ((_thisClass.chartComponent.userOptions.panOrZoom !== 'zoom' && !e.shiftKey) || (_thisClass.chartComponent.userOptions.panOrZoom === 'zoom' && e.shiftKey)) {
                    e.buttonPanKey = true;
                }

	            this.chart.tooltip.hide(0);

	            _thisClass.onDrag();

                p.call(this, e);
            });

            if (_thisClass.shouldGroupLegendItems)
            {
	            _thisClass.wrap("chart", Highcharts.Legend.prototype, "getAllItems", function (p) {
		            return _thisClass.getAllItems(p, this);
	            })
            }

            // Add "xy" panning:
            _thisClass.wrap('', H.Chart.prototype, 'pan', function (p, e, panning) {
                let chart = this,
                    hoverPoints = chart.hoverPoints,
                    forcedHovers = chart.forcedHovers,
                    doRedraw;

                // remove active points for shared tooltip
                if (hoverPoints) {
                    H.each(hoverPoints, function (point) {
                    	if (point.setState) {
		                    point.setState('');
	                    }
                        else
                            _thisClass.setState(point[0], point[1], '', false);
                    });

	                chart.hoverPoints = null;

                    // Clear hoverPoint so Highcharts doesn't attempt to reapply hover state.
	                chart.hoverPoint = null
                }
                if (forcedHovers) {
                    H.each(forcedHovers, function (point) {
                        _thisClass.setState(point[0], point[1], '', true);
                    });

	                chart.forcedHovers = null;
                }

                // during panning we don't have information about current point
				chart.tooltip && chart.tooltip.hide();

                H.each(panning === 'xy' ? [1, 0] : [1], function (isX) { // xy is used in maps
                    let mousePos = e[isX ? 'chartX' : 'chartY'],
                        axis = chart[(isX && !chart.inverted) || (!isX && chart.inverted) ? 'xAxis' : 'yAxis'][0],
                        startPos = chart[isX ? 'mouseDownX' : 'mouseDownY'],
                        halfPointRange = (chart.inverted ? -1 : 1) * (axis.pointRange || 0) / 2,
                        extremes = axis.getExtremes(),
                        newMin = axis.toValue(startPos - mousePos, true) + halfPointRange,
                        newMax = axis.toValue(startPos + chart[isX ? 'plotWidth' : 'plotHeight'] - mousePos, true) - halfPointRange,
                        goingLeft = startPos > mousePos; // #3613

                    if (newMax < newMin) {
                        let temp = newMin;
                        newMin = newMax;
                        newMax = temp;
                    }

                    if (axis.series.length &&
                        (isX &&
                        (goingLeft || newMin > Math.min(_thisClass.getAxisZoomMin(axis), extremes.min))
                        &&
                        (!goingLeft || newMax < Math.max(_thisClass.getAxisZoomMax(axis), extremes.max)))
                        ||
                        (!isX &&
                            (!goingLeft || newMin > Math.min(_thisClass.getAxisZoomMin(axis), extremes.min))
                            &&
                            (goingLeft || newMax < Math.max(_thisClass.getAxisZoomMax(axis), extremes.max))
                        )) {

                        axis.setExtremes(Math.max(newMin, _thisClass.getAxisZoomMin(axis)), Math.min(newMax, _thisClass.getAxisZoomMax(axis)), false, false, {trigger: 'pan'});
                        doRedraw = true;
                    }

                    chart[isX ? 'mouseDownX' : 'mouseDownY'] = mousePos; // set new reference for next run
                });
                if (doRedraw) {
                    chart.redraw(false);
                }
                $(chart.container).css({cursor: 'move'});
            });

            _thisClass.wrap('chart', H.Pointer.prototype, "runPointActions", function (p, e, point) {
	            // suppress while dragging
	            if (!this.hasDragged)
                    _thisClass.runPointActions(p, this, e, point);
            });

            _thisClass.wrap('chart', H.Tooltip.prototype, "refresh", function (p, points, e) {
	            // suppress tooltips while dragging
	            if (this.chart.pointer.hasDragged)
		            return;

            	p.call(this, points, e);
                if (this.label)
                    Highcharts.fireEvent(this.chart, 'tooltipRefresh', {});
            });

            _thisClass.wrap('chart', H.Pointer.prototype, "onContainerMouseMove", function (p, e) {
                _thisClass.onContainerMouseMove(p, this, e);
            });

            _thisClass.wrap('chart', H.Pointer.prototype, "onDocumentMouseMove", function (p, e) {
                _thisClass.onDocumentMouseMove(p, this, e);
            });

            _thisClass.wrap('chart', H.Tooltip.prototype, "hide", function (p, delay) {
                _thisClass.hideTooltip(p, this, delay);
            });

            _thisClass.wrap('series.chart', H.Point.prototype, "onMouseOver", function (p, e) {
                if (!this.series.chart.pointer.hasDragged) {
                    // prevent mouse over when dragging
                    p.call(this, e);
                }
            });

            _thisClass.wrap('chart', H.Series.prototype, "onMouseOver", function (p, e) {
                if (!this.chart.pointer.hasDragged) {
                    // prevent mouse over when dragging
                    p.call(this, e);
                }
            });

	        _thisClass.wrap('chart', H.Series.prototype, "shouldShowTooltip", function (p, plotX, plotY, options) {
	        	return this.chart.tooltip.shared || p.call(this, plotX, plotY, options);
	        });

	        _thisClass.wrap("chart", Highcharts.seriesTypes.arearange.prototype, 'drawLegendSymbol', function (p, legend, item) {
		        _thisClass.drawLegendSymbol(p, this, legend, item)
	        })

	        _thisClass.wrap("chart", Highcharts.seriesTypes.column.prototype, 'drawLegendSymbol', function (p, legend, item) {
		        _thisClass.drawLegendSymbol(p, this, legend, item)
	        })

            _thisClass.wrap('chart', H.Axis.prototype, "redraw", function (p, e) {
                    p.call(this, e);

                _thisClass.addAxisLabelCallbacks(this.chart);

                if (this.labelGroup && this.labelGroup.element.onclick == null)
                    _thisClass.addChartTitleSelectingCallbacks(this.chart);
            });

	        _thisClass.wrap("chart", Highcharts.Legend.prototype, "renderItem", function (p, item) {
		        return _thisClass.renderItem(p, this, item);
	        })

        })(Highcharts)
    }
}







