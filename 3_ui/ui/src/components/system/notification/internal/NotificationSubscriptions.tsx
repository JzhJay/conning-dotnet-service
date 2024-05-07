import * as css from './NotificationSubscriptions.css'
import {observer} from 'mobx-react';
import {sem, LoadingIndicator, PanelSection} from 'components'
import type {NotificationScope} from 'stores'
import {api, notificationGraph, Simulation} from 'stores'
import { action, computed, observable, makeObservable } from 'mobx';
import {QueryResult, MutationFunction} from '@apollo/client';
import {Mutation, Query} from '@apollo/client/react/components';
import gql from 'graphql-tag';
import {NotificationSubscriptionCategory, NotificationSubscription} from './';
import {Checkbox, Tab, Tabs} from '@blueprintjs/core';
import {FormattedMessage} from 'react-intl';

const {Accordion, Icon} = sem;

interface MyProps {

}

@observer
export class NotificationSubscriptionsComponent extends React.Component<MyProps, {}> {
    @observable activeIndex        = 0;
    @observable subscriptionsClone = observable.array<api.NotificationSubscription>();
    @observable notificationScope:NotificationScope = 'user';

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    renderTitle() {
		return (<div className={css.eventTitle}>
					<span><FormattedMessage defaultMessage="Event Subscriptions" description="Title for notification events that the user is able to subscribe to"/></span>
					<div className={css.scope}>
						<span><FormattedMessage defaultMessage="Scope" description={"Label that describes the extent/coverage of a group of notification settings."}></FormattedMessage> </span>
						<Tabs id="TabsExample" onChange={(tabID:NotificationScope) => {this.notificationScope = tabID}} selectedTabId={this.notificationScope}>
							<Tab id="user" title={<FormattedMessage defaultMessage="User" description="Notification scope. This option signifies that the user should only receive notifications about their action"/>} />
							<Tab id="account" title={<FormattedMessage defaultMessage="Account" description="Notification scope. This option signifies that the user should receive all notifications related to their organization's account"/>}/>
							<Tabs.Expander />
						</Tabs>
					</div>
				</div>)
	}

    render() {
		const {activeIndex, notificationScope} = this;
		return (
			<PanelSection className={css.root} title={this.renderTitle()} collapsible={false}>
				<Query query={notificationGraph.subscriptions.loadSubscriptions} variables={{scope: notificationScope}}>
					{({loading, error, data}: QueryResult<{ notification: { subscriptions: api.NotificationSubscription[] } }>) => {
						error && console.error(error);
						//!loading && data && console.log(data.notification.subscriptions);
						if (!loading && !error) {
							// Create a copy of the server data so that the user can make changes and then cancel/save
							this.subscriptionsClone.replace(data.notification.subscriptions)
						}

						return (<div className={css.subscriptionGroups}>
								<Mutation mutation={notificationGraph.subscriptions.updateSubscriptions}>
									{mutate =>
										<Accordion exclusive={false}>
											{notificationGraph.descriptors.map(
												(target, i) => (
													<NotificationSubscriptionCategory
														target={target}
														onActivate={() => {
															if (i != this.activeIndex) {
																this.activeIndex = i;
															}
														}}
														loading={loading}
														onConfirmEdits={changes => this.onConfirmEdits(target, changes, mutate)}
														active={i == activeIndex}
														key={target.target}
														subscriptions={loading || error ? [] : this.subscriptionsClone.slice().filter(s => s.target == target.target)}/>))}
										</Accordion>
									}
								</Mutation>
							</div>
						);

					}}
				</Query>
			</PanelSection>);
	}

    handleClick = (e, titleProps) => {
		const {index}       = titleProps
		const {activeIndex} = this
		const newIndex      = activeIndex === index ? -1 : index

		this.activeIndex = newIndex;
	}

    private onConfirmEdits = async (target: api.NotificationDescriptor, changes: api.NotificationSubscription[], mutate: MutationFunction<any, { input: api.NotificationSubscription[] }>) => {
		await mutate({
			variables:      {input: changes.map(c => ({...c, target: target.target, scope: this.notificationScope}))},
			refetchQueries: [{query: notificationGraph.subscriptions.loadSubscriptions, variables: {scope:this.notificationScope}}]
		});
	}
}