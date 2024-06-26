import {AnchorButton, ButtonGroup, Menu, MenuItem, Popover, PopoverInteractionKind, Position, Tooltip} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {bp} from '../../index';
import * as css from './HorizonToolbarItem.css';

interface MyProps {
	numberOfHorizons:  number;
	userOptions: {[key: string]: any};
	setHorizon: (horizon: number) => void;
}

@observer
export class HorizonToolbarItem extends React.Component<MyProps, {}> {
	input;

	constructor(props, state) {
		super(props, state);
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (this.input && this.input.value != this.props.userOptions.horizon)
			this.input.value = this.props.userOptions.horizon;
	}

	lastOptionSetByDropdown = null;

	render() {
		const {horizon} = this.props.userOptions;
		const startFrom = 1;
		const numHorizons = this.props.numberOfHorizons;

		return (
			<span className={css.root}>
				<ButtonGroup className={"ui labeled input"}>
					<div className="ui label">Horizon:</div>
					<div className={classNames(css.slider, "ui input")} title="Horizon">
						<input key={this.lastOptionSetByDropdown} type="range" min={startFrom} max={numHorizons - 1} step="1" defaultValue={horizon.toString()} ref={input => this.input = input} onChange={(e) => this.valueChanged(e.target.value)} />
					</div>
					<Popover position={Position.BOTTOM_RIGHT}
					         interactionKind={PopoverInteractionKind.CLICK}
					         content={<Menu>
						         {_.range(startFrom, numHorizons).map( (option) =>
							         <MenuItem
								         key={option}
								         active={option === horizon}
								         text={option}
								         onClick={() => this.setHorizon(option, true)}>
							         </MenuItem>
						         )}
					         </Menu>}
					         popoverClassName={css.horizonMenu}>
						<AnchorButton
							className={css.button}
							text={horizon}
							rightIcon="caret-down"/>
					</Popover>
				</ButtonGroup>
			</span>
		)
	}

	setHorizon = (horizon: number, fromDropdown: boolean) => {
		this.props.setHorizon(horizon);

		// Save the last option set by dropdown so the slider can be synced. This approach is a lot smoother than making the slider a controlled component.
		if (fromDropdown)
			this.lastOptionSetByDropdown = horizon;
	}

	valueChanged = _.debounce((v) => {
		//this.input.value = value;
		const value = this.input.value;
		this.setHorizon(parseInt(value), false)
	}, 10);
}
