import {
	PivotTable,
	ScrollDirection
} from "../index";
import {autorun, runInAction} from 'mobx';

export class PivotScrollHandler {
	constructor(private pivot: PivotTable) {
		this.$detailsGridElement = $(pivot.pivotParts.details.grid.hostElement);

		this.updateScrollContainers();

		// this.pivot.details.grid.scrollPositionChanged.addHandler(() => {
		//     // Note: this timeout is REQUIRED - in very large tables, FlexGrid appears to drop messages and
		//     // we might end up not getting the final scroll position callback.
		//     window.setTimeout(() => {
		//         this.onScrollPositionChanged()
		//     }, 1);
		// });

		this.syncPivotTableScrolling();

		this._toDispose.push(autorun(() => {
			this.tryFetchScrollbarTooltips();
		}))
	}

	destroy() {
		this._toDispose.forEach(f => f());
		this.scrollContainers = null;
	}

	private _toDispose = [];
	private $detailsGridElement: JQuery;

	private get $pivot(): JQuery {
		return this.pivot.$pivot;
	}

	updateScrollContainers = () => {
		const {pivot} = this;

		this.scrollContainers = {
			details: this.$detailsGridElement.find("div[wj-part=root]").get(0),
			columns: pivot.pivotParts.columns.grid ? $(pivot.pivotParts.columns.grid.hostElement).find("div[wj-part=root]").get(0) : null,
			rows:    pivot.pivotParts.rows.grid ? $(pivot.pivotParts.rows.grid.hostElement).find("div[wj-part=root]").get(0) : null
		}
	}

	scrollContainers: {rows: HTMLElement, columns: HTMLElement, details: HTMLElement};

	ignoreNextScrollTipChange = false;

	syncPivotTableScrolling = () => {
		// Sync the details table scroll with the axis tables
		const {details, rows, columns} = this.scrollContainers;

		details.onscroll = this.onDetailsTableScroll_SyncPivotParts;

		if (columns) {
			columns.onscroll = this.onColumnTableScroll_SyncPivotParts;
		}

		if (rows) {
			rows.onscroll = (e) => this.onRowTableScroll_SyncPivotParts();
		}
	}

	_columnsScrollingFromDetails = false;
	_rowsScrollingFromDetails    = false;

	dispatchScroll = (element) => {
		// Dispatch scroll event so the scroll can be handled synchronously. Fixes a race condition where FlexGrid reverses our position change with a cached position WEB-1381. Also fixes
		// an issue where the row/column headers flash during scroll because they aren't in sync with the detail's part scrolling WEB-468
		let e = document.createEvent("UIEvents");
		(e as any).initUIEvent("scroll", true, true, window, 1);
		element.dispatchEvent(e);
	}

	onDetailsTableScroll_SyncPivotParts = () => {
		const {pivot, scrollContainers: {details, rows, columns}}= this;

		let changed = false;

		if (columns && columns.scrollLeft !== details.scrollLeft) {
			//console.log(`details -> ${details.scrollLeft}, columns ${columns.scrollLeft}`)
			this._columnsScrollingFromDetails = true;
			columns.scrollLeft                = details.scrollLeft;
			this.dispatchScroll(columns);
			changed                           = true;

			//
			// const {scrollPosition} = pivot.columns.grid;
			// // scrollPosition.x = -details.scrollLeft;
			// // pivot.columns.grid.scrollPosition = scrollPosition;
			// pivot.columns.grid.scrollPosition = new wijmo.Point(-details.scrollLeft, scrollPosition.y);
			// console.log(`details -> ${details.scrollLeft}, columns ${columns.scrollLeft}`)
		}

		if (rows && rows.scrollTop !== details.scrollTop) {
			this._rowsScrollingFromDetails = true;
			rows.scrollTop                 = details.scrollTop;
			this.dispatchScroll(rows);

			// const {scrollPosition} = pivot.rows.grid;
			// scrollPosition.y = -details.scrollTop;
			// pivot.rows.grid.scrollPosition = scrollPosition;
			changed = true;
		}

		// runInAction: Update pivot due to scrolling
		runInAction(() => {
			if (changed) {
				const scrollPosition = pivot.pivotParts.details.grid.scrollPosition;

				let previousScrollPosition = pivot.scrollPosition;
				if (previousScrollPosition == null) { previousScrollPosition = _.clone(scrollPosition)}

				//console.log(`Scroll Position (x,y): (${scrollPosition.x}, ${scrollPosition.y} - View Range:  - Rows:  ${viewRange.topRow}-${viewRange.bottomRow} - Columns:  ${viewRange.leftCol}-${viewRange.rightCol}`);

				// Update our scroll tooltip
				if (!this.ignoreNextScrollTipChange) {
					// Which way are we scrolling?  Show relevant tooltips

					const scrollDirection = (scrollPosition.x !== previousScrollPosition.x ? ScrollDirection.horizontal : ScrollDirection.none)    // ScrollDirection is a flags enum so we can be scrolling
						| (scrollPosition.y !== previousScrollPosition.y ? ScrollDirection.vertical : ScrollDirection.none);   // BOTH horizontally and vertically

					pivot.scrollDirection = scrollDirection;
					pivot.scrollPosition = scrollPosition;

					if (scrollDirection !== ScrollDirection.none) {
						this.eventuallyHideScrolltips();
					}
				}
				this.ignoreNextScrollTipChange = false;

				pivot.setViewRange(pivot.detailCellsGrid.viewRange);
			}
		})
	}

	_clearScrollTipsTimeout;

	/**
	 * If the user stops scrolling, hide the tooltip after a suitable delay
	 */
	eventuallyHideScrolltips = () => {
		if (this._clearScrollTipsTimeout) {
			clearTimeout(this._clearScrollTipsTimeout);
		}

		this._clearScrollTipsTimeout = setTimeout(() => this.pivot.scrollDirection = ScrollDirection.none, this.pivot.props.hideScrollTooltipsDelay);
	}

	onColumnTableScroll_SyncPivotParts = () => {
		const {details, columns} = this.scrollContainers;

		if (this._columnsScrollingFromDetails) {
			this._columnsScrollingFromDetails = false;
		}
		else if (columns.scrollLeft !== details.scrollLeft) {
			details.scrollLeft = columns.scrollLeft;
			this.onColumnTableScroll_SyncPivotParts();

			// const {scrollPosition} = pivot.details.grid;
			// scrollPosition.x = -columns.scrollLeft;
			// pivot.details.grid.scrollPosition = scrollPosition;
		}
	};

	onRowTableScroll_SyncPivotParts = (lastScrollDiff?:number) => {
		const {details, rows} = this.scrollContainers;

		if (this._rowsScrollingFromDetails) {
			this._rowsScrollingFromDetails = false;
		}
		else if (rows.scrollTop !== details.scrollTop) {
			const scrollDiff = rows.scrollTop - details.scrollTop;
			details.scrollTop = rows.scrollTop;
			if (lastScrollDiff === null || scrollDiff != lastScrollDiff) {
				this.onRowTableScroll_SyncPivotParts(scrollDiff)
			}
			// const {scrollPosition} = pivot.details.grid;
			// scrollPosition.y = -rows.scrollTop;
			// pivot.details.grid.scrollPosition = scrollPosition;
		}
	};

	lastSample = {rows: 0, columns: 0};

	tryFetchScrollbarTooltips = async() => {
		const {pivot, pivot: {viewRange, queryResult, queryResult: {pivotMetadata}}} = this;

		if (!viewRange) { return }

		const scrollContainer = this.scrollContainers.details;

		// console.log(`scrollHeight: ${scrollContainer.scrollHeight}, scrollWidth: ${scrollContainer.scrollWidth}`);

		// const rows = Math.round(pivotMetadata.rows / detailViewRange.rowSpan);
		// const columns = Math.round(pivotMetadata.columns / detailViewRange.columnSpan);

		// Calculate the resolution of our scrolltips.  The more tips we have the more often we can update the UI and the more fluid it looks
		const rowSamples    = Math.min(pivotMetadata.rows, scrollContainer.clientHeight);
		const columnSamples = Math.min(pivotMetadata.columns, scrollContainer.clientWidth);

		if (this.lastSample.rows !== rowSamples || columnSamples !== this.lastSample.columns) {
			// const rowsVisible = Math.round(scrollContainer.scrollHeight / actualCells.scrollHeight  * pivotMetadata.rows);
			// const columnsVisible = Math.round(scrollContainer.scrollWidth / actualCells.scrollWidth * pivotMetadata.columns);

			//console.log(`rowSamples: ${rowSamples},  columnSamples ${columnSamples}, rowsVisible ${detailViewRange.rowSpan}, columnsVisible ${detailViewRange.columnSpan}`)

			this.lastSample           = {rows: rowSamples, columns: columnSamples};
			// const density = 1;
			this.pivot.scrollTooltips = await queryResult.pivot.loadTooltips({
				rowSamples:     rowSamples,
				columnSamples:  columnSamples,
				rowsVisible:    viewRange.rowSpan,
				columnsVisible: viewRange.columnSpan,
				statisticspivot: queryResult.showStatisticsPivot
			});

		}
		return this.pivot.scrollTooltips;
	}

	// TODO - restore this on mouse up with a 200ms delay
	//this.pivot.setState({scrollDirection: ScrollDirection.none})
}
