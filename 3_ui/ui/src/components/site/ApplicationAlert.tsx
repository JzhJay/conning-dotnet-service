import { bp } from 'components';
import {i18n} from 'stores';
import * as css from './ApplicationAlert.css';
import { observer } from "mobx-react";

export interface ApplicationAlertProps {
	resolve: (boolean) => void,
	reject: () => void,
	message: string | React.ReactNode,
	description?: React.ReactNode | string,
	icon?: React.ReactNode,
	okLabel?: string,
	cancelLabel?: string | false
}

@observer
export class ApplicationAlert extends React.Component<ApplicationAlertProps & {onConfirm: () => void, onCancel: () => void}, {}> {
	render() {
		const {okLabel, cancelLabel, message, description, icon, onConfirm, onCancel} = this.props;

		const canCancel = cancelLabel !== false;

		const okBtnText = okLabel || i18n.common.DIALOG.OK;
		const cancelBtnText = cancelLabel || i18n.common.DIALOG.CANCEL;

		return <bp.Alert
			intent={bp.Intent.PRIMARY}
			isOpen={alert != null}
			className={css.alert}
			confirmButtonText={okBtnText}
			onConfirm={onConfirm}
			cancelButtonText={canCancel ? cancelBtnText : undefined}
			onCancel={canCancel ? onCancel : undefined}>
			{icon && <div className={css.icon}>{icon}</div>}
			<div className={css.text}>
				<div className={css.message}>
					{message}
				</div>

				{description && <div className={css.description}>{description}</div>}
			</div>
		</bp.Alert>
	}
}