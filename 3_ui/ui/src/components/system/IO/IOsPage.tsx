import {ApplicationPage, ApplicationPopoverMenu, ErrorMessage, utility} from 'components';
import * as components from 'components';
import {ApplicationShortCuts, ApplicationShortCutsLockerStatus} from 'components/site/ApplicationShortCuts';
import * as React from 'react';
import {site, settings, ioStore, IO, IOStatus} from 'stores';
import {observable, computed, autorun, runInAction, makeObservable, action} from 'mobx';
import {observer} from 'mobx-react'
import {IOComponent} from './IOComponent';
import {IOBrowser} from './IOBrowser';
import {ActiveTool} from 'stores/site';
import {IOBrowserMenu, IOContextMenu, ioFileControl} from './IOContextMenu';
import { ExportPdfProgressDialog } from '../ExportPdfReport/ExportPdfProgressDialog';

import * as css from './IOsPage.css';
import {IOApplicationBarItems} from './IOApplicationBarItems';

let SmartCard

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	params?: { id?: string }
}

interface QueryString {
	defaultSelect?: string
}

@observer
export class InvestmentOptimizationResultsPage extends React.Component<MyProps, {}> {
    _toDispose = [];
    @observable browser: any;
    @observable.ref loadError: Error;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
		const {_toDispose} = this;

		_toDispose.push(
			autorun(() => {
				const {investmentOptimizationId: id} = this;
				runInAction(async () => {
					if (id && !ioStore.ios.has(id)) {
						try {
							this.loadError = null
							await ioStore.loadDescriptor(id);
						}
						catch (err) {
							site.raiseError(err, "julia")
							this.loadError = err;
						}
					}
				});
			}, {name: 'Load IO result if needed'}));
	}

    get preferences() {
		return settings.searchers.io
	}

    @computed
	get io(): IO {
		return this.investmentOptimizationId ? ioStore.ios.get(this.investmentOptimizationId) : null;
	}

    @computed
	get investmentOptimizationId() {
		return this.props.params.id
	}

    @computed
	get isBrowser() {
		return this.investmentOptimizationId == null
	}

    exportPageAsPdf = async () => {
		await ioFileControl.exportPDF(this.io, $('#investment-optimization-page'));
	}

    componentWillUnmount(): void {
		this._toDispose.forEach(f => f());
	}

    render() {
		const {loadError, isBrowser, investmentOptimizationId: id, io, preferences, props: {location}} = this;
		const { pdfExporter } = ioFileControl;

		SmartCard = components.SmartCard;

		const IO_title = IO.OBJECT_NAME_SINGLE;
		const IOs_title = IO.OBJECT_NAME_MULTI;

		//!api.julia.connected
		return (
			<ApplicationPage id="investment-optimization-page"
			                 className={css.root}
			                 tool={ActiveTool.io}
			                 title={() => `${IOs_title}${!id ? " Browser" : ""}`}
			                 loaded={true}
			                 renderTitle={() => {
				                 return null;
			                 }}
			                 applicationButtonText={() => {
				                 return !id
				                        ? `${IOs_title} Browser`
				                        : !this.io
				                          ? site.loadingText(IO.OBJECT_NAME_SINGLE)
				                          : IO_title //this.io.name
			                 }}
			                 breadcrumbs={() => {

				                 let result = [];
				                 result.push(<ApplicationPopoverMenu/>)

				                 if (this.browser && !_.isEmpty(this.browser.catalogContext.path)) {
					                 this.browser.panel.addToBreadcrumbs(result);
				                 }

				                 return result;
			                 }}
			                 afterBreadcrumbs={() => this.io != null && <IOApplicationBarItems io={this.io}/>}
			                 breadcrumbsRight={() => this.io != null && <ApplicationShortCuts
				                 getName={() => ioFileControl.getBookName(this.io)}
				                 setName={(s) => ioFileControl.setBookName(s,this.io)}
				                 delete={() => ioFileControl.deleteBook(this.io)}
				                 copy={() => ioFileControl.copyBook(this.io)}
				                 copyToNewTab={() => ioFileControl.copyBookToNewTab(this.io)}
								 exportPDF={io && io.supportPdfViewsInCurrentPage.length > 0 ? this.exportPageAsPdf : null}

								 objectType={IO.ObjectType}
								 lockerStatus={
									 _.includes([IOStatus.running, IOStatus.finalizable, IOStatus.finalizing], this.io.status) ? ApplicationShortCutsLockerStatus.RUNNING :
					                 this.io.inputsLocked ? ApplicationShortCutsLockerStatus.LOCKED : ApplicationShortCutsLockerStatus.UNLOCKED
				                 }
								 lockerUpdater={(locked) => {this.io.inputsLocked = locked; }}
			                 />}
			                 renderApplicationMenuItems={() => {
				                 const {browser, io} = this;
				                 return io == null ? <IOBrowserMenu/> : <IOContextMenu io={io}/>
			                 }}
			                 renderToolbar={() => {
				                 return null;//isBrowser ? null : io && <IOToolbar io={io}/>;
			                 }}

			>
				{loadError
				 ? <ErrorMessage message={site.errorText(IO.OBJECT_NAME_SINGLE)}/>
				 : isBrowser
				   ? <IOBrowser queryParams={location.query} multiselect ref={r => this.browser = r} onSelect={this.browser_onSelect}/>
				   : io && <IOComponent investmentOptimization={io}/>
				}
				<ExportPdfProgressDialog isOpen={pdfExporter.isPrinting} progress={pdfExporter.progress} />
			</ApplicationPage>)
	}

    @observable isCreating = false;

    browser_onSelect = (investmentOptimizations: Array<IO>) => {
	}
}
