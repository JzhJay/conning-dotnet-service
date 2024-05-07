import {Button, Switch, Toaster} from '@blueprintjs/core';
import { observable, makeObservable } from 'mobx';
import {Mutation} from '@apollo/client/react/components';
import * as css from './NotificationEndpoints.css'
import {observer} from 'mobx-react';
import {bp, Push} from 'components'
import {notificationGraph, user} from 'stores'
import ReactTelInput from 'react-telephone-input';
import {FormattedMessage} from 'react-intl';
require("react-telephone-input/css/default.css")

interface MyProps {

}

@observer
export class NotificationEndpointsComponent extends React.Component<MyProps, {}> {
	toaster;

	onTestSent = (msg?:string) => {
		let toast = msg ? {
			icon: "error",
			intent: bp.Intent.DANGER,
			message: msg,
		} : {
			icon: "tick-circle",
			intent: bp.Intent.SUCCESS,
			message: "Test Message Sent.",
		}
		this.toaster.show(toast);
	}

	render() {
		return (
			<div className={css.root}>
				<table className={classNames(bp.Classes.HTML_TABLE, bp.Classes.HTML_TABLE_STRIPED)}>
					<thead>
					<tr>
						<th><FormattedMessage defaultMessage={"Notification Type"} description="Table header for the type of notification" /></th>
						<th><FormattedMessage defaultMessage={"Enable"} description="Table header for enabling notification" /></th>
						<th><FormattedMessage defaultMessage={"Test"} description="Table header for testing notifications" /></th>
						<th><FormattedMessage defaultMessage={"Deliver To"} description="Table header for setting notification delivery method" /></th>
					</tr>
					</thead>
					<tbody>
					<EditEmailEndpoint onTestSent={this.onTestSent}/>
					{/*<EditTextMessageEndpoint onTestSent={this.onTestSent}/>*/}
					<EditDesktopMessageEndpoint onTestSent={this.onTestSent}/>
					</tbody>
				</table>
				<Toaster ref={(r) => this.toaster = r} />
			</div>
		);
	}
}

@observer
class EditEmailEndpoint extends React.Component<{onTestSent:(string?) => void}, {}> {
    @observable changes: any = {}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const {settings: {notifications: {endpoints: {email}}}} = user;
		// const nickname = email.nickname ? email.nickname : 'Email';
		return <tr>
			<td style={{cursor: 'default'}}><FormattedMessage defaultMessage={"Email"} description="Identifies the type of notification" /></td>
			{/*<td><EditableText value={nickname} onConfirm={value => email.nickname = value}/></td>*/}
			<td><Switch checked={email.enabled} onChange={() => email.enabled = !email.enabled}/></td>
			<td>
				<Mutation mutation={notificationGraph.endpoints.sendTestEmail}>
					{(cb,result) => {
						return <Button icon="envelope" onClick={() => cb().then( r => this.props.onTestSent(r.data.notification.test.sendTestEmail))} disabled={result.loading}/>
					}}
				</Mutation>
			</td>
			<td>
				<span>{user.profile ? user.profile.email : '...'}</span>
			</td>
		</tr>
	}
}

@observer
class EditTextMessageEndpoint extends React.Component<{onTestSent:(string) => void}, {}> {
	phoneInputRef;

	toggleEnable = (enableDisabled, phone) => {
		if (!phone.enabled && enableDisabled) {
			$(ReactDOM.findDOMNode(this.phoneInputRef) as HTMLInputElement).find("input").get(0).focus();
		}
		else
			phone.enabled = !phone.enabled;
	}

	onSavePhoneNumber = (value) => {
		const {settings: {notifications: {endpoints: {phone}}}} = user;
		phone.phoneNumber = value.substring(1);
		if (phone.phoneNumber == "")
			phone.enabled = false;
	}

	getSendTextCallback = (cb) => {
		return async () => {
			const result = await cb();
			this.props.onTestSent(result.data.notification.test.sendTestText);
		};
	}

	render() {
		const {settings: {notifications: {endpoints: {phone}}}} = user;
		const disableActions = !phone.phoneNumber || phone.phoneNumber.length <= 1;

		//const nickname = phone.nickname ? phone.nickname : 'Text Message';

		return <tr>
			<td style={{cursor: 'default'}}><FormattedMessage defaultMessage={"Text Message"} description="Identifies the type of notification" /></td>
			{/*<td><EditableText value={nickname} onConfirm={value => phone.nickname = value}/></td>*/}
			<td><Switch checked={phone.enabled} onChange={() => this.toggleEnable(disableActions, phone)}/> </td>
			<td>
				<Mutation mutation={notificationGraph.endpoints.sendTestText}>
					{(cb) => <Button icon="mobile-phone" disabled={disableActions} onClick={this.getSendTextCallback(cb)}/>}
				</Mutation>
			</td>
			<td>
				<ReactTelInput ref={(r) => this.phoneInputRef = r} defaultCountry="us" flagsImagePath='../images/advise/flags.png' initialValue={phone.phoneNumber} onBlur={this.onSavePhoneNumber} onEnterKeyPress={(event) => this.onSavePhoneNumber(event.target.value)}/>
			</td>
		</tr>
	}
}

@observer
class EditDesktopMessageEndpoint extends React.Component<{onTestSent:() => void}, {}> {
	render() {
		const {settings: {notifications: {endpoints: {desktop}}}} = user;

		return <tr>
			<td style={{cursor: 'default'}}><FormattedMessage defaultMessage={"Desktop"} description="Identifies the type of notification" /></td>
			<td><Switch checked={desktop.enabled} onChange={() => desktop.enabled = !desktop.enabled}/></td>
			<td>
				<Button icon="desktop" onClick={() => {
					Push.create("Notification test message", {timeout: 5000});
					this.props.onTestSent();
				}}></Button>
			</td>
			<td></td>
		</tr>
	}
}
