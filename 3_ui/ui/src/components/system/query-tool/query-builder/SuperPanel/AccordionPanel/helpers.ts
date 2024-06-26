export function  computeDerived() {
}

	// 	let checkedCount = 0, availableCount = 0, availableAndCheckedCount = 0;
	//
	// 	for (let v of this.values) {
	// 		if (v.available) {availableCount++;}
	// 		if (v.checked) { checkedCount++; }
	// 		if (v.available && v.checked) { availableAndCheckedCount++; }
	// 	}
	//
	// 	this.areAllAvailableSelected   = availableAndCheckedCount === availableCount;
	// 	this.unavailable               = _.every(this.values, v => !v.available);
	// 	this.areSomeButNotAllChecked   = checkedCount > 0 && checkedCount < this.values.length;
	// 	this.indeterminate             = checkedCount < this.values.length && checkedCount > 0 && !this.areAllAvailableSelected;
	// 	this._checkedCount             = checkedCount;
	// 	this._availableCount           = availableCount;
	// 	this._availableAndCheckedCount = availableAndCheckedCount;
	//
	// 	this.isOnlyAvailableItemSelected = availableCount === 1 && checkedCount === this.values.length;
	//
	// 	// Derived from above
	// 	this.areNoAvailableValuesSelected = availableAndCheckedCount === 0;
	// }
	//
	// get checkedCount() { return this._checkedCount}
	//
	// get availableAndCheckedCount() { return this._availableAndCheckedCount}
	//
	// get unavailableCount() { return this.values.length - this.availableCount}
	//
	// get availableCount() { return this._availableCount}
	//
	// get canCollapse() {
	// 	return !this.areNoAvailableValuesSelected
	// }