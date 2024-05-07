import {Radio, RadioGroup} from '@blueprintjs/core';
import {autorun, IReactionDisposer, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {IO, IOPage, ioStore, IOView} from '../../../../../../stores/io';
import {ObjectChooser} from '../../../../ObjectChooser/ObjectChooser';
import {Option} from 'components';
import * as css from 'components/system/inputSpecification/InputSpecificationComponent.css';
import {appIcons, Simulation, simulationStore} from 'stores';
import {DropdownOptions, ResizeableInput, Validator} from 'components/system/inputSpecification';
import {getOption, findOption} from '../utility'

interface MyProps {
	io: IO;
	page: IOPage;
	view: IOView;
	verboseMode: boolean;
	control: Option;
}

@observer
export class DataSources extends React.Component<MyProps, {}> {
	_disposers: IReactionDisposer[] = [];

	constructor(props) {
		super(props);

		this._disposers.push(
			autorun(() => {
				this.assetReturns && simulationStore.bulkLoadDescriptors([this.assetReturns]);
			})
		);
	}

	get path() {
		return "dataSources.assetReturns.simulation";
	}

	get assetReturns(): string {
		return _.get(this.props.io.optimizationInputs, "dataSources.assetReturns.simulation");
	}

	setOptionChoice = async (name, value: string | number) => {
		try {
			runInAction(() => this.props.io.silentLock = true);
			await this.props.io.sendOptimizationInputsUpdate({dataSources: {assetReturns: {simulation: value}}});
		}
		finally {
			runInAction(() => this.props.io.silentLock = false);
		}
	}

	componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

	render() {
		return renderSimulationPicker(this.props.io, this.path, this.assetReturns, true, true, null, this.setOptionChoice);
	}
}

@observer
export class CompanyData extends React.Component<MyProps, {}> {
	_disposers: IReactionDisposer[] = [];

	constructor(props) {
		super(props);

		this._disposers.push(
			autorun(() => {
				this.companyData && simulationStore.bulkLoadDescriptors([this.companyData["simulation"], this.companyData["alternativeSimulation"]].filter(s => s != null));
			})
		);
	}

	get path() {
		return "dataSources.companyData";
	}

	get companyData() {
		return _.get(this.props.io.optimizationInputs, this.path);
	}

	getOptionsChoices(target) {
		return mapToUIOptions(this.props.control.options.find(o => o.name == target).options);
	}

	get entityChoices() {
		return this.getOptionsChoices("entity");
	}

	get portfolioChoices() {
		return this.getOptionsChoices("portfolio");
	}

	setOptionChoice = (path, value: string | number | boolean ) => {
		//this.props.io.sendOptimizationInputsUpdate({dataSources: {...this.props.io.optimizationControls["dataSources"], companyData: {...this.companyData, [name]: value}}});
		this.props.io.sendOptimizationInputsUpdate(_.set({}, path, value))
	}

	componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

	render() {
		const existingCompanyData: { simulation?: string, entity?: string, portfolio?: string, alternativeSimulation?: string } = this.companyData;
		const {io, control} = this.props;
		const simulationOption = getOption(control.options, "simulation");
		const repositoryOption = getOption(control.options, "alternativeSimulation");

		return <div className={css.dataSourcesControl}>
			<div className={css.options}>
				<Validator path={`${this.path}`} validations={io.validations}>
					<div>
						<div className={css.listItem} style={{display: "flex", flexDirection: "row"}}>
							{/* <Checkbox large={true} checked={existingCompanyData.sameSimulationAsAssetReturns} onChange={(e) => this.setOptionChoice(`${this.path}.sameSimulationAsAssetReturns`, !existingCompanyData.sameSimulationAsAssetReturns) }></Checkbox> */}
							<span style={{marginLeft: "0px"}} className={css.title}>Simulation:</span>
							{renderSimulationPicker(io, this.path + ".simulation", existingCompanyData.simulation, true, true,
								"Use Asset Return Source", this.setOptionChoice)}
							{getOption(control.options, "entity").applicable && <>
								<span style={{marginLeft: "0px"}} className={css.title}>Entity:</span>
								<DropdownOptions validations={io.validations}
								                 path={`${this.path}.entity`}
								                 onChange={(item) => this.setOptionChoice(`${this.path}.entity`, item.value) }
								                 items={this.entityChoices} selectedValue={existingCompanyData.entity}/>
							</>}
							{getOption(control.options, "portfolio").applicable && <>
								<span style={{marginLeft: "0px"}} className={css.title}>Portfolio:</span>
								<DropdownOptions validations={io.validations}
								                 path={`${this.path}.portfolio`}
								                 onChange={(item) => this.setOptionChoice(`${this.path}.portfolio`, item.value) }
								                 items={this.portfolioChoices} selectedValue={existingCompanyData.portfolio}/>
							</>}
						</div>
						<div className={css.listItem} style={{display: "flex", flexDirection: "row"}}>
							<span style={{marginLeft: "0px"}} className={css.title}>Alternative Simulation:</span>
							{renderSimulationPicker(io, this.path + ".alternativeSimulation",existingCompanyData.alternativeSimulation, true, true, null, this.setOptionChoice)}
						</div>
					</div>
				</Validator>
			</div>
		</div>
	}
}

@observer
export class TimeHorizon extends React.Component<MyProps, {}> {
	get path() {
		return `dataSources.${this.rootOption.name}`;
	}

	get timeHorizon() {
		return _.get(this.props.io.optimizationInputs, this.path);
	}

	get rootOption() {
		return this.props.control;
	}

	get horizonChoices() {
		return mapToUIOptions(findOption( this.rootOption, ["selectedValue"]).options);
	}

	get horizonOptions() {
		return findOption( this.rootOption, [this.rootOption.name]);
	}

	setOptionChoice = (path, value: string | number) => {
		this.props.io.sendOptimizationInputsUpdate(_.set({}, path, value));
	}

	render() {
		const existingTimeHorizon: { timeHorizon: string, timeHorizonForRisk: string, selectedValue: string } = this.timeHorizon as any;
		const radioPath = `${this.path}.${this.rootOption.name}`;
		const dropdownPath = `${this.path}.selectedValue`;
		const sameAsTimeHorizon = findOption( this.horizonOptions, ["sameAsTimeHorizon"]);

		return <div className={css.dataSourcesControl}>
			<RadioOptions
				io={this.props.io}
				path={radioPath}
				selectedValue={existingTimeHorizon[this.rootOption.name]}
				items={[
				   ...(sameAsTimeHorizon ? [{value: "sameAsTimeHorizon", label: sameAsTimeHorizon.title }] : []),
				  {value: "allAvailable", label: findOption( this.horizonOptions, ["allAvailable"]).title },
				  {value: "selectedValue", label: <DropdownOptions validations={this.props.io.validations}
				                                           path={dropdownPath}
				                                           items={this.horizonChoices}
				                                           selectedValue={existingTimeHorizon.selectedValue}
				                                           onChange={(item) => this.setOptionChoice(dropdownPath, item.value)}/>}
				]}
			    onChange={(e) => this.setOptionChoice(radioPath, e.target.value)}/>
		</div>
	}
}

@observer
export class Scenarios extends React.Component<MyProps, {}> {

	get path() {
		return "dataSources.scenarios";
	}

	get scenarios() {
		return _.get(this.props.io.optimizationInputs, this.path);
	}

	get rootOption() {
		return findOption(this.props.io.getInputOptions().options.dataSources, ["scenarios"]);
	}

	setOptionChoice = (path, value: string | number) => {
		this.props.io.sendOptimizationInputsUpdate(_.set({}, path, value));
	}

	render() {
		const existingScenarios: {scenarios?: string, selectedRange: {firstScenario?: number, lastScenario?: number, numberOfScenarios?: number}} = this.scenarios as any;
		const selectedRangeOption = findOption(this.rootOption, ["selectedRange"]);
		const firstScenarioOption = findOption(selectedRangeOption, ["firstScenario"]);
		const lastScenarioOption = findOption(selectedRangeOption, ["lastScenario"]);
		const numberOfScenariosOption = findOption(selectedRangeOption, ["numberOfScenarios"]);

		return <div className={css.dataSourcesControl}>
			<RadioOptions
				io={this.props.io}
				path={`${this.path}.scenarios`}
				selectedValue={existingScenarios.scenarios}
				items={[
					{value: "allAvailable", label: findOption( this.rootOption, ["scenarios", "allAvailable"]).title},
					{value: "selectedRange",
						label: "",
						afterItem:  <div>
				                        From <ResizeableInput minimum={firstScenarioOption.minimum}
				                                              maximum={firstScenarioOption.maximum}
				                                              defaultValue={existingScenarios.selectedRange.firstScenario}
				                                              onChange={value => this.setOptionChoice(`${this.path}.selectedRange.firstScenario`, value)} />
				                        to <ResizeableInput minimum={lastScenarioOption.minimum}
				                                            maximum={lastScenarioOption.maximum}
				                                            defaultValue={existingScenarios.selectedRange.lastScenario}
				                                            onChange={value => this.setOptionChoice(`${this.path}.selectedRange.lastScenario`, value)}/>
							            for a total of <ResizeableInput minimum={numberOfScenariosOption.minimum}
							                                            maximum={numberOfScenariosOption.maximum}
							                                            defaultValue={existingScenarios.selectedRange.numberOfScenarios}
							                                            onChange={value => this.setOptionChoice(`${this.path}.selectedRange.numberOfScenarios`, value)}/>
									</div>
					}
				]}
				onChange={(e) => this.setOptionChoice(`${this.path}.scenarios`, e.target.value)}/>
		</div>
	}
}

interface RadioOptionsProps {
	onChange: (e) => void;
	items: Array<{value: string | number, label: React.ReactNode | string, description?: string, afterItem?: React.ReactNode}>
	selectedValue: string | number;
	io: IO;
	path: string;
}


export class RadioOptions extends React.Component<RadioOptionsProps, {}> {

	render() {
		const {selectedValue, items, onChange, io, path} = this.props;

		// Inputs <input> cannot be rendered via labelElement because blueprint attempts to reposition the radio button input and will incorrectly target our input, so we need to wrap
		// the Radio elements with a <div> which breaks RadioGroup onChange and selection so these are being moved to individual Radio elements.
		return <RadioGroup
			className={css.options}
			onChange={onChange}
		>
			<Validator path={path} validations={io.validations}>
				<div>
					{items.map((item) => {
						return <div key={item.value} style={{display: "flex"}} className={css.listItem}>
							<Radio large={true} value={item.value} labelElement={item.label} checked={item.value == selectedValue} onChange={onChange}/>
							{item.afterItem}
						</div>}
					)}
				</div>
			</Validator>
		</RadioGroup>
	}
}

function renderSimulationPicker(io: IO, path: string, selection: string, includeRepositories: boolean, includeSimulations: boolean, unspecifiedText: string, onChange) {
	const selectedSimulation = simulationStore.simulations.get(selection);

	return <Validator path={path} validations={io.validations}>
		<ObjectChooser<Simulation>
			objectType={Simulation}
			rootClassName={css.objectChooser}
			launcherPlaceholder={unspecifiedText != null ? unspecifiedText : "Unspecified"}
			chooseItemFilters={ioStore.getRelatedSimulationFilter(includeRepositories, includeSimulations)}
			showLauncherOpenIcon={!selectedSimulation}
			selections={selectedSimulation && [selectedSimulation]}
			onSave={(selections) => onChange(path, selections.length > 0 ? selections[0]._id : null)}
			isConfirmBeforeChange={true}
		/>
	</Validator>;
}

function mapToUIOptions(options) {
	return options.map(o => ({...o, value: o.name, label: o.title}));
}