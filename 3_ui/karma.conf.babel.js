import _       from 'lodash';
import os      from 'os';

let platform = os.platform();

const dist = 'dotnet/web-api/wwwroot';

require('mocha-clean');

module.exports = function (config) {
	let juliaApiPath = 'http://localhost:8002';
	let dotnetApiPath = 'http://localhost:5000';
	if (platform !== 'darwin') { // in TeamCity or docker container
		if (process.env.JULIA_REST_API) {
			juliaApiPath = `http://${process.env.JULIA_REST_API}:8002`;
		} else {
			juliaApiPath = 'http://advise.test/julia';
		}

		if (process.env.DOTNET_REST_API) {
			dotnetApiPath = `http://${process.env.DOTNET_REST_API}:5000`;
		}
	}

	console.log(`DotnetApiPath=${dotnetApiPath}`);
	console.log(`JuliaApiPath=${juliaApiPath}`);

	const standAloneTestFiles = {
		userInterface: [
			"inputSpecification.tests.js",
			"InputTable.tests.js"
		]
	}

	const integrationTestFiles = {
		unit: [
			'xhr.tests.js',
			'BillingReportLogic.tests.js',
			'OmdbStore.tests.js',
			'JuliaStore.tests.js',
			'IOStore.tests.js',
			'SimulationStore.tests.js',
			'QueryStore.tests.js',
			'QueryResultStore.tests.js',
			'ReportStore.tests.js',
			'chart.unit.tests.js',
			'PivotCache.tests.js',
			'utility.tests.js',
			'ObjectCatalog.tests.js',
			'UserTag.tests.js',
			'ObjectStore.tests.js',
			'controlPanelPage.tests.js'
		],
		user: [
			'UserStore.tests.js' // Must be first to setup log in as test user
		],
		billing: [
			'BillingReportPage.tests.js',
		],
		tenantUser: [
			'UserStore.tenant.tests.js', // Must be first to setup log in as test user
			`BillingReportLogic.tests.js`
		],
		userInterface: standAloneTestFiles.userInterface,
		repository: [
			'RepositoryComponent.tests.js'
		],
		queryTool: [
			'correlations.tests.js',
			'chart.component.tests.js',
			'pivotTable.tests.js',
			'queryBuilder.tests.js'
		],
		IO: [
			'AssetClassInput.tests.js',
			'IOComponents.tests.js',
			'ioChart.tests.js', // Causes a TeamCity only hang when placed earlier
			'IOInputs.tests.js'
		],
		rsSimulation: [
			`RSSimulationInputs.tests.js`,
			`StepManagerQuery.tests.js`,
			`StepNavigator.tests.js`,
			'ModelTree.tests.js',
			'AxisOrganization.tests.js',
			'CombinatorialAddRows.tests.js',
			`RecalibrationModelChart.tests.js`,
			`OptimizationAlgorithm.tests.js`,
			`RSSimulationRun.tests.js`
		],
		climateRiskAnalysis: [
			`ClimateRiskAnalysisInputs.tests.js`,
			`ClimateRiskAnalysisOutputs.tests.js`
		]
	};

	let testFilePaths = [];

	console.log("config.standAloneTestsOnly", config.standAloneTestsOnly)

	if (config.standAloneTestsOnly) {
		Object.keys(standAloneTestFiles).forEach(key => testFilePaths = testFilePaths.concat(standAloneTestFiles[key]));
	}
	else if ( config.unitTestsOnly ) {
		testFilePaths = testFilePaths.concat(integrationTestFiles.unit);
	} else if (typeof config.testGroup == 'string') {
		config.testGroup.split(',').forEach( testGroup => {
			testGroup = testGroup.replace(/(^\s)|(\s$)/g , '');
			if(integrationTestFiles[testGroup]){
				testFilePaths = testFilePaths.concat(integrationTestFiles[testGroup]);
			}
		});
	} else {
		Object.keys(integrationTestFiles).forEach(key => testFilePaths = testFilePaths.concat(integrationTestFiles[key]));
	}

	testFilePaths.forEach( path => console.log('adding test file: ' + path));

	if (!config.standAloneTestsOnly) {
		testFilePaths = [
			'beforeTestGroup.tests.js',
			...testFilePaths,
			'afterTestGroup.tests.js'
		];
	}

	config.set({
				   browsers: ['Chrome'],
		           autoWatch:            false,
		           crossOriginAttribute: false,
		           concurrency:          1, // number of browsers that can run at once.
		           // exclude: [ process.env.exclude ],

		           nocache: true,
		           files:   [
					   `${dist}/ui/test/external.js`,
					   `${dist}/ui/test/lib/wijmo/wijmo.js`,
			           `${dist}/ui/test/lib/wijmo/wijmo.gauge.js`,
			           `${dist}/ui/test/lib/wijmo/wijmo.input.js`,
			           `${dist}/ui/test/lib/wijmo/wijmo.nav.js`,
			           `${dist}/ui/test/lib/wijmo/wijmo.grid.js`,
					   `${dist}/ui/test/lib/wijmo/interop/react/wijmo.react.min.js`,

			           {pattern: '**/*.js.map', included: false, nocache: true},
			           // move these to a prebuilt tests/index.js file that can be loaded by mocha first.

			           'ui/src/lib/customIconic/js/conning.js',
			           'ui/src/lib/Iconic/js/iconic.min.js',

					   `${dist}/ui/test/vendors.js`,
					   {pattern: `${dist}/ui/test/conning-ui-karma.js`, nocache: true},
					   {pattern: `${dist}/ui/test/karma-window-variable.js`, nocache: true},

					   ...testFilePaths.filter( f => !!f).map(f => ({pattern: `${dist}/ui/test/${f}`, nocache: true})),

			           //'dist/test/*.tests.js',

			           //'dist/test/tests.js',

					   {pattern: 'ui/src/styles/**/*', watched: false, included: false, served: true, nocache: true},
			           {pattern: 'ui/src/ui/**/*', watched: false, included: false, served: true, nocache: true},
			           {pattern: 'ui/src/lib/Iconic/svg/**/*.svg', watched: false, included: false, served: true, nocache: true},
			           {pattern: 'ui/src/lib/customIconic/**/*', watched: false, included: false, served: true, nocache: true},
			           {pattern: 'ui/src/lib/semantic/dist/*', watched: false, included: false, served: true, nocache: true},
			           {pattern: 'ui/visual_regression/**/*.png', watched: false, included: false, served: true, nocache: true},
			           {pattern: 'ui/src/**/*', watched: false, included: false},
			           {pattern: `${dist}/**/*`, watched: false, included: false, served: true, nocache: true},
			           // , {pattern: 'node_modules/**/*', watched: false, included: false, served: true, nocache: true}
					   {pattern: 'build/karmatest/fixtures/*', watched: false, included: false, served: true, nocache: true},
		           ],

		           client:        {
			           captureConsole: true,
			           mocha:          {
				           //reporter: require('mochawesome'),
				           reporter: 'html',
				           bail:     config.unitTestsOnly, // Always run all for full test and TeamCity
				           //require: [require('mocha-clean')]
			           }
		           },
		           // https://www.npmjs.com/package/karma-mocha-reporter
		           mochaReporter: {
			           showDiff:      false,
			           ignoreSkipped: false,
					   output: platform === 'darwin' ? 'full' : 'minimal'
		           },

		           // mocha: {
		           //     reporter: 'mochawesome',
		           //     bail: false
		           // },

						   junitReporter: {
						      outputDir: '/ADVISE/test-reports', // results will be saved as $outputDir/$browserName.xml
						      outputFile: config.testGroup+'-'+(Math.random().toString(36).substr(2, 5))+'.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
						      suite: '', // suite will become the package name attribute in xml testsuite element
						      useBrowserName: true, // add browser name to report and classes names
						      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
						      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
						      properties: {}, // key value pair of properties to add to the <properties> section of the report
						      xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
						   },

		           reporters: platform == 'darwin' ? ['mocha', /*, 'progress', 'coverage'*/] : ['junit', 'teamcity', 'mocha'], //'coverage'] : ['teamcity'],

		           /*
		            upstreamProxy: {
		            hostname: "advise.test",
		            path: "/karma",
		            port: 80
		            },*/

		           proxies: {
			           "/favicon.ico":                                  `/base/${dist}/images`,
			           // "/test/":              "/base/ui/src/test/",
			           // "/styles/":            "/base/ui/src/styles/",
			           "/ui/":                                          `/base/${dist}/ui/test`,
			           // "/node_modules/":      "/base/node_modules/",
			           "/visual_regression/":                           "/base/$[dist}/ui/visual_regression/",
			           // "/fonts/":             "/base/ui/src/ui/fonts/",
			           "/images/":                                      `/base/${dist}/images/`,
			           // "/api/":               "http://localhost:8060/api/",
			           "/base/dotnet/web-api/wwwroot/ui/test/webpack:": `/base/${dist}`,
			           "/julia":                                        juliaApiPath,
			           "/graphql":                                      `${dotnetApiPath}/graphql`,

					   "/api":                                          `${dotnetApiPath}/api`,

					   "/fixtures":                                     '/base/build/karmatest/fixtures/',
		            },

		           preprocessors:   {
			           'src/*.tsx': ['coverage'],
			           'src/*.ts':  ['coverage'],
			           'src/*.js':  ['coverage']
		           },
		           customLaunchers: {
					   ChromeHeadlessNoSandbox: {
						   base: 'ChromeHeadless',
						   flags: ['--no-sandbox']
					   }
		           },

		           frameworks: [
			           'mocha',
			           'chai',
			           // https://github.com/cucumber/cucumber-js
			           // https://github.com/s9tpepper/karma-cucumberjs
			           //'cucumberjs'
			           //'sinon'
		           ],

		           browserNoActivityTimeout:   0,
		           browserDisconnectTimeout:   240000,
		           browserDisconnectTolerance: 5,

		           // plugins: [
		           //      require('../src/test/karma-julia-reporter')
		           //  ],

		           remapIstanbulReporter: {
			           reports: {
				           html: 'coverage'
			           }
		           },

		           /*
		            coverageReporter: {
		            dir:                 dist,
		            instrumenterOptions: {
		            istanbul: {noCompact: true}
		            },
		            reporters:           [
		            {type: 'json', subdir: 'coverage'},
		            ]
		            },
		            */
	           });
};
