import {AnchorButton, Button, Popover, Switch, Hotkey, Hotkeys, HotkeysTarget, Divider } from '@blueprintjs/core';
import {ApplicationShortCuts, ApplicationShortCutsProps} from 'components/site/ApplicationShortCuts';
import { computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Loader} from 'semantic-ui-react';
import {api, appIcons, IOPage, ioStore, routing, utility, asyncSiteLoading} from '../../../stores';
import {IO} from '../../../stores/io';
import {asyncAction} from '../../../utility';
import {AppIcon, bp} from '../../index';
import {ArrowNavigation} from '../../widgets/navigation/ArrowNavigation';
import {SortableBookMenu} from '../Book/SortableBookMenu';
import * as css from './IOApplicationBarItems.css';
import {ioFileControl} from './IOContextMenu';
import {IOErrorMessage} from './internal/IOErrorMessage'
import {RunButton} from '../toolbar'
import { ExportPdfPrefDialog } from '../ExportPdfReport/ExportPdfPrefDialog';

import * as appBar from 'styles/ApplicationBarItems.css';

@observer
export class IOApplicationBarItems extends React.Component<{io: IO}, {}> {
	render() {
		const {io} = this.props;

		return <div className={appBar.applicationBarItems}>
			{io.hasPages && <PageMenu io={io}/>}
			{io.hasPages && <PageNavigation io={io}/>}
			<RunButton
			    isDisabled={io.blockedOptimizationMessage != null}
				isComplete={io.isOptimizationComplete()}
				isFinalizable={io.isFinalizable()}
			    isFinalizing={io.isFinalizing()}
				buttonText={io.optimizeControlText}
				tooltipContent={io.blockedOptimizationMessage}
				runCallback={io.optimize}
				cancelCallback={io.cancel}
				finalizeCallback={io.finalizeFrontier}
			/>
			{io.errorMessages && <IOErrorMessage io={io} /> }
		</div>
	}
}

@observer
export class PageMenu extends React.Component<{io: IO}, {}> {
    pageRef = null;

    constructor(props: {io: IO}) {
        super(props);
        makeObservable(this);
    }

    @computed get showViewToolbars() {
		return this.props.io.book.currentPage.showViewToolbars;
	}

    exportPageAsPdf = asyncSiteLoading(async () => {
		const { io } = this.props;
		await ioFileControl.exportPDF(io, $('#investment-optimization-page'));
	})

    openPdfPrefDialog = (e) => {
		e.stopPropagation();
		api.site.setDialogFn(() => <ExportPdfPrefDialog />)
	}

    renderMenu() {
		const {io} = this.props;
		const page = io.book.currentPage as IOPage;
		const supportPdfViewsInCurrentPage = io?.supportPdfViewsInCurrentPage || [];

		return page && <bp.Menu className={css.pageMenu}>
			<bp.MenuItem disabled={true} text="">
				<bp.MenuItem text="" />
			</bp.MenuItem>
			<SortableBookMenu book={io.book} isPagesItem={false} enableInsert={true}/>
            <bp.MenuDivider title="Toolbars"/>
            <Switch checked={this.showViewToolbars === true}  label="Show"  onChange={asyncAction(() => page.showViewToolbars = true)}  />
            <Switch checked={this.showViewToolbars === false} label="Hide"  onChange={asyncAction(() => page.showViewToolbars = false)} />
            <Switch checked={this.showViewToolbars === null}  label="Hover" onChange={asyncAction(() => page.showViewToolbars = null)}  />
			<bp.MenuDivider title="Page"/>
            <bp.MenuItem text="Insert" icon={<AppIcon icon={appIcons.file.create} />} onClick={() => ioFileControl.createPage(io)}/>
            <bp.MenuItem text="Rename" icon={<AppIcon icon={appIcons.file.rename} />} onClick={() => ioFileControl.pagePromptRename(io)}/>
            <bp.MenuItem text="Duplicate" icon={<AppIcon icon={appIcons.file.copy} />} onClick={() => ioFileControl.copyPage(io)}/>
            <bp.MenuItem text="Delete" icon={<AppIcon icon={appIcons.file.delete} />} onClick={() => ioFileControl.deletePage(io)}/>
			{ supportPdfViewsInCurrentPage.length > 0 && 
			<bp.MenuItem text="Export" icon={<AppIcon className={css.semanticIcon} icon={appIcons.file.pdf} />} onClick={this.exportPageAsPdf} labelElement={<bp.ButtonGroup minimal={true}><Divider /><bp.Button small text={<bp.Icon icon="cog" />} onClick={this.openPdfPrefDialog} /></bp.ButtonGroup>}/>
			}
            <bp.MenuDivider/>
            <Switch defaultChecked={page.showHoverPoint} label="Show Hover Point Across Views" onChange={asyncAction(() => page.showHoverPoint = !page.showHoverPoint)}/>
            <Switch defaultChecked={page.scrollMode} label="Allow Page Scrolling" onChange={asyncAction(() => page.scrollMode = !page.scrollMode)}/>
            <Switch defaultChecked={page.showPageTitle} label="Show Page Title" onChange={asyncAction(() => page.showPageTitle = !page.showPageTitle)}/>
            <Switch defaultChecked={page.isMonitorPage} label="Show Page During Optimization" onChange={asyncAction(() => io.setMonitorPage(page))}/>
			{page.isMonitorPage && <Switch defaultChecked={page.showPreOptimizationStatus} label="Show Pre-optimization Status" onChange={asyncAction(() => page.showPreOptimizationStatus = !page.showPreOptimizationStatus)}/>}
		</bp.Menu>
	}

    render() {
		const {io} = this.props;

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
export class PageNavigation extends React.Component<{io: IO}, {}> {
	arrowNavRef;
	render() {
		const {io} = this.props;

		return <ArrowNavigation canNavigateLeft={io.book.nextApplicablePageIndex(io.book.currentPageNumber, false) != -1}
		                        canNavigateRight={io.book.nextApplicablePageIndex(io.book.currentPageNumber, true) != -1}
		                        currentItem={(io.book.currentPageNumber + 1).toString()}
		                        pageMenu={<bp.Menu>
			                        <SortableBookMenu book={io.book} isPagesItem={true} enableInsert={true}/>
		                        </bp.Menu>}
		                        onPrevious={io.book.navigateToPreviousPage}
		                        onNext={io.book.navigateToNextPage}
								ref={ r => this.arrowNavRef = r }/>
	}
}

