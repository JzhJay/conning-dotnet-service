import * as css from './AccordionComponent.css';
import {appIcons, settings, api, utility, AccordionValue, AccordionPanel, Accordion, IAccordionComponent, AxisCoordinate, simulationStore, i18n, Query} from 'stores'

const {KeyCode} = utility;
import {AutoSizer, List } from 'react-virtualized';
import type {ScrollParams} from 'react-virtualized';
import {AccordionHeader} from './AccordionHeader'
import {Observer, observer} from 'mobx-react';
import {
    autorun,
    reaction,
    observable,
    computed,
    action,
    runInAction,
    makeObservable,
} from 'mobx';
import {bp, ResizeSensorComponent, scrollIntoView} from 'components'
import {Tooltip} from '@blueprintjs/core';
import FlipMove from 'react-flip-move';

interface MyProps {
	tabIndex: number;
	panel: AccordionPanel;
	accordion: Accordion;
	//searchText: string;
	index: number;

	onAccordionHighlighted(accordion: Accordion);

	onSelectPreviousAccordion(index: number, select?: 'first' | 'last');

	onSelectNextAccordion(index: number, select?: 'first' | 'last');

	onSelectAccordion(index: number);
}

const __rowHeight = 26;

enum Part { Axis, Coordinate }

@observer
export class AccordionComponent extends React.Component<MyProps, {}> implements IAccordionComponent {
    static defaultProps = {
		animationStagger: 20,
	}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    get displayName() {
		return `AccordionComponent#${this.props.panel.part}#${this.props.accordion.axis.label}`;
	}

    render() {
		const {
			      props: {
				             accordion,
				             accordion: {
					                        sortedValues,
					                        expanded, axis, unavailable, areNoAvailableValuesSelected, isOnlyAvailableItemSelected,
					                        panel,
					                        panel: {
												query
											}
				                        },
				             tabIndex
			             },
			      focusedIndex
		      } = this;

		accordion.component = this;
		this.sortedValues   = sortedValues;

		return (
			<div
				tabIndex={tabIndex}
				className={
					classNames(
						css.accordion,
						{
							[css.noSelectedValues]:            accordion.areNoAvailableValuesSelected,
							[css.collapsed]:                   expanded == false,
							[css.unavailable]:                 unavailable,
							[css.focused]:                     focusedIndex != null,
							[css.isOnlyAvailableItemSelected]: isOnlyAvailableItemSelected,
							[css.noAvailableValuesSelected]:   areNoAvailableValuesSelected,
							[css.layoutHorizontally]:          query.isVariablesPage
						}
					)}
				onKeyDown={this.onAccordionKeyDown}>
				{panel.part !== 'scenarios' && axis && axis.label &&
				<AccordionHeader accordion={accordion} onContextMenu={e => this.onContextMenu(e, Part.Axis)}
								 allowExpandCollapse={!query.isVariablesPage}
				                 headerCheckboxClicked={this.onAccordionHeaderCheckboxClicked}
				                 onHeaderClick={this.onAccordionHeaderMouseClick}
				/>}

				<div className={classNames(css.valuesPanel, panel.part)}
				     ref={r => this.$valuesPanel = $(r)}>
					{panel.virtualize
					 ? this.renderVirtualizedAccordion()
					 : this.renderAccordion()
					}
				</div>

				{query.isVariablesPage && <ResizeSensorComponent onResize={this.onResize} />}
			</div>)
	}

	onResize = _.debounce(() => {
		if (!this.$valuesPanel) {
			return;
		}
		const height = this.$valuesPanel.height();
		const scrollHeight = this.$valuesPanel[0].scrollHeight;

		const $updateElement = this.$valuesPanel.children(`.${css.values}`);
		if (height < scrollHeight) {
			$updateElement.css('padding-right', 10);
		} else if ($updateElement.css('padding-right') != "20px") {
			$updateElement.css('padding-right', '');
		}
	}, 10);

    onContextMenu = (e: React.MouseEvent<HTMLElement>, part: Part, index?: number) => {
		const {accordion, panel, panel: {query, query: {_variables: {selected}}}} = this.props;

		const {Menu, MenuItem, MenuDivider, ContextMenu} = bp;

		let values    = [];
		const isCoord = part === Part.Coordinate;

		if (isCoord) {
			const {highlightRanges} = this;

			if (!this.isHighlighted(index) && highlightRanges.length <= 1) {
				// Act only on the item under the mouse
				// runInAction: Focus/Highlight under mouse for context menu
				runInAction(() => {
					this.highlightRanges = [{from: index, to: index}]
					this.focusedIndex    = index;
				});
			}

			values = _.flatMap(highlightRanges, v => _.range(v.from, v.to + 1)).map(index => accordion.sortedValues[index]);
		}

		e.preventDefault();
		e.stopPropagation();

		const icons = appIcons.queryTool.queryBuilder;

		const axisMenuItems = [
			part == Part.Coordinate && <MenuDivider key="axis-actions" title={true ? null : "Axis Actions"}/>,
			<MenuItem text={i18n.intl.formatMessage({
				defaultMessage: `Toggle '{label}' ({drawStatus})`,
				description: "[AccordionComponent] a contentmenu item for show/hide the drawer"
			}, {label: accordion.label, drawStatus: accordion.expanded ? i18n.common.SELECTION.COLLAPSE : i18n.common.SELECTION.EXPAND})}
			          key="toggle-axis-expansion"
			          onClick={accordion.toggleExpandCollapse}
			          disabled={!accordion.canCollapse}
			          icon={accordion.expanded ? 'chevron-up' : 'chevron-down'}
			/>,
			/* TODO - Only show collapse all / expand all if there are multiple visible axes in our panel */
			<MenuItem text={i18n.common.SELECTION.COLLAPSE_ALL} onClick={() => panel.collapse()} icon="double-chevron-up" key="collapse-all"/>,
			<MenuItem text={i18n.common.SELECTION.EXPAND_ALL} onClick={() => panel.expand()} icon="double-chevron-down" key="expand-all"/>
		];

		const selectionMenuItems = (<div>
			{part == Part.Axis && <MenuDivider />}
			<MenuItem text={i18n.common.SELECTION.ALL} onClick={() => accordion.selectValues("All")} icon="blank"/>
			<MenuItem text={i18n.common.SELECTION.NONE} onClick={() => accordion.selectValues("None")} icon="blank"/>

			{isCoord && <MenuDivider/>}
			{isCoord && <MenuItem text={i18n.common.SELECTION.ONLY} disabled={values.length === 0} onClick={() => accordion.selectValues("Only", values)} icon="blank"/>}
			{isCoord && <MenuItem text={i18n.common.SELECTION.EXPECT} disabled={values.length === 0} onClick={() => accordion.selectValues("Except", values)} icon="blank"/>}

			{/* Coordinate only Selection Actions */}
			{isCoord && !accordion.areNoAvailableValuesSelected && <MenuDivider/>}
			{isCoord && !accordion.areNoAvailableValuesSelected && <MenuItem text={i18n.common.SELECTION.WITH} disabled={values.length === 0} onClick={() => accordion.selectValues("With", values)} icon="blank"/>}
			{isCoord && !accordion.areNoAvailableValuesSelected && <MenuItem text={i18n.common.SELECTION.WITHOUT} disabled={values.length === 0} onClick={() => accordion.selectValues("Without", values)} icon="blank"/>}
		</div>).props.children;

		ContextMenu.show(
			<Menu>
				{/*<MenuDivider title={`Query:  ${query.name}`}/>*/}

				{part == Part.Axis ? [, ...axisMenuItems, ...selectionMenuItems]
				                   : [...selectionMenuItems, ...axisMenuItems]}

				{/* Query Actions */}
				<MenuDivider/>
				<MenuItem
					text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RUN(Query.OBJECT_NAME_SINGLE)}
					icon={appIcons.queryTool.queryBuilder.runQuery.name as any} disabled={selected == 0} onClick={() => query.run()}/>
				<MenuDivider/>
				<MenuItem
					text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RESET(Query.OBJECT_NAME_SINGLE)}
					disabled={!query || query.busy} icon={appIcons.queryTool.queryBuilder.resetQuery.name as any} onClick={() => query.reset()}/>

			</Menu>, {left: e.clientX - 8, top: e.clientY - 8});
	}

    sortedValues: Array<AccordionValue>;

    renderVirtualizedAccordion = () => {
		const {focusedIndex, contextMenuIndex, props: {accordion: {values, sortedValues, expanded}}} = this;

		this.sortedValues = sortedValues;

		const computedHeight = expanded ? this.gridHeight : 0;

		return (<AutoSizer>
			{({width, height}) => (
				<List
					ref={r => {
						this.virtualScroll = r;
					}}
					className={css.values}
					rowCount={values.length}
					rowHeight={__rowHeight}
					rowRenderer={({index, style}) => <AccordionValueComponent key={sortedValues[index].coordinate.id} index={index} style={style} accordionComponent={this} value={sortedValues[index]}
					                                                          focused={index === focusedIndex}  isContextItem={index === contextMenuIndex}
					                                                          highlighted={this.isHighlighted(index)}/>}
					onRowsRendered={this.onRowsRendered}
					onScroll={this.virtualScroll_onScroll}
					scrollToIndex={focusedIndex ? focusedIndex : 0}
					width={width} height={height ? Math.ceil(height) : computedHeight}
				/>
			)}
		</AutoSizer>);
	}

    renderAccordion() {
		const {animatingExpansion, focusedIndex, contextMenuIndex, props: {accordion, accordion: {expanded, everExpanded, values}}} = this;

		const {animate} = settings.query;

		return (
			<FlipMove className={css.values} enterAnimation="none" leaveAnimation="none"
			               staggerDelayBy={animate ? 100 : 0}
			               disableAllAnimations={!animate || values.length > 50}>
				{everExpanded || animatingExpansion || expanded
				 ? accordion.sortedValues.map((v, index) => <AccordionValueComponent key={v.coordinate.id} index={index} accordionComponent={this} value={v}
				                                                                     focused={index === focusedIndex} isContextItem={index === contextMenuIndex}
				                                                                     highlighted={this.isHighlighted(index)}/>)
				 : <div className="placeholder"/>}
			</FlipMove>)
	}

    getAccordionValueCheckboxRef = (label: string) => {
		const coordinateID = this.sortedValues.find((v) => v.coordinate.label == label).coordinate.id;
		return $(ReactDOM.findDOMNode(this)).find(`[data-coordinate="${coordinateID}"]`).find(".bp3-checkbox").get(0);
	}

    virtualScroll;

    @computed get gridHeight() {
		return this.props.accordion.expanded ? __rowHeight * this.props.accordion.values.length : 0;
	}

    $valuesPanel: JQuery;
    accordionPanelNode: HTMLElement;
    node: HTMLDivElement;
    $node: JQuery;
    mounted = false;

    @observable.struct dragRange?: IRange       = null;
    @observable freezeScrolling                 = false;
    @observable highlightRanges?: Array<IRange> = [];
    @observable focusedIndex                    = null;
    @observable contextMenuIndex                = null;
    _toDispose: Function[]   = [];

    componentDidMount() {
		this.mounted = true;
		this.node    = ReactDOM.findDOMNode(this) as HTMLDivElement;
		this.$node   = $(this.node);

		const {_toDispose, props: {panel, accordion}} = this;

		if (!panel.virtualize) {
			this.accordionPanelNode = this.$node[0].parentNode as HTMLElement;
			this.accordionPanelNode.addEventListener("scroll", this.onParentPanelScroll)
		}

		document.addEventListener('mouseup', this.document_onMouseUp);

		if (panel.virtualize) {
			_toDispose.push(autorun(() => {
				const {
					      props: {accordion: {selected, available, values}},
					      highlightRanges, dragRange, focusedIndex
				      } = this;

				/* Otherwise our autorun doesn't fire when we switch from/to in place */
				for (const r of highlightRanges) {
					const {from, to} = r;
				}
				if (dragRange) {
					const {from, to} = dragRange;
				}

				this.virtualScroll.forceUpdateGrid();
			}, {name: 'Refresh virtualized grid if selection/availability/highlight/drag/focus changes'}));
		}
		else {
			_toDispose.push(reaction(() => this.props.accordion.expanded, this.animateExpandCollapse, {name: 'Animate accordion expand/collapse', fireImmediately: false}));
		}

		// Causes jerkiness / jumping around the screen - only do this when focusing purely programmatically
		if (!panel.virtualize) {
			_toDispose.push(reaction(() => this.focusedIndex, this.focusFocusedIndex, {name: 'Programmatically focus an accordion value'}));
		}

		_toDispose.push(reaction(() => this.highlightRanges, (ranges) => {
			if (ranges.length > 0) {
				this.props.onAccordionHighlighted(this.props.accordion);
			}
		}, {name: 'Programmatically highlight a range of values'}));

		_toDispose.push(reaction(() => accordion.expanded, () => {
			if (panel.query.shouldExpandVariables)
				return;

			accordion.clauseAxis.expanded = accordion.expanded
			api.xhr.post(`${accordion.route}/property`, {operation: 'expanded', value: accordion.expanded});
		}, {name: 'Post to julia when expansion changes'}));

		_toDispose.push(reaction(() => accordion.sortOrder, () => {
			accordion.clauseAxis.sortOrder = accordion.sortOrder;
			api.xhr.post(`${accordion.route}/property`, {operation: 'sortOrder', value: accordion.sortOrder});
		}, {name: 'Post to julia when sort order changes'}));

	}

    focusFocusedIndex = () => {
		if (!this.props.panel.searchModel.searchText) {
			setTimeout(() => {
				const {focusedIndex} = this;
				if (focusedIndex != null) {
					this.$valuesPanel.find(`[data-coordinate=${this.props.accordion.sortedValues[focusedIndex].coordinate.id}]`).focus();
				}
			}, 0);
		}
	}

    @observable animatingExpansion = false;
    scrollingFromCode  = false;

    animateExpandCollapse = (expanded) => {
		const {accordion} = this.props;

		// Animate the expand/collapse ONLY if we are on screen
		if (this.accordionPanelNode.scrollTop <= this.node.offsetTop && this.accordionPanelNode.scrollTop + this.accordionPanelNode.clientHeight >= this.node.offsetTop) {
			const options = {
				duration: Math.max(400, Math.min(1000, 50 * accordion.values.length)),
				ease:     'ease-out',
				complete: () => runInAction(() => {
					this.animatingExpansion = false;

					// // Are some of our values offscreen?  If so, scroll to the top of the panel (WEB-16)
					// NVS - I find this to be very annoying and have disabled it.
					// if (expanded && !api.site.busy) {
					// 	const {node, accordionPanelNode} = this;
					//
					// 	let top = node.offsetTop;
					//
					// 	if (top + this.gridHeight + __headerHeight > accordionPanelNode.scrollTop + accordionPanelNode.clientHeight + accordionPanelNode.offsetTop) {
					// 		this.scrollingFromCode = true;
					// 		scrollIntoView(node, {align: {top: 0}, time: 500}, () => this.scrollingFromCode = false);
					// 	}
					// }
				})
			};

			this.animatingExpansion = true;

			if (!expanded) {
				this.$valuesPanel.velocity({height: 0}, options);
			}
			else {
				// // Force the grid to draw our cells (first time being shown)
				// if (!this.state.everExpanded) {
				//     this.$valuesPanel.css('height', `${height}px`);
				//     this.$valuesPanel.css('height', '0px');
				// }

				this.$valuesPanel.css('height', '0px');

				this.focusFocusedIndex();

				// Now animate it
				this.$valuesPanel.velocity({height: this.gridHeight}, options);
			}
		}
		else {
			//console.log('Skipping off-screen animation for accordion ' + this.props.accordion.id)
			if (!expanded) {
				this.$valuesPanel.css('height', '0px');
			}
			else {
				this.$valuesPanel.css('height', `${this.gridHeight}px`);
			}
		}
		// if (!this._togglingExpandedFromCode && expanded && !this.props.panel.expandCollapseAll) {
		// 	this.selectValue();
		// }
	}

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
		document.removeEventListener('mouseup', this.document_onMouseUp);

		this.mounted = false;
	}

    mouseButtons: number;
    document_onMouseUp = (e: MouseEvent) => {
		this.mouseButtons = e.buttons;

		if (this.mouseButtons === 0) {
			this.dragRange = null;
		}
	}

    onRowsRendered = () => {
		if (this.props.panel.virtualize && this.focusedIndex != null) {
			// After scrolling and rendering new rows, the grid takes away our keyboard focus - restore it
			const valueDiv = this.$valuesPanel.find(`.Grid__innerScrollContainer .${css.accordionValue}[tabindex="${this.focusedIndex}"]`)[0];
			if (valueDiv) { valueDiv.focus(); }
		}
	}

    scrollTo = () => {
		const {$node} = this;

		const $header = $node.find('.header');

		/* Todo - this needs to only scroll if the header is offscreen */

		//this.scrollingFromCode = true;
		//scrollIntoView($header[0], {align: {top: 0}}, () => this.scrollingFromCode = false);
	}

    /**
	 * As the user moves up and down they may focus on an item that's off screen.  Scroll it into view.
	 */
    scrollToFocusedItem = (time = 1500) => {
		const {focusedIndex} = this;

		if (!this.props.panel.virtualize) {
			const {$valuesPanel, accordionPanelNode, node} = this;

			const valueDiv = $valuesPanel.find(`.accordion-value[tabIndex="${focusedIndex}"]`)[0];

			if (valueDiv != null) {
				const top = valueDiv.offsetTop + node.offsetTop;

				if (top + valueDiv.clientHeight > accordionPanelNode.scrollTop + accordionPanelNode.clientHeight + accordionPanelNode.offsetTop
					|| top < accordionPanelNode.scrollTop + this.accordionPanelNode.offsetTop + this.accordionPanelNode.scrollHeight) {
					//                console.log(`scrollToFocusedItem  ${valueDiv}  top: ${top}  scrollTop: ${accordionPanelNode.scrollTop}`)
					this.scrollingFromCode = true;
					scrollIntoView(valueDiv, {time: time}, () => this.scrollingFromCode = false);
				}
			}
		}
		else {
			const valueDiv         = this.$valuesPanel.find(`.accordion-value[tabIndex="${focusedIndex}"]`)[0].parentElement;
			this.scrollingFromCode = true;
			scrollIntoView(valueDiv, {}, () => this.scrollingFromCode = false);
		}
	}

    attractUsersAttention = (coordinate?: AxisCoordinate) => {
		const $node = !coordinate ? this.$node : $(this.$valuesPanel.find(`[data-coordinate="${coordinate.id}"]`)[0].parentElement);

		$node.addClass(css.attractUserAttention)
		setTimeout(() => $node.removeClass(css.attractUserAttention), 4000);
	}

    onAccordionHeaderCheckboxClicked = () => {
		const {accordion, panel} = this.props;
		accordion.selectValues(accordion.areAllAvailableSelected ? "None" : "All", []);
	}

    onAccordionHeaderMouseClick = (e: React.MouseEvent<HTMLElement>) => {
		//console.log('onAccordionHeaderMouseClick', e);
		if (!this.props.accordion.expanded) {
			this.$node.focus();
			this.props.onSelectAccordion(this.props.index)
		}
	}

    onAccordionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const {focusedIndex, props: {accordion, accordion: {expanded, sortedValues, values}, panel}} = this;
		let newFocusedIndex                                                                          = focusedIndex;

		const clientHeight = panel.virtualize ? this.$valuesPanel[0].clientHeight : this.accordionPanelNode.clientHeight;

		switch (e.keyCode) {
			case KeyCode.Space: {
				if (expanded) {
					this.toggleSelectedValues(panel);
				}
				else {
					this.onAccordionHeaderCheckboxClicked();
				}
				break;
			}

			case KeyCode.Down: {
				if (expanded && focusedIndex + 1 < values.length) {
					newFocusedIndex++;
				}
				else {
					this.props.onSelectNextAccordion(this.props.index);
				}

				break;
			}

			case KeyCode.Right: {
				if (!expanded) { accordion.expanded = true}

				break;
			}

			case KeyCode.Left: {
				if (expanded) {
					accordion.expanded = false
				}

				break;
			}

			case KeyCode.Home: {
				newFocusedIndex = 0;
				break;
			}

			case KeyCode.End: {
				newFocusedIndex = values.length - 1;
				break;
			}

			case KeyCode.PageDown: {
				newFocusedIndex += Math.floor(clientHeight / __rowHeight);
				newFocusedIndex = Math.min(newFocusedIndex, values.length - 1);

				if (!expanded || newFocusedIndex === focusedIndex) {
					this.props.onSelectNextAccordion(this.props.index);
				}

				break;
			}

			case KeyCode.Up: {
				if (expanded && focusedIndex > 0) {
					newFocusedIndex--;
				}
				else {
					this.props.onSelectPreviousAccordion(this.props.index, 'last');
				}
				break;
			}

			case KeyCode.PageUp: {
				newFocusedIndex -= Math.floor(clientHeight / __rowHeight);
				newFocusedIndex = Math.max(newFocusedIndex, 0);

				if (!expanded || newFocusedIndex === focusedIndex) {
					this.props.onSelectPreviousAccordion(this.props.index, 'last');
				}

				break;
			}

			case KeyCode.Tab: {
				if (e.shiftKey) {
					this.props.onSelectPreviousAccordion(this.props.index);
				}
				else {
					this.props.onSelectNextAccordion(this.props.index);
				}
				break;
			}

			default: {
				const lowerKey = e.key.toLowerCase();

				switch (lowerKey) {
					case 'a': {
						if (e.metaKey || e.ctrlKey) {
							this.highlightAll();
						}
					}
				}
			}
		}

		if (newFocusedIndex !== focusedIndex) {
			const focusedIndex = newFocusedIndex;
			let highlightRanges: IRange[];

			if (!e.shiftKey) {
				highlightRanges = [{from: focusedIndex, to: focusedIndex}];
			}
			else {
				highlightRanges   = this.highlightRanges;
				let range: IRange = _.last(highlightRanges);
				if (e.keyCode === KeyCode.Down) {
					if (range.to === focusedIndex - 1) {
						range.to = focusedIndex;
					} else {
						range.from = focusedIndex;
					}
				} else {
					if (range.from === focusedIndex + 1) {
						range.from = focusedIndex;
					} else {
						range.to = focusedIndex;
					}
				}
			}

			// runInAction: Accordion focus/highlight changed due to keystroke
			runInAction(() => {
				this.focusedIndex    = newFocusedIndex;
				this.highlightRanges = highlightRanges;
			})

			e.preventDefault()
		}
		else {
			e.preventDefault();
		}
	}

    highlightAll = () => {
		this.highlightRanges = [{from: 0, to: this.props.accordion.values.length - 1}]
	}

    onMouseDown = (e: React.MouseEvent<HTMLElement>, index: number) => {
		//console.log('mouseDown', e.button, e.buttons, index, e.target)
		const target = e.target as HTMLElement;

		this.mouseButtons = e.buttons;

		const {props: {accordion}, highlightRanges} = this;

		// runInAction: Handle mouse down (drag/focus/highlight) for accordion
		runInAction(() => {
			if (e.buttons !== 0 && target.tagName !== 'INPUT') {
				if (!e.shiftKey && (!e.metaKey && !e.ctrlKey)) {
					// Select the cell under the mouse only if they left-clicked...
					if (e.buttons === 1
						// ... but if they right-clicked, only do so if they had a single item selected
						|| (e.buttons === 2
							&& (_.isEmpty(highlightRanges) // Nothing selected
								|| (highlightRanges.length === 1 && highlightRanges[0].from === highlightRanges[0].to))) // One thing already selected, switch to the new right-clicked row
					) {
						this.dragRange       = {from: index, to: index};
						this.highlightRanges = [{from: index, to: index}];
						this.focusedIndex    = index;
					}
				}
				// Shift-click.  Select a range of cells
				else if (e.shiftKey) {
					const {props: {accordion}} = this;

					const focusedIndex  = this.focusedIndex ? this.focusedIndex : index;
					const existingRange = highlightRanges.find(r => r.from <= focusedIndex && focusedIndex <= r.to);

					if (existingRange) {
						if (focusedIndex === existingRange.from && focusedIndex === existingRange.to) {
							if (index < existingRange.from) { existingRange.from = index; }
							else { existingRange.to = index; }
						}
						else if (focusedIndex === existingRange.from) {
							existingRange.to = index;
						} else {
							existingRange.from = index;
						}

						if (existingRange.to < existingRange.from) {
							const to           = existingRange.from;
							existingRange.from = existingRange.to;
							existingRange.to   = to;
						}
					}
					else {
						this.highlightRanges.push({from: Math.min(focusedIndex, index), to: Math.max(focusedIndex, index)});
					}

					this.focusedIndex = focusedIndex;
				}
				// Ctrl-click means add/remove the selection
				else if (e.metaKey || e.ctrlKey) {
					const isHighlighted = this.isHighlighted(index);

					const {highlightRanges} = this;

					if (!isHighlighted) {
						highlightRanges.push({from: index, to: index});
					}
					else {
						const containingRange = highlightRanges.find(r => r.from <= index && index <= r.to);

						let removeOriginalRange = false;

						if (containingRange.from === containingRange.to) {
							removeOriginalRange = true;
						}
						else {
							if (containingRange.from === index) {
								containingRange.from++;
							}
							else if (containingRange.to === index) {
								containingRange.to--;
							}
							else { // Split the range
								removeOriginalRange = true;
								highlightRanges.push({from: containingRange.from, to: index - 1})
								highlightRanges.push({from: index + 1, to: containingRange.to})
							}
						}

						if (removeOriginalRange) {
							// Remove the original range
							this.highlightRanges = highlightRanges.filter(r => containingRange !== r)
						}
					}
				}
			}
		});
	}

    onMouseEnter = (e: React.MouseEvent<HTMLElement>, index: number) => {
		this.mouseButtons = e.buttons;

		if (this.dragRange) {
			//console.log('mouseEnter', e.button, e.buttons, index)
			if (e.buttons === 1) {
				this.dragSelect(index);
			}
			else {
				this.cancelDragSelect();
			}
		}
	}

    lastScroll = {top: 0, bottom: null};

    /**
	 * This is called for the scenarios panel as it scrolls
	 *
	 * If the user is drag-selecting, increase their selection range to match the new scrolled to item
	 * @param args
	 */
    virtualScroll_onScroll = (args: ScrollParams) => {
		const {accordion}   = this.props;
		const {lastScroll}  = this;
		const currentScroll = {
			top:    Math.floor(args.scrollTop / __rowHeight),
			bottom: Math.ceil((args.scrollTop + args.clientHeight) / __rowHeight)
		}

		if (this.dragRange) {
			//          console.log(lastScroll, currentScroll)

			if (this.mouseButtons === 0) {
				this.dragRange = null;
				return;
			}

			const $values = this.$valuesPanel.find('.Grid__innerScrollContainer .accordion-value')

			if (currentScroll.top > lastScroll.top) {
				// Scrolling down
				$values.each((index, valueNode: HTMLElement) => {
					const {tabIndex} = valueNode;
					if (tabIndex > this.dragRange.to && tabIndex <= currentScroll.bottom) {
						$(valueNode).addClass(css.highlighted);
					}
				})

				this.dragSelect(currentScroll.bottom)
			}
			else if (currentScroll.top < lastScroll.top) {
				// Scrolling up
				$values.each((index, valueNode: HTMLElement) => {
					const {tabIndex} = valueNode;
					if (tabIndex < this.dragRange.to && tabIndex >= currentScroll.top) {
						$(valueNode).addClass(css.highlighted);
					}
				})

				this.dragSelect(currentScroll.top)
			}
		}

		this.lastScroll = currentScroll;
	}

    lastScrollTop = 0;

    onParentPanelScroll = (e: Event) => {
		const {dragRange} = this;

		const currentPanelScrollTop = this.accordionPanelNode.scrollTop;

		if (this.scrollingFromCode || this.mouseButtons === 0) {
			this.dragRange     = null;
			this.lastScrollTop = currentPanelScrollTop;
		}
		else if (dragRange && currentPanelScrollTop !== this.lastScrollTop) {
			//console.log('onPanelScroll', scrollTop);

			//const gridTop = this.$accordionValuesContainer.position().top;

			if (this.freezeScrolling) {
				// Scrolling in the frozen direction?
				if ((currentPanelScrollTop <= this.lastScrollTop && dragRange.to === 0)
					|| (currentPanelScrollTop >= this.lastScrollTop && dragRange.to + 1 === this.props.accordion.values.length)) {
					this.accordionPanelNode.scrollTop = this.lastScrollTop;
				}
				else {
					// They're going back the other way!
					this.freezeScrolling = false;
				}
			}
			else {

				const $values = this.props.panel.virtualize ? this.$valuesPanel.find('.Grid__innerScrollContainer').children()
				                                            : this.$valuesPanel.find(`.${css.values}`).children();

				let scrollDirection: 'up' | 'down';
				let endIndex                = null;
				let entireAccordionScrolled = false;
				const accordionOffsetTop    = this.$node[0].offsetTop;

				const calcChildBottom = (child: HTMLElement) => {
					return accordionOffsetTop - this.accordionPanelNode.offsetTop + child.offsetTop + child.offsetHeight;
				}

				if (currentPanelScrollTop > this.lastScrollTop) {
					//console.log('drag scrolling DOWN!')
					scrollDirection = 'down';

					const bottomBounds = currentPanelScrollTop + this.accordionPanelNode.clientHeight;

					// What's the bottom-most visible row?
					let previousChild = null;
					for (let i = Math.max(dragRange.from, dragRange.to); i < $values.length; i++) {
						const child       = $values[i];
						const childBottom = calcChildBottom(child)

						if (childBottom > bottomBounds) {
							endIndex = i - 1;
							break;
						}
						else if (childBottom === bottomBounds) {
							endIndex                = i;
							entireAccordionScrolled = i + 1 === $values.length;
							break;
						}

						previousChild = child;
					}

					if (!endIndex) {
						endIndex                = $values.length - 1;
						entireAccordionScrolled = true;
					}

					//console.log('bottom node = ', lastVisibleIndex)

					this.dragSelect(endIndex);
				}
				else {
					//console.log('drag scrolling UP!')
					scrollDirection = 'up';

					const upperBounds = currentPanelScrollTop;

					// What's the bottom-most visible row?
					let previousChild = null;
					for (let i = Math.min(dragRange.from, dragRange.to); i >= 0; i--) {
						let child       = $values[i];
						let childBottom = calcChildBottom(child);

						if (childBottom < upperBounds) {
							endIndex = i + 1;
							break;
						}
						else if (childBottom === upperBounds) {
							endIndex                = i;
							entireAccordionScrolled = i === 0;
							break;
						}

						previousChild = child;
					}

					if (!endIndex) {
						endIndex                = 0;
						entireAccordionScrolled = true;
					}

					//console.log('top node = ', lastVisibleIndex)

					this.dragSelect(endIndex);
				}

				// WEB-759 - Stop scrolling once we've reached the end of a drag selected list
				if (entireAccordionScrolled) {
					// More room to scroll?
					const extraScrollBuffer = 3 * __rowHeight;

					const newScrollTop = scrollDirection === 'down'
					                     ? Math.min(this.lastScrollTop + extraScrollBuffer, this.accordionPanelNode.scrollHeight)
					                     : Math.max(this.lastScrollTop - extraScrollBuffer, 0);

					if (newScrollTop !== this.lastScrollTop) {
						this.freezeScrolling              = true;
						this.lastScrollTop                = newScrollTop;
						this.accordionPanelNode.scrollTop = newScrollTop;
					}
				}
			}
		}

		if (!this.freezeScrolling) {
			this.lastScrollTop = currentPanelScrollTop
		}
	}

    @action unfocusAndClearSelection = () => {
		this.focusedIndex    = null;
		this.highlightRanges = [];
	}

    public isHighlighted = (index: number): boolean => {
		return _.some(this.highlightRanges, r => r.from <= index && index <= r.to);
	}

    /**
	 * The user is currently left-click dragging their mouse to select a range of accordion values
	 * They might be...:
	 *       Continuing to drag in the same direction - increasing the drag range
	 *          This may cause the panel to scroll
	 *      Going back up towards their original drag (focus) point, reducing the drag range
	 *      Going back up and beyond their initial drag point, increasing the range in the OPPOSITE direction
	 */
    dragSelect = (index: number) => {
		//
		const {focusedIndex} = this;
		const range: IRange  =
			      index === this.focusedIndex ? {from: index, to: index}
			                                  : this.focusedIndex < index ? {from: focusedIndex, to: index}
			                                                              : {from: index, to: focusedIndex};

		runInAction(() => {
			this.dragRange       = Object.assign({}, range);
			this.highlightRanges = [Object.assign({}, range)];
		})
	}

    cancelDragSelect = () => {
		if (this.dragRange != null) {
			// runInAction: Cancel drag select
			runInAction(() => {
				this.dragRange       = null;
				this.freezeScrolling = false;
			})
		}
	}

    @action toggleSelectedValues = (panel: AccordionPanel) => {
		const {highlightRanges, focusedIndex, props: {accordion}} = this;

		if (highlightRanges && highlightRanges.length > 0) {
			for (const range of highlightRanges) {
				const {from, to} = range,
				      values     = _.range(Math.min(from, to), Math.max(from, to) + 1).map(i => accordion.sortedValues[i]),
				      checked    = values.filter(v => v.selected),
				      unchecked  = values.filter(v => !v.selected)

				// Flip the selections
				if (checked.length > 0) { accordion.selectValues('Without', checked)}
				if (unchecked.length > 0) { accordion.selectValues('With', unchecked)}
			}
		}
		else if (focusedIndex) {
			accordion.toggleValue(accordion.sortedValues[focusedIndex]);
		}
	}

    focusAccordionValue = (value?: 'first' | 'last' | AccordionValue, scrollIntoView?: boolean) => {
		const {accordion} = this.props;

		const index = value == null ? 0
		                            : typeof value !== 'string'
		                              ? accordion.sortedValues.indexOf(value)
		                              : value === 'first'
		                                ? 0
		                                : this.props.accordion.values.length - 1;

		runInAction(() => {
			if (!this.isHighlighted(index)) {
				this.highlightRanges = [{from: index, to: index}];
			}

			if (!accordion.expanded) {
				accordion.expanded = true;
			}

			this.focusedIndex = index;

			if (scrollIntoView) {
				this.scrollToFocusedItem();
			}
		});
	}
}

interface AccordionValueProps {
	index: number,
	style?: React.CSSProperties,
	accordionComponent: AccordionComponent;
	value: AccordionValue;
	focused: boolean;
	highlighted: boolean;
	isContextItem: boolean;
}

@observer
class AccordionValueComponent extends React.Component<AccordionValueProps, {}> {
	render() {
		const {props: {accordionComponent, focused, highlighted, isContextItem,  accordionComponent: {contextMenuIndex, props: {accordion}}, index, style, value}} = this;

		const showTooltip = accordion.part != "scenarios" && !_.isEmpty(value.coordinate.description) && value.coordinate.label != value.coordinate.description;

		return (
			<div className={classNames(css.accordionValue, 'accordion-value', {
				[css.unavailable]: !value.available,
				'is-context-item': isContextItem,
				[css.focused]:     focused,
				[css.highlighted]: highlighted
			})}
			     data-coordinate={value.coordinate.id}
			     tabIndex={index}
			     key={value.coordinate.id}
			     onContextMenu={e => accordionComponent.onContextMenu(e, Part.Coordinate, index)}
			     onMouseDown={(e) => accordionComponent.onMouseDown(e, index)}
			     onDoubleClick={() => {
				     accordionComponent.focusAccordionValue(value);
				     if (value.available) { accordion.toggleValue(value) }
			     }}
			     style={style}
			     onMouseEnter={(e) => accordionComponent.onMouseEnter(e, index)}>

				<Tooltip
					disabled={!showTooltip}
					boundary={"viewport"}
					modifiers={{keepTogether: {enabled: false}, preventOverflow: {enabled: false}}}
					position={bp.Position.RIGHT}
					popoverClassName={css.coordTooltip}
					content={value.coordinate.description}
					className={css.coordTooltipIcon}>
					<div style={{width: '100%', display: 'flex'}}>
						<bp.Checkbox type="checkbox"
						             checked={value.selected}
						             onChange={() => {
							             accordion.toggleValue(value)
							             accordionComponent.focusAccordionValue(value);
						             }}/>
						<label style={{flexGrow: 1}}>
							{/* <Highlighter searchWords={searchText ? [searchText] : []} textToHighlight={value.label.toString()}/> */}
							{value.label}
						</label>

						{/*{showTooltip && <bp.Icon icon='help' />}*/}
					</div>
				</Tooltip>
			</div>
		)
	}
}