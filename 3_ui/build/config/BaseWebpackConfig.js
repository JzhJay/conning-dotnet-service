import webpack                      from 'webpack'
import CaseSensitivePathsPlugin     from 'case-sensitive-paths-webpack-plugin';
import MiniCssExtractPlugin         from 'mini-css-extract-plugin';
import CssMinimizerPlugin           from 'css-minimizer-webpack-plugin';
import path                         from 'path';
import os                           from 'os';
import ForkTsCheckerWebpackPlugin   from 'fork-ts-checker-webpack-plugin';
import {generatedBuildConstants}    from './defaultClientConfig';
import {Environments, statsOptions} from '../webpack.options'
import {IconicUpdatePlugin}         from './plugin/IconicUpdatePlugin';
import {transform}                  from '@formatjs/ts-transformer';

const ReactRefreshTypeScript = require('react-refresh-typescript');

const jsExclusion = /src(\/|\\)lib/;

process.noDeprecation = true; // https://github.com/webpack/loader-utils/issues/56

export {Environments, MiniCssExtractPlugin, webpack, path};

let _env = '';
let _additionalDefines = '';
export class BaseWebpackConfig {
	get env() {
		return _env
	}

	get isKarma() {
		return _additionalDefines && _additionalDefines["KARMA"] === "true";
	}

	get isProd() {
		return _env === Environments.Production
	}

	get isHotReload() {
		return process.env.HOT_RELOAD === 'true' && !this.isProd;
	}

	get providePlugin() {
		return new webpack.ProvidePlugin({
			"_":             "lodash",
			$:               "jquery",
			jQuery:          "jquery",
			"window.jQuery": "jquery",
			Boom:                 'boom', // Error handling
			Hapi:                 'hapi', // Hapijs (http://hapijs.com/)
			webpack:              'webpack',
			//'Promise': 'imports?this=>global!exports?global.Promise!bluebird',
			//'Promise': 'bluebird',

			'assert': 'assert',

			// React related
			React:                     'react',
			ReactDOM:                  'react-dom',
			'ReactCSSTransitionGroup': 'react-addons-css-transition-group',
			ReactTooltip:              'react-tooltip',
			Responsive:                'react-responsive',
			//Autosuggest: 'react-autosuggest',
			uuid:                      'uuid',
			classNames:                'classnames',
			Collapse:                  'react-collapse',
			PropTypes:                 'prop-types',
			//Portal: 'react-portal',
			// Highcharts
			// Highcharts: 'lib/highcharts/highchart',
			// HighchartsAdapter: 'lib/highcharts/highchart',
			Highcharts:   [`components/system/highcharts/highchartsDependencies${this.isProd ? '' : '.src'}`, 'default']

			// Semantic-UI
			// sem: 'lib/semantic/semantic-ui-react',

			// Blueprint
			// bp: '@blueprintjs/core'

			// wijmo: 'wijmo',
			// 'wijmo.grid': 'wijmo.grid'
		});
	}

	constructor(name = "Base", env, additionalDefines) {
		_env = env;
		_additionalDefines = additionalDefines;

		const { isProd, isHotReload } = this;

		console.info(`Build environment:  ${name} - ${env}`);
		this.mode = isProd ? 'production' : 'development';
		/**
		 * devtool differences: https://webpack.js.org/configuration/devtool/#devtool
		 *
		 * Prod: source-map slow full source map support and allows for webstorm debugging (but very slow in both initial build and rebuild)
		 * Dev: eval-cheap-module-source-map is slow in intial build but faster in rebuild
		 **/
		this.devtool = isProd ? 'source-map' : 'eval-cheap-module-source-map';

		let finalDefines = Object.assign({},
		                                 generatedBuildConstants(),
		                                 {
			                                 NODE_ENV:        JSON.stringify(env),
			                                 IS_PROD:         JSON.stringify(env === Environments.Production),
			                                 DEV_BUILD:       JSON.stringify(os.platform() === 'darwin' || os.platform() === 'win32'),
			                                 BUILD_PLATFORM:  JSON.stringify(os.platform()),
			                                 BUILD_DIRECTORY: JSON.stringify(path.join(__dirname, '..', '..')),
			                                 DEV_DOCS:        true,
											 'process.env':   {'NODE_ENV': JSON.stringify(env)}
		                                 },
		                                 additionalDefines);

		//console.log(finalDefines);

		this.plugins = [
			new ForkTsCheckerWebpackPlugin(),
			new CaseSensitivePathsPlugin(),
			new webpack.DefinePlugin(finalDefines),
			new MiniCssExtractPlugin({
				filename:  `[name]${isProd ? '.min' : ''}.css`,
				//disable:   !isProd
			}),
			this.providePlugin,
			new IconicUpdatePlugin()
		];

		this.optimization = {
			runtimeChunk: true,
			splitChunks: {
				cacheGroups: {
					vendors: {
						test: /([\\/]node_modules[\\/])|([\\/]ui[\\/]src[\\/]lib[\\/])/,
						chunks: 'all',
						name: 'vendors',
						enforce: true
					}
				}
			}
		};

		if (isProd && name !== "webvise-electron") {
			this.optimization = {
				...this.optimization,
				minimizer: [
					'...',
					new CssMinimizerPlugin()
				]
			}
		}

		this.output = {
			path:       path.resolve('./dist'),
			filename:   `[name]${isProd ? '.min' : ''}.js`,
			publicPath: "/ui/",
			clean: true,
		};


		// this.ts = {
		//     compilerOptions: {
		//         noEmit:    false,
		//         types:     [],
		//         typeRoots: ["../typings/", "../node_modules/@types/"]
		//     }
		// };

		this.module = {
			rules: [
				{
					test: /\.mjs$/,
					include: /node_modules/,
					type: "javascript/auto"
				},
				// { // Linting support for javascript (eslint)
				//     test: /\.jsx$|\.js$/,
				//     loader: 'eslint-loader',
				//     exclude: [
				//         /node_modules/,
				//         /bower_components/,
				//         /src(\/|\\)lib/
				//     ]
				// },
				//{ // Linting support for typescript (tslint)
				//    test: /\.ts$/,
				//    loader: "tslint"
				//}

				{
					test:    /\.js$/,
					enforce: "pre",
					loader:  "source-map-loader",
					exclude: [
						/node_modules/,
						/bower_components/,
						jsExclusion
					]
				},

				// {
				//     test:    /\.(less|css)$/,
				//     exclude: [/node_modules/, /(\/|\\)lib(\/|\\)/, /(\/|\\)src(\/|\\)styles/],
				//     use:     [
				//         ExtractTextPlugin.extract({
				//             fallbackLoader: "style/useable",
				//             loader:         "style-loader"
				//         }),
				//         {
				//             loader: 'css-loader?sourceMap',
				//             query:  {
				//                 camelCase:      true,
				//                 modules:        true,
				//                 importLoaders:  2,
				//                 localIdentName: '[name]__[local]'
				//             }
				//         },
				//         'postcss-loader?sourceMap',
				//         'less-loader?sourceMap'
				//     ]
				// },
				//
				// {
				//     test:    /\.tsx?$/,
				//     //loaders: ['babel?cacheDirectory=true', `ts?${name == 'client' ? '' : `instance=${name}&`}} visualStudioErrorFormat=true`],
				//     use:     [{
				//         loader: 'ts',
				//         query:  {
				//             instance: name == 'client' ? '' : name
				//         }
				//     }],
				//     exclude: [
				//         /node_modules/
				//     ]
				// },
				{
					test:    /\.ts(x?)$/,
					exclude: [/node_modules(!\/wijmo)/],
					//exclude: [/node_modules/],
					use: [
						// {
						// 	loader: 'thread-loader', // Seems to introduce a race condition in the formatjs transform which sometimes results in ids not being added to messages.
						// 	options: {
						// 		workers: Math.max(1, require('os').cpus().length / 2 - 1),
						// 	},
						// },
						{
							loader: 'ts-loader',
							options: {
								// disable type checker - we will use it in fork plugin
								happyPackMode: true, // for thread-loader, it implicitly sets *transpileOnly* to true
								//instance:                name == 'client' ? '' : name,
								compilerOptions: {
									noEmit:    false,
									types:     [],
									typeRoots: ["../typings/", "../node_modules/@types/"]
								},
								getCustomTransformers: () => ({
									before: [ ...(isHotReload ? [ReactRefreshTypeScript()] : []),
									          transform({
										        overrideIdFn: '[sha512:contenthash:base64:6]'
									          })
									],
								})
							}
						}
					]
				},

				{
					test:    /\.css$/,
					exclude: [/node_modules/, /(\/|\\)lib(\/|\\)/], // /(\/|\\)src(\/|\\)styles/],
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: { esModule: false }
						},
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								importLoaders: 1,
								modules: {
									exportLocalsConvention: "camelCase",
									localIdentName: "[name]__[local]"
								}
							}
						},
						{
							loader: 'postcss-loader',
							options: { sourceMap: true}
						},
					]
				},

				// {
				//     test:    /\.css$/,
				//     include: [/(\/|\\)src(\/|\\)styles/],
				//     loader:  ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader?sourceMap&importLoaders=1', 'postcss-loader?sourceMap']})
				// },

				{
					test: /\.scss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: { esModule: false }
						},
						{
							loader: 'css-loader',
							options: { sourceMap: true}
						},
						{
							loader: 'postcss-loader',
							options: { sourceMap: 'inline'}
						}
					]
				},

				{
					test:    /\.css$/,
					include: [/node_modules/, /(\/|\\)lib(\/|\\)/], //, /(\/|\\)src(\/|\\)styles/],
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: { esModule: false }
						},
						{
							loader: 'css-loader',
							options: { sourceMap: true}
						}
					]
				},

				{
					test:   /\.otf(\?\S*)?$/,
					loader: 'url-loader',
					options: {
						limit: 100000,
						mimetype: 'application/font-otf'
					}
				}, {
					test:   /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "file-loader"
				}, {
					test:   /\.html$/,
					loader: "file-loader"
				},
				{
					test:   /\.md/,
					loader: "raw-loader"
				},
				{
					test:   /\.k$/,
					loader: "raw-loader"
				},
				{
					test:   /\.test$/,
					loader: "raw-loader"
				},
				{test: /\.(png|jpg|jpeg|gif|woff.*)$/, loader: 'url-loader' },

				{
					test:    /\.jsx?$/,
					exclude: [
						/node_modules/,
						/bower_components/,
						jsExclusion
					],
					use:     {
						loader: 'babel-loader',
						options: {
							sourceMap: true,
							//presets:   ["@babel/preset-env", "@babel/preset-react"],
							//plugins:   [["@babel/plugin-proposal-decorators", { "legacy": true }], ["transform-es2015-modules-commonjs"], ...(isProd ? [["transform-react-constant-elements"], ["transform-react-inline-elements"]] : [])]
						}
					}
				},

				{
					test:   /\.svg$/,
					loader: 'raw-loader'
				},

				{
					test:    /\.(graphql|gql)$/,
					exclude: /node_modules/,
					loader:  'graphql-tag/loader'
				}
			],

			noParse: [
				/node_modules\/quill\/dist/,
				/node_modules\/canvas-prebuilt\//
				// /node_modules\/ajv\//
			]
		};

	}

	// sassLoader = {
	//     data: '$output-bourbon-deprecation-warnings: false;'
	// }

	//context = __dirname + '/src';

	resolve = {
		modules:    ["ui/src", 'ui/src/lib', "node_modules"],
		extensions: ['.ts', '.tsx', '.webpack.js', '.web.js', '.js', '.jsx', '.jade', '.styl', '.less', ".json"],
		fallback: {
			assert: require.resolve('assert'),
			path: require.resolve('path-browserify'),
			buffer: require.resolve('buffer'),
			stream: require.resolve('stream-browserify')
		}
	};
	stats = statsOptions;

	// tslint = {
	//     configuration: {
	//         rules: {
	//             quotemark: [true, "double"]
	//         }
	//     },
	//
	//     // tslint errors are displayed by default as warnings
	//     // set emitErrors to true to display them as errors
	//     emitErrors: true,
	//
	//     // tslint does not interrupt the compilation by default
	//     // if you want any file with tslint errors to fail
	//     // set failOnHint to true
	//     failOnHint: true
	// };
}
