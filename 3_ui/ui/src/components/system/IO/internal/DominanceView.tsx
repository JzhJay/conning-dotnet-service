import {appIcons, DominanceUserOptions} from 'stores';
import {bp, ResizeSensorComponent, IconButton} from '../../..';
import {Toolbar} from '../../toolbar/Toolbar';
import {CellContentToolbarItem} from '../toolbar/CellContent';
import {CommonDatasetToolbarItem} from '../toolbar/CommonDataset';
import {DatasetToolbarItemBase} from '../toolbar/DatasetToolbarItemBase';
import * as css from './DominanceView.css';
import * as highchartsToolbarCss from './../../highcharts/toolbar/highchartsToolbar.css';
import {HTMLTable, Navbar, Button, Dialog} from '@blueprintjs/core';
import { action, computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react'
import * as React from 'react';
import {EvaluationDifference, IO, IOPage, IOView} from '../../../../stores/io';
import {LoadingIndicator} from '../../../semantic-ui';
import InlineSVG from 'svg-inline-react';
import { getHexColorFrom3ColorGradient, PdfExporter, ignoreCssInPrintPDF } from 'utility';
import { EvaluationComparisonOverlay } from './evaluationComparison/EvaluationComparisonOverlay';
import { ExportPdfProgressDialog } from '../../ExportPdfReport/ExportPdfProgressDialog';

interface MyProps {
	io: IO;
	page: IOPage;
	view: IOView;
	viewLabel: String;
	userOptions: DominanceUserOptions;
	parentContainerClassName? : String;
}

const viewBoxSize = 500;
const isEven = (n) => n % 2 === 0;

@observer
export class DominanceView extends React.Component<MyProps, {}> {
	@observable isOpenIOComparisonView = false;
	@observable.ref compareRow = null;
	@observable.ref compareColumn = null;
	reportRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
	pdfExporter = new PdfExporter();

	constructor(props, state) {
        super(props, state);

        makeObservable(this);

        const {view} = this.props;

        //this.calcExtremes();
        this.props.view.plotExtremes = {marginLeft: 0, marginRight: 180};
    }

	parentContainer = null;
	componentDidMount() {
		this.userOptions = this.props.userOptions;
		this.parentContainer = this.props.parentContainerClassName ? $(`.${this.props.parentContainerClassName}`) : null;
		this.parentContainer && ( this.parentContainer = this.parentContainer.length ? this.parentContainer = this.parentContainer.last() : null );
		this.onResize();
	}

	_toDispose = [];
	minX = Number.MAX_VALUE;
	maxX = Number.MIN_VALUE;
	minY = Number.MAX_VALUE;
	maxY = Number.MIN_VALUE;
	coordinateGradient;

	get isScenarioDominance() {
		return this.props.view.name == "pathWiseDominance";
	}

	scaleFactor(evaluation) {
		return this.isScenarioDominance ? {x: evaluation.pdfXScaleFactor, y: evaluation.pdfYScaleFactor} : {x: evaluation.cdfYScaleFactor, y: evaluation.cdfYScaleFactor};
	}

	polygons(evaluation) {
		return this.isScenarioDominance ? {negativePolygons: [evaluation.pdfNegativePolygon], positivePolygons: [evaluation.pdfPositivePolygon]} :
		                                  {negativePolygons: evaluation.cdfNegativePolygons, positivePolygons: evaluation.cdfPositivePolygons};
	}

	get hoverEvalIndex() {
		return this.props.io.currentPage.canShowHoverPoint ? this.props.io.hoverEvalIndex : null;
	}

	_lastEvaluations;
	calcExtremes() {
		console.time("extreme")
		const {io, io:{frontierPointEvaluations}} = this.props;
		const evaluations = _.flatMap(frontierPointEvaluations, r => frontierPointEvaluations.map(c => this.props.io.evaluationDifferences[io.evaluationDifferencesKey(c.evaluationNumber, r.evaluationNumber)] ));

		if (!_.isEqual(this._lastEvaluations, evaluations)) {
			this.resetExtremes();

			for (let j = 0; j < evaluations.length; j++) {
				let e = evaluations[j];
				if (e != null) {
					const polygons    = this.polygons(e);
					const flatten     = [..._.flatten(polygons.negativePolygons), ..._.flatten(polygons.positivePolygons)];
					const scaleFactor = this.scaleFactor(e);

					// Tight loop
					for (let i = 0; i < flatten.length; i++) {
						let n = flatten[i] as number;
						if (i % 2 == 0) {
							let current = n * scaleFactor.x;
							this.maxX   = Math.max(this.isScenarioDominance ? Math.abs(this.maxX) : this.maxX, current);
							this.minX   = Math.min(this.minX, current);
						} else {
							let current = n * scaleFactor.y;
							this.maxY   = Math.max(this.maxY, current);
							this.minY   = Math.min(this.minY, current);
						}
					}
				}
			}

			this._lastEvaluations = evaluations;
		}
		console.timeEnd("extreme")
	}

	resetExtremes() {
		this.minX = Number.MAX_VALUE;
		this.maxX = Number.MIN_VALUE;
		this.minY = Number.MAX_VALUE;
		this.maxY = Number.MIN_VALUE;
	}

	scalePolygons(difference) {
		const polygons = this.polygons(difference);
		const maxX = this.maxX, minX = this.isScenarioDominance ? -maxX : this.minX;
		const minY = 0 , maxY = this.maxY;
		const rx = (viewBoxSize / ((maxX - minX) || 1));
		const ry = (viewBoxSize / ((maxY - minY) || 1));
		const adjust = (v, i) => Math.ceil(isEven(i)
		                                    ? ((v * this.scaleFactor(difference).x - minX) * rx)
		                                    : viewBoxSize - (v) * ry * this.scaleFactor(difference).y);
		return {
			negativePolygons: polygons.negativePolygons.map((p) => p.map(adjust)),
			positivePolygons: polygons.positivePolygons.map((p) => p.map(adjust)),
		}
	}

	@computed get margins() {
		if (this.zoomToFit) { return {marginRight: 0, marginLeft: 0}; }
		const {plotExtremes} = this.props.page;

		const marginRight = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginRight));
		const marginLeft = Math.max(...Array.from(plotExtremes.values()).map(e => e.marginLeft));

		return {marginRight, marginLeft}
	}

	componentWrapper;
	@observable	scrollWidth;
	onResize = () => {
		if (!this.componentWrapper) {
			const componentRoot = ReactDOM.findDOMNode(this);
			if (!componentRoot) { return; }
			this.componentWrapper = $(componentRoot).find(`.${css.tableWrapper}`)[0];
			if (!this.componentWrapper) { return; }
		}

		if (this.zoomToFit) {
			const {scrollMode} = this.props.page;
			const $componentWrapper = $(this.componentWrapper);
			const $pageContainer = scrollMode ? this.parentContainer : $componentWrapper.parent();

			if ($pageContainer && $pageContainer.length && $pageContainer.width() > $pageContainer.height()) {
				const titleHeight = ($componentWrapper.parent().find(`.${css.title}`).first().outerHeight() || 0);

				let containerHeight  = $pageContainer.innerHeight() - 10 - titleHeight;
				if (!scrollMode) {
					containerHeight -= ($componentWrapper.parent().find(`.bp3-navbar`).first().outerHeight() || 0);
				}

				const $table = $componentWrapper.find('table').first();
				const minHeight = $table.find('tr').length * 20;
				if (containerHeight > minHeight) {
					$table.css({width: `${containerHeight}px`, height: `${containerHeight}px`});
				} else {
					$table.css({width: `${minHeight}px`, height: `${minHeight}px`});
				}
				this.scrollWidth = 0;
				return;
			}
		}

		$(this.componentWrapper).find('table').first().css({width:'', height: ''});
		this.scrollWidth = this.componentWrapper.offsetWidth - this.componentWrapper.clientWidth;
	}

	get headerEvaluations() {
		const {io, userOptions, page} = this.props;
		return io.datasetEvaluations(userOptions).map(e => ({name: e.name, evaluationNumber: e.evaluationNumber})).concat(page.canShowHoverPoint ? {name: "Hover", evaluationNumber: io.hoverEvalIndex } : []);
	}

	fetchMissingHoverEvaluation = _.debounce(async () => {
		const {io} = this.props;
		if (this.hoverEvalIndex != null) {
			await io.loadEvaluation(this.hoverEvalIndex);
			this.forceUpdate();
		}
	}, 1000, { leading: false });

	generateSVG(minuendIndex, subtrahendIndex) {
		const {io} = this.props;
		const evaluationDifference = io.evaluationDifferences[io.evaluationDifferencesKey(minuendIndex, subtrahendIndex)];

		if (evaluationDifference) {
			const scaledPolygons = this.scalePolygons(evaluationDifference);

			return `<svg version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">
				<rect width="100%" height="100%" fill="#F6F5F5" />
				<g>
	                ${scaledPolygons.negativePolygons.map(poly => `<polygon fill="#ff0000" points="${poly.join(' ')}"/>`)}
	                ${scaledPolygons.positivePolygons.map(poly => `<polygon fill="#00ff00" points="${poly.join(' ')}"/>`)}
	            </g>
        	</svg>`
		}
		else {
			return null;
		}
	}

	renderCell(row, column, rowIndex, columnIndex) {
		const {io, userOptions} = this.props;
		const cellHighlight = this.hoverEvalIndex == row.evaluationNumber || this.hoverEvalIndex == column.evaluationNumber;
		const cell = userOptions.showDominanceFractions ? this.renderTextCell(row, column, rowIndex, columnIndex) : this.renderSVGCell(row, column, rowIndex, columnIndex);
		const enabledIOComparision = row.evaluationNumber !== column.evaluationNumber;
		const events = enabledIOComparision ? { onClick: this.openIOComparisonView(row, column) } : {};
		const isSelected = this.compareRow?.evaluationNumber === this.headerEvaluations[rowIndex].evaluationNumber && this.compareColumn?.evaluationNumber === this.headerEvaluations[columnIndex].evaluationNumber;
		const isHeaderLabelCell = rowIndex == columnIndex ;

		if (cell == null && this.hoverEvalIndex != null &&
			!isHeaderLabelCell &&
			column.evaluationNumber != row.evaluationNumber &&
			(row.evaluationNumber == this.hoverEvalIndex || column.evaluationNumber == this.hoverEvalIndex)) {
			this.fetchMissingHoverEvaluation();
		}

		return (
			<td className={classNames({[css.cellHighlight]: cellHighlight, [css.cellClickable]: enabledIOComparision,  [css.selected]: isSelected})} key={columnIndex} style={{padding: `calc(100%/${this.headerEvaluations.length / io.columnPadding} - 2px)`}} {...events}>
				{cell ? cell : isHeaderLabelCell ? <span className={css.headerLabel}>{this.headerEvaluations[rowIndex].name}</span> : ""}
			</td>
		);
	}

	renderSVGCell(row, column, rowIndex, columnIndex) {
		const svg = this.generateSVG(column.evaluationNumber, row.evaluationNumber);
		// Add hover row/column placeholder svgs for preserving hover svg space when there is no hover point
		//if (svg == null && row.evaluationNumber != column.evaluationNumber && (row.evaluationNumber == null || column.evaluationNumber == null))
		//	svg = `<svg version="1.1" preserveAspectRatio="xMidYMid meet" class="empty-hover-svg" viewBox="0 0 500 500"> </svg>`;

		return svg ? <InlineSVG raw={true} src={svg} /> : this.renderTextCell(row, column, rowIndex, columnIndex);
	}

	renderTextCell(row, column, rowIndex, columnIndex) {
		const {io}                 = this.props;
		const evaluationDifference = io.evaluationDifferences[io.evaluationDifferencesKey(column.evaluationNumber, row.evaluationNumber)];
		let content                = null;
		let backgroundColor        = "#FFFFFF";

		if (evaluationDifference) {
			const fraction = this.isScenarioDominance ? evaluationDifference.scenarioDominanceFraction : evaluationDifference.statisticalDominanceFraction;
			content = (fraction * 100).toFixed(1);

			// red, white, light green
			backgroundColor = getHexColorFrom3ColorGradient(fraction, [255, 0, 0], [255, 255, 255], [0, 255, 0]);
		}
		else if (rowIndex == columnIndex) {
			content = this.headerEvaluations[rowIndex].name;
		}

		const svg = `<svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 500 500">
						<rect width="100%" height="100%" fill="${backgroundColor}" />
					    <text font-family="Lucida Grande, LucidaGrande, Lucida Sans Unicode, Arial, Helvetica, sans-serif" font-size="150" dominant-baseline="central" text-anchor="middle" x="250" y="250" fill="black">${content}</text>
					 </svg>`;

		return content && <InlineSVG raw={true} src={svg} />;
	}

	renderLegend() {
		return (
			<div className={classNames(css.legend, {[css.fractionModeLegend]: this.props.userOptions.showDominanceFractions})}>
				<div className={css.legendWrapper}>
					{this.props.userOptions.showDominanceFractions ?
					<>
						<span className={css.legendItem}>
							<span className={css.symbol}>
								<svg width="16" height="100">
									<defs>
										<linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
											<stop offset="0%" style={{stopColor: 'rgb(0,255,0)'}} />
											<stop offset="50%" style={{stopColor: 'rgb(255,255,255)'}} />
											<stop offset="100%" style={{stopColor: 'rgb(255,0,0)'}} />
										</linearGradient>
									</defs>
									<rect width="100%" height="100%" fill="url(#grad1)" />
								</svg>
							</span>
							<div className={css.gradientLabel}>
								<span>100%</span>
								<span>50%</span>
								<span>0%</span>
							</div>
							<span className={css.legendHeading}>Percentage of Column Dominating Row</span>
						</span>
					</> :
					<>
						<span className={css.legendItem}><span className={classNames(css.symbol, css.positiveDominance)}/> <span>Column {'>'} Row</span></span>
						<span className={css.legendItem}><span className={classNames(css.symbol, css.negativeDominance)}/> <span>Row {'>'} Column</span></span>
					</>}
				</div>
			</div>
		);
	}

	@computed get zoomToFit() {
		return this.props.userOptions.zoomToFit;
	}

	@action updateZoomToFit = () => {
		this.updateUserOptions({'zoomToFit' : !this.props.userOptions.zoomToFit});
	}

	@action printPDF = async () => {
		if (this.reportRef.current) {
			const title = this.isScenarioDominance ? 'statistic-dominance' : 'scenario-dominance';
			const { userOptions, io: { name }} = this.props;
			const subTitle = userOptions.showDominanceFractions ? 'Percentage' : 'CDF';
			await this.pdfExporter.print(this.reportRef.current, `${name}-${title}-${subTitle}`, {
				customFonts: ['LucidaGrande'],
				sandboxContainer: this.reportRef.current
			});
		}
	}

	renderToolbar() {
		return <Toolbar className={ignoreCssInPrintPDF.default} right={<IconButton icon={appIcons.investmentOptimizationTool.download} target="download" onClick={this.printPDF}/>}>
			<CommonDatasetToolbarItem userOptions={this.props.userOptions} io={this.props.io} updateUserOptions={this.updateUserOptions} view={this.props.view}> </CommonDatasetToolbarItem>
			<span className={bp.Classes.NAVBAR_DIVIDER}/>
			<CellContentToolbarItem userOptions={this.props.userOptions} updateUserOptions={this.updateUserOptions} view={this.props.view}/>
			<span className={bp.Classes.NAVBAR_DIVIDER}/>
			{( !this.props.page.scrollMode || !!this.parentContainer ) && <bp.Tooltip position={bp.Position.BOTTOM} content="Zoom To Fit">
				<Button icon="zoom-to-fit" active={this.zoomToFit} onClick={this.updateZoomToFit}/>
			</bp.Tooltip>}
		</Toolbar>
	}

	userOptions = {};
	updateUserOptions = (userOptions) => {
		this.props.page.updateUserOptions(this.props.view.id, Object.assign(this.userOptions, userOptions));
	}

	@computed get hasData() {
		const {io} = this.props;
		if (!this.props.userOptions.showEfficientFrontier && !this.props.userOptions.showLambdaPoints && !this.props.userOptions.showAdditionalPoints) {
			return true;
		}
		if (io.updateCount > 0 && io.datasetEvaluations(this.props.userOptions).length > 0) {
			return true;
		}
		return false;
	}

	openIOComparisonView = (row, column) => {
		return () => {
			const { io: { allPointEvaluations }} = this.props;
			this.compareRow = allPointEvaluations.find((point) => point.evaluationNumber === row.evaluationNumber);
			this.compareColumn = allPointEvaluations.find((point) => point.evaluationNumber === column.evaluationNumber);
			this.isOpenIOComparisonView = true;
		};
	}

	closeIOComparisonView = () => {
		this.isOpenIOComparisonView = false;
	}

	render() {
		const { pdfExporter } = this;
		const {view, io, viewLabel, page, userOptions } = this.props;
		const {io: {updateCount}} = this.props; // Trigger mobX update

		console.time("dominanceRender")
		this.calcExtremes();

		let res = <div className={css.root} ref={this.reportRef}>
				<ResizeSensorComponent onResize={this.onResize} />
				{this.renderToolbar()}
				<span className={css.title}>{view.label}</span>
				{this.hasData ? <div className={classNames(css.tableWrapper, {[css.hoverMode]: this.hoverEvalIndex != null})} style={{paddingLeft: this.margins.marginLeft, paddingRight: Math.max((this.margins.marginRight-180-this.scrollWidth)||0, 0)}}>
					<HTMLTable small bordered>
						<tbody>
						{this.headerEvaluations.map((rowEvaluation, rowIndex) => <tr key={rowIndex}>{this.headerEvaluations.map((columnEvaluation, columnIndex) => this.renderCell(rowEvaluation, columnEvaluation, rowIndex, columnIndex) )}</tr>)}
						</tbody>
					</HTMLTable>
					{this.renderLegend()}
				</div> :
				<LoadingIndicator active={true}>
					{"Loading data..."}
				</LoadingIndicator>}
				<EvaluationComparisonOverlay isOpen={this.isOpenIOComparisonView} onClose={this.closeIOComparisonView} io={io} view={view} page={page} evaluation1={this.compareColumn} evaluation2={this.compareRow} userOptions={userOptions} />
				<ExportPdfProgressDialog isOpen={pdfExporter.isPrinting} progress={pdfExporter.progress} title="Exporting chart to PDF ..." />
		</div>
		console.timeEnd("dominanceRender")

		return res;
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, prevContext: any): void {
		if (!_.isEqual(prevProps.userOptions, this.props.userOptions)) {
			this.userOptions = this.props.userOptions;
		}
		this.onResize()
	}
	componentWillUnmount(): void {
		this.props.view.plotExtremes = null;
	}
}
