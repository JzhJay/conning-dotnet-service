import {AppIcon, bp, dialogs, LoadingIndicator, sem, SimulationCard, SmartCard} from 'components';
import {UserFileCard} from 'components/system/UserFile/UserFileCard';
import {GenericBrowser} from 'components/widgets/SmartBrowser/GenericBrowser';
import { computed, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {appIcons, ClimateRiskAnalysis, i18n, IO, Query, routing, Simulation, site, user, UserFile} from 'stores';
import {formatLabelText} from 'utility';

import * as css from './RelatedObjectBrowser.css';
import {FormattedMessage} from 'react-intl';

interface MyProps {
	model: any;
	defaultRelatedObjectTypes: string[];
}

@observer
export class RelatedObjectBrowser extends React.Component<MyProps, {}> {
    static RELATED_ACTIVE_SESSION_KEY = "activeSessions";
    static RELATED_OBJECT_KEY = "relatedObject";
    static RELATED_TAG_KEY = "relatedTag";
    static isRelatedObjectBrowserURL = (url: string = location.href) => _.some([RelatedObjectBrowser.RELATED_OBJECT_KEY, RelatedObjectBrowser.RELATED_ACTIVE_SESSION_KEY], (s)=> `${url}`.indexOf(s) >= 0);

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    @computed get supportedBrowserTypes() {
		return [
			UserFile.ObjectType,
			Simulation.ObjectType,
			Query.ObjectType,
			...(user.isIOLicensed ? [IO.ObjectType] : []),
			...(user.isCRALicensed ? [ClimateRiskAnalysis.ObjectType] : []),
		];
	}

    @computed get showActiveSessions () {
		return routing.query.activeSessions != null;
	}

    @computed get loading() {
		return !this.props.model;
	}

    @computed get browserTypes() {
		let relatedTypes = [];
		if (routing.query[RelatedObjectBrowser.RELATED_OBJECT_KEY]){
			relatedTypes = `${routing.query[RelatedObjectBrowser.RELATED_OBJECT_KEY]}`.split(',').map(type => {
				if (type == "QueryDescriptor") {
					return Query.ObjectType;
				} else if (type == "JuliaSimulation") {
					return Simulation.ObjectType;
				} else if (type == "IO") {
					return IO.ObjectType;
				}
				return type;
			})
			relatedTypes = relatedTypes.filter(type => _.some(this.props.defaultRelatedObjectTypes, t => t == type));
	    }
		if (!relatedTypes?.length) {
			relatedTypes = this.props.defaultRelatedObjectTypes;
		}

		return relatedTypes.filter(type => _.some(this.supportedBrowserTypes, t => t == type));
	}

    @computed get mainCard(): React.ReactElement {
		const model = this.props.model;
		switch (model?.__typename) {
			case UserFile.ObjectType:
				return <UserFileCard userFile={model} className={'fluid'}
				                     onDelete={() => routing.push(routing.urls.userFileBrowser)}
				                     onDuplicate={() => routing.push(routing.urls.userFileBrowser)} />;

			case Simulation.ObjectType:
				return <SimulationCard sim={model} className={'fluid'}
				                       onDelete={() => routing.push(routing.urls.simulationBrowser)}
				                       onDuplicate={() => routing.push(routing.urls.simulationBrowser)}/>;

			default:
				return <SmartCard model={model} className={'fluid'} />;
		}
	}

    @computed get browser(): React.ReactElement {
		const model = this.props.model;

		if (!model) { return null; }

		const browserTypes = this.browserTypes;

		const relatedTag = routing.query[RelatedObjectBrowser.RELATED_TAG_KEY] ?
		                   `${routing.query[RelatedObjectBrowser.RELATED_TAG_KEY]}` : (
							   model.__typename == Simulation.ObjectType ?
							   GenericBrowser.ALL_RELATED_SIMULATION_TAG :
							   GenericBrowser.ALL_RELATED_USERFILE_TAG
		                   );
		const relatedId = model._id;

		return <GenericBrowser objectTypes={browserTypes} relatedTag={relatedTag} relatedId={relatedId} hideSidebar={this.showActiveSessions} />;
	}

    @computed get cardTitle(): string {
		const showActiveSessions = this.showActiveSessions;
		const browserTypes = this.browserTypes;
		if (browserTypes.length > 1) {
			return showActiveSessions ? i18n.intl.formatMessage({defaultMessage: `Active Sessions`, description: "[RelatedObjectBrowser] Title to indicate that the objects browser is showing active sessions/processes"}) : i18n.intl.formatMessage({defaultMessage: `Linked Objects`, description: "[RelatedObjectBrowser] Title to indicate that the objects browser is showing linked/related objects"});
		}

		let showName;
		if (showActiveSessions) {
			showName = browserTypes[0]
			return i18n.intl.formatMessage({defaultMessage: "Active {objectType} Sessions", description: "[RelatedObjectBrowser] Title for the active sessions/processes"}, {objectType: formatLabelText(showName)});
		} else {
			switch (browserTypes[0]) {
				case UserFile.ObjectType:
					showName = UserFile.OBJECT_NAME_MULTI;
					break;
				case Simulation.ObjectType:
					showName = Simulation.OBJECT_NAME_MULTI;
					break;
				case Query.ObjectType:
					showName = Query.OBJECT_NAME_MULTI;
					break;
				case IO.ObjectType:
					showName = IO.OBJECT_NAME_MULTI;
					break;
				case ClimateRiskAnalysis.ObjectType:
					showName = ClimateRiskAnalysis.OBJECT_NAME_MULTI;
					break;
				default:
					showName = `${browserTypes[0]}s`
			}
			return i18n.intl.formatMessage({defaultMessage: `Associated {objectType}`, description: "[RelatedObjectBrowser] Title for the associated/related objects of a particular object type"}, {objectType: formatLabelText(showName)});
		}
	}

    @computed get cardTitleIcons(): React.ReactElement {
		const {browserTypes, props: {model}} = this;
	    const getProps = (type: string, isMenuItem = false) => {
		    const defaultName = `${model?.name}'s ${formatLabelText(type)}`
		    const rtn: {text:string, disabled: boolean, icon?: React.ReactElement, onClick?: React.MouseEventHandler} = {
			    text: `${isMenuItem ? '' : `${i18n.common.OBJECT_CTRL.NEW} `}${i18n.translateObjectName(type)}`,
			    disabled: model.status != "Complete"
		    }
		    switch (type) {
			    case Simulation.ObjectType:
					if (_.get(model, "type") != "CSV") {
						return null;
					}
				    rtn.icon = <AppIcon icon={appIcons.tools.simulations} className={css.iconSize16} small={true} />;
				    rtn.onClick = () => dialogs.newRespository(model._id, defaultName);
				    break;
			    case Query.ObjectType:
				    rtn.icon = <AppIcon icon={appIcons.tools.queries} className={css.iconSize16} small={true}/>;
				    rtn.onClick = () => dialogs.newQuery([model._id], defaultName);
				    break;
			    case IO.ObjectType:
				    rtn.icon = <AppIcon icon={appIcons.tools.ios} className={css.iconSize16} small={true}/>;
				    rtn.onClick = () => dialogs.newIO(model._id, defaultName);
				    break;
			    case ClimateRiskAnalysis.ObjectType:
				    rtn.icon = <AppIcon icon={appIcons.tools.climateRiskAnalyses} className={css.iconSize16} small={true}/>;
				    rtn.onClick = () => dialogs.newClimateRiskAnalysis(model._id, defaultName);
				    break;
			    default:
					return null;
		    }
		    return rtn
	    }

		if (browserTypes.length == 1) {
			const props = getProps(browserTypes[0]);
			return props ? <bp.AnchorButton {...props}/> : null
		} else {
			return <bp.Popover
				disabled={model.status != "Complete"}
				position={bp.Position.BOTTOM_RIGHT}
				content={<bp.Menu>{
					browserTypes.map(type => {
						const props = getProps(type, true);
						return props ? <bp.MenuItem key={`cardTitleIcons_${type}`} {...props} /> : null;
					})
				}</bp.Menu>}
			>
				<bp.AnchorButton text={i18n.common.OBJECT_CTRL.NEW} icon={"add"} rightIcon={"caret-down"} />
			</bp.Popover>
		}
	}

    render() {
		if (this.loading) {
			return <sem.Container fluid>
				<LoadingIndicator text={site.loadingText(Simulation.OBJECT_NAME_SINGLE)}/>
			</sem.Container>
		}

		return <sem.Container fluid className={css.root}>
			{this.mainCard}

			<SmartCard model={null} showHeader={false} title={this.cardTitle} titleIcons={this.cardTitleIcons} className={css.associatedCard}>
				{this.browser}
			</SmartCard>
		</sem.Container>
	}
}