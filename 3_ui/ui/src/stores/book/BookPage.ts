import { action, computed, observable, reaction, runInAction, makeObservable } from 'mobx';
import {IOPage} from '../io';
import {routing} from '../routing';
import {Book} from './Book';
import {BookView} from './BookView';
import {ApiView} from './model';


export class BookPage<BookViewType extends BookView = BookView> {
	constructor(protected book: Book, page) {
        makeObservable(this);
        Object.assign(this, page);

        this.pageId = uuid.v4();
        this.populatePage();
    }

	@observable selectedViews: BookViewType[]       = [];
	@observable scrollMode: boolean                 = false;
	@observable showPageTitle: boolean              = true;
	@observable renderedTime: number                = null;
	@observable showViewToolbars: boolean           = true;
	@observable showViewCaption: boolean            = false;

	pageId: string = null;

	@observable title: string;
	index: number;
	additionalControls: string = "";
	views: ApiView[] = [];
	oldIndex: number; // transient property used during re-order

	get pageNumber() {
		return this.book.pages.indexOf(this);
	}

	@computed get _userOptions() {
		let userOptions = {};
		this.selectedViews.forEach(v => userOptions[v.id] = v.userOptions);
		return userOptions;
	}

	isViewActive(name) {
		return this.selectedViews.findIndex(v => v.name == name) != -1;
	}

	getView(id: string) {
		return this.selectedViews.find(v => v.id == id);
	}

	getViewIndex(id: string) {
		return this.selectedViews.findIndex(v => v.id == id);
	}

	getViewUserOptions(id: string) {
		let userOptions = this._userOptions[id];

		return userOptions;
	}

	@computed get hasOuputView() {
		return this.selectedViews.find(v => !this.book.availableViews[v.name].isInput) != null;
	}

	@action updateUserOptions(id: string, userOptions) {
		let view = this.getView(id);
		view.userOptions = userOptions;

		if (this.selectedViews.length > 0)
			this.book.sendPageUpdate([{index: this.pageNumber, views: [{index: this.selectedViews.indexOf(view), controls: JSON.stringify(userOptions)}] }]);
	}

	@computed get pageOptions() {
		return {
			showPageTitle: this.showPageTitle,
			scrollMode: this.scrollMode,
			showViewToolbars: this.showViewToolbars,
			showViewCaption: this.showViewCaption
		};
	}

	setPageOptions_debounced = _.debounce(() => {
		this.book.sendPageUpdate([{index: this.pageNumber, additionalControls: JSON.stringify(this.pageOptions)}]);
	})

	createView(name: string, view?: ApiView) {
		return new BookView(this.book, name, view != null ? (view.controls && view.controls != "" ? JSON.parse(view.controls) : null) : null) as BookViewType;
	}

	populatePage() {
		this.additionalControls != "" && this.loadPageOptions(JSON.parse(this.additionalControls));

		if (this.views.length > 0)
			this.selectedViews = this.views.map(view => this.createView(view.view, view));
	}

	@action loadPageOptions(state: { scrollMode: boolean, showPageTitle: boolean, showViewToolbars?: boolean, showViewCaption?: boolean}) {
		state.showPageTitle != null && (this.showPageTitle = state.showPageTitle);
		state.scrollMode != null && (this.scrollMode = state.scrollMode);
		state.showViewToolbars !== undefined && (this.showViewToolbars = state.showViewToolbars);
		state.showViewCaption !== undefined && (this.showViewCaption = state.showViewCaption);
	}

	/*
	 * Override to trigger custom logic after view is inserted.
	 */
	async afterInsertView() {

	}

	@action insertView(name: string) {
		if (!this.book.isLoading)
			this.book.viewAnimationInProgress = true;

		// Update in setTimeout to give view a chance to perform any pre animation rendering. e.g. animation loader in EF chart.
		return new Promise<void>( (resolve) => setTimeout(() => {
			runInAction(async () => {
				let {selectedViews} = this;

				selectedViews.push(this.createView(name));
				let views = [{view: name, newIndex: selectedViews.length - 1}];

				await this.book.sendPageUpdate([{index: this.pageNumber, views: views}] );

				await this.afterInsertView();

				resolve();
			})
		}))
	}

	@action async reorderView(from, to) {
		// this.selectedViews.forEach((v, i) => v.oldIndex = i);
		this.selectedViews.splice(to, 0, this.selectedViews.splice(from, 1)[0]);

		await this.book.sendPageUpdate([{index: this.pageNumber, views: [{index: from, newIndex: to}]}] );
	}

	@action async deleteView(index: number) {
		this.selectedViews.splice(index, 1);
		await this.book.sendPageUpdate([{index: this.pageNumber, views: [{index: index, newIndex: -1}]}] );
	}

	/**
	 * Determines if a view should be rendered.
	 * Override to specify custom behavior.
	 * @param id
	 */
	viewHasData(id) {
		return true;
	}

	async updatePageTitle(title) {
		return await this.book.sendPageUpdate([{index: this.pageNumber, title}]);
	}

	invalidateCache() {
		this.renderedTime = null;
	}

	_toDispose = [];
	setupPageListeners() {
		this._toDispose.push(reaction(() => this.pageOptions, this.setPageOptions_debounced));
	}

	removePageListeners() {
		this._toDispose.forEach(f => f());
	}
}
