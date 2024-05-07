import {dialogs, NewSimulationDialog, QueryCard, SimulationCard} from 'components';
import {ClimateRiskAnalysisCard} from 'components/system/ClimateRiskAnalysis';
import {IOCard} from 'components/system/IO';
import {UserFileCard} from 'components/system/UserFile/UserFileCard';
import {computed} from 'mobx';
import {appIcons, ClimateRiskAnalysis, rsSimulationStore, IConningApplicationIcon, IO, ioStore, Query, QueryDescriptor, routing, Simulation, simulationStore, site, user, UserFile, i18n, RSSimulation} from 'stores';

export interface DashboardTypeSetting {
	icon:  IConningApplicationIcon;
	type: string;
	applicable?: boolean;
	preventCreateMessage?: string;

	displayTitle?: string;

	// for recent block detail card.
	cardCreator?: (data: any, props:object ) => JSX.Element;

	// for quick link.
	browse?: (params?: object) => void;
	create?: () => void;
	open?:() => void;

	// text for quick link buttons.
	browseButtons?: {buttonText: string, params: object}[];
	createButtonText?: string;
	openButtonText?: string;

	//events
	onPanelComponentDidMount?: () => void;
}

const defaultBrowserButtons = computed(():any[] => [
	{buttonText: i18n.intl.formatMessage({defaultMessage: 'Browser', description: 'Browse Objects'}), params: null},
	{buttonText: i18n.intl.formatMessage({defaultMessage: 'Recent', description: 'Recent Items'}), params: {sortBy:'modifiedTime',sortOrder:'desc'}},
	{buttonText: i18n.intl.formatMessage({defaultMessage: 'My Recent', description: 'My Recent Items'}), params: {sortBy:'modifiedTime',sortOrder:'desc',createdBy:user.currentUser?.sub}},
	{buttonText: i18n.intl.formatMessage({defaultMessage: 'Objects Sorted by Name', description: 'Objects Sorted by Name'}), params: {sortBy:'name',sortOrder:'asc'}},
	{buttonText: i18n.intl.formatMessage({defaultMessage: 'My Objects Sorted by Name', description: 'My Objects Sorted by Name'}), params: {sortBy:'name',sortOrder:'asc',createdBy:user.currentUser?.sub}}
]);

export const dashboardTypeSettings = computed((): Array<DashboardTypeSetting> => {
	const useCasesSettings: DashboardTypeSetting[] = [];
	if (rsSimulationStore.useCases) {
		for (let useCase of rsSimulationStore.useCases) {
			useCasesSettings.push({
				type: Simulation.ObjectType,
				displayTitle: useCase.title,
				icon: useCase.icon,
				applicable:  true,
				cardCreator: (data, props = {}) => {
					const sim = new Simulation(data);
					return <SimulationCard sim={sim} {...props} />;
				},
				browse: (params?)=> routing.push(routing.urls.useCaseBrowser + `/${useCase.name}` + (params && !(params as any).target ? `&${jQuery.param(params)}`:'')),
				create: () => {
					rsSimulationStore.createNewObject("FIRM", "Untitled", null, null, null, null, useCase.name);
				},
				browseButtons: defaultBrowserButtons.get()
			})
		}
	}

	return [
		{
			type: Simulation.ObjectType,
			displayTitle: Simulation.OBJECT_NAME_SINGLE,
			icon: appIcons.tools.simulations as IConningApplicationIcon,
			applicable: true,
			cardCreator: (data, props = {}) => {
				const sim = new Simulation(data);
				return <SimulationCard sim={sim} {...props} />;
			},
			browse: (params?)=> routing.push(routing.urls.simulationBrowser + (params && !(params as any).target ? `?${jQuery.param(params)}`:'')),
			create: () => {

				if (user.enableGEMSOnlyMode)
					rsSimulationStore.createNewObject();
				else if (user.isESGLicensed)
					site.setDialogFn(() => <NewSimulationDialog />);
				else
					routing.push(simulationStore.clientRoute + "?createRepository=true")
			},

			browseButtons: defaultBrowserButtons.get()
		},
		...useCasesSettings,
		{
			type: Query.ObjectType,
			displayTitle: Query.OBJECT_NAME_SINGLE,
			icon: appIcons.tools.queries as IConningApplicationIcon,
			applicable: true,
			cardCreator: (data, props = {}) => {
				const query = new QueryDescriptor(data);
				return <QueryCard query={query} {...props}  />;
			},
			browse: (params?)=> routing.push(routing.urls.query + (params && !(params as any).target ? `?${jQuery.param(params)}`:'')),
			create: ()=> dialogs.newQuery(),

			browseButtons: defaultBrowserButtons.get()
		},
		{
			type: IO.ObjectType,
			displayTitle: IO.OBJECT_NAME_SINGLE,
			icon: appIcons.tools.ios as IConningApplicationIcon,
			applicable: !user.enableGEMSOnlyMode && user.isIOLicensed,
			cardCreator: (data, props = {}) => {
				const io = new IO(data);
				return <IOCard investmentOptimization={io} {...props}/>;
			},
			browse: (params?)=> routing.push(routing.urls.ioBrowser + (params && !(params as any).target ? `?${jQuery.param(params)}`:'')),
			create: ()=> dialogs.newIO(),

			browseButtons: defaultBrowserButtons.get()
		},
		{
			type: ClimateRiskAnalysis.ObjectType,
			displayTitle: ClimateRiskAnalysis.OBJECT_NAME_SINGLE,
			icon: appIcons.tools.climateRiskAnalyses as IConningApplicationIcon,
			applicable:  !user.enableGEMSOnlyMode && user.isCRALicensed,
			cardCreator: (data, props = {}) => {
				const cra = new ClimateRiskAnalysis(data);
				return <ClimateRiskAnalysisCard climateRiskAnalysis={cra} {...props}  />;
			},
			browse: (params?)=> routing.push(routing.urls.climateRiskAnalysisBrowser + (params && !(params as any).target ? `?${jQuery.param(params)}`:'')),
			create: ()=> dialogs.newClimateRiskAnalysis(),

			browseButtons: defaultBrowserButtons.get()
		},
		{
			type: UserFile.ObjectType,
			displayTitle: UserFile.OBJECT_NAME_SINGLE,
			icon: appIcons.tools.userFiles as IConningApplicationIcon,
			applicable: !user.enableGEMSOnlyMode,
			cardCreator: (data, props = {}) => {
				const userFile = new UserFile(data);
				return <UserFileCard userFile={userFile} {...props} />;
			},
			browse: (params?)=> routing.push(routing.urls.userFileBrowser + (params && !(params as any).target ? `?${jQuery.param(params)}`:'')),
			create: () => dialogs.newUserFile(),

			browseButtons: defaultBrowserButtons.get()
		}
	];
});