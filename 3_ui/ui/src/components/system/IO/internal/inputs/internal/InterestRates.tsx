import {observer} from 'mobx-react';
import * as React from 'react';
import {IO, IOPage, IOView} from 'stores/io';
import {Option} from 'components/system/inputSpecification';
import {DropdownOptions, ResizeableInput, Validator} from 'components/system/inputSpecification/internal/CommonInputs';
import {getOption, findOption} from '../utility'
import * as css from './InterestRates.css'
import * as commonCSS from 'components/system/inputSpecification/InputSpecificationComponent.css';

interface MyProps {
	io: IO;
	page: IOPage;
	view: IOView;
	verboseMode: boolean;
	control: Option;
}

@observer
export class InterestRates extends React.Component<MyProps, {}> {

	get path() {
		return `interestRates.${this.props.control.name}`;
	}

	get data(): { additiveSpread?: number, multiplicativeFactor?: number, economy?: string, tenor?: string} {
		const options = this.props.control.options;

		return _.get(this.props.io.optimizationInputs, this.path) ||
			{
				additiveSpread:         getDefault(options, "additiveSpread"),
				multiplicativeFactor:   getDefault(options, "multiplicativeFactor"),
				...(this.isRFR ? {
					economy:                getDefault(options, "economy"),
					tenor:                  getDefault(options, "tenor"),
				} : {})
			};
	}

	saveEdit = (name, value: string | number | boolean ) => {
		this.props.io.sendOptimizationInputsUpdate(_.set({}, `${this.path}.${name}`, value));
	}

	saveInputEdit = (e, name) => {
		let value = parseFloat(e.target.value);

		if (isNaN(value)) {
			value = 0;
			e.target.value = value;
		}

		this.saveEdit(name, value);

	}

	onBlur = (e, name) => {
		this.saveInputEdit(e, name);
	}

	onKeyPress = (e, name) => {
		if (e.key === 'Enter') {
			this.saveInputEdit(e, name);
		}
	}

	get isRFR() {
		return this.props.control.name == "riskFreeRate";
	}

	get isBR() {
		return this.props.control.name == "borrowingRate";
	}

	render() {
		const {control, io} = this.props;
		const additiveSpread = getOption(control.options, "additiveSpread");
		const multiplicativeFactor = getOption(control.options, "multiplicativeFactor");
		let existing = this.data;

		return <div className={css.interestRates}>
			{additiveSpread && additiveSpread.applicable && <div className={css.columns}>
				<div className={css.formula}>
					<span/>
					<span>{this.isRFR ? "RFR" : this.isBR ? "BR" : "HR" } = </span>
				</div>
				<div className={classNames(css.column, css.additive)}>
					<span className={css.titles}>{additiveSpread.title}</span>
					<Validator path={`${this.path}.additiveSpread`} validations={io.validations}>
						<ResizeableInput
							defaultValue={existing.additiveSpread}
							inputType={additiveSpread.inputType}
							minimum={additiveSpread.minimum}
							maximum={additiveSpread.maximum}
						    onChange={value => this.saveEdit("additiveSpread", value)}/>
					</Validator>
				</div>
				<div className={css.spacer}>
					<span/>
					<span>+</span>
				</div>
				<div className={classNames(css.column, css.multiplicative)}>
					<span className={css.titles}>{getOption(control.options, "multiplicativeFactor").title}</span>
					<Validator path={`${this.path}.multiplicativeFactor`} validations={io.validations}>
						<ResizeableInput
							defaultValue={existing.multiplicativeFactor}
							inputType={multiplicativeFactor.inputType}
							onChange={value => this.saveEdit("multiplicativeFactor", value)}/>
					</Validator>
				</div>
				<div className={css.spacer}>
					<span/>
					<span className={css.multiply}>⬤</span>
				</div>
				{this.isRFR ? <>
					<div className={css.column}>
						<span className={classNames(css.titles)}>{getOption(control.options, "economy").title}</span>
						<DropdownOptions validations={this.props.io.validations} path={this.path + ".economy"} items={mapToUIOptions(getOption(control.options, "economy").options)} selectedValue={existing.economy} onChange={(item) => this.saveEdit("economy", item.value)}/>
					</div>
					<div className={css.spacer}>
						<span/>
					</div>
					<div className={css.column}>
						<span className={classNames(css.titles)}>{getOption(control.options, "tenor").title}</span>
						<DropdownOptions validations={this.props.io.validations} path={this.path + ".tenor"} items={mapToUIOptions(getOption(control.options, "tenor").options)} selectedValue={existing.tenor} onChange={(item) => this.saveEdit("tenor", item.value)}/>
					</div>
				</> :
					<div>
						<span/>
						<span>RFR</span>
					</div>
				}
			</div>}

			{additiveSpread && additiveSpread.applicable && <div className={css.columns}>

			</div>
			}
		</div>
	}
}

function getDefault(list, name) {
	return getOption(list, name).defaultValue;
}

function mapToUIOptions(options) {
	return options.map(o => ({...o, value: o.name, label: o.title}));
}