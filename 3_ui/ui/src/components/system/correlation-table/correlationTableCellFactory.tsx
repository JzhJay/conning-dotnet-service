import {CorrelationTable} from './correlationTable';

export const THIN_BORDER = 2;
import {i18n, settings} from 'stores';
import * as ReactDOMServer from 'react-dom/server';
import {CorrelationCellTooltip, CorrelationTooltipAxisCoordinate} from './CorrelationCellTooltip';
import {RawIntlProvider} from 'react-intl';

export class CorrelationCellFactory extends wijmo.grid.CellFactory {
	popupCells = [];
	popupTimer = null;

	constructor(public component: CorrelationTable) {
		super();
	}

	/**
	 * Cleans up the cell factory.
	 */
	release() {
		// Destroys all the popups that were created.
		// Note: Some of these popups might have been added to cells that are no longer attached
		// to the DOM so all cells containing popups are noted when the popups are added.
		this.popupCells.forEach((cell) => {
			($(cell) as any).popup('destroy');
		})
	}

	updateCell(panel, r, c, cell, rng, update) {

		super.updateCell(panel, r, c, cell, rng, false);
		let value = panel.getCellData(r, c, true);

		// validate CellType
		if (wijmo.grid.CellType.ColumnHeader === panel.cellType) {
			if (this.component.rotations[r].shouldRotate || r === panel.rows.length - 1) {
				cell.className += ' rotate-container';

				if (cell.children.length === 0) {
					cell.innerHTML = '<span></span>';
				}
			}
			else {
				this.component.verticallyAlign(cell);
			}

			cell.firstChild.innerHTML  = _.escape(value);
			cell.style.backgroundColor = this.component.axisBackgroundColor(r);

			cell.onmouseover = () => {
				this.component.headerHoverIn(r, c, false, cell)
			};
			cell.onmouseout  = this.component.headerHoverOut;

		}
		else if (wijmo.grid.CellType.RowHeader === panel.cellType) {
			if (this.component.rotations[c].shouldRotate || c === panel.columns.length - 1) {
				this.component.verticallyAlign(cell);
			}
			else {
				cell.className += ' rotate-container';
				cell.innerHTML = '<span></span>';
			}

			cell.firstChild.innerHTML  = _.escape(value);
			cell.style.backgroundColor = this.component.axisBackgroundColor(c);

			cell.onmouseover = () => {
				this.component.headerHoverIn(c, r, true, cell)
			};
			cell.onmouseout  = this.component.headerHoverOut;
		}
		else if (wijmo.grid.CellType.TopLeft === panel.cellType) {
			panel.columns[c].allowMerging = true;
			panel.columns[c].align        = "center";
			panel.columns[c].wordWrap     = true;

			if (c < r) {
				// box shadow to hide the cell border
				let color                  = this.component.axisBackgroundColor(c);
				cell.innerHTML             = `<div style="box-shadow:0px -${2 + (panel.rows.length - r - 1) * THIN_BORDER}px 0px ${color}; width:100%">&nbsp;</div>`;
				cell.style.overflow        = "visible";
				cell.style.padding         = "0px";
				cell.style.backgroundColor = color;
			}
			else {
				this.component.verticallyAlign(cell);
				cell.style.backgroundColor = this.component.axisBackgroundColor(r);
				cell.firstChild.innerHTML  = _.escape(value);
			}

			cell.style.borderBottomWidth = `${(panel.rows.length - r - 1) * THIN_BORDER}px`;

			if (c < r)
				cell.style.borderRightWidth = `${(panel.columns.length - c - 1) * THIN_BORDER}px`;
			else
				cell.style.borderRightWidth = `${(panel.columns.length ) * THIN_BORDER}px`;

			if (r === panel.rows.length - 1)
				cell.style.borderBottomWidth = `${(panel.rows.length) * THIN_BORDER}px`;
		}
		else {
			let cellAlignment              = Math.abs(value) === 1 ? "center" : "right";
			const emptyCellBackgroundColor = "rgb(127,127,127)";

			if (!(cell.textContent === value || parseFloat(cell.textContent) === parseFloat(value)) || (value === "" && cell.style.backgroundColor != emptyCellBackgroundColor)) {
				if (cell.children.length === 0) {
					//this.correlationTable.verticallyAlign(cell);
				}

				wijmo.setCss(cell, {
					backgroundColor: (value === "") ? emptyCellBackgroundColor : this.component.valueBackgroundColor(value)
				});

				cell.innerHTML = (value === "") ? "" : _.escape(this.component.calcCellValue(value));

				wijmo.setCss(cell, {
					color    : (value >= .8 || value <= -.8 ? 'white' : 'black'),
					textAlign: cellAlignment,
				});
			}
			else if (cell.style.textAlign !== cellAlignment) {
				// Reset the cell alignment that were reset by updateCell if required.
				wijmo.setCss(cell, {
					textAlign: cellAlignment
				});
			}

			// Always reset the mouse over and popup content which is based on the row/column
			cell.onmouseover = () => {
				if (this.component.readyShowTooltips) {
					var correlation = this.component.correlation.data.correlations[r][c];

					if (correlation != null) {
						// Initializing the popups on creation is way too expensive for large tables, e.g. load times go from 5 seconds without popups to 50 seconds with popups
						// So lets initialize them on mouseover and trigger ourselves
						this.popupTimer = setTimeout(() => this.onCellTooltip(cell, panel, r, c), 50);

						this.popupCells.push(cell);
					}

					this.component.cellHoverIn(r, c)
				}
			};

			cell.onmouseout = () => {
				this.popupTimer && clearTimeout(this.popupTimer);
				this.component.cellHoverOut()
			};

		}

		if (wijmo.grid.CellType.TopLeft !== panel.cellType) {

			// Border widths separating the axis levels are equal to the level * base border width
			// However the borders separating coordinates in the same axis are separated by different border widths
			// depending on the cells location within its group/quadrant
			if (wijmo.grid.CellType.ColumnHeader === panel.cellType) {
				cell.style.borderRightWidth  = `${ this.component.getQuadrantBorderWidth(c, r)}px`;
				cell.style.borderBottomWidth = `${ this.component.getHeaderLevelSeparatorBorderWidth(r)}px`;
			}
			else if (wijmo.grid.CellType.RowHeader === panel.cellType) {
				cell.style.borderRightWidth  = `${ this.component.getHeaderLevelSeparatorBorderWidth(c)}px`;
				cell.style.borderBottomWidth = `${ this.component.getQuadrantBorderWidth(r, c)}px`;
			}
			else {
				cell.style.borderRightWidth  = `${ this.component.getQuadrantBorderWidth(c, -1)}px`;
				cell.style.borderBottomWidth = `${ this.component.getQuadrantBorderWidth(r, -1)}px`;
			}
		}

		// Set the top or left border on the outermost cells.
		if ((wijmo.grid.CellType.ColumnHeader === panel.cellType || wijmo.grid.CellType.TopLeft === panel.cellType) && r === 0) {
			cell.style.borderTop = `${ this.component.getHeaderFirstBorderWidth(r)}px solid black`;
		}
		else
			cell.style.borderTop = null; // must be cleared since divs are re-used.

		if ((wijmo.grid.CellType.RowHeader === panel.cellType || wijmo.grid.CellType.TopLeft === panel.cellType) && c === 0) {
			cell.style.borderLeft = `${ this.component.getHeaderFirstBorderWidth(c)}px solid black`;
		}
		else
			cell.style.borderLeft = null;
	};

	private onCellTooltip = (cell, panel, r, c) => {
		const {axes, correlations, coordinates: coords} = this.component.correlation.data;

		const mapToAxis = (coord, i) => ({axis: axes[i], coord: axes[i].groupMembers[coord]}) as CorrelationTooltipAxisCoordinate;
		const value = correlations[r][c];

		$(cell).popup({
			//content: value.toFixed(userPrefs.formatPrecision),
			"html":      ReactDOMServer.renderToStaticMarkup(
				<RawIntlProvider value={i18n.intl}><CorrelationCellTooltip
					correlation={value}
					rowAxes={coords[r].map(mapToAxis)}
					colAxes={coords[c].map(mapToAxis)}/></RawIntlProvider>),
			"variation": "small",
			"position":  "right center"
		}).popup('show');
	};

}
