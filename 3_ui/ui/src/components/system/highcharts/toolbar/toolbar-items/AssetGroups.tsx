import {DropdownCycleButton} from "components";
import { action, makeObservable } from 'mobx';
import * as React from 'react';
import {ChartDataRef, ChartData, IO, i18n} from 'stores';
import {observer} from 'mobx-react';
import {Menu, MenuItem, Button} from '@blueprintjs/core';
import type {ToolbarItemProps} from '../highchartsToolbar';
import { FormattedMessage } from 'react-intl';

@observer
export class AssetGroupsToolbarItem extends React.Component<ToolbarItemProps, {}> {
    groups = ["Grouped", "Grouped", "Detail"];

    constructor(props: ToolbarItemProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {userOptions: {assetGroupLevel}, chartComponent} = this.props;
		const {groups} = this;

		return (
			<div className="ui labeled input">
				<div className="ui label">
					<FormattedMessage defaultMessage="Asset Class:" description="[highcharts] Label for adjusting asset grouping" />
				</div>
				<DropdownCycleButton
					title={i18n.intl.formatMessage({defaultMessage: 'Cycle Asset Grouping', description: '[highcharts] Tooltip for Cycle Asset Grouping'})}
					menu={<Menu>
						{groups.map((g, l) => <MenuItem
							key={l}
							active={assetGroupLevel == l}
							text={this.assetText(g, l)}
							onClick={() => this.setAssetGroup(l)}
						/>)}
					</Menu>}
					buttonContent={
						<Button onClick={this.cycle}>
							{this.assetText(groups[assetGroupLevel], assetGroupLevel)}
						</Button>}
				/>
			</div>
		);
	}

    assetText(group, level) {
		const io = this.props.chartComponent.props.chartingResult as IO;
		return `${group} (\u2264 ${io.assetGroups(level).length})`
	}

    cycle = () => {
		const assetGroupLevel = (this.props.userOptions.assetGroupLevel + 1) % this.groups.length;
		//this.props.onUpdateUserOptions({assetGroupLevel});
		this.setAssetGroup(assetGroupLevel);
	}


    @action setAssetGroup = async (level) => {
		const {userOptions, userOptions: {showAdditionalPoints}, chartComponent, chartComponent: {chart}, chartType} = this.props;
		this.props.onUpdateUserOptions({assetGroupLevel: level});
		const chartData = await chartComponent.fetchChartData();

		chart.update(_.omit(chartData, ["xAxis", "yAxis"]), true, true);
		chartComponent.extender.reportPlotExtremes();
	}
}