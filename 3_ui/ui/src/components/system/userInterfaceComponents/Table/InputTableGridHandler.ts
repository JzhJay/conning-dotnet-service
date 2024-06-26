import { action, makeObservable } from 'mobx';
import {i18n} from 'stores';
import {InputTable} from './InputTable';
import {Header, HeaderEntry} from './TableHeaderSpecification';

export class InputTableGridHandler{
    constructor(public inputTable: InputTable) {
        makeObservable(this);
    }

	updatedView = () => {
		// Grid doesn't correctly update when offscreen. Headers sometimes aren't rendered so lets invalidate.
		if (!this.inputTable.props.shouldRender())
			this.inputTable.props.onInvalidate();

		//this.updateMarquee();
	}

	beginningEdit = (s, e) => {
		if (!this.inputTable.isEditable(e.row, e.col))
			e.cancel = true;


		if (this.inputTable.useCustomField && this.inputTable.getHeaderLeaf(e.row, e.col).showDropDown) {
			const cell = s.cells.getCellElement(e.row, e.col);
			if (cell && e._data.type === "keypress") {
				const $input = $(cell).find(".wj-combobox input").eq(0);
				$input.val("");
				$input.focus();
				console.log("focus")
				//$input.val(e._data.key);
			}
			e.cancel = true;
		}
	}

	clipValueFormatter = (value, formatter) => {
		if (!this.inputTable.useCustomField || !_.toString(formatter).startsWith('customDropdown_')) {
			return value;
		}
		const colName = formatter.replace('customDropdown_', '');
		const matchMather = (header: Header) => {
			const entry = _.last(header);
			return entry.name == colName && entry.showDropDown;
		}
		const headerEntry = _.last(_.find(this.inputTable.rowHeaders, matchMather ) || _.find(this.inputTable.columnHeaders, matchMather));
		const option = _.find(headerEntry?.options, option => option.name == value);
		return option ? option.title : value;
	}

	copying = (s, e) => {
		// Disable formatting when coping
		(this.copying as any).format = wijmo.Globalize.format;
		wijmo.Globalize.format = this.clipValueFormatter;
	}

	copied = (s, e) => {
		// Reapply old formatting function
		wijmo.Globalize.format = (this.copying as any).format;
	}

	getCellType = (header: HeaderEntry): wijmo.DataType => {
		return (header.showDropDown || header.inputType == "string") ? wijmo.DataType.String : header.inputType == "boolean" ? wijmo.DataType.Boolean : wijmo.DataType.Number;
	}

	pastingCell = (s, e: wijmo.grid.CellRangeEventArgs) => {
		// Prevent posting in readonly cells
		if (!this.inputTable.isEditable(e.row, e.col)) {
			e.cancel = true;
			return;
		}
		// format paste value by header format.
		const header = this.inputTable.getHeaderLeaf(e.row, e.col);
		const valueType = this.getCellType(header);
		let value = e.data;
		if (valueType == wijmo.DataType.Number) {
			if (!_.isNumber(value)) {
				if (_.toString(value).endsWith('%')) {
					value = Number(_.toString(value).replace('%', '')) / 100;
				} else {
					value = Number(_.toString(value));
				}
			}
			if (!_.isNumber(value) || Number.isNaN(value)) {
				e.cancel = true;
				return;
			}
		} else if (valueType == wijmo.DataType.Boolean) {
			if (!_.isBoolean(value)) {
				value = _.toString(value) === "true";
			}
			if (!_.isBoolean(value)) {
				e.cancel = true;
				return;
			}
		} else if (header.showDropDown) {
			let option = _.find(header.options, option => option.title == _.toString(value));
			if (option) {
				value = option.name;
			} else {
				option = _.find(header.options, option => option.name == _.toString(value));
				if (!option) {
					e.cancel = true;
					return;
				}
			}
		}

		// Pass along to cellEditEnding which might also trigger a cancellation.
		e.data = value;
		this.cellEditEnding(s, e);

		if (!e.cancel && this.inputTable.props.onPastingCell) {
				this.inputTable.props.onPastingCell(e);
		}

		// the FlexGid will set data by column setting. if the cell type not match with values. the copy-paste will stop.
		// but we have some customize cell type. so update the source data here directly.
		if (!e.cancel) {
			this.inputTable.saveEdit(e.row, e.col, value);
		}
	}
	cellEditEnding = (s, e) => {
		let {inputTable} = this;
		let header = this.inputTable.getHeaderLeaf(e.row, e.col);

		if (s.activeEditor && inputTable.props.translateCellValue)
			s.activeEditor.value = inputTable.props.translateCellValue(inputTable.getFullPath(e.row, e.col, true), s.activeEditor.value, header);

		let value = s.activeEditor ? s.activeEditor.value : e.data;
		let valueType = this.getCellType(header);
		const format = inputTable.isRowPrimary ? _.get(s.rows, `${e.row}.format`) : _.get(s.columns, `${e.col}.format`);
		value = wijmo.changeType(value, valueType, format);

		// only numeric verify max-min limits
		if (valueType != wijmo.DataType.Number) {
			return;
		}

		// Validate expected type
		if (!_.isNumber(value)) {
			e.cancel = true;
			return;
		}

		const key = `${e.row}-${e.col}`;
		inputTable.clippedMessages[key] = null;

		let {minimum, maximum} = header;
		if (minimum != null) {
			header.isPercentage && (minimum = minimum * 100);
			if (value < minimum) {
				inputTable.clippedMessages[key] = i18n.intl.formatMessage({defaultMessage: "Input limited to the minimum value of {minimum}", description: "[InputTableGridHandler] input limits hints"}, {minimum});
				s.activeEditor.value = minimum;
			}
		}

		if (maximum != null) {
			header.isPercentage && (maximum = maximum * 100);
			if (value > maximum) {
				inputTable.clippedMessages[key] = i18n.intl.formatMessage({defaultMessage: "Input limited to the maximum value of {maximum}", description: "[InputTableGridHandler] input limits hints"}, {maximum});
				s.activeEditor.value = maximum;
			}
		}
	}

    cellEditEnded = (s, e) => {
		let {inputTable, inputTable:{columnHeaders, rowHeaders}} = this;
	    let value = e.panel.getCellData(e.row, e.col);
	    const headerEntryLeaf = this.inputTable.getHeaderLeaf(e.row, e.col);
	    let col          = s.columns[e.col];

	    // convert value to expected type if it is not in a dropdown
	    if (!headerEntryLeaf.showDropDown) {
		    let valueType = headerEntryLeaf.inputType == "string" ? wijmo.DataType.String : wijmo.DataType.Number;
		    value         = wijmo.changeType(value, valueType, col.format);
	    }

	    inputTable.saveEdit(e.row, e.col, value);

	    //col.grid.autoSizeColumn(e.col, null, headerEntryLeaf.showDropDown ? 38 : null); //update column width by content
    }

    _lastSelectionPath: string;
	@action selectionChanged = (s, e) => {
		let {inputTable, inputTable: {grid}} = this;

		inputTable.hasSelectedCell = !!(e?.range?.isValid);

		if (inputTable.hasSelectedCell) {
			const path = inputTable.getFullPath(e.row, e.col);
			if (path != this._lastSelectionPath && e.range.rowSpan == 1)
				inputTable.props.onSelect && this.debounced_onSelectNotify(path.split("."));

			this._lastSelectionPath = path;
		}

		//this.updateMarquee();
	}

	debounced_onSelectNotify = _.debounce((path) => this.inputTable.props.onSelect(path, false), 10);

	prepareCellForEdit = (s, e) => {
		const unFormattedData = s.getCellData(e.row, e.col, false);
		if (!this.inputTable.getHeaderLeaf(e.row, e.col).showDropDown) {
			s.activeEditor.value  = unFormattedData;
		}
	}

	updateMarquee() {
		let {inputTable, inputTable: {grid}} = this;

		// Adjust marquee width and height so it doesn't force scrollbars to be shown when in boundary cells.
		let $marquee = $(grid.hostElement).find(".wj-marquee");
		let borderWidth = (parseInt($marquee.css("borderWidth")) || 0);

		if (grid.selection.col == grid.columns.visibleLength - 1)
			$marquee.css({width: $marquee.outerWidth() - borderWidth});

		if (grid.selection.row == grid.rows.visibleLength - 1)
			$marquee.css({height: $marquee.outerHeight() - borderWidth});
	}

	getHeaderLeaf(row, col) {
		let {inputTable, inputTable:{columnHeaders, rowHeaders}} = this;
		const header = columnHeaders || rowHeaders;
		const headerEntryLeaf = _.last(header[columnHeaders ? col : row]);

		return headerEntryLeaf.template || headerEntryLeaf;
	}
}
