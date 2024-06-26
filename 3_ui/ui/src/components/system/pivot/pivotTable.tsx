/// <reference path="../../../lib/wijmo/controls/wijmo.grid.d.ts" />
import {Fragment} from 'react';
import * as React from 'react';
import type {SelectOperation, PivotTooltips, PivotPart, PivotMetadata, PivotArrangement} from 'stores/queryResult';
import {
	DataWindow,
	GroupMember,
	PivotCoordinateCell,
	PivotDetailCell,
	DataFormat,
	CTEOptions, PivotUserOptions
} from 'stores/queryResult';
import {api, utility, appIcons, Query, QueryDescriptor, i18n} from 'stores';
import {downloadFile} from '../../../utility';
import {CtesToolbarItem} from '../common/Ctes';
import {PercentilesToolbarItem} from '../common/Percentiles';
import {Toolbar} from '../toolbar/Toolbar';
import { PivotDragAndDropHelper } from "./internal/pivotDragAndDrop";
import {StatisticsMenu} from './internal/StatisticsMenu';
import * as css from './pivotTable.css';
import { PivotContextMenu, PivotScrollHandler, DetailCellsTable, PivotCorner, ColumnAxesTable, RowAxesTable, ScrollTips, ScrollDirection } from './index';
import {LoadingIndicator, AutoResizeComponent, bp, IconButton} from 'components/index';
import {Observer, observer } from 'mobx-react';
import { QueryResult } from 'stores/queryResult';
import {
    computed,
    observable,
    autorun,
    reaction,
    action,
    runInAction,
    comparer,
    makeObservable,
} from 'mobx';
import type { ViewRange } from './internal/pivotInterfaces';
import { CachedMatrix } from './cache/cachedMatrix';
import {AnchorButton, Tooltip, Position, Button, Popover} from '@blueprintjs/core';
import { PivotClipboard } from "./internal/PivotClipboard";
import { AppIcon } from "../../widgets/AppIcon";
import * as PropTypes from 'prop-types';
import ToggleSensitivityToolbarItem from '../highcharts/toolbar/toolbar-items/toggleSensitivity';
import * as highchartCss from '../highcharts/toolbar/highchartsToolbar.css';
import Splitter from 'm-react-splitters';
import {defineMessages, FormattedMessage} from 'react-intl';
import {queryMessages} from './../../../stores/i18n/queryMessages';

export type { PivotTablePartProps } from './internal/PivotTablePartProps';
export type { DragAxisPayload } from './dragAxisPayload';
export { dnd_Axis } from './dragAxisPayload';

interface MyProps {
	queryResult: QueryResult;
	query?: Query | QueryDescriptor;

	additionalMenuItems?: JSX.Element[];
	isReadOnly?: boolean;
	arrangementChanging?: (arrangement: PivotArrangement) => void;
	arrangementChanged?: (metadata: PivotMetadata) => void;
	onLoaded?: (pivotTable: PivotTable) => void;

	className?: string;
	showToolbar?: boolean;
	shouldRenderFullHeight?: boolean;

	hideScrollTooltipsDelay?: number;

	userOptions?: PivotUserOptions;
	onUserOptionsUpdated?: (userOptions: PivotUserOptions) => void;
}

const i18nMessages = defineMessages({
	pivotTable: {
		defaultMessage: 'Pivot Table',
		description: '[Query] Title for Pivot Table'
	},
	rearranging: {
		defaultMessage: 'Rearranging...',
		description: `[Query] Display text for rearranging pivot table's result`
	},
	loadingPivotTable: {
		defaultMessage: 'Loading Pivot Table...',
		description: '[Query] Display text for loading Pivot Table'
	},
	statisticTooltip: {
		defaultMessage: 'Show Statistics',
		description: '[Query] Tooltip for show statistics button'
	},
	statisticTooltipWithSensitivity: {
		defaultMessage: 'Statistics is on when using sensitivity',
		description: '[Query] Tooltip for show statistics button when sensitivity is enabled'
	},
	selectStatistics: {
		defaultMessage: 'Select Statistics',
		description: '[Query] Function name for Select Statistics'
	},
	axisNotFoundError: {
		defaultMessage: `Unable to find a axis value - {coordinateID} - for {part} axis '{axisGroupNameLabel}'`,
		description: '[Query] Display error message for axis value is not found'
	}
});

/**
 * Pivot Table React Component
 *
 * Binds to a guid and talks to the Julia REST API for pivot data
 *
 */
@observer
export class PivotTable extends AutoResizeComponent<MyProps, {}> {
	static DEFAULT_LINE_HEIGHT = 24;
	static MINIMUM_CORNER_WIDTH = 45;
	static SPLITTER_HANDLER_WIDTH = 27;
	static ROW_COLUMN_LIMITS = 1000000;

    cache: CachedMatrix;
    @observable isInitializeFirstRender = false;
	@observable cornerWidth         = 0;
    @observable shouldCapHeight      = false;
    @observable scrollPosition: wijmo.Point;
    @observable scrollDirection      = ScrollDirection.none;
    @observable scrollTooltips: PivotTooltips;
    @observable isInitialDataLoad    = true;
    @observable isSelecting          = false;
    @observable isPivotFullyRendered = false;
	@observable isShowDataLimitsCover = false;
    dragAndDrop: PivotDragAndDropHelper;
    _toDispose                       = [];
    _cacheReaction: () => void;

	constructor(props, states) {
		super(props, states);

        makeObservable(this);

		this._handleDataChange();
    }

    renderHotkeys() {
		const hotkeys: bp.HotkeyConfig[] = [
			{
				global: true,
				combo: "mod + c",
				group: "Selection",
				label: "Copy Selection",
				preventDefault: true,
				onKeyDown: (e: KeyboardEvent) => this.clipboard.copy()
			},
			{
				global: true,
				combo: "mod + shift + c",
				group: "Selection",
				label: "Copy Selection (With Axes)",
				preventDefault: true,
				onKeyDown: (e: KeyboardEvent) => this.clipboard.copy(true)
			}
		]

		return <bp.HotkeysTarget2 hotkeys={hotkeys}>{({ handleKeyDown, handleKeyUp }) => <Fragment />}</bp.HotkeysTarget2>;
	}

    private _handleDataChange = () => {
		this._toDispose.push(reaction(() => this.isRearranging || this.isUpdatingStatistics, (isChanging) => {
			// Reset the pivot on the start of a rearrangment or statistics updating
			if (isChanging) {
				this.reset();
			}
		}, { equals: comparer.structural, name: 'Arrangement or Statistics changed' }));

		const { cache } = this;

		this._toDispose.push(autorun(() => {
			// Create the cache once the pivotMetadata is available.
			const { queryResult, cache, _cacheReaction, queryResult: { pivotMetadata } } = this;
			if (pivotMetadata && !this.isUpdatingStatistics) {
				const { columnAxes, rowAxes, columns, rows } = pivotMetadata;

				this.isShowDataLimitsCover = rows >= PivotTable.ROW_COLUMN_LIMITS || columns >= PivotTable.ROW_COLUMN_LIMITS;
				if (!cache) {
					this.cache = new CachedMatrix((arg) => this.queryResult.pivot.getData({...arg, statisticspivot: queryResult.showStatisticsPivot}), pivotMetadata.rows, pivotMetadata.columns, 6, 6, 6, 4);

					this._cacheReaction = reaction(() => this.cache.isCachedBlocked, (isCacheBlocked) => {
						// runInAction: Update pivot table component from cache response
						runInAction(() => {
							if (!isCacheBlocked) {
								if (this.isInitialDataLoad) {
									// Setup initial windows. we wait till we have data so we can size the cells appropriately based on the data
									const pivotMetadata       = this.queryResult.pivotMetadata;
									this.windows.detailWindow = new DataWindow({ x: 0, columns: Math.min(20, pivotMetadata.columns), y: 0, rows: Math.min(100, pivotMetadata.rows) })
									this.windows.columnWindow = new DataWindow({ x: 0, columns: this.windows.detailWindow.columns, y: 0, rows: pivotMetadata.columnAxes.length })
									this.windows.rowWindow    = new DataWindow({ x: 0, columns: pivotMetadata.rowAxes.length, y: 0, rows: this.windows.detailWindow.rows })
									this.isInitialDataLoad    = false;
								}

								const forceRefresh = (window) => {
									const { x, y, columns, rows } = window;
									window                        = new DataWindow({ x, y, columns, rows })
									window.invalidated            = true;
									return window;
								}

								// If there was a cache miss when fetching data the window might contain empty cells. Refresh/invalidate the window so it can be populated with the new cache data
								// Note: Assigning a new window will trigger the mobX updates, modify the window does not, even though invalidated is an observable.
								this.windows.detailWindow = forceRefresh(this.windows.detailWindow)
								this.windows.columnWindow = forceRefresh(this.windows.columnWindow)
								this.windows.rowWindow    = forceRefresh(this.windows.rowWindow)

								// The grid instance is not guaranteed to have rendered yet
								const { pivotParts: { details }, cache } = this;
								const checkViewCellsAfterRender          = setInterval(() => {
									if (details != null && details.grid != null) {
										clearInterval(checkViewCellsAfterRender);
										this.setViewRange(details.grid.viewRange);
									}
								});

								if (this.isSelecting) {
									this.invalidate();
									this.isSelecting = false;
								}
							}
						})
					}, { name: 'Cache block state changed' });

					this.cache.getCell(0, 0); // trigger initial data load
				}
			}
		}))
	}

    @computed
	get isRearranging() {
		return this.queryResult.arrangement.isRearranging
	}

    get isUpdatingStatistics() {
		return this.queryResult.isUpdatingStatistics;
	}

    @computed
	get isLoading() {
		return this.isRearranging || this.isInitialDataLoad || !this.isPivotFullyRendered
	}

    @computed
	get detailCellsGrid() {
		return this.pivotParts.details ? this.pivotParts.details.grid : null
	}

    @computed
	get rowAxesGrid() {
		return this.pivotParts.rows ? this.pivotParts.rows.grid : null
	}

    @computed
	get columnAxesGrid() {
		return this.pivotParts.columns ? this.pivotParts.columns.grid : null
	}

    get queryResult() {
		return this.props.queryResult
	}

    // 	@action afterInitialDataLoad = () => {
    // 		const {pivotParts: parts, cache} = this;
    //
    // 		if (parts.details && parts.details.grid) {
    // 			parts.details.grid.select(-1, -1)
    // 		}
    //
    // 		if (parts.columns && parts.columns.grid) {
    // 			parts.columns.grid.select(-1, -1)
    // 			parts.columns.autosizeColumns();
    // 		}
    //
    // 		if (parts.rows && parts.rows.grid) {
    // 			parts.rows.grid.select(-1, -1)
    // 			parts.rows.autosizeColumns();
    // 		}
    //
    // 		// The grid instance is not guaranteed to have rendered yet
    // 		const checkViewCellsAfterRender = setInterval(() => {
    // 			if (parts.details != null && parts.details.grid != null) {
    // 				clearInterval(checkViewCellsAfterRender);
    // 				cache.expandIfNeeded();
    // 			}
    // 		});
    // 	}
    // }

    /*
	 async rearrange(args: PivotArrangement) {
	 // return new Promise((resolve, reject) => {
	 //
	 // 	const pivot                                  = this.pivot;
	 // 	const {props: {pivotMetadata}, props} = pivot;
	 //
	 // 	const rowAxes    = args.rowAxes || pivotMetadata.rowAxes;
	 // 	const columnAxes = args.columnAxes || pivotMetadata.columnAxes;
	 //
	 // 	// Check for no change.
	 //
	 // 	if (_.isEqual(rowAxes, pivotMetadata.rowAxes) && _.isEqual(columnAxes, pivotMetadata.columnAxes)) {
	 // 		console.debug('Ignoring rearrange - No change in axis order');
	 // 		return reject();
	 // 	}
	 //
	 //
	 // 	console.debug(
	 // 		`pivot.rearrange()`,
	 // 		`from:  (rows: ${pivot.axisIdsToLabels(pivotMetadata.rowAxes)}, columns: ${pivot.axisIdsToLabels(pivotMetadata.columnAxes)})`,
	 // 		` -> to:  (rows: ${pivot.axisIdsToLabels(rowAxes)}, columns: ${pivot.axisIdsToLabels(columnAxes)})`);
	 //
	 // 	// Reject invalid arrangements
	 // 	// Do basic error checking on arrangement and reject it if its invalid
	 // 	if (!_.isEqual(_.sortBy([...rowAxes, ...columnAxes]), this.pivotMetadata.axes.map(a => a.id))) {
	 // 		console.warn('Invalid axis specification - ignored.', _.sortBy([...rowAxes, ...columnAxes]), "!=", this.pivotMetadata.axes.map(a => a.id));
	 // 		return reject();
	 // 	}
	 // 	else {
	 // 		if (pivot.props.arrangementChanging) {
	 // 			pivot.props.arrangementChanging({rowAxes: rowAxes, columnAxes: columnAxes})
	 // 		}
	 //
	 // 		// Replace the local pivotMetadata arrangement
	 // 		// and tell the UI that we're in the midst of a rearrange
	 // 		pivot.setState({
	 // 						   isRearranging:        true,
	 // 						   isLoading: true,
	 // 						   detailCellsWindow:    null,
	 // 						   rowWindow:            null,
	 // 						   columnWindow:         null,
	 //
	 // 						   cornerWidth:       null,
	 // 						   lastSelection:     {},
	 // 						   scrollbarTooltips: null
	 // 					   }, () => {
	 // 			pivot.cache.clear();
	 //
	 // 			api.queryResult.pivot.rearrangeAxes(props.guid, columnAxes, rowAxes).then((metadata) => {
	 // 				pivot.setState({isRearranging: false, isLoading: false}, () => {
	 // 					this.pivot.scrollHandler.updateScrollContainers();
	 // 					if (pivot.props.arrangementChanged) { pivot.props.arrangementChanged(metadata)}
	 // 				})
	 // 			})
	 // 		})
	 // 	}
	 // });
	 }

	 */

    static defaultProps: MyProps = {
		queryResult            : null,
		isReadOnly             : true,
		hideScrollTooltipsDelay: 2000
	}

    static contextTypes = {
		glContainer: PropTypes.any
	}

    scrollHandler: PivotScrollHandler;

    @observable pivotParts: {
		rows?: RowAxesTable;
		columns?: ColumnAxesTable;
		details?: DetailCellsTable;
	} = { rows: null, columns: null, details: null }

    /*
	 The viewRange of the detail cell table.
	 Determines the size of our PivotCache and associated data/tooltips

	 Reasons our view range can change:
	 - Initial Load, first dummy render of details cell table
	 - Scroll
	 - Resize
	 - Zoom
	 */
    @observable.struct private _viewRange: ViewRange;
    get viewRange() {
		return this._viewRange
	}

    updateWindows = _.debounce(
		(range) => {
			const pivotMetadata = this.queryResult.pivotMetadata;

			// Add a buffer, which isn't strictly required but allows for smoother scrolling.
			const cBuffer = (range.columnSpan);
			const rBuffer = (range.rowSpan);
			const y       = Math.max(0, range.row - rBuffer);
			const rows    = Math.min(pivotMetadata.rows - y, (range.row2 - y + 1) + rBuffer);
			const x       = Math.max(0, range.col - cBuffer);
			const columns = Math.min(pivotMetadata.columns - x, (range.col2 - x + 1) + cBuffer);

			// runInAction: Update pivot windows after debounced changes to range
			runInAction(() => {
				this.windows.detailWindow = new DataWindow({ x, columns, y, rows })
	            this.windows.columnWindow = new DataWindow({ x, columns, y: 0, rows: pivotMetadata.columnAxes.length })
	            this.windows.rowWindow    = new DataWindow({ x: 0, columns: pivotMetadata.rowAxes.length, y, rows })
            });
		}, 200, { leading: false }) // Run the LASTMOST call when the debounce triggers

    @observable.shallow windows: { detailWindow?: DataWindow, columnWindow?: DataWindow, rowWindow?: DataWindow } = { detailWindow: null, columnWindow: null, rowWindow: null }
    @action setViewRange                                                                                          = (range: wijmo.grid.CellRange) => {
		this._viewRange = range ? {
			row       : range.row,
			col       : range.col,
			row2      : range.row2,
			col2      : range.col2,
			rowSpan   : range.rowSpan,
			columnSpan: range.columnSpan,
			leftCol   : range.leftCol,
			topRow    : range.topRow,
			bottomRow : range.bottomRow,
			rightCol  : range.rightCol
		} : null

		if (this.queryResult.pivotMetadata) {
			if (range) {
				this.updateWindows(range);
			}
		}
	}

    @action
	reset() {
		this.pivotParts            = { details: null, rows: null, columns: null }
		this.isInitialDataLoad     = true;
		this.windows               = { detailWindow: null, columnWindow: null, rowWindow: null }
		this.isPivotFullyRendered  = false;
		this.hasRunInitialAutosize = false;
		this.cache                 = null;

		this._cacheReaction && this._cacheReaction();

		if (this.scrollHandler) {
			this.scrollHandler.destroy();
		}
		this.scrollHandler = null;

		if (this.dragAndDrop) {
			this.dragAndDrop.destroy();
		}
		this.dragAndDrop = null;

		this.isShowDataLimitsCover = false;
	}

    corner: PivotCorner;
    scrollTips: ScrollTips;
    clipboard: PivotClipboard;

    // We will use this to track who's selection we care about on rearrangement
    //focusedGrid: React.Component<PivotTablePartProps, any>;

    componentDidMount() {
		super.componentDidMount();

		this.startUp();

		this.isInitializeFirstRender = true;
		this.clipboard = new PivotClipboard(this);

		document.addEventListener('copy', this.clipboard.onCopy)
		document.addEventListener('mouseup', this.document_onMouseUp);
		document.addEventListener('visibilitychange', this.document_onVisibilityChange);
	}

    document_onVisibilityChange = (e) => {
		if (document.visibilityState === 'visible' && this.pivotParts.details) {
			setTimeout(() => this.autosizePivotParts('initialRender'), 0);
		}
	}

    document_onMouseUp = (e: MouseEvent) => {
		if (!this.unmounted && this.scrollDirection !== ScrollDirection.none) {
			this.scrollHandler.eventuallyHideScrolltips();
		}
	}

    public $pivot: JQuery;

    unmounted = false;

    @observable contextMenuTarget: PivotPart;

    componentWillUnmount() {
		this.unmounted = true;

		document.removeEventListener('copy', this.clipboard.onCopy);
		document.removeEventListener('mouseup', this.document_onMouseUp);
		document.removeEventListener('visibilitychange', this.document_onVisibilityChange);

		this._toDispose.forEach(f => f());
		this._cacheReaction && this._cacheReaction();

		this._toDispose = null;
		this.reset();
	}

    onResize() {
		if (!this.isLoading && this.pivotParts.details) {
			this.autosizePivotParts('resize');
		}

		this.setViewRange(this.detailCellsGrid != null ? this.detailCellsGrid.viewRange : null);
	}

	splitterPatch = (splitter: any) => {
		splitter && this._toDispose.push(() => {
			window.removeEventListener('resize', splitter.getSize);
			document.removeEventListener('mouseup', splitter.handleMouseUp);
			document.removeEventListener('touchend', splitter.handleMouseUp);
			document.removeEventListener('mousemove', splitter.handleMouseMove);
			document.removeEventListener('touchmove', splitter.handleMouseMove);
		})
	}

    renderDummyData() {
		//this.setState({
		//    status: Status.DummyRender,
		//    detailCells: dummyDetailCells,
		//    colCoords: dummyColCoords,
		//    rowCoords: dummyRowCoords,
		//
		//}, () => this.loadVisibleWindow());
	}

    //node: HTMLDivElement;
    $node: JQuery;

    render() {
		const {
			props: { showToolbar, query, queryResult, queryResult: { pivotMetadata } },
			isSelecting, isRearranging, isUpdatingStatistics, isLoading, isShowDataLimitsCover,
			contextMenuTarget, cornerWidth, scrollBars
		} = this;

		return (
			<div
				onContextMenu={this.onContextMenu}
				className={classNames(
					this.props.className,
					css.pivotTable,
					{
						[css.isSelecting]         : isSelecting,
						[css.allValuesSelected]   : pivotMetadata != null && pivotMetadata.allSelected,
						[css.showLoadingIndicator]: isLoading,
						[css.noRowAxes]           : pivotMetadata != null && pivotMetadata.rowAxes.length === 0,
						'no-column-axes'          : pivotMetadata != null && pivotMetadata.columnAxes.length === 0,
						[css.verticalScrollBar]   : scrollBars.hasVertical,
						[css.horizontalScrollBar] : scrollBars.hasHorizontal
					}
				)}>
				<LoadingIndicator active={!isShowDataLimitsCover && (isLoading || pivotMetadata == null)}>
					{isRearranging
						? i18n.intl.formatMessage(i18nMessages.rearranging)
						:  i18n.intl.formatMessage(i18nMessages.loadingPivotTable)}
				</LoadingIndicator>

				{this.renderHotkeys()}

				{showToolbar && this.renderToolbar()}

				{isShowDataLimitsCover && <div className={css.dataLimitsCover}>
					<bp.Callout intent={"danger"}>
						<FormattedMessage defaultMessage="The pivot table contains over 1 million rows or columns, which may cause it to take a long time to render or even crash the browser tab.
						However, you can still use the toolbar to export the data, rearrange the table, or download the table data."
						description="[Query] Warning message for pivot table data exceed limitation" />
					</bp.Callout>
					<bp.Callout className={css.dataLimitsCoverButtons}>
						<bp.Button onClick={action(() => this.isShowDataLimitsCover = false)} intent={bp.Intent.PRIMARY} minimal>
							<FormattedMessage defaultMessage="Ignore warning and show the table content" description="[Query] Force to show table content if data exceed limiation in pivot table"/>
						</bp.Button>
						<bp.Button onClick={() => this.props.query.navigateTo("query")}>
							<FormattedMessage defaultMessage="Return to Query Specification" description="[Query] Button text for returning query speicification editor from query result" />
						</bp.Button>
					</bp.Callout>
				</div>}

				{!isShowDataLimitsCover && pivotMetadata != null && !isRearranging && !isUpdatingStatistics
					? (<div>
						<Splitter
							className={css.horizontalSplitter}
							position={"horizontal"}
							primaryPaneMaxHeight={'90%'}
							primaryPaneMinHeight={PivotTable.DEFAULT_LINE_HEIGHT}
							dispatchResize={true}
							postPoned={false}
							ref={this.splitterPatch}
						>
							<div key="row-1" className={css.row1}>
								<PivotCorner ref={p => this.corner = p} style={{ width: cornerWidth }}/>
								<ColumnAxesTable
									pivot={this} queryResult={queryResult} isContextMenuTarget={contextMenuTarget == 'columns'}
									getCell={(row, column, enableFetch) => this.getCell('columns', row, column, enableFetch) as PivotCoordinateCell}
									query={query} getCellData={(row, column) => this.getCellData('columns', row, column)}
									onSetComponentInstance={instance => runInAction(() => this.pivotParts.columns = instance)}/>
							</div>
							<Splitter
								className={css.verticalSplitter}
								position={"vertical"}
								primaryPaneMaxWidth={"90%"}
								primaryPaneMinWidth={"100px"}
								dispatchResize={true}
								postPoned={false}
								onDragFinished={() => {
									this.updateCornerWidth();
									$(ReactDOM.findDOMNode(this)).removeClass(css.verticalDragging);
								}}
								ref={this.splitterPatch}
							>
								<RowAxesTable
									pivot={this} queryResult={queryResult} isContextMenuTarget={contextMenuTarget == 'rows'}
									onWheel={(e) => this.onRowTableMouseWheel(e)}
									query={query} getCell={(row, column, enableFetch) => this.getCell('rows', row, column, enableFetch) as PivotCoordinateCell}
									getCellData={(row, column) => this.getCellData('rows', row, column)}
									onSetComponentInstance={instance => runInAction(() => this.pivotParts.rows = instance)}
								/>
								<div className={css.column2}>
									<DetailCellsTable
										pivot={this} queryResult={queryResult} isContextMenuTarget={contextMenuTarget == 'details'}
										query={query} getCell={(row, column, enableFetch) => this.getCell('details', row, column, enableFetch) as PivotDetailCell}
										getCellData={(row, column) => this.getCellData('details', row, column)}
										onSetComponentInstance={instance => runInAction(() => this.pivotParts.details = instance)}/>
								</div>
							</Splitter>

						</Splitter>
						<ScrollTips key="scrolltips" pivot={this} queryResult={queryResult}
						            ref={ref => this.scrollTips = ref}/>
					</div>).props.children
					: null}
			</div>
		)
	}

    onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
		const { query, queryResult, queryResult: { pivotMetadata: { rowAxes, columnAxes } } } = this.props;

		let targetAxis     = null;
		const mouseEvent   = e.nativeEvent as MouseEvent;
		let isTargetHeader = false;

		const $target         = $(e.target);
		let target: PivotPart = 'none';
		/* right-click in the gray whitespace
		 if ($target.attr('wj-part') === 'root' || $target.parents('.pivot-context-menu').length > 0) {
			return;
		}
		else*/

		if ($target.hasClass('pivot-corner')) {
			target = 'corner';
		}
		else if ($target.parents('.detail-cells').length > 0) {
			target = 'details';
		}
		else if ($target.parents('.row-axes').length > 0) {
			target = 'rows';

			// Figure out _which_ axis this is
			const index = $target.index();

			if ($target.hasClass('wj-header')) {
				targetAxis     = rowAxes[index];
				isTargetHeader = true;
			}
			else {
				targetAxis = rowAxes[index % rowAxes.length];
			}
		}
		else if ($target.parents('.column-axes').length > 0) {
			target      = 'columns';
			const index = $target.index();

			if ($target.hasClass('wj-header')) {
				targetAxis     = columnAxes[index];
				isTargetHeader = true;
			}
			else {
				targetAxis = columnAxes[index % columnAxes.length];
			}
		}
		else if ($target.hasClass(bp.Classes.NAVBAR) || $target.parents(`.${bp.Classes.NAVBAR}`).length > 0) {
			target = 'toolbar';
		}

		if (target == 'none') { target = 'details'}

		this.contextMenuTarget = target;
		bp.ContextMenu.show(<PivotContextMenu target={target} targetAxis={targetAxis} isTargetHeader={isTargetHeader}
		                                      pivot={this} query={query} queryResult={queryResult}/>, { left: e.clientX - 8, top: e.clientY - 8 });

		e.preventDefault();
		e.stopPropagation();
		return false;
	}

    static formatAxisValue(value) {
		if (value == null) {
			return '...'
		}
		else if (typeof value === 'number') {
			return value.toString();
		}
		else if (value.label != null) {
			return value.label;
		}
		else {
			return value;
		}
	}

    public formatDetailCell = (detailCell: PivotDetailCell) => {
		const { queryResult } = this;

		if (detailCell != null && detailCell.data != null) {
			const format = DataFormat[queryResult.pivotMetadata.formats[detailCell.format]];

			const { data } = detailCell;

			if (data && data.num != null && data.den != null) {
				return `${data.num} / ${data.den}`;
			}

			const formatting = api.queryResultStore.formats[format];

			let result;

			if (formatting.precision == null) {
				result = isNaN(data) ? data : api.utility.formatNumberWithCommas(data);
			} else if (!isNaN(data)) {
				let formatted = api.utility.formatNumberWithCommas(data * (formatting.scale ? formatting.scale : 1), formatting.precision);
				if (formatted === "-0") {
					formatted = "0"
				}
				result = formatted;
			}
			else {
				result = data;
			}

			return _.padStart(result, Math.abs(formatting.paddedLength));
		}
		else {
			return null;
		}
	}

    getCell = (part: PivotPart, row: number, column: number, enableFetch: boolean = true): PivotCoordinateCell | PivotDetailCell => {
		try {
			const { queryResult: { arrangement }, windows: { detailWindow } } = this;

			if (part === 'details') {
				let entry = this.cache.getCell(row, column, enableFetch);
				return entry && entry.detailCell;
			}
			else if (detailWindow != null) {
				if (part === 'columns') {
					const entry = this.cache.getCell(detailWindow.y, column, enableFetch);
					return entry && entry.colCoords[row];
				}
				else if (part === 'rows') {
					const entry = this.cache.getCell(row, detailWindow.x, enableFetch);
					return entry && entry.rowCoords[column];
				}
			}

			return undefined;
		}
		catch (err) {
			console.error(err);
			return undefined;
		}
	}

    getCellData = (part: PivotPart, row: number, column: number) => {
		let cell = this.getCell(part, row, column);

		if (cell == null) {
			//debugger;
			return null
		}

		if ((cell as any).exists === false || (cell as any).data === null) {
			//debugger;
			return '';
		}

		if (part === 'details') {
			return this.formatDetailCell(cell as PivotDetailCell);
		}
		else {
			const { queryResult } = this;

			let axis = part === 'rows' ? queryResult.arrangement.rowAxes[column] : queryResult.arrangement.columnAxes[row];

			let coordinateID = (cell as PivotCoordinateCell).coordinate;
			let result       = axis.groupMembers[coordinateID];

			if (result != null) {
				if (axis.groupName.label == 'Simulation') {
					let coord = result as GroupMember;
					return coord.label;
				}
				else {
					return PivotTable.formatAxisValue(result);
				}
			}
			else {
				// Lookup of the axis / axisValue has failed - thus far this has indicated an issue with the backend
				throw new Error(i18n.intl.formatMessage(i18nMessages.axisNotFoundError, {
					coordinateID,
					part,
					axisGroupNameLabel: axis.groupName.label
				}));
			}
		}
	}

    /*@computed*/
    get flexGrids() {
		const { pivotParts: { details, columns, rows } } = this;

		return {
			['details']: details ? details.grid : null,
			['columns']: columns ? columns.grid : null,
			['rows']   : rows ? rows.grid : null
		}
	}

    @action
	async selectCells(target: PivotPart, operation: SelectOperation) {
		const { props: { queryResult, queryResult: { pivotMetadata } }, flexGrids, pivotParts: { details } } = this;

		const grid = flexGrids[target];

		if (grid == null)
			return;

		const { topRow, leftCol, rowSpan, columnSpan } = grid.selection;

		let response = await queryResult.pivot.selectRange(target, operation, { x: leftCol, rows: rowSpan, y: topRow, columns: columnSpan });

		this.invalidate();

		this.isSelecting = true;
		this.cache.reset();
		this.cache.getCell(this.windows.detailWindow.x, this.windows.detailWindow.y);

		//let initialData = await this.cache.loadInitialData(detailWindow);

		grid.select(-1, -1);
	}

    refreshPivotParts() {
		this.pivotParts.details.refresh();
		this.pivotParts.columns.refresh();
		this.pivotParts.rows.refresh();
	}

    renderCells() {
		const { pivotParts: { columns, details, rows }, windows } = this;

		details.flexController.renderCells(windows.detailWindow);
		if (columns.flexController) {
			columns.flexController.renderCells(windows.columnWindow);
		}
		if (rows.flexController) {
			rows.flexController.renderCells(windows.rowWindow);
		}
	}

    @computed
	get axes() {
		return this.props.queryResult.pivotMetadata.axes;
	}

    axisIdsToLabels = (axisIds: number[]) => {
		return this.axes
			? _.map(axisIds, id => {
				return (this.axes[id] != null) ? this.axes[id].groupName.label : ''
			})
			: ''
	}

    invalidate = () => {
		const { pivotParts: { rows, columns, details } } = this;

		if (columns && columns.grid) {
			columns.grid.invalidate(false);
		}

		if (rows && rows.grid) {
			rows.grid.invalidate(false);
		}

		if (details && details.grid) {
			details.grid.invalidate(false);
		}
	}

    startUp() {
		this.$node = $(ReactDOM.findDOMNode(this));

		this._toDispose.push(autorun(() => {
			const { pivotParts: { columns, details, rows } } = this;

			// Have all 3 parts rendered?
			if (!this.hasRunInitialAutosize
			    && details && rows && columns
			    && details.rendered && rows.rendered && columns.rendered) {
				this.hasRunInitialAutosize = true;

				// Synchronize the pivot parts and setup scrolling and drag and drop handlers

				this.scrollHandler = new PivotScrollHandler(this);

				this.$nodes                  = {
					self        : this.$node,
					columnTable : $(ReactDOM.findDOMNode(columns)),
					rowTable    : $(ReactDOM.findDOMNode(rows)),
					detailsTable: $(ReactDOM.findDOMNode(details)),
					row2        : $(ReactDOM.findDOMNode(this)).find(`.${css.row2}`),
					cornerNode  : $(ReactDOM.findDOMNode(this.corner))
				}
				this.$nodes.horizontalSpacer = this.$nodes.row2.find(`.${css.horizontal}.${css.spacer}`);
				this.$nodes.verticalSpacer   = this.$nodes.row2.find(`.${css.vertical}.${css.spacer}`);

				this.dragAndDrop = new PivotDragAndDropHelper(this);

				this.autosizePivotParts('initialRender');
				this.detailCellsGrid.refresh(); // Refresh the grid to make sure the viewRange is updated.
				this.isPivotFullyRendered = true;
				this.setViewRange(this.detailCellsGrid.viewRange);

				if (this.props.onLoaded) {
					this.props.onLoaded(this);
				}
			}
		}));
	}

    $nodes: {
		self?: JQuery,
		cornerNode?: JQuery,
		columnTable?: JQuery,
		rowTable?: JQuery,
		detailsTable?: JQuery,
		row2?: JQuery,
		horizontalSpacer?: JQuery,
		verticalSpacer?: JQuery
	}

    @observable scrollBars: { hasVertical: boolean, hasHorizontal: boolean } = { hasVertical: true, hasHorizontal: true }

    @action autosizePivotParts = (reason: 'resize' | 'initialRender' | 'dataLoaded') => {
		utility.forceReflow(this.$node)     // Force the grids to update so we can measure

		const { pivotParts: { rows, details, columns } } = this;

		if (reason !== 'resize') {
			//console.log('autosizing columns')
			this.pivotParts.rows.autosizeColumns();
			this.pivotParts.columns.autosizeColumns();
			this.pivotParts.details.flexController.onResize();
		}

		const { detailsTable, row2, rowTable} = this.$nodes;

		row2.removeClass(css.capHeight);
		rowTable.css('width', 'auto');

		if (reason == 'initialRender') {
			const rootElement = ReactDOM.findDOMNode(this);

			const axesColumnsHeightMin = columns.grid ? columns.grid.rowHeaders.rows.defaultSize : PivotTable.DEFAULT_LINE_HEIGHT;
			const axesColumnsHeightMax = columns.grid ? columns.grid.rowHeaders.height : axesColumnsHeightMin;
			const $colHeader = $(rootElement).find(`.${css.horizontalSplitter} > .pane.primary`);
			$colHeader.css('minHeight', axesColumnsHeightMin);
			$colHeader.css('maxHeight', axesColumnsHeightMax);
			$colHeader.height(axesColumnsHeightMax);

			if (!rows.grid) {
				const axesColumnsHeaderWidth = columns.grid.rowHeaders.width;
				$(rootElement).find('.row-axes').width(PivotTable.MINIMUM_CORNER_WIDTH + axesColumnsHeaderWidth - PivotTable.SPLITTER_HANDLER_WIDTH);
			} else {
				const axesColumnsHeaderWidth = columns.grid ? columns.grid.rowHeaders.width : $(rootElement).find('.empty-column-axes .header').width();
				const axesRowsHeaderWidth = rows.grid.columnHeaders.width;
				const minimumWidth = (PivotTable.MINIMUM_CORNER_WIDTH + axesColumnsHeaderWidth - PivotTable.SPLITTER_HANDLER_WIDTH);

				if (axesRowsHeaderWidth < minimumWidth) {
					rows.grid.columns[0].width += minimumWidth - axesRowsHeaderWidth;
					rows.grid.refresh(true);
				}
			}

			this.updateCornerWidth();

			const axesRowsWidthMin = rows.grid ? Math.min(...rows.grid.columnHeaders.columns.map(c => c.width)) : $(rootElement).find('.row-axes').width();
			const axesRowsWidthMax = rows.grid ? rows.grid.columnHeaders.width : axesRowsWidthMin;
			const $rowHeader = $(rootElement).find(`.${css.verticalSplitter} > .pane.primary`);
			$rowHeader.css('minWidth', axesRowsWidthMin);
			$rowHeader.css('maxWidth', axesRowsWidthMax);
			$rowHeader.width(axesRowsWidthMax);

			rows.flexController?.onResize();
			columns.flexController?.onResize();
			details.flexController?.onResize();

			$(rootElement).find(`.${css.verticalSplitter} > .handle-bar`)
				.on('mousedown', () => $(rootElement).addClass(css.verticalDragging))
				.on('mouseup', () => $(rootElement).removeClass(css.verticalDragging))
		}

	    this.updateCornerWidth();

	    utility.forceReflow(this.$node)

		// This casues the pivot to sometimes render with only a portion of the required data because the height is too small during the initial render.
		// Why do we need to cap the height? -- RAJ 1/24/17
		this.shouldCapHeight = false;//detailsTable.children("div").height() < detailsTable.height();

		let detailsTableRoot          = detailsTable.find(".wj-content div[wj-part=root]").get(0);
		this.scrollBars.hasHorizontal = detailsTableRoot.scrollWidth > detailsTableRoot.clientWidth
		this.scrollBars.hasVertical   = !this.props.shouldRenderFullHeight && detailsTableRoot.scrollHeight > detailsTableRoot.clientHeight



	} // End autosizePivo

    hasRunInitialAutosize = false;

	@action updateCornerWidth() {
		const rootElement = ReactDOM.findDOMNode(this);
		const {rows, columns, details} = this.pivotParts;
		const axesColumnsHeaderWidth = columns.grid ? columns.grid.rowHeaders.width : $(rootElement).find('.empty-column-axes .header').width();
		const axesRowsWidth = $(rootElement).find(`.${css.verticalSplitter} > .pane.primary`).width();

		$(rootElement).find('.handle-bar.horizontal').css('marginLeft', axesRowsWidth);
		this.cornerWidth = (axesRowsWidth - axesColumnsHeaderWidth + PivotTable.SPLITTER_HANDLER_WIDTH);

		const maxHeight = details.grid.hostElement.children[0].scrollHeight + PivotTable.SPLITTER_HANDLER_WIDTH;
		const $splitterContentPane = $(rootElement).find(`.${css.horizontalSplitter} > .pane:not(.primary)`);

		if (this.props.shouldRenderFullHeight) {
			$splitterContentPane.css("height", maxHeight);
		}
		else {
			$splitterContentPane.css("max-height", maxHeight);
		}
	}

    /**
	 * Forward mouse wheel events from the row axes table
	 */
    onRowTableMouseWheel = (e: React.WheelEvent<any>) => {
		//console.log(e.deltaY, e.nativeEvent);

		if (e.deltaY !== 0) {
			const { scrollPosition }                    = this.pivotParts.details.grid;
			scrollPosition.y -= e.deltaY;
			this.pivotParts.details.grid.scrollPosition = scrollPosition;
		}
	}

    onUserOptionsUpdated = (userOptions: PivotUserOptions) => {
		if (this.props.onUserOptionsUpdated) {
			this.props.onUserOptionsUpdated(userOptions);
		}
	}

    updatePercentiles = ({percentiles}: {percentiles: number[]}) => {
		let {statistics} = this.props.queryResult;
		const percentileStats = statistics.find(s => s.statistic == "percentile");

		if (!_.isEqual(percentiles, percentileStats.percentiles)) {
			percentileStats.percentiles = percentiles;
			this.queryResult.updateStatistics();
		}
	}

    updateCtes = ({ctes}: {ctes: CTEOptions[]}) => {
		let {statistics} = this.props.queryResult;
		const cteStats = statistics.find(s => s.statistic == "cte");

		if (!_.isEqual(ctes, cteStats.ctes)) {
			cteStats.ctes = ctes;
			this.queryResult.updateStatistics();
		}
	}

    onToggleSensitivity = async (enabled: boolean) => {
		if (enabled) {
			const { userOptions } = this.props;
			await this.queryResult.saveShowStatisticsPivotBeforeEnableSensitivity();
			if (!userOptions.showStatisticsPivot) {
				await this.queryResult.toggleStatistics();
			}
		} else if (!this.queryResult.showStatisticsPivotBeforeEnableSensitivity){
			await this.queryResult.toggleStatistics();
		}
	}

    onSensitivityApply = async () => {
		await this.props.queryResult.updateStatistics();
	}

    renderToolbar() {
		const { queryResult, queryResult: { arrangement }, userOptions } = this.props;
		const { sensitivityEnabled } = queryResult;
		const percentileStat = queryResult.statistics.find(s => s.statistic == "percentile");
		const cteStat = queryResult.statistics.find(s => s.statistic == "cte");
		const statisticTooltip = i18n.intl.formatMessage(sensitivityEnabled ? i18nMessages.statisticTooltipWithSensitivity : i18nMessages.statisticTooltip);

		return (
			<>
				<Toolbar className={css.pivotToolbar}
					left={<>
						<div className={bp.Classes.BUTTON_GROUP}>
							<Tooltip position={Position.BOTTOM_LEFT} content={i18n.intl.formatMessage(queryMessages.allToRowsTooltip)}>
								<Button onClick={arrangement.allToRows}>
									<AppIcon icon={appIcons.queryTool.arrangement.allToRows} iconningSize={24}/>
								</Button>
							</Tooltip>
							<Tooltip position={Position.BOTTOM_LEFT} content={i18n.intl.formatMessage(queryMessages.swapRowsAndColumnsTooltip)}>
								<Button onClick={arrangement.flip}>
									<AppIcon icon={appIcons.queryTool.arrangement.flip} iconningSize={24}/>
								</Button>
							</Tooltip>
							<Tooltip position={Position.BOTTOM_LEFT} content={i18n.intl.formatMessage(queryMessages.allToColumnsTooltip)}>
								<Button onClick={arrangement.allToColumns}>
									<AppIcon icon={appIcons.queryTool.arrangement.allToColumns} iconningSize={24}/>
								</Button>
							</Tooltip>
						</div>
						<span className={bp.Classes.NAVBAR_DIVIDER}/>
						<Tooltip position={Position.BOTTOM_LEFT} content={statisticTooltip}>
							<IconButton className="select-statistics-button" icon={appIcons.queryTool.views.statistics} active={userOptions.showStatisticsPivot} onClick={queryResult.toggleStatistics} disabled={sensitivityEnabled}/>
						</Tooltip>
						<span className={bp.Classes.NAVBAR_DIVIDER}/>
						{ this.isInitializeFirstRender &&
						<ToggleSensitivityToolbarItem queryResult={queryResult} onToggleSensitivity={this.onToggleSensitivity} onSensitivityApply={this.onSensitivityApply} />
						}
						<span className={bp.Classes.NAVBAR_DIVIDER} />
						{userOptions.showStatisticsPivot &&
							<Tooltip position={Position.BOTTOM_LEFT} content={i18n.intl.formatMessage(i18nMessages.selectStatistics)}>
								<bp.Menu className={css.selectStatistics}>
									<Popover
										autoFocus={false}
										position={bp.Position.BOTTOM_LEFT}
										minimal
										hoverOpenDelay={300} hoverCloseDelay={600}
										interactionKind={bp.PopoverInteractionKind.CLICK}
										popoverClassName={classNames(css.popover)}
										canEscapeKeyClose
										content={<StatisticsMenu statistics={this.queryResult.statistics}
										onChange={() => this.queryResult.updateStatistics()} />}>
										<AnchorButton text={i18n.intl.formatMessage(i18nMessages.selectStatistics)} onClick={() => {}} />
									</Popover>
								</bp.Menu>
							</Tooltip>
							}
						{userOptions.showStatisticsPivot && percentileStat?.enabled && <>
							<span className={bp.Classes.NAVBAR_DIVIDER}/><PercentilesToolbarItem userOptions={percentileStat as any} updatePercentiles={() => {}} updateUserOptions={this.updatePercentiles} semicolonToDisableMirroring={false} />
						</>}
						{userOptions.showStatisticsPivot && cteStat?.enabled && <>
							<span className={bp.Classes.NAVBAR_DIVIDER}/><CtesToolbarItem userOptions={cteStat as any} updateCtes={() => {}} updateUserOptions={this.updateCtes}/>
						</>}
					</>}
					right={<>
						<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.FILE_CTRL.DOWNLOAD}>
							<bp.Popover position={bp.Position.BOTTOM_RIGHT}
									interactionKind={bp.PopoverInteractionKind.CLICK}
									content={<bp.Menu>
										<bp.MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.CSV)} onClick={() => downloadFile(this.props.query.CSVDownloadLinkUrl, false)}/>
										<bp.MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.XLSX)} onClick={() => downloadFile(this.props.query.XLSXDownloadLinkUrl, false)}/>
									</bp.Menu>}>
								<IconButton  icon={appIcons.investmentOptimizationTool.download} target="download"/>
							</bp.Popover>
						</bp.Tooltip>
						{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}

						{/*<Tooltip position={Position.BOTTOM} content="Reset Arrangement">*/}
						{/*<AnchorButton icon="refresh" text="Reset" onClick={arrangement.reset}/>*/}
						{/*</Tooltip>*/}


						{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}
						{/*<div className={bp.Classes.BUTTON_GROUP}>*/}
						{/*<label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}>Selection:</label>*/}
						{/*<AnchorButton icon="tick" text="All"/>*/}
						{/*<AnchorButton icon="cross" text="None"/>*/}
					</>}
				/>
				<div className={highchartCss.highchartPopoverToolbarContainer} id={highchartCss.highchartPopoverToolbarContainer}></div>
			</>
		);
	}
}
