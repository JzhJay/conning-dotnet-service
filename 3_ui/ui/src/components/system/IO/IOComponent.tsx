import {ApplicationFailed} from 'components/site/ApplicationFailed';
import {AssetClassesReturnsTableView} from 'components/system/IO/internal/AssetClassesReturnsTableView';
import {formatLabelText} from 'utility';
import {BookValidationSidebar} from '../ValidationSidebar/ValidationSidebar';
import {observable, makeObservable, runInAction, action} from 'mobx';
import * as React from 'react';
import {Book} from '../../../stores/book/Book';
import {site} from '../../../stores/site';
import {BookComponent} from '../Book/BookComponent';
import {HighchartsComponent} from '../highcharts';
import {Progress} from '../Progress/Progress';
import {DominanceView} from './internal/DominanceView';
import EvaluationComparisonView from './internal/evaluationComparison/EvaluationComparisonView';
import {AssetClassInput} from './internal/inputs/AssetClass/AssetClassInput';
import {IOInputSpecificationComponent} from './internal/inputs/IOInputSpecificationComponent';
import {IOTemplate} from './internal/IOTemplate';
import {IOViewContextMenu} from './internal/IOViewContextMenu';
import {StrategySummaryView} from './internal/StrategySummaryView';
import {DirectionalConstraintView} from './internal/DirectionalConstraintView';
import * as css from './IOComponent.css'
import {observer} from 'mobx-react'
import {IO, ioStore, IOView, IOPage, IOStatus} from '../../../stores/io';
import {bp, LoadingIndicator, LoadingIndicatorWithStatus, LockCover} from "components";
import {mobx, utility} from '../../../stores';
import { ExpireDialogComponent } from '../ExpireDialog/ExpireDialog';


interface MyProps {
	investmentOptimization: IO
}

@observer
export class IOComponent extends React.Component<MyProps, {}> {
    _toDispose = [];

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
		if (this.viewsRef) {
			this.viewsNode = ReactDOM.findDOMNode(this.viewsRef) as HTMLElement;
		}

		console.log("LoadIO");
		this.props.investmentOptimization.loadExistingIO();

		this._toDispose.push(mobx.autorun(() => {
			if (this.props.investmentOptimization.userInputLastSavedTime) {
				runInAction(() => {
					site.activeTool.renderFooter = () => {
						return <span>{this.props.investmentOptimization.userInputSavedStatus}</span>;
					}
				});
			}

			// site.toaster.show({ intent: bp.Intent.SUCCESS, message: `UserInput at time ${this.props.investmentOptimization.userInputLastSavedTime.toString()} saved to S3`});
		}));

		// Force toolbar to appear when bp3-popover is shown
		const toolbarSubMenuOpen = ( isOpened : boolean) => {
			let $target;
			if (isOpened) {
				$target = $('.bp3-popover-target.bp3-popover-open').parents(`.${css.hoverToolbars}`);
			} else {
				$target = $(`.${css.popoverOpened}`).filter((idx, elem) => $(elem).find('.bp3-popover-open').length == 0 );
			}
			if ($target.length) {
				$target.toggleClass(css.popoverOpened , isOpened );
			}
		};

		// Observe document.body create bp3-popover
		const observer = new MutationObserver(items => {
			items.filter( (item) => item.addedNodes && item.addedNodes.length && $(item.addedNodes[0]).is('.bp3-portal') ).forEach( (item) => {
				const target = $(item.addedNodes[0]).children('.bp3-overlay')[0];
				if (target) {
					// Observe bp3-popover showing / hiding on the screen
					const observer_popover = new MutationObserver(function (pops) {
						const isOpened = $(pops[0].target).is('.bp3-overlay-open');
						toolbarSubMenuOpen(isOpened);
					});
					this._toDispose.push(() => observer_popover.disconnect());
					observer_popover.observe(target, {attributes: true, childList: false, characterData: false});
					toolbarSubMenuOpen(true);
				}
			});
		});
		observer.observe(document.body, {attributes: false, childList: true, characterData: false});
		this._toDispose.push(() => observer.disconnect());
	}


    viewsRef = null;
    viewsNode = null;

    renderPage = null;
    @observable pageAnimationInProgress = null;

    render() {
		const {investmentOptimization, investmentOptimization:{viewAnimationInProgress, isLoading}} = this.props;
		const {views} = ioStore;
		const IO_title = utility.formatLabelText(IO.ObjectType);

		return  investmentOptimization.isLoadFailed ? <ApplicationFailed failureMessage={`Loading ${IO_title} Session Failed`} reloadBtnClick={() => investmentOptimization.loadExistingIO()} /> :
		investmentOptimization.isLoaded && !investmentOptimization.isDuplicating ? <>
			<BookComponent
				book={investmentOptimization.book}
				viewClasses={(page,view) => ""}
				renderValidations={() => <BookValidationSidebar
					key="validationSidebar"
					method={investmentOptimization}
					store={ioStore}
					onClose={() => investmentOptimization.showValidationSetting = false}
					display={investmentOptimization.showValidation}
					displayWhenNoMessage={true}
                />}
				renderProgress={(page: IOPage) => (page.isMonitorPage && investmentOptimization.isPreOptimizing || page.showPreOptimizationStatus) && <Progress title={"Preparing To Optimize"} progressMessages={investmentOptimization.statusMessages}/>}
				renderTemplate={() => <IOTemplate io={investmentOptimization}/>}
				renderView={(page, view, delayRender) => <IOComponentView ioComponent={this} book={investmentOptimization.book} page={page as IOPage} view={view as IOView} shouldDelayRender={delayRender}/> }
			/>
			<ExpireDialogComponent app={investmentOptimization} />
		</> : investmentOptimization.isDuplicating ?
		      <LoadingIndicator active={true}>Duplicating {IO_title}</LoadingIndicator> :
		      <LoadingIndicatorWithStatus model={investmentOptimization} titlePredicate={(model ) => model.isReady ? `Initializing ${IO_title}` : `Starting ${IO_title} Process`} />

	}

    onContextMenu = (e: React.MouseEvent<HTMLElement>, evaluationIndex, viewID) => {
		if (evaluationIndex != null) {
			bp.ContextMenu.show(<IOViewContextMenu io={this.props.investmentOptimization} evaluationIndex={evaluationIndex} viewID={viewID}/>, {left: e.clientX + 10, top: e.clientY - 8});

			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}

    componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, prevContext: any): void {
		this.renderPage = this.props.investmentOptimization.book.currentPageNumber;
	}

    componentWillUnmount() {
		this.props.investmentOptimization.cleanup();
		this._toDispose.forEach(f => f());
	}
}

@observer
export class IOComponentView extends React.Component<{ioComponent: IOComponent, book: Book, page: IOPage, view: IOView, shouldDelayRender: boolean}, {}> {
	renderView(view: IOView) {
		const {investmentOptimization: io} = this.props.ioComponent.props;
		const {page} = this.props;
		let viewComponent = null;
		const pendingChanges = (io.requiredOptimization == "full" || io.requiredOptimization == "partial") && !KARMA;
		let needsOutput = (io.status == IOStatus.waiting || pendingChanges) && !ioStore.views[view.name].isInput;

		if (!needsOutput && (view.name == "assetClassesReturnsChart" || view.name == "assetClassesReturnsTable")) {
			needsOutput = io.returnOutputs == null || Object.keys(io.returnOutputs).length == 0;
		}

		switch (view.name) {
			case "efficientFrontier":
			case "ioBox":
			case "status":
			case "assetAllocation":
			case "assetClassesReturnsChart":
				viewComponent = <HighchartsComponent
					guid={io.id}
					key={view.name}
					onContextMenu={this.props.ioComponent.onContextMenu}
					inlineToolbar={page.selectedViews.length > 1 || page.showViewToolbars !== false}
					allowScrollwheelZoom={!page.scrollMode}
					className={BookComponent.css.viewComponent}
					chartType={view.name}
					userOptions={page.getViewUserOptions(view.id)}
					onUserOptionsUpdated={userOptions => page.updateUserOptions(view.id, userOptions)}
					chartingResult={io}
					page={page}
					id={view.id}
				/>;

				break;
			case "pathWiseDominance":
			case "statisticalDominance":
				viewComponent = <DominanceView io={io} view={view} page={page} viewLabel={view.label} userOptions={page.getViewUserOptions(view.id)} parentContainerClassName={BookComponent.css.views}/>
				break;
			case "evaluationComparison":
				viewComponent = <EvaluationComparisonView io={io} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>
				break;
			case "strategySummary":
				viewComponent = <StrategySummaryView io={io} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>
				break;
			case "assetClasses":
				viewComponent = <AssetClassInput io={io} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>
				break;
			case "directionalConstraint":
				viewComponent = <DirectionalConstraintView io={io} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>
				break;
			case "assetClassesReturnsTable":
				viewComponent = <AssetClassesReturnsTableView io={io} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>
				break;
			case "surplusManagement":
			case "optimizationTarget":
			case "dataSources":
			case "optimizationControls":
			case "optimizationConstraints":
			case "optimizationResources":
			case "efficientFrontierSampling":
			case "nonAssetFlowsAndValues":
			case "interestRates":
			case "assetValuesAndTrading":
			case "taxes":
			case "riskBasedCapital":
			case "interestMaintenanceReserve":
			case "accounting":
				let userOptions = page.getViewUserOptions(view.id);
				viewComponent = <IOInputSpecificationComponent io={io} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>
				break;
			default:
				viewComponent = <span>{view.label}</span>
		}

		return needsOutput ? <div className={css.noData}>
			<span>{view.label}</span>
			<span>{pendingChanges ? "(Updates need to be applied or run)" : "(No data available)"}</span>
		</div> : !page.viewHasData(view.id) || this.props.shouldDelayRender ? <LoadingIndicator active={true}>
			Loading {view.label}
		</LoadingIndicator> : viewComponent;
	}

	render() {
		const {page} = this.props;
		const {view, ioComponent, ioComponent: {props: {investmentOptimization: io}}} = this.props;
		const ioViewTemplate = ioStore.views[view.name];
		const isRunning = io.status == IOStatus.running;

		return <>
			{page.getView(view.id) && this.renderView(view)}
			<LockCover
				isLocked={io.silentLock || (ioViewTemplate.isInput && (isRunning || io.inputsLocked))} isSilentLock={io.silentLock}
				tooltipContent={isRunning ? "Input locked while optimizing." : `The ${formatLabelText(IO.ObjectType).toLowerCase()} inputs have been locked. Please unlock to edit.`}

				objectType={IO.ObjectType}
				canUnlock={!isRunning}
				unlockInputs={io.unlockInputs}
			/>
		</>
	}
}
