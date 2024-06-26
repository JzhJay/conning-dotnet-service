import {bp, HighchartsComponent} from 'components';
import {Axis} from 'highcharts';
import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import {FormattedMessage} from 'react-intl';
import {i18n} from 'stores';
import type {ChartAxisDisplayUnit} from 'stores';

import * as css from './FormatAxisDrawer.css';

@observer
export class FormatAxisDrawer extends React.Component<{highchartsComponent: HighchartsComponent}, {}> {

	static ICON = {type: 'semantic', name: "cogs"};
	static canModify = (axis: Axis) => !(axis.categories?.length > 0);

	static displayUnits : {scale: number, unit: string, label: string}[] = [
		{scale: 1, unit: "", label: i18n.intl.formatMessage({ defaultMessage: 'None', description: '[highcharts] Display unit label in Format Axis - None' })},
		{scale: 100, unit: "Hundreds", label: i18n.intl.formatMessage({ defaultMessage: 'Hundreds', description: '[highcharts] Display unit label in Format Axis - Hundreds' })},
		{scale: 1000, unit: "Thousands", label: i18n.intl.formatMessage({ defaultMessage: 'Thousands', description: '[highcharts] Display unit label in Format Axis - Thousands' })},
		{scale: 10000, unit: "x10000", label: "10000"},
		{scale: 100000, unit: "x100000", label: "100000"},
		{scale: 1000000, unit: "Millions", label: i18n.intl.formatMessage({ defaultMessage: 'Millions', description: '[highcharts] Display unit label in Format Axis - Millions' })},
		{scale: 10000000, unit: "x10000000", label: "10000000"},
		{scale: 100000000, unit: "x100000000", label: "100000000"},
		{scale: 1000000000, unit: "Billions", label: i18n.intl.formatMessage({ defaultMessage: 'Billions', description: '[highcharts] Display unit label in Format Axis - Billions' })},
		{scale: 1000000000000, unit: "Trillions", label: i18n.intl.formatMessage({ defaultMessage: 'Trillions', description: '[highcharts] Display unit label in Format Axis - Trillions' })}
	]

	@observable private _axis: Axis | null;
	@observable private _displayUnit: ChartAxisDisplayUnit;

	inputRefs: {[id: string]: HTMLInputElement } = {};

	constructor(props, state) {
		super(props, state);
		makeObservable(this);
	}

	set axis(axis: Axis) {
		runInAction(() =>  this._axis = axis );
		this.updateDisplayUnits();

		// save initial values for reset
		if (_.get(axis, "userOptions.connInitialTickInterval") === undefined) {
			_.set(axis, "userOptions.connInitialTickInterval", _.get(axis, "userOptions.tickInterval", _.get(axis, "tickInterval")));
		}
		if (_.get(axis, "userOptions.connInitialMinorTickInterval") === undefined) {
			_.set(axis, "userOptions.connInitialMinorTickInterval", _.get(axis, "userOptions.minorTickInterval"));
		}
	}

	@action updateDisplayUnits() {
		if (this._axis) {
			const highchartsExtender = this.props.highchartsComponent.extender;
			this._displayUnit = highchartsExtender.getDisplayUnits(this._axis);
		}
	}

	@computed get isOpen() {
		return this._axis != null;
	}

	@action onClose = () => {
		this._axis = null;
	}

	setRef = (input: HTMLInputElement) => {
		if (input) {
			const id = input.getAttribute("id");
			this.inputRefs[id] = input;
		}
	}

	getDefaultValue = (id): number => {
		switch (id) {
			case "bounds-maximum":
				return _.get(this._axis, "userOptions.connInitialMax", _.get(this._axis, "userOptions.max", _.get(this._axis, "max")));
			case "bounds-minimum":
				return _.get(this._axis, "userOptions.connInitialMin", _.get(this._axis, "userOptions.min", _.get(this._axis, "min")));
			case "units-major":
				return _.get(this._axis, "userOptions.connInitialTickInterval");
			case "units-minor":
				return _.get(this._axis, "userOptions.connInitialMinorTickInterval", _.get(this._axis, "userOptions.connInitialTickInterval"));
		}
	}

	getCurrentValue = (id, format: boolean = true): number => {
		const tickInterval = (format && id != "units-major") ? this.getCurrentValue("units-major") : 0;
		let value: number;
		switch (id) {
			case "bounds-maximum":
				value = _.get(this._axis, "max", this.getDefaultValue(id));
				format && (value = Math.ceil(value / tickInterval) * tickInterval);
				break;
			case "bounds-minimum":
				value = _.get(this._axis, "min", this.getDefaultValue(id));
				format && (value = Math.floor(value / tickInterval) * tickInterval);
				break;
			case "units-major":
				value = _.get(this._axis, "tickInterval");
				break;
			case "units-minor":
				value = _.get(this._axis, "minorTickInterval");
				if (format && value == null) {
					value = tickInterval;
				}
				break;
		}
		format && (value = Math.round(value * Math.pow(10, 8)) / Math.pow(10, 8));
		return value;
	}

	getInputValue = (id): number => {
		return parseFloat(this.inputRefs[id]?.value);
	}

	setValuesFromAxisToInput = () => {
		_.forEach(Object.keys(this.inputRefs), id => {
			this.inputRefs[id].value = `${this.getCurrentValue(id)}`
		});
	}

	onChange = (e) => {
		const inputElement = e.target;
		const id = inputElement.getAttribute("id");
		switch (id) {
			case "bounds-maximum":
			case "bounds-minimum":
				let max = id == "bounds-maximum" ? this.getInputValue("bounds-maximum") : this.getCurrentValue("bounds-maximum", false);
				let min = id == "bounds-minimum" ? this.getInputValue("bounds-minimum") : this.getCurrentValue("bounds-minimum", false);
				if(min < max) {
					this._axis.setExtremes(min, max, true);
				}
				break;
			case "units-major":
				this._axis.update({"tickInterval": this.getInputValue(id)}, true);
				break;
			case "units-minor":
				this._axis.update({"minorTickInterval": this.getInputValue(id)}, true);
				break;
		}
		this.setValuesFromAxisToInput();
	}

	reset = (e) => {
		const $buttonElement = $(e.target).is('button') ? $(e.target) : $(e.target).parents('button').first();
		const id = $buttonElement.prev().find('input').attr("id");
		switch (id) {
			case "bounds-maximum":
			case "bounds-minimum":
				let max = id == "bounds-maximum" ? this.getDefaultValue("bounds-maximum") : this.getCurrentValue("bounds-maximum", false);
				let min = id == "bounds-minimum" ? this.getDefaultValue("bounds-minimum") : this.getCurrentValue("bounds-minimum", false);
				this._axis.setExtremes(min, max, true);
				break;
			case "units-major":
				this._axis.update({"tickInterval": this.getDefaultValue(id)}, true);
				break;
			case "units-minor":
				this._axis.update({"minorTickInterval": this.getDefaultValue(id)}, true);
				break;
		}
		this.setValuesFromAxisToInput();
	}

	onKeydown = (e) => {
		switch (e.key) {
			case 'Enter':
				e.target.blur(e);
				e.stopPropagation();
				break;
			case "Escape":
				e.stopPropagation();
				this.setValuesFromAxisToInput();
				e.target.blur(e);
				break;
		}
	}

	render() {

		if (!this._axis) { return null; }

		const minorDisabled = _.get(this._axis, "options.gridLineWidth") != 1;

		const inputPropsById = (id) => ({
			id: id,
			defaultValue: this.getCurrentValue(id),
			size: 6,
			buttonPosition: 'none' as any,
			onBlur: this.onChange,
			onKeyDown: this.onKeydown,
			inputRef: this.setRef
		});

		const resetBtnCommonProps = {
			icon: "reset" as bp.IconName,
			onClick: this.reset
		}

		const highchartsExtender = this.props.highchartsComponent.extender;
		const customizeDisplayUnitsEnabled = highchartsExtender.customizeDisplayUnitsEnabled;

		return <bp.Drawer
			className={css.root}
			size={"300px"}
			title={i18n.intl.formatMessage({ defaultMessage: 'Format Axis', description: '[highcharts] Format Axis Dialog Title' })}
			isOpen={this.isOpen}
			onClose={this.onClose}
			hasBackdrop={false}
			canOutsideClickClose={true}
		>
			<div className={bp.Classes.DRAWER_BODY}>
				<div className={bp.Classes.DIALOG_BODY}>
					<div className={css.bodyGrid}>
						<div className={css.bodyTitle}>
							<FormattedMessage defaultMessage="Bounds" description="[highcharts] Title for adjusting Bounds in Format Axis" />
						</div>
						<label>
							<FormattedMessage defaultMessage="Maximum" description="[highcharts] Label Title for adjusting bound's maximum in Format Axis" />
						</label>
						<bp.ControlGroup>
							<bp.NumericInput {...inputPropsById("bounds-maximum")} />
							<bp.Button {...resetBtnCommonProps} />
						</bp.ControlGroup>
						<label>
							<FormattedMessage defaultMessage="Minimum" description="[highcharts] Label Title for adjusting bound's minimum in Format Axis" />
						</label>
						<bp.ControlGroup>
							<bp.NumericInput {...inputPropsById("bounds-minimum")} />
							<bp.Button {...resetBtnCommonProps} />
						</bp.ControlGroup>

						<div className={css.bodyTitle}>
							<FormattedMessage defaultMessage="Units" description="[highcharts] Title for adjusting units in Format Axis" />
						</div>
						<label>
							<FormattedMessage defaultMessage="Major" description="[highcharts] Label Title for adjusting unit's major in Format Axis" />	
						</label>
						<bp.ControlGroup>
							<bp.NumericInput {...inputPropsById("units-major")} />
							<bp.Button {...resetBtnCommonProps} />
						</bp.ControlGroup>
						<label>
							<FormattedMessage defaultMessage="Minor" description="[highcharts] Label Title for adjusting unit's minor in Format Axis" />
						</label>
						<bp.ControlGroup>
							<bp.NumericInput {...inputPropsById("units-minor")} disabled={minorDisabled} />
							<bp.Button {...resetBtnCommonProps} disabled={minorDisabled} />
						</bp.ControlGroup>

						<hr className={css.colspan} />

						<label>
							<FormattedMessage defaultMessage="Display Unit" description="[highcharts] Label Title for adjusting diplay unit in Format Axis" />
						</label>
						<bp.ControlGroup>
							<bp.HTMLSelect
								disabled={!customizeDisplayUnitsEnabled}
								defaultValue={this._displayUnit ? _.find(FormatAxisDrawer.displayUnits, du => du.scale == this._displayUnit.scale)?.unit : null}
								onChange={(e) => {
									const selectedUnit = _.find(FormatAxisDrawer.displayUnits, du => du.unit == e.target.value);
									if( selectedUnit ) {
										highchartsExtender.setDisplayUnit(this._axis as any, selectedUnit);
										this.updateDisplayUnits();
									}
								}}
							>{FormatAxisDrawer.displayUnits.map((d, i) => {
								return <option key={`displayUnits_${i}`} value={d.unit} >{d.label}</option>;
							})}</bp.HTMLSelect>
						</bp.ControlGroup>

						<div className={css.colspan}>
							<bp.Checkbox
								label={i18n.intl.formatMessage({ defaultMessage: 'Show display units label on chart', description: '[highcharts] Label Title for toggling showing display units label on chart in Format Axis in Format Axis' })}
								disabled={!customizeDisplayUnitsEnabled || !this._displayUnit?.unit}
								checked={this._displayUnit?.showUnit !== false}
								onChange={(e) => {
									highchartsExtender.setDisplayUnitShowUnit(this._axis, (e.target as any).checked);
									this.updateDisplayUnits();
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</bp.Drawer>;
	}

}