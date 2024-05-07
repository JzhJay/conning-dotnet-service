import * as components from 'components';
import {ApplicationPage, ApplicationPopoverMenu, ErrorMessage} from 'components';
import {ApplicationShortCuts, ApplicationShortCutsLockerStatus} from 'components/site/ApplicationShortCuts';
import type {IReactionDisposer} from 'mobx'
import {autorun, computed, makeObservable, observable, runInAction,} from 'mobx';
import {observer} from 'mobx-react'
import * as React from 'react';
import {ClimateRiskAnalysis, ClimateRiskAnalysisStatus, climateRiskAnalysisStore, settings, site} from 'stores';
import {ActiveTool} from 'stores/site';
import {ExportPdfProgressDialog} from '../ExportPdfReport/ExportPdfProgressDialog';
import {ClimateRiskAnalysisApplicationBarItems} from './ClimateRiskAnalysisApplicationBarItems';
import {ClimateRiskAnalysisBrowser} from './ClimateRiskAnalysisBrowser';
import {ClimateRiskAnalysisComponent} from './ClimateRiskAnalysisComponent';
import {ClimateRiskAnalysisBrowserMenu, ClimateRiskAnalysisContextMenu, climateRiskAnalysisFileControl} from './ClimateRiskAnalysisContextMenu';
import * as css from './ClimateRiskAnalysisPage.css';

let SmartCard

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	params?: { id?: string }
}

interface QueryString {
	defaultSelect?: string
}

@observer
export class ClimateRiskAnalysisPage extends React.Component<MyProps, {}> {
    _toDispose: IReactionDisposer[] = [];
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
				const {climateRiskAnalysisId: id} = this;
				runInAction(async () => {
					if (id && !climateRiskAnalysisStore.climateRiskAnalyses.has(id)) {
						try {
							this.loadError = null
							await climateRiskAnalysisStore.loadDescriptor(id);
						}
						catch (err) {
							site.raiseError(err, "julia")
							this.loadError = err;
						}
					}
				});
			}, {name: 'Load ClimateRiskAnalysis result if needed'}));
	}

    get preferences() {
		return settings.searchers.climateRiskAnalysis
	}

    @computed
	get climateRiskAnalysis(): ClimateRiskAnalysis {
		return this.climateRiskAnalysisId ? climateRiskAnalysisStore.climateRiskAnalyses.get(this.climateRiskAnalysisId) : null;
	}

    @computed
	get climateRiskAnalysisId() {
		return this.props.params.id
	}

    @computed
	get isBrowser() {
		return this.climateRiskAnalysisId == null
	}

    exportPageAsPdf = async () => {
		await climateRiskAnalysisFileControl.exportPDF(this.climateRiskAnalysis, $('#climate-risk-analysis-page'));
	}

	deleteClimateAnalysis = async () => {
		await climateRiskAnalysisFileControl.deleteBook(this.climateRiskAnalysis, (isSuccess) => {
			if (isSuccess) {
				this.disposeAllReactions();
			}
		});
	}

	disposeAllReactions = () => {
		this._toDispose.forEach(f => f());
	}

	componentWillUnmount(): void {
		this.disposeAllReactions();
	}

    render() {
		const {loadError, isBrowser, climateRiskAnalysisId: id, climateRiskAnalysis, preferences, props: {location}} = this;
		const supportPdfViewsInCurrentPage = climateRiskAnalysis?.supportPdfViewsInCurrentPage || [];
		const { pdfExporter } = climateRiskAnalysisFileControl;

		SmartCard = components.SmartCard;

		//!api.julia.connected
		return (
			<ApplicationPage id="climate-risk-analysis-page"
			                 className={css.root}
			                 tool={ActiveTool.climateRiskAnalysis}
			                 title={() => `Climate Risk Analysis ${!id ? " Browser" : ""}`}
			                 loaded={true}
			                 renderTitle={() => {
				                 return null;
			                 }}
			                 applicationButtonText={() => {
				                 return !id
				                        ? 'Climate Risk Analysis Browser'
				                        : !this.climateRiskAnalysis
				                          ? site.loadingText(ClimateRiskAnalysis.OBJECT_NAME_SINGLE)
				                          : 'Climate Risk Analysis' //this.io.name
			                 }}
			                 breadcrumbs={() => {

				                 let result = [];
				                 result.push(<ApplicationPopoverMenu/>)

				                 if (this.browser && !_.isEmpty(this.browser.catalogContext.path)) {
					                 this.browser.panel.addToBreadcrumbs(result);
				                 }

				                 return result;
			                 }}
			                 afterBreadcrumbs={() => this.climateRiskAnalysis != null && <ClimateRiskAnalysisApplicationBarItems climateRiskAnalysis={this.climateRiskAnalysis}/>}
			                 breadcrumbsRight={() => this.climateRiskAnalysis != null && <ApplicationShortCuts
				                 getName={() => climateRiskAnalysisFileControl.getBookName(this.climateRiskAnalysis)}
				                 setName={(s) => climateRiskAnalysisFileControl.setBookName(s,this.climateRiskAnalysis)}
				                 delete={this.deleteClimateAnalysis}
				                 copy={() => climateRiskAnalysisFileControl.copyBook(this.climateRiskAnalysis)}
				                 copyToNewTab={() => climateRiskAnalysisFileControl.copyBookToNewTab(this.climateRiskAnalysis)}
								 exportPDF={supportPdfViewsInCurrentPage.length > 0 ? this.exportPageAsPdf : null}

								 objectType={ClimateRiskAnalysis.ObjectType}
								 lockerStatus={
								    this.climateRiskAnalysis.status == ClimateRiskAnalysisStatus.running ? ApplicationShortCutsLockerStatus.RUNNING :
								    this.climateRiskAnalysis.inputsLocked ? ApplicationShortCutsLockerStatus.LOCKED : ApplicationShortCutsLockerStatus.UNLOCKED
							     }
				                 lockerUpdater={(locked) => {this.climateRiskAnalysis.inputsLocked = locked; }}
							 />}
			                 renderApplicationMenuItems={() => {
				                 const {browser, climateRiskAnalysis} = this;
				                 return climateRiskAnalysis == null ? <ClimateRiskAnalysisBrowserMenu/> : <ClimateRiskAnalysisContextMenu climateRiskAnalysis={climateRiskAnalysis}/>
			                 }}
			                 renderToolbar={() => {
				                 return null;
			                 }}

			>
				{loadError
				 ? <ErrorMessage message={site.errorText(ClimateRiskAnalysis.OBJECT_NAME_SINGLE)}/>
				 : isBrowser
				   ? <ClimateRiskAnalysisBrowser queryParams={location.query} multiselect ref={r => this.browser = r} onSelect={this.browser_onSelect}/>
				   : climateRiskAnalysis && <ClimateRiskAnalysisComponent climateRiskAnalysis={climateRiskAnalysis}/>
				}
				<ExportPdfProgressDialog isOpen={pdfExporter.isPrinting} progress={pdfExporter.progress} />
			</ApplicationPage>)
	}

    @observable isCreating = false;

    browser_onSelect = (climateRiskAnalysis: Array<ClimateRiskAnalysis>) => {
	}
}
