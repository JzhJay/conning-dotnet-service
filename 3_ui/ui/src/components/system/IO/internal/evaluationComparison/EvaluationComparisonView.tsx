import classNames from 'classnames';
import type {IReactionDisposer} from 'mobx'
import {
    action,
    observable,
    computed,
    when,
    reaction,
    runInAction,
    makeObservable,
} from 'mobx';
import { observer } from 'mobx-react';
import { Button, ButtonGroup, HTMLTable } from '@blueprintjs/core';
import type { EvaluationComparisonUserOptions, EvaluationDetail, EvaluationComparisonResult} from 'stores';
import { appIcons, asyncSiteLoading, ChartAxisMaximumType, IO, IOPage, IOView, defaultTableRowOrders} from 'stores';
import { ResizeSensorComponent, IconButton, LoadingIndicator } from 'components';
import {Toolbar} from '../../../toolbar/Toolbar';
import { EvaluationSelector } from './EvaluationSelector';
import AsssetAllocationChart from './AssetAllocationsChart';
import AsssetAllocationsDiffChart from './AssetAllocationsDiffChart';
import ScenarioDominanceChart from './ScenarioDominanceChart';
import StatisticalDominanceChart from './StatisticalDominanceChart';
import { EvaluationComparisonToolbar } from '../../toolbar/EvaluationComparisonToolbar';
import { CtesToolbarItem } from 'components/system/common/Ctes';
import { PercentilesToolbarItem } from 'components/system/common/Percentiles';
import { bp } from '../../../../index';
import { PdfExporter } from 'utility';

import * as css from './EvaluationComparisonView.css';

interface MyProps {
	className?: String;
	io: IO;
	page: IOPage;
	view: IOView;
	userOptions: EvaluationComparisonUserOptions;
    evaluation1?: EvaluationDetail;
	evaluation2?: EvaluationDetail;
}

@observer
class EvaluationComparisonView extends React.Component<MyProps, {}> {
	@observable.ref allPointEvaluations : EvaluationDetail[] = [];
    @observable.ref evaluation1 : EvaluationDetail;
	@observable.ref evaluation2 : EvaluationDetail;
	@observable.ref evaluationComparisionResult : EvaluationComparisonResult;
	@observable assetClassWidth : number = 0;
	reportRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
	pdfExporter = new PdfExporter();
	_disposers: IReactionDisposer[] = [];

	@computed get hasContent() {
		return this.evaluation1 && this.evaluation2;
	}

    constructor(props) {
        super(props);
        makeObservable(this);
        const { evaluation1, evaluation2, io, userOptions: { rowsOrder }} = this.props;

        this._disposers.push(when(
			() => {
				const { view: { id: viewId }} = this.props;
				return io.currentPage.viewHasData(viewId);
			},
			() => {
				const { userOptions } = this.props;
				runInAction(() => {
					this.allPointEvaluations = io.datasetEvaluations(userOptions);
				});

				if (this.allPointEvaluations.length > 0) {
					const { userOptions: { evaluationComparisonOptions = {}} } = this.props;

					runInAction(() => {
						if (evaluation1 && evaluation2) {
							this.evaluation1 = evaluation1;
							this.evaluation2 = evaluation2;
						} else {
							this.evaluation1 = this.findEvaluation(this.allPointEvaluations, evaluationComparisonOptions.evaluation1);
							this.evaluation2 = this.findEvaluation(this.allPointEvaluations, evaluationComparisonOptions.evaluation2, this.evaluation1.evaluationNumber);
						}
					});
				}
			}
		));

        if (!rowsOrder || !rowsOrder.length) {
			this.updateUserOptions({'rowsOrder': defaultTableRowOrders});
		}
    }

	findEvaluation(allPointEvaluations: EvaluationDetail[], evaluation: { evaluationNumber:number, name?: string }, excludedEvaluationNumber? : number) {
		let matchedEvaluation;
		if (evaluation) {
			const { evaluationNumber, name } = evaluation;

			if (typeof name !== 'undefined') {	// search lambda point
				matchedEvaluation = allPointEvaluations.find(e => e.evaluationNumber === evaluationNumber && e.name === name);
			} else {
				matchedEvaluation = allPointEvaluations.find(e => e.evaluationNumber === evaluation.evaluationNumber);
			}
		}

		return matchedEvaluation || allPointEvaluations.find(e => e.evaluationNumber !== excludedEvaluationNumber);
	}

	@action
	updateUserOptions = async(newUserOptions: EvaluationComparisonUserOptions) => {
		const { view: { id: viewId }, userOptions } = this.props;
		if (Reflect.has(newUserOptions, 'evaluationComparisonOptions')) {
			userOptions.evaluationComparisonOptions = Object.assign(userOptions.evaluationComparisonOptions || {}, newUserOptions.evaluationComparisonOptions);
		} else {
			Object.assign(userOptions, newUserOptions);
		}

		await this.props.io.currentPage.asyncUpdateUserOptions(viewId, userOptions);
		if (Reflect.has(userOptions, 'showAdditionalPoints') || Reflect.has(userOptions, 'showEfficientFrontier') || Reflect.has(userOptions, 'showLambdaPoints')) {
			this.onTogglingPointTypes();
		}
	}

	isEvaluationsDiff(evaluation: EvaluationDetail, originEvaluation: any) {
		if (!originEvaluation) {
			return true;
		}

		return evaluation.evaluationNumber !== originEvaluation.evaluationNumber || (typeof originEvaluation.name !== 'undefined' && evaluation.name !== originEvaluation.name);
	}

	trackComparedEvaluations() {
		const { io, userOptions: { showLambdaPoints, evaluationComparisonOptions = {}} } = this.props;
		const { evaluation1, evaluation2 } = evaluationComparisonOptions;

		if(this.isEvaluationsDiff(this.evaluation1, evaluation1) || this.isEvaluationsDiff(this.evaluation2, evaluation2)) {
			const trackEvaluation1: { evaluationNumber: number, name?: string } = { evaluationNumber: this.evaluation1.evaluationNumber };
			if (showLambdaPoints && !io.additionalPoints.some((point) => point.evaluationIndex === this.evaluation1.evaluationNumber)) {
				trackEvaluation1.name = this.evaluation1.name;
			}

			const trackEvaluation2: { evaluationNumber: number, name?: string } = { evaluationNumber: this.evaluation2.evaluationNumber };
			if (showLambdaPoints && !io.additionalPoints.some((point) => point.evaluationIndex === this.evaluation2.evaluationNumber)) {
				trackEvaluation2.name = this.evaluation2.name;
			}

			this.updateUserOptions({
				evaluationComparisonOptions: {
					evaluation1: trackEvaluation1,
					evaluation2: trackEvaluation2
				}
			});
		}
	}

    renderToolbar() {
		const { hasContent, allPointEvaluations } = this;
		const { io, userOptions, userOptions: { shouldInheritData, showPercentiles, showCtes } } = this.props;

		return (
			<Toolbar className="toolbar" right={hasContent && <IconButton icon={appIcons.investmentOptimizationTool.download} target="download" onClick={this.printPDF}/>}>
				<EvaluationComparisonToolbar io={io} userOptions={userOptions} onUpdateUserOptions={this.updateUserOptions} />
				{ hasContent &&
				<div className={css.quickSwitchTools}>
					<EvaluationSelector io={io} userOptions={userOptions} allEvaluations={allPointEvaluations} evaluation={this.evaluation1} circleClassName={css.primaryPoint} onChange={this.onEvaluation1Change} />
					<ButtonGroup minimal={true} className={css.evaluationSwitchButtonGroup}>
						<Button minimal={true} icon="arrow-left" onClick={this.copyRightToLeft} />
						<Button minimal={true} icon="arrows-horizontal" onClick={this.switchEvaluations} />
						<Button minimal={true} icon="arrow-right" onClick={this.copyLeftToRight} />
					</ButtonGroup>
					<EvaluationSelector io={io} userOptions={userOptions} allEvaluations={allPointEvaluations} evaluation={this.evaluation2} circleClassName={css.secondaryPoint} onChange={this.onEvaluation2Change} />
				</div>
				}
				{!shouldInheritData && showPercentiles && <><span className={bp.Classes.NAVBAR_DIVIDER}/><PercentilesToolbarItem userOptions={userOptions} updatePercentiles={() => this.props.io.updatePercentiles()} updateUserOptions={this.updateUserOptions} /></>}
				{!shouldInheritData && showCtes && <><span className={bp.Classes.NAVBAR_DIVIDER}/><CtesToolbarItem userOptions={userOptions} updateCtes={() => this.props.io.updateCtes()} updateUserOptions={this.updateUserOptions} /></>
				}
			</Toolbar>
		);
    }

    getAssetClassRows() {
		const { evaluation1, evaluation2 } = this;
        const { assetAllocation: allocations1 } = evaluation1;
		const { assetAllocation: allocations2 } = evaluation2;
		const assets = this.props.io.getAssetClassInputWithoutGroups();
		const dataRows = [];

		allocations1.forEach((allocation, i) => {
			const asset = assets[i];
			const assetName = asset.name;

			dataRows.push({
				name: assetName,
				cells: [allocation, allocations2[i]],
				isPercentile: true,
				assetColor: asset.color
			})
		})

		return dataRows;
    }

	getRowsData() {
		const { evaluation1, evaluation2 } = this;
		const { io, userOptions } = this.props;
		const evaluations = [evaluation1, evaluation2];
		const { shouldInheritData } = userOptions;
		let rowsOrder = userOptions.rowsOrder;
		if (shouldInheritData) {
			rowsOrder = defaultTableRowOrders;
		}

		return rowsOrder.filter(field => userOptions[field]).reduce((rowsData, field)=> {
			const rowData = [];
			switch(field) {
				case 'showAssetClass':
					rowData.push(...this.getAssetClassRows());
					break;
				case 'showDuration':
					rowData.push({
						name: 'Duration',
						cells: evaluations.map((e)=> io.computeDuration(e))
					});
					break;
				case 'showTotal':
					rowData.push({
						name: 'Total',	// not able to process asset classes group currently
						cells: evaluations.map((e)=> e.assetAllocation ? _.sum(io.allocationsAtLevel(userOptions.enabledAssetGroupLevels?.indexOf(true) || 0, e.assetAllocation, false)) : 0),
						isPercentile: true
					});
					break;
				case 'showMetrics':
					// risk
					rowData.push({
						name: 'Risk',
						cells: evaluations.map((e)=> e.risk)
					});
					// reward
					rowData.push({
						name: 'Reward',
						cells: evaluations.map((e)=> e.reward)
					});
					break;

				case 'showMean':
					rowData.push({
						name: 'Mean',
						cells: evaluations.map((e, i) => e.mean)
					});
					break;
				case 'showMin':
					rowData.push({
						name: 'Minimum',
						cells: evaluations.map((e) => e.min)
					});
					break;
				case 'showMax':
					rowData.push({
						name: 'Maximum',
						cells: evaluations.map((e, i) => e.max)
					});
					break;
				case 'showPercentiles':
					let percentiles = userOptions.percentiles.filter(p => typeof p == 'number' && !Number.isNaN(p)) || [0, 1, 5, 25, 50];
					percentiles.forEach(p => {
						rowData.push({
							name: `${p}%`,
							cells: evaluations.map((e) => e.percentiles[io.outputControls.percentiles.indexOf(p)])
						});
					});
					break;
				case 'showCtes':
					let ctes = userOptions?.ctes || [{area: "under", percentile: 1}, {area: "under", percentile: 5}];
					if (!ctes || !ctes.length) {
						break;
					}

					ctes.forEach( c => {
						rowData.push({
							name: `${_.upperFirst(c.area)} ${c.percentile}%`,
							cells: evaluations.map((e, i) => e.ctes[io.outputControls.ctes.findIndex(oc => oc.area == c.area && oc.percentile == c.percentile)])
						});
					});
					break;
				case 'showStandardDeviation':
					rowData.push({
						name: 'Deviation',
						cells: evaluations.map((e) => e.standardDeviation)
					});
					break;
				default:
			}

			rowsData.push(rowData);

			return rowsData;
		}, []);
	}

	renderRows() {
		const io = this.props.io;
		const rowsData = this.getRowsData();
		const lastIndex = rowsData.length - 1;
		return rowsData.map((rows, i)=> {
			return (
				<React.Fragment key={`row_${i}`}>
					{ rows.map(({ name, cells, isPercentile, assetColor }, j) => {
						if (assetColor) {
							return (
								<tr className={css.assetClass} key={name}>
									<th className={css.firstCell}><span className={css.symbol} style={{backgroundColor: assetColor}} />{name}</th>
									{cells.map((value, k)=> (
										<td className={css.cellContent} key={`${name}_cells_${k}`}>
											{io.formatNumberByAllocationIncrement(value, isPercentile)}
										</td>
									))}
									<td className={`${css.cellContent} ${css.lastCell}`}>
										{io.formatNumberByAllocationIncrement(cells[0] - cells[1], isPercentile)}
									</td>
								</tr>
							);
						}

						return (
							<tr key={`row_${name}_${j}`} className={css.assetClass}>
								<th className={css.firstCell}>{name}</th>
								{cells.map((value, k)=> {
									return (
										<td className={css.cellContent} key={`${name}_cells_${k}`}>
											{io.formatNumberByAllocationIncrement(value, isPercentile)}
										</td>
									);
								})}
								<td className={`${css.cellContent} ${css.lastCell}`}>
									{io.formatNumberByAllocationIncrement(cells[0] - cells[1], isPercentile)}
								</td>
							</tr>
						);
					})}
					{ i !== lastIndex && <tr><td colSpan={4} className={css.emptyRow} /></tr> }
				</React.Fragment>
			);
		})
	}

	@action
    onResize = () => {
		const node = ReactDOM.findDOMNode(this);
		this.assetClassWidth = $(node).find(`.${css.assetHeader}`).get(0)?.offsetWidth;
    }

	@action
	copyRightToLeft = () => {
		this.evaluation1 = this.evaluation2;
	}

	@action
	switchEvaluations = () => {
		const temp = this.evaluation2;
		this.evaluation2 = this.evaluation1;
		this.evaluation1 = temp;
	}

	@action
	copyLeftToRight = () => {
		this.evaluation2 = this.evaluation1;
	}

	@action
	onEvaluation1Change = (evalution: EvaluationDetail) => {
		this.evaluation1 = evalution;
	}

	@action
	onEvaluation2Change = (evalution: EvaluationDetail) => {
		this.evaluation2 = evalution;
	}

	getAdditionalPointName(evalution: EvaluationDetail) {
		const { io } = this.props;
        const { evaluationNumber } = evalution;
        const additionalPoint = this.allPointEvaluations.find((point) => point.evaluationNumber === evaluationNumber);

		return additionalPoint?.displayName || '';
	}

	renderTable() {
		const { evaluation1, evaluation2 } = this;
		const point1Title = this.getAdditionalPointName(evaluation1);
		const point2Title = this.getAdditionalPointName(evaluation2);

		return (
			<HTMLTable small >
				<thead>
					<tr>
						<th className={`${css.assetHeader} ${css.firstCell}`} style={{width: this.assetClassWidth || '1%'}}/>
						<th>
							{ point1Title && <div className={css.pointName}>{point1Title}</div> }
							<div className={`${css.pointNumber} ${css.primaryPoint}`}>
								{ this.evaluation1.name }
							</div>
						</th>
						<th>
							{ point2Title && <div className={css.pointName}>{point2Title}</div> }
							<div className={`${css.pointNumber} ${css.secondaryPoint}`}>
								{ this.evaluation2.name }
							</div>
						</th>
						<th className={`${css.diffHeaderTh} ${css.lastCell}`}>
							<div>{`${evaluation1.name} - ${evaluation2.name}`}</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{ this.renderRows() }
				</tbody>
			</HTMLTable>
		);
	}

	@action
	onTogglingPointTypes = () => {
		this.allPointEvaluations = this.props.io.datasetEvaluations(this.props.userOptions);
		const { evaluation1, evaluation2 } = this;

		const newEvaluation1 = this.findEvaluation(this.allPointEvaluations, { evaluationNumber: evaluation1.evaluationNumber, name: evaluation1.name });
		if (this.isEvaluationsDiff(newEvaluation1, this.evaluation1)) {
			this.evaluation1 = newEvaluation1;
		}

		const newEvaluation2 = this.findEvaluation(this.allPointEvaluations, { evaluationNumber: evaluation2.evaluationNumber, name: evaluation2.name }, this.evaluation1.evaluationNumber);
		if (this.isEvaluationsDiff(newEvaluation2, this.evaluation2)) {
			this.evaluation2 = newEvaluation2;
		}
	}

	componentDidMount() {
		this._disposers.push(reaction(
			() => {
				return [this.evaluation1, this.evaluation2];
			},
			() => {
				if (!this.hasContent) {
					return;
				}

				runInAction(async () => {
					const result = await this.props.io.getCompareEvalutionsResult(this.evaluation1.evaluationNumber, this.evaluation2.evaluationNumber);
					action( () => this.evaluationComparisionResult = result)();
					this.trackComparedEvaluations();
				});
			}, {
				fireImmediately: true,
				delay: 100	// for switch evaluations
			}
		));
	}

	printPDF = asyncSiteLoading(async () => {
		if (this.reportRef.current) {
			const { className, io: { name }} = this.props;
			await this.pdfExporter.print(this.reportRef.current, `${name}-evaluation-comparison-view`, { customFonts: ['LucidaGrande'] });
		}
	})

	componentWillUnmount() {
		this._disposers.forEach(f => f());
	}

    render() {
		const { view, className = '', io, userOptions } = this.props;
		const { label: title = '' } = view;
        const { evaluation1, evaluation2, evaluationComparisionResult, hasContent } = this;
        const { evaluationComparisonOptions = {} } = userOptions;
		const {
			showTabular = true,
			showAllocationChart = true,
			showAllocationDiffChart = true,
			showScenarioDominance = true,
			showStatisticDominance = true,
			allocationChartAxisMaximum = ChartAxisMaximumType.Dynamic,
			allocationDiffChartAxisMaximum = ChartAxisMaximumType.Dynamic
		} = evaluationComparisonOptions;

        return (
            <div className={`${css.root} ${className}`}>
				{this.renderToolbar()}
                <ResizeSensorComponent onResize={this.onResize} />
				<div className={css.main} ref={this.reportRef}>
					{ title && <div className={css.title}>{title}</div> }
					<div className={classNames(css.content, { [css.hide]: !hasContent })}>
						{ hasContent && showTabular &&
						 <div className={`${css.flexItem} ${css.assetClassTable}`}>
							{ this.renderTable() }
						 </div> }
						<div className={css.chartsContainer}>
							<div className={css.dominanceChartsContainer}>
								{showScenarioDominance &&
								<div className={css.flexItem}>
									<ScenarioDominanceChart className={css.scenarioDominanceChart} evaluation1={evaluation1} evaluation2={evaluation2} comparisonResult={evaluationComparisionResult} />
								</div> }
								{showStatisticDominance &&
								<div className={css.flexItem}>
									<StatisticalDominanceChart className={css.statisticalDominanceChart} evaluation1={evaluation1} evaluation2={evaluation2} comparisonResult={evaluationComparisionResult} />
								</div> }
							</div>
							<div className={css.allocationChartsContainer}>
								{ showAllocationChart &&
								<AsssetAllocationChart className={classNames(css.flexItem, css.assetAllocationChart)} io={io} evaluation1={evaluation1} evaluation2={evaluation2} chartAxisMaximum={allocationChartAxisMaximum} /> }
								{ showAllocationDiffChart &&
								<AsssetAllocationsDiffChart className={classNames(css.flexItem, css.assetDiffChart)} io={io} evaluation1={evaluation1} evaluation2={evaluation2} chartAxisMaximum={allocationDiffChartAxisMaximum} /> }
							</div>
						</div>
					</div>
					<LoadingIndicator active={!hasContent}>
						{"Loading data..."}
					</LoadingIndicator>
				</div>
            </div>
        );
    }
}

export default EvaluationComparisonView;