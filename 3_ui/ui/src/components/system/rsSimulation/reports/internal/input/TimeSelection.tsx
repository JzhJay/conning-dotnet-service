import {IconNames} from '@blueprintjs/icons';
import {findOption} from 'components/system/IO/internal/inputs/utility';
import {action, computed, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import {bp, Highlighter} from 'components';
import {ItemSelection, ItemSelectionProps} from './ItemSelection';

import * as css from './ItemSelection.css';

@observer
export class TimeSelection extends React.Component<ItemSelectionProps, any> {

	static SUGGESTION_ITEM_LIMIT = 10;

	itemSelection: ItemSelection;
	inputElem: HTMLInputElement;
	@observable suggestionText: string;
	@observable suggestionBoxOpen: boolean;

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@computed get suggestionList() {
		if (this.suggestionText == null || _.toString(this.suggestionText) === '') {
			return this.itemSelection?.elementDataList;
		}

		return _.filter(this.itemSelection?.elementDataList, data => {
			return data.title.indexOf(this.suggestionText) >= 0;
		});
	}

	@computed get suggestionMenu() {
		const overLimits = this.suggestionList.length - TimeSelection.SUGGESTION_ITEM_LIMIT;

		return <bp.Menu>{
			_.size(this.suggestionList) ? <>
				{_.map(
					this.suggestionList.slice(0, TimeSelection.SUGGESTION_ITEM_LIMIT),
					data => <bp.MenuItem
						key={`TimeSelection_suggestion_${data.index}`}
						text={<Highlighter searchWords={[this.suggestionText]} textToHighlight={data.title} />}
						onClick={action(()=>{
							this.onSearcherChange('');
							this.inputElem.value = '';
							this.suggestionBoxOpen = false;

							if (this.itemSelection.isAllSelected) {
								this.itemSelection.updateItemsOnly([data.title]);
							} else {
								this.itemSelection.updateItem(data, true);
							}
						})}
					/>
				)}
				{(overLimits > 0) && <bp.MenuDivider title={`... and ${overLimits} more items.`} />}
			</>: <bp.MenuDivider title={"No Match Item"} />
		}</bp.Menu>
	}

	@action onSearcherChange = (text) => {
		this.suggestionText = text;
	}

	@action onSearcherKeyDown: React.EventHandler<any> = (e) => {
		if (e.key == "Escape" || e.key == "Enter") {
			e.preventDefault()
			e.target.blur();
			return;
		}
	}

	@action onSearcherKeyUp: React.EventHandler<any> = (e) => {
		this.onSearcherChange(this.inputElem.value);
		this.suggestionBoxOpen = true;
	}

	@action onSearcherFocus: React.EventHandler<any> = (e) => {
		this.suggestionBoxOpen = true;
	}

	@action onSearcherBlur: React.EventHandler<any> = (e) => {
		if ($(e.relatedTarget).is('.bp3-menu-item')) {
			e.preventDefault();
			return;
		}
		this.onSearcherChange('');
		this.inputElem.value = '';
		this.suggestionBoxOpen = false;
	}

	searcherRender = (itemSelection: ItemSelection) => {
		this.itemSelection = itemSelection;
		const columnName = findOption(this.itemSelection.props.specificationOption, [this.itemSelection.props.title_key]).title;

		return <bp.Popover
			fill={true}
			minimal={true}
			autoFocus={false}
			usePortal={false}
			position={bp.Position.BOTTOM_LEFT}
			isOpen={this.suggestionBoxOpen}
			modifiers={{
				flip: {fn: (dataObject) => {
						dataObject.offsets.popper.left = dataObject.offsets.popper.left - 36;
						dataObject.offsets.popper.top = dataObject.offsets.popper.top + 3;
						dataObject.styles.width = `${$(this.inputElem).parents(`.${css.root}`).first().width()}px`;
						return dataObject;
					}}
			}}
			content={this.suggestionMenu} >
			<bp.InputGroup
				leftIcon={IconNames.SEARCH}
				placeholder={`Search ${columnName}`}
				inputRef={ inputRef => {
					if (inputRef) {
						this.inputElem = inputRef;
						inputRef.onfocus = this.onSearcherFocus;
						inputRef.onblur = this.onSearcherBlur;
						inputRef.onkeyup = this.onSearcherKeyUp;
						inputRef.onkeydown = this.onSearcherKeyDown;
					}
				}}
			/>
		</bp.Popover>;
	}

	render() {
		return <ItemSelection
			{...this.props} active_key={"active"} title_key={"time"} ref={ref => this.itemSelection = ref } searcherRender={this.searcherRender} />;
	}
}