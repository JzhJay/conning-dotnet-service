/**
 * Todo:
 *      - Switch between views
 *      - Chart demo data
 *       - Pull the toolbar from the chart into the query view
 *       - Spec for specifying context menu / Toolbar menu items for a component
 *
 *      - Dynamic Layout:
 *          - How many columns should this row have?
 *          - Splitter Control to resize rows
 *          - Drag and drop of components
 *          - Deletion of components
 *          - Deletion of rows (only when empty?)
 *       - Url === The Report
 *          - Rows, Columns, GUID, ReportQuery, Row Flex weights
 *
 */

import * as css from "./QueryViewComponent.css";

import {
	PivotTable,
	HighchartsComponent,
	CorrelationTable,
	LoadingIndicator, sem, bp} from 'components';
import { PivotTableDragPreview } from '../../pivot/PivotTableDragPreview';
import {api, queryStore, queryResultStore, PivotUserOptions, i18n} from 'stores';
import type { QueryViewName } from 'stores/query';
import { Query} from 'stores/query';
import { DuplicateDirection, ChartUserOptions, PivotMetadata, QueryViewUserOptions } from 'stores';
import { FormattedMessage } from 'react-intl';

const { constants: { viewDescriptors } } = api;

import { DraggableQueryBuilder } from 'components/system/query-tool/query-builder';
import { observer } from 'mobx-react'
import { computed, observable, makeObservable } from 'mobx';

export interface QueryViewComponentController {
	renderToolbar: () => React.ReactNode | React.ReactNode[];
}

interface MyProps {
	viewName?: QueryViewName;
	queryId?: string;
	style?: React.CSSProperties;
	showToolbar?: boolean;
	className?: string;
	additionalMenuItems?: JSX.Element[];
	userOptions?: QueryViewUserOptions;
	shouldRenderFullHeight?: boolean;
	isUseCaseQuery?: boolean;

	tryHandleKeyboardShortcuts?: boolean;
	arrangementChanged?: () => void;

	onLoaded?: () => void;
	onUnlink?: () => void;
	onClone?: (direction: DuplicateDirection) => void;
	onQueryUpdated?: (query: Query) => void;

	isLayoutDragging?: boolean;

	onUserOptionsUpdated?: (userOptions: QueryViewUserOptions) => void;
	onSetController?: (QueryViewController) => void;
}

/**
 * This component is responsible for connecting to a given piece of data, representable in a pivot and other
 * possible views like correlation table, scatter chart, PDF chart, etc
 **/
@observer
export class QueryViewComponent extends React.Component<MyProps, {}> {
    static defaultProps: MyProps = {
		viewName: 'pivot',
		tryHandleKeyboardShortcuts: false,
	}

    @observable actionMenuItems?: JSX.Element[];
    @observable chartData;
    @observable.ref viewComponent;

	constructor(props) {
		super(props);

        makeObservable(this);

		this.startUp();
    }

    // @computed get query() {
    // 	return api.query.loadedQueries.get(this.props.queryId);
    // }

    @computed
	get queryResult() {
		return this.query && this.query.hasResult && this.query.queryResult;
	}

    @computed
	get query() {
		return queryStore.loadIfNeeded(this.props.queryId, this.props.isUseCaseQuery)
	}

    node: Node;
    _toDispose = [];

    componentDidMount() {
		queryStore.setRecentQuery(this.props.queryId);
		this.node = ReactDOM.findDOMNode(this);
		// // Replaced by QueryRunProgress component
		// const toastIds = {};
		// false && this._toDispose.push(
		// 	autorun(`Show toast popup in response to query SSE`, () => {
		// 		const { query, toaster } = this;
		//
		// 		if (toaster && query instanceof Query) {
		// 			const { eventSource } = query;
		// 			eventSource && eventSource.progressMap.entries().forEach(
		// 				entry => {
		// 					const [key, message] = entry
		//
		// 					if (key != 'session' && key != 'vtp' && key != 'simservers') {
		// 						if (!toastIds[key]) {
		// 							const id = toaster.show({ message: <ProgressMessageComponent messageKey={key} message={message}/>, timeout: 0 });
		// 							toastIds[key] = id;
		// 							console.log(`toast id: ${key} -> ${id}`)
		// 						}
		// 						else {
		// 							toaster.update(toastIds[key], { message: <ProgressMessageComponent messageKey={key} message={message}/>, timeout: 0 });
		// 						}
		//
		// 						if (message.denominator != null && message.denominator == message.numerator) {
		// 							setTimeout(() => {
		// 								toaster.dismiss(toastIds[key])
		// 								delete toastIds[key];
		// 							}, 5000);
		// 						}
		// 					}
		// 				});
		//
		// 			// Kill any toasts that no longer exist
		// 			_.keys(toastIds).forEach(key => {
		// 				if (eventSource && !eventSource.progressMap.has(key)) {
		// 					toaster.dismiss(toastIds[key])
		// 				}
		// 			});
		// 		}
		// 	}));
	}

    startUp() {
		//reaction(() => )
		// if (oldProps.viewName !== this.props.viewName) {
		// 	if (this.state.chartData != null) {
		// 		this.setState({chartData: null});
		// 	}
		//
		// 	this.loadDataIfNeeded();
		// }

		const { viewName, queryId } = this.props;

		// if (viewName == 'query' && !queryId) {
		// 	throw new Error('A query ID is required when in query view mode');
		// }

		const { onSetController } = this.props;
		if (onSetController) {
			onSetController({
				                renderToolbar: () => {
					                const { viewComponent } = this;
					                return viewComponent && viewComponent.renderToolbar && viewComponent.renderToolbar();
				                }
			                })
		}
	}

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

    arrangementChanged = (pivotMetadata: PivotMetadata) => {
		if (this.props.arrangementChanged) {
			this.props.arrangementChanged();
		}
	}

    onUserOptionsUpdated = (userOptions: ChartUserOptions) => {

		this.persistUserOptions(userOptions);

		if (this.props.onUserOptionsUpdated) {
			this.props.onUserOptionsUpdated(userOptions);
		}
	}

    persistUserOptions = _.debounce((userOptions: ChartUserOptions) => {
		this.queryResult.updateUserOptions(this.props.viewName, userOptions);
	}, 200, { leading: false }) // Run the LASTMOST call when the debounce triggers

    toaster: bp.Toaster;

    render() {
		let {
			isLayoutDragging, showToolbar,
			style, onLoaded,
			viewName, queryId, ...props
		} = this.props;


		const { queryResult, query } = this;

		if (!query) {
			return <LoadingIndicator>
				<FormattedMessage defaultMessage="Loading query view ..." description="[Query] Message for loading query view" />
			</LoadingIndicator>;
		}

		if (!query.hasResult) {
			viewName = 'query'
		}

		let { userOptions } = this.props;
		if (!userOptions) {
			userOptions = viewName === 'query' ? api.queryStore.defaultUserOptions :
			              viewName === 'pivot' && queryResult && queryResult.userOptions && queryResult.userOptions[viewName] ? queryResult.userOptions[viewName] :
						  viewName === 'pivot' ? queryResultStore.pivot.defaultUserOptions()
						 : null;
		}

		let queryIsLoading = (viewName === 'query' && queryId && !query);

		let viewComponent = null;
		if ((viewName !== 'query' && !queryResult)
		    // The query is loading from the backend
		    || queryIsLoading) {
			viewComponent = <LoadingIndicator>
				<FormattedMessage defaultMessage="Loading query result..." description="[Query] Message for loading query result" />
			</LoadingIndicator>;
		}
		else if (viewName !== 'query' && queryResult && queryResult.error) {
			viewComponent = <sem.Message error style={{ flexGrow: 1 }}>
				<sem.Message.Header><FormattedMessage defaultMessage="Your query could not be loaded." description="[Query] Message for failing to load query result" /></sem.Message.Header>
				<sem.Message.Content>
					<sem.Message.List>
						<sem.Message.Item>
							{queryResult.error.message}
						</sem.Message.Item>
					</sem.Message.List>
				</sem.Message.Content>
			</sem.Message>
		}
		else if (viewName !== 'query' && queryResult && !queryResult.pivotMetadata) {
			viewComponent = <LoadingIndicator>
				{!queryResult.descriptor.ready ? i18n.intl.formatMessage({ defaultMessage: 'Waiting for result to be ready...', description: '[Query] Message for waiting query result to be ready'}) : i18n.intl.formatMessage({ defaultMessage: 'Loading pivot information...', description: '[Query] Message for loading pivot table information'})}
			</LoadingIndicator>;
		}
		else if (query.status == 'resetting') {
			viewComponent = <LoadingIndicator>
				<FormattedMessage defaultMessage="Your query is being reset..." description="[Query] Message for restting query" />
			</LoadingIndicator>
		}else if (query.status == 'duplicating') {
			viewComponent = <LoadingIndicator>
				<FormattedMessage defaultMessage="Your query is being duplicated..." description="[Query] Message for duplicating a query" />	
			</LoadingIndicator>
		}
		else if (query.status == 'deleting') {
			viewComponent = <LoadingIndicator>
				<FormattedMessage defaultMessage="Your query is being deleted..." description="[Query] Message for deleting a query" />	
			</LoadingIndicator>
		}
		else if (queryResult && queryResult.switchingTo) {
			viewComponent = <LoadingIndicator>
				<FormattedMessage defaultMessage="Switching to '{switchingTo}'..." description="[Query] Message for switching to query result" values={{switchingTo: queryResult.switchingTo.capitalize()}} />	
			</LoadingIndicator>
		}
		else if (!query.hasResult && !queryIsLoading && (viewName === 'pivot' || viewName === 'correlation')) {
			viewComponent = <LoadingIndicator>
				<FormattedMessage defaultMessage="A valid query-result must be specified to switch to '{viewName}" description="[Query] Message for switching to query result view but no valid query result is available" values={{viewName}} />	
			</LoadingIndicator>
		}
		else if (queryResult && queryResult.availableViews.length == 0) {
			viewComponent = <div className={css.emptyPivot}>
				<span className="text"><FormattedMessage defaultMessage="Your query returned no viewable data." description="[Query] Message for no viewalbe query result for the query" />	
				</span>
			</div>
		}
		else if (viewName != 'query' && queryResult && queryResult.pivotMetadata && !_.includes(queryResult.availableViews.filter(v => v.available).map(v => v.name), viewName)) {
			viewComponent = <div className={css.unsupportedView}>
				{/*<AppIcon large icon={appIcons.queryTool.views.unsupported}/>*/}
				<span className="text">
					<FormattedMessage defaultMessage="Your current pivot selection is not valid for view:  '{viewName}'." description="[Query] Message for invalid pivot selection in query result view" values={{viewName: viewName.capitalize()}} />	
				</span>	
			</div>
		}
		else {
			switch (viewName) {
				case 'query':
					/* showToolbar={!stealToolbar}
					 additionalMenuItems={this.props.additionalMenuItems}
					 onUpdateAvailableViews={this.updateAvailableViews}
					 className={viewClassName}
					 guid={guid}*/

					viewComponent = <DraggableQueryBuilder ref={r => this.viewComponent = r} {...props}
					                                       queryId={queryId}
					                                       onLoaded={onLoaded}
					                                       onQueryUpdated={this.props.onQueryUpdated}/>

					break;

				case 'pivot':
					viewComponent = isLayoutDragging
						? <PivotTableDragPreview queryResult={queryResult}/>
						: <PivotTable ref={r => this.viewComponent = r}
						              key={queryResult.pivotMetadata.arrangementUID}
						              onLoaded={onLoaded}
						              showToolbar={true}
						              shouldRenderFullHeight={this.props.shouldRenderFullHeight}
						              arrangementChanged={this.arrangementChanged}
						              additionalMenuItems={this.props.additionalMenuItems}
						              className={css.viewComponent}
						              query={query}
						              onUserOptionsUpdated={(newUserOptions) => this.queryResult.updateUserOptions(this.props.viewName, newUserOptions)}
						              userOptions={userOptions as PivotUserOptions}
						              queryResult={queryResult}/>
					break;

				case 'correlation':
					viewComponent = <CorrelationTable ref={r => this.viewComponent = r}
					                                  onLoaded={onLoaded}
					                                  className={css.viewComponent}
					                                  isLayoutDragging={isLayoutDragging}
					                                  query={query}
					                                  queryResult={queryResult}/>
					break;

				case viewDescriptors.box.name:
				case viewDescriptors.cone.name:
				case viewDescriptors.cdf.name:
				case viewDescriptors.scatter.name:
				case viewDescriptors.pdf.name:
				case viewDescriptors.line.name:
				case viewDescriptors.bar.name:
				case viewDescriptors.histogram.name:
				case viewDescriptors.beeswarm.name:

					viewComponent = <HighchartsComponent ref={r => this.viewComponent = r}
					                                     guid={query.id}
					                                     key={viewName}
					                                     inlineToolbar={true}
					                                     className={css.viewComponent}
					                                     style={style}
					                                     onLoaded={onLoaded}
					                                     chartType={viewName}
					                                     chartingResult={queryResult}
					                                     onUserOptionsUpdated={this.onUserOptionsUpdated}
					                                     isLayoutDragging={isLayoutDragging}
					                                     userOptions={userOptions as ChartUserOptions}
					/>;

					break;
				default:
					return  <span className="error">
								<FormattedMessage defaultMessage="Unknown query view {viewName}." description="[Query] Message for invalid pivot selection in query result view" values={{viewName: viewName}} />
							</span>;
			}
		}

		return (
			<div
				key={queryId}
				className={classNames(css.queryView, this.props.className, viewName)}>
				{viewComponent}

				<bp.Toaster ref={r => this.toaster = r}/>
			</div>
		)
	}
}
