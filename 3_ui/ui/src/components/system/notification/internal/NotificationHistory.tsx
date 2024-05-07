import {QueryResult} from '@apollo/client';
import {Query} from '@apollo/client/react/components';
import {api, apolloStore} from '../../../../stores';
import * as css from './NotificationHistory.css'
import {observer} from 'mobx-react';
import {bp} from 'components'
import {FormattedMessage} from 'react-intl';

interface MyProps {

}

@observer
export class NotificationHistoryComponent extends React.Component<MyProps, {}> {
	render() {
		return (
			<Query query={apolloStore.graph.notification.sent.loadSentNotifications}>
				{({loading, error, data}: QueryResult<{ notification: { sent: api.SentNotification[] } }>) =>
					<div className={css.root}>
						<table className={classNames(bp.Classes.HTML_TABLE, bp.Classes.HTML_TABLE_STRIPED, css.notificationTable)}>
							<thead>
							<tr>
								<th><FormattedMessage defaultMessage={"Title"} description="Table header for the title/subject of the notification that was sent" /></th>
								<th><FormattedMessage defaultMessage={"Sent Time"} description="The time the notification was sent" /></th>
								<th><FormattedMessage defaultMessage={"Subscription Type"} description="Delivery method used for the notification: Email, Text or Desktop" /></th>
								<th><FormattedMessage defaultMessage={"Delivered To"} description="Email address or phone number where the notification was sent" /></th>
								<th><FormattedMessage defaultMessage={"Status"} description="Notification sent status: Sent or Failed" /></th>
							</tr>
							</thead>
							<tbody>
							{!loading && !error && data.notification.sent.map(sn => {
								return (
									<tr key={sn._id}>
										<td>{sn.title}</td>
										<td>{new Date(sn.sentTime).toLocaleString()}</td>
										<td>{sn.endpoint.type.capitalize()}</td>
										<td>{sn.endpoint.value}</td>
										<td>{sn.delivered != false ? "Sent" : "Failed"}</td>
									</tr>)
							})}
							</tbody>
						</table>
					</div>}
			</Query>
		);
	}
}
