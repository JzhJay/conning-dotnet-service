import { computed, makeObservable } from 'mobx';
import {FormEvent} from 'react';
import {bp} from '../../../../index';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {observer} from 'mobx-react';
import {i18n} from 'stores';

@observer
export class DataLabelSwitchToolbarItem extends React.Component<ToolbarItemProps, {}> {
    private attributePath = "plotOptions.series.dataLabels.enabled";

    constructor(props: ToolbarItemProps) {
        super(props);
        makeObservable(this);
    }

    @computed get dataLabelsEnabled() {
		return _.get(this.props.chartComponent?.chart, `options.${this.attributePath}`);
	}

    render() {
		return <bp.Switch checked={this.dataLabelsEnabled} label={i18n.intl.formatMessage({ defaultMessage: 'Data Labels', description: '[highcharts] Label for toggling showing data label'})} onChange={this.handleChange} />
	}

    handleChange = (e): void => {
		const status = e.target.checked;
		this.props.chartComponent.chart.update(_.set({}, this.attributePath, status), true);
		this.props.onUpdateUserOptions({dataLabels: status});
	}
}
