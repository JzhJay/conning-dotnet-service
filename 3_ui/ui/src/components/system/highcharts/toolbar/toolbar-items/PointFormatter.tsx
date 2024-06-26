import {appIcons} from '../../../../../stores/site/iconography';
import {AppIcon, bp} from '../../../../index';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Switch, Popover, Button, Icon, IconName} from '@blueprintjs/core';
import * as css from './AllocationSelectionComponent.css'
import {PointStyle} from 'stores'

interface MyProps {
    pointStyle: PointStyle;
	updateStyle: (pointstyle:PointStyle) => void;
}

@observer
export class PointFormatter extends React.Component<MyProps, {}> {

    renderChooser() {
        const {color, opacity, radius, symbol} = this.props.pointStyle
        const {updateStyle} = this.props;

        return (
            <>
                <div>
                    {["circle", "triangle", "square", "diamond"].map((s, i) => <Button key={i} active={symbol == s} className={classNames(bp.Classes.MINIMAL)} icon={this.generateIcon(color, opacity, radius, s)} onClick={() => {updateStyle({'color': color, 'opacity': opacity, 'radius': radius, 'symbol': s})}} />)}
                </div>
                <div>
                    {["0,0,0", "186,21,21", "102,161,72", "124,181,236"].map((c, i) => <Button key={i} active={color == c} className={classNames(bp.Classes.MINIMAL)} icon={this.generateIcon(c, opacity, radius, symbol)} onClick={() => {updateStyle({'color': c, 'opacity': opacity, 'radius': radius, 'symbol': symbol})}} />)}
                </div>
                <div>
                    {[.25, .5, .75, 1].map((o, i) => <Button key={i} active={opacity == o} className={classNames(bp.Classes.MINIMAL)} icon={this.generateIcon(color, o, radius, symbol)} onClick={() => {updateStyle({'color': color, 'opacity': o, 'radius': radius, 'symbol': symbol})}} />)}
                </div>
                <div>
                    {[4, 5, 6, 7].map((r, i) => <Button key={i} active={radius == r} className={classNames(bp.Classes.MINIMAL)} icon={this.generateIcon(color, opacity, r, symbol)} onClick={() => {updateStyle({'color': color, 'opacity': opacity, 'radius': r, 'symbol': symbol})}} />)}
                </div>
            </>
        );
    }

	render() {
		return (
            <Popover
                position={bp.Position.RIGHT}
                className={css.pointFormatter}
                openOnTargetFocus={false}
                minimal
                hoverOpenDelay={300} hoverCloseDelay={600}
                interactionKind={bp.PopoverInteractionKind.HOVER}
                canEscapeKeyClose
                content={this.renderChooser()}>
                <Button className={classNames(bp.Classes.MINIMAL, css.contentPopoverButton)} icon="caret-right" onClick={() => {}}/>
            </Popover>
		);
	}

    generateIcon(color: string, opacity: number,radius: number, symbol: string) {
        let iconName = `symbol-${symbol}` as IconName;
        if (symbol === 'triangle')
            iconName = `symbol-triangle-up` as IconName;
        return (
            <Icon icon={iconName as IconName} color={`rgba(${color},${opacity})`} iconSize={radius * 4 - 4} />
        );
    }

}
