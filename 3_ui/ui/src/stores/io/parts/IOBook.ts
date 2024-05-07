import {Book} from '../../book/Book';
import {BookPage} from '../../book/BookPage';
import {ApiPage, ViewTemplate} from '../../book/model';
import {IO} from '../IO';
import {ioStore} from '../IOStore';
import type {AssetTableUserOptions} from '../models';
import {IOPage} from './IOPage';
import {IOView} from './IOView';

export class IOBook extends Book {

	constructor(private io: IO, defaultUserOptions: (name) => any, availableViews: {[name:string]: ViewTemplate}, sendPageUpdate: (pages: ApiPage[]) => Promise<any>, isLoading: () => boolean, url: string) {
		super(defaultUserOptions, availableViews, sendPageUpdate, isLoading, url);
	}

	pages: IOPage[] = [];

	createPage(pageConfig) {
		return new IOPage(this, this.io, pageConfig);
	}

	isPageApplicable = (pageIndex: number) => {
		const page = this.pages[pageIndex];
		return page.views.length == 0 || _.some(page.selectedViews, v => !ioStore.views[v.name].isInput) || _.some(page.selectedViews, v => this.isIOViewApplicable(v));
	}

	isIOViewApplicable = (view: IOView) => {
		// Asset class always has name and assetClasses as applicable
		return view.name == "assetClasses" ? this.io.inputOptions.assetClasses.options.filter(s => s.applicable && (view.userOptions as AssetTableUserOptions).hiddenSections.indexOf(s.name) == -1).length > 2 :
		       this.io.inputOptions[view.name].applicable;
	}

	isViewApplicable = (viewName: string) => {
		return this.io.inputOptions[viewName] ? this.io.inputOptions[viewName].applicable : true;
	}

	nextApplicablePageIndex = (pageIndex: number, isIncreasing: boolean) => {
		const delta = isIncreasing ? 1 : -1;
		for (let i = pageIndex + delta; isIncreasing ? i < this.pages.length : i >= 0; i += delta)
		{
			if (this.isPageApplicable(i)) {
				return i;
			}
		}

		return -1;
	}

	navigateToPreviousPage = () => {
		const previousPage = this.nextApplicablePageIndex(this.currentPageNumber, false);
		previousPage != -1 && this.navigateToPage(previousPage);
	}

	navigateToNextPage = () => {
		const nextPage = this.nextApplicablePageIndex(this.currentPageNumber, true);
		nextPage != -1 && this.navigateToPage(nextPage);
	}
}