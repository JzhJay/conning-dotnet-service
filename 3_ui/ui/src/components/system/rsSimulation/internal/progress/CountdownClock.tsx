import {computed, makeObservable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import * as css from './CountdownClock.css';

@observer
export class CountdownClock extends React.Component<{title: string | React.ReactElement, seconds: number}, any> {

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@computed get second() {
		return this.formatValue(( this.props.seconds || 0 ) % 60);
	}

	@computed get minute() {
		return this.formatValue(Math.floor( ( this.props.seconds || 0 ) / 60 ) % 60);
	}

	@computed get hour() {
		return this.formatValue(Math.floor( ( this.props.seconds || 0 ) / 3600));
	}

	formatValue = (v: number) => (v < 10 ? `0${v}` : `${v}`);

	render() {
		const placeHolder = this.props.seconds == null ? "-" : null;

		return <div className={css.root}>
			<div className={css.timeValues}>{placeHolder || this.hour}</div>
			<div className={css.timeValues}>{placeHolder || this.minute}</div>
			<div className={css.timeValues}>{placeHolder || this.second}</div>
			<div className={css.timeTitle}><FormattedMessage defaultMessage="Hours" description="[Countdown] Label text for hours" /></div>
			<div className={css.timeTitle}><FormattedMessage defaultMessage="Minutes" description="[Countdown] Label text for Minutes" /></div>
			<div className={css.timeTitle}><FormattedMessage defaultMessage="Seconds" description="[Countdown] Label text for Seconds" /></div>
			<div className={css.title}>{this.props.title}</div>
		</div>;
	}
}