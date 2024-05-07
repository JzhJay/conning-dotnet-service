import { defineMessages } from 'react-intl';
import {QueryViewComponent, QuerySidebar, LoadingUntil, LoadingIndicatorWithStatus} from 'components';
import { Query, queryStore, routing, ReportQuery, QueryDescriptor, settings, i18n } from 'stores';
import {ExpireDialogComponent} from '../../ExpireDialog/ExpireDialog';
import * as css from './QueryPanel.css';

import { observer } from "mobx-react";
import { computed, makeObservable } from "mobx";

interface MyProps {
	query: Query | QueryDescriptor;
	reportQuery?: ReportQuery;
	deleting?: boolean;
	view?: string;
	onSetCurrentView?: (viewName) => void;
	isLayoutDragging?: boolean;
	onLoaded?: () => void;
}

const i18nMessages = defineMessages({
	creating: {
		defaultMessage: 'Creating query...',
		description: '[Query] Display message for Query is creating'
	},
	starting: {
		defaultMessage: 'Starting query...',
		description: '[Query] Display message for Query is Starting'
	},
	deleting: {
		defaultMessage: 'Deleting query...',
		description: '[Query] Display message for Query is Deleting'
	},
	deleted: {
		defaultMessage: 'You query is being deleted...',
		description: '[Query] Display message for Query is being deleted'
	},
	loading: {
		defaultMessage: 'Your query is loading...',
		description: '[Query] Display message for Query is loading'
	}
});

@observer
export class QueryPanel extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed get loadingMessage() {
		//return this.props.query instanceof QueryDescriptor ? 'Starting Session...' : 'Loading...';
		const {deleting, query, reportQuery} = this.props;
		const {formatMessage} = i18n.intl;

		if (reportQuery) {
			switch (reportQuery.status) {
				case 'creating': {
					return formatMessage(i18nMessages.creating);
				}
				case 'starting': {
					return formatMessage(i18nMessages.starting);;
				}
				case 'deleting': {
					return formatMessage(i18nMessages.deleting);;
				}
			}
		}
		return deleting ? formatMessage(i18nMessages.deleted) : formatMessage(i18nMessages.loading);
	}

    sidebarRef;
    render() {
		const { query, reportQuery, view, onSetCurrentView, isLayoutDragging, onLoaded} = this.props;

		const qr = query ? query.queryResult : null;

		const viewName = view ? view : reportQuery ? reportQuery.view : qr ? qr.currentView : 'query';

		const isLoaded = query instanceof Query && (reportQuery == null || reportQuery.loaded);

		if (!isLoaded) {
			return <LoadingIndicatorWithStatus model={query}>{this.loadingMessage}</LoadingIndicatorWithStatus>
		}

		return <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'row', overflow: "hidden" }}>
			{query && <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', overflow: 'auto' }}>
				{/*{this.renderToolbar()}*/}
				<QueryViewComponent key="qvc" queryId={query.id}
				                    onLoaded={onLoaded}
				                    viewName={viewName} isLayoutDragging={isLayoutDragging}
				/>
			</div>}

			{query instanceof Query && viewName != "query" && !isLayoutDragging && <QuerySidebar
				ref={(r) => this.sidebarRef = r}
				reportQuery={reportQuery}
				query={query}
				queryResult={qr}
				availableViews={qr ? qr.availableViews : query.availableViews}
				onSetCurrentView={onSetCurrentView}
				currentView={!qr ? query.desiredView : viewName}
				className={classNames(css.toolbar,
				                      {[css.visible]: query.showToolbar && settings.report.showQuerySidebars && query.hasResult})}
				direction="column"/>}
			{query instanceof Query && !isLayoutDragging && <ExpireDialogComponent
				app={query}/>}
		</div>
	}
}