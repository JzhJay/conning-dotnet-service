import { action, computed, observable, reaction, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as ReactDOM from 'react-dom';
import type {StrategySummaryUserOptions} from 'stores';
import {appIcons, IO, IOPage, IOView, defaultTableRowOrders} from 'stores';
import {displayUnit, downloadCSVFile, downloadXLSXFile, ignoreCssInPrintPDF } from 'utility';
import {bp, IconButton} from '../../../index';
import {ResizeSensorComponent} from 'components';
import {Toolbar} from '../../toolbar/Toolbar';
import {CommonDatasetToolbarItem} from '../toolbar/CommonDataset';
import {SSAssetGroupToolbarItem} from '../toolbar/SSAssetGroup';
import {SSRowsToolbarItem} from '../toolbar/SSRows';
import { CtesToolbarItem } from 'components/system/common/Ctes';
import { PercentilesToolbarItem } from 'components/system/common/Percentiles';
import * as css from './StrategySummaryView.css';
import {HTMLTable } from '@blueprintjs/core';
import * as React from 'react';

interface MyProps {
	io: IO;
	view: IOView;
	page: IOPage;
	userOptions: StrategySummaryUserOptions;
}

interface DataRow {
	name: String;
	cells: number[];
	displayUnitDef?: {unit: string, scale: number};
	isPercentile?: boolean;
	assetLevel?: number;
	assetColor?: any;
}

@observer
export class StrategySummaryView extends React.Component<MyProps, {}> {

	defaultRowsOrder = defaultTableRowOrders;
	_toDispose = [];
	_lastReportExtentTimer;
	constructor(props, state) {
        super(props, state);

        makeObservable(this);

        const {view} = this.props;
        this.props.view.plotExtremes = {marginLeft: 0, marginRight: 0};

        if (!this.props.userOptions.rowsOrder || !this.props.userOptions.rowsOrder.length) {
			this.updateUserOptions({'rowsOrder': this.defaultRowsOrder});
		}
    }

	componentDidMount(): void {
		this.reportExtent();
		this.userOptions = this.props.userOptions;

		this._toDispose.push(reaction(() => this.props.io.updateCount, () => {
			this.reportExtent();
		}))

		this.onResize();
	}
	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (!_.isEqual(prevProps.userOptions, this.props.userOptions)) {
			this.userOptions = this.props.userOptions;
		}
	}

	get headerEvaluations() {
		const {io, userOptions} = this.props;
		const evaluations = io.datasetEvaluations(userOptions).concat(this.hoverEvalIndex ? {...io.evaluations[this.hoverEvalIndex], name: "Hover"} : []);
		return evaluations;
	}

	@computed get referenceColumn() {
		const {relativeEvaluationIndex, updateCount} = this.props.io;
		return this.headerEvaluations.findIndex(h => h.evaluationNumber == relativeEvaluationIndex);
	}

	@computed get margins() {
		const {plotExtremes} = this.props.page;

		const marginRight = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginRight));
		const marginLeft = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginLeft));

		return {marginRight, marginLeft}
	}

	componentWrapper;
	@observable	scrollWidth;

	@action onResize = () => {
		if (!this.componentWrapper) {
			const componentRoot = ReactDOM.findDOMNode(this);
			if (!componentRoot) { return; }
			this.componentWrapper = $(componentRoot).find(`.${css.tableWrapper}`)[0];
			if (!this.componentWrapper) { return; }
		}
		this.scrollWidth = this.componentWrapper.offsetWidth - this.componentWrapper.clientWidth;
	}

	reportExtent() {
		// Wrap in timeout to run after DOM is updated when triggered from action.
		this._lastReportExtentTimer = setTimeout(() => {
			const {io: {plotExtremes}, view} = this.props;
			const node                       = ReactDOM.findDOMNode(this);
			const assetWidth                 = this.headerEvaluations.length == 0 ? 0 : $(node).find('.asset-header').get(0).offsetWidth;
			const extreme                    = plotExtremes[view.id];

			if (!extreme || extreme.marginLeft != assetWidth)
				this.props.view.plotExtremes = {marginLeft: assetWidth, marginRight: 0};
		}, 0);
	}

	Cell = (props) => {
		const cellIndex = this.headerEvaluations[props.index].evaluationNumber;
		return <td {...props} className={classNames({[css.cellHighlight]: this.hoverEvalIndex == cellIndex})}>{props.children}</td>;
	}

	renderToolbar() {
		return <Toolbar className={classNames(css.toolbar, ignoreCssInPrintPDF.default)}
			left={<>
				<CommonDatasetToolbarItem userOptions={this.props.userOptions} io={this.props.io} updateUserOptions={this.updateUserOptions} view={this.props.view}
				                          additionalItems={<SSRowsToolbarItem userOptions={this.props.userOptions} updateUserOptions={this.updateUserOptions} />}
				                          alwaysShowAdditionalItems={true}
				> </CommonDatasetToolbarItem>
				{this.props.userOptions.showAssetClass &&<><span className={bp.Classes.NAVBAR_DIVIDER}/><SSAssetGroupToolbarItem userOptions={this.props.userOptions} io={this.props.io} updateUserOptions={this.updateUserOptions} visibleAssets={this.visibleAssets}/></>}
				{!this.props.userOptions.shouldInheritData && this.props.userOptions.showPercentiles && <><span className={bp.Classes.NAVBAR_DIVIDER}/><PercentilesToolbarItem userOptions={this.props.userOptions} updatePercentiles={() => this.props.io.updatePercentiles()} updateUserOptions={this.updateUserOptions} /></>}
				{!this.props.userOptions.shouldInheritData && this.props.userOptions.showCtes && <><span className={bp.Classes.NAVBAR_DIVIDER}/><CtesToolbarItem userOptions={this.props.userOptions} updateCtes={() => this.props.io.updateCtes()} updateUserOptions={this.updateUserOptions}/></>}
			</>}
			right={<>
				<bp.Tooltip position={bp.Position.BOTTOM} content="Export">
					<bp.Popover position={bp.Position.BOTTOM_RIGHT}
					            interactionKind={bp.PopoverInteractionKind.CLICK}
					            content={<bp.Menu>
						            <bp.MenuItem text={'Export CSV'} onClick={() => downloadCSVFile(this.exportDatas, `${this.props.io.name}-StrategySummaryExport.csv`, true, 2, 1)}/>
						            <bp.MenuItem text={'Export XLSX'} onClick={() => downloadXLSXFile(this.exportDatas, `${this.props.io.name}-StrategySummaryExport.xlsx`)}/>
					            </bp.Menu>}>
						<IconButton  icon={appIcons.investmentOptimizationTool.download} target="download"/>
					</bp.Popover>
				</bp.Tooltip>
			</>}
		/>
	}

	userOptions = {};
	updateUserOptions = (userOptions: StrategySummaryUserOptions) => {
		this.props.io.currentPage.updateUserOptions(this.props.view.id, Object.assign(this.userOptions, userOptions));
		this.reportExtent();
	}

	@action toggleGroup = (level, name) => {
		if (level < 2) {
			const {props:{userOptions:{enabledAssetGroupLevels}, io}}            = this;
			let collapsedAssetGroupByLevel = this.props.userOptions.collapsedAssetGroupByLevel || [[], []];
			let collapsed                  = [...collapsedAssetGroupByLevel[level]];
			let index                      = collapsed.indexOf(name);
			const hasVisibleChildren       = enabledAssetGroupLevels[level + 1] == true || enabledAssetGroupLevels[level + 2] && (level == 0 && this.visibleAssets(level + 2, name).length > 0);

			if (hasVisibleChildren) {
				if (index != -1)
					collapsed.splice(index, 1);
				else
					collapsed.push(name);
			}
			else {
				// If no children are visible force the next level on, expanding this group and collapsing others.
				collapsed = io.assetGroups(level, false).map(a => a.name).filter(a => a != name);
			}

			let update = {
				collapsedAssetGroupByLevel: Object.assign([...collapsedAssetGroupByLevel], {[level]: collapsed})
			};

			if (!hasVisibleChildren) {
				update["enabledAssetGroupLevels"] = Object.assign([...this.props.userOptions.enabledAssetGroupLevels], {[level + 1]: true});
			}

			this.updateUserOptions(update);
		}
	}

	visibleAssets = (level, pathName = null) => {
		const {io} = this.props;
		const {collapsedAssetGroupByLevel} = this.props.userOptions;

		let assetGroups = [];
		let assetGroupChildren:any = [];
		for (let l = 0; l <= level; l++) {
			assetGroupChildren = (l == 0 ? io.getAssetClassInput() : _.flatten(assetGroupChildren.map(c => c.assetClasses)))
				.filter(a => l == level || pathName == a.name || collapsedAssetGroupByLevel[l].find(c => c == a.name) == null);

			if (pathName != null && l == 0) {
				assetGroupChildren = assetGroupChildren.filter(a => a.name == pathName);
			}

			if (l == level) {
				assetGroupChildren.forEach(a => assetGroups.push(a.name));
			}
		}

		return assetGroups;
	}

	get displayHoverPlaceholder() {
		return this.props.io.currentPage.canShowHoverPoint && this.props.io.hoverEvalIndex == null;
	}

	get hoverEvalIndex() {
		return this.props.io.currentPage.canShowHoverPoint ? this.props.io.hoverEvalIndex : null;
	}

	async setRelativePoint(evaluation, referenceColumn, columnIndex) {
		const {io} = this.props;

		await io.setRelativePoint(referenceColumn == columnIndex ? null : evaluation.evaluationNumber);
		this.reportExtent();
	}

	get detailDatas() : DataRow[][] {
		let exports: DataRow[][] = [];

		const {io, userOptions} = this.props;
		const {referenceColumn} = this;
		const relativePointForDU = this.referenceColumn >= 0 ? this.headerEvaluations[this.referenceColumn] : {min: 0, max: 0};
		const values = this.headerEvaluations.map(e => e.min - relativePointForDU.min).concat(this.headerEvaluations.map(e => e.max - relativePointForDU.max))
		const displayUnitDef:{unit: string, scale: number} = displayUnit(Math.max(...(values.map(Math.abs))));
		const shouldInheritData = (this.props.view.userOptions as StrategySummaryUserOptions).shouldInheritData;

		let rowsOrder: string[];
		if (shouldInheritData) {
			rowsOrder = this.defaultRowsOrder;
		} else {
			rowsOrder = this.props.userOptions.rowsOrder;
		}

		rowsOrder.map((rowAttr, rowIndex) => {
			if (!shouldInheritData && !userOptions[rowAttr]) { return; }

			if(rowAttr == 'showAssetClass'){
				exports.push(this.assetDataRow({assetClasses: io.getAssetClassInput()}, 0));
				return;
			}

			const groupData: DataRow[] = [];
			exports.push(groupData);

			switch(rowAttr) {
				case 'showDuration':

					groupData.push({
						name: 'Duration',
						cells: this.headerEvaluations.map((e, i) => io.computeDuration(e))
					});
					break;
				case 'showTotal':
					groupData.push({
						name: 'Total',
						cells: this.headerEvaluations.map((e, i) => e.assetAllocation ? _.sum(io.allocationsAtLevel(userOptions.enabledAssetGroupLevels.indexOf(true), e.assetAllocation, false)) : 0),
						isPercentile: true
					});
					break;
				case 'showMetrics':
					const relativePoint = this.referenceColumn >= 0 ? this.headerEvaluations[this.referenceColumn] : {risk: 0, reward: 0};
					const riskDifference = this.headerEvaluations.map(e => e.risk - relativePoint.risk);
					const rewardDifference = this.headerEvaluations.map(e => e.reward - relativePoint.reward);
					const relativePrefix = referenceColumn >= 0 ? "Change In " : "";
					// risk
					groupData.push({
						name: `${relativePrefix}Risk`,
						cells: riskDifference.map((r, i) => r),
						displayUnitDef: displayUnitDef
					});
					// reward
					groupData.push({
						name: `${relativePrefix}Reward`,
						cells: rewardDifference.map((r, i) => r),
						displayUnitDef: displayUnitDef
					});
					break;

				case 'showMean':
					groupData.push({
						name: 'Mean',
						cells: this.headerEvaluations.map((e, i) => e['mean']),
						displayUnitDef: displayUnitDef
					});
					break;
				case 'showMin':
					groupData.push({
						name: 'Minimum',
						cells: this.headerEvaluations.map((e, i) => e['min']),
						displayUnitDef: displayUnitDef
					});
					break;
				case 'showMax':
					groupData.push({
						name: 'Maximum',
						cells: this.headerEvaluations.map((e, i) => e['max']),
						displayUnitDef: displayUnitDef
					});
					break;
				case 'showPercentiles':
					let percentiles = this.props.userOptions.percentiles.filter(p => typeof p == 'number' && !Number.isNaN(p));
					percentiles.map( p => {
						groupData.push({
							name: `${p}%`,
							cells: this.headerEvaluations.map((e, i) => e.percentiles[io.outputControls.percentiles.indexOf(p)]),
							displayUnitDef: displayUnitDef
						});
					})
					break;
				case 'showCtes':
					let ctes = this.props.userOptions.ctes;
					if (!ctes || !ctes.length) {
						break;
					}
					ctes.forEach( c => {
						groupData.push({
							name: `${_.upperFirst(c.area)} ${c.percentile}%`,
							cells: this.headerEvaluations.map((e, i) => e.ctes[io.outputControls.ctes.findIndex(oc => oc.area == c.area && oc.percentile == c.percentile)]),
							displayUnitDef: displayUnitDef
						});
					});
					break;
				case 'showStandardDeviation':
					groupData.push({
						name: 'Deviation',
						cells: this.headerEvaluations.map((e, i) => e['standardDeviation']),
						displayUnitDef: displayUnitDef
					});
					break;
				default:
					break;
			}
		})
		return exports;
	}

	get exportDatas() : string[][] {
		const io = this.props.io;
		let exports : string[][] = [];
		let headers : string[] = [''];
		// header line1: additionalPoint names
		this.headerEvaluations.forEach((evaluation, columnIndex) => {
			headers.push(io.isAdditionalPoint(evaluation.evaluationNumber) ? `${(io.additionalPoints.filter(a => a.evaluationIndex == evaluation.evaluationNumber)[0].name)}` : '')
		});
		exports.push(headers);

		headers = [''];
		// header line2: Additional Point number & Sampled Efficient Frontier Point serial.
		this.headerEvaluations.forEach((evaluation, columnIndex) => {
			headers.push(`${evaluation.name}`)
		});
		exports.push(headers);

		this.detailDatas.forEach(g => g.forEach( data => {
			const dataLine = [`${data.name}`];
			data.cells.forEach( value => {
				value = value || 0;
				if(data.isPercentile){
					dataLine.push(this.numberToPercentileString(value));
				} else {
					dataLine.push(`${value}`);
				}
			})
			exports.push(dataLine);
		}));
		return exports;
	}

	numberToPercentileString(value: number, fractionDigits?: number): string {
		if (!_.isFinite(value)) {
			return "";
		}
		if  (fractionDigits == null) {
			const testAllocationIncrement = `${value}`.match(/(\d*)(\.\d+)?/);
			fractionDigits = testAllocationIncrement && testAllocationIncrement[2] ? testAllocationIncrement[2].length - 1 : 0;
		};
		return `${(value * 100).toFixed(Math.max(fractionDigits - 2, 0))}%`;
	}

	assetDataRow(group, level) : DataRow[] {
		const {io, userOptions} = this.props;
		if(userOptions.enabledAssetGroupLevels[level] == false){ return []; }

		let exports: DataRow[] = [];

		group.assetClasses.forEach((asset, index) => {
			const assetName = asset.name;
			const groupIndex = io.assetGroups(level, false).findIndex((g) => g.name == assetName);

			exports.push({
				name: assetName,
				cells: this.headerEvaluations.map((e, i) => (e.assetAllocation ? io.allocationsAtLevel(level, e.assetAllocation, false)[groupIndex] : 0)),
				isPercentile: true,
				assetLevel: level,
				assetColor: asset.color
			})

			if(level != 2 && !this.isCollapsed(level, assetName)){
				let subRows = this.assetDataRow(asset, level + 1);
				exports = exports.concat(subRows);
			}
		})

		return exports;
	}

	isCollapsed(level, name) {
		const {collapsedAssetGroupByLevel} = this.props.userOptions;
		return collapsedAssetGroupByLevel && collapsedAssetGroupByLevel[level].indexOf(name) != -1;
	}

	componentWillUnmount(): void {
		this.props.view.plotExtremes = null;
		this._toDispose.forEach(f => f());
		if (this._lastReportExtentTimer) {
			clearTimeout(this._lastReportExtentTimer);
		}
	}

	render() {
		const {io} = this.props;
		const {referenceColumn, Cell} = this;

		const {io: { updateCount }} = this.props; // Trigger mobX update

		return <div className={css.root}>
			<ResizeSensorComponent onResize={this.onResize} />
			{this.renderToolbar()}
			<span className={css.title}>Strategy Summary Table</span>
			<div className={classNames(css.tableWrapper, {[css.hoverMode]: this.hoverEvalIndex != null})} style={{paddingRight: Math.max((this.margins.marginRight-this.scrollWidth)||0 , 0) }}>
				<HTMLTable small>
					<thead>
						<tr key={0}>
							<th className="asset-header" style={{width: this.margins.marginLeft || "1%"}}> </th>
							{this.headerEvaluations.map((evaluation, columnIndex) =>
							<th key={columnIndex}
							    className={classNames({[css.referenceColumn]: referenceColumn == columnIndex, [css.cellHighlight]: this.hoverEvalIndex == evaluation.evaluationNumber, [css.hoverPlaceholder]: evaluation.name == 'Hover'})}
							    onClick={() => this.setRelativePoint(evaluation, referenceColumn, columnIndex)}>
								{io.isAdditionalPoint(evaluation.evaluationNumber) && (
									<div className={css.extendPointName}>{evaluation.displayName}</div>
								)}
								<div className={css.pointName}><div className={css.bgCircle}>{evaluation.name}</div></div>
							</th>)}
							{this.displayHoverPlaceholder && <th className={css.hoverPlaceholder}>Hover</th>}
						</tr>
					</thead>
					<tbody>
					{this.detailDatas.map((dataGroup,gi) => <React.Fragment key={`${gi}`}>
						{
							dataGroup.map((data, di) =>
								<tr key={`${gi}_${di}`}>
									{ ((data) => {
										const assetLevel = data.assetLevel;
										const hasdisplayUnit = data.displayUnitDef && data.displayUnitDef.scale > 1;
										let title;
										if(assetLevel !== null && assetLevel !== undefined) {
											title = <th className={classNames(css.assetClass, {[css.innerAssetClass]: assetLevel == 2})} onClick={() => this.toggleGroup(assetLevel, data.name)}>
												<span style={{display: "flex", marginLeft: this.props.userOptions.enabledAssetGroupLevels.slice(0, assetLevel).filter(g => g != false).length * 20}}>
												<span className={css.symbol} style={{backgroundColor: data.assetColor}}></span>
													{data.name}
												</span>
											</th>
										} else if (hasdisplayUnit) {
											title = <th>{`${data.name} (${data.displayUnitDef.unit})`}</th>
										} else {
											title = <th>{data.name}</th>
										}

										let values: string[] =  data.cells.map((cell_value , ci) => {
											cell_value = cell_value || 0;
											if(hasdisplayUnit){
												cell_value = cell_value / data.displayUnitDef.scale;
											}
											return io.formatNumberByAllocationIncrement(cell_value, data.isPercentile);
										})

										return <>
											{title}
											{values.map((value , ci) => <Cell index={ci} key={`${gi}_${di}_${ci}`}>{value}</Cell>)}
										</>
									})(data)}
								</tr>
							)
						}
						<tr className={css.rowSpacer}><td colSpan={this.headerEvaluations.length}></td></tr>
					</React.Fragment>)}
					</tbody>
				</HTMLTable>
			</div>
		</div>
	}
}