// interface ToolbarButtonsProps extends React.HTMLProps<ToolbarButtons> {
//
// }

import type {IApplicationIcon} from 'stores/site';
import {AppIcon} from 'components';

export class ToolbarButtons extends React.Component<React.HTMLProps<any>, {}> {
	render() {
		const {className, ref, children, ...htmlProps}  = this.props;

		return (<div className={classNames("toolbar-buttons", "ui buttons", className)}
			{...htmlProps}>
		</div>)
	}
}

interface ToolbarButtonProps extends React.HTMLProps<any> {
	disabled?: boolean;
	systemIcon?: IApplicationIcon;
}

export class ToolbarButton extends React.Component<ToolbarButtonProps, {}> {
	render() {
		const {systemIcon, children, className, disabled, ref, ...htmlProps}  = this.props;

		return (
			<button className={classNames(className, 'ui', 'button', {disabled: disabled})}
				{...htmlProps as any}>

				{systemIcon ? <AppIcon icon={systemIcon} /> : null}
				{children}
			</button>)
	}
}