import {EfficientFrontierChartExtender} from 'components/system/highcharts/extenders';
import {appIcons} from '../../../../../stores/site/iconography';
import {AppIcon, bp} from '../../../../index';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {observer} from 'mobx-react';
import { FormattedMessage } from 'react-intl';

@observer
export class DonutSizeToolbarItem extends React.Component<ToolbarItemProps, {}> {
	input;

	constructor(props, state) {
		super(props, state);
	}

	render() {
		const {donutSize, showAdditionalPoints, showEfficientFrontier, showLambdaPoints} = this.props.userOptions;

		return (
			<span>
				{(showAdditionalPoints || showEfficientFrontier || showLambdaPoints) && <div className={bp.Classes.BUTTON_GROUP}>
					<label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}>
						<FormattedMessage defaultMessage="Donut Size:" description="[highcharts] Label for adjusting donut size" />
					</label>
					<div className="donut-size slider ui" title="Donut Size">
						<AppIcon className="iconic-sm" icon={appIcons.chart.toolbar.pie} style={{width: "10px"}}/>
						<input type="range" min={.5} max="4" step=".1" defaultValue={donutSize.toString()} ref={input => this.input = input} onChange={(e) => this.valueChanged()} />
						<AppIcon className="iconic-sm" icon={appIcons.chart.toolbar.pie}/>
					</div>
				</div>}
			</span>
		)
	}

	valueChanged = _.debounce(() => {
		const value = this.input.value;
		const {chartComponent:{chart}} = this.props;
		const extender = this.props.chartComponent.extender as EfficientFrontierChartExtender;

		this.props.chartComponent.onUpdateUserOptions({donutSize: value});

		chart.series.filter((s => s.type == "pie")).forEach((donut) => {
			donut.update({size: extender.defaultDonutSize * value}, false);
		})

		chart.redraw(false);
	}, 10);
}
