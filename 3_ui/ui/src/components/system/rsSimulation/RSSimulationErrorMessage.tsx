import {Intent, Menu, MenuItem, Popover, Switch, Tooltip} from '@blueprintjs/core';
import {reaction} from 'mobx';
import { observer } from "mobx-react";
import * as React from 'react';
import {appIcons, RSSimulation, site} from 'stores';
import {AppIcon, bp} from 'components';
import * as css from './RSSimulationErrorMessage.css';

interface MyProps {
	rsSimulation: RSSimulation;
}

@observer
export class RSSimulationErrorMessage extends React.Component<MyProps, {}> {
	previousLength = 0;
	_toDispose = [];

	componentDidMount(): void {
		const {rsSimulation} = this.props;

		this.previousLength = rsSimulation.errorMessages.length;

		// Post a new error toast when new error messages are appended to list.
		this._toDispose.push(reaction(() => rsSimulation.errorMessages.length, () => {
			if (rsSimulation.errorMessages.length > this.previousLength) {
				site.toaster.show({message: _.last(rsSimulation.errorMessages), intent: Intent.DANGER, timeout: 0});
			}
			this.previousLength = rsSimulation.errorMessages.length;
		}))
	}

	render() {
		const {errorMessages} = this.props.rsSimulation;
		return errorMessages.length > 0 ? <Tooltip
			intent={bp.Intent.DANGER}
			className={css.root}
			content={
				<ul>
					{errorMessages.map((e, i) => <li key={i}>{e}</li>)}
				</ul>}>

			{<AppIcon className={css.error} icon={appIcons.investmentOptimizationTool.error} />}
		</Tooltip> : null
	}

	componentWillUnmount() {
		this._toDispose.forEach(d => d());
	}
}
