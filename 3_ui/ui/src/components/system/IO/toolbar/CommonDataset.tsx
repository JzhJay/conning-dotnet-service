import { action, makeObservable } from 'mobx';
import * as React from 'react';
import {BaseOutputUserOptions, IO, IOView} from '../../../../stores/io';
import {DatasetToolbarItemBase} from './DatasetToolbarItemBase';

interface MyProps {
	userOptions: BaseOutputUserOptions;
	view: IOView;
	io: IO;
	updateUserOptions: (userOptions: BaseOutputUserOptions) => void;
	additionalItems?: JSX.Element;
	alwaysShowAdditionalItems?: boolean;
}

export class CommonDatasetToolbarItem extends React.Component<MyProps, {}> {
    allowBothOff = true;

    @action
	toggleInherit = async () => {
		this.props.updateUserOptions({shouldInheritData: !this.props.userOptions.shouldInheritData});

		if (this.props.userOptions.shouldInheritData) {
			// Going from not inheriting to inheriting requires us to re-get the userOption which will take into account any inheritance targets.
			let userOptions = this.props.io.currentPage.getViewUserOptions(this.props.view.id);
			this.props.updateUserOptions({showEfficientFrontier: userOptions.showEfficientFrontier, showAdditionalPoints:  userOptions.showAdditionalPoints});
		}
	}

    @action toggleFrontierAndLambda = (updatedProps) => {
		this.props.updateUserOptions(updatedProps);
	}

    @action
	toggleAdditionalPoints = async () => {
		this.props.updateUserOptions({showAdditionalPoints: !this.props.userOptions.showAdditionalPoints});
	}

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		return <DatasetToolbarItemBase toggleInherit={this.toggleInherit} toggleFrontier={this.toggleFrontierAndLambda} toggleLambda={this.toggleFrontierAndLambda} toggleAdditionalPoints={this.toggleAdditionalPoints} userOptions={this.props.userOptions} allowBothOff={this.allowBothOff}
		                               additionalItems={this.props.additionalItems} alwaysShowAdditionalItems={this.props.alwaysShowAdditionalItems}/>
	}
}
