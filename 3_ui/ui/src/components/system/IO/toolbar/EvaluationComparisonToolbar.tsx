import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { Switch, MenuItem, MenuDivider } from '@blueprintjs/core';

import { bp } from "components";
import { ChartAxisMaximumType, TabularUserOptions, EvaluationComparisonUserOptions} from 'stores';
import {DatasetToolbarItemBase} from './DatasetToolbarItemBase';
import { SSRowsToolbarItem } from './SSRows';
import { IO } from '../../../../stores/io';

import * as css from './EvaluationComparisonToolbar.css';

interface MyProps {
	io: IO;
	userOptions: EvaluationComparisonUserOptions;
	onUpdateUserOptions: (userOptions: EvaluationComparisonUserOptions) => void;
}

@observer
export class EvaluationComparisonToolbar extends React.Component<MyProps> {
	allowBothOff: boolean = false;

	toggleInherit = () => {
		const { userOptions: { shouldInheritData, showEfficientFrontier, showLambdaPoints, showAdditionalPoints } } = this.props;

		const updateOptions: any = {
			shouldInheritData: !shouldInheritData,
		};

		if (!updateOptions.shouldInheritData) {
			updateOptions.showEfficientFrontier = showEfficientFrontier;
			updateOptions.showLambdaPoints = showLambdaPoints;
			updateOptions.showAdditionalPoints = showAdditionalPoints;
		}

		this.props.onUpdateUserOptions(updateOptions);
	}

	toggleFrontierAndLambda = (updatedProps) => {
		this.props.onUpdateUserOptions(updatedProps);
	}

	toggleAdditionalPoints = () => {
		const { userOptions: { showAdditionalPoints }} = this.props;
		this.props.onUpdateUserOptions({ showAdditionalPoints: !showAdditionalPoints });
	}

	updateEvaluationComparisonOptions(optionName, value) {
		return action((e) => {
			this.props.onUpdateUserOptions({
				evaluationComparisonOptions: {
					[optionName]: value
				}
			});
		});
	}

	renderAdditionalMenu() {
		const { userOptions, onUpdateUserOptions } = this.props;
		const { evaluationComparisonOptions = {}} = userOptions;
		const { 
			showTabular = true,
			showAllocationChart = true,
			showAllocationDiffChart = true,
			allocationChartAxisMaximum = ChartAxisMaximumType.Dynamic,
			allocationDiffChartAxisMaximum = ChartAxisMaximumType.Dynamic,
			showScenarioDominance = true,
			showStatisticDominance = true
		} = evaluationComparisonOptions;
		
		return (
			<>
				<MenuDivider />
				<MenuItem text={<Switch className={css.inputSwitch} checked={showTabular} name="toggleAssetClassTableBtn" label="Table" onChange={this.updateEvaluationComparisonOptions('showTabular', !showTabular)} />} 
				children={showTabular ? 
					<bp.Menu>
						<SSRowsToolbarItem userOptions={userOptions as TabularUserOptions} updateUserOptions={onUpdateUserOptions} />
					</bp.Menu> : null}
				shouldDismissPopover={false} />
				<MenuItem text={<Switch className={css.inputSwitch} checked={showAllocationChart} label="Allocation Comparison" onChange={this.updateEvaluationComparisonOptions('showAllocationChart', !showAllocationChart)} name="toggleAllocationComparisonChartBtn" />}
				children={showAllocationChart ? <bp.Menu>
					<MenuDivider className={css.menuDivider} title="Axis Maximum" />
					<Switch checked={allocationChartAxisMaximum === ChartAxisMaximumType.Dynamic} disabled={allocationChartAxisMaximum === ChartAxisMaximumType.Dynamic}  label="Dynamic" onChange={this.updateEvaluationComparisonOptions('allocationChartAxisMaximum', ChartAxisMaximumType.Dynamic)} name="axisDynamicBtn" />
					<Switch checked={allocationChartAxisMaximum === ChartAxisMaximumType.FixedAcross} disabled={allocationChartAxisMaximum === ChartAxisMaximumType.FixedAcross}  label="Fixed Across Allocations" onChange={this.updateEvaluationComparisonOptions('allocationChartAxisMaximum', ChartAxisMaximumType.FixedAcross)} name="axisFixedAcrossBtn" />
					<Switch className={css.inputSwitch} checked={allocationChartAxisMaximum === ChartAxisMaximumType.Fixed100} disabled={allocationChartAxisMaximum === ChartAxisMaximumType.Fixed100}  label="Fixed at 100%" onChange={this.updateEvaluationComparisonOptions('allocationChartAxisMaximum', ChartAxisMaximumType.Fixed100)} name="axisFixed100Btn" />
				</bp.Menu> : null} shouldDismissPopover={false}
				/>
				<MenuItem text={<Switch className={css.inputSwitch} checked={showAllocationDiffChart} label="Allocation Differences" onChange={this.updateEvaluationComparisonOptions('showAllocationDiffChart', !showAllocationDiffChart)} name="toggleAllocationDiffChartBtn" />}
				children={ showAllocationDiffChart ?
					<bp.Menu>
						<MenuDivider className={css.menuDivider} title="Axis Maximum" />
						<Switch checked={allocationDiffChartAxisMaximum === ChartAxisMaximumType.Dynamic} disabled={allocationDiffChartAxisMaximum === ChartAxisMaximumType.Dynamic} label="Dynamic" onChange={this.updateEvaluationComparisonOptions('allocationDiffChartAxisMaximum', ChartAxisMaximumType.Dynamic)} name="axisDynamicBtn" />
						<Switch checked={allocationDiffChartAxisMaximum === ChartAxisMaximumType.FixedAcross} disabled={allocationDiffChartAxisMaximum === ChartAxisMaximumType.FixedAcross} label="Fixed Across Allocations" onChange={this.updateEvaluationComparisonOptions('allocationDiffChartAxisMaximum', ChartAxisMaximumType.FixedAcross)} name="axisFixedAcrossBtn" />
						<Switch className={css.inputSwitch} checked={allocationDiffChartAxisMaximum === ChartAxisMaximumType.Fixed100}  disabled={allocationDiffChartAxisMaximum === ChartAxisMaximumType.Fixed100} label="Fixed at +/- 100%" onChange={this.updateEvaluationComparisonOptions('allocationDiffChartAxisMaximum', ChartAxisMaximumType.Fixed100)} name="axisFixed100Btn" />
					</bp.Menu> : null} shouldDismissPopover={false}
				/>
				<MenuItem text={<Switch className={css.inputSwitch} checked={showScenarioDominance} label="Scenario Dominance" onChange={this.updateEvaluationComparisonOptions('showScenarioDominance', !showScenarioDominance)} name="toggleScenarioDominanceChartBtn" />} shouldDismissPopover={false} />
				<MenuItem text={<Switch className={css.inputSwitch} checked={showStatisticDominance} label="Statistical Dominance" onChange={this.updateEvaluationComparisonOptions('showStatisticDominance', !showStatisticDominance)} name="toggleStatisticalDominanceChartBtn" />} shouldDismissPopover={false} />		
			</>
		);
    }

	render() {
		const { userOptions } = this.props;

		return (
			<DatasetToolbarItemBase userOptions={userOptions}
							toggleInherit={this.toggleInherit}
							toggleFrontier={this.toggleFrontierAndLambda}
							toggleLambda={this.toggleFrontierAndLambda}
							toggleAdditionalPoints={this.toggleAdditionalPoints}
							allowBothOff={this.allowBothOff}
							additionalItems={this.renderAdditionalMenu()} />
		);
	}
}
