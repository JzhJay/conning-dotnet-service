import {reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {IO, IOPage, IOView} from 'stores/io';
import {inputSpecification, InputSpecificationComponent} from 'components';
import type {InputSpecificationUserOptions} from '../../../inputSpecification/models';
import {CompanyData, DataSources, Scenarios, TimeHorizon} from './internal/DataSources';
import {InterestMaintenanceReserve} from './internal/InterestMaintenanceReserve';
import {InterestRates} from './internal/InterestRates';
import {OptimizationResources} from './internal/OptimizationResources';
import {RBCRatios} from './internal/RBCRatios';

interface MyProps {
    io: IO;
    page: IOPage;
    view: IOView;
    userOptions: InputSpecificationUserOptions;
}

@observer
export class IOInputSpecificationComponent extends React.Component<MyProps, {}> {

	_inputSpecificationComponentRef;
	_dispose = [];
	componentDidMount() {
		this._dispose.push(reaction(() => this.props.io.book.currentPageNumber, currentPageNumber => {
			if (currentPageNumber == this.props.page.pageNumber) {
				// wait page updated and re-counter the width of resizable input.
				setTimeout(this._inputSpecificationComponentRef.fixResizeableInputsWidth, 210);
			}
		}))
	}

	componentWillUnmount() {
		this._dispose.forEach( d => d() );
	}

    preProcess = (option) => {
        const inputOptions = this.props.io.getInputOptions();

        // Process common fields
        if (option.inputType == "userValue")
            return inputOptions.common.userValues;
        else if (option.inputType == "repositoryValue")
            return inputOptions.common.repositoryValues;
    }

    getCustomComponent = (name, verboseMode) => {
        switch (name){
            case "ratios": return RBCRatios;
            case "assetReturns": return DataSources;
            case "companyData": return CompanyData;
            case "timeHorizon": return TimeHorizon;
	        case "timeHorizonForRisk": return TimeHorizon;
            case "scenarios": return Scenarios;
            case "riskFreeRate": return InterestRates;
            case "hurdleRate": return InterestRates;
            case "borrowingRate": return InterestRates;
            case "awsInstanceQuantity": return verboseMode ? OptimizationResources : null;
        }
    }

    get specification() {
        const {io, view, userOptions, userOptions: {verboseMode}} = this.props;

        let inputOptions = io.getInputOptions();
        let inputOption = inputOptions.options[view.name];
        let uiSpec = inputSpecification(view.name, inputOptions, userOptions.verboseMode, this.preProcess, this.getCustomComponent as any);

        //debugger;

        switch (view.name) {
            case "optimizationTarget":
                uiSpec.options.forEach(option => {
                    option.inline = !verboseMode;

                    if (option.name == "rewardMeasure" || option.name == "riskMeasure") {
                        option.compactOverride = true;
                        option.inline = true;
                    }
                });

                return uiSpec;
            case "optimizationControls":
                uiSpec.options.forEach(option => {
                    option.inline = true;

                    if (option.inputType == "exclusive" && verboseMode) {
                        option.inline = false;
                    }
                    else if (option.name == "lambdas") {
                        // From 0.0 % to 100.0 % in increments of 2.0 % for a total of 51 lambdas
                        option.interpolate = "From {from} to {to} in increments of {increment} for a total of {quantity} lambdas";
                    }
                    else if (option.name == "numberOfRandomAllocations") {
                        // 50 per asset class for a total of 2800
                        option.interpolate = "{perAssetClass} per asset class for a total of {total}";
                    }
                });
                return uiSpec;
            case "optimizationResources":
                uiSpec.options.forEach(option => {
                    if (option.name == "awsInstances") {
                        option.inline = !verboseMode;
                        if (verboseMode) {
                            option.options.find(o => o.name == "awsInstanceSize").applicable = false;
                        }
                        else {
                            option.interpolate = "{awsInstanceClass} with {awsInstanceSize} vCPUs";
                        }
                    }
                    else if (option.name == "awsInstanceQuantity")
                        option.inline = !verboseMode;
                });
                return uiSpec;
            case "interestRates":
                let riskFreeRateIndex = uiSpec.options.findIndex(option => option.name == "riskFreeRate");
                let option = uiSpec.options[riskFreeRateIndex];

                // Split into 2 controls. The first is rendered by generic code and handles all non-custom options. The second renders the custom options
                let generic = {
                    ...option,
                    component: null,
                    inline: true,
                    compactOverride: true,
                    options: option.options.filter(o => ["economy", "tenor", "additiveSpread", "multiplicativeFactor"].indexOf(o.name) == -1).map(o => {
						return {...o};
                    })
                };
                option.showDescription = false;
                uiSpec.options.splice(riskFreeRateIndex, 0, generic);

                return uiSpec;
            case "assetValuesAndTrading":
                uiSpec.options.forEach(option => {
                    if (option.name == "scaleInitialAssetValues") {
                        // Indent all children except for child with matching name.
                        option.options.forEach(o => {
                            if (o.name == option.name) {
                                o.indent = false;
                                o.description = option.description;
                            }

                            o.inline = true;

                            if (o.name == "additiveValueFrom") {
                                o.inline = !verboseMode;
                                o.options.forEach(o2 => {
                                    o2.hints = _.assign(o2.hints || {}, {showTitle: verboseMode});
                                    o2.indent = verboseMode;
                                });
                            }
                        });
                    }
                });
                return uiSpec;
            case "nonAssetFlowsAndValues":
                uiSpec.options.forEach(option => {
                    if (option.name == "netCashFlow") {
                        option.options.forEach(o => {
                            if (o.name == "cashFlow") {
                                o.hints = _.assign(o.hints || {}, {showTitle: true});
                                o.inline = !verboseMode;

                                o.options.forEach(o2 => (o2.hints = _.assign(o2.hints || {}, {showTitle: verboseMode})));
                            }
                            else {
                                o.hints = _.assign(o.hints || {}, {showTitle: verboseMode});
                                o.indent = verboseMode;
                            }
                        })
                    }
                    else if (!verboseMode && option.options)
                        option.options.forEach(o => (o.hints = _.assign(o.hints || {}, {showTitle: false})));

                    option.inline = !verboseMode;
                });
                return uiSpec;
            case "interestMaintenanceReserve":
                uiSpec.options = [{
                    name: null,
                    description: inputOption.description,
                    applicable: inputOption.applicable,
                    options: [],
                    component: InterestMaintenanceReserve,
	                hints: {
		                showTitle: false
	                }
                }];
                return uiSpec;
            case "dataSources":
                uiSpec.options.forEach(option => {
                    if (option.name == "assetReturns") {
                        option.inline = true;
                    }
                });
                return uiSpec;
            default:
                return uiSpec;
        }
    }

    updateUserOptions = (userOptions) => {
        this.props.page.updateUserOptions(this.props.view.id, userOptions);
    }

    render() {
        const {io, userOptions, view, page} = this.props;

        return <InputSpecificationComponent
	        ref={ref => this._inputSpecificationComponentRef = ref}
            inputs={io.optimizationInputs}
            additionalProps={{io}}
            applyUpdate={update => io.sendOptimizationInputsUpdate(update)}
            validations={io.validations}
            userOptions={userOptions as InputSpecificationUserOptions}
            specification={this.specification}
            allowScrolling={page.scrollMode}
            updateUserOptions={this.updateUserOptions}
            globalLists={io.globalLists}
            shouldRender={() => page == io.currentPage}
            onInvalidate={() => page.renderedTime = null}
            axes={io.axes}
        />
    }
}
