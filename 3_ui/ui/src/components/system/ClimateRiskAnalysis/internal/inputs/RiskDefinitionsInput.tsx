import {bp, CopyLocationContextMenuItem, LoadingUntil, utility} from 'components';
import {TableCopier} from 'components/system/userInterfaceComponents/Table/TableCopier';
import { computed, observable, reaction, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {ClimateRiskAnalysis, site, Transformation, xhr} from 'stores';
import {BookPage} from 'stores/book/BookPage';
import {add, subtract, divide, KeyCode} from 'utility/utility';
import {Toolbar} from '../../../toolbar/Toolbar';

import * as css from './FlexGridInput.css';

interface RiskDefinitionsInputProps {
	climateRiskAnalysis: ClimateRiskAnalysis,
	page: BookPage
}

@observer
export class RiskDefinitionsInput extends React.Component<RiskDefinitionsInputProps, {}> {

	GRID_DEFS = ClimateRiskAnalysis.GRID_DEFS.RISK_DEFINITION;

	gridRef;
	tableCopier: TableCopier;
	gridData = [];
	_dispose: Function[] = [];

	@observable waitForReload = false;
	_shouldRebuildGrid = false;

	constructor(props) {
        super(props);

        makeObservable(this);

        this.gridData = this.props.climateRiskAnalysis.riskDefinitionInputs;
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
					this.gridData = this.props.climateRiskAnalysis.riskDefinitionInputs;
					this.waitForReload = false
					resolve();
				}, delay);
			});
		};

		const checkData = () => {
			if (!this.gridRef) { return; }

			const currentRowLength = this.gridRef.rows.length;
			const newDataList = this.props.climateRiskAnalysis.riskDefinitionInputs;

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

			// Don't refresh if editor is up since refreshing will boot us out of edit mode
			if (!this.gridRef.activeEditor)
				refreshGrid(0);
		}

		this._dispose.push( reaction(()=>this.props.climateRiskAnalysis.book.currentPage.scrollMode, (effect) => {
			reactionLog(`scrollMode updated`, effect);
			if (isInCurrentPage()) {
				refreshGrid();
			}
		}));

		this._dispose.push( reaction(()=>this.props.climateRiskAnalysis.riskDefinitionInputs, () => {
			reactionLog(`data updated`);
			if (isInCurrentPage()) {
				checkData();
			} else {
				this.waitForReload = true;
			}
		}));

		this._dispose.push( reaction(()=>this.props.climateRiskAnalysis.inputState.transformationMetadata.length, (effect) => {
			reactionLog(`transformationMetadata updated`, effect);
			this.waitForReload = true;
			isInCurrentPage() && reloadGrid(10);
		}));

		this._dispose.push( reaction(()=>this.props.climateRiskAnalysis.inputState.transformationMetadata.map(m => m.name), (effect) => {
			reactionLog(`transformationMetadata name updated`, effect);
			refreshGrid();
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
		this._dispose.forEach( d => d && d());
	}

	@computed get allowPageScrolling(): boolean { return !!this.props.climateRiskAnalysis.book.currentPage.scrollMode; }

	@computed get transformations() : Transformation[] {
		return this.props.climateRiskAnalysis.inputState.transformationMetadata;
	}

	getTransformation = (col_index: number): Transformation => {
		const transformations = this.transformations;
		if(col_index == 0 || col_index > (transformations.length*2)+1 ) {
			return null;
		}
		return transformations[Math.ceil(col_index/2)-1];
	}

	getTransformationColumnKey = (trans: Transformation, column: string) => {
		return trans ? `${trans.transformationId}_${column}` : null;
	}

	getTransformationName = (trans: Transformation) => {
		if (!trans) {
			return '';
		}
		if (trans.name) {
			return trans.name;
		}
		let newSeq = Math.max(
			1,
			...this.transformations
					.filter((t) => t.transformationId != trans.transformationId && `${t.name}`.match(/^Transformation\s[A-Z]+$/))
					.map((t) => {
						let SeqString = t.name.replace(/^Transformation\s/, "");
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
		newName = `Transformation ${newName}`;
		trans.name = newName;
		return newName;
	}

	addTimeLines = () => {
		this.props.climateRiskAnalysis.riskDefinitionRows =
			this.props.climateRiskAnalysis.riskDefinitionRows +
			this.GRID_DEFS.PAGE_SIZE;
	}

	render() {
		return <div className={css.root} data-component-name={"RiskDefinitionsInput"}>
			<Toolbar>
				<bp.Button
					icon={`plus`}
					text={`Add Transformation`}
					onClick={this.addTransformation}
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
					frozenColumns={1}
					initialized={this.initializeGrid}
					columns={this.gridColumnHeaders}
					itemsSource={this.gridData}
					onCellEditEnded={this.onCellEditEnded}
					onScrollPositionChanged={this.onScrollPositionChanged}
					onPastedCell = {this.onCellEditEnded}
					onBeginningEdit = {this.onBeginningEdit}
/*					onUpdatedView={()=>{
						if (this.gridRef._eMarquee) {
							const $eMarquee = $(this.gridRef._eMarquee);
							$eMarquee.css('width', $eMarquee.width()+3);
							$eMarquee.css('height', $eMarquee.height()+3);
						}
					}}*/
				/>
			</LoadingUntil>
			{this.allowPageScrolling && <div className={css.bottomToolbar}><bp.Button
				icon={`plus`}
				text={`Add Time`}
				onClick={this.addTimeLines}
			/></div>}
		</div>;
	}

	renderContextMenu = (e) => {
		let ht = this.gridRef && this.gridRef.hitTest(e);
		if (!ht) { return; }

		// prevent the browser's native context menu
		e.preventDefault();

		// render a Menu without JSX...
		const trans = this.getTransformation(ht.col);
		const inSelection = this.gridRef.selection?.contains(ht.row, ht.col);
		const transformationName = trans && this.getTransformationName(trans);

		let locationPath = [utility.formatLabelText(this.GRID_DEFS.TABLE)];

		if (wijmo.grid.CellType.Cell == ht.cellType) {
			locationPath.push(ht.row);
		}

		if (ht.col > 0) {
			locationPath.push(utility.formatLabelText(this.GRID_DEFS.TABLE));
		}
		locationPath.push(this.gridColumnHeaders[ht.col].header);

		const menu = <bp.Menu>
			<bp.MenuItem
				icon={'plus'}
				text={`Add Transformation`}
				onClick={this.addTransformation} />

			{ trans && <>
				<bp.MenuDivider />
				<bp.MenuItem icon={'blank'} text={`Normalize Damage to 100%`} onClick={() => this.normalizeDamage(trans)} />
				<bp.MenuItem icon={'blank'} text={`Clear...`}>
					<bp.MenuItem text={utility.formatLabelText(this.GRID_DEFS.COLUMN.DAMAGE_SHARE)} onClick={() => this.clearDamageShare(trans)} />
					<bp.MenuItem text={utility.formatLabelText(this.GRID_DEFS.COLUMN.VOLATILITY_FACTOR)} onClick={() => this.clearVolatilityFactor(trans)} />
				</bp.MenuItem>
				<bp.MenuDivider />
				<bp.MenuItem icon={TableCopier.ICONS.PASTE} text={`Paste`} onClick={this.tableCopier.pasteSelection} disabled={!inSelection || !navigator.clipboard?.readText} />
				<bp.MenuItem icon={TableCopier.ICONS.COPY} text={`Copy Selected`} onClick={this.tableCopier.copySelection} disabled={!inSelection} />
				<bp.MenuItem icon={TableCopier.ICONS.COPY} text={`Copy '${transformationName}' Dataset`} onClick={() => this.copyDataSet(trans, ht.col)} />
				<bp.MenuItem icon={'trash'} text={`Remove '${transformationName}'`} onClick={() => this.removeTransformation(trans)} />

				<bp.MenuDivider />

				<bp.MenuItem icon={'blank'} text={`Shift Earlier...`}>
					{ Array.from(Array(10).keys()).map(i => <bp.MenuItem text={`${i+1} periods`} onClick={() => this.shiftTime(trans, -(i+1))} key={`se${i}`} /> )}
				</bp.MenuItem>
				<bp.MenuItem icon={'blank'} text={`Shift Later...`}>
					{ Array.from(Array(10).keys()).map(i => <bp.MenuItem text={`${i+1} periods`} onClick={() => this.shiftTime(trans, i+1)} key={`sl${i}`} /> )}
				</bp.MenuItem>

			</>}

			<CopyLocationContextMenuItem locationPath={locationPath} icon={"blank"} />
		</bp.Menu>;

		// mouse position is available on event
		bp.ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
	}

	initializeGrid = (flex) => {

		this.gridRef = flex;

		flex.addEventListener(flex.hostElement, 'contextmenu', this.renderContextMenu);
		$(flex.hostElement).addClass(css.grid);

		this.tableCopier = new TableCopier(this.gridRef);

		const transformations = this.transformations;
		// insert extra column header row
		const chs = flex.columnHeaders;
		let newHeaderRow_0 = new wijmo.grid.Row();
		let newHeaderRow_1 = new wijmo.grid.Row();
		let newHeaderRow_2 = new wijmo.grid.Row(); // make last row has double height
		chs.rows.insert(0, newHeaderRow_0);
		chs.rows.insert(1, newHeaderRow_1);
		chs.rows.insert(2, newHeaderRow_2);

		// fill out headings in extra header row
		const tableName = utility.formatLabelText(this.GRID_DEFS.TABLE);
		for (let i = 0; i < flex.columns.length; i++) {
			if ( i == 0) {
				let hdr = chs.getCellData(3, i, false);
				chs.setCellData(0, i, hdr);
				chs.setCellData(1, i, hdr);
				chs.setCellData(2, i, hdr);
			} else {
				chs.setCellData(0, i, tableName);
				let columnName = this.getTransformationName(this.getTransformation(i));
				chs.setCellData(1, i, columnName);
				chs.setCellData(2, i, chs.getCellData(3, i, false));
			}

			flex.columns[i].allowMerging = true;
		}
		// allow merging across and down extra header row
		newHeaderRow_0.allowMerging = true;
		newHeaderRow_1.allowMerging = true;

		flex.cells.rows[0].isReadOnly = true;

		// custom rendering for headers of name
		flex.formatItem.addHandler((flex, e) => {
			const {row, col, cell} = e;
			if (e.panel == flex.columnHeaders) {
				if (row == 1 && col > 0) {
					const trans = this.getTransformation(col);
					cell.innerHTML = `<input type="text" className="wj-grid-editor wj-form-control" value='${this.getTransformationName(trans)}'>`;
					const input = cell.firstChild;
					$(input).on('blur', (event) => {
						if (event.target == input) {
							this.updateTransformationName(input, this.getTransformation(col))
						}
					}).on('keydown', (event) => {
						if (event.keyCode == KeyCode.Enter) {
							$(input).trigger('blur');
						}
					}).on('click', (event) => {
						event.preventDefault();
						event.cancelBubble = true;
					})
					$(cell).addClass(css.editable);
				}
			} else if (e.panel == flex.cells) {
				const columnDef = flex.columns[col];
				const rowDef = flex.cells.rows[row];
				const records = flex.itemsSource[row];
				if (row != 0 && !columnDef.isReadOnly && !rowDef.isReadOnly) {
					$(cell).addClass(css.editable);
					if( records[`has_${columnDef.binding}`] !== true ) {
						$(cell).addClass(css.emptyCell);
					}
				} else {
					$(cell).addClass(css.notEditable);
				}
			}
		});
	}

	onBeginningEdit = (e) => {
		const {col, row, panel} = e;
		if ($(panel.getCellElement(row, col)).is(`.${css.notEditable}`)) { return false; }
		return true;
	}

	onCellEditEnded = (e) => {
		const {col, row} = e;
		const trans = this.getTransformation(col);
		const binding = this.gridRef.columns[col]?.binding;
		const record = this.gridRef.itemsSource[row];
		const time = parseInt(record[this.GRID_DEFS.COLUMN.TIME]);

		if (!_.isNumber(time) || !binding) {
			return;
		}

		const activeCell = this.gridRef.cells.getCellElement(row, col);
		let isEmptyValue: boolean;
		if (binding.indexOf(this.GRID_DEFS.COLUMN.DAMAGE_SHARE) > -1) {
			this.updateDamageShare(trans, time, record[binding]);
			isEmptyValue = record[binding] == this.GRID_DEFS.DEFAULTS.DAMAGE_SHARE;
		} else if (binding.indexOf(this.GRID_DEFS.COLUMN.VOLATILITY_FACTOR) > -1) {
			this.updateVolatilityFactor(trans, time, record[binding]);
			isEmptyValue = record[binding] == this.GRID_DEFS.DEFAULTS.VOLATILITY_FACTOR;
		}

		if (isEmptyValue) {
			activeCell && $(activeCell).addClass(css.emptyCell);
			record[`has_${binding}`] = false;
		} else {
			activeCell && $(activeCell).removeClass(css.emptyCell);
			record[`has_${binding}`] = true;
		}
	}

	onScrollPositionChanged = () => {
		if ( !this.allowPageScrolling && this.gridRef.viewRange._row2 == this.props.climateRiskAnalysis.riskDefinitionRows ) {
			this.addTimeLines();
		}
	}

	copyDataSet = (trans, click_col) => {
		if (!this.gridRef) { return; }
		const startCol = click_col % 2 == 1 ? click_col : click_col - 1;
		const endCol = startCol + 1;
		const startRow = _.findIndex(this.props.climateRiskAnalysis.inputState.transformationSets, t => !!(t && t[trans.transformationId]));
		const endRow = _.findLastIndex(this.props.climateRiskAnalysis.inputState.transformationSets, t => !!(t && t[trans.transformationId]));
		this.gridRef.selection = new wijmo.grid.CellRange(startRow,startCol,endRow,endCol);

		this.tableCopier.copySelection();
	}

	normalizeDamage = (trans: Transformation) => {
		if (!trans?.transformationId) { return; }
		const id = trans.transformationId;

		const transformationMap: {[time: string]: number} = {};

		_.forEach( this.props.climateRiskAnalysis.inputState.transformationSets, (tSet,i) => {
			const v = (tSet && tSet[id]?.damageFunction);
			if (_.isNumber(v) && v != this.GRID_DEFS.DEFAULTS.DAMAGE_SHARE) {
				transformationMap[`${i}`] = v;
			}
		});
		let sum = 0;
		_.forEach( Object.values(transformationMap), (v) => sum = add(sum, v));
		if ( sum === 1 ) { return; }

		//const maxPrecision = Math.max(`${sum}`.split('.')[1]?.length || 0, 5); //minimum = 5 because now table can show 3 precisions.
		const sizeOfList = Object.keys(transformationMap).length;
		let leavedValue = 1;
		_.forEach( Object.keys(transformationMap), (key, i) => {
			const time = Number(key);
			const v = transformationMap[key];
			const isLast = i == (sizeOfList-1);
			const newValue = isLast ? leavedValue : divide(v, sum);
			leavedValue = subtract(leavedValue, newValue);
			this.updateDamageShare(trans, time, newValue);
		});

		this.props.climateRiskAnalysis.loadInputState();
	}

	@computed get gridColumnHeaders() {
		const commonProps = {
			dataType:     wijmo.DataType.Number,
			allowSorting: false,
			width:81,
		}
		const columns: [any] = [{
			...commonProps,
			dataType:     wijmo.DataType.String,
			header: utility.formatLabelText(this.GRID_DEFS.COLUMN.TIME),
			binding: this.GRID_DEFS.COLUMN.TIME,
			isReadOnly: true,
			align: 'center',
			width: 55
		}];

		_.forEach( this.transformations , (trans) => {
			columns.push({
				...commonProps,
				format: 'p3',
				header: utility.formatLabelText(this.GRID_DEFS.COLUMN.DAMAGE_SHARE),
				binding: this.getTransformationColumnKey(trans, this.GRID_DEFS.COLUMN.DAMAGE_SHARE),
				wordWrap: true
			});
			columns.push({
				...commonProps,
				format: 'n3',
				header: utility.formatLabelText(this.GRID_DEFS.COLUMN.VOLATILITY_FACTOR),
				binding: this.getTransformationColumnKey(trans, this.GRID_DEFS.COLUMN.VOLATILITY_FACTOR),
				wordWrap: true
			});
		})

		return columns;
	}



	addTransformation = async () => {
		site.busy = true;
		const newName = this.getTransformationName({
			transformationId: null,
			name: null
		});
		await xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/transformations`,{name: newName}).then((rtn: {runRequired: boolean}) => {
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
			this.props.climateRiskAnalysis.loadInputState();
		}).finally(() => site.busy = false);
	}

	removeTransformation = async (transformation) => {
		if (!transformation || !transformation.transformationId) {
			return;
		}
		site.busy = true;
		await xhr.delete(`${this.props.climateRiskAnalysis.apiUrl}/transformations/${transformation.transformationId}`).then((rtn: {runRequired: boolean}) => {
			this.props.climateRiskAnalysis.loadInputState();
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
		}).finally(() => site.busy = false);
	}

	updateTransformationName = (cell, transformation) => {
		if (!transformation || !transformation.transformationId) {
			return;
		}
		let name = _.toString(cell.value);
		if (!name) {
			name = this.getTransformationName(transformation);
			cell.value = name;
		}
		site.busy = true;
		xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/transformation`,{
			transformationId: transformation.transformationId,
			name : name
		}).catch(err => {
			cell.value = transformation.name || name;
			throw err;
		}).then((rtn: {runRequired: boolean}) => {
			transformation.name = name;
		}).finally(() => site.busy = false);
	}

	updateDamageShare = (transformation, time: number, damageFunction: number) => {
		if (!transformation || !transformation.transformationId || !_.isNumber(damageFunction)) {
			return;
		}

		const payload = {
			transformationId: transformation.transformationId,
			time :            time,
			damageFunction:   damageFunction
		}
		site.busy = true;
		xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/damage-function`, payload).then((rtn: {runRequired: boolean}) => {
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
			setTimeout( ()=>this.updateDataBack(payload),100);

		}).finally(() => site.busy = false);
	}

	updateVolatilityFactor = (transformation, time: number, volatilityFactor: number) => {
		if (!transformation || !transformation.transformationId || !_.isNumber(volatilityFactor)) {
			return;
		}

		const payload = {
			transformationId: transformation.transformationId,
			time :            time,
			volatilityFactor: volatilityFactor
		}
		site.busy = true;
		xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/volatility-factor`, payload).then((rtn: { runRequired: boolean }) => {
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
			setTimeout(() => this.updateDataBack(payload), 100);
		}).finally(() => site.busy = false);
	}

	updateDataBack(payload: {transformationId: string, time: number, volatilityFactor?: number, damageFunction?: number}) {
		const transformationSets = this.props.climateRiskAnalysis.inputState.transformationSets;
		const {transformationId, time, volatilityFactor, damageFunction} = payload;
		const hasDamageFunction = _.isNumber(damageFunction);
		const hasVolatilityFactor = _.isNumber(volatilityFactor);
		if (transformationSets.length < time || !transformationSets[time]) {
			while (transformationSets.length < time) {
				transformationSets.push(null);
			}
			transformationSets[time] = {[transformationId]: {damageFunction: hasDamageFunction ? damageFunction : 0, volatilityFactor: hasVolatilityFactor ? volatilityFactor : 1}};
		} else if (!transformationSets[time][transformationId]) {
			transformationSets[time][transformationId] = {damageFunction: hasDamageFunction ? damageFunction : 0, volatilityFactor: hasVolatilityFactor ? volatilityFactor : 1};
		} else {
			if (hasDamageFunction) {
				transformationSets[time][transformationId].damageFunction = damageFunction;
			}
			if (hasVolatilityFactor) {
				transformationSets[time][transformationId].volatilityFactor = volatilityFactor;
			}
		}
	}

	clearDamageShare = (transformation) => {
		if (!transformation || !transformation.transformationId) {
			return;
		}
		const id = transformation.transformationId;

		_.forEach( this.props.climateRiskAnalysis.inputState.transformationSets, (tSet,i) => {
			const v = ((tSet && tSet[id]?.damageFunction) || this.GRID_DEFS.DEFAULTS.DAMAGE_SHARE);
			if (v != this.GRID_DEFS.DEFAULTS.DAMAGE_SHARE) {
				this.updateDamageShare(transformation, i as any, this.GRID_DEFS.DEFAULTS.DAMAGE_SHARE);
			}
		});

		this.props.climateRiskAnalysis.loadInputState();
	}

	clearVolatilityFactor = (transformation) => {
		if (!transformation || !transformation.transformationId) {
			return;
		}
		const id = transformation.transformationId;

		_.forEach( this.props.climateRiskAnalysis.inputState.transformationSets, (tSet,i) => {
			const v = ((tSet && tSet[id]?.volatilityFactor) || this.GRID_DEFS.DEFAULTS.VOLATILITY_FACTOR);
			if (v != this.GRID_DEFS.DEFAULTS.VOLATILITY_FACTOR) {
				this.updateVolatilityFactor(transformation, i as any, this.GRID_DEFS.DEFAULTS.VOLATILITY_FACTOR);
			}
		});

		this.props.climateRiskAnalysis.loadInputState();
	}

	shiftTime = (transformation, shift:number) => {
		if (!transformation?.transformationId || !shift) {
			return;
		}

		const id = transformation.transformationId;

		let updatePayloadAry : {time: number, volatilityFactor: number, damageFunction: number}[] = [];
		const transformationSets = this.props.climateRiskAnalysis.inputState.transformationSets;

		const firstTime = _.findIndex(transformationSets, tSet => !!(tSet && tSet[id]));
		const lastTime =  _.findLastIndex(transformationSets, tSet => !!(tSet && tSet[id]));

		_.forEach( transformationSets, (tSet,i) => {
			if (!tSet) {
				return;
			}
			const damageFunction = tSet[id]?.damageFunction;
			const volatilityFactor = tSet[id]?.volatilityFactor;
			if ( damageFunction != null || volatilityFactor != null ){
				updatePayloadAry.push({
					time: i as any,
					damageFunction: damageFunction,
					volatilityFactor: volatilityFactor
				})
			}
		});

		if (!updatePayloadAry.length) { return; }

		const start = shift > 0 ? firstTime : Math.max( firstTime + shift , 1);
		const end = shift > 0 ? lastTime + shift : lastTime;

		if( this.props.climateRiskAnalysis.riskDefinitionRows < end ) { this.props.climateRiskAnalysis.riskDefinitionRows = end + 1;}

		for (let i = start ; i <= end ; i++ ) {
			const orgTime = i - shift;
			let updatePayLoad = orgTime > 0 ? _.find(updatePayloadAry, payload => payload.time == orgTime) : null;
			if (updatePayLoad) {
				this.updateDamageShare(transformation, i, updatePayLoad.damageFunction);
				this.updateVolatilityFactor(transformation, i, updatePayLoad.volatilityFactor);
			} else {
				this.updateDamageShare(transformation, i, this.GRID_DEFS.DEFAULTS.DAMAGE_SHARE);
				this.updateVolatilityFactor(transformation, i, this.GRID_DEFS.DEFAULTS.VOLATILITY_FACTOR);
			}
		}

		this.props.climateRiskAnalysis.loadInputState();
	}

}