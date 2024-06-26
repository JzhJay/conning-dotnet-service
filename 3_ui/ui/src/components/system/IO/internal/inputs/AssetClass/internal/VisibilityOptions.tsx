import {AnchorButton, Popover, Switch} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import { action, makeObservable } from 'mobx';
import * as React from 'react';
import {AssetClassInput, tableFields} from '../AssetClassInput';
import {bp} from 'components';
import {utility} from 'stores';
import * as css from '../AssetClassInput.css';

@observer
export class VisibilityOptions extends React.Component<{assetClassInput: AssetClassInput}, {}> {
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
			{tableFields(this.props.assetClassInput.props.io).filter(c => c.applicable).map(c => <Switch key={c.name}
			                                                                                             defaultChecked={assetClassInput.isSectionVisible(c.name)}
			                                                                                             label={c.menuLabel || c.label}
			                                                                                             onChange={() => this.toggleVisibility(c.name)}/> )}
		</bp.Menu>
	}

    @action toggleVisibility(name) {
		const {assetClassInput} = this.props;
		let hiddenSections = [...assetClassInput.userOptions.hiddenSections];
		const index = hiddenSections.indexOf(name);

		if (index == -1)
			hiddenSections.push(name);
		else
			hiddenSections.splice(index, 1);

		assetClassInput.updateUserOptions({hiddenSections});

		setTimeout(() => {
			assetClassInput.grid.autoSizeRows(0, assetClassInput.maxHeaderDepth, true); // Resize headers rows to fit content
		}, 0)
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
			<AnchorButton text="Select Content" onClick={() => {}}/>
		</Popover>
	}
}