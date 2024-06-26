
export interface ViewRange {
	row: number;
	/**
	 * Gets or sets the index of the first column in the range.
	 */
	col: number;
	/**
	 * Gets or sets the index of the second row in the range.
	 */
	row2: number;
	/**
	 * Gets or sets the index of the second column in the range.
	 */
	col2: number;
	/**
	 * Gets the number of rows in the range.
	 */
	rowSpan: number;
	/**
	 * Gets the number of columns in the range.
	 */
	columnSpan: number;

	leftCol: number, topRow : number, bottomRow: number, rightCol: number
}
