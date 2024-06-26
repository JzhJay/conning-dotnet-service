import { MenuItemProps } from '@blueprintjs/core';
import { bp } from 'components';
import {unlockInputsConfirm} from 'utility';

interface LockMenuItemProps extends MenuItemProps{
	isLocked: boolean;
	objectType: string;
	canUnlock: boolean;
	clickUnlockFn: () => void;
}

export const LockMenuItem = (props: LockMenuItemProps): JSX.Element => {
	const { isLocked = false, objectType = "", canUnlock = true, clickUnlockFn = () => {},  ...restProps } = props;
	let lockProps = {};
	if (isLocked) {
		lockProps = { 
			labelElement: <bp.Icon icon="lock" />,
			onClick: canUnlock ? () => unlockInputsConfirm(objectType, clickUnlockFn) : null
		};

		if (!canUnlock) {
			lockProps['disabled'] = true;
		}
	}

	return <bp.MenuItem {...restProps} {...lockProps} />
};