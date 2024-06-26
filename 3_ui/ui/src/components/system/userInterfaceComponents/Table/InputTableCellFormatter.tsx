import {HeaderEntry} from 'components/system/userInterfaceComponents/Table/TableHeaderSpecification';
import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {i18n, utility} from 'stores';
import {ClosableTooltip, Validator} from '../../inputSpecification';
import * as css from './InputTable.css';
import {InputTable} from './InputTable';
import { bp } from 'components';
import {findOption} from 'components/system/IO/internal/inputs/utility';
import {getFormattedDescription} from 'components/system/inputSpecification/internal/helperMethods';

export class InputTableCellFormatter {

    constructor(public inputTable: InputTable) {

	    // Scroll clipped messages on scroll since their target cell might go offscreen causing the tooltip to be rendered at (0, 0)
	    inputTable.grid.scrollPositionChanged.addHandler(() => {
		    Object.keys(this.clippedRefs).map(k => this.clippedRefs[k] && (this.clippedRefs[k].close = true))
		    inputTable.clippedMessages = {};
	    });
    }

	clippedRefs = {};
	unmountElements: {[key: string]: Function} = {};
	activeDropdown: {key: string, control: wijmo.input.ComboBox} = null;

    formatItem = (panel: wijmo.grid.GridPanel, row: number, col: number, cell: HTMLElement) => {
        const {grid, rowHeaders, columnHeaders, props:{itemFormatter}, getFullPath, gridData, objectFromPath} = this.inputTable;

        if (!grid) {
        	return;
        }

        // lookup path in expandedFields to determine if cell is editable
        if (panel == grid.cells) {
	        const header = columnHeaders || rowHeaders;
	        let headerEntryLeaf = this.inputTable.isCross ?
	                              findOption(this.inputTable.expandedFields, this.inputTable.getFullPath(row, col).split(".")) :
	                              _.last(header[columnHeaders ? col : row]);
	        headerEntryLeaf = headerEntryLeaf?.template || headerEntryLeaf;
	        const colDef = grid.columns[col];

	        $(cell).attr('data-type', headerEntryLeaf?.inputType);
			if (colDef.dataType === wijmo.DataType.Number) {
				// force Number column shows ellipsis when overflow. the number string cannot find a good position to break lines
				$(cell).removeClass('wj-wrap');
			}

			if (this.inputTable.isRowPrimary && _.includes(['integer', 'float'], headerEntryLeaf?.inputType)) {
				$(cell).addClass('wj-align-right');
			}

	        if (!this.inputTable.isEditable(row, col) || headerEntryLeaf?.readOnly) {
		        $(cell).addClass(css.notEditable);
		        return;
	        }

	        // Apply custom formatter before applying our formatting since the custom formatter might replace the entire cell content
	        if (itemFormatter) {
		        const path = this.inputTable.getFullPath(row, col, true);
		        const value = panel.getCellData(row, col, false);
		        const valueObj = objectFromPath(path.slice(), value);
		        itemFormatter(valueObj, path.join('.'), cell, headerEntryLeaf);
	        }


	        if (headerEntryLeaf?.showDropDown) {

	        	if (this.inputTable.useCustomField) {
			        this.formatRowCellDropdown(panel, row, col, cell, headerEntryLeaf);
		        }
	        	//else
	        	//    $(cell).addClass(css.selectorCell);

		        $(cell).addClass(css.dropdown);
	        } else if (this.inputTable.useCustomField && headerEntryLeaf?.inputType == 'boolean') {
		        this.formatRowCellBoolean(panel, row, col, cell);
	        }

            this.addValidations(row, col, cell);
        }

        const isColumnHeader = panel == grid.columnHeaders;
        const isRowHeader = panel == grid.rowHeaders;
	    if ((isColumnHeader && columnHeaders) || (isRowHeader && rowHeaders)) {
		    const header = isColumnHeader ? columnHeaders : rowHeaders;
		    const headerEntry = header[isColumnHeader ? col: row][isColumnHeader ? row: col];

			if (headerEntry.editable) {
			    this.formatHeader(panel, row, col, cell, headerEntry);
		    }

			if (headerEntry["description"]) {
				const wrapper = document.createElement('span');
				const cleanDescription = getFormattedDescription(utility.stripHtml(headerEntry["description"]));
			    ReactDOM.render(<DescriptionTriangle>{cleanDescription}</DescriptionTriangle>, wrapper);
				cell.appendChild(wrapper);
				this.saveHeaderUnmounter(row, col, wrapper);
		    }
	    }

		// By default, Flexgrid sizes columns to their full unwrapped widths,
		// however, we want to size columns to their minimum widths with word wrapping.
		// To accomplish this, we can use the longest word in a header cell to get the correct width to force
		// Flexgrid to wrap on words.
		if (isColumnHeader && cell.getAttribute(wijmo.grid.FlexGrid._WJS_MEASURE) != null && this.inputTable._isColumnAutoSizing) {
			const value = panel.getCellData(row, col, false) || "";
			const valueWords = value.split(" ");

			let longestWord = valueWords[0];

			for (const word of valueWords) {
				if (word.length > longestWord.length) {
					longestWord = word;
				}
			}

			cell.innerHTML = longestWord;
		}

	    if (isRowHeader && this.inputTable.canRowDetailView) {
		    // customize detail row trigger.
		    const wrapper = document.createElement('div');
		    wrapper.className = css.detailCtrlRowHeader;
		    ReactDOM.render(<bp.Button
			    minimal
			    title={i18n.intl.formatMessage({defaultMessage: "Detail View", description: "[InputTable] the detail view mode switcher"})}
			    icon={"list-detail-view"}
			    onClick={() => {
				    this.inputTable.createDetailTable(row);
			    }} />, wrapper);
		    cell.innerHTML = "";
		    cell.appendChild(wrapper);
	    }
    }

	formatHeader(panel: wijmo.grid.GridPanel, row: number, col: number, cell: HTMLElement, headerEntry) {
		let input = null;
		cell.className += ` ${css.editable}`;

		cell.onclick = (event) => {
			cell.innerHTML = `<input className="wj-grid-editor wj-form-control" value='${panel.getCellData(row, col, true)}'>`;
			input = cell.firstChild;
			input.focus();
			input.select();
			this.focusedHeaderCell = [row, col];

			let saveUpdate = async () => {
				if (this.isCellFocused(row, col))
					this.focusedHeaderCell = null;

				cell.innerHTML = input.value;
				//panel.setCellData(row, col, input.value);
				await this.inputTable.updateCoordinateName(headerEntry.parentAxis, headerEntry.label, input.value);
				this.inputTable.updateListColumnContent(panel == this.inputTable.grid.columnHeaders); // Trigger a column update to pick up back-end name change if name was not unique.
			}

			input.onblur = (event) => {
				if (event.relatedTarget != null && event.relatedTarget != cell) {
					saveUpdate();
				}
			};

			input.onkeydown = (event) => {
				if (event.keyCode == 13) {
					saveUpdate();
				}
			};

			input.onclick = (event) => {
				event.preventDefault();
				event.cancelBubble = true;
			};
		}

		// Re-apply focus if it gets losed due to a re-render
		if (this.isCellFocused(row, col))
			cell.onclick(null);
	}

	addValidations(row: number, col: number, cell: HTMLElement) {
    	const {validationMessages} = this.inputTable.props;
    	const {inputTable} = this;
		let path     = `${this.inputTable.props.path}.${this.inputTable.getFullPath(row, col)}`;
		let headerEntry = _.last(inputTable.getPrimaryHeader(row, col));

		// Translate display axis paths to stored order that is specified by back-end in validation message
		// let axis = io.axes[this.assetClassInput.getParentListColumn(columnHeader).axis];
		// if (axis) {
		// 	let pathSplit = path.split(".");
		// 	let axisValueIndex = this.assetClassInput.isExtremeRow(row) ? -2 : -1;
		// 	pathSplit[pathSplit.length + axisValueIndex] = axis.orderIndices[parseInt(pathSplit.slice(axisValueIndex)[0])];
		// 	path = pathSplit.join(".");
		// }

		const error    = validationMessages && validationMessages[path];
		const hasInput = $(cell).find('input[type="text"]').length > 0;

		if (!hasInput && error) {
			$(cell).append((headerEntry.showDropDown ? "&emsp;&emsp;" : "") + "<span></span>");
			ReactDOM.render(<Validator validations={validationMessages} path={path} />, cell.children[cell.children.length - 1]);
			this.saveUnmounter(row, col, cell);
		}

		const clippedKey = `${row}-${col}`;
		const clippedMessage = this.inputTable.clippedMessages[clippedKey];
		if (!hasInput && clippedMessage) {
			if (this.clippedRefs[clippedKey] != null) {
				// Delay closing to reduce flashing on multiple back-to-back re-render
				const ref = this.clippedRefs[clippedKey];
				setTimeout(() => {ref.close = true;}, 1000);
			}
			cell.innerHTML = cell.innerHTML + `<span class="${css.closableTooltipContainer}"></span>`;

			ReactDOM.render(
				<ClosableTooltip
					tooltip={clippedMessage}
					ref={(r) => this.clippedRefs[clippedKey] = r}
					onClosed={() => {
						this.inputTable.clippedMessages[clippedKey] = null;
						this.clippedRefs[clippedKey].close          = true;
						this.clippedRefs[clippedKey]                = null;
					}}>
					<span></span>
				</ClosableTooltip>,
				cell.children[cell.children.length - 1]
			)
			this.saveUnmounter(row, col, cell);
		}
	}

	formatRowCellDropdown(panel, row: number, col: number, cell: HTMLElement, leaf:HeaderEntry) {
    	let wrapper = document.createElement('div');
    	wrapper.className = css.dropdownWrapper;

    	const dropdownCellKey = () => `${row}-${col}}`;

		let saveEdit = () => {
			let existingData = panel.getCellData(row, col);
			if (existingData != dropDown.selectedValue) {
				panel.setCellData(row, col, dropDown.selectedValue);
				this.inputTable.saveEdit(row, col, dropDown.selectedValue);
			}
		}

		const activeCellDropdown = this.activeDropdown && this.activeDropdown.key == dropdownCellKey() ? this.activeDropdown.control : null;

		let dropdownElement = document.createElement('div');
		let dropDown = new wijmo.input.ComboBox(dropdownElement, {
			itemsSource: this.inputTable.getDropDownOptions(leaf),
			displayMemberPath: "title",
			selectedValuePath: "name",
			dropDownCssClass: classNames({[css.mostTopLayer]: this.inputTable.props.isDetailTable}),
			lostFocus: () => {
				saveEdit();
			}
		});
		dropDown.selectedValue = panel.getCellData(row, col, false);
		wrapper.appendChild(dropdownElement);

		// Add an invisible sizing element with the selected dropdown title so the grid can size
		// according to the label which is often longer than the label name/value
		let labelSizer = document.createElement('span');
		labelSizer.className = css.labelSizer;
		labelSizer.innerText = dropDown.selectedItem?.title || dropDown.selectedValue;
		wrapper.appendChild(labelSizer);

		/*
		dropdownElement.addEventListener('mousedown',(e)=> {
			if(!wijmo.hasClass(cell, 'wj-state-selected')) {
				//e.preventDefault();
			}

			window.setTimeout(() => dropdownElement.blur(), 1000);

			console.log("Mouse down")
		})*/

		// dropDown.textChanged.addHandler((sender,event) => {
		// 	console.log("text changed");
		// });

		/*dropDown.selectedIndexChanged.addHandler((sender,event) => {
			if (!dropDown.isDroppedDown)
				panel.setCellData(row, col, dropDown.selectedValue);
		});
		*/

		dropDown.isDroppedDownChanged.addHandler((sender,event) => {
			//console.log("isDroppedDownChanged changed", event);

			if (!dropDown.isDroppedDown) {
				const activeDropdown = this.activeDropdown;
				this.activeDropdown = null;

				// Don't svae changes on dropdowns that are not active, e.g. stale dropdowns that are being removed
				if (activeDropdown && activeDropdown.control == sender)
					saveEdit();

				//console.log("Closed")
			}
			else {
				this.activeDropdown = {key: dropdownCellKey(), control: dropDown};
			}
			//	panel.setCellData(row, col, dropDown.selectedValue);

		});

		dropDown.hostElement.onkeydown = (event) => {
			if (event.keyCode == 13) {
				saveEdit();
				this.inputTable.grid.select(new wijmo.grid.CellRange(row + 1, col, row + 1, col), true);
			}
		};

		cell.style.padding = "0px";
		cell.innerHTML = "";
		cell.appendChild(wrapper);

		// Close any dropdowns that might be open on the same cell.
		// This might happen when dropdowns are opened while processing an async update.
		if (activeCellDropdown) {
			this.activeDropdown = null;
			activeCellDropdown.isDroppedDown = false;

			// Copy state to new dropdown
			dropDown.isDroppedDown = true;
			dropDown.selectedIndex = activeCellDropdown.selectedIndex;
			dropDown.focus();
		}
	}

	formatRowCellBoolean(panel, row: number, col: number, cell: HTMLElement) {
		const id = `${row}-${col}-cell-boolean`;
		const checked = (value) => {
			return value === true || value === 'true' || value === 1 || value === '1';
		}
		const switcher = (e: MouseEvent) => {
			e.stopPropagation();
			this.inputTable.grid.select(new wijmo.grid.CellRange(row, col, row, col), true);

			const currentValue = panel.getCellData(row, col, false);
			const currentStatus = checked(currentValue);
			const updateStatus = _.isInteger(parseInt(currentValue)) ? currentStatus ? 0 : 1 : !currentStatus;
			checkbox.checked = currentStatus;
			panel.setCellData(row, col, updateStatus);
			$(cell).attr('aria-selected', `${updateStatus}`);
			this.inputTable.saveEdit(row, col, updateStatus);
			// when user click the cell or leave cell, there will create another checkbox.
			// this is make sure the new checkbox can have correct status.
			$(`input[check-id=${id}]`).prop("checked", updateStatus);
		}
		const currentStatus = checked(panel.getCellData(row, col, false));
		const checkbox = document.createElement('input');
		checkbox.setAttribute('check-id', id);
		checkbox.setAttribute('type', 'checkbox');
		checkbox.setAttribute('tabIndex', '-1');
		checkbox.checked = currentStatus;
		checkbox.className = 'wj-cell-check';
		checkbox.onclick = switcher
		checkbox.onmousedown = (e) => e.stopPropagation();
		cell.innerHTML = "";
		$(cell).addClass('wj-align-center').removeClass('wj-align-right').removeClass('wj-align-left').append(checkbox);
	}

	saveUnmounter = (r, c, cell) => {
		const key = `${r}-${c}`;
		this.unmountElements[key] && this.unmountElements[key]();
		this.unmountElements[key] = () => cell.children.length > 0 && ReactDOM.unmountComponentAtNode(cell.children[cell.children.length - 1]);
	}

	saveHeaderUnmounter = (r, c, cell) => {
		const key = `${r}-${c}-header`;
		this.unmountElements[key] && this.unmountElements[key]();
		this.unmountElements[key] = () => cell.children.length > 0 && ReactDOM.unmountComponentAtNode(cell);
	}

	focusedHeaderCell = [];
	isCellFocused(row, col) {
		return this.focusedHeaderCell && this.focusedHeaderCell[0] == row && this.focusedHeaderCell[1] == col;
	}
}

@observer
class DescriptionTriangle extends React.Component<{}, {}> {
	@observable triggerFocus: boolean;
	@observable popupFocus: boolean;
	@observable popupWidth: number;

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@computed get isOpen() {
		const isOpen = this.triggerFocus === true || this.popupFocus === true;
		if (isOpen) {
			runInAction(() => this.popupWidth = $(ReactDOM.findDOMNode(this)).parents('.wj-flexgrid').first().width());
		}
		return isOpen;
	}

	render() {
		return <bp.Tooltip
			openOnTargetFocus={true}
			content={<div style={{maxWidth: this.popupWidth}}>{this.props.children}</div>}
			className={css.descriptionTriangle}
			isOpen={this.isOpen}
			onClose={action((e) => {
				const targetContentSelector = '.bp3-popover-content';
				let $relatedTarget = $(_.get(e,"relatedTarget"));
				if ($relatedTarget.is(targetContentSelector) || $relatedTarget.parents(targetContentSelector).length ) {
					this.popupFocus = true;

					if (!$relatedTarget.is(targetContentSelector)) {
						$relatedTarget = $relatedTarget.parents(targetContentSelector).first();
					}
					$relatedTarget.on('mouseleave', action(() => this.popupFocus = false ));
				}
				this.triggerFocus = false;
			})}
			targetProps={{
				onMouseMove: action(() => this.triggerFocus = true)
			}}
		>
			<div className={css.descriptionTriangleIcon}>
				<div className={css.descriptionTriangleIcon1} />
				<div className={css.descriptionTriangleIcon2} />
			</div>
		</bp.Tooltip>;
	}
}