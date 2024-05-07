import {observer} from 'mobx-react';
import * as React from 'react';
import {AnchorButton, Popover, Switch, Divider } from '@blueprintjs/core';
import { api, utility} from '../../../stores';
import {appIcons} from '../../../stores/site/iconography';
import {asyncAction} from '../../../utility';
import {AppIcon, ApplicationBarErrorMessageWithHandler, bp} from '../../index';
import {ClimateRiskAnalysis} from '../../../stores/climateRiskAnalysis';
import {ArrowNavigation} from '../../widgets/navigation/ArrowNavigation';
import {climateRiskAnalysisFileControl} from './ClimateRiskAnalysisContextMenu';
import {RunButton} from '../toolbar'
import { SortableBookMenu} from '../Book/SortableBookMenu';
import { asyncSiteLoading } from 'stores/site';
import { ExportPdfPrefDialog } from '../ExportPdfReport/ExportPdfPrefDialog';

import * as appBar from 'styles/ApplicationBarItems.css';
import * as css from './ClimateRiskAnalysisApplicationBarItems.css';

@observer
export class ClimateRiskAnalysisApplicationBarItems extends React.Component<{climateRiskAnalysis: ClimateRiskAnalysis}, {}> {
	render() {
		const {climateRiskAnalysis} = this.props;

		return <div className={appBar.applicationBarItems}>
			{climateRiskAnalysis.book.hasPages && <PageMenu climateRiskAnalysis={climateRiskAnalysis}/>}
			{climateRiskAnalysis.book.hasPages && <PageNavigation climateRiskAnalysis={climateRiskAnalysis}/>}
			<RunButton isDisabled={climateRiskAnalysis.blockedRunMessage != null}
					isComplete={!climateRiskAnalysis.isRunning()}
				    buttonText={"Run"}
				    tooltipContent={climateRiskAnalysis.blockedRunMessage}
				    runCallback={climateRiskAnalysis.run}
				    cancelCallback={climateRiskAnalysis.cancel} />
			{climateRiskAnalysis.errorMessageHandler.isInitialized && <ApplicationBarErrorMessageWithHandler errorHandler={climateRiskAnalysis.errorMessageHandler} />}
		</div>
	}
}

@observer
export class PageMenu extends React.Component<{climateRiskAnalysis: ClimateRiskAnalysis}, {}> {
	pageRef = null;

	exportPageAsPdf = asyncSiteLoading(async () => {
		const { climateRiskAnalysis } = this.props;
		await climateRiskAnalysisFileControl.exportPDF(climateRiskAnalysis, $('#climate-risk-analysis-page'));
	})

	openPdfPrefDialog = (e) => {
		e.stopPropagation();
		api.site.setDialogFn(() => <ExportPdfPrefDialog />)
	}

	renderMenu() {
		const {climateRiskAnalysis} = this.props;
		const page = climateRiskAnalysis.book.currentPage;
		const supportPdfViewsInCurrentPage = climateRiskAnalysis?.supportPdfViewsInCurrentPage || [];

		return page && <bp.Menu className={css.pageMenu}>
			<bp.MenuItem disabled={true} text="">
				<bp.MenuItem text="" />
			</bp.MenuItem>
            <SortableBookMenu book={climateRiskAnalysis.book} isPagesItem={false} enableInsert={true}/>
			<bp.MenuDivider title="Page"/>
            <bp.MenuItem text="Insert" icon={<AppIcon icon={appIcons.file.create} />} onClick={() => climateRiskAnalysisFileControl.createPage(climateRiskAnalysis)}/>
            <bp.MenuItem text="Rename" icon={<AppIcon icon={appIcons.file.rename} />} onClick={() => climateRiskAnalysisFileControl.pagePromptRename(climateRiskAnalysis)}/>
            <bp.MenuItem text="Duplicate" icon={<AppIcon icon={appIcons.file.copy} />} onClick={() => climateRiskAnalysisFileControl.copyPage(climateRiskAnalysis)}/>
            <bp.MenuItem text="Delete" icon={<AppIcon icon={appIcons.file.delete} />} onClick={() => climateRiskAnalysisFileControl.deletePage(climateRiskAnalysis)}/>
			{ supportPdfViewsInCurrentPage.length > 0 &&
			<bp.MenuItem text="Export" icon={<AppIcon className={css.semanticIcon} icon={appIcons.file.pdf} />} onClick={this.exportPageAsPdf} labelElement={<bp.ButtonGroup minimal={true}><Divider /><bp.Button small text={<bp.Icon icon="cog" />} onClick={this.openPdfPrefDialog} /></bp.ButtonGroup>}/>
			}
            <bp.MenuDivider/>
            <Switch defaultChecked={page.scrollMode} label="Allow Page Scrolling" onChange={asyncAction(() => page.scrollMode = !page.scrollMode)}/>
            <Switch defaultChecked={page.showPageTitle} label="Show Page Title" onChange={asyncAction(() => page.showPageTitle = !page.showPageTitle)}/>

            <bp.MenuDivider title="Toolbars"/>
			<Switch checked={page.showViewToolbars === true}  label="Show"  onChange={asyncAction(() => page.showViewToolbars = true)}  />
			<Switch checked={page.showViewToolbars === false} label="Hide"  onChange={asyncAction(() => page.showViewToolbars = false)} />
			<Switch checked={page.showViewToolbars === null}  label="Hover" onChange={asyncAction(() => page.showViewToolbars = null)}  />

            <bp.MenuDivider title="Views"/>
			<Switch checked={page.showViewCaption === true}  label="Show Caption"  onChange={asyncAction(() => page.showViewCaption = !page.showViewCaption)}  />

		</bp.Menu>
	}

	render() {
		const {climateRiskAnalysis} = this.props;

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
export class PageNavigation extends React.Component<{climateRiskAnalysis: ClimateRiskAnalysis}, {}> {
	arrowNavRef;
	render() {
		const {climateRiskAnalysis} = this.props;

		return <ArrowNavigation canNavigateLeft={climateRiskAnalysis.book.currentPageNumber > 0}
		                        canNavigateRight={climateRiskAnalysis.book.currentPageNumber < climateRiskAnalysis.book.pages.length - 1}
		                        currentItem={(climateRiskAnalysis.book.currentPageNumber + 1).toString()}
		                        pageMenu={<bp.Menu>
			                        <SortableBookMenu book={climateRiskAnalysis.book} isPagesItem={true} enableInsert={true}/>
		                        </bp.Menu>}
		                        onPrevious={climateRiskAnalysis.book.navigateToPreviousPage}
		                        onNext={climateRiskAnalysis.book.navigateToNextPage}
								ref={ r => this.arrowNavRef = r }/>
	}
}

