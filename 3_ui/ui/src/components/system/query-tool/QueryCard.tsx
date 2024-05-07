import {IOCardToolbarButtons} from 'components/system/IO';
import {IOmdbTag, OmdbCardTag} from '../../../stores/objectMetadata/OmdbTag';
import * as css from './QueryCard.css'
import {
	queryStore,
	appIcons,
	Link,
	utility,
	simulationStore,
	Simulation,
	omdb,
	ObjectTypesQuery,
	GetSimulationQuery,
	ObjectTypeQuery,
	site, IO, apolloStore, IOmdbQueryGraph, OmdbCardSection, Report, i18n
} from "stores";
import {observer} from 'mobx-react'
import {sem, bp, dialogs, SmartCard, ReportCard, SortableCardsPanel, SimulationCard, QueryContextMenu, Highlighter, SmartCardProps, QueryBrowser} from 'components';
import {Query, QueryDescriptor} from 'stores/query';
import {AvailableQueryViewToolbar} from "./query-view/AvailableQueryViewToolbar";
import {IconButton} from "../../blueprintjs/IconButton";
import {computed, observable, makeObservable, action} from 'mobx';
import { FormattedMessage } from 'react-intl';

interface MyProps extends SmartCardProps  {
	query?: QueryDescriptor;
}

@observer
@bp.ContextMenuTarget
export class QueryCard extends React.Component<MyProps, {}> {

	@observable _sections = null;

	constructor(props) {
        super(props);

		if (this.props.sections) {
			this._sections = this.props.sections;
		} else {
			const settingsFromPanel = this.props.panel?.props.catalogContext?.getObjectType(Query.ObjectType);
			if (settingsFromPanel?.ui?.card?.sections) {
				this._sections = settingsFromPanel.ui.card.sections;
			} else {
				apolloStore.client.query<IOmdbQueryGraph>({
					query:     omdb.graph.objectType,
					variables: {objectType: Query.ObjectType}
				}).then(action(result => {
					this._sections = result.data?.omdb.objectType.ui.card.sections;
				}));
			}
		}

		makeObservable(this);
    }

	@computed get isLoading(){
		return this._sections == null;
	}

	@computed get sections() {
		if (this.isLoading) {
			return [];
		}
		const newSections: OmdbCardSection[] = [];
		const model = this.props.query as Query;
		if (model?.isRunning) {
			newSections.push({
				tags: [{label: i18n.intl.formatMessage({defaultMessage: 'Status', description: "[QueryCard] label representing the current state/status of a simulation, e.g. running or canceled"}), value: <span><FormattedMessage defaultMessage="{query} is running..." description= "[QueryCard] descrbes the current state of the query" values={{query: Query.OBJECT_NAME_SINGLE}} /></span>}]
			});
		}
		// if (model?.reportQueries.length > 0) {
		// 	newSections.push({
		// 		tags: [{
		// 			label: 'Reports',
		// 			type:  Report.ObjectType,
		// 			value: model?.reportQueries
		// 		}]
		// 	});
		// }

		_.forEach( this._sections , (section: OmdbCardSection) => {
			const newTags: OmdbCardTag[] = [];
			_.forEach(section.tags , (tag:OmdbCardTag) => {
				if (_.some(QueryBrowser.SIMULATION_TAG, t => t == tag.name)) {
					newTags.push({
						...tag,
						type: Simulation.ObjectType
					});
				} else if (_.some(QueryBrowser.REPORT_TAG, t => t == tag.name)) {
					newTags.push({
						...tag,
						type: Report.ObjectType
					});
				} else {
					newTags.push(tag);
				}
			})
			if (newTags.length) {
				newSections.push({
					label: section.label,
					tags: newTags
				})
			}
		});
		return newSections;
	}

	render() {
		const { isLoading, props: { className, panel, isTooltip, query, onDelete, onDuplicate, ...props } } = this;

		return <SmartCard
			loading={isLoading}
			className={classNames(css.root, className)}
			appIcon={appIcons.cards.query.cardIcon}
			panel={panel}
			isTooltip={isTooltip}
			{...props}
			model={query}

			onRename={async value => await query.rename(value)}
			titleIcons={<QueryCardToolbarButtons {...this.props}/>}
			title={{name: 'name'}}
			sections={this.sections}
		/>;
	}

	renderContextMenu(e) {
		if (!utility.isHyperlink(e.target)) {
			const {query, panel} = this.props;

			return <QueryContextMenu location='card' query={query} panel={panel}/>
		}
	}
}

export class QueryCardToolbarButtons extends React.Component<MyProps, {}> {
	render() {
		const {query, onDelete, onDuplicate} = this.props;
		return <bp.ButtonGroup className={this.props.className}>
			{/*<bp.Tooltip  content="Clone">*/}
			{/*<bp.AnchorButton icon="clone"*/}
			{/*onClick={() => api.routing.push(api.routing.routeFor.queryResult(query.queryResultId))}/>*/}
			{/*</bp.Tooltip>*/}

			<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({defaultMessage: "Edit {query}", description: "[QueryCard] tooltip for a button to modify/edit a query object"}, {query: Query.OBJECT_NAME_SINGLE})}>
				<bp.AnchorButton icon="manually-entered-data" href={query.routeFor("query")} onClick={(e) => {
					query.navigateTo('query');
					e.preventDefault()
				}}/>
			</bp.Tooltip>

			{!query.hasResult && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({defaultMessage: "Run {query}", description: "[QueryCard] tooltip for a button to run/start a query"}, {query: Query.OBJECT_NAME_SINGLE})}>
				<bp.AnchorButton icon="play" disabled={query.isRunning} onClick={() => query.run()}/>
			</bp.Tooltip>}

			{query.hasResult && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({defaultMessage: "View Result", description: "[QueryCard] tooltip for button to view the query object results"})}>
				<bp.AnchorButton icon="th" href={query.routeFor()} onClick={(e) => {
					query.navigateTo(query.queryResult.currentView || 'pivot');
					e.preventDefault();
				}}/>
			</bp.Tooltip>}

			{/*{query.hasResult &&*/}
			{/*<AvailableQueryViewToolbar query={query} />}*/}

			<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DUPLICATE(Query.OBJECT_NAME_SINGLE)}>
				<IconButton icon={appIcons.cards.clone} onClick={async () => {

					try {
						site.busy = true;
						let r = await query.duplicateWithoutSession();
						onDuplicate && onDuplicate(r);
					}
					finally {
						site.busy = false;
					}
				}}/>
			</bp.Tooltip>

			<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(Query.OBJECT_NAME_SINGLE)}>
				<IconButton icon={appIcons.cards.delete} onClick={async () => {
					if (await site.confirm(i18n.common.MESSAGE.WITH_VARIABLES.DELETE_CONFIRMATION(Query.OBJECT_NAME_SINGLE, query.name))) {
						let r = await queryStore.deleteQueryDescriptor(query.id);
						r != null && onDelete && onDelete(query.id);
					}
				}}/>
			</bp.Tooltip>
		</bp.ButtonGroup>
	}
}
