import { observable, makeObservable } from 'mobx';
import {PivotDetailCell, PivotCoordinateCell} from 'stores/queryResult';
import { PivotData, PivotGetDataParams } from "../../../../stores/queryResult/models/pivot";

export class CachedMatrix {
	/*
	 rows::number                            the number of rows in the underlying matrix
	 cols::number                            the number of cols in the underlying matrix
	 cerb::number                            cache entry row size is 2^cerb (which is also 1 << cerb), this is a cache size / tuning parameter, possibly 6
	 cecb::number                            cache entry col size is 2^cecb (which is also 1 << cecb), this is a cache size / tuning parameter, possibly 5
	 csrb::number                            cache row size is 2^csrb (which is also 1 << csrb), this is a cache size / tuning parameter, possibly 5
	 cscb::number                            cache col size is 2^cscb (which is also 1 << cscb), this is a cache size / tuning parameter, possibly 4
	 */
	cache:  [[ PivotData ]]; // a matrix of cache rectangles (i.e. cache entries)
	row_tags:[[number]]; // the integer value of the high order bits identifying the current cache rectangle occupant's row
	col_tags:[[number]]; // the integer value of the high order bits identifying the current cache rectangle occupant's col
	row_decode:(x:number) => {tag:number, cache:number, entry:number}; // a Function to translate a row coordinate into a tag_row (high order bits), cache_row (middle order bits), and entry_row (low order bits)
	col_decode:(x:number) => {tag:number, cache:number, entry:number}; //  Function to translate a row coordinate into a tag_row (high order bits), cache_row (middle order bits), and entry_row (low order bits)
	@observable isCachedBlocked:boolean = false; // get operations on the cache are blocked(returns undefined) when there is a cache miss and unblocked when the required data is fetched asynchonously

	construct_decode(eb:number, sb:number) {
		const TOTAL_BITS = 32;

		return (x) => {
			return {tag:x >>> (eb + sb), cache:x << (TOTAL_BITS - eb - sb) >>> (TOTAL_BITS - sb), entry:x << (TOTAL_BITS - eb) >>> (TOTAL_BITS - eb)}
		}
	}

	constructor(public underlying_matrix:(window:PivotGetDataParams) => Promise<PivotData>, public rows:number, public cols:number, public cerb:number, public cecb:number, public csrb:number, public cscb:number) {
        makeObservable(this);
        this.row_decode = this.construct_decode(cerb, csrb);
        this.col_decode = this.construct_decode(cecb, cscb);
        this.reset();
    }

	reset() {
		const {csrb, cscb} = this;
		this.cache = new Array(1 << csrb).fill(null).map(() => new Array(1 << cscb)) as any;
		this.row_tags = new Array(1 << csrb).fill(null).map(() => new Array(1 << cscb)) as [[number]]
		this.col_tags = new Array(1 << csrb).fill(null).map(() => new Array(1 << cscb)) as [[number]]
	}

	getCell(row:number, col:number, enableFetch:boolean = true) {
		const {tag:tag_row, cache:cache_row, entry:entry_row} = this.row_decode(row);
		const {tag:tag_col, cache:cache_col, entry:entry_col} = this.col_decode(col);

		if (tag_row != this.row_tags[cache_row][cache_col] || tag_col != this.col_tags[cache_row][cache_col]) // not in cache
		{
			if (!this.isCachedBlocked && enableFetch) {
				const row_start = (tag_row << (this.cerb + this.csrb)) + (cache_row << this.cerb)
				const col_start = (tag_col << (this.cecb + this.cscb)) + (cache_col << this.cecb)

				this.isCachedBlocked = true;
				this.underlying_matrix({x: col_start, columns: Math.min(this.cols - col_start, 1 << this.cecb), y: row_start, rows: Math.min(this.rows - row_start, 1 << this.cerb)}).then((data) => {
					this.cache[cache_row][cache_col] = data
					this.row_tags[cache_row][cache_col] = tag_row;                                                  // identify new cache entry by its tag_row
					this.col_tags[cache_row][cache_col] = tag_col;                                                  // identify new cache entry by its tag_col
					this.isCachedBlocked = false;
				})
			}
			return undefined;
		}
		else {
			const entry = this.cache[cache_row][cache_col];
			return {detailCell:entry.detailCells[entry_row][entry_col], colCoords:entry.colCoords[entry_col], rowCoords:entry.rowCoords[entry_row]};
		}
	}
}