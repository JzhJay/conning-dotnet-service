import {inputSpecification, InputSpecificationComponent, Option} from 'components';
import {InputSpecificationUserOptions} from 'components/system/inputSpecification/models';
import {ItemSelection} from 'components/system/rsSimulation/reports/internal/input/ItemSelection';
import {TimeSelection} from 'components/system/rsSimulation/reports/internal/input/TimeSelection';
import {Reports} from 'stores';
import {PathSelection} from './input/PathSelection';
import {action, computed, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';

interface ReportsInputPageProps {
	reports: Reports;
	activePath: string[];
}

@observer
export class ReportsInputPage extends React.Component<ReportsInputPageProps, any> {

	@observable userOptions: InputSpecificationUserOptions = {};

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@computed get userInputs() {
		const {activePath, reports: {userInterface: {userInputs}}} = this.props;
		return _.get(userInputs, activePath.slice(0, activePath.length-1), {});
	}

	@computed get specification() {
		const {reports, activePath} = this.props;
		const interfaceOption = reports.findOption(activePath);
		const specification = inputSpecification(
			"reports", {options: {reports: interfaceOption}},
			this.userOptions.displayMode == "verbose",
			null,null, false);

		this. formatCustomizeUi(specification);
		return specification;
	}

	updateUserOptions = action((userOptions) => {
		const displayModeUpdated = this.userOptions.displayMode != userOptions.displayMode;
		if (displayModeUpdated) {
			// update spec?
		}
		_.assign(this.userOptions, userOptions);
	})

	applyUpdate = action(async (updates) => {
		const {activePath, reports} = this.props;
		let userInput = _.set({}, activePath.slice(0, activePath.length-1), updates);
		const response = await reports.updateUserInputs(userInput);


		// update spec?
	})

	@action onSelect() {}


	formatCustomizeUi = (option) => {
		const uiCustomizationType = _.get(option, "hints.uiCustomizationType");
		if (uiCustomizationType == "timeSelection") {
			delete option.hints.dimension;
			delete option.hints.gridLayoutDimension;
			option.customRenderer = (option: Option, data: any, path: string) =>
				<TimeSelection specificationOption={option} value={data} path={path} valueUpdater={this.applyUpdate}/>;

		} else if (uiCustomizationType == "pathSelection") {
			delete option.hints.dimension;
			delete option.hints.gridLayoutDimension;
			option.customRenderer = (option: Option, data: any, path: string) =>
				<PathSelection specificationOption={option} value={data} path={path} valueUpdater={this.applyUpdate}/>;
			
		} else {
			_.forEach(option.options, o => this.formatCustomizeUi(o));
		}
	}

	render() {
		const {reports} = this.props
		return <InputSpecificationComponent
			inputs={this.userInputs}
			applyUpdate={this.applyUpdate}
			validations={(reports.userInterface.validationMessages || []) as any}
			globalLists={null}
			axes={reports.userInterface.axes}
			userOptions={this.userOptions}
			updateUserOptions={this.updateUserOptions}
			allowClassicRenderMode={true}
			showViewTitle={false}
			renderSpecificationAsControl={true}
			// dynamicStructureRowPaths={this.dynamicStructureRowPaths}
			onSelect={this.onSelect}
			specification={this.specification} />;
	}
}