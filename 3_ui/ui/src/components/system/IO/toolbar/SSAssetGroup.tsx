import {AppIcon, bp, DropdownCycleButton} from "components";
import { action, makeObservable } from 'mobx';
import * as React from 'react';
import {utility, appIcons, IO, StrategySummaryUserOptions} from 'stores';
import {observer} from 'mobx-react';
import {Menu, MenuItem, Button, ButtonGroup, Checkbox} from '@blueprintjs/core';

interface MyProps {
	userOptions: StrategySummaryUserOptions;
	updateUserOptions: (userOptions) => void;
	visibleAssets(level);
	io: IO;
}

@observer
export class SSAssetGroupToolbarItem extends React.Component<MyProps, {}> {
    groups = ["Grouped", "Grouped", "Detail"];

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {groups, isEnabled} = this;
		const {enabledAssetGroupLevels} = this.props.userOptions;

		return (
			<div className="ui labeled input asset-group">
				<ButtonGroup className="ui labeled input">
					<div className="ui label">Asset Class:</div>
					{groups.map((g, l) => (<React.Fragment key={l}>
						<Checkbox checked={isEnabled(l) == true} indeterminate={isEnabled(l) == null} onChange={e => this.handleGroupChange(l, (e.target as HTMLInputElement).checked)}>{this.assetText(g, l)}</Checkbox>
						<span className={bp.Classes.NAVBAR_DIVIDER}/>
					</React.Fragment>))}
				</ButtonGroup>
			</div>
		);
	}

    assetText(group, level) {
		const {io} = this.props;
		return `${group} (\u2264 ${io.assetGroups(level, false).length})`
	}

    isEnabled = (level) => {
		const {io} = this.props;
		const {collapsedAssetGroupByLevel, enabledAssetGroupLevels} = this.props.userOptions;
		let allVisible = true;

		if (level > 0) {
			const visibleAssets   = this.props.visibleAssets(level);
			const availableLength = io.assetGroups(level, false).length;
			allVisible            = visibleAssets.length == availableLength ? true : visibleAssets.length == 0 ? false : null;
		}

		return allVisible == true || enabledAssetGroupLevels[level] == false ? enabledAssetGroupLevels[level] : allVisible;
	}

    @action handleGroupChange = (level, checked) => {
		const {io} = this.props;
		let update = {enabledAssetGroupLevels: Object.assign([...this.props.userOptions.enabledAssetGroupLevels], {[level]: checked})};

		if (level > 0)
			update["collapsedAssetGroupByLevel"] = Object.assign([...this.props.userOptions.collapsedAssetGroupByLevel], {[level - 1]: []});

		if (level == 2)
			update["collapsedAssetGroupByLevel"] = Object.assign([...update["collapsedAssetGroupByLevel"]], {[level - 2]: []});

		this.props.updateUserOptions(update);
	}
}
