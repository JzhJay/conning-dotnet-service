import * as React from 'react';
import { Callout, HTMLTable, Tooltip, AnchorButton, Popover, Position } from '@blueprintjs/core';
import { action, reaction, computed, IReactionDisposer, makeObservable, flow } from 'mobx';
import { observer } from 'mobx-react';

import { bp, IconButton } from 'components';
import { appIcons, site } from 'stores';
import { formatNumberWithCommas, downloadCSVFile, ignoreCssInPrintPDF } from 'utility';
import { ClimateRiskAnalysis, MarketValueStatisticsOptions } from 'stores/climateRiskAnalysis';
import { BookPage } from 'stores/book/BookPage';
import { BookView } from 'stores/book/BookView';
import { PercentilesToolbarItem } from 'components/system/common/Percentiles';
import { SSRowsToolbarItem } from 'components/system/IO/toolbar/SSRows';
import { LoadingIndicator } from '../../../../semantic-ui';
import { HorizonToolbarItem } from '../../../common/HorizonToolbarItem';

import * as css from './MarketValueStatistics.css';
import * as craPageCss from '../../ClimateRiskAnalysisPage.css';

interface MyProps {
	chartType: string;
	climateRiskAnalysis: ClimateRiskAnalysis;
	page: BookPage;
	view: BookView;
	userOptions: MarketValueStatisticsOptions;
}

@observer
export class MarketValueStatistics extends React.Component<MyProps, {}> {
	lastUpdateUserOptions = null;
	_disposers: IReactionDisposer[] = [];

	@computed get marketValueStatisticsOutput() {
		const viewId = _.get(this.props.view, 'id', '');
		return _.get(this.props.climateRiskAnalysis, ['output', 'marketValueStatistics', viewId], null);
	}

	@computed get hasContent() {
		return !!this.marketValueStatisticsOutput;
	}

	@computed get headerData() {
		return this.getHeadersData(this.marketValueStatisticsOutput, [[]]);
	}

	constructor(props) {
		super(props);
           makeObservable(this);
	}

	updateUserOptions = async (updatingUserOptions : MarketValueStatisticsOptions) => {
		this.lastUpdateUserOptions = updatingUserOptions;

		const { page, view } = this.props;
		const newUserOptions = {...view.userOptions, ...updatingUserOptions };
		Object.assign(this.props.userOptions, updatingUserOptions);
		page.updateUserOptions(view.id, newUserOptions);
	}

	updatePercentiles = () => {
		// do nothing temporarily
	}

	setHorizon = (horizon: number) => {
		this.updateUserOptions({ horizon });
	}

	exportCsv = () => {
		const { horizon } = this.props.userOptions;
		downloadCSVFile(this.getExportDatas(), `Horizon${horizon}-MarketValueStatisticsExport.csv`)
	}

	renderToolbar() {
		const { userOptions } = this.props;
		const { showPercentiles } = userOptions;
		const numHorizons = this.marketValueStatisticsOutput?.tablesByTime?.length + 1 || 0;

		return (
			<nav className={classNames(bp.Classes.NAVBAR, css.toolbar, ignoreCssInPrintPDF.default)}>
				<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)}>
					<HorizonToolbarItem userOptions={this.props.view.userOptions} numberOfHorizons={numHorizons} setHorizon={this.setHorizon}/>
					<span className={bp.Classes.NAVBAR_DIVIDER}/>
					<span className={bp.Classes.NAVBAR_DIVIDER}/>
					<Tooltip position={Position.BOTTOM_LEFT} content="Select Statistics">
						<bp.Menu className={css.selectStatisticsButton}>
							<Popover
								autoFocus={false}
								position={bp.Position.BOTTOM_LEFT}
								minimal
								hoverOpenDelay={300} hoverCloseDelay={600}
								interactionKind={bp.PopoverInteractionKind.CLICK}
								popoverClassName={classNames(css.popover)}
								canEscapeKeyClose
								content={<SSRowsToolbarItem userOptions={userOptions} updateUserOptions={this.updateUserOptions} />}
							>
								<AnchorButton text="Select Statistics" onClick={() => {}}/>
							</Popover>
						</bp.Menu>
					</Tooltip>
					{ showPercentiles &&
						<>
							<span className={bp.Classes.NAVBAR_DIVIDER}/>
							<PercentilesToolbarItem userOptions={userOptions}
								updatePercentiles={this.updatePercentiles}
								updateUserOptions={this.updateUserOptions} />
						</>
					}
				</div>
				<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
					<bp.Tooltip position={bp.Position.BOTTOM} content="Export">
						<bp.Popover position={bp.Position.BOTTOM_RIGHT}
							interactionKind={bp.PopoverInteractionKind.CLICK}
							content={<bp.Menu><bp.MenuItem text={'Export CSV'} onClick={this.exportCsv}/></bp.Menu>}>
							<IconButton icon={appIcons.investmentOptimizationTool.download} target="download"/>
						</bp.Popover>
					</bp.Tooltip>
				</div>
			</nav>
		);
	}

	getRowsData() {
		const { userOptions } = this.props;
		const { horizon } = userOptions;
		const { rowNames, tablesByTime } = this.marketValueStatisticsOutput;
		const data = tablesByTime[horizon - 1]; // Data set does not include time 0 so shift horizon by 1
		let lastFieldName = '';

		return data.reduce((accu: any, values, i)=> {
			const originalFieldName = rowNames[i].value;
			let fieldName = originalFieldName;
			const isPercentile = originalFieldName.indexOf('%') !== -1;

			if (isPercentile) {
				fieldName = 'percentile';
			}

			const rowData = {
				name: originalFieldName,
				cells: values.map((e) => e),
				fractionDigits: 0
			};

			if (lastFieldName !== fieldName) {
				accu.push([rowData]);
			} else {
				accu[accu.length - 1].push(rowData);
			}

			lastFieldName = fieldName;
			return accu;
		}, []);
	}

	@computed get maximumTableCellWidth() {
		const { tablesByTime } = this.marketValueStatisticsOutput;
		const maxDigitNumber = tablesByTime.reduce((maxDigits, horizon)=> {
			horizon.forEach((rows) => {
				rows.forEach((value)=> {
					const valueLength = value.toFixed(0).length;
					if (valueLength > maxDigits) {
						maxDigits = valueLength
					}
				});
			});

			return maxDigits;
		}, 0);
		const width = maxDigitNumber * 13;

		return width > 120 ? width : 120;
	}

	formatCell(value, fractionDigits=0, isPercentile=false, isFormatNumber=true) {
		if (!_.isNumber(value) || isNaN(value)) {
			value = 0;
		}

		if (isPercentile) {
			return `${value.toFixed(fractionDigits)}%`;
		}

		if (isFormatNumber) {
			return formatNumberWithCommas(value, fractionDigits);
		}
		return value.toFixed(fractionDigits);
	}

	renderRows() {
		const rowsData = this.getRowsData();
		const maxWidth = this.maximumTableCellWidth;

		return rowsData.map((rows, i)=> {
			return (
				<React.Fragment key={`row_${i}`}>
					{ rows.map(({ name, cells, fractionDigits, isPercentile }, j) => {
						return (
							<tr key={`row_${name}_${j}`} className={css.assetClass}>
								<th className={css.firstCell}>{name}</th>
								{cells.map((value, k)=> {
									return (
										<td className={css.cellContent} style={{width: maxWidth}} key={`${name}_cells_${k}`}>
											{this.formatCell(value, fractionDigits, isPercentile)}
										</td>
									);
								})}
							</tr>
						);
					})}
				</React.Fragment>
			);
		});
	}

	getHeadersData = (column, accu, level = 0) => {
		if (accu.length < level) {
			accu.push([]);
		}

		if (column.columnNames) {
			if (column.value) {
				accu[level - 1].push({
					title: column.value,
					level,
					hasChildren: true,
					attrs: {
						colSpan: column.columnNames.length
					}
				});
			}
			column.columnNames.forEach((item)=> this.getHeadersData(item, accu, level + 1));
		} else {
			let title;
			const attrs = {};
			if (column.type === 'stressId') {
				title = _.find(this.props.climateRiskAnalysis.inputState.stressMetadata, metaData => metaData.stressId == column.value)?.name || '';
			} else {
				if ( column.value === 'Statistic') {
					attrs['className'] = css.firstColumn;
					title = '';
				} else {
					title = column.value;
				}
			}

			accu[level - 1].push({ title, level, attrs, hasChildren: false });
		}

		return accu;
	}

	renderTable() {
		const { headerData } = this;
		const maxLevel = headerData.length;
		const headers = headerData.map((rows, rowIndex)=> (
			<tr key={`header_row_${rowIndex}`}>
				{
					rows.map((cellData, columnIndex) => {
						const rowSpan = !cellData.hasChildren && cellData.level < maxLevel ? { rowSpan: maxLevel - cellData.level + 1 } : {};
						return <th key={`cell_${rowIndex}_${columnIndex}_${cellData.title}`} {...rowSpan} {...cellData.attrs}>{cellData.title}</th>
					})
				}
			</tr>
		));

		return (
			<HTMLTable>
				<thead>
					{headers}
				</thead>
				<tbody>
					{this.renderRows()}
				</tbody>
			</HTMLTable>
		);
	}

	getMarketValueStatisticsData = flow(function* () {
		try {
			site.busy = true;
			const { view } = this.props;
			yield this.props.climateRiskAnalysis.getMarketValueStatisticsData(view.id, this.props.userOptions);
		} finally {
			site.busy = false;
		}
	}.bind(this))

	getExportDatas() : string[][] {
		const exports : string[][] = [];
		const { headerData } = this;
		const headers = headerData.reduce((accu, rows) => {
			rows.forEach((cellData) => {
				if (!cellData.hasChildren) {
					accu.push(cellData.title);
				}
			});
			return accu;
		}, []);

		exports.push(headers);

		const rowsData = this.getRowsData();
		rowsData.forEach((rows)=> {
			rows.forEach(({ name, cells, fractionDigits, isPercentile }) => {
				const dataLine = [ name ];
				cells.forEach((value) => dataLine.push(parseInt(this.formatCell(value, fractionDigits, isPercentile, false))));
				exports.push(dataLine);
			});
		});

		return exports;
	}

	@action onViewCaptionChange = (val: string) => {
		const { page, view } = this.props;
		const userOptions = page.getViewUserOptions(view.id);
		userOptions.viewCaption = val;
		page.updateUserOptions(view.id, userOptions)
	}

	componentDidMount = async () => {
		this._disposers.push(reaction(() => this.props.userOptions,
			async () => {
				if (!this.lastUpdateUserOptions || !Reflect.has(this.lastUpdateUserOptions, 'horizon')) {	// not to fetech data if updated field is horizon
					await this.getMarketValueStatisticsData();
				}
			}, {
				fireImmediately: !this.hasContent
			})
		);
	}

	componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

	render() {
		const { hasContent } = this;
		const { climateRiskAnalysis, page, view, userOptions = { horizon: 1 }} = this.props;
		const { horizon } = userOptions;
		const viewIndex = climateRiskAnalysis.getViewSerialNumberByViewType(view.id);
		return (
			<div className={css.root}>
				{ hasContent &&
				<>
					{this.renderToolbar()}
					{ page.showViewCaption &&
					<div className={craPageCss.viewCaption}>
						<div className={craPageCss.viewCaptionIndex}>
							{`Table ${viewIndex} `}
						</div>
						<div className={craPageCss.viewCaptionInput}>
							<bp.EditableText value={userOptions.viewCaption} onChange={this.onViewCaptionChange} multiline={true} />
						</div>
					</div>
					}

					<div className={css.main}>
						<Callout className={`bp3-intent-primary ${css.topPanel}`} title="Market Value Statistics">
							<div>Horizon {horizon}</div>
						</Callout>
						<div className={css.bottomPanel}>
							{this.renderTable()}
						</div>
					</div>
				</>
				}
				<LoadingIndicator active={!hasContent}>
					Loading data...
				</LoadingIndicator>
			</div>
		);
	}
}