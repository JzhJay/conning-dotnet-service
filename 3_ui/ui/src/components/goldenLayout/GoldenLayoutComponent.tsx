// import './GoldenLayoutComponent.scss'
import * as css from './GoldenLayoutComponent.css';

import { ResizeSensor, LoadingIndicator } from "components";
import { observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import {i18n} from 'stores';

import * as GoldenLayout from 'golden-layout'
import { Tab, ContentItem, ItemConfig, Config } from 'golden-layout';

interface MyProps {
	className?: string;
	activeKey?: string;
	glConfig?: Config;
	content: ItemConfig;
	registerComponents: (GoldenLayout) => void;
	onTabContextMenu?: (e: MouseEvent, tab: Tab) => void;
	//onTabIcon?: (key: string) => SystemIcon;
	onTabCreated?: (tab: Tab) => void;
	onRenameViaTab?: { done: Function, cancel: Function, start: Function, valueChanged: (value: string) => void };
	onStateChanged?: () => void;
	resizeDebounceMs?: number;
}

const defaultConfig: Config = {
	//https://golden-layout.com/docs/Config.html

	settings: {
		showCloseIcon: false,
		constrainDragToContainer: false,
		selectionEnabled: false
	},

	dimensions: {
		headerHeight: 23,
		borderWidth: 3,
		dragProxyWidth: 3 / 4 * 720,
		dragProxyHeight: 720,

	},
	//content: <div>GoldenLayoutComponent - Set <b>props.content</b> to do more.</div>
};

@observer
export class GoldenLayoutComponent extends React.Component<MyProps, {}> {
    @observable loading = true;
    @observable isUpdatingLayout = false;
    @observable initialized = false;   // The golden layout library sets itself to initialized but the stateChanged() event propogates async.  Thus, we need to track - ourselves! - that the layout has actually fully initialized
    isDragging = false;  // Do not make this a state property, we don't want to rerender

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const { props: { className }, loading, isUpdatingLayout } = this;

		return (<div className={classNames(css.goldenLayoutComponent, className)}>
			{loading && <LoadingIndicator text={!isUpdatingLayout ?
			                                    i18n.common.MESSAGE.LOADING :
			                                    i18n.intl.formatMessage({defaultMessage:`Updating Layout...`, description:"[GoldenLayoutComponent] the message let user know UI is updating layout"})}/> }
		</div>)
	}

    static defaultProps = {
		resizeDebounceMs: 1000 / 60, // 60fps
	}

    goldenLayout: GoldenLayout;
    sensor: ResizeSensor;
    _tabHandler: TabHandler;

    componentDidMount() {
		this.initialize();

		const node = ReactDOM.findDOMNode(this);
		this.sensor = new ResizeSensor(node, this.onResize);
	}

    private guid = uuid.v4();

    componentDidUpdate(oldProps: MyProps) {
		console.log('goldeLayout didUpdate ', this.guid)
		const {goldenLayout: gl, props: {glConfig}} = this;

		gl && _.merge(this.goldenLayout.config, glConfig);

		if (gl && oldProps.content !== this.props.content && gl.root) {
			this.isUpdatingLayout = true;
			this.loading = true;

			// Note: This timeout is absolutely required. For some reason, attempting the replace synchronously results in React rendering to a detached DOM tree and generates a null component when Golden Layout
			// attempts to render the component via ReactDOM.render resulting in null pointer errors. WEB-1836
			window.setTimeout(() => {
				gl.root.replaceChild(gl.root.contentItems[0], this.props.content);
			})

			this.isUpdatingLayout = false;
			this.loading = false;
		}
		else {
			// We avoid deep comparing
			// because the content might have been updated yet doesn't require a reload. e.g. changing
			// the title.
			if (this.getItemKey(oldProps.content) !== this.getItemKey(this.props.content)) {
				this.initialize();
			}

			for (let item of _.uniq(this.itemsToResize)) {
				this.triggerResize(item);
			}
			this.itemsToResize = [];
		}
	}

    componentWillUnmount() {
		//console.log('unmount ', this.guid)
		try {
			this._tabHandler.detach();
			this.sensor.detach();
			if (this.goldenLayout != null) {
				this.goldenLayout.destroy();
			}
		}
		catch (err) {
			console.error(err);
		}
	}

    initialize() {
		this.loading = true;

		if (this.goldenLayout != null) {
			this.goldenLayout.destroy();
			this.goldenLayout = null;
		}

		let config: Config = _.merge({}, defaultConfig, this.props.glConfig);

		//const fnGoldenLayout = require('lib/golden-layout/goldenlayout') as GoldenLayoutFn;
		config.content = [this.props.content];
		this.goldenLayout = new GoldenLayout(config, ReactDOM.findDOMNode(this) as Element);

		this.props.registerComponents(this.goldenLayout);
		this.goldenLayout.on('initialised', () => {
			this.hookStackEvents(this.goldenLayout.root.contentItems)

			// Fire a resize
			this.onResize();

			this.initialized = true;
		}, this);

		if (this.props.onStateChanged) {
			this.goldenLayout.on('stateChanged', this.props.onStateChanged)
		}

		// this.goldenLayout.on('stateChanged', (e) => {
		// 	//console.log('stateChanged', e);
		// })
		//
		// this.goldenLayout.on('componentCreated', (e) => {
		// 	//console.log('componentCreated', e);
		// })


		this._tabHandler = new TabHandler(this);

		window.setTimeout(() => {
			this.goldenLayout.init();
			this.loading = false;
		})
	}

    onResize = _.debounce(() => {
		if (this.goldenLayout != null && this.goldenLayout.isInitialised) {
			this.goldenLayout.updateSize();
		}
		else {
			this.onResize();
		}
	}, this.props.resizeDebounceMs, { leading: true })

    hookStackEvents(contentItems: ContentItem[]) {
		for (let c of contentItems) {
			if (c.type === 'stack') {
				c.on('activeContentItemChanged', (a) => {
					this.triggerResize(c);
				})
			}

			// if (c.container != null) {
			//     c.container.on('tab', this.onTabCreated)
			// }

			this.hookStackEvents(c.contentItems)
		}
	}

    getItemKey(item: ItemConfig) {
		if (item.type === "stack" && item.content.length === 1) {
			return item.content[0].id;
		} else {
			return item.id;
		}
	}

    itemsToResize = [];

    findContentItem(key: string): ContentItem {
		return this.findContentItemRecurse(this.goldenLayout.root.contentItems, key);
	}

    findContentItemRecurse(contents: ContentItem[], key: string): ContentItem {
		let foundItem: ContentItem = null;

		for (let contentItem of contents) {
			if (contentItem.config && contentItem.config.id === key) {
				foundItem = contentItem;
				break;
			}
			else if (contentItem.contentItems) {
				foundItem = this.findContentItemRecurse(contentItem.contentItems, key);

				if (foundItem) {
					break;
				}
			}
		}

		return foundItem;
	}

    // setActiveTab() {
    // 	let key = this.props.activeKey;
    //
    // 	console.debug('setActiveTab()', key);
    //
    // 	if (this.goldenLayout && this.goldenLayout.root) {
    // 		let contentItem = this.findContentItem(key);
    //
    // 		if (contentItem && contentItem.parent && contentItem.parent.isStack) {
    // 			contentItem.parent.setActiveContentItem(contentItem);
    //
    // 			// Hide all page tabs that aren't siblings of the active tab
    // 			for (let tab of contentItem.parent.header.tabs) {
    // 				if (tab.contentItem === contentItem) {
    // 					tab.element.removeClass("hide");
    // 				} else if (!_.isEqual(tab.contentItem.config.key.split(".").slice(0, -1), key.split(".").slice(0, -1))) {
    // 					tab.element.addClass("hide");
    // 				}
    // 			}
    //
    // 			this.itemsToResize.push(contentItem)
    // 		}
    // 	}
    // }

    triggerResize(contentItem: ContentItem) {
		if (contentItem != null) {
			if (contentItem.element) {
				contentItem.element.trigger('resize');
			}

			if (contentItem.contentItems) {
				for (let item of contentItem.contentItems) {
					this.triggerResize(item);
				}
			}
		}
	}
}

class TabHandler {
	constructor(private component: GoldenLayoutComponent) {
		component.goldenLayout.on('tabCreated', this.onTabCreated, this)
	}

	editTabTitle = (tab: Tab) => {
		console.log('editTabTitle()')
		// Todo - Call from right click tab menu

		// Change the title into an input element
		tab.element.addClass('is-editing');

		let $titleInput = tab.element.find('input.title');
		$titleInput.val(tab.contentItem.config.title);
		$titleInput.focus();
		$titleInput.select();
	}

	onTitleInputBlur = (tab: Tab, input: HTMLInputElement) => {
		tab.element.removeClass('is-editing');
	}

	onTabDragStart = () => {
		console.log('tabDragStart')
		this.component.isDragging = true;
	}

	onTabDragEnd = () => {
		console.log('tabDragStart')
		this.component.isDragging = false;
	}

	_tab: Tab;
	detach = () => {
		if (this._tab) {
			const dragListener = (this._tab as any)._dragListener;

			if (dragListener) {
				dragListener.off('dragStart', this.onTabDragStart, this);
				dragListener.off('dragStop', this.onTabDragEnd, this);
			}
		}
	}

	onTabCreated = (tab: Tab) => {
		const { component } = this;
		const { props, state } = component;

		this.detach();
		this._tab = tab;

		//console.log('GLC.onTabCreated()', tab)
		if (tab) {
			//tab.contentItem.config.
			let $title = tab.titleElement;

			let dragListener = (this._tab as any)._dragListener;

			dragListener.on('dragStart', this.onTabDragStart, this);
			dragListener.on('dragStop', this.onTabDragEnd, this);

			if (props.onTabContextMenu) {
				tab.element.on('contextmenu', (e) => {
					e.originalEvent.preventDefault();
					props.onTabContextMenu(e.originalEvent as MouseEvent, tab);
				})
			}

			if (props.onRenameViaTab) {
				const { onRenameViaTab: rename } = props;

				tab.element.addClass('is-editable');

				let $titleInput = $(`<input class="title"/>`);

				$title.after($titleInput);

				$titleInput.on('change', (e) => {
					console.log('change', e)
				});

				$titleInput.on('blur', () => {
					tab.element.removeClass('is-editing');
					rename.done();
				})

				const $titleLabel = tab.element.find('.lm_title');

				tab.titleElement.on('dblclick', () => {
					rename.start();

					// dispatch(api.report.currentReport.renameReportItem.start(this.props.view, this.props.allowEditTabTitle ? 'tab' : 'tree'))
					//
					// if (props.allowEditTabTitle) {
					//     // Change the title into an input element
					//     tab.element.addClass('is-editing');
					//
					//     $titleInput.css('width', Math.ceil($titleLabel.width()) - 2)
					//         .val(tab.contentItem.config.title)
					//         .focus()
					//         .select();
					// }
				});
			}
		}

		if (props.onTabCreated != null) {
			props.onTabCreated(tab);
		}
	}

}
