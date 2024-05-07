import {AssetClassInput} from 'components/system/ClimateRiskAnalysis/internal/inputs/AssetClassInput';
import {DescriptionInput} from 'components/system/ClimateRiskAnalysis/internal/inputs/DescriptionInput';
import {RiskDefinitionsInput} from 'components/system/ClimateRiskAnalysis/internal/inputs/RiskDefinitionsInput';
import {SimulationInput} from 'components/system/ClimateRiskAnalysis/internal/inputs/SimulationInput';
import {FinancialDamageAndVolatilityShock} from 'components/system/ClimateRiskAnalysis/internal/outputs/FinancialDamageAndVolatilityShock';
import {Progress} from 'components/system/Progress/Progress';
import {formatLabelText} from 'utility';
import {BookValidationSidebar} from '../ValidationSidebar/ValidationSidebar';
import {observable, makeObservable, action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {ClimateRiskAnalysis, ClimateRiskAnalysisStatus, climateRiskAnalysisStore} from '../../../stores';
import {Book} from '../../../stores/book/Book';
import {BookPage} from '../../../stores/book/BookPage';
import {BookView} from '../../../stores/book/BookView';
import {HighchartsComponent, LoadingIndicatorWithStatus, LockCover} from '../../index';
import {LoadingIndicator} from '../../semantic-ui';
import {ApplicationFailed} from '../../site/ApplicationFailed';
import {BookComponent} from '../Book/BookComponent';
import {ExpireDialogComponent} from '../ExpireDialog/ExpireDialog';
import * as css from './ClimateRiskAnalysisComponent.css';
import {DistributionsAtHorizon} from './internal/outputs/DistributionsAtHorizon';
import {MarketValueStatistics} from './internal/outputs/MarketValueStatistics';

interface MyProps {
	climateRiskAnalysis: ClimateRiskAnalysis
}

@observer
export class ClimateRiskAnalysisComponent extends React.Component<MyProps, {}> {
    _toDispose = [];

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
		this.props.climateRiskAnalysis.loadExistingClimateRiskAnalysis();
	}

    viewsRef = null;
    viewsNode = null;
    firstPageRender = true;

    renderPage = null;
    @observable pageAnimationInProgress = null;

    render() {
		const {climateRiskAnalysis} = this.props;

		return  climateRiskAnalysis.isLoadFailed ? <ApplicationFailed failureMessage={"Loading Climate Risk Analysis Session Failed"} reloadBtnClick={() => climateRiskAnalysis.loadExistingClimateRiskAnalysis()} /> :
		        climateRiskAnalysis.isLoaded && !climateRiskAnalysis.isDuplicating ? <>
		            <BookComponent
			            book={climateRiskAnalysis.book}
			            viewClasses={(page,view) => classNames({[css.disableInput]: climateRiskAnalysisStore.views[view.name].isInput && (climateRiskAnalysis.status == ClimateRiskAnalysisStatus.running) || climateRiskAnalysis.silentLock})}
			            renderValidations={() => <BookValidationSidebar method={climateRiskAnalysis} store={climateRiskAnalysisStore} canClose={false} />}
			            renderProgress={(page) => climateRiskAnalysis.isRunning() && climateRiskAnalysis.statusMessages && <Progress title={""} progressMessages={climateRiskAnalysis.statusMessages}/>}
		                renderView={(page, view, delayRender) => <ClimateRiskAnalysisComponentView modelComponent={this} book={climateRiskAnalysis.book} page={page} view={view} shouldDelayRender={delayRender}/> }
		            />
			        <ExpireDialogComponent app={climateRiskAnalysis} />
		        </> : climateRiskAnalysis.isDuplicating ? <LoadingIndicator active={true}>Duplicating Climate Risk Analysis</LoadingIndicator> :
		              <LoadingIndicatorWithStatus model={climateRiskAnalysis} titlePredicate={(model ) => model.isReady ? `Initializing Climate Risk Analysis` : `Starting Climate Risk Analysis Process`} />

	}

    onContextMenu = (e: React.MouseEvent<HTMLElement>) => {

	}

    componentWillUnmount() {
		this.props.climateRiskAnalysis.cleanup();
		this._toDispose.forEach(f => f());
	}
}

@observer
export class ClimateRiskAnalysisComponentView extends React.Component<{modelComponent: ClimateRiskAnalysisComponent, book: Book, page: BookPage, view: BookView, shouldDelayRender: boolean}, {}> {

	// shouldComponentUpdate(nextProps, nextState: Readonly<{}>, nextContext: any): boolean {
	// 	return this.props.book.currentPage.getView(this.props.view.id) != null;
	// }

	renderView(view: BookView) {
		const {climateRiskAnalysis} = this.props.modelComponent.props;
		const {page} = this.props;
		let viewComponent = null;
		const pendingChanges = climateRiskAnalysis.runRequired;
		const needsOutput = (climateRiskAnalysis.status != ClimateRiskAnalysisStatus.complete || pendingChanges) && !climateRiskAnalysisStore.views[view.name].isInput;

		switch (view.name) {
			case "simulation":
				viewComponent = <SimulationInput climateRiskAnalysis={climateRiskAnalysis}/>
				break;
			case "riskDefinition":
				viewComponent = <RiskDefinitionsInput climateRiskAnalysis={climateRiskAnalysis} page={page}/>
				break;
			case "assetClass":
				viewComponent = <AssetClassInput climateRiskAnalysis={climateRiskAnalysis} page={page}/>
				break;
			case "description":
				viewComponent = <DescriptionInput climateRiskAnalysis={climateRiskAnalysis} allowScrolling={page.scrollMode} page={page} view={view} />
				break;
			case "distributionsAtHorizon":
				viewComponent = <DistributionsAtHorizon climateRiskAnalysis={climateRiskAnalysis} page={page} view={view}/>
				break;
			case "throughTimeStatistics":
			case "craBox":
				const viewIndex = climateRiskAnalysis.getViewSerialNumberByViewType(view.id);

				viewComponent = <HighchartsComponent
					guid={climateRiskAnalysis.id}
					key={view.name}
					inlineToolbar={true}
					className={css.viewComponent}
					chartType={view.name}
					allowScrollwheelZoom={!page.scrollMode}
					userOptions={page.getViewUserOptions(view.id)}
					onUserOptionsUpdated={userOptions => page.updateUserOptions(view.id, userOptions)}
					chartingResult={climateRiskAnalysis}
					id={view.id}
					isShowViewCaption={page.showViewCaption}
					viewCaptionIndex={viewIndex}
					isReportMainBlock={true}
				/>;
				break;
			case "marketValueStatistics":
				viewComponent = <MarketValueStatistics
					climateRiskAnalysis={climateRiskAnalysis}
					page={page}
					view={view}
					chartType={view.name}
					userOptions={page.getViewUserOptions(view.id)} />
				break;
			case "financialDamageAndVolatilityShock":
				viewComponent = <FinancialDamageAndVolatilityShock
					climateRiskAnalysis={climateRiskAnalysis}
					page={page}
					view={view} />
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
		const {view, modelComponent, modelComponent: {props: {climateRiskAnalysis: cra}}} = this.props;
		const craView = climateRiskAnalysisStore.views[view.name];
		const isRunning = cra.status == ClimateRiskAnalysisStatus.running;
		const isInput = view.name == 'description' ? false : craView.isInput;

		return <>
			{page.getView(view.id) && this.renderView(view)}
			<LockCover
				isLocked={cra.silentLock || (isInput && (isRunning || cra.inputsLocked))} isSilentLock={cra.silentLock} small={view.name == 'simulation'}
				tooltipContent={isRunning ? "Input locked while running." : `The ${formatLabelText(ClimateRiskAnalysis.ObjectType).toLowerCase()} inputs have been locked. Please unlock to edit.`}

				objectType={ClimateRiskAnalysis.ObjectType}
				canUnlock={!isRunning}
				unlockInputs={action(() => cra.inputsLocked = false )}
			/>
		</>
	}
}
