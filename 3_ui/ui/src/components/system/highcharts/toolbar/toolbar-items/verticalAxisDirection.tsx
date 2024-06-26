import type {ToolbarItemProps} from '../highchartsToolbar';
import {i18n} from 'stores';
import {bp} from 'components'
import {VerticalAxisDirection} from 'stores/queryResult';
import {Position, Button} from '@blueprintjs/core';
import {observer} from 'mobx-react';

@observer
export class VerticalAxisDirectionToolbarItem extends React.Component<ToolbarItemProps, {}> {
	public addAccentProperty(svg) {
		$(svg).find("path").addClass("iconic-property-accent");
	}

	render() {
		return (
			<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({ defaultMessage: 'Flip Vertical Axis', description: '[highcharts] Toolbar function - Flip Vertical axis in chart' })}>
				<Button active={this.props.userOptions.verticalAxisDirection == "bottom"} disabled={this.props.chartType == "beeswarm" } className="verticalAxisDirection" onClick={e => this.switchDirection()} icon="arrows-vertical">
					{/*<Icon className="iconic-sm" systemIcon={icons.iconicArrowThick}*/}
					{/*iconicDataAttribute={{"data-direction":this.props.userOptions.verticalAxisDirection}}*/}
					{/*iconicCallback={this.addAccentProperty}/>*/}
					{/*<Icon className="verticalIcon iconic-sm" systemIcon={icons.iconicArrowThick}*/}
					{/*iconicDataAttribute={{"data-direction":"right"}}/>*/}
				</Button>
			</bp.Tooltip>
		);
	}

	switchDirection() {
		let direction: VerticalAxisDirection = (this.props.userOptions.verticalAxisDirection === "top") ? "bottom" : "top";
		this.props.onUpdateUserOptions({verticalAxisDirection: direction});

		this.setAxisDirection(direction)
	}

	setAxisDirection(direction: VerticalAxisDirection) {
		const {chartComponent: {extender}} = this.props;
		extender && extender.updateAxisDirection(direction === "bottom", false);
	}
}
