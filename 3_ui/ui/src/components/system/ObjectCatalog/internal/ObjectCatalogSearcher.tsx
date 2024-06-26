import {ObjectCatalogSearchResultModel} from './ObjectCatalogSearchModel';
import {List} from 'react-virtualized';
import {api, i18n, ObjectCatalogContext, settings} from 'stores'
import {AppIcon, Highlighter, bp, sem} from 'components';
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
const {appIcons, utility: {KeyCode}} = api;

import * as css from './ObjectCatalogSearcher.css';

interface MyProps {
	catalogContext: ObjectCatalogContext;
}

@observer
export class ObjectCatalogSearcher extends React.Component<MyProps, {}> {
    input: HTMLInputElement;
    resultList: Element;

    _toDispose: Function[] = [];

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    componentDidMount() {
		this._toDispose.push(reaction(()=>this.props.catalogContext.searchModel.searchText, ()=>{
			if (this.input.value != this.props.catalogContext.searchModel.searchText) {
				this.input.value = this.props.catalogContext.searchModel.searchText;
			}
		}));
		this._toDispose.push(reaction(()=>this.props.catalogContext.searchModel.searchIndex, ()=>{
			if (!this.resultList) { return; }
			const $list = $(this.resultList);
			const $selected = $list.find(`.${css.objectCatalogSearchResultRoot}[tabindex="${this.props.catalogContext.searchModel.searchIndex}"]`);
			if ($selected.length) {
				let bottom = $selected.position().top + $selected.outerHeight(true);
				let scrollTop = $list.scrollTop();
				let windowHeight = $list.height();
				if ( bottom > (scrollTop + windowHeight)) {
					setTimeout( ()=> $list.scrollTop((bottom+10) - windowHeight) , 500);
				}
			}
		}));
	}

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

    @computed get openSuggestions() : boolean {
		const {catalogContext, catalogContext:{ searchModel, searchModel:{inputFocused, searchText, selectedResult}}} = this.props;
		if (!selectedResult && this.input?.value && this.input.value == catalogContext.searchText) {
			return false;
		}
		if (inputFocused && searchText && (!selectedResult || this.input.value != searchModel.resultToString(selectedResult)) ) {
			return true;
		}
		return false;
	}

    render() {
		const {catalogContext, catalogContext:{searchModel, searchModel:{searchResults}}} = this.props;

		return (
			<div className={classNames([css.root])} tabIndex={0} onBlur={this.onBlur} >
				<bp.Popover
					isOpen={this.openSuggestions}
					position={bp.Position.BOTTOM_RIGHT}
					enforceFocus={false}
					content={ <div className={css.objectCatalogSearchResultList}>
						{!searchResults || searchResults.length == 0 ?
						 <ObjectCatalogSearchResult index={-1} key="no-results" catalogContext={catalogContext}/> :
						 <div className={css.resultList} ref={r => this.resultList = r}>{searchResults.map( (r,i) => {
							 return <ObjectCatalogSearchResult key={`ocsr-${i}`} index={i} catalogContext={catalogContext} result={r}/>
						 })}</div>
						}
					</div>}
				>
					<div className={css.searchInput}>
						<input placeholder={i18n.common.MESSAGE.SEARCHING}
						       type={"text"}
						       defaultValue={catalogContext.searchText}
						       disabled={catalogContext.isRunningQuery}
						       className={classNames( bp.Classes.INPUT, {[bp.Classes.INPUT_ACTION]: searchModel.inputFocused })}
						       ref={r => this.input = r}
						       onFocus={this.onFocus}
						       onBlur={this.onBlur}
						       onChange={this.onChange}
						       onKeyDown={this.onKeyDown}
						/>
						<AppIcon icon={catalogContext.isRunningQuery ? {type: "semantic", name: "spinner"} : searchModel.selectedResult || catalogContext.searchText ? {type:'blueprint', name:'cross'} : appIcons.queryTool.search}
						         className={classNames("iconic-sm", {rotate: catalogContext.isRunningQuery})}
						         onClick={() => {
						         	if (!catalogContext.isRunningQuery) {
							            if (catalogContext.searchText) {
								            this.clear(true);
							            } else if (searchModel.selectedResult) {
								            searchModel.reset();
							            }
						            }}}
						/>

					</div>
				</bp.Popover>
			</div>
		);
	}

    /**
	 * <ObjectCatalogSearchResult  catalogContext={catalogContext} index={searchModel.searchIndex}/>
	 * Notify that the input is focused so that the overall panel can update the state in CSS
	 * @param e
	 */
    onFocus = e => {
		const {searchModel}      = this.props.catalogContext;
		searchModel.inputFocused = true;

		if (this.input.value != "") {
			searchModel.searchText = this.input.value;
		}
		//this.input.select();
	}

    onBlur = (e) => {
		const {searchModel} = this.props.catalogContext;
		const relatedTarget = $(e.relatedTarget);
		// if the blur action call by the search result box popup.
		// Let it back to the focusing status.
		if(
			relatedTarget
				.parents('.bp3-portal').first()
				.find(`.${css.objectCatalogSearchResultRoot}`).length
		){
			e.stopPropagation();
			this.input.focus();
			return false;
		}
		searchModel.inputFocused = false;
		this.clear();
	}

    @action onChange = e => {
		const {searchModel}    = this.props.catalogContext;
		searchModel.searchText = this.input.value;
	}

    @action onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const {searchModel, searchModel: {searchIndex, searchText, searchResults, selectedResult}} = this.props.catalogContext;

		switch (e.keyCode) {
			case KeyCode.Backspace: {
				if (!searchText) {
					this.clear();
				} else if (searchText && searchText.trim().endsWith("=")) {
					searchModel.reset();
					e.preventDefault();
				} else if (selectedResult) {
					const split = searchText.split(" = ");
					if (split.length === 2 && selectedResult.distinct && searchModel.resultDistinctToString(selectedResult) === split[1]) {
						searchModel.searchText = `${split[0]} = `;
						e.preventDefault();
					}
				}

				break;
			}

			case KeyCode.Escape: {
				this.input.blur();
				e.preventDefault();
				e.stopPropagation();
				break;
			}

			case KeyCode.Enter: {
				if (searchIndex != null && searchIndex >= 0) {
					this.props.catalogContext.searchText = "";
					this.selectResult(searchResults[searchIndex], true);
				} else {
					this.props.catalogContext.searchModel.selectedResult = null;
					this.props.catalogContext.searchText = this.input.value;
				}
				e.preventDefault();
				e.stopPropagation();
				break;
			}

			case KeyCode.Tab: {
				if (searchIndex != null) {
					const result = searchResults[searchIndex];
					if (result) {
						if (searchModel.searchField) {
							this.selectResult(result);
						} else {
							searchModel.searchField = result.field;
							searchModel.searchIndex = 0;
						}
					}
				}

				e.preventDefault();
				break;
			}

			case KeyCode.Up: {
				searchModel.searchIndex = Math.max(-1, searchIndex - 1);
				e.preventDefault();
				break;
			}

			case KeyCode.Down: {
				searchModel.searchIndex = Math.min(searchResults.length - 1, searchIndex + 1)
				e.preventDefault();
				break;
			}

			default: {
				searchModel.searchIndex = -1;
				break;
			}

		}
	}

    @action selectResult = (result: ObjectCatalogSearchResultModel, keepText=false) => {
		this.props.catalogContext.searchText = "";
		this.props.catalogContext.searchModel.selectResult(result);
		if (keepText) {
			this.input.select();
		}
		else {
			this.input.blur();
		}
	}

    @action clear = (force: boolean = false) => {
		const {catalogContext, catalogContext:{ searchText, searchModel, searchModel: {selectedResult}}} = this.props;
		const {input} = this;
		// clear result at searchModel
		if (force || !selectedResult || input.value != searchModel.resultToString(selectedResult) ) {
			searchModel.reset();
		}
	    // clear search at catalogContext
		if (force || searchText != input.value ) {
			catalogContext.searchText = "";
		}
		if (searchModel.selectedResult == null && catalogContext.searchText == "") {
			input.value = "";
		}
	}
}


interface resultProps {
	catalogContext: ObjectCatalogContext;
	index: number;
	result?: ObjectCatalogSearchResultModel;
	style?: any;
}

@observer
export class ObjectCatalogSearchResult extends React.Component<resultProps, {}> {

	render() {
		const { catalogContext: {searchModel, searchModel: {searchText, searchField, searchIndex, selectResult}}, result, index } = this.props;
		const {expertMode} = settings.query;

		const selected = index === searchIndex;

		if (result) {
			const {field, distinct} = result;

			const highlightArray = _.isEmpty(searchText) ? [] : searchText.split('=').map(s => api.utility.escapeRegExp(s.trim()));

			return <div className={classNames(css.objectCatalogSearchResultRoot, {[css.selected]: selected})}
						onClick={() => selectResult(result)}
			            onMouseEnter={action(() => searchModel.searchIndex = index)}
			            tabIndex={index}>
				{!expertMode && <span className={css.typeLabel}>{
					distinct?
					i18n.intl.formatMessage({defaultMessage: 'Distinct', description: "[ObjectCatalogSearcher] type of a search result item"}) :
					i18n.intl.formatMessage({defaultMessage: 'Field', description: "[ObjectCatalogSearcher] type of a search result item"})
				}</span>}
				<div className={css.header}>
					<span className={css.field}><Highlighter searchWords={(highlightArray.length > 1 ? [highlightArray[0]] : highlightArray).map( s => api.utility.escapeRegExp(s))} textToHighlight={searchModel.resultFieldToString(result)}/></span>
					=
					{distinct && <span className={css.distinct}><Highlighter searchWords={(highlightArray.length > 1 ? [highlightArray[1]] : highlightArray).map( s => api.utility.escapeRegExp(s))} textToHighlight={searchModel.resultDistinctToString(result)}/></span> }
				</div>
			</div>
		}
		else {
			return <div className={classNames(css.objectCatalogSearchResultRoot, css.selected)}
			            tabIndex={index}>
				<div className={css.description}>
					No results were found.
				</div>
			</div>
		}
	}
}
