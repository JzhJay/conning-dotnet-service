import {Select} from '@blueprintjs/select/lib/cjs/components';
import {bp, CopyLocationContextMenuItem, LoadingUntil, utility} from 'components';
import {TableCopier} from 'components/system/userInterfaceComponents/Table/TableCopier';
import { computed, observable, reaction, makeObservable } from 'mobx';
import {Observer, observer} from 'mobx-react';
import * as React from 'react';
import {ClimateRiskAnalysis, climateRiskAnalysisStore, site, Stress, Transformation, xhr} from 'stores';
import {BookPage} from 'stores/book/BookPage';
import {KeyCode} from 'utility/utility';
import {Toolbar} from '../../../toolbar/Toolbar';

import * as css from './FlexGridInput.css';


interface DamageByRiskInputProps {
	climateRiskAnalysis: ClimateRiskAnalysis,
	page: BookPage
}

const TransformationSelect = Select.ofType<Transformation>();

@observer
export class AssetClassInput extends React.Component<DamageByRiskInputProps, {}> {

	GRID_DEFS = ClimateRiskAnalysis.GRID_DEFS.ASSET_CLASS;

	gridRef;
	tableCopier: TableCopier;
	gridData = [];
	_dispose: Function[] = [];
	_reactElementContainers: Element[] = [];
	@observable waitForReload = false;

	_shouldRebuildGrid = false;

	constructor(props) {
        super(props);

        makeObservable(this);

        this.gridData = this.props.climateRiskAnalysis.assetClassInput;
    }

	componentDidMount() {

		const reactionLog = (msg, obj?) => false && console.log(`${msg} ${obj != null ? JSON.stringify(obj) : ''}`);

		const isInCurrentPage = () => this.props.page.pageId == this.props.climateRiskAnalysis.book.currentPage.pageId;

		const refreshGrid = (delay:number = 100) => setTimeout(() => {
			try {
				reactionLog('do refreshGrid');
				this.gridRef && this.gridRef.refresh()
			} catch (e) {
				// nothing
			}
		} , delay);

		const reloadGrid = async (delay:number = 100) => {
			return new Promise<void>(resolve => {
				if (!this.waitForReload) {
					return resolve();
				}
				setTimeout(() => {
					reactionLog('do reloadGrid');
					this.gridData = this.props.climateRiskAnalysis.assetClassInput;
					this.waitForReload = false
					resolve();
				}, delay);
			});
		};

		const checkData = () => {
			if (!this.gridRef) { return; }

			const currentRowLength = this.gridRef.rows.length;
			const newDataList = this.props.climateRiskAnalysis.assetClassInput;

			if (newDataList.length != currentRowLength) {
				const savedScrollPosition = this.gridRef.scrollPosition;
				this.gridData = newDataList;
				this.gridRef.itemsSource = newDataList;
				this.gridRef.scrollPosition = savedScrollPosition;
				return;
			}

			_.forEach(this.gridRef.rows, (row,i) => {
				Object.assign( row.dataItem , newDataList[i]);
			});

			// Don't refresh  if editor is up since refreshing will boot us out of edit mode
			if (!this.gridRef.activeEditor)
				refreshGrid(0);
		}

		this._dispose.push( reaction(()=>this.props.climateRiskAnalysis.book.currentPage.scrollMode, (effect) => {
			reactionLog(`scrollMode updated`, effect);
			if (isInCurrentPage()) {
				refreshGrid();
			}
		}));

		this._dispose.push( reaction(()=>this.props.climateRiskAnalysis.assetClassInput, (effect) => {
			reactionLog(`data updated`);
			if (isInCurrentPage()) {
				checkData();
			} else {
				this.waitForReload = true;
			}
		}));

		this._dispose.push( reaction(()=>this.props.climateRiskAnalysis.inputState.stressMetadata.length, (effect) => {
			reactionLog(`stressMetadata updated`, effect);
			this.waitForReload = true;
			isInCurrentPage() && reloadGrid(10);
		}));

		this._dispose.push( reaction(()=>this.props.climateRiskAnalysis.book.currentPageNumber, (effect) => {
			reactionLog(`currentPageNumber updated`, effect);
			if (!isInCurrentPage()) { return; }
			reloadGrid().then( () => {
				checkData();
				refreshGrid(0);
			});
		}));
	}

	componentWillUnmount() {
		this._dispose.forEach( d => d());
		if (climateRiskAnalysisStore.climateRiskAnalyses.has(this.props.climateRiskAnalysis.id)) { // if the CRA is removed, doesn't need to loadInputState
			this.props.climateRiskAnalysis.loadInputState();
		}
	}

	unmountReactElementContainer = () => {
		while (this._reactElementContainers.length) {
			try {
				ReactDOM.unmountComponentAtNode(this._reactElementContainers.pop());
			}
			catch (e) {
				// Unmounting sometimes failures in Cypress but we're not sure why.
				// Consume errors and log warning.
				console.warn(e);
			}
		}
		return true;
	}

	@computed get transformations() : Transformation[] {
		return this.props.climateRiskAnalysis.inputState.transformationMetadata;
	}

	@computed get stresses() : Stress[] {
		return this.props.climateRiskAnalysis.inputState.stressMetadata;
	}

	getStress = (col_index: number): Stress => {
		const stresses = this.stresses;
		if(col_index < 3 || (col_index - 3) >= stresses.length) {
			return null;
		}
		return stresses[col_index-3];
	}

	getStressName = (stress: Stress) => {
		if (!stress) {
			return '';
		}
		if (stress.name) {
			return stress.name;
		}
		let newSeq = Math.max(
			1,
			...this.stresses
				.filter((s) => s.stressId != stress.stressId && `${s.name}`.match(/^Stress\s[A-Z]+$/))
				.map((s) => {
					let SeqString = s.name.replace(/^Stress\s/, "");
					let seq = 0, m = 1;
					for (let i = SeqString.length - 1 ; i >= 0; i--) {
						seq = seq + ( m * (SeqString.charCodeAt(i)-64));
						m = m * 26;
					}
					return seq + 1;
				})
		) ;

		let newName = '', d = 26;
		while ( newSeq > 0 ) {
			newSeq--;
			newName = String.fromCharCode(65 + newSeq%d) + newName
			newSeq = Math.floor(newSeq/d);
			d = d * 26;
		}
		newName = `Stress ${newName}`;
		stress.name = newName;
		return newName;
	}

	render() {
		return <div className={css.root} data-component-name={"AssetClassInput"}>
			<Toolbar>
				<bp.Button
					icon={`plus`}
					text={`Add Stress`}
					onClick={this.addStress}
				/>
			</Toolbar>
			<LoadingUntil loaded={!this.waitForReload && this.props.climateRiskAnalysis?.isLoaded}>
				<Wj.FlexGrid
					showMarquee={true}
					autoGenerateColumns={false}
					autoSizeMode={wijmo.grid.AutoSizeMode.Cells}
					headersVisibility={wijmo.grid.HeadersVisibility.Column }
					allowDragging={wijmo.grid.AllowDragging.None}
					allowMerging={wijmo.grid.AllowMerging.ColumnHeaders }
					frozenColumns={3}
					initialized={this.initializeGrid}
					columns={this.gridColumnHeaders}
					itemsSource={this.gridData}
					onUpdatingLayout={this.unmountReactElementContainer}
					onUpdatedLayout={()=>{
						if (this._selection) {
							this.gridRef.selection = this._selection;
							this._selection = null;
						}
					}}
					// onUpdatedView={()=>{
					// 	if (this.gridRef._eMarquee) {
					// 		const $eMarquee = $(this.gridRef._eMarquee);
					// 		$eMarquee.css('width', $eMarquee.width()+3);
					// 		$eMarquee.css('height', $eMarquee.height()+3);
					// 	}
					// }}
					onCellEditEnding={this.unmountReactElementContainer}
					onScrollPositionChanged={this.unmountReactElementContainer}
					onBeginningEdit={this.onBeginningEdit}
					onCellEditEnded={this.onCellEditEnded}
					onPastedCell = {this.onCellEditEnded}
				/>
			</LoadingUntil>
		</div>
		;
	}

	renderContextMenu = (e) => {
		let ht = this.gridRef && this.gridRef.hitTest(e);
		if (!ht) { return; }

		// prevent the browser's native context menu
		e.preventDefault();

		// render a Menu without JSX...
		const stress = this.getStress(ht.col);
		const inSelection = this.gridRef.selection?.contains(ht.row, ht.col);

		let locationPath = [utility.formatLabelText(this.GRID_DEFS.TABLE)];

		if (wijmo.grid.CellType.Cell == ht.cellType) {
			locationPath.push(ht.row);
		}

		if (ht.col < 3) {
			locationPath.push(this.gridColumnHeaders[ht.col].header);
		} else {
			locationPath.push(utility.formatLabelText(this.GRID_DEFS.TABLE));
		}

		const menu = <bp.Menu>
			<bp.MenuItem
				icon={'plus'}
				text={`Add Stress`}
				onClick={this.addStress} />
			{ ht.col > 1 && <>
				<bp.MenuDivider />
				<bp.MenuItem icon={TableCopier.ICONS.PASTE} text={`Paste`} onClick={this.tableCopier.pasteSelection} disabled={!inSelection || !navigator.clipboard?.readText} />
				<bp.MenuItem icon={TableCopier.ICONS.COPY} text={`Copy`} onClick={this.tableCopier.copySelection} disabled={!inSelection} />
			</>}

			{ stress && <>
				<bp.MenuItem icon={TableCopier.ICONS.COPY} text={`Copy '${this.getStressName(stress)}' Dataset`} onClick={() => this.copyDataSet(ht.col)} />
				<bp.MenuItem icon={'trash'} text={`Remove '${this.getStressName(stress)}'`} onClick={() => this.removeStress(stress)} />
			</>}

			<CopyLocationContextMenuItem locationPath={locationPath} icon={"blank"} />
		</bp.Menu>;

		// mouse position is available on event
		bp.ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => {
			// menu was closed; callback optional
		});
	}

	initializeGrid = (flex) => {
		this.gridRef = flex;

		flex.addEventListener(flex.hostElement, 'contextmenu', this.renderContextMenu);
		$(flex.hostElement).addClass(css.grid);

		this.tableCopier = new TableCopier(this.gridRef);

		// insert extra column header row
		const chs = flex.columnHeaders;
		let newHeaderRow_0 = new wijmo.grid.Row();
		let newHeaderRow_1 = new wijmo.grid.Row();
		chs.rows.insert(0, newHeaderRow_0);
		chs.rows.insert(1, newHeaderRow_1);

		// fill out headings in extra header row
		const tableName = utility.formatLabelText(this.GRID_DEFS.TABLE);
		for (let i = 0; i < flex.columns.length; i++) {
			if ( i < 3) {
				let hdr = chs.getCellData(2, i, false);
				chs.setCellData(0, i, hdr);
				chs.setCellData(1, i, hdr);
				flex.columns[i].allowMerging = true;
			} else {
				const stress = this.getStress(i);
				chs.setCellData(0, i, tableName);
				chs.setCellData(1, i, stress.stressId);
				chs.setCellData(2, i, stress.transformationId);
			}
		}
		// allow merging across and down extra header row
		newHeaderRow_0.allowMerging = true;

		const cfs = flex.columnFooters;
		let newFooterRow_1 = new wijmo.grid.Row();
		cfs.rows.insert(0, newFooterRow_1);

		// custom rendering for headers of name
		flex.formatItem.addHandler((flex, e) => {
			const {row, col, cell} = e;

			if (e.panel == flex.columnHeaders && col > 2) {
				if (row == 1 ) {
					$(cell).addClass(css.editable);
					cell.innerHTML = `<input type="text" className="wj-grid-editor wj-form-control">`;
					const stress = this.getStress(col);
					const input = cell.firstChild;
					$(input)
						.val(this.getStressName(stress))
						.on('blur', (event) => {
							if (event.target == input) {
								this.updateStressName(input, stress)
							}
						})
						.on('keydown', (event) => {
							if (event.keyCode == KeyCode.Enter) {
								$(input).trigger('blur');
							}
						})
						.on('click', (event) => {
							event.preventDefault();
							event.cancelBubble = true;
						})
				} else if (row == 2 && !$(cell).hasClass(css.editable)) {

					const stress = this.getStress(col);

					$(cell).addClass(css.editable).html('');
					const selector = <TransformationSelect
						popoverProps={{fill:true}}
						filterable={false}
						items={this.transformations}
						itemRenderer={(item, {handleClick})=>{
							return <bp.MenuItem
								key={item.transformationId}
								icon={stress.transformationId == item.transformationId ? 'tick': 'blank'}
								text={item.name}
								onClick={handleClick}
							/>
						}}
						onItemSelect={(item, e) => { this.updateTransformation(stress, item) }}
					>
						<div className={'header-dropdown'}>
							<Observer>{() => <span className={classNames({[css.emptyCell]: !stress.transformationId  || !_.some(this.transformations, t => t.transformationId == stress.transformationId) })}>
								{_.find(this.transformations, t => t.transformationId == stress.transformationId)?.name || 'Transformation'}
							</span>}</Observer>
							<bp.Icon icon={'caret-down'} /></div>
					</TransformationSelect>;

					ReactDOM.render(selector, cell);
					this._reactElementContainers.push(cell);
				}
			} else if (e.panel == flex.columnFooters) {
				if (col == 1 || col == 2) {
					const column = flex.columns[col];
					let sum = 0;
					_.forEach(flex.itemsSource, d => {
						sum += d[column.binding]
					});
					cell.innerHTML =  wijmo.Globalize.formatNumber(sum, column.format);
				}
			} else if (e.panel == flex.cells) {
				if (!flex.columns[col].isReadOnly) {
					$(cell).addClass(css.editable);
				} else {
					$(cell).addClass(css.notEditable);
				}
			}
		});
	}

	onBeginningEdit = (e) => {
		const {col, row, panel} = e;
		if ($(panel.getCellElement(row, col)).is(`.${css.notEditable}`)) { return false; }

		if (col > 2 && this.gridRef && !_.isNumber(this.gridRef.getCellData(row, col))) {
			this.gridRef.setCellData(row, col, 0);
			this.unmountReactElementContainer();
		}
		return true;
	}

	onCellEditEnded = (e) => {
		const {col, row} = e;
		const record = this.gridRef.itemsSource[row];

		// console.log(`Update stress cell: ${row}, ${col}`);
		if (col == 2) {
			this.updateMarketValue(record);
		} else if (col > 2) {
			this.updateDamage( this.stresses[col-3] , record);
		}
	}

	copyDataSet = (click_col) => {
		if (!this.gridRef) { return; }
		const endRow = this.gridRef.cells.rows.length - 1 ;
		this.gridRef.selection = new wijmo.grid.CellRange(0, click_col, endRow, click_col);

		this.tableCopier.copySelection()
	}

	get gridColumnHeaders() {
		const commonProps = {
			dataType:     wijmo.DataType.Number,
			allowSorting: false,
			width:        145,
		}
		const columns: any[] = [
			{
				...commonProps,
				dataType:   wijmo.DataType.String,
				header:     utility.formatLabelText(this.GRID_DEFS.COLUMN.ASSET_CLASS),
				binding:    this.GRID_DEFS.COLUMN.ASSET_CLASS,
				isReadOnly: true,
				align:      'center',
				width:      140
			},
			{
				...commonProps,
				format:     'p2',
				header:     utility.formatLabelText(this.GRID_DEFS.COLUMN.WEIGHT),
				binding:    this.GRID_DEFS.COLUMN.WEIGHT,
				isReadOnly: true,
				width:      80
			},
			{
				...commonProps,
				format:     'n0',
				header:     utility.formatLabelText(this.GRID_DEFS.COLUMN.MARKET_VALUE),
				binding:    this.GRID_DEFS.COLUMN.MARKET_VALUE,
				wordWrap:   true,
				width:      140
			}
		];

		_.forEach( this.stresses , (stress) => {
			columns.push({
				...commonProps,
				format: 'p3',
				header: stress.name,
				binding: stress.stressId
			});
		})

		return columns;
	}

	addStress = async () => {
		site.busy = true;
		const newName = this.getStressName({
			stressId: null,
			name: null,
			transformationId: null
		});

		await xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/stresses`, {name: newName}).then((rtn: {runRequired: boolean}) => {
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
			this.props.climateRiskAnalysis.loadInputState();
		}).finally(() => site.busy = false);
	}

	removeStress = async (stress: Stress) => {
		if (!stress || !stress.stressId) {
			return;
		}
		site.busy = true;
		await xhr.delete(`${this.props.climateRiskAnalysis.apiUrl}/stresses/${stress.stressId}`).then((rtn: {runRequired: boolean}) => {
			this.props.climateRiskAnalysis.loadInputState();
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
		}).finally(() => site.busy = false);
	}

	updateStressName = (cell, stress: Stress) => {
		if (!stress || !stress.stressId) {
			return;
		}
		let name = _.toString(cell.value);
		if (!name) {
			name = this.getStressName(stress);
			cell.value = name;
		}

		site.busy = true;
		xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/stress`,{
			stressId: stress.stressId,
			name : name
		}).catch(err => {
			cell.value = stress.name || name;
			throw err;
		}).then((rtn) => {
			stress.name = name;
		}).finally(() => site.busy = false);
	}

	updateTransformation = (stress: Stress, transformation: Transformation) => {
		if (!stress || !stress.stressId) {
			return;
		}
		if (!transformation || !transformation.transformationId) {
			return;
		}
		site.busy = true;
		xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/stress-transformation`,{
			stressId: stress.stressId,
			transformationId : transformation.transformationId
		}).then((rtn: {runRequired: boolean}) => {
			stress.transformationId = transformation.transformationId;
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
		}).finally(() => site.busy = false);
	}

	_selection = null;

	updateMarketValue = (record) => {
		site.busy = true;
		xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/starting-market-value`,{
			assetClassName: record[this.GRID_DEFS.COLUMN.ASSET_CLASS],
			startingMarketValue : record[this.GRID_DEFS.COLUMN.MARKET_VALUE]
		}).then((rtn: {runRequired: boolean}) => {
			this.props.climateRiskAnalysis.loadInputState();
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
		}).finally(() => site.busy = false);
	}

	updateDamage = (stress: Stress, record) => {
		if (!(stress?.stressId)) {
			console.warn("Missing Stress ID in damage update")
			return;
		}
		let updateValue = record[stress.stressId];
		updateValue = _.isNumber(updateValue) ? updateValue : 0;

		site.busy = true;
		xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/damage`,{
			assetClassName: record[this.GRID_DEFS.COLUMN.ASSET_CLASS],
			stressId : stress.stressId,
			damage: updateValue
		}).then((rtn: {runRequired: boolean}) => {
			_.find(this.props.climateRiskAnalysis.inputState.assetClasses, asset => asset.name == record.assetClass).damage[stress.stressId] = updateValue;
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
		}).finally(() => site.busy = false);
	}

}