import {FormattedMessage} from 'react-intl';
import {AutoSizer, List} from 'react-virtualized';
import * as css from './AccordionPanelComponent.css';
import {settings, appIcons, i18n} from 'stores';
import {AccordionPanel, Accordion, AccordionValue, QueryPart, IAccordionPanelComponent, AxisCoordinateSearchResultModel} from 'stores/query';

import {AccordionPanelToolbar,} from './AccordionPanelToolbar'
import {AxisCoordinateSearchResult, PanelSearchBar} from '../searchers/index'
import {AccordionComponent} from '../Accordion'
import {observable, computed, action, runInAction, reaction, makeObservable, autorun} from 'mobx';
import {observer} from 'mobx-react'
import {ContextMenuTarget, Menu, MenuItem, MenuDivider} from '@blueprintjs/core';
import FlipMove from 'react-flip-move';

interface MyProps {
	panel: AccordionPanel;
	tabIndex?: number
	onDelete?: (panel: AccordionPanel) => void;
}

@observer
export class AccordionPanelComponent extends React.Component<MyProps, {}> implements IAccordionPanelComponent {
    @observable hasVerticalScrollbar?: boolean;
    @observable disableAllAnimations?: boolean;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    get displayName() {
		return `AccordionPanelComponent#${this.props.panel.part}#${this.props.panel.id}`;
	}

    shouldRenderAccordion(acc: Accordion) {
		const {tabIndex, panel: {part, sortedAccordions, searchModel: {lastSearchAxis}, impliedAxes, clause: {showImpliedAxes}}} = this.props;
		return !acc.disposed && acc.axis && part !== 'variables'
			|| showImpliedAxes
			|| !acc.isImplied
			// Is the active seach item?
			|| (lastSearchAxis != null && acc.axis.id === lastSearchAxis.id);
	}

    renderAccordion = (acc: Accordion, index: number) => {
		const {tabIndex, panel, panel: {sortedAccordions, searchModel: {lastSearchAxis}, impliedAxes, clause: {showImpliedAxes}}} = this.props;
		const {axis: {id}}                                                                                                        = acc;

		// Filter out implied axes for variable panel
		return this.shouldRenderAccordion(acc) && <AccordionComponent key={id}
		                                                              data-axis-id={id}
		                                                              panel={panel}
		                                                              index={index}
		                                                              onAccordionHighlighted={this.onAccordionHighlighted}
		                                                              onSelectNextAccordion={this.onSelectNextAccordion}
		                                                              onSelectPreviousAccordion={this.onSelectPreviousAccordion}
		                                                              onSelectAccordion={this.onSelectAccordion}
		                                                              tabIndex={index}
		                                                              accordion={acc}/>;
	}

    renderSearchResults() {
		const {panel, panel: {searchModel}} = this.props;

		if (!searchModel.isSearching) { return null; }

		if (searchModel.searchResults.length === 0) {
			return <AxisCoordinateSearchResult index={0} key="no-results" panel={panel}/>;
		}
		else {

			return (<AutoSizer>
				{({width, height}) => (
					<List
						className={css.values}
						rowCount={searchModel.searchResults.length}
						rowHeight={70}
						ref= {r => searchModel.searchListRef = ReactDOM.findDOMNode(r)}
						rowRenderer={({index, style}) => {
							const r = searchModel.searchResults[index];

							return <AxisCoordinateSearchResult
							style={Object.assign({height:"70px"}, style)}
							key={`searchresult-${r.axis.id}-${r.coord ? r.coord.id : ''}`}
							index={index} panel={panel}
							result={r}/>}}
						scrollToIndex={searchModel.searchIndex ? searchModel.searchIndex : 0}
						width={width} height={500}
					/>
				)}
			</AutoSizer>)
		}
	}

    render() {
		const {tabIndex, panel, panel: {query, searchModel: {searchText, isSearching, searchIndex}, sortedAccordions, impliedAxes, clause: {showImpliedAxes}}, ...props} = this.props;
		const {query: {animate}}                                                                                                                     = settings;

		let impliedAxesTitle = null;
		if (panel.part === 'variables' && impliedAxes.length > 0) {
			if (impliedAxes.length === 1) {
				if (showImpliedAxes) {
					impliedAxesTitle = i18n.intl.formatMessage({
						defaultMessage: "{impliedAxes} implied axis is currently shown",
						description:    "[AccordionPanelComponent] a hit message about how many unavailable items shown"
					}, {impliedAxes: impliedAxes.length});
				} else {
					impliedAxesTitle = i18n.intl.formatMessage({
						defaultMessage: "{impliedAxes} implied axis is currently hidden",
						description:    "[AccordionPanelComponent] a hit message about how many unavailable items hidden"
					}, {impliedAxes: impliedAxes.length});
				}
			} else {
				if (showImpliedAxes) {
					impliedAxesTitle = i18n.intl.formatMessage({
						defaultMessage: "{impliedAxes} implied axes are currently shown",
						description:    "[AccordionPanelComponent] a hit message about how many unavailable items shown"
					}, {impliedAxes: impliedAxes.length});
				} else {
					impliedAxesTitle = i18n.intl.formatMessage({
						defaultMessage: "{impliedAxes} implied axes are currently hidden",
						description:    "[AccordionPanelComponent] a hit message about how many unavailable items hidden"
					}, {impliedAxes: impliedAxes.length});
				}
			}
		}

		return (
			<li tabIndex={tabIndex}
			    className={classNames(
				    css.accordionPanel,
				    {
					    [css.isSearching]:    isSearching,
					    'no-selected-values': _.some(panel.accordions, acc => acc.areNoAvailableValuesSelected),
					    [css.deleting]:       panel.isDeleting
				    })}>
				{panel.showToolbar
				 ? <AccordionPanelToolbar {...props} panel={panel} impliedAxes={impliedAxes}/>
				 : null}

				<PanelSearchBar part={panel.part} panel={panel}/>

				<div className={css.accordionsContainer}>
					<FlipMove className={classNames(css.accordions, {[css.layoutHorizontally]: query.isVariablesPage})}
					               duration={animate ? 800 : 0}
					               ref={r => this.$accordionContainer = $(ReactDOM.findDOMNode(r))}
					               onStartAll={this.onStartAnimatingAccordionMoves}
					               onFinishAll={this.onFinishAnimatingAccordionMoves}
					               disableAllAnimations={this.disableAllAnimations || !animate || KARMA}>
						{sortedAccordions.map(this.renderAccordion)}
					</FlipMove>
					<div ref={r => this.$searchResults = $(r)} className={css.searchResults}>
							{this.renderSearchResults()}
					</div>
				</div>

				{panel.part !== 'variables' || impliedAxes.length === 0
				 ? null
				 : <button key="implied-axes-button"
				           className={classNames(css.showImpliedAxes, "ui labelled button")}
				           onClick={panel.toggleShowImpliedAxes}>
					 <label>{impliedAxesTitle}</label>
					 <br/>
					 <a>{showImpliedAxes ?
					     i18n.intl.formatMessage({defaultMessage: 'Hide Them', description: "[AccordionPanelComponent] a trigger for hide unavailable items"}) :
					     i18n.intl.formatMessage({defaultMessage: 'Show Them', description: "[AccordionPanelComponent] a trigger for show unavailable items"})}</a>
				 </button>
				}
			</li>);
	}

    $accordionContainer: JQuery;

    node: HTMLElement;
    $node: JQuery;
    $searchResults: JQuery;
    _lastSortOrder;
	_toDispose: Function[] = [];

    componentDidMount() {
		const {props: {panel}, $accordionContainer, $searchResults} = this;

		this.node       = ReactDOM.findDOMNode(this) as HTMLElement;
		panel.component = this;
		this.$node      = $(this.node);
		this._lastSortOrder = this.props.panel.sortOrder;

	    this._toDispose.push(autorun(() => {
		    if (this.props.panel.sortOrder !== this._lastSortOrder) {
				this._lastSortOrder = this.props.panel.sortOrder;
			    this.disableAllAnimations = true;
		    }
	    }));

		this.hookReactions();

		// Don't auto-expand the first accordion (David feedback)
		// const {panel} = this.props;
		//
		// if (panel.part === 'variables' && panel.index === 0) {
		// 	this.onSelectNextAccordion(-1);
		// }

		// if (panel.part === 'variables' && panel.query.variables.hasMultipleVariableClauses) {
		// 	this.$node.css('min-width', this.node.getBoundingClientRect().width);
		//
		// 	reaction(() => panel.isDeleting, (isDeleting: boolean) => {
		// 		if (isDeleting) {
		// 			this.$node.css('min-width', '')
		// 		}
		// 	})
		// }
		// else {
		// 	this.$node.css('min-width', '');
		// }
	}

    hookReactions = () => {
		const {_toDispose, props: {panel}, $accordionContainer, $searchResults} = this;
		_toDispose.push(reaction(() => panel.searchModel.selectedResult, (result: AxisCoordinateSearchResultModel) => {
			if (result) {
				//console.log(`Selected result:`, result)
				const acc = panel.accordionByAxisId(result.axis.id);

				if (result.coord) {
					const accordionValue = acc.values.find(v => v.coordinate.id === result.coord.id);

					acc.expanded = true;
					acc.component.focusAccordionValue(accordionValue, true);

					if (accordionValue.available) {
						if (acc.areAllAvailableSelected) {
							acc.selectValues("Only", [accordionValue])
						}
						else if (!accordionValue.selected) {
							acc.selectValues("With", [accordionValue]);
						}
					}
				}
				else {
					acc.component.focusAccordionValue(null, true);
				}
			}
		}, {name: `Axis/Coordinate search result selected`, delay: 100}))  // Make sure to delay as the accordion isn't currently visible or scrollable

		/*
		_toDispose.push(reaction(() => panel.searchModel.isSearching, isSearching => {
			if (isSearching) {
				const width = $accordionContainer.width();
				$searchResults.css('minWidth', width).css('maxWidth', width);
			}
			else {
				//$searchResults.css('minWidth', 0).css('maxWidth', 0);
			}
		}, {name: `When searching begins, make sure that the min-width of the search div is the same as the accordion panel`}));*/
	}

    componentWillUnmount() {
		this.disposeReactions();
	}

    disposeReactions = () => {
		this._toDispose.forEach(f => f());
	}

    componentDidUpdate(oldProps: MyProps) {
		const {panel} = this.props;

		if (panel.sortOrder !== oldProps.panel.sortOrder) {
			this.disableAllAnimations = false;
		}

		if (oldProps.panel != this.props.panel) {
			this.disposeReactions();
			this.hookReactions()
		}

		// if (panel.part === 'variables' && !panel.isDeleting && panel.query.variables.hasMultipleVariableClauses) {
		// 	this.$node.css('min-width', this.node.getBoundingClientRect().width);
		// }
		// else {
		// 	this.$node.css('min-width', '');
		// }
	}

    //accordionComponentById: {[axisId: number]: IAccordionComponent} = {};

    static defaultProps = {
		extraToolbarPlaceholder: i18n.common.MESSAGE.SEARCHING
	}

    _focusedAccordionId: number;

    private _followScrollInterval = null;

    onStartAnimatingAccordionMoves = (childElements: AccordionComponent[], domNodes: Node[]) => {
		// const {_focusedAccordion, accordionControllers} = this;
		// if (_focusedAccordion && this._followScrollInterval == null) {
		//     this._followScrollInterval = setInterval(() => accordionControllers[_focusedAccordion.id].scrollToFocusedItem(500), 500);
		// }
	}

    onFinishAnimatingAccordionMoves = (childElements: AccordionComponent[], domNodes: Node[]) => {
		// const {_focusedAccordionId, _followScrollInterval} = this;
		// if (_followScrollInterval != null) {
		// 	clearInterval(this._followScrollInterval);
		// 	this._followScrollInterval = null;
		// }
		//
		// if (_focusedAccordionId != null) {
		// 	const accordionComponent = this.props.panel.accordionByAxisId(_focusedAccordionId).component;
		// 	accordionComponent.scrollToFocusedItem();
		// 	accordionComponent.attractUsersAttention();
		// }
	}

    /**
	 * Unhighlight every accordion but the one that's active in the panel
	 * @param accordion
	 */
    @action onAccordionHighlighted = (accordion: Accordion) => {
		if (this._focusedAccordionId !== accordion.id) {
			this._focusedAccordionId = accordion.id;
			this.props.panel.sortedAccordions.filter(acc => acc !== accordion && acc.component).forEach(acc => acc.component.unfocusAndClearSelection());
		}
	}

    @computed get focusedAccordion() {
		const {_focusedAccordionId: id, props: {panel}} = this;

		return id == null ? null : panel.sortedAccordions.find(acc => acc.id === id);

	}

    onSelectAccordion = (index: number, expand?: boolean) => {
		const {focusedAccordion, props: {panel: {sortedAccordions}}} = this;
		const acc                                                    = sortedAccordions[index];

		runInAction(() => {
			if (focusedAccordion && focusedAccordion.component) {
				focusedAccordion.component.unfocusAndClearSelection();
			}

			this._focusedAccordionId = acc.axis.id
			if (acc.component) { acc.component.focusedIndex = 0; }

			if (expand) { acc.expanded = true; }
		})
	}

    @action onSelectNextAccordion = (index: number, select?: 'first' | 'last') => {
		const {panel: {clause: {showImpliedAxes}, sortedAccordions}} = this.props;
		let accordion                                                = sortedAccordions[index];

		if (accordion) {
			accordion.component.unfocusAndClearSelection();
		}

		while (true) {
			index = (index + 1 === sortedAccordions.length) ? 0 : index + 1;
			if (this.shouldRenderAccordion(sortedAccordions[index])) {
				break;
			}
		}

		accordion = sortedAccordions[index];

		this._focusedAccordionId = accordion.axis.id
		accordion.component.focusAccordionValue("first");
	}

    @action onSelectPreviousAccordion = (index: number, select?: 'first' | 'last') => {
		const {panel: {clause: {showImpliedAxes}, sortedAccordions}} = this.props;
		const currentAccordion                                       = sortedAccordions[index];

		if (currentAccordion) {
			currentAccordion.component.unfocusAndClearSelection();
		}

		while (true) {
			index = index - 1 < 0 ? sortedAccordions.length - 1 : index - 1;
			if (this.shouldRenderAccordion(sortedAccordions[index])) {
				break;
			}
		}
		sortedAccordions[index].component.focusAccordionValue(select);
	}
}