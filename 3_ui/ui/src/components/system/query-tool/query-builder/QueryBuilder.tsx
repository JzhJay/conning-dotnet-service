/*
 Horizontal row of panels like:

 |   Variables  +|   Time-Steps  |   Scenarios   |   Statistics +|   Arrangement |   Results |
 |               |               |               |               |               |           |

 */
import * as css from './QueryBuilder.css'
import type { SimulationBrowserController } from 'components';
import { LoadingIndicator, LoadingEllipsis, SimulationBrowser, ModalDialog, bp, QueryContextMenu, QueryRunProgress } from 'components';
import { Query, ReportQuery, routing, queryStore } from 'stores'
import { ArrangementPanel, ScenariosPanel, StatisticsPanel, TimeStepsPanel, VariablesPanel } from './query-parts';
import { observer } from 'mobx-react'
import { observable, makeObservable } from 'mobx';
import { Menu, MenuItem, ProgressBar, Checkbox, Intent, Button, Position, Toaster, Tooltip, ContextMenuTarget, MenuDivider } from '@blueprintjs/core';

// import {QueryViewUiDescriptor, SelectableQueryView, ReportQuery} from 'stores/report'
// const {constants: {viewDescriptors}} = api;

/**
 * Move storing queries into a store via a lookup table
 * Don't rely upon any report store access
 * Strip out any report specific props
 *
 */
interface MyProps {
	query: Query;
	reportQuery?: ReportQuery;
	isLayoutDragging?: boolean;

	/**
	 * The query builder may be contained by a report item, in which case when the query is created
	 * we need to update the report item to point to the new GUID.
	 * @param query
	 */
	onQueryUpdated?: (query?: Query) => void;
}

@observer
@ContextMenuTarget
export class QueryBuilder extends React.Component<MyProps, {}> {
    modal: ModalDialog;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const { props, isCreating } = this;
		const { query } = props;

		const queryProps = { query: query };

		const {shouldExpandVariables} = query;
	    const showVariables = !shouldExpandVariables || query.currentPage.part == "variables";
		const showOtherSpecifications = !shouldExpandVariables || query.currentPage.part == "specification";

		return (
			<div className={classNames(css.root, { hidden: props.isLayoutDragging })}>
				{/*className={classNames(css.toolbar)}*/}
				{/*{...this.props}*/}
				{/*onRunQuery={this.onRunQuery}*/}
				{/*onShowSimulationBrowser={() => this.modal.show() }/>*/}

				{!query ? <LoadingIndicator>Loading Query...</LoadingIndicator>
					: query.isRunning || query.status == 'running' ? <QueryRunProgress query={query}/>
					 : query.status ? <LoadingIndicator>{
						                query.status == 'creating' ? 'Creating Query...'
							                : query.status == 'duplicating' ? 'Your query is being duplicated...'
							                : ''
					                }</LoadingIndicator>
						  : <div className={css.queryPanels} role="query-panel">

						   {showVariables && <VariablesPanel {...queryProps}/>}

						   {/*
					  <div className={css.superPanelColumn}>
					  <TimeStepsPanel {...queryProps}/>
					  <ScenariosPanel {...queryProps}/>
					  </div>
					  <div className={css.superPanelColumn}>
					  <StatisticsPanel {...queryProps}/>
					  <ArrangementPanel {...queryProps}/>
					  </div>
					  */}

						   {showOtherSpecifications && <TimeStepsPanel {...queryProps}/>}
						   {showOtherSpecifications && <ScenariosPanel {...queryProps}/>}
						   {showOtherSpecifications && <StatisticsPanel {...queryProps}/>}
						   {showOtherSpecifications &&  <ArrangementPanel {...queryProps}/>}
					   </div>
				}

				{query && query.isRunning && <LoadingEllipsis className={css.loadingOverlay}/>}

				{/*<span className={css.lastModified}><b>Last modified:</b> {query.modifiedTime}</span>*/}
			</div>);
	}

    SimulationBrowserController: SimulationBrowserController;

    @observable isCreating = false;
    @observable openInNewTab = true;

    renderContextMenu() {
		const { props: { query, reportQuery }, openInNewTab } = this;

		return <QueryContextMenu location='builder' currentView='query' reportQuery={reportQuery} query={query}/>
	}

    private onApproveSimulationBrowser = () => {
		const selectedSimulationIds = this.SimulationBrowserController.getSelectedSimulationIds();
		const { query } = this.props;

		if (selectedSimulationIds && selectedSimulationIds.length > 0) {
			// Create the query / update the simulations
			if (query == null) {
				// Create the query
				// Todo - Allow the user to set the name
				this.isCreating = true;
				queryStore.createQuerySessionDescriptor("New Query", [_.first(selectedSimulationIds)], null, true).then(id => {
					routing.push(routing.routeFor.query(id));
					this.isCreating = false;
				});

			}
			else {
				// Update the query - NYI
				console.error('Modifying pre-existing queries is not supported - NYI')
			}

			if (this.props.onQueryUpdated) {
				this.props.onQueryUpdated(query);
			}

			return true;
		}
		else {
			return false;
		}
	}

    // onRunQuery = () => {
    // 	const {query} = this.props;
    // 	query.run().then(queryResultId => {
    // 		if (queryResultId.length > 0) {
    // 			//dispatch(api.queryResult.openInNewWindow(queryResultId, this.props.query.views.panels[0].checkedLabels));
    // 		}
    // 	});
    //
    // 	// // Create a new query report page and add all the result views to it
    // 	// const report = this.props.currentReport;
    // 	// const page = new ReportPage({name: `${this.state.query.name} (Result)`, children: []});
    // 	// report.children.push(page)
    // 	//
    // 	// const queryOptions = this.props.view.userOptions['query'] as QueryOptions;
    // 	//
    // 	// for (let viewResult of queryOptions.views) {
    // 	//     const viewItem = new QueryView({guid: queryResultId, view: viewResult });
    // 	//     report.children.push(viewItem);
    // 	// }
    // 	//
    // 	// dispatch(api.reportBrowserActions.updateReportItem(report));
    // 	// // Create a view result for each view the user specified
    // 	// //page.children.push(new QueryView())
    //
    // }
}

