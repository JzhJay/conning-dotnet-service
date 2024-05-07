import {action, computed, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import {appIcons, StrategySummaryUserOptions} from 'stores';
import {downloadCSVFile, downloadXLSXFile, ignoreCssInPrintPDF } from '../../../../utility';
import {bp, IconButton, ResizeSensorComponent} from '../../../index';
import {Toolbar} from '../../toolbar/Toolbar';
import {HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {IO, IOPage, IOView} from '../../../../stores/io';

import * as css from './AssetClassesReturnsTableView.css';

interface MyProps {
	io: IO;
	view: IOView;
	page: IOPage;
	userOptions: StrategySummaryUserOptions;
}

interface DataRow {
	name: String;
	cells: number[];
	assetLevel: number;
	assetColor: any;
	isGroup: boolean;
}

@observer
export class AssetClassesReturnsTableView extends React.Component<MyProps, {}> {

	static PRE_ADJ_COLUMN_SETTINGS: ({key: string, labels: string[]})[] = [
		{key: "annualizedAvgPriceReturns", labels: ["Pre-return adjustment", "Price Return", "Mean"]},
		{key: "annualizedStdPriceReturns", labels: ["Pre-return adjustment", "Price Return", "StDev.S"]},
		{key: "annualizedAvgIncomeReturns", labels: ["Pre-return adjustment", "Income Return", "Mean"]},
		{key: "annualizedStdIncomeReturns", labels: ["Pre-return adjustment", "Income Return", "StDev.S"]},
		{key: "annualizedAvgTotalReturns", labels: ["Pre-return adjustment", "Total Return", "Mean"]},
		{key: "annualizedStdTotalReturns", labels: ["Pre-return adjustment", "Total Return", "StDev.S"]},
	];

	static ADJ_COLUMN_SETTINGS: ({key: string, labels: string[]})[] = [
		{key: "adjAnnualizedAvgPriceReturns", labels: ["Return adjustment", "Price Return", "Mean"]},
		{key: "adjAnnualizedStdPriceReturns", labels: ["Return adjustment", "Price Return", "StDev.S"]},
		{key: "adjAnnualizedAvgIncomeReturns", labels: ["Return adjustment", "Income Return", "Mean"]},
		{key: "adjAnnualizedStdIncomeReturns", labels: ["Return adjustment", "Income Return", "StDev.S"]},
		{key: "adjAnnualizedAvgTotalReturns", labels: ["Return adjustment", "Total Return", "Mean"]},
		{key: "adjAnnualizedStdTotalReturns", labels: ["Return adjustment", "Total Return", "StDev.S"]},
	];

	_dispose = [];
	componentWrapper;
	userOptions = {};
	@observable columnWidth: number;

	constructor(props, state) {
		super(props, state);
		this.userOptions = this.props.userOptions;
	}

	componentDidMount() {
		setTimeout(this.calColumnWidth, 100);

		this._dispose.push(reaction(() => [
			this.margins
		], this.calColumnWidth ));
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (!_.isEqual(prevProps.userOptions, this.props.userOptions)) {
			this.userOptions = this.props.userOptions;
		}
	}

	componentWillUnmount(): void {
		_.each( this._dispose, d => d());
	}

	renderToolbar() {
		return <Toolbar className={classNames(css.toolbar, ignoreCssInPrintPDF.default)}
			right={<>
				<bp.Tooltip position={bp.Position.BOTTOM} content="Export">
					<bp.Popover position={bp.Position.BOTTOM_RIGHT}
					            interactionKind={bp.PopoverInteractionKind.CLICK}
					            content={<bp.Menu>
						            <bp.MenuItem text={'Export CSV'} onClick={() => downloadCSVFile(this.exportData, `${this.props.io.name}-StrategySummaryExport.csv`, true, 2, 1)}/>
						            <bp.MenuItem text={'Export XLSX'} onClick={() => downloadXLSXFile(this.exportData, `${this.props.io.name}-StrategySummaryExport.xlsx`)}/>
					            </bp.Menu>}>
						<IconButton  icon={appIcons.investmentOptimizationTool.download} target="download"/>
					</bp.Popover>
				</bp.Tooltip>
			</>}
		/>
	}

	@computed get columns(): ({key: string, labels: string[]})[] {
		let optimizationInputs = _.get(this.props.io.optimizationInputs, "dataSources.useAdditiveMultiplicativeAdjustmentsByAssetClass");
		if (optimizationInputs) {
			return [...AssetClassesReturnsTableView.PRE_ADJ_COLUMN_SETTINGS, ...AssetClassesReturnsTableView.ADJ_COLUMN_SETTINGS];
		} else {
			return AssetClassesReturnsTableView.PRE_ADJ_COLUMN_SETTINGS;
		}
	}

	get exportData() : string[][] {
		let exports : string[][] = [];
		let headers : string[] = this.columns.map( column => column.labels.join(" / "));
		headers.unshift(" ");
		exports.push(headers);

		this.assetDataRow().forEach( row => {
			const dataLine = [`${row.name}`];
			row.cells.forEach(value => {
				value = value || 0;
				dataLine.push(`${value}`);
			})
			exports.push(dataLine);
		});

		return exports;
	}

	assetDataRow(group?, level = 0) : DataRow[] {
		const {io, userOptions} = this.props;
		if (!group && level == 0) {
			group = io.getAssetClassInput();
		}
		if (!group?.length) { return []; }
		if (userOptions.enabledAssetGroupLevels[level] == false) { return []; }

		let exports: DataRow[] = [];

		_.forEach(group, (asset) => {
			const assetName = asset.name;

			const exportData = {
				name: assetName,
				cells: [],
				assetLevel: level,
				assetColor: asset.color,
				isGroup: false
			};

			exports.push(exportData);

			let subRows = level < 2 ? this.assetDataRow(asset.assetClasses, level + 1) : null;

			if (subRows?.length) {
				this.columns.forEach((c, i) => exportData.cells.push(""));
				exportData.isGroup = true;
				exports = exports.concat(subRows);
			} else {
				const index = _.findIndex(io.getAssetClassInputWithoutGroups(), (a) => (a as any).name == asset.name);
				exportData.cells = _.map(this.columns, column => {
					return index >= 0 ? _.get(io, `returnOutputs.${column.key}.${index}`) : null;
				});
			}
		});

		return exports;
	}

	updateUserOptions = (userOptions: StrategySummaryUserOptions) => {
		this.props.io.currentPage.updateUserOptions(this.props.view.id, Object.assign(this.userOptions, userOptions));
	}

	dataFormatter(value: number, key: string) {
		return !_.isFinite(value) ?
		       `${value}` :
		       key.indexOf('Std') >= 0 ?
		       Intl.NumberFormat('en-US', {minimumFractionDigits: 4, maximumFractionDigits: 4}).format(value):
		       Intl.NumberFormat('en-US', {minimumFractionDigits: 3, maximumFractionDigits: 3}).format(value);
	}

	@computed get margins() {
		const {plotExtremes} = this.props.page;

		const marginRight = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginRight));
		const marginLeft = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginLeft));

		return {right: _.isFinite(marginRight) ? marginRight : null, left: _.isFinite(marginLeft) ? marginLeft : null}
	}

	@action calColumnWidth = () => {
		const componentWidth = $(this.componentWrapper).width();
		const marginLeft = Math.max(this.margins.left, $(this.componentWrapper).find("thead th").first().width());
		this.columnWidth = Math.round((componentWidth - marginLeft - this.margins.right) / this.columns.length * 100 ) / 100;
	}

	render() {
		const {io: { updateCount }} = this.props; // Trigger mobX update

		const maxHeaderLevel = _.maxBy(this.columns, column=> column.labels.length).labels.length;
		let headerLabelAndSpan: ({label: string, colSpan?: number, rowSpan?: number, className?: string})[][] = [];
		for (let i = 0 ; i < maxHeaderLevel; i++) {
			headerLabelAndSpan.push([]);
			let lastItem;
			_.forEach(this.columns, column => {
				const label = column.labels[i];
				if (!lastItem || label != lastItem.label) {
					lastItem = {label: label, colSpan: 1, className: column.key};
					headerLabelAndSpan[headerLabelAndSpan.length-1].push(lastItem)
				} else {
					lastItem.colSpan = lastItem.colSpan + 1;
				}
			});
		}
		headerLabelAndSpan[0].unshift({
			label: '',
			rowSpan: maxHeaderLevel
		});

		return <div className={css.root} ref={ ref => this.componentWrapper = ref } >
			{this.renderToolbar()}
			<span className={css.title}>Asset Classes Returns Table</span>
			<div className={classNames(css.tableWrapper)} >
				<HTMLTable small>
					<thead>
						{headerLabelAndSpan.map((s1, i1) => <tr key={`header_row_${i1}`}>
							{s1.map( (s2, i2) => <th key={`header_cell_${i1}_${i2}`} rowSpan={s2.rowSpan} colSpan={s2.colSpan} className={s2.className}>{s2.label}</th>)}
						</tr>)}
					</thead>
					<tbody>
						{this.assetDataRow().map((row, i1) => {
							const assetLevel = row.assetLevel;
							return <tr key={`body_row_${i1}`}>
								<th key={`body_cell_asset_${i1}`} className={classNames(css.assetClass, {[css.innerAssetClass]: assetLevel == 2})} style={{maxWidth: this.margins.left}}>
									<span style={{display: "flex", marginLeft: this.props.userOptions.enabledAssetGroupLevels.slice(0, assetLevel).filter(g => g != false).length * 20}}>
										<span className={css.symbol} style={{backgroundColor: row.assetColor}} />
										{row.name}
									</span>
								</th>
								{row.cells.map((cell, i2) => <td key={`body_cell_${i1}_${i2}`} className={this.columns[i2].key} style={{width: this.columnWidth}}>{this.dataFormatter(cell, this.columns[i2].key)}</td>)}
							</tr>
						})}
					</tbody>
				</HTMLTable>
			</div>
			<ResizeSensorComponent onResize={this.calColumnWidth} />
		</div>
	}
}