import {ClimateRiskAnalysisCardToolbarButtons} from 'components/system/ClimateRiskAnalysis';
import {IOCardToolbarButtons} from 'components/system/IO';
import {GenericNameEditor} from 'components/system/ObjectNameChecker/GenericNameEditor';
import {UserFileCardToolbarButtons} from 'components/system/UserFile/UserFileCard';
import {IOmdbQueryGraph} from '../../../stores/objectMetadata/OmdbGraph';
import type { IObjectTypeDescriptor} from "stores";
import {
	ObjectCatalogContext,
	omdb,
	IO,
	Simulation,
	UserFile,
	QueryDescriptor,
	ClimateRiskAnalysis, Report, apolloStore, settings
} from "stores";
import {bp, LoadingUntil, ObjectBrowserProps, SimulationCardToolbarButtons,  QueryCardToolbarButtons} from 'components';
import {SortableCardsPanel} from 'components/widgets/SmartBrowser/SortableCardsPanel';
import {observer} from 'mobx-react'
import { computed, observable, makeObservable } from 'mobx';

interface MyProps extends ObjectBrowserProps<any> {
	objectTypes: string[];
	relatedTag?: string;
	relatedId?: string;
	isShowLinkObject?: boolean;
}

@observer
export class GenericBrowser extends React.Component<MyProps, {}> {

	static ALL_RELATED_SIMULATION_TAG = "_relatedSimulation_";
	static ALL_RELATED_USERFILE_TAG = "userFile";

	static SIMULATION_TAG = ["simulation", "simulations", "assetReturnsSimulation", "companyDataSimulation", "companyDataRepository"];
	static USERFILE_TAG = ["userFile"];
	static REPORT_TAG = ["reportQueries"];

	@observable selectedSimulationIds: string[];
	@observable isImportingTestData = false;
	@observable panel: SortableCardsPanel;
	@observable catalogContext: ObjectCatalogContext;

	tableColumns = [];

	private allObjectTypeDescriptor: IObjectTypeDescriptor[];

	constructor(props: MyProps, state) {
        super(props, state);

        makeObservable(this);

        apolloStore.client.query<IOmdbQueryGraph>({
			query: omdb.graph.objectTypes
		}).then( r => {
			if (r.errors) {
				throw r.errors;
			}
			this.allObjectTypeDescriptor = r.data.omdb.objectTypes.filter(otd => otd.ui);

			this.query();
		});
    }

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (!_.isEqual(this.props, prevProps) && this.allObjectTypeDescriptor) {
			this.query();
		}
	}

	componentWillUnmount(): void {
		this.catalogContext?.dispose();
	}

	query = () => {
		this.catalogContext?.dispose();

		let {props: {objectTypes, relatedTag, relatedId, queryParams, isShowLinkObject = false}} = this;

		const newObjectTypeDescriptor = this.allObjectTypeDescriptor.filter(otd => _.some(objectTypes, typeString => otd.id == typeString));

		this.catalogContext = new ObjectCatalogContext({objectTypes: newObjectTypeDescriptor});

		if (!_.isEmpty(relatedTag) && !_.isEmpty(relatedId)) {
			let where = {[relatedTag]: (relatedTag == "simulations" ? [relatedId] : relatedId)};

			if (queryParams && queryParams.activeSessions)
				where._id = queryParams.activeSessions.split(",");

			this.catalogContext.extraWhere = where;
		} else {
			this.catalogContext.extraWhere = {};
		}
		
		if (isShowLinkObject) {
			this.catalogContext.extraWhere.isLink = true;
		}

		this.updateTableColumns();

		if (!this.catalogContext.initialized) {
			this.catalogContext.initialize();
		} else {
			this.catalogContext.refresh();
			this.catalogContext.reloadDistinct();
		}
	}

	@computed get loading() {
		return this.catalogContext == null;
	}

	get preferences() {
		return settings.catalog || {};
	}

	actionFieldRender = (model) => {
		const commonProps = {
			classNames: classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL),
			onDelete: this.catalogContext.delete,
			onDuplicate: this.catalogContext.insert
		}
		if (model instanceof Simulation) {
			return <SimulationCardToolbarButtons sim={model} {...commonProps}/>
		} else if ( model instanceof QueryDescriptor) {
			return <QueryCardToolbarButtons query={model} {...commonProps}/>
		} else if (model instanceof IO) {
			return <IOCardToolbarButtons investmentOptimization={model} {...commonProps}/>
		} else if (model instanceof ClimateRiskAnalysis) {
			return <ClimateRiskAnalysisCardToolbarButtons climateRiskAnalysis={model} {...commonProps}/>
		} else if (model instanceof UserFile) {
			return <UserFileCardToolbarButtons userFile={model} {...commonProps}/>
		} else {
			return <React.Fragment />
		}
	}

	updateTableColumns() {

		let columns = [];
		this.catalogContext.objectTypes.forEach(otd => {
			columns = [...columns, ...otd.ui.table.columns];
		})

		columns = _.unionBy(columns, col => col._id || col.name);

		columns.forEach( column => {
			if (column.name == SortableCardsPanel.NAME_FIELD) {
				column.renderValue = (model) => <GenericNameEditor
					model={model}
					catalogContext={this.catalogContext}
				/>

			} else if (column.name == SortableCardsPanel.ACTIONS_FIELD) {
				column.renderValue = this.actionFieldRender;
			} else if (_.some(GenericBrowser.USERFILE_TAG, tagName => column.name == tagName)) {
				column.type = UserFile.ObjectType;
			} else if (_.some(GenericBrowser.SIMULATION_TAG, tagName => column.name == tagName)) {
				column.type = Simulation.ObjectType;
			} else if (_.some(GenericBrowser.REPORT_TAG, tagName => column.name == tagName)) {
				column.type = Report.ObjectType;
			}
		});

		this.tableColumns = columns;

	}

	render() {

		if (this.loading) {
			return <LoadingUntil loaded={false} />
		}

		return <SortableCardsPanel
			catalogContext={this.catalogContext}
			showUserFilter={true}
			updateUrl={false}
			view={this.preferences.view}
			onSetView={v => this.preferences.view = v}
			tableColumns={this.tableColumns}
		/>
	}
}
