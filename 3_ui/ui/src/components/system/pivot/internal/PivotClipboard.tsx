import { PivotTable } from "../pivotTable";
import type { PivotPart } from 'stores';
import { PivotData, site, PivotGetDataParams, simulationStore, Axis } from 'stores';
import { bp } from 'components';
import { SheetClip } from 'utility';
import { observer } from "mobx-react";
import { observable } from "mobx";

export class PivotClipboard {
	constructor(private pivot: PivotTable) {
	}

	clipboardData: string;

	labelForCoord = (axis: Axis, coord?: any) => {
		return axis.groupName.label == 'Simulation'
			? simulationStore.simulations.get(coord.label).name
			: !coord ? '' : coord.label ? coord.label : coord;
	}

	/**
	 * Called after a user executes a copy action via ctrl-c or a context menu
	 *
	 * Because we _must_ execute the copy synchronously in response to this user interaction, but because
	 * we are dependent upon asynchronous data we may or may not have, this operation is made much more complex.
	 *
	 * If we have the data already on hand, we can put the data on the clipboard in response to the user's action
	 * If not, we have to asynchronously fetch the data, indicate to the user we are doing so, and then prompt them to perform an action
	 * (clicking a hyperlink, hitting ctrl-c) to actually place the data on the clipboard.
	 *
	 * @param {boolean} special
	 * @param {PivotPart} target
	 */
	copy = async (special = false, target?: PivotPart) => {
		const {
			labelForCoord,
			pivot: { cache, pivotParts, props: { queryResult: qr, queryResult: { pivotMetadata, arrangement: { rowAxes, columnAxes } } } }
		} = this;

		// Does our cache already have all data needed?

		let rows = [];

		let dataIsReady = true;
		let getDataRange: PivotGetDataParams;

		if (target == 'columns' || (pivotParts.columns.grid && pivotParts.columns.grid.containsFocus())) {
			const { selection } = pivotParts.columns.grid;

			getDataRange = { x: selection.leftCol, columns: selection.columnSpan, y: 0, rows: 1 };

			for (let r = selection.topRow; r <= selection.bottomRow; r++) {
				const row = [];

				const axis = columnAxes[r];
				if (special) {
					// Column axis label
					row.push(axis.groupName.label);
				}

				// Column Axis Coordinates
				for (let c = selection.leftCol; c <= selection.rightCol && dataIsReady; c++) {
					const cell = cache.getCell(0, c);

					if (cell == undefined) {
						dataIsReady = false;
						row.push(cell);
					}
					else {
						row.push(labelForCoord(axis, axis.groupMembers[cell.colCoords[r].coordinate]));
					}
				}
				rows.push(row);
			}
			//this.copyData = await qr.pivot.getData({ x: selection.leftCol, columns: selection.columnSpan, y: 0, rows: 1 });

		}
		else if (target == 'rows' || (pivotParts.rows.grid && pivotParts.rows.grid.containsFocus())) {
			const { selection } = pivotParts.rows.grid;

			getDataRange = { x: 0, columns: 1, y: selection.topRow, rows: selection.rowSpan };

			if (special) {
				// Axis label
				const row = [];
				for (let c = selection.leftCol; c <= selection.rightCol; c++) {
					const axis = rowAxes[c];
					row.push(axis.groupName.label);
				}

				rows.push(row);
			}

			for (let r = selection.topRow; r <= selection.bottomRow; r++) {
				const row = [];

				// Row Axis Coordinates
				for (let c = selection.leftCol; c <= selection.rightCol && dataIsReady; c++) {
					const axis = rowAxes[c];
					const cell = cache.getCell(r, 0);

					if (cell == undefined) {
						dataIsReady = false;
						row.push(cell);
					}
					else {
						row.push(labelForCoord(axis, axis.groupMembers[cell.rowCoords[c].coordinate]));
					}
				}
				rows.push(row);
			}
		}
		else if (target == 'details' || pivotParts.details.grid.containsFocus()) {
			const { selection } = pivotParts.details.grid;

			getDataRange = { x: selection.leftCol, columns: selection.columnSpan, y: selection.topRow, rows: selection.rowSpan };

			if (special) {
				columnAxes.forEach((colAxis, i) => {
					const row = [];
					rowAxes.forEach(rowAxis => row.push(''));
					row.push(colAxis.groupName.label);
					for (let c = selection.leftCol; c <= selection.rightCol; c++) {
						const cell = cache.getCell(0, c);
						if (cell == undefined) {
							dataIsReady = false;
						}
						else {
							row.push(labelForCoord(colAxis, colAxis.groupMembers[cell.colCoords[i].coordinate]));
						}
					}

					rows.push(row);
				})

				rows.push([...rowAxes.map(rowAxis => rowAxis.groupName.label)]);
			}

			for (let r = selection.topRow; r <= selection.bottomRow && dataIsReady; r++) {
				const row = [];

				if (special) {
					// Row coordinate values
					const cell = cache.getCell(r, selection.leftCol);

					if (cell == undefined) {
						dataIsReady = false;
					}
					else {
						row.push(...cell.rowCoords.map((coord, i) => labelForCoord(rowAxes[i], rowAxes[i].groupMembers[coord.coordinate])));
					}
					row.push(''); // Separator between row axes and detail cells
				}

				// Detail cells
				row.push(..._.range(selection.leftCol, selection.rightCol + 1).map(c => {
					const cell = cache.getCell(r, c);
					if (cell == undefined) {
						dataIsReady = false;
						return cell;
					}
					else {
						return cell.detailCell.data;
					}
				}))

				rows.push(row);
			}
		}

		if (dataIsReady) {
			this.clipboardData = _.trimEnd(SheetClip.stringify(rows));
			document.execCommand('copy');
			site.toaster.show({ intent: bp.Intent.PRIMARY, message: 'Data copied to clipboard.' })
		}
		else {
			// Show a loading notification

			let toastKey = site.toaster.show({
				                                 intent: bp.Intent.NONE,
				                                 timeout: -1,
				                                 message: <div>
					                                 <bp.ProgressBar
						                                 className={classNames("docs-toast-progress")}
						                                 intent={bp.Intent.PRIMARY}
						                                 value={100}
					                                 />
					                                 <span className="text">Fetching data...</span>
				                                 </div>
			                                 });

			// Go get the data ourselves

			let data = await qr.pivot.getData(getDataRange);

			// Now recreate the string (again) using the fetched range

			this.setupCopyStringFromPivotData(data, special, target)
			site.toaster.dismiss(toastKey);

			// Once the data is ready, change the notification to a hyperlink
			toastKey = site.toaster.show({
				                             intent: bp.Intent.PRIMARY,
				                             timeout: -1,
				                             message: <span><a onClick={() => {
					                             document.execCommand('copy');
					                             site.toaster.show({ message: "Copied!" }, toastKey);
					                             setTimeout(() => {
						                             site.toaster.dismiss(toastKey);
					                             }, 1000)
				                             }}>Click to Copy</a></span>
			                             });

		}
	}

	onCopy = (e) => {
		e.clipboardData.setData('text/plain', this.clipboardData);
		e.preventDefault();
	}

	private setupCopyStringFromPivotData(data: PivotData, special: boolean, target: PivotPart) {
		const {
			labelForCoord,
			pivot: { cache, pivotParts, props: { queryResult: qr, queryResult: { pivotMetadata, arrangement: { rowAxes, columnAxes } } } }
		} = this;

		// Does our cache already have all data needed?

		let rows = [];

		if (target == 'columns' || (pivotParts.columns.grid && pivotParts.columns.grid.containsFocus())) {
			const { selection } = pivotParts.columns.grid;

			for (let r = 0; r < selection.rowSpan; r++) {
				const row = [];

				const axis = columnAxes[r];
				if (special) {
					// Column axis label
					row.push(axis.groupName.label);
				}

				// Column Axis Coordinates
				for (let c = 0; c < selection.columnSpan; c++) {
					const coord = data.colCoords[c][r];

					row.push(labelForCoord(axis, axis.groupMembers[coord.coordinate]));
				}
				rows.push(row);
			}
		}
		else if (target == 'rows' || (pivotParts.rows.grid && pivotParts.rows.grid.containsFocus())) {
			const { selection } = pivotParts.rows.grid;

			if (special) {
				// Axis label
				const row = [];
				for (let c = 0; c < selection.columnSpan; c++) {
					const axis = rowAxes[c];
					row.push(axis.groupName.label);
				}

				rows.push(row);
			}

			for (let r = 0; r < selection.rowSpan; r++) {
				const row = [];

				// Column Axis Coordinates
				for (let c = 0; c < selection.columnSpan; c++) {
					const axis = rowAxes[c];
					const coord = data.rowCoords[r][c];

					row.push(labelForCoord(axis, axis.groupMembers[coord.coordinate]));
				}
				rows.push(row);
			}
		}
		else if (target == 'details' || (pivotParts.details.grid && pivotParts.details.grid.containsFocus())) {
			const { selection } = pivotParts.details.grid;

			if (special) {
				columnAxes.forEach((colAxis, i) => {
					const row = [];
					rowAxes.forEach(rowAxis => row.push(''));
					row.push(colAxis.groupName.label);
					for (let c = 0; c < selection.columnSpan; c++) {
						const coord = data.colCoords[c][i];
						row.push(labelForCoord(colAxis, colAxis.groupMembers[coord.coordinate]));
					}

					rows.push(row);
				})

				rows.push([...rowAxes.map(rowAxis => rowAxis.groupName.label)]);
			}

			for (let r = 0; r < selection.rowSpan; r++) {
				const row = [];

				if (special) {
					// Row coordinate values
					row.push(...data.rowCoords[r].map((coord, i) => labelForCoord(rowAxes[i], rowAxes[i].groupMembers[coord.coordinate])));

					row.push(''); // Separator between row axes and detail cells
				}

				// Detail cells
				for (let c = 0; c < selection.columnSpan; c++) {
					row.push(data.detailCells[r][c].data);
				}

				rows.push(row);
			}
		}

		this.clipboardData = _.trimEnd(SheetClip.stringify(rows));
	}
}
