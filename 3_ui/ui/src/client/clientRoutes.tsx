import {Router, Route, browserHistory, IndexRedirect, IndexRoute} from 'react-router'

export const __reactApplicationId = "react-app";

import {api, routing, user, slugs, featureToggles, julia, site, i18n} from 'stores';
import {StandaloneQueryPage, ApplicationContainer, SimulationsPage, ReportApplicationPage, UserPage, IconographyPage, ReleaseNotesPage, BillingReportPage, ObjectCatalogDemoPage, InstallerDownloadPage, SoftwareNoticesPage } from 'components';
import * as p from 'components/pages';
import { autorun, observable, IReactionDisposer, makeObservable, when } from 'mobx';
import {DUOMFAPage} from '../components/pages/auth/DUOMFA';
import {InvestmentOptimizationResultsPage} from '../components/system/IO/IOsPage';
import {UserFilesPage} from '../components/system/UserFile/UserFilesPage';
import {ClimateRiskAnalysisPage} from '../components/system/ClimateRiskAnalysis/ClimateRiskAnalysisPage';
import {LicenseUpdatePage} from '../components/system/License/LicenseUpdatePage';

import {Analytics} from './tracking';
import {OmdbAdminPage} from '../components/system/ObjectCatalog';
import {CloudWatchDemoPage} from '../components/system/CloudWatch';
import {IntlProvider, RawIntlProvider} from 'react-intl';

Analytics.initialize();

const renderElement = document.getElementsByClassName(__reactApplicationId)[0];

class WebviseApplication extends React.Component<{}, {}> {
	_disposers: IReactionDisposer[] = [];
	constructor(props, state) {
        super(props, state);

        makeObservable(this);

        (window as any).api = api;

		this._disposers.push(autorun(() => {
				if (user.cancelledLogin &&
					this.currentRouteRequiresAuth &&
					!routing.isActive(routing.urls.accessRequired)) {
					routing.push({
						pathname: routing.urls.accessRequired,
						query:    {returnUrl: window.location.toString()}
					});
				}
			}, { name: `Route to access-required if the user cancels login`})
		);
    }

	componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

	render() {
		return (
			<Router history={browserHistory} onUpdate={() => {
				const location = decodeURI(window.location.pathname) + window.location.search;
				if (routing.pathname != location) {
					routing.pathname = location;
					Analytics.pageview(routing.pathname);
				}
			}}>
				<Route path="access_token=:token" component={p.DashboardPage}/>
				<Route path={slugs.mfa} component={DUOMFAPage}/>
				<Route path="/" component={ApplicationContainer} onEnter={() => {
					this.currentRouteRequiresAuth = false
				}}>
					{/* Default Page */}

					<IndexRoute component={p.DashboardPage} onEnter={this.verifyUserAccess}/>

					<Route path={slugs.authCallback}/>

					<Route path={slugs.logout} component={p.LogoutPage}/>

					<Route path={slugs.error} component={p.ErrorReportPage}/>
					<Route path={slugs.accessRequired} component={p.AccessRequiredPage}/>

					<Route path={slugs.releaseNotes} component={ReleaseNotesPage}/>

					<Route path={slugs.softwareNotices} component={SoftwareNoticesPage} />

					<Route path={slugs.license} component={LicenseUpdatePage} />

					{/* Preferences / Administration */}
					<Route path={`${slugs.preferences}(/:tabId)`} onEnter={this.verifyUserAccess} component={p.PreferencesPage}/>
					<Route path={`${slugs.controlPanel}`} onEnter={this.verifyUserAccess} component={p.ControlPanelPage}/>


					{/* Application Pages */}
					<Route path={slugs.product} onEnter={this.verifyUserAccess}>


						{<IndexRedirect to={routing.urls.home}/>} {/* Redirect to homepage */}

						{/*<Route path={`${slugs.dashboard}`} component={p.DashboardPage}/>*/}
						{/*<Route path={`${slugs.workspace}`} component={p.WorkspacePage}/>*/}

						{/*<Route path={`${slugs.user}(/:id)`} component={UserPage}/>*/}

						<Route path={`${slugs.simulation}(/:id)`} component={SimulationsPage}/>
						<Route path={`${slugs.useCase}/:useCaseName(/:id)`} component={SimulationsPage}/>
						<Route path={`${slugs.riskNeutralSimulation}(/:id)`} component={SimulationsPage}/>

						<Route path={`${slugs.investmentOptimization}(/:id)`} component={InvestmentOptimizationResultsPage}/>

						<Route path={`${slugs.userFiles}(/:id)`} component={UserFilesPage}/>
						<Route path={`${slugs.climateRiskAnalysis}(/:id)`} component={ClimateRiskAnalysisPage}/>

						<Route path={`${slugs.report}(/:id)`} component={ReportApplicationPage}>
							<Route path={`query/:querySlotId`} component={ReportApplicationPage}/>
							<Route path={`pages/:pageId`} component={ReportApplicationPage}/>
						</Route>

						<Route path={`${slugs.standaloneQuery}(/:queryId)`} component={StandaloneQueryPage}/>

						<Route path={slugs.demo}>
							<Route path={slugs.omdb} component={ObjectCatalogDemoPage}/>
							{featureToggles.cloudwatchLogViewer && <Route path={`cloudwatch`} component={CloudWatchDemoPage}/>}
						</Route>
					</Route>

					{/*<Route path={slugs.profile} component={ProfilePage}/>*/}
					<Route path={slugs.billing} component={BillingReportPage} onEnter={this.verifyUserAccess}/>
					<Route path={slugs.installer} component={InstallerDownloadPage} onEnter={this.verifyUserAccess} />
					<Route path={`${slugs.objectSchemas}(/:objectType)`} component={OmdbAdminPage} onEnter={this.verifyUserAccess}/>

					<Route path={slugs.admin} onEnter={this.verifyUserAccess}>
						<Route path={slugs.iconography} component={IconographyPage}/>
						{/*<Route path={slugs.migrateSchema} component={MigrateSchemaPage}/>*/}
					</Route>

					<Route path="*" component={p.NotFoundPage}/>
				</Route>
			</Router>
		)
	}

	@observable currentRouteRequiresAuth = false;

	verifyUserAccess = (nextState, replace) => {
		if (KARMA) {
			return;
		}  // Always treat as authenticated

		this.currentRouteRequiresAuth = true;

		if (user.isLoggingIn) {
			this._disposers.push(
				when(() => !user.isLoggingIn, () => {
					!user.isLoggedIn && user.login();
				})
			);
			return;
		} else if (!user.isLoggedIn) {
			user.login();
		}
	}
}

import {ApolloProvider} from '@apollo/client';
import {apolloStore} from 'stores';
import {Observer} from 'mobx-react';

wijmo.setLicenseKey("Conning, Inc.,*.advise-conning.com|*.advise.test|*.conning.com|*.localhost,961899246846881#B0rHt4Q5wGTSBFb8N4ZLlzaSdkeVp4a7l5L5EWbWlGV8BHcQJXSvhmV936ct5kRXl5ZpNUVxZ5TupnbphUUMdGZtFFNkVXOZRUO6MTdmRTOLtyTjlkQEZXYCBTSrd4dDpGbERDazYUWy2WcvI4RDhzZSRFVjtSRQ5Eazk5ct3GTwNDdTdVdkl7YlF5UydXcXxkaYdURrQmRuxWM9VDR7FGbohmRnZ4RIZzM036KjdWMDNFOn5UYrVkYxBXMhJzZax4KRllN4M7UwA7ahZVY7ZlQM3UeRlHN0d7KsRnZGBDbuRTcCJncwckYihEcoFTVG9GbaxEZ9B5QyJmarBnU8okWthjcuVFUtpUVwMGcFJiOiMlIsISO6cTR8gzNiojIIJCL7gTOwgjMyUzM0IicfJye&Qf35VfiMzQwIkI0IyQiwiIlJ7bDBybtpWaXJiOi8kI1tlOiQmcQJCLiIDM5QzMwACOxgDMxIDMyIiOiQncDJCLiQ7cvhGbhN6bs9iKs46bj9yZulmbu36YuoCL4NXZ49SZzlmdkFmLqwSbvNmLn9Wau96bj5SZzlmdkFmLqIiOiMXbEJCLi8yYulEIscmbp9mbvNkI0ISYONkIsISM8gjN4gjN4ITO9gTM6kjI0ICZJJCL355W0IyZsZmIsIiM6FjMwIjI0IiclZnIsU6csFmZ0IiczRmI1pjIs9WQisnOiQkIsISP3EUealEdl3UWYlzb6wWUnZHb9t4VvJWdvpEboNVcrdne4llaiZma5F6MyNjex4WbuJ4Kxs6NrdzSxgjRwcmcLFjTOF4Yt9mvTmW")

ReactDOM.render(
	<Observer>{() =>
		<ApolloProvider client={apolloStore.client}>
			<RawIntlProvider value={i18n.intl}>
			<WebviseApplication/>
			</RawIntlProvider>
		</ApolloProvider>}
	</Observer>, renderElement);
$(renderElement).removeClass('loading');