import * as css from 'components/system/inputSpecification/InputSpecificationComponent.css';
import {action} from 'mobx';
import {AssetClassCellFormatter} from './AssetClassCellFormatter';
import {ColumnHeaderEntry} from './AssetClassColumnSpecification';
import {AssetClassInput} from './AssetClassInput';

export class AssetClassGridHandler {
    constructor(public assetClassInput: AssetClassInput) {
    }

	updatedView = () => {
    	const {page, io} = this.assetClassInput.props;
		this.assetClassInput.renderedValidations = io.validations;

    	// Grid doesn't correctly update when offscreen. Headers sometimes aren't rendreded so lets invalidate.
		if (page != io.currentPage)
			page.renderedTime = null;
	}

    beginningEdit =(s, e) => {
        if (this.assetClassInput.shouldDisableEdit(e.row, e.col))
            e.cancel = true;
    }

	copying = (s, e) => {
    	// Disable formatting when coping
    	(this.copying as any).format =  wijmo.Globalize.format;
		wijmo.Globalize.format = (value) => value;
	}

	copied = (s, e) => {
    	// Reapply old formatting function
		wijmo.Globalize.format = (this.copying as any).format;
	}

    pastingCell = (s, e) => {
    	// Prevent posting in readonly cells
	    if (this.assetClassInput.shouldDisableEdit(e.row, e.col)) {
	    	e.cancel = true;
	    }
	    else {
	    	// Pass along to cellEditEnding which might also trigger a cancellation.
		    this.cellEditEnding(s, e);
	    }
    }

	pastedCell = (s, e) => {
		this.cellEditEnded(s, e);
	}

    selectionChanging = (s, e) => {
        let {assetClassInput: {grid}, assetClassInput} = this;

        // Don't allow spacer cells to be selected
        if (e.col < 3 && e.range.rowSpan == 1 && e.range.columnSpan == 1 && e.row != -1) {
            const content = Number.parseInt(e.panel.getCellData(e.row, e.col));
            if (assetClassInput.isSpacerCell(e.row, e.col) && Number.isInteger(content) && content != e.row) {
                grid.select(content, e.col);
                e.cancel = true;
            }
            else if (this.assetClassInput.rows[e.row].level != null && e.col != this.assetClassInput.rows[e.row].level) {
                grid.select(e.row, assetClassInput.rows[e.row].level);
                e.cancel = true;
            }
        }

        /*
        if (e.col < 3 && e.range.columnSpan > 1) {
            const level = assetClassInput.rows[e.row].level;
            grid.select(new wijmo.grid.CellRange(e.row, level, e.range.row2, level), false);
            e.cancel = true;
        }*/
    }

    @action selectionChanged = (s, e) => {
        let {assetClassInput: {columnHeaders, rows}, assetClassInput} = this;

        if (e.col != -1 && e.row != -1 && columnHeaders[e.col][0].isColor && rows[e.row].group && e.range.isSingleCell) {
            assetClassInput.onColorClick(e.row);
        }
        else if (e.col != -1 && e.row != -1) {
            this.assetClassInput.colorSelectionRow = null;
        }

        this.assetClassInput.selectedRow = e.row;

        // Ignore selections from a re-render. panel == undefined?
        if (e.panel == null && e.col != -1) {
            e.cancel = true;
        }
    }

	prepareCellForEdit = (s, e) => {
		const unFormattedData = s.getCellData(e.row, e.col, false);
    	if (e.col <= 2 ) {
		    $(s._activeCell).find('input.wj-grid-editor.wj-form-control').first().val(unFormattedData);
	    } else if ($(e.data.target).is('.wj-cell-check')) {
		    e.panel.setCellData(e.row, e.col, !unFormattedData);
		    this.cellEditEnded(s,e);
		} else if (!_.last(this.assetClassInput.columnHeaders[e.col]).showDropDown) {
		    s.activeEditor.value  = unFormattedData;
	    }
	}

    cellEditEnding = (s, e) => {
	    if (e.col <= 2 ) {
	    	const newEditor = $(s._activeCell).find('input.wj-grid-editor.wj-form-control').first();
		    newEditor.length && (s.activeEditor.value = newEditor.val());
		}

	    let {assetClassInput, assetClassInput:{columnHeaders}} = this;
	    let value = s.activeEditor ? s.activeEditor.value : e.data;
	    let columnHeader = columnHeaders[e.col];
	    let columnHeaderEntry = _.last(columnHeader);
	    let valueType    = columnHeaderEntry.showDropDown ? wijmo.DataType.String : columnHeaderEntry.inputType == "boolean" ? wijmo.DataType.Boolean : wijmo.DataType.Number;
	    value            = wijmo.changeType(value, valueType, e.col.format);
	    let minimum = columnHeaderEntry.minimum;
	    let maximum = columnHeaderEntry.maximum;

	    if (columnHeaderEntry.isPercentage) {
	    	if (minimum != null)
	    		minimum = minimum * 100;
	    	if (maximum != null)
	    		maximum = maximum * 100;
	    }

	    // Validate expected type
	    if (e.col > 3 && value !== "" && value != null) {
		    if ((valueType == wijmo.DataType.Number && typeof value !== 'number')) {
			    e.cancel = true;
			    return;
		    }

	        const key = `${e.row}-${e.col}`;
	        if (minimum != null && value < minimum) {
			    assetClassInput.clippedMessages[key] = `Input limited to the minimum value of ${minimum}`;
			    s.activeEditor.value = minimum;
		    }
		    else if (maximum != null && value > maximum) {
			    assetClassInput.clippedMessages[key] = `Input limited to the maximum value of ${maximum}`;
			    s.activeEditor.value = maximum;
		    }
		    else {
			    assetClassInput.clippedMessages[key] = null;
		    }
	    }
    }

    cellEditEnded = (s, e) => {
        let {assetClassInput, assetClassInput:{rows, columnHeaders}} = this;

        let group = rows[e.row].group;
        let value = e.panel.getCellData(e.row, e.col);
        const columnHeaderEntryLeaf = _.last(columnHeaders[e.col]);

        const updateArray = (source, path, length, index, value, shouldMerge= false) => {
	        let column = _.get(source, path);

	        if (column == null || !Array.isArray(column))
		        column = new Array(length);

	        // Merge with existing or replace
	        if (shouldMerge)
		        column[index] = {...column[index], ...value};
	        else
	            column[index] = value;
            _.set(source, path, column);
	    }

        if (e.range.rowSpan == 1) {
            if (e.col < 3) {
            	if (!assetClassInput.isSpacerCell(e.row, e.col))
	                this.rename(e.row, group, value);
            }
            else {
                let col          = s.columns[e.col];
                let columnHeader = columnHeaders[e.col];

	            // convert value to expected type if it is not in a dropdown
	            if (!columnHeaderEntryLeaf.showDropDown) {
		            let valueType = e.col == 3 ? wijmo.DataType.String : wijmo.DataType.Number;
		            value = wijmo.changeType(value, valueType, col.format);
	            }

                if (assetClassInput.isExtremeRow(e.row)) {
                    let path = assetClassInput.extremesPath(columnHeader, )  + "." + rows[e.row].name;

	                if (_.last(columnHeader).isPercentage || assetClassInput.isMultiConstraintColumn(columnHeader)) {
		                value /= 100;
	                }

                    assetClassInput.saveExtremeUpdate(path.split("."), value);
                }
                else if (assetClassInput.isListColumn(columnHeader)) {
	                this.setAndSaveAsset(e.row, columnHeaders[e.col], value);
                }
                else {
	                this.setAndSaveAsset(e.row, columnHeaders[e.col], value);
                }

                // Update default group name
                if (group && columnHeader[0].name == "returnSource" && (group.name == "" || columnHeader[0].options.find(o => o.title == group.name))) {
	                this.rename(e.row, group, assetClassInput.returnSourceTitle(value));
                }
            }

            if (e.col > 1) // First 2 columns have a fixed width.
                this.autoSizeColumn(e.col); // Needs to happen after edit is complete.
        }

	    // Previous validation popups sticks around when edit is made while popup is being displayed
	    $(`.${css.validatorPopover}`).remove();
    }

    autoSizeColumn(col: number) {
	    this._pendingColumnUpdates[col] = col;
	    this._debouncedAutoSizeColumn();
    }

    _pendingColumnUpdates = {};
    _debouncedAutoSizeColumn = _.debounce(() => {
    	// Debounce column resize to speed up editing, especially pasting.
	    this.assetClassInput.grid && Object.keys(this._pendingColumnUpdates).forEach(key => {
		    this.assetClassInput.grid && this.assetClassInput.autoSizeColumn(this._pendingColumnUpdates[key]);
	    	delete this._pendingColumnUpdates[key];
	    });
    }, 500);

    setAndSaveAsset = (row: number, columnHeader: ColumnHeaderEntry[], value) => {
    	const columnPath = this.assetClassInput.headerPath(columnHeader);
    	const asset = this.assetClassInput.rows[row];

	    if (_.last(columnHeader).isPercentage) {
		    value /= 100;
	    }
        _.set(asset.group, columnPath, value);
        this.assetClassInput.saveAssetClassUpdate(row, this.assetClassInput.objectFromPath(columnPath.split("."), value));
    }

    rename = (row, group, value) => {
	    group.name = value;
	    this.assetClassInput.saveAssetClassUpdate(row, this.assetClassInput.objectFromPath(["name"], value));
	    // Update dropdown datamap to reflect name change
	    this.assetClassInput.setDropdownDataMap();
    }
}
