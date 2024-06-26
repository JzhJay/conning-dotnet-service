import * as React from 'react';
import {BaseOutputUserOptions} from 'stores';
import { observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {Switch, Menu, MenuDivider} from '@blueprintjs/core';
import * as css from './DatasetToolbarItemBase.css'
import {asyncAction} from 'utility';
import {DatasetInheritBase} from './DatasetInheritBase';

interface MyProps {
	toggleInherit: () => void;
	toggleFrontier: (updatedProps: ToggleCallbackProps) => void;
	toggleLambda: (updatedProps: ToggleCallbackProps) => void;
	toggleAdditionalPoints: () => void;
	toggleGroupAdditionalPoints?: () => void;
	userOptions: BaseOutputUserOptions;
	allowBothOff: boolean;
	additionalItems: JSX.Element;
	alwaysShowAdditionalItems?: boolean;
}

interface ToggleCallbackProps{
	showEfficientFrontier: boolean;
	showLambdaPoints: boolean;
}

@observer
export class DatasetToolbarItemBase extends React.Component<MyProps, {}> {
    // We cannot use the observables in the user options to update the frontier/lambda buttons,
    // since updating those seems to immediately re-render all chart, which blocks the button animation
    @observable switchShowEfficientFrontier = this.props.userOptions.showEfficientFrontier;
    @observable switchShowLambdaPoints = this.props.userOptions.showLambdaPoints;

    toggleFrontierThenAsyncAction = (f: (updatedProps: ToggleCallbackProps) => void) => {
		return () => {
			this.switchShowEfficientFrontier = !this.switchShowEfficientFrontier;
			if (this.props.allowBothOff)
				this.switchShowLambdaPoints = this.switchShowLambdaPoints && !this.switchShowEfficientFrontier;
			else
				this.switchShowLambdaPoints = !this.switchShowEfficientFrontier
			// Give the switch a chance to animate the change before running the action.
			setTimeout(() => f({showEfficientFrontier: this.switchShowEfficientFrontier ,showLambdaPoints: this.switchShowLambdaPoints}), 100);
		}
	}

    toggleLambdaThenAsyncAction = (f: (updatedProps: ToggleCallbackProps) => void) => {
		return () => {
			this.switchShowLambdaPoints = !this.switchShowLambdaPoints;
			if (this.props.allowBothOff)
				this.switchShowEfficientFrontier = !this.switchShowLambdaPoints && this.switchShowEfficientFrontier;
			else
				this.switchShowEfficientFrontier = !this.switchShowLambdaPoints
			// Give the switch a chance to animate the change before running the action.
			setTimeout(() => f({showEfficientFrontier: this.switchShowEfficientFrontier ,showLambdaPoints: this.switchShowLambdaPoints}), 100);
		}
	}

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    renderMenu() {
		const {toggleFrontier, toggleLambda, toggleAdditionalPoints, toggleGroupAdditionalPoints, allowBothOff, additionalItems } = this.props;
		const {shouldInheritData, showAdditionalPoints, showGroupAdditionalPoints } = this.props.userOptions;

		return (
			<Menu className={css.contentMenu}>
				{ !shouldInheritData && <>
                    <MenuDivider title="Points" className={css.hiddenDivider}/> {/* not be shown, but can made other divider title below shows correctly */}
					<Switch checked={this.switchShowEfficientFrontier} label="Sampled Efficient Frontier Points" onChange={this.toggleFrontierThenAsyncAction(toggleFrontier)} id="toggleFrontier"/>
					<Switch checked={allowBothOff ? this.switchShowLambdaPoints : !this.switchShowEfficientFrontier} label="Best Optimization Points" onChange={this.toggleLambdaThenAsyncAction(toggleLambda)} id="toggleLambda"/>
					<Switch defaultChecked={showAdditionalPoints} label="Additional Allocation Points" onChange={asyncAction(toggleAdditionalPoints)} id="toggleAdditionalPoints"/>
					{ toggleGroupAdditionalPoints && <Switch defaultChecked={showGroupAdditionalPoints} label="Group Additional Allocation Points" onChange={asyncAction(toggleGroupAdditionalPoints)} id="toggleGroupAdditionalPoints" disabled={!showAdditionalPoints} /> }
                </> }
				{additionalItems}
			</Menu>
		);
	}

    render() {
		return (
			<DatasetInheritBase userOptions={this.props.userOptions}
		                        toggleInherit={() => {this.props.toggleInherit(); this.switchShowEfficientFrontier = this.props.userOptions.showEfficientFrontier; this.switchShowLambdaPoints = this.props.userOptions.showLambdaPoints}}
								renderMenu={this.renderMenu.bind(this)}
								showSelectBtn={this.props.alwaysShowAdditionalItems || !this.props.userOptions.shouldInheritData} />
		);
	}
}
