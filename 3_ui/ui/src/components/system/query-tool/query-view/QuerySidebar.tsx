import * as css from './QuerySidebar.css';
import { AppIcon, sem, bp, SmartCard, SimulationCard } from "components";
import { appIcons, api, Query, QueryDescriptor, QueryResult, Simulation, QueryViewAvailability, Link, ReportQuery, routing, reportStore } from 'stores'
import { observer } from 'mobx-react'
import { Menu, MenuDivider, MenuItem, Button, Popover, Position, PopoverInteractionKind, AnchorButton } from '@blueprintjs/core';
import { QueryViewRequirementsTooltip } from './QueryViewRequirementsTooltip';
import { StandaloneQueryPage } from '../query-builder';
import { action, makeObservable } from "mobx";

const { viewDescriptors } = api.constants;

interface MyProps {
	direction?: 'row' | 'column';
	availableViews: QueryViewAvailability[];
	className?: string;
	currentView: string;
	onSetCurrentView?: (view: string) => void;
	query?: Query;
	queryResult?: QueryResult;
	reportQuery?: ReportQuery;
	showTitleTooltips?: boolean;
}

const defaultAvailableViews: QueryViewAvailability[] = []

@observer
export class QuerySidebar extends React.Component<MyProps, {}> {
    static defaultProps = {
		direction     : 'row',
		availableViews: defaultAvailableViews
	}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		let { reportQuery, showTitleTooltips, direction, className, query, queryResult, currentView, availableViews, onSetCurrentView } = this.props;

		const viewDict = _.keyBy(availableViews, v => v.name);

		// Remove views we either don't know about or have decided not to show
		availableViews = availableViews.filter(({ name }) => {
			const descriptor = viewDescriptors[name];

			//!descriptor && console.log(`No descriptor for '${name}'`);

			return descriptor && !descriptor.hide;
		});

		availableViews = availableViews.sort((a, b) => {
			return viewDescriptors[a.name].ordinal - viewDescriptors[b.name].ordinal;
		})

		// availableViews = [
		// 	{available: true, name: 'query', description: query ? 'Run Query' : 'Return to Query Builder'},
		// 	...availableViews
		// ]

		return (<sem.Menu vertical={direction == 'column'}
		                  className={classNames(css.root, currentView, className)}>
			{/*{<sem.MenuItem fitted>*/}
			{/*<QueryResultsDropdownChooser simulation={simulation} query={query} queryResult={queryResult}/>*/}
			{/*</sem.MenuItem>}*/}

			{showTitleTooltips && <sem.MenuItem fitted>
				<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
					{(() => {
						const hasCoords = queryResult && queryResult.descriptor.singularAxisCoordinate;
						return <bp.Popover
							interactionKind={bp.PopoverInteractionKind.HOVER}
							disabled={!hasCoords}
							content={
								hasCoords && <SmartCard style={{ minWidth: 0 }} model={queryResult.descriptor.singularAxisCoordinate} showHeader={false} isTooltip
								                        title="Common Coordinates"
								                        sections={[
									                        {
										                        tags: _.keys(queryResult.descriptor.singularAxisCoordinate).sort().map(k => ({ name: k }))
									                        }
								                        ]}/>}>
							<bp.AnchorButton minimal>
								<sem.Icon name="cubes" disabled={!hasCoords} fitted/>
							</bp.AnchorButton>
						</bp.Popover>
					})()}


					{query.simulations.map(sim =>
						                       <bp.Popover
							                       key={sim._id}
							                       interactionKind={bp.PopoverInteractionKind.HOVER}
							                       content={<SimulationCard isTooltip sim={sim}/>}>
							                       <bp.AnchorButton minimal>
								                       <sem.Icon fitted name="database"/>
							                       </bp.AnchorButton>
						                       </bp.Popover>)}
				</div>
			</sem.MenuItem>
			}

			{/* Query Toolbar Item */}
			<div className={css.availableViews}>
				{availableViews.map((avail, i) => <AvailableQueryViewToolbarItem key={avail.name} {...this.props} i={i} view={avail}/>)}
			</div>
		</sem.Menu>)
	}

    @action clickRunQueryButton = async (e: React.MouseEvent<HTMLElement>) => {
		const { reportQuery, currentView, query, queryResult, onSetCurrentView } = this.props;

		if (reportQuery) {
			if (!queryResult) {
				await query.run();
				reportQuery.setView('pivot');
				onSetCurrentView && onSetCurrentView('pivot');
			}
			else {
				reportQuery.setView('query');
				onSetCurrentView && onSetCurrentView('query');
			}
		}
		else if (queryResult) {
			queryResult.setCurrentView('query')
			onSetCurrentView && onSetCurrentView('query');
		}
		else {
			await query.run();
			query.queryResult.navigateTo();
		}

		e.preventDefault();
	}

    @action resetQuery = async () => {
		const { queryResult, currentView } = this.props;

		const query = this.props.query instanceof Query ? this.props.query : null;

		if (query) {
			query.reset();
		}
		else {
			const {query}       = queryResult;
			query.desiredView = currentView;
			query.navigateTo();
			query.reset();
		}
	}
}

interface ItemProps extends MyProps {
	view: QueryViewAvailability;
	i: number;
}

const AvailableQueryViewToolbarItem = observer((props: ItemProps) => {
	let { i, view, availableViews, direction, reportQuery, query, queryResult, onSetCurrentView, currentView, view: { name, available, bootstrappable, sensitivity: sensitivityable } } = props;

	let icon = appIcons.queryTool.views[name];
	if (name == 'query' && query && !query.queryResult) {
		icon = appIcons.queryTool.queryBuilder.runQuery;
	}

	let to = null;
	if (queryResult) {
		if (reportQuery) {
			to = reportQuery.routeFor(name)
		}
		else if (query) {
			to = query.routeFor(name);
		}
		else {
			to = queryResult.routeFor(name);
		}
	}
	const bootstrapNotSupported = (!bootstrappable && queryResult && queryResult.bootstrapEnabled)
	const sensitivityNotSupported = (!sensitivityable && queryResult && queryResult.sensitivityEnabled);
	const disabled              = !available || (query && query.isRunning) || bootstrapNotSupported || sensitivityNotSupported;

	return <bp.Tooltip content={<QueryViewRequirementsTooltip bootstrapNotSupported={bootstrapNotSupported} sensitivityNotSupported={sensitivityNotSupported} view={view}/>}
	                   key={`${name}-popover`}
	                   position={bp.Position.LEFT_BOTTOM}
	                   modifiers={{keepTogether: {enabled: false}, preventOverflow: {enabled: true, padding: 75}}}
	                   className={classNames(name, css.viewItem)}
	                   portalClassName={css.tooltip}
	                   transitionDuration={300}
	                   hoverCloseDelay={50} hoverOpenDelay={100}>
		<sem.MenuItem className={classNames(bp.Classes.POPOVER_DISMISS)}
		              disabled={disabled}
		              active={name == currentView}
		              as={Link}
		              to={!disabled ? to : null}
		              onClick={(e) => {
			              e.preventDefault();
			              if (!disabled) {
				              if (reportQuery) {
					              reportQuery.setView(name);
				              }
				              else {
					              if (name != 'query' && query && !query.queryResult) query.desiredView = name;
					              queryResult && queryResult.setCurrentView(name);
				              }

				              onSetCurrentView && onSetCurrentView(name);
			              }
		              }}>
			<AppIcon icon={icon} large iconningSize={48}/>

			{/*{query && !query.queryResultId &&*/}
			{/*<sem.Label icon="play" corner="right "/>}*/}
		</sem.MenuItem>
	</bp.Tooltip>;
})