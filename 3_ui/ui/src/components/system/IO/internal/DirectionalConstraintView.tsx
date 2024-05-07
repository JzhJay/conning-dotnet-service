import * as React from 'react';
import {action, computed, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import {HTMLTable } from '@blueprintjs/core';
import type {DirectionalConstraintUserOptions} from 'stores';
import {appIcons, asyncSiteLoading, Evaluation, IO, IOPage, IOView} from 'stores';
import {downloadCSVFile, downloadXLSXFile, ignoreCssInPrintPDF, PdfExporter } from 'utility';
import {bp, IconButton} from '../../../index';
import {ResizeSensorComponent} from 'components';
import {Toolbar} from '../../toolbar/Toolbar';
import {CommonDatasetToolbarItem} from '../toolbar/CommonDataset';

import * as css from './DirectionalConstraintView.css';

interface MyProps {
	io: IO;
	view: IOView;
	page: IOPage;
	userOptions: DirectionalConstraintUserOptions;
}

interface ConstraintValue {
	indicator: string;
	value: number | string;
}

interface DataRow {
	name: String;
	constraintClass: String;
	limit: String[];
	cells: ConstraintValue[];
	assetLevel?: number;
	assetColor?: any;
}

const ConstraintIndicator = {
	upper: 'U',
	non: 'N',
	lower: 'L'
};

@observer
export class DirectionalConstraintView extends React.Component<MyProps, {}> {

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@observable	scrollWidth;
	tableRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
	reportRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
	componentWrapper;
	pdfExporter = new PdfExporter();
	_toDispose = [];


	get headerEvaluations() : Array<Evaluation> {
		const { io, userOptions } = this.props;
		const evaluations = io.datasetEvaluations(userOptions).concat(this.hoverEvalIndex ? {...io.evaluations[this.hoverEvalIndex], name: "Hover"} : []);
		return evaluations;
	}

	@computed get margins() {
		const {plotExtremes} = this.props.page;

		const marginRight = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginRight));
		const marginLeft = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginLeft));

		return {marginRight, marginLeft}
	}

	@action onResize = () => {
		if (this.tableRef.current) {
			this.scrollWidth = this.tableRef.current.offsetWidth - this.tableRef.current.clientWidth;
		}
	}

	Cell = (props) => {
		const { index } = props;
		if (index > 2) {
			const cellIndex = this.headerEvaluations[index].evaluationNumber;
			return <td {...props} className={classNames({[css.cellHighlight]: this.hoverEvalIndex == cellIndex})}>{props.children}</td>;
		}
		return <td {...props}>{props.children}</td>
	}

	updateUserOptions = (userOptions: DirectionalConstraintUserOptions) => {
		// Updating userOptions props directly here is a bit of an antipatern, but CommonDatasetToolbarItem requires its partial updates to be immediately persisted
		this.props.io.currentPage.updateUserOptions(this.props.view.id, Object.assign(this.props.userOptions, userOptions));
	}

	renderToolbar() {
		return <Toolbar className={classNames(css.toolbar, ignoreCssInPrintPDF.default)}
			left={<CommonDatasetToolbarItem userOptions={this.props.userOptions} io={this.props.io} updateUserOptions={this.updateUserOptions} view={this.props.view}
			                                alwaysShowAdditionalItems={true}
			> </CommonDatasetToolbarItem>}
			right={<>
				<bp.Tooltip position={bp.Position.BOTTOM} content="Export">
					<bp.Popover position={bp.Position.BOTTOM_RIGHT}
					            interactionKind={bp.PopoverInteractionKind.CLICK}
					            content={<bp.Menu>
						            <bp.MenuItem text={'Export CSV'} onClick={() => downloadCSVFile(this.exportDatas, `${this.props.io.name}-DirectionalConstraintTable.csv`, true, 2, 1)}/>
						            <bp.MenuItem text={'Export XLSX'} onClick={() => downloadXLSXFile(this.exportDatas, `${this.props.io.name}-DirectionalConstraintTable.xlsx`)}/>
									<bp.MenuItem text={'Export PDF'} onClick={this.printPDF} />
					            </bp.Menu>}>
						<IconButton  icon={appIcons.investmentOptimizationTool.download} target="download"/>
					</bp.Popover>
				</bp.Tooltip>
			</>}
		/>
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

	get detailDatas() : DataRow[][] {
		const exports: DataRow[][] = [];
		const { io } = this.props;
		const firstFrontierPoint = _.get(this.headerEvaluations, [0, "constraintIndicators"], null);

		exports.push(this.assetDataRow({assetClasses: io.getAssetClassInput()}, 0));

		if (firstFrontierPoint?.multiclassConstraintNames) {
			exports.push(this.multiClassRow());
		}
		if (firstFrontierPoint?.durationConstraintIndicator) {
			exports.push(this.durationRow());
		}
		if (firstFrontierPoint?.hhiConstraintIndicator) {
			exports.push(this.hhiRow());
		}

		return exports;
	}

	get exportDatas() : String[][] {
		const exports : String[][] = [];
		const headers : String[] = ['Constraint Class', 'Constraint Name', 'Lower Limit', 'Upper Limit'];
		this.headerEvaluations.forEach((evaluation) => {
			headers.push(`${evaluation.name}`)
		});
		exports.push(headers);

		this.detailDatas.forEach(dataRows => {
			dataRows.forEach(row => {
				const dataLine = [row.constraintClass, row.name, row.limit[0], row.limit[1]];
				row.cells.forEach( value => {
					if (value.indicator === ConstraintIndicator.non) {
						dataLine.push(`Non-binding (${value.value})`);
					} else if (value.indicator === ConstraintIndicator.upper) {
						dataLine.push(`Upper limit (${value.value})`);
					} else if (value.indicator === ConstraintIndicator.lower) {
						dataLine.push(`Lower limit (${value.value})`);
					}
				});
				exports.push(dataLine);
			})
		});

		return exports;
	}

	assetDataRow(group, level) : DataRow[] {
		const io = this.props.io;
		let exports: DataRow[] = [];

		group.assetClasses.forEach((asset) => {
			const assetName = asset.name;
			const groupIndex = io.assetGroups(level, false).findIndex((g) => g.name == assetName);
			const min = _.get(asset, ['constraintsAndDuration', 'classConstraints', 'minimum'], 0);
			const max = _.get(asset, ['constraintsAndDuration', 'classConstraints', 'maximum'], 0);

			exports.push({
				constraintClass: 'Asset Class',
				name: assetName,
				limit: [io.formatNumberByAllocationIncrement(min, true), io.formatNumberByAllocationIncrement(max, true)],
				cells: this.headerEvaluations.map((e) => {
					const allocation = io.allocationsAtLevel(level, e.assetAllocation, false)[groupIndex]
					let indicator = ConstraintIndicator.non;
					if (allocation >= max) {
						indicator = ConstraintIndicator.upper;
					} else if (allocation <= min) {
						indicator = ConstraintIndicator.lower;
					}
					return {
						indicator, value: io.formatNumberByAllocationIncrement(allocation, true)
					};
				}),
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

	multiClassRow(): DataRow[] {
		const io = this.props.io;
		const firstConstraintIndicators = this.headerEvaluations[0]?.constraintIndicators;
		const multiclassConstraintNames    = _.get(firstConstraintIndicators, ['multiclassConstraintNames'], []);
		const multiclassConstraintMinimums = _.get(firstConstraintIndicators, ['multiclassConstraintMinimums'], []);
		const multiclassConstraintMaximums = _.get(firstConstraintIndicators, ['multiclassConstraintMaximums'], []);

		const exports: DataRow[] = [];
		multiclassConstraintNames.forEach((name, index) => {
			exports.push({
				constraintClass: 'Multi-Class',
				name: name,
				limit: [io.formatNumberByAllocationIncrement(multiclassConstraintMinimums[index], true), io.formatNumberByAllocationIncrement(multiclassConstraintMaximums[index], true)],
				cells: this.headerEvaluations.map((e) => {
					const {constraintIndicators} = e;
					if (constraintIndicators) {
						return {
							indicator: _.get(constraintIndicators, ['multiclassConstraintIndicators', index]),
							value: io.formatNumberByAllocationIncrement(_.get(constraintIndicators, ['multiclassConstraintValues', index]), true)
						};
					}

					return { indicator: '', value: 'N/A' };
				}),
			});
		});

		return exports;
	}

	durationRow(): DataRow[] {
		const optimizationInputs = this.props.io.getOptimizationInputs();
		const limit = [
			_.get(optimizationInputs, ['constraintsAndDuration', 'duration', 'minimum'], 0),
			_.get(optimizationInputs, ['constraintsAndDuration', 'duration', 'maximum'], 0),
		];

		return [{
			constraintClass: 'Duration',
			name: 'Duration',
			limit: [limit[0], limit[1]],
			cells: this.headerEvaluations.map((e) => {
				const { durationConstraintIndicator, durationConstraintValue } = e.constraintIndicators || {};
				if (durationConstraintIndicator) {
					return {
						indicator: durationConstraintIndicator,
						value: durationConstraintValue != null ? durationConstraintValue.toFixed(2) : 'Undefined'
					};
				}

				return {
					indicator: '',
					value: 'N/A'
				};
			}),
		}];
	}

	hhiRow(): DataRow[] {
		const io = this.props.io;
		const optimizationInputs = io.getOptimizationInputs();
		const limit = [
			0,
			_.get(optimizationInputs, ['optimizationConstraints', 'maximumAllowedHhi'], 0),
		];

		return [{
			constraintClass: 'HHI',
			name: 'HHI',
			limit: [io.formatNumberByAllocationIncrement(limit[0], true), io.formatNumberByAllocationIncrement(limit[1], true)],
			cells: this.headerEvaluations.map((e) => {
				const { hhiConstraintIndicator, hhiConstraintValue } = e.constraintIndicators || {};
				if (hhiConstraintIndicator) {
					return {
						indicator: hhiConstraintIndicator,
						value: io.formatNumberByAllocationIncrement(hhiConstraintValue, true)
					};
				}

				return {
					indicator: '',
					value: 'N/A'
				};
			}),
		}];
	}

	isCollapsed(level, name) {
		const {collapsedAssetGroupByLevel} = this.props.userOptions;
		return collapsedAssetGroupByLevel && collapsedAssetGroupByLevel[level].indexOf(name) != -1;
	}

	renderTable() {
		const { Cell } = this;
		return (
			<>
				<ResizeSensorComponent onResize={this.onResize} />
				{this.renderToolbar()}
				<span className={css.title}>Constraint Table</span>
				<div className={css.constraintIndicatorLegend}>
					<span><div className={`${css.constraintIndicator} ${css.lowerLimit}`} />Lower limit</span>
					{/* <span><div className={`${css.constraintIndicator} ${css.nonBinding}`} style={{border: "1px solid #DDD"}}/>Non-binding</span> */}
					<span><div className={`${css.constraintIndicator} ${css.upperLimit}`} />Upper limit</span>
				</div>
				<div className={classNames(css.tableWrapper, {[css.hoverMode]: this.hoverEvalIndex != null})} style={{paddingRight: Math.max((this.margins.marginRight-this.scrollWidth)||0 , 0) }} ref={this.tableRef}>
					<HTMLTable small>
						<thead>
						<tr key={0}>
							<th>Constraint Type</th>
							<th>Constraint Name</th>
							<th>Lower Limit</th>
							<th>Upper Limit</th>
							{this.headerEvaluations.map((evaluation, columnIndex) =>
								<th key={columnIndex}
								    className={classNames({[css.cellHighlight]: this.hoverEvalIndex == evaluation.evaluationNumber, [css.hoverPlaceholder]: evaluation.name == 'Hover'})}>
									<div className={css.pointName}><div className={css.bgCircle}>{evaluation.name}</div></div>
								</th>)}
							{this.displayHoverPlaceholder && <th className={css.hoverPlaceholder}>Hover</th>}
						</tr>
						</thead>
						<tbody>
						{this.detailDatas.map((dataGroup,gi) => (
							<React.Fragment key={`row_${gi}`}>
								{
									dataGroup.map((data, di) => {
										const { name, constraintClass, cells, limit, assetColor } = data;
										return (
											<tr key={`${gi}_${di}`}>
												<th>{constraintClass}</th>
												<th>
													<span className={css.assetClassName}>
														{assetColor && <span className={css.symbol} style={{backgroundColor: assetColor}}></span>}
														{name}
													</span>
												</th>
												{limit.map((value, i) => <th key={`${gi}_${di}_limit${i}`}>{value}</th>)}
												{cells.map(({ indicator, value = '' }, ci) => {
													let content: any = 'N/A';
													if (indicator === ConstraintIndicator.upper || indicator === ConstraintIndicator.non || indicator === ConstraintIndicator.lower) {
														content = (
															<div className={classNames(css.constraintIndicator, {
																[css.upperLimit]: indicator === ConstraintIndicator.upper,
																[css.nonBinding]: indicator === ConstraintIndicator.non,
																[css.lowerLimit]: indicator === ConstraintIndicator.lower,
															})}>
																{value}
															</div>
														);
													}

													return (
														<Cell index={ci} key={`${gi}_${di}_${ci}`}>
															{content}
														</Cell>
													);
												})}
											</tr>
										);
									})
								}
								<tr className={css.rowSpacer}><td colSpan={this.headerEvaluations.length}></td></tr>
							</React.Fragment>
						))}
						</tbody>
					</HTMLTable>
				</div>
			</>
		);
	}

	printPDF = asyncSiteLoading(async () => {
		if (this.reportRef.current) {
			const { io: { name }} = this.props;
			await this.pdfExporter.print(this.reportRef.current, `${name}-DirectionalConstraintTable`, {
				customFonts: ['LucidaGrande'],
				sandboxContainer: this.reportRef.current
			});
		}
	})

	componentDidMount(): void {
		this.onResize();
	}

	componentWillUnmount(): void {
		this._toDispose.forEach(f => f());
	}

	render() {
		const {io: { updateCount }} = this.props; // updateCount is for triggering mobX update

		return (
			<div className={css.root} ref={this.reportRef}>
				{
					this.headerEvaluations[0]?.constraintIndicators === null ?
					<>
						<div>
							<span className={css.title}>Constraint Table</span>
						</div>
						<div className={css.noDataDesc}>No constraints found.</div>
					</> :
					this.renderTable()
				}
			</div>
		);
	}
}