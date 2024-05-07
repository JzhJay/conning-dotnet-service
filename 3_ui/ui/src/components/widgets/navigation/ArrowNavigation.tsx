import {AnchorButton, Popover} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {Fragment} from 'react';
import * as React from 'react';
import {utility} from '../../../stores';
import {bp} from '../../index';
import * as css from './ArrowNavigation.css';

interface MyProps {
	canNavigateLeft: boolean;
	canNavigateRight: boolean;
	currentItem: string;
	pageMenu: JSX.Element;
	onPrevious: () => void;
	onNext: () => void;
}

@observer
export class ArrowNavigation extends React.Component<MyProps, {}> {
	popoverRef;

	render() {
		return <div className={css.navigation}>
			<AnchorButton className={bp.Classes.MINIMAL} disabled={!this.props.canNavigateLeft} icon="arrow-left" onClick={this.props.onPrevious}/>
			<Popover
				position={bp.Position.BOTTOM_LEFT}
				minimal
				hoverOpenDelay={300} hoverCloseDelay={600}
				interactionKind={bp.PopoverInteractionKind.CLICK}
				popoverClassName={classNames(css.popover, utility.doNotAutocloseClassname)}
				canEscapeKeyClose
				ref={ r => this.popoverRef = r }
				content={this.props.pageMenu}>
				<AnchorButton className={classNames(bp.Classes.MINIMAL, css.pageNumberButton)} rightIcon="caret-down" text={this.props.currentItem}/>
			</Popover>
			<AnchorButton className={bp.Classes.MINIMAL} disabled={!this.props.canNavigateRight} icon="arrow-right" onClick={this.props.onNext}/>
			{this.renderHotkeys()}
		</div>
	}

	renderHotkeys() {

		const hotkeys: bp.HotkeyConfig[] = [
			{
				global: true,
				combo: "mod + left",
				label: "Navigate To Previous Page",
				preventDefault: true,
				onKeyDown: (e: KeyboardEvent) => {
					e.preventDefault();
					if (this.props.canNavigateLeft)
						this.props.onPrevious();
				}
			},
			{
				global: true,
				combo: "mod + right",
				label: "Navigate To Next Page",
				preventDefault: true,
				onKeyDown: (e: KeyboardEvent) => {
					e.preventDefault();
					if (this.props.canNavigateRight)
						this.props.onNext();
				}
			}
		]

		return <bp.HotkeysTarget2 hotkeys={hotkeys}>{({ handleKeyDown, handleKeyUp }) => <Fragment />}</bp.HotkeysTarget2>;
	}
}