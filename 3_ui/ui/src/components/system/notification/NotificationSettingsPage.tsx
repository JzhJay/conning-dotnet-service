import {Button, ButtonGroup, Checkbox, ControlGroup, Icon, Tooltip} from '@blueprintjs/core';
import { observable, makeObservable } from 'mobx';
import {bp, ApplicationPage, PanelSection, Push} from 'components'
import * as css from './NotificationSettingsPage.css';
import {
	ActiveTool,
	user,
	NotificationSubscriptionSetting,
	site, i18n
} from 'stores'
import {observer} from 'mobx-react';
import {NotificationEndpointsComponent, NotificationSubscriptionsComponent, NotificationHistoryComponent} from './internal';
import {FormattedMessage} from 'react-intl';

@observer
export class NotificationSettingsPage extends React.Component<{}, {}> {
	static get APPLICATION_TITLE() { return i18n.intl.formatMessage({defaultMessage: "Notification Settings", description:"[NotificationSettingsPage] the page title display on the browser tab, system application menu and the page's top-left button"}) }

	render() {
		return (
			<ApplicationPage className={css.root}
			                 tool={ActiveTool.notifications}
			                 title={() => NotificationSettingsPage.APPLICATION_TITLE}
			                 applicationButtonText={() => NotificationSettingsPage.APPLICATION_TITLE}
			>
				<NotificationSettingsTabPanel/>
			</ApplicationPage>);
	}
}

@observer
export class NotificationSettingsTabPanel extends React.Component<{}, {}> {
	pushNotificationTooltip(title) {
		return <Tooltip
			key="tooltip"
			content={<span style={{textAlign: 'center'}}>
				<FormattedMessage
					defaultMessage={"On-demand messages from our system<br></br>(Simulation events, billing alerts, etc)"}
					description="Describes the purpose of the page"
					values={{br: () => <br key={"br"}/>}}
				/>
			</span>}>
			<a>{title}</a>
		</Tooltip>
	}

	render() {
		/*
				 renderApplicationMenuItems={() => <>
										 <MenuItem icon='add' text="Add Notification" onClick={this.addSubscription} disabled={selectedSubscription != null}/>
										 <MenuDivider/>
									 </>}
									 loaded={notificationStore.loadedSubscriptions}
									 afterBreadcrumbs={() => (
										 <ButtonGroup>
											 <Tooltip content="Add Notification">
												 <Button icon="add" small className={css.add} onClick={this.addSubscription} disabled={selectedSubscription != null}/>
											</Tooltip>
										</ButtonGroup>
				)}
				*/

		const {settings: {notifications: {endpoints: {email, phone, desktop}, billing, simulation, system}}} = user;
		return (
			<div className={css.notificationSettings}>
				<span style={{marginTop: 10}}>
					<FormattedMessage
						defaultMessage={"Tell us how you\'d like to receive <PushNotificationTooltip>push notifications</PushNotificationTooltip> from {productName}."}
						description="Describes the purpose of the page"
						values={{productName: site.productName, PushNotificationTooltip: this.pushNotificationTooltip}}
					/>
				</span>

				<PanelSection
					title={<FormattedMessage defaultMessage="Delivery Methods" description={"Options for delivering notification messages, e.g. sms or email"}/>}
					collapsible={false}>
					<NotificationEndpointsComponent/>
				</PanelSection>

				<NotificationSubscriptionsComponent/>

				<PanelSection
					title={<FormattedMessage defaultMessage="History" description={"Title for a table that shows a log of all notifications sent by the application"}/>}
					className={css.notificationHistory}
					collapsible={false}>
					<NotificationHistoryComponent/>
				</PanelSection>

				{/*<NotificationSubscriptionsSettingsSection/>*/}
			</div>
		)
	}
}

