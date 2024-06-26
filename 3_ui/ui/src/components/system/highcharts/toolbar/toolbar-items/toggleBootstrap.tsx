import {bp, HighchartsComponent} from 'components';
import {observer} from 'mobx-react';
import {AnchorButton} from '@blueprintjs/core';
import * as React from "react";
import {AppIcon} from 'components';
import {appIcons, QueryResult, i18n} from 'stores';
import type {ChartType, ChartUserOptions} from '../../../../../stores/charting';
import { BootstrapChartToolbar } from './../highchartsBootstrapToolbar';

import * as css from './../highchartsToolbar.css';

interface MyProps {
	chartType: ChartType;
	chartComponent: HighchartsComponent;
	queryResult: QueryResult;
	userOptions: ChartUserOptions;
}

@observer
export class ToggleBootstrapToolbarItem extends React.Component<MyProps, {}> {

	onToggle = _.debounce(() => {
		if (this.props.chartComponent) {
			this.props.chartComponent.onResize();
		}
	}, 300)

	toggleBootstrap = async() => {
		const {queryResult, chartComponent} = this.props;

		chartComponent.busy = true;

		await queryResult.getBootstrapOptions();
		queryResult.bootstrapEnabled = !queryResult.bootstrapEnabled;
		if (queryResult.bootstrapEnabled) {
			queryResult.sensitivityEnabled = false;
		} else {
			await chartComponent.refetchData(false);
		}

		chartComponent.busy = false;
	}

	componentWillUnmount() {
		this.onToggle.cancel();
	}

	render() {
		const {chartComponent: {extender}, queryResult} = this.props;

		return (
            <bp.Tooltip position={bp.Position.TOP} content={i18n.intl.formatMessage({ defaultMessage: 'Toggle Bootstrap', description: '[Query] Enable or disable bootstrap in query result' })}>
				<bp.Popover popoverClassName={`${css.highchartsToolbar}`}
					autoFocus={false}
                    enforceFocus={false}
                    position={bp.Position.BOTTOM}
                    minimal={true}
                    isOpen={queryResult.bootstrapEnabled}
                    content={<BootstrapChartToolbar {...this.props} />}
                    onOpened={this.onToggle}
					onClosed={this.onToggle}
					fill={true}
					transitionDuration={100}
					portalContainer={document.getElementById(css.highchartPopoverToolbarContainer)}
				>
                    <AnchorButton className="toggle-bootstrap"
                                active={queryResult.bootstrapEnabled}
                                onClick={this.toggleBootstrap}>
                        <AppIcon icon={appIcons.chart.toolbar.bootstrap}/>
                    </AnchorButton>
                </bp.Popover>
            </bp.Tooltip>
        );
	}
}

