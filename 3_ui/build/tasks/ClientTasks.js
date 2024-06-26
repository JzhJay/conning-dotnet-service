import {gulp, fs, log, webpack, statsOptions} from '../';
import { WebpackClientConfig }                          from '../config';
import getSoftwareNotices from '../whitesource/getSoftwareNotices';
import * as _ from 'lodash';

const uiDistRoot = 'dotnet/web-api/wwwroot/ui';

let whitesourceScanPath = '/ADVISE'; // for scan docker image advise-ui-test
gulp.task('whiteSourceScan', (cb) => {
	const logLevel = process.env.WHITESOURCE_LOG_LEVEL || 'error';
	const spawn = require('child_process').spawn;
	const child = spawn('java', ['-jar', 'build/whitesource/wss-unified-agent.jar', '-c', 'build/whitesource/whitesource-fs-agent.noDevDeps.config', '-logLevel', logLevel,'-d', whitesourceScanPath]);

	child.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	child.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	child.on('close', function (code) {
		cb();
	});
});

gulp.task('buildSoftwareNotices', gulp.series('whiteSourceScan', async () => {
	const scanResultPath = 'whitesource/scanProjectDetails.json';
	const outputPath = 'whitesource/softwareNotices.json';

	await getSoftwareNotices(scanResultPath, outputPath);

	gulp.src([outputPath]).pipe(gulp.dest(`${uiDistRoot}/softwareNotices`));
}));

// local development and testing for creating software notices data
gulp.task('buildSoftwareNotices:local', gulp.series((cb)=> {
	whitesourceScanPath = 'dotnet';
	cb();
}, 'buildSoftwareNotices'));

gulp.task('client:webpack', (cb) => {
	const config = new WebpackClientConfig(null, process.env.NODE_ENV);

	webpack(config).run((err, stats) => {
		log('Client built', err, stats.toString(statsOptions))
		if (err || stats.hasErrors()) {
			process.exit(1)
		} else {
			// Rename full sourcemap and create a new version with no source that can be served publicly. The full sourcemap can be saved as a build artifact in CI (TeamCity) system.
			if (config.isProd) {
				log.banner(`Generating no-source sourcemap`, 'bottom');
				let entryName = Object.keys(config.entry)[0];
				let filename = config.output.filename.replace('[name]', entryName) + ".map";
				let fullPath = config.output.path + "/" + filename;
				let content = JSON.parse(fs.readFileSync(fullPath));
				fs.renameSync(fullPath, filename + ".full");
				delete content.sourcesContent;
				fs.writeFileSync(fullPath, JSON.stringify(content));
			}
			cb();
		}
	});
});