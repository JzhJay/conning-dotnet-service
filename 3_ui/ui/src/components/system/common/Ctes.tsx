import {bp} from 'components';
import * as React from 'react';
import {utility} from 'stores';
import {observer} from 'mobx-react';
import {Menu, MenuItem, Button, ButtonGroup, Checkbox} from '@blueprintjs/core';

interface MyProps {
	userOptions: {ctes?: Array<{area: string, percentile: number}>}
	updateUserOptions: (userOptions) => void;
	updateCtes: () => void;
}

@observer
export class CtesToolbarItem extends React.Component<MyProps, {}> {
	input;

	render() {
		const ctes = this.props.userOptions.ctes;
		const defaultValue = ctes && ctes.length && ctes.map( c => c != null ? (c.area == 'over' ? '>' : '<') + c.percentile : '').join(", ");
		return (
			<div className="ui labeled input percentiles">
				<ButtonGroup className="ui labeled input percentiles">
					<div className="ui label">
						CTEs:
					</div>
					<input className="ui input"
					       ref={input => this.input = input}
					       onBlur={this.updateCtes}
					       onKeyDown={this.onKeyDown}
					       defaultValue={defaultValue}/>
				</ButtonGroup>
			</div>
		)
	}

	onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === utility.KeyCode.Enter) {
			this.updateCtes();
		}
	}

	updateCtes = () => {
		try {
			let newValues = [];
			let inputValues = this.input.value.split(',');
			_.forEach(inputValues, (v: string) => {
				const area = v.match(/[<>]/) && v.match(/[<>]/)[0] == '>' ? 'over' : 'under';
				const percentile = v.match(/\d*\.?\d/) && parseFloat(v.match(/\d*\.?\d/)[0]);
				if (area && percentile && !isNaN(percentile) && percentile >= 0 && percentile <= 100) {
					const newValue = {area: area, percentile: percentile};
					if(newValues.findIndex( nv => _.isEqual(nv, newValue)) < 0) {
						newValues.push(newValue);
					}
				}
			});

			if (newValues.length) {
				this.props.updateUserOptions({ctes: newValues});
				this.input.value = this.props.userOptions.ctes.map( c => c != null ? (c.area == 'over' ? '>' : '<') + c.percentile : '').join(", ");
				this.props.updateCtes();
			}
		} catch (error) {
			console.log(error);
		}
	}
}