import git from 'git-rev-sync';
import {AUTH0_CLIENT_ID, AUTH0_DOMAIN} from "../constants";

export const generatedBuildConstants = () => ({
	SPRINT: JSON.stringify(process.env.SPRINT),
	VERSION: JSON.stringify(require('../../package.json').version),
	BUILD_USER: JSON.stringify(process.env.USER ? process.env.USER : process.env.username),
	BUILD_UTC_TIME: JSON.stringify(new Date().getTime()),
	GIT_BRANCH: JSON.stringify(process.env.GIT_BRANCH || git.branch()),
	GIT_COMMIT: JSON.stringify(process.env.GIT_COMMIT || git.short()),
	ADVISE_JULIA_SERVER: JSON.stringify(process.env.ADVISE_JULIA_SERVER),
});