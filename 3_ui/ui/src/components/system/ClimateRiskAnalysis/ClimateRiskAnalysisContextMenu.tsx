import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import {OmdbTagForm} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';
import type {SiteLocation} from 'stores';
import {ClimateRiskAnalysis, appIcons, climateRiskAnalysisStore, routing, api} from 'stores';
import { observer } from 'mobx-react';
import * as React from "react";
import {formatLabelText, PdfExporter} from '../../../utility';
import {AppIcon, bp, dialogs} from '../../index';
import {SortableBookMenu} from '../Book/SortableBookMenu';

import * as css from './ClimateRiskAnalysisContextMenu.css';
import * as bookCSS from '../Book/BookComponent.css';

interface MyProps {
	className?: string;
	climateRiskAnalysis?: ClimateRiskAnalysis;
	location?: SiteLocation;
}

@observer
export class ClimateRiskAnalysisContextMenu extends React.Component<MyProps, {}> {
	popoverRef;

	render() {
		let { className, climateRiskAnalysis} = this.props;
		const hasPages = climateRiskAnalysis.book.pages.length != 0;

		const runTitle = 'Run Analysis';

		return <bp.Menu className={css.root} ref={ r => this.popoverRef = r }>
			<bp.MenuItem disabled={true} text="">
				<bp.MenuItem text="" />
			</bp.MenuItem>
			<bp.MenuItem text="Book" icon={<AppIcon icon={appIcons.climateRiskAnalysisTool.pages}/>} disabled={!hasPages} popoverProps={{usePortal:true, hoverCloseDelay:100, className:css.pages}}>
				<SortableBookMenu book={climateRiskAnalysis.book} isPagesItem={true}  enableInsert={true}/>
			</bp.MenuItem>
			<bp.MenuItem text="Page" icon={<AppIcon icon={appIcons.climateRiskAnalysisTool.page}/>} disabled={!hasPages} popoverProps={{usePortal:true, hoverCloseDelay:100, className:css.page}}>
				<SortableBookMenu book={climateRiskAnalysis.book} isPagesItem={false}  enableInsert={true}/>
			</bp.MenuItem>
			<bp.MenuDivider />

			<bp.Tooltip content={climateRiskAnalysis.blockedRunMessage} intent={bp.Intent.DANGER}>
				<bp.MenuItem disabled={climateRiskAnalysis.blockedRunMessage != null} text={runTitle} icon="play" onClick={() => climateRiskAnalysis.run()}/>
			</bp.Tooltip>
			<bp.MenuDivider />
			<bp.MenuItem text='Export Stressed Returns' icon={<AppIcon icon={appIcons.climateRiskAnalysisTool.download} style={{width:16, height:16}} />} disabled={climateRiskAnalysis.runRequired} onClick={() => climateRiskAnalysisFileControl.exportReturns(climateRiskAnalysis)}/>
			<bp.MenuDivider />

			<bp.MenuItem text='New' icon={<AppIcon icon={appIcons.file.create} />} disabled={!climateRiskAnalysis} onClick={() => climateRiskAnalysisFileControl.createBook()}/>
			<bp.MenuItem text='Rename' icon={<AppIcon icon={appIcons.file.rename} />} disabled={!climateRiskAnalysis} onClick={() => climateRiskAnalysisFileControl.bookPromptRename(climateRiskAnalysis)}/>
			<bp.MenuItem text='Duplicate' icon={<AppIcon icon={appIcons.file.copy} />} disabled={!climateRiskAnalysis} onClick={() => climateRiskAnalysisFileControl.copyBook(climateRiskAnalysis)}/>
			<bp.MenuItem text='Delete' icon={<AppIcon icon={appIcons.file.delete} />} disabled={!climateRiskAnalysis} onClick={() => climateRiskAnalysisFileControl.deleteBook(climateRiskAnalysis)}/>

		</bp.Menu>
	}
}

export class ClimateRiskAnalysisBrowserMenu extends React.Component<{}, {}> {
	render() {
		return <bp.Menu>
			<bp.MenuItem text="New Climate Risk Analysis" icon="document" onClick={() => {
				dialogs.newClimateRiskAnalysis();
			}}/>
		</bp.Menu>
	}
}

export class ClimateRiskAnalysisFileControl {
	pdfExporter = new PdfExporter();

	getBookName(climateRiskAnalysis:ClimateRiskAnalysis) {return climateRiskAnalysis.name;}

	async setBookName(s:string, climateRiskAnalysis:ClimateRiskAnalysis) {
		return await ObjectNameCheckerDialog.saveUniqueNameOrDialog({
			model:    Object.assign({__typename: ClimateRiskAnalysis.ObjectType}, climateRiskAnalysis),
			newName:  s,
			onRename: climateRiskAnalysis.rename
		});
	}

	public bookPromptRename(climateRiskAnalysis:ClimateRiskAnalysis) {
		api.site.setDialogFn(() => <ObjectNameCheckerDialog
			model={Object.assign({__typename: ClimateRiskAnalysis.ObjectType}, climateRiskAnalysis)}
			newName={climateRiskAnalysis.name}
			onRename={climateRiskAnalysis.rename}
		/>);
	}

	public createBook() { dialogs.newClimateRiskAnalysis(); }

	public async deleteBook(climateRiskAnalysis:ClimateRiskAnalysis, callback?) {
		const isSuccess = await ClimateRiskAnalysis.delete(climateRiskAnalysis, false, false, callback);
		if (isSuccess) {
			routing.push(routing.urls.climateRiskAnalysisBrowser);
		}
	}

	public async copyBook(climateRiskAnalysis:ClimateRiskAnalysis) {
		climateRiskAnalysis.isDuplicating = true;
		const newClimateRiskAnalysisId = await ClimateRiskAnalysis.duplicate(climateRiskAnalysis) as string;
		routing.push(ClimateRiskAnalysis.urlFor(newClimateRiskAnalysisId));
	}

	public async copyBookToNewTab(climateRiskAnalysis:ClimateRiskAnalysis) {
		climateRiskAnalysis.isDuplicating = true;
		const newClimateRiskAnalysisId = await ClimateRiskAnalysis.duplicate(climateRiskAnalysis) as string;
		window.open(ClimateRiskAnalysis.urlFor(newClimateRiskAnalysisId));
		climateRiskAnalysis.isDuplicating = false;
	}

	public pagePromptRename(climateRiskAnalysis:ClimateRiskAnalysis) {
		api.site.setDialogFn(() => <ObjectNameCheckerDialog
			model={null}
			canDuplicate={true}
			newName={climateRiskAnalysis.book.currentPage.title}
			onRename={async (newName) => climateRiskAnalysis.book.currentPage.updatePageTitle(newName)}
			dialogTitle={`Rename ${formatLabelText(ClimateRiskAnalysis.ObjectType)} Page`}
		/>);
	}

	public createPage(climateRiskAnalysis:ClimateRiskAnalysis) {
		climateRiskAnalysis.book.addPage();
	}

	public  deletePage(climateRiskAnalysis:ClimateRiskAnalysis) {
		climateRiskAnalysis.book.deletePage()
	}

	public copyPage(climateRiskAnalysis:ClimateRiskAnalysis) {
		const currentPage = climateRiskAnalysis.book.currentPage;
		const newIndex = climateRiskAnalysis.book.pages.length;
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
		climateRiskAnalysis.book.addPage(newPageSetting);
	}

	public async exportReturns(climateRiskAnalysis:ClimateRiskAnalysis) {
		ClimateRiskAnalysis.exportReturns(climateRiskAnalysis);
	}

	public async exportPDF(climateRiskAnalysis:ClimateRiskAnalysis, $root) {
		const availableViews = climateRiskAnalysis.availableViews;
		const forPdfViews = [];
		climateRiskAnalysis.book.currentPage.views.forEach((viewSetting, index) => {
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

				if (ignoreCSS && ignoreCSS.length > 0) {
					allIgnoreCSS = allIgnoreCSS.concat(ignoreCSS);
				}

				if (targetSelector) {
					return element.querySelector(targetSelector);
				}

				return element;
			});

			await this.pdfExporter.print(elements, `${climateRiskAnalysis.name}-${climateRiskAnalysis.book.currentPage.title}`, {
				sandboxContainer: $bookComponent.last()[0],
				customFonts: Array.from(allCustomFonts),
				ignoreCSS: allIgnoreCSS
			});
		}
	}
}

export const climateRiskAnalysisFileControl = new ClimateRiskAnalysisFileControl();
