import {RepositoryVariablesView} from './RepositoryVariablesView';
export class RepositoryGridHandler {
    constructor(public repositoryVariablesView: RepositoryVariablesView) {
    }

    beginningEdit =(s, e) => {
        // console.log("beginningEdit");
		this.repositoryVariablesView.selectedTextHighlight = null; // Workaround to prevent inner html being replaced by syntax highlighting
		this.repositoryVariablesView.isEditing = true;
		if (e.col > 1 && this.repositoryVariablesView.shouldDisableEdit(e.row, e.col))
            e.cancel = true;
    };

    selectionChanging = (s, e) => {
		// console.log("selectionChanging");
		this.repositoryVariablesView.selectedRow = e.row;

        // Ignore selections from a re-render. panel == undefined?
        if (e.panel == null && e.col != -1) {
            e.cancel = true;
        }
    };

    selectionChanged = (s, e) => {
        // console.log("selectionChanged");
		// Reset Highlight Of Previous Selection
		this.repositoryVariablesView.unhighlightMatchingFields();
		this.repositoryVariablesView.currentSelection = e;

		if (e.col != -1 && e.row != -1) { // -1 if right click outside of grid
			this.repositoryVariablesView.formulaInput.value = this.repositoryVariablesView.grid.collectionView.items[e.row][this.repositoryVariablesView.columnHeaders[e.col].name];
			this.repositoryVariablesView.formulaInputDiv.innerHTML = _.escape(this.repositoryVariablesView.grid.collectionView.items[e.row][this.repositoryVariablesView.columnHeaders[e.col].name]);
			this.repositoryVariablesView.highlightMatchingFields(s);
		}
    };

    cellEditEnding = (s, e) => {
        // console.log("cellEditEnding");

        if (this.repositoryVariablesView.isFormulaColumn(e.col)) {
            if (this.repositoryVariablesView.theAutoComplete.containsFocus()){
                e.stayInEditMode = true;
            } else {
                this.repositoryVariablesView.theAutoComplete.itemsSource = [];
            }
        }

        // Editing the hide button while the filter is on seems to trigger the cell edit ending functions twice
		// Workaround is to cancel the edit and update it manually in cell edit ended.
        if (this.repositoryVariablesView.isHideColumn(e.row, e.col)) {
			e.cancel = true;
		}
    };

    cellEditEnded = (s, e) => {
        // console.log("cellEditEnded");
		this.repositoryVariablesView.isEditing = false;
        let value = e.panel.getCellData(e.row, e.col);
        let field = this.repositoryVariablesView.columnHeaders[e.col].name;
        let index = this.repositoryVariablesView.getFieldIndex(this.repositoryVariablesView.grid.collectionView.items[e.row]);

		if (this.repositoryVariablesView.isHideColumn(e.row, e.col)) {
			value = !value;
			this.repositoryVariablesView.props.repository.repositoryTransform.fields[index][field] = value;
		}

        if (this.repositoryVariablesView.isFieldTypeColumn(e.row, e.col)) {
            let update = this.repositoryVariablesView.updatedFieldType(e.row, e.col);
            this.repositoryVariablesView.saveRepositoryFieldTransform([{index: index, columnPath: field, update: value}, update]);
		} else {
            this.repositoryVariablesView.saveRepositoryFieldTransform([{index: index, columnPath: field, update: value}]);
        }

		this.repositoryVariablesView.grid.autoSizeRows(e.row, e.row)
    };

    prepareCellForEdit = (s, e) => {
        console.log("prepareCellForEdit");
        if (this.repositoryVariablesView.isFormulaColumn(e.col)) {
            let input = this.repositoryVariablesView.grid.cells.getCellElement(s.selection.row, s.selection.col).children[0] as HTMLInputElement;
            let boundingRect = this.repositoryVariablesView.grid.getCellBoundingRect(s.selection.row, s.selection.col);

            input.addEventListener("keydown", (e:KeyboardEvent) => {
                if (e.code == "ArrowDown" || e.code == "ArrowUp") { //up or down keys
                    if (this.repositoryVariablesView.theAutoComplete.itemsSource.length > 0) {
                        this.repositoryVariablesView.theAutoComplete._keydown(e);
						e.preventDefault();
                        e.stopPropagation();
                    }
                }
                if (e.code == "Tab" || e.code == "Enter") { // tab or enter key
                    if (this.repositoryVariablesView.theAutoComplete.itemsSource.length > 0) {
                        this.repositoryVariablesView.selectAutoCompleteOption();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });
            input.addEventListener("keyup", (e:KeyboardEvent) => {
                if(!(e.code == "ArrowDown" || e.code == "ArrowUp" || e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "Tab" || e.code == "Enter")) //arrow keys or tab or enter
                    this.repositoryVariablesView.generateAutoCompleteOptions(input, boundingRect);
				this.repositoryVariablesView.formulaInput.value = input.value;
				this.repositoryVariablesView.formulaInputDiv.innerHTML = _.escape(input.value);
			});
        } else if (this.repositoryVariablesView.isInputFieldColumn(e.col)){
			let input = this.repositoryVariablesView.grid.cells.getCellElement(s.selection.row, s.selection.col).children[0] as HTMLInputElement;
			input.addEventListener("keyup", (e:KeyboardEvent) => {
				this.repositoryVariablesView.formulaInput.value = input.value;
				this.repositoryVariablesView.formulaInputDiv.innerHTML = _.escape(input.value);
			});
		}
    }

	resizedColumn(grid, e) {
		grid.autoSizeRows();
	}

	pastingCell = (s, e) => {
		// Prevent posting in readonly cells
		if (this.repositoryVariablesView.shouldDisableEdit(e.row, e.col)) {
			e.cancel = true;
		}
	}

	pastedCell = (s, e) => {
		let value = e.panel.getCellData(e.row, e.col);
		if (value == "-" && (this.repositoryVariablesView.isFieldTypeColumn(e.row, e.col) || this.repositoryVariablesView.isTimeAggregatorColumn(e.row, e.col))) {
            value = "";
        }
		let field = this.repositoryVariablesView.columnHeaders[e.col].name;
		let index = this.repositoryVariablesView.getFieldIndex(this.repositoryVariablesView.grid.collectionView.items[e.row]);

        if (this.repositoryVariablesView.isFieldTypeColumn(e.row, e.col)) {
            let update = this.repositoryVariablesView.updatedFieldType(e.row, e.col);
            this.repositoryVariablesView.pasteRepositoryFieldTransform(update);
        }

		this.repositoryVariablesView.props.repository.repositoryTransform.fields[index][field] = value;
		this.repositoryVariablesView.pasteRepositoryFieldTransform({index: index, columnPath: field, update: value});
		this.repositoryVariablesView.grid.autoSizeRows(e.row, e.row)
	}
}
