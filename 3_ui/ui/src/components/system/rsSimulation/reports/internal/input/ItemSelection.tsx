import {bp, Option} from 'components';
import {computed, makeObservable, toJS} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import {AutoSizer, List} from 'react-virtualized';
import { i18n } from 'stores';

import * as css from './ItemSelection.css';

export interface ItemSelectionProps {
	specificationOption: Option;
	value: ItemData[];
	path: string;
	valueUpdater: (update: any) => void;
}

interface ItemSelectionProps_inner extends ItemSelectionProps{
	active_key: string;
	title_key: string;
	searcherRender?: (itemSelection: ItemSelection) => JSX.Element;
	onValueUpdater?: (updatedData: ItemData[]) => void;
}

interface ItemData {
	[key: string]: any;
}

interface ElementData {
	index: number;
	active: boolean;
	title: string;
}

@observer @bp.ContextMenuTarget
export class ItemSelection extends React.Component<ItemSelectionProps_inner, any> {
	constructor(props) {
		super(props);
		makeObservable(this);
	}

	getActive = (itemData: ItemData) => _.get(itemData, this.props.active_key) === 1;

	@computed get isAllSelected() {
		return !_.some(
			this.props.value,
			itemData => !this.getActive(itemData)
		);
	}

	@computed get elementDataList(): ElementData[] {
		return _.map(this.props.value, (itemData, index) => ({
			index,
			title: _.toString(_.get(itemData, this.props.title_key)),
			active: this.getActive(itemData) ,
		}));
	}

	onSelectAllBoxClick: React.EventHandler<any> = (e) => {
		if (this.isAllSelected) {
			this.updateItemsOnly([]);
		} else {
			this.updateItemsExpect([]);
		}
	}

	updateItemsOnly = (enableList: string[]) => {
		const updateData = {};
		_.forEach(this.elementDataList, pi=>{
			updateData[_.toString(pi.index)] = ({[this.props.active_key]: _.includes(enableList, pi.title) });
		})
		this.valueUpdater(updateData);
	}

	updateItemsExpect = (disableList: string[]) => {
		const updateData = {};
		_.forEach(this.elementDataList, pi=>{
			updateData[_.toString(pi.index)] = ({[this.props.active_key]: !_.includes(disableList, pi.title) });
		})
		this.valueUpdater(updateData);
	}

	updateItem = (elementData: ElementData, updateValue: boolean) => {
		if (elementData.active === updateValue) {
			return;
		}
		this.valueUpdater({[_.toString(elementData.index)]: {[this.props.active_key]: updateValue }});
	}

	valueUpdater = (updateData: any) => {
		const {valueUpdater, path} = this.props
		valueUpdater(_.set({}, path, updateData));

		this.props.onValueUpdater && this.props.onValueUpdater(updateData);
	}

	render() {
		const {elementDataList} = this;
		return <div className={css.root}>
			<div className={css.ctrlBar}>
				<bp.Checkbox
					checked={this.isAllSelected}
					onClick={this.onSelectAllBoxClick}
				/>
				{this.props.searcherRender ? this.props.searcherRender(this) : null}
			</div>
			<div className={css.valuesContainer} style={{height: (30 * elementDataList.length)}}>
				<AutoSizer>
					{({width, height}) => <List
						ref={() => {}}
						className={css.valuesList}
						width={width}
						height={height}
						rowCount={elementDataList.length}
						rowHeight={30}
						rowRenderer={({index, style}) => {
							const item = elementDataList[index];
							return <ItemSelectionElement
								key={`ItemSelectionElement_${this.props.specificationOption.name}_${item.title}`}
								elementData={elementDataList[index]}
								parent={this}
								style={style}
							/>
						}}
					/>}
				</AutoSizer>
			</div>

		</div>;
	}

	renderContextMenu() {
		return <bp.Menu>
			<bp.MenuItem text={i18n.common.SELECTION.ALL}       onClick={() => this.updateItemsExpect([])} />
			<bp.MenuItem text={i18n.common.SELECTION.NONE}      onClick={() => this.updateItemsOnly([])} />
		</bp.Menu>
	}

}

interface ItemSelectionElementProps{
	elementData: ElementData;
	style: React.CSSProperties;
	parent: ItemSelection;
}

@observer @bp.ContextMenuTarget
class ItemSelectionElement extends React.Component<ItemSelectionElementProps, any> {
	constructor(props) {
		super(props);
	}

	render() {
		const {elementData, style} = this.props;
		return <div className={css.valueItem} style={style}>
			<bp.Checkbox
				checked={elementData.active}
				onChange={(e) => {
					this.props.parent.updateItem(elementData,e.target["checked"] === true);
				}}
			/>
			<span>{elementData.title}</span>
		</div>;
	}

	renderContextMenu() {
		const {elementData, parent: {updateItemsExpect, updateItemsOnly, updateItem}} = this.props;

		return <bp.Menu>
			<bp.MenuItem text={i18n.common.SELECTION.ALL}       onClick={() => updateItemsExpect([])} />
			<bp.MenuItem text={i18n.common.SELECTION.WITH}      onClick={() => updateItem(elementData, true)} />
			<bp.MenuItem text={i18n.common.SELECTION.WITHOUT}   onClick={() => updateItem(elementData, false)} />
			<bp.MenuItem text={i18n.common.SELECTION.ONLY}      onClick={() => updateItemsOnly([elementData.title])} />
			<bp.MenuItem text={i18n.common.SELECTION.EXPECT}    onClick={() => updateItemsExpect([elementData.title])} />
			<bp.MenuItem text={i18n.common.SELECTION.NONE}      onClick={() => updateItemsOnly([])} />
		</bp.Menu>
	}


}