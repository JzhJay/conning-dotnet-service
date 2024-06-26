import type {IconName} from '@blueprintjs/core';
import { observer } from "mobx-react";
import { bp } from "../index";
import { AppIcon } from "../widgets/AppIcon";
import type { IApplicationIcon } from "../../stores/site/iconography/icons";
import { IButtonProps } from "@blueprintjs/core";
import * as css from './IconButton.css';

interface IconButtonProps {
	icon: IApplicationIcon;
	text?: string;
	active?: boolean;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	disabled?: boolean;
	className?: string;
	href?: string;
	rightIcon?: IconName | JSX.Element;
	minimal?: boolean;

	target?: string;
	download?: string;
	iconicDataAttribute?: any;
	iconicSize?: "sm" | "md" | "lg"
}

@observer
export class IconButton extends React.Component<IconButtonProps, {}> {
	render() {
		const { icon, text, className, rightIcon, iconicDataAttribute, iconicSize, ...rest} = this.props;
		const isHasDisabledAttr = typeof this.props.disabled !== 'undefined';
		const Button = rest.href != null || isHasDisabledAttr ? bp.AnchorButton : bp.Button;

		return <Button className={classNames(className, css.iconButton)} {...rest}>
			<AppIcon key={icon.name} className={iconicSize ? `iconic-${iconicSize}` : "iconic-sm"} icon={icon} iconicDataAttribute={iconicDataAttribute}/>
			{text && <span className={bp.Classes.BUTTON_TEXT}>{text}</span>}
			{rightIcon && ((typeof rightIcon === 'string') ? <bp.Icon className={classNames(bp.Classes.ALIGN_RIGHT)} icon={rightIcon} /> : rightIcon)}
		</Button>
	}
}