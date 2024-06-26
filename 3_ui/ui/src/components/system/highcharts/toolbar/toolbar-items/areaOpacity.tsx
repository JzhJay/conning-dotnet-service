import { FormattedMessage } from 'react-intl';
import { AppIcon, bp} from 'components';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {appIcons, i18n} from 'stores';
import {observer} from 'mobx-react';

@observer
export class AreaOpacityToolbarItem extends React.Component<ToolbarItemProps,{}> {
    input;
    min = 0;

	constructor(props, state) {
		super(props, state);
	    this.min = this.props.chartType == "beeswarm" ? .2 : 0;
    }

    render() {
	    const {chartData, userOptions, chartType} = this.props;

        return (
            <div className={bp.Classes.BUTTON_GROUP}>
	            <label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}>
					<FormattedMessage defaultMessage="Area Opacity:" description="[highcharts] Input label for adjusting chart's area opacitiy" />
				</label>
	            <div className="area-opacity slider ui" title={i18n.intl.formatMessage({ defaultMessage: 'Area Opacity', description: `[highcharts] Element title for adjusting chart's area opacitiy`})}>
                    <AppIcon icon={appIcons.chart[chartType]} iconicDataAttribute={{"data-degree-of-smoothing":0}}/>
                    <input type="range" min={this.min} max="1" step=".01" defaultValue={"0"} ref={input => this.input = input} onChange={(e) => this.valueChanged(e.target.value)} />
                    <AppIcon icon={appIcons.chart[chartType]} iconicDataAttribute={{"data-degree-of-smoothing":0}}/>
                </div>
            </div>)
    }

    componentDidUpdate(oldProps: ToolbarItemProps) {
    	if (this.input && oldProps.chartData != this.props.chartData) {
    		this.setFromChartData();
	    }
    }

    componentDidMount() {
    	this.setFromChartData();
    }

	componentWillUnmount() {
		this.fullOpacityUpdate.cancel();
	}

    setFromChartData = () => {
	    const {userOptions, chartType, chartComponent: {chart, chartData}} = this.props;

		if (userOptions.areaOpacity == null && chartData) {
		    let opacity;
		    if (chartType === 'pdf' && chartData.series[0].stack != null)
			    opacity = 0;
		    else if (chartType === 'bar')
				opacity = 0.75
		    else
			    opacity = Math.max(1 / (chartData.series.length + 1), this.min);

		    this.input.value = opacity;
	    }
	    else {
		    this.input.value = userOptions.areaOpacity;
	    }

	    this.valueChanged(this.input.value, true);
    }

    fullOpacityUpdate = _.debounce(() => {
	    this.props.chartComponent.busy = true
	    // Wrap in a timeout to give the busy indicator a chance to be shown
	    window.setTimeout(() => {
	    	try {
			    this.input && this.valueChanged(this.input.value,true)
		    }
		    finally {
			    this.props.chartComponent.busy = false;
		    }
	    }, 10)
    }, 1500, {'trailing':true})

    valueChanged = (value, fullUpdate:boolean = false) => {
	    // const value = this.input.value;
	    const {chartType, chartComponent, chartComponent:{chart}} = this.props;

	    if (chart != null) {
		    chart.series.forEach((series, i) => {
			    let colorSplit    = series.color.replace(/[^\d,]/g, '').split(',');
			    colorSplit[3]     = value;
			    const seriesColor = `rgba(${colorSplit.join(",")})`;

			    // Optimization to update opacity on DOM element directly, which takes <1ms for 100 series, while updating with series.updates takes >1s
			    // https://github.com/highcharts/highcharts/issues/6757#issuecomment-303336285
			    if (!fullUpdate) {
				    if (chartType === 'pdf' && series.area) {
					    series.area.element.setAttribute("fill", seriesColor)

					    //series.userOptions.fillOpacity = value;
				    }
				    else if ((chartType === 'histogram' || chartType === 'bar') && (series.data.length > 0) && (series.data[0] as any).graphic) {
					    series.data.forEach((point: any) => {
						    point.graphic.element.setAttribute("fill", seriesColor)
						    //point.color = seriesColor;
					    })

					    // re-add these updates for correct propagation if the full update is not performed.
					    series.userOptions.fillOpacity = value;
					    series.userOptions.color = seriesColor;
					    series.color = seriesColor;

					    const legendSymbol = (series as any).legendSymbol;
					    if (legendSymbol)
					        legendSymbol.element.setAttribute("fill", seriesColor)
				    }
				    else if (chartType == 'beeswarm' && chart.series.length * chart.series[0].userOptions.data.length < 20) {
				    	// For very small beeswarm plots that have no DOM elements lets go through highcharts for a tight feedback loop
					    series.update({color: seriesColor}, true);
				    }
				    else {
				    	// Mark the chart as busy while we await the full update
					    this.props.chartComponent.busy = true
				    }
		        }
		        else {
			    	// Histogram says fillOpacity is true yet it doesn't honor setting fillOpacity
			        if (series.fillOpacity != null && chartType != "histogram") {
				        series.update({fillOpacity: value}, false);
			        }
			        else {
				        series.update({color: seriesColor}, false);
			        }
		        }
		    })

		    if (fullUpdate) {
			    chart.redraw();
		    }
		    else {
		    	// Trigger a debounced full update after the user has stopped updating the opacity to ensure that highcharts is able to correctly propogate the final update.
			    this.fullOpacityUpdate();
		    }
	    }

	    this.props.onUpdateUserOptions({areaOpacity: parseFloat(value)})
    }

    getSeriesColor = (series, opacity) =>{
	    let colorSplit = series.color.replace(/[^\d,]/g, '').split(',');
	    colorSplit[3]  = opacity;
	    return `rgba(${colorSplit.join(",")})`;
    }

}
