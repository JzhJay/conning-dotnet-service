/// <reference path="../../lib/wijmo/controls/wijmo.grid.d.ts" />

import * as css from './FlexGridWrapper.css'
import {api, utility} from 'stores';
import {ResizeSensor} from 'utility/resizeSensor';
import {DataWindow} from 'common'
import { observer } from 'mobx-react'

export interface IFlexGrid {
	grid: wijmo.grid.FlexGrid;
}

interface MyProps {
    onInitialized?:(grid:wijmo.grid.FlexGrid) => void;
    ref?:any;
    rowHeaderWidth?:number;
    scrollPositionX?:number;
    scrollPositionY?:number;
    gridOptions?:any;
    gridRightBound?:number;
    rowHeaders?:Array<String>;
    columnHeaders?:Array<String>;
    window?:DataWindow;
    metadata?:any;
    rowCount?:number;
    colCount?:number;
    isReadOnly?:boolean;
    //blur?:boolean;

    clipHeightToContainer?:boolean;
    clipWidthToContainer?:boolean;

    constrainWidthToContainer?:boolean;
    constrainHeightToContainer?:boolean;

    loadingData?:boolean;

    getCellData:(row:number, column:number) => any;

    onMouseEnter?:React.EventHandler<React.MouseEvent<HTMLElement>>;
    onMouseMove?:React.EventHandler<React.MouseEvent<HTMLElement>>;
    onMouseLeave?:React.EventHandler<React.MouseEvent<HTMLElement>>;
    onMouseDown?:React.EventHandler<React.MouseEvent<HTMLElement>>;
    onMouseUp?:React.EventHandler<React.MouseEvent<HTMLElement>>;
    onClick?:React.EventHandler<React.MouseEvent<HTMLElement>>;
    onScroll?:React.EventHandler<React.SyntheticEvent<HTMLElement>>;

    onController ?: (FlexGridWrapperController) => void;

    className?: string;
}

export interface FlexGridWrapperController {
    measureText(text:string, isHeader?:boolean) : number;
    measureTextList(textList: string[], formatHeader?: boolean) : number[];
    onResize();
    renderCells(window?:DataWindow);
}

const MEASUREMENT_PADDDING = 4;

@observer
export class FlexGridWrapper extends React.Component<MyProps, {}> {
    render() {

    	const {className} = this.props;

		// The top level div is REQUIRED to allow this component to react to size changes since the actual wrapper div width/height is set directly during resize and is not responsive.
        return (
        <div className={classNames(css.resizer, className)}>
            <div className={css.flexGridWrapper}
                 ref={ref => this.wrapperDiv = ref}
                 onMouseEnter={this.props.onMouseEnter}
                 onMouseLeave={this.props.onMouseLeave}
                 onMouseDown={this.props.onMouseDown}
                 onMouseUp={this.props.onMouseUp}
                 onClick={this.props.onClick}
                 onScroll={this.props.onScroll}
                 style={{ height: '100%', width: '100%'}}>
            </div>
	    </div>
        )
    }

    wrapperDiv: HTMLDivElement;

    static RowHeaderWidth = 50;

    static DefaultCellWidth = 100;

    static defaultProps = {
        headerWidth: FlexGridWrapper.DefaultCellWidth,
        constrainWidthToContainer: true,
        constrainHeightToContainer: true,
        clipHeightToContainer: true,
        clipWidthToContainer: true,
        isReadOnly: true,
        //blur: true,
    };

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {

        if (this.props.rowCount !== prevProps.rowCount || this.props.colCount !== prevProps.colCount) {
            this.grid.rows.clear();
            this.grid.columns.clear();
            this.createRowsAndColumns(this.props);
        }

        // Note: Deep comparing the headers instead of a shallow object compare because the arrays are calculated entities that might change
	    // however still containing the same values.
        if (!_.isEqual(this.props.rowHeaders, prevProps.rowHeaders) || !_.isEqual(this.props.columnHeaders, prevProps.columnHeaders)) {
            this.createHeaders(this.props);
            this.setRowHeaderWidth(this.props.rowHeaderWidth);
        } else if (this.props.rowHeaderWidth !== prevProps.rowHeaderWidth) {
            this.setRowHeaderWidth(this.props.rowHeaderWidth);
        }

        if (prevProps.window && !prevProps.window.equals(this.props.window) || this.props.window.invalidated) {
            this.renderCells(this.props.window);
        }

        if (this.props.isReadOnly != null) {
            this.grid.isReadOnly = this.props.isReadOnly;
        }

        if (this.props.loadingData) {
            this.grid.refresh(true);
        }

        //this.grid.refresh(true);

        // This is a hack to deal with the flex grid setting itself for 0px during rearrangement.
        if ($(this.wrapperDiv).css('height') === '0px') {
	        $(this.wrapperDiv).css('height', '100%');
        }
        else if (this.$node.css('width') === '0px') {
            $(this.wrapperDiv).css('width', '100%');
        }
    }

    /***
     * This gets called when a new this.props.window is passed down from our parent
     * We tell the grid to repaint and hand it this data when it asks
     * @param gridData
     * @param window
     */
    renderCells = (window?:DataWindow) => {
        if (!window) {
            window = this.props.window;
        }
        if (!window) {
            return;
        }

        let grid = this.grid;

	    grid.deferUpdate(() => {
		    for (let r = window.y; r < window.y + window.rows; r++) {
			    for (let c = window.x; c < window.x + window.columns; c++) {
				    try {
					    let value = this.props.getCellData(r, c);
					    // we reserve null for cells without data

					    // Avoid resetting values that went from defined -> undefined, e.g. was in the cache but now isn't
					    let currentValue = grid.getCellData(r, c, true);
					    if (currentValue && value == null)
					    	continue;

					    grid.setCellData(r, c, value == null ? "" : value);  // gridData[r - window.y][c - window.x]);
				    }
				    catch (error) {
					    console.error(`Error setting cell data at r${r}, c${c}`, error)
				    }
			    }
		    }
	    })
    }

    // pre-set rows and columns
    createRowsAndColumns(props:MyProps) {
        const {rowCount, colCount} = props;

        const grid = this.grid;

	    grid.deferUpdate(function () {
		    // pre-set number of rows
		    if (grid.rows.length === 0) {
			    for (let r = 0; r < rowCount; r++) {
				    grid.rows.push(new wijmo.grid.Row());
			    }
			    // set width of row header
			    grid.rowHeaders.columns[0].width = FlexGridWrapper.RowHeaderWidth;
		    }

		    // pre-set number of columns
		    if (grid.columns.length === 0) {
			    for (let c = 0; c < colCount; c++) {
				    grid.columns.push(new wijmo.grid.Column());
			    }
		    }
	    })
    }

    public grid:wijmo.grid.FlexGrid;

    // refs:{
    //     [key:string]:(Element);
    //     grid:(HTMLDivElement);
    // }

	/* Removing Blur
    cellItemFormatter = (grid:wijmo.grid.FlexGrid, e:wijmo.grid.FormatItemEventArgs) => {
        if (this.props.blur) {
            // When the cell is undefined, lets recycle the last rendered data and blur it to give the appearance
            // of smoother and faster scrolling.
            let cellValue = e.panel.getCellData(e.row, e.col, false);
            if (e.panel.cellType === wijmo.grid.CellType.Cell && (cellValue === undefined || cellValue == null)) {
                let range = this.grid.viewRange;
                let window = this.props.window;

                if (window != null && window !== undefined) {
                    // Recycle the starting values when before the window, otherwise use the last numbers
                    // This way we use dummy values that are closest in proximity to the real values.
                    let windowOffsetX = (e.col > window.x) ? window.columns - range.columnSpan : 0;
                    let windowOffsetY = (e.row > window.y) ? window.rows - range.rowSpan : 0;

                    let r = e.row % range.rowSpan + window.y + windowOffsetY;
                    let c = e.col % range.columnSpan + window.x + windowOffsetX;

                    let value = e.panel.getCellData(r, c, false);

                    e.cell.innerHTML = value;
                    $(e.cell).addClass('blur');
                }
            }
            else {
                $(e.cell).removeClass('blur')
            }
        }
    };
   	*/

    private $container:JQuery;
    private $node:JQuery;

	private $cellDiv:JQuery;
	private $rowHeaderDiv:JQuery;
	private $columnHeaderDiv:JQuery;
	private $gridHost:JQuery;

	onResizeDebounced = _.debounce(() => {
		this.grid && this.onResize();
	}, 0, {leading: false});

	onResize = () => {
    	const {clipHeightToContainer, clipWidthToContainer, gridRightBound, constrainWidthToContainer, constrainHeightToContainer} = this.props;
        const {grid, $gridHost, $container, $cellDiv, $rowHeaderDiv, $columnHeaderDiv} = this;

        const containerWidth = $container.width();
        const containerHeight = $container.height();

        const containerRect = $container[0].getBoundingClientRect();

        //$node.removeClass('max--width', 'max-height', 'width', 'height');

        let cssProps = {};


        if (constrainHeightToContainer) {
            Object.assign(cssProps, {"max-height": Math.min($cellDiv.height() + $columnHeaderDiv.height() + api.site.horizontalScrollbarHeight + 2, containerHeight)});
        }

        if (constrainWidthToContainer) {
            Object.assign(cssProps, {"max-width": Math.min($cellDiv.width() + $rowHeaderDiv.width() + api.site.verticalScrollbarWidth + 2, containerWidth)});
        }

        if ((clipHeightToContainer || clipWidthToContainer) && (grid.rows.length > 0 && grid.columns.length > 0)) {
        	// Clip the height to the window height to enable virtualization
            const lastCellRect = grid.cells.getCellBoundingRect(grid.rows.length - 1, grid.columns.length - 1);

            //console.debug(`this.grid.cells.getCellBoundingRect(${grid.rows.length - 1}, ${grid.columns.length - 1})`)
            if (clipHeightToContainer) {
                if (lastCellRect.bottom - containerRect.top > containerHeight) {
                    Object.assign(cssProps, {height: containerHeight});
                }
                else {
                    Object.assign(cssProps, {height: ''});
                }
            }

            if (clipWidthToContainer) {
                // Clip the width to the bounds or to the last cell
                if (gridRightBound && lastCellRect.right - containerRect.left > containerWidth)
                    Object.assign(cssProps, {width: containerWidth});
                else {
                    Object.assign(cssProps, {width: ''});
                }
            }
        }
        else {
            Object.assign(cssProps, {width: '100%', height: '100%'});
        }

        $gridHost.css(cssProps);
		grid.invalidate();
    }

    node:Node;
    sensor:ResizeSensor;

    componentDidMount() {

        this.node = ReactDOM.findDOMNode(this);
        this.$node = $(this.node);

        const {$node, node, props, props: {rowHeaderWidth}} = this;

        this.$container = $node.parent();

        const grid = this.grid = new wijmo.grid.FlexGrid(this.wrapperDiv, props.gridOptions);

		grid.rows.defaultSize = utility.FlexGridRowDefaultHeight;

		grid.beginUpdate();
        this.createRowsAndColumns(props);

        this.createHeaders(props);
        grid.autoSizeColumn(0, true);

        this.$gridHost = $(grid.hostElement);

        if (rowHeaderWidth) {
            this.setRowHeaderWidth(rowHeaderWidth);
        }

        grid.endUpdate();


        // If this is our initial render, notify the outside world
        let first = true;
        grid.onUpdatedView = () => {
            if (first) {
                first = false;
                if (props.onInitialized) {
                    props.onInitialized(grid);
                }
            }
        }

        // prevent grid from selecting when dragging rows
        grid.hostElement.addEventListener('mousedown', this.onMouseDown, true);

	    this.$cellDiv = $node.find("[wj-part=root] > .wj-cells");
	    this.$rowHeaderDiv = $node.find('[wj-part=rh]');
	    this.$columnHeaderDiv = $node.find('[wj-part=ch]');

	    this.sensor = new ResizeSensor(this.node, this.onResizeDebounced);

	    if (this.props.onController) {
		    this.props.onController({
			    measureText: this.measureText,
			    measureTextList: this.measureTextList,
			    onResize: this.onResize,
			    renderCells: this.renderCells
		    })
	    }

	    this.renderCells();
    }

    onMouseDown =  (e:MouseEvent) => {
		const hit = this.grid.hitTest(e);

		if (hit.cellType== wijmo.grid.CellType.RowHeader || hit.cellType === wijmo.grid.CellType.ColumnHeader) {
			e.stopPropagation();
		}
		// If they right-clicked on a cell and we support selection and the cell isn't selected
		else if (
			// Right-click
		e.button === 2
		// On a cell
		&& hit.cellType === wijmo.grid.CellType.Cell
		// That supports selection
		&& (this.props.gridOptions.selectionMode === wijmo.grid.SelectionMode.CellRange || this.props.gridOptions.selectionMode === wijmo.grid.SelectionMode.Cell)

		// And nothing is selected or the cell itself is not selected
		&& (!this.grid.selection.isValid || !this.grid.selection.contains(hit.row, hit.col))
		) {
			this.grid.select(hit.range);
		}
	};

    createHeaders = (props:MyProps) => {
        const {rowHeaders, columnHeaders} = props;

        for (let h = 0; h < 2; h++) {
            if ((h === 0 && !rowHeaders) || (h === 1 && !columnHeaders))
                continue;

            const isRowHeader = (h === 0);
            const header = isRowHeader ? this.grid.rowHeaders : this.grid.columnHeaders;
            const headerProps = isRowHeader ? rowHeaders : columnHeaders;

            for (let i = 0; i < headerProps.length; i++) {
                if (isRowHeader) {
                    header.setCellData(i, 0, headerProps[i]);
                    header.rows[i].align = "center";
                    //header.rows[i].allowSorting = false;
                }
                else {
                    header.setCellData(0, i, headerProps[i]);
                    header.columns[i].align = "center";
                    header.columns[i].allowSorting = false;
                }
            }
        }

        for (let c = 0; c < this.grid.columns.length; c++) {
            this.grid.columns[c].width = this.props.rowHeaderWidth ? this.props.rowHeaderWidth : FlexGridWrapper.DefaultCellWidth;
        }
    }

    setRowHeaderWidth(headerWidth:number) {
        if (headerWidth) {
            for (let i = 0; i < this.grid.rowHeaders.columns.length; i++) {
                this.grid.rowHeaders.columns[i].width = headerWidth;
            }

            this.onResize();
        }
    }

    componentWillUnmount() {
		this.grid.hostElement.removeEventListener('mousedown', this.onMouseDown, true);
		this.grid.dispose();  // dispose of FlexGrid to avoid memory leaks.
        this.sensor.detach();

        this.grid = null;
	    this.$container = null;
        this.$node = null;
	    this.$cellDiv = null;
	    this.$rowHeaderDiv = null;
	    this.$columnHeaderDiv = null;
	    this.$gridHost = null;
    }


    measureText = (text:string, isHeader?:boolean) => {
        const tempDomNode =
            $(`<div class="${classNames('wj-cell', {'wj-header': isHeader})}">${_.escape(text)}</div>`)
                .attr(wijmo.grid.FlexGrid._WJS_MEASURE, 'true')
                .css('visibility', 'hidden')
                .prependTo(this.grid.hostElement)

        const outerWidth = tempDomNode.outerWidth(true);

        const width = Math.ceil(outerWidth) + MEASUREMENT_PADDDING;

        tempDomNode.remove();

        return width;

    }

	measureTextList = (textList: string[], formatHeader: boolean = true) => {
    	const distanceFromLongest = 3;
    	const container = document.createElement("div");
		container.style.visibility = 'hidden';

		// Sample the possibly large text list by replacing 1-9 with 0s (which assumes that digits are monospaced),
		// and only measure text that have lenghts within a specified distance of the longest text.
		const uniques = _.uniq(textList.map(text => text.replace(/[1-9]/g, '0')));
		let lengthOfLongest = 0;
		uniques.forEach(text => {
			if (text.length > lengthOfLongest) {
				lengthOfLongest = text.length;
			}
		})
		const sampledList = uniques.filter(text => text.length >= lengthOfLongest - distanceFromLongest);

		sampledList.forEach((text, i) => {
		    const textDiv = document.createElement("div");
		    textDiv.className = classNames('wj-cell', {'wj-header': formatHeader && i == 0});
		    textDiv.setAttribute(wijmo.grid.FlexGrid._WJS_MEASURE, 'true');
		    textDiv.appendChild(document.createTextNode(text));
    		container.appendChild(textDiv);
	    });

		this.grid.hostElement.appendChild(container);
    	const widths = Array.from(container.children).map((c: any) => Math.ceil(c.offsetWidth) + MEASUREMENT_PADDDING)
		container.remove();

		return widths;
	}
}
