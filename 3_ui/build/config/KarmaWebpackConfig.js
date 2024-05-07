import _ from 'lodash';
import globule from 'globule';

import { WebpackClientConfig } from './ClientWebpackConfig';
import {Environments} from '../webpack.options'

const INSTRUMENT = false;
const CDN = false;

export class WebpackKarmaConfig extends WebpackClientConfig {
	constructor(env = Environments.Debug, additionalDefines = {}) {
		super("webvise-unit-test", env, {
			PLATFORM: JSON.stringify('client'),
			KARMA: JSON.stringify(true),
			CONSOLE_NOTIFY: JSON.stringify(false),
			SHOW_ERROR_NOTIFICATIONS: JSON.stringify(false),
            CDN: JSON.stringify(CDN),
			...additionalDefines
		});
		//this.ts.configFileName = 'tsconfig.testing.json';

		let individualTests = {};
		let testFiles = globule.find(['./ui/src/**/*\.tests\.*', '!./ui/src/db/node_modules/**/*\.tests\.*']);

		//console.log(testFiles);
		testFiles.forEach((f) => {
			let key = f.substring(f.lastIndexOf('/') + 1, f.lastIndexOf('.'));
			individualTests[key] = {
				import: f,
				dependOn: 'conning-ui-karma'
			};
		});

		// Doing the below causes it to come into our javascript s
		//this.module.noParse.push(/jsondiffpatch\/src/);

		this.entry = {
			// 'test': './build/config/deps/test.js',
			'karma-window-variable' : ['./ui/src/test/karma-window-variable.ts'],
			'conning-ui-karma': ['./ui/src/test/test-common.ts'],
			// includeViaScripts: ['lib/wijmo/controls/wijmo.min.js',
			//     'lib/wijmo/controls/wijmo.grid.min.js',
			//     'lib/customIconic/js/conning.js',
			//     'lib/Iconic/js/iconic.min.js']
			...individualTests
		};

		this.optimization.runtimeChunk = false;

		// this.entry.vendor = [...this.entry.vendor, path.join(__dirname, 'deps', 'test.js')];
		// Allows debugging in webstorm - sortof...  breaks normal urls for chrome though.
		// devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
		// devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'

		if (INSTRUMENT) {
			this.module.postLoaders.push(
				/**
				 * Instruments TS source files for subsequent code coverage.
				 * See https://github.com/deepsweet/istanbul-instrumenter-loader
				 */
				{
					test: /\.ts$/,
					loader: 'istanbul-instrumenter-loader',
					query: {
						esModules: true
					},
					exclude: [
						'node_modules'
					]
				}
			);
		}

		this.externals = {
			...(CDN ? this.externals : null),
			"jsdom": "window",
			"cheerio": "window",
			"react/lib/ReactContext": true,
			"react/lib/ExecutionEnvironment": true,
			'react/addons': true
		};
	}
}
