import { action, computed, observable, makeObservable } from 'mobx';
import {bp, OmdbAdminPageContext} from 'components';
import {omdb, settings, OmdbTag} from 'stores';
import {Observer, observer} from 'mobx-react';
import {Alignment, AnchorButton, Button, ButtonGroup, Navbar, NavbarDivider, NavbarGroup, Tooltip, Checkbox} from '@blueprintjs/core';
import * as css from './OmdbTagsEditor.css'
import AllowResizing = wijmo.grid.AllowResizing;


const readonlyTagFields = ['required', 'reserved', 'mutates', 'multiple', 'name'];

class MyCellFactory extends wijmo.grid.CellFactory {
	public disposeCell(cell: HTMLElement) {
		//debugger;
	}

	updateCell(p: wijmo.grid.GridPanel, r: number, c: number, cell: HTMLElement, rng?: wijmo.grid.CellRange, updateContent?: boolean) {
		var editor = p.grid['_component'] as OmdbTagsEditor;

		const {columns, displayedTags} = editor;

		var col = columns[c];
		if (col.renderCell) {
			ReactDOM.unmountComponentAtNode(cell);
		}

		super.updateCell(p, r, c, cell, rng, updateContent);

		if (p.cellType == wijmo.grid.CellType.ColumnHeader) {

		}
		else if (p.cellType == wijmo.grid.CellType.Cell) {
			if (col.renderCell) {
				ReactDOM.render(col.renderCell(r, c, displayedTags[r]), cell);
				return;
			}
			else {
				var tag = displayedTags[r];
				if (tag.reserved && _.includes(readonlyTagFields,col.binding)) {
					$(cell).find('input[type="checkbox"]').attr('disabled', '');
				}
			}
		}
	}
}

@observer
export class OmdbTagsEditor extends React.Component<{ context: OmdbAdminPageContext }, {}> {
    grid: wijmo.grid.FlexGrid;
    cellFactory = new MyCellFactory();

    columns = [
		{
			header:     'Actions', align: 'center', isReadOnly: true, isContentHtml: true, minWidth: 100, isSelected: false, allowResizing: false,
			renderCell: (r, c, tag: OmdbTag) => {
				return (
					<Observer>
						{() => <ButtonGroup minimal>
							{/*<Tooltip content="Move Up">*/}
								{/*<AnchorButton icon="arrow-up" disabled={tag == _.first(tags)} onClick={() => this.moveTagUp(tag)}/>*/}
							{/*</Tooltip>*/}
							{/*<Tooltip content="Move Down">*/}
								{/*<AnchorButton disabled={tag == _.last(tags)} icon="arrow-down" onClick={() => this.moveTagDown(tag)}/>*/}
							{/*</Tooltip>*/}
							{!tag.reserved && <Tooltip content="Delete Tag">
								<AnchorButton icon="trash" onClick={() => this.deleteTag(tag)}/>
							</Tooltip>}
						</ButtonGroup>}
					</Observer>);
			}
		},
		{binding: 'name', header: 'Tag Name'},
		{binding: 'label', header: 'Label'},
		{binding: 'type', header: 'Type', showDropDown: true, dataMap: ['', 'id', 'userId'], minWidth: 100},
		{binding: 'reserved', header: 'Reserved', isReadOnly: true},
		{binding: 'required', header: 'Required'},
		{binding: 'mutates', header: 'Mutable'},
		{binding: 'multiple', header: 'Multiple'},
		{binding: 'canSearch', header: 'Searchable', dataType: wijmo.DataType.Boolean},
		{binding: 'canSort', header: 'Sortable', dataType: wijmo.DataType.Boolean},
		//{binding: 'objectTypes', header: 'Object Type(s)', dataType: wijmo.DataType.Array},
	]

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    get prefs() {
		return settings.pages.manageDataSchema
	}

    @computed get displayedTags() {
		const {prefs, props: {context: {schema}}} = this;

		var tags = schema.tags.slice();
		if (!prefs.showSystemTags) {
			tags = tags.filter(t => !t.reserved)
		}
		tags = _.sortBy(tags, t => t.name);

		return tags;
	}

    render() {
		const { displayedTags, prefs, props: {context, context: {schema}}} = this;

		return <div className={css.tagsPanel}>
			<Navbar className={css.tabButtonBar}>
				<NavbarGroup align={Alignment.RIGHT}>
					<Checkbox label="Show Reserved Tags?" checked={prefs.showSystemTags} onChange={() => prefs.showSystemTags = !prefs.showSystemTags} />

					<NavbarDivider/>

					<ButtonGroup>
						<Tooltip content="Add Tag" position={bp.Position.BOTTOM}>
							<Button onClick={this.addTag} icon="plus"/>
						</Tooltip>
					</ButtonGroup>

					<NavbarDivider/>

					<ButtonGroup>
						<AnchorButton text="Reset"/>
						<AnchorButton text="Save Changes"/>
					</ButtonGroup>
				</NavbarGroup>
			</Navbar>


			<Wj.FlexGrid
				initialized={(g: wijmo.grid.FlexGrid) => {
					this.grid       = g
					g['_component'] = this;

					g.autoSizeColumns();
					//var lastColumn   = g.columns[g.columns.length - 1] as wijmo.grid.Column;
					//lastColumn.width = '*';
				}}
				frozenColumns={2}
				selectionMode={wijmo.grid.SelectionMode.Cell}
				allowResizing={AllowResizing.Columns}
				autoGenerateColumns={false}
				columns={this.columns.map(c => _.omit(c, 'renderCell'))}
				showSort
				cellEditEnded={() => {
					// context.dirtySchema = true
				}}
				itemsSource={displayedTags}
				cellFactory={this.cellFactory}
				itemFormatter={(panel, r, c, cell) => {
					var col = this.columns[c];
					var tag = this.displayedTags[r];

					if (col.binding == 'name' && tag.reserved) {
						$(cell).addClass(css.readonly)
					}
				}}
				autoSizeMode={wijmo.grid.AutoSizeMode.Both}
				allowDragging={wijmo.grid.AllowDragging.None}
				beginningEdit={(sender, e) => {
					const {row, col} = e;

					const tag = displayedTags[row];
					if (tag.reserved) {
						var column = this.columns[col];
						if (_.includes(readonlyTagFields, column.binding)) {
							e.cancel = true;
						}
					}
				}}
			/>
		</div>
	}

    @action addTag = () => {
		const {context, context: {tags}} = this.props;
		// context.dirtySchema = true;
		tags.push(new OmdbTag({name: 'My Tag'}))
	}

    // @action moveTagUp = (tag: OmdbTag) => {
    // 	this.dirty    = true;
    // 	var fromIndex = this.tags.indexOf(tag);
    //
    // 	this.tags.move(fromIndex, fromIndex - 1);
    // }
    //
    // @action moveTagDown = (tag: OmdbTag) => {
    // 	this.dirty    = true;
    // 	var fromIndex = this.tags.indexOf(tag);
    //
    // 	this.tags.move(fromIndex, fromIndex + 1);
    // }

    @action deleteTag = (tag: OmdbTag) => {
		const {context, context: {tags}} = this.props;
		// context.dirtySchema              = true;
		//tags.remove(tag);
	}
}
