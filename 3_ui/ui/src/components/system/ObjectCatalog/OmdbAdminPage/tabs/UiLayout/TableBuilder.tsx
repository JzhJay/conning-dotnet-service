import {OmdbUiLayoutTab} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs';
import * as React from 'react';
import type {IObjectTypeDescriptor, OmdbUiTableDefinition} from 'stores';
import {observer} from 'mobx-react';
import { action, computed, makeObservable } from 'mobx';
import {Menu, MenuDivider, MenuItem} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';
import {ColumnHeaderCell, SelectionModes, Table2, Column, Cell} from '@blueprintjs/table';
import {bp, OmdbAdminPageContext} from 'components';
import {i18n, OmdbTag} from 'stores';
import * as css from './TableBuilder.css';

const AddTagDropdown = Select.ofType<OmdbTag>();
const DEFAULT_FAKE_ROWS = 3;


@observer
export class OmdbTableBuilder extends React.Component<{ context: OmdbAdminPageContext, objectTypeDescriptor: IObjectTypeDescriptor, tab: OmdbUiLayoutTab }, {}> {

	static EXCLUDE_COLUMN = ["userTagValues"];
	static CAN_NOT_DELETE_COLUMN = ["name", "action", "actions"];
	static DEFAULT_COL_WIDTH = 180;

	_table: Table2;
	_originalSetting;
	_numFrozenColumnInput;

	constructor(props) {
        super(props);
        makeObservable(this);
        const objectTypeDescriptor = this.props.objectTypeDescriptor
        const tableDef = objectTypeDescriptor.ui.table;

        //clear dirty data
        const userTags = this.props.context.userTags;
        // remove userTag from column which is a removed userTag
        let isUpdate = !!(_.remove<any>(tableDef.columns, column => column._id && !_.some(userTags, tag => tag._id == column._id))?.length);
        if (isUpdate) {
			this.props.context.saveUiTableToDatabase(objectTypeDescriptor);
		}
        this._originalSetting = JSON.stringify(tableDef);
        this.props.tab.isDirty = false;
    }

	@action reset() {
		const tableDef = JSON.parse(this._originalSetting);
		const objectTypeDescriptor = this.props.objectTypeDescriptor
		objectTypeDescriptor.ui.table.frozenColumns = tableDef.frozenColumns;
		objectTypeDescriptor.ui.table.columns.splice(0, objectTypeDescriptor.ui.table.columns.length, ...tableDef.columns);
		this.props.context.saveUiTableToDatabase(objectTypeDescriptor);
		this.forceRerenderColumn();
		this.props.tab.isDirty = false;
	}

	@computed get setting(): OmdbUiTableDefinition{
		return this.props.objectTypeDescriptor.ui.table;
	}

	@computed get remainingTags() {
		const allTags = this.props.context.tags;
		if (!allTags || !allTags.length) {
			return [];
		}
		const usedTags = this.setting.columns;
		let rtn = allTags.filter((tag) => {
			if(_.some(OmdbTableBuilder.EXCLUDE_COLUMN, n => n == tag.name)){
				return false;
			}
			if (!tag._id) {
				return !_.some(usedTags, t => !t._id && t.name == tag.name);
			} else {
				return !_.some(usedTags, t => t._id == tag._id);
			}
		});
		return rtn as (OmdbTag[]);
	}

	@computed get maxFrozenColumns() {
		let columnLength = this.setting.columns?.length || 0;
		return Math.max(0, columnLength - 2);
	}

	@computed get numFrozenColumns(): number{
		let frozenColumns = this.setting.frozenColumns;
		if (!frozenColumns || (frozenColumns < 1 && frozenColumns > this.maxFrozenColumns )) {
			return null;
		}
		return frozenColumns;
	}

	@computed get columnWidths() {
		return this.setting.columns.map(column => column.defaultWidth || OmdbTableBuilder.DEFAULT_COL_WIDTH);
	}

	render() {
		const {remainingTags, maxFrozenColumns, numFrozenColumns, columnWidths} = this;

		const frozenOptText = i18n.intl.formatMessage({defaultMessage: `frozen columns`, description: "[OmdbTableBuilder] Indicates how many frozen columns on the beginning of the object browser table"});
		const addOptText = i18n.intl.formatMessage({defaultMessage: `Add Column...`, description: "[OmdbTableBuilder] a note message - add a tag as a object browser table column"});

		return <div className={css.root}>
			<bp.Navbar>
				<span>
					<input
						type={"number"}
						className={classNames([bp.Classes.INPUT, css.numFrozenColumnInput])}
						min={0}
						max={maxFrozenColumns}
						defaultValue={numFrozenColumns || 0}
						onChange={this.setFrozenColumns}
						ref={r => this._numFrozenColumnInput = r}
					/>&nbsp;{frozenOptText}
				</span>
				<bp.NavbarDivider />
				<AddTagDropdown
					items={remainingTags}
					filterable={false}
					onItemSelect={(item) => this.addColumn(item)}
					itemRenderer={(item: OmdbTag, {handleClick, modifiers}) => {
						return <a className={classNames(bp.Classes.MENU_ITEM)}
						          key={`${item.name}_${item._id}`}
						          onClick={handleClick}>
							{this.formatDisplayLabel(item)}
						</a>
					}}
					className={css.addTagDropdown}
				>
					<bp.Button disabled={remainingTags.length == 0} text={addOptText} rightIcon='caret-down'/>
				</AddTagDropdown>
			</bp.Navbar>
			<div className={css.tableContainer}>
				<Table2
					ref={ r => this._table = r}
					enableRowHeader={false}
					enableFocusedCell={false}
					enableRowResizing={false}
					enableRowReordering={false}
					enableColumnResizing={true}
					enableColumnReordering={true}

					defaultRowHeight={40}
					defaultColumnWidth={OmdbTableBuilder.DEFAULT_COL_WIDTH}
					columnWidths={columnWidths}
					numRows={DEFAULT_FAKE_ROWS}
					numFrozenColumns={numFrozenColumns}

					selectionModes={SelectionModes.NONE}
					onColumnsReordered={this.handleColumnsReordered}
					onColumnWidthChanged={this.handleColumnWidthChanged}
					bodyContextMenuRenderer={(menuContext) => {
						const regions = menuContext.getRegions();
						return this.menuRender(regions[0].cols[0]);
					}}


					// columnWidths={this.columnWidths}
					// onColumnsReordered={this.handleColumnsReordered}
					// onRowsReordered={this.handleRowsReordered}
					// enableColumnInteractionBar={enableColumnInteractionBar}

				>
					{this.setting.columns.map((column, i) => {
						return <Column
							key={`${i}_${column._id || column.name}`}
							name={`${column.name}`}
							columnHeaderCellRenderer={this.columnHeaderCellRenderer}
							cellRenderer={() => {
								return <Cell loading={true}></Cell>;
							}}
						/>
					})}
				</Table2>
			</div>
		</div>
	}

	columnHeaderCellRenderer = (columnIndex) => {

		const columnTag = this.setting.columns[columnIndex];
		if (!columnTag) {
			return null;
		}
		const omdbTag = _.find(this.props.context.tags, (omdbTag) => columnTag._id ? omdbTag._id == columnTag._id : omdbTag.name == columnTag.name);
		let displayText = this.formatDisplayLabel(omdbTag || ( columnTag as any));


		return <ColumnHeaderCell
			index={columnIndex}
			name={displayText}
			menuRenderer={this.menuRender}
		/>
	}

	menuRender = (columnIndex) => {
		const remainingTags = this.remainingTags;
		const columnTag = this.setting.columns[columnIndex];
		if (!columnTag) {
			return null;
		}
		const omdbTag = _.find(this.props.context.tags, (omdbTag) => columnTag._id ? omdbTag._id == columnTag._id : omdbTag.name == columnTag.name);
		const canRemove = omdbTag && ( omdbTag._id || !_.find(OmdbTableBuilder.CAN_NOT_DELETE_COLUMN , c => c == omdbTag.name));

		const removeOptText = i18n.intl.formatMessage({defaultMessage: `Remove Column "{displayText}"`, description: "[OmdbTableBuilder] remove the tag from the object browser table"}, {displayText: this.formatDisplayLabel(omdbTag || ( columnTag as any))});
		const addOptText = i18n.intl.formatMessage({defaultMessage: `Add Column...`, description: "[OmdbTableBuilder] a note message - add a tag as a object browser table column"});

		return <Menu>
			{canRemove && <MenuItem icon='trash' text={removeOptText} onClick={() => this.removeColumn(omdbTag)} />}
			{remainingTags && remainingTags.length && <>
				<MenuDivider title={addOptText} />
				{remainingTags.map((tag:OmdbTag, i) => {
					const label = this.formatDisplayLabel(tag);
					return <MenuItem key={`menuItem_${i}`} text={label} onClick={() => this.addColumn(tag, columnIndex+1)} />
				})}
			</>}
		</Menu>
	}

	@action setFrozenColumns = () => {
		let value = parseInt(this._numFrozenColumnInput.value);
		if (!value || (value < 1 && value > this.maxFrozenColumns )) {
			value = null;
			this._numFrozenColumnInput.value = 0;
		}
		if (value != this.numFrozenColumns) {
			this.setting.frozenColumns = value;
			this.saveUiTableToDatabase();
		}
	}

	@action handleColumnsReordered = (oldIndex: number, newIndex: number, length: number) => {
		if (oldIndex === newIndex) {
			return;
		}
		const columns = this.setting.columns;
		const frozenColumns = this.numFrozenColumns;
		if (oldIndex >= frozenColumns && newIndex <= frozenColumns) {
			this.setting.frozenColumns = frozenColumns + 1;
		} else if (oldIndex < frozenColumns && newIndex >= frozenColumns-1){
			this.setting.frozenColumns = frozenColumns - 1;
		}
		this._numFrozenColumnInput && (this._numFrozenColumnInput.value = this.numFrozenColumns);

		const moveColumn = columns.splice(oldIndex, 1);
		columns.splice(newIndex, 0, ...moveColumn);
		this.saveUiTableToDatabase();
	};

	@action handleColumnWidthChanged = (index: number, size: number) => {
		let column = this.setting.columns[index];
		if (column) {
			column.defaultWidth = size;
			this.saveUiTableToDatabase();
		}
	}

	@action addColumn(tag: OmdbTag, index?: number) {
		const columns = this.setting.columns;
		const frozenColumns = this.numFrozenColumns;
		const insertTag = {
			_id: tag._id,
			name: tag.name,
			reserved: !tag._id
		};

		let insertIndex = index;
		if (index == null && tag._id) {
			insertIndex = _.findLastIndex(columns , column => !!column._id) || frozenColumns;
		}
		if (insertIndex == null) {
			columns.push(insertTag)
		} else {
			columns.splice(insertIndex, 0, insertTag);
			if (index ? insertIndex <= frozenColumns : insertIndex < frozenColumns) {
				this.setting.frozenColumns = frozenColumns + 1;
			}
		}
		this.saveUiTableToDatabase();
	}

	@action removeColumn = (tag: OmdbTag) => {
		const columns = this.setting.columns;
		const removeItems = _.remove(columns, c => (tag._id ? c._id == tag._id : c.name == tag.name));
		if (removeItems?.length) {
			this.saveUiTableToDatabase();
		}
	}

	saveUiTableToDatabase(){
		this.forceRerenderColumn();
		this.props.context.saveUiTableToDatabase(this.props.objectTypeDescriptor);
		this.props.tab.isDirty = true;
	}

	forceRerenderColumn = () => {
		const rootTableElement = this._table["rootTableElement"];
		const scrollContainer = $(rootTableElement).find('.bp3-table-quadrant-scroll-container').first();
		const nowScrollLeft = scrollContainer.scrollLeft();
		scrollContainer.scrollLeft(scrollContainer.width());
		scrollContainer.scrollLeft(nowScrollLeft);
	}

	formatDisplayLabel( tag: {name: string, _id?:string, label?:string, displayName?: string}) {
		const newTag = _.assign(tag, {reserved: !tag._id}) as any;
		if (newTag.reserved !== false && _.includes(["actions", "action"], newTag.name)) {
			return i18n.common.WORDS.ACTION;
		}
		return this.props.context.translateTagName(newTag);
	}
}