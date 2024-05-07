import {computed} from 'mobx';
import * as css from "./StatisticsPanel.css";

import type {PartProps} from '../';
import {SuperPanelComponent} from '../';

import {AppIcon, ReactSelect, ReactSortable} from "components";
import Option = ReactSelect.Option;
import Select from 'react-select';
import {api, appIcons, i18n} from 'stores';
import {Query, QueryStatistics, StatisticsClause} from 'stores/query'

import {observer} from 'mobx-react';
import {PanelSearchBar} from '../SuperPanel/searchers';
import Sortable from 'sortablejs';


/**
 * Get rid of the superpanel for statistics and instead show a list of statistics to apply with two dropdowns
 *        Axis | Statistic | Move Up | Move Down | Delete
 * For any axis that has statistics applied, include an icon that when hovered over shows the associated statistics
 *
 *
 * We need to modify the rest API to include statistics information - what axes and statistics are selected?
 */

@observer
export class StatisticsPanel extends React.Component<PartProps, {}> {
	render() {
		const {
			      query,
			      query: {
					      statistics
			      },
		      } = this.props;

		const {clauses, axesAvailable, metadata, hasPendingRequest} = statistics;

		const statisticsOptions = metadata.map(s => ({
			label: s.label,
			value: s.id
		}));

		let axisTabIndex = 0;

		return <SuperPanelComponent part={"statistics"}
		                            title={i18n.intl.formatMessage({defaultMessage: "Statistics", description: "[StatisticsPanel] the query input panel title"})}
		                            className={classNames(css.container, {[css.lockPanel]: hasPendingRequest})}
		                            onAccordionPanelTitle={() => ""}
		                            query={this.props.query}>
			<div className={css.toolbar} role="toolbar" />
			<PanelSearchBar part="statistics"/>

			{/* Display a list of statistics */}
			<ReactSortable className={css.statisticsByAxis} options={{
				animation:     100,
				draggable:     `.${css.statisticsAxis}.${css.draggable}`,
				group:         'statistics-axes',
				forceFallback: true,
				fallbackOnBody: true,
				}}
               onChange={this.statisticsByAxis_onChange}>
				{clauses.map(clause => <StatisticsAxisRow clause={clause}
				                                          key={clause.axis}
				                                          query={query}
				                                          tabIndex={axisTabIndex++}
				                                          statisticsOptions={statisticsOptions}
				                                          allowDrag={clauses.length > 1}/>)}

				{/* Add new axis if more are available */}
				{axesAvailable.length > 0
					? <StatisticsAxisRow className={css.placeholder} key="placeholder" query={query}
					                    tabIndex={axisTabIndex++}
					                    allowDrag={false}/>
					: null}
			</ReactSortable>
		</SuperPanelComponent>;
	}

	sortableAxes: Sortable;
	statisticsByAxis: Node;

	onContextMenu = (e, part, accordion, range) => this.props.onContextMenu(e, 'statistics', part, accordion, range);

	statisticsByAxis_onChange = (order, sortable, event) => {
		const {newIndex, oldIndex} = event;

		this.props.query.statistics.moveStatisticAxis(oldIndex, newIndex);
	}
}

// interface StatisticsChoice {
// 	axisId: number;
// 	statisticId: number;
// }

interface StatisticsClauseRowProps {
	query: Query;
	className?: string;
	tabIndex: number;
	axesAvailable?: number[];
	clause?: StatisticsClause;
	allowDrag: boolean;
	statisticsOptions?: Option<number>[];
}

@observer
class StatisticsAxisRow extends React.Component<StatisticsClauseRowProps, {}> {

	newStatisticValue = null;

	render() {
		const {
			    query, statisticsOptions,
			    clause, className, tabIndex,
			    query: {statistics},
			      allowDrag
		    } = this.props;

		let axesAvailable = clause ? clause.axes_available : statistics.axesAvailable;
		// Filter out any statistics the user has already chosen
		const existingAxes = query.statistics.clauses.map(c => c.axis);
		axesAvailable = axesAvailable.filter(a => !_.includes(existingAxes, a) || (clause && clause.axis === a));
		let axesAvailableOptions = axesAvailable.map(id => query.axisById(id)).map(axis => ({value: axis.id, label: axis.label }))
		return (
			<div
				key={clause ? clause.axis : -1}
				className={classNames(css.statisticsAxis, className,  { [css.draggable]: allowDrag, [css.hasValue]: clause != null, [css.empty]: clause == null })}>

				<div className={classNames(css.axisRow, {[css.draggable]: allowDrag})}>
					<span className={css.axisDragHandle}><img src="/ui/images/20x20_dnd_grip.png" /></span>

					<Select value={clause ? axesAvailableOptions.filter( opt => opt.value == clause.axis ) : null}
					             placeholder={i18n.intl.formatMessage({defaultMessage: "Add an Axis...", description: "[StatisticsPanel] the query's Statistics inputs panel's selection input placeholder"})}
					             openMenuOnFocus
					             tabIndex={tabIndex}
					             options={axesAvailableOptions}
					             onChange={this.onAxisChanged}
					             isClearable={false}
					             className={css.reactSelect}
					             classNamePrefix={css.reactSelect}

					/>
					<AppIcon
						className={css.delete}
						icon={appIcons.queryTool.queryBuilder.removeStatisticAxis}
						style={{visibility: clause ? 'visible' : 'hidden'}}
						title={ clause ? i18n.intl.formatMessage({
							defaultMessage: `Remove axis '{axis}'?`,
							description: "[StatisticsPanel] a confirm message before delete a axis in the Statistics inputs panel"
						}, {axis: query.axisById(clause.axis).label}) : null}
						onClick={() => this.deleteAxis()}
					/>
				</div>

				{clause != null ?
					 <ReactSortable
						 className={css.configuredStatisticsForAxis}
					     options={{
							 animation:     100,
						     group:         `statistics-for-axis-${clause.axis}`,
							 forceFallback: true,
						     fallbackOnBody: true,
						     draggable:     `.${css.statisticsRow}.${css.draggable}`,
						     filter: `.${css.chooseNewStatistic}`

						 }}
					     onChange={this.configuredStatisticsOrder_onChange}
					 >
						 {clause.statistics.map(statisticId =>
							 <div key={statisticId}
							      className={classNames(css.statisticsRow, [css.hasValue], {[css.draggable]: clause.statistics.length > 1})}>
								 {/* Draggable if there is more than one statistic present */}
								 {/* style={{visibility: clause.statistics.length > 1 ? 'visible' : 'hidden'}} */}

								 <span className={css.statisticsDragHandle}><img src="/ui/images/20x20_dnd_grip.png" /></span>

								 <Select options={statisticsOptions.filter( s => s.value === statisticId || clause.statistics.indexOf(s.value) === -1)}
								         openMenuOnFocus
						                 value={statisticsOptions.filter(s => s.value === statisticId)}
						                 isClearable={false}
						                 onChange={(option : Option<number>) => this.onStatisticChanged(statisticId,  option)}
								         className={css.reactSelect}
								         classNamePrefix={css.reactSelect}
								 />

								 <AppIcon
									 className={css.delete}
									 icon={appIcons.queryTool.queryBuilder.removeStatistic}
									 title={i18n.intl.formatMessage({
										 defaultMessage: `Remove Statistic '{statistic}'?`,
										 description:    "[StatisticsPanel] a confirm message before delete a statistic in the Statistics inputs panel"
									 }, {statistic: statisticsOptions.find(s => s.value === statisticId).label})}
									 onClick={() => this.deleteStatistic(statisticId)}/>
							 </div>)}

						 {statistics.metadata.length - clause.statistics.length > 0 ? (
							  <div key="new-statistic" className={classNames(css.statisticsRow, css.chooseNewStatistic)}>
								  <AppIcon className={classNames(css.statisticsDragHandle)}
								        icon={appIcons.queryTool.queryBuilder.newStatistic} style={{visibility: 'hidden'}}/>

								  <Select options={statisticsOptions.filter(s => clause.statistics.indexOf(s.value) < 0)}
								          openMenuOnFocus
								          placeholder={i18n.intl.formatMessage({defaultMessage: "Add a Statistic...", description: "[StatisticsPanel] the query's Statistics inputs panel's selection input placeholder"})}
								          isClearable={false}
								          onChange={(option : Option<number>) => this.onStatisticChanged(null, option)}
								          className={css.reactSelect}
								          classNamePrefix={css.reactSelect}
								          value={this.newStatisticValue}
								  />

								  <AppIcon className={css.delete} icon={appIcons.queryTool.queryBuilder.removeStatistic} style={{visibility: 'hidden'}}/>
							  </div>)
						 : null }
					 </ReactSortable>
				: null }
			</div>

		);
	}

	deleteAxis = () => {
		const {clause, query} = this.props;
		query.statistics.removeClause(clause.axis)
	}

	deleteStatistic = (statistic) => {
		const {clause, query} = this.props;
		query.statistics.removeStatistic(clause, statistic)
	}

	onAxisChanged = (newAxis: Option<number>) => {
		console.log(`onAxisChanged`, newAxis);

		const {clause, query} = this.props;

		if (newAxis == null) {
			query.statistics.removeClause(clause.axis)
		}
		else {
			let newAxisId = newAxis.value as number;
			if (clause == null) {
				query.statistics.addClause(newAxisId);
			}
			else {
				query.statistics.switchClauseAxis(clause, newAxisId)
			}
		}
	}

	onStatisticChanged = (statistic: number, option: Option<number>) => {
		console.log(`onSelectStatistic`, statistic, option);
		const {clause, query} = this.props;
		if (statistic == null) {
			query.statistics.addStatistic(clause, option.value as number);
			this.newStatisticValue = null;
		}
		else if (option == null) {
			query.statistics.removeStatistic(clause, statistic)
		}
		else {
			query.statistics.switchStatistic(clause, statistic, option.value as number)
		}
	}

	private configuredStatisticsOrder_onChange = (order, sortable, event) => {
		if (!event) { return; }
		const {newIndex, oldIndex} = event;
		if (order.length - 1 == newIndex) { return; }
		this.props.query.statistics.moveStatistic(this.props.clause, oldIndex, newIndex);
	};

}
