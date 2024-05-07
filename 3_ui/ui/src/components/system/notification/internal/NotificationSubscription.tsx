import * as css from './NotificationSubscription.css'
import {Observer, observer} from 'mobx-react';
import {bp} from 'components'
import {api, NotificationDescriptor, notificationGraph, NotificationTriggerDefinition, site, user, i18n} from 'stores';
import type {IconName} from '@blueprintjs/core';
import {Checkbox, ControlGroup, Icon, Label, NumericInput, FormGroup, Tooltip} from '@blueprintjs/core';

interface MyProps {
	details?: React.ReactNode;
	target: NotificationDescriptor;
	trigger: NotificationTriggerDefinition;
	subscription?: api.NotificationSubscription;
	iconSize?: number;
	loading?: boolean;
	onChange: (change: { email?: boolean, mobile?: boolean, desktop?: boolean, extra?: any }) => void;
}

//class ModifySubscriptionMutation extends Mutation<Query, {}>
@observer
export class NotificationSubscription extends React.Component<MyProps, {}> {
	static defaultProps = {
		iconSize: 14,
		loading: true
	}

	render() {
		let {onChange, loading, target, trigger, details, subscription, iconSize} = this.props;

		const email          = subscription && subscription.email;
		const emailSecondary = subscription && subscription.emailSecondary;
		const mobile         = subscription && subscription.mobile;
		const desktop        = subscription && subscription.desktop;
		var extra            = subscription && subscription.extra;
		var disabled         = loading;
		const {endpoints}    = user.settings.notifications;

		if (extra == null && trigger.params != null) {
			extra = {};
			trigger.params.forEach(p => extra[p.name] = p.defaultValue);
		}
		return (
			<div className={css.root}>
				<div className={css.row}>
					<div className={css.description}>
					<Tooltip content={_.startCase(trigger.severity)}>
						<Icon className={css.severity}
						      icon={(trigger.severity == 'error' ? 'error' : `${trigger.severity}-sign`) as IconName}
						      intent={trigger.severity == 'error' ? bp.Intent.DANGER :
						              trigger.severity == 'warning' ? bp.Intent.WARNING : bp.Intent.PRIMARY }/>
					</Tooltip>
					<span className={css.descriptionText}>
						{trigger.descr}
					</span>
					</div>

					<div className={css.endpoints}>
						<FormGroup className={bp.Classes.VERTICAL}>
							<ControlGroup>
								<Checkbox label={i18n.intl.formatMessage({defaultMessage: "Email", description: "Identifies the type of notification"})}
								          disabled={disabled || !endpoints.email.enabled}
								          checked={email == true}
									      onClick={() => onChange({ email: !email, extra: extra})}/>
								{/*<Icon icon={'envelope'} iconSize={iconSize}/>*/}
							</ControlGroup>

							{/*{false && endpoints.email.useAlternateEmail && <ControlGroup>*/}
							{/*<Checkbox label='Secondary E-mail'*/}
							{/*disabled={disabled}*/}
							{/*checked={emailSecondary == true}*/}
							{/*onClick={() => toggleNotification({emailSecondary: !emailSecondary})}/>*/}
							{/*/!*<Icon icon={'envelope'} iconSize={iconSize}/>*!/*/}
							{/*</ControlGroup>}*/}
						</FormGroup>

						{/*<FormGroup className={bp.Classes.VERTICAL}>*/}
						{/*	<ControlGroup>*/}
						{/*		<Checkbox label={i18n.intl.formatMessage({defaultMessage: "Text Message", description: "Identifies the type of notification"})}*/}
						{/*		          disabled={disabled || !endpoints.phone.enabled}*/}
						{/*		          checked={mobile == true}*/}
						{/*				  onClick={() => onChange({ mobile: !mobile, extra: extra})}/>*/}
						{/*		<Icon icon={'mobile-phone'} iconSize={iconSize}/>*/}
						{/*	</ControlGroup>*/}
						{/*</FormGroup>*/}

						<FormGroup className={bp.Classes.VERTICAL}>
							<ControlGroup>
								<Checkbox label={i18n.intl.formatMessage({defaultMessage: "Desktop", description: "Identifies the type of notification"})}
								          disabled={disabled || !endpoints.desktop.enabled}
								          checked={desktop == true}
								          onClick={() => onChange({desktop: !desktop, extra: extra})}/>
								{/*<Icon icon={'desktop'} iconSize={iconSize}/>*/}
							</ControlGroup>
						</FormGroup>
					</div>
				</div>

				{!_.isEmpty(trigger.params) && <div className={css.parameters}>
					<div className={css.detailsContainer}>
						<div className={css.params}>
							{trigger.params.map(
								p => (
									<FormGroup inline className={css.param} key={p.name}>
										<ControlGroup>
											<Label className={bp.Classes.INLINE}>{p.descr}</Label>
											{p.type == 'currency' && <><bp.Icon icon="dollar"/> <NumericInput disabled={disabled} stepSize={500} majorStepSize={500}
											                                                                  value={extra && extra[p.name] ? extra[p.name] : p.defaultValue}
											                                                                  onValueChange={(valueAsNumber, valueAsString) => onChange({extra: {[p.name]: valueAsString}})}
											/></>}
											{p.type == 'timespan' && <NumericInput disabled={disabled} min={1}
											                 value={extra && extra[p.name] ? extra[p.name] : p.defaultValue}
											                 onValueChange={(valueAsNumber, valueAsString) => onChange({extra: {[p.name]: valueAsString}})}
											 />}
										</ControlGroup>
									</FormGroup>))}
						</div>
					</div>
				</div>}
			</div>);
	}
}