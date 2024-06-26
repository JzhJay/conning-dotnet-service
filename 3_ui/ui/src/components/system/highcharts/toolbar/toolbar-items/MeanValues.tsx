import type {ToolbarItemProps} from '../highchartsToolbar';
import {observer} from 'mobx-react';
import {Button} from '@blueprintjs/core';
import {bp} from 'components';
import {i18n} from 'stores';

@observer
export class MeanValuesToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const {showMeanValues} = this.props.userOptions;

		return <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({
			defaultMessage: 'Toggle Mean Values', description: '[highcharts] Toolbar function - Show mean values or not'
		})}>
			<Button active={showMeanValues}
			        className="meanValues"
			        onClick={e => this.toggleMeanValues()}>μ</Button>
		</bp.Tooltip>

	}

	toggleMeanValues() {
		const {chartComponent, chartComponent: {chart}} = this.props;
		const meanSeries = chart.series.filter(({name}) => name === 'mean');
		const showMeanValues = !(meanSeries.length && meanSeries[0].visible)
		chartComponent.onUpdateUserOptions({showMeanValues});
		meanSeries.forEach((series) => {
			series.setVisible(showMeanValues);
		});
	}

}
