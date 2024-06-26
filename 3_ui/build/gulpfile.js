/**
 *  Gulp Build System for Webvise (https://github.com/gulpjs/gulp)
 *
 *  `gulp help` will show you available build targets.
 *
 *  Targets:
 *      dev - Local nodeJs server, webpack-dev-server with hot-reloading enabled
 *      debug - Usually in the cloud.  For internal testing with javascript/sourcemaps
 *      prod - Release version.  Code is minified, dead code is removed, css is extracted, etc.
 *
 */
const argv = require('yargs').argv;
const _ = require('lodash')
const fs = require('fs');
const rimraf = require('rimraf');
const gulp = require('gulp-help')(require('gulp'));

import { Environments } from './webpack.options';
import './tasks';

const OUTPUT_ROOT = './dist';
// Clean out the build directory
if (!fs.existsSync(OUTPUT_ROOT)) {
    fs.mkdirSync(OUTPUT_ROOT);
}

let ENV = process.env.NODE_ENV;
if (!ENV) {
    ENV = argv.prod ? Environments.Production : Environments.Debug;

    process.env.NODE_ENV = ENV;
}

let cleanTask = (cb) => { rimraf('./dist/', {}, () => { cb() }) };
cleanTask.description = `Removes the 'build' directory.`;
gulp.task('clean', cleanTask);


