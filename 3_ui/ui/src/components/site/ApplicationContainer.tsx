import {Fragment} from 'react';
import * as React from 'react';
import {ErrorBoundary, LoadingEllipsis} from "../widgets";
import {
	routing,
	Link,
	site,
	julia,
	settings,
	user,
	queryStore,
	sidebar,
	utility,
	ActiveTool,
	ioStore,
	defaultAppGlobals,
	IO,
	climateRiskAnalysisStore,
	ClimateRiskAnalysis,
	Query,
	Simulation
} from 'stores'
import { observer } from 'mobx-react';
import { observable, computed, autorun, action, makeObservable } from 'mobx';
import { SiteFooter } from './SiteFooter';
import { bp } from 'components';
import type { IToaster } from "@blueprintjs/core";
import {Position, Toaster} from "@blueprintjs/core";
import { SiteHeader } from './header/SiteHeader';
import { Sidebar } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import type { ApplicationAlertProps } from "./ApplicationAlert";
import { ApplicationAlert } from "./ApplicationAlert";
import { simulationStore } from "../../stores/simulation";
import { ApplicationPopoverMenu } from "./ApplicationPopoverMenu";
import {InvestmentOptimizationTabMenu, QueryTabMenu, ReportTabMenu, SimulationTabMenu} from './ApplicationTabMenus';
import {DesktopNotifications} from './DesktopNotifications';
import UploadingFileCheck from './../system/UserFile/UploadingFileCheck';
import * as css from "./ApplicationContainer.css";

interface MyProps {
	location?: HistoryModule.LocationDescriptorObject;
}

interface ITab {
	id: string;
	title?: string | React.ReactNode;
	active?: boolean;
	tool?: ActiveTool;
	url?: string;
}

@observer
export class ApplicationContainer extends React.Component<MyProps, {}> {
    @observable isDropOver = false;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    @computed
	get activeTab() {
		const activeTab = this.tabs.find(t => t.active);
		return activeTab ? activeTab.id : null;
	}

    /*
	set activeTab(id: string) {
		for (const tab of this.tabs) {
			tab.active = tab.id == id;
			// if (tab.active) {
			// 	routing.push(tab.url);
			// }
		}
	}*/

    @computed get tabs() {
		const tabs = [
			{
				id    : 'simulation',
				title : <SimulationTabMenu/>,
				active: false,
				tool: ActiveTool.simulation,
				url   : routing.urls.simulationBrowser
			},
			{
				id    : 'query',
				title : <QueryTabMenu/>,
				active: false,
				tool: ActiveTool.query,
				url   : routing.urls.query
			},
			{
				id    : 'userFile',
				active: false,
				tool: ActiveTool.userFile,
				url   : routing.urls.userFileBrowser
			},
			...(
				user.isCRALicensed ? [{
					id    : 'climateRiskAnalysis',
					active: false,
					tool: ActiveTool.climateRiskAnalysis,
					url   : routing.urls.climateRiskAnalysisBrowser
				}] : []
			),
			...(
				user.isIOLicensed ? [{
					id    : 'investmentOptimization',
					title : <InvestmentOptimizationTabMenu/>,
					active: false,
					tool: ActiveTool.io,
					url   : routing.urls.ioBrowser
				}] : []
			),
			...(
				settings.features.reports ? [{
					id    : 'report',
					title : <ReportTabMenu/>,
					tool: ActiveTool.report,
					url   : routing.urls.reportBrowser
				}] : []
			)
		]

		if (site.activeTool) {
			const {tool} = site.activeTool;
			tabs.forEach(t => {
				const active = t.tool == tool || routing.isActive(t.url);
				t.active = active;
			});
		}

		return tabs;
	}

    render() {
		const {onDragStart, onDragUpdate, onDragEnd, activeTab, tabs, alert, props: { children } } = this;
		const { inGlobalDragOver, applicationClasses, errorPageMessage, activeTool } = site;

		let title = activeTool?.title() ? `${activeTool.title()} | ` : "";

		let pushedStyle = {
			display  : 'flex',
			width    : `calc(100%${false && sidebar.show ? ` - ${sidebar.width}px` : ''})`,
			/*transform: `translate3d(${sidebar.show ? sidebar.width : 0}px, 0px, 0px)`*/
			transform: `translate3d(0px, 0px, 0px)`
		};

		let headerToolbarItems = activeTool && activeTool.renderHeaderToolbarItems && activeTool.renderHeaderToolbarItems();

		const tag              = activeTool && activeTool.tag && activeTool.tag();
		const breadcrumbs      = activeTool && activeTool.breadcrumbs && activeTool.breadcrumbs();
		const appMenuItems = activeTool && activeTool.renderApplicationMenuItems && activeTool.renderApplicationMenuItems();
		const extraSettings = activeTool && activeTool.renderExtraSettingsMenuItems && activeTool.renderExtraSettingsMenuItems();
		const afterBreadcrumbs = activeTool && activeTool.afterBreadcrumbs && activeTool.afterBreadcrumbs();
		const breadcrumbsRight = activeTool && activeTool.breadcrumbsRight && activeTool.breadcrumbsRight();

		return ( <bp.HotkeysProvider>
			<div className={classNames(css.applicationContainer,
			                           applicationClasses.slice(),
			                           {
				                           [css.sidebarIsDragging]: sidebar.isDragging,
				                           [css.isDropOver]       : inGlobalDragOver,
				                           [css.loggedOut]        : !user.isLoggedIn
			                           }
			)}
			     data-sidebar={sidebar.show}>

				{this.renderHotkeys()}

				<Helmet title={`${title}${defaultAppGlobals.title()}`}/>

				<input id="fileUploader" type="file" style={{ display: 'none', visibility: 'hidden' }} ref={r => site.uploadInput = r}/>


				<DesktopNotifications />
			    <UploadingFileCheck />

				{/*{!utility.isInElectron() && <SiteHeader /> }*/}

				<Toaster ref={t => site.toaster = t} className='site-toaster' position={Position.BOTTOM_RIGHT} />

				<div className={css.detailContainer}>
					<SiteHeader/>

					{/*<RouteTransition*/}
					{/*key="path-transition"*/}
					{/*pathname={this.props.location.pathname}*/}
					{/*runOnMount={true}*/}
					{/*atEnter={{ opacity: .2 }}*/}
					{/*atLeave={{ opacity: .7 }}*/}
					{/*atActive={{ opacity: 1 }}*/}
					{/*stiffness={650} damping={24}*/}
					{/*className={css.routeTransitionContainer}>*/}

					{ ( breadcrumbs || appMenuItems || extraSettings || afterBreadcrumbs || breadcrumbsRight ) &&
					<bp.Tabs id="site-tabs" renderActiveTabPanelOnly
				         className={css.siteTabs}
				         animate={false}
				         selectedTabId={activeTab}>

						{/*<div className={classNames("pt-navbar-divider", css.sidebarNavbarDivider)} style={sidebar.show ? {height: 0, marginLeft:0, marginRight:0, borderLeftWidth:0} : {}}/>*/}

						{/*<span className={bp.Classes.NAVBAR_DIVIDER}/>*/}

						{/*<ToggleSidebarButton className={css.sidebarToggleButton}/>*/}

						<div className={bp.Classes.BREADCRUMBS}>
							{breadcrumbs ?
							 _.toArray(breadcrumbs).map((c, i) => <li key={i.toString()}>{c}</li>)
							             : <ApplicationPopoverMenu className={bp.Classes.BREADCRUMB}/>}
						</div>

						{afterBreadcrumbs &&
						 <div className={css.afterBreadcrumbs}>
							 {afterBreadcrumbs}
						 </div>}

						{breadcrumbsRight &&
                        <div className={css.breadcrumbsRight}>
							{breadcrumbsRight}
                        </div>}
					</bp.Tabs>
					}

					<div className={css.tabContentContainer}>
						<Sidebar.Pushable>
							{/*<SiteSidebar activeTab={activeTab}/>*/}

							<Sidebar.Pusher style={pushedStyle} className={css.pusher}>
								<ErrorBoundary key={this.props.location.pathname}>
									{activeTool && activeTool.renderToolbar && activeTool.renderToolbar()}

									{children}
									<LoadingEllipsis className={css.loadingEllipsis} style={{opacity: site.busy ? 1: 0}}/>
								</ErrorBoundary>
							</Sidebar.Pusher>

							{/*<AppUploadPanel/>*/}
							{/*<SystemErrorPanel/>*/}

							{site.dialogFn && site.dialogFn()}
						</Sidebar.Pushable>
					</div>

					{/*</RouteTransition>*/}
					<SiteFooter/>
				</div>


				{alert && <ApplicationAlert {...alert} onConfirm={this.confirmAlert} onCancel={this.cancelAlert}/>}
			</div>
		</bp.HotkeysProvider>);
	}

    private renderBreadcrumb = (props: bp.IMenuItemProps | any) => {
		const { href, icon, text, children } = props;

		if (text == '') {
			return <ApplicationPopoverMenu className={bp.Classes.BREADCRUMB}/>;

			// return (
			// 	<bp.Popover
			// 	            interactionKind={bp.PopoverInteractionKind.HOVER}
			// 	            className={classNames(bp.Classes.BREADCRUMB)}
			// 	            content={children}>
			// 		<span>
			// 			{icon && <span className={`pt-icon-${icon}`}/>}
			// 			{text}
			// 			<span className={`pt-icon-caret-down`}/>
			// 		</span>}
			// 	</bp.Popover>);
		}
		else if (href != null) {
			return <Link to={href} activeClassName={bp.Classes.BREADCRUMB_CURRENT} className={bp.Classes.BREADCRUMB}>
				{icon && <bp.Icon icon={icon} />}
				{text}
			</Link>;
		} else {
			return <span className={classNames(bp.Classes.BREADCRUMB)}>
				{icon && <bp.Icon icon={icon} />}
				{text}
				</span>;
		}
	}

    renderHotkeys() {

		if(user.enableGEMSOnlyMode) {
			return null;
		}

		let comboCount = 1;
		const hotkeys: bp.HotkeyConfig[] = [
			{
				global:    true,
				label:     Simulation.OBJECT_NAME_MULTI,
				group:     "Browse",
				combo:     `F${comboCount++}`,
				onKeyDown: () => simulationStore.navigateToBrowser()
			},
			{
				global: true,
				label: Query.OBJECT_NAME_MULTI,
				group: "Browse",
				combo: `F${comboCount++}`,
				onKeyDown: () => queryStore.navigateToBrowser()
			}
		];

		if(user.isIOLicensed) {
			hotkeys.push({
				global:    true,
				label:     IO.OBJECT_NAME_MULTI,
				group:     "Browse",
				combo:     `F${comboCount++}`,
				onKeyDown: () => ioStore.navigateToBrowser()
			})
		}

		if(user.isCRALicensed) {
			hotkeys.push({
				global: true,
				label: ClimateRiskAnalysis.OBJECT_NAME_MULTI,
				group: "Browse",
				combo: `F${comboCount++}`,
				onKeyDown: () => climateRiskAnalysisStore.navigateToBrowser()
			})
		}

		return <bp.HotkeysTarget2 hotkeys={hotkeys}>{() => <Fragment/>}</bp.HotkeysTarget2>;
	}


	@observable.ref alert: ApplicationAlertProps;
    @action confirmAlert = () => {
        this.alert.resolve(true);
        this.alert = null;
    }

	@action cancelAlert = () => {
		this.alert.resolve(false);
		this.alert = null;
	}

    _toRemove = [];

    componentDidMount() {
		site.closeConfirm = action(() => this.alert = null)();
		site.confirm = (message: string | React.ReactNode, description?: string | React.ReactNode, icon?: React.ReactNode, okLabel?: string, cancelLabel?: string): Promise<boolean> => {
			return new Promise(action((res, rej) => {
				this.alert =
					{
						resolve    : res, reject: rej,
						message    : message,
						description: description,
						icon       : icon,
						okLabel    : okLabel,
						cancelLabel: cancelLabel
					};
			}))
		}

	    site.messageBox = (message: string | React.ReactNode, description?: string | React.ReactNode, icon?: React.ReactNode, okLabel?: string): Promise<void> => {
		    return new Promise(action((res, rej) => {
			    this.alert =
				    {
					    resolve    : res, reject: rej,
					    message    : message,
					    description: description,
					    icon       : icon,
					    okLabel    : okLabel,
					    cancelLabel: false
				    };
		    }))
	    }

		this.measureScrollbars();

		const { _toRemove } = this;
		const $body         = $('body');

		let previouslyLoggedIn = false;
		_toRemove.push(autorun(() => {
			const { hostname } = julia;

			// This autorun is incorrectly triggered from access token renewal even though the user is never logged out, so only run
			// because of a login change when the login state actually changes
			if (julia.connected && (user.isLoggedIn && !previouslyLoggedIn)) {
				julia.tryLoadDescriptors();
			}
			previouslyLoggedIn = user.isLoggedIn;
		}, {name: `Make sure julia is up and running`}));

		//window.addEventListener('resize', this.measureScrollbars);

		// Handle global errors and route them to the toastr
		// To do - move this into the client or the store
		window.addEventListener('onpaste', this.onPaste)

		// window.addEventListener('ondragenter', this.onDragEnter);
		// window.addEventListener('ondragleave', this.onDragLeave);

		// When the user alt-tabs away and a tooltip is over, close it
		// This code is too sensitive.  It fires (for example) when I try to highlight text in a tooltip
		//$(window).blur(() => utility.closeActiveTooltips())

		document.addEventListener('visibilitychange', utility.closeActiveTooltips)
	}

    onPaste = (e) => {
		console.log(e);
		debugger;
	}

    componentWillUnmount() {
		this._toRemove.forEach(f => f());
		window.removeEventListener('onpaste', this.onPaste)
		document.removeEventListener('visibilitychange', utility.closeActiveTooltips)

		// window.removeEventListener('ondragenter', this.onDragEnter);
		// window.removeEventListener('ondragleave', this.onDragLeave);
	}

    measureScrollbarWidth() {
		const divWidth        = 100;
		let $outer            = $('<div class="width-measurer">').css({
			                                                              visibility: 'hidden',
			                                                              width     : divWidth,
			                                                              overflow  : 'scroll'
		                                                              }).appendTo('.react-app');
		const widthWithScroll = $('<div>').css({ width: '100%' }).appendTo($outer).outerWidth();
		$outer.remove();

		return divWidth - widthWithScroll;
	}

    measureScrollbarHeight() {
		const divHeight        = 100;
		let $outer             = $('<div class="height-measurer">').css({
			                                                                visibility: 'hidden',
			                                                                height    : divHeight,
			                                                                overflow  : 'scroll'
		                                                                }).appendTo('.react-app');
		const heightWithScroll = $('<div>').css({ height: '100%' }).appendTo($outer).outerHeight();
		$outer.remove();

		return divHeight - heightWithScroll;
	}

    @action measureScrollbars = () => {
		//console.log('measureScrollbars')
		site.verticalScrollbarWidth = this.measureScrollbarWidth();
		site.horizontalScrollbarHeight = this.measureScrollbarHeight();
	}

    toaster: IToaster;

    onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		console.log(`onDragEnter()`, e);

		const { dataTransfer } = e;
		const { items, files } = dataTransfer;

		var entry = e.dataTransfer.items[0].webkitGetAsEntry();
		if (entry.isDirectory) {
			console.log(entry.fullPath);
		}

		site.inGlobalDragOver = items.length > 0;
	}

    onDragLeave = (e) => {
		console.log(`onDragLeave()`, e);
		site.inGlobalDragOver = false;
	}

    onDrop = (e) => {
		console.log(`onDrop()`, e);
		e.preventDefault();
		site.inGlobalDragOver = false;
	}


    /* https://github.com/atlassian/react-beautiful-dnd */
    onDragStart = () => {
		/*...*/
	};
    onDragUpdate = () => {
		/*...*/
	};
    onDragEnd = () => {
		// the only one that is required
	};
}
