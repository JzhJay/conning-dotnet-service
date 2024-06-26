import gql from 'graphql-tag';
import {i18n} from '../i18n';
import {site} from '../site';
import {NotificationTarget, NotificationTriggerDefinition} from './NotificationModels';
import { get as _get } from 'lodash';

export type NotificationDescriptor = { target: NotificationTarget; descr: string; triggers: Array<NotificationTriggerDefinition> };

// TODO: Make these hard coded formatMessage a function or computable so they update if the language is changed.
const formattedHours = i18n.intl.formatMessage({defaultMessage: "Hours:", description: "Label for the number of hours a resource has to be on before sending a notification"});
const systemEventsDescriptor = {
	target:   'system',
	descr:    i18n.intl.formatMessage({defaultMessage: "System Events", description: "Grouping for all events that originates from the system/infrastructure"}),
	triggers: [
		{
			trigger: 'grid_uptime_threshold',
			severity: 'warning',
			descr:   i18n.intl.formatMessage({defaultMessage: "When a grid has been on for longer than specified:", description: "describes the notification event"}),
			params:  [{name: 'threshold', descr: formattedHours, type: 'timespan', defaultValue: '18'}]
		},

		{trigger: 'grid_on', severity: 'info', descr: i18n.intl.formatMessage({defaultMessage: "When a grid is powered on.", description: "describes the notification event"})},
		{trigger: 'grid_off', severity: 'info', descr: i18n.intl.formatMessage({defaultMessage: "When a grid is powered off.", description: "describes the notification event"})},

		// {trigger: 'grid_resized', descr: 'When a grid is resized.'},
		//
		// {trigger: 'cloudManager_start', descr: 'When the CloudManager process is started.'},
		// {trigger: 'cloudManager_stop', descr: 'When the CloudManager process is stopped.'},
	]
};
const simulationEventsDescriptor = {
	target:   'simulation',
	descr:    i18n.intl.formatMessage({defaultMessage: "Simulation Events", description: "Grouping for all events that originates from running a simulation"}),
	triggers: [
		{trigger: 'failed', severity: 'error', descr: i18n.intl.formatMessage({defaultMessage: "When a simulation encounters an error during generation.", description: "describes the notification event"})},
		{
			trigger: 'runtime_threshold',
			severity: 'warning',
			descr:   i18n.intl.formatMessage({defaultMessage: "When a simulation has been running for longer than specified:", description: "describes the notification event"}),
			params:  [{name: 'threshold', descr: formattedHours, type: 'timespan', defaultValue: '18'}]
		},
		{trigger: 'start', severity: 'info', descr:   i18n.intl.formatMessage({defaultMessage: "When a simulation begins.", description: "describes the notification event"})},
		{trigger: 'parse', severity: 'info', descr:   i18n.intl.formatMessage({defaultMessage: "When a simulation completes the 'parse' phase.", description: "describes the notification event"})},
		{trigger: 'compile', severity: 'info', descr:   i18n.intl.formatMessage({defaultMessage: "When a simulation completes the 'compile' phase.", description: "describes the notification event"})},
		{trigger: 'stored', severity: 'info', descr:   i18n.intl.formatMessage({defaultMessage: "When a simulation has finished writing to disk.", description: "describes the notification event"})},
	]
};

const billingEventsDescriptor =	{
	target:   'billing',
	descr:    i18n.intl.formatMessage({defaultMessage: "Billing Events", description: "Grouping for all events that originates from the current month's customer bill/charges"}),
	triggers: [
		{
			trigger: 'billing_usage_threshold',
			severity: 'info',
			descr:   i18n.intl.formatMessage({defaultMessage: "When bill has increased by a specified amount.", description: "describes the notification event"}),
			params:  [{name: 'threshold', descr: i18n.intl.formatMessage({defaultMessage: "Amount", description: "Label for the amount of USD the bill should have increased by before sending a notification"}), type: 'currency', defaultValue: '1000'}]
		}
	]
};

export const notificationGraph = {
	descriptors: (site.isMultiTenant ? [billingEventsDescriptor] : [systemEventsDescriptor, simulationEventsDescriptor, billingEventsDescriptor]
	) as Array<NotificationDescriptor>,
	subscriptions: {
		updateSubscriptions: gql`
			mutation updateSubscriptions($input : [ModifySubscriptionInput!]!) {
				notification {
					updateSubscriptions(subscriptions: $input) {
						_id, target, trigger,
						extra, email, mobile, desktop
					}
				}
			}`,

		loadSubscriptions: gql`
			query loadSubscriptions($scope:String!) {
				notification {
					subscriptions(scope:$scope) {
						_id
						target
						trigger,
						extra,
						email,
						mobile,
						desktop
					}
				}
			}`,
	},

	endpoints: {
		sendTestEmail: gql`
			mutation sendTextEmail {
				notification {
					test {
						sendTestEmail
					}
				}
			}
		`,
		sendTestText:  gql`
			mutation sendTextText {
				notification {
					test {
						sendTestText
					}
				}
			}
		`,
	},
	sent:      {
		loadSentNotifications: gql`
			query loadSentNotifications {
				notification {
					sent {
						_id
						delivered
						endpoint
						messageKey
						owner
						title
						sentTime
					}
				}
			}`
	}
}
