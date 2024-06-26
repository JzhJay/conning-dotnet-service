import {PERCENTILE_COLORS} from "../../chartConstants"
import {bp, DropdownCycleButton} from 'components';
import type {ToolbarItemProps} from '../highchartsToolbar';
import { observable, action, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {Menu, MenuItem, Tooltip, Position} from '@blueprintjs/core';
import * as css from './percentileColors.css';

interface PercentileColorsProps extends ToolbarItemProps {
	colors?: Array<string[]>;
}

/**
 * A dropdown button for choosing the percentile colors
 *
 * Shown Left | Right when normal
 *
 *           Top
 * Shown     ---      when inverted
 *          Bottom
 **/
@observer
export class PercentileColorsToolbarItem extends React.Component<PercentileColorsProps, { selectedIndex: number }> {
	constructor(props, state) {
        super(props, state);

        makeObservable(this);

        if (this.props.chartType === 'cdf') {
			this.colors.push(null);
		}

        this.selectedIndex = _.findIndex(this.colors, (c) => _.isEqual(c, this.props.userOptions.colorSet.slice()));
    }

	@observable selectedIndex;
	            colors = _.cloneDeep(PERCENTILE_COLORS);

	render() {
		const {selectedIndex} = this;
		const {chartType}     = this.props;
		const {isInverted}    = this.props.userOptions;

		let leftRight             = !isInverted;
		let orientationCssClasses = [];
		if (_.includes(['cone', 'box'], chartType)) {
			leftRight = !leftRight;
			orientationCssClasses.push(css.invert);
		}

		let reverseColors = (chartType === 'cdf' && isInverted && !this.props.chartComponent.chart.yAxis[0].reversed);

		orientationCssClasses.push(leftRight ? css.leftRight : css.topBottom);

		return (
			<DropdownCycleButton
				className="percentile-colors"
				buttonContent={<ColorBoxes className={classNames(orientationCssClasses)}
				                           iconColors={this.colors[selectedIndex]}
				                           onClick={() => this.setColorViaButton()}
				                           reverseColors={reverseColors}/>}
				menu={<Menu>
					{_.map(this.colors, (c, i) =>
						<ColorBoxes key={i} className={classNames(...orientationCssClasses)}
						            isActive={i == this.selectedIndex}
						            iconColors={this.colors[i]}
						            isMenuItem={true}
						            reverseColors={reverseColors}
						            onClick={() => this.setColorIndex(i) }/>)}
				</Menu>}/>
		)
	}

	componentDidUpdate() {
		if (this.props.chartComponent.chart != null) {
			const {chartComponent} = this.props;
			const {selectedIndex}  = this;

			if (chartComponent && chartComponent.extender) {
				chartComponent.extender.setPercentileColor(this.colors[selectedIndex]);
			}
		}
	}

	setColorViaButton = () => {
		this.setColorIndex(this.selectedIndex + 1);
	}

	@action
	setColorIndex = (index: number) => {
		if (index >= this.colors.length)
			index = 0;

		//TODO: finish setting up userOptions related to percentile colors and reset selected.
		this.props.onUpdateUserOptions({colorSet: this.colors[index]});
		this.selectedIndex = index;
	}
}

interface ColorBoxesProps extends React.Props<ColorBoxes> {
	iconColors: string[];
	className?: string;
	reverseColors?: boolean;
	isActive?: boolean;
	isMenuItem?: boolean
	onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>;
}

class ColorBoxes extends React.Component<ColorBoxesProps, {}> {
	render() {
		let {iconColors, className, onClick, reverseColors,isActive, isMenuItem} = this.props;
		iconColors                                                      = _.clone(iconColors);

		if (iconColors == null)
			iconColors = ["255,255,255", "255,255,255"];

		if (reverseColors)
			iconColors = iconColors.reverse();

		const boxes = <div className={classNames(bp.Classes.BUTTON, css.colorBoxes, className)} onClick={onClick}>
			<div className={css.first} style={{backgroundColor: `rgb(${iconColors[0]})`}}/>
			<div className={css.second} style={{backgroundColor: `rgb(${iconColors[1]})`}}/>
		</div>;

		return isMenuItem ? <MenuItem onClick={onClick}
		                              text=""
		                              active={isActive}
		                              labelElement={boxes}/>
			: boxes;
	}
}
