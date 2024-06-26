import {ExpireDialogComponent} from 'components/system/ExpireDialog/ExpireDialog';
import {UseCaseInputView} from 'components/system/simulationUseCaseViewer/internal/UseCaseInputView';
import {observer} from 'mobx-react';
import * as React from 'react';
import {useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import {LoadingIndicator, LoadingIndicatorWithStatus, LockCover, QueryViewComponent} from 'components';
import {RSSimulation, Simulation, i18n} from 'stores';
import {BookComponent} from '../Book/BookComponent';
import {BookValidationSidebar} from 'components/system/ValidationSidebar/ValidationSidebar';
import {Book} from 'stores/book/Book';
import {BookPage} from 'stores/book/BookPage';
import {BookView} from 'stores/book/BookView';
import {formatLabelText} from 'utility';
import {RSSimulationRunning} from 'components/system/rsSimulation/RSSimulationRunning';
import * as css from './SimulationUseCaseViewerApplication.css';

export const SimulationUseCaseViewerApplication = observer((props: {rsSimulation: RSSimulation}): JSX.Element => {
	const {rsSimulation, rsSimulation: {useCaseViewer}} = props;
	const { isRunning } = rsSimulation;
	const areQueriesRunning = useCaseViewer ? useCaseViewer.areQueriesRunning : false;
	const isRenderProgress = isRunning || areQueriesRunning;

	useEffect(() => {
		!rsSimulation.isLoaded && rsSimulation.loadExistingRSSimulation();
	}, [])

	if (!rsSimulation.isLoaded) {
		return (
            <LoadingIndicatorWithStatus model={rsSimulation}>
				<FormattedMessage defaultMessage="Initializing Simulation Session" description="[UseCaseViewer] Loading message for Initializing Simulation Session" />
			</LoadingIndicatorWithStatus>
        );
	}

	if (!rsSimulation.useCaseViewer.book) {
		return ( 
            <LoadingIndicatorWithStatus model={rsSimulation}>
                <FormattedMessage defaultMessage="Reading Pages" description="[UseCaseViewer] Loading message for Reading Pages" />
            </LoadingIndicatorWithStatus>
        );
	}

	return <div className={css.root} style={{overflow: 'hidden'}}>
		<BookComponent
			book={rsSimulation.useCaseViewer.book}
			viewClasses={(page,view) => classNames({[css.disableInput]: useCaseViewer.availableViews[view.name].isInput && rsSimulation.isRunning || rsSimulation.inputsLocked})}
			renderValidations={() => <BookValidationSidebar method={useCaseViewer} store={useCaseViewer} canClose={false} />}
			renderProgress={(page) => isRenderProgress && page.hasOuputView && <RSSimulationRunning rsSimulation={rsSimulation}/>}
			renderView={(page, view, delayRender) => <SimulationUseCaseViewerComponentView rsSimulation={rsSimulation} book={useCaseViewer.book} page={page} view={view} shouldDelayRender={delayRender}/> }
		/>
		<ExpireDialogComponent app={rsSimulation} />
	</div>;
})

@observer
export class SimulationUseCaseViewerComponentView extends React.Component<{rsSimulation: RSSimulation, book: Book, page: BookPage, view: BookView, shouldDelayRender: boolean}, {}> {
	renderView(view: BookView) {
		const {rsSimulation} = this.props;
		const {page} = this.props;
		let viewComponent = null;
		const isInput = rsSimulation.useCaseViewer.views[view.name].isInput;
		const needsOutput = !rsSimulation.isComplete && !isInput;

		if (isInput) {
			viewComponent = <UseCaseInputView rsSimulation={rsSimulation} view={view} page={page} book={this.props.book} />
		}
		else if (needsOutput) {
			viewComponent = <div className={css.noData}>
				<span>{view.label}</span>
				<span><FormattedMessage defaultMessage="(No data available)" description="[UseCaseViewer] Text for no avilable data in output page" /></span>
			</div>
		} else {
			const viewDefinition = rsSimulation.useCaseViewer.viewDefinitions.outputs.find(def => def.title ==  view.name);
			viewComponent = <QueryViewComponent queryId={viewDefinition.queryID}
			                                    viewName={viewDefinition.queryView.toLowerCase()}
			                                    isUseCaseQuery={true}
			                                    onLoaded={this.onViewLoaded}
			                                    shouldRenderFullHeight={page.scrollMode}/>
		}

		return !page.viewHasData(view.id) || this.props.shouldDelayRender ? <LoadingIndicator active={true}>
			Loading {view.label}
		</LoadingIndicator> : viewComponent;

	}

	onViewLoaded = () => {
		// Invalidate page if its loaded while the page is not visible. Rendering a view while the page is not visible could result in render issues caused by invalid element measurements.
		if (this.props.book.currentPage != this.props.page)
			this.props.page.renderedTime = null;
	}

	render() {
		const {page} = this.props;
		const {view, rsSimulation} = this.props;
		const useCaseView = rsSimulation.useCaseViewer.views[view.name];
		const isRunning = rsSimulation.isRunning;
		const isInput = useCaseView.isInput;
		const silentLocked = isInput && isRunning;

		return <>
			{page.getView(view.id) && this.renderView(view)}
			{isInput && <LockCover
				isLocked={silentLocked || rsSimulation.inputsLocked} isSilentLock={silentLocked}
				tooltipContent={isRunning ? i18n.intl.formatMessage({ defaultMessage: 'Input locked while running.', description: '[UseCaseViewer] Tooltip for input locked while running'}) : i18n.intl.formatMessage({ defaultMessage: 'The {objectType} inputs have been locked. Please unlock to edit.', description: '[UseCaseViewer] Tooltip for input locked while running'}, { objectType: formatLabelText(Simulation.ObjectType).toLowerCase()})}
				objectType={Simulation.ObjectType}
				canUnlock={!isRunning}
				unlockInputs={rsSimulation.unlockInputs}
			/>}
		</>
	}

	componentDidUpdate(prevProps: Readonly<{ rsSimulation: RSSimulation; book: Book; page: BookPage; view: BookView; shouldDelayRender: boolean }>, prevState: Readonly<{}>, snapshot?: any) {
		// Invalidate page if its updated while offscreen.
		if (this.props.book.currentPage != this.props.page)
			this.props.page.renderedTime = null;
	}
}



