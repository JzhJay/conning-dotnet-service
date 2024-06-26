export * from './webpack.options'
export fs from 'fs';
export webpack from 'webpack';
export gulp from 'gulp';
export * from './logging';
export const runSequence = require('run-sequence');
export globule from 'globule';
//const browserSync = require('browser-sync').create();
export os from 'os';

const argv = require('yargs').argv;

export {argv};

export childProcess from 'child_process';

export * as _ from 'lodash';

import childProcess from 'child_process';

const SHELL = '/bin/bash'
// https://nodejs.org/api/child_process.html
export function execSync(cmd, options) {
    console.log(`Executing task '${cmd}'...and waiting for exit.`)
    try {
        return childProcess.execSync(cmd, {shell: SHELL,  stdio: 'inherit', ...options});
    }
    catch (err) {
        console.error(`${cmd} caused an error`);
        throw err;
    }
}

export function execAsync(cmd, options) {
    console.log(`Spawning task:  '${cmd}'...`)
    try {
        return childProcess.spawn(cmd, {shell: SHELL,  stdio: 'inherit', ...options});
    }
    catch (err) {
        console.error(`${cmd} caused an error`);
        throw err;
    }
}

import fs from 'fs';
import util from 'util';

export function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        console.log(`Deleting '${path}'...`)

        fs.readdirSync(path).forEach(function (file, index) {
            let curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
    else {
        console.log(`Nothing to do.  '${path}' does not exist to delete.`)
    }
}
