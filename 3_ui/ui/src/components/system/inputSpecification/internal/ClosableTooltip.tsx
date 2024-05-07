import { observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {bp} from 'components';
import * as css from './ClosableTooltip.css';

interface MyProps {
	tooltip: string;
	onClosed: () => void;
	position?: bp.Position;
}

@observer
export class ClosableTooltip extends React.Component<MyProps, {}> {
    @observable close: boolean = false; // Handles closing without tooltip being updated

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		return <bp.Tooltip
			content={<div className={css.clippedTooltip}>
				{this.props.tooltip}
				<bp.Button className={css.close} minimal icon="cross" onClick={() => {this.props.onClosed()}}/>
			</div>}
			isOpen={this.props.tooltip != null && this.close == false}
			className={css.root}
			intent={bp.Intent.PRIMARY}
			position={this.props.position}
			modifiers={{
				setPopperWidth: {
				enabled: true,
				order: 849,
				fn: (data) => {
					// Detect when popper reference is offscreen and close tooltip
					if (data.offsets.reference.top == 0 && data.offsets.reference.left == 0) {
						data.styles.display = "none";
						this.close = true;
					}
					return data;
				}
			}
			}}
		>
			{this.props.children}
		</bp.Tooltip>
	}
}