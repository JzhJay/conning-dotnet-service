import { webpack, BaseWebpackConfig } from './BaseWebpackConfig';
import path                           from 'path';
import {BundleAnalyzerPlugin}         from 'webpack-bundle-analyzer';
import del 							  from 'del';
import MergeIntoSingleFilePlugin      from 'webpack-merge-and-include-globally';
import CopyPlugin 					  from 'copy-webpack-plugin';
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const getCdnList = require('../../ui/src/client/cdn');
const CDN = true;
const outputPath = path.join(__dirname, '../../dotnet/web-api/wwwroot/ui');

export class WebpackClientConfig extends BaseWebpackConfig {
	constructor(name, env, additionalDefines, additionalOptions = {}) {
		super(name ? name : "client",
		      env,
		      Object.assign({}, {
			      CDN:                      JSON.stringify(CDN),
			      KARMA:                    JSON.stringify(false),
			      PLATFORM:                 JSON.stringify('client'),
			      SHOW_ERROR_NOTIFICATIONS: JSON.stringify(true),
			      CONSOLE_NOTIFY:           JSON.stringify(false),
		      }, additionalDefines));
		const { isKarma } = this;
		const { isCreateBundleReport = false } = additionalOptions;
		console.log(`isKarma = ${isKarma}`)

		this.output.path = outputPath;

		if (isKarma) {
			this.output.path += "/test";
		}
		console.log(`Output path is ${this.output.path}`)

		const {isProd} = this;

		//this.ts.configFileName = "tsconfig.client.json";

		this.entry = {
			"conning-ui": ["./ui/src/client/client.tsx"],
			// "kui": ["./ui/src/kui/index.ts"],
			// "dev-docs": ["./ui/src/kui/docs/index.ts"],
		};

		this.plugins = [
			...this.plugins,
			new webpack.BannerPlugin({
				banner: `Copyright Conning and Company`
			}),
			new CopyPlugin({
				patterns: [
					{ from: '**/*', context: path.resolve('node_modules/@blueprintjs/core'), to: 'lib/blueprint/core' },
					{ from: '**/*', context: path.resolve('node_modules/@blueprintjs/icons'), to: 'lib/blueprint/icons' },
					{ from: '**/*', context: path.resolve('node_modules/@blueprintjs/table'), to: 'lib/blueprint/table' },
					{ from: '**/*', context: path.resolve('node_modules/@blueprintjs/select'), to: 'lib/blueprint/select' },
					{ from: '**/*', context: path.resolve('node_modules/@blueprintjs/datetime'), to: 'lib/blueprint/datetime' },
					{ from: '**/*', context: path.resolve('node_modules/tinymce'), to: 'lib/tinymce' },
					{ from: '**/*', context: path.resolve('ui/src/lib/tinymce/langs'), to: 'lib/tinymce/langs' },
					{ from: '**/*', context: path.resolve('ui/src/lib/auth0'), to: 'lib/auth0' },
					{ from: '**/*', context: path.resolve('node_modules/keycloak-js/dist'), to: 'lib/keycloak-js/dist' },
					{ from: '**/*', context: path.resolve('ui/src/lib/keycloak'), to: 'lib/keycloak-js/dist' },
					{ from: '**/*', context: path.resolve('ui/src/ui/fonts'), to: 'fonts' },
					{ from: '**/*', context: path.resolve('ui/src/ui/images'), to: 'images' },
					{ from: '*.js', context: path.resolve('ui/src/lib/wijmo/controls'), to: 'lib/wijmo' },
					{ from: '*.js', context: path.resolve('ui/src/lib/wijmo/interop/react'), to: 'lib/wijmo/interop/react' },
					{ from: '**/*', context: path.resolve('ui/src/lib/wijmo/styles'), to: 'lib/wijmo' },
					{ from: '**/*', context: path.resolve('ui/src/lib/semantic/dist'), to: 'lib/semantic' },
					{ from: '**/*', context: path.resolve('ui/src/lib/customIconic'), to: 'lib/customIconic' },
					{ from: '**/*', context: path.resolve('ui/src/lib/Iconic'), to: 'lib/Iconic' },
					{ from: '**/*', context: path.resolve('ui/src/iconning'), to: 'lib/iconning' }
				],
				options: {
					concurrency: 100,
				}
			}),
			new MergeIntoSingleFilePlugin({
				files: {
					[`external${isProd ? '.min.js' : '.js'}`]: getCdnList(!isProd),
				}
			})
		];

		this.externals = CDN ? {
			wijmo:               "wijmo",
			jquery:              "jQuery",
			"lodash":            "_",
			"react":             "React",
			"react-dom":         "ReactDOM",
			"react-dom/server":  "ReactDOMServer",
			"semantic-ui-react": "semanticUIReact",
			"keycloak-js":       "Keycloak"
		} : {};

		if (isProd || isCreateBundleReport) {
			this.plugins.push(new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false, reportFilename: 'webpack_client_report.html'}));
		}
	}
}

export class WebpackClientSsrConfig extends WebpackClientConfig {
	constructor(name, env, additionalDefines) {
		super(name, env, additionalDefines, false);
		this.entry = {
			"client-ssr": ["./ui/src/client/client.tsx"]
		};
	}
}

const config = new WebpackClientConfig(null, process.env.NODE_ENV, {}, { isUseDevServer: true });
const { isHotReload } = config;
Object.assign(config, {
	target: 'web',
	cache: true,
	devServer: {
		allowedHosts: ['advise.test'],
		static: outputPath,
		client: {
			overlay: false,
			webSocketURL: {
				protocol: 'ws',
				hostname: 'localhost'
			}
		},
		hot: isHotReload,
		port: 5001,
		devMiddleware: {
			writeToDisk: !isHotReload,
		},
		onListening: async function (devServer) {
			if (!devServer) {
			  throw new Error('webpack-dev-server is not defined');
			}

			await del([`${outputPath}/**`, `!${outputPath}`]); // only remove files and sub-directories
		}
	}
});

if (isHotReload) {
	config.plugins.push(new ReactRefreshWebpackPlugin({ overlay: false }));
}

export default config;
