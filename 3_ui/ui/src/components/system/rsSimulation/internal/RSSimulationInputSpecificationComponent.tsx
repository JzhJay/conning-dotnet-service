import {inputSpecification, InputSpecificationComponent, Option} from 'components';
import {DefinitionFileInput} from 'components/system/rsSimulation/RSSimulationApplication';
import {InputSpecificationUserOptions} from 'components/system/inputSpecification/models';
import {findOption} from 'components/system/IO/internal/inputs/utility';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RSSimulation} from 'stores';
import {formatLabelText} from 'utility';

interface RSSimulationInputSpecificationComponentProps {
	rsSimulation: RSSimulation;
	viewName:string;
	locationName?:string;
	userOptions: InputSpecificationUserOptions;
	updateUserOptions: (userOptions: InputSpecificationUserOptions) => void
}

@observer
export class RSSimulationInputSpecificationComponent extends React.Component<RSSimulationInputSpecificationComponentProps, any>{

	inputSpecificationPreProcess = (inputNode: Option) => {
		// if( !inputNode.applicable) {
		// 	inputNode.applicable = true;
		// 	inputNode.disableApplicable = true;
		// }

		if (inputNode.name == "startingDate") {
			inputNode.compactOverride = true;
			inputNode.inline = true;
		}

		if (inputNode.name === "fileFormat") {
			inputNode.indent = true;
			// Control titles don't respect the indent flag, and updating the render to handle that will break radio buttons.
			// So a new flag was added to handle indenting just the titles.
			inputNode.indentControlTitle = true;
		}
	}

	getInputSpecificationCustomComponent = (name:string) => {
		switch(name){
			case "definitionFile":
				return DefinitionFileInput;
		}
	}

	getInputSpecificationValidator = (control) => {
		if (control.name === 'scenarios') {
			return (inputValue) => {
				let isValid = true;
				if (inputValue.length > 0) {
					isValid = inputValue.split(',').every((value)=> {
						if (/^\s*\d+\s*$/.test(value)) {
							return true;
						} else if (/^\s*\d+\s*-\s*\d+\s*$/.test(value)) {
							return true;
						}
						return false;
					});
				}

				return {
					value: inputValue,
					message: isValid ? null : 'The scenario list must be a list of single scenarios or sets of contiguous scenarios indicated by hyphens, separated by commas, such as 1-3,5,7-10,15'
				};
			};
		}

		return null;
	}

	render() {
		const {rsSimulation, viewName, locationName, userOptions, updateUserOptions} = this.props;

		const specification = inputSpecification(
			viewName,
			{options: rsSimulation.inputOptions},
			userOptions.verboseMode,
			this.inputSpecificationPreProcess,
			this.getInputSpecificationCustomComponent
		);

		if (viewName == "scenarioContentNodes") {
			const addDefaultSuggestionToOptions = (options: Array<Option>) => {
				_.forEach(options, option => {
					if (option.hints?.maturity && option.name == "tenors") {
						option.hints = _.assign(option.hints || {}, {recentlyUsedList: RSSimulation.INPUT_DEFAULT_SUGGESTIONS["tenor"]})
					}
					addDefaultSuggestionToOptions(option.options);
				});
			}
			addDefaultSuggestionToOptions(specification.options);
		}

		if (viewName == "calibrationNodes" && rsSimulation.isFIRM) {
			let option = findOption(specification, ["enableDirectParameterViewingAndEditing"]);
			option.applicable = false;
		}

		if (locationName) {
			const headerLocationName = formatLabelText(locationName);
			const fmtLocationPath = (option) => {
				option.locationPath?.length && (option.locationPath[0] = headerLocationName)
				_.forEach(option.options, fmtLocationPath)
			};
			fmtLocationPath(specification);
		}

		return  <InputSpecificationComponent
			key={viewName}
			inputs={rsSimulation.userInputs}
			applyUpdate={rsSimulation.sendInputsUpdate}
			validations={{}}
			globalLists={null}
			axes={rsSimulation.axes}
			showViewTitle={false}
			userOptions={userOptions}
			additionalProps={{rsSimulation}}
			updateUserOptions={updateUserOptions}
			allowScrolling={true}
			specification={specification}
			getValidator={this.getInputSpecificationValidator}
		/>;
	}
}