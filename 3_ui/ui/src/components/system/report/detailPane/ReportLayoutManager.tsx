import { GoldenLayoutComponent, bp } from 'components'
import {GoldenLayout, ItemConfig, ReactComponentConfig, Tab} from 'golden-layout';
import { ReportItemLayoutComponent, ReportItemLayoutComponentProps } from './'
import * as css from './ReportLayoutManager.css';
import {Report, ReportItem, ReportQuery, ReportPage, ReportPageLayout, settings, ReportText, DuplicateDirection} from 'stores';
import { observer } from 'mobx-react';
import {observable, reaction, toJS, makeObservable, action} from "mobx";
import { ReportItemContextMenu } from "../widgets";
import { LoadingIndicator } from "../../../semantic-ui/parts/Loading";
import * as PropTypes from 'prop-types';

interface MyProps {
	report?: Report;

	//simulations: { [key: string]: Simulation };
	item: ReportItem;
	canUnlink?: (item: ReportItem) => boolean;

	onTabCreated(tab: Tab);
}

@observer
export class ReportLayoutManager extends React.Component<MyProps, {}> {
    @observable contextTab?: Tab;
    @observable.shallow glContent?: ItemConfig;

	constructor(props) {
		super(props);

        makeObservable(this);

		this.setup();
    }

    render() {
		const {props: { item, report, report: { selectedItem } }, glContent, contextTab} = this;
		const page = item as ReportPage;

		return (
			<div className={classNames(css.goldenLayoutPane)}>
				<GoldenLayoutComponent
					ref={r => this.goldenLayoutComponent = r}
					content={glContent}
					glConfig={{ dimensions: {
						// Hide the header if there's only a single item on the page
						headerHeight: page && page.children.length > 1 && settings.report.showLayoutTabs
							? this.defaultTabHeaderHeight
							: 0 } }}
					registerComponents={this.registerComponents}
					onTabCreated={this.props.onTabCreated}
					onTabContextMenu={this.onTabContextMenu}
				/>
			</div>
		)
	}

    onTabContextMenu = (e: MouseEvent, tab: Tab) => {
		const config = tab.contentItem.config as ReactComponentConfig;
		const { props: { item } } = config;
		bp.ContextMenu.show(<ReportItemContextMenu location='tab' layoutManager={this} item={item}/>, { left: e.clientX - 8, top: e.clientY - 8 });
	}

    static contextTypes: React.ValidationMap<any> = {
		dragDropManager: PropTypes.any,
		router: PropTypes.object
	}

	declare context: { dragDropManager: any, router: any }
    defaultTabHeaderHeight = 24;
    _toDispose = [];
    ignoreLayoutChanges = false;

    setup = () => {
		const { props: { report, item }, defaultTabHeaderHeight } = this

		this._toDispose.forEach(f => f());
		this._toDispose = [];

		this.glContent = this.loadGoldenLayoutConfigFromReport(item);

		this._toDispose.push(reaction(
			() => settings.report.showLayoutTabs,
			(show) => {
				if (this.goldenLayoutComponent) {
					this.goldenLayoutComponent.goldenLayout.config.dimensions.headerHeight = show ? defaultTabHeaderHeight : 0;
					this.goldenLayoutComponent.goldenLayout.updateSize()
				}
			}
		))

		if (item instanceof ReportPage) {
			this._toDispose.push(
				reaction(
					() => ({layout: item.layout}),
					() => {
						const { layout } = item;
						this.glContent = this.createGoldenLayoutContent(item);
					}
				));

			this._toDispose.push(
				reaction(
					() => ({length: item.children.length}),
					() => {
						let layout = JSON.parse(item.goldenLayoutConfig).content[0]
						!this.ignoreLayoutChanges && (this.glContent = this.syncLayoutStructures(item, layout));
					}
				));
		}
	}

    componentDidUpdate(oldProps: MyProps) {
		if (oldProps.item != this.props.item) {
			this.setup();
		}

		if (this.goldenLayoutComponent && this.goldenLayoutComponent.goldenLayout.isInitialised &&
		    this.props.item && (!oldProps.item || oldProps.item.name !== this.props.item.name)) {
			const contentItem = this.goldenLayoutComponent.findContentItem(this.props.item.id);
			const label = this.props.item.label;

			if (contentItem && contentItem.config.title !== label) {
				contentItem.setTitle(label);

				// Most golden layout updates trigger a bubbling stateChanged which we tie into to save layout, but
				// setTitle does not, so explictly call our state change method here.
				this.goldenLayout_onStateChanged();
			}
		}
	}


    componentWillUnmount() {
		this._toDispose.forEach(f => f());
		//api.dispatch(api.report.setReportLayoutManagerController(null));
	}

    getLayoutItemProps(item: ReportItem): ReportItemLayoutComponentProps {
		return {
			item: item,
	        pageItem: this.props.item,
			dragDropManager: () => this.context.dragDropManager,
			router: this.context.router
		} as ReportItemLayoutComponentProps;
	}

    loadGoldenLayoutConfigFromReport(reportItem: ReportItem): ItemConfig {
		let layout = reportItem.goldenLayoutConfig ? JSON.parse(reportItem.goldenLayoutConfig).content[0] : this.createGoldenLayoutContent(reportItem);

		if (!layout || layout.id !== reportItem.id) {
			layout = this.createGoldenLayoutContent(reportItem);
		}

		// Verify that the layout structure matches report
		this.syncLayoutStructures(reportItem, layout)

		return layout;
	}

    /**
	 *
	 * @param item
	 * @returns {ItemConfig}
	 */
    @action createGoldenLayoutContent = (item: ReportItem): ItemConfig => {
		let result: ItemConfig | ReactComponentConfig = {
			type: 'row',
			title: item.label,
			id: item.id,
			isClosable: this.props.item !== item // Prevent top level items from being closed. Note: this restriction also allows us to reliably keep around the root item during drag/drop which consolidates items and possibly striping away the item key.
		}

		// if (item.type === 'report') {
		//     throw new Error('Report is not a valid type for createGoldenLayoutContent()')
		// }
		// else
		//
		if (item.type === 'folder' || item.type === 'report') {
			result.type = 'stack';
		}
		else if (item.type === 'page') {
			result.type = 'row'; // (item.children.length === 1) ? 'stack' : 'row';
		}
		else {
			let config = result as ReactComponentConfig;
			config.type = 'react-component';
			config.component = 'ReportItemLayoutItem';
			config.props = this.getLayoutItemProps(item);
		}

		if (item instanceof ReportPage) {
			//if (item.children.length !== 1) {
			const { layout } = item;

			result.content = [];

			switch (layout) {
				case ReportPageLayout.horizontal: {
					result.type = 'row';
					result.content = item.children.slice().map(c => ({ type: 'stack', key: c.id, content: [this.createGoldenLayoutContent(c)] })) as Array<ItemConfig>;
					break;
				}
				case ReportPageLayout.vertical: {
					result.type = 'row';
					result.content.push(
						{
							type: 'column',
							key: 'column',
							content: item.children.slice().map(c => this.createGoldenLayoutContent(c)) as Array<ItemConfig>
						} as ItemConfig
					);
					break;
				}

				case ReportPageLayout.userDefined: {
					//result = this.glContent;

					console.log('How do we update golden layout with this new item?', this.glContent);
					//debugger;
				}

				default: {
					let length = item.children.length;
					let rowsPerColumn = Math.ceil(Math.sqrt(length));

					// Setup the default page in a grid format.
					for (let i = 0; i < length / rowsPerColumn; i++) {
						let startItem = i * rowsPerColumn;
						let endItem = Math.min(startItem + rowsPerColumn, length);
						result.content.push(
							{
								type: 'column',
								key: 'column',
								content: item.children.slice(startItem, endItem).map(c => this.createGoldenLayoutContent(c)) as Array<ItemConfig>
							} as ItemConfig
						);
					}
				}
			}
		}
		else {
			result.content = _.map(_.filter(item.children, c => c.isPoppedOut == null || !c.isPoppedOut), c => this.createGoldenLayoutContent(c));
		}

		return result;
	}

    onDuplicateView = async (item:ReportItem, direction: DuplicateDirection) => {
		try {
			this.ignoreLayoutChanges = true;
			(this.props.item as ReportPage).layout = ReportPageLayout.userDefined
			let originalView = item;

			let contentItem = this.goldenLayoutComponent.findContentItem(originalView.id);
			let contentItemStack = contentItem.parent;
			let stackParent = contentItemStack.parent;
			let itemIndex = stackParent.contentItems.indexOf(contentItemStack);
			let configCopy = _.cloneDeep(toJS(contentItemStack.config)) as ReactComponentConfig;

			let configRoot = (configCopy.content[0] as ReactComponentConfig);

			let layoutItemProps: ReportItemLayoutComponentProps = configRoot.props;

			if (item instanceof ReportQuery) {
				// Add a temporary Duplicating component to display while the query is being duplicated
				configRoot.id = uuid.v4();
				configRoot.component = "DuplicatingIndicator";

				(originalView as ReportQuery).duplicate(true).then((clonedView) => {
					configRoot.id = clonedView.id;
					layoutItemProps.item = clonedView;
					configRoot.component = "ReportItemLayoutItem";

					// Replace the temporary Duplicating component with the real component
					let newContent = this.goldenLayoutComponent.findContentItem(configRoot.id as string)
					newContent.parent.parent.replaceChild(newContent.parent, Object.assign(configCopy, {config: { height: 0, width: 0 }}));
					this.ignoreLayoutChanges = false;
				})
			}
			else if (item instanceof ReportText) {
				const newText = await originalView.duplicate();
				configRoot.id = newText.id;
				layoutItemProps.item = newText;
				this.ignoreLayoutChanges = false;
			}
			else {
				throw new Error(`Unsupported report duplication report item`);
			}


			if (direction === 'tab') {
				console.warn('NYI - WEB-644')
			}
			else if ((direction === 'right' && !stackParent.isRow) || (direction === 'down' && !stackParent.isColumn)) {
				let layout = direction === 'right' ? "row" : "column";
				// Note: we pass a config with height/width of 0 because there is a bug in the replaceChild code that assumes we are always passing in a
				// contentItem, but this method is suppose to and does work with configurations too
				stackParent.replaceChild(contentItemStack, { type: layout, config: { height: 0, width: 0 } } as any);
				let rowOrColumn = stackParent.contentItems[itemIndex];

				rowOrColumn.addChild(contentItemStack);
				rowOrColumn.addChild(configCopy);
			}
			else {
				stackParent.addChild(configCopy, itemIndex + 1);
			}
		}
		catch(e) {
			this.ignoreLayoutChanges = false;
			throw(e);
		}
	}

    onUpdateUserOptions = (key, userOptions) => {
		console.log('nyi', userOptions)
		let view = this.props.report.findItem(key) as ReportQuery;

		if (view) {
			// Switched from array by enum to dictionary
			if (Array.isArray(view.userOptions)) {
			}

			//api.report.queryView.updateUserOption(view, userOptions);
		}
		else {
			console.warn("View not found in LayoutManager:onUpdateUserOptions()")
		}
	}

    goldenLayoutComponent: GoldenLayoutComponent;
    goldenLayout: GoldenLayout;
    registerComponents = (gl: GoldenLayout) => {
		gl.registerComponent('ReportItemLayoutItem', ReportItemLayoutComponent);
		gl.registerComponent('DuplicatingIndicator', DuplicatingIndicator);

		this.goldenLayout = gl;

		this.goldenLayout.on("stateChanged", this.goldenLayout_onStateChanged);
		this.goldenLayout.on("itemDropped", (item) => item.layout = ReportPageLayout.userDefined);
	}


    /**
	 * We attempt to deserialize the report item layout options we have but then we must make sure that the report itself has the same structural layout
	 * @param reportItem    ReportItem with the current accurate state of the this.props.reportBrowser.
	 * @param layout        Layout that will be updated to comply with the reportItem.
	 */
    syncLayoutStructures(reportItem: ReportItem, layout: ReactComponentConfig) {
		reportItem.enumerateTree().forEach(item => {
			let itemConfig = this.findConfig(layout, item.id);
			if (itemConfig && itemConfig.props) {
				itemConfig.props = this.getLayoutItemProps(item)
			}
			else if (!itemConfig) { // Item not present in the layout
				if (layout.type !== "row" && layout.type !== "column") {

					// Move the content to a stack and update the layout to be a column
					layout.content = [{ type: 'stack', id: 'stack', content: layout.content }];
					layout.type = 'column';
				}

				if (layout.content == null) {
					layout.content = [];
				}

				// Add items that are in the report item but not in the associated config. e.g. from a create new or move.
				let newItem: ItemConfig = {
					type: 'stack',
					key: 'stack',
					[layout.type === "column" ? "height" : "width"]: 100 / (layout.content.length + 1),
					content: [this.createGoldenLayoutContent(item)]
				} as ItemConfig
				layout.content.push(newItem);
			}

			//console.log(item, layout)
		})

		// Second pass to remove content items that are no longer present in the report
		reportItem.enumerateLayoutContentTree(layout).forEach((contentItem) => {
			if (contentItem.content && contentItem.content.length > 0) {

				// Remove stacks that have children that aren't present in the this.props.reportBrowser.
				for (let i = contentItem.content.length - 1; i >= 0; i--) {
					let child = contentItem.content[i];

					if (child.type === "stack" && _.isArray(child.content) && !reportItem.isInSubtree(child.content[0].id)) {
						contentItem.content.splice(i, 1);
					}
				}
			}
		})

		return layout;
	}

    findConfig(rootContent: ItemConfig, key: string): ReactComponentConfig {
		let foundItem = null;

		this.props.report.enumerateLayoutContentTree(rootContent).forEach((contentItem) => {
			if (contentItem.id === key) {
				foundItem = contentItem;
				return false;
			}
		});

		return foundItem;
	}

    /*** Serialize changes to the user's layout to our report item */
    toConfigInProcess = false;
    goldenLayout_onStateChanged = _.debounce(() => {
		const {goldenLayoutComponent, props: {item, report}} = this;

		// If you call toConfig in a state changed due to a popout window it causes an infinite recursion in lm.utils.copy._$reconcilePopoutWindows
		if (goldenLayoutComponent
		    && goldenLayoutComponent.initialized
		    && !goldenLayoutComponent.loading
		    && !goldenLayoutComponent.goldenLayout.isSubWindow
		    && !this.toConfigInProcess
		    && !goldenLayoutComponent.isDragging) {

			this.toConfigInProcess = true;

			let layout = goldenLayoutComponent.goldenLayout.toConfig();

			// Remove unneeded properties that take up a lot of storage.
			report.enumerateLayoutContentTree(layout).forEach((contentItem) => {
				if (contentItem.props) {
					contentItem.props = {};
				}
				if (contentItem.componentState) {
					delete contentItem.componentState;
				}
			})

			this.toConfigInProcess = false;

			const layoutJson = JSON.stringify(layout);

			if (!_.eq(layoutJson, item.goldenLayoutConfig)) {
				Object.assign(item, { goldenLayoutConfig: layoutJson });
			}
		}

		if (goldenLayoutComponent && goldenLayoutComponent.isDragging && item) {
			if (item instanceof ReportPage) {
				item.setLayout(ReportPageLayout.userDefined)
			}
		}
	}, 500, {leading: false})
}


export class DuplicatingIndicator extends React.Component<{},{}> {
	render() {
		return (<LoadingIndicator className={css.loadingIndicator}>Duplicating</LoadingIndicator>)
	}
}