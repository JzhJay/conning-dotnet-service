import {AnchorButton, Popover, Switch} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import { action, makeObservable } from 'mobx';
import * as React from 'react';
import {AssetClassInput} from '../AssetClassInput';
import {bp} from 'components';
import {utility} from 'stores';
import * as css from '../AssetClassInput.css';

@observer
export class CellOptions extends React.Component<{assetClassInput: AssetClassInput}, {}> {
    constructor(props: {assetClassInput: AssetClassInput}) {
        super(props);
        makeObservable(this);
    }

    renderMenu() {
		const {assetClassInput} = this.props;

		return <bp.Menu className={css.optionsMenu}>
			<bp.MenuItem disabled={true} text="">
				<bp.MenuItem text="" />
			</bp.MenuItem>
			<Switch defaultChecked={assetClassInput.cellFormatOptions.inlineValidations} label={"Inline Validations"} onChange={() => this.toggleOption("inlineValidations")}/>
			<Switch defaultChecked={assetClassInput.cellFormatOptions.rowReorder} label={"Row Reorder"} onChange={() => this.toggleOption("rowReorder")}/>
			<Switch defaultChecked={assetClassInput.cellFormatOptions.advancedFormatting} label={"Advanced Formatting"} onChange={() => this.toggleOption("advancedFormatting")}/>
			<Switch defaultChecked={assetClassInput.cellFormatOptions.extendAssetColor} label={"Extend Asset Class Color Across Row"} onChange={() => this.toggleOption("extendAssetColor")}/>
		</bp.Menu>
	}

    @action toggleOption = (option) => {
		const {cellFormatOptions} = this.props.assetClassInput;
		cellFormatOptions[option] = !cellFormatOptions[option];
		this.props.assetClassInput.grid.refresh();
	}

    render() {
		return <Popover
			className={css.options}
			position={bp.Position.BOTTOM_LEFT}
			minimal
			hoverOpenDelay={300} hoverCloseDelay={600}
			interactionKind={bp.PopoverInteractionKind.CLICK}
			popoverClassName={classNames(css.popover, utility.doNotAutocloseClassname)}
			canEscapeKeyClose
			content={this.renderMenu()}>
			<AnchorButton text="Cell Options" onClick={() => {}}/>
		</Popover>
	}
}