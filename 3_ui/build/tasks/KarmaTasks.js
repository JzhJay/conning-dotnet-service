/* Todo / Ideas

 Optimizations:
 Commit unit test build after passing pre-receive hook.  Then only rebuild the test scripts if they are out of date.
 This would speed up the practice of running unit tests for developers synching a repo and verifying things by removing the compile step unless test sources have been modified.
 Alternatively, use DLLs to split out the core runtime and reuse it across client/server/tests and rebuild/check-it-in server-side.
 Chart tests are expensive to compile (for example)
 */
import {gulp, execAsync, argv, log, webpack, statsOptions} from '../';
import { WebpackKarmaConfig }              from '../config';
import * as fs                             from 'fs'

const karma = require('karma');
const task = "karma:test";
export const karmaTasks = {
	compile:          `${task}:compile`,
	unitTestsOnly:    `${task}:unitTestsOnly`,
	headless:         `${task}:headless`,
	headlessNoCompile:`${task}:headless:noCompile`,
	options:          `${task}:options`
}

gulp.task(karmaTasks.compile, (cb, name) => {
	log.banner(`start test files compile`);

	const config = new WebpackKarmaConfig(process.env.NODE_ENV);
	webpack(config).run((err, stats) => {
		log(`${name} built`, err, stats.toString(statsOptions))

		cb();
	});
});


gulp.task(`${task}`, gulp.series(karmaTasks.compile, function (done) {
	fs.writeFile('ui/visual_regression/result.png', "", () => {});
	let karma = createKarmaServer({singleRun: true, browsers: ['Chrome']}, () => {
		done()
	});
	karma.start();
}));

async function runKarmaTestWithHeadlessChrome (done) {
	const parseConfig = karma.config.parseConfig;
    fs.writeFile('ui/visual_regression/result.png', "",  () => {});
	let testGroups = ['user', 'tenantUser', 'userInterface', 'billing', 'repository', 'queryTool', 'IO', 'climateRiskAnalysis', 'unit', 'rsSimulation'];
	if (argv.testGroups) {
		testGroups = argv.testGroups.split(',');
	}

    let myExitCode = 0;
    for (let i = 0 ; i < testGroups.length ; i++) {
		log.banner(`start test group: ${testGroups[i]}`);
		console.log(Date());
		await new Promise((testDone) => {
			parseConfig(
				__dirname + '/../../karma.conf.js',
				{
					singleRun:  true,
					browsers:   ['ChromeHeadlessNoSandbox'],
					configFile: __dirname + '/../../karma.conf.js',
					testGroup:  testGroups[i],
				},
				{promiseConfig: true, throwErrors: true}
			).then(
				(karmaConfig) => {
					let karma = createKarmaServer(karmaConfig, (exitCode) => {
						console.log(Date(), `callback test group: ${testGroups[i]} ,exitCode: ${exitCode}`);
						myExitCode = exitCode != 0 ? exitCode : myExitCode;
						testDone();
					});

					karma.on('run_complete', function (browser, result) {
						karma.stop().then(() => log.banner(`end test group: ${testGroups[i]}`));
					});

					karma.start();
				},
				(rejectReason) => { /* respond to the rejection reason error */
					console.log("Karma config rejected: " + rejectReason);
					testDone();
				}
			);
		});
	}

	console.log("closing node")
	done();
	process.exit(myExitCode);
}

gulp.task(karmaTasks.headless, gulp.series(karmaTasks.compile, runKarmaTestWithHeadlessChrome));

gulp.task(karmaTasks.headlessNoCompile, runKarmaTestWithHeadlessChrome);

function createKarmaServer(options, callback) {
	return new karma.Server(options, callback);
}

gulp.task(karmaTasks.options, function (done) {

	log.banner(`Karma Version: ${karma.constants.VERSION}`);

	const run           = argv.run != null || argv.start != null,
	      watch         = argv.watch != null,
	      bail          = argv.bail != null,
	      singleRun     = argv.singleRun != null,
	      debug         = argv.debugKarma != null,
	      compile       = argv.noCompile == null && argv.nocompile == null,
	      startKarma    = argv.noKarma == null && argv.nokarma == null,
	      unitTestsOnly = argv.unitTestsOnly != null,
		standAloneTestsOnly = argv.standAloneTestsOnly != null,
		  testGroup     = argv.testGroup;

	if (!run && !bail && !singleRun && !startKarma && !noComponentTests) {
		console.log(
			`Unit Test Command Line Options:
    --run | --start : Automatically start a tests via a web browser after compilation is compilation is complete
    --noCompile  : Don't compile scripts first
    --bail  : Quit immediately if any test fails
    --debugKarma : Open Karma Debug Page when opening a web browser tab.  Only works with --run
    --singleRun : Quit after running the suite
    --unitTestsOnly: Don't run component tests
    --noKarma: Don't start Karma at all (compile/watch only)
    --testGroup: choose specific component to run (testGroupNames: unit/repository/queryTool/IO/billing , if needs multiple group at same time, using comma to split. if not setted will load all test. )

Example Usage:
    npm run test:karma -- --run --bail`);
	}
	else {
		log.banner(`Options:  ${watch ? '--watch ' : ''}${run ? '--run ' : ''}${bail ? '--bail ' : ''}${singleRun ? '--singleRun ' : ''}${!startKarma ? '--noKarma ' : ''}${unitTestsOnly ? '--unitTestsOnly ' : ''}`, 'top')
	}

	//startKarma && fs.writeFile('ui/visual_regression/result.png', '');

	var karmaOptions = {
		configFile:    			__dirname + '/../../karma.conf.js',
		unitTestsOnly: 			unitTestsOnly,
		standAloneTestsOnly: 	standAloneTestsOnly,
		client:        			{mocha: {bail: bail}},
		singleRun:     			singleRun,
		testGroup:     			testGroup
	};

	let karmaServer = startKarma ? createKarmaServer(karmaOptions) : null;

	if (compile || watch) {
		const config = new WebpackKarmaConfig(process.env.NODE_ENV, {CDN: JSON.stringify(false)});
		let pack = webpack(config);
		let firstCompile = true;

		pack.hooks.compile.tap('Compiling', () => {
			log.banner(`Unit tests are ${firstCompile ? 'compiling' : 'recompiling'}...`)
		});

		if (watch) {
			gulp.watch(`${process.cwd()}/karma.*`, {interval: 500}, (change) => {
				console.log(`Karma configuration changed, karma tests need to be restarted to respect the change.`)
				//restartKarma();
			});

			pack.watch(500, (err, stats) => {
				if (stats != null) {
					log(stats.toString(statsOptions));
				}

				if (firstCompile) {
					firstCompile = false;

					if (startKarma && karmaServer) {
						karmaServer.start();
					}
					done();
				}
				else {
					console.log(`Tests can be manually run via:  http://localhost:9876/debug.html`);
				}
			});
		}
		else {
			pack.run((err, stats) => {
				log(stats.toString(statsOptions), err)

				if (startKarma && karmaServer) {
					karmaServer.start();
					log.banner(`Starting Karma Unit Testing Server...`);
				}

				done();
			});
		}
	}
	else {
		if (startKarma && karmaServer) {
			karmaServer.start();
			log.banner(`Starting Karma Unit Testing Server...`);
		}
		done();
	}

	if (run && karmaServer) {
		karmaServer.on('listening', () => {
			execAsync(`open http://localhost:9876${debug ? '/debug.html' : ''}`);
		});
	}
});
