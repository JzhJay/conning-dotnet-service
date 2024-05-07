import {NavbarDivider} from '@blueprintjs/core';
import {Link} from 'react-router'
import * as css from './ReportBrowser.css';
import {utility, site, api, settings, Report, reportStore, ReportDescriptor, user, mobx, OmdbTag, ObjectTypesQuery, ObjectTypeQuery} from 'stores';
import KeyCode = utility.KeyCode;
import {ContextMenu, GridPanel, SortableCardsPanel, dialogs, bp, ObjectBrowserProps} from 'components';
import { observable, computed, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {ui} from '../../semantic-ui/SemanticMenu.css';
import {ReportCard} from "./";
import {ReportCard_TitleIcons} from "./ReportCard";
import {omdb} from '../../../stores';
import {Query} from '../../../stores/query/ui';

export interface ReportChooserController {
	autoSizeColumns();
}

@observer
export class ReportBrowser extends React.Component<ObjectBrowserProps<ReportDescriptor>, {}> {
    @observable contextReport?: ReportDescriptor;
    @observable renamingReport?: ReportDescriptor;

	constructor(props) {
		super(props);

        makeObservable(this);

		reportStore.loadDescriptors();
    }

    get preferences() {
		return settings.searchers.reports
	}

    static defaultProps = {
		title:       'Reports',
		showTitle:   true,
		showActions: true,
		allowNew:    true
	};

    @computed
	get reports() {
		const {hasLoadedDescriptors, descriptors, loadedReports} = reportStore;

		if (!reportStore.hasLoadedDescriptors) {
			return [];
		}
		else {
			return mobx.keys(descriptors).map((reportId) => {
				if (loadedReports.has(reportId)) {
					return loadedReports.get(reportId);
				}
				else {
					// Asynchronously grab the report data
					// Todo:  We should improve the descriptor call to only return data we need
					setTimeout(() => reportStore.loadReport(reportId), 50);
					return descriptors.get(reportId)
				}
			})
		}
	}

    render() {
		const {reports, preferences, props: {view: propsView}} = this;

		const multiselect = reports && reports.length > 1;

		return <ObjectTypeQuery query={omdb.graph.objectType} variables={{objectType: Report.ObjectType}}>
			{({loading, error, data}) => {
				if (loading || error) {
					return null
				}
				const {ui} = data.omdb.objectType;

				const tableColumns = ui.table.columns.slice();

				const actionsColumn = tableColumns.find(f => f.name == SortableCardsPanel.ACTIONS_FIELD);
				if (actionsColumn) {
					actionsColumn.renderValue = (r) => <ReportCard_TitleIcons report={r} className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}/>
				}

				tableColumns.push(new OmdbTag({name: 'pages', label: '# of Pages', align: 'right', renderValue: (r: Report) => r.pages ? r.pages.length : ''}))

				return <SortableCardsPanel objectType={Report.ObjectType}
				                           {...this.props}
				                           selectable
				                           view={propsView || preferences.view}
				                           onSetView={v => preferences.view = v}

				                           renderCard={(report, panel) => <ReportCard key={report.id} report={report} panel={panel}/>}
				                           cards={reports}
				                           loaded={reportStore.hasLoadedDescriptors}
				                           createItemLink={<a onClick={() => site.actions.newReport()}>Create one</a>}
				                           multiselect={multiselect}
				                           showUserFilter={true}

				                           uiDefinition={ui}
				                           tableColumns={tableColumns}

				                           toolbarChildrenRight={panel =>
					                           false && <div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
						                           {panel && multiselect && <bp.AnchorButton
							                           text={`Delete ${panel.selectedItems.size > 1 ? `${panel.selectedItems.size} ` : ''}${panel.selectedItems.size < 2 ? 'Report' : 'Reports'}`}
							                           icon="trash" disabled={panel.selectedItems.size == 0}
							                           onClick={panel.deleteSelectedItems}/>}

						                           <NavbarDivider />

						                           <bp.Button text="New Report" icon="plus" onClick={() => site.actions.newReport()}/>
					                           </div>}
				/>
			}}
		</ObjectTypeQuery>
	}

    renderNameColumn = (args) => {
		const cellReport                      = args.rowData;
		const {renamingReport, contextReport} = this;
		const isRenaming                      = renamingReport != null && renamingReport === cellReport;

// onContextMenu={e => this.onContextMenu(e, cellReport)} */}

		return isRenaming ? <div className={classNames(["ui","input",css.reportNameInput])} title={`Renaming '${renamingReport.name}'`}>
			                  <input ref={input => {
				                  if (input) {
					                  input.select()
				                  }
			                  }}
			                         defaultValue={renamingReport.name}
			                         onBlur={this.onRenamingReportBlur}
			                         onKeyUp={this.onRenamingReportKeyUp}/>
		                  </div>
		                  : <div className={classNames("ui", "fluid", css.reportNameLabel, {[css.isContextReport]: cellReport === contextReport})}
		                         title={`Click to rename '${cellReport.name}'`}
		                         onClick={e => this.renameReport(cellReport)}>
			       {cellReport.name}
		       </div>;
	}

    contextMenu: ContextMenu;

    onContextMenu = (e: React.MouseEvent<HTMLElement>, report: ReportDescriptor) => {
		e.preventDefault();
		this.contextMenu.show(e.nativeEvent as MouseEvent);
		this.setState({contextReport: report});
	}

    renameReport = (report?: ReportDescriptor) => {
		this.renamingReport = report ? report : this.contextReport;
	}

    onRenamingReportBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
		console.log(e);
		let input = e.target as HTMLInputElement;

		const {renamingReport} = this;

		if (input.value.length > 0 && input.value !== renamingReport.name) {
			//renamingReport.rename(input.value);
		}

		this.renamingReport = null;
	}

    onRenamingReportKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		let input = e.target as HTMLInputElement;

		switch (e.keyCode) {
			case KeyCode.Enter: {
				input.blur();

				break;
			}

			case KeyCode.Escape: {
				input.value = this.renamingReport.name;
				input.blur();
				break;
			}

			case KeyCode.Tab: {
				if (e.shiftKey) {
					//this.props.onSelectPreviousReportItem();
				} else {
					//this.props.onSelectNextReportItem();
				}
				break;
			}

			default:
				break;
		}
	}

    //open         = (report: ReportDescriptor) => api.report.open(report.id);
    //openInNewTab = (report: ReportDescriptor) => window.open(utility.locationToUrl(api.report.locationFor(report.id)));
}
