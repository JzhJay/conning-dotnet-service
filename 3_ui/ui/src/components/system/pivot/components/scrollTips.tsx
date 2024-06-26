import * as css from './scrollTips.css';
import * as pivotTableCss from './../pivotTable.css';

import {api} from 'stores';
import type { PivotPart, CoordinateTooltip, Axis} from 'stores/queryResult';
import { QueryResult } from 'stores/queryResult';
import {ResizeSensorComponent} from 'components';
import {
	PivotTable,
	ScrollDirection
} from "../index";
import {observer} from 'mobx-react';
import { observable, computed, autorun, makeObservable } from 'mobx';

interface MyProps {
	pivot:PivotTable;
	queryResult: QueryResult;
	valuesColumnLimit?: number;
	valuesRowLimit?: number;
	extraMargin?: number;
	style?: React.CSSProperties
}

@observer
export class ScrollTips extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

        makeObservable(this);

		this._toDispose.push(autorun(() => {
			const {pivot: { pivotParts: { details}}} = this.props;
			if (details != null && details.grid != null) {
				// Position our tooltips
				this.$scrollContainer = $(details.grid.hostElement).find("div[wj-part=root]");
				this.scrollContainer  = this.$scrollContainer.get(0);
			}
		}))
    }

    @computed get showHorizontal() { return (this.props.pivot.scrollDirection & ScrollDirection.horizontal) === ScrollDirection.horizontal }
    @computed get showVertical() { return (this.props.pivot.scrollDirection & ScrollDirection.vertical) === ScrollDirection.vertical }

    @observable animate = false;
    _toDispose = [];

    static defaultProps = {
		valuesColumnLimit: 20, // If we have less than this, don't bother showing the scrolltips
		valuesRowLimit:    50,
		extraMargin:       2
	}

    componentDidMount() {
		this.$node         = $(ReactDOM.findDOMNode(this));
		this.$pivotElement = this.$node.parent(`.${pivotTableCss.pivotTable}`);
		this.pivotElement  = this.$pivotElement.get(0);

		this.onResize();
	}

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

    $node: JQuery;
    $scrollContainer: JQuery;
    scrollContainer: HTMLElement;
    pivotElement: HTMLElement;
    $pivotElement: JQuery;


    componentDidUpdate(previousProps: MyProps) {
		this.repositionTooltipBoxes();
	}

    onResize = () => {
		this.repositionTooltipBoxes()
	}

    repositionTooltipBoxes = () => {
		const {scrollContainer,  props: {extraMargin, queryResult, pivot: {scrollTooltips, scrollPosition}}} = this;

		if (!this.scrollContainer || !queryResult || !scrollTooltips) {
			return;
		}

		// Center the tooltips based on their contents
		const {clientWidth, clientHeight} = this.scrollContainer;
		const scrollBounds                = this.scrollContainer.getBoundingClientRect();
		const pivotScrollBounds           = this.pivotElement.getBoundingClientRect();
		const offset                      = this.$node.offset();
		const $column1                    = this.$pivotElement.find(`.${pivotTableCss.row2} > .${pivotTableCss.column1}`)

		const $ver = this.$node.children(`.${pivotTableCss.vertical}`);
		const $hor = this.$node.children(`.${pivotTableCss.horizontal}`);

		const horizontalScrollBarOutsidePivot = pivotScrollBounds.bottom - scrollBounds.bottom > $hor.outerHeight();

		const hor = {
			left: scrollBounds.left - pivotScrollBounds.left + clientWidth / 2 - $hor.outerWidth() / 2, // - $column1.width(),
			top:  horizontalScrollBarOutsidePivot
				      // Put the scrolltips outside of the pivot
				      ? scrollBounds.bottom - offset.top + extraMargin
				      // Put the scrolltips inside the pivot
				      : scrollBounds.bottom - offset.top - $hor.outerHeight() - api.site.horizontalScrollbarHeight
		}

		const overflowX = hor.left + $hor.outerWidth() + api.site.verticalScrollbarWidth - pivotScrollBounds.right;

		if (overflowX > 0) {
			hor.left = hor.left - overflowX;
		}

		$hor.css('top', hor.top);
		$hor.css('left', hor.left);
		if (horizontalScrollBarOutsidePivot) { $hor.removeClass(css.overPivot); } else { $hor.addClass(css.overPivot);}

		const verticalScrollBarOutsidePivot = pivotScrollBounds.right - scrollBounds.right > $ver.outerWidth();

		const ver = {
			// For the vertical scroll tooltip, place it to the RIGHT of the scrollbar if we have enough space within our container
			left: verticalScrollBarOutsidePivot
				      ? scrollBounds.right - offset.left + extraMargin
				      : scrollBounds.right - $ver.outerWidth() - api.site.verticalScrollbarWidth - offset.left,
			top:  scrollBounds.top - pivotScrollBounds.top + clientHeight / 2 - $ver.outerHeight() / 2
		}
		$ver.css('top', ver.top);
		$ver.css('left', ver.left);
		if (verticalScrollBarOutsidePivot) { $ver.removeClass(css.overPivot); } else { $ver.addClass(css.overPivot);}

		//console.log(hor, ver);
	}

    formatAxisValueTooltip = (part: PivotPart, axisValueIDs: Array<number>) => {
		let result          = "";
		const {queryResult: {pivotMetadata: {columnAxes, rowAxes, axes}}} = this.props;
		for (let i = 0; i < axisValueIDs.length; i++) {
			const axis    = axes[part === 'columns' ? columnAxes[i] : rowAxes[i]];
			let axisValue = axis.groupMembers[axisValueIDs[i]] as any;
			if (axisValue.label) {
				axisValue = axisValue.label
			}

			result += axis.groupName.label + ' ' + axisValue;
		}
		return result;
	}

    render() {
		let rowTooltip: CoordinateTooltip, colTooltip: CoordinateTooltip;
		const {showHorizontal, showVertical, scrollContainer,
			props: {style, queryResult, queryResult: {pivotMetadata}, pivot: {cache, scrollPosition, scrollTooltips, flexGrids: { ['details']: detailCellsGrid }}} }                = this;

		if (scrollPosition) {
			const {x, y} = scrollPosition;
		}

		const isEmpty = !scrollContainer || !scrollTooltips;

		if (!isEmpty && detailCellsGrid != null) {
			const {topRow, bottomRow, leftCol, rightCol} = detailCellsGrid.viewRange;

			// If we have the axis value data on-hand use it
			const hasData = cache.getCell(topRow, leftCol, false) != undefined && cache.getCell(topRow, rightCol, false) != undefined && cache.getCell(bottomRow, leftCol, false) != undefined && cache.getCell(bottomRow, rightCol, false) != undefined

			try {
				// Do we have the data onhand?
				if (hasData) {
					colTooltip = {
						begin: _.map(pivotMetadata.columnAxes, (id, index) => cache.getCell(topRow, leftCol).colCoords[index]).map(v => v.coordinate),
						end:   _.map(pivotMetadata.columnAxes, (id, index) => cache.getCell(topRow, rightCol).colCoords[index]).map(v => v.coordinate)
					};
					rowTooltip = {
						begin: _.map(pivotMetadata.rowAxes, (id, index) => cache.getCell(topRow, leftCol).rowCoords[index]).map(v => v.coordinate),
						end:   _.map(pivotMetadata.rowAxes, (id, index) => cache.getCell(bottomRow, leftCol).rowCoords[index]).map(v => v.coordinate)
					};
				}
				else {
					// Get the data from our tooltip list

					if (pivotMetadata.columns > 1) {
						let colTooltipIndex;
						if (Math.round(this.scrollContainer.clientWidth - (this.scrollContainer.clientWidth / this.scrollContainer.scrollWidth)) > pivotMetadata.columns) {
							colTooltipIndex = leftCol;
						}
						else {
							colTooltipIndex = this.scrollContainer.scrollLeft / this.scrollContainer.scrollWidth * this.scrollContainer.clientWidth;
						}
						//console.log(`colTooltipIndex:  ${colTooltipIndex} - Cols:  ${leftCol} - ${rightCol} - ColumnSpan:  ${columnSpan}`)
						colTooltip = scrollTooltips.columnTooltips[Math.trunc(colTooltipIndex)];
					}

					if (pivotMetadata.rows > 1) {
						let rowTooltipIndex;
						if (Math.round(this.scrollContainer.clientHeight - (this.scrollContainer.clientHeight / this.scrollContainer.scrollHeight)) > pivotMetadata.rows) {
							rowTooltipIndex = topRow;
						}
						else {
							rowTooltipIndex = this.scrollContainer.scrollTop / this.scrollContainer.scrollHeight * this.scrollContainer.clientHeight;
						}
						//console.log(`rowIndex:  ${rowTooltipIndex} - Rows:  ${topRow} - ${bottomRow} - Rowspan:  ${rowSpan}`)
						rowTooltip = scrollTooltips.rowTooltips[Math.trunc(rowTooltipIndex)];
					}

				}
			}
			catch (e) {
				console.error(e);
				//debugger;
				//throw e;
			}
		}

		return (
			<div className={classNames(css.scrollTips, {empty: isEmpty, showing: showHorizontal || showVertical}) } style={style}>
				<ResizeSensorComponent parentDepth={4} onResize={this.onResize}/>
				{colTooltip != null
					? <AxisTooltipTable className={classNames(pivotTableCss.horizontal, {visible: showHorizontal}) }
					                    tooltip={colTooltip}
					                    part='columns'
					                    axes={pivotMetadata.columnAxes.map(id => pivotMetadata.axes[id])}
										queryResult={queryResult}/>
					: null}

				{rowTooltip
					? <AxisTooltipTable className={classNames(pivotTableCss.vertical, {visible: showVertical}) }
					                    tooltip={rowTooltip}
					                    part='rows'
					                    axes={pivotMetadata.rowAxes.map(id => pivotMetadata.axes[id])}
					                    queryResult={queryResult}/>
					: null}
			</div>)
	}
}

interface AxisTooltipTableProps {
	className?: string,
	queryResult: QueryResult,
	tooltip: CoordinateTooltip,
	axes: Axis[];
	part: PivotPart;
	axesLimit?: number;
}

@observer
class AxisTooltipTable extends React.Component<AxisTooltipTableProps, {}> {
	static defaultProps = {
		axesLimit: 50
	}

	render() {
		const {tooltip, axes, className} = this.props;

		return (
			<div className={className}>
				<table>
					<thead>
					<tr>
						<th key="ph"/>
						{ tooltip == null
							? null
							: _.map(_.take(axes, this.props.axesLimit), axis => <th key={axis.id}>{axis.groupName.label}</th>) }
					</tr>
					</thead>
					{tooltip == null
						? null
						:
                     <tbody>
					 <tr className="begin">
						 <td key="from">From:</td>
						 {_.map(_.take(tooltip.begin, this.props.axesLimit), (id, index) =>
							 <td key={index}>
								 {PivotTable.formatAxisValue(axes[index].groupMembers[id]) }
							 </td>) }
					 </tr>
					 <tr className="end">
						 <td key="to">To:</td>
						 {_.map(_.take(tooltip.end, this.props.axesLimit), (id, index) =>
							 <td key={index}>
								 {PivotTable.formatAxisValue(axes[index].groupMembers[id]) }
							 </td>) }
					 </tr>
					 </tbody>
					}
				</table>
			</div>);
	}
}
