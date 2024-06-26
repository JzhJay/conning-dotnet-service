import {computed, reaction} from 'mobx';
import { observer } from "mobx-react";
import * as React from 'react';
import {appIcons, site} from 'stores';
import {AppIcon, bp} from 'components';
import * as css from './ApplicationBarErrorMessage.css';
import {ErrorMessageHandler} from 'common';

interface MyProps {
	errorMessages: string[];
	disabled?: boolean;
	toasterWhenUpdate?: boolean;
}

@observer
export class ApplicationBarErrorMessage extends React.Component<MyProps, {}> {
	previousLength = 0;
	_toDispose = [];

	componentDidMount(): void {
		const {errorMessages} = this.props;

		this.previousLength = errorMessages?.length;

		// Post a new error toast when new error messages are appended to list.
		this._toDispose.push(reaction(() => errorMessages?.length, () => {
			if (this.props.toasterWhenUpdate === true && errorMessages?.length > this.previousLength) {
				site.toaster.show({message: _.last(errorMessages), intent: bp.Intent.DANGER, timeout: 0});
			}
			this.previousLength = errorMessages?.length;
		}))
	}

	componentWillUnmount() {
		this._toDispose.forEach(d => d());
	}

	@computed get disabled() {
		return this.props.disabled == null ? this.tooltipsDisabled : this.props.disabled;
	}

	@computed get tooltipsDisabled() {
		return !this.errorMessages?.length;
	}

	@computed get errorMessages() {
		return _.filter(this.props.errorMessages, e => e != null && !!`${e}`);
	}

	@computed get tooltipsContent() {
		const errorMessages = this.errorMessages;
		if (this.tooltipsDisabled) {
			return null;
		} else if (errorMessages.length == 1 ) {
			return errorMessages[0];
		} else {
			return <ul>
				{_.map(errorMessages, (e, i) => <li key={`ApplicationErrorMessageBarItem_${i}`}>{e}</li>)}
			</ul>
		}
	}

	render() {
		if (this.disabled) {
			return null;
		}

		return <bp.Tooltip intent={bp.Intent.DANGER} className={css.root} content={this.tooltipsContent} disabled={this.tooltipsDisabled} >
			<AppIcon className={css.error} icon={appIcons.error} />
		</bp.Tooltip>
	}
}

@observer
export class ApplicationBarErrorMessageWithHandler extends React.Component<{ errorHandler: ErrorMessageHandler }, {}> {
	render() {
		return <ApplicationBarErrorMessage errorMessages={this.props.errorHandler.errorMessages} toasterWhenUpdate={true}  />;
	}
}