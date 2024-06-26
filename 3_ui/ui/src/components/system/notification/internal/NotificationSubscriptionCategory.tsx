import * as css from './NotificationSubscriptionCategory.css'
import {observer} from 'mobx-react';
import {bp, sem} from 'components'
import {api, NotificationSeverity} from 'stores'
import {Button, Checkbox} from '@blueprintjs/core';
import { action, computed, observable, ObservableMap, makeObservable } from 'mobx';
import {NotificationSubscription} from './NotificationSubscription';
import {FormattedMessage} from 'react-intl';

const {Accordion, Icon} = sem;

interface MyProps {
	//index: number;
	loading?: boolean;
	active: boolean;
	onActivate: () => void;
	target: api.NotificationDescriptor,
	subscriptions: Array<api.NotificationSubscription>;
	onConfirmEdits: (changes: Array<api.NotificationSubscription>) => void;
}

@observer
export class NotificationSubscriptionCategory extends React.Component<MyProps, {}> {
    static defaultProps = {
		subscriptions: []
	}

    @observable changes = observable.map<string, { email?: boolean, mobile?: boolean, desktop?: boolean, extra?: any, severity:NotificationSeverity }>({}, {deep: false});
    @observable saving = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const {changes, saving, props: {loading, subscriptions, active, target, onActivate, onConfirmEdits}} = this;
		const enabledCount = !subscriptions ? '...' : subscriptions.filter(s => s.target == target.target && (s.mobile || s.email || s.desktop)).length;

		return (
			<>
				{/*<Reaction on={() => } />*/}
				<Accordion.Title active={active} index={0} onClick={() => onActivate()} className={classNames({active: active})}>
					<Icon name='dropdown'/>
					{target.descr}
					<span className={classNames(css.summary, {[css.loaded]: subscriptions != null})}>
						<FormattedMessage defaultMessage={"({enabledCount} of {total})"} description="number of items that are enabled from the total count of items availabe" values={{enabledCount, total: target.triggers.length}}/>
					</span>
				</Accordion.Title>
				<Accordion.Content active={active}>
					<Collapse isOpened={active}>
						{target.triggers.map(
							trigger =>
								<NotificationSubscription
									key={trigger.trigger}
									trigger={trigger}
									loading={loading}
									onChange={change => {
										changes.set(trigger.trigger, Object.assign({trigger: trigger.trigger, severity:trigger.severity}, changes.get(trigger.trigger), change));
										this.onSave();
									}}
									target={target}
									subscription={Object.assign({trigger: trigger.trigger, target: target.target},
										subscriptions.find(s => s.target == target.target && s.trigger == trigger.trigger),
										changes.get(trigger.trigger))}
								/>)}

						{false && changes.size > 0 &&
						<div className={css.actionFooter}>
							<Button disabled={saving} text="Cancel" large onClick={() => this.changes.clear()}/>
							<Button disabled={saving} text="Save" large intent={bp.Intent.PRIMARY} onClick={this.onSave} />
						</div>}
					</Collapse>
				</Accordion.Content>
			</>);
	}

    @action private onSave = () => {
		this.saving = true;
		setTimeout(async () => {
			await this.props.onConfirmEdits(Array.from(this.changes.values()));
			this.changes.clear();
			this.saving = false;
		}, 0);
	};
}
