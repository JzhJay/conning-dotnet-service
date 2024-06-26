import * as gaAnalytics from 'react-ga';
import {EventArgs, TrackerNames} from 'react-ga';
import * as Raven from 'raven-js';
import {get as _get} from 'lodash';

const GA_TRACKING_ID = 'UA-8212728-18';  // https://analytics.google.com/analytics/web/#embed/report-home/a8212728w157756716p159219947/
const ENABLE_TRACKING = !DEV_BUILD && !_get(window, ['conning', 'globals', 'isOnPrem'], false);
class Analytics {
	static initialize() {
		return ENABLE_TRACKING && gaAnalytics.initialize(GA_TRACKING_ID)
	}

	static pageview(path: string, trackerNames?: TrackerNames, title?: string) {
		return ENABLE_TRACKING && gaAnalytics.pageview(path, trackerNames, title);
	}

	static event(args: EventArgs, trackerNames?: TrackerNames) {
		return ENABLE_TRACKING && gaAnalytics.event(args, trackerNames);
	}
}

if (ENABLE_TRACKING && window.conning.globals.sentryDsn) {
	Raven.config(window.conning.globals.sentryDsn, {autoBreadcrumbs: true}).install()
	Raven.setTagsContext({
		environment: NODE_ENV,
	});
}

class ErrorTracking {
	static captureException(ex, context) {
		return ENABLE_TRACKING && window.conning.globals.sentryDsn && Raven.captureException(ex, {
			extra: context
		});
	}

	static setUserContext(context: {email: string, username: string}) {
		return ENABLE_TRACKING && Raven.setUserContext(context);
	}
}

export {Analytics, ErrorTracking}