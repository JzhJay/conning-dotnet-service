import {Select} from '@blueprintjs/select';
import {HorizonToolbarItem} from 'components/system/common/HorizonToolbarItem';
import {setLineChartWithHorizonSeriesExtremes} from 'components/system/highcharts/dataTemplates/lineWithHorizonTemplate';
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import type {ChartUserOptions} from 'stores';
import {appIcons, asyncSiteLoading } from 'stores';
import { PdfExporter, ignoreCssInPrintPDF } from 'utility';
import {BookPage} from '../../../../../stores/book/BookPage';
import {BookView} from '../../../../../stores/book/BookView';
import type {
	DistributionsAtHorizonOptions,
	FinancialDamageAndVolatilityShockOptions,
	FinancialDamageAndVolatilityShockOutput
} from '../../../../../stores/climateRiskAnalysis';

import { ClimateRiskAnalysis, climateRiskAnalysisStore } from '../../../../../stores/climateRiskAnalysis';
import {positionToolbarNextToPlaceholder} from "./internal/Helpers";

import { bp, LoadingIndicator, IconButton } from '../../../../index';
import {HighchartsComponent} from '../../../highcharts';
import * as css from './DistributionsAtHorizon.css';
import * as craPageCss from '../../ClimateRiskAnalysisPage.css';
import * as reportCss from '../../../../../utility/pdfExport.css';
import FlipMove from 'react-flip-move';

interface MyProps {
	climateRiskAnalysis: ClimateRiskAnalysis;
	page: BookPage;
	view: BookView;
}

interface ItemDefinition {
	viewType: number;
	chartType: string;
	label: string;
}

@observer
export class FinancialDamageAndVolatilityShock extends React.Component<MyProps, {}> {
	reportContainerRef = React.createRef<HTMLDivElement>();
	pdfExporter = new PdfExporter();

	static VIEW_TYPE = {
		FINANCIAL_DAMAGE : 1,
		VOLATILITY_CHOCK : 2,
		BOTH : 0,
		DEFAULT : 0
	}

	itemsDefinition: ItemDefinition[] = [
		{
			viewType: FinancialDamageAndVolatilityShock.VIEW_TYPE.FINANCIAL_DAMAGE,
			chartType: "financialDamage",
			label: "Financial Damage Function"
		},
		{
			viewType: FinancialDamageAndVolatilityShock.VIEW_TYPE.VOLATILITY_CHOCK,
			chartType: "volatilityShock",
			label: "Volatility Shock"
		},
		{
			viewType: FinancialDamageAndVolatilityShock.VIEW_TYPE.BOTH,
			chartType: "",
			label: "Financial Damage Function and Volatility Shock"
		}
	]

	@observable selectedView: number = null;
	toolbarPlaceholderRef = null;
	chartComponentRef = [];

	constructor(props, state) {
        super(props, state);

        makeObservable(this);

        this.props.climateRiskAnalysis.getFinancialDamageAndVolatilityShock();
    }

	@observable _lastHorizonAry: number[]|null = null;
	_dispose = [];
	componentDidMount() {
		const userOptions = this.props.view.userOptions as FinancialDamageAndVolatilityShockOptions;
		this._lastHorizonAry = _.map(userOptions.views, options => options.horizon);

		this._dispose.push(reaction(() => {
			const {options} = this;
			if (options.length == 1) {
				return options[0].userOptions.horizon;
			} else if (this.selectedView != null) {
				return this.options[this.selectedView].userOptions.horizon
			}
			return null;
		}, (newHorizon) => {
			if (this.viewType != FinancialDamageAndVolatilityShock.VIEW_TYPE.BOTH) {
				this.setHorizon(newHorizon);
			}
		}))

		this._dispose.push(reaction(() => {
			return _.map(userOptions.views, options => options.horizon);
		}, (horizonAry) => {
			setTimeout(() => {
				this._lastHorizonAry = horizonAry;
			}, 1);
		}))
	}
	componentWillUnmount() {
		_.forEach(this._dispose, d => d() )
	}

	@action setHorizon = (newHorizon) => {
		if (!_.isNumber(newHorizon) || !this.syncHorizonEnable) { return; }
		const {page, view} = this.props;
		_.forEach(this.chartComponentRef, (ref) => {
			if (!ref?.chart) {
				return;
			}
			if (ref.chart.xAxis[0].userOptions.connInitialMax != newHorizon){
				setLineChartWithHorizonSeriesExtremes( ref.chart, newHorizon );
			}
		});

		const userOptions = view.userOptions as FinancialDamageAndVolatilityShockOptions;
		_.forEach(userOptions.views, (o: ChartUserOptions) => o.horizon = newHorizon);
		page.updateUserOptions(view.id, view.userOptions);
	}

	@computed get syncHorizonEnable() {
		const horizons = this._lastHorizonAry;
		return horizons?.length && !horizons.some( h => h != horizons[0]);
	}

	exportPDF = asyncSiteLoading(async () => {
		if (this.reportContainerRef.current && this.reportContainerRef.current) {
			const craName = this.props.climateRiskAnalysis.name;
			await this.pdfExporter.print(this.reportContainerRef.current.querySelector(`.${css.views}`), `${craName}-financial-damage-and-violatility-shock`);
		}
	})

	renderToolbar() {
		const {viewType, syncHorizonEnable, data, options, selectedView} = this;
		const usingCommonHorizonCtrl = data && syncHorizonEnable && viewType == FinancialDamageAndVolatilityShock.VIEW_TYPE.BOTH && selectedView == null;

		return <nav className={classNames(bp.Classes.NAVBAR, ignoreCssInPrintPDF.default)}>
			<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)}>
				<Select<{viewType: number, label: string}>
						items={this.itemsDefinition}
					    itemRenderer={(item, itemProps) => {
					    	return <bp.MenuItem
							    key={`fd_vs_select_${item.viewType}`}
							    icon={item.viewType == this.viewType ? 'tick': 'blank'}
							    text={item.label}
							    onClick={itemProps.handleClick} />
					    }}
						onItemSelect={(item) => { this.viewType = item.viewType; } }
						filterable={false}
				>
					<bp.Button text={_.find(this.itemsDefinition, item => item.viewType == this.viewType)?.label} rightIcon="caret-down" />
				</Select>
				{usingCommonHorizonCtrl && <>
					<span className={bp.Classes.NAVBAR_DIVIDER}/>
					<HorizonToolbarItem userOptions = {{horizon: options[0].userOptions.horizon}} numberOfHorizons={data.volatilityFactors.length} setHorizon={this.setHorizon}/>
				</>}
				<div style={{visibility: "hidden", marginBottom: "auto", width: 0}} ref={r => this.toolbarPlaceholderRef = r} />
			</div>
			<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
				<bp.ButtonGroup>
					<bp.Tooltip position={bp.Position.BOTTOM} content="Download PDF">
						<IconButton  icon={appIcons.investmentOptimizationTool.download} onClick={this.exportPDF}/>
					</bp.Tooltip>
				</bp.ButtonGroup>
			</div>
		</nav>
	}

	availableViewType(viewType: number, includeBoth = true): boolean {
		let result = _.some(Object.values(FinancialDamageAndVolatilityShock.VIEW_TYPE), vt => vt === viewType);

		if (result && !includeBoth) {
			result = viewType !== FinancialDamageAndVolatilityShock.VIEW_TYPE.BOTH;
		}

		return result;
	}

	@computed get viewType() {
		const {view, page, climateRiskAnalysis} = this.props;
		const userOptions = this.props.view.userOptions as FinancialDamageAndVolatilityShockOptions;
		const viewType = userOptions?.viewType;

		if (this.availableViewType(viewType)){
			return viewType;
		} else {
			return FinancialDamageAndVolatilityShock.VIEW_TYPE.DEFAULT;
		}
	}

	set viewType (viewType: number) {
		const {view, page, climateRiskAnalysis} = this.props;
		const userOptions = this.props.view.userOptions as FinancialDamageAndVolatilityShockOptions;

		this.selectedView = null;

		if (!this.availableViewType(viewType)){
			viewType = FinancialDamageAndVolatilityShock.VIEW_TYPE.DEFAULT;
		}

		this.computedNavBarDisplay();

		setTimeout(() => page.updateUserOptions(view.id, {...userOptions, viewType}), 1)
	}

	@computed get data(): FinancialDamageAndVolatilityShockOutput {
		const outputs = this.props.climateRiskAnalysis.output?.financialDamageAndVolatilityShock;
		if (!outputs || !outputs.length) {
			return null;
		} else {
			return outputs[outputs.length-1];
		}
	}

	@computed get options(): {userOptions: ChartUserOptions, definition: ItemDefinition}[] {
		const {viewType, props:{page, view}} = this;
		const userOptions = view.userOptions as FinancialDamageAndVolatilityShockOptions;

		let views = [];
		if (viewType === FinancialDamageAndVolatilityShock.VIEW_TYPE.BOTH) {
			views.push(FinancialDamageAndVolatilityShock.VIEW_TYPE.FINANCIAL_DAMAGE);
			views.push(FinancialDamageAndVolatilityShock.VIEW_TYPE.VOLATILITY_CHOCK);
		} else {
			views.push(viewType);
		}

		let updateUserOptions = false;
		const output = [];
		views.map( v => {
			const definition = _.find(this.itemsDefinition, item => item.viewType == v);
			if (!userOptions.views[`${v}`]) {
				updateUserOptions = true;
				const newUserOptions = climateRiskAnalysisStore.charting.defaultUserOptions(definition.chartType);
				userOptions.views[`${v}`] = newUserOptions;
			}
			output.push({
				userOptions: userOptions.views[`${v}`],
				definition: definition
			});
		});

		if (updateUserOptions) {
			setTimeout(() => { this.props.page.updateUserOptions(view.id, userOptions); }, 1)
		}

		return output;
	}

	updateUserOptions = (viewType: number, newUserOptions) => {
		if (!this.availableViewType(viewType, false)) { return; }

		const {page, view} = this.props;
		let userOptions = this.props.view.userOptions as FinancialDamageAndVolatilityShockOptions;
		userOptions.views[`${viewType}`] = newUserOptions;
		page.updateUserOptions(view.id, userOptions);
	}

	selectView = (e, viewIndex) => {
		const boundingBox = e.currentTarget.getBoundingClientRect();

		if (e.clientY > boundingBox.top && !(this.isInMenu(e.target)))
			this.selectedView = this.selectedView == viewIndex ? null : viewIndex;

		this.computedNavBarOpacity();
	}

	isInMenu(element) {
		do {
			if (typeof element?.className === "string" && element.className.includes("bp3-popover"))
				return true;
		} while (element = element.parentNode)
	}

	@action onViewCaptionChange = (val: string) => {
		const { page, view } = this.props;
		const userOptions = page.getViewUserOptions(view.id);
		userOptions.viewCaption = val;
		page.updateUserOptions(view.id, userOptions)
	}

	render() {
		const {data, options} = this;
		const {climateRiskAnalysis, page, view, view: {userOptions}} = this.props;
		const viewIndex = climateRiskAnalysis.getViewSerialNumberByViewType(view.id);

		return <div className={css.root} ref={this.reportContainerRef}>
			{this.renderToolbar()}
			{ page.showViewCaption &&
			<div className={craPageCss.viewCaption}>
				<div className={craPageCss.viewCaptionIndex}>
					{`Figure ${viewIndex} `}
				</div>
				<div className={craPageCss.viewCaptionInput}>
					<bp.EditableText value={userOptions.viewCaption} onChange={this.onViewCaptionChange} multiline={true} />
				</div>
			</div>
			}
			{data ?
			<FlipMove className={`${css.views} ${reportCss.viewMainBlock}`} onFinishAll={this.computedNavBarDisplay}>
				{ _.map(options, (option, i) =>
					<div
						key={`fd_vs_${i}`}
						className={classNames(css.view, {[css.selected]: this.selectedView == i})}
						onClick={(e) => this.selectView(e, i)}
					>
						<HighchartsComponent
							guid={climateRiskAnalysis.id}
							key={option.definition.chartType}
							inlineToolbar={true}
							disableSelections={this.selectedView !== i}
							allowScrollwheelZoom={!page.scrollMode}
							className={css.viewComponent}
							chartType={option.definition.chartType}
							userOptions={option.userOptions}
							onUserOptionsUpdated={userOptions => this.updateUserOptions(option.definition.viewType, userOptions)}
							chartingResult={climateRiskAnalysis}
							ref={ r => r && this.chartComponentRef.push(r) }
							id={view.id}
						/>
					</div>
				)}
			</FlipMove> : <LoadingIndicator active={true}>Loading {climateRiskAnalysisStore.views[view.name].label} Chart...</LoadingIndicator>}
		</div>
	}

	computedNavBarDisplay = () => {
		const userOptions = this.props.view.userOptions as DistributionsAtHorizonOptions;

		// Position selected chart's toolbar
		if (this.viewType != FinancialDamageAndVolatilityShock.VIEW_TYPE.BOTH || this.selectedView != null) {
			let $viewToolbar = $(ReactDOM.findDOMNode(this)).find(`.${css.view}`).eq(userOptions.viewCount == 1 ? 0 : this.selectedView).find(".bp3-navbar");
			positionToolbarNextToPlaceholder($viewToolbar, this.toolbarPlaceholderRef);
		}
	}

	computedNavBarOpacity = () => {
		const thisDOM = $(ReactDOM.findDOMNode(this));
		if(thisDOM.parents('.BookComponent__hover-toolbars').length) {
			const mainBar = thisDOM.children('.bp3-navbar');
			const viewBars = thisDOM.find(`.bp3-navbar`);
			const currentOpacity =  mainBar.css('opacity');
			viewBars.css('transition-delay', '1ms').css('opacity', currentOpacity);
			setTimeout( () => {
				viewBars.css('transition-delay', '').css('opacity', '')
			} , 1);
		}
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any): void {
		this.computedNavBarDisplay();

		$(ReactDOM.findDOMNode(this)).find('.bp3-navbar')
			.not('.set-mouse-event').addClass('set-mouse-event')
			.on('mouseover',(e)=> {
				let selector = this.selectedView == null ? '.bp3-navbar' : `.${css.selected} .bp3-navbar, .${css.root} > .bp3-navbar`;
				$(e.currentTarget)
					.parents('.BookComponent__hover-toolbars').first().find(selector)
					.css('opacity', 1)
					.css('transition-delay', '100ms');
			}).on('mouseleave' , (e)=> {
				$(e.currentTarget)
					.parents('.BookComponent__hover-toolbars').first().find('.bp3-navbar')
					.css('opacity', '')
					.css('transition-delay', '');
			});
	}

	componentWillUpdate(nextProps: Readonly<MyProps>, nextState: Readonly<{}>, nextContext: any) {
		this.chartComponentRef = [];
	}
}