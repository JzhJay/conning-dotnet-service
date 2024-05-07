export class RangeUtility {

	public static rangeContains(index: number, ranges: Array<IRange>): boolean {
		return _.some(ranges, r => r.from <= index && index <= r.to);
	}

	public static removeFromRanges(ranges: Array<IRange>, index: number) {
		// Unchecking
		// See if we need to split a range
		let handled = false;
		_.forEach(ranges, (r: IRange, i: number) => {
			if (!handled) {

				if (r.from <= index && r.to >= index) {
					handled = true;

					if (r.from === r.to) {
						// Nuke this entry
						ranges.splice(i, 1);
					}
					else {
						// Can we just shorten this range?
						if (r.from === index) {
							r.from++;
						}
						else if (r.to === index) {
							r.to--;
						}
						else {
							// We need to subdivide this range into two ranges

							let newRange = {from: index + 1, to: r.to};
							r.to         = index - 1;
							ranges.push(newRange);
						}
					}
				}
			}
		});
	}

	public static removeRangesFromRanges(ranges: Array<IRange>, toDelete: Array<IRange>) {
		toDelete.forEach((del: IRange) => {
			if (del.from === del.to) {
				this.removeFromRanges(ranges, del.from);
			}
			else {
				for (let i = 0; i < ranges.length; i++) {
					let r = ranges[i];

					// Range truncation cases
					// 2-5, delete 1-2, result: 3-5
					if (del.from <= r.from && del.to >= r.from) {
						if (del.to >= r.to) {
							// Kill this entire range
							ranges.splice(i, 1);
							i--;
						}
						else {
							r.from = del.to + 1;
						}
					}
					// 1-5, delete 4-6, result: 1-3
					else if (del.from <= r.to && del.to >= r.to) {
						if (del.from <= r.from) {
							// Kill this entire range
							ranges.splice(i, 1);
							i--;
						} else {
							r.to = del.from - 1;
						}
					}

					// Completely contained deletion (one range becomes split into two)
					// 1-6, delete 2-5, result: 1, 6
					else if (r.from <= del.from && r.to >= del.to) {
						let to = r.to;
						r.to   = del.from - 1;
						ranges.push({from: del.to + 1, to: to})
					}
				}
			}
		});
	}

	public static addToRanges(ranges: Array<IRange>, add: number) {
		let handled = false;
		_.forEach(ranges, (r: IRange) => {
			if (!handled) {
				if (r.from === add + 1) {
					r.from  = add;
					handled = true;
				}
				else if (r.to === add - 1) {
					r.to    = add;
					handled = true;
				} else if (r.from <= add && r.to >= add) {
					handled = true;  // Already included
				}
			}
		});

		if (!handled) {
			let index = _.findIndex(ranges, (r: IRange) => r.from > add);
			if (index === -1) {
				ranges.push({from: add, to: add});
			}
			else {
				ranges.splice(index, 0, {from: add, to: add});
			}
		}

		this.combineOverlappingRanges(ranges);
	}

	private static combineOverlappingRanges(ranges: Array<IRange>) {
		// Combine any ranges that are adjacent to each other
		let modified = false;
		ranges.sort((a: IRange, b: IRange) => a.from - b.from);

		for (let i = 1; i < ranges.length; i++) {
			let r = ranges[i];
			if (ranges[i - 1].to + 1 >= r.from) {
				ranges[i - 1].to = r.to;
				ranges.splice(i, 1);
				i--;
				modified = true;
			}
		}

		if (modified) {
			this.combineOverlappingRanges(ranges);
		}
	}

	public static addRangesToRanges(ranges: Array<IRange>, toAdd: Array<IRange>) {
		toAdd.forEach((add: IRange) => {
			if (add.from === add.to) {
				this.addToRanges(ranges, add.from);
			}
			else {
				let handled = false;
				for (let i = 0; i < ranges.length; i++ && !handled) {
					let r = ranges[i];

					// Range overlap cases
					// 2-5, add 1-2, result: 1-5
					if (add.from <= r.from && add.to >= r.from && add.to <= r.to) {
						r.from  = add.from
						handled = true;
					}
					// 1-5, add 4-6, result: 1-6
					else if (r.from <= add.from && r.to >= add.from && add.to >= r.to) {
						r.to    = add.to;
						handled = true;
					}
					// Range extension case
					// 0-1, 5-9999, add 2-4, result: 0-99999
					else if (add.from === r.to + 1) {
						r.to    = Math.max(add.to, r.to);
						handled = true;
					}
					else if (add.to + 1 === r.from) {
						r.from  = Math.min(add.from, r.from);
						handled = true;
					}
				}

				if (!handled) {
					ranges.push(add);
					handled = true;
				}
			}
		});

		this.combineOverlappingRanges(ranges);
	}
}
