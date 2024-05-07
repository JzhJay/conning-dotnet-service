import {RSSimulationLockCover} from 'components/system/rsSimulation/RSSimulationApplication';
import {action, computed, observable, reaction, makeObservable, toJS, flow} from 'mobx';
import * as React from 'react';
import {i18n, RSSimulation} from 'stores';
import {RNRecalibration} from 'stores/rsSimulation/rnRecalibration/RNRecalibration';
import {bp, inputSpecification, InputSpecificationComponent, Option, ResizeSensorComponent} from '../../../index';
import {Observer, observer} from "mobx-react";
import ReactPaginate from 'react-paginate';
import * as css from "./ModelSettings.css";
import {findOption, getOption } from '../../IO/internal/inputs/utility';
import { ModelTable } from './ModelTable';
import {ModelChart, ModelChartAdvanceOptions} from './ModelChart';

interface MyProps {
	rnRecalibration: RNRecalibration;
	rsSimulation?: RSSimulation;
}

interface AutoResizingComponentProps extends RNRecalibrationComponentProps {
	name: string;
	dataKey: string;
	onSizeChanged: () => void;
}

export interface RNRecalibrationComponentProps {
	rnRecalibration: RNRecalibration;
}

@observer
export class ModelSettings extends React.Component<MyProps, {}> {
    static TABLE_PRE_PAGE = 20;
    static WAIT_NEXT_SCROLL_MS = 150;

    @observable private pageNo: number = 0;

    @observable private componentHeight: number;
    @observable private componentScrollTop: number;
    private _dispose = [];
    private _scrollTime: number = new Date().getTime();

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
		this._dispose.push(reaction(() => [this.componentHeight, this.componentScrollTop], () => this.updateSticky()));
		this.updateHeight();
	}

    componentWillUnmount(): void {
		this._dispose.forEach(f => f());
	}

	@computed get activePath() {
		return this.props.rsSimulation.stepNavigationController.activeItem.itemPath;
	}

	@computed get activeTreeNodePaths() {
		return this.props.rsSimulation.stepNavigationController.activeItem.executableItems.filter(item => !item.hasItems).map(item => item.itemPath);
	}

	itemDisplayPath(path: string[]): string {
		let node = this.props.rnRecalibration.userInterface.inputOptions.calibrationInputs;
		let displayPath = [];

		for (const p of path.slice(1)) {
			node = node.options.find(o => o.name == p);
			displayPath.push(node.title);
		}
		return displayPath.join("/");
	}
	
	@computed get enablePaginate() {
		const { rnRecalibration: {settings = {}}} = this.props;
		return _.keys(settings).length > ModelSettings.TABLE_PRE_PAGE;
	}

    @computed get reactPaginateProps() {
		const { rnRecalibration: {settings = {}}} = this.props;
		const pageCount = Math.ceil(_.keys(settings).length / ModelSettings.TABLE_PRE_PAGE);

		return {
			pageCount: pageCount,
			forcePage: this.pageNo < pageCount ? this.pageNo : 0,
		}
	}
	
    updateSticky = (waitNextScroll:number = ModelSettings.WAIT_NEXT_SCROLL_MS) => {
		const _modelSetting = this;
		const showAdvancedSettings = _modelSetting.props.rnRecalibration.showAdvancedSettings;
		const enablePaginate = _modelSetting.enablePaginate;
		if (!showAdvancedSettings && !enablePaginate) {
			return;
		}

		const currentTime = new Date().getTime();
		_modelSetting._scrollTime = currentTime;

		const $dom = $(ReactDOM.findDOMNode(this));
		const scrollTop = $dom.scrollTop();

		if (showAdvancedSettings) {
			$dom.find(`.${css.advancedArea}`).css('top', scrollTop).css('overflow-x', 'hidden').scrollTop(scrollTop);
		}

		if (enablePaginate) {
			$dom.find(`.${css.paginateNavbar}`).css('transition',  'none').css('bottom', 0);
		}

		setTimeout(() => {
			if (currentTime != _modelSetting._scrollTime) {
				return;
			}
			showAdvancedSettings && ($dom.find(`.${css.advancedArea}`).css('overflow-x', 'auto'));

			if (enablePaginate) {
				const $paginateNavbar = $dom.find(`.${css.paginateNavbar}`);
				const height = $dom.innerHeight();
				const scrollHeight = $dom.prop("scrollHeight");
				const newBottom = Math.max(0, scrollHeight - (height + scrollTop));
				$paginateNavbar.css('bottom', newBottom-100);
				$paginateNavbar.css('transition', `bottom 150ms`).css('bottom', newBottom)
			}

		}, waitNextScroll);
	}

    @action updateHeight = () => {
		this.componentHeight = $(ReactDOM.findDOMNode(this)).innerHeight();
	}

	@action onScroll = () => {
		this.componentScrollTop = $(ReactDOM.findDOMNode(this)).scrollTop();
	}
	updateUserOptions() {
		// TODO to be implemented
	}

	@flow.bound
	*applyUpdate (path:string[], updateValues: {[key:string]: {}}) {
		let isAxisUpdate = updateValues["axes"] != null;
		yield this.props.rnRecalibration.updateUserInterface(isAxisUpdate ? updateValues : _.set({}, path, updateValues));
	}

	preProcess = (componentPath: string[], option: Option, isMarketDataPart: boolean) => {
		// Add a ModelTable wrapper around expandable input tables
		if (option?.hints?.dimension != null && option.inputType == "expandable" && option.axis) {
			option.customRenderer = (option, data, nodePath, verboseMode) => <ModelTable rnRecalibration={this.props.rnRecalibration} option={option} data={data} path={componentPath.concat(nodePath.split("."))} verboseMode={verboseMode}/>
		}

		if (!isMarketDataPart) {
			// Inline all dropdowns and nodes with a first child that doesn't show its title.
			if ((option.inputType == "exclusive" || (option.options != null && option.options[0]?.hints?.showTitle == false)))
				option.inline = true;

			if (option.hints?.showTitle == false)
				option.indent = false;
		}
		else {
			if (option.inputType == "exclusive") {
				option.renderExclusiveAsRadio = true;
				option.indent = true;
				option.inline = false;
			}
		}
	}

	getValidations(nodePath) {
		const validations = _.flatMap(this.props.rnRecalibration.userInterface.validationMessages, validation => validation.paths.map(path =>({path: path.join("."), errorType: validation.messageType, description: validation.messageText})));
		return _.keyBy(validations, validation => validation.path.replace(nodePath.join(".") + ".", ""));
	}

	renderInputSpecificationComponent(nodePath, part, componentKey, dataKey) {
		const {rsSimulation, rnRecalibration} = this.props;
		const nodeOption = findOption((rnRecalibration.userInterface.inputOptions as any).calibrationInputs, nodePath.slice(1));
		const isMarketDataPart = part == "marketData";
		const marketDataOption = nodeOption.options.find(option => option.name == "marketData");
		const inputOption = isMarketDataPart ? marketDataOption : nodeOption.options.find(option => option.name == part);
		const inputs = _.get(rnRecalibration.userInterface.userInputs, nodePath);
		const name = `${this.itemDisplayPath(nodePath)}/${inputOption.title}`;
		const verboseMode = false;

		const tableOption = marketDataOption.options.find(option => option?.hints?.dimension != null && option.inputType == "expandable" && option.axis);
		const tablePath = [...nodePath, "marketData", tableOption.name];
		const chartPathJoined = tablePath.join(".");

		return <div className={css.mainPanelSettings} key={componentKey}>
			<AutoResizingComponent name={chartPathJoined} dataKey={dataKey} rnRecalibration={rnRecalibration} onSizeChanged={() => this.updateSticky(10)} >
				{inputOption.applicable && <>
					<span className={css.title}>{name}</span>
					<InputSpecificationComponent
						className={css.inputSpecificationComponent}
						showToolbar={false}
						inputs={inputs}
						applyUpdate={(updates) => this.applyUpdate(nodePath, updates)}
						validations={this.getValidations(nodePath)}
						globalLists={null}
						axes={rnRecalibration?.userInterface?.axes}
						showViewTitle={false}
						userOptions={{verboseMode: verboseMode}}
						additionalProps={{rsSimulation}}
						updateUserOptions={this.updateUserOptions}
						allowScrolling={true}
						specification={inputSpecification(name, {options: {[name]: inputOption}}, verboseMode, (option) => this.preProcess(nodePath, option, isMarketDataPart), null)}
					/>
				</>}
			</AutoResizingComponent>
			<AutoResizingComponent name={chartPathJoined} dataKey={"chart" + dataKey} rnRecalibration={rnRecalibration} onSizeChanged={() => this.updateSticky(10)} >
				{inputOption.applicable && <>
					{isMarketDataPart ? <ModelChart rnRecalibration={rnRecalibration} rsSimulation={rsSimulation} path={tablePath}/> :
					 <ModelChartAdvanceOptions rnRecalibration={rnRecalibration} rsSimulation={rsSimulation} path={tablePath} /> }
				</>}
			</AutoResizingComponent>
		</div>
	}

    render() {
		const {enablePaginate, reactPaginateProps, activePath, activeTreeNodePaths}                                                                                        = this;
		const {rsSimulation, rnRecalibration, rnRecalibration: {metadata, settings, userInputs, showAdvancedSettings}} = this.props;

		return <div className={css.scrollContainer} onScroll={this.onScroll}>
			<div className={classNames(css.root, {[css.hideSidebar]: !showAdvancedSettings}, {[css.enablePaginate]: enablePaginate})}>
				<div className={css.mainArea}>
					<div className={css.header}>
						<bp.AnchorButton icon={showAdvancedSettings ? 'double-chevron-right' : 'double-chevron-left'}
						                 minimal style={{ marginRight: 5 }}
						                 onClick={() => rnRecalibration.toggleAdvancedSettings()}/>
					</div>
					{activeTreeNodePaths.map((nodePath, i) => {
						return this.renderInputSpecificationComponent(nodePath,"marketData", `main_${i}`, "marketData.main");
					})}
					{enablePaginate && <>
						<div className={css.paginateSpace}/>
						<div className={css.paginateNavbar}>
							<ReactPaginate
								{...reactPaginateProps}
								onPageChange={({selected}) => {
									const target = $(ReactDOM.findDOMNode(this));
									this.pageNo = selected;
									target.scrollTop(0);
								}}
								breakLabel={<a className="page-link" onClick={(e) => {
									const $node = $(e.target);
									const index = $node.parent().index();
									const activeIndex = $node.parent().parent().find('> .active').index();
									const reactPaginateProps = this.reactPaginateProps;

									if (index < activeIndex) {
										// Go backwards
										this.pageNo = Math.round(reactPaginateProps.forcePage / 2);
									}
									else {
										this.pageNo = Math.round((reactPaginateProps.pageCount + reactPaginateProps.forcePage) / 2);
									}
								}}>...</a>}

								containerClassName={"pagination"}
								breakClassName={"page-item"}
								pageClassName={"page-item"}
								previousClassName={"page-item"}
								nextClassName={"page-item"}
								pageLinkClassName={"page-link"}
								previousLinkClassName={"page-link"}
								nextLinkClassName={"page-link"}
								activeClassName={"active"}
							/>
						</div>
					</>}
				</div>
				{showAdvancedSettings && <div className={css.advancedArea} style={{height:this.componentHeight}}>
					{activeTreeNodePaths.map((nodePath, i) => {
						return this.renderInputSpecificationComponent(nodePath, "optimization", `options_${i}`, "optimzer.options");
					})}
				</div>}
				<ResizeSensorComponent onResize={this.updateHeight} />
			</div>
			{rsSimulation && <RSSimulationLockCover rsSimulation={rsSimulation} />}
		</div>
	}
}

@observer
class AutoResizingComponent extends React.Component<AutoResizingComponentProps, {}> {
    outerRef;
    innerRef;

    constructor(props: AutoResizingComponentProps) {
        super(props);
        makeObservable(this);
    }
    @computed get height_key() { return `${this.props.name}.heights.${this.props.dataKey}`; }
    @computed get showAdvancedSettings() { return this.props.rnRecalibration.showAdvancedSettings; }

	@computed get isChart() { return this.props.dataKey.indexOf('chart') >= 0; }
	@computed get showChart() {
		return _.get(this.props.rnRecalibration.userInterface.userInputs, this.props.name).length > 0 && this.props.rnRecalibration.isChartDisplay(this.props.name);
	}

    @action onResize = () => {
		_.set(this.props.rnRecalibration.webLocalDatasets, this.height_key, $(this.innerRef).height());
		this.props.onSizeChanged();
		// console.log(`${this.height_key}: ${_.get(this.props.recalibration.webLocalDatasets, this.height_key)}`);
	}

    @computed get height() {
		const { name } = this.props;
		const webLocalDatasets = this.props.rnRecalibration.webLocalDatasets as any;
		const part = this.isChart ? "chart" : "marketData"
		let marketDataHeight = _.get<number>(webLocalDatasets, `${name}.heights.${this.isChart ? "chart" : ""}marketData.main`, 0);
		let optimzerHeight = this.showAdvancedSettings ? _.get<number>(webLocalDatasets, `${name}.heights.${this.isChart ? "chart" : ""}optimzer.options`, 0) : 0;

	    if (this.isChart && !this.showChart)
			return 0;

		return Math.max(marketDataHeight, optimzerHeight);
	}

    render() {
		const { name } = this.props;

		return ( 
			<div id={`${name}.${this.props.dataKey}`} key={`${name}.${this.props.dataKey}`} style={{height: this.height}}>
				{(!this.isChart || this.showChart) && <div ref={r => this.innerRef = r}>
					<ResizeSensorComponent onResize={this.onResize} />
					{this.props.children}
				</div>}
			</div>
		);
	}
}