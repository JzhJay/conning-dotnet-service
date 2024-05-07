import type {IconName} from '@blueprintjs/core';
import {TableCopier} from 'components/system/userInterfaceComponents/Table/TableCopier';
import { computed, observable, action, reaction, toJS, makeObservable, autorun } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {BlueprintDialog, bp, CopyLocationContextMenuItem, LoadingUntil, ResizeSensorComponent} from 'components/index';
import {createBusyAction, createDisposableTimeout} from 'utility';
import {api, i18n, site, utility} from '../../../../stores';
import {findOption} from '../../IO/internal/inputs/utility';
import {InputTableCellFormatter} from './InputTableCellFormatter';
import {InputTableGridHandler} from './InputTableGridHandler';
import {InputTableMergeManager} from './InputTableMergeManager';
import {input, Header, HeaderEntry} from './TableHeaderSpecification';

import * as css from './InputTable.css';

interface MyProps {
	userInterface: any;
	data: any;
	globalLists?: any;
	axes?: any;
	path?: string; // Path of the parent in the full input structure. Used to look up validation messages.
	validationMessages?: any;
	flipPrimary?: boolean; // Allows fetching/saving via secondary.primary path instead of normal primary.secondary. Useful for tables where primary is on columns yet data is stored row major.

	title?: string | JSX.Element;
	showToolbar?: boolean;
	sortableColumns?: string[] | boolean;
	enableCopyPaste?: boolean;
	translateCellValue?: (path: string[], value: string, headerEntry: HeaderEntry) => any;

	onPastingCell?: (e: wijmo.grid.CellRangeEventArgs) => boolean;
	onUpdateValue?: (updateValue: object, updatePath: string) => void;
	onDeleteRows?: (records: object[]) => Promise<void>;
	onInsertRows?: (index: number, numItems: number) => Promise<void>;
	onUpdateAxis?: (update) => void;
	onInvalidate?: () => void;
	onSelect?: (path: string[], isDefaultSelection: boolean) => void;

	extendToolbarMenus?: string | JSX.Element;
	extendContextMenus?: string | JSX.Element;

	itemFormatter?: (inputValue: object, cellPath: string, cell:HTMLElement, headerEntry: HeaderEntry) => void;

	shouldRender?: () => boolean;
	dataWithIndex?: boolean;
	className?: string;
	maxTableHeight?: string;

	isDetailTable?: boolean;
	override?: {saveEdit?: (r:number, c:number, value: any) => void };

	defaultSelection?: {row: number, column: number};
}


// Clip messages and type validations - cellEditEnding
//editable and expandable columns/rows - be sure not to apply editable to header when example since it really belongs on children.
//Page wrapper for scrolling and invalidation
//Batch paste
//Tasked: Insert row/column before after
// Selection resets after edit
// Invert table via toolbar
// Support template (dropdown in particular) on any cell in a cross. Currently template is stored on header node which means it will apply across entire row/column
// Resetting the source collection in the reaction causes pending edit state and dropdowns to be dismissed.
// Resize width to fit page
// Tasked: Honor min/max values
// Add row/column to cross


@observer
export class InputTable extends React.Component<MyProps, {}> {
    static ICONS = {
		ADD: "add" as IconName,
		INSERT_BEFORE: "add-row-top" as IconName,
		INSERT_AFTER: "add-row-bottom" as IconName,
		REMOVE: "delete" as IconName,
		SORT_UNSET: "sort" as IconName,
		SORT_ASC: "sort-asc" as IconName,
		SORT_DESC: "sort-desc" as IconName,
		DROPDOWN: "caret-down" as IconName
	}
    static DATA_INDEX_KEY = "___dataIndex";
	static SPECIAL_DROPDOWN_OPTION_NAME = "___newItemTemplateItem___";

    static defaultProps = {
		onInvalidate: () => {},
		shouldRender: () => true,
	};

    grid: wijmo.grid.FlexGrid;
	isEmptyGridData: boolean = true;
	itemsSource;
    selectedRow = null;
	_disposableTimeout = createDisposableTimeout();
    _toDispose = [];
    clippedMessages = {};
    firstGridUpdate = true;
	gridHandler: InputTableGridHandler = null;
	tableCopier: TableCopier = null;
    headerChanged: boolean = false;
    componentId = uuid.v4();

    @observable _loaded = false;
    @observable hasSelectedCell = false;
	insertMenuItems = _.range(1, 10).concat(_.range(10, 110, 10));

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);

	    this._toDispose.push(autorun(r => {
	    	//r.trace(true);
	    	// Dummy autorun to make sure MobX tracks changes to gridData. Otherwise gridData might be recomputed multiple times until it is tracked via a reaction or autorun
		    this.gridData;
	    }))
		this._toDispose.push(this._disposableTimeout.dispose);
	    this.itemsSource = new wijmo.collections.CollectionView(toJS(this.gridData));
    }

    @computed get loaded() {
		return this._loaded && !this._isHeaderAutoSizing && !this._isColumnAutoSizing;
	}

    componentDidMount() {
		this._toDispose.push(reaction(() => this.gridData, (gridData, r) => {
			//r.trace();
			const selection = this.grid.selection;
			const {itemsSource} = this;
			if (!this.firstGridUpdate && gridData.length > 0 && itemsSource.sourceCollection.length == gridData.length && Object.keys(itemsSource.sourceCollection[0]).length == Object.keys(gridData[0]).length) {

				// Update itemSource with new data. This is preferred to replacing the sourceCollection because it prevents a full grid invalidation which loses the active edit states.
				this.itemsSource.deferUpdate(() => {
					gridData.forEach((row, rowIndex) => {
						Object.keys(row).forEach(columnKey => {
							let item = this.itemsSource.items[rowIndex];
							this.itemsSource.editItem(item);
							item[columnKey] = row[columnKey];
						})
					});
					//this.itemsSource.commitEdit();
				})
				this.itemsSource._edtItem = null; // Clear edit item to prevent FlexGrid from committing edit on selection change and update collection
			}
			else
				this.itemsSource.sourceCollection = toJS(this.gridData);

			this.updateRowSettings();

			if (selection?.isValid)
				this.grid.selection = selection;

			this.formatter?.cache && this.formatter.cache.clear();
			this.autoSizeColumns(true);
			this.firstGridUpdate = false;
		}));

		this._toDispose.push(reaction(() => this.changeableHeaderKeys, () => {
			if (!this.grid || this.headerChanged) {
				this.headerChanged = false;
				return;
			}
			action(() => this._loaded = false)();
			const savedScrollPosition = this.grid.scrollPosition;
			this.grid = null;
			this.componentId = uuid.v4();
			this._disposableTimeout.setTimeout(() => this.grid && (this.grid.scrollPosition = savedScrollPosition), 100);
		}));
    }

    savedChangeableHeaders = null;
    @computed get changeableHeaderKeys() {
		let rtnList = [];

		this.columnHeaders && this.columnHeaders.forEach((column) => {
			rtnList.push(column[column.length - 1].label);
		})

		this.rowHeaders && this.rowHeaders.forEach((row) => {
			rtnList.push(row[row.length - 1].label);
		});

		if (this.savedChangeableHeaders && rtnList.length == this.savedChangeableHeaders.length && !rtnList.filter( (d, i) => d !== this.savedChangeableHeaders[i] ).length ) {
			return this.savedChangeableHeaders;
		}
		this.savedChangeableHeaders = rtnList;
		return rtnList;
	}

	get isHideHeaders() {
		return _.get(this.props.userInterface, "hints.hideHeaders", false);
	}

	get isDynamicStructureTable() {
		return _.get(this.props.userInterface, "hints.dynamicStructure", false);
	}

    get isInverted() {
		return _.get(this.props.userInterface, "hints.dimension", 2) === 2;
	}

    get isReadOnly() {
		return this.props.userInterface?.readOnly === true || this.props.onUpdateValue == null;
	}

    get canInsert() {
		return this.props.onInsertRows != null || this.isExpandable;
	}

    get canDelete() {
		return this.props.onDeleteRows != null || this.isExpandable;
	}

    get canSort() {
		return !!(this.sortableColumns?.length);
	}

    get enableCopyPaste() {
		return this.props.enableCopyPaste !== false;
	}

    get dataWithIndex() {
		return this.props.dataWithIndex !== false;
	}

    /* sort */
    @observable sortedColumn:{ entry: HeaderEntry, direction: 'asc'|'desc'} = { entry: null, direction: 'asc'};

    @computed get sortableColumns(): HeaderEntry[] {
		const sortableColumns = this.props.sortableColumns;
		if (sortableColumns === false || this.props.showToolbar === false) {
			return [];
		}
		const columnHeaderEntries = _.map(this.columnHeaders, (ch) => _.last(ch));

		if (sortableColumns !== true && sortableColumns != null) {
			return columnHeaderEntries.filter((entry) => _.some(sortableColumns as string[], s => s == entry.name));
		}
		return columnHeaderEntries;
	}

    @action setSortKey = (entry: HeaderEntry) => {
		const sortedColumn = this.sortedColumn;
		if (!sortedColumn.entry || sortedColumn.entry.name != entry.name) {
			sortedColumn.entry = entry;
			sortedColumn.direction = 'asc';
		} else if(sortedColumn.direction == 'asc') {
			sortedColumn.direction = 'desc';
		} else {
			sortedColumn.entry = null;
		}
	}

    @computed get expandedFields() {
		return input(this.props.userInterface, this.props.globalLists, this.props.axes);
	}

    getFields(isRow: boolean) {
		const node = isRow ? this.findDimensionNode(1, this.expandedFields) : this.findDimensionNode(2, this.expandedFields);
		return node ? node.options : null;
	}

    findDimensionNode(dimension: number, node: any) {
		let matches = [];

		const inner = (parent, node, currentDimension) => {
			if (currentDimension === dimension) {

				// Add new matches that aren't duplicates
				if (matches.find(match => match.name == node.name) == null) {
					matches.push(_.cloneDeepWith(node, (value, key, object) => {
						if ((key === "options" || key == "children") && object?.hints?.dimension) {
							return null;
						}
					}));
				}
			}
			else {
				if (node.children) {
					for (let o of node.children) {
						inner(node, o, node?.hints?.dimension || currentDimension);
					}
				}

				if (parent == null && node.children == null && node.template) {
					// If the top level node is expandable (has a template) then we need to look at the template to find the child nodes
					for (let o of node.template.children) {
						inner(node, o, node?.hints?.dimension || currentDimension);
					}
				}
			}
		}

		inner(null, node, null);

		return matches.length > 0 ? {options: matches} : null;
	}

    getHeaders(tFields) {
		const depth           = this.maxHeaderDepthFromFields(tFields);
		let headers: Header[] = [];

		const createHeader = (ancestors: any[], object) => {
			let header = [...ancestors, ..._.range(depth - ancestors.length).map(_ => object)];
			_.last(header).pathStop = ancestors.length + 1;
			return header
		}

		const addHeader = (ancestors: any[], node) => {
			if (node.children && node.children.length > 0) {
				node.children.forEach( n => addHeader([...ancestors, node], n));
			}
			else {
				const parent = ancestors.slice(-1)[0];

				if (node.name == null) {
					const previousLast = ancestors.pop();
					headers.push(createHeader(ancestors, previousLast));
				}
				else
					headers.push(createHeader(ancestors, node));
			}
		}

		tFields.forEach(field => addHeader([], field));

		// Flexgrid does not automatically resize when columns are removed or added. Trigger explicit resize after update.
		if (this.grid)
			this._disposableTimeout.setTimeout(() => this.autoSizeHeader(), 100);

		return headers;
	}

    getHeaderLeaf(row: number, col: number): HeaderEntry {
		let {columnHeaders, rowHeaders} = this;
		const headerEntryLeaf = Object.assign({}, columnHeaders && _.last(columnHeaders[col]), rowHeaders && _.last(rowHeaders[row]));

		return headerEntryLeaf.template || headerEntryLeaf;
	}

    get useCustomField() {
		return !this.isTable;
	}

	get enableQuickAutoSize() {
		// quickAutoSize speeds up rendering by writing cell values to a canvas and measuring it.
		// However, this only works when the grid is able to get the formatted cell value from panel.getCellData().
		// Since the grid only knows about the cell value and not the cell label for custom dropdowns we are unable to utilize the quick autosizing (it won't size correctly).
		// If we need this performance improvement for custom dropdowns in the future, we can override grid._getWidestRow() and update that to use the dropdown label instead
		// of the dropdown value. For now, we only need custom dropdowns in slots/crosses and those are normally pretty small grids.
		return !this.useCustomField;
	}

    updateRowSettings() {
		if (this.rowHeaders && this.grid) {
			this.rowHeaders.forEach((rowHeader, i) => {
				let row = this.grid.rows[i];
				const leaf = _.last(rowHeader);
				row.visible = leaf.applicable !== false;

				const template = (leaf.template || leaf);
				const format = this.getFormatFromHeader(template);
				if (format)
					row.format = format;
			})
		}
	}

    @computed get columnHeaders(): Header[] {
		const columnInterface = this.getFields(false);
		return columnInterface ? this.getHeaders(columnInterface) : null;
	}

    @computed get rowHeaders(): Header[] {
		const rowInterface = this.getFields(true);
		return rowInterface ? this.getHeaders(rowInterface) : null;
	}

    @computed get hasYAxis() {
		return this.rowHeaders?.length > 0;
	}

    getPrimaryHeader(row, col) {
		return this.isInverted ? this.columnHeaders[col] : this.rowHeaders[row];
	}

    @computed get isRowPrimary() {
		return !this.isInverted;
	}

    @computed get primaryHeaders() {
		return this.isInverted ? this.columnHeaders : this.rowHeaders;
	}

    @computed get secondaryHeaders() {
		return this.isInverted ? this.rowHeaders : this.columnHeaders;
	}

    @computed get isExpandable() {
		if (!this.primaryHeaders) {
			return false;
		}
		return _.last(this.primaryHeaders[0]).isExpandableOnAlternate || this.expandableAxis != null;
	}

    @computed get expandableAxis() {
		return _.last(this.primaryHeaders[0]).axis || this.props.userInterface.axis;
	}

    @computed get expandableLength() {
		return this.isRowPrimary ? this.grid.columns.length : this.grid.rows.length;
	}

    @computed get isSlot() {
		// If there is no secondary header and the primary is not expandable then the table is a slot
		return this.secondaryHeaders == null && !this.isExpandable && !this.isInverted;
	}
	@computed get hasArrayData() {
		// Detect if this structure can have multiple rows or columns by virtue of having an array.
		return this.props.data && Array.isArray(this.deepestArrayInNode(this.props.data));
	}

    @computed get isCross() {
		return this.rowHeaders && this.columnHeaders;
	}

    @computed get isTable() {
		return this.columnHeaders && !this.rowHeaders;
	}

	@observable forceRowDetailView: boolean = false;
	@computed get canForceRowDetailView() {
		return this.isTable && _.get(this.props.userInterface, "hints.rowDetailView", "") == "auto";
	}

	@computed get canRowDetailView() {
		return this.isTable && (
			(this.canForceRowDetailView && this.forceRowDetailView) ||
			(_.get(this.props.userInterface, "hints.rowDetailView", false) === true)
		);
	}

    rowOrColumnLabel = (single:boolean = true) => {
		if (single === true ) {
			return this.isRowPrimary ?
			       i18n.intl.formatMessage({defaultMessage: "Column", description: "[InputTable] the primary axis label for the table (single)"}) :
			       i18n.intl.formatMessage({defaultMessage: "Row", description: "[InputTable] the primary axis label for the table (single)"});
		}
	    if (single === false ) {
		    return this.isRowPrimary ?
		           i18n.intl.formatMessage({defaultMessage: "Columns", description: "[InputTable] the primary axis label for the table (multiple)"}) :
		           i18n.intl.formatMessage({defaultMessage: "Rows", description: "[InputTable] the primary axis label for the table (multiple)"});
	    }
	    return this.isRowPrimary ?
	           i18n.intl.formatMessage({defaultMessage: "Column(s)", description: "[InputTable] the primary axis label for the table"}) :
	           i18n.intl.formatMessage({defaultMessage: "Row(s)", description: "[InputTable] the primary axis label for the table"});
	}

    get flipPrimary() {
		// The default assumption is that Arrays is the inner dimension in tables and slots, however if the data is structured with arrays
		// as the outer layer then the primary and secondary paths should be flipped.
		return this.props.flipPrimary || Array.isArray(this.props.data);

	}

    isEditable(row, col) {
		if (this.isEmptyGridData) {
			return false;
		}

		const path = this.getFullPath(row, col);
		const headerLeaf = this.getHeaderLeaf(row, col);

	    if (this.isRowPrimary) {
		    const rowHeader = _.last(this.rowHeaders[row]) as any;
		    if ((rowHeader.template || rowHeader).readOnly === true) {
			    return false;
		    }
	    }
	    if (headerLeaf.minimum != null && headerLeaf.minimum === headerLeaf.maximum)
			return false;
		else if (this.isCross)
			return findOption(this.expandedFields, path.split(".")) != null;
		else if (this.isExpandable && !headerLeaf.allowNull)
			return this.gridData[row][col] != null;
		else
			return true;
	}

    isDateType(header: HeaderEntry) {
		return !!header?.hints?.date;
	}

    isHeaderExpandableParent(header: HeaderEntry) {
		return header.inputType === "expandable" && !header.isExpandableOnAlternate;
	}

    isHeaderExpandableChild(header: HeaderEntry) {
		return header.parentAxis != null && header.editable;
	}

    getFullPath(r, c, considerSort = false, considerPrimaryFlip = true) {
		const rowHeaderPath = this.rowHeaders && r < this.rowHeaders.length && this.headerPath(true, this.rowHeaders[r]);
		const colHeaderPath = this.columnHeaders && c < this.columnHeaders.length && this.headerPath(false, this.columnHeaders[c]);
		let primary = null, secondary = null;

		// Use either the secondary path or the row/col index if there is no secondary header.
		if (this.isInverted) {
			primary = colHeaderPath;
			secondary = this.rowHeaders == null ? r : rowHeaderPath;
		}
		else {
			primary = rowHeaderPath;
			secondary = this.columnHeaders == null ? c : colHeaderPath;
		}

		let path = (this.isCross || this.hasArrayData) ? ((considerPrimaryFlip && this.flipPrimary) ? secondary + "." + primary
																									: primary + "." + secondary)
													   :  primary;

		// If the grid is sorted we need to update the path to point to the correct location in the unsorted data source.
		if (considerSort) {
			const pathSplit = path.split(".");
			const gridData = _.get(this.gridData, pathSplit[0]);
			path = gridData != null ? [_.get(gridData, InputTable.DATA_INDEX_KEY, pathSplit[0])].concat(pathSplit.slice(1)) : pathSplit;
		}

		return path;
	}

	getLocationPath(r, c): string[] {
		const path = this.getFullPath(r, c, false, false).split(".");
		const userInterface = this.props.userInterface;
		let locationPath = [...(userInterface.locationPath || [])];
		let currentOption = userInterface;
		for (const p of path) {
			if (currentOption.inputType == "expandable") {
				// This portion of the path represents the index into the expandable/array structure
				currentOption = currentOption.options[0].name == null ? currentOption.options[0] : {options: currentOption.options};
				locationPath.push(p);
			} else if (currentOption.options) {
				currentOption = currentOption.options.find(o => o.name == p);
				if (currentOption != null)
					locationPath.push(currentOption.title);
				else
					locationPath.push(p);
			} else {
				locationPath.push(p);
			}
		}

		return locationPath;
	}

	deepestArrayInNode(node) {
		// Find lowest array for non object node
		while (node != null && !(Array.isArray(node) && (!node.length || !Array.isArray(node[0]))) && typeof (node) === "object") {
			node = Object.values(node)[0];
		}

		return node;
	}

    baseNodeLength(node) {
		node = this.deepestArrayInNode(node);
		length = Array.isArray(node) ? node.length : 1;

		return length;
	}

    @computed get gridData() {
		const data = this.props.data;
		const rowHeaders = this.rowHeaders;
		const columnHeaders = this.columnHeaders;

		let gridData = [];
		let rowLength = rowHeaders == null ? this.baseNodeLength(data) : rowHeaders.length;
		let columnLength = columnHeaders == null ? this.baseNodeLength(data) : columnHeaders.length;

		for (let r = 0; r < rowLength; r++) {
			let dataRow: any = {};

			// Add existing data
			for (let c = 0; c < columnLength; c++) {
				const path = this.getFullPath(r, c);
				let cellData = _.has(data, path) ? _.get(data, path) : null;

				// temp code for recalibration
				if (cellData != null && typeof(cellData) === "object") {
					cellData = (cellData as any).value;
				}
				const columnHeader = columnHeaders ? _.last(columnHeaders[c]) : null;
				const rowHeader = rowHeaders ? _.last(rowHeaders[r]) : null;

				if (cellData == null) {
					dataRow[c] = null;
				} else if (columnHeader?.isPercentage || rowHeader?.isPercentage) {
					dataRow[c] = (cellData as number) * 100;
				} else if (this.isDateType(columnHeader) || this.isDateType(rowHeader)) {
					const isInteger = (columnHeader.inputType == "integer") || (rowHeader.inputType == "integer");
					if ( isInteger ) {
						const matchAry = `${cellData}`.match(/^(\d{3,4}?)(1[0-2]|0?[1-9])(3[0-1]|[12][0-9]|0?[1-9])$/);
						dataRow[c] = matchAry ? new Date(`${matchAry[1]}-${matchAry[2]}-${matchAry[3]}`) : null;
					} else {
						dataRow[c] = new Date(cellData);
					}
				} else {
					dataRow[c] = cellData;
				}

			}
			gridData.push(dataRow);
		}

		if (this.canSort && !this.hasYAxis) {
			const sortEntry = this.sortedColumn?.entry;
			if (sortEntry) {
				const sortIndex = _.findIndex(columnHeaders, (headers) => _.some(headers , header => header.name == sortEntry.name));
				if (sortIndex >= 0) {
					_.forEach(gridData, (data, i) => data[InputTable.DATA_INDEX_KEY] = `${i}`);
					const inputType = this.sortedColumn.entry.inputType;
					const isNumeric = ['integer', 'float'].indexOf(inputType) >= 0;
					gridData.sort((a, b) => {
						let d_a: any = _.toString(_.get(a, sortIndex));
						let d_b: any = _.toString(_.get(b, sortIndex));
						if (isNumeric) {
							d_a = parseFloat(d_a);
							d_b = parseFloat(d_b);
						}
						return (d_a > d_b ? 1 : -1) * (this.sortedColumn.direction == 'asc' ? 1 : -1);
					})
				}
			}
		}

		this.isEmptyGridData = gridData.length == 0;
		if (this.isHideHeaders && this.isEmptyGridData) {
			gridData.push({});
		}
		return gridData;
	}

    @computed get gridColumns() {
		const headers = this.columnHeaders;

		return headers && headers.map((column, i) => {
			const leaf = _.last(column) as any;
			const template = (leaf.template || leaf);
			const format = this.getFormatFromHeader(template);

			let dataType;
			if (template.inputType == "boolean") {
				dataType = wijmo.DataType.Boolean;
			} else if (this.isDateType(template)){
				dataType = wijmo.DataType.Date;
			}

			return {
				header: leaf.label,
				binding: i.toString(),
				wordWrap: true,
				quickAutoSize: this.enableQuickAutoSize,
				visible: leaf.applicable !== false,
				allowSorting: false,
				isRequired: !template.allowNull,
				isReadOnly: template.readOnly === true,
				maxWidth: template.showDropDown || template.inputType === "string" ? 500 : 200,
				dataMapEditor: !this.useCustomField && template.showDropDown ? 'DropDownList' : null,

				...(dataType ? {dataType: dataType} : {}),
				...(format ? {format} : {})
			}
		});
	}

    getFormatFromHeader(header: HeaderEntry) {
		if (header.isPercentage || header.inputType === "float") {
			return (_.isFinite(header.hints?.decimalPlaces) ? `F${header.hints.decimalPlaces}` : "F2")
		} else if (this.isDateType(header)) {
			return header.hints.date === true ? 'yyyy-MM-dd' : `${header.hints.date}`;
		} else if (this.useCustomField && header.showDropDown) {
			return `customDropdown_${header.name}`;
		}
    	return null;
	}

    onResize = _.debounce(() => {
		if (this.grid) {
			this.grid.refresh(true); // Works better with a refresh prior to resizing. Without refresh headers still sometimes are cutoff
			this.autoSizeHeader();
		}
	}, 100);

    objectFromPath(path: string[], value) {
		return path.reverse().reduce((accum, current) => ({[current]: accum}), value);
	}

	clearSelection = () => {
		this.grid.select(-1, -1);
	}

    insertItems = createBusyAction(async (startIndex: number, numItems: number = 1) => {
		this.props.onInsertRows && (await this.props.onInsertRows(startIndex, numItems));
		if (this.props.onUpdateAxis) {
			const startingColumnCount = this.grid.columnHeaders.columns.length;
			await this.insertCoordinates(this.expandableAxis, startIndex, numItems);

			// Update the column if the grid didn't automatically do so. For some reason Flexgrid will automatically generate the first column
			// but not others.
			if (this.isRowPrimary && startingColumnCount == this.grid.columnHeaders.columns.length) {
				this.updateHeadersFromInsertOrDelete(startIndex, numItems, true, true);

				for (let i = 0; i < numItems; i++)
					this.autoSizeColumn(startIndex + i);
			}
		}
	})

    deleteSelectionItems = createBusyAction(async () => {
		if (!this.canDelete) {
			return;
		}

		const selection      = this.grid.selection;
		let start            = this.isRowPrimary ? selection.leftCol : selection.topRow;
		let end              = this.isRowPrimary ? selection.rightCol : selection.bottomRow;

		if (start < 0) {
			site.toaster.show({
				intent: bp.Intent.WARNING,
				message: i18n.intl.formatMessage({
					defaultMessage: "No Selected {rowOrColumnLabel}",
					description: "[InputTable] delete failed message."
				}, {rowOrColumnLabel: this.rowOrColumnLabel(null)}),
				timeout: 5000
			});
			return;
		}
		//site.confirm(`Delete ${end - start + 1} ${rowOrColumnLabel}?`).then(() => {

		if (this.props.onDeleteRows) {
			let datas = [];
			for (let i = start; i <= end; i++) {
				const update_path_split = this.getFullPath(i, 0).split(".");
				const grid_data = _.get(this.gridData, update_path_split[0]);
				const index = _.get(grid_data, InputTable.DATA_INDEX_KEY, update_path_split[0]);
				datas.push(_.get(this.props.data, index));
			}
			await this.props.onDeleteRows(datas);
		}

		if (this.props.onUpdateAxis) {
			const axesName = this.expandableAxis;
			await this.deleteCoordinates(axesName, start, end-start+1);
			if (this.isRowPrimary) {
				this.updateHeadersFromInsertOrDelete(start, end-start+1, false, true);
			}
			this.autoSizeColumns();
		}
	})

    getAxisValues(axisName: string) {
		return _.values(this.props.axes[axisName].values);
	}

    insertHeaderCoordinate = async (axisName: string, index: number, isColumn: boolean) => {
		await this.insertCoordinates(axisName, index, 1);
		this.updateHeadersFromInsertOrDelete(index, 1, true, isColumn);
	}

    insertCoordinates = async (axisName: string, startIndex: number, numItems: number = 1) => {
		this.headerChanged = true;
		await this.props.onUpdateAxis({ axes: { action: "add", sourcePath: axisName, index: startIndex, numItems: numItems}});
	}

    deleteHeaderCoordinate = async (axisName, index: number, isColumn: boolean) => {
		let axis = this.props.axes[axisName];
		const axisValues = this.getAxisValues(axisName);
		let name = axis.values[index];
		await this.deleteCoordinates(axisName, index);

		if (axisValues.length > 1)
			this.updateHeadersFromInsertOrDelete(index, 1, false, isColumn);
	}

    deleteCoordinates = async (axisName: string, startIndex: number, numItems: number = 1) => {
		this.headerChanged = true;
		await this.props.onUpdateAxis({axes: {action: "delete", sourcePath: axisName, index: startIndex, numItems: numItems}});
	}

    updateHeadersFromInsertOrDelete = async (index: number, numItems: number, isInsert: boolean, isColumn) => {
		if (isColumn) {
			if (isInsert)
				this.grid.columnHeaders.columns.splice(index, 0, ..._.range(0, numItems).map(i => new wijmo.grid.Column()));
			else {
				this.grid.columnHeaders.columns.splice(index, numItems);
				//this.autoSizedColumns.splice(index, 1);
			}

			this.grid.columnHeaders.columns.forEach((c: wijmo.grid.Column, i) => c.binding = `${i}`); // update column binding for showing right data if there had number of column change;
		}

		this.updateListColumnContent(isColumn);

		this.clearSelection();
	}

    updateListColumnContent = (isColumn) => {
		if (isColumn) {
			this.columnHeaders && this.grid.columnHeaders.rows.forEach((r, i) => {
				for (let c = 0; c < this.columnHeaders.length; c++) {
					this.grid.columnHeaders.setCellData(i, c, this.columnHeaders[c][i].label);
				}
			})
		}
		else {
			this.rowHeaders && this.grid.rowHeaders.columns.forEach((n, i) => {
				for (let r = 0; r < this.rowHeaders.length; r++) {
					this.grid.columnHeaders.setCellData(r, i, this.rowHeaders[r][i].label);
				}
			})
		}

		//this.autoSizeHeaderRows(); // Resize headers rows to fit content
		//this.grid.refresh(true);
		this.forceUpdate();
	}

	saveEdit = (r: number, c: number, value) => {
		if (this.props.override?.saveEdit) {
			this.props.override.saveEdit(r, c, value);
			return;
		}

		const path = this.getFullPath(r, c, true);
		if (this.isReadOnly || !this.isEditable(r, c)) {
			this.grid.setCellData(r, c, _.get(this.props.data, path));
			return;
		}

		const columnHeader = this.columnHeaders ? _.last(this.columnHeaders[c]) : null;
		const rowHeader = this.rowHeaders ? _.last(this.rowHeaders[r]) : null;
		if (value == InputTable.SPECIAL_DROPDOWN_OPTION_NAME) {
			// set data back
			this.grid.setCellData(r, c, _.get(this.props.data, path));

			// execute action
			const headerEntry = columnHeader||rowHeader;
			const execFunc = _.get(headerEntry, 'hints.newItemTemplate.onSelect');
			if (_.isFunction(execFunc)) {
				execFunc(r, c, headerEntry, this);
			}
			return;
		}

		if ((columnHeader?.inputType == "boolean") || (rowHeader?.inputType == "boolean")) {
			if (value === _.get(this.props.data, path)) {
				/* the checkbox will update the value on checked. avoid double submitting when leaving the cell.*/
				return;
			}
		}

		if (_.isDate(value)) {
			const isInteger = (columnHeader?.inputType == "integer") || (rowHeader?.inputType == "integer");
			const year = (value as Date).getFullYear();
			const month = (value as Date).getMonth() <= 8 ? `0${(value as Date).getMonth() + 1}` : (value as Date).getMonth() + 1;
			const date = (value as Date).getDate() <= 9 ? `0${(value as Date).getDate()}` : (value as Date).getDate();
			if (isInteger) {
				value = _.parseInt(`${year}${month}${date}`);
			} else {
				value = `${year}-${month}-${date}`;
			}
		} else if (this.getHeaderLeaf(r, c)?.isPercentage) {
			value /= 100;
		}

		const updates = this.objectFromPath(path.slice(), value);
		this.props.onUpdateValue(updates, path.join('.'));
	}

    async updateCoordinateName(axisName: string, name: string, newName: string) {
		await this.props.onUpdateAxis({axes: {action: "rename", sourcePath: axisName, name, newName}});
	}

    /*
		async insertAxisCoordinate(axis: string, index: number, originIndex: number) {
		const payload: { axes: {}, additionalAllocations?: {}} = { axes: { action: "add", sourcePath: axis, index, originIndex }};
		await this.props.io.sendOptimizationInputsUpdate(payload);
	}

		async deleteAxisCoordinate(axis: string, name: string) {
			await this.props.io.sendOptimizationInputsUpdate({ axes: {action: "delete", sourcePath: axis, name }});
		}

		async renameAxisCoordinate(axis: string, name: string, newName: string) {
			await this.props.io.sendOptimizationInputsUpdate({axes: {action: "rename", sourcePath: axis, name, newName}});
		}

	 */

    _maxHeaderDepth(object) {
		if (object.children && object.children.length > 0)
			return 1 + Math.max(...object.children.map(o => this._maxHeaderDepth(o)));
		else if (object.name != null)
			return 1;
		else
			return 0;
	}

    maxHeaderDepth(isRow: boolean) {
		return this._maxHeaderDepth({children: this.getFields(isRow)}) - 1;
	}

    maxHeaderDepthFromFields(fields) {
		return this._maxHeaderDepth({children: fields}) - 1;
	}

    get tableFields() {
		return tableFields(this.props.userInterface, this.props.globalLists, this.props.axes)
	}

    headerPath(isRow: boolean, levels:Header, stop?: number) {
		if (stop == null) {
			if (_.last(levels).pathStop != null)
				stop = _.last(levels).pathStop;
			else if (levels[1] == levels[2])
				stop = 2;
			else
				stop = this.maxHeaderDepth(isRow);
		}

		return levels.slice(0, stop).map(l => l.name).join(".");
	}

    renderedValidations = null;

    formatter;
    onInitialized = (grid) => {
		let {columnHeaders, rowHeaders} = this;

		this.grid = grid;
		this.grid.collectionView.currentItem = null;
		this.tableCopier = new TableCopier(this.grid, this);

		if (this.props.defaultSelection) {
			this.grid.select(this.props.defaultSelection.row, this.props.defaultSelection.column);
		}
		else if (this.isDynamicStructureTable) {
			this.grid.select(0, 0);
		}
		else {
			this.clearSelection(); // Clear selection if there is no default
		}

	    if (this.props.onSelect && this.grid.selection.isValid) {
		    const path = this.getFullPath(this.grid.selection.row, this.grid.selection.col);
		    this.props.onSelect(path.split("."), true);
	    }

		grid.addEventListener(grid.hostElement, 'contextmenu', this.renderContextMenu);

		grid.mergeManager = new InputTableMergeManager(this);
		//grid.virtualizationThreshold = 100

		// add class for selector cell.
		columnHeaders && _.forEach( grid.columns, (colDef, colIndex) => {
			if (colDef.showDropDown) {
				const downDownOption = this.getDropDownOptions(_.last(this.columnHeaders[colIndex]));
				if (_.size(downDownOption)) {
					grid.columns[colIndex].dataMap = new wijmo.grid.DataMap(downDownOption, 'name', 'title');
				}
			}
		});

		// add a formatter callback to handle cell formatting
		const formatter = this.formatter = new InputTableCellFormatter(this);
	    const handler = this.gridHandler = new InputTableGridHandler(this);

		grid.itemFormatter = formatter.formatItem;

		grid.cellEditEnding.addHandler(handler.cellEditEnding);
		grid.cellEditEnded.addHandler(handler.cellEditEnded);
		grid.selectionChanged.addHandler(handler.selectionChanged);

		if (rowHeaders) {
			grid.loadedRows.addHandler(() => {
				if (grid.collectionView) {
					for (let row = 0; row < this.rowHeaders.length; row++) {
						for (let col = 0; col < this.rowHeaders[0].length; col++) {
							grid.rowHeaders.setCellData(row, col, this.rowHeaders[row][col].label);
						}
					}
				}

				this.updateRowSettings();
			})
		}

		/*
		grid.refresh = _.wrap(grid.refresh, function(func, args) {
			if (this.selection.col == grid.columns.visibleLength - 1 || this.selection.row == grid.rows.visibleLength - 1) {
				let $marquee = $(grid.hostElement).find(".wj-marquee");
				let borderWidth = (parseInt($marquee.css("borderWidth")) || 0);
				$marquee.css({width: $marquee.width() - borderWidth, height: $marquee.height() - borderWidth});
			}

			func.apply(this, Array.prototype.slice.call(arguments, 1));
		})*/

		// Adjust marquee rect so its always within the cell and doesn't trigger scrollbars on boundary cells
		/*grid._getMarqueeRect = _.wrap(grid._getMarqueeRect, function(func, args) {
			let result = func.apply(this, Array.prototype.slice.call(arguments, 1));
			let delta = 2;
			return new wijmo.Rect(result.left + delta, result.top + delta, result.width - 2 * delta, result.height - 2 * delta);
		})*/

		// Overriade the parseFloat method which doesn't correctly handle parsing scientific notation in the current version. Note that this is flixed in the latest version
		wijmo.Globalize.parseFloat = _.wrap(wijmo.Globalize.parseFloat, function(func, value, format) {
			if (value.indexOf("e-") >= 0)
				return parseFloat(value);
			else
				return func.apply(this, Array.prototype.slice.call(arguments, 1))
		});

		grid.beginningEdit.addHandler(handler.beginningEdit);
		grid.updatedView.addHandler(handler.updatedView);
		grid.prepareCellForEdit.addHandler(handler.prepareCellForEdit);
		grid.pastingCell.addHandler(handler.pastingCell);
		grid.copying.addHandler(handler.copying);
		grid.copied.addHandler(handler.copied);

		/*grid.beginningEdit.addHandler(handler.beginningEdit);
		grid.selectionChanging.addHandler(handler.selectionChanging);
		grid.selectionChanged.addHandler(handler.selectionChanged);
		grid.cellEditEnding.addHandler(handler.cellEditEnding);
		grid.cellEditEnded.addHandler(handler.cellEditEnded);
		grid.prepareCellForEdit.addHandler(handler.prepareCellForEdit);
		grid.updatedView.addHandler(handler.updatedView);*/

		// Both wrapped methods are meant to keep active Editor up after an async response/update from the server
		grid.refresh = _.wrap(grid.refresh, function(func, args) {
			let value = null;
			let selectionStart, selectionEnd;

			// unmount old React components
			let keys = Object.keys(formatter.unmountElements);
			while (keys.length) {
				let key = keys.pop();
				formatter.unmountElements[key]();
				delete formatter.unmountElements[key];
			}

			// Backup the active editor value and selection which are lost on refresh
			if (grid.activeEditor) {
				value = grid.activeEditor.value;
				selectionStart = grid.activeEditor.selectionStart;
				selectionEnd = grid.activeEditor.selectionEnd;
			}

			// TRAC-2509. Focus is lost when making edits in the last column. This is caused by the marquee which is bigger than the cell causing the container width to expand. FlexGrid detects this
			// in wijmo.grid.js _updateLayout and calls _clearCells() to fix a suspected error. This blows away the previous cells which results in the focus being lost which breaks further arrow key navigation.
			// Reduce width by the border width to ensure it fits within the cell bounds. (Note it will be reset to the previous width after the refresh)
			if (this.selection.col == grid.columns.visibleLength - 1) {
				let $marquee = $(grid.hostElement).find(".wj-marquee");
				$marquee.css({width: $marquee.width() - (parseInt($marquee.css("borderWidth")) || 0)});
			}

			func.apply(this, Array.prototype.slice.call(arguments, 1));

			const restoreEditor = () => {
				if (value != null) {
					grid.activeEditor.value = value;
					grid.activeEditor.selectionStart = selectionStart;
					grid.activeEditor.selectionEnd = selectionEnd;
				}
			}

			// Second part of TRAC-2509. If selection is offscreen (due to validation sidebar being show), scroll back into view and restore editor
			const {row, col} = this.selection;
			if (!grid.viewRange.contains(row, col)) {
				grid.scrollIntoView(row, col);

				if (grid.activeEditor)
					this._disposableTimeout.setTimeout(restoreEditor, 0); // Wait for it to be in view and restore saved editor values
			}

			restoreEditor();
		});

		let selecting = false;
		grid.select = _.wrap(grid.select, function(func, args) {
			selecting = true;
			try {
				return func.apply(this, Array.prototype.slice.call(arguments, 1));
			}
			finally {
				selecting = false;
			}
		});

		grid.finishEditing = _.wrap(grid.finishEditing, function(func, args) {
			if (grid.activeEditor && !selecting) {
				// If there is an activeEditor keep editing. Invalidate/refresh/column resize trigger the finishEditing function which will leave edit mode.
				return false;
			} else {
				return func.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		});

		for (let level = this.maxHeaderDepth(false) - 2; level >= 0; level--) {
			// create extra header rows
			let extraRow = new wijmo.grid.Row();
			extraRow.wordWrap = true;

			// add extra header row to the grid
			let panel = grid.columnHeaders;
			panel.rows.splice(0, 0, extraRow);

			// populate the extra header row
			for (let colIndex = 0; colIndex < columnHeaders.length; colIndex++) {
				panel.setCellData(0, colIndex, columnHeaders[colIndex][level].label);
			}
		}

		for (let level = this.maxHeaderDepth(true) - 1; level >= 0; level--) {
			let panel = grid.rowHeaders;

			if (level != this.maxHeaderDepth(true) - 1) {
				// create extra header rows
				let extraColumn      = new wijmo.grid.Column();
				extraColumn.wordWrap = true;

				// add extra header row to the grid
				panel.columns.splice(0, 0, extraColumn);
			}

			// populate the extra header row
			for (let rowIndex = 0; rowIndex < rowHeaders.length; rowIndex++) {
				panel.setCellData(rowIndex, 0, rowHeaders[rowIndex][level].label);
			}

			this.grid.autoSizeColumn(0, true, 20); // Resize column to fit content
		}

		this.updateRowSettings();

		// Run header row resize in timeout to fix issue with column header getting cutoff on top and bottom if resize is run immediately before/after column autoSize
		this._disposableTimeout.setTimeout(() => {
			this.autoSizeColumns(true);
			this.autoSizeHeader();

			// Workaround issue where Flexgrid automatically scrolls to the end on the table when max table height is specified
			if (this.props.maxTableHeight) {
				this.grid.scrollIntoView(0, 0);
			}
		}, 100)

	}

	getDropDownOptions = (headerEntry: HeaderEntry)=> {
		let options = _.filter(
			_.get(headerEntry, headerEntry.template ? 'template.options': 'options'),
			(o :any) => o?.applicable !== false
		);

		if (_.get(headerEntry, "hints.newItemTemplate")) {
			options.push({
				name: InputTable.SPECIAL_DROPDOWN_OPTION_NAME,
				title: `New ${headerEntry.label} ...`
			});
		}

		return options;
	}

    autoSizeColumn(col: number, extraPadding = 0) {
		this.grid.autoSizeColumn(col, false, 20 + extraPadding); // Resize column to fit content
	}

    @observable _isColumnAutoSizing = false;
    autoSizeColumns(sizeAll: boolean = true) {
		// Guard against infinite recursion when autosizing is ran from within a grid update/render.
		if (!this._isColumnAutoSizing && this.grid) {
			try {
				this._isColumnAutoSizing = true;

				if (this.columnHeaders == null) {
					for (let i = 0; i < this.grid.columns.length; i++) {
						this.autoSizeColumn(i);
					}
				}
				else {
					for (let i = 0; this.columnHeaders && i < this.columnHeaders.length; i++) {
						const headerLeaf = this.getHeaderLeaf(-1, i);
						const showDropDown = headerLeaf.showDropDown;
						if (showDropDown || sizeAll || headerLeaf.inputType === "string") {
							this.autoSizeColumn(i, showDropDown && !this.useCustomField ? 20 : 0);
						}
					}
				}

				this.forceUpdate();
			} finally {
				this._isColumnAutoSizing = false;
			}
		}
	}

    @observable _isHeaderAutoSizing = false;
    autoSizeHeader  = _.debounce( action(() => {
		// Guard against infinite recursion when autosizing is ran from within a grid update/render.
		if (!this._isHeaderAutoSizing) {
			try {
				this._isHeaderAutoSizing = true;
				// resize to fit content
				if (this.grid) {
					this.grid.autoSizeRows(0, this.maxHeaderDepth(false), true);
					this.grid.autoSizeColumns(0, this.maxHeaderDepth(true), true);
					// if (this.isRowPrimary) {
					// 	this.grid.autoSizeColumns(0, this.rowHeaders.length, true);
					// } else {
					// 	this.grid.autoSizeColumns();
					// }

					// Size column headers
					// if (this.columnHeaders != null) {
					// 	this.grid.columnHeaders.columns.forEach(col => {
					// 		const ele = this.grid.columnHeaders.getCellElement(0, col.index);
					// 		if (ele && ele.scrollWidth > ele.offsetWidth)
					// 			col.size = ele.scrollWidth + 10;
					// 	});
					// }
					if (this.canForceRowDetailView) {
						this.forceRowDetailView = this.grid.scrollSize.width > this.grid.clientSize.width;
					}
				}
			}
			finally {
				this._isHeaderAutoSizing = false;
			}
		}
	}), 100);

    renderToolbarElement = () => {
		const {canInsert, canDelete, canSort, sortableColumns, sortedColumn, setSortKey} = this;
		const {title, extendToolbarMenus, showToolbar} = this.props;

		if (showToolbar === false )
			return null;

		const ICONS = InputTable.ICONS;

		return <bp.Navbar>
			<bp.NavbarGroup align={bp.Position.LEFT} className={css.title}>{title}</bp.NavbarGroup>
			<bp.NavbarGroup align={bp.Position.RIGHT}>
				<bp.NavbarDivider/>
				<bp.ButtonGroup>
					{canSort && <bp.Popover minimal={true} position={bp.Position.BOTTOM_LEFT}>
						<bp.Tooltip
							content={i18n.intl.formatMessage({defaultMessage: "Data Order...", description: "[InputTable] the tooltip text for the reorder records by column button"})}
						    position={bp.Position.BOTTOM_LEFT}
						>
							<bp.Button icon={(sortedColumn.entry ? sortedColumn.direction == 'asc' ? ICONS.SORT_ASC:ICONS.SORT_DESC:ICONS.SORT_UNSET) as any}
							           rightIcon={ICONS.DROPDOWN as any}>
								{sortedColumn.entry ? sortedColumn.entry.label : ''}
							</bp.Button>
						</bp.Tooltip>
						<bp.Menu>
							{sortableColumns.map((entry, i) => <bp.MenuItem
								key={`sortColumnMenuItem_${i}`}
								icon={(sortedColumn.entry?.name == entry.name ? sortedColumn.direction == 'asc' ? ICONS.SORT_ASC:ICONS.SORT_DESC:'blank') as any}
								text={entry.label}
								onClick={() => setSortKey(entry)}
							/>)}
						</bp.Menu>
					</bp.Popover>}
					{canInsert && <bp.Tooltip
						content={i18n.intl.formatMessage({
							defaultMessage: "Insert {num}{rowOrColumnLabel} At End",
							description: "[InputTable] insert record(s) on the end of the table"
						}, {rowOrColumnLabel: this.rowOrColumnLabel(true), num: "1 "})}
						position={bp.Position.BOTTOM_LEFT}
					>
						<bp.Button icon={ICONS.INSERT_AFTER} text={i18n.common.OBJECT_CTRL.INSERT} onClick={() => this.insertItems(this.isEmptyGridData ? 0 : this.gridData.length)} />
					</bp.Tooltip>}
					{!this.isEmptyGridData && canDelete && <bp.Tooltip
						content={i18n.intl.formatMessage({
							defaultMessage: "Delete Selected {rowOrColumnLabel}",
							description: "[InputTable] delete selected records on the table"
						}, {rowOrColumnLabel: this.rowOrColumnLabel(null)})}
						position={bp.Position.BOTTOM_LEFT}
						disabled={!this.hasSelectedCell}
					>
						<bp.Button icon={ICONS.REMOVE} text={i18n.common.OBJECT_CTRL.DELETE} onClick={this.deleteSelectionItems} disabled={!this.hasSelectedCell}/>
					</bp.Tooltip>}
				</bp.ButtonGroup>

				{!!(extendToolbarMenus) && <>
					<bp.NavbarDivider/>
					<bp.Popover minimal={true} position={bp.Position.BOTTOM_LEFT} content={extendToolbarMenus}>
						<bp.Tooltip content={i18n.common.MESSAGE.MORE}>
							<bp.Button icon={'more'} />
						</bp.Tooltip>
					</bp.Popover>
				</>}
			</bp.NavbarGroup>
		</bp.Navbar>
	}

    renderContextMenu = (e) => {
		const {canInsert, canDelete, enableCopyPaste, canSort, dataWithIndex, props: {extendContextMenus}} = this;
		const hitCell = this.grid && this.grid.hitTest(e);
		const canCopyLocation = (hitCell?.cellType == wijmo.grid.CellType.Cell);

		if (!(canInsert || canDelete || enableCopyPaste || !!extendContextMenus || canCopyLocation)) {
			return;
		}

		const itemIndex = this.isRowPrimary ? hitCell.col : hitCell.row;
		const selection = this.grid.selection;
		const dataLength = this.isRowPrimary ? this.grid.columns.length : this.grid.rows.length;
		const inSelection = hitCell ? selection?.contains(hitCell.row, hitCell.col) : false;
		const headerEntry = hitCell?.cellType == wijmo.grid.CellType.ColumnHeader ? this.columnHeaders[hitCell.col][hitCell.row] :
		               hitCell?.cellType == wijmo.grid.CellType.RowHeader ? this.rowHeaders[hitCell.row][hitCell.col] :
		                                                                    null;
		const selectionLength = (this.isRowPrimary ? Math.abs(selection.col - selection.col2) : Math.abs(selection.row - selection.row2)) + 1;

		// prevent the browser's native context menu
		e.preventDefault();

		const ICONS = InputTable.ICONS;

		const simpleMenu = this.isHideHeaders && this.isEmptyGridData;

		// render a Menu without JSX...
		const menu = <bp.Menu>
			{!simpleMenu && this.canRowDetailView && hitCell && hitCell?.cellType != wijmo.grid.CellType.ColumnHeader && <>
				<bp.MenuItem icon={"list-detail-view"} text={i18n.intl.formatMessage({defaultMessage: "Detail View", description: "[InputTable] the detail view mode switcher"})} onClick={() => {this.createDetailTable(selection.row)}}/>
			</>}
			{canInsert && <>{
				!simpleMenu && dataWithIndex && !canSort && hitCell?.cellType == wijmo.grid.CellType.Cell ? <>
					<bp.MenuDivider />
	                <bp.MenuItem icon={ICONS.INSERT_BEFORE}
	                             text={i18n.intl.formatMessage({
		                             defaultMessage: "Insert {num}{rowOrColumnLabel} Before",
		                             description: "[InputTable] insert record(s) before the selected record"
	                             }, {rowOrColumnLabel: this.rowOrColumnLabel(true), num: "1 "})}
	                             onClick={() => this.insertItems(itemIndex)} />
	                <bp.MenuItem icon={ICONS.INSERT_AFTER}
	                             text={i18n.intl.formatMessage({
		                             defaultMessage: "Insert {num}{rowOrColumnLabel} After",
		                             description: "[InputTable] insert record(s) after the selected record"
	                             }, {rowOrColumnLabel: this.rowOrColumnLabel(true), num: "1 "})}
	                             onClick={() => this.insertItems(itemIndex + 1)} />
	                <bp.MenuItem icon={ICONS.INSERT_BEFORE}
	                             text={i18n.intl.formatMessage({
		                             defaultMessage: "Insert {num}{rowOrColumnLabel} Before",
		                             description: "[InputTable] insert record(s) before the selected record"
	                             }, {rowOrColumnLabel: this.rowOrColumnLabel(null), num: ""})}
	                >
		                {this.insertMenuItems.map((count) => <bp.MenuItem key={`menuItem_${count}`} text={count} onClick={() => this.insertItems(itemIndex, count)}/>)}
	                </bp.MenuItem>
	                <bp.MenuItem icon={ICONS.INSERT_AFTER}
	                             text={i18n.intl.formatMessage({
		                             defaultMessage: "Insert {num}{rowOrColumnLabel} After",
		                             description: "[InputTable] insert record(s) after the selected record"
	                             }, {rowOrColumnLabel: this.rowOrColumnLabel(null), num: ""})}
	                >
		                {this.insertMenuItems.map((count) => <bp.MenuItem key={`menuItem_${count}`} text={count} onClick={() => this.insertItems(itemIndex + 1, count)}/>)}
	                </bp.MenuItem>
                </> : <>
	                <bp.MenuItem icon={ICONS.INSERT_AFTER}
	                             text={i18n.intl.formatMessage({
		                             defaultMessage: "Insert {num}{rowOrColumnLabel} At End",
		                             description: "[InputTable] insert record(s) on the end of the table"
	                             }, {rowOrColumnLabel: this.rowOrColumnLabel(true), num: "1 "})}
	                             onClick={() => this.insertItems(dataLength)}/>
	                <bp.MenuItem icon={ICONS.INSERT_AFTER}
	                             text={i18n.intl.formatMessage({
		                             defaultMessage: "Insert {num}{rowOrColumnLabel} At End",
		                             description: "[InputTable] insert record(s) on the end of the table"
	                             }, {rowOrColumnLabel: this.rowOrColumnLabel(null), num: ""})}
	                >
		                {this.insertMenuItems.map((count) => <bp.MenuItem key={`menuItem_${count}`} text={count} onClick={() => this.insertItems(dataLength, count)}/>)}
	                </bp.MenuItem>
                </>
			}</>}
			{!simpleMenu && (headerEntry ? this.renderHeaderMenu(headerEntry, hitCell?.cellType == wijmo.grid.CellType.ColumnHeader) :
			<>
				{canDelete && <bp.MenuItem icon={ICONS.REMOVE}
				                           text={i18n.intl.formatMessage({
					                           defaultMessage: "Delete {selectionLength} {rowOrColumnLabel}",
					                           description: "[InputTable] the selected records tooltip of the delete button"
				                           }, {rowOrColumnLabel: this.rowOrColumnLabel(selectionLength == 1), selectionLength})}
				                           onClick={this.deleteSelectionItems} disabled={!inSelection}
				/>}

				{enableCopyPaste && <>
					<bp.MenuDivider />
					<bp.MenuItem icon={TableCopier.ICONS.COPY} text={i18n.common.OBJECT_CTRL.COPY} onClick={this.tableCopier.copySelection} disabled={!inSelection} />
					<bp.MenuItem icon={TableCopier.ICONS.PASTE} text={i18n.common.OBJECT_CTRL.PASTE} onClick={this.tableCopier.pasteSelection} disabled={!inSelection || !navigator.clipboard?.readText} />
				</>}
			</>)}

			{!simpleMenu && canCopyLocation && <CopyLocationContextMenuItem locationPath={this.getLocationPath(hitCell.row, hitCell.col)} icon={'blank'} />}
		</bp.Menu>;


		// mouse position is available on event
		utility.hasChildren(menu) && bp.ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => {
			// menu was closed; callback optional
		});
	}

    renderHeaderMenu = (headerEntry, isColumn) => {
		return <>
			{this.isHeaderExpandableParent(headerEntry) && <bp.MenuItem icon={InputTable.ICONS.INSERT_BEFORE}
			                                                            text={i18n.intl.formatMessage({defaultMessage: "Add New", description: "[InputTable] add a new column"})}
			                                                            onClick={() => this.insertHeaderCoordinate(headerEntry.axis, this.getAxisValues(headerEntry.axis).length, isColumn)}/>}
			{this.isHeaderExpandableChild(headerEntry) && <>
				<bp.MenuItem icon={InputTable.ICONS.INSERT_BEFORE}
				             text={i18n.intl.formatMessage({defaultMessage: "Insert Before", description: "[InputTable] insert a new column before"})}
				             onClick={() => this.insertHeaderCoordinate(headerEntry.parentAxis, headerEntry.name, isColumn)}/>
				<bp.MenuItem icon={InputTable.ICONS.INSERT_AFTER}
				             text={i18n.intl.formatMessage({defaultMessage: "Insert After", description: "[InputTable] insert a new column after"})}
				             onClick={() => this.insertHeaderCoordinate(headerEntry.parentAxis, headerEntry.name + 1, isColumn)}/>
				<bp.MenuItem icon={InputTable.ICONS.REMOVE} text={i18n.common.OBJECT_CTRL.DELETE} onClick={() => this.deleteHeaderCoordinate(headerEntry.parentAxis, headerEntry.name, isColumn)}/>
			</>}
		</>
	}

	@computed get headersVisibility(): wijmo.grid.HeadersVisibility{
		if (this.isHideHeaders) {
			return wijmo.grid.HeadersVisibility.None;
		}
		if (this.isCross || this.canRowDetailView) {
			return wijmo.grid.HeadersVisibility.All;
		}
		if (this.isTable) {
			return wijmo.grid.HeadersVisibility.Column;
		}
		return wijmo.grid.HeadersVisibility.Row;
	}

    render() {
		const {validationMessages} = this.props; // Reference validation to trigger re-render when validation changes.
		const {rowHeaders, columnHeaders, isExpandable} = this;

		return <div className={classNames(css.root, this.props.className, {[css.loading]: !this.loaded, [css.slot]: this.isSlot})} key={ this.componentId} >
			{this.renderToolbarElement()}
			<Wj.FlexGrid
				style={{maxHeight: this.props.maxTableHeight}}
				autoGenerateColumns={ !columnHeaders }
				autoGenerateRows={ false}
				showMarquee={true}
				autoSizeMode={wijmo.grid.AutoSizeMode.Both}
				allowDragging={wijmo.grid.AllowDragging.None}
				allowMerging={wijmo.grid.AllowMerging.AllHeaders}
				isReadOnly={this.isReadOnly}
				quickAutoSize={this.enableQuickAutoSize}
				selectionMode={this.isDynamicStructureTable ? wijmo.grid.SelectionMode.RowRange : wijmo.grid.SelectionMode.CellRange}
				frozenColumns={this.props.userInterface.options.hints?.frozenColumns || 0}
				initialized={this.onInitialized}
				headersVisibility={this.headersVisibility}
				{...(columnHeaders ? {columns: this.gridColumns} : {})} /* Only include columns props when there are column headers, Flexgrid blows up if its null*/
				itemsSource={this.itemsSource}
				onUpdatedLayout = {() => this._disposableTimeout.setTimeout(action(() => this._loaded = true), 500)}
			/>
			<ResizeSensorComponent onResize={this.onResize} />
		</div>
	}

    componentWillUnmount(): void {
		_.forEach(_.values(this.formatter?.unmountElements) , func => func());
		this._toDispose.forEach(f => f());
		this.grid = null;
	}

	createDetailTable = (rowIndex) => {
		const newInterface = _.cloneDeep(this.props.userInterface);
		// Invert the dimensions on all inner nodes in alignment with the change to the outer node
		const invertDimension = (node) => {
			const dimension = _.get(node, "hints.dimension");
			(dimension == 1) && _.set(node, "hints.dimension", 2);
			(dimension == 2) && _.set(node, "hints.dimension", 1);
			if (node.options) {
				node.options.forEach(invertDimension);
			}
		}
		invertDimension(newInterface);
		return api.site.setDialogFn(() => <BlueprintDialog
		    title={" "}
			isCloseButtonShown={true}
			className={css.detailTableDialog}
		>
			<InputTable
				{...this.props}
				userInterface={newInterface}
				data={[this.props.data[rowIndex]]}
				showToolbar={false}
				override={{saveEdit:(r, c, v) => this.saveEdit(rowIndex, r, v)}}
				isDetailTable={true}
			/>
		</BlueprintDialog>);
	}
}

export function tableFields(userInterfaceNode, globalList, axes) {
	return input(userInterfaceNode, globalList, axes).children;
}
