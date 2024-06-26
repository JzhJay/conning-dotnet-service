import {computed, observable, makeObservable, action} from 'mobx';
import {RouteFor} from './RouteFor';
import {closeActiveTooltips} from 'utility'
import {slugs} from 'stores';
import {browserHistory} from 'react-router';
import LocationDescriptor = HistoryModule.LocationDescriptor;
import * as queryString from 'query-string';
import {julia} from '../julia';

export class RoutingStore {
	@computed
	get urls() {
		return {
			home:              `/${slugs.index}`,
			logout:            `/${slugs.logout}`,

			releaseNotes:      `/${slugs.releaseNotes}`,

			controlPanel:      `/${slugs.controlPanel}`,

			preferences:       `/${slugs.preferences}`,
			profile:           `/${slugs.preferences}/${slugs.profile}`,
			notifications:     `/${slugs.preferences}/${slugs.notifications}`,
			devOnly:           `/${slugs.preferences}/dev-only`,

			billing:           `/${slugs.billing}`,
			installer:         `/${slugs.installer}`,

			iconography:       `/${slugs.admin}/${slugs.iconography}`,
			reportBrowser:     `/${slugs.product}/${slugs.report}`,
			userBrowser:       `/${slugs.product}/${slugs.user}`,
			queryResult:       `/${slugs.product}/${slugs.queryResult}`,
			query:             `/${slugs.product}/${slugs.standaloneQuery}`,
			simulationBrowser: `/${slugs.product}/${slugs.simulation}`,
			riskNeutralBrowser:`/${slugs.product}/${slugs.riskNeutralSimulation}`,
			useCaseBrowser:    `/${slugs.product}/${slugs.useCase}`,
			ioRunBrowser:      `/${slugs.product}/${slugs.investmentOptimization}`,
			ioBrowser:   `/${slugs.product}/${slugs.investmentOptimization}`,
			userFileBrowser:   `/${slugs.product}/${slugs.userFiles}`,
			climateRiskAnalysisBrowser:   `/${slugs.product}/${slugs.climateRiskAnalysis}`,

			accessRequired:    `/${slugs.accessRequired}`,
			disconnected:      `/${slugs.disconnected}`,

			workspace:         `/${slugs.product}/${slugs.workspace}`,
			errorPage:         `/${slugs.error}`,

			noticesPage:	   `/${slugs.softwareNotices}`,
			objectSchemasPage:	`/${slugs.objectSchemas}`
		}
	}

	constructor() {
        makeObservable(this);
    }

	@computed get rootUrl() {
		let protocol = julia.https ? "https" : "http";
		return `${protocol}://${window.location.host}`;
	}

	get query() {
		return queryString.parse(window.location.search)
	}

	@observable private _pathname = window.location.pathname + window.location.search;
	@computed get pathname() {
		return this._pathname;
	}
	set pathname(pathname) {
		action( ()=> this._pathname = pathname)();
	}

	routeFor = new RouteFor(this);

	replace = (url: string | LocationDescriptor) => {
		browserHistory.replace(url)
	}

	get history(): ReactRouter.History { return browserHistory }

	push = (url: string | LocationDescriptor, delay = 0) => {
		if (this.pathname !== url) {
			const f = () => {
				browserHistory.push(url);
				closeActiveTooltips();
			}

			if (delay > 0) {
				setTimeout(f, delay);
			} else {
				f();
			}
		}
	}

	// Are we currently in this page or a subtree thereof?
	isActive(pathname: string, allowPartial = true) {
		const startsWith = this.pathname.startsWith(pathname);

		if (!startsWith) return false;
		else if (this.pathname.length == pathname.length) { return true }
		else {
			const nextChar = this.pathname[pathname.length];
			if (nextChar == '?'
				|| (allowPartial && (nextChar == '/' || pathname.endsWith('/')))) {
				return true
			}
		}

		return false;
	}
}

export const routing = new RoutingStore();