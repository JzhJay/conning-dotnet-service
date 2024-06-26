import {ServerStatus} from 'components/system/ExpireDialog/ExpireDialog';
import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import {LockMenuItem} from 'components/system/LockMenuItem/LockMenuItem';
import type {SiteLocation} from 'stores';
import {IO, appIcons, site, routing, utility, IOStatus, api} from 'stores';
import { observer } from 'mobx-react';
import * as React from "react";
import {AppIcon, bp} from '../../index';
import {SortableBookMenu} from '../Book/SortableBookMenu';
import {IOPropertiesDialog} from './IOPropertiesDialog'
import {formatLabelText, PdfExporter} from '../../../utility';
import { BatchExportCustomizeDialog } from '../../system/IO/internal/progress/BatchExportCustomizeDialog';
import { BatchExportProgressDialog } from '../BatchExport/BatchExportProgressDialog';
import { BatchImportDialog } from '../BatchImport/BatchImportDialog';

import * as css from './IOContextMenu.css';
import * as bookCSS from '../Book/BookComponent.css';

interface MyProps {
	className?: string;
	io?: IO;
	location?: SiteLocation;
}

@observer
export class IOContextMenu extends React.Component<MyProps, {}> {
	popoverRef;

	onExportSpecification = () => {
		ioFileControl.exportBook(this.props.io);
	}

	onBatchExportSpecification = async () => {
		ioFileControl.batchExportCSV(this.props.io);
	}

	onCustomBatchExportSpecification = () => {
		site.setDialogFn(() => <BatchExportCustomizeDialog io={this.props.io} />);
	}

	render() {
		let { className, io} = this.props;

		const runTitle = io.blockedOptimizationMessage != null || io.requiredOptimization !== "full" ? 'Apply Changes' : 'Run Optimization';
		const isRunning = io.status == IOStatus.running;
		const isLocked = io.silentLock || isRunning || io.inputsLocked;
		const canUnlock = !isRunning;

		return <bp.Menu className={css.root} ref={ r => this.popoverRef = r }>
			<bp.MenuItem disabled={true} text="">
				<bp.MenuItem text="" />
			</bp.MenuItem>
			<bp.MenuItem text="Book" icon={<AppIcon icon={appIcons.investmentOptimizationTool.pages}/>} disabled={!io.hasPages} popoverProps={{usePortal:true, hoverCloseDelay:100, className:css.pages}}>
				<SortableBookMenu book={io.book} isPagesItem={true}  enableInsert={true}/>
			</bp.MenuItem>
			<bp.MenuItem text="Page" icon={<AppIcon icon={appIcons.investmentOptimizationTool.page}/>} disabled={!io.hasPages} popoverProps={{usePortal:true, hoverCloseDelay:100, className:css.page}}>
				<SortableBookMenu book={io.book} isPagesItem={false}  enableInsert={true}/>
			</bp.MenuItem>
			<bp.MenuDivider />

			<bp.Tooltip content={io.blockedOptimizationMessage} intent={bp.Intent.DANGER} position={bp.Position.RIGHT}>
				<bp.MenuItem disabled={io.blockedOptimizationMessage != null} text={runTitle} icon="play" onClick={() => io.optimize()}/>
			</bp.Tooltip>
			<bp.MenuItem icon={"reset"}
			             disabled={!_.some([ServerStatus.created, ServerStatus.ready], s => io.serverStatus == s) || !_.some([IOStatus.waiting, IOStatus.cancelled, IOStatus.complete], s => io.status == s)}
			             text={"Restart Session"}
			             onClick={() => io.restartSession(true)}
			/>
			<bp.MenuItem text='Generate Simulation' disabled={io.status != IOStatus.complete} icon={<AppIcon icon={appIcons.tools.simulations} iconningSize={20} style={{width:16, height:16}} />} onClick={() => io.saveIntermediateResult()} />
			<bp.MenuDivider />

			<bp.MenuItem text="Validation Sidebar" icon="tick-circle">
				<bp.MenuItem active={io.showValidationSetting} text="Show" onClick={() => io.showValidationSetting = true}/>
				<bp.MenuItem active={io.showValidationSetting == false} text="Hide" onClick={() => io.showValidationSetting = false}/>
				<bp.MenuItem active={io.showValidationSetting == null} text="Auto" onClick={() => io.showValidationSetting = null}/>
			</bp.MenuItem>
			<bp.MenuItem text="Disregard Results" disabled={io.status != "Complete"} icon="history" onClick={() => io.resetStatus()}/>
			{/*<Switch defaultChecked={io.enableCache} label="Enable Page Caching" onChange={asyncAction(() => {io.enableCache = !io.enableCache; io.saveIOOptions();})}/>*/}
			<bp.MenuDivider />
			<bp.MenuItem text='Export Specification' icon={<AppIcon icon={appIcons.investmentOptimizationTool.download} style={{width:16, height:16}} />} disabled={!io} onClick={this.onExportSpecification} />
			<bp.MenuItem text="Batch Export" icon={<AppIcon icon={appIcons.investmentOptimizationTool.batchExport} style={{width:16, height:16}} />} disabled={!io}>
				<bp.MenuItem text="New Local File" onClick={this.onBatchExportSpecification} />
				<bp.MenuItem text="Special..." onClick={this.onCustomBatchExportSpecification} />
			</bp.MenuItem>
			<LockMenuItem text='Batch Import...' icon={<AppIcon icon={{type: 'iconic', name: 'cloud-upload'}} style={{width:16, height:16}} />} disabled={!io} onClick={() => site.setDialogFn(() => <BatchImportDialog title="Batch Import Specification" progressData={io.batchImportProgressData} batchImport={io.batchImport} /> )} isLocked={isLocked} objectType={IO.ObjectType} canUnlock={canUnlock} clickUnlockFn={io.unlockInputs} />
			<bp.MenuDivider />
			<bp.MenuItem text='New' icon={<AppIcon icon={appIcons.file.create} />} disabled={!io} onClick={() => ioFileControl.createBook()}/>
			<bp.MenuItem text='Rename' icon={<AppIcon icon={appIcons.file.rename} />} disabled={!io} onClick={() => ioFileControl.bookPromptRename(io)}/>
			<bp.MenuItem text='Duplicate' icon={<AppIcon icon={appIcons.file.copy} />} disabled={!io} onClick={() => ioFileControl.copyBook(io)}/>
			<bp.MenuItem text='Delete' icon={<AppIcon icon={appIcons.file.delete} />} disabled={!io} onClick={() => ioFileControl.deleteBook(io)}/>
		</bp.Menu>
	}
}

/*
@observer
export class ToolbarItem extends React.Component<{view: IOViewTemplate, investmentOptimization:IO}, {}> {

	@observable activeSelection = false;

	render() {
		let { view:{name}, view, investmentOptimization} = this.props;

		let icon = appIcons.investmentOptimizationTool.views[name];
		const active = investmentOptimization.currentPage.isViewActive(name);

		return (
			<bp.MenuItem
				text={view.label}
				shouldDismissPopover={false}
				icon={<AppIcon icon={icon}/>}
				className={css.view}
				active={active}
				onClick={(e) => {
					          e.preventDefault();
					          investmentOptimization.toggleViewSelection(name);
					          this.activeSelection = true;
					          //io.setView();
				          }}
			/>);
	}
}*/

export class IOBrowserMenu extends React.Component<{}, {}> {
	render() {
		return <bp.Menu>
			<bp.MenuItem text={`New ${utility.formatLabelText(IO.ObjectType)}`} icon="document" onClick={() => {
				site.setDialogFn(() => <IOPropertiesDialog focusTarget='name'/>);
			}}/>
		</bp.Menu>
	}
}

export class IOFileControl {
	pdfExporter = new PdfExporter();

	getBookName(io:IO) {return io.name;}

	async setBookName(s:string, io:IO) {
		return await ObjectNameCheckerDialog.saveUniqueNameOrDialog({
			model:    Object.assign({__typename: IO.ObjectType}, io),
			newName:  s,
			onRename: io.rename
		});
	}

	public bookPromptRename(io:IO) {
		api.site.setDialogFn(() => <ObjectNameCheckerDialog
			model={Object.assign({__typename: IO.ObjectType}, io)}
			newName={io.name}
			onRename={io.rename}
		/>);
	}

	public createBook() { site.setDialogFn(() => <IOPropertiesDialog focusTarget='name'/>); }

	public async deleteBook(io:IO) {
		await IO.delete(io);
		routing.push(routing.urls.ioBrowser);
	}

	public async exportBook(io:IO) {
		IO.exportInputs(io);
	}

	public async batchExportCSV(io:IO) {
		const params = {
			export: true,
			filename: `${io.name}_batch_export`,
			append: false,
			export_views: await io.getEligibleBatchExportViews(),
			save_user_file: false
		};

		const id = await io.batchExportToCSV(params);
		// wait this dialog closed and open progress dialog.
		if (typeof id === 'number') {
			setTimeout(() => {
				site.setDialogFn(() => <BatchExportProgressDialog object={io} fileID={id} isUserFile={params.save_user_file} downloadFileName={params.filename} download={io.downloadBatchExportFile} />);
			}, 500);
		}
	}

	public async copyBook(io:IO) {
		io.isDuplicating = true;
		const newIOId = await IO.duplicate(io) as string;
		routing.push(IO.urlFor(newIOId));
	}

	public async copyBookToNewTab(io:IO) {
		io.isDuplicating = true;
		const newIOId = await IO.duplicate(io) as string;
		window.open(IO.urlFor(newIOId));
		io.isDuplicating = false;
	}

	public pagePromptRename(io:IO) {
		api.site.setDialogFn(() => <ObjectNameCheckerDialog
			model={null}
			canDuplicate={true}
			newName={io.book.currentPage.title}
			onRename={async (newName) => await io.currentPage.updatePageTitle(newName)}
			dialogTitle={`Rename ${formatLabelText(IO.ObjectType)} Page`}
		/>);
	}

	public createPage(io:IO) {io.book.addPage();}

	public  deletePage(io:IO) {
		io.book.deletePage()
	}

	public copyPage(io:IO) {
		const currentPage = io.book.currentPage;
		const newIndex = io.book.pages.length;
		let newPageSetting = {
			newIndex:           newIndex,
			title:              `Duplicate of ${currentPage.title.replace(/^\s*/,'')}`,
			additionalControls: currentPage.additionalControls,
			views:              currentPage.views.map((view,i) => {
				return {
					newIndex: i,
					view:     view.view,
					controls: view.controls
				}
			})
		}
		io.book.addPage(newPageSetting);
	}

	public async exportPDF(io:IO, $root) {
		const availableViews = io.availableViews;
		const forPdfViews = [];
		io.book.currentPage.views.forEach((viewSetting, index) => {
			if (availableViews[viewSetting.view] && availableViews[viewSetting.view].exportPDF) {
				forPdfViews.push({
					index,
					view: availableViews[viewSetting.view]
				});
			}
		});

		if (forPdfViews.length > 0) {
			const $bookComponent = $root.find(`.${bookCSS.views}`).last();
			const $viewsInBook = $bookComponent.children(`.${bookCSS.view}`);
			const allCustomFonts = new Set<string>();
			let allIgnoreCSS = [];
			const elements = forPdfViews.map((setting)=> {
				const { index, view } = setting;
				const element = $viewsInBook[index];
				const { targetSelector, customFonts, ignoreCSS } = view.exportPDF;
				if (customFonts && customFonts.length > 0) {
					customFonts.forEach((font) => allCustomFonts.add(font));
				}

				if (ignoreCSS) {
					allIgnoreCSS = allIgnoreCSS.concat(ignoreCSS);
				}

				if (targetSelector) {
					return element.querySelector(targetSelector);
				}

				return element;
			});

			await this.pdfExporter.print(elements, `${io.name}-${io.currentPage.title}`, {
				sandboxContainer: $bookComponent.last()[0],
				customFonts: Array.from(allCustomFonts),
				ignoreCSS: allIgnoreCSS
			});
		}
	}

}

export const ioFileControl = new IOFileControl();
