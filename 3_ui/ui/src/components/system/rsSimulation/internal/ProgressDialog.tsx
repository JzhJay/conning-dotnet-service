import * as classnames from 'classnames';
import {BlueprintDialog, bp} from 'components';
import type {ProgressMessage} from 'components/system/Progress/model';
import {computed, reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Progress} from 'semantic-ui-react';
import {i18n, site} from 'stores';

import * as css from './ProgressDialog.css';


@observer
export class ProgressDialog extends React.Component<{
	progress: ProgressMessage,
	title: string,
	icon?: bp.IconName | bp.MaybeElement,
	isCloseWhenComplete?: boolean,
	className?: string
}, any> {
	_dispose: Function[] = []

	constructor(props) {
		super(props);
		if (this.props.isCloseWhenComplete !== false) {
			this._dispose.push(reaction(() => this.status, s => {
				if (s == 'finished') {
					site.setDialogFn(null);
				}
			}));
		}
	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	@computed get status(): ('initial' | 'running' | 'finished' | 'exception') {
		const progress = this.props.progress
		if (!progress) {
			return 'initial';
		}
		return (progress.progress.denominator != progress.progress.numerator) ?
		       'running': (progress.type != "exception") ? 'finished': 'exception' ;
	}

	@computed get progress(): ProgressMessage {
		const progress = this.props.progress
		if (!progress) {
			const msg = i18n.intl.formatMessage({defaultMessage: "Waiting Progressing Start...", description: "[ProgressDialog] the default message when the message not come in yet"})
			return {
				type: "dummy",
				label: msg,
				currentMessage: msg,
				progress: {denominator: 0, numerator: 1}
			};
		}
		return progress;
	}

	render() {
		const {status, progress} = this;
		const {title, icon,className} = this.props;
		const disableExitFn = (status != 'finished' && status != 'exception');
		return <BlueprintDialog
			className={classnames(css.root, {[css.noFooter]: disableExitFn}, className)}
			title={title}
			icon={icon}
			canCancel={false}
			isCloseButtonShown={false}
			okDisabled={disableExitFn}
			{...{
				canOutsideClickClose: !disableExitFn
			}}
		>
			<Progress
				progress={true}
				value={progress.progress.numerator}
				total={progress.progress.denominator}
				precision={1}
				error={status == "exception"}
				color={status == "exception" ? "red" : "green"}
				autoSuccess
				active={true}
				label={progress.currentMessage}
			/>
			{this.props.children}
		</BlueprintDialog>;
	}

}