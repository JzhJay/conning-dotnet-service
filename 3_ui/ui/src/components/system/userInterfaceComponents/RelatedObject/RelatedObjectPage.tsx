import * as classnames from 'classnames';
import {DashboardPanel} from 'components/pages/dashboard/DashboardPanel';
import {DashboardTypeSetting, dashboardTypeSettings} from 'components/pages/dashboard/DashboardTypeSettings';
import {GenericBrowser} from 'components/widgets/SmartBrowser/GenericBrowser';
import {iconningSize} from 'iconning';
import {action, computed, makeObservable, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import type {IOmdbQueryResult} from 'stores';
import {UserFile, Simulation, Query, IO, ClimateRiskAnalysis, omdb, IApplicationIcon, user, site, queryStore, i18n} from 'stores';
import {AppIcon, bp, dialogs, NewSimulationDialog, SmartCard, SortableCardsPanel} from 'components';
import TimeAgo from 'timeago-react';
import {formatLabelText} from 'utility';

import * as css from './RelatedObjectPage.css'

interface RelatedObjectPageProps {
	objectType: "Simulation" | "UserFile" | string;
	modelId: string,
	relatedObjectTypes?: string[];
	showHeader?: boolean;
}

@observer
export class RelatedObjectPage extends React.Component<RelatedObjectPageProps, any> {
	@observable model: Simulation | UserFile;
	@observable relatedObjects: IOmdbQueryResult;

	@observable filter: string = null;

	_blueprintCardProps = {interactive: false, elevation:bp.Elevation.ONE};

	_dispose: Function[] = [];

	constructor(props: RelatedObjectPageProps) {
		super(props);

		makeObservable(this);
		omdb.findSingle<any>(this.props.objectType, this.props.modelId, true).then(action(m => this.model = m));

		this.updateRelated();

		this._dispose.push(reaction(
			() => omdb.lastOmdbChanged,
			(r) => {
				if (r.objectType == Simulation.ObjectType && r._id == this.props.modelId ) {
					omdb.findSingle<any>(this.props.objectType, this.props.modelId, true).then(action(m => {
						this.model = m;
					}));
				}
			}
		));
	}

	componentWillUnmount() {
		_.forEach(this._dispose, f => f());
	}

	getSettingByObjectType = (objectType) => {
		const setting =  _.cloneDeep(_.find(dashboardTypeSettings.get(), setting => setting.type == objectType));
		if (setting) {
			let typeName = (setting.displayTitle || formatLabelText(setting.type)).replace(/\s/g, "");
			if (typeName.length > 10) {
				const shortName = typeName.replace(/[^A-Z0-9]/g, "");
				shortName > 1 && (typeName = shortName);
			}
			const defaultName = `${this.model?.name}'s ${typeName}`;
			const buttonText = i18n.intl.formatMessage({defaultMessage: 'My Related', description: "[RelatedObjectPage] button text which show the objects related with login user"});
			switch (setting?.type) {
				case Simulation.ObjectType:
					setting.create = () => site.setDialogFn(() => <NewSimulationDialog type={"Repository"} name={defaultName} userFile={this.model as any} />);
					setting.browseButtons = [
						{buttonText: null, params: {[GenericBrowser.ALL_RELATED_USERFILE_TAG]: this.props.modelId}},
						{buttonText: buttonText, params: {[GenericBrowser.ALL_RELATED_USERFILE_TAG]: this.props.modelId, createdBy: user.currentUser.sub}}
					];
					break;

				case Query.ObjectType:
					setting.create = () => dialogs.newQuery(
						[this.props.modelId],
						defaultName
					);
					setting.browseButtons = [
						{buttonText: null, params: {[GenericBrowser.ALL_RELATED_SIMULATION_TAG]: this.props.modelId}},
						{buttonText: buttonText, params: {[GenericBrowser.ALL_RELATED_SIMULATION_TAG]: this.props.modelId, createdBy: user.currentUser.sub}}
					];
					break;

				case IO.ObjectType:
					setting.create = () => dialogs.newIO(this.props.modelId, defaultName);
					setting.browseButtons = [
						{buttonText: null, params: {[GenericBrowser.ALL_RELATED_SIMULATION_TAG]: this.props.modelId}},
						{buttonText: buttonText, params: {[GenericBrowser.ALL_RELATED_SIMULATION_TAG]: this.props.modelId, createdBy: user.currentUser.sub}}
					];
					break;

				case ClimateRiskAnalysis.ObjectType:
					setting.create = () => dialogs.newClimateRiskAnalysis(this.props.modelId, defaultName);
					setting.browseButtons = [
						{buttonText: null, params: {[GenericBrowser.ALL_RELATED_SIMULATION_TAG]: this.props.modelId}},
						{buttonText: buttonText, params: {[GenericBrowser.ALL_RELATED_SIMULATION_TAG]: this.props.modelId, createdBy: user.currentUser.sub}}
					];
					break;
			}
		}
		return setting;
	}

	updateRelated = () => {
		omdb.runQuery({
			objectTypes: this.relatedObjectSettings.map(s => s.type),
			limit:       50,
			sortBy:      'modifiedTime',
			sortOrder:   'desc',
			where:       this.props.objectType == Simulation.ObjectType ?
			             {[GenericBrowser.ALL_RELATED_SIMULATION_TAG]: this.props.modelId} :
			             {[GenericBrowser.ALL_RELATED_USERFILE_TAG]: this.props.modelId}
		}).then(action((value) => {
			this.relatedObjects = value.result;
		}));
	}

	@computed get isLoaded() {
		return !!this.model;
	}

	@computed get mainPanel() {
		if (!this.model) {
			return <bp.Card {...this._blueprintCardProps}>
				<div style={{display: 'flex', alignItems: 'center', margin: 10}}>
					<bp.Spinner size={14} />
					<span style={{marginLeft:5}}>{
						i18n.common.MESSAGE.WITH_VARIABLES.LOADING(i18n.intl.formatMessage({defaultMessage: "Metadata", description: "[RelatedObjectPage] a group title which show base the omdb object information"}))
					}</span>
				</div>
			</bp.Card>;
		}
		return <SmartCard model={this.model} showHeader={false} onSectionsLoad={(sections) => {
			let hasComments = false;
			_.each(sections, s => {
				_.each(s.tags, tag => {
					if (tag.reserved !== false && tag.name == SortableCardsPanel.COMMENTS_FIELD) {
						hasComments = true;
						tag.hideEmpty = false;
					} else {
						tag.hideEmpty = true;
					}
				});
			});

			if (!hasComments) {
				sections.push({ tags: [{
					name: SortableCardsPanel.COMMENTS_FIELD,
					hideEmpty: false
				}]})
			}
			return sections;

		}} />
	}

	@computed get relatedObjectSettings() : DashboardTypeSetting[] {
		const objectType = this.props.objectType;
		let relatedObjectTypes = this.props.relatedObjectTypes;
		let supportRelatedObjectTypes: string[] = []

		if (objectType == Simulation.ObjectType) {
			supportRelatedObjectTypes = [Query.ObjectType, IO.ObjectType, ClimateRiskAnalysis.ObjectType];

		} else if (objectType == UserFile.ObjectType) {
			supportRelatedObjectTypes = [Simulation.ObjectType];

		} else {
			return [];
		}

		let supportRelatedObjectSettings = supportRelatedObjectTypes.map(ot => {
			let setting = this.getSettingByObjectType(ot);

			if (objectType == Simulation.ObjectType && (this.model as Simulation)?.status != "Complete") {
				setting.preventCreateMessage = `Simulation needs to be completed in order to create a new ${setting.displayTitle || formatLabelText(setting.type)}`;
			}
			return setting;
		}).filter(setting => setting && setting.applicable !== false);

		if (!relatedObjectTypes?.length) {
			return supportRelatedObjectSettings;
		}

		return supportRelatedObjectSettings.filter(setting => {
			return _.includes(relatedObjectTypes, setting.type);
		});
	}

	@computed get linkedItems() {
		if (this.filter == null) {
			return this.relatedObjects?.results;
		}
		return _.filter(this.relatedObjects?.results, item => item.__typename == this.filter);
	}

	render() {
		return <div className={css.root}>
			{this.props.showHeader !== false && <bp.Callout className={css.title}><h1>
				<RoundAppIcon icon={this.getSettingByObjectType(this.props.objectType).icon} size={24} className={css.typeIcon}/>
				{this.model ? this.model.name : <><bp.Spinner size={24} tagName={'span'}/>{i18n.common.MESSAGE.LOADING}</>}
			</h1></bp.Callout>}

			<article className={css.article}>
				<bp.Callout className={css.metadata} title={i18n.intl.formatMessage({defaultMessage: "Metadata", description: "[RelatedObjectPage] a group title which show base the omdb object information"})}>
					{this.mainPanel}
				</bp.Callout>
				<bp.Callout className={css.explore} title={i18n.intl.formatMessage({defaultMessage: "Explore", description: "[RelatedObjectPage] a group title which display catalogs of the omdb objects"})}>
					{_.map(this.relatedObjectSettings, setting => {
						const objectType = setting.type;
						return <bp.Card
							key={`browser_${objectType}`}
							className={classnames({[css.selectedObjectType]: this.filter == objectType})}
							{...this._blueprintCardProps}
							onClick={action((e) => {
								if (this.relatedObjectSettings.length < 2) {
									return;
								}
								if ($(e.target).is(`.${bp.Classes.BUTTON}`) || $(e.target).parents(`.${bp.Classes.BUTTON}`).length) {
									return;
								}
								this.filter == objectType ? (this.filter = null) : (this.filter = objectType)
							})}
						><DashboardPanel setting={setting}/></bp.Card>
					})}
				</bp.Callout>
				<bp.Callout className={classnames(css.linkedObjs, {[css.filterEnabled]: this.filter !== null})} title={i18n.intl.formatMessage({defaultMessage: `Linked Objects`, description: "[RelatedObjectPage] a group title which contains the related omdb objects"})}>
					{_.map(this.linkedItems, model => <LinkedObjectCard key={`linkedObj_${model._id}`} model={model} parent={this} />)}
				</bp.Callout>
			</article>
		</div>;
	}
}

@observer class LinkedObjectCard extends React.Component<{model: any, parent: RelatedObjectPage}, any> {
	@observable isOpen = false;

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	get name() {
		const idx = this.props.model.name.lastIndexOf('/');
		return <div>{idx >= 0 ? this.props.model.name.substring(idx+1) : this.props.model.name}</div>;
	}

	get path() {
		const idx = this.props.model.name.lastIndexOf('/');
		return idx >= 0 ? <div className={css.objectPath}>{this.props.model.name.substring(0, idx+1)}</div> : null;
	}

	get link() {
		const model = this.props.model;
		switch (model.__typename) {
			case Simulation.ObjectType:
				return Simulation.urlFor(model._id);

			case Query.ObjectType:
				return queryStore.clientUrlFor(model._id);

			case IO.ObjectType:
				return IO.urlFor(model._id);

			case ClimateRiskAnalysis.ObjectType:
				return ClimateRiskAnalysis.urlFor(model._id);

			default:
				return '#';
		}
	}

	render() {
		const {model, parent} = this.props;
		return <bp.Card {...parent._blueprintCardProps} className={classnames({[css.openInfo]: this.isOpen})}>
			<div className={css.objectInfo}>
				<h5 className={css.objectTitle} title={this.props.model.name}>
					<RoundAppIcon icon={parent.getSettingByObjectType(model.__typename).icon} size={20} />
					<a href={this.link}>{this.path}{this.name}</a>
				</h5>
				<div className={css.objectExtras}>
					{!this.isOpen && <div className={css.lastUpdated}><TimeAgo datetime={new Date(model.modifiedTime || model.createdTime)} /></div>}
					<bp.Button icon={"info-sign"} onClick={action(() => this.isOpen = !this.isOpen)} minimal>{this.isOpen ? i18n.intl.formatMessage({defaultMessage: "Less info", description: "[RelatedObjectPage][LinkedObjectCard] Less Information"}) : ""}</bp.Button>
				</div>
			</div>

			<bp.Collapse isOpen={this.isOpen}>
				<SmartCard model={model} isTooltip={true} showHeader={false} includeNameInBody={true} readonly={true} />
			</bp.Collapse>


		</bp.Card>;
	}

}

class RoundAppIcon extends React.Component<{icon: IApplicationIcon, size: iconningSize, className?: string}, any> {
	render() {
		const {icon, size, className} = this.props;
		const roundSize = size * 1.75;
		return <div
			style={{width: roundSize, height: roundSize}}
			className={classnames(css.roundIcon, `AppIconType-${icon.type}`, `AppIconType-${icon.type}-${icon.name}`,className)}
		>
			<AppIcon
				icon={icon}
				iconningSize={size}
				iconicDataAttribute={{width: `${size}px`, height: `${size}px`}}
			/>
		</div>;
	}
}