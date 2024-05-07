import {RSSimulationLockCover} from 'components/system/rsSimulation/RSSimulationApplication';
import {AxisOrganizer} from 'components/system/rsSimulation/rwRecalibration/AxisOrganizer';
import {ModelChart, ModelChartAdvanceOptions} from 'components/system/rsSimulation/rwRecalibration/ModelChart';
import {RecalibrationDialogMenuItem} from 'components/system/rsSimulation/rwRecalibration/RWRecalibrationTool';
import {action, computed, observable, reaction, makeObservable} from 'mobx';
import * as React from 'react';
import {RSSimulation, i18n} from 'stores';
import type {IModelDataset} from 'stores/rsSimulation/rwRecalibration/models';
import type {RecalibrationDialogConfig} from 'stores/rsSimulation/rwRecalibration/RWRecalibration';
import {RWRecalibration} from 'stores/rsSimulation/rwRecalibration/RWRecalibration';
import {bp, ResizeSensorComponent} from '../../../index';
import {observer} from "mobx-react";
import ReactPaginate from 'react-paginate';
import * as css from "./ModelSettings.css";
import {ModelTable} from './ModelTable';
import {TableSetting} from './TableSetting';

interface MyProps {
	recalibration: RWRecalibration;
	rsSimulation?: RSSimulation;
}

export interface RecalibrationComponentProps {
	recalibration: RWRecalibration;
	dataset: IModelDataset;
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

    @computed get cogMenu() {
		const { recalibration } = this.props;
		return recalibration?.isLoaded && <bp.Popover className={css.settingMenu}>
			<bp.Button icon="cog" minimal={true} />
			<bp.Menu>
				{_.map<RecalibrationDialogConfig, JSX.Element>([
					{
						title: AxisOrganizer.DIALOG_TITLE,
						icon: AxisOrganizer.DIALOG_ICON,
						onClose: action((r) => {
							r.getRecalibration().then(() => {
								r._lastRequestTreeNode = null;
								r.selectTreeNode(_.first(r.tree.childNodes));
							});

						}),
						component: (r) => <AxisOrganizer recalibration={r} />
					}
					// {
					// 	title: "Optimization Algorithm",
					// 	icon: "property",
					// 	component: (r) => <OptimizationAlgorithm recalibration={r} />
					// }
				], (config, i) => <RecalibrationDialogMenuItem key={`recalibrationSettings${i}`} recalibration={recalibration} {...config} />)}
			</bp.Menu>
		</bp.Popover>
	}

    @computed get enablePaginate() {
		return this.props.recalibration?.datasets?.length > ModelSettings.TABLE_PRE_PAGE;
	}

    @computed get reactPaginateProps() {
		const pageCount = Math.ceil(this.props.recalibration?.datasets?.length / ModelSettings.TABLE_PRE_PAGE);
		return {
			pageCount: pageCount,
			forcePage: this.pageNo < pageCount ? this.pageNo : 0,
		}
	}

    @computed get datasets() {
		const datasets = this.props.recalibration?.datasets;
		if (this.enablePaginate) {
			return _.slice(datasets, this.pageNo * ModelSettings.TABLE_PRE_PAGE, (this.pageNo + 1) * ModelSettings.TABLE_PRE_PAGE);
		} else {
			return datasets;
		}
	}

    updateSticky = (waitNextScroll:number = ModelSettings.WAIT_NEXT_SCROLL_MS) => {
		const _modelSetting = this;
		const showAdvancedSettings = _modelSetting.props.recalibration.showAdvancedSettings;
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

    render() {
		const {enablePaginate, reactPaginateProps, datasets} = this;
		const {rsSimulation, recalibration, recalibration: {showAdvancedSettings, showTree}} = this.props;

		return <div className={css.scrollContainer} onScroll={this.onScroll}>
			<div className={classNames(css.root, {[css.hideSidebar]: !showAdvancedSettings}, {[css.enablePaginate]: enablePaginate})}>
				<div className={css.mainArea}>
					<div className={css.header}>
						{this.cogMenu}
						<bp.AnchorButton icon={showAdvancedSettings ? 'double-chevron-right' : 'double-chevron-left'}
						                 minimal style={{ marginRight: 5 }}
						                 onClick={() => recalibration.toggleAdvancedSettings()}/>
					</div>
					{datasets.map((dataset, i) => {
						return <div className={css.mainPanelSettings} key={`main_${i}`}>
							<AutoResizingComponent dataKey={"table.main"} recalibration={recalibration} dataset={dataset} onSizeChanged={() => this.updateSticky(10)} >
								<ModelTable recalibration={recalibration} dataset={dataset}/>
							</AutoResizingComponent>
							<AutoResizingComponent dataKey={"chart.main"} recalibration={recalibration} dataset={dataset} onSizeChanged={() => this.updateSticky(10)} >
								<ModelChart recalibration={recalibration} dataset={dataset}/>
							</AutoResizingComponent>
						</div>
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

								previousLabel={i18n.common.OBJECT_CTRL.PREVIOUS}
								nextLabel={i18n.common.OBJECT_CTRL.NEXT}
							/>
						</div>
					</>}
				</div>
				{showAdvancedSettings && <div className={css.advancedArea} style={{height:this.componentHeight}}>
					{datasets.map((dataset, i) => {
						return <div className={css.sidebarSettings} key={`options_${i}`}>
							<AutoResizingComponent dataKey={"table.options"} recalibration={recalibration} dataset={dataset} onSizeChanged={() => this.updateSticky(10)} >
								<TableSetting recalibration={recalibration} dataset={dataset}/>
							</AutoResizingComponent>
							<AutoResizingComponent dataKey={"chart.options"} recalibration={recalibration} dataset={dataset} onSizeChanged={() => this.updateSticky(10)} >
								<ModelChartAdvanceOptions recalibration={recalibration} dataset={dataset} />
							</AutoResizingComponent>
						</div>
					})}
				</div>}
				<ResizeSensorComponent onResize={this.updateHeight} />
			</div>
			{rsSimulation && <RSSimulationLockCover rsSimulation={rsSimulation} />}
		</div>
	}
}

interface AutoResizingComponentProps extends RecalibrationComponentProps {
	dataKey: string;
	onSizeChanged: () => void;
}


@observer
class AutoResizingComponent extends React.Component<AutoResizingComponentProps, {}> {
    outerRef;
    innerRef;

    constructor(props: AutoResizingComponentProps) {
        super(props);
        makeObservable(this);
    }

    @computed get tableName() { return this.props.dataset.name; }
    @computed get isTable() { return this.props.dataKey.indexOf('table') >= 0; }
    @computed get isMain() { return  this.props.dataKey.indexOf('main') >= 0; }
    @computed get height_key() { return `${this.tableName}.heights.${this.props.dataKey}`; }
    @computed get showAdvancedSettings() { return this.props.recalibration.showAdvancedSettings; }

    @computed get showChart() {
		return this.props.recalibration.getDataSet(this.tableName)?.table?.length > 0 && this.props.recalibration.isChartDisplay(this.tableName);
	}

    @action onResize = () => {
		_.set(this.props.recalibration.webLocalDatasets, this.height_key, $(this.innerRef).height());
		this.props.onSizeChanged();
		// console.log(`${this.height_key}: ${_.get(this.props.recalibration.webLocalDatasets, this.height_key)}`);
	}

    @computed get height(){
		const webLocalDatasets = this.props.recalibration.webLocalDatasets as any;
		const tableMainHeight = _.get<number>(webLocalDatasets, `${this.tableName}.heights.table.main`, 0);
		const tableOptionsHeight = this.showAdvancedSettings ? _.get<number>(webLocalDatasets, `${this.tableName}.heights.table.options`, 0) : 0;
		const chartMainHeight = this.showChart ? _.get<number>(webLocalDatasets, `${this.tableName}.heights.chart.main`, 0) : 0;
		const chartOptionsHeight = this.showAdvancedSettings && this.showChart ? _.get<number>(webLocalDatasets, `${this.tableName}.heights.chart.options`, 0) : 0;

		if (this.showAdvancedSettings && this.showChart && tableOptionsHeight > tableMainHeight) {
			if (this.isTable) {
				return this.isMain ? tableMainHeight : tableOptionsHeight;
			} else {
				const mainHeight = tableMainHeight + chartMainHeight;
				const optionsHeight = tableOptionsHeight + chartOptionsHeight;
				const maxHeight = Math.max(mainHeight, optionsHeight);
				return maxHeight - (this.isMain ? tableMainHeight : tableOptionsHeight);
			}
		}
		if (this.isTable) {
			return Math.max(tableMainHeight, tableOptionsHeight);
		} else {
			return Math.max(chartMainHeight, chartOptionsHeight);
		}
	}

    render() {
		return <div id={`${this.tableName}.${this.props.dataKey}`} key={`${this.tableName}.${this.props.dataKey}`} style={{height: this.height}}>
			{(this.isTable || this.showChart) && <div ref={r => this.innerRef = r}>
				<ResizeSensorComponent onResize={this.onResize} />
				{this.props.children}
			</div>}
		</div>
	}
}