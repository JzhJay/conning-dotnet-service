import {AnchorButton, PopoverInteractionKind, Position, Popover, MenuItem, Menu, MenuDivider, Tooltip, ButtonGroup} from '@blueprintjs/core';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import * as css from './DropdownCycleButton.css';

interface DropdownCycleButtonProps {
	buttonContent?: JSX.Element | number | string;
	onCycle?: () => void;
	className?: string;
	menu?: JSX.Element;
	label?: string;
	title?: string;
}

@observer
export class DropdownCycleButton extends React.Component<DropdownCycleButtonProps, {}> {
	render() {
		const { title, buttonContent, onCycle, menu, className, label } = this.props;

		return (
			<div className={classNames(css.root, className)}>
				{label && <span className={css.label}>{label}</span>}

				<ButtonGroup>
					<Tooltip position={Position.BOTTOM}
					         content={title}>
						{buttonContent}
					</Tooltip>
					<Popover position={Position.BOTTOM_RIGHT}
					         interactionKind={PopoverInteractionKind.CLICK}
					         content={menu}
					         popoverClassName={css.popover}>
						<AnchorButton
							className={css.button}
							rightIcon="caret-down"/>
					</Popover>
				</ButtonGroup>
			</div>);
	}
}

