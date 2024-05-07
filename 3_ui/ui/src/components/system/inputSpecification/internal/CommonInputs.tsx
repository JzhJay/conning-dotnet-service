import {Icon} from '@blueprintjs/core';
import {ItemPredicate, MultiSelect, Select} from '@blueprintjs/select';
import { computed, observable, makeObservable, action } from 'mobx';
import {observer} from 'mobx-react';
import {Fragment} from 'react';
import * as React from 'react';
import {bp, Option} from 'components';
import {user} from 'stores';
import {convertMonthToYM, convertYMtoMonth, formatLabelText, validateYMFormat} from 'utility';
import * as css from '../InputSpecificationComponent.css';
import {ClosableTooltip} from './ClosableTooltip';
import {Validation} from '../models';

export interface ValidationMessage {
	value: string | number;
	message: string;
};

interface ResizeableInputProps {
	defaultValue: number;
	onChange: (e) => void;
	minimum?: number;
	maximum?: number;
	allowNull?: boolean;
	readOnly?: boolean;
	className?: string;
	style?: any;
	animateChanges?: boolean;
	inputType?: "float" | "integer" | "string";
	placeholder?: string;
	floatDecimal?: number;
	validator?: (value) => ValidationMessage;
}

@observer
export class ResizeableInput extends React.Component<ResizeableInputProps, {}> {
    renderValue = null; // The value the component was mounted with or the user updated.
    @observable tooltip = null;
    inputElement: HTMLElement = null;
    measurementElement: HTMLElement = null;
    styles:string[] = ['font-size','font-style', 'font-weight', 'font-family', 'text-transform', 'letter-spacing', 'text-spacing', 'border-spacing', 'padding', 'margin', 'border'];

    constructor(props: ResizeableInputProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount(): void {
		//copy style
		const $input = $(this.inputElement);
		const $measurement= $(this.measurementElement);

		this.styles.map(style => { $measurement.css(style, $input.css(style)); });

		this.fixWidth();
	}

    onFocus = (e) => {
		e.target.value = this.formatNumericValueString(`${this.props.defaultValue}`);
		this.fixWidth();
	}

    onBlur = (e) => {
		this.change(e);
		e.target.value = this.formattedValue;
	}

    onKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.change(e);
		} else if(`${e.key}`.length == 1) {
			this.fixWidth($(this.measurementElement).html(e.key).width());
		}
	}

    onKeyUp = (e) => {

		if (this.typeIsString) { this.fixWidth(); return; }

		let val = e.target.value || '';
		if (!val) { this.fixWidth(); return; }
		let isMinus = !!val.match(/^-/) && !val.match(/^--/);
		if (this.props.inputType == 'integer') {
			val = val.replace(/[^0-9]/g,'');
			let headZero = val.match(/^0+/);
			if (headZero && headZero.length) {
				if (headZero[0].length == val.length) { val = '0'; }
				else { val = val.replace(/^0+/,''); }
			}
		} else {
			val = val.replace(/[^0-9.]/g,'');
			let point = val.indexOf('.');
			let integer = point >= 0 ? val.substring(0,point).replace(/[^0-9]/g,'')||'0' : val ;
			let decimal = point >= 0 ? val.substring(point+1).replace(/[^0-9]/g,'') : '';
			let headZero = integer.match(/^0+/);
			if (headZero && headZero.length) {
				if (headZero[0].length == integer.length) { integer = '0'; }
				else { integer = integer.replace(/^0+/,''); }
			}
			val = integer + ( point >= 0 ? `.${decimal}` : '' );
		}

		// Note: We need to preserve trailing periods (.) when user is actively typing so they don't disappear  as the user is entering a decimal
		e.target.value = this.formatNumericValueString(( isMinus ? '-' : '') + val, true);
		this.fixWidth();

		// e.target.value = e.target.value.replace( /[^0-9./-]/,'');
		// this.fixWidth(e.target);
	}

    change(e) {
		if (this.props.readOnly) {
			return;
		}

		let value = e.target.value;
		if (this.props.validator) {
			const { value: _value, message }= this.props.validator(value);
			value = _value;
			this.tooltip = message;
		} else if (this.typeIsString) {
			this.renderValue = e.target.value;
			this.props.onChange(e.target.value);
			return;
		} else {
			const {minimum, maximum, allowNull, defaultValue} = this.props;
			value = _.toNumber(this.parseNumericValueString(e.target.value));

			if (!_.isFinite(value)) {
				if (allowNull) {
					value          = 0;
					e.target.value = value;
				}
				else {
					value = defaultValue;
					e.target.value = this.formatNumericValueString(`${defaultValue}`);
					return;
				}
			}

			/*
			if (this.props.inputType == 'integer') {
				value = _.round(value, 0);
			} else if (this.props.inputType == 'float' && _.isFinite(this.props.floatDecimal)) {
				value = _.round(value, this.props.floatDecimal);
			}
			*/

			if (minimum != null && value < minimum) {
				value = minimum;
				this.tooltip = `Input limited to the minimum value of ${minimum}`;
			}

			if (maximum != null && value > maximum) {
				value = maximum;
				this.tooltip = `Input limited to the maximum value of ${maximum}`;
			}
		}

		e.target.value = value;
		this.renderValue = value;
		this.props.onChange(value);
	}

    fixWidth = (width_addon=0 ) => {
		const $input = $(this.inputElement);
		const $measurement = $(this.measurementElement);
		$measurement.html(_.escape(($input.val() !== "" ? $input.val() : (this.placeholder || ""))) + '&nbsp;');
		$input.width($measurement.width() + width_addon);
	}

    get typeIsString(){
		return this.props.inputType != 'integer' && this.props.inputType != 'float';
	}

    get placeholder () {
		return this.props.placeholder != null && !this.props.readOnly ? `Enter ${this.props.placeholder}` : null;
	}

	formatNumericValueString = (value: string, preserveTrailingPeriod = false): string => {
		if (!value || this.typeIsString || !_.isFinite(parseFloat(`${value}`)) )
			return value;

		const valueSplit = `${value}`.split('.');
		let formattedValue = Intl.NumberFormat('en-US').format(parseInt(valueSplit[0])) + (valueSplit[1] ? `.${valueSplit[1]}`: '');

		if (preserveTrailingPeriod && value[value.length - 1] === "." && formattedValue[formattedValue.length - 1] !== ".")
			formattedValue += ".";

		return formattedValue;
	}

    parseNumericValueString = (value: string): string => {
		// regExp for check the value is a formatted number string with comma (ex: 1,234.56 ). if it is a number only with decimal part, return directly.
		if (!value || this.typeIsString || !`${value}`.match(/^[1-9][0-9,]*(.[0-9]+)?$/) )
			return value;

		return `${value}`.replace(/,/g, '');
	}

    get formattedValue() {
		if (this.props.defaultValue == null) {
			return '';
		}

		const stringValue = _.toString(this.props.defaultValue);
		if (this.typeIsString) {
			return stringValue;
		}
		const numberValue = _.toNumber(stringValue);

		if(!_.isFinite(numberValue)) {
			return numberValue;
		}

		if (this.props.inputType == 'integer') {
			_.toString(_.round(numberValue, 0));
		}

		const floatDecimal = _.isFinite(this.props.floatDecimal) ? this.props.floatDecimal : 4;
		return this.formatNumericValueString(_.toString(_.round(numberValue, floatDecimal)));

	}

    render() {
		// Clip precision for floats
		let defaultValue = this.formattedValue;

		return <ClosableTooltip
			tooltip={this.tooltip}
			onClosed={() => this.tooltip = null}
		>
			<>
				<input
					key={defaultValue}
					ref={ ref => this.inputElement = ref}
					title={this.props.defaultValue != null ? this.props.defaultValue.toString() : ""}
					defaultValue={defaultValue}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
					placeholder={this.placeholder}
					onKeyUp={this.onKeyUp}
					onKeyPress={this.onKeyPress}
					pattern="[0-9]*"
					className={classNames(this.props.className, css.inlineInput, {[css.highlight]: this.renderValue != null && this.renderValue != defaultValue && this.props.animateChanges !== false} )}
					style={this.props.style}
					readOnly={this.props.readOnly}
				/>
				<div
					ref={ ref => this.measurementElement = ref}
					style={{
						position: 'absolute',
						whiteSpace: "nowrap",
						visibility: 'hidden'
					}}
				/>
			</>
		</ClosableTooltip>
	}

    componentDidUpdate(prevProps: Readonly<ResizeableInputProps>, prevState: Readonly<{}>, prevContext: any): void {
		this.props.animateChanges !== false && setTimeout(() => this.renderValue = this.props.defaultValue, 2000);
		this.fixWidth();
	}
}

export class ResizeableTextarea extends React.Component<{
	defaultValue: string,
	onChange: (value:string) => void,
	className?: string,
	placeholder?: string,
	readOnly?: boolean,
	allowNull?: boolean
}, any> {
	$inputElement: JQuery = null;
	$measurementElement: JQuery = null;
	styles:string[] = ['font-size','font-style', 'font-weight', 'font-family', 'text-transform', 'letter-spacing', 'text-spacing', 'border-spacing', 'padding', 'margin', 'border', 'line-height'];

	constructor(props) {
		super(props);
	}

	componentDidMount(): void {
		this.styles.map(style => this.$measurementElement.css(style, this.$inputElement.css(style)));
		this.$inputElement.css({'overflow-y': 'hidden'});
		this.$measurementElement.css('max-width', this.$measurementElement.parent().width());
		this.$measurementElement.css('white-space', "nowrap");
		this.resize();
	}

	componentDidUpdate(prevProps, prevState) {
		if (!this.isFocusing && this.props.defaultValue != this.$inputElement.val()) {
			this.$inputElement.val(this.props.defaultValue);
			this.resize();
		}
	}

	get isFocusing() {
		return this.$inputElement.is('*:focus');
	}

	resize = () => {
		let value = this.$inputElement.val();
		value = value ? this.isFocusing ? `${value}.` : value : this.props.placeholder || "X";

		// Get the width of the widest word without wrapping and use that to size the entire textbox
		// Note that the actual rendered content will still be allowed to wrap when the textbox hits its max width and this is
		// the desired behavior
		const longestLineWidth = value.split(/\r\n|\r|\n/).reduce((longestLength, current) => {
			this.$measurementElement.html(current);
			return Math.max(this.$measurementElement.width(), longestLength);
		}, 0);

		this.$inputElement.width(longestLineWidth);
		this.$inputElement.height("auto"); // Reset height to pick up new scroll height
		this.$inputElement.height(this.$inputElement.get(0).scrollHeight);
	}

	onChange = (e: React.FocusEvent) => {
		let value = this.$inputElement.val();
		value = value.replace(/(^[\n\r]*)|([\n\r\s]*$)/g, "");
		if (!value && this.props.allowNull === false) {
			this.$inputElement.val(this.props.defaultValue);
		} else {
			this.props.onChange(value);
		}
		this.resize();
	}

	render() {
		return <>
			<textarea defaultValue={this.props.defaultValue}
			          className={this.props.className}
			          ref={ref => this.$inputElement = $(ref)}
			          onChange={this.resize}
			          onBlur={this.onChange}
			          placeholder={this.props.placeholder}
			          readOnly={this.props.readOnly}
			/>
			<div ref={ref => this.$measurementElement = $(ref)}
			     style={{position: 'absolute', visibility: 'hidden'}}

			/>
		</>;
	}
}

const RenderOptions = Select.ofType<any>()

interface DropdownOptionsProps {
	onChange: (item) => void;
	items: Array<{value: string | number, label: string, description?: string}>
	selectedValue: string | number;
	path: string;
	validations: {[key: string]: Validation};
	isFilterable?: boolean;
}

export class DropdownOptions extends React.Component<DropdownOptionsProps, {}> {

	filterItem: ItemPredicate<{value: string | number, label: string, description?: string}> = (query, option) => {
		return option.label.toLowerCase().indexOf(query.toLowerCase()) >= 0;
	};

	render() {
		const {selectedValue, items, onChange, path, validations} = this.props;
		const selectedItem = items.find(item => item.value == selectedValue);
		const isFilterable = this.props.isFilterable !== false;

		return <RenderOptions items={items}
			                      filterable={isFilterable}
			                      itemPredicate={isFilterable ? this.filterItem : null}
			                      popoverProps={{position: bp.Position.BOTTOM, minimal: true}}
			                      onItemSelect={onChange}
			                      itemRenderer={(item, {handleClick, modifiers}) => {
				                      return <a className={classNames(bp.Classes.MENU_ITEM,
					                      {[bp.Classes.ACTIVE]: item.value == selectedValue}
				                      )}
				                                key={item.value}
				                                onClick={handleClick}>
					                      {item.label}
				                      </a>
			                      }}
			                      noResults={<bp.MenuItem disabled={true} text="No results." />}
		>
			<Validator path={path} validations={validations}> <span> {selectedItem != null ? selectedItem.label : "Unspecified"} </span> <Icon icon='caret-down'/> </Validator>
		</RenderOptions>
	}
}

interface ValidatorProps {
	path: string;
	validations: {[key: string]: Validation};
}

export class Validator extends React.Component<ValidatorProps, {}> {
	render() {
		const {path, validations} = this.props;
		const error = validations[path];
		const isError =  error && error.errorType == "Error";
		const isWarning =  error && error.errorType == "Warning";

		return <div
			className={classNames(css.validator, {[css.severeError]: isError}, {[css.warning]: isWarning})}
		>
			<div style={{display: "flex"}}>
				{this.props.children}
			</div>
			{isError &&
			<bp.Tooltip position={bp.Position.TOP_LEFT}
			            intent={bp.Intent.DANGER}
			            portalClassName={css.validatorPopover}
			            content={error.description}
			            boundary={"preventOverflow" as any}
                        className={css.validatorPopoverWrapper}>
                <div></div>
			</bp.Tooltip>
			}
			{isWarning &&
			<bp.Tooltip position={bp.Position.TOP_LEFT}
			            intent={bp.Intent.WARNING}
			            portalClassName={css.validatorPopover}
			            content={error.description}
						boundary={"preventOverflow" as any}
			            className={css.validatorPopoverWrapper}>
				<div></div>
			</bp.Tooltip>
			}
		</div>
	}
}


interface  ListItemInputProps {
	option: Option;
	onChange: (value: any[], baseComponent: ListItemInput) => void;
	inputType?: string;
	defaultValue?: any[];
	fill?: boolean;
	saveRecentlyUsedPath?: string;
	defaultRecentlyUsed?:string[][];
	showDropdownList?: boolean;
	createNewItemFromQuery?: true|false|((query: string, createFromUserInput: boolean, baseComponent: ListItemInput)=>Option);
}

@observer
export class ListItemInput extends React.Component<ListItemInputProps, {}> {

	static MAX_RECENTLY_ITEMS = 5;

	@observable tooltip = null;
	@observable query = "";

	@observable selectedItems: Option[] = [];
	@observable recentlyUsed: string[][] = [];
	afterBlurEvent: boolean = false;

	constructor(props) {
        super(props);

		let data = [];
		if (this.saveRecentlyUsedPath) {
			const { profile } = user;
			data = [..._.get(profile.userMetadata, this.saveRecentlyUsedPath)];
			data && (data = data.reverse());
		}
		if (this.props.defaultRecentlyUsed) {
			data = [...(data||[]), ...this.props.defaultRecentlyUsed];
		} else if (this.props.option.hints?.recentlyUsedList ) {
			data = [...(data||[]), ...this.props.option.hints?.recentlyUsedList];
		}
		this.recentlyUsed = data?.slice(0, ListItemInput.MAX_RECENTLY_ITEMS);


        makeObservable(this);
        this.setSelectedItem(this.props.defaultValue);
    }

	get inputType() {
		let propsInputType = this.props.inputType;
		return propsInputType ? propsInputType : _.get(this.props.option, "options.0.inputType");
	}

	get typeIsString() {
		const inputType = this.inputType;
		return inputType != 'integer' && inputType != 'float';
	}

	@computed get items() {
		return _.filter(this.props.option.options, option => option.name && option.applicable !== false);
	}

	@computed get allowCreate() {
		return this.props.createNewItemFromQuery !== false;
	}

	@computed get saveRecentlyUsedPath () {
		return this.props.saveRecentlyUsedPath ? `ui.listItemInput.recentlyUsed.${this.props.saveRecentlyUsedPath}` : null;
	}

	@action saveRecentlyUsed = (value: string[]) => {
		if (!value?.length)
			return;

		const hasSame = _.findIndex(this.recentlyUsed, (recent) => _.difference(recent,value).length == 0 && _.difference(value,recent).length == 0);

		if (hasSame >= 0) {
			this.recentlyUsed = [value, ...this.recentlyUsed.filter((recent, i) => i != hasSame)];
		} else {
			this.recentlyUsed = [value, ...this.recentlyUsed].slice(0, ListItemInput.MAX_RECENTLY_ITEMS);
		}

		// save to user metadata. no defaults options from props.
		if (!this.saveRecentlyUsedPath)
			return;

		const { profile } = user;
		const newUserMetadata = _.merge({}, profile.userMetadata );
		let data = _.get(newUserMetadata, this.saveRecentlyUsedPath);
		if (data?.length) {
			if (hasSame >= 0) {
				data = [value, ...data.filter((d, i) => i != hasSame)]
			} else {
				data.push(value);
				data = data.slice(-1 * ListItemInput.MAX_RECENTLY_ITEMS);
			}
		} else {
			data = [value];
		}
		_.set(newUserMetadata, this.saveRecentlyUsedPath, data);
		user.updateUserMetadata(newUserMetadata);
	}

	setSelectedItem = (names: string[]) => {
		this.selectedItems = _.map<string, Option>(names || [], (name) => this.getOptionFromName(name, false)).filter(item => !!item);
	}

	getOptionFromName = (name: string, checkDuplicate: boolean = true): Option|null => {
		return _.find<Option>(this.items, item => this.itemPredicate(name, item)) || this.createItem(name, checkDuplicate);
	}

	validateValueLimits = (value: any) :boolean => {
		let maximum = _.find<any[]>(this.props.option.options, o => o.maximum)?.maximum;
		let minimum = _.find<any[]>(this.props.option.options, o => o.minimum)?.minimum;
		value = parseFloat( _.toString(value));
		if (value === Number.NaN) {
			this.tooltip = `Input should be a number`;
			return false;
		}

		if (minimum != null && value < minimum) {
			this.tooltip = `Input limited to the minimum value of ${minimum}`;
			return false;
		}

		if (maximum != null && value > maximum) {
			this.tooltip = `Input limited to the maximum value of ${maximum}`;
			return false;
		}
		return true;
	}

	createItem = (query: string, createFromUserInput: boolean = true) => {

		createFromUserInput && (this.tooltip = null);

		const createNewItemFromQuery = this.props.createNewItemFromQuery;
		let newItem: Option;
		if(_.isFunction(createNewItemFromQuery)) {
			newItem = createNewItemFromQuery(query, createFromUserInput, this);
		} else if (createNewItemFromQuery === true) {
			newItem = {name: query, title: query};
		}

		if (newItem) {
			const compareItemPredicate = (item) => {
				return (newItem.defaultValue != null ? item.defaultValue === newItem.defaultValue : false) || this.tagRenderer(newItem) == this.tagRenderer(item);
			};

			if(createFromUserInput) {
				if (!this.typeIsString && !this.validateValueLimits(newItem.defaultValue != null ? newItem.defaultValue : newItem.name))
					return null;

				if (_.some(this.selectedItems, compareItemPredicate)) {
					this.tooltip = `input "${query}" already exist.`;
					return null;
				}
			}

			let foundItem = _.find(this.items, compareItemPredicate)
			if (foundItem) {
				return foundItem;
			}
		}

		return newItem;
	}

	renderCreateOption = ( query: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement> ) => {
		let option = this.createItem(query);
		if (option == null) {
			return null;
		}
		return <bp.MenuItem
			icon="add"
			text={`Create "${this.tagRenderer(option)}"`}
			active={active}
			onClick={handleClick}
			shouldDismissPopover={false}
		/>;
	};

	tagRenderer = (option) => {
		return option.title || formatLabelText(option.name);
	}

	itemRenderer = (option: Option, { modifiers, handleClick }) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}
		return <bp.MenuItem
			active={modifiers.active}
			icon={this.isItemSelected(option) ? 'tick' : 'blank'}
			key={option.name}
			onClick={handleClick}
			text={this.tagRenderer(option)}
			shouldDismissPopover={false}
		/>
	}

	onItemSelect = (option) => {
		if (this.isItemSelected(option)) {
			_.remove(this.selectedItems, item => item.name == option.name);
		} else {
			this.selectedItems.push(option);
		}
		this.executeChange();
	}

	itemPredicate: 	ItemPredicate<Option> = (query: string, option) => {
		const testQuery = `${query}`.toLowerCase();
		const testName = `${this.tagRenderer(option)}`.toLowerCase();
		return (testName.indexOf(testQuery) === 0);
	};

	onItemRemoveByDisplay = (name) => {
		_.remove(this.selectedItems, item => this.tagRenderer(item) == name);
		this.executeChange();
	}

	isItemSelected(option) {
		return _.some(this.selectedItems, item => item.name == option.name)
	}

	executeChange = () => {
		const value = _.map(this.selectedItems, item => item.defaultValue != null ? item.defaultValue : item.name);
		this.props.onChange(value, this);
	}

	@observable openRecentlyUsedPopup:boolean = false;

	@computed get tagInputItemButton() {
		const {saveRecentlyUsedPath} = this;
		return <>
			{this.selectedItems.length > 0 && <bp.Tooltip>
				<bp.Button icon="cross" minimal={true} tabIndex={-1} onClick={() => {
					this.selectedItems = [];
					this.executeChange();
				}} />
				<span>Remove All</span>
			</bp.Tooltip>}
			{saveRecentlyUsedPath && <bp.Popover
				isOpen={this.openRecentlyUsedPopup}
				onClose={() => this.openRecentlyUsedPopup = false}
				position={bp.Position.BOTTOM_RIGHT}
				disabled={!history?.length}
				content={<bp.Menu>{
					_.map(this.recentlyUsed, (names, i) => <bp.MenuItem
						key={`rc${i}`}
						text={<>{_.map(names, name => {
							let option: Option = this.getOptionFromName(name, false);
							if (!option)
								return null;
							return <Fragment key={`rc${i}_${option.name}`}><bp.Tag minimal={true}>{this.tagRenderer(option)}</bp.Tag>&nbsp;</Fragment>;
						})}</>} onClick={() => {
							this.setSelectedItem(names);
							this.executeChange();
						}}
					/>)
				}</bp.Menu>}
			>
				<bp.Button icon="caret-down" minimal={true} tabIndex={-1} onClick={(e) => {
					e.stopPropagation();
					if (this.recentlyUsed?.length) {
						this.openRecentlyUsedPopup = true;
					}
				}}/>
			</bp.Popover>}
		</>;
	}

	render() {
		const {fill} = this.props;

		return <ClosableTooltip
			tooltip={this.tooltip}
			onClosed={() => this.tooltip = null}
		>
			<MultiSelect<Option>
				className={css.listItemInput}
				selectedItems={this.selectedItems}
				query={this.query}

				resetOnQuery={true}
				resetOnSelect={true}
				fill={_.isBoolean(fill) ? fill : true}
				noResults={<Fragment />}
				placeholder={this.items?.length ? null : ''}

				createNewItemFromQuery={(query) => {
					if (!this.afterBlurEvent)
						return this.createItem(query)
					else
						this.afterBlurEvent = false;
					return null;
				} }
				// createNewItemRenderer={this.renderCreateOption}

				items={this.items}
				itemRenderer={this.itemRenderer}
				itemPredicate={this.itemPredicate}
				onItemSelect={this.onItemSelect}

				tagRenderer={this.tagRenderer}
				tagInputProps={{
					inputProps: {
						type: this.typeIsString ? "text" : "number",
						onBlur: (event) => {
							const target = event.target;
							const query = target.value;
							if (query) {
								this.afterBlurEvent = true;
								let option: Option = this.getOptionFromName(query)
								if (option && !this.isItemSelected(option)) {
									this.onItemSelect(option);
									this.query = `${query} `;
									setTimeout(() => this.query = "", 0);
								}
							}
							let names = _.map(this.selectedItems, item => item.name);
							names?.length && this.saveRecentlyUsed(names);
						}
					},
					tagProps: {
						intent: bp.Intent.PRIMARY
					},
					onRemove: this.onItemRemoveByDisplay,
					rightElement: this.tagInputItemButton
				}}

				popoverProps={{
					position: bp.PopoverPosition.BOTTOM_LEFT,
					minimal: true,
					usePortal: false,
					boundary: 'viewport',
					disabled: !(this.items?.length)
				}}
			/>
		</ClosableTooltip>;
	}
}

export class ListMaturityInput extends React.Component<ListItemInputProps, {}> {
	render() {
		return <ListItemInput
			{...this.props}
			inputType={"maturity"}
			createNewItemFromQuery={(query, createFromUserInput, baseComponent) => {
				if (!validateYMFormat(query)) {
					return null;
				}
				const ym = convertMonthToYM(query);
				const month = convertYMtoMonth(ym);
				if (createFromUserInput && !baseComponent.validateValueLimits(month)) {
					return null;
				}
				return {name: ym, title: ym, defaultValue:month};
			}}
			onChange={(value, baseComponent) => {
				if (baseComponent.selectedItems) {
					baseComponent.selectedItems = _.sortBy(baseComponent.selectedItems, item => item.defaultValue);
					this.props.onChange(_.map(baseComponent.selectedItems, item => item.defaultValue), baseComponent);
				}
			}}
		/>;
	}

}