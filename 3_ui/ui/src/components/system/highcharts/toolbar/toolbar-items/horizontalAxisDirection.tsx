import {IO} from '../../../../../stores/io';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {bp} from 'components'
import {HorizontalAxisDirection} from 'stores/queryResult';
import {Position, Button} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {i18n} from 'stores';

@observer
export class HorizontalAxisDirectionToolbarItem extends React.Component<ToolbarItemProps, {}> {
	public addAccentProperty(svg) {
		$(svg).find("path").addClass("iconic-property-accent");
	}

	get horizontalAxisDirection() {
		const {chartingResult} = this.props.chartComponent.props;

		return this.props.userOptions.horizontalAxisDirection == null && chartingResult instanceof IO ? chartingResult.horizontalAxisDirectionDefault : this.props.userOptions.horizontalAxisDirection;
	}

	render() {
		return (
			<bp.Tooltip position={bp.Position.BOTTOM} content={ i18n.intl.formatMessage({ defaultMessage: 'Flip Horizontal Axis', description: '[highcharts] Toolbar function - Flip horizontal axis in chart' })}>
				<Button active={this.horizontalAxisDirection == "right"} disabled={this.props.chartType == "beeswarm" } className="horizontalAxisDirection" onClick={e => this.switchDirection()} icon="arrows-horizontal">
				</Button>
			</bp.Tooltip>
		);
	}

	switchDirection() {
		let direction: HorizontalAxisDirection = (this.horizontalAxisDirection === "left") ? "right" : "left";
		this.props.onUpdateUserOptions({horizontalAxisDirection: direction});

		this.setAxisDirection(direction)
	}

	setAxisDirection(direction: HorizontalAxisDirection) {
		const {chartComponent: {extender}} = this.props;
		extender && extender.updateAxisDirection(direction === "right", true);
	}
}
