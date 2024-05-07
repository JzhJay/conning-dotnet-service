import * as ReactDOMServer from 'react-dom/server';
import {IO} from '../../../../stores/io';
import {ScatterTooltip} from '../internal-components/tooltips';
import {PointsExtender} from "./points.hc.extender";
import {HighchartsComponent} from "../highchartsComponent";
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

export class ScatterChartExtender extends PointsExtender {

	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions, false)
	}

    /**
     * Extend existing highchart methods/functionality by wrapping the methods
     */
    wrapHighchart() {
        super.wrapHighchart();

        //wrap the scatter series drawLegendSymbol to cap the marker radius.
        this.wrap("chart", Highcharts.seriesTypes.scatter.prototype, "drawLegendSymbol", function (p, legend, item ) {
            let markerSizeBack = this.options.marker.radius;

            if (this.options.marker.radius > 10)
                this.options.marker.radius = 10;
            p.call(this, legend, item);
            this.options.marker.radius = markerSizeBack;
        });

	    this.wrap("chart", Highcharts.seriesTypes.scatter.prototype, "getPoint", function (p, boostPoint ) {
	    	let point = p.call(this, boostPoint);
			if(point && point.index != null){
				if(point.series && point.series.userOptions && point.series.userOptions.connDataLookup ){
					const dataLookup = point.series.userOptions.connDataLookup[point.index] as {name?: any};
					if (dataLookup) {
						dataLookup.name != null && (point.name = dataLookup.name);
						for (let k in dataLookup) {
							if(['x','y','0','1'].indexOf(k) >= 0) { continue; }
							point.options[k] = dataLookup[k];
						}
					}
				}
			}
		    return point
	    });

	    this.wrap("chart", Highcharts.seriesTypes.scatter.prototype, "setData", function (p, data, redraw, animation, updatePoints ) {
		    if(this.options.boostThreshold == 1 && data.length && !Array.isArray(data[0])){
				this.userOptions.connDataLookup = data;
				data = data.map((d)=>[d.x,d.y]);
		    }
		    p.call(this, data, redraw, animation, updatePoints);
	    });
	}
	/**
	 * Sticky the tooltip for the indicated point.
	 * @param point The point whose tooltip is be stickied.
	 */
	stickyPointTooltip(point)
	{
		let chart = point.series.chart;
		chart.forExport = false;
		chart.tooltip.refresh(point);
		chart.tooltip.label.attr({opacity: 1});
		let clonedTooltip = chart.tooltip.label.element.cloneNode(true);
		chart.container.firstChild.insertBefore(clonedTooltip, chart.tooltip.label.element);

		chart.options.customTooltips[point.name+'-'+point.series.name] = {
			customTooltip: clonedTooltip,
			hasCustomTooltip: true,
			seriesIndex: point.series.index,
			evalIndex: point.connEvalIndex,
			name: point.name,
			key: this.tooltipKey(point)
		};
		chart.options.customTooltips.iterator ++;
	}

	/**
	 * Point click callback. Fired when a point is clicked.
	 * @param {type} event  common event information
	 * @returns {undefined}
	 */
	pointClick(point) {
		let chart = point.series.chart,
			pointIndex = point.name+'-'+point.series.name,
			customPoint = chart.options.customTooltips[pointIndex];

		if (customPoint && customPoint.hasCustomTooltip) {
			chart.container.firstChild.removeChild(customPoint.customTooltip);
			chart.tooltip.hide();

			chart.options.customTooltips[pointIndex] = null;
			chart.options.customTooltips.iterator --;
		} else {
			this.stickyPointTooltip(point);
		}

		this.chartComponent.canRemoveTooltips = chart.options.customTooltips.iterator !== 0;

		this.updateTooltipsUserOptions();
	}

    removeTooltips()
    {
        let chart = this.chart;
        let customPoint;
        for (let name in chart.options.customTooltips) {
            customPoint = chart.options.customTooltips[name];
            if (customPoint && customPoint.customTooltip) {
                chart.container.firstChild.removeChild(customPoint.customTooltip);
            }
        }

        chart.options.customTooltips = {
            iterator: 0
        };

        this.chartComponent.canRemoveTooltips = false;

        this.updateTooltipsUserOptions();
    }

    updateTooltipsUserOptions()
    {
        let chart = this.chart;
        let userOptionProps = {};

        // Copy relevant settings that are needed to re-create tooltips.
        for (let obj in chart.options.customTooltips)
        {
            if (chart.options.customTooltips[obj] != null) {
                if (obj === "iterator")
                    userOptionProps[obj] = chart.options.customTooltips[obj]
                else {
                    let tooltip = chart.options.customTooltips[obj];
                    userOptionProps[obj] = {
                        hasCustomTooltip: tooltip.hasCustomTooltip,
                        seriesIndex: tooltip.seriesIndex,
	                    evalIndex: tooltip.evalIndex,
                        name: tooltip.name,
	                    key: tooltip.key
                    }
                }
            }
        }

        this.updateHighchartsUserOptions({customTooltips:userOptionProps});
    }

    setHoverOpacity(chart, opacity) {
	    /*if (chart.renderTarget) // Breaks Beeswarm and doesn't appear applicable for any other chart type
		    $(chart.renderTarget.element).css({ opacity });
	    else*/
	    this.chart.series.forEach((s:any) => s.renderTarget && $(s.renderTarget.element).css({ opacity }))
    }


    /**
     * Point mouse over callback. Fired when the mouse enters the areas close to the point.
     * @param point The target point
     * @returns {undefined}
     */
    pointMouseOver(point) {
        let _thisClass = this;
        let hoverPoints = [];
        let name = point.name;

        if (this.chartComponent.userOptions.showLines)
	        return;

	    // lessen the opacity of the series, so highlighted points can be more easily seen
	    this.setHoverOpacity(point.series.chart, .25)

        Highcharts.each(point.series.chart.series, function (s) {

	        // lessen the opacity of the series, so highlighted points can be more easily seen
            if (s.visible) {
	            s.points.forEach(function(p) {
	            	if(p.i != null && s.getPoint(p).name === name) {
		                hoverPoints.push([p, s]); // first store points
                    } else {
                        _thisClass.setState(p, s, '', false);
                    }
                });
            }
        });

        // now hover state for them:
        Highcharts.each(hoverPoints, function (p) {
            _thisClass.setState(p[0], p[1], 'hover', false);
            p[1].halo.toFront();
        });
        point.series.chart.forcedHovers = hoverPoints;

        if (point.series.chart.tooltip.label)
            point.series.chart.tooltip.label.toFront(); // display tooltip over all
    }

	seriesMouseOver(series) {
		if (this.chartComponent.userOptions.showLines) {
			series.chart.series.forEach((s) => {
				if (series != s && !s.userOptions.isRegressionLine)
					s.graph.attr({
						opacity: .25
					});
			})
		}
	}

	seriesMouseOut(series) {
		if (this.chartComponent.userOptions.showLines) {
			series.chart.series.forEach((s) => {
				if (!s.userOptions.isRegressionLine)
					s.graph.attr({
						opacity: 1
					});
			})
		}
	}

    /**
     * Point mouse out callback. Fired when the mouse leaves the areas close to the point.
     * @param point The target point
     * @returns {undefined}
     */
    pointMouseOut(point) {
    	if (!point)
    		return;

        let _thisClass = this;
        let chart = point.series.chart;

        if(chart.forcedHovers) {
            Highcharts.each(chart.forcedHovers, function(p) {
                _thisClass.setState(p[0], p[1], "", true); // force state
            });

	        this.setHoverOpacity(point.series.chart, 1)

            Highcharts.each(chart.series, function(s) {
                if (s.markerGroup) {
                    /*s.markerGroup.attr({
                        opacity: 1
                    });*/
                    if (s.stateMarkerGraphic) {
                        s.stateMarkerGraphic.hide();
                    }
                }
            });
            chart.forcedHovers = false;
            chart.hoverPoint = null;
        }
        chart.tooltip.hide();
        $(chart.container).css({ cursor: 'auto' });

        //point.series.chart.forcedHovers = false;
    }


    /**
     * Sets the current state of the indicated point
     * @param point     the point in question
     * @param series    The parent series
     * @param state     The state to set, corresponds to the highcharts sates. '' or 'hover'
     * @param forced    True to forcefully set the empty ('') state
     */
    setState(point, series, state, forced) {
        let chart = series.chart,
            stateOptions = series.options.states,
            haloOptions = stateOptions[state] && stateOptions[state].halo,
            halo = series.halo,
            pointObj,
            offsetX = 0,
            offsetY = 0

        if(state === '' && !forced) {
            return;
        }

        if(point.setState) {
            point.setState(state);
        } else {
            // boost module doesn't have rendered points. Initialize points and create path then:
            pointObj = (new series.pointClass()).init(series, series.options.data[point.i]);
            //pointObj.x = point.x;
            // console.log(halo);
            if (haloOptions && haloOptions.size) {

                if (halo) {
                    series.halo.destroy();
                }

                series.halo = halo = chart.renderer.path().add(chart.seriesGroup);

                pointObj.plotX = point.plotX;
                pointObj.plotY = point.plotY;

                // Fix for 5.0.1, halo calculation changed:
                if (series.halo.parentGroup !== series.group) {

                	if (chart.inverted) {
		                //Hack/Workaround to fix issue where marker is incorrectly placed https://github.com/highcharts/highcharts/issues/4608
		                offsetX = -chart.plotTop;
		                offsetY = -chart.plotLeft;
	                }
                	else {
		                offsetX = chart.plotLeft;
		                offsetY = chart.plotTop;
	                }
                }

                // Temporary change plotX and plotY
                pointObj.plotX += offsetX;
                pointObj.plotY += offsetY;

                halo.attr(Highcharts.extend({
                    'class': 'highcharts-tracker',
                    fill: Highcharts.color(point.color || series.color).setOpacity(haloOptions.opacity)
                }, haloOptions.attributes)).attr({
                    d: state === '' ? [] : pointObj.haloPath(haloOptions.size),
                });

                // Restore plotX and plotY
                pointObj.plotX -= offsetX;
                pointObj.plotY -= offsetY;

                halo.point = pointObj;
                //chart.hoverPoint = pointObj;
            } else if (halo) {
                halo.attr({ d: [] });
                halo.point = null;
            }
        }
    }

    /**
     * Provides the expected/extended functionality for the runPointActions Highchart's method.
     * @param originalFunction  The original Highchart's runPointActions method
     * @param pointer           The pointer object
     * @param e                 The associated event
     * @returns {undefined}
     */
    runPointActions(originalFunction, pointer, e, point) {
    	// Passthrough for scatter line charts
    	if (this.chartComponent.userOptions.showLines || pointer.isDirectTouch)
		    return originalFunction.call(pointer, e, point);

	    const chartingResult = this.chartComponent.props.chartingResult;
	    if (chartingResult instanceof IO && chartingResult.pendingUpdate) {
	    	return;
	    }

        let dist, x, y,
            chart = pointer.chart,
            //point = chart.hoverPoint,
            kdPoints = [],
            distance = Number.MAX_VALUE,
            snap = Math.max(chart.series[0].options.marker.radius, 5) || 10,
            kdPoint;
        let _thisClass = this;

        // boost module doesn't provide point - find those:
        if(!point) {
            Highcharts.each(chart.series, function (s) {
                if (s.visible) {
                    kdPoint = s.searchPoint(e, false);
                }
                if (kdPoint) {
                    kdPoints.push(kdPoint);
                }
            });
            Highcharts.each(kdPoints, function (p) {
                if(p && p.dist < distance) {
                    distance = p.dist;
                    point = p;
                }
            });
        } else if(!point.onMouseOut) {
            point.onMouseOut = function() {}; // noop
        }

        if (point) {
            x = (chart.inverted ? (chart.plotWidth - point.plotY) : point.plotX) + chart.plotLeft - e.chartX;
            y = (chart.inverted ? (chart.plotHeight - point.plotX) : point.plotY) + chart.plotTop - e.chartY;
            dist = Math.sqrt(x * x + y * y);

            // show tooltip when point directly hovered
            // within fixed snap around it
            if (dist < snap) {
            	if (!chart.hoverPoint || (chart.hoverPoint.index != point.index || chart.hoverPoint.series != point.series))
                    originalFunction.call(pointer, e, point);

                $(chart.container).css({ cursor: 'pointer' });

	            chart.tooltip.label && (chart.tooltip.label.element.onclick = function () {
                    _thisClass.pointClick(point)
                });
            } else {

                this.pointMouseOut({
                    series: {
                        chart: chart
                    }
                });
            }
        }
    }

    /**
     * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
     * @returns the formatted tooltip string
     */
    toolTipFormatter(p):any {
        if (p.series.userOptions.isRegressionLine)
            return false;

        const {chart, chartComponent} = this;

	    return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><ScatterTooltip point={p} chart={chart} chartData={chartComponent.chartData} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>);
    }
}
