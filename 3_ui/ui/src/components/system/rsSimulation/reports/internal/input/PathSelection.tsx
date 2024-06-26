import {IconNames} from '@blueprintjs/icons';
import {bp} from 'components';
import {ItemSelection, ItemSelectionProps} from 'components/system/rsSimulation/reports/internal/input/ItemSelection';
import {observer} from 'mobx-react';


export class PathSelection extends React.Component<ItemSelectionProps, any> {

	itemSelection: ItemSelection;
	inputElem: HTMLInputElement;

	onSearcherChange: React.EventHandler<any> = (e) => {
		if (e.target.value === "") {
			return;
		}
		const valuesAry = _.map(
			_.split( `${e.target.value}`, ",") ,
			s => {
				s = _.trim(s);
				if (_.toNumber(s)) {
					return [s];
				}
				if (s.indexOf('-')) {
					const idx = s.indexOf('-');
					let start = _.trim(s.substring(0, idx));
					let end = _.trim(s.substring(idx+1));
					if (_.toNumber(start) && _.toNumber(end)) {
						return _.map(_.range(_.toNumber(start), _.toNumber(end)+1), v => _.toString(v));
					}
				}
				return [];
			}
		);
		const selectValues = _.uniq(_.flatten(valuesAry));
		this.itemSelection?.updateItemsOnly(selectValues);
	}

	onSearcherKeyDown: React.EventHandler<any> = (e) => {
		if (e.key == "Escape" || e.key == "Enter") {
			e.preventDefault()
			e.target.blur();
			return;
		}
	}

	renewSearcherBoxText = () => {
		if (!this.inputElem || !this.itemSelection) { return; }
		const elements = this.itemSelection.elementDataList;

		const enabledItems = _.filter(elements, (item) => item.active);

		if (enabledItems.length == 0 || enabledItems.length == elements.length) {
			$(this.inputElem).val('');
			return;
		}

		let outputItems= [], start, end;
		const setItem = () => {
			if (start != null)
				outputItems.push(start == end ?
				                 `${elements[start].title}`:
				                 `${elements[start].title}-${elements[end].title}`
				);
		}
		_.forEach(enabledItems, item => {
			if (start == null) {
				start = item.index;
			}else if (end != null && end != (item.index-1)) {
				setItem();
				start = item.index;
			}
			end = item.index;
		})
		setItem();
		$(this.inputElem).val(outputItems.join(', '))
	}

	render() {
		return <ItemSelection
			{...this.props}
			active_key={"active"}
			title_key={"path"}
			ref={ref => {
				this.itemSelection = ref;
				this.renewSearcherBoxText();
			}}
			searcherRender={(is) => <bp.InputGroup
				leftIcon={IconNames.SEARCH}
	            placeholder={"e.g. 10-100, 500, 1000"}
	            inputRef={ inputRef => {
	                if (inputRef) {
	                    this.inputElem = inputRef;
	                    inputRef.onblur = this.onSearcherChange;
	                    inputRef.onkeydown = this.onSearcherKeyDown;
	                }
	            }}
	        />}
			onValueUpdater={this.renewSearcherBoxText}
		/>;


	}


}