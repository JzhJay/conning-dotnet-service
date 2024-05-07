import {log, fs, os, argv, execAsync, execSync, gulp, runSequence, deleteFolderRecursive, globule} from '../';
import {AUTH0_REST_CLIENT_ID, AUTH0_DOMAIN, AUTH0_REST_CLIENT_SECRET}                                               from '../constants';
import * as _ from 'lodash';

const KILL_JULIA_SERVER_TIMEOUT = 2500;
const JULIA_PROCESS_NAME = "julia-webvise";
const JULIA_VERSION = "v1.6"
const JULIA = "/Applications/Julia-1.6.app/Contents/Resources/julia/bin/julia"

const task = "julia";
export const juliaTasks = {
	clearDatabase:        `${task}:clear-data`,
	installJuliaPackages: `${task}:setup:packages`,
	watchTests:           `${task}:tests:watch`,
	start:                `${task}:start`,
	staticCompile:        `${task}:compile`
};

const cwd = process.cwd();

const baseUrl = `${cwd}/julia`;
const JULIA_PACKAGE_DIR = `${cwd}/.julia`;
let defaultExecOptions = {env: {...process.env, 'PRE_DOWNLOAD_S3_FILE': `${JULIA_PACKAGE_DIR}/var/temp`, 'JULIA_PKGDIR': JULIA_PACKAGE_DIR}};

gulp.task(juliaTasks.installJuliaPackages, () => {
	execSync(`${JULIA} -e 'println("Julia $VERSION"); @assert Base.thisminor(VERSION) == VersionNumber("${JULIA_VERSION}")'`, defaultExecOptions)
	execSync(`rm -rf ${JULIA_PACKAGE_DIR}/lib ${JULIA_PACKAGE_DIR}/${JULIA_VERSION} `, defaultExecOptions)
	execSync(`${JULIA} -e 'Pkg.init()'`, defaultExecOptions)
	packageUpdate(JULIA_PACKAGE_DIR, defaultExecOptions)
})

gulp.task(juliaTasks.clearDatabase, () => {
	deleteFolderRecursive(`${process.cwd()}/var/ADVISE+`);
	deleteFolderRecursive(`${process.cwd()}/var/data`);
})

const DEFAULT_S3_BUCKET_NAME = "conning-karma-test-data"

function execJulia(script, arg, options, execOptions = defaultExecOptions) {
	if (!options) {
		options = {}
	}

	const precompiledLib = `${options.pkgdir}/libADVISE.dylib`;

	const precompileArg = fs.existsSync(precompiledLib) ? `-J${precompiledLib}` : '';
	if (precompileArg != '') {
		log.banner(`Running julia including statically compiled source ${precompiledLib}...`)
	}
	else {
		log.banner('Running julia withOUT static compiling (JIT)')
	}

	let command = `exec -a ${JULIA_PROCESS_NAME} ${JULIA} ${options.interactive ? '-i' : ''} --color=yes ${precompileArg} ${baseUrl}/${script} ${arg} --auth=${options.auth}`;

	return options.async
	       ? execAsync(command, execOptions)
	       : execSync(command, execOptions)
}

gulp.task(juliaTasks.staticCompile, () => staticCompile());

function staticCompile() {
	log.banner("Precompiling Julia with our ADVISE source...")
	const docker = argv.d != null || argv.docker != null;
	let staticCompileExecOptions = {env: {...process.env, 'PRECOMPILE_ONLY': 1}};
	if (!docker) {
		staticCompileExecOptions = {env: {...staticCompileExecOptions.env, 'JULIA_PKGDIR': JULIA_PACKAGE_DIR}};
	}
	execSync(`${JULIA} julia/juliac/juliac.jl julia/ADVISE.jl`, staticCompileExecOptions)
}

function packageUpdate(juliaPackageDir, execOptions) {
	log.banner("Resetting Julia package symlinks...")
	execSync(`find ${juliaPackageDir}/${JULIA_VERSION} -maxdepth 1 -type l -not -name '.*' -delete`, execOptions)
	execSync(`(cd ${juliaPackageDir}/${JULIA_VERSION}; rm -f *.jl; ln -s ${baseUrl}/modules/* ${baseUrl}/apps/*/* ${baseUrl}/temps/* .)`, execOptions)
	execSync(`(cd ${juliaPackageDir}/${JULIA_VERSION}; for f in *.jl; do mv -- "\$f" "\${f%.jl}"; done)`, execOptions)
	execSync(`(set -e
  	          cd ${juliaPackageDir}/${JULIA_VERSION}/METADATA
  		         git fetch origin
               git checkout 81487ef)`, execOptions);
	execSync(`${JULIA} -e 'Pkg.resolve()'`, execOptions);
	// Requests.jl reduce-request-fragmentation-0.5.1
	execSync(`(set -e
               git_checkout() {
                   echo "$1 $2"
                   cd ${juliaPackageDir}/${JULIA_VERSION}/$1
                   [ \`git describe --tags\` == $2 ] || (git fetch origin && git checkout $2)
               }

               # Call git_checkout when a specific override is needed.
               git_checkout Compat v0.65.0
               git_checkout HTTP release-0.6
               #git_checkout MbedTLS 0.6
               cd ${juliaPackageDir}/${JULIA_VERSION}/ClusterManagers
               rev=\`git rev-parse --abbrev-ref HEAD\`
               [ \${rev} == "elastic-accept-race-condition" ] || ( set +e; git remote remove conning; set -e; git remote add -f conning https://github.com/Conning/ClusterManagers.jl; git checkout elastic-accept-race-condition )

               cd ${juliaPackageDir}/${JULIA_VERSION}/MbedTLS
               rev=\`git rev-parse --abbrev-ref HEAD\`
               [ \${rev} == "so/race2" ] || ( set +e; git remote remove sam; set -e; git remote add -f sam https://github.com/samoconnor/MbedTLS.jl; git checkout so/race2; ${JULIA} -e 'Pkg.build("MbedTLS")'; )

               cd ${juliaPackageDir}/${JULIA_VERSION}/Diana
               rev=\`git rev-parse --abbrev-ref HEAD\`
               [ \${rev} == "merge_1.0_from_github" ] || ( set +e; git remote remove conning; set -e; git remote add -f conning https://github.com/Conning/Diana.jl; git checkout merge_1.0_from_github )

               cd ${juliaPackageDir}/${JULIA_VERSION}/Requests
               rev=\`git rev-parse --abbrev-ref HEAD\`
               [ \${rev} == "reduce-request-fragmentation-0.5.1" ] || ( set +e; git remote remove conning; set -e; git remote add -f conning https://github.com/Conning/Requests.jl; git checkout reduce-request-fragmentation-0.5.1 )
              )`, execOptions);
	execSync(`${JULIA} -e 'Pkg.resolve()'`, execOptions);

	// TODO: Verify that we have the right version of hdf5 that works with Julia v0.6
	//  (workaround)
	// brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/6399811a11177b509ebd59d9cdeb1a8fea23f143/Formula/hdf5.rb
	// cd /path/to/advise/.julia/v0.6/Homebrew/deps/usr/lib
	// cp /usr/local/Cellar/hdf5/1.10.2_1/lib/libhdf5.101.dylib .
	// ln -s libhdf5.101.dylib libhdf5.dylib
}

gulp.task(juliaTasks.start, (done) => {
	const docker = argv.d != null || argv.docker != null;
	const watchJulia = argv.watch != null;
	const clean = argv.clean != null;
	const noScreen = argv.noScreen != null;
	const compile = argv.compile != null;
	const interactive = argv.i != null || argv.interactive != null;
	const auth = argv.auth ? argv.auth : true;

	let juliaPackageDir = JULIA_PACKAGE_DIR;
	let execOptions = defaultExecOptions;
	if (docker) {
		juliaPackageDir = `/root/.julia`;
		execOptions = {env: {...process.env, 'JULIA_PKGDIR': juliaPackageDir}}
	}

	const precompiledLib = `${juliaPackageDir}/libADVISE.dylib`;

	// if (clean) {
	// 	fs.existsSync(precompiledLib) && fs.unlink(precompiledLib, () => {
	// 	});
	// }

	// if (compile) {
	// 	var libModifiedTime = fs.existsSync(precompiledLib)
	// 	                      ? fs.statSync(precompiledLib).mtimeMs : 0;

	// 	var runCompile = libModifiedTime == 0;
	// 	if (!runCompile) {
	// 		for (var f of globule.find('${baseUrl}/**/REQUIRE')) {
	// 			if (fs.statSync(f).mtimeMs > libModifiedTime) {
	// 				console.log(`${f} is newer than compiled julia output.  Recompiling...`);
	// 				runCompile = true;
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	if (!runCompile) {
	// 		for (var f of globule.find('${baseUrl}/**/src/**/*.jl')) {
	// 			if (fs.statSync(f).mtimeMs > libModifiedTime) {
	// 				console.log(`${f} is newer than compiled julia output.  Recompiling...`);
	// 				runCompile = true;
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	if (!runCompile) {
	// 		log.banner("Skipping precompile due to no newer julia files.")
	// 	}

	// 	if (runCompile) {
	// 		libModifiedTime == 0 && packageUpdate(juliaPackageDir, execOptions);

	// 		staticCompile();
	// 	}
	// }
	// else {
	// 	packageUpdate(juliaPackageDir, execOptions);
	// }


	let watchInterval = docker ? 5000 : 2000;
	let juliaServer;
	let triggeringExit = false;

	function startJuliaServer() {

		// Create directories to hold object store data
		// TODO - move this cleanup to julia
		try {
			log.banner("Starting ADVISE REST Server...")
			// "QueryClient.jl/src/register_simulation.jl",
			let apps = 'master ResourceInventory RestApi FileExporterServer FileUploaderServer';

			if (process.env['CLOUDMANAGER_STACK_NAME'] != null) {
				apps = apps + ' LogForwarder WindowsEC2Manager';
			}
			else if (process.env['LOG_GROUP'] != null) {
				apps = apps + ' LogForwarder';
			}

			juliaServer = execJulia('applications/ADVISE/src/run_advise.jl', apps,
			                        {async: true, interactive: interactive, auth: auth, pkgdir: juliaPackageDir},
			                        _.merge(execOptions, {
				                        env: {
					                        SIMULATION_DATA_S3_BUCKET: DEFAULT_S3_BUCKET_NAME,
					                        ADVISE_STANDALONE_CLIENT: 1,
					                        USE_GRAPHQL:              1,
					                        JULIA_NO_SCREEN:          noScreen ? "1" : "0",
					                        AUTH0_REST_CLIENT_ID,
					                        AUTH0_TENANT_DOMAIN:      AUTH0_DOMAIN,
					                        AUTH_DOMAIN:              AUTH0_DOMAIN,
					                        AUTH0_REST_CLIENT_SECRET,
											JULIA_DOTNET_SHARED_SECRET:AUTH0_REST_CLIENT_SECRET,
											DOTNET_HOST:			  "advise.test:5000",
											JULIA_PROJECT:            "./julia/applications/ADVISE",
											I18N_DEVELOPMENT:         1
				                        }
			                        }));

			juliaServer.on('exit', (code, signal) => {
				console.log(`Julia exited:  code = ${code}, signal = ${signal}`)
				if (triggeringExit) {
					triggeringExit = false;
				}
				else {
					process.exit(code);
				}
			})

		} catch (err) {
			console.log("Error starting Julia server:")
			console.error(err)
		}
		//done();
	}

	let killHandle = null;

	if (watchJulia) {
		gulp.watch(`${baseUrl}/**/REQUIRE`, {interval: watchInterval}, (change) => {
			packageUpdate();
		});

		gulp.watch(`${baseUrl}/**/src/**/*.jl`, {interval: watchInterval}, (change) => {
			console.log('Julia REST API Source changed...')

			if (killHandle) {
				clearTimeout(killHandle);
			}

			let restartHandle = null;
			killHandle = setTimeout(() => {
				if (juliaServer) {
					log.banner("Killing existing Julia Server...", 'top')
					try {
						triggeringExit = true;
						juliaServer.on('exit', (code, signal) => {
							console.log('Julia has exited.  Restarting...');

							if (compile) {
								console.log(`Recompiling ${precompiledLib}...`);
								staticCompile();
							}

							startJuliaServer();
						});

						juliaServer.kill('SIGTERM');
						juliaServer = null;
					}
					catch (err) {
						console.error(err)
					}
				}

				// if (restartHandle) clearTimeout(restartHandle);
				//
				// restartHandle = setTimeout(() => {
				//     log.banner("Restarting Julia...", 'top')
				//     startJuliaServer();
				//     killHandle    = null;
				//     restartHandle = null;
				// }, KILL_JULIA_SERVER_TIMEOUT)
			});
		})
	}

	startJuliaServer();
})

/* Julia Test Suite Setup */
let testSuites = [
	{
		name:  'Query',
		repos: ['apps/QueryTool/SimulationServer.jl', 'apps/REST/QueryClient.jl', 'apps/QueryTool/QuerySetup.jl'],
		tests: ['apps/QueryTool/QuerySetup.jl/test/RunData.jl'] //, 'SimulationServer.jl/test/RunAll.jl']
	}
].map(s => ({
	...s,
	task: `${task}:test:${s.name}`
}))

// Register Julia test tasks when applicable
testSuites.forEach(suite => {
	gulp.task(suite.task, false, (done) => {
		console.log(`Running Test Suite:  '${suite.name}'`);
		suite.tests.forEach(test => {
			console.log(`   Executing test script: '${test}'...`)
			execJulia(test, '', {auth: false, pkgdir: JULIA_PACKAGE_DIR}, defaultExecOptions);
		})
		done();
	});
});

gulp.task(juliaTasks.watchTests, () => {
	let testTasks = [];

	testSuites.forEach(suite => {
		let globs = suite.repos.map(repo => {
			return `julia/${repo}/src/**/*.jl`;
		});

		console.log(`Watching ${JSON.stringify(globs)} for changes...`)
		gulp.watch(globs, [suite.task]);

		testTasks.push(suite.task);
	});

	runSequence(testTasks)
});
