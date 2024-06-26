import {Select} from '@blueprintjs/select';
import { action, observable, computed, reaction, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Fragment} from 'react';
import {formatLabelText, waitCondition} from 'utility';
import {bp, LoadingUntil, ResizeSensorComponent} from '../..';
import * as css from "./StepNavigator.css";

type DisplayType = 'step-by-step' | 'breadcrumb' | 'tree-navigator';

export interface StepNavigationProps {
	steps: Array<StepNavigationItemProps>;
	pages: {[pageId: string]: JSX.Element};
	activePath?: string;
	beforeChange?: (item: StepNavigationItem) => (StepNavigationItem | false | null);
	onChange?: (item: StepNavigationItem, prevItem: StepNavigationItem, isValidationNavigation?) => void;
	listStyleTypes?: Array<'decimal'|'georgian'|'hebrew'|'lower-alpha'|'lower-greek'|'lower-roman'|'upper-alpha'|'upper-roman'>;
	displayType?: DisplayType;
	showAddressPath?: boolean;
}

interface StepItemListComponentProps {
	controller: StepNavigationController;
	parentItem?: StepNavigationItem;
	className?: string;
}

interface StepItemComponentProps {
	item:StepNavigationItem,
	height:number,
	active: boolean,
	setActiveItem: (item: StepNavigationItem) => void
}

export interface StepNavigationItemProps {
	name: string;
	items?: StepNavigationItemProps[];
	title?: string;
	description?: string;
	applicable?: boolean;
	options?: Array<StepNavigationItemProps>;
	pageId?: string;
	disabled?: boolean;
	navigatorOnly?: boolean;
	navigatorText?: (isNext: boolean) => string;
	isInputItem?: boolean;
	flexibleAxis?: string;
}

class StepNavigationItemList extends Array<StepNavigationItem>{
	constructor(options: Array<StepNavigationItemProps>, parentItem?: StepNavigationItem, private listStyleTypes: string[] = []) {
		super();
		_.forEach(
			_.filter(
				options,
				item => item.applicable !== false
			),
			(item, i) => this.push(new StepNavigationItem(item, parentItem, i, listStyleTypes))
		);
	}
}

export class StepNavigationItem implements StepNavigationItemProps{
	name: string;
	title: string;
	description: string;
	applicable: boolean;
	disabled: boolean;
	navigatorOnly: boolean;
	isInputItem: boolean;
	flexibleAxis: string;
	navigatorText?: (isNext: boolean) => string
	options: Array<StepNavigationItemProps>;

	items: StepNavigationItemList;
	private _pageId: string;

	constructor(item: StepNavigationItemProps, public parentItem: StepNavigationItem, private index: number, private listStyleTypes: string[]) {
		_.assign(this, {applicable: true, navigatorOnly: false}, item);

		if (!this.title) {
			this.title = formatLabelText(this.name);
		}
		if(this.isInputItem === undefined && parentItem?.isInputItem !== undefined) {
			this.isInputItem = parentItem.isInputItem;
		}
		this.items = new StepNavigationItemList(item.options, this, listStyleTypes?.length > 1 ? listStyleTypes.slice(1) : null);
	}

	get sequence(): JSX.Element{
		if (!this.listStyleTypes?.length) {
			return null;
		}
		return <>
			{this.parentItem?.sequence}
			{<span className={css.sequence} style={{'counterReset': `num ${this.index+1}`, '--type': this.listStyleTypes[0]} as any} />}
		</>;
	}

	get displayText(): JSX.Element {
		return <>{this.sequence}{this.sequence ? '.' : ''} {this.title}</>
	}

	set pageId(id:string) {
		this._pageId = id;
	}

	get pageId() {
		return this._pageId ? this._pageId : this.hasItems ? null : this.name;
	}

	get executable() {
		return !!this.pageId;
	}

	get hasItems(): boolean{
		return this.items?.length > 0;
	}

	get itemPath(): string[] {
		if (this.parentItem) {
			return [...this.parentItem.itemPath, this.name];
		} else {
			return [this.name];
		}
	}

	get itemPathString(): string {
		return _.join(this.itemPath, '.');
	}

	get level(): number {
		return this.parentItem ? this.parentItem.level + 1 : 0;
	}

	get executableItems(): Array<StepNavigationItem> {
		const subExecutableItems = _.flatten(_.map(this.items, item => item.executableItems));
		if (this.executable) {
			return [this, ...subExecutableItems];
		} else {
			return subExecutableItems;
		}
	}
}

class StepNavigationArrow extends React.Component<{height: number, inverterFill?:boolean, style?: React.CSSProperties }, {}> {

	static ARROW_SVG_CONFIG = {
		boxHeight: 500,
		boxWidth: 270
	}

	static calZoomRate (height: number) {
		return height / StepNavigationArrow.ARROW_SVG_CONFIG.boxHeight;
	}

	static strokeWidth(height: number) {
		return 6 / StepNavigationArrow.calZoomRate(height);
	}

	static calArrowWidth(height: number) {
		return StepNavigationArrow.ARROW_SVG_CONFIG.boxWidth * StepNavigationArrow.calZoomRate(height);
	}

	static calArrowShiftLength(height: number) {
		const config = StepNavigationArrow.ARROW_SVG_CONFIG;
		return (config.boxWidth - StepNavigationArrow.strokeWidth(height)) * StepNavigationArrow.calZoomRate(height);
		// return StepNavigationArrow.calArrowWidth(height) * ((config.boxWidth-(config.strokeWidth / 2)) / config.boxWidth);
	}

	render () {
		const {height, style} = this.props;
		const config = StepNavigationArrow.ARROW_SVG_CONFIG;
		const strokeWidth = StepNavigationArrow.strokeWidth(height);

		let endingArrowStyle: React.CSSProperties = {
			height: height,
			width: StepNavigationArrow.calArrowWidth(height),
			right: style?.left == null ? -1 *StepNavigationArrow.calArrowShiftLength(this.props.height) : null,
			...style
		};

		const pathString = this.props.inverterFill !== true ?
		                   `M0 -${strokeWidth} L${config.boxWidth - (strokeWidth / 2)} ${config.boxHeight / 2} L0 ${config.boxHeight + strokeWidth}`:
		                   `M${config.boxWidth} -${strokeWidth} L0 -${strokeWidth} L${config.boxWidth - (strokeWidth / 2)} ${config.boxHeight / 2} L0 ${config.boxHeight + strokeWidth} L${config.boxWidth} ${config.boxHeight + strokeWidth}`;

		return  <svg className={classNames(css.arrow)} viewBox={`0 0 ${config.boxWidth} ${config.boxHeight}`} style={endingArrowStyle}>
			<path d={pathString} strokeWidth={strokeWidth} />
		</svg>;
	}
}

export class BreadcrumbComponent extends React.Component<StepItemListComponentProps, {}> {
    constructor(props: StepItemListComponentProps) {
        super(props);
        makeObservable(this);
    }

    @computed get level() {
		return this.props.parentItem ? (this.props.parentItem.level + 1) : 0;
	}

    @computed get activateKey() {
		return this.props.controller.activeItem?.itemPath[this.level];
	}

    @computed get itemsThisLevel() {
		return (this.props.parentItem ? this.props.parentItem.items : this.props.controller.stepItems).filter(item => item.navigatorOnly !== true);
	}

    @computed get activeItemThisLevel() {
		const activeKey = this.activateKey;
		return _.find(this.itemsThisLevel, item => item.name == activeKey);
	}

	onItemSelect = (item: StepNavigationItem) => {
		return this.props.controller.setActiveByItem(item);
	}

    render() {
		const activeItemThisLevel = this.activeItemThisLevel;

		const selectComponent = <Select<StepNavigationItem>
			items={this.itemsThisLevel}
			activeItem={activeItemThisLevel}
			itemRenderer={(item,{handleClick}) => <bp.MenuItem key={item.itemPathString} icon={item == activeItemThisLevel ? 'tick' : 'blank'} text={item.displayText} onClick={handleClick} />}
			onItemSelect={this.onItemSelect}
			filterable={false}
		>
			<bp.Button rightIcon={"caret-down"}>{activeItemThisLevel ? activeItemThisLevel.displayText : '...'}</bp.Button>
		</Select>

		const subComponent = activeItemThisLevel?.hasItems && <BreadcrumbComponent {...this.props} parentItem={activeItemThisLevel} />;

		if (this.level == 0) {
			return <div className={css.breadcrumb}>
				{selectComponent}
				{subComponent}
			</div>
		} else {
			return <>
				<StepNavigationArrow height={26} />
				{selectComponent}
				{subComponent}
			</>
		}
	}
}

@observer
export class StepItemListComponent extends BreadcrumbComponent {
    $itemsRootRef;
    _dispose = [];
    _scrolling: boolean = false;

    @observable isScrollOnFirst: boolean = true;
    @observable isScrollOnLast: boolean = true;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentDidMount() {
		this._dispose.push( reaction( () => this.activateKey, (changes) => {
			this.scrollToActiveItem();
		}))

		this.scrollToActiveItem();
	}

    componentWillUnmount() {
		this._dispose.forEach( d => d());
	}

    get height() {
		return 34;
		/*
		const activeItem = this.props.controller.activeItem;
		const thisLevel = this.level;
		const totalLevel = activeItem ? activeItem.level + (activeItem.hasItems ? 1 : 0) : thisLevel;
		return 42 + ( 2 * 2 * ( thisLevel));
		 */
	}

    scrollItemRight = (e) => {
		if (this._scrolling) { return; }
		const eLeft = $(e.currentTarget).offset().left;
		this.scrollToElement(
			this.$itemsRootRef.children().filter((i, elem) => Math.floor($(elem).offset().left) < 30).first(),
			100 + (400 * Math.max( Math.min( 1, Math.floor((eLeft + e.clientX)/30)), 0))
		);
	}

    scrollItemLeft = (e) => {
		if (this._scrolling) { return; }
		const eRight = $(e.currentTarget).offset().left + $(e.currentTarget).width();
		this.scrollToElement(
			this.$itemsRootRef.children().filter((i, elem) => Math.floor($(elem).offset().left) > 30).last(),
			100 + (400 * Math.max( Math.min( 1, Math.floor((eRight - e.clientX)/30)), 0))
		);
	}

    @action scrollToElement = async ($element?, speed =  500) => {
		if (this._scrolling) {
			return;
		}
		const $offsetParent = $element?.offsetParent() || this.$itemsRootRef;
		if($offsetParent.width() == $offsetParent[0].scrollWidth) {
			this.isScrollOnFirst = true;
			this.isScrollOnLast = true;
			return;
		}

		if (!$element?.length) {
			const currentLeft = $offsetParent.scrollLeft();
			this.isScrollOnFirst = currentLeft == 0;
			this.isScrollOnLast = currentLeft >= $offsetParent[0].scrollWidth - $offsetParent.width();
			return;
		}

		$element = $element.first();
		this._scrolling = true;
		let left = Math.floor($offsetParent.scrollLeft() + $element.offset().left);
		this.isScrollOnFirst = left == 0;
		this.isScrollOnLast = left >= $offsetParent[0].scrollWidth - $offsetParent.width();

		left = left - 30; //scroll item width on left;
		$offsetParent.animate({ scrollLeft: left }, speed, () => {
			const currentLeft = $offsetParent.scrollLeft();
			this.isScrollOnFirst = currentLeft == 0;
			this.isScrollOnLast = currentLeft < left;
			this._scrolling = false;
		});
	}

    scrollToActiveItem = async () => {
		if (KARMA || !this.$itemsRootRef?.length) return;

		try {
			// wait high been changed
			await waitCondition(() => !this.$itemsRootRef?.length || (this.$itemsRootRef.height() == this.height), 100, 5000);

			if (!this.$itemsRootRef?.length) return;

			// try get element
			let $activeNode = null;

			if (this.activateKey) {
				await waitCondition(() => {
					$activeNode = this.$itemsRootRef.children(`.${css.active}`);
					return $activeNode.length == 1;
				})
				this.scrollToElement($activeNode);

			} else {
				this.scrollToElement();
			}
		} catch(e) {
			// do nothing if got error by waitCondition.
		}
	}

    render () {
		const {height, isScrollOnFirst, isScrollOnLast, activeItemThisLevel, itemsThisLevel, props: {controller: {setActiveByItem}}} = this;
		const activeItem = this.props.controller.activeItem;
		const thisLevel = this.level;
		const totalLevel = activeItem ? activeItem.level + (activeItem.hasItems ? 1 : 0) : thisLevel;
		const isLastList = totalLevel == thisLevel;
		return <>
			<div className={classNames(css.stepItemListRoot, {[css.lastList]: isLastList})} >
				<div
					className={classNames(css.overflowCtrlLeft, {[css.show]: !isScrollOnFirst}, css.interactionItem, css.border)}
					onMouseMove={this.scrollItemRight}
				>
					<StepNavigationArrow height={height} />
				</div>
				<div className={css.listOuter}>
					<div className={css.listContainer}>
						<div className={css.itemsList} ref={r => this.$itemsRootRef = $(r)}>
							{_.reverse([...itemsThisLevel]).map((item,index) => {
								return <StepItemComponent
									key={_.join([...item.itemPath, index], '.')}
								    item={item}
		                            height={height}
		                            active={item == activeItemThisLevel}
		                            setActiveItem={setActiveByItem}
								/>
							})}
						</div>
					</div>
				</div>
				<div
					className={classNames(css.overflowCtrlRight, {[css.show]: !isScrollOnLast}, css.interactionItem, css.border)}
					onMouseMove={this.scrollItemLeft}
				>
					<StepNavigationArrow height={height} inverterFill={true} style={{left: -StepNavigationArrow.calArrowShiftLength(height)}} />
				</div>
				<ResizeSensorComponent onResize={this.scrollToActiveItem} />
			</div>
			{activeItemThisLevel?.hasItems && <StepItemListComponent {...this.props} parentItem={activeItemThisLevel}/> }
		</>;
	}
}

@observer
class StepItemComponent extends React.Component<StepItemComponentProps, {}> {

	onClick = () => {
		this.props.setActiveItem(this.props.item);
	}

	render () {
		const {item, active, height} = this.props;
		const config = StepNavigationArrow.ARROW_SVG_CONFIG;

		const rootStyle = {
			height: height,
			paddingRight: StepNavigationArrow.calArrowWidth(height) * (StepNavigationArrow.strokeWidth(height) / config.boxWidth)
		}

		const textContextStyle = {
			paddingLeft: StepNavigationArrow.calArrowShiftLength(height)
		}

		return <div className={classNames(css.itemRoot, css.interactionItem, {[css.active]: active}, {[css.border]: !active})} style={rootStyle} onClick={this.onClick}>
			<div className={css.textContent} style={textContextStyle}>
				<div className={css.title}>{item.displayText}</div>
			</div>
			<StepNavigationArrow height={this.props.height}/>
		</div>;
	}

}

interface NavButtonsBarProps extends StepItemListComponentProps {}

@observer
export class NavButtonsBar extends React.Component<NavButtonsBarProps, {}> {
    constructor(props: NavButtonsBarProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {className, controller: {prevItem, nextItem, setActiveByItem}, children} = this.props

		return <div className={classNames(css.navButtonBar, className)}>
			<div>
				{prevItem && <div className={classNames(css.navButton, {[css.disabled]: prevItem.disabled})} onClick={() => !prevItem.disabled && setActiveByItem(prevItem)}>
					<StepNavigationArrow height={30} style={{transform:"scaleX(-1)", left:-StepNavigationArrow.calArrowShiftLength(30)}}/>
					<span>{(prevItem.navigatorText && prevItem.navigatorText(false)) || "BACK"}</span>
				</div>}
			</div>

			<div>
				{children}
			</div>

			<div>
				{nextItem && <div className={classNames(css.navButton, {[css.disabled]: nextItem.disabled})} onClick={() => !nextItem.disabled && setActiveByItem(nextItem)}>
					<span>{(nextItem.navigatorText && nextItem.navigatorText(true)) || "NEXT"}</span>
					<StepNavigationArrow height={30}/>
				</div>}
			</div>
			{this.hotkeys}
		</div>
	}

    @computed get hotkeys() {

		const {controller: {prevItem, nextItem, setActiveByItem}} = this.props

		const hotkeys: bp.HotkeyConfig[] = [
			{
				global: true,
				group: "Navigation",
				combo: "mod + left",
				label: "Navigate To Previous Page",
				preventDefault: true,
				disabled: !prevItem,
				onKeyDown: () => setActiveByItem(prevItem)
			},
			{
				global: true,
				group: "Navigation",
				combo: "mod + right",
				label: "Navigate To Next Page",
				preventDefault: true,
				disabled: !nextItem,
				onKeyDown: () => setActiveByItem(nextItem)
			}
		]

		return <bp.HotkeysTarget2 hotkeys={hotkeys}>{() => <Fragment />}</bp.HotkeysTarget2>;
	}
}

export class StepNavigationController {
	@observable activeItem: StepNavigationItem = null;
	@observable prevItem: StepNavigationItem = null;
	@observable nextItem: StepNavigationItem = null;
	@observable stepItems: StepNavigationItemList = null;
	@observable displayType: DisplayType;
	@observable showAddressPath: boolean;

	constructor(private props: StepNavigationProps) {
		makeObservable(this);

        this.displayType = ( props.displayType || 'step-by-step');
		this.showAddressPath = props.showAddressPath;
	    this.setStepItems(this.props.steps);
    }

	@action setStepItems = (newSteps: StepNavigationItemProps[]) => {
		this.stepItems = new StepNavigationItemList(newSteps, null, this.props.listStyleTypes);
		this.setActiveByPathString(this.activeItem ? this.activeItem.itemPathString : this.props.activePath);
	}

	@action setActiveByItem = (item: StepNavigationItem, isValidationNavigation = false) => {
		while (!item.executable && item.hasItems) {
		 	item = item.items[0];
		}
		if(item == this.activeItem) { return; }
		if (this.props.beforeChange) {
			const bItem = this.props.beforeChange(item);
			if (bItem === false) {
				return;
			}
			item = bItem || item;
			if(item == this.activeItem) { return; }
		}

		const prevActiveItem = this.activeItem;
		this.activeItem = item;
		this.prevItem = this.findSiblingExecutableItem(this.activeItem,-1);
		this.nextItem = this.findSiblingExecutableItem(this.activeItem,1);
		this.props?.onChange(item, prevActiveItem, isValidationNavigation);
	}

	@action setActiveByPathString = (pathString: string) => {
		this.setActiveByItem( this.getExecutableItemByPathStringAry(pathString ? _.toString(pathString).split(".") : []));
	}

	getExecutableItemByPathStringAry = (pathStringAry: Array<string>, items: StepNavigationItemList = this.stepItems): StepNavigationItem => {
		if (!items?.length) {
			return null;
		}
		const findLevel = items[0].level;
		const searchKey = pathStringAry[findLevel];

		let foundItem: StepNavigationItem;
		if (searchKey) {
			foundItem = _.find(items, item => item.name == searchKey);
		}

		if (!foundItem) {
			foundItem = items[0];
			pathStringAry = [];
			if (foundItem.parentItem?.flexibleAxis) {
				return null;
			}
		}

		const nextKey = pathStringAry.length > (findLevel + 1) ? pathStringAry[findLevel + 1] : null;
		if (foundItem.hasItems && !(!nextKey && foundItem.executable)) {
			return this.getExecutableItemByPathStringAry(pathStringAry, foundItem.items) || foundItem;
		} else {
			return foundItem;
		}
	}

	private findSiblingExecutableItem(baseItem: StepNavigationItem, shift: number) {
		if (shift === 0) {
			return baseItem;
		}
		const executableItems = _.flatten(_.map(this.stepItems, item => item.executableItems));
		const itemIndex = _.indexOf(executableItems, baseItem);
		if (!executableItems?.length) {
			return null;
		}

		const searchList = shift > 0 ? executableItems.splice(itemIndex + 1) : executableItems.splice(0, itemIndex).reverse();
		if (!searchList?.length) {
			return null;
		}
		const searchIndex = Math.abs(shift);
		return searchList.length < shift ? _.last(searchList) : searchList[searchIndex - 1];
	}

	@computed get displayPage() {
		return _.get(this.props.pages, this.activeItem.pageId, <LoadingUntil message="Loading page content..." loaded={false} />);
	}
}
