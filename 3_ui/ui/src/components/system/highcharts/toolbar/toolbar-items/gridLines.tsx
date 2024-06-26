import {AppIcon, bp} from "components";
import type {ToolbarItemProps} from '../highchartsToolbar';
import {utility, appIcons, i18n} from 'stores';
import {GridlinesType} from 'stores/queryResult'
import {
	observable,
	autorun,
	reaction,
	toJS,
	computed,
	IReactionDisposer,
	makeObservable, action,
} from 'mobx';
import {observer} from 'mobx-react';
import {DropdownCycleButton} from '../../../../widgets';
import {Menu, MenuItem, Button} from '@blueprintjs/core';

@observer
export class GridLinesToolbarItem extends React.Component<ToolbarItemProps, {}> {
    _disposers: IReactionDisposer[] = [];

    @observable gridLineIcons = {
		[GridlinesType.None]:       'none',
		[GridlinesType.Horizontal]: 'horizontal',
		[GridlinesType.Vertical]:   'vertical',
		[GridlinesType.Both]:       'both'
	}

    gridLineIconsLabel = {
		[GridlinesType.None]: i18n.intl.formatMessage({ defaultMessage: 'None', description: '[highcharts] Toolbar function - Hide grid lines in chart' }),
		[GridlinesType.Horizontal]: i18n.intl.formatMessage({ defaultMessage: 'Horizontal', description: '[highcharts] Toolbar function - show only horizontal grid lines in chart' }),
		[GridlinesType.Vertical]: i18n.intl.formatMessage({ defaultMessage: 'Vertical', description: '[highcharts] Toolbar function - show only vertical grid lines in chart' }),
		[GridlinesType.Both]: i18n.intl.formatMessage({ defaultMessage: 'Both', description: '[highcharts] Toolbar function - show both horizontal and vertical grid lines in chart' })
	}

    @observable isInverted    = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentDidMount() {
		this._disposers.push(
			autorun(() => {
				if (this.isInverted !== this.props.userOptions.isInverted) {
					action(() => {
						let temp                                     = this.gridLineIcons[GridlinesType.Horizontal];
						this.gridLineIcons[GridlinesType.Horizontal] = this.gridLineIcons[GridlinesType.Vertical];
						this.gridLineIcons[GridlinesType.Vertical]   = temp;
						this.isInverted                              = this.props.userOptions.isInverted;
					})();
				}
			})
		);

	    action(() => { this.isInverted = this.props.userOptions.isInverted })();

		//Temp: incorrect default were previously set in beeswarm, correct those
		if (this.props.chartType == "beeswarm" &&  this.props.userOptions.gridLine == GridlinesType.Horizontal)
			this.props.onUpdateUserOptions({gridLine: GridlinesType.None});
	}

    get gridlineTypesForRender () {
		return this.props.chartType == "beeswarm" ?  [GridlinesType.None, GridlinesType.Vertical] : utility.enumerateEnum(GridlinesType);
	}

    componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

    render() {
		const {gridLine} = this.props.userOptions;

		// <Tooltip content={_.capitalize(GridlinesType[icon])} position={Position.RIGHT} key={icon}>

		return (<DropdownCycleButton
			className="grid-lines"
			title={i18n.intl.formatMessage({
				defaultMessage: "Cycle Grid Lines",
				description: '[Highcharts] Toolbar function - Switch different grid lines styles'
			})}
			menu={<Menu>
				{_.map(this.gridlineTypesForRender, (icon:GridlinesType) =>
						<MenuItem
							key={icon}
							active={icon === gridLine}
							labelElement={<AppIcon className="iconic-sm" icon={appIcons.chart.toolbar.gridLines}
							             iconicDataAttribute={{"data-grid-direction": this.gridLineIcons[icon]}}/>}
							text={this.gridLineIconsLabel[icon]}
							onClick={() => this.setGridline(icon)}>
						</MenuItem>
				)}
			</Menu>}
			buttonContent={
				<Button onClick={() => this.setGridline(null)}>
					<AppIcon className="iconic-sm" icon={appIcons.chart.toolbar.gridLines}
					      iconicDataAttribute={{"data-grid-direction": this.gridLineIcons[this.props.userOptions.gridLine]}}/>
				</Button>}
		/>);
	}

    setGridline = (gridLineType?: GridlinesType) => {
		// If no type is specified, use the next(after the selected type) grid line type in the
		// grid line icons object.
		if (gridLineType == null) {
			let foundGridline = false;

			for (let key of this.gridlineTypesForRender) {
				const gridKey = key;
				// Set the first type found to handle the wrap around case
				if (gridLineType == null)
					gridLineType = gridKey;

				// Use the next type after the selection type
				if (foundGridline) {
					gridLineType = gridKey;
					break;
				}

				foundGridline = (gridKey === this.props.userOptions.gridLine);
			}
		}

		this.props.onUpdateUserOptions({gridLine: gridLineType});

		this.props.chartComponent.extender.setGridlines(this.props.chartComponent.chart, gridLineType);
	}
}
