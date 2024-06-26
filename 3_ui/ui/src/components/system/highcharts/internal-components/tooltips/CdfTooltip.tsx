import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import { FormattedMessage } from 'react-intl';
import { i18n } from 'stores';

interface MyProps {
    chart: HighchartsChartObject;
    group?: any;
}

export class CdfTooltip extends React.Component<MyProps, {}> {
    render() {
        const {group, chart} = this.props;
        let headingLeft      = (chart as any).options.axisNames.join(" / ");
        const isGroupItemLen_1 = group.items.length == 1;
        const hasSeriesIdentification = headingLeft !== "" || !isGroupItemLen_1;
		let headingRight = '';
		if (group.groupName === 'Percentile') {
			headingRight = hasSeriesIdentification ? i18n.highcharts.tooltipValueSet.values : i18n.highcharts.tooltipValueSet.value;
		} else {
			headingRight = hasSeriesIdentification ? i18n.highcharts.tooltipValueSet.percentiles : i18n.highcharts.tooltipValueSet.percentile;
		}

        return <ChartTooltipBox>
            <ChartTooltipTitle>
				<FormattedMessage defaultMessage="Cumulative Density" description="[highcharts] Tooltip title in CDF chart - Cumulative Density" />
			</ChartTooltipTitle>
            <ChartTooltipValueSet label={group.groupName} value={group.groupValue} />

	        <ChartTooltipTitle>{hasSeriesIdentification ? `${i18n.highcharts.tooltipTitle.seriesIdentification} /  ${headingRight}` : headingRight}</ChartTooltipTitle>
	        {hasSeriesIdentification && <ChartTooltipValueSet label={headingLeft === "" ? "Series" : headingLeft} value={headingRight} valueStyle={{fontWeight: "bold"}} />}

            {group.items.map((item, index) => <ChartTooltipValueSet
	            key={index.toString()}
	            label={item.names.length === 0 ? isGroupItemLen_1 ? "" : `${i18n.highcharts.tooltipValueSet.series} ` + (index + 1) : item.names.join(" / ")}
	            value={isNaN(item.value) ? "N/A" : item.value}
            />)}

        </ChartTooltipBox>;
    }
}
