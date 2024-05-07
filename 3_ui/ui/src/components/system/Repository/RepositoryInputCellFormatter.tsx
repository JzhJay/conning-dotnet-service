import * as React from 'react';
import * as css from './RepositoryComponent.css';
import {RepositoryVariablesView} from './RepositoryVariablesView';

export class RepositoryInputCellFormatter {
	constructor(public repositoryVariablesView: RepositoryVariablesView) {
	}

	formatItem = (panel: wijmo.grid.GridPanel, row: number, col: number, cell: HTMLElement) => {
		let {grid} = this.repositoryVariablesView;

		if (row >= grid?.collectionView?.items?.length) // some issues with format while collection is changing, don't update non-existent cells
			return;


		if (panel == grid.cells && this.repositoryVariablesView.shouldDisableEdit(row, col)) {
			cell.className += ` ${css.notEditable}`;
			if (this.repositoryVariablesView.isAxisCoordinatesColumn(row, col)) {
				cell.innerText = "";
			}
		}

		if (panel == grid.cells && this.repositoryVariablesView.timeEqplaceHolderText(row, col)) {
			let input = cell.firstChild as HTMLInputElement;
			if (input) {
				input.placeholder = this.repositoryVariablesView.timeEqplaceHolderText(row, col);
			} else { // Conveniently, the input element doesn't exist if the input field is blank and not selected
				cell.innerText = this.repositoryVariablesView.timeEqplaceHolderText(row, col);
				cell.className += ` ${css.placeholderColor}`;
			}
		}

		if (panel == grid.cells && this.repositoryVariablesView.isNameColumn(row, col)) {
			if (this.repositoryVariablesView.shouldHighlightNameColumn(row, col)) {
				let highlight = this.repositoryVariablesView.nameColumnHighlight(row, col)
				cell.style.border = `2px solid ${highlight.color}`;
				cell.style.backgroundColor = `${highlight.bgcolor}`;
			} else {
				cell.style.border = ``;
				cell.style.backgroundColor = ``;
			}
		}

		if (panel == grid.cells && this.repositoryVariablesView.isFormulaColumn(col) && row == panel.grid.selection.row && col == panel.grid.selection.col) {
			if (this.repositoryVariablesView.selectedTextHighlight) {
				cell.innerHTML = this.repositoryVariablesView.selectedTextHighlight;
			}
		}

		// https://www.grapecity.com/wijmo/demos/Grid/CustomCells/CellNotes/purejs
		let errors = this.repositoryVariablesView.getErrors(row, col);
		if (panel == grid.cells && errors.length > 0) {
			cell.className += ` ${css.hasNotes}`;
			let message = "";
			errors.forEach(e => {
				message = message + '&bull; ' + e.messageText + '<br/>'
			});
			if (this.repositoryVariablesView.tooltip)
				this.repositoryVariablesView.tooltip.setTooltip(cell, '<b>Errors:</b><br/>' + message);

			if(!(row == panel.grid.selection.row && col == panel.grid.selection.col)) { // Selected formula will have highlights already, difficult to highlight errors as well. Also will replace inputs
				let innerHTML = _.escape(cell.innerText);
				errors.sort((a,b) => b.startpos[2] - a.startpos[2]); // process errors in backwards order
				errors.forEach(e => {
					if(e.startpos[2] > 0) { // indices are 1 indexed, ignore negative indices
						const escapedSubtring = (start: number, end?: number) => _.escape(cell.innerText.slice(start, end == null ? cell.innerHTML.length : end));
						innerHTML = `${escapedSubtring(0, e.startpos[2] - 1)}<span style="color: red">${escapedSubtring(e.startpos[2] - 1, e.endpos[2])}</span>${escapedSubtring(e.endpos[2])}`
					}
				});
				cell.innerHTML = `<span>${innerHTML}</span>`;
			}
		}
	}
}
