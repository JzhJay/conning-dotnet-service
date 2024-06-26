import {observer} from 'mobx-react';
import {site, NotificationEvent, user} from 'stores';
import gql from 'graphql-tag';
import {Subscription} from '@apollo/client/react/components';
import * as cg from '../../codegen/types';
import {apolloStore, billingGraph} from '../../stores';

@observer
export class DesktopNotifications extends React.Component<{}, {}> {

	render() {
		return user.currentUser ? (<Subscription
			shouldResubscribe={true}
			subscription={
				gql`
				  subscription onNotification {
				    notification {
				      userId, message, timeout, title
				    }
				  }
				`}>
			{({data, error, loading}) => {
				//console.log('subscription', loading, error, data);
				if (!loading && !error) {
					const {notification}: { notification: NotificationEvent } = data;
					if (user.settings.notifications.endpoints.desktop.enabled) {
						window.Push.create(notification.title, {body: notification.message});
					}
				}

				return null;
			}}
		</Subscription>) : null
	}
}