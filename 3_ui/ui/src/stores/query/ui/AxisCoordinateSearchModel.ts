import { AxisCoordinate, AccordionPanel, api, mobx } from 'stores';
import { QueryAxisWrapper } from 'stores/query/ui/wrappers';
import { action, observable, computed, makeObservable } from 'mobx';

export interface AxisCoordinateSearchResultModel {
	axis: QueryAxisWrapper;
	coord?: AxisCoordinate;
	score?: number;
}

class Searcher {

}

const Scoring = {
	axis: {
		name:  {
			wholeFirstWord:       20,
			wholeOtherWord:       18,
			beginningOfFirstWord: 16,
			beginningOfOtherWord: 14,
			other:                4
		},
		descr: {
			wholeFirstWord:       12,
			wholeOtherWord:       11,
			beginningOfFirstWord: 8,
			beginningOfOtherWord: 7,
			other:                2
		}
	},

	coord: {
		name:  {
			wholeFirstWord:       19,
			wholeOtherWord:       17,
			beginningOfFirstWord: 15,
			beginningOfOtherWord: 13,
			other:                3
		},
		descr: {
			wholeFirstWord:       10,
			wholeOtherWord:       9,
			beginningOfFirstWord: 6,
			beginningOfOtherWord: 5,
			other:                1
		}
	}
}

class Scorer {
	constructor(public searchText: string) {
		let escapedSearchText = api.utility.escapeRegExp(searchText);

		this.wholeFirstWord     = new RegExp(`^(${escapedSearchText})\\b`, "i");
		this.wholeOtherWord     = new RegExp(`\\b(${escapedSearchText})\\b`, "i");
		this.beginningFirstWord = new RegExp(`^(${escapedSearchText})(.*)`, "i");
		this.beginningOtherWord = new RegExp(`\\b(${escapedSearchText})(.*)`, "i");
		this.matchAnywhere      = new RegExp(escapedSearchText, "i");
	}

	wholeFirstWord: RegExp;
	wholeOtherWord: RegExp;
	beginningFirstWord: RegExp;
	beginningOtherWord: RegExp;
	matchAnywhere: RegExp;

	match(regEx: RegExp, target) {
		return regEx.exec(target) || regEx.exec(target.replace(/_/g, ' '));
	}

	scoreAxis(axis: QueryAxisWrapper): number {
		if (this.searchText.length === 0) { return 0 }

		const {axis: score} = Scoring;

		const label     = axis.label;
		const description = axis.description;

		const {searchText, matchAnywhere, wholeFirstWord, wholeOtherWord, beginningFirstWord, beginningOtherWord} = this;
		if (this.match(wholeFirstWord, label)) return 20;
		if (this.match(wholeOtherWord, label)) return 18;
		if (this.match(beginningFirstWord, label)) return 16;
		if (this.match(beginningOtherWord, label)) return 14;

		if (description) {
			if (this.match(wholeFirstWord, description)) return 12;
			if (this.match(wholeOtherWord, description)) return 11;
			if (this.match(beginningFirstWord, description)) return 8;
			if (this.match(beginningOtherWord, description)) return 7;
		}

		if (searchText.length > 1 && this.match(matchAnywhere, label)) return 4;
		if (description && searchText.length > 1 && this.match(matchAnywhere, description)) return 2;

		return 0;
	}

	scoreCoordinate(coord: AxisCoordinate): number {
		if (this.searchText.length === 0) { return 0 }

		const {axis: score} = Scoring;

		const label     = coord.label;
		const description = coord.description;

		const {searchText, matchAnywhere, wholeFirstWord, wholeOtherWord, beginningFirstWord, beginningOtherWord} = this;

		if (this.match(wholeFirstWord, label)) return 19;
		if (this.match(wholeOtherWord, label)) return 17;
		if (this.match(beginningFirstWord, label)) return 15;
		if (this.match(beginningOtherWord, label)) return 13;

		if (description) {
			if (this.match(wholeFirstWord, description)) return 10;
			if (this.match(wholeOtherWord, description)) return 9;
			if (this.match(beginningFirstWord, description)) return 6;
			if (this.match(beginningOtherWord, description)) return 5;
		}

		if (searchText.length > 1 && this.match(matchAnywhere, label)) return 3;
		if (description && searchText.length > 1 && this.match(matchAnywhere, description)) return 1;

		return 0;
	}
}

/**
 * Holds state for Axis Coordinate searchers in the Query Builder
 */
export class AxisCoordinateSearchModel {
	constructor(public panel: AccordionPanel) {
        makeObservable(this);
        const allResults = [];

        for (const axis of mobx.values(panel.clause.axes).map(a => panel.query.axisById(a.id))) {
			if (axis.code !== "Scenario") {
				const axisResult = {axis: axis, axisLabel: axis.label.toLowerCase(), axisDesc: axis.description.toLowerCase()};
				allResults.push(axisResult);

				for (const coord of axis.coordinates) {
					allResults.push(Object.assign({coord: coord, coordLabel: coord.label.toLowerCase(), coordDesc: coord.description.toLowerCase()}, axisResult));
				}
			}
		}
        this.allResults = allResults;
    }

	resultToString(result: AxisCoordinateSearchResultModel) {
		return result ? `${result.axis.label} = ${result.coord ? result.coord.label : ''}` : '';
	}

	private allResults: AxisCoordinateSearchResultModel[];
	searchListRef: Element|Text = null;

	@observable isSearching = false;

	@observable private _inputFocused = false;
	get inputFocused() { return this._inputFocused }

	set inputFocused(value: boolean) {
		this._inputFocused = value;
		// Uncomment if we decide to keep search text after selection
		// if (value && this.searchText) {
		// 	this.searchText = this.searchText;
		// }
	}

	@observable private _searchText: string;
	get searchText() { return this._searchText; }

	set searchText(searchText: string) {
		this._searchText = searchText;
		this.isSearching = searchText !== null && searchText.length > 0;

		if (searchText) {
			if (this.searchAxis && searchText.indexOf('=') === -1) {
				this._searchAxis = null;
			}
			else if (searchText.startsWith('=')) {
				this.setSearchAxis(this.lastSearchAxis, true);
			}
		}

		if (this.isSearching && this.searchResults.length > 0) {
			if (this.searchIndex == null || this.searchIndex >= this.searchResults.length) {
				this.searchIndex = 0
			}
		}
	}

	@observable searchIndex: number;
	@observable private _searchAxis: QueryAxisWrapper = null;
	//isAutocompleting = false;
	get searchAxis(): QueryAxisWrapper { return this._searchAxis }

	setSearchAxis(value: QueryAxisWrapper, updateLabel = true) {
		this._searchAxis = value;
		this._searchText = value ? `${value.label} = ` : null;
	}

	@observable lastSearchAxis: QueryAxisWrapper = null;
	@observable selectedResult: AxisCoordinateSearchResultModel;

	/**
	 *
	 * @returns {Array}
	 */
	@computed get searchResults(): Array<{ axis: QueryAxisWrapper, coord?: AxisCoordinate }> {
		const {allResults, searchText, searchAxis, panel} = this;

		let searchResults = [];

		if (_.isEmpty(searchText)) {
			searchResults = null;  //this.allResults;
		}
		else {
			if (searchAxis) {
				const coordSearchText = searchText.substring(searchText.indexOf('=') + 1).trim();
				const scorer          = new Scorer(coordSearchText);

				for (const coord of searchAxis.coordinates) {
					const coordScore = scorer.scoreCoordinate(coord);
					if (coordSearchText.length === 0 || coordScore > 0) searchResults.push({axis: searchAxis, coord: coord, score: coordScore})
				}
			}
			else {
				const scorer = new Scorer(searchText);
				for (const axis of mobx.values(panel.clause.axes).map(a => panel.query.axisById(a.id)).filter(axis => axis.code !== 'Scenario')) {
					const acc = panel.accordionByAxisId(axis.id);

					let axisScore = scorer.scoreAxis(axis);
					if (axisScore > 0) {
						if (acc.unavailable) { axisScore -= .5 }
						else if (acc.isImplied) { axisScore = 5 }

						searchResults.push({axis: axis, score: axisScore});
					}

					for (const coord of axis.coordinates) {
						let coordScore = scorer.scoreCoordinate(coord);

						if (coordScore > 0) {
							const value = acc.values[coord.id - 1];
							if (!value.available) { coordScore -= .5 }
							//
							searchResults.push({axis: axis, coord: coord, score: coordScore})
						}
					}
				}
			}
		}

		//searchResults = _.orderBy(searchResults, s => s.score).reverse();

		searchResults = _.orderBy(searchResults, ['score', 'axis.id', 'coord.id'], ['desc', 'asc', 'asc']);

		return searchResults;
	}

	@action reset = () => {
		this.searchText  = null;
		this.searchIndex = null;
		this.isSearching = true;
		//this.isAutocompleting = false;
	}

	@action cancel = () => {
		this.searchText     = null;
		this.lastSearchAxis = null;
		this.searchIndex    = null;
		this.selectedResult = null;
		this.isSearching    = false;
		//this.isAutocompleting = false;
	}

	@action selectResult = (result: AxisCoordinateSearchResultModel, keepText = false) => {
		// We might want to keep the user's text instead of clearing it...
		if (!keepText) {
			this.searchText  = null; // `${result.axis.label} = ${result.coord ? result.coord.label : ''}`;
		}

		this.searchIndex = null;
		this.isSearching    = false;
		this.selectedResult = result;
		this.lastSearchAxis = result.axis;
		this._searchAxis    = null;
		//this.isAutocompleting = false;
	}
}
