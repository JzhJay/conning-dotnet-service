import {Intent, Tooltip} from '@blueprintjs/core';
import * as React from 'react';
import {appIcons, site} from 'stores';
import {AppIcon, bp} from 'components';
import * as css from './ApplicationBarWarningMessage.css';
import {useEffect} from 'react';

interface MyProps {
	message: string;
	showWarning: boolean;
}

export const ApplicationBarWarningMessage: React.FunctionComponent<MyProps> = (props) => {
	useEffect(() => {
		props.showWarning && site.toaster.show({message: props.message, intent: Intent.WARNING, timeout: 0});
	}, [props.showWarning]);

	return props.showWarning ? <div className={css.root}>
		<Tooltip
			intent={bp.Intent.WARNING}
			content={<span>{props.message}</span>}>
			{<AppIcon className={css.warning} icon={appIcons.warning} />}
		</Tooltip>
		{props.children}
	</div> : <>{props.children}</>;
}
