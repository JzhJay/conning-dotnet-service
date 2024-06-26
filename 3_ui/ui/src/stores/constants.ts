export * from './site/constants';
export * from './report/constants';

export const dialogAnimationMs = 400;

export const slugs = {
	authCallback:       'authCallback',
	silentAuthCallback: 'silentAuthCallback',
	mfa:                'mfa',
	product:            noSpaceProductName(),
	demo:               'demo',
	disconnected:       'server-error',
	dashboard:          'dashboard',
	workspace:          'workspace',
	playground:             'playground',
	components:             'components',
	report:                 'reports',
	queryBuilder:           'builder',
	error:                  'error',
	logout:                 'logout',
	accessRequired:         'access-required',
	standaloneQuery:        'queries',
	queryResult:            'query-results',
	simulation:             'simulations',
	riskNeutralSimulation:  'risk-neutral-simulations',
	useCase:                'use-case',
	investmentOptimization: 'investment-optimizations',
	userFiles:              'files',
	climateRiskAnalysis:    'climateRiskAnalysis',
	user:                   'users',
	settings:               'settings',
	preferences:            'preferences',
	controlPanel:           'control-panel',
	admin:                  'admin',
	iconography:            'iconography',
	releaseNotes:       'release-notes',
	profile:            'profile',
	notifications:      'notifications',
	objectSchemas:      'objectSchemas',
	//migrateSchema: 'migrate-schema',
	billing:            'billing',
	installer:          'installer',
	index:              '',
	omdb:               'object-metadata',
	softwareNotices:    'license-notices',
	license:            'license'
}

export const SUPPORT_EMAIL = `${noSpaceProductName()}.support@conning.com`;

export const featureToggles = {
	billing:             false,
	cloudwatchLogViewer: false
}
function noSpaceProductName() {
	return window.conning.globals.product.replace(/\s/g, '');
}