import { AppIcon, QueryCard, ReportItemContextMenu, BadReportQuery, bp } from 'components'
import { Header, Tab, Container, EventEmitter } from "golden-layout";
import { api, utility, appIcons, Query, ReportQuery, ReportItem, ReportText, settings, ReportPage } from 'stores';
import * as css from './ReportItemLayoutComponent.css';
import { QueryPanel } from "../../query-tool/query-builder";
import { ReportTextComponent } from "../widgets/ReportTextComponent";
import { observer } from 'mobx-react';
import { autorun, computed, reaction, observable, makeObservable } from 'mobx';
import * as PropTypes from 'prop-types';

const { KeyCode } = utility;

//NOTE: can only contain serializable objects, no callbacks.
export interface ReportItemLayoutComponentProps {
	item?: ReportItem,
	pageItem?: ReportItem,
	showLayoutTab?: boolean,
	// Added by golden layout
	glContainer?: Container,

	dragDropManager: any;
	router: any;
}

@observer
export class ReportItemLayoutComponent extends React.Component<ReportItemLayoutComponentProps, {}> {
    static defaultProps = {
		allowEditTabTitle: false
	}

    /* These two variables exist for the (hacky!) purpose of reinitializing MCE when dragging around golden-layout */
    @observable mceKey = uuid.v4();
    @observable invalidate?: boolean;
    @observable isLayoutDragging?: boolean = false;
    queryPanel:QueryPanel;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const { isLayoutDragging, props: { pageItem, item, item: { report } } } = this;

		let component;
		if (item instanceof ReportQuery) {
			if (!item.queryId) {
				component = <BadReportQuery rq={item}/>
			} else if (isLayoutDragging) {
				component = <QueryCard query={item.query}/>
			}
			else {
				component = <QueryPanel ref={(r) => this.queryPanel = r} reportQuery={item} query={item.query} isLayoutDragging={this.isLayoutDragging} onLoaded={this.onQueryPanelLoaded}/>
			}
		}
		else if (item instanceof ReportText) {
			component = <ReportTextComponent key={this.mceKey} item={item} isLayoutDragging={this.isLayoutDragging}/>
		}

		return (
			<div id={`report-item-${item.id}`}
			         onContextMenu={this.onContextMenu}
			         className={classNames(
				         css.root,
				         {
					         [css.showTopBorder]: pageItem instanceof ReportPage && settings.report.showLayoutTabs,
					         [css.highlight]: report.mousedOverTreeItem == item,
					         [css.isLayoutDragging]: this.isLayoutDragging,
					         [css.hideToolbar]: !settings.report.showToolbars
				         }
			         )}>
				{component}
			</div>
		)
	}

    /**
	 Provide a report item context menu if the menu is not already handled by the rendered control
	 */
    private onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
		if (!utility.isHyperlink(e.target)) {
			bp.ContextMenu.show(<ReportItemContextMenu item={this.props.item} location='tab'/>, { left: e.clientX - 8, top: e.clientY - 8 });
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}

    componentDidUpdate(oldProps: ReportItemLayoutComponentProps) {
		// if (oldProps.view != null && this.props.view != null) {
		// 	if (oldProps.view.queryResultId !== this.props.view.queryResultId) {
		// 		// Update the tab
		//
		// 		if (this._tab != null) {
		// 			this.tryRenderCustomElements();
		// 		}
		// 	}
		// }
		//
		// if (oldProps.view !== this.props.view) {
		// 	//this.updateTabTitle()
		// }
	}

    componentDidMount() {
		// Race condition where golden layout does a setState(state.getState()) during setup that overrides
		// changes we may have made.
		/*setTimeout(() => {
		 // Retrieve link color
		 this.props.glEventHub.emit(ReportLayoutMessages.GET_LINK_COLOR_REQUEST, this.state.view.guid, this.state.view.key);
		 })*/

		const { glContainer, item } = this.props;

		glContainer.on('tab', this.onTabCreated)
		glContainer.on('hide', this.onHideContainer)
		glContainer.on('show', this.onShowContainer)
		glContainer.on('open', this.onOpenContainer)
		//glContainer.on('resize', this.onResize);

		// glContainer.layoutManager.on('itemCreated', () => {console.log('itemCreated()', this.props.item)})
		// glContainer.layoutManager.on('itemDestroyed', () => {console.log('itemDestroyed()', this.props.item)})

		// Stack handlers
		const grandparent = glContainer.parent.parent;
		if (grandparent) {
			glContainer.parent.parent.on('stateChanged', this.onStateChanged);
			glContainer.parent.parent.on('activeContentItemChanged', this.onActiveContentChanged);
		}

		document.addEventListener("keyup", this.documentKeyUp)

		const { tab } = glContainer;

		this.onTabCreated(tab)

		this._toDispose.push(autorun(this.updateTabTitle));
		this._toDispose.push(reaction(
			() => this.props.item.report.mousedOverTreeItem,
			(mousedOverItem) => {
				const { _tab, props: { item } } = this;

				if (_tab) {
					if (mousedOverItem == item) {
						_tab.element.addClass(css.highlight);
					}
					else {
						_tab.element.removeClass(css.highlight);
					}
				}
			}
		));
	}

    _toDispose: Function[] = [];

    componentWillUnmount() {
		this._toDispose.forEach(f => f());

		const { glContainer } = this.props;

		glContainer.unbind('tab', this.onTabCreated)
		glContainer.unbind('hide', this.onHideContainer)
		glContainer.unbind('show', this.onShowContainer)
		//glContainer.unbind('resize', this.onResize);

		const grandparent =glContainer.parent.parent;
		if (grandparent) {
			try {
				grandparent.unbind('stateChanged', this.onStateChanged);
				grandparent.unbind('activeContentItemChanged', this.onActiveContentChanged);
			}
			catch (err) {
				console.error(err);
			}
		}

		document.removeEventListener("keyup", this.documentKeyUp)

		this.unmountCustomElements();

		this._detachTabEvents();

		this.animationsOff && this.animationsOff();
	}

    animationsOff
    onQueryPanelLoaded = () => {
		if (this.queryPanel) {
			let animationNodes = $(ReactDOM.findDOMNode(this) as Element).find('.bp3-navbar').add(ReactDOM.findDOMNode(this.queryPanel.sidebarRef) as Element);

			if (this.animationsOff)
				this.animationsOff();

			// Trigger a resize after animation when the query sidebar or toolbar are toggled
			animationNodes.on("transitionend webkitAnimationEnd", () => {
				this.props.glContainer.emit( 'resize' )
			});

			this.animationsOff = () => animationNodes.off("transitionend webkitAnimationEnd");
		}
	}

    static childContextTypes: React.ValidationMap<any> = {
		glContainer: PropTypes.shape({}),
		dragDropManager: PropTypes.shape({}),
		router: PropTypes.object
	}

    getChildContext() {
		return {
			glContainer: this.props.glContainer,
			dragDropManager: this.props.dragDropManager(),
			router: this.props.router
		}
	}

    @observable _tab: Tab;

    updateTabTitle = () => {
		if (this._tab) {
			this._tab.setTitle(this.props.item.label);
		}
	}

    _detachTabEvents = () => {
		if (this._tab) {
			const dragListener = (this._tab as any)._dragListener as EventEmitter;

			if (dragListener) {
				dragListener.off('dragStart', this.onTabDragStart);
				dragListener.off('dragStop', this.onTabDragEnd);
			}
		}
	}

    /**
	 * Emitted when a tab for this container is created. Can be called more than
	 * once (e.g. when a new tab is created as result of dragging the item to a different position).
	 */
    onTabCreated = (tab: Tab) => {
		//console.log('onTabCreated()', this.props.item.label)
		this._detachTabEvents();
		this._tab = tab;
		if (tab) {
			this.updateTabTitle();

			let dragListener = (this._tab as any)._dragListener as EventEmitter;

			dragListener.on('dragStart', this.onTabDragStart);
			dragListener.on('dragStop', this.onTabDragEnd);

			this.renderCustomTabElements();
		}
	}

    onTabDragStart = () => {
		//console.log('onTabDragStart()', this.props.item.label)
		const glContainer = (this.props.glContainer as any);
		// Golden Layout doesn't correctly progagate the size change for items being dragged, so let's pull the correct size and perform that update manually.
		// Note: The setSize method throws an error because the item isn't bound to the layout tree, so we're using the internal _$setSize method here which bypasses the layout issues.
		glContainer._$setSize(glContainer._element.width(), glContainer._element.height());
		this.mceKey = uuid.v4();
		this.isLayoutDragging = true;
	}

    onTabDragEnd = () => {
		//console.log('onTabDragEnd()')
		this.isLayoutDragging = false;
		this.forceTextReload();
	}

    onActiveContentChanged = () => {
		this.updateStoredLocation();
	}
    stackIndex;
    parentContentItems = [];
    siblingContentItems = [];

    /**
	 * Store the current location (parents and index) of the contentItem
	 */
    updateStoredLocation = _.debounce(() => {
		// console.log('updateStoredLocation()', this.props.item)
		if (!this.props.glContainer.layoutManager.isSubWindow) {
			let itemStack = this.props.glContainer.parent.parent;

			//if (index === -1)
			//    index = itemStack.parent.contentItems.indexOf(this.props.glContainer.parent);
			if (itemStack.isStack) {
				let index = itemStack.parent.contentItems.indexOf(itemStack);
				if (index >= 0) {
					this.stackIndex = index;

					this.siblingContentItems = itemStack.parent.contentItems.filter((item) => item !== itemStack);

					this.parentContentItems = [];
					let child = itemStack;
					while (child.parent) {
						child = child.parent;
						this.parentContentItems.push(child);
					}

					//if (itemStack.config.content[0])
					//    console.log(itemStack.config.content[0].title + this.stackIndex);
				}
			}
		}
	}, 100);


    private documentKeyUp = (e) => {
		// Cancel the drag on escape and put the dragged element back into its original location
		if (e.keyCode === KeyCode.Escape) {
			let contentItem = this.props.glContainer.parent;
			let dragProxy = contentItem.parent as any;
			let dragListener = dragProxy._dragListener;

			if (dragListener && dragListener._bDragging) {
				dragListener._bDragging = false;
				dragListener.onMouseUp();
				let layoutManager = this.props.glContainer.layoutManager as any;
				let parent = this.parentContentItems[0];

				//dragListener.destroy();

				// Golden layout removes parents that have a single child during drag and bubbles that child up the tree
				// We can detect this condition when our component has stored parent that is no longer valid.
				// In this case we need to re-add the removed parent and move the previous sibling to its previous
				// home.
				let parentStillAttached = this.findContentItemWithValidParent(0);
				if (parentStillAttached !== this.parentContentItems[0] && this.siblingContentItems.length === 1) {
					let sibling = this.siblingContentItems[0];
					parentStillAttached.replaceChild(sibling, parent);
					parent.addChild(sibling);
				}

				// Add a stack for our component and re-add them to the previous parent.
				let stack = layoutManager.createContentItem({ type: 'stack' }, parent);
				stack.addChild(contentItem);
				if (parent.isRoot && parent.contentItems.length >= 1) {
					parent.contentItems[0].addChild(contentItem);
				} else {
					parent.addChild(stack, this.stackIndex);
				}

				// dragProxy._originalParent.addChild(contentItem);
				layoutManager.dropTargetIndicator.hide();
				dragProxy.element.remove();

				// update the stored location with current position.
				this.updateStoredLocation();
			}
		}
	}

    /**
	 * Find the first valid parent that is still connected in the layout tree
	 * @param level The ancestor level, 0 for parent, 1 for grand parent, 2 for great grand parent, etc
	 * @returns {any}   The first valid parent
	 */
    findContentItemWithValidParent(level) {
		let contentItem = this.parentContentItems[level];
		let parentLevel = level + 1;
		let parentContentItem = parentLevel < this.parentContentItems.length ? this.parentContentItems[parentLevel] : null;

		if (contentItem.isRoot) {
			return contentItem;
		} else if (parentContentItem && parentContentItem.contentItems.indexOf(contentItem) >= 0) {
			return contentItem;
		} else {
			return this.findContentItemWithValidParent(parentLevel);
		}
	}

    onHideContainer = () => {
		//console.log('onHideContainer()', this.props.item)

		// Instead of deleting and recreating the toolbar component as the user switches between tabs
		// we instead toggle the display state to be more efficient.
		if (this.toolbarComponent) {
			this.$toolbarListItem.addClass("hide")
		}

		this.isLayoutDragging = false;
		this.forceTextReload()
	}

    forceTextReload = () => {
		setTimeout(() => this.mceKey = uuid.v4(), 20);
	}

    initialLoad = true;

    onShowContainer = () => {
		let header = this.header;

		// Only show toolbar for tabs that are attached to an header
		// e.g. don't show tools for tabs that are being dragged
		if (this.toolbarComponent && header) {
			this.$toolbarListItem.removeClass("hide")
		}

		//console.log('onShowContainer', this.props.item)
		if (this.initialLoad) {
			this.initialLoad = false
		}
		else {
			this.forceTextReload();
		}
	}

    onOpenContainer = () => {
		// console.log('onOpenContainer()')
	}

    onResize = () => {
		//console.log(this.props.report.findview.name, 'onResize()')
	}

    toolbarComponent = null;
    extraTabItems = null;
    extraTabItemsElem: HTMLElement = null;

    //toolbarElement: HTMLElement = null;
    $toolbarListItem: JQuery = null;
    toolbarProps: any = null;

    get header(): Header {
		return (this.props.glContainer as any).parent.parent.header;
	}

    tryRenderCustomElements = () => {
		// If a toolbar component was already rendered for this tab, detach it and create a new one
		// in the current header.
		this.unmountCustomElements();

		this.renderCustomTabElements();
	}

    unmountCustomElements() {
		if (this.extraTabItems) {
			//ReactDOM.unmountComponentAtNode(this.extraTabItemsElem)
			this.extraTabItemsElem = null;
		}

		if (this.toolbarComponent) {
			//ReactDOM.unmountComponentAtNode(this.$toolbarListItem[0])
			this.$toolbarListItem = null;
		}
	}

    renderCustomTabElements = () => {
		this.extraTabItemsElem = $('<div class="extra-tab-items"></div>').get(0);
		const $extraTabContainer = $(`<li class="custom-tab" style="width:initial"></li>`);
		$extraTabContainer.append(this.extraTabItemsElem);

		this.renderExtraTabItems();

		const { tab } = this.props.glContainer;

		const $title = tab.element.find('.lm_title');
		//ReactDOM.render(<span className='lm_title custom'>{this.props.item.label}</span>, tab.element[0]);

		$title.before(this.extraTabItemsElem);

		// let header = this.header;
		//
		// if (header && RENDER_CUSTOM_GL_HEADER) {
		//     if (this.$toolbarListItem == null) {
		//         this.$toolbarListItem = $(`<li class="custom-toolbar" style="width:initial"></li>`);
		//         header.controlsContainer.prepend(this.$toolbarListItem);
		//     }
		//
		//     this.toolbarProps = toolbarProps;
		//     let component     = (
		//         <div className="report-item-view-toolbar ">
		//             <QueryReportViewToolbarItems {...this.toolbarProps} canUnlink={true}/>
		//         </div>
		//     )
		//
		//     this.toolbarComponent = ReactDOM.render(component, this.$toolbarListItem.get(0));
		// }
	}

    renderExtraTabItems = () => {
		if (this.extraTabItemsElem) {
			const { item } = this.props;
			this.extraTabItems = ReactDOM.render(<CustomTabIcons item={item}/>, this.extraTabItemsElem);
		}
	}

    onStateChanged = () => {
		this.updateStoredLocation();
	}
}

@observer
class CustomTabIcons extends React.Component<{ item: ReportItem }, {}> {
	render() {
		const { item } = this.props;
		//const linkColor = item.report.linkColors[item.queryResultId];

		return <div className={css.customTabIcon} key={item.id}>
			{item instanceof ReportQuery && <AppIcon icon={appIcons.queryTool.views.query}/>}
			{item instanceof ReportText && <AppIcon icon={appIcons.report.items.text}/>}
		</div>;
	}
}