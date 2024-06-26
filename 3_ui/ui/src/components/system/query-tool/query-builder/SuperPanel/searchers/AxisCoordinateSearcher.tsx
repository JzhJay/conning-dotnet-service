import * as css from  "./AxisCoordinateSearcher.css";
import * as searcherCss from "./querySearchers.css";

import {api, i18n} from 'stores'
import {AxisCoordinateSearchModel, AxisCoordinateSearchResultModel} from 'stores/query';
import {AppIcon} from 'components';
import { action, reaction, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
const {appIcons, utility: {KeyCode}} = api;

interface MyProps {
	searchModel: AxisCoordinateSearchModel;
}

const scrollIntoView = require('scroll-into-view') as __ScrollIntoView.ScrollIntoView;

@observer
export class AxisCoordinateSearcher extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const {searchModel} = this.props;

		return (
			<div className={classNames(css.axisCoordinateSearcher,
				{
					[searcherCss.focused]: searchModel.inputFocused
				})}
			     tabIndex={0}
			     onBlur={this.onBlur}
			>
				<div>
					<AppIcon icon={appIcons.queryTool.search} className="iconic-sm"/>
					<input ref={r => this.input = r}
					       placeholder={i18n.common.MESSAGE.SEARCHING}
					       type="text"
					       onFocus={this.onFocus}
					       onBlur={this.onBlur}
					       onChange={this.onChange}
					       onKeyDown={this.onKeyDown}
					/>
				</div>
			</div>
		);
	}

    /**
	 * Notify that the input is focused so that the overall panel can update the state in CSS
	 * @param e
	 */
    onFocus = e => {
		const {searchModel}      = this.props;
		searchModel.inputFocused = true;

		if (this.input.value != "")
			searchModel.searchText = this.input.value;
		//this.input.select();
	}

    onBlur = (e) => {
		const {searchModel} = this.props;
		const {relatedTarget} = e;

		if (searchModel.searchListRef == relatedTarget)
			this.input.focus(); // Keep focus on the input when user scrolls the result. Also allows us to still cancel search on input blur
		else
			searchModel.inputFocused = false;

		// Dismiss the search results if the user clicks anywhere outside of the search list
		setTimeout(() => {
			const {searchListRef, isSearching} = searchModel;
			if (isSearching && searchListRef && searchListRef != relatedTarget && !searchListRef.contains(relatedTarget)) {
				searchModel.cancel();
			}
		}, 100)
	}

    @action onChange = e => {
		const {searchModel}    = this.props;
		searchModel.searchText = this.input.value;
	}

    @action onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const {searchModel, searchModel: {searchIndex, searchText, searchAxis, selectedResult, searchResults}} = this.props;

		switch (e.keyCode) {
			case KeyCode.Backspace: {
				if (searchText && searchText.trim().endsWith("=")) {
					searchModel.reset();
					e.preventDefault();
				}
				else if (selectedResult) {
					const split = searchText.split(" = ");
					if (split.length === 2 && selectedResult.coord && selectedResult.coord.label === split[1]) {
						searchModel.searchText = `${split[0]} = `;
						e.preventDefault();
					}
				}

				break;
			}

			case KeyCode.Escape: {
				if (_.isEmpty(searchText)) {
					searchModel.cancel();
				}
				else {
					const split = searchText.split(" = ");
					if (split.length === 2 && split[1].length > 0) {
						searchModel.searchText = `${split[0]} = `;
					}
					else searchModel.cancel();
				}

				e.preventDefault();
				break;
			}

			case KeyCode.Enter: {
				if (searchIndex != null) {
					this.selectResult(searchResults[searchIndex], true);
				}
				e.preventDefault();
				break;
			}

			case KeyCode.Tab: {
				if (searchIndex != null) {
					const result = searchResults[searchIndex];

					if (searchModel.searchAxis) {
						this.selectResult(result);
					}
					else {
						searchModel.setSearchAxis(result.axis);
						searchModel.searchIndex = 0; //searchModel.searchResults.findIndex(r => r.axis === result.axis && r.coord === result.coord);
					}
				}

				e.preventDefault();
				break;
			}

			case KeyCode.Up: {
				// searchModel.searchIndex = (searchResults.length !== 1)
				// 	? searchModel.searchIndex = Math.max(0, searchIndex - 1)
				// 	: searchModel.searchIndex == null ? 0 : null;

				searchModel.searchIndex = Math.max(0, searchIndex - 1);

				//this.scrollToHighlightedSearchResult();
				//this.autoCompleteResultPreview();
				e.preventDefault();
				break;
			}

			case KeyCode.Down: {
				searchModel.searchIndex = Math.min(searchResults.length - 1, searchIndex + 1)
					// : searchModel.searchIndex == null ? 0 : null; // It's confusing toggling between selected/unselected with only one entry

				//this.scrollToHighlightedSearchResult();
				//this.autoCompleteResultPreview();
				e.preventDefault();
				break;
			}

			// case KeyCode.Home: {
			// 	searchModel.searchIndex = 0;
			// 	break;
			// }
			//
			// case KeyCode.End: {
			// 	searchModel.searchIndex = searchModel.searchResults.length - 1;
			// 	break;
			// }
		}

		/*
		 if (!e.defaultPrevented) {
		 console.log('onKeyDown()', this.input.value, `autocomplete: ${searchModel.isAutocompleting}`);
		 searchModel.searchText = this.input.value;

		 setTimeout(this.autoCompleteResultPreview, 0);
		 }*/
	}

    /*
	 autoCompleteResultPreview = () => {
	 const {input, props: {searchModel}} = this;

	 if (searchModel.isSearching) {
	 // Autocomplete the rest
	 const result      = searchModel.searchResults[searchModel.searchIndex];
	 const finalString = searchModel.resultToString(result);

	 if (finalString.toLowerCase().startsWith(input.value.toLowerCase())) {
	 const {selectionDirection, selectionStart, selectionEnd} = input;
	 console.log(selectionDirection, selectionStart, selectionEnd);
	 if (selectionStart === selectionEnd) {
	 searchModel.isAutocompleting = true;
	 input.value              = finalString;
	 input.setSelectionRange(selectionStart, finalString.length - 1);
	 }
	 else {
	 searchModel.isAutocompleting = false;
	 }
	 }
	 else {
	 searchModel.isAutocompleting = false;
	 }
	 }
	 }
	 */

    selectResult = (result: AxisCoordinateSearchResultModel, keepText=false) => {
		this.props.searchModel.selectResult(result, keepText);
		if (keepText) {
			this.input.select();
		}
		else {
			this.input.blur();
		}
	}

    input: HTMLInputElement;

    $parent: JQuery;
    _toDispose: Function[] = [];

    componentDidMount() {
		this.$parent                             = $(ReactDOM.findDOMNode(this)).parent();
		const {_toDispose, props: {searchModel}} = this;

		_toDispose.push(reaction(() => searchModel.searchText, text => {
			if (this.input && this.input.value !== text) { this.input.value = text}
		}));

		_toDispose.push(reaction(() => searchModel.inputFocused, focused => {
			if (this.input && !focused) { this.input.blur() }
		}));
	}

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

    private scrollToHighlightedSearchResult = () => {
		const node = this.$parent.find(`.AxisCoordinateSearchResult__root[tabindex="${this.props.searchModel.searchIndex}"]`)[0];
		scrollIntoView(node);
	}
}
