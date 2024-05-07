import {NavbarDivider, Switch, Icon} from '@blueprintjs/core';
import {TableCopier} from 'components/system/userInterfaceComponents/Table/TableCopier';
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {AppIcon, bp, CopyLocationContextMenuItem, ResizeSensorComponent} from 'components/index';
import type {AssetTableUserOptions} from '../../../../../../stores';
import {site} from '../../../../../../stores';
import {IO, IOPage, IOView, groupPresetColors} from '../../../../../../stores/io';
import {appIcons} from '../../../../../../stores/site/iconography';
import {asyncAction} from '../../../../../../utility';
import {Toolbar} from '../../../../toolbar/Toolbar';
import {AssetClassCellFormatter} from './AssetClassCellFormatter';
import {AssetClassGridHandler} from './AssetClassGridHandler';
import {AssetClassMergeManager} from './AssetClassMergeManager';
import {input, ColumnHeader} from './AssetClassColumnSpecification'
import * as css from './AssetClassInput.css';
import {CellOptions} from './internal/CellOptions';
import {ColorPicker} from './internal/ColorPicker';
import {VisibilityOptions} from './internal/VisibilityOptions';
import { ObjectChooser } from '../../../../../system/ObjectChooser/ObjectChooser';

interface MyProps {
	io: IO;
	view: IOView;
	page: IOPage;
	userOptions: AssetTableUserOptions;
}

interface AssetClassRow {
	group?: AssetClass;
	parent?: AssetClass;
	level?: number;
	ancestors?: string[];
	name?: string;
	label?: string;
}

interface AssetClass {
	name: string;
	color: string;
	assetClasses: AssetClass[];
}

const UNTITLED = "Untitled";
const UNTITLED_COLOR = "rgb(255, 255, 255)";

/* TODO
* Always Keep merged headers of parent visible when scrolling. e.g. IMR schedule headers
* Add a more comprehensive edit test to edit all editable cells, reload table and validate persistence
* Handle asset group deletion update to asset class target.
* Delete related extremes when multi-class constraint is deleted.
* autoSizeRows on resize so column headers aren't truncated
* */

@observer
export class AssetClassInput extends React.Component<MyProps, {}> {
    @observable isOpenObjectChooser = false;
    @observable colorSelectionRow = null;
	selectedRow = null;
	grid: wijmo.grid.FlexGrid;
	tableCopier: TableCopier;
	autoSizedColumns: number[] = [];
	_toDispose = [];
	clippedMessages = {};
	@observable cellFormatOptions = {inlineValidations: true, rowReorder: true, advancedFormatting: true, extendAssetColor: false };
    columnChanged: boolean = false;
    componentId = new Date().getTime().toString();
    nextGropupColor : string = '';

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);

		this._toDispose.push(reaction(() => this.props.page.scrollMode || this.props.page.selectedViews.length, () => {
			// Trigger an async refresh to resize after scroll mode is updated.
			setTimeout(() => this.grid.refresh(true), 0);
		}))

		this.userOptions = this.props.userOptions;

		this._toDispose.push(reaction(() => this.changeableColumnKeys, () => {
			if (!this.grid || this.columnChanged) {
				this.columnChanged = false;
				return;
			}
			const savedScrollPosition = this.grid.scrollPosition;
			this.grid = null;
			this.componentId = new Date().getTime().toString();
			setTimeout( ()=> this.grid && ( this.grid.scrollPosition = savedScrollPosition ) , 100 );
		}))
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (!_.isEqual(prevProps.userOptions, this.props.userOptions)) {
			this.userOptions = this.props.userOptions;
		}
	}

    @computed get assetClasses(){
		return this.props.io.getAssetClassInput(false);
	}

    savedChangeableColumns = null;
    @computed get changeableColumnKeys(){
		let rtnList = this.columnHeaders.filter( column => column[0].name == 'additionalAllocations' || (column[1] && this.isConstraintColumn(column[1]))).map((column) => {
			return column[column.length-1].label;
		});
		if (this.savedChangeableColumns && rtnList.length == this.savedChangeableColumns.length && !rtnList.filter( (d, i) => d !== this.savedChangeableColumns[i] ).length ) {
			return this.savedChangeableColumns;
		}
		this.savedChangeableColumns = rtnList;
		return rtnList;
	}

    onResize = _.debounce(() => {
		if (this.props.page == this.props.io.currentPage) {
			this.grid.refresh(true); // Works better with a refresh prior to resizing. Without refresh headers still sometimes are cutoff
			this.autoSizeHeaderRows();
		}
	}, 100)

    objectFromPath(path: string[], value) {
		return path.reverse().reduce((accum, current) => ({[current]: accum}), value)
	}

    saveExtremeUpdate(path: string[], value: number) {
		this.props.io.sendOptimizationInputsUpdate(this.objectFromPath(path, value));
	}

    saveAssetClassUpdate(row, data) {
		this.saveAssetClassUpdates([{row, data}]);
	}

    saveAssetClassUpdates(updates: {row: number, data: any}[]) {
		let fullUpdate: any = {};

		updates.forEach(update => {
			fullUpdate = _.merge(fullUpdate, this.objectFromPath(this.getAssetClassPathFromRowIndex(update.row), update.data));
		})

		this.props.io.sendAssetClassInputUpdate(fullUpdate.assetClasses);
	}

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

    @observable userOptions: AssetTableUserOptions = {};
    updateUserOptions = (userOptions) => {
		this.props.io.currentPage.updateUserOptions(this.props.view.id, Object.assign(this.userOptions, userOptions));
	}

    _lastContextMenuHideTime = null;
    onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
		let columnHeader = null;
		let cell = this.grid.hitTest(e as any);

		if (cell.cellType == wijmo.grid.CellType.ColumnHeader) {
			columnHeader = this.columnHeaders[cell.col];
			//this.grid.select(-1, -1);
		}
		else {
			// Select cell if not right clicking a range
			if (this.grid.selection.isSingleCell) {
				this.grid.select(cell.row, cell.col);
			}
		}

		//bp.ContextMenu.remove();

		let onClosed = () => {
			this._lastContextMenuHideTime = Date.now();
		}
		let offset = {left: e.clientX + 10, top: e.clientY - 8};
		let show = () => bp.ContextMenu.show(this.contextMenu(columnHeader, cell), offset, onClosed);

		// Workaround for a bug where if a context menu is up attempting to bring up a new one in a different location will put the new context menu in the previous location because
		// Blueprint never deletes the old popover. Workaround to delay showing the new context menu until after the previous one has transitioned away.
		const transition_buffer = 200;
		if (this._lastContextMenuHideTime + transition_buffer < Date.now())
			show();
		else
			setTimeout(show, transition_buffer);

		e.preventDefault();
		e.stopPropagation();
		return false;
	}

    contextMenu(columnHeader: ColumnHeader, cell: wijmo.grid.HitTestInfo) {

		if (cell.row == -1)
			return null;

		// Lookup the column header for the cell when not interacting with a column header directly
		const cellColumnHeader = columnHeader ? columnHeader : this.columnHeaders[cell.col];
		const headerCell = columnHeader ? cell : {row: cellColumnHeader.length - 1, col: cell.col};
		const isListColumn = this.isListColumn(cellColumnHeader);
		const isAdditionalAllocationColumn = isListColumn && this.isAdditionalAllocationColumn(cellColumnHeader);
		const groupMenu = !columnHeader && this.renderGroupMenu();
		const additionalPointsGroupMenu = isAdditionalAllocationColumn && columnHeader && this.renderAdditionalAllocationGroupMenu(columnHeader, cell);
		const rowMenu = !columnHeader && this.renderRowMenu();
		const columnMenu = isListColumn ? this.renderListColumnMenu(cellColumnHeader, headerCell) :
		       columnHeader && columnHeader[0].name == "name"  ? this.renderAssetGroupColumnMenu() :
		                                                         null;
		const showCopyPaste = !columnHeader;

		let locationPath = null;
	    if (wijmo.grid.CellType.Cell == cell.cellType) {
		    const {row, col} = cell;
		    locationPath = this.columnHeaders[col].map(h => h.label || h.name);

		    if (this.showTotalRow && row == 0) {
			    locationPath.push(this.rows[0].label);
		    } else if (this.showExtremeRows && row >= this.rows.length - 2) {
				if (this.columnHeaders[col][1].supportsExtreme) {
					locationPath.push(this.rows[row].label);
				} else {
					locationPath = null;
				}
		    }
		    locationPath && (locationPath = ["Asset Class", ..._.uniq(locationPath)]);
	    }


		return (groupMenu || additionalPointsGroupMenu || rowMenu || columnMenu || showCopyPaste) && <bp.Menu className={css.contextMenu}>
			{groupMenu}
			{additionalPointsGroupMenu}
			{rowMenu}
			{columnMenu}
			{showCopyPaste && <>
				<bp.MenuItem icon={TableCopier.ICONS.COPY} text="Copy" onClick={this.tableCopier.copySelection}></bp.MenuItem>
				<bp.MenuItem icon={TableCopier.ICONS.PASTE} text="Paste" onClick={this.tableCopier.pasteSelection} disabled={!navigator.clipboard?.readText}></bp.MenuItem>
			</>}
			{locationPath && <CopyLocationContextMenuItem locationPath={locationPath} icon={'blank'} />}
		</bp.Menu>
	}

	renderAssetGroupColumnMenu() {
		return (
			<bp.MenuItem icon="insert" text="Insert Asset Classes">
				{this.renderBulklyInsertRowsMenuItem(false, false)}
			</bp.MenuItem>
		);
	}

    renderGroupMenu() {
		return this.showGroupMenu && <>
			<bp.MenuItem className={css.group} icon="group-objects" disabled={!this.canGroup()} text="Group" onClick={this.group} ></bp.MenuItem>
			<bp.MenuItem className={css.ungroup} icon="ungroup-objects" disabled={!this.canUngroup()} text="Ungroup" onClick={this.ungroup} ></bp.MenuItem>
		</>
	}

    getAdditionalAllocationGroupColor(header: ColumnHeader) {
		const { optimizationInputs: { additionalAllocations = [] }} = this.props.io;
		const index = parseInt(header[2].name);
		return _.get(additionalAllocations, [index, 'color'], '');;
	}

    renderAdditionalAllocationGroupMenu(header: ColumnHeader, cell: wijmo.grid.HitTestInfo) {
		if (Object.keys(this.props.io.axes.additionalAllocation.values).length === 0 || cell.row === 0) {	// no additional allocations or click on header
			return null;
		}

		const additionalAllocationIndex = parseInt(header[2].name);
		const currentColor = this.getAdditionalAllocationGroupColor(header);

		return (
			<bp.MenuItem className={css.group} icon="group-objects" text="Assign Group" onClick={this.group} >
				<bp.MenuItem className={css.colorMenuItem} text="None" onClick={this.ungroupAdditionalAllocation(header, additionalAllocationIndex)} />
				{ groupPresetColors.map((colorCode)=> {
					const selectIcon = colorCode === currentColor ? <Icon color="#ffffff" icon="tick" /> : null;
					return <bp.MenuItem key={colorCode} className={css.colorMenuItem} style={{backgroundColor: colorCode}} labelElement={selectIcon} text="&nbsp;" onClick={this.groupAdditionalAllocation(header, additionalAllocationIndex, colorCode)}/>;
				}) }
			</bp.MenuItem>
		);
	}

    groupAdditionalAllocation = (columnHeader: ColumnHeader, additionalAllocationIndex: number, color: string) => {
		return async () => {
			await this.props.io.groupAdditionalAllocation(additionalAllocationIndex, { color });
			this.updateListColumnContent(columnHeader); // Trigger a column update
		};
	}

    renameGroupAdditionalAllocation = async(columnHeader: ColumnHeader, input: { group?: string, name?: string }) => {
		const additionalAllocationIndex = parseInt(columnHeader[2].name);
		await this.props.io.groupAdditionalAllocation(additionalAllocationIndex, input);
		this.updateListColumnContent(columnHeader); // Trigger a column update
	}

    ungroupAdditionalAllocation = (columnHeader: ColumnHeader, additionalAllocationIndex: number) => {
		return async () => {
			await this.props.io.groupAdditionalAllocation(additionalAllocationIndex, { group: '', color: '' });
			this.updateListColumnContent(columnHeader); // Trigger a column update
		};
	}

    renderBulklyInsertRowsMenuItem(isInsertBefore, isAssignIndex)  {
		const menuItems = _.range(1, 10).concat(_.range(10, 110, 10));

		return (
			<bp.Menu>
				{menuItems.map((count)=> <bp.MenuItem key={`menuItem_${count}`} text={count} onClick={()=> { this.insertRow(isInsertBefore, count, isAssignIndex)}} />)}
			</bp.Menu>
		);
	}

    renderRowMenu() {
		const rowCount = this.grid.selection.bottomRow - this.grid.selection.topRow + 1;

		return <>
			{this.showRowMenu ? <>
				<bp.MenuItem icon="add-row-top" text={`Insert ${rowCount} Rows Before`} onClick={()=>this.insertRow(true, 1, true)} />
				<bp.MenuItem icon="add-row-bottom" text={`Insert ${rowCount} Rows After`} onClick={()=>this.insertRow(false, 1, true)} />
				<bp.MenuItem icon="add-row-top" text="Insert Rows Before">
					{this.renderBulklyInsertRowsMenuItem(true, true)}
				</bp.MenuItem>
				<bp.MenuItem icon="add-row-bottom" text="Insert Rows After">
					{this.renderBulklyInsertRowsMenuItem(false, true)}
				</bp.MenuItem>
				<bp.MenuItem className={css.deleteRow} icon="delete" text="Delete Row(s)" onClick={() => this.deleteRow()} ></bp.MenuItem>
			</> : this.showAssetAdd && this.renderAssetGroupColumnMenu()}
			{this.showColorMenu && this.grid.selection.rowSpan > 1 && <bp.MenuItem
				icon={<AppIcon className="iconic-sm"icon={appIcons.investmentOptimizationTool.color} small/>}
				text="Interpolate Colors"
				onClick={() => this.interpolateColor()} >
			</bp.MenuItem>}
		</>
	}

    renderListColumnMenu(columnHeader: ColumnHeader, cell) {
		const isAdditionalAllocation = this.isAdditionalAllocationColumn(columnHeader);
		const constraintHeading = this.isMultiConstraintColumn(columnHeader) ? "Multi-Class" : "Proportional";
		const isShowCompactMenu = columnHeader && this.isParentListColumn(columnHeader, cell) || cell.row === 0;

		if (isShowCompactMenu) {
			return isAdditionalAllocation ?
				<>
					<bp.MenuItem icon="add" text="Insert Additional Allocation" onClick={() => this.insertIntoListColumn(columnHeader, cell, false, isAdditionalAllocation)} />
					<bp.MenuItem icon="import" onClick={this.openIOChooser} text="Import Sampled Efficient Points as Additional Allocations" />
				</> :
				<bp.MenuItem icon="add" text={`Insert ${constraintHeading} Constraint`} onClick={() => this.insertIntoListColumn(columnHeader, cell, false, isAdditionalAllocation)} />;
		}

		return (
			<>
				{ isAdditionalAllocation && <bp.MenuItem icon="import" onClick={this.openIOChooser} text="Import Additional Allocations" /> }
				<bp.MenuItem icon="add-column-left" text="Insert Column Before" onClick={() => this.insertIntoListColumn(columnHeader, cell, true, isAdditionalAllocation)}></bp.MenuItem>
				<bp.MenuItem icon="add-column-right" text="Insert Column After" onClick={() => this.insertIntoListColumn(columnHeader, cell, false, isAdditionalAllocation)}></bp.MenuItem>
				<bp.MenuItem className={css.deleteColumn} icon="delete" text="Delete Column" onClick={() => this.deleteFromListColumn(columnHeader, isAdditionalAllocation)}></bp.MenuItem>
			</>
		);
	}

    isListColumn(columnHeader: ColumnHeader) {
		return columnHeader[0].isListColumn || columnHeader[1].isListColumn;
	}

    getParentListColumn(columnHeader: ColumnHeader) {
		return columnHeader[0].isListColumn ? columnHeader[0] : columnHeader[1];
	}

    isParentListColumn(columnHeader: ColumnHeader, cell) {
		return columnHeader[cell.row].isListColumn;
	}

    isMultiConstraintParent(columnHeader: ColumnHeader, cell) {
		return columnHeader[cell.row].name == "multiClassConstraints";
	}

    isMultiConstraintColumn(columnHeader: ColumnHeader) {
		return columnHeader[1].name == "multiClassConstraints";
	}

    isConstraintColumn(columnHeaderEntry) {
		return columnHeaderEntry.name == "multiClassConstraints" || columnHeaderEntry.name == "proportionalConstraints";
	}

    isProportionalConstraintColumn(columnHeader: ColumnHeader) {
		return columnHeader[1].name == "proportionalConstraints";
	}

    isAdditionalAllocationColumn(columnHeader: ColumnHeader) {
		return columnHeader[0].name === 'additionalAllocations';
	}

    getListColumnParentIndex(columnHeader: ColumnHeader) {
		const level = this.getListColumnParentLevel(columnHeader);
		return this.columnHeaders.findIndex(c => c[level].name == columnHeader[level].name);
	}

    getListColumnParentLevel(columnHeader: ColumnHeader) {
		return (this.isMultiConstraintColumn(columnHeader) || this.isProportionalConstraintColumn(columnHeader)) ? 1 : 0;
	}

    getChildIndexInListColumnParent(columnHeader: ColumnHeader) {
		return Number.parseInt(columnHeader[this.getListColumnParentLevel(columnHeader) + 1].name);
	}

    getListColumnValues(columnHeader: ColumnHeader) {
		const axis = this.getParentListColumn(columnHeader).axis;
		return _.values(this.props.io.axes[axis].values);
	}

    insertIntoListColumn = async (columnHeader: ColumnHeader, cell, isBefore, isAdditionalAllocation) => {
		const axisValues = this.getListColumnValues(columnHeader);
		const index = this.isParentListColumn(columnHeader, cell) ? axisValues.length - 1 : this.getChildIndexInListColumnParent(columnHeader);
		const insertIndex = isBefore ? index : index + 1;

		this.columnChanged = true;
		await this.insertAxisCoordinate(this.getParentListColumn(columnHeader).axis, insertIndex, index);

		if (axisValues.length > 0) {
			const newColumnIndex = this.getListColumnParentIndex(columnHeader) + insertIndex;
			const insertWidth = this.grid.getCellBoundingRect(0, this.getListColumnParentIndex(columnHeader) + index).width
			this.grid.columnHeaders.columns.splice(newColumnIndex, 0, new wijmo.grid.Column());
			this.grid.columnHeaders.columns.forEach((c: wijmo.grid.Column, i) => c.binding = `${i}`); // update column binding for showing right data if there had number of column change;
			this.autoSizedColumns.splice(newColumnIndex, 0, insertWidth);
		}

		this.updateListColumnContent(columnHeader);

		this.clearSelection();
	}

    deleteFromListColumn = async (columnHeader: ColumnHeader, isAdditionalAllocation: boolean) => {
		const axisValues = this.getListColumnValues(columnHeader);
		this.columnChanged = true;

		if (isAdditionalAllocation) {
			const name = this.props.io.axes.additionalAllocation.values[_.last(columnHeader).name];
			await this.deleteAxisCoordinate(this.getParentListColumn(columnHeader).axis, name);
		} else {
			await this.deleteAxisCoordinate(this.getParentListColumn(columnHeader).axis, _.last(columnHeader).label);
		}

		if (axisValues.length > 1) {
			const deleteIndex = this.getListColumnParentIndex(columnHeader) + this.getChildIndexInListColumnParent(columnHeader);
			this.grid.columnHeaders.columns.splice(deleteIndex, 1);
			this.grid.columnHeaders.columns.forEach((c: wijmo.grid.Column, i) => c.binding = `${i}`); // update column binding for showing right data if there had number of column change;
			this.autoSizedColumns.splice(deleteIndex, 1);
		}

		this.updateListColumnContent(columnHeader);

		this.clearSelection();
	}

    updateListColumnContent = (columnHeader: ColumnHeader) => {
		const startColumn = this.getListColumnParentIndex(columnHeader);
		let listColumn = this.getListColumnValues(columnHeader);

		this.grid.columnHeaders.rows.forEach((r, i) => {
			// Update column headers. Note that there is always at least 1 header for the parent
			for (let c = startColumn; c < startColumn + Math.max(listColumn.length, 1); c++) {
				this.grid.columnHeaders.setCellData(i, c, this.columnHeaders[c][i].label);
			}
		})

		this.autoSizeHeaderRows(); // Resize headers rows to fit content
		//this.grid.refresh(true);
		this.forceUpdate();
	}

    getRowParentContainer(row) {
		return row.parent ? row.parent.assetClasses : this.assetClasses;
	}

    getGroupLookup(rowIndex) {
		const row = this.rows[rowIndex];
		let parent = this.getRowParentContainer(row);
		let index = parent.findIndex(g => row.group == g);

		return {row, parent, index};
	}

    @action insertRow(isInsertBefore: boolean, count: number, isAssignIndex: boolean) {
		let index = {};
		let sourcePath = ['assetClasses'];

		if (isAssignIndex && this.grid.selection.topRow >= 0) {
			sourcePath = this.getAssetClassPathFromRowIndex(this.grid.selection.topRow);
			const sourceBottomRowPath = this.getAssetClassPathFromRowIndex(this.grid.selection.bottomRow);
			const topIndex = sourcePath.pop();
			const bottomIndex = sourceBottomRowPath.pop();

			index['index'] = isInsertBefore ? topIndex : bottomIndex + 1;
		}

		this.props.io.sendAssetClassInputUpdate({ action: "add", sourcePath, ...index, numItems: count }).then(() => {
			this.autoSizeColumns(false);
		});
		this.clearSelection();
	}

    @action deleteRow() {
		let sourcePath = _.range(this.grid.selection.topRow, this.grid.selection.bottomRow + 1).map(index => {
			return this.getAssetClassPathFromRowIndex(index);
		});
		this.props.io.sendAssetClassInputUpdate({ action: "delete", sourcePath: sourcePath}).then(() => {
			this.autoSizeColumns();
		});
		this.clearSelection();
	}

    isSectionVisible(name) {
		return this.userOptions.hiddenSections.indexOf(name) == - 1;
	}

    isSectionApplicable(name) {
		return (tableFields(this.props.io).find(c => c.name == name)).applicable;
	}

    get showGroupMenu() {
		return this.showRowMenu && this.grid.selection.leftCol < 3;
	}

    get showRowMenu() {
		const {selection} = this.grid;
		return selection.isValid && this.rows[selection.topRow].group && this.rows[selection.bottomRow].group;
	}

    get showAssetAdd() {
		const {selection} = this.grid;
		return selection.isValid && (selection.topRow == 0 && this.showTotalRow) || (this.showExtremeRows && selection.topRow >= this.rows.length - 2);
	}

    get showColorMenu() {
		const {selection} = this.grid;
		return selection.isValid && selection.leftCol < 4 && this.rows[selection.topRow].group && this.rows[selection.bottomRow].group;
	}

    canGroup() {
		const {selection} = this.grid;
		const {rows, selectionInLevel, userOptions: {showGroups}} = this;

		if (selection.leftCol == 2)
			return false;

		// Selection must have the same parent with depth that allows adding a new group
		let firstRow = rows[selectionInLevel[0]];
		for (let i of selectionInLevel) {
			let currentRow = rows[i];

			if (currentRow.parent != firstRow.parent)
				return false;

			const groupDepth = this.props.io.getGroupDepth(currentRow.group);
			if (selection.leftCol == 0 && groupDepth > 1 || selection.leftCol != 0 && groupDepth != 0)
				return false;
		}

		return showGroups;
	}

    get selectionInLevel() {
		const {selection} = this.grid;
		const {rows} = this;

		let levelSelection = [];

		for (let i = 0; i < selection.rowSpan; i++) {
			// Skip rows not in level
			if (rows[selection.topRow + i].level == selection.leftCol)
				levelSelection.push(selection.topRow + i);
		}

		return levelSelection;
	}

    canUngroup() {
		const {selection} = this.grid;

		// Selection must contain a single entry that has children
		return selection.rowSpan == 1 && selection.columnSpan == 1 && this.props.io.getGroupDepth(this.rows[selection.row].group) > 0;
	}

    @action ungroup = () => {
		this.props.io.sendAssetClassInputUpdate({action: "ungroup", sourcePath: this.getAssetClassPathFromRowIndex(this.grid.selection.row).concat(["assetClasses"])}).then(() => {
			this.autoSizeColumns(false);
		});

		this.clearSelection();
	}

    clearSelection = () => {
		this.grid.select(-1, -1);
	}

    indexInRowParent(rowIndex) {
		let row = this.rows[rowIndex];
		return row.parent.assetClasses.findIndex(g => g == row.group);
	}

    getAssetClassPathFromRowIndex(index) : any[] {
		let row = this.rows[index];
		let result = ["assetClasses", this.indexInRowParent(index)];

		row.ancestors.slice().reverse().forEach(parentIndex => {
			let parentRow = this.assetClassRows[parentIndex];
			let indexInParent = parentRow.parent.assetClasses.findIndex(g => g == parentRow.group);

			result.unshift(indexInParent);
			result.unshift("assetClasses");
		});

		return result;
	}

    @action group = () => {
		const {selectionInLevel} = this;
		let sourcePath = selectionInLevel.map(index => {
			return this.getAssetClassPathFromRowIndex(index);
		});
		let targetPath = sourcePath[0].slice(0, sourcePath[0].length - 1);
		let index = sourcePath[0][sourcePath[0].length - 1];
		this.props.io.sendAssetClassInputUpdate({ action: "group", sourcePath: sourcePath, targetPath: targetPath, index: index }).then(() => {
			this.autoSizeColumns(false);
		});

		this.clearSelection();
	}

    @computed get showTotalRow() {
		return (this.isSectionVisible('values') && this.isSectionApplicable('values')) || (this.isSectionVisible('additionalAllocations') && this.isSectionApplicable('additionalAllocations'));

	}

    @computed get showExtremeRows() {
		return this.isSectionVisible("constraintsAndDuration");
	}

    returnSourceTitle (name) {
		const returnSourceOptions = (this.columnHeaders.find(c => c[0].name == "returnSource") as any)[0].options;
		const target = returnSourceOptions.find(o => o.name == name);
		return target ? target.title : null;
	}

    @computed get gridData() {
		let rows = this.rows;
		let data = [];

		// Total row
		if (this.showTotalRow) {
			data.push({id: 0});
			this.columnHeaders.forEach((columnHeader, i) => {
				if (i < 3) {
					data[0][i] = rows[0].label;
				}
			})
		}

		// Asset class groups
		const endRow = rows.length;
		for (let i = data.length; i < endRow; i++) {

			// Skip extreme rows
			if (rows[i].group == null)
				continue;

			const row = rows[i];
			const name = row.group.name == "" ? UNTITLED : row.group.name;
			let dataRow: any = {
				id: i,
				[rows[i].level]: name,
				[3]: row.group.color,
			};

			// Add existing by asset class data
			this.columnHeaders.map(c => _.has(row.group, this.headerPath(c)) ? _.get(row.group, this.headerPath(c)) : null).forEach((data, i) => {
				if (i > 3) {
					dataRow[i] = _.last(this.columnHeaders[i]).isPercentage && data != null ? data as number * 100 : data;
				}
			});

			// Add dummy entries for other levels to accommodate grouping
			for (let j = 0; j < 3; j++) {
				if (j > rows[i].level)
					dataRow[j] = name;
				else if (j < rows[i].level) {
					dataRow[j] = rows[i].ancestors[j] + (this.showTotalRow ? 1 : 0);
				}
			}

			data.push(dataRow);
		}

		// Minimum and Maximum rows
		if (this.showExtremeRows) {
			const minimumRowIndex = data.length;
			const maximumRowIndex = data.length + 1;
			data                  = data.concat([{id: minimumRowIndex}, {id: maximumRowIndex}]);
			let sawExtremeColumn  = false;
			this.columnHeaders.forEach((columnHeader, i) => {
				if (columnHeader[1].supportsExtreme) {
					const path = this.extremesPath(columnHeader);
					const scale = (_.last(this.columnHeaders[i]).isPercentage || this.isMultiConstraintColumn(columnHeader) ? 100 : 1);
					const savedMin: number = _.get(this.props.io.optimizationInputs, `${path}.minimum`);
					const savedMax: number = _.get(this.props.io.optimizationInputs, `${path}.maximum`);
					data[minimumRowIndex][i] = savedMin != null ? savedMin * scale : null;
					data[maximumRowIndex][i] = savedMax != null ? savedMax * scale : null;
					sawExtremeColumn         = true;
				} else if (sawExtremeColumn) {
					data[minimumRowIndex][i] = data[maximumRowIndex][i] = " "; // empty space messes up cell formatting
				} else {
					data[minimumRowIndex][i] = "Minimum";
					data[maximumRowIndex][i] = "Maximum";
				}
			})
		}

		let cv = new wijmo.collections.CollectionView(data);

		// Fixes a bug where flexgrid resets selection to row 0 when updating collection view.
		if (this.selectedRow)
			cv._idx = this.selectedRow;

		this.formatter?.cache && this.formatter.cache.clear();

		return cv;
	}

    createAssetClassRows(group, assets, level, ancestors, parent) : AssetClassRow[] {
		const startCount = assets.length;
		if (group.name != null)
			assets.push({group: group, level: level, ancestors: ancestors, parent: parent});

		if (group.assetClasses)
			group.assetClasses.forEach((a) => this.createAssetClassRows(a, assets, level + 1, group.name != null ? [...ancestors, startCount] : [], group));

		return assets;
	}

    hasDefaultText(row: number) {
		return this.rows[row].group.name == UNTITLED;
	}

    isExtremeRow(row) {
		return this.rows[row].name == "minimum" || this.rows[row].name == "maximum";
	}

    isGroupTitle(row: number): boolean {
		return this.getGroupDepth(row) > 0;
	}

    isLastOfGroup(row: number , testGroupLevel: number): boolean {
		let calLevels = ( this.rows[row].level - testGroupLevel );
		if (this.isGroupTitle(row) || calLevels <= 0) {
			return false;
		}
		let testRow = row;
		for (let i = calLevels; i > 0; i--) {
			const testRowData = this.rows[testRow];
			if (i == 1) {
				return testRowData.parent.assetClasses.findIndex( r => r == testRowData.group) == testRowData.parent.assetClasses.length - 1;
			} else {
				testRow = this.rows.findIndex( r => r.group == testRowData.parent );
			}
		}
	}

    isAloneInGroup(row: number): boolean {
		const rowData = this.rows[row];
		return rowData.level > 0 && rowData.parent.assetClasses.length == 1
	}

    getGroupDepth (row: number): number {
		return this.props.io.getGroupDepth(this.rows[row].group);
	}

    @computed get maxHeaderDepth() {
		return this._maxHeaderDepth({children: tableFields(this.props.io)}) - 1;
	}

    _maxHeaderDepth(object) {
		if (object.children)
			return 1 + Math.max(...object.children.map(o => this._maxHeaderDepth(o)));
		else
			return 1;
	}

    get assetClassRows() {
		return this.createAssetClassRows({assetClasses: this.assetClasses}, [], -1, [], null);
	}

    @computed get showGroups() {
		// Computed to caller will only react to showGroup changes and not changes to underlying userOptions;
		return this.userOptions.showGroups;
	}

    @computed get rows() {
		let assets = this.assetClassRows;

		if (!this.showGroups) {
			assets = assets.filter(asset => this.showGroups || asset.group.assetClasses.length == 0);
			assets.forEach(asset => asset.level = 0); // remove level grouping that's responsible for visual indenting
		}

		//if (this.grid)
		//	setTimeout(() => this.autoSizeColumns(), 1);

		return [...(this.showTotalRow ? [{name: "total", label: "Total"}] : []),
		        ...assets,
		        ...(this.showExtremeRows ?  [{name: 'minimum', label: "Minimum"}, {name: 'maximum', label: "Maximum"}] : [])];
	}

    @computed get columnHeaders() {
		const tFields = tableFields(this.props.io);
		const depth = this.maxHeaderDepth;
		let headers: ColumnHeader[] = [..._.range(3).map(() => _.range(depth).map(_ => ({label: "Asset Class", name: "name", applicable: true})))];

		const createHeader = (ancestors: any[], object) => {
			let header = [...ancestors, ..._.range(depth - ancestors.length).map(_ => object)]
			_.last(header).pathStop = ancestors.length + 1;
			return header
		}

		const addHeader = (ancestors: any[], node) => {
			if (node.children && node.children.length > 0) {
				node.children.forEach( n => addHeader([...ancestors, node], n));
			}
			else {
				const parent = ancestors.slice(-1)[0];
				if (parent && (parent.name == "multiClassConstraints" || parent.name == "proportionalConstraints")) {
					const values: string[] = _.values(this.props.io.axes[parent.axis].values);
					if (values.length > 0) {
						values.forEach((constraint, i) => {
							headers.push(createHeader(ancestors, {
								label:             constraint,
								name:              i.toString(),
								editable:          true,
								supportsExtreme:   parent.supportsExtreme,
								autoPercentFormat: parent.autoPercentFormat,
								applicable:        parent.applicable,
								isPercentage:      false
							}))
						})
					} else {
						// Only supportsExtreme if there are constraints
						headers.push(createHeader(ancestors, {...parent, supportsExtreme: false}));
					}
				}
				else if (parent && parent.name == "additionalAllocations") {
					const { showGroups } = this;
					const values: string[] = _.values(this.props.io.axes.additionalAllocation.values);
					const createNormalAdditionalPointHeader = (additionalAllocation, i) => {
						const { optimizationInputs: { additionalAllocations = [] }} = this.props.io;
						const name: string = _.get(additionalAllocations, [i, 'name'], '');
						const group = _.get(additionalAllocations, [i, 'group'], '');
						const groupColor: string = _.get(additionalAllocations, [i, 'color'], '');
						const hasGroup = showGroups && groupColor;
						const allowMerging = !hasGroup;
						const expandableTemplate = parent.options[0];

						headers.push([
							...ancestors,
							{label: (i + 1).toString(), name: i.toString(), supportsExtreme: parent.supportsExtreme, applicable: parent.applicable},
							{
								label:           hasGroup ? group : name,
								name:            i,
								editable:        true,
								total:           "auto",
								groupEditable:   false,
								supportsExtreme: parent.supportsExtreme,
								isPercentage:    true,
								pathStop:        ancestors.length + 1,
								applicable:      parent.applicable,
								minimum:         expandableTemplate.minimum,
								maximum:         expandableTemplate.maximum,
								allowMerging,
								allowGroupTotal: expandableTemplate.allowGroupTotal,
								hints:           expandableTemplate.hints
							},
							{
								label:           name,
								name:            i,
								editable:        true,
								total:           "auto",
								groupEditable:   false,
								supportsExtreme: parent.supportsExtreme,
								isPercentage:    true,
								pathStop:        ancestors.length + 1,
								applicable:      parent.applicable,
								minimum:         expandableTemplate.minimum,
								maximum:         expandableTemplate.maximum,
								allowMerging,
								allowGroupTotal: expandableTemplate.allowGroupTotal,
								hints:           expandableTemplate.hints
							}
						]);
					};

					if (values.length > 0) {
						values.forEach(createNormalAdditionalPointHeader);
					}
					else {
						headers.push(createHeader(ancestors, parent));
					}
				}
				/*else if (node.showDropDown && node.name == "migrationTargetAssetClass") {
					headers.push(createHeader(ancestors, {options: this.rows.filter(r => r.group && r.group.returnSource).map(r => ({title: r.group.name, name: r.group.returnSource})), pathStop: 2}));
				}
				else if (node.showDropDown) {
					headers.push(createHeader(ancestors, {dataMap: this.props.io.assetClassSources.map(a => ({name: a, id: a})), pathStop: 1}));
				}*/
				else {
					headers.push(createHeader(ancestors, node));
				}
			}
		}

		tFields.forEach(field => addHeader([], field));

		// Flexgrid does not automatically resize when columns are removed or added. Trigger explicit resize after update.
		if (this.grid)
			setTimeout(() => this.autoSizeHeaderRows(), 100);

		return headers;
	}

    headerPath(levels:ColumnHeader, stop?: number) {
		if (stop == null) {
			if (this.isListColumn(levels))
				stop = this.getListColumnParentLevel(levels) + 2;
			else if (_.last(levels).pathStop != null)
				stop = _.last(levels).pathStop;
			else if (levels[1] == levels[2])
				stop = 2;
			else
				stop = this.maxHeaderDepth;
		}

		return levels.slice(0, stop).map(l => l.name).join(".");
	}

    extremesPath(columnHeader:ColumnHeader) {
		return `constraintsAndDuration.${columnHeader[1].name}${columnHeader[1].name == "multiClassConstraints" ? `.${columnHeader[this.maxHeaderDepth - 1].name}`: ""}`;
	}

    shouldDisableEdit(row, col) {
		const columnHeader = _.last(this.columnHeaders[col]);
		// Always disable edit for total row
		return this.isExtremeRow(row) ? !columnHeader.supportsExtreme :
		       (this.showTotalRow && row == 0) || (this.props.io.getGroupDepth(this.rows[row].group) > 0 && !columnHeader.groupEditable && col > 2) || this.isConstraintColumn(columnHeader) || columnHeader.name == "additionalAllocations";
	}

    isSpacerCell(r, c) {
		return this.rows[r] && this.rows[r].level != null && c < this.rows[r].level;
	}


    renderedValidations = null;
    shouldRefreshGrid() {
		const {grid} = this;
		const columnKeys = Object.keys(this.gridColumnHeaders[0]);

		const dataEqual = _.isEqual(this.gridData.items, grid.collectionView.items);
		let columnsEqual = this.gridColumnHeaders.length == grid.columnHeaders.columns.length;
		for (let i = 0; i < this.gridColumnHeaders.length; i++) {
			if (!_.isEqual(_.pick(grid.columnHeaders.columns[0], columnKeys), this.gridColumnHeaders[0])) {
				columnsEqual = false;
				break;
			}
		}

		const validationEqual = _.isEqual(this.props.io.validations, this.renderedValidations);

		return !dataEqual || !columnsEqual || !validationEqual;
	}

    setDropdownDataMap() {
		this.columnHeaders.forEach((c, i) => {
			const leaf = _.last(c);
			if (leaf.showDropDown && leaf.options) {
				this.grid.columns[i].dataMap = new wijmo.grid.DataMap(leaf.options, 'name', 'title')
			}
		})
	}

    formatter;
    onInitialized = (grid) => {
		let {columnHeaders} = this;

		this.grid = grid;
		this.grid.collectionView.currentItem = null;
		this.tableCopier = new TableCopier(this.grid);
		grid.mergeManager = new AssetClassMergeManager(this);
		//grid.virtualizationThreshold = 100

		// add a formatter callback to handle cell formatting
		const formatter = this.formatter = new AssetClassCellFormatter(this);
		const handler = new AssetClassGridHandler(this);

		//grid.formatItem.addHandler(formatter.formatItem);
		grid.itemFormatter = formatter.formatItem;

		grid.beginningEdit.addHandler(handler.beginningEdit);
		grid.pastingCell.addHandler(handler.pastingCell);
		grid.pastedCell.addHandler(handler.pastedCell);
		grid.selectionChanging.addHandler(handler.selectionChanging);
		grid.selectionChanged.addHandler(handler.selectionChanged);
		grid.cellEditEnding.addHandler(handler.cellEditEnding);
		grid.cellEditEnded.addHandler(handler.cellEditEnded);
		grid.prepareCellForEdit.addHandler(handler.prepareCellForEdit);
		grid.copying.addHandler(handler.copying);
		grid.copied.addHandler(handler.copied);
		grid.updatedView.addHandler(handler.updatedView);

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
					setTimeout(restoreEditor, 0); // Wait for it to be in view and restore saved editor values
			}

			restoreEditor();
		})

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

		this.setDropdownDataMap();

		for (let level = this.maxHeaderDepth - 2; level >= 0; level--) {
			// create extra header rows
			let extraRow          = new wijmo.grid.Row();
			extraRow.wordWrap = true;

			// add extra header row to the grid
			let panel = grid.columnHeaders;
			panel.rows.splice(0, 0, extraRow);

			// populate the extra header row
			for (let colIndex = 0; colIndex < columnHeaders.length; colIndex++) {
				panel.setCellData(0, colIndex, columnHeaders[colIndex][level].label);
			}
		}

		this.autoSizeColumns(true);

		// Run column header row resize in timeout to fix issue with column header getting cutoff on top and bottom if resize is run immediately before/after column autoSize
		setTimeout(() => {
			this.autoSizeHeaderRows();
		}, 100)
	}

    autoSizeColumn(col: number) {
		this.grid.autoSizeColumn(col, false, 20); // Resize column to fit content

		// Backup calculated widths so it can be re-applied on re-render.
		if (this.grid.rows.length > 0)
			this.autoSizedColumns[col] = this.grid.getCellBoundingRect(0, col).width;
	}

    _isColumnAutoSizing = false;
    autoSizeColumns(sizeAll: boolean = true) {
		console.time("autoSizeColumns")
		// Guard against infinite recursion when autosizing is ran from within a grid update/render.
		if (!this._isColumnAutoSizing && this.grid) {
			try {
				this._isColumnAutoSizing = true;
				for (let i = 0; i < this.columnHeaders.length; i++) {
					const showDropDown = _.last(this.columnHeaders[i]).showDropDown;
					if (showDropDown || i == 2 || sizeAll) {
						this.autoSizeColumn(i);
					}
				}

				this.forceUpdate();
			} finally {
				this._isColumnAutoSizing = false;
			}
		}
		console.timeEnd("autoSizeColumns");
	}

    _isHeaderAutoSizing = false;
    autoSizeHeaderRows  = _.debounce( () => {
		// Guard against infinite recursion when autosizing is ran from within a grid update/render.
		if (!this._isHeaderAutoSizing) {
			try {
				this._isHeaderAutoSizing = true;
				this.grid && this.grid.autoSizeRows(0, this.maxHeaderDepth, true); // Resize headers rows to fit content
			}
			finally {
				this._isHeaderAutoSizing = false;
			}
		}
	}, 100);

    @action onColorClick(row) {
		this.colorSelectionRow = row;
	}

    interpolateColor() {
		let {selection} = this.grid;
		let startColor = this.parseColorString(this.rows[selection.topRow].group.color);
		let endColor = this.parseColorString(this.rows[selection.bottomRow].group.color);
		const stepLength = selection.rowSpan - 2;

		const interpolate = (i, c) => Math.floor(startColor[c] + i * (endColor[c] - startColor[c]) / selection.rowSpan);
		let updates = [];

		for (let i = 1; i <= stepLength; i++) {
			this.rows[selection.topRow + i].group.color = `rgb(${interpolate(i, 0) }, ${interpolate(i, 1)}, ${interpolate(i, 2)})`;
			updates.push({row: selection.topRow + i, data: {color: this.rows[selection.topRow + i].group.color}});
		}

		this.saveAssetClassUpdates(updates);
	}

    get gridColumnHeaders() {
		return this.columnHeaders.map((column, i) => {
			const leaf = _.last(column);
			const hasFixedWidth = leaf.isColor || column[0].autoGenerateChildrenCount || column[1].autoGenerateChildrenCount || i < 2;
			let width: number= 60;
			if (!hasFixedWidth) {
				width = 0;
				// load from user store.
				if (_.isFinite(this.autoSizedColumns[i])) {
					width = this.autoSizedColumns[i];
				}
				// if the single word is over 10 letters in the title. make the width 115px at least.
				const maxTitleWords = Math.max(...(column.map(c => Math.max(...(c.label.split(/\s{1,}/).map(s => (s||"").length))))));
				if (maxTitleWords >= 10) {
					width = Math.max(width, 115);
				}
			}

			return {
					header: leaf.label,
					binding: i.toString(),
					wordWrap: true,
					visible: this.isSectionVisible(column[0].name) && _.range(this.maxHeaderDepth).every(l => column[l].applicable),
					allowSorting: false,
					dataMapEditor: leaf.showDropDown ? 'DropDownList' : null,
					...(leaf.inputType == "boolean" ? {dataType: wijmo.DataType.Boolean} : {}),
					isRequired: !leaf.allowNull,
					...(leaf.isPercentage || leaf.inputType == "float" ? {format: _.isFinite(leaf.hints?.decimalPlaces) ? `F${leaf.hints.decimalPlaces}` : "F2"} : {}),
					//dataType: i < 3 || column[2].showDropDown ? wijmo.DataType.String: wijmo.DataType.Number,
					minWidth: hasFixedWidth ? undefined : Math.max(100, width),
					maxWidth: hasFixedWidth ? undefined : Math.max(leaf.showDropDown || i == 2 ? 500: 200, width),
					width: width || '*'
			}
		})
	}

    @action onColorChange = (color, event) => {
		const updateColor = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
		const selectRow = this.colorSelectionRow;
		this.rows[selectRow].group.color = updateColor;
		setTimeout(() => {
			if (this.rows[selectRow].group.color == updateColor) {
				this.saveAssetClassUpdate(selectRow, {color: updateColor});
			}
		}, KARMA ? 0 : 500);
	}

    parseColorString(colorString: string) {
		return colorString.substring(colorString.indexOf("(") + 1, colorString.indexOf(")")).split(",").map(s => parseInt(s.trim()));
	}

    get pickerColor() {
		const row = this.rows[this.colorSelectionRow];
		let colorString = row.group.color;
		const color = typeof(colorString) === "string" ? this.parseColorString(colorString) : [255, 255, 255];

		return {r: color[0], g: color[1] , b: color[2] , a: '1'};
	}

    @action toggleDisplayGroup = () => {
		let {userOptions} = this;
		asyncAction(action(() => {
			this.updateUserOptions({showGroups: userOptions.showGroups = !userOptions.showGroups});
			this.updateListColumnContent(this.columnHeaders.find( column => column[0].name == 'additionalAllocations'));
		}))();
	}

    renderToolbar() {
		let {userOptions} = this;

		return <Toolbar>
			<VisibilityOptions assetClassInput={this}/>
			<NavbarDivider/>
			<CellOptions assetClassInput={this}/>
			<Switch defaultChecked={userOptions.showGroups}
			        alignIndicator={bp.Alignment.RIGHT}
			        label="Display Groups:"
			        onChange={this.toggleDisplayGroup}/>
		</Toolbar>
	}

    openIOChooser = () => {
		this.nextGropupColor = '';
		const nextGroupColor = this.props.io.getNextGroupColor();

		if (nextGroupColor) {
			this.nextGropupColor = nextGroupColor;
			this.isOpenObjectChooser = true;
		}
	}

    onSelectIO = async (selections: Array<IO>) => {
		const selectedIO = selections && selections.length > 0 ? selections[0] : null;

		if (selectedIO) {
			await this.props.io.importAdditionalAllocations(selectedIO, this.nextGropupColor);
		}
	}

    onObjectChooserClose = ()=> {
		this.isOpenObjectChooser = false;
	}

    render() {
		const { isOpenObjectChooser } = this;
		const {validationMessages} = this.props.io; // Reference validation to trigger re-render when validation changes.

		return <div className={classNames(css.root, {[css.allowScroll]: this.props.page.scrollMode})}
		            onContextMenu={this.onContextMenu}
		            key={ this.componentId} >
			<ResizeSensorComponent onResize={this.onResize}/>
			{this.renderToolbar()}
			<Wj.FlexGrid
				autoGenerateColumns={ false }
				showMarquee={true}
				autoSizeMode={wijmo.grid.AutoSizeMode.Cells /*Both causes dropdown columns to have a lot of extra space*/}
				allowDragging={wijmo.grid.AllowDragging.None}
				headersVisibility={wijmo.grid.HeadersVisibility.Column }
				allowMerging="ColumnHeaders"
				frozenColumns={4}
				initialized={this.onInitialized}
				columns={this.gridColumnHeaders}
				itemsSource={  this.gridData }
				resizedColumn={(grid, cellRangeEventArgs) => {
					const col = cellRangeEventArgs.col;
					this.autoSizedColumns[col] = grid.getCellBoundingRect(0, col).width;
				}}
			/>
			{this.grid && <ColorPicker assetClassInput={this} />}
			{ isOpenObjectChooser &&
			<ObjectChooser<IO>
				objectType={IO}
				selections={[]}
				chooseItemFilters={{status: ["Complete"]}}
				isOpen={isOpenObjectChooser}
				onSave={this.onSelectIO}
				onDialogClose={this.onObjectChooserClose}
				showLauncher={false}
			/>
			}
		</div>
	}

    componentWillUnmount(): void {
		this._toDispose.forEach(f => f());
		this.grid.dispose();
		this.grid = null;
	}
}

export function tableFields(io) {
	return input(io.getInputOptions()).children.filter(o => o.name != "name" && o.name != "assetClasses");
}