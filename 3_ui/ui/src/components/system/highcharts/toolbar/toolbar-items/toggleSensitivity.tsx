import {bp, HighchartsComponent} from 'components';
import {observer} from 'mobx-react';
import {AnchorButton} from '@blueprintjs/core';
import * as React from "react";
import {AppIcon} from 'components';
import {appIcons, QueryResult, i18n} from 'stores';
import SensitivityChartToolbar from './../highchartsSensitivityToolbar';

import * as css from './../highchartsToolbar.css';

interface MyProps {
	queryResult: QueryResult;
	chartComponent?: HighchartsComponent;
	onToggleSensitivity?: (enabled: boolean) => Promise<any>;
	onSensitivityApply?: () => Promise<any>;
}

@observer
class ToggleSensitivityToolbarItem extends React.Component<MyProps, {}> {
	
	onToggle = _.debounce(() => {
		if (this.props.chartComponent) {
			this.props.chartComponent.onResize();
		}
	}, 300)

	toggleSensitivity = async() => {
		const {queryResult, chartComponent } = this.props;
		const newEnabled = !queryResult.sensitivityEnabled;

		if (this.props.onToggleSensitivity) {
			await this.props.onToggleSensitivity(newEnabled);
		}

		if (chartComponent) {
			chartComponent.busy = true;
			try {
				await queryResult.getSensitivityOptions();
				queryResult.sensitivityEnabled = newEnabled;
				if (queryResult.sensitivityEnabled) {
					queryResult.bootstrapEnabled = false;
				} else {
					await chartComponent.refetchData(false);
				}
			} finally {
				chartComponent.busy = false;
			}
		} else {
			await queryResult.getSensitivityOptions();
			queryResult.sensitivityEnabled = newEnabled;
		}
	}

	componentWillUnmount() {
		this.onToggle.cancel();
	}

	render() {
		const { queryResult } = this.props;

		return (
			<bp.Popover popoverClassName={`${css.highchartsToolbar}`}
				autoFocus={false}
				enforceFocus={false}
				position={bp.Position.BOTTOM}
				minimal={true}
				isOpen={queryResult.sensitivityEnabled}
				content={<SensitivityChartToolbar {...this.props} />}
				onOpened={this.onToggle}
				onClosed={this.onToggle}
				transitionDuration={100}
				portalContainer={document.getElementById(css.highchartPopoverToolbarContainer)}
			>
				<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({
					defaultMessage: 'Toggle Sensitivity',
					description: '[Query] Tooltip for enable or disable Sensitivity function'
				})}>
					<AnchorButton className="toggle-sensitivty" active={queryResult.sensitivityEnabled} onClick={this.toggleSensitivity}>
							<AppIcon icon={appIcons.chart.toolbar.sensitivity}/>
					</AnchorButton>
				</bp.Tooltip>
			</bp.Popover>
		);
	}
}

export default ToggleSensitivityToolbarItem;

