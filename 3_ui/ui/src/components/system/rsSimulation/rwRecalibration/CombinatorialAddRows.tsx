import {IconName} from '@blueprintjs/core';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { MultiSelect, ItemPredicate } from '@blueprintjs/select'

import { bp } from 'components';
import {FormattedMessage} from 'react-intl';
import {RSSimulation, i18n} from 'stores';
import {yearMonthInputFields} from '../../../../stores/rsSimulation/rwRecalibration/models';
import {RWRecalibration} from '../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';
import { convertYMtoMonth, convertMonthToYM } from 'utility';

import * as css from './CombinatorialAddRows.css';

interface AddRowsProps {
	recalibration: RWRecalibration;
	tableName: string;
	metadata: any;
}

interface SelectOption {
	name: string;
	title: string;
}

const OptionsSelect = MultiSelect.ofType<SelectOption>();

// temporary solution
const blackOptionsSet = new Set(['targetValue', 'simulatedValue', 'valueBasedOnCurrentParameters', 'valueBasedOnPreviousParameters']);

const MAXIMUM_RECENTLY_USED_ITEMS = 5;

@observer
export class CombinatorialAddRows extends React.Component<AddRowsProps, {}> {
	static get TITLE(){ return i18n.intl.formatMessage({defaultMessage: "Combinatorial Add Rows", description: "[CombinatorialAddRows] dialog title"})}
	static ICON: bp.IconName = "add-to-artifact";

	_contentRef = React.createRef<HTMLDivElement>();
	_cancelButtonRef;

	@observable savedOptionValues = {
		options: {} as {[oname: string]: any},
		staticOptions: {
			overwrite: true,
			matchTargets: true,
			target: 'Previous_Parameters'
		},
		recentlyUsed: {
		}
	};
	@observable recentlyUsedItemsMenuOpenState = {};

	constructor(props: AddRowsProps) {
        super(props);

        makeObservable(this);

        const options = this.applicableOptions;
        options.forEach((option)=> {
			const { name, inputType, defaultValue } = option;
			if (typeof defaultValue !== 'undefined' && !_.isNull(defaultValue)) {
				if (inputType === 'exclusive') {
					this.savedOptionValues.options[name] = [];
					const defaultSelect = option.options.find((o) => o.name === defaultValue);
					this.savedOptionValues.options[name] = [defaultSelect.name];
				} else if (inputType === 'integer' || yearMonthInputFields.has(name)) {
					this.savedOptionValues.options[name] = [defaultValue];
				} else {
					this.savedOptionValues.options[name] = defaultValue;
				}
			}

			if (Reflect.has(RSSimulation.INPUT_DEFAULT_SUGGESTIONS, name)) {
				if (!Reflect.has(this.savedOptionValues.recentlyUsed, name)) {
					this.savedOptionValues.recentlyUsed[name] = RSSimulation.INPUT_DEFAULT_SUGGESTIONS[name];
				}
			}
		});

        this.restorePreviousSettings();
        if (this.savedOptionValues.options['horizon']) {
			this.controlHorizonAndState(this.savedOptionValues.options['horizon']);
		}
    }

	@computed get applicableOptions() {
		return this.findOptions(['table'], this.props.metadata).options.filter(option => option.applicable && !blackOptionsSet.has(option.name));
	}

	@computed get numberOfAddRows() {
		const { applicableOptions } = this;
		let totalNumber = null;
		for(let i=0, length = applicableOptions.length; i < length; i++) {
			const option = applicableOptions[i];
			const savedOption = this.savedOptionValues.options[option.name];
			if (typeof savedOption === 'undefined') {
				return 0;
			} else if (option.inputType === 'exclusive') {
				totalNumber = totalNumber === null ? Object.keys(savedOption).length : totalNumber*Object.keys(savedOption).length;
			} else if (option.inputType === 'integer' || yearMonthInputFields.has(option.name)){
				totalNumber = totalNumber === null ? savedOption.length : totalNumber*savedOption.length;
			} else {
				totalNumber = totalNumber === null ? 1 : totalNumber;
			}
		}

		return totalNumber !== null ? totalNumber : 0;
	}

	restorePreviousSettings() {
		const { metadata: { name }, recalibration } = this.props;
		const prevSettings: any = recalibration.getCombinatorialAddRowsSettings(name);
		const { applicableOptions } = this;
		let isSettingsChanged = false;

		_.toPairs(prevSettings.options).forEach(([key, value])=> {
			const option = applicableOptions.find(o => o.name === key && o.applicable);
			if (option) {	// option is still available
				this.savedOptionValues.options[key] = value;
			} else {
				isSettingsChanged = true;
			}
		});

		_.toPairs(prevSettings.staticOptions).forEach(([key, value])=> {
			this.savedOptionValues.staticOptions[key] = value;
		});

		_.toPairs(prevSettings.recentlyUsed).forEach(([key, value])=> {
			this.savedOptionValues.recentlyUsed[key] = value;
		});

		if (isSettingsChanged) {
			recalibration.saveCombinatorialAddRowsSettings(name, this.savedOptionValues);
		}
	}

	onClose = () => {
		this.props.recalibration.closeDialog();
	}

	findOptions = (searchAttrs, metadataOptions) => {
		const name = searchAttrs.shift();
		const result = metadataOptions.options.find((option) => option.name === name);
		if (searchAttrs.length === 0 ){
			return result;
		}
		return this.findOptions(searchAttrs, result);
	}

	replaceByRecentlyUsedItems = (name, newValues) => {
		return () => {
			if (name === 'horizon') {
				const newHorizon = this.controlHorizonAndState(newValues.map(convertYMtoMonth), true);
				this.saveOptionValue('horizon', newHorizon);
			} else if (name === 'tenor' || name === 'secondTenor') {
				this.saveOptionValue(name, newValues.map(convertYMtoMonth));
			} else {
				this.saveOptionValue(name, [...newValues]);
			}
		};
	}

	getRenderRecentlyUsedTagTextFunc = (name) => {
		const { applicableOptions } = this;
		if (yearMonthInputFields.has(name)) {
			return (value) => convertMonthToYM(value);
		} else {
			const exclusiveOption = applicableOptions.find((o) => o.name === name && o.inputType === 'exclusive');
			if (exclusiveOption) {
				return (value) => exclusiveOption.options.find(o => o.name === value)?.title || value;
			}
			return (value) => value;
		}
	}

	renderRecentUsedMenu = (name, recentItems) => {
		const renderTagTextFunc = this.getRenderRecentlyUsedTagTextFunc(name);

		return (
			<bp.Menu className={css.recentlyUsedItemsPopover}>
				{recentItems.map((values: string[]) => {
					return (
						<bp.MenuItem
							key={values.join('')}
							text={<>{values.map((value) => <bp.Tag key={value} minimal={true} className={css.tagGap}>{renderTagTextFunc(value)}</bp.Tag>)}
							</>}
							onClick={this.replaceByRecentlyUsedItems(name, values)}
							shouldDismissPopover={false}
						/>
					);
				})}
			</bp.Menu>
		);
	}

	renderRecentUsedItemsButton = (name) => {
		const recentlyUsedItems = _.get(this.savedOptionValues, `recentlyUsed.${name}`, []);
		if (recentlyUsedItems.length === 0) {
			return null;
		}

		const isOpen = this.recentlyUsedItemsMenuOpenState[name] || false;
		return (
			<bp.Popover isOpen={isOpen} onClose={this.onRecentUsedItemsMenuClose(name)} content={this.renderRecentUsedMenu(name, recentlyUsedItems)} position={bp.Position.BOTTOM_RIGHT}>
				<bp.Button icon="caret-down" minimal={true} onClick={this.onClickRecentUsedItemsButton(name)} />
			</bp.Popover>
		);
	}

	onRecentUsedItemsMenuClose = (name) => {
		return () => {
			this.recentlyUsedItemsMenuOpenState[name] = false;
		};
	}

	onClickRecentUsedItemsButton = (name) => {
		return (e) => {
			e.stopPropagation();
			this.recentlyUsedItemsMenuOpenState[name] = !this.recentlyUsedItemsMenuOpenState[name];
		};
	}

	renderOption = (option, index) => {
		return 	(
			<div key={option.name} className={css.inputRow}>
				<div className={css.inputLabel}>{option.title}</div>
				<div className={css.inputElement}>
					{this.renderInput(option, index + 1)}
				</div>
			</div>
		);
	}

	onTextInputChanged(name) {
		return (e) => {
			let value = e.target.value;
			if (value === '') {
				value = null;
			}

			this.saveOptionValue(name, value);
		};
	}

	onNumberInputChanged(name) {
		return (valueAsNumber: number, valueAsString: string, inputElement: HTMLInputElement) => {
			let value = valueAsNumber
			if (!_.isNumber(value)) {
				value = null;
			}

			this.saveOptionValue(name, value);
		};
	}

	renderTextInput(option, index: number) {
		const { savedOptionValues: { options: savedOptions } } = this;
		const { name, defaultValue } = option;
		const value = Reflect.has(savedOptions, name) ? savedOptions[name] : defaultValue;

		return <bp.InputGroup tabIndex={index} fill={true} name={name} value={value} onChange={this.onTextInputChanged(name)} />;
	}

	onIntegerTagAdd = (option) => {
		return (values: string[]) => {
			const { name, minimum, maximum } = option;
			const value = values[values.length - 1];
			this.saveIntegerTagInput(name, value, minimum, maximum);
		};
	}

	onIntegerTagRemove = (option) => {
		return (e, tagProps) => {
			const { name } = option;
			const { children: tagName } = tagProps
			const savedValues = this.savedOptionValues.options[name];
			const month = convertYMtoMonth(tagName);
			const index = savedValues.indexOf(month);
			if (index !== -1) {
				savedValues.splice(index, 1);
				this.saveOptionValue(name, [...savedValues]); // not sure why mobx doesn't observe update by splice
			}
		}
	}

	onTagInputKeyUp = (e) => {
		if (e.code === 'Space' || e.key === '' || e.keyCode === 32 || e.keyCode === 9) {
			e.target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', code: 'Enter', keyCode: 13 }));
		}
	}

	saveIntegerTagInput = (name: string, value: string, minimum: number, maximum: number) => {
		let valueNumber = parseInt(value);
		if (yearMonthInputFields.has(name)) {
			valueNumber = convertYMtoMonth(value);
		}

		if (!_.isSafeInteger(valueNumber) || valueNumber < minimum || valueNumber > maximum) {
			return false;
		}

		const savedValues = this.savedOptionValues.options[name] || [];
		if (savedValues.indexOf(valueNumber) === -1) {	// is not duplicate number
			if (name === 'horizon') {
				const newHorizon = this.controlHorizonAndState([valueNumber]);
				this.saveOptionValue('horizon', newHorizon);
			} else {
				savedValues.push(valueNumber);
				this.saveOptionValue(name, savedValues);
			}
		}

		return true;
	}

	controlHorizonAndState = (valueNumbers: number[], isReplace = false) => {
		const { applicableOptions } = this;
		const stateOption = applicableOptions.find((o) => o.name === 'state');
		if (stateOption) {
			const isContainsZero = valueNumbers.indexOf(0) !== -1;
			if (isContainsZero) {
				this.savedOptionValues.options['state'] = ['initialCondition'];
				return [0];
			} else {
				this.savedOptionValues.options['state'] = ['futureDynamics'];
			}
		}

		if (isReplace) {
			return valueNumbers;
		} else {
			let savedValues = _.get(this.savedOptionValues, ['options', 'horizon'], []);
			const zeroIndex = savedValues.indexOf(0);
			if (zeroIndex !== -1) {
				savedValues.splice(zeroIndex, 1);
				savedValues = [...savedValues];
			}
			return savedValues.concat(valueNumbers);
		}
	}

	renderIntegerInput = (option, index: number) => {
		const { savedOptionValues: { options: savedOptions } } = this;
		const { name } = option;
		const values = Reflect.has(savedOptions, name) ? savedOptions[name] : [];

		return (
			<bp.TagInput fill={true} onAdd={this.onIntegerTagAdd(option)} values={values.map(convertMonthToYM)} tagProps={{ onRemove: this.onIntegerTagRemove(option), intent: bp.Intent.PRIMARY}} inputProps={{ tabIndex: index }} addOnBlur onKeyUp={this.onTagInputKeyUp} rightElement={this.renderRecentUsedItemsButton(name)}/>
		);
	}

	renderFloatInput(option, index: number) {
		const { savedOptionValues: { options: savedOptions } } = this;
		const { name, defaultValue, minimum, maximum } = option;
		let value = Reflect.has(savedOptions, name) ? savedOptions[name] : defaultValue;
		if (value === null) {
			value = '';
		}

		return <bp.NumericInput tabIndex={index} fill={true} name={name} value={value} min={minimum} max={maximum} onValueChange={this.onNumberInputChanged(name)} buttonPosition="none" />;
	}

	onMultiSelectItemSelect = (name) => {
		return (option: SelectOption, e) => {
			const savedOptions = _.get(this.savedOptionValues, ['options', name], []);
			const { name: value } = option;
			const searchIndex = savedOptions.indexOf(value);
			if (searchIndex === -1) {
				savedOptions.push(value);
			} else {
				savedOptions.splice(searchIndex, 1);
			}

			this.saveOptionValue(name, [...savedOptions]);

			if (name === 'statistic') {
				this.checkSetTargetsBy(savedOptions);
			}
		};
	}

	renderMultiSelectItems = (name: string) => {
		return (option, { modifiers, handleClick }) => {
			if (!modifiers.matchesPredicate) {
				return null;
			}

			const savedOptions = _.get(this.savedOptionValues, ['options', name], []);
			const isSelected = savedOptions.indexOf(option.name) !== -1;

			return (
				<bp.MenuItem
					active={modifiers.active}
					icon={isSelected ? 'tick' : 'blank' }
					key={option.name}
					onClick={handleClick}
					text={option.title}
					shouldDismissPopover={false}
				/>
			);
		};
	}

	renderMultiSelectTag = (option) => {
		return option.title;
	}

	onSelectOptionRemove = (name, values: SelectOption[]) => {
		return (value: SelectOption, index: number) => {
			const deleteItemName = values[index].name;
			const currentSelectItems = this.savedOptionValues.options[name] || []
			const searchIndex = currentSelectItems.indexOf(deleteItemName);
			if (searchIndex !== -1) {
				currentSelectItems.splice(searchIndex, 1);
				this.saveOptionValue(name, [...currentSelectItems]);
			}

			if (name === 'statistic') {
				this.checkSetTargetsBy(currentSelectItems);
			}
		};
	}

	filterMultiSelectOption : ItemPredicate<SelectOption> = (query, option, index, exactMatch) => {
		const normalizedQuery = query.toLowerCase();
		const normalizedTitle = option.title.toLowerCase();
		if (exactMatch) {
			return normalizedTitle === normalizedQuery;
		} else {
			return normalizedTitle.indexOf(normalizedQuery) >= 0;
		}
	}

	renderMultiSelect(option, index: number) {
		const { name, options } = option;
		const savedOptions = _.get(this.savedOptionValues, ['options', name], []);
		const selectedItems: SelectOption[] = options.filter((o)=> {
			return savedOptions.indexOf(o.name) !== -1;
		});
		const isEscapeKeyevent = (e) => e && (_.get(e, 'key') === 'Escape' || _.get(e, 'keyCode') === 27);

		return (
			<OptionsSelect
				noResults={<bp.MenuDivider title={i18n.intl.formatMessage({defaultMessage: "No results.", description: "[InputSpecificationComponent] dropdown element without any sub-items"})} />}
				fill={true}
				popoverProps={{
					position: bp.PopoverPosition.BOTTOM,
					minimal: true,
					usePortal: false,
					boundary: 'viewport',
					autoFocus: true,
					onClose: (e) => {
						if (isEscapeKeyevent(e)) {
							e.stopPropagation(); // only close current select popover
							this._cancelButtonRef.focus(); // to support enter ESC again to close dialog
						}
					}
				}}
				tagRenderer={this.renderMultiSelectTag}
				selectedItems={selectedItems}
				items={options}
				itemRenderer={this.renderMultiSelectItems(name)}
				onItemSelect={this.onMultiSelectItemSelect(name)}
				onRemove={this.onSelectOptionRemove(name, selectedItems)}
				tagInputProps={{
					inputProps: {
						tabIndex: index,
						onKeyDown: (e) => {
							if (isEscapeKeyevent(e)) {
								e.stopPropagation();
								$(e.target).blur(); // workaround to close select manually
								this._contentRef.current.dispatchEvent(
									new MouseEvent('mousedown', {
										view: window,
										bubbles: true,
										cancelable: true,
										buttons: 1
									})
								);
								this._cancelButtonRef.focus(); // to support enter ESC again to close dialog
							}
						}
					},
					tagProps: {
						intent: bp.Intent.PRIMARY
					},
					rightElement: this.renderRecentUsedItemsButton(name)
				}}
				itemPredicate={this.filterMultiSelectOption}
			/>
		);
	}

	renderReadonlyState(option) {
		const { name, defaultValue, options } = option;
		let value;
		if (this.savedOptionValues.options[name]) {
			value = _.values(this.savedOptionValues.options['state'])[0];
		} else {
			value = defaultValue;
		}
		const text = options.find((o) => o.name === value)?.title;

		return (
			<span>{text}</span>
		);
	}

	renderInput(option, index) {
		const { inputType, name } = option;

		if (name === 'state') {
			const { applicableOptions } = this;
			if (applicableOptions.some(o => o.name === 'horizon')) {
				return this.renderReadonlyState(option);
			}
		}

		switch(inputType) {
			case 'string':
				return this.renderTextInput(option, index);
			case 'integer':
				return this.renderIntegerInput(option, index);
			case 'float':
				return this.renderFloatInput(option, index);
			case 'exclusive':
				return this.renderMultiSelect(option, index);
			case '':
				if (yearMonthInputFields.has(name)) {
					return this.renderIntegerInput(option, index);
				}
		}

		return null;
	}

	executeAddRows = async () => {
		const { applicableOptions } = this;
		const { tableName, metadata: { name }, recalibration } = this.props;
		const optionData = {};
		const staticOptionData = {};

		_.toPairs(this.savedOptionValues.options).forEach(([key, value])=> {
			const option = applicableOptions.find(o => o.name === key);
			if (option) {
				if (yearMonthInputFields.has(name)) {
					optionData[key] = value.map(this.transferYMtoMonth);
				} else if (option.inputType === 'integer') {
					optionData[key] = value.map((v) => parseInt(v));
				} else {
					optionData[key] = value;
				}
			}
		});

		_.toPairs(this.savedOptionValues.staticOptions).forEach(([key, value])=> {
			staticOptionData[key] = value;
		});

		await recalibration.combinatorialAddRows(tableName, name, optionData, staticOptionData);

		// save recently used items
		let isRecentlyUsedChanged = false;
		yearMonthInputFields.forEach((name)=> {
			if (Reflect.has(this.savedOptionValues.options, name)) {
				const newValues = this.savedOptionValues.options[name];
				let prevRencentlyUsedValues = this.savedOptionValues.recentlyUsed[name] || [];
				const findIndex = prevRencentlyUsedValues.findIndex((value) => _.isEqual(newValues, value));

				if (findIndex === -1) {
					prevRencentlyUsedValues.unshift([...newValues]);
					if (prevRencentlyUsedValues.length > MAXIMUM_RECENTLY_USED_ITEMS) {
						prevRencentlyUsedValues = prevRencentlyUsedValues.slice(0, MAXIMUM_RECENTLY_USED_ITEMS);
					}
					this.savedOptionValues.recentlyUsed[name] = prevRencentlyUsedValues;
					isRecentlyUsedChanged = true;
				} else if (findIndex !== 0) {	// move item to 1st option
					prevRencentlyUsedValues.unshift(prevRencentlyUsedValues[findIndex]);
					prevRencentlyUsedValues.splice(findIndex + 1, 1);
					isRecentlyUsedChanged = true;
				}
			}
		});

		applicableOptions.forEach((option) => {
			const { inputType, name } = option;
			if (inputType === 'exclusive' && name !== 'state') {
				const recentlyUsedValue = this.savedOptionValues.options[name];
				if (recentlyUsedValue) {
					let prevRencentlyUsedValues = this.savedOptionValues.recentlyUsed[name] || [];
					const findIndex = prevRencentlyUsedValues.findIndex((oldValues) => _.isEqual(recentlyUsedValue, oldValues));

					if (findIndex === -1) {
						prevRencentlyUsedValues.unshift([...recentlyUsedValue]);
						if (prevRencentlyUsedValues.length > MAXIMUM_RECENTLY_USED_ITEMS) {
							prevRencentlyUsedValues = prevRencentlyUsedValues.slice(0, MAXIMUM_RECENTLY_USED_ITEMS);
						}

						this.savedOptionValues.recentlyUsed[name] = [...prevRencentlyUsedValues];
						isRecentlyUsedChanged = true;
					} else if (findIndex !== 0) {	// move item to 1st option
						prevRencentlyUsedValues.unshift(prevRencentlyUsedValues[findIndex]);
						prevRencentlyUsedValues.splice(findIndex + 1, 1);
						isRecentlyUsedChanged = true;
					}
				}
			}
		});

		if (isRecentlyUsedChanged) {
			recalibration.saveCombinatorialAddRowsSettings(tableName, this.savedOptionValues);
		}

		this.onClose();
	}

	@action
	saveOptionValue = (name, value) => {
		const { metadata: { name: tableName }, recalibration } = this.props;
		if (value === null) {
			Reflect.deleteProperty(this.savedOptionValues.options, name);
		} else {
			this.savedOptionValues.options[name] = value;
		}

		recalibration.saveCombinatorialAddRowsSettings(tableName, this.savedOptionValues);
	}

	@action
	saveStaticOptionValue = (name, value) => {
		const { metadata: { name: tableName }, recalibration } = this.props;
		if (value === null) {
			Reflect.deleteProperty(this.savedOptionValues.staticOptions, name);
		} else {
			this.savedOptionValues.staticOptions[name] = value;
		}

		recalibration.saveCombinatorialAddRowsSettings(tableName, this.savedOptionValues);
	}

	toggleOverwrite = () => {
		this.saveStaticOptionValue('overwrite', !this.savedOptionValues.staticOptions['overwrite']);
	}

	toggleSetTargets = () => {
		this.saveStaticOptionValue('matchTargets', !this.savedOptionValues.staticOptions['matchTargets']);
	}

	cilckSetTarget = (e) => {
		this.saveStaticOptionValue('target', e.target.value);
	}

	isStatisticOnlyContainsMean = (statistic = []) => {
		return statistic.indexOf('mean') !== -1;
	}

	checkSetTargetsBy = (statistic) => {
		const isOnlyMean = this.isStatisticOnlyContainsMean(statistic);
		if (!isOnlyMean) {
			if (this.savedOptionValues.staticOptions['target'] === 'forward') {
				this.savedOptionValues.staticOptions['target'] = 'prev';
			}
		}
	}

	transferYMtoMonth(maturity) {
		let monthNumber = 0;

		if (/(^[1-9]\d{0,2}y$)|(^[1-9]\d{0,2}m$)|(^[1-9]\d{0,2}y[1-9]{1}\d{0,2}m$)/.test(maturity)) {
			const matchYearResult = maturity.match(/[1-9]\d{0,2}y/);
			if (matchYearResult) {
				const year = parseInt(matchYearResult[0].replace('y'));
				monthNumber += 12*year;
			}

			const matchMonthResult = maturity.match(/[1-9]\d{0,2}m/);
			if (matchMonthResult) {
				const month = parseInt(matchMonthResult[0].replace('m'));
				monthNumber += month;
			}
		} else {
			monthNumber = parseInt(maturity);
		}

		return monthNumber;
	}

	render() {
		const { applicableOptions, numberOfAddRows } = this;
		const isAddRowsDisabled = numberOfAddRows === 0;
		const isStatisticAvailable = applicableOptions.some((option) => option.name === 'statistic');
		const isOverWrite = this.savedOptionValues.staticOptions['overwrite'] || false;
		const isSetTargets = this.savedOptionValues.staticOptions['matchTargets'] || false;
		const setTargetsBy = this.savedOptionValues.staticOptions['target'] || '';
		const addRowsButtonText = numberOfAddRows > 1 ?
		                          i18n.intl.formatMessage({defaultMessage: "Add {numberOfAddRows} Rows", description: "[CombinatorialAddRows] dialog confirm button text"}, {numberOfAddRows}) :
		                          i18n.intl.formatMessage({defaultMessage: "Add {numberOfAddRows} Row", description: "[CombinatorialAddRows] dialog confirm button text"}, {numberOfAddRows});
		let isOnlyMean = false;

		if (isStatisticAvailable) {
			isOnlyMean = this.isStatisticOnlyContainsMean(this.savedOptionValues.options['statistic']);
		}

		return (
			<div className={css.popoverContainer} ref={this._contentRef}>
				<div className={css.dialogContent}>
					{applicableOptions.map(this.renderOption)}
					<div className={css.subContent}>
						{isStatisticAvailable &&
						<div className={css.inputRow}>
							<div>
								<bp.Checkbox checked={isSetTargets} onChange={this.toggleSetTargets}>
									<FormattedMessage defaultMessage={"Set targets to match those implied by:"} description={"[CombinatorialAddRows] Set targets to match those implied by options below"}/>
								</bp.Checkbox>
							</div>
							<div className={`${css.inputElement} ${css.setTargetsBy}`}>
								<bp.RadioGroup
									onChange={this.cilckSetTarget}
									selectedValue={setTargetsBy}
								>
									<bp.Radio label={i18n.intl.formatMessage({defaultMessage: "Previous parameters", description: "[CombinatorialAddRows] a sub option for the targets option"})}
											  value="Previous_Parameters" />
									<bp.Radio label={i18n.intl.formatMessage({defaultMessage: "Forward yields", description: "[CombinatorialAddRows] a sub option for the targets option"})}
											  value="Forward_Yield"
											  disabled={!isOnlyMean} />
								</bp.RadioGroup>
							</div>
						</div>
						}
						<div className={css.inputRow}>
							<div className={css.inputElement}>
								<bp.Checkbox checked={isOverWrite} onChange={this.toggleOverwrite}>
									<FormattedMessage defaultMessage={"Overwrite matching existing row(s)"} description={"[CombinatorialAddRows] Overwrite matching existing rows on the target table"}/>
								</bp.Checkbox>
							</div>
						</div>
					</div>
				</div>
				<div className={css.dialogFooter}>
					<bp.Button text={i18n.common.DIALOG.CANCEL} onClick={this.onClose} elementRef={(ref) => this._cancelButtonRef=ref} />
					<bp.Button className={css.addRowsButton} intent={bp.Intent.PRIMARY} text={addRowsButtonText} onClick={this.executeAddRows} disabled={isAddRowsDisabled} />
				</div>
			</div>
		);
	}
}