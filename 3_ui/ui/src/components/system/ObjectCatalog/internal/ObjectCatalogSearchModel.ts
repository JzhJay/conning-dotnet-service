import {api, i18n, ObjectCatalogContext, OmdbDistinctValue, OmdbUserTag, OmdbUserTagValue, utility} from 'stores'
import { DistinctTagValue } from 'stores/objectMetadata';
import {action, observable, computed, makeObservable, runInAction} from 'mobx';

export interface ObjectCatalogSearchResultModel {
	field: DistinctTagValue;
	distinct?: OmdbDistinctValue;
	score?: number;
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
	constructor(public searchText: string, public userTagLabelConverter: UserTagLabelConverter) {
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

	scoreField(field: DistinctTagValue, isUserTag :boolean): number {
		if (this.searchText.length === 0) { return 0 }

		const {axis: score} = Scoring;

		let label, description;

		if (isUserTag) {
			label = this.userTagLabelConverter.userTagLabel(field.tagName);
		} else {
			label = field.displayTitle;
			description = field.tagName;
			if (description) { description = utility.formatLabelText(description); }
			if (description == label) { description = null; }
		}

		const {searchText, matchAnywhere, wholeFirstWord, wholeOtherWord, beginningFirstWord, beginningOtherWord} = this;
		if (wholeFirstWord.exec(label)) return 20;
		if (wholeOtherWord.exec(label)) return 18;
		if (beginningFirstWord.exec(label)) return 16;
		if (beginningOtherWord.exec(label)) return 14;

		if (description) {
			if (wholeFirstWord.exec(description)) return 12;
			if (wholeOtherWord.exec(description)) return 11;
			if (beginningFirstWord.exec(description)) return 8;
			if (beginningOtherWord.exec(description)) return 7;
		}

		if (searchText.length > 1 && matchAnywhere.exec(label)) return 4;
		if (description && searchText.length > 1 && matchAnywhere.exec(description)) return 2;

		return 0;
	}

	scoreDistinct(distinct :OmdbDistinctValue, isUserTag :boolean): number {
		if (this.searchText.length === 0) { return 0 }

		if (distinct.missingMapping || distinct.isLoading) { return 0; }

		const {axis: score} = Scoring;
		let label, description;

		if (isUserTag) {
			label = this.userTagLabelConverter.userTagValueLabel(distinct.value);
		} else {
			label = _.toString(distinct.label || distinct.value);
			description = distinct.value
			if (description == label) { description = null; }
		}

		const {searchText, matchAnywhere, wholeFirstWord, wholeOtherWord, beginningFirstWord, beginningOtherWord} = this;

		if (wholeFirstWord.exec(label)) return 19;
		if (wholeOtherWord.exec(label)) return 17;
		if (beginningFirstWord.exec(label)) return 15;
		if (beginningOtherWord.exec(label)) return 13;

		if (description) {
			if (wholeFirstWord.exec(description)) return 10;
			if (wholeOtherWord.exec(description)) return 9;
			if (beginningFirstWord.exec(description)) return 6;
			if (beginningOtherWord.exec(description)) return 5;
		}

		if (searchText.length > 1 && matchAnywhere.exec(label)) return 3;
		if (description && searchText.length > 1 && matchAnywhere.exec(description)) return 1;

		return 0;
	}
}

class UserTagLabelConverter {
	constructor(public context: ObjectCatalogContext) {}

	userTag(userTagId: string) :OmdbUserTag {
		const userTags = _.flatten(this.context.objectTypes.map(ot => ot.userTags));
		return _.find(userTags, ut => ut._id == userTagId);
	}

	userTagValue(userTagValueId: string) :OmdbUserTagValue {
		const userTags = _.flatten(this.context.objectTypes.map(ot => ot.userTags));
		const userTagValues = _.flatten(userTags.map(ut => ut.values));
		return _.find(userTagValues, v => !!v && (v._id == userTagValueId));
	}

	userTagLabel(userTagId: string) {
		const userTag = this.userTag(userTagId);
		return userTag ? userTag.label || utility.formatLabelText(userTag.name) : userTagId;
	}

	userTagValueLabel(userTagValueId: string) {
		const userTagValue = this.userTagValue(userTagValueId)
		return userTagValue ? userTagValue.label || userTagValue.value : userTagValueId;
	}

	userTagText(userTagId: string) {
		const userTag = this.userTag(userTagId);
		return userTag ? userTag.name : userTagId;
	}

	userTagValueText(userTagValueId: string) {
		const userTagValue = this.userTagValue(userTagValueId)
		return userTagValue ? userTagValue.value : userTagValueId;
	}
}

/**
 * Holds state for Axis Coordinate searchers in the Query Builder
 */
export class ObjectCatalogSearchModel {

	userTagLabelConverter: UserTagLabelConverter;

	constructor(public context: ObjectCatalogContext) {
        makeObservable(this);
        this.userTagLabelConverter = new UserTagLabelConverter(context);
    }

	isUserTag(field: DistinctTagValue) {
		return field.isUserTag;
	}

	@computed get objectTypeTags() {
		let objectTypeTags = new Set<string>();
		objectTypeTags.add("name");
		objectTypeTags.add("comments");
		this.context.objectTypes.forEach(ot => {
			ot.ui.catalog.tags.forEach((tag) => {
				if (typeof tag == 'string') {
					objectTypeTags.add(tag);
				} else {
					objectTypeTags.add(tag._id || tag.name);
				}
			});
		});
		return objectTypeTags;
	}

	@observable selectedResult: ObjectCatalogSearchResultModel;

	@computed get selectedResultFilter() {
		let rtn = {};
		if (this.selectedResult) {
			if (!this.isUserTag(this.selectedResult.field)) {
				rtn[this.selectedResult.field.tagName] = [this.selectedResult.distinct.value];
			} else {
				rtn["userTagValues"] = [this.selectedResult.distinct.value];
			}
		}
		return rtn;
	}

	@observable searchIndex: number;
	@observable lastSearchField: DistinctTagValue = null;

	@observable private _inputFocused: boolean = false;
	get inputFocused() { return this._inputFocused; }
	set inputFocused (status) { runInAction(() => { this._inputFocused = status}); }

	@observable private _searchText: string;
	get searchText() { return this._searchText; }
	set searchText(searchText: string) {
		runInAction(() => {
			this._searchText = searchText;

			if (searchText) {
				if (this.lastSearchField && searchText.startsWith('=')) {
					this._searchField = this.lastSearchField;
					this._searchText = `${this.resultFieldToString({field: this.lastSearchField})} = `;
				} else if (this.searchField) {
					this._searchField = null;
				}
			}

			if (this.searchResults && this.searchResults.length > 0) {
				if (this.searchIndex == null || this.searchIndex >= this.searchResults.length) {
					this.searchIndex = 0
				}
			}
		});
	}

	@observable private _searchField: DistinctTagValue = null;
	get searchField(): DistinctTagValue { return this._searchField }
	set searchField(value: DistinctTagValue) {
		runInAction(() => {
			this._searchField = value;
			this._searchText = value ? this.resultToString({field: value}) : null;
		});
	}

	@computed get searchResults(): Array<ObjectCatalogSearchResultModel> {
		const {searchText, searchField, context} = this;

		if (_.isEmpty(searchText) || !context.distinctTagValues) {
			return [];
		}

		const flatFields: DistinctTagValue[] = _.flatMap(Array.from(context.distinctTagValues.values()), v => Array.from(v.values())); //.filter(v => v.distinct.length > 1);

		let searchResults: ObjectCatalogSearchResultModel[] = [];

		if (searchField) {
			const distinctSearchText = searchText.substring(searchText.indexOf('=') + 1).trim();
			const scorer = new Scorer(distinctSearchText, this.userTagLabelConverter);
			const isUserTag = this.isUserTag(searchField);

			for (const distinct of searchField.distinct) {
				let result: ObjectCatalogSearchResultModel = {field: searchField, distinct: distinct};
				if (this.resultFilter(result)) {
					const distinctScore = scorer.scoreDistinct(distinct, isUserTag);
					if (distinctSearchText.length === 0 || distinctScore > 0) {
						result.score = distinctScore;
						searchResults.push(result);
					}
				}
			}
		} else if ( searchText.indexOf('=') >= 0 ) {
			const searchTextSplit = searchText.split('=');
			const fieldSearchScorer = searchTextSplit[0].trim() ? new Scorer(searchTextSplit[0].trim(), this.userTagLabelConverter) : null;
			const distinctSearchScorer = searchTextSplit[1].trim() ? new Scorer(searchTextSplit[1].trim(), this.userTagLabelConverter) : null;
			if (fieldSearchScorer && !distinctSearchScorer) {
				for (const field of flatFields) {
					let fieldResult: ObjectCatalogSearchResultModel = {field: field};
					if (this.resultFilter(fieldResult)) {
						const isUserTag = this.isUserTag(field);
						let fieldScore = fieldSearchScorer.scoreField(field, isUserTag);
						if (fieldScore > 0) {
							for (const distinct of field.distinct) {
								let result: ObjectCatalogSearchResultModel = {field: field, distinct: distinct, score: fieldScore};
								this.resultFilter(result) && searchResults.push(result)
							}
						}
					}
				}
			} else if (!fieldSearchScorer && distinctSearchScorer) {
				for (const field of flatFields) {
					let fieldResult: ObjectCatalogSearchResultModel = {field: field};
					if (this.resultFilter(fieldResult)) {
						const isUserTag = this.isUserTag(field);
						for (const distinct of field.distinct) {
							let result: ObjectCatalogSearchResultModel = {field: field, distinct: distinct};
							if (this.resultFilter(result)) {
								let distinctScore = distinctSearchScorer.scoreDistinct(distinct, isUserTag);
								if (distinctScore > 0) {
									result.score = distinctScore;
									searchResults.push(result);
								}
							}
						}
					}
				}
			} else if (fieldSearchScorer && distinctSearchScorer) {
				for (const field of flatFields) {
					let fieldResult: ObjectCatalogSearchResultModel = {field: field};
					if (this.resultFilter(fieldResult)) {
						const isUserTag = this.isUserTag(field);
						let fieldScore = fieldSearchScorer.scoreField(field, isUserTag);
						if (fieldScore > 0) {
							for (const distinct of field.distinct) {
								let result: ObjectCatalogSearchResultModel = {field: field, distinct: distinct};
								if (this.resultFilter(result)) {
									let distinctScore = distinctSearchScorer.scoreDistinct(distinct, isUserTag);
									if (distinctScore > 0) {
										result.score = fieldScore+distinctScore;
										searchResults.push(result);
									}
								}
							}
						}
					}
				}
			}
		} else {
			const scorer = new Scorer(searchText, this.userTagLabelConverter);

			for (const field of flatFields) {
				let fieldResult: ObjectCatalogSearchResultModel = {field: field};
				if (this.resultFilter(fieldResult)) {
					const isUserTag = this.isUserTag(field);
					let fieldScore = scorer.scoreField(field, isUserTag);
					if (fieldScore > 0) {
						fieldResult.score = fieldScore;
						searchResults.push(fieldResult);
					}

					for (const distinct of field.distinct) {
						let result: ObjectCatalogSearchResultModel = {field: field, distinct: distinct};
						if (this.resultFilter(result)) {
							let distinctScore = scorer.scoreDistinct(distinct, isUserTag);
							if (distinctScore > 0) {
								result.score = distinctScore;
								searchResults.push(result)
							}
						}
					}
				}
			}
		}

		searchResults = _.orderBy(searchResults, ['score', 'field.tagName', 'distinct.value'], ['desc', 'asc', 'asc']);

		if(context.distinctTagValues.size == 1) {
			return searchResults;
		}

		const compareResult = (a: ObjectCatalogSearchResultModel, b: ObjectCatalogSearchResultModel): boolean => {
			let a_f = this.resultFieldToString(a);
			let a_d = this.resultDistinctToString(a);
			let b_f = this.resultFieldToString(b);
			let b_d = this.resultDistinctToString(b);
			return a_f == b_f && a_d == b_d;
		}

		let newSearchResults: ObjectCatalogSearchResultModel[] = [];
		_.forEach(searchResults, result => {
			const {field, distinct, score } = result;
			if(_.some(newSearchResults, (r)=>compareResult(r,result))) {
				return;
			}
			newSearchResults.push(result);
		})
		return newSearchResults;
	}

	@action reset = () => {
		this._searchText  = null;
		this.searchIndex = null;
		this.selectedResult = null;
	}

	@action selectResult = (result: ObjectCatalogSearchResultModel) => {
		this.searchIndex = null;
		this.lastSearchField = result.field;
		this.searchField = !result.distinct ? result.field : null;

		if (result.distinct) {
			this.selectedResult = result;
			this._searchText = this.resultToString(result);
		}
	}

	resultFilter(result: ObjectCatalogSearchResultModel): boolean {
		if (!this.objectTypeTags.has(result.field.tagName)) {
			return false;
		}
		if (this.isUserTag(result.field)) {
			const userTag = this.userTagLabelConverter.userTag(result.field.tagName);
			if (!userTag || userTag.canSearch === false) {
				return false;
			}
		}
		if (result.distinct && !this.resultFieldToString(result)) {
			return false;
		}
		if (result.field.distinct.filter(d => d.count > 0).length == 0) {
			return false;
		}
		if (result.distinct && result.distinct.count <= 0) {
			return false;
		}
		const selectedTagValues = this.context.selectedTagValues;
		const fieldText = result.field.tagName;
		const distinctText = result.distinct?.value;

		if (selectedTagValues.has(fieldText)) {
			const selected = selectedTagValues.get(fieldText);
			if (distinctText && selected.length > 0) {
				let index = selected.indexOf(distinctText);
				if (index == -1) {
					return false;
				}
			}
		}
		return true;
	}

	resultFieldToString(result: ObjectCatalogSearchResultModel) {
		if (!result) {
			return '';
		}
		const isUserTag = this.isUserTag(result.field);
		if (isUserTag) {
			return this.userTagLabelConverter.userTagLabel(result.field.tagName);
		}
		const value = result.field.displayTitle;
		return _.get(i18n.databaseLookups.tags, [value], value);
	}

	resultDistinctToString(result: ObjectCatalogSearchResultModel) {
		if (!result) {
			return '';
		}
		const distinct = result.distinct;
		if (!distinct) {
			return '';
		}
		const isUserTag = this.isUserTag(result.field);
		if (isUserTag) {
			return this.userTagLabelConverter.userTagValueLabel(distinct.value);
		}
		const value = _.toString(distinct.label || distinct.value)
		return _.get(i18n.databaseLookups.tagValues, [value], value);
	}

	resultToString(result: ObjectCatalogSearchResultModel) {
		return result ? `${this.resultFieldToString(result)} = ${this.resultDistinctToString(result)}` : '';
	}
}
