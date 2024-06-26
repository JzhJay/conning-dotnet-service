import type {ToolbarItemProps} from '../highchartsToolbar';
import * as React from 'react';
import { observable, action, autorun, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {AnchorButton, Button, Position, Tooltip} from '@blueprintjs/core';
import { i18n } from 'stores';

@observer
export class RegressionLineToolbarItem extends React.Component<ToolbarItemProps, {}> {
    constructor(props: ToolbarItemProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {showRegressionLine} = this.props.userOptions;
		const { formatMessage } = i18n.intl;

		return <Tooltip position={Position.BOTTOM} content={showRegressionLine ?
			formatMessage({defaultMessage: 'Hide Regression Line', description: '[highcharts] Tooltip for hide regression line in chart'}) :
			formatMessage({defaultMessage: 'Show Regression Line', description: '[highcharts] Tooltip for Show regression line in chart'})}>
			<Button className="regression-line" active={showRegressionLine}
			              onClick={this.toggle} text="l"/>
		</Tooltip>
	}

    @action toggle = () => {
		this.props.chartComponent.onUpdateUserOptions({showRegressionLine:!this.props.userOptions.showRegressionLine});
		this.setRegression();
	}

    setRegression = (animate = true) => {
		const {chartComponent} = this.props;
		const {chart}          = chartComponent;
		if (chart != null) {
			const {showRegressionLine} = this.props.userOptions;

			chartComponent.regressionSeries.forEach(s => {
				if (s) {
					s.setVisible(showRegressionLine, false);
					s.update({showInLegend: showRegressionLine}, false);
				}
			});

			chart.redraw(true);
		}
	}
}
