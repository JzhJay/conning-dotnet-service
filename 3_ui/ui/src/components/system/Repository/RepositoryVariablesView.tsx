import {bp, CopyLocationContextMenuItem} from 'components';
import {TableCopier} from 'components/system/userInterfaceComponents/Table/TableCopier';
import { action, computed, observable, makeObservable } from 'mobx';
import {Observer, observer} from 'mobx-react';
import * as React from 'react';
import {i18n} from 'stores';
import {Repository} from 'stores/respository';
import * as css from './RepositoryComponent.css';
import {RepositoryGridHandler} from './RepositoryGridHandler';
import {RepositoryInputCellFormatter} from './RepositoryInputCellFormatter';
import {Switch, InputGroup} from '@blueprintjs/core';


interface MyProps {
	repository: Repository
}

interface ColumnHeader {
	name: string;
	label: string;
	shouldDisableImportedEdit?: boolean;
}

@observer
export class RepositoryVariablesView extends React.Component<MyProps, {}> {
    _toDispose = [];

    grid: wijmo.grid.FlexGrid;
	tableCopier: TableCopier = null;

    AggregateColumnVisible = false;
    AxisColumnsVisible = false;

    theAutoComplete = null;
    autoCompleteIndex = 0;
    autoCompleteInput = null;
    clickedAutoComplete = false;

    selectedRow = null;

    highlightedIndices = [];
    selectedTextHighlight = null;
    cellHighlights = [];

    tooltip = null;

    isEditing = false;

    formulaInput = null; // Actual fixed input field above grid
    formulaInputDiv = null; // Pseudo-input field, to display text highlights. Swapped out for formulaInput when focused
    @observable currentSelection = null;

    @observable applyText = "Apply to Simulation";
    @observable appliedRepositoryTransform = false;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {repository} = this.props;
		return <>
            <div className={css.topInputWrapper}>
	            <Observer>{() => this.renderFormulaInput()}</Observer>
            </div>
            <div className={classNames(css.root, css.variableView)} onContextMenu={this.onContextMenu}>
    			<Wj.FlexGrid
    				autoGenerateColumns={ false }
    				showMarquee={true}
    				autoSizeMode={wijmo.grid.AutoSizeMode.Cells}
    				allowDragging={wijmo.grid.AllowDragging.None}
    				showSort={true}
    				headersVisibility={'Column'}
    				allowMerging="ColumnHeaders"
    				initialized={this.onInitialized}
    				columns={this.gridColumnHeaders}
    				itemsSource={  this.data }
    				wordWrap={true}/>
                </div>
			<div id="theAutoComplete" className={css.autocomplete} onClick={() => {this.selectAutoCompleteOption(); this.theAutoComplete.itemsSource = [];}}/>
		</>
	}

    renderFormulaInput() {
		let inputGroup = <>
			<div className={!this.currentSelection || this.shouldDisableEdit(this.currentSelection.row, this.currentSelection.col) || !this.isInputFieldColumn(this.currentSelection.col) ? "bp3-input bp3-disabled" : "bp3-input"}  ref={(ref) => this.formulaInputDiv = ref}/>
			<InputGroup
				disabled = {!this.currentSelection || this.shouldDisableEdit(this.currentSelection.row, this.currentSelection.col) || !this.isInputFieldColumn(this.currentSelection.col)}
				onChange={(e) => {
						this.updateSelectedCell(e.target.value);
					}}
				inputRef={(ref) => this.formulaInput = ref}
				style={{display: "none"}}
			/>
		</>;

		return inputGroup;
	}

    updateSelectedCell(value) {
		let field = this.columnHeaders[this.currentSelection.col].name;
		let index = this.getFieldIndexByRow(this.currentSelection.row);
		if (index < 0) {
			return;
		}

		this.props.repository.repositoryTransform.fields[index][field] = value;

		let currentCell = this.grid.cells.getCellElement(this.currentSelection.row, this.currentSelection.col);
		if (currentCell)
			currentCell.innerText = value;
	}

    componentWillUnmount(): void {
		this._toDispose.forEach(f => f());
	}

    /*
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.repository !== nextProps.repository ||
        this.AxisColumnsVisible !== (!nextProps.repository.repositoryTransform.singleAxisCoordinate) ||
        this.AggregateColumnVisible !== (nextProps.repository.repositoryTransform.inputFrequency != nextProps.repository.repositoryTransform.outputFrequency);
    }*/

    componentDidUpdate(prevProps, prevState) {
      if (this.AggregateColumnVisible !== (this.props.repository.repositoryTransform.inputFrequency != this.props.repository.repositoryTransform.outputFrequency)) {
          this.AggregateColumnVisible = this.props.repository.repositoryTransform.inputFrequency != this.props.repository.repositoryTransform.outputFrequency
          this.grid.columns[5].visible = this.AggregateColumnVisible;
      }
      if (this.AxisColumnsVisible !== (!this.props.repository.repositoryTransform.singleAxisCoordinate)) {
          this.AxisColumnsVisible = !this.props.repository.repositoryTransform.singleAxisCoordinate;
          this.grid.columns[3].visible = this.AxisColumnsVisible;
          this.grid.columns[4].visible = this.AxisColumnsVisible;
      }
    }

    onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        let columnHeader = null;
        let cell = null;
        // Select cell if not right clicking a range
        if (this.grid.selection.isSingleCell) {
            cell = this.grid.hitTest(e as any);
            if (cell.cellType == wijmo.grid.CellType.ColumnHeader) {
                columnHeader = this.columnHeaders[cell.col];
            }
            else
                this.grid.select(cell.row, cell.col);
        }

        bp.ContextMenu.show(this.contextMenu(columnHeader, cell), {left: e.clientX + 10, top: e.clientY - 8});

        e.preventDefault();
        e.stopPropagation();
        return false;
    };


    contextMenu(columnHeader: ColumnHeader, cell: wijmo.grid.HitTestInfo) {
		return  columnHeader ? this.renderHeaderMenu(columnHeader) :
				this.grid.selection.row != -1 ? this.renderRowMenu(this.grid.selection.row, cell) :
				null;
	}

    renderHeaderMenu(columnHeader: ColumnHeader) {
		let {repository: {userOptions}} = this.props;
		let menuItems: JSX.Element;
		if (columnHeader.name == "hide") {
			menuItems = <>
				<bp.MenuItem icon="eye-off" text="Hide All" className={css.menuItem} onClick={() => {this.setAllHide(true)}} />
				<bp.MenuItem icon="eye-open" text="Hide None" className={css.menuItem} onClick={() => {this.setAllHide(false)}} />
				<Switch defaultChecked={userOptions.hideHiddenFields} label="Hide Hidden Fields" onChange={() => {this.toggleHidden()}}/>
			</>
		} else if (columnHeader.name == "include") {
			menuItems = <>
				<bp.MenuItem icon="tick-circle" text="Include All" onClick={() => {this.setAllInclude("all")}}/>
				<bp.MenuItem icon="ban-circle" text="Include None" onClick={() => {this.setAllInclude("none")}}/>
				<bp.MenuItem icon="filter-keep" text="Include Only User Calculation" onClick={() => {this.setAllInclude("user")}}/>
			</>;
		} else {
			menuItems = <bp.MenuItem icon="add" text="Add User Field" onClick={() => {this.insertRowEnd()}} />;
		}

		return menuItems && <bp.Menu className={css.contextMenu}>
			{menuItems}
		</bp.Menu>
	}

    renderRowMenu(rowIndex: number, cell: wijmo.grid.HitTestInfo) {
	    let menuItems: JSX.Element;
		if (rowIndex == this.lastNonUserRow()) {
			menuItems = <>
				<bp.MenuItem icon="add-row-bottom" text="Insert After" onClick={() => {this.insertRow(false)}} />
			</>;
		} else if(rowIndex > this.lastNonUserRow()) {
			menuItems = <>
				<bp.MenuItem icon="add-row-top" text="Insert Before" onClick={() => {this.insertRow(true)}} />
				<bp.MenuItem icon="add-row-bottom" text="Insert After" onClick={() => {this.insertRow(false)}} />
				<bp.MenuItem icon="delete" text={i18n.common.OBJECT_CTRL.DELETE} onClick={() => {this.deleteRow()}} />
			</>;
		}

	    const {col} = cell;
	    let locationPath = [this.columnHeaders[col].label];

		if (this.isFormulaColumn(col)) {
			locationPath.unshift(this.columnLabels.formula);
		}

	    locationPath.unshift(this.columnLabels.variables);

		return <bp.Menu className={css.contextMenu}>
			{!!menuItems && <>
				{menuItems}
				<bp.MenuDivider />
			</>}
			<CopyLocationContextMenuItem locationPath={locationPath}  icon={menuItems ? "blank" : null} />
			<bp.MenuItem icon={TableCopier.ICONS.COPY} text={i18n.common.OBJECT_CTRL.COPY} onClick={this.tableCopier.copySelection}/>
			<bp.MenuItem icon={TableCopier.ICONS.PASTE} text={i18n.common.OBJECT_CTRL.PASTE} disabled={!navigator.clipboard?.readText} onClick={this.tableCopier.pasteSelection}/>
		</bp.Menu>
	}

    onInitialized = (grid) => {
		this.grid = grid;
		this.grid.collectionView.currentItem = null;
		this.tableCopier = new TableCopier(this.grid);

		const formatter = new RepositoryInputCellFormatter(this);
		const handler = new RepositoryGridHandler(this);

		grid.itemFormatter = formatter.formatItem;

		grid.beginningEdit.addHandler(handler.beginningEdit);
		grid.selectionChanging.addHandler(handler.selectionChanging);
		grid.selectionChanged.addHandler(handler.selectionChanged);
		grid.cellEditEnding.addHandler(handler.cellEditEnding);
		grid.cellEditEnded.addHandler(handler.cellEditEnded);
		grid.prepareCellForEdit.addHandler(handler.prepareCellForEdit);
		grid.resizedColumn.addHandler(handler.resizedColumn);
		grid.updatingView.addHandler(() => {
			this.tooltip.dispose();
		});
		grid.loadedRows.addHandler(() => {
			this.grid.autoSizeRows();
		});
		grid.pastedCell.addHandler(handler.pastedCell);
		grid.pastingCell.addHandler(handler.pastingCell);

		// create extra header rows
		let extraRow = new wijmo.grid.Row();
		extraRow.wordWrap = true;
		extraRow.allowMerging = true;

		// add extra header row to the grid
		let panel = grid.columnHeaders;
		panel.rows.splice(0, 0, extraRow);

		// populate the extra header row
		for (let colIndex = 0; colIndex < panel.columns.length; colIndex++) {
			panel.setCellData(0, colIndex, colIndex < 6 ? panel.getCellData(1, colIndex, false) : this.columnLabels.formula);
		}

		grid.autoSizeRows();

        this.AxisColumnsVisible = !this.props.repository.repositoryTransform.singleAxisCoordinate;
        this.AggregateColumnVisible = this.props.repository.repositoryTransform.inputFrequency != this.props.repository.repositoryTransform.outputFrequency;

        this.grid.columns[3].visible = this.AxisColumnsVisible;
		this.grid.columns[4].visible = this.AxisColumnsVisible;
		this.grid.columns[5].visible = this.AggregateColumnVisible;

		this.theAutoComplete = new wijmo.input.ListBox('#theAutoComplete', {
	        itemsSource: []
	    });

		this.tooltip = new wijmo.Tooltip();

		let boundingRect = this.formulaInputDiv.getBoundingClientRect(); // Psuedo-input is loaded first, so it has correct bounding box on init

		this.formulaInput.addEventListener("keydown", (e: KeyboardEvent) => {
			if (this.isFormulaColumn(this.currentSelection.col)) {
				if (e.code == "ArrowDown" || e.code == "ArrowUp") { //up or down keys
					if (this.theAutoComplete.itemsSource.length > 0) {
						this.theAutoComplete._keydown(e);
						e.preventDefault();
						e.stopPropagation();
					}
				}
				if (e.code == "Tab" || e.code == "Enter") { // tab or enter key
					if (this.theAutoComplete.itemsSource.length > 0) {
						this.selectAutoCompleteOption();
						this.updateSelectedCell(this.formulaInput.value);
						e.preventDefault();
						e.stopPropagation();
					} else {
						this.formulaInput.blur();
						this.grid.focus();
					}
				}
			} else {
				if (e.code == "Tab" || e.code == "Enter") { // tab or enter key
					this.formulaInput.blur();
					this.grid.focus();
				}
			}
		});
		this.formulaInput.addEventListener("keyup", (e: KeyboardEvent) => {
			if (this.isFormulaColumn(this.currentSelection.col) && !(e.code == "ArrowDown" || e.code == "ArrowUp" || e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "Tab" || e.code == "Enter")) //arrow keys or tab or enter
				this.generateAutoCompleteOptions(this.formulaInput, boundingRect);
		});

		this.formulaInput.addEventListener("blur", () => {
			this.theAutoComplete.itemsSource = []; // clear auto complete
			let field = this.columnHeaders[this.currentSelection.col].name;
			let index = this.getFieldIndexByRow(this.currentSelection.row);
			if (index < 0) {
				return;
			}
			this.props.repository.repositoryTransform.fields[index][field] = this.formulaInput.value; // update field
			this.formulaInputDiv.innerText = this.formulaInput.value; // update text in pseudo-input div
			if (this.isFormulaColumn(this.currentSelection.col)) {
				this.unhighlightMatchingFields();
				this.highlightMatchingFields(this.grid);
				this.formulaInputDiv.innerHTML = this.selectedTextHighlight;
			}
			this.saveRepositoryFieldTransform([{index: index, columnPath: field, update: this.formulaInput.value}]);
			this.formulaInput.style.display = "none"; // hide real input field and show div to allow for text highlighting
			this.formulaInputDiv.style.display = "";
		});

		this.formulaInputDiv.addEventListener("click", (e) => { // On attempt to edit through input formula field, replace pseudo-input field with actual input and set focus on it
			if (!this.formulaInput.disabled) {
				this.formulaInput.style.display = "";
				this.formulaInputDiv.style.display = "none";
				this.formulaInput.focus()
			}
		});

	};

    generateAutoCompleteOptions(input, boundingRect) {
		let current = "";
		this.autoCompleteInput = input;
		let reg = new RegExp(/[0-9A-Za-z_\u00A0-\uFFFF!]+/g);					// Matches a word, which contains letters, numbers, underscores, and unicode characters
		let temp;
		this.autoCompleteIndex = input.selectionStart;
		while ((temp = reg.exec(input.value)) !== null) {						// Finding which word the user is currently editing, and setting that to current
			if(temp.index <= input.selectionStart && reg.lastIndex >= input.selectionStart) {
				current = temp[0];
				break;
			}
		}

		if (current.length > 1) {
	        let allItems = this.props.repository.repositoryTransform.fields, queryItems = [], srx = new RegExp('^' + current, 'i'), rx = new RegExp('(?!^)' + current, 'i');
			let max = 5;
			for (let i = 0; i < allItems.length && queryItems.length < max; i++) { // Find any matching fields that begin with the word that the user has typed
				if (srx.test(allItems[i].name)) {
					queryItems.push(allItems[i].name);
				}
			}
	        for (let i = 0; i < allItems.length && queryItems.length < max; i++) { // Find any matching fields that contain the word that the user has typed somewhere in the middle
	            if (rx.test(allItems[i].name)) {
	                queryItems.push(allItems[i].name);
	            }
	        }
			this.theAutoComplete.itemsSource = queryItems;						// Populate and show autocomplete box
	        if (this.theAutoComplete.hostElement.offsetHeight + boundingRect.top + boundingRect.height < window.innerHeight - 88) {
				this.theAutoComplete.hostElement.setAttribute("style", `left:${boundingRect.left}px; top: ${boundingRect.top + boundingRect.height - 88}px;`);
			} else {
				this.theAutoComplete.hostElement.setAttribute("style", `left:${boundingRect.left}px; top: ${boundingRect.top - this.theAutoComplete.hostElement.offsetHeight - 88}px;`);
			}
		} else {
			this.theAutoComplete.itemsSource = [];
		}
	}

    selectAutoCompleteOption() {
		if (this.theAutoComplete.selectedItem == null)
			return;
		let splitInput = this.autoCompleteInput.value.split(/([^0-9A-Za-z_\u00A0-\uFFFF!])/g); // split input into array of words
		let start = 0;															// character index of start of current word
		let end = 0;															// character index of end of current word
		let result = "";
		let cursorIndex = 0;
		for(let i = 0; i < splitInput.length; i++) {
			end += splitInput[i].length;
			if(start <= this.autoCompleteIndex && end >= this.autoCompleteIndex && /[0-9A-Za-z_\u00A0-\uFFFF!]+/g.test(splitInput[i])) { // If index of auto complete is within the current word, replace word with autocomplete option
				result += this.theAutoComplete.selectedItem;					// add autocomplete option to result
				cursorIndex = start + this.theAutoComplete.selectedItem.length; // Update index of cursor to end of autocompleted word
			} else {															// Not selected word, add existing word to result
				result += splitInput[i];
			}
			start += splitInput[i].length;
		}
		this.autoCompleteInput.value = result;									// updates the text field
		this.autoCompleteInput.setSelectionRange(cursorIndex, cursorIndex);		// sets new cursor position
		this.theAutoComplete.itemsSource = [];									// clears autocomplete options
	}

    gridRefresh() {
		if (!this.isEditing) {
			this.grid.refresh(); // Doesn't reset row heights
			this.grid.focus(); // Grid is wiped and loses focus when cursor over last column for some reason...
		}
	}
    gridRefresh_debounced = _.debounce(this.gridRefresh, 100, { leading: false, trailing: true }); // Needs to wait a bit to refresh so grid scrolls on arrow keys, holding key refreshes a lot

    collectionRefresh() {
		if (!this.isEditing && this.highlightedIndices.some(i => this.grid.collectionView.sourceCollection[i].hide)) { // Only need to refresh if some collection that is hidden is shown, prevents grid constantly jumping
			this.grid.collectionView.refresh(); // This resets the row heights
		}
	}
    collectionRefresh_debounced = _.debounce(this.collectionRefresh, 500, { leading: false, trailing: true }); // autosizing rows is expensive, wait a little bit longer than just refresh

    refresh_debounced() {
		this.gridRefresh_debounced();
		this.collectionRefresh_debounced();
	}

    currentPasteUpdates = [];

    saveRepositoryFieldTransform(updates: {index, columnPath?, update?, newIndex?: number, insert?: boolean}[]) {
		let toSave = [];
		updates.forEach(update => {
			if (update.insert) {
				let field = this.props.repository.repositoryTransform.fields[update.index];
				toSave.push({...field, newIndex: update.newIndex})
			} else {
				if (update.newIndex !== undefined) {
					if (update.newIndex < 0) {
						toSave.push({index: update.index, newIndex: update.newIndex})
					} else {
						let toUpdate = _.set({}, update.columnPath, update.update) as Object;
						toSave.push({...toUpdate, index: update.index, newIndex: update.newIndex})
					}
				} else {
					let toUpdate = _.set({}, update.columnPath, update.update) as Object;
					toSave.push({...toUpdate, index: update.index})
				}
			}
		});

		this.props.repository.sendRepositoryTransformUpdate({fields: toSave}).then(() => {this.refresh_debounced()});

	}

    saveRepositoryFieldTransform_debounced = _.debounce(this.saveRepositoryFieldTransform, 50, { leading: false, trailing: true });

    pasteRepositoryFieldTransform(update: {index, columnPath, update}) {
		this.currentPasteUpdates.push(update);
		this.pasteAllRepositoryTransform_debounced(this.currentPasteUpdates);
	}

    pasteAllRepositoryTransform(updates) {
		this.saveRepositoryFieldTransform(updates);
		this.currentPasteUpdates = [];
		this.highlightMatchingFields(this.grid);
	}

    pasteAllRepositoryTransform_debounced = _.debounce((updates) => {this.pasteAllRepositoryTransform(updates)}, 50, { leading: false, trailing: true });

	get columnLabels() {
		return {
			hide_active: i18n.intl.formatMessage({defaultMessage: "Hide (Active)", description: "[RepositoryVariablesView] grid column label"}),
			hide_inactive: i18n.intl.formatMessage({defaultMessage: "Hide (Inactive)", description: "[RepositoryVariablesView] grid column label"}),
			include: i18n.intl.formatMessage({defaultMessage: "Include in Results", description: "[RepositoryVariablesView] grid column label"}),
			name: i18n.common.WORDS.NAME,
			fieldType: i18n.intl.formatMessage({defaultMessage: "Field Type", description: "[RepositoryVariablesView] grid column label"}),
			axisCoordinates: i18n.intl.formatMessage({defaultMessage: "Axis Coordinates", description: "[RepositoryVariablesView] grid column label"}),
			timeAggregator: i18n.intl.formatMessage({defaultMessage: "Time Aggregator", description: "[RepositoryVariablesView] grid column label"}),
			timeEqZeroFormula: i18n.intl.formatMessage({defaultMessage: "Time = 0 (if different)", description: "[RepositoryVariablesView] grid column label"}),
			timeGtZeroFormula: i18n.intl.formatMessage({defaultMessage: "Time > 0", description: "[RepositoryVariablesView] grid column label"}),
			formula: i18n.intl.formatMessage({defaultMessage: "Formula", description: "[RepositoryVariablesView] grid column label"}),
			variables: i18n.intl.formatMessage({defaultMessage: "Variables", description: "[RepositoryVariablesView] grid column label"})
		}
	}

    get columnHeaders() : Array<ColumnHeader> {
		const {columnLabels, props:{repository: {userOptions: {hideHiddenFields}}}} = this;

		return [
			{name: "hide", label: hideHiddenFields ? columnLabels.hide_active : columnLabels.hide_inactive},
            {name: "include", label: columnLabels.include},
            {name: "name", label: columnLabels.name, shouldDisableImportedEdit: true},
            {name: "fieldType", label: columnLabels.fieldType},
            {name: "axisCoordinates", label: columnLabels.axisCoordinates},
	        {name: "timeAggregator", label: columnLabels.timeAggregator},
		    {name: "timeEqZeroFormula", label: columnLabels.timeEqZeroFormula, shouldDisableImportedEdit: true},
			{name: "timeGtZeroFormula", label: columnLabels.timeGtZeroFormula, shouldDisableImportedEdit: true}
		];
	}

    get fieldTypeMap() {
	   return new wijmo.grid.DataMap([
		    {
				value: "",
			    name: "-"
		    },
		    {
				value: "Asset Class Price Return",
			    name: i18n.intl.formatMessage({defaultMessage: "Asset Class Price Return", description: "[RepositoryVariablesView] selection value for the field type"})
		    },
		    {
				value: "Asset Class Income Return",
			    name: i18n.intl.formatMessage({defaultMessage: "Asset Class Income Return", description: "[RepositoryVariablesView] selection value for the field type"})
		    },
		    {
				value: "Bond Default Rate",
			    name: i18n.intl.formatMessage({defaultMessage: "Bond Default Rate", description: "[RepositoryVariablesView] selection value for the field type"})
			}
	    ], 'value', 'name');
    }

    get timeAggregatorMap() {
		return new wijmo.grid.DataMap([
		    {
				value: "",
			    name: "-"
		    },
		    {
				value: "Last",
			    name: i18n.intl.formatMessage({defaultMessage: "Last", description: "[RepositoryVariablesView] selection value for the time aggregator"})
		    },
		    {
				value: "Sum",
			    name: i18n.intl.formatMessage({defaultMessage: "Sum", description: "[RepositoryVariablesView] selection value for the time aggregator"})
		    },
		    {
				value: "Compound",
			    name: i18n.intl.formatMessage({defaultMessage: "Compound", description: "[RepositoryVariablesView] selection value for the time aggregator"})
		    },
		    {
				value: "Product",
			    name: i18n.intl.formatMessage({defaultMessage: "Product", description: "[RepositoryVariablesView] selection value for the time aggregator"})
			}
	    ], 'value', 'name');
    }

    get gridColumnHeaders() {
		return this.columnHeaders.map(column => {

            const dataMap = column.name == "timeAggregator" ? this.timeAggregatorMap :
                            column.name == "fieldType" ?      this.fieldTypeMap :
                            null;

			this.timeAggregatorMap.getDisplayValues = function(dataItem) {
				return dataItem.userField ? ["-", "Last", "Sum", "Compound", "Product"] : ["Last", "Sum", "Compound", "Product"]; // Hide empty option if it is not a user field
			};

			return {
				header: column.label,
				binding: column.name,
				allowMerging: true,
				wordWrap: true,
				allowSorting: false,
				dataMapEditor: wijmo.grid.DataMapEditor.DropDownList,
				dataMap:  dataMap,
				minWidth: 100,
				width: (column.name == "hide" || column.name == "include" || column.name == "timeAggregator") ? "*" : column.name == "fieldType" ? "3*" : "4*"
			}
		})
	}

    getFieldIndex(field) {
		const {repository: {repositoryTransform: {fields}}} = this.props;
		return fields.findIndex(f => f == field);
	}

    getFieldIndexByRow(row) {
		// the grid.collectionView maybe a null when running Karma.
		const fieldItems = this.grid?.collectionView?.items;
		return fieldItems?.length > row ? this.getFieldIndex(fieldItems[row]) : -1;
	}

    get rows() {
		const {repository: {repositoryTransform: {fields}}} = this.props;
		return fields;
	}

    rowFilter = (r, i) => !this.props.repository.userOptions.hideHiddenFields || !r.hide || this.highlightedIndices.find((highlightIndex) => highlightIndex == i);

    // Show hidden rows at the bottom. Used to display hidden fields highlighted by syntax highlighting at the bottom rather than at the top
    rowSortConverter(sd, item, value) {
		return value ? 1 : 0; // hidden values get higher number, and moves to bottom
	}

    @computed get data() {
		let cv = new wijmo.collections.CollectionView(this.rows);

		cv.filter = this.rowFilter.bind(this);

		if (this.props.repository.userOptions.hideHiddenFields) { // Only need sorting functionality if fields can be hidden
			cv.useStableSort = true; // Maybe find a better way to sort
			cv.sortConverter = this.rowSortConverter.bind(this);

			let sd = new wijmo.collections.SortDescription('hide', true);
			cv.sortDescriptions.push(sd);
		}

		// Fixes a bug where flexgrid resets selection to row 0 when updating collection view.
		if (this.selectedRow)
			cv._idx = this.selectedRow;


		return cv;
	}

    shouldDisableEdit(row, col) {
		return !this.grid.collectionView.items[row] || (!this.grid.collectionView.items[row].userField && this.columnHeaders[col].shouldDisableImportedEdit) || (this.columnHeaders[col].name == "axisCoordinates" && !this.grid.collectionView.items[row].include);
	}

    isHideColumn(row, col) {
		return this.columnHeaders[col].name == "hide";
	}

    isAxisCoordinatesColumn(row, col) {
		return this.columnHeaders[col].name == "axisCoordinates";
	}

    isNameColumn(row, col) {
		return this.columnHeaders[col].name == "name"
	}

    shouldHighlightNameColumn(row, col) {
		let index = this.getFieldIndexByRow(row);
		return this.cellHighlights.findIndex(c => c.index == index) >= 0;
	}

    nameColumnHighlight(row, col) {
		let index = this.getFieldIndexByRow(row);
		return this.cellHighlights.find(c => c.index == index);
	}

    isFieldTypeColumn(row, col) {
		return this.columnHeaders[col].name == "fieldType"
	}

    updatedFieldType(row, col) {
		const {repository} = this.props;
		let index = this.getFieldIndexByRow(row);
		if (index < 0) {
			return;
		}
		let newAxisCoordinates = repository.defaultAxisCoordinates[this.grid.collectionView.items[row].fieldType];
		let name = (repository.userOptions.originalNames && index < repository.userOptions.originalNames.length) ?
					repository.userOptions.originalNames[index] :
					this.grid.collectionView.items[row].name;
		newAxisCoordinates = newAxisCoordinates.replace(/{Name}/g, name);
		newAxisCoordinates = newAxisCoordinates == "" ? `Column = ${name}` : newAxisCoordinates;
		this.grid.collectionView.items[row].axisCoordinates = newAxisCoordinates;
		return {index: index, columnPath: "axisCoordinates", update: newAxisCoordinates};
	}

    isTimeAggregatorColumn(row, col) {
		return this.columnHeaders[col].name == "timeAggregator"
	}

    timeEqplaceHolderText(row, col) {
		const {repository: {repositoryTransform: {fields}}} = this.props;
		let index = this.getFieldIndexByRow(row);
		return this.columnHeaders[col].name == "timeEqZeroFormula" && index >= 0 ? fields[index].timeGtZeroFormula : null;
	}

    isTimeGtZero(row, col) {
		return this.columnHeaders[col].name == "timeGtZeroFormula";
	}

    isInputFieldColumn(col) {
		return this.columnHeaders[col].name == "name" || this.columnHeaders[col].name == "axisCoordinates" || this.columnHeaders[col].name == "timeGtZeroFormula" || this.columnHeaders[col].name == "timeEqZeroFormula";
	}

    firstUserField() {
		const {repository: {repositoryTransform: {fields}}} = this.props;
		let index = fields.findIndex(f => f.userField == true);
		return index > -1 ? index : fields.length;
	}

    lastNonUserRow() {
		let firstUserRow = this.grid?.collectionView?.items?.findIndex(r => r.userField == true);
		return firstUserRow !== null ? firstUserRow > -1 ? firstUserRow - 1 : this.grid.collectionView.items.length - 1 : -1;
	}

    @action insertRow(isBefore: boolean) {
		if (!this.grid?.collectionView) {
			return;
		}
		const {repository: {repositoryTransform: {fields}}} = this.props;
		let index = this.getFieldIndexByRow(this.grid.selection.topRow);
		index = isBefore ? index : index + 1;
		if (index < this.firstUserField())
			index = this.firstUserField();
		fields.splice(index, 0, {hide: false, include: true, name: "Untitled", axisCoordinates: "Column=Untitled", timeAggregator: "", timeEqZeroFormula: "", timeGtZeroFormula: "", userField: true});
		this.saveRepositoryFieldTransform([{index: index, newIndex: index, insert: true}]);
		this.unhighlightMatchingFields();
	}

    @action insertRowEnd() {
		const {repository: {repositoryTransform: {fields}}} = this.props;
		let index = fields.length;
		fields.splice(index, 0, {hide: false, include: true, name: "Untitled", axisCoordinates: "Column=Untitled", timeAggregator: "", timeEqZeroFormula: "", timeGtZeroFormula: "", userField: true});
		this.saveRepositoryFieldTransform([{index: index, newIndex: index, insert: true}]);
	}

    @action deleteRow() {
		if (!this.grid?.collectionView) {
			return;
		}
		const {repository: {repositoryTransform: {fields}}} = this.props;
		let topIndex = this.grid.selection.topRow;
		let bottomIndex = this.grid.selection.bottomRow;
		let updates = [];
		for (let i = bottomIndex; i >= topIndex; i--){
			if (this.grid.collectionView.items[i].userField) {
				let index = this.getFieldIndexByRow(i);
				updates.push({index: index, newIndex: -1});
				fields.splice(index, 1);
			}
		}
		this.saveRepositoryFieldTransform(updates);
		this.unhighlightMatchingFields();
	}

    setAllHide(hide: boolean) {
		const {repository: {repositoryTransform: {fields}}} = this.props;
		let updates = [];
		fields.forEach((f, i) => {f.hide = hide; updates.push({index: i, columnPath: "hide", update: hide})});
		this.saveRepositoryFieldTransform(updates);
	}

    toggleHidden(){
		let {repository: {userOptions}} = this.props;
		userOptions.hideHiddenFields = !userOptions.hideHiddenFields;
		this.grid.columnHeaders.setCellData(0, 0, userOptions.hideHiddenFields ? this.columnLabels.hide_active : this.columnLabels.hide_inactive);
		this.grid.columnHeaders.setCellData(1, 0, userOptions.hideHiddenFields ? this.columnLabels.hide_active : this.columnLabels.hide_inactive);
		this.props.repository.saveUserOptions_debounced();
		this.unhighlightMatchingFields();
	}

    setAllInclude(include: string) {
		const {repository: {repositoryTransform: {fields}}} = this.props;
		let updates = [];
		if (include == "all") {
			fields.forEach((f, i) => {f.include = true; updates.push({index: i, columnPath: "include", update: true})});
		} else if (include == "none") {
			fields.forEach((f, i) => {f.include = false; updates.push({index: i, columnPath: "include", update: false})});
		} else {
			fields.forEach((f, i) => {f.include = f.userField; updates.push({index: i, columnPath: "include", update: f.include = f.userField})});
		}
		this.saveRepositoryFieldTransform(updates);
	}

    isFormulaColumn(c){
		return this.columnHeaders[c].name == "timeGtZeroFormula" || this.columnHeaders[c].name == "timeEqZeroFormula";
	}

    highlightMatchingFields(s) {
		const {repository: {repositoryTransform: {fields}}} = this.props;
		if (!this.isFormulaColumn(s.selection.col)){							// Only highlight if in a formula
			return;
		}

		this.selectedTextHighlight = _.escape(this.grid.cells.getCellData(s.selection.row, s.selection.col, false));
		let colorCycleLength = Object.keys(this.colorsMap).length;
		let mapObj = {};
		if (this.selectedTextHighlight != "") {
			let currentColorIndex = 0;
			fields.forEach((f, i) => {											// Try to match and highlight each field within the current formula
				if (f.name == "") return;
				let regTxt = new RegExp("(?<=([^0-9A-Za-z_\u00A0-\uFFFF]|^))(" + f.name + ")(?=([^0-9A-Za-z_\u00A0-\uFFFF]|$))", "g"); // matches name that is not preceded by a character and not followed by a character
				if(regTxt.test(this.selectedTextHighlight)) {					// If there is a match
					let color = this.colorsMap[currentColorIndex % colorCycleLength]; // Get color for text of matched field name in formula
					let bgcolor = this.backgroundColorsMap[currentColorIndex % colorCycleLength]; // Get corresponding color of background highlight of matching fields
					this.cellHighlights.push({index: i, color: color, bgcolor: bgcolor});
					this.highlightedIndices.push(i);
					mapObj[f.name] = `<span style="color: ${color}; font-weight: bold;">${_.escape(f.name)}</span>`; // Create a colored text span for the matched field in the formula
					currentColorIndex = (currentColorIndex + 1) % colorCycleLength;
				}
			});

			if(this.highlightedIndices.length > 0) {							// If any fields have been matched, build and replace text with highlighted text
				let allReg = new RegExp(Object.keys(mapObj).map(name => "(?<=([^0-9A-Za-z_\u00A0-\uFFFF]|^))(" + name + ")(?=([^0-9A-Za-z_\u00A0-\uFFFF]|$))").join("|"), "g"); // finds and replaces all matches (which are keys in mapObj) at the same time
				this.selectedTextHighlight = this.selectedTextHighlight.replace(allReg, function (matched) {
					return mapObj[matched];
				});
				// Highlighting may change size needed for row
				this.grid.autoSizeRows(s.selection.row, s.selection.row);
			}

			this.refresh_debounced();
		}
		this.formulaInputDiv.innerHTML = this.selectedTextHighlight;
	}

    unhighlightMatchingFields() {
		this.cellHighlights = []; //reset highlighting
		this.highlightedIndices = [];
		this.selectedTextHighlight = null;
		this.refresh_debounced();
	}

    colorsMap = {
		0: "rgb(61,107,193)",
	    1: "rgb(179,64,67)",
	    2: "rgb(123,91,177)",
	    3: "rgb(51,121,46)",
	    4: "rgb(164,71,129)",
	    5: "rgb(170,79,30)",
	    6: "rgb(58,114,143)"
	};

    backgroundColorsMap = {
		0: "rgb(232,240,249)",
		1: "rgb(249,235,235)",
		2: "rgb(242,238,247)",
		3: "rgb(229,241,233)",
		4: "rgb(247,236,242)",
		5: "rgb(248,236,231)",
		6: "rgb(232,241,244)"
	};

    columnMap = {
		"name": "name",
		"include": "include",
		"hide": "hide",
		"axisCoordinates": "axis_coordinates",
		"timeAggregator": "time_aggregator",
		"timeEqZeroFormula": "time_eq_zero_formula",
		"timeGtZeroFormula": "time_gt_zero_formula"
	};

	getErrors(row, col) {
		const {repository: {messages}} = this.props;
		let index = this.getFieldIndexByRow(row) + 1; // index in messages is 1 indexed and also includes two fields not in rows (+2 - 1)
		return messages.filter(m => m.messageLevel == "E" && m.inputColumn == this.columnMap[this.columnHeaders[col].name] && m.inputRow == index)
	}
}
