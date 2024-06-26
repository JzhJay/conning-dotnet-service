import { api, appIcons, site, Report, ReportItem, ReportQuery, ReportPage} from 'stores';
import { observer } from 'mobx-react';
import { Tab } from 'golden-layout';
import {
	ReportSummary
} from "./detailPane/index";
import { autorun, observable, makeObservable } from 'mobx';
import { ReportLayoutManager } from './detailPane/ReportLayoutManager';
const { viewDescriptors } = api.constants;
import { EmptyReportPageMessage } from "./ReportCard/Page";
import * as css from './ReportViewer.css'

interface MyProps {
	report: Report;
	page?: ReportPage;
}

@observer
export class ReportViewer extends React.Component<MyProps, {}> {
    @observable sidebarWidth?: any;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentWillUnmount(): void {
		this._toRemove.forEach(f => f());
	}

    render() {
		const { props: { report } } = this;
		return <div className={css.root}>
			{this.renderSelectedReportItem()}

			{/*<ResizeSensorComponent key='resizer' onResize={this.positionDetailPane}/>*/}

			{/*<SplitResizer*/}
			{/*key='split-resizer'*/}
			{/*ref={r => this.$splitResizer = $(ReactDOM.findDOMNode(r))}*/}
			{/*canResize={false} orientation='vertical'*/}
			{/*onDoubleClick={() => this.toggleSidebar()}/>*/}


		</div>
	}

    _toRemove = [];

    componentDidMount() {
		this.node = ReactDOM.findDOMNode(this) as HTMLElement;
		this.$node = $(this.node);

		const { report } = this.props;

		this._toRemove.push(
			autorun( async () => {
				const { selectedItem } = this.props.report;
				try {
					if (selectedItem instanceof ReportPage) {
						selectedItem.reportQueries.forEach(async slot => await slot.manageQuerySession());
					}
					else if (selectedItem instanceof ReportQuery) {
						await selectedItem.manageQuerySession();
					}
				} catch (err) {
					site.raiseError(err);
				}
			}, {name: `Manage associated query sessions for report '${report.name}'`}));
	}

    renderSelectedReportItem() {
		let { report, report: { selectedItem }, ...props } = this.props;

		if (selectedItem != null && selectedItem.type === 'folder') {
			selectedItem = selectedItem.enumerateTree().find(v => v.type === 'page')
		}

		if (selectedItem == null || selectedItem.type === 'report') {
			return <ReportSummary report={report} key={`summary-${report.id}`}/>
		}
		else if (selectedItem.type === 'page' || selectedItem.type === 'query' || selectedItem.type == 'text') {
			if (selectedItem instanceof ReportPage && selectedItem.children.length == 0) {
				return <EmptyReportPageMessage className={css.emptyReportPage} page={selectedItem}/>
			}
			else {
				return <ReportLayoutManager report={report}
				                            {...props} item={selectedItem}
				                            onTabCreated={this.onTabCreated}/>
			}
		}
		else {
			return <div>{selectedItem.type} has no associated renderer</div>
		}
	}

    onTabIcon = (key: string) => {
		let item = this.props.report.findItem(key);
		switch (item.type) {
			case 'folder':

			case 'page': {
				return appIcons.report.page;
			}

			case 'query': {
				let reportQuery = item as ReportQuery;

				return reportQuery.viewDescriptor.icon;
			}

			case 'report': {
				return appIcons.report.report;
			}

			default: {
				throw new Error(`Cannot create tab icon for type ${item.type}`)
			}
		}
	}

    tabs: { [key: string]: Tab } = {};
    @observable mousedOverSidebarItem;
    @observable mousedOverDetailItem;

    onMousedOverSidebarItem = (item: ReportItem) => {
		const cssClass = 'is-moused-over-sidebar-item';

		if (this.mousedOverSidebarItem != null) {
			if (this.mousedOverSidebarItem !== item) {
				this.mousedOverSidebarItem.enumerateTree().forEach(elem => {
					const tab = this.tabs[elem.id]

					if (tab != null) {
						tab.element.removeClass(cssClass)
						//tab.contentItem.element.removeClass(cssClass)
					}
				});
			}
		}

		if (item != null) {
			if (item.type === 'page' || item.type === 'query') {
				item.enumerateTree().forEach(elem => {
					const tab = this.tabs[elem.id]
					if (tab != null) {
						tab.element.addClass(cssClass)
						//tab.contentItem.element.addClass(cssClass);
					}
				});
			}

			if (this.mousedOverSidebarItem !== item) {
				this.setState({ mousedOverSidebarItem: item })
			}
		}
	}

    onTabCreated = (tab: Tab) => {
		const id = tab.contentItem.config.id as string;

		this.tabs[id as string] = tab;

		const item = this.props.report.findItem(id);
		if (item != null) {
			tab.element.on('dblclick', () => {
				item.navigateTo();
			});

			tab.element.on('mouseenter', () => {
				this.mousedOverDetailItem = item;
			});

			tab.element.on('mouseleave', () => {
				this.mousedOverDetailItem = null;
			});
		}
	}

    node: HTMLElement;
    $node: JQuery;
}