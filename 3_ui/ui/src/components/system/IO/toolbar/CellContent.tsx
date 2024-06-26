import {AppIcon, bp, DropdownCycleButton} from "components";
import { action, makeObservable } from 'mobx';
import * as React from 'react';
import { IOView, DominanceUserOptions} from 'stores';
import {observer} from 'mobx-react';
import {Menu, MenuItem, Button, ButtonGroup} from '@blueprintjs/core';

interface MyProps {
	userOptions: DominanceUserOptions;
	updateUserOptions: (userOptions) => void;
	view: IOView;
}

@observer
export class CellContentToolbarItem extends React.Component<MyProps, {}> {
    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {toggleShowFraction} = this;
		const {showDominanceFractions} = this.props.userOptions;

		return (
			<div className="ui labeled input">
				<ButtonGroup className="ui labeled input">
					<div className="ui label">
						Cell Content:
					</div>
					<Button text={this.props.view.name == "pathWiseDominance" ? "PDF" : "CDF"} active={!showDominanceFractions} onClick={() => toggleShowFraction()}/>
					<Button text="Percentage" active={showDominanceFractions} onClick={() => toggleShowFraction()}/>
				</ButtonGroup>
			</div>
		);
	}

    @action toggleShowFraction = () => {
		this.props.updateUserOptions({showDominanceFractions: !this.props.userOptions.showDominanceFractions});
	}
}
