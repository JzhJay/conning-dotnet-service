import { localStorageKeys } from 'stores/site/constants';
import { KARMA_INSTANCE } from '../../../constants-ts';
import { user } from '../user';

const { settings } = user;

export const determineJuliaHost = (ignoreQueryString = false) => {
	let instance = window && window.location ? window.location.hostname : "advise.test";

	if (KARMA) {
		if (KARMA_INSTANCE) {
			instance = KARMA_INSTANCE;
		}
		else {
			console.error('KARMA_INSTANCE is not set!')
		}
	}
	/*else {
		if (PLATFORM === 'client' && settings.julia.host != null) {
			return { host: settings.julia.host, isGlobalOverride: true }
		}
	}*/

	let host = instance;

	if (ADVISE_JULIA_SERVER) { host = ADVISE_JULIA_SERVER }

	console.log(`Julia host: ${host}`)
	return { host: host, isGlobalOverride: ADVISE_JULIA_SERVER != null };
}
