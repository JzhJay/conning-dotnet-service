import { computed, observable, reaction, trace, makeObservable, action } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {CSSTransition, } from 'react-transition-group';
import { site} from 'stores';
import {Book} from 'stores/book/Book';
import {BookPage} from 'stores/book/BookPage';
import {BookView} from 'stores/book/BookView';
import {KeyCode} from 'utility';
import {ErrorBoundary, LoadingIndicator} from 'components';
import FlipMove from 'react-flip-move';
import * as css from './BookComponent.css';

interface MyProps {
	book: Book;
	renderView: (page: BookPage, view: BookView, delayRender: boolean) => JSX.Element;
	renderValidations: () => JSX.Element;
	renderTemplate?: () => JSX.Element;
	renderProgress?: (page: BookPage) => JSX.Element;
	viewClasses: (page: BookPage, view: BookView) => string;
}


const PAGE_TRANSITION = 500 + 25; // + buffer
const PAGE_CACHE_LIMIT = 5; // Minimum of 1 required!

const FALLBACK_VIEW_HEIGHT = 200; // Height when view template doesn't specify a height

@observer
export class BookComponent extends React.Component<MyProps, {}> {
    @observable exitingPage = null;
    @observable firstPageRender = true;
    @observable pageAnimationInProgress = null;

    viewsRef = null;
    viewsNode = null;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    static get css() {
		return css;
	}

    componentDidMount(): void {
		action(() => this.firstPageRender = false)();

		if (this.viewsRef) {
			this.viewsNode = ReactDOM.findDOMNode(this.viewsRef) as HTMLElement;
		}

		window.addEventListener("resize", this.onResize, false);
	}

	@action onResize = () => {
		// Remove all cached pages
		this.renderPages.forEach(page => {
			if (page != this.props.book.currentPage)
				page.renderedTime = null;
		})
	}

	estimatedViewsScale(page: BookPage) {
		const {book} = this.props;

		// Calculate the scale needed to expand active views so they fill the entire height when scroll mode is enabled.
		if (this.viewsNode) {
			let viewsNode = this.viewsNode;
			let total     = _.sum(page.selectedViews.map(v => book.availableViews[v.name].height * (viewsNode.offsetWidth + site.verticalScrollbarWidth) || FALLBACK_VIEW_HEIGHT));

			return total < viewsNode.offsetHeight ? viewsNode.offsetHeight / total : 1;
		}
		else {
			return 1;
		}
	}


    @computed get renderPages() {
		const {book} = this.props;
		const {currentPageID} = book; // Trigger

		// Retrieve the list of pages which includes the current page and the most recently visited cached pages up to the cache limit.
		let cachedPages = book.pages.filter(page => page.renderedTime && page != book.currentPage).sort((a, b) => b.renderedTime - a.renderedTime);
		return cachedPages.slice(0, PAGE_CACHE_LIMIT).concat(book.currentPage ? [book.currentPage] : []);
	}

    render() {
		const {book} = this.props;
		const {currentPageID} = book; // Trigger render

		return <div className={classNames(css.root, {[css.fromLeft]: book.shouldTransitionFromLeft})} ref={(r) => this.viewsRef = r}>
			{this.renderPages.map((page, i) => <PageCache page={page} key={page.pageId} bookComponent={this}/>)}
			{book.pages.length == 0 && this.props.renderTemplate && this.props.renderTemplate()}
		</div>
	}

    componentWillUnmount(): void {
		window.removeEventListener("resize", this.onResize, false);
	}
}

@observer
class PageCache extends React.Component<{bookComponent: BookComponent, page: BookPage}, {}> {
	isExiting = false;
	pageRef = null;
	_toDispose = [];
	resetResizeSensorsTimeout = null;

	componentDidMount(): void {
		const {book} = this.props.bookComponent.props;
		this.setRenderedTime();

		this._toDispose.push(reaction(() => book.currentPage, () => {
			this.setRenderedTime();

			if (book.currentPage == this.props.page) {
				// reset resize sensor scroll position which somehow gets reset to 0 when switching pages.
				// ResizeSensor sets these internally every time there is a scroll and relies on these initial values to detect resize. (WEB-2574)
				let $resizeSensors = $(ReactDOM.findDOMNode(this)).find(".resize-sensor-expand, .resize-sensor-shrink");

				this.resetResizeSensorsTimeout = setTimeout(() => {
					$resizeSensors.scrollTop(100000);
					$resizeSensors.scrollLeft(100000);
				}, PAGE_TRANSITION + 500);
			}
		}))
	}

	setRenderedTime() {
		const {book} = this.props.bookComponent.props;
		const {page} = this.props;

		// Wait a couple seconds to avoid caching pages that wern't fully rendered before navigating away.
		setTimeout(action(() => {
			if (book.currentPage == page)
				page.renderedTime = Date.now();
		}), 2000);
	}

	render() {
		const {bookComponent, bookComponent: {props: {book}}, page} = this.props;
		const {isExiting} = this;
		const {currentPageID} = book; // Trigger render

		return <CSSTransition timeout={PAGE_TRANSITION} classNames={classNames(css.root)} in={book.currentPage == page} appear={!bookComponent.firstPageRender} unmountOnExit={false}
		                      key={page.pageId}
							  onEntering={() => {bookComponent.pageAnimationInProgress = true;}}
							  onEntered={() => {
								  bookComponent.firstPageRender = false;
								  bookComponent.pageAnimationInProgress = false;
							  }}
		                      onExit={() => {
			                      bookComponent.pageAnimationInProgress = true;
			                      this.isExiting = true;
			                      // Adding/removing class outside of React to avoid triggering re-render which screws up animation.
			                      this.pageRef && $(this.pageRef).removeClass(css.hidePage);
		                      }}
		                      onExited={() => {
			                      this.isExiting = false;
			                      this.pageRef && $(this.pageRef).addClass(css.hidePage);
			                      bookComponent.pageAnimationInProgress = false;
		                      }}
		>
			{state => (
			    <div className={classNames(css.pageCache, {[css.hidePage]: book.currentPage != page && !isExiting})} ref={r => this.pageRef = r}>
					<BookPageComponent bookComponent={bookComponent} state={state} page={page} shouldAnimate={!bookComponent.firstPageRender}/>
				</div>
			)}
		</CSSTransition>
	}

	componentWillUnmount(): void {
		this.props.page.renderedTime = null;
		this._toDispose.forEach(d => d());
		clearTimeout(this.resetResizeSensorsTimeout);
	}
}

@observer
export class BookPageComponent extends React.Component<{bookComponent: BookComponent, page: BookPage, state: string, shouldAnimate: boolean}, {}> {
    // shouldComponentUpdate(nextProps, nextState: Readonly<{}>, nextContext: any): boolean {
    // 	return (this.renderedPage == null || this.renderedPage == nextProps.bookComponent.props.book.currentPage);
    // }

    private _toDispose = [];
    delayRender = true;
    transitionDuration = PAGE_TRANSITION;
    animationTimer = null;
    firstViewsRender = true; // Track initial rendering of views so we can disable animation for faster page loads.

    constructor(
        props: {bookComponent: BookComponent, page: BookPage, state: string, shouldAnimate: boolean}
    ) {
        super(props);
        makeObservable(this);

		const {book}      = this.props.bookComponent.props;
		this.renderedPage = this.props.page;

		if (this.props.shouldAnimate) {
			this._toDispose.push(reaction(() => this.props.bookComponent.pageAnimationInProgress, () => {
				if (!this.props.bookComponent.pageAnimationInProgress && this.delayRender) {
					this.delayRender = false;
					book.postAnimationCallback();

					// Force update if there are no animation callbacks to trigger re-render
					if (book.postAnimationCallback() == false)
						this.forceUpdate();
				}
			}));
		}
		else {
			this.delayRender = false;
		}
	}

    @observable delayView = null;
    delayViewRender = (id) => {
		// Show animation loader when enabling new view as to not incur an expensive render during animation.
		this.delayView = id;
		setTimeout(() => this.delayView = null, this.transitionDuration);
	}

    renderedPage: BookPage = null; // The page the component pointed to when first mounted. This should never change.

    refs = {};

    render() {
		const {bookComponent}                        = this.props;
		const {book, book:{viewAnimationInProgress}} = bookComponent.props;
		const {renderedPage}                         = this;

		return <div className={css.page}>
			<ErrorBoundary>
				<PageTitle page={renderedPage} />
				<FlipMove duration={500 /*Animates the validation sidebar*/}
				               style={{display: "flex", height: "100%", overflow: "hidden"}}
				               appearAnimation="none"
				               enterAnimation={{from: { transform: 'scaleX(0)', transformOrigin: 'right center' },
					               to: { transform: '', transformOrigin: 'right center' }}}
				               leaveAnimation={{from: { transform: 'scaleX(1)', transformOrigin: 'right center' },
					               to: { transform: 'scaleX(0)', transformOrigin: 'right center' }}}>
					{!this.delayRender ?
					 <div className={classNames(css.views)}
						 /*Key is intentionally not specified to avoid animating views on initial load */
						  ref={(r) => bookComponent.viewsRef = r}>
						 {bookComponent.props.renderProgress && bookComponent.props.renderProgress(renderedPage) ||
						 <FlipMove className={classNames(css.views, {[css.allowScroll]: renderedPage.scrollMode})}>
							 {renderedPage.selectedViews.filter(v => book.isViewApplicable(v.name)).map((view, i) => <div className={css.view} key={`${view.id}`}>
								 <BookViewComponent bookComponent={bookComponent} bookPageComponent={this} book={book} view={view} shouldDelayRender={this.firstViewsRender}/>
							 </div> )}{(this.firstViewsRender = false)}
						 </FlipMove>}
					 </div> : <LoadingIndicator className={css.pageLoader} active={true}></LoadingIndicator>}
					{bookComponent.props.renderValidations()}
				</FlipMove>
			</ErrorBoundary>
		</div>
	}

    componentWillUnmount(): void {
		clearTimeout(this.animationTimer);
		this._toDispose.forEach(d => d());
	}
}



@observer
export class BookViewComponent extends React.Component<{bookComponent: BookComponent, bookPageComponent: BookPageComponent, book: Book, view: BookView, shouldDelayRender: boolean}, {}> {
	delayRender = true;
	delayRenderTimer;

	constructor(props) {
		super(props);

		if (this.props.shouldDelayRender) {
			this.delayRenderTimer = setTimeout(() => {
				this.delayRender = false;
				this.forceUpdate();
			}, 500);
		}
		else {
			this.delayRender = false;
		}
	}

	componentWillUnmount() {
		if (this.delayRenderTimer) {
			clearTimeout(this.delayRenderTimer);
		}
	}

	render() {
		const {renderedPage}                                 = this.props.bookPageComponent;
		const {view, bookComponent, bookPageComponent, book} = this.props;

		return <div
			className={classNames(css.view, bookComponent.props.viewClasses(renderedPage, view), {
				[css.hideToolbars] : renderedPage.showViewToolbars === false,
				[css.hoverToolbars] : renderedPage.showViewToolbars === null
			})}
            ref={(r) => {
	            this.refs = Object.assign({}, this.refs, {[view.id]:r});
            }}
            style={{
            	height: renderedPage.scrollMode && book.availableViews[view.name].height ? `calc(100vw * ${book.availableViews[view.name].height * bookComponent.estimatedViewsScale(renderedPage)}` : null,
	            flex:   !renderedPage.scrollMode && book.availableViews[view.name].height ? book.availableViews[view.name].height * 5 : null
            }}
		>
			<BookViewRenderWrapper bookComponent={bookComponent} page={renderedPage} view={view} delayRender={bookPageComponent.firstViewsRender || this.delayRender}/>
		</div>
	}
}

/*
* Since @observer component's are not allowed to implement sCu(shouldComponentUpdate) this class acts as a breaker to prevent react updates to offscreen views.
* Note however that @observer child components will still update from observed changes.
* *
* */
class BookViewRenderWrapper extends React.Component<{bookComponent: BookComponent, page: BookPage, view: BookView, delayRender: boolean}, {}> {
	shouldComponentUpdate(nextProps, nextState: Readonly<{}>, nextContext: any): boolean {
		const isPageVisible = this.props.bookComponent.props.book.currentPage.getView(this.props.view.id) != null;

		if (this.props.delayRender && !nextProps.delayRender && !isPageVisible) {
			// If the user navigates from the page while we are transitioning from delay render to rendering the view, then we need to invalidate the page
			// to avoid caching unrendered views.
			this.props.page.renderedTime = null;
		}

		return isPageVisible;
	}

	render() {
		const {view, bookComponent, page, delayRender} = this.props;
		return bookComponent.props.renderView(page, view, delayRender);
	}
}


@observer
class PageTitle extends React.Component<{page: BookPage}, {}> {

	_inputRef: HTMLInputElement;
	_dispose: Function[] = [];

	componentDidMount() {
		this._dispose.push(reaction(() => this.props.page.title, newTitle => {
			if (this._inputRef) {
				if (this._inputRef.value != newTitle) {
					this._inputRef.value = newTitle;
				}
			}
		}));
	}

	componentWillUnmount() { this._dispose.forEach(d => d()); }

	updateTitle = (event) => {
		this.props.page.updatePageTitle(event.target.value);
	}

	onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === KeyCode.Enter) {
			this.updateTitle(e);
		}
	}

	render() {
		const {page} = this.props;

		return <CSSTransition timeout={500} classNames={css.pageTitle} in={page.showPageTitle} unmountOnExit={true}>
			<div className={css.pageTitle}><input defaultValue={page.title} onBlur={this.updateTitle} onKeyDown={this.onKeyDown} ref={(r) => this._inputRef = r}/></div>
		</CSSTransition>
	}
}