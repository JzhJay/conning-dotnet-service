import { action, computed, observable, runInAction, makeObservable } from 'mobx';
import {routing} from '../routing';
import {BookPage} from './BookPage';
import {ApiPage, ViewTemplate} from './model';

export class Book {

	constructor(public defaultUserOptions: (name) => any, public availableViews: {[name:string]: ViewTemplate}, public sendPageUpdate: (pages: ApiPage[]) => Promise<any>, public isLoading: () => boolean, private url: string) {
        makeObservable(this);
    }

	pages: BookPage[] = [];


	@observable _currentPageNumber: number      = null;
	@observable currentPageID: string;
	@observable viewAnimationInProgress: boolean;
	shouldTransitionFromLeft = false;

	@computed get currentPageNumber() {
		return this._currentPageNumber;
	}

	set currentPageNumber(page) {

		if (page != this.currentPageNumber) {
			if (this.currentPage)
				this.currentPage.removePageListeners();

			if (page != -1)
				this.pages[page].setupPageListeners();
		}

		this._currentPageNumber = page;
		this.currentPageID      = uuid.v4();
	}

	get currentPage() {
		return this.pages[this.currentPageNumber];
	}

	isPageAnimating() {
		return this._postAnimationCallback != null;
	}

	@computed get hasPages() {
		const {currentPageNumber} = this; // Trigger

		return this.pages.length > 0;
	}

	createPage(pageConfig) {
		return new BookPage(this, pageConfig);
	}

	defaultPageConfig: any;
	async addPage(pageConfig?: any, showHoverPoint?: any) {
		const newIndex = this.pages.length;
		let newPage = _.assign({newIndex: newIndex, title: "Untitled"}, this.defaultPageConfig);

		if (pageConfig)
			Object.assign(newPage, pageConfig);

		this.pages.push(this.createPage(showHoverPoint != null ? Object.assign({}, newPage, {showHoverPoint}) : newPage));

		this.shouldTransitionFromLeft = false;
		this.currentPageNumber        = newIndex;
		await this.sendPageUpdate([newPage]);

		this._postAnimationCallback = () => {
			this.updateUrl();
		}
	}

	async deletePage( deleteIndex: number = this.currentPageNumber ) {
		const deletedPage = {index: deleteIndex, newIndex: -1 };
		this.pages.splice(deleteIndex, 1);

		this.shouldTransitionFromLeft = this.currentPageNumber > 0;
		if (deleteIndex === this.currentPageNumber) {
			this.currentPageNumber = Math.min(this.currentPageNumber, this.pages.length - 1);
		} else if (deleteIndex < this.currentPageNumber) {
			this.currentPageNumber = this.currentPageNumber - 1;
		}

		await this.sendPageUpdate([deletedPage]);
		this.finalizePageSwitch();
	}

	updateUrl() {
		routing.push(`${this.url}${this.url.indexOf("?") >= 0 ? "&" : "?"}page=${this.currentPageNumber + 1}`);
	}

	finalizePageSwitch() {
		//this._postAnimationCallback = () => {
		//this.currentPage.populatePage();
			this.updateUrl();
		//}
	}

	async reorderPage(from, to) {
		this.pages.forEach((p, i) => (p as any).oldIndex = i);
		this.pages.splice(to, 0, this.pages.splice(from, 1)[0]);

		const newCurrentPageIndex = this.pages.findIndex(p => (p as any).oldIndex == this.currentPageNumber);
		if (this.currentPageNumber != newCurrentPageIndex) {
			this._currentPageNumber = newCurrentPageIndex;
			this.updateUrl();
		}

		return await this.sendPageUpdate([{index: from, newIndex: to}]);
	}


	@action navigateToPage = (pageIndex: number) => {
		this.shouldTransitionFromLeft = pageIndex < this.currentPageNumber;
		this.currentPageNumber        = pageIndex;
		this.finalizePageSwitch();
	}

	isPageApplicable = (pageIndex: number) => {
		const page = this.pages[pageIndex];
		return true;
	}

	_templateCreationInProgress = false;
	async addTemplatePages(template, statePageKey) {

		if (this._templateCreationInProgress || this.pages.length > 0)
			return;

		try {
			this._templateCreationInProgress = true;

			// Add newIndex fields required by back-end
			template.outputPages.forEach((page, pageIndex) => {
				page["newIndex"]                 = pageIndex;
				(page as any).additionalControls = JSON.stringify(page.additionalControls);

				page.views.forEach((view, viewIndex) => {
					view["newIndex"] = viewIndex;
				})
			})

			let state       = await this.sendPageUpdate(template.outputPages);
			const statePage = statePageKey ? _.get(state, statePageKey) : state;
			statePage.forEach(page => this.pages.push(this.createPage(page)));

			this.shouldTransitionFromLeft = false;
			this.currentPageNumber        = 0;

			this._postAnimationCallback = () => {
				this.updateUrl();
			}
		}
		finally {
			this._templateCreationInProgress = false;
		}
	}

	isViewApplicable = (view: string) => {
		return true;
	}


	navigateToPreviousPage = () => {
		const previousPage = this.currentPageNumber - 1;
		previousPage != -1 && this.navigateToPage(previousPage);
	}

	navigateToNextPage = () => {
		const nextPage = this.currentPageNumber < this.pages.length - 1 ? this.currentPageNumber + 1 : -1;
		nextPage != -1 && this.navigateToPage(nextPage);
	}

	_postAnimationCallback;
	postAnimationCallback() {
		if (this._postAnimationCallback) {
			runInAction(this._postAnimationCallback);
			this._postAnimationCallback = null;
			return true;
		}
		else
			return false;
	};

}