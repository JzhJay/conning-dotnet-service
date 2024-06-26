import {computed} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {AnchorButton, Popover, Switch, Divider } from '@blueprintjs/core';
import { api, RSSimulation, utility} from '../../../stores';
import {appIcons} from '../../../stores/site/iconography';
import {asyncAction} from '../../../utility';
import {AppIcon, bp, ReactSortable} from '../../index';
import {ArrowNavigation} from '../../widgets/navigation/ArrowNavigation';
import {RunButton} from '../toolbar'
import { SortableBookMenu} from '../Book/SortableBookMenu';

import * as appBar from 'styles/ApplicationBarItems.css';
import * as css from './SimulationUseCaseViewerApplicationBarItems.css';
import {getSimulateRunFunc} from 'components/system/rsSimulation/internal/SimulateConfirmDialog';
import {RSSimulationErrorMessage} from 'components/system/rsSimulation/RSSimulationErrorMessage';
import {simulationUseCaseViewerFileControl} from 'components/system/simulationUseCaseViewer/SimulationUseCaseContextMenu';

// TODO: Refactor to remove duplicate code

@observer
export class SimulationUseCaseViewerApplicationBarItems extends React.Component<{rsSimulation: RSSimulation}, {}> {
	render() {
		const {rsSimulation, rsSimulation: {useCaseViewer}} = this.props;

		if (!rsSimulation.isLoaded)
			return null;

		return <div className={appBar.applicationBarItems}>
			{useCaseViewer.book?.hasPages && <PageMenu rsSimulation={rsSimulation}/>}
			{useCaseViewer.book?.hasPages && <PageNavigation rsSimulation={rsSimulation}/>}
			<RunButton isDisabled={rsSimulation.inputsLocked || !rsSimulation.canRun}
			           isComplete={!rsSimulation.isRunning}
			           isCancelling={rsSimulation.isCanceling}
			           buttonText={rsSimulation.isRunning ? "Cancel" : "Run"}
			           tooltipContent={rsSimulation.blockedRunMessage}
			           runCallback={getSimulateRunFunc(rsSimulation)}
			           cancelCallback={rsSimulation.cancel}/>
			{rsSimulation.errorMessages && <RSSimulationErrorMessage rsSimulation={rsSimulation} /> }
		</div>
	}
}

@observer
export class PageMenu extends React.Component<{rsSimulation: RSSimulation}, {}> {
	pageRef = null;

	renderMenu() {
		const {rsSimulation} = this.props;
		const page = rsSimulation.useCaseViewer.book?.currentPage;

		return page && <bp.Menu className={css.pageMenu}>
			<bp.MenuItem disabled={true} text="">
				<bp.MenuItem text="" />
			</bp.MenuItem>
            <SortableBookMenu book={rsSimulation.useCaseViewer.book} isPagesItem={false} enableInsert={true}/>
			<bp.MenuDivider title="Page"/>
            <bp.MenuItem text="Insert" icon={<AppIcon icon={appIcons.file.create} />} onClick={() => simulationUseCaseViewerFileControl.createPage(rsSimulation)}/>
            <bp.MenuItem text="Rename" icon={<AppIcon icon={appIcons.file.rename} />} onClick={() => simulationUseCaseViewerFileControl.pagePromptRename(rsSimulation)}/>
            <bp.MenuItem text="Duplicate" icon={<AppIcon icon={appIcons.file.copy} />} onClick={() => simulationUseCaseViewerFileControl.copyPage(rsSimulation)}/>
            <bp.MenuItem text="Delete" icon={<AppIcon icon={appIcons.file.delete} />} onClick={() => simulationUseCaseViewerFileControl.deletePage(rsSimulation)}/>
            <bp.MenuDivider/>
            <Switch defaultChecked={page.scrollMode} label="Allow Page Scrolling" onChange={asyncAction(() => page.scrollMode = !page.scrollMode)}/>
            <Switch defaultChecked={page.showPageTitle} label="Show Page Title" onChange={asyncAction(() => page.showPageTitle = !page.showPageTitle)}/>

            <bp.MenuDivider title="Toolbars"/>
			<Switch checked={page.showViewToolbars === true}  label="Show"  onChange={asyncAction(() => page.showViewToolbars = true)}  />
			<Switch checked={page.showViewToolbars === false} label="Hide"  onChange={asyncAction(() => page.showViewToolbars = false)} />
			<Switch checked={page.showViewToolbars === null}  label="Hover" onChange={asyncAction(() => page.showViewToolbars = null)}  />
		</bp.Menu>
	}
	render() {
		const {rsSimulation} = this.props;

		return <Popover
			position={bp.Position.BOTTOM_LEFT}
			ref={r => this.pageRef = r}
			minimal
			hoverOpenDelay={300} hoverCloseDelay={600}
			popoverClassName={classNames(css.popover, utility.doNotAutocloseClassname)}
			canEscapeKeyClose
			content={this.renderMenu()}>
			<AnchorButton className={bp.Classes.MINIMAL} text="Page" icon={<AppIcon icon={appIcons.investmentOptimizationTool.page} iconningSize={24}/>} rightIcon="caret-down" onClick={() => {}}/>
		</Popover>
	}
}

@observer
export class PageNavigation extends React.Component<{rsSimulation: RSSimulation}, {}> {
	arrowNavRef;
	render() {
		const {rsSimulation: {useCaseViewer}} = this.props;

		return <ArrowNavigation canNavigateLeft={useCaseViewer.book.currentPageNumber > 0}
		                        canNavigateRight={useCaseViewer.book.currentPageNumber < useCaseViewer.book.pages.length - 1}
		                        currentItem={(useCaseViewer.book.currentPageNumber + 1).toString()}
		                        pageMenu={<bp.Menu>
			                        <SortableBookMenu book={useCaseViewer.book} isPagesItem={true} enableInsert={true}/>
		                        </bp.Menu>}
		                        onPrevious={useCaseViewer.book.navigateToPreviousPage}
		                        onNext={useCaseViewer.book.navigateToNextPage}
								ref={ r => this.arrowNavRef = r }/>
	}
}

