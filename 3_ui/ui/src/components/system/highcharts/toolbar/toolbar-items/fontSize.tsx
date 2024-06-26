import {AppIcon, bp} from "components";
import type {ToolbarItemProps} from '../highchartsToolbar';
import {appIcons, i18n} from 'stores';
import {Tooltip, Position, Popover, MenuItem, Menu, Button, ButtonGroup} from '@blueprintjs/core';
import {observer} from 'mobx-react';

@observer
export class FontSizeToolbarItem extends React.Component<ToolbarItemProps, {}> {
	componentDidMount() {
		// Initialize dropdown and set direction to downwards, to prevent the auto direction which
		// sometimes open the dropdown upwards which doesn't work since the chart and its parents don't allow overflowing.
		$(ReactDOM.findDOMNode(this)).find(".ui.dropdown").dropdown({direction: 'downward'});
	}

	componentDidUpdate() {
		// Set the dropdown selection
		let $dropdown = $(ReactDOM.findDOMNode(this)).find('.ui.dropdown');
		if (this.props.userOptions.fontSizes.indexOf(this.props.selectionFontSize) === -1) {
			// First clear the previous selection, then set only the text since the new value isn't in our font list.
			$dropdown.dropdown('clear');
			$dropdown.dropdown('set text', this.props.selectionFontSize);
		}
		else {
			$dropdown.dropdown('set selected', this.props.selectionFontSize);
		}
	}

	render() {
		const {userOptions, selectionFontSize} = this.props;

		return (
			<ButtonGroup className="font-size">
				<Popover position={Position.BOTTOM}
				         content={
					         <Menu className="bp3-fluid">
						         {_.map(userOptions.fontSizes, v => <MenuItem key={v} className="item" onClick={() => this.updateFontSize(v)} text={v.toString()}/>)}
					         </Menu>}>
					<Button text={selectionFontSize.toString()} rightIcon="caret-down"/>
				</Popover>

				<Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({ defaultMessage: 'Increase Font Size', description: '[highcharts] Toolbar function - Increase font size on chart'})}>
					<Button
						className="increase-font-size"
						onClick={() => this.changeFontSize('increase')}>
						<AppIcon className="iconic-sm"  icon={appIcons.chart.toolbar.fontSize} iconicDataAttribute={{"data-font-size-change": "bigger"}}/>
					</Button>
				</Tooltip>

				<Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({ defaultMessage: 'Decrease Font Size', description: '[highcharts] Toolbar function - Decrease font size on chart'})}>
					<Button
						className="decrease-font-size"
						onClick={() => this.changeFontSize('decrease')}>
						<AppIcon className="iconic-sm" icon={appIcons.chart.toolbar.fontSize} iconicDataAttribute={{"data-font-size-change": "smaller"}}/>
						{/* <InlineSVG src={iconUrls.fontSize} className="iconic" data-state=""/> */ }
					</Button>
				</Tooltip>
			</ButtonGroup>);
	}

	changeFontSize = (direction: 'increase' | 'decrease') => {
		const {chartComponent, userOptions, selectionFontSize} = this.props;

		chartComponent.extender.setFontSize(chartComponent.chart, userOptions.fontSizes, direction === 'increase', selectionFontSize);
	}

	updateFontSize = (value) => {
		const {chartComponent, userOptions} = this.props;
		chartComponent.extender.setFontSize(chartComponent.chart, userOptions.fontSizes, null, value);
	}
}

