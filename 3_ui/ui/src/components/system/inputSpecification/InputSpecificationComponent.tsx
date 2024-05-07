import {RadioGroup, Radio, Button, Icon, ButtonGroup, Checkbox, Popover, Tooltip, Position, ContextMenuTarget, AnchorButton, Switch, NavbarDivider} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';
import {bp, ListMaturityInput, ResizeableTextarea, ResizeSensorComponent} from 'components';
import {FormattedMessage} from 'react-intl';
import {i18n, site, utility} from 'stores';
import {Toolbar} from '../toolbar/Toolbar';
import {InputTable} from '../userInterfaceComponents/Table/InputTable';
import * as css from './InputSpecificationComponent.css';
import type {InputSpecification, Option} from './InputSpecification';
import {Observer, observer} from 'mobx-react'
import { computed, observable, makeObservable, action } from 'mobx';
import * as React from 'react';
import {ResizeableInput, Validator, ValidationMessage} from './internal/CommonInputs';
import type {IDynamicStructureRowPath} from './models';
import type {InputSpecificationUserOptions, Validation} from './models';
import FlipMove from 'react-flip-move';
import {getFormattedDescription, LineBreak} from 'components/system/inputSpecification/internal/helperMethods';

interface MyProps {
	userOptions: InputSpecificationUserOptions;
	specification: InputSpecification;
	inputs: any;
	applyUpdate: (update: any) => void;
	validations: {[key: string]: Validation};
	globalLists?: any;
	axes?: any;
	additionalProps?: any;
	updateUserOptions?: (options) => void;
	allowScrolling?: boolean;
	showToolbar?: boolean;
	showViewTitle?: boolean;
	className?: string;
	onInvalidate?: () => void;
	onSelect?: (dynamicNodePath: string[], innerPath: string[], isDefaultSelection: boolean) => void;
	shouldRender?: () => boolean;
	renderSpecificationAsControl?: boolean;
	getValidator?: (Option) => (value) => ValidationMessage;
	allowClassicRenderMode?: boolean;
	dynamicStructureRowPaths?: Array<IDynamicStructureRowPath>;
}

const RenderOptions = Select.ofType<Option>();

@observer
export class InputSpecificationComponent extends React.Component<MyProps, {}> {
    static defaultProps = {
		showToolbar: true,
		showViewTitle: true
	};

    scrollContainer: Element;
    @observable maxTableHeight: string = "100vh";

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);

		this.userOptions = _.clone(this.props.userOptions);
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (!_.isEqual(prevProps.userOptions, this.props.userOptions)) {
			this.userOptions = _.clone(this.props.userOptions);
		}
	}

    _resizeableInputs: ResizeableInput[] = [];
    fixResizeableInputsWidth = () => {
		this._resizeableInputs.forEach( c => {
			try { c?.fixWidth(); } catch (e) { console.log(e) }
		});
	}

    setOptionChoice = (control: Option, path: string, value: string | number | boolean) => {
		if (!this.props.renderSpecificationAsControl)
			path = `${this.props.specification.name}.${path.split(".").slice(1).join(".")}`;
		this.props.applyUpdate(_.set({}, path, value));
	}

	@action
	onResize = () => {
		// Prop naming is reversed. allowScrolling actually means that this component shouldn't be scrolled because it's being rendered in a scrollable container.
		const canScrollComponent = !this.props.allowScrolling;

		// Clip height of table to the height of the container (dialog body) to enable virtualization in tables and allow for faster rendering.
		if (this.scrollContainer && canScrollComponent) {
			let element = ReactDOM.findDOMNode(this.scrollContainer);
			let titleHeight = $(element).find(`.${css.title}`).height() || 0;
			let spacingHeight = parseInt(this.getCSSPropertyValue("--line-spacing")) * 2;
			// Adjust for titles and line spacings + a 5px buffer. This will avoid and extra scrollbar when views contain a single table
			this.maxTableHeight = ((element as any).clientHeight - titleHeight - spacingHeight - 5) + "px";
		}
		else if (!canScrollComponent) {
			this.maxTableHeight = null;
		}
	}

    getFieldPath(control: Option, name: string) {
		const path = name;
		return `${this.props.specification.name}.${path}`;
	}

    getOptionValue(path, option) {
		const stored = _.get(this.props.inputs, path);
		return stored != null ? stored : option.defaultValue;
	}

	alignToTop(options) {
		return (options.inputType == "" || options.inputType == "string") && options?.hints?.multiLineInput == true;
	}

    renderOptions(control: Option, options, verboseMode: boolean, path: string) {
		let result, before, after;
	    const {inClassicRenderingMode} = this;

		if (control.compactOverride || options.compactOverride)
			verboseMode = false;

		// Determine text that appears before and after control from interpolation string
		if (control.interpolate && (options.inputType == "exclusive" || options.options == null)) {
			if (control.interpolate.indexOf(`${options.name}`) == -1)
				return null;

			const groups = control.interpolate.split(`{${options.name}}`);
			before = groups[0].substr(groups[0].lastIndexOf("}") + 1);
			after = groups[1].indexOf("{") == -1 ? groups[1] : "";
		}

		// Not applicable falls through so we can animate applicability changes
		if (options.applicable) {
			if (options?.customRenderer) {
				result = options?.customRenderer(options, _.get(this.props.inputs, path), path);
			}
			else if (options?.hints?.dimension != null) {
				const dynamicTableRow = _.first(_.get(this.props.dynamicStructureRowPaths?.find(p => p.dynamicNodePath.join(".") == path), "innerPath"))
				const dynamicTableColumn = 0; // Note: If the back-end is ever updated to consider the column choice for dynamic tables, then we will need to also store or convert the column path.
				result = <InputTable userInterface={options}
				                     data={_.get(this.props.inputs, path)}
				                     globalLists={this.props.globalLists}
				                     axes={this.props.axes}
				                     showToolbar={false}
				                     maxTableHeight={this.maxTableHeight}
				                     validationMessages={this.props.validations}
				                     path={path}
				                     defaultSelection={dynamicTableRow ? {row: parseInt(dynamicTableRow), column: dynamicTableColumn} : null}
				                     onUpdateAxis={this.props.applyUpdate}
				                     onUpdateValue={(updateValues, paths) => this.props.applyUpdate(_.set({}, path, updateValues))}
				                     onSelect={this.props.onSelect ? (cellPath, isDefaultSelection) => this.props.onSelect(path.split("."), cellPath, isDefaultSelection) : null}
									 shouldRender={this.props.shouldRender}
				                     onInvalidate={this.props.onInvalidate}
				/>
			}
			else if (options.hints?.maturity && options.options?.length == 1)
				result = this.renderListMaturityInput(control, options, path);
			else if (options.inputType == "exclusive")
				options.options && (result = (verboseMode || options.renderExclusiveAsRadio) ? this.renderRadioOptions(control, options, path) : this.renderDropdownOptions(control, options, path));
			else if (options.options)
				result = <SubOptions useFixedGridColumns={this.inClassicRenderingMode} option={options} subOptionRender={
					(subOption) => this.renderOptions.call(this, control, subOption, verboseMode, path + "." + subOption.name)
				} />;
			else if (options.inputType == "boolean")
				result = this.renderCheckbox(control, options, path);
			else if ((options.inputType == "" || options.inputType == "string") && options?.hints?.multiLineInput == true)
				result = this.renderMultiLineInputField(control, options, path);
			else
				result = this.renderInputField(control, options, path);
		}

		const isGridLayoutRow = options.gridLayout && options.gridLayout != "grid";
		const inline = options.inline || (!verboseMode && options.inputType == "exclusive"); // Always inline dropdowns. This covers the case where the control has a compactOverride, but the node was not explicitly inlined
	    const rowAlignTop = inline && this.alignToTop(options);
		const showTitle = control != options && control.interpolate == null && options.hints?.showTitle && options.title && options.inputType != "boolean";
		const indent = (options.indent || (options.indent == null && control != options)) && !control.inline;
		let addNewLine = control != options && !inline && showTitle;
		const preventInline = !control.interpolate && !inline;
		const radioIndent = options.inputType == "exclusive" && verboseMode && showTitle && options != control && !isGridLayoutRow; // Add additional indent for radio buttons
	    const useFieldSet = inClassicRenderingMode && !!showTitle;

	    return <FlipMove style={{width: "100%"}}>
			{options.applicable && <CopyLocationContextMenuWrapperByOption
				option={options}
				tag={useFieldSet ? "fieldset" : "div"}
				nodeAttrs={{
					key: `${options.name}-${options.applicable}`,
					className: classNames(css.nodeWrapper, css.inline, {[css.indent]: indent,
						[css.preventInline]: preventInline,
						[css.interpolate] : control.interpolate != null,
						[css.gridLayoutRow]: isGridLayoutRow,
						[css.inputWrapper]: options.inputType != null,
						[css.alignTop]: rowAlignTop
					})
				}
			}>
				{useFieldSet && <legend>{this.renderTitle(options, verboseMode)}</legend>}
				{!!before && <span>{before.trimEnd()}&nbsp;</span>}
				{!!showTitle && !useFieldSet && this.renderTitle(options, verboseMode)}
				{!!addNewLine && !useFieldSet && <LineBreak/>}
				<div className={classNames({[css.indent]: radioIndent})} style={{flex: isGridLayoutRow ? 1 : null}}>{result}</div>
				<span>{after}</span>
			</CopyLocationContextMenuWrapperByOption>}
		</FlipMove>
	}

    renderTitle(option: Option, verboseMode: boolean = this.inVerboseMode, formattedTitle?: string, extraIndent:boolean = false) {
		formattedTitle = formattedTitle || option.title;
		const hasDescription = this.hasDescription(option);
		const trailingChar = option.inputType != "boolean" && !this.inClassicRenderingMode ? ":" : "";
		if (!formattedTitle) { return ""; }

		return <>
			{(verboseMode || !hasDescription ) && <CopyLocationContextMenuWrapperByOption
					option={option}
					nodeAttrs={{className: classNames(css.title, {[css.indent]: extraIndent})}}>
						{formattedTitle}{trailingChar}
			</CopyLocationContextMenuWrapperByOption>}
			{!verboseMode && hasDescription && (
				<CopyLocationContextMenuWrapperByOption nodeAttrs={{"data-wrapper": "title"}} option={option}>
					<Tooltip
						className={css.tooltipDescription}
						popoverClassName={css.tooltipDescriptionPopover}
						position={Position.TOP}
						usePortal={true}
						openOnTargetFocus={false}
						content={this.getDescription(option)}
						modifiers={{
							flip: {
								fn: function (dataObject) {
									dataObject.offsets.popper.left = Math.max(70, dataObject.offsets.popper.left);
									let top = dataObject.offsets.reference.top - dataObject.offsets.popper.height - 5;
									if (top < 85) { top = dataObject.offsets.reference.top + dataObject.offsets.reference.height + 5; }
									dataObject.offsets.popper.top = top;
									return dataObject;
								}
							}
						}}
					>
						<div className={css.title}>{formattedTitle}{trailingChar}</div>
					</Tooltip>
				</CopyLocationContextMenuWrapperByOption>
			)}
		</>
	}

    hasDescription(option: Option){
		return !!option.description;
	}

    getDescription(option: Option){
		if(!this.hasDescription(option)){ return ""; }
		return <div className={css.description}>{getFormattedDescription(option.description)}</div>;
	}

    renderInputField(control: Option, option: Option, path) {
		const isPercentage = (option.inputType == 'integer' || option.inputType == 'float' ) && option.hints?.percent;
		let inputValue:any = option.inputType != null && _.get(this.props.inputs, path);
		let optionalValidator = {}

		if (inputValue == null)
			inputValue = option.defaultValue;

		if (isPercentage) {
			inputValue *= 100;
			//inputValue = parseFloat(inputValue.toFixed(2));
		}

		if (this.props.getValidator) {
			const validator = this.props.getValidator(control);
			if (validator) {
				optionalValidator = { validator };
			}
		}

		return <>
			<Validator validations={this.props.validations} path={path}>
				{option.inputType != null &&
					<ResizeableInput defaultValue={inputValue}
					                 minimum={option.minimum != null && isPercentage ? option.minimum * 100 : option.minimum}
					                 maximum={option.maximum != null && isPercentage ? option.maximum * 100 : option.maximum}
					                 allowNull={option.allowNull}
					                 readOnly={option.readOnly}
					                 inputType={option.inputType as any}
					                 placeholder={option.title}
									 onChange={(value) => this.setOptionChoice(control, path, isPercentage ? value / 100 : value)}
					                 ref={ ref => this._resizeableInputs.push(ref) }
									 floatDecimal={option.hints?.decimalPlaces}
									 {...optionalValidator}
					/>}
				{isPercentage && <span>%</span>}
			</Validator>
		</>
	}

	renderMultiLineInputField(control: Option, option: Option, path) {
		let inputValue:any = _.get(this.props.inputs, path);

		if (inputValue == null)
			inputValue = option.defaultValue;

		return <Validator validations={this.props.validations} path={path}>
			<ResizeableTextarea
				defaultValue={inputValue}
				onChange={(value) => {
					this.setOptionChoice(control, path, value);
				}}
				className={classNames(bp.Classes.INPUT, css.textarea)}
				allowNull={option.allowNull}
				readOnly={option.readOnly}
				placeholder={option.title}
			/>
		</Validator>
	}

    renderListMaturityInput(control, option, path) {

		let inputValue:any = _.get(this.props.inputs, path);

		if (inputValue == null || !_.isArray(inputValue) )
			inputValue = option.defaultValue;
		return <Validator validations={this.props.validations} path={path}>
		    <ListMaturityInput
				option = {option}
				defaultValue = {inputValue}
				saveRecentlyUsedPath = {path}
				defaultRecentlyUsed={option.userOption?.defaultRecentlyUsed}
				onChange =  {(value)=> {
					this.setOptionChoice(control, path, value as any);
				}}
			/>
		</Validator>
	}

    renderCheckbox(control: Option, option: Option, path) {
		const {validations} = this.props;
		const {inVerboseMode} = this;
		let inputValue: boolean = this.getOptionValue(path, option);

		return <div className={classNames([css.checkbox, {[css.disableApplicable]: option.disableApplicable }])}>
				<Validator validations={validations} path={path}>
					<Checkbox
						large={true}
						checked={inputValue}
						onChange={() => !option.readOnly && (this.setOptionChoice(control, path, !inputValue)) }
						disabled={option.disableApplicable}
						readOnly={option.readOnly} />
					<div className={css.checkboxLabel}>
						{this.renderTitle(option)}
						{inVerboseMode && this.getDescription(option)}
					</div>
				</Validator>
			</div>
	}

    renderRadioOptions(control: Option, option: Option, path: string) {
		// let name = control.name;
		const existing: string = _.get(this.props.inputs, path);
		const enableItems = _.filter(option.options, o => o.applicable);
		const activeItem = _.find(option.options, c => c.name == existing) || enableItems[0];
		const renderAsButtons = option.hints?.renderAsButtons === true;
		const { validations } = this.props;

		if (renderAsButtons)
			return <Validator validations={validations} path={path}>
				<div className={css.optionGroup} >
					{enableItems.map( c => <bp.Button key={c.name}
					                                  value={c.name}
					                                  className={bp.Classes.INTENT_PRIMARY}
					                                  alignText={bp.Alignment.LEFT}
					                                  rightIcon={'blank'}
					                                  icon={c == activeItem ? 'tick': 'blank'}
					                                  disabled={c.disableApplicable}
					                                  active={c == activeItem}
					                                  onClick={(e) => {
														  if (!c.readOnly) {
															  this.setOptionChoice(control, path, c.name)
														  }
					                                  }}
					>
						<div><span className={css.choiceTitle}>{c.title} </span><span>{c.description}</span></div>
					</bp.Button>)}
				</div>
			</Validator>
		else
			return <Validator validations={validations} path={path}>
				{/*options.title && <><br/><div className={css.title}>{options.title}</div><br/></>*/}
				<RadioGroup
					className={css.options}
					selectedValue={existing}
					onChange={e => {
						const target = (e.target as HTMLOptionElement);
						if (!target.hasAttribute("readonly")) {
							this.setOptionChoice(control, path, target.value == "" ? null : enableItems.find(item => item.name == target.value).name)
						}
					}}
				>
					{enableItems.map( c => <Radio key={c.name}
					                              large={true}
					                              value={c.name}
					                              labelElement={<div><span className={css.choiceTitle}>{c.title}</span>{c.description && <span>. {c.description}</span>}</div>}
					                              disabled={c.disableApplicable}
					                              readOnly={option.readOnly || c.readOnly}
					/>)}
				</RadioGroup>
			</Validator>
	}

    renderDropdownOptions(control: Option, option: Option, path: string) {
		// const name = option.name || control.name;
		const existing: string = _.get(this.props.inputs, path);
		const enableItems = _.filter(option.options, o => o.applicable);
		const activeItem = _.find(option.options, c => c.name == existing) || enableItems[0];

		const isFilterable = enableItems.length > 5;
		const { validations } = this.props;

		return <Validator validations={validations} path={path}>
			{/*options.title && <div className={css.title}>{options.title}</div>*/}
			<RenderOptions items={enableItems}
			               filterable={isFilterable}
			               disabled={option.disableApplicable}
			               noResults={<bp.MenuItem disabled={true} text={i18n.intl.formatMessage({defaultMessage: "No results.", description: "[InputSpecificationComponent] dropdown element without any sub-items"})} />}
			               popoverProps={{position: this.inClassicRenderingMode ? bp.Position.BOTTOM_RIGHT : bp.Position.BOTTOM, minimal: true}}
			               itemRenderer={(item, {handleClick, modifiers}) => {
							    const key = item.name;
								const optionContent = !item.disableApplicable ?
								                      <a className={classNames(bp.Classes.MENU_ITEM,{[bp.Classes.ACTIVE]: item == activeItem})}
								                         key={item.name}
								                         onClick={handleClick}>
									                      {item.title}
													  </a> :
									                  <span key={item.name} className={classNames([bp.Classes.MENU_ITEM, bp.Classes.DISABLED])}>{item.title}</span>;

							    return item.description ? <bp.Tooltip key={key} content={item.description} position={bp.Position.RIGHT} boundary="viewport">{optionContent}</bp.Tooltip> : optionContent;
			               }}
			               itemPredicate={(query, item) => (item.title.toLowerCase().indexOf(query.toLowerCase()) >= 0)}
			               itemDisabled={(item) => item.disableApplicable}
			               onItemSelect={(item) => (!option.readOnly) && this.setOptionChoice(control, path, item.name)}
			>
				<div className={css.dropdown} style={{display: "flex"}}>
					<span> {activeItem.title}</span>
					<Icon icon='caret-down'/>
				</div>
			</RenderOptions>
		</Validator>
	}

    /*
	<div className="bp3-select">
	       <select value={this.props.io.optimizationInputs[control.name]}>
		       {control.options.choices.map( c => <option value={c.value}>{c.title}</option>}
	       </select>
		</div>
	 */

    /*
	<Select
                       options={control.options.choices.map((c, i) => {return {value: c.value, label: c.title, title: c.description}})}
                       clearable={false}
                       value={this.props.io.optimizationInputs[control.name]}
                       onChange={(option: Option<string>) => this.setOptionChoice(control, option.value)}/>

	*/

    @observable userOptions: InputSpecificationUserOptions = {};
    updateUserOptions = action((userOptions) => {
	    Object.assign(this.userOptions, userOptions);
		this.props.updateUserOptions && this.props.updateUserOptions(_.clone(this.userOptions));
	})

	updateUserOptions_debounced = _.debounce(this.updateUserOptions, 2000);

	@action updateIndentMargin = (value: number) => {
		this.userOptions.indentMargin = value;
		this.updateUserOptions_debounced({indentMargin: value});
		this.updateCSSProperty('--indent-margin', `${value}px`);
	}

	@action updateLineSpacing = (value: number) => {
		this.userOptions.lineSpacing = value;
		this.updateUserOptions_debounced({lineSpacing: value});
		this.updateCSSProperty('--line-spacing', `${value}px`);
	}

	updateCSSProperty(property, value) {
		let r = ReactDOM.findDOMNode(this);
		(r as HTMLElement).style.setProperty(property, value);
	}

	getCSSPropertyValue(property) {
		let r = ReactDOM.findDOMNode(this);
		return getComputedStyle(r as HTMLElement).getPropertyValue(property);
	}

	renderFormattingMenu() {
		return <Observer>
			{() => <Popover
				className={css.options}
				position={bp.Position.BOTTOM_LEFT}
				minimal
				hoverOpenDelay={300} hoverCloseDelay={600}
				interactionKind={bp.PopoverInteractionKind.CLICK}
				popoverClassName={classNames(css.popover, utility.doNotAutocloseClassname)}
				canEscapeKeyClose
				content={<bp.Menu className={css.formatMenu}>
						<div className={css.slider}>
							<bp.Label>
								<FormattedMessage defaultMessage={"Indentation:"} description={"[InputSpecificationComponent] a layout format option"}/>
							</bp.Label>
							<bp.Slider
								min={0}
								max={100}
								stepSize={1}
								labelStepSize={50}
								disabled={this.inClassicRenderingMode}
								onChange={this.updateIndentMargin}
								value={this.userOptions.indentMargin}
							/>
						</div>
						<div className={css.slider}>
							<bp.Label>
								<FormattedMessage defaultMessage={"Line Spacing:"} description={"[InputSpecificationComponent] a layout format option"}/>
							</bp.Label>
							<bp.Slider
								min={0}
								max={50}
								stepSize={1}
								labelStepSize={25}
								onChange={this.updateLineSpacing}
								value={this.userOptions.lineSpacing}
							/>
						</div>
					</bp.Menu>}>
				<AnchorButton text={i18n.intl.formatMessage({defaultMessage: "Formatting", description: "[InputSpecificationComponent] a dropdown button and it includes some option for customize layout"})} onClick={() => {}} rightIcon="caret-down"/>
			</Popover>}
		</Observer>
	}

	@computed get inClassicRenderingMode() {
		return this.displayMode == "classic";
	}

	@computed get inVerboseMode() {
		return this.displayMode == "verbose";
	}

	get displayMode() {
		return this.props.userOptions.displayMode || (this.props.userOptions.verboseMode ? "verbose" : "compact") ;
	}

    renderToolbar() {
		let {updateUserOptions} = this;
		let {displayMode} = this;

		return <Toolbar>
			<ButtonGroup className="ui labeled input">
				<bp.Tooltip
					position={bp.Position.BOTTOM}
					content={i18n.intl.formatMessage({defaultMessage: "Detailed Display Mode", description: "[InputSpecificationComponent] a description for the layout mode setting button"})}
				>
					<Button active={displayMode == "verbose"}
					        onClick={e => updateUserOptions({displayMode: "verbose", verboseMode: true})}>
						<FormattedMessage defaultMessage={"Detailed"} description={"[InputSpecificationComponent] the layout mode setting button"}/>
					</Button>
				</bp.Tooltip>

				<bp.Tooltip
					position={bp.Position.BOTTOM}
					content={i18n.intl.formatMessage({defaultMessage: "Compact Display Mode", description: "[InputSpecificationComponent] a description for the layout mode setting button"})}
				>
					<Button active={displayMode == "compact"}
					        onClick={e => updateUserOptions({displayMode: "compact", verboseMode: false})}>
						<FormattedMessage defaultMessage={"Compact"} description={"[InputSpecificationComponent] the layout mode setting button"}/>
					</Button>
				</bp.Tooltip>

				{this.props.allowClassicRenderMode && <bp.Tooltip
					position={bp.Position.BOTTOM}
					content={i18n.intl.formatMessage({defaultMessage: "Classic Display Mode", description: "[InputSpecificationComponent] a description for the layout mode setting button"})}
				>
					<Button active={displayMode == "classic"}
					        onClick={e => updateUserOptions({displayMode: "classic", verboseMode: false})}>
                        <FormattedMessage defaultMessage={"Classic"} description={"[InputSpecificationComponent] the layout mode setting button"}/>
					</Button>
				</bp.Tooltip>}
			</ButtonGroup>
			<NavbarDivider/>
			{this.renderFormattingMenu()}
		</Toolbar>
	}

    renderControl = (control, path, isTabContent) => {
		let {specification, additionalProps, showViewTitle} = this.props;
		const {inClassicRenderingMode, inVerboseMode} = this;

		const inputTypeIsBoolean = control.inputType == 'boolean'; // boolean input type not show title and description. it will render inline.
		const showDescription = this.hasDescription(control) && control.showDescription && !inputTypeIsBoolean && inVerboseMode;
		const Component = control.component;
		const showTitle = control.hints?.showTitle && !inputTypeIsBoolean;
		const WrapperTag = inClassicRenderingMode ? "fieldset" : "div";

		return <React.Fragment>
			{showDescription && <LineBreak/>}
			{showDescription && this.getDescription(control)}
			{!isTabContent && control.showInitialBreak !== false && <LineBreak/>}
			<div ref={(r) => this.controlGroup = r}>
				<WrapperTag className={classNames({
					[css.controlWrapper] : showDescription,
					[css.inline] : control.inline,
					[css.alignTop]: this.alignToTop(control)
				})}>
					{inClassicRenderingMode ? <legend>{this.renderTitle(control, inVerboseMode, control.title, control.indentControlTitle)}</legend> :
					showTitle && this.renderTitle(control, inVerboseMode, control.title, control.indentControlTitle)}
					{(!isTabContent && !inClassicRenderingMode && !control.inline && showTitle) && <LineBreak/>}
					<div className={classNames(css.control, {[css.preventInline]: !control.inline})}>
						{(Component && <Component key={inVerboseMode} {...additionalProps} verboseMode={inVerboseMode} control={control}></Component>) || this.renderOptions.call(this, control, control, inVerboseMode, path)} {inVerboseMode && control.rightComponent}
					</div>
				</WrapperTag>
			</div>
		</React.Fragment>
	}

    @observable hasFocus = false;
    controlGroup;
    render () {
		let {specification, additionalProps, allowScrolling, showToolbar, showViewTitle, className, renderSpecificationAsControl} = this.props;
		this._resizeableInputs.length = 0;

		// Set overflow to avoid Blueprint positioning options popover on top
		// ReactFlipMove for verbose/compact animation
		// onFocus={() => this.hasFocus = true} onBlur={() => this.hasFocus = false}
		return <div className={classNames(css.root, className, {[css.classicRenderingMode]: this.inClassicRenderingMode})}>
			{showToolbar && this.renderToolbar()}
			{showViewTitle && <span className={css.viewTitle}>{specification.title}</span>}
			<FlipMove style={{overflow: allowScrolling ? null : "auto"}} ref={r => this.scrollContainer = r}>
				<div className={classNames(css.focusable,{[css.focus]: this.hasFocus})} key={this.displayMode}>
					{renderSpecificationAsControl ?
					    this.renderControl(specification, specification.name, false) :
						<SubOptions isFirstLevel={true} useFixedGridColumns={this.inClassicRenderingMode} option={specification} subOptionRender={(control, isTabContent) => {
							return this.renderControl(control, specification.name + "." + control.name, isTabContent);
						}} />
					}
				</div>
				<ResizeSensorComponent onResize={this.onResize}/>
			</FlipMove>
		</div>
	}

    componentDidMount = action(() => {
	    if (this.userOptions.indentMargin != null)
		    this.updateCSSProperty("--indent-margin", `${this.userOptions.indentMargin}px`);
		else
			this.userOptions.indentMargin = parseInt(this.getCSSPropertyValue("--indent-margin"));

		if (this.userOptions.lineSpacing != null)
			this.updateCSSProperty("--line-spacing", `${this.userOptions.lineSpacing}px`);
		else
			this.userOptions.lineSpacing = parseInt(this.getCSSPropertyValue("--line-spacing"));

		// Sync control Group title widths
		// let titles = $(this.controlGroup).find(`.${css.title}`);
		// let width = titles.width();
		// titles.width(width);
	})
}

type JSXIntrinsicElement = keyof JSX.IntrinsicElements;

class CopyLocationContextMenuWrapperByOption extends React.Component<{option: Option, nodeAttrs?: any, tag?: JSXIntrinsicElement}, any> {
	render() {
		const {option, tag, ...otherProps} = this.props
		return <CopyLocationContextMenuWrapper locationPath={option.locationPath} tag={tag} {...otherProps} />;
	}
}

@ContextMenuTarget
export class CopyLocationContextMenuWrapper extends React.Component<{locationPath: string[], icon?: bp.IconName | bp.MaybeElement, tag?: JSXIntrinsicElement, nodeAttrs?: any}, any> {
	enabled = !!this.props.locationPath?.length;

	render() {
		const Tag = this.props.tag || ("div" as JSXIntrinsicElement);
		return <Tag {...this.props.nodeAttrs}>{this.props.children}</Tag> ;
	}

	renderContextMenu() {
		if (!this.enabled) {
			return null;
		}

		return <bp.Menu>
			<CopyLocationContextMenuItem {...this.props} />
		</bp.Menu>
	}
}

export class CopyLocationContextMenuItem extends React.Component<{locationPath: string[], icon?: bp.IconName | bp.MaybeElement}, any> {

	copy = () => {
		const locationPath = this.props.locationPath.join(" / ");
		navigator.clipboard.writeText(locationPath);
		site.toaster.show({
			intent: bp.Intent.SUCCESS,
			message: i18n.intl.formatMessage(
				{defaultMessage: `Location: "{locationPath}" copied`, description: "[InputSpecificationComponent] hit message when a position string copied"} ,
				{locationPath}
			)
		});
	}

	render() {
		return <bp.MenuItem
			icon={this.props.icon}
			text={i18n.intl.formatMessage({defaultMessage: "Copy Location", description: "[InputSpecificationComponent] a action about copy a position string"})}
			onClick={this.copy}
		/>;
	}
}



// <bp.Tab key={id} id={id} title={o.title} panel={this.renderOptions(control, o, verboseMode, path + "." + o.name)}/>;
interface SubOptionsProps {
	option: Option;
	subOptionRender: (subOption: Option, isTabContent:boolean) => JSX.Element;
	isFirstLevel?: boolean;
	useFixedGridColumns?: boolean;
}


@observer
class SubOptions extends React.Component<SubOptionsProps, {}> {

	_uuid = uuid.v4();
	inline = !!this.props.option?.inline;
	isHorizontalTab = this.props.option?.hints?.tab == 'horizontal';
	isVerticalTab = this.props.option?.hints?.tab == 'vertical';
	isTab = (this.isHorizontalTab || this.isVerticalTab) && !this.props.option?.suppressTab;

	_tabsRef;
	@observable selectedTabId: string;
	@observable _tabsScroll;

	constructor(props) {
        super(props);

        makeObservable(this);

        if (this.isTab) {
			this.selectedTabId = this.getId(this.subOptions[0]);
		}
    }

	componentDidMount() {
		this.checkTabsScroll();
	}

	availableOptions = (options: Option[]) => {
		return _.filter(options, o => o.applicable);
	}

	get subOptions() {
		const availableOptions = this.availableOptions(this.props.option.options);

		if (!this.isTab) {
			return availableOptions;
		}
		return _.map(availableOptions, o => {
			o = _.assign({}, o, {indent: false});
			o.hints = _.assign(o.hints || {}, {showTitle: false});
			return o;
		});
	}

	getId = (subOption: Option) => {
		return `${this._uuid}-${subOption.name}`;
	}

	checkTabsScroll = () => {
		if (!this.isHorizontalTab || !this._tabsRef) {
			this._tabsScroll = false;
			return;
		}
		this._tabsScroll = $(this._tabsRef).width() < $(this._tabsRef)[0].scrollWidth;
		const selectedTabElem = $(this._tabsRef).find('.bp3-tab[aria-selected="true"]').first();

		if (this._tabsScroll) {
			let pElem = selectedTabElem.prev('.bp3-tab');
			if (pElem.length) {
				let parent = pElem.offsetParent();
				let left = pElem.offset().left - parent.offset().left;
				$(this._tabsRef).parent().animate({scrollLeft: left}, 200);
			}
		}

		// when layout changed, the highlight ber size not renew.
		const highlightBarElem = $(this._tabsRef).find('.bp3-tab-indicator-wrapper').first();
		if (highlightBarElem.length) {
			highlightBarElem.width(Math.min(selectedTabElem.width(), selectedTabElem.offsetParent().width()));
		}
	}

	onTabChange = (tabId) => {
		this.selectedTabId = tabId;
	}

	@computed get children() {

		const {isTab, subOptions, getId, props: {subOptionRender, option, isFirstLevel}} = this;

		if (!isTab) {
			const inline = !!option.inline;

			return subOptions.map((o, i) => {
				return <React.Fragment key={`${getId(o)}-${i}`} >
					{ subOptionRender(o, false) }
					{!isFirstLevel && !inline && i != (subOptions.length - 1) && <LineBreak/>}
				</React.Fragment>;
			})
		} else {
			const option = _.find( subOptions,  o => getId(o) == this.selectedTabId);
			return <div className={classNames(css.optionTabsContent, css.selected)}>
				{subOptionRender(option, true)}
			</div>
		}
	}

	render() {
		const {isTab, isVerticalTab, inline, subOptions, getId, children, props: {option}} = this;

		if (!subOptions?.length) {
			return null;
		}

		if (option.gridLayout) {
			return <GridLayout {...this.props} />;
		}

		if (!isTab) {
			return <div className={classNames({[css.inline]: inline})}>{children}</div>
		} else {
			return <>
				<div className={classNames(css.indent, css.optionTabsRoot, {[css.vertical]: isVerticalTab})}>
					<div className={css.optionTabsHeader}>
						<bp.Tabs animate={true} vertical={isVerticalTab} onChange={this.onTabChange} selectedTabId={this.selectedTabId} ref={r => {
							this._tabsRef = ReactDOM.findDOMNode(r);
							this.checkTabsScroll();
						}}>
							{subOptions.map((o, i) => {
								const id = getId(o);
								return <bp.Tab key={`${id}-${i}-header`} id={id} title={o.title}/>;
							})}
						</bp.Tabs>
					</div>
					{!isVerticalTab && <LineBreak/>}
					<div className={css.optionTabsBody}>
						{children}
					</div>
					<ResizeSensorComponent onResize={this.checkTabsScroll}/>
				</div>
			</>;
		}
	}
}

@observer
class GridLayout extends SubOptions {

	static COLUMN_GAP = 50;
	static INPUT_TABLE_MIN_WIDTH = 300;

	enableDebugContent:boolean = false;

	gridLayout: "grid" | "grid-row" | "row" = this.props.option.gridLayout || "row";
	lastContainerWidth: number;
	isMounted: boolean;

	isInputTable = (option: Option) => {
		return option?.hints?.dimension === 1 || option?.hints?.dimension === 2;
	}

	isInputTableSlot = (option: Option) => {
		return option?.hints?.dimension === 1;
	}

	isGridLayout = (option: Option) => {
		return !!option.gridLayout;
	}

	get allOptionsAreInputTable() {
		let result = true;
		_.forEach(this.subOptions, option => {
			result = result && this.isInputTable(option) && !this.isInputTableSlot(option);
		})
		return result;
	}

	get allOptionsAreGrid() {
		let result = true;
		_.forEach(this.subOptions, option => {
			result = result && this.isGridLayout(option);
		})
		return result;
	}

	formatLocationPath = (option: Option) => {
		let path = [...option.locationPath];
		if (option.gridLayout == "grid-row") {
			path.pop();
		}
		return path.map(s => s.trim().replace(/\s/i, "_")).join("-");
	}

	resize = _.debounce(() => {
		if (this.gridLayout == 'grid-row' || !this.isMounted) {
			return;
		}

		const $DOM = $(ReactDOM.findDOMNode(this));

		const filters = {
			rows: `.${css.gridLayoutRowContent}[data-location-path="${this.formatLocationPath(this.props.option)}"]`,
			isTableCell: `.${css.isInputTable}`,
			allTableContentRows: `.${css.allInputTableChildren}`,
			mixContentRows: (i, row) => {
				if ($(row).find(filters.isTableCell).length > 0) {
					return true;
				} else if ($(row).children(`.${css.gridLayoutCell}`).children(`.${css.gridRowInGridLayout}`).length > 0) {
					return true;
				}
				return false;
			}
		}

		const calculators = {
			gridWidth: (cell: Element) => {
				const $tableRoot = $(cell).find('div[wj-part="root"]').first();
				return Math.max($tableRoot[0].scrollWidth + 5, $tableRoot.width());
			},
			tableCellWidth: (cell) => {
				let cellWidth = 0;
				// avoid vertical table's header using all space
				$(cell).find('.wj-rowheaders .wj-row').first().children('.wj-cell').each((i, elem) => cellWidth += $(elem).width());
				if (cellWidth) {
					let maxTableCellWidth = 0;
					$(cell).find('.wj-cells .wj-row').first().children('.wj-cell').each((i, elem) => maxTableCellWidth = Math.max(maxTableCellWidth, $(elem).width()));
					cellWidth += maxTableCellWidth;
				}
				return cellWidth;
			},
			maxCellsWidth: ($rows: JQuery) : number => {
				let maxCellWidth = 0;
				$rows.find(`.${css.gridLayoutCellContent}`).not(`.${css.gridRowInGridLayout}`).each((i, cell) => {
					let cellWidth = 0;

					if (!$(cell).parent().is(`.${css.isInputTable}`)) {
						cellWidth = cell.scrollWidth;
					} else if ($(cell).parent().is(`${css.isInputTableSlot}`)){
						cellWidth = Math.max(calculators.tableCellWidth(cell), GridLayout.INPUT_TABLE_MIN_WIDTH);
					}

					// if this cell under a sub grid row, append the paddings.
					let testNode = cell;
					while (testNode != $DOM[0]) {
						cellWidth += (parseInt($(testNode).css('margin-left')) || 0);
						testNode = testNode.parentElement;
					}

					maxCellWidth = Math.max(maxCellWidth, cellWidth);
					this.enableDebugContent && $(cell).nextAll('.cellInfo').text(`contentWidth: ${cellWidth}`);
				});
				return maxCellWidth;
			}
		}

		if (this.props.useFixedGridColumns) {
			$DOM.find('.wj-flexgrid').each((i, element) => {
				$(element).css({'max-width': $(element).parents("fieldset").width(), 'min-width': calculators.tableCellWidth(element)});
			});
			return;
		}

		let containerWidth = 0;
		if (this.gridLayout == 'grid') {
			containerWidth = $DOM.innerWidth();
		} else {
			containerWidth = $DOM.children(`.${css.gridLayoutRowContent}`).first().innerWidth();
		}

		// if this container with all elements as another grid element. stop relocating items if the container size does not change.
		if (this.allOptionsAreGrid && this.lastContainerWidth && Math.abs(this.lastContainerWidth-containerWidth) <= GridLayout.COLUMN_GAP) {
			return;
		}
		this.lastContainerWidth = containerWidth;

		let childRows = $DOM.find(filters.rows);
		childRows.filter(filters.allTableContentRows).each((i, row) => {
			let minGridWidth = Number.POSITIVE_INFINITY;
			$(row).children().each((j, cell) => {
				const width = calculators.gridWidth(cell);
				minGridWidth = Math.min(minGridWidth, width);
				this.enableDebugContent && $(cell).find('.cellInfo').text(`contentWidth: ${width}`)
			});
			minGridWidth = Math.max(GridLayout.INPUT_TABLE_MIN_WIDTH, minGridWidth);
			const nodesInRow = Math.min(Math.max(Math.floor((containerWidth + GridLayout.COLUMN_GAP) / (minGridWidth + GridLayout.COLUMN_GAP)), 1), $(row).children().length);
			const perCellWidth = Math.floor((containerWidth + GridLayout.COLUMN_GAP) / nodesInRow) - GridLayout.COLUMN_GAP;
			$(row).css('grid-template-columns', `repeat(auto-fit, ${perCellWidth}px)`);
			// $(row).css('width', containerWidth);
			this.enableDebugContent && $(row).nextAll('.rowInfo').text(`all table row = perCellWidth: ${perCellWidth}, containerWidth: ${containerWidth}, nodesInRow: ${nodesInRow}, minGridWidth: ${minGridWidth}`)
		});
		childRows = childRows.not(filters.allTableContentRows);

		childRows.filter(filters.mixContentRows).each((i, row) => {
			let maxCellWidth = calculators.maxCellsWidth($(row));
			const notGridCellLength = $(row).children().filter((j, elem) => !$(elem).is(filters.isTableCell) && !$(elem).find(filters.isTableCell).length).length || $(row).children().length;
			const nodesInRow = Math.min(Math.max(Math.floor((containerWidth + GridLayout.COLUMN_GAP) / (maxCellWidth + GridLayout.COLUMN_GAP)), 1), notGridCellLength);
			const perCellWidth = Math.floor((containerWidth + GridLayout.COLUMN_GAP) / nodesInRow) - GridLayout.COLUMN_GAP;
			// $(row).css('grid-template-columns', `repeat(auto-fit, ${perCellWidth}px)`);
			$(row).css('grid-template-columns', `unset`);
			$(row).css('grid-auto-columns', `${perCellWidth}px`);

			let cellCount = 0;
			$(row).children().each((j, elem) => {
				let useCell = 1;

				const tableCells = $(elem).is(filters.isTableCell) ? $(elem) : $(elem).find(filters.isTableCell);
				if (tableCells.length) {
					let gridsWidth = 0;
					tableCells.each((k, tCell) => {
						gridsWidth += calculators.gridWidth(tCell);
						$(tCell).parentsUntil(elem).each((l, pElem) => {
							gridsWidth += (parseInt($(pElem).css('margin-left')) || 0);
						})
					})
					useCell = Math.min( Math.max(1, Math.ceil(gridsWidth/perCellWidth)), nodesInRow);
				}

				// if current row without enough column for content. let it go to a new row
				const mod = cellCount % nodesInRow;
				if (mod + useCell > nodesInRow) {
					cellCount += (nodesInRow-mod);
				}

				let row = 1 + Math.floor(cellCount / nodesInRow);
				let col = 1 + Math.floor(cellCount % nodesInRow);
				$(elem).css("grid-area", `${row} / ${col} / ${row+1} / ${col+useCell}`);

				cellCount+= useCell;
			})

			this.enableDebugContent && $(row).nextAll('.rowInfo').text(`mix contents row = perCellWidth: ${perCellWidth}, containerWidth: ${containerWidth},notGridCellLength: ${notGridCellLength} , nodesInRow: ${nodesInRow}, maxCellWidth: ${maxCellWidth}`)
		});

		childRows = childRows.not(filters.mixContentRows);
		if (childRows.length > 0) {
			const maxCellWidth = calculators.maxCellsWidth(childRows);
			childRows.each((i, row) => {
				$(row).css('grid-template-columns', `repeat(auto-fit, ${maxCellWidth}px)`);
				this.enableDebugContent && $(row).nextAll('.rowInfo').text(`no table row, share with (${childRows.length}) rows = perCellWidth: ${maxCellWidth}, containerWidth: ${containerWidth}`)
			});
		}
	}, 50);

	calTitleWidthForRows = () => {
		if (this.gridLayout != "grid") {
			return;
		}

		const DOM = ReactDOM.findDOMNode(this);

		let maxTitleLength = 0;
		// first 1 layer is FlipMove
		const childrenOptions = $(DOM).children().not(`.resize-sensor`).map((i, elem) => elem.firstChild);

		childrenOptions.each((i, elem) => {
			if ($(elem).is(`.${css.preventInline}`)) {
				return;
			}
			// title nodes on next level
			let $title = $(elem).children(`.${css.title}, div[data-wrapper="title"]`);

			$title.width(null);

			if (!$title.is(`.${css.title}`)) {
				$title = $title.find(`.${css.title}`);
			}
			maxTitleLength = Math.max(maxTitleLength, $title.width() || 0);
		});

		maxTitleLength = ( Math.ceil(maxTitleLength / 10) + 1 ) * 10;

		childrenOptions.each((i, elem) => {
			let $title = $(elem).children(`.${css.title}, div[data-wrapper="title"]`);

			if ($(elem).is(`.${css.preventInline}`)) {
				const shift = maxTitleLength - 39;
				$(elem).css('padding-left', `${shift}px`);
				$title.css('margin-left', `-${shift}px`);
			} else {
				if ($title.length) {
					if (!$title.is(`.${css.title}`)) {
						$title.width(maxTitleLength + 10);
					} else {
						$title.width(maxTitleLength);
					}
				} else if ($(elem).is(`.${css.gridLayoutRow}`)) {
					$(elem).css('padding-left', `${maxTitleLength}px`);
				}
			}
		});
	}

	componentDidMount() {
		super.componentDidMount();
		this.isMounted = true;
		setTimeout( () => {
			this.calTitleWidthForRows();
			this.resize();
		} ,10);
	}

	componentDidUpdate() {
		this.calTitleWidthForRows();
		this.resize();
	}

	render() {

		const {gridLayout, subOptions, props: {option, subOptionRender, useFixedGridColumns}} = this;

		if (gridLayout != "grid") {
			const isInline = option.inline;
			const isIndent = option.indent !== false;
			return <div>
				{this.gridLayout != "grid-row" && <ResizeSensorComponent onResize={this.resize} />}
				<div className={classNames(css.gridLayoutRowContent, {[css.allInputTableChildren]: this.allOptionsAreInputTable}, {[css.indent] : isIndent && !isInline}, {[css.fixedColumns]: useFixedGridColumns})} data-location-path={this.formatLocationPath(option)}>
					{subOptions.map((o, i) => {
						return <div
							key={this.getId(o)}
							className={classNames(css.gridLayoutCell, {[css.isInputTable]: this.isInputTable(o), [css.isInputTableSlot]: this.isInputTableSlot(o)})}
							data-children-count={o.hints?.dimension === 1 ? 2 : this.availableOptions(o?.options)?.length}
						>
							<div className={classNames(
								css.gridLayoutCellContent,
								{[css.tabCellInGridLayout]: _.get(o, 'hints.tab')},
								{[css.gridRowInGridLayout]: !this.isInputTable(o) && !!o.gridLayout}
							)}>
								{subOptionRender(o, false)}
							</div>
							{this.enableDebugContent && <div className={"cellInfo"} style={{border: "2px solid blue", borderTop: "none", paddingTop: 5, whiteSpace: "nowrap"}} />}
						</div>
					})}

				</div>
				{this.enableDebugContent && <div className={"rowInfo"} style={{border: "2px solid red", borderTop: "none", paddingTop: 5, whiteSpace: "nowrap"}} />}
			</div>
		} else {
			return <div className={classNames(css.gridLayout)}>
				<ResizeSensorComponent onResize={this.resize} />
				{subOptions.map((o, i) => {
					return <React.Fragment key={this.getId(o)}>
						{ subOptionRender(o, false) }
						<LineBreak/>
					</React.Fragment>
				})}
			</div>;
		}
	}

	componentWillUnmount() {
		this.isMounted = false;
	}
}
