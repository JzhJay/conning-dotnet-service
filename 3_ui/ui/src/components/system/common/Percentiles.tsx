import {reaction} from 'mobx';
import * as React from 'react';
import {observer} from 'mobx-react';
import { ButtonGroup } from '@blueprintjs/core';

import { utility, i18n } from 'stores';

interface MyProps {
	userOptions: {percentiles?: number[]};
	updateUserOptions: (userOptions) => void;
	updatePercentiles: () => void;
	semicolonToDisableMirroring?: boolean;
}

@observer
export class PercentilesToolbarItem extends React.Component<MyProps, {}> {
	input;
	_dispose:Function[] = [];

	constructor(props) {
		super(props);

		this._dispose.push( reaction( ()=> this.props.userOptions?.percentiles, () => this.updatePercentiles()));
	}

	componentWillUnmount() {
		this._dispose.forEach(f => f());
	}

	get formatInput() {
		let percentiles = this.props.userOptions?.percentiles;
		if (!percentiles || percentiles.length == 0) {
			return '';
		}

		if (percentiles[percentiles.length-1] as any == ';') {
			percentiles = [...percentiles];
			percentiles.pop();
			return `${percentiles.join(', ')};`;
		}
		return percentiles.join(', ');
	}

	render() {
		return (
			<div className="ui labeled input percentiles">
				<ButtonGroup className="ui labeled input percentiles">
					<div className="ui label">
						{i18n.highcharts.toolbar.percentiles}
					</div>
					<input className="ui input"
					       ref={input => this.input = input}
					       onBlur={this.updatePercentiles}
					       onKeyDown={this.onKeyDown}
					       defaultValue={this.formatInput}/>
				</ButtonGroup>
			</div>
		)
	}

	onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === utility.KeyCode.Enter) {
			this.updatePercentiles();
		}
	}

	updatePercentiles = () => {
		try {
			let newValues: any[] = _.uniq(_.sortBy(_.filter(_.map(this.input.value.split(','), (v: string) => parseFloat(v)), (v) => !isNaN(v) && v >= 0 && v <= 100)));
			if (this.props.semicolonToDisableMirroring !== false && newValues.length > 0 && this.input.value.match(/\d+;$/)) {
				newValues.push(';');
			}

			if (!_.isEqual(newValues, this.props.userOptions.percentiles.slice())) {
				this.props.updateUserOptions({percentiles: newValues});
				this.props.updatePercentiles();
			}
			this.input.value = this.formatInput;
		}
		catch (error) {
			console.log(error);
		}
	}
}