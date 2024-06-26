import {IconNames} from '@blueprintjs/icons';
import classNames from 'classnames';
import { bp } from "components";
import {i18n, site} from 'stores';

import * as css from "./CopyableText.css"

export class CopyableText extends React.Component<{text: string, disabled?: boolean, className?: string}, any> {

	onCopy = (e) => {
		e.stopPropagation();
		navigator.clipboard.writeText(this.props.text);
		site.toaster.show({ intent: bp.Intent.PRIMARY, message: i18n.intl.formatMessage(
			{defaultMessage: `"{text}" copied to clipboard.`, description: "[CopyableText] message after copied a object id to the clipboard"},
			{text: this.props.text}
		)});
	}

	render() {
		return <div className={classNames(this.props.className ,css.root)} onClick={this.onCopy}>
			<div>{this.props.text}</div>
			{this.props.disabled !== false && <bp.Tooltip className={css.tooltip} content={"Click to Copy to Clipboard"} minimal>
				<bp.Icon className={css.icon} icon={IconNames.DUPLICATE} size={10} />
			</bp.Tooltip>}
		</div>;
	}
}