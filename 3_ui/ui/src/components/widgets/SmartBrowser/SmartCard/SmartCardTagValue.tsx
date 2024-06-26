import {ReportObjectLink} from 'components/system/report/ReportObjectLink';
import {SimulationObjectLink} from 'components/system/simulation/SimulationObjectLink';
import {UserFileObjectLink} from 'components/system/UserFile/UserFileObjectLink';
import {CopyableText} from 'components/widgets/SmartBrowser/CopyableText';
import {GenericCommentsEditor} from 'components/widgets/SmartBrowser/GenericCommentsEditor';
import {dateToFormattedStringWithTimezone} from 'utility';
import * as css from './SmartCard.css';
import {observer} from 'mobx-react';
import {CSSProperties} from 'react';
import {i18n, OmdbObjectType, user} from 'stores';
import {OmdbCardTag, GetUserQuery, apolloStore, Simulation, OmdbTag, UserFile, Report, api} from 'stores';
import {bp, SortableCardsPanel, TimeAgo, Highlighter, SmartCard} from 'components';

interface MyProps {
	value: any,
	model: any,
	panel: SortableCardsPanel,
	card: SmartCard,
	omdbTag: OmdbTag,
	cardTag: OmdbCardTag,
	objectType?: OmdbObjectType,
	style?: CSSProperties,
	className?: string
}

@observer
export class SmartCardTagValue extends React.Component<MyProps, {}> {
	isCatalogCriteria = (value: any): boolean => {
		const {omdbTag, cardTag, panel, objectType} = this.props;
		const tag = omdbTag || cardTag;

		if (panel) {
			const {props: {catalogContext}} = panel;
			if (catalogContext) {
				const {distinctTagValues} = catalogContext;
				var tagValues             = distinctTagValues.get(objectType);
				if (tagValues) {
					var entry = tagValues.get(tag.name);
					if (entry) {
						var distinctValueEntry = entry.distinctByName[value];
						return distinctValueEntry && catalogContext.isSelected(tag.name, distinctValueEntry) && !_.includes(catalogContext.hiddenFilters, tag.name);
					}
				}
			}
		}
		return false;
	}

	render() {
		const {isCatalogCriteria, renderResult, props: {omdbTag, cardTag ,panel}} = this;
		const type = cardTag?.type || omdbTag?.type;
		let value = this.props.value;
		// Custom tag values
		/*if (value && value.value && !_.isEmpty(tag.values)) {
			// Perform a lookup
			let resolvedValue = tag.values.find(f => tag.type == 'id' ? f.id == value.value : f.value == value.value);
			if (resolvedValue == null) {
				//console.error(`Unable to find linked ID '${value}' in ${tag.name} ${JSON.stringify(tag.values)}`)
			}
			else {
				value            = resolvedValue.value;
				style.background = resolvedValue.background;
				style.color      = resolvedValue.color;
			}
		}*/
		if (type == 'ID' && value) {
			return <CopyableText text={value} className={css.tagValue} />
		} else if (type == 'ConningUser' && value) {
			if (value.fullName) {
				return renderResult(value.fullName);
			} else {
				return <GetUserQuery query={apolloStore.graph.user.get} variables={{id: _.isString(value) ? value : value._id}}>
					{({data, loading, error}) => {
						if (loading) { return '...' }
						else if (error) return error.message
						else { return renderResult(data.user.get ? data.user.get.fullName : 'Not Found'); }
					}}
				</GetUserQuery>
			}

		} else if (type == Simulation.ObjectType && value) {
			return <SimulationObjectLink
				id={value}
				className={css.tagValue}
				linkTo={model => Simulation.urlForRelatedObjectPage(model._id, this.props.objectType, this.props.cardTag.name)}
				linkContent={model => this.renderResult(model.name)}
				linkDisabled={!!this.props.card?.props.isTooltip}
			/>;

		} else if (type == UserFile.ObjectType && value) {
			return <UserFileObjectLink
				id={value}
				className={css.tagValue}
				linkContent={model => this.renderResult(model.name)}
				linkDisabled={!!this.props.card?.props.isTooltip}
			/>;

		} else if (type == Report.ObjectType && value) {
			return <ReportObjectLink
				id={value}
				className={css.tagValue}
				linkContent={model => this.renderResult(model.name)}
				linkDisabled={!!this.props.card?.props.isTooltip}
			/>;

		} else if ((type == 'DateTime' || _.isDate(value)) && value) {
			const dateValue = value instanceof Date ? value : new Date(`${value}`);
			return <bp.Tooltip openOnTargetFocus={false} content={dateToFormattedStringWithTimezone(dateValue)}>
				<TimeAgo className={classNames(css.tagValue, {[css.catalogSearchCriteria]: isCatalogCriteria(value)})} datetime={dateValue} locale={user.language.replace("-", "_")}/>
			</bp.Tooltip>;

		} else if (type == 'Boolean') {
			return renderResult(`${value}`);

		} else if (cardTag.name == SortableCardsPanel.COMMENTS_FIELD) {
			return <GenericCommentsEditor model={this.props.model} panel={this.props.panel} />;

		} else {
			return renderResult(value);
		}
	}

	renderResult = (value) => {
		const {isCatalogCriteria, props: {panel, omdbTag, cardTag, style, className}} = this;
		const tag = omdbTag || cardTag;
		let context = null;

		const getTagValue = tagValue => i18n.databaseLookups.tagValues[tagValue] || tagValue.toLocaleString()

		if (value) {
			if (typeof value === 'object') {
				if (value.props) {
					context = value;
				} else {
					context = _.keys(value).filter(k => k != "__typename" && value[k]).map(k => {
						return <span
							key={k}
							style={style}
							className={classNames(css.tagValue, {[css.catalogSearchCriteria]: isCatalogCriteria(k)})}
						>
							{i18n.databaseLookups.tagValues[k.capitalize()] || k.capitalize()}: {value[k] && getTagValue(value[k])}
						</span>
					})
				}
			} else if(tag.canSearch == false) {
				context = <span
					style={style}
					className={classNames(css.tagValue, {[css.catalogSearchCriteria]: isCatalogCriteria(value)})}
				>
					{value != null && getTagValue(value)}
				</span>
			} else {
				context = <span style={{...style, display: 'flex'}}>
					<Highlighter
						className={classNames(css.tagValue, {[css.nameValue]: tag.name == "name"}, {[css.catalogSearchCriteria]: isCatalogCriteria(value)})}
						searchWords={panel && panel.searchText ? panel.searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : []}
						textToHighlight={value != null ? getTagValue(value) : ''}/>
				</span>
			}
		}
		return <div className={classNames(css.tagValueWrapper, className)}>{context}</div>;
	}

}