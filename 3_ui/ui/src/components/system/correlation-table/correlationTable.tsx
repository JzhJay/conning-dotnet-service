import {api, QueryResult, appIcons, Query, QueryDescriptor, i18n} from 'stores';
import {bp, LoadingIndicator, AutoResizeComponent, IconButton} from 'components';
import {downloadFile, getHexColorFrom3ColorGradient } from 'utility';
import { QueryContextMenu } from "../query-tool/query-builder";
import {Toolbar} from '../toolbar/Toolbar';
import * as css from './correlationTable.css';
import {CorrelationMergeManager} from './correlationTableMergeManager'
import {CorrelationCellFactory, THIN_BORDER} from './correlationTableCellFactory'
import {Rect} from 'utility/Rect'
import {observer} from 'mobx-react';
import { observable, reaction, computed, makeObservable } from 'mobx';
import {FormattedMessage} from 'react-intl';
import {queryMessages} from './../../../stores/i18n/queryMessages';

require("lib/semantic/dist/components/popup.js")

const CELL_SIZE = 35;

interface CorrelationTableProps extends React.Props<CorrelationTable> {
	className?: string;
	onLoaded?: () => void;
	query?: Query | QueryDescriptor;
	queryResult?: QueryResult;
	isLayoutDragging?: boolean;
}

interface Rotation {
	shouldRotate: boolean;
	width: number;
}

const gridOptions = {
	//selectionMode: wijmo.grid.SelectionMode.Cell,
	headersVisibility: wijmo.grid.HeadersVisibility.All,
	allowMerging:      wijmo.grid.AllowMerging.AllHeaders,
	allowDragging:     wijmo.grid.AllowDragging.None,
	allowResizing:     wijmo.grid.AllowResizing.None,
	isReadOnly:        true
}

@observer
@bp.ContextMenuTarget
export class CorrelationTable extends AutoResizeComponent<CorrelationTableProps, {}> {
	constructor(props, state) {
		super(props, state);

		makeObservable(this);
	}

	@computed get queryResult() { return this.props.queryResult }

    @computed get correlation() { return this.queryResult.correlation }

	render() {
		const {correlation: {data, loading}} = this;

		return (

			<div className={classNames(this.props.className, css.correlationTable)}>
				{loading && <LoadingIndicator active={true}><FormattedMessage defaultMessage="Loading Correlation Matrix..." description="[Query] Display message while loading Correlation Matrix." /></LoadingIndicator> }
				{ this.props.query &&
						<Toolbar
							right={<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
								<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.FILE_CTRL.DOWNLOAD}>
									<bp.Popover position={bp.Position.BOTTOM_RIGHT}
											interactionKind={bp.PopoverInteractionKind.CLICK}
											content={<bp.Menu>
												<bp.MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.CSV)} onClick={() => downloadFile(this.props.query.correlationCSVDownloadLinkUrl)}/>
												<bp.MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.XLSX)} onClick={() => downloadFile(this.props.query.correlationXLSXDownloadLinkUrl)}/>
											</bp.Menu>}>
										<IconButton  icon={appIcons.investmentOptimizationTool.download} target="download"/>
									</bp.Popover>
								</bp.Tooltip>
							</div>}
						/>
				}
				{/* Always have the grid around so that we can initialize */}
				<div ref={(ref) => this.gridDiv = ref}
				     style={{visibility: loading ? 'hidden' : 'visible'}}/>
			</div>

		)
	}

	coordinateGradient;
	grid: wijmo.grid.FlexGrid;
	gridDiv: (HTMLDivElement);
	cv: wijmo.collections.CollectionView;

	headersRanges          = [];
	_toDispose: Function[] = [];
	readyShowTooltips = false; // So the Table Cell Factory can know when to trigger tooltips
	scrollMode = false;

	renderContextMenu(e) {
		const {queryResult: qr} = this;

		return qr ? <QueryContextMenu location='builder' currentView='correlation' query={qr.query}/> : null
	}

	componentDidMount() {
		super.componentDidMount();

		this.queryResult.loadCorrelation().then(() => {
			try {
				if (this.queryResult.correlation.data) {
					this.setupGrid();

					//this.grid.refresh(true);
					this.grid.select(-1, -1);
					//this.grid.refreshCells(true);

					let firstUpdate = true;
					this.grid.onUpdatedView = (e) => {
						if (firstUpdate) {
							firstUpdate = false;
							this.onResize();

							if (this.props.onLoaded) { this.props.onLoaded()}
							this.readyShowTooltips = true;
						}
					}
				}
			}
			catch (err) {
				api.site.raiseError(err);
			}
		});
	}

	componentWillUnmount() {
		super.componentWillUnmount();

		this._toDispose.forEach(f => f());

		if (this.grid) {
			const factory = this.grid.cellFactory as CorrelationCellFactory;
			factory && factory.release && factory.release();
			this.grid.dispose();
		}
	}

	componentDidUpdate(prevProps: Readonly<CorrelationTableProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (prevProps.isLayoutDragging !== this.props.isLayoutDragging) {
			const $node = $(ReactDOM.findDOMNode(this));

			if (this.props.isLayoutDragging ) {
				$node.addClass(css.isLayoutDragging)

				let $grid = $(this.gridDiv)
				const $cells = $grid.find("div[wj-part=cells]");

				let gridWidth = this.grid.getCellBoundingRect(0, Math.min(this.grid.columns.length - 1, this.grid.viewRange.col2 + 1)).right - this.grid.getCellBoundingRect(0, 0).left;
				let gridHeight = this.grid.getCellBoundingRect(Math.min(this.grid.rows.length - 1, this.grid.viewRange.row2 + 1), 0).bottom - this.grid.getCellBoundingRect(0, 0).top;

				$cells.css({left: ($grid.width() - gridWidth)/2 })
				$cells.css({top: ($grid.height() - gridHeight)/2 })

				//const zoom = Math.max($grid.width()/gridWidth, $grid.height()/gridHeight)
				//$cells.css({zoom: zoom * 100 + "%"})
				//$cells.css({left: 0 })
				//$cells.css({top: 0 })
			}
			else {
				$node.removeClass(css.isLayoutDragging)
			}
		}
	}

	onResize() {
		if (!this.grid)
			return;

		const gridNode  = ReactDOM.findDOMNode(this.gridDiv);
		const $gridNode = $(gridNode);

		const $container = $(ReactDOM.findDOMNode(this));
		const rect       = $container.get(0).getBoundingClientRect();

		// Explicitly set the max width and height so flexgrid doesn't grow beyond this point and correctly shows the
		// scrollbar. It seems to ignore widths/heights specified in percentages.
		$gridNode.css("max-width", rect.width);
		$gridNode.css("max-height", rect.height);

		const lastCellRect = this.grid.cells.getCellBoundingRect(this.grid.rows.length - 1, this.grid.columns.length - 1);
		if (lastCellRect.right < rect.right) {
			const root: HTMLElement = $gridNode.find("div[wj-part=root]").get(0);
			const scrollbarWidth    = root.offsetWidth - root.clientWidth;
			$gridNode.width(lastCellRect.right - rect.left + scrollbarWidth);
		}

		this.grid.refresh(true);
	}

	getTextWidth(text) {
		const div = $(`<div id='prerender-container'>${_.escape(text)}</div>`);
		$(this.grid.hostElement).append(div);
		const width = div.width();
		div.remove();

		return width;
	}

	rotations: Rotation[] = [];

	/**
	 * Determine which headers should be rotated because they fail to fit within their available width/height
	 * Also calculate the max width of each header
	 * @param headers       axis coordinates per axis
	 * @param axisHeaders   the axis names
	 */
	findRotations(headers, axisHeaders) {
		let shouldRotate: boolean = false;
		const padding             = 10;

		for (let i = 0; i < headers.length; i++) {
			const header         = headers[i];
			let maxWidth: number = 0;

			for (let j = 0; j < header.length; j++) {
				const val   = header[j];
				const width = this.getTextWidth(val) + padding;

				maxWidth = Math.max(maxWidth, width);

				const range      = this.headersRanges[i][j];
				const availWidth = range ? (range.end - range.start + 1) * CELL_SIZE : CELL_SIZE;

				if (width > availWidth) {
					shouldRotate = true;
				}
			}

			this.rotations.push({shouldRotate: shouldRotate, width: maxWidth});
		}

		// Size the inner axis to allow the outer axis to not be truncated
		let existingWidthAllowance = 0;
		for (let i = axisHeaders.length - 1; i >= 0; i--) {
			const header = axisHeaders[i];

			existingWidthAllowance += this.rotations[i].shouldRotate ? this.rotations[i].width : CELL_SIZE
			const additionalWidthNeeded = this.getTextWidth(header) + padding - existingWidthAllowance;

			if (additionalWidthNeeded > 0) {
				this.rotations[this.rotations.length - 1].width += additionalWidthNeeded;
				existingWidthAllowance += additionalWidthNeeded;
			}
		}
	}

	getHeaderData(coords, metadataAxis) {
		const headers = [];

		for (let r = 0; r < coords[0].length; r++) {
			const header = [];
			for (let i = 0; i < coords.length; i++) {
				let coord = coords[i];
				let axis  = metadataAxis[r];
				let value = coord[r] != -1 ? (axis.groupType === "Generic" ? axis.groupMembers[coord[r]].label : axis.groupMembers[coord[r]]) : null

				if (axis.groupName.label == 'Simulation') {
					value = this.props.queryResult.simulationIdToName.has(value) ? this.props.queryResult.simulationIdToName.get(value) : value;
				}

				header.push(value);
			}
			headers.push(header);
		}

		return headers;
	}

	setupGrid() {
		const {correlations} = this.queryResult.correlation.data;

		// Clean data to handle null values.
		// Flexgrid doesn't gracefully handle nulls in number columns, without explicit column creation.
		let cleanData = [];

		for (let i = 0; i < correlations.length; i++) {
			let val = [];
			for (let j = 0; j < correlations[i].length; j++)
				val.push((correlations[i][j] != null) ? correlations[i][j] : "");

			cleanData.push(val);
		}

		this.cv = new wijmo.collections.CollectionView(cleanData);

		this.grid             = new wijmo.grid.FlexGrid(this.gridDiv, gridOptions);
		this.grid.itemsSource = this.cv;

		// create headers
		this.createHeaders();

		// add custom merge manager
		let mm: CorrelationMergeManager = new CorrelationMergeManager(this.headersRanges);
		this.grid.mergeManager          = mm;

		// add a formatter callback to handle cell formatting
		let cf                = new CorrelationCellFactory(this);
		this.grid.cellFactory = cf;

		// Prevent table interaction when scrolling via scrollwheel or trackpad. e.g. don't show cell highlight nor tooltips even though cells receive valid mouseover events.
		this.grid.onScrollPositionChanged = () => {
			if (!this.scrollMode) {
				this.scrollMode = true;
				$(this.grid.hostElement).addClass(css.scrollMode);
			}
		};
		// Switch back to interaction mode when the mouse moves.
		this.grid.hostElement.addEventListener("mousemove", () => {
			if (this.scrollMode) {
				$(this.grid.hostElement).removeClass(css.scrollMode);
				this.scrollMode = false;
			}
		});
	}

	verticallyAlign(div) {

		if (div.children.length === 0 || !$(div.children[0]).hasClass(css.verticalAlign)) {
			let value     = div.innerHTML;
			div.innerHTML = `<span>${value}</span>`;

			wijmo.setCss(div, {
				display: 'flex',
			});

			$(div.children[0]).addClass(css.verticalAlign);
		}
	}

	getHeaderFirstBorderWidth(level) {
		const {data} = this.correlation;
		// Only the level 0 header is allowed to have a width
		return (level === 0) ? data.axes.length * THIN_BORDER : 0;
	}

	getHeaderLevelSeparatorBorderWidth(level) {
		const {data}    = this.correlation;
		let borderTimes = (level === data.axes.length - 1) ? data.axes.length : data.axes.length - (level + 1);
		return borderTimes * THIN_BORDER;
	}

	/**
	 * Calculates the merged ranges for each cell in the header
	 * @param headers   The headers to be merged.
	 */
	generateMergedRanges(headers) {
		for (let i = 0; i < headers.length; i++) {
			let header       = headers[i];
			let headerRanges = [];
			let rng          = null;
			for (let j = 0; j < header.length; j++) {
				if (header[j] === header[j + 1] &&
					(i === 0 ||
					(this.headersRanges[i - 1][j] && this.headersRanges[i - 1][j] === this.headersRanges[i - 1][j + 1]))) {
					if (rng) {
						rng.end = j + 1;
					}
					else {
						rng = {start: j, end: j + 1};
					}
					headerRanges.push(rng);
				}
				else {
					headerRanges.push(rng);
					rng = null;
				}
			}

			this.headersRanges.push(headerRanges);
		}
	}

	createHeaders() {
		const {data}              = this.correlation;
		const {coordinates, axes} = data;
		let axisHeaders           = axes.map((axis) => axis.groupName.label)
		let headers               = this.getHeaderData(coordinates, axes);

		this.generateMergedRanges(headers);
		this.findRotations(headers, axisHeaders);

		for (let h = 0; h < 2; h++) {
			const isRowHeader   = (h === 0);
			const header        = isRowHeader ? this.grid.rowHeaders : this.grid.columnHeaders;
			const headerEntries = isRowHeader ? header.columns : header.rows;

			// Make sure we have enough rows/columns in our header
			for (let r = 1; r < axes.length; r++) {
				if (isRowHeader) {
					const hc = new wijmo.grid.Column();
					(headerEntries as wijmo.grid.ColumnCollection).insert(0, hc);
				}
				else {
					const hr = new wijmo.grid.Row();
					(headerEntries as wijmo.grid.RowCollection).insert(0, hr);
				}
			}

			// Populate the format the header
			for (let r = 0; r < headerEntries.length; r++) {
				headerEntries[r].allowMerging = true;

				const headerSize = this.getHeaderSize(r, this.rotations[r].shouldRotate || r === headerEntries.length - 1);

				if (isRowHeader)
					(headerEntries as wijmo.grid.ColumnCollection)[r].width = headerSize;
				else
					(headerEntries as wijmo.grid.RowCollection)[r].height = headerSize;

				for (let c = 0; c < this.grid.columns.length; c++) {
					let content = headers[r][c];

					if (isRowHeader) {
						header.setCellData(c, r, content);
						header.rows[c].align        = "center";
						//header.rows[c].allowSorting = false;
					}
					else {
						header.setCellData(r, c, content);
						header.columns[c].align        = "center";
						header.columns[c].allowSorting = false;
					}
				}
			}
		}

		// squarify cells
		for (let c = 0; c < this.grid.columns.length; c++) {
			this.grid.columns[c].align = "right";
			this.grid.columns[c].width = CELL_SIZE + (this.getQuadrantBorderWidth(c, -1));
		}

		for (let r = 0; r < this.grid.rows.length; r++) {
			this.grid.rows[r].height = CELL_SIZE + (this.getQuadrantBorderWidth(r, -1));
		}

		// Setup top left header
		for (let r = 0; r < headers.length; r++) {
			this.grid.topLeftCells.rows[r].allowMerging = true;

			for (let c = 0; c < headers.length; c++) {
				this.grid.topLeftCells.setCellData(r, c, axisHeaders[Math.min(r, c)]);
			}
		}
	}

	getHeaderSize(level, useRotationWidth) {
		const textPadding = 10;
		let width         = useRotationWidth ? this.rotations[level].width + textPadding : CELL_SIZE;

		return width + (this.getHeaderLevelSeparatorBorderWidth(level) + this.getHeaderFirstBorderWidth(level));
	}

	axisBackgroundColor(index: number): string {
		//turn "rgb(0, 0, " + (127 + index * 10) + ")";
		const {data} = this.correlation;
		return ((data.axes.length - index) % 2) === 0 ? "#4F81BD" : "#376092";
	}

	/**
	 * Calculate the border width based on a cells position in its group/quadrant
	 * @param index index of the cell within its level
	 * @param level the index of the axis that corresponds to the cell in question
	 * @returns {number}    The border width in pixels
	 */
	getQuadrantBorderWidth(index, level) {
		let borderTimes = level !== -1 ? (this.headersRanges.length - level) : 1;

		const {data} = this.correlation;
		if (data.axes.length > 1) {
			for (let l = 0; l < this.headersRanges.length - 1; l++) {
				let range     = this.headersRanges[l][index];
				let cellRange = level !== -1 ? this.headersRanges[level][index] : null;

				if (!range || (range.end === index) || (cellRange && range.end === cellRange.end)) {
					borderTimes = this.headersRanges.length - l;
					break;
				}
			}
		}

		return borderTimes * THIN_BORDER;
	}

	valueBackgroundColor(value: number) {
		let offset = Math.sqrt(Math.abs(value));
		// normalize offset to between 0 and 1
		if (value < 0) {
			offset = (1 - offset)*0.5;
		} else {
			offset = offset*0.5 + 0.5;
		}

		const red = [255, 0, 0];
		const white = [255, 255, 255];
		const green = [0, 128, 0];
		return getHexColorFrom3ColorGradient(offset, red, white, green);
	}

	calcCellValue(value: number) {
		let newValue = Math.abs(value);
		let valueString;

		if (newValue === 1)
			valueString = 1;
		else
			valueString = newValue.toFixed(2).replace(/^0+/, '');

		return value < 0 ? "-" + valueString : valueString;
	}

	/**
	 * Cell hover callback
	 * @param{number} row   The row of the cell
	 * @param{number} col   The col of the cell
	 * @returns {void}
	 */
	cellHoverIn(row: number, col: number) {
		const {data} = this.correlation;
		this.highlightHeaders(row, col, data.axes.length - 1);
	}

	highlightHeaders(row, col, levelEnd) {
		let panel;

		for (let l = 0; l <= levelEnd; l++) {
			for (let i = 0; i < 2; i++) {

				let rc;
				if (i === 0) {
					if (col === -1)
						continue;

					panel = this.grid.columnHeaders;
					rc    = panel.getCellBoundingRect(l, col);
				}
				else {
					if (row === -1)
						continue;

					panel = this.grid.rowHeaders;
					rc    = panel.getCellBoundingRect(row, l);
				}

				let cell = this.getCellFromRect(rc, panel);

				$(cell).addClass(css.selectedHeader);
			}
		}
	}

	/**
	 * call hover out callback
	 * @returns {void}
	 */
	cellHoverOut() {

		// Add a temporary removal transition so that headers that are being deselected because
		// of a cell selection that will again reselect the same header doesn't result in a flash between the background color being
		// cleared and reset. e.g. when the hover changes to a cell that shares a coordiante.
		$(`.${css.selectedHeader}`).addClass(css.pendingDeselectionHeader);
		window.setTimeout(() => {
			$(`.${css.pendingDeselectionHeader}`).removeClass(css.pendingDeselectionHeader);
		});

		$(".wj-cell").removeClass(css.selectedHeader);
	}

	/**
	 * header Hover in callback
	 * @param{number} level     axis level/depth. aka the axis index in the axis array.
	 * @param{number} index     index of this header in the parent header
	 * @param{number} isRow     Indicates if the header is on the row or column
	 * @param{HTMLElement} cell The header cell that is being hovered.
	 * @returns {void}
	 */
	headerHoverIn(level, index, isRow, cell) {

		//TODO: update to reuse selection indicator to avoid cost of re-creating each time.

		const {data} = this.correlation;
		const panel  = isRow ? this.grid.rowHeaders : this.grid.columnHeaders;

		const lastCellRect = this.grid.cells.getCellBoundingRect(this.grid.rows.length - 1, this.grid.columns.length - 1);
		const tableDiv     = this.grid.hostElement;
		const tableDivRect = tableDiv.getBoundingClientRect();

		// Find the border width
		const borderProperty     = isRow ? "border-bottom-width" : "border-right-width";
		const elementBorderWidth = parseFloat($(cell).css(borderProperty));

		let elementRect = cell.getBoundingClientRect(); // this is the real bounds of the cell (possibly merged)

		// Note: the browser might not accept the actual width we specify, so set it then retrieve
		// it to find the real width that will be used.
		let selectionBorder = THIN_BORDER * (data.axes.length - level);
		let selectionNode   = $(`<div class="${css.selectionBox}" style="position:absolute;" </div>`);
		$(selectionNode).css({borderWidth: selectionBorder + "px"});
		let $relativePostionContainer = $(tableDiv.firstChild)
		$relativePostionContainer.append(selectionNode);
		selectionBorder = parseFloat($(selectionNode).css('borderWidth'));

		// Calculate any offsets that are needed to adjust the x/y values to cover the left/top border
		// also calculate the width adjustment to cover the right/bottom border.
		let xOffset          = 0;
		let yOffset          = 0;
		let widthAdjustment  = 0;
		let heightAdjustment = 0;
		if (isRow) {

			// Level 0 actually owns the left border so no adjustmnet is needed to cover it.
			if (level !== 0)
				xOffset = -selectionBorder;

			yOffset          = -selectionBorder;
			heightAdjustment = -yOffset - elementBorderWidth + selectionBorder;
		}
		else {

			if (level !== 0)
				yOffset = -selectionBorder;

			xOffset = -selectionBorder;

			// Adjust the width to account for the left move (xOffset) then remove the border which
			// might be a thick border to add the border we will actually render
			widthAdjustment = -xOffset - elementBorderWidth + selectionBorder;
		}

		// Calculate positioning and bounds
		// Note: Absolute position takes the parent border into account, e.g. if the parent border is 1px, and we attempt
		// to position at 0,0 the element will actually be positioned at 1,1 so we will need to adjust for the border width.
		const tableBorderWidth = parseFloat($(tableDiv).css("border-left-width"));
		let x                  = (elementRect.left - tableDivRect.left - tableBorderWidth) + xOffset;
		let y                  = (elementRect.top - tableDivRect.top - tableBorderWidth) + yOffset;
		let height             = isRow ? elementRect.height + heightAdjustment : lastCellRect.bottom - elementRect.top;
		let width              = isRow ? lastCellRect.right - elementRect.left : elementRect.width + widthAdjustment;

		$(cell).addClass(css.selectedHeader);

		$(selectionNode).css({left: x + 'px', top: y + 'px', width: width + 'px', height: height + 'px', borderWidth: selectionBorder})

		let rect      = selectionNode.get(0).getBoundingClientRect();
		let panelRect = new Rect(panel.hostElement.parentElement.getBoundingClientRect());
		let clipRect  = this.capRectToBounds(rect, panelRect);

		// Handle the edge condition where we want to show the border even though its beyond the clip rect.
		// Note: Because the selection needs to flow across multiple panels we can't rely on the panel or grid clipping.
		if (rect.left + selectionBorder + 1 >= panelRect.left) {
			clipRect.left -= selectionBorder;
		}

		if (rect.top + selectionBorder + 1 >= panelRect.top) {
			clipRect.top -= selectionBorder;
		}

		// clip the selection in the detail cells panel
		if (isRow) {
			clipRect.right = this.grid.columnHeaders.hostElement.parentElement.getBoundingClientRect().right;
		}
		else {
			clipRect.bottom = this.grid.rowHeaders.hostElement.parentElement.getBoundingClientRect().bottom;
		}

		$(selectionNode).css("clip", `rect(${clipRect.top - rect.top}px, ${clipRect.right - rect.left}px, ${clipRect.bottom - rect.top}px, ${clipRect.left - rect.left}px)`);

		// Draw a second selection box to cover the cells bottom or right border
		selectionNode = $(selectionNode).clone();
		if (isRow) {
			const rightBorder = parseFloat(cell.style.borderRightWidth);
			x                 = (x - xOffset) + elementRect.width - rightBorder;
			$(selectionNode).css({left: x + 'px', width: 0, borderLeftWidth: 0, borderRightWidth: rightBorder})
		}
		else {
			const borderBottom = parseFloat(cell.style.borderBottomWidth);
			y                  = (y - yOffset) + elementRect.height - borderBottom;
			$(selectionNode).css({top: y + 'px', height: 0, borderTopWidth: 0, borderBottomWidth: borderBottom})
		}
		$relativePostionContainer.append(selectionNode);
	}

	/**
	 * header hover out callback. Resets any selections/hover actions that were performed.
	 * @returns {void}
	 */
	headerHoverOut() {
		$(`.${css.selectionBox}`).remove();
		$(".wj-cell").removeClass(css.selectedHeader);
	}

	capRectToBounds(elementRect, bounds) {
		let rect: Rect = new Rect(elementRect);

		rect.left   = Math.max(elementRect.left, bounds.left);
		rect.right  = Math.min(elementRect.right, bounds.right);
		rect.top    = Math.max(elementRect.top, bounds.top);
		rect.bottom = Math.min(elementRect.bottom, bounds.bottom);

		return rect;
	}

	getCellFromRect(elementRect, panel) {
		let panelElementRect = panel.hostElement.parentElement.getBoundingClientRect();
		let rect             = this.capRectToBounds(elementRect, panelElementRect)

		let pointX            = rect.left + Math.max((rect.right - rect.left), 2) / 2;
		let pointY            = rect.top + Math.max((rect.bottom - rect.top), 2) / 2;
		let cell: HTMLElement = document.elementFromPoint(pointX, pointY) as HTMLElement;

		// make sure this is not an element within a cell
		while (cell && !wijmo.hasClass(cell as HTMLElement, 'wj-cell')) {
			cell = cell.parentElement;
		}

		return cell;
	}

	renderToolbar() {
		const {queryResult, queryResult: {arrangement}} = this.props;

		const {Tooltip, AnchorButton, Position} = bp;

		return (<nav className={classNames(bp.Classes.NAVBAR, 'wrap')}>
			<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)}>
				{api.site.activeTool.renderHeaderToolbarItems()}

				<div className={bp.Classes.BUTTON_GROUP}>
					<label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}><FormattedMessage {...queryMessages.arrangement} /></label>
					<Tooltip position={Position.BOTTOM} content={i18n.intl.formatMessage(queryMessages.swapRowsAndColumnsTooltip)}>
						<AnchorButton icon="swap-horizontal" text={i18n.intl.formatMessage(queryMessages.swapRowsAndColumns)} onClick={arrangement.flip}/>
					</Tooltip>
					<Tooltip position={Position.BOTTOM} content={i18n.intl.formatMessage(queryMessages.allToRowsTooltip)}>
						<AnchorButton icon="add-column-left" text={i18n.intl.formatMessage(queryMessages.allToRows)} onClick={arrangement.allToRows}/>
					</Tooltip>
					<Tooltip position={Position.BOTTOM} content={i18n.intl.formatMessage(queryMessages.allToColumnsTooltip)}>
						<AnchorButton icon="add-row-top" text={i18n.intl.formatMessage(queryMessages.allToColumns)} onClick={arrangement.allToColumns}/>
					</Tooltip>
				</div>
			</div>
		</nav>)
	}
}