import type {RecalibrationComponentProps} from 'components/system/rsSimulation/rwRecalibration/ModelSettings';
import { computed, toJS, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import {inputSpecification, InputSpecificationComponent} from '../../inputSpecification';
import * as css from "./TableSetting.css";

@observer
export class TableSetting extends React.Component<RecalibrationComponentProps, {}> {
    constructor(props: RecalibrationComponentProps) {
        super(props);
        makeObservable(this);
    }

    get specification() {
		const {props:{dataset: {name}, recalibration}} = this;
		const userInterface = recalibration.getSettingInterface(name);
		let uiSpec = inputSpecification(name, {options: {[name]: userInterface}}, false);

		uiSpec.options.forEach((option, i) => {

			if (option.name === "smoothedFitOptions") {
				option.indent = true;
			}
			else if (option.inputType === "exclusive") {
				option.inline = false;
				option.indent = true;
				option.showDescription = false;
			}

			if (i === 0) {
				option.showInitialBreak = false;
			}
		});
		return uiSpec;
	}

    get path() {
		const {props:{dataset: {name}, recalibration}} = this;
		return _.slice<string>(_.get(recalibration.settings, `${name}.0`, []), 0, -1);
	}

    applyUpdates = (updates) => {
		_.merge(this.props.dataset.settings, updates);

		this.props.recalibration.updateUserInterface(_.set({}, this.path, updates));
	}

    @computed get inputs() {
		return _.get(this.props.recalibration.userInterface.userInputs, this.path);
	}

    render() {
		const {dataset: {name}, recalibration} = this.props;

		return <div className={css.root}>
				<span className={css.title}>{recalibration.formatCoordinateTitle(name)}&nbsp;&nbsp;</span>
				<InputSpecificationComponent
					className={css.input}
					showToolbar={false}
					showViewTitle={false}
					allowScrolling={true}
					userOptions={{verboseMode: true}}

					inputs={this.inputs}
					specification={this.specification}
					applyUpdate={this.applyUpdates}
					updateUserOptions={(update) => {}}
					validations={{}}
				/>
			</div>
	}
}