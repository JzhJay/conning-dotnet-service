import type {SortOrder, MenuOpenOn, SimulationGuid,ClimateRiskAnalysisGuid,QueryGuid, IOGuid } from 'stores';

export enum SidebarViewMode { accordion, chooser };

interface QueryPreferences {
	animate?: boolean,
	hideImpliedAxes?: boolean;
	defaultQueryName?: string;
	expertMode?: boolean;
	newQueryInNewTab?: boolean;
	runQueryInNewTab?: boolean;
	runQueryTimeout?: number;
	availableViewsLocation: 'sidebar' | 'toolbar' | string;
	shouldExpandVariables?: boolean;
}

interface SidebarPreferences {
	allow?: boolean,
	viewMode?: SidebarViewMode;
	show?: boolean;
	width?: number,
	simulations?: {},
	queries?: { showQuerySessions?: boolean, showStoredQueries?: boolean }
	savedQueries?: {}
	results?: { filter?: boolean }
	reports?: { filter?: boolean }
	users?: {}
}

interface SearchPreferences {
	view?: 'table' | 'card',
	columnWidths?: { [index: number]: number };
}

export interface Favorites {
	query?: QueryGuid[];
	queryResult?: QueryGuid[];
	simulation?: SimulationGuid[];
	investmentOptimization?: IOGuid[];
	climateRiskAnalysis?: ClimateRiskAnalysisGuid[];
}

export interface NotificationSubscriptionSetting {
	enabled?: boolean;
	email?: boolean;
	phone?: boolean;
	desktop?: boolean;
	description?: string;
}

interface NotificationSettings {
	endpoints: {
		email?: {
			nickname?: string;
			enabled: boolean, alternateEmail?: string, useAlternateEmail?: boolean },
		phone?: {
			nickname?: string;
			enabled: boolean, phoneNumber?: string
		},
		desktop?: { enabled: boolean }
	}

	system?: { excessiveMemory?: NotificationSubscriptionSetting, failure?: NotificationSubscriptionSetting },
	billing?: { usage?: NotificationSubscriptionSetting & { amount?: number }, threshold?: NotificationSubscriptionSetting & { amount?: number } },
	simulation?: { runtime?: NotificationSubscriptionSetting & { minutes?: number }, events?: { parse?: NotificationSubscriptionSetting, compile?: NotificationSubscriptionSetting, simulate?: NotificationSubscriptionSetting } }
}

interface ClientFeatures {
	reports?: boolean;
}

export interface UserSettings {
	sidebarTree?: { expanded: { [id: string]: boolean } };
	contextMenuDuration?: string;
	karma?: { autoScroll?: boolean }

	features?: ClientFeatures;
	query?: QueryPreferences;
	report?: {
		newItemLayoutLocation: 'tab' | 'row' | 'column'
		showSidebar?: boolean;
		showLayoutTabs?: boolean;
		showToolbars?: boolean;
		showQuerySidebars?: boolean;
	};

	catalog?: {
		view?: 'card' | 'table',
		sidebar?: boolean;
		swapPanels?: boolean;  // Put the folder panel second
		showFolders?: boolean;
		splitLocation?: number;
		sidebarSplitLocation?: number;
		visibleTags?: {[key:string]: string[]} | {[key:string]: [string, string][]} | { [key:string]: { [tagName: string]: boolean }};
	}

	searchers?: {
		simulation?: SearchPreferences;
		ioRun?: SearchPreferences;
		io?: SearchPreferences;
		userFile: SearchPreferences;
		query?: SearchPreferences;
		reports?: SearchPreferences;
		users?: SearchPreferences;
		climateRiskAnalysis?: SearchPreferences;
	}

	julia?: {
		host?: string;
		recentHosts?: string[];
		disabled?: boolean;
	}

	formatPrecision?: number;
	maxRecentItems?: number;
	showSecondaryToolbars?: boolean;
	defaultSortOrder?: SortOrder;
	confirmDeleteActions?: boolean;
	animateContextMenu?: boolean;
	menuOpenOn?: MenuOpenOn;

	sidebar?: SidebarPreferences;

	favorites?: Favorites;
	enableMFA?: boolean;
	externalID?: string;

	notifications?: NotificationSettings;

	pages?: {
		cloudWatchDemo?: { splitLocation?: number, sidebar?: boolean, hideNonLogEvents?: boolean },
		manageDataSchema?: { splitLocation?: number, preview?: boolean, sidebar?: boolean, selectedObjectTypes?: string[], uiTab?: string, previewView?: 'card' | 'table', showSystemTags?: boolean },
		migrateDataSchema?: {},
		billing?: { user?: any }
	};

	region?: string;

	language?: string;
}

export interface KuiInstanceSettings {
	splitLocation?: number;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
	maxRecentItems:        10,
	formatPrecision:       7,
	defaultSortOrder:      'asc',
	confirmDeleteActions:  false,
	animateContextMenu:    true,
	showSecondaryToolbars: true,
	menuOpenOn:            'hover',
	contextMenuDuration:   '400ms',

	features: {
		reports: false,
	},

	julia: {
		recentHosts: [],
		disabled:    false
	},

	sidebarTree: {expanded: {}},

	report: {
		newItemLayoutLocation: 'tab',
		showLayoutTabs:        true,
		showToolbars:          true,
		showQuerySidebars:     true
	},

	query: {
		runQueryTimeout:        300000, // 5 minutes
		availableViewsLocation: 'sidebar',
		runQueryInNewTab:       false,
		newQueryInNewTab:       false,
		expertMode:             false,
		animate:                true,
		defaultQueryName:       'New Query'
	},

	catalog: {
		sidebar:       true,
		splitLocation: 200,
		sidebarSplitLocation: 200,
		view: 'card',
		swapPanels: false,
		showFolders: true,
		visibleTags: {}
	},

	searchers: {
		reports:    {
			view:         'card',
			columnWidths: {}
		},
		simulation: {
			view:         'card',
			columnWidths: {}
		},
		query:      {
			view:         'card',
			columnWidths: {}
		},
		ioRun:      {
			view:         'card',
			columnWidths: {}
		},
		io:   {
			view:         'card',
			columnWidths: {}
		},
		userFile:   {
			view:         'card',
			columnWidths: {}
		},
		users:      {
			view:         'card',
			columnWidths: {}
		},
		climateRiskAnalysis:   {
			view:         'card',
			columnWidths: {}
		},
	},

	sidebar: {
		allow:        false,
		show:         true,
		viewMode:     SidebarViewMode.chooser,
		width:        400,
		simulations:  {},
		queries:      {
			showQuerySessions: true,
			showStoredQueries: true
		},
		savedQueries: {},
		results:      {
			filter: false
		},
		users:        {},
		reports:      {
			filter: false
		}
	},

	favorites:                       {
		query:       [],
		queryResult: [],
		simulation:  [],
		investmentOptimization: [],
		climateRiskAnalysis: [],
	},
	enableMFA:                       false,
	externalID:                      null,

	notifications: {
		endpoints: {
			email:   {enabled: true, useAlternateEmail: false, alternateEmail: null},
			phone:   {enabled: true, phoneNumber: null},
			desktop: {enabled: false}
		},

		system:     {
			excessiveMemory: {},
			failure:         {}
		},
		billing:    {
			threshold: {},
			usage:     {}
		},
		simulation: {
			events:  {
				compile:  {},
				parse:    {},
				simulate: {}
			},
			runtime: {}
		}
	},
	pages:         {
		cloudWatchDemo:   {splitLocation: 200, sidebar: true, hideNonLogEvents: true},
		manageDataSchema: {splitLocation: 200, sidebar: true, preview: true, selectedObjectTypes: ['Simulation'], uiTab: 'tags', previewView: 'card', showSystemTags: false},
		billing:          {}
	},
	karma: { autoScroll: false }
};

