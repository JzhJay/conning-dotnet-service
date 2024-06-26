import {JuliaServerChooser} from 'components/devTools/JuliaServerChooser';
import 'styles/common'
import './mocha-overrides.css';
import {JiraIssueLink} from 'components/devTools/JiraIssueLink';

import type {JuliaColor} from 'stores';
import {api, julia, user, site, settings, xhr} from 'stores';
import {removeURLParameter} from 'utility'
import {spy} from 'mobx';
import {JULIA_TAG} from "./constants";
import * as React from 'react';

console.log('Build Directory: ', BUILD_DIRECTORY);

let karma = window.__karma__;
let mocha = window.mocha;
(window as any).React = React; // setup React as a global so libraries that need it, e.g. wijmo react, will be able to find it.

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
	console.log(errorMsg, url, lineNumber);
	return false;
}

export interface ITestable {
	describeTests?: () => void;

	setupTests?: () => void;
}

class TestScheduler {
	setupStart = () => {
		// We use the window to store the waiting test count since
		// a static counter doesn't suffice (each test includes this code and will have separate statics)
		if (window.waitingTests === undefined) {
			window.waitingTests = 0;
		}

		if (++window.waitingTests === 1)
			karma.loaded = () => {};
	}

	setupEnd = () => {
		if (--window.waitingTests === 0) {
			site.toaster.show({message: "Karma is starting via TestScheduler"})
			debugger;
			karma.start()
		}
	}

	register = (testable: ITestable) => {
		//this.setupStart();


		if (testable.setupTests) { testable.setupTests(); }

		testable.describeTests();

		//this.setupEnd();
	}

	static get isInDebugRunner() {
		return window && window.location.pathname.includes("/debug.html");
	}

	setupJiraWatcher() {
		if (!TestScheduler.isInDebugRunner) {
			return;
		}

		let lastNode = null;
		afterEach("Modify tests related to jira to include hyperlinks to the issues)", function () {
			let $link = $("li.suite > h1 > a").last();

			let match = $link.text().match(/([A-Z]+)-([0-9]+)/);
			if (match) {
				const {0: key, 1: project, 2: issue} = match;

				const rerunTestHref = $link.attr('href');

				//$link.attr('href', `https://jira.advise-conning.com/browse/${key}`);
				const $node = $(`<div class="jira-test"></div>)`).insertBefore($link)
				ReactDOM.render(<JiraIssueLink rerunTestUrl={rerunTestHref} issueId={key}/>, $node[0])

				$link.remove();
			}
		})
	}

	constructor() {
		//this.logMobxEvents();
		//this.setupJiraWatcher();
		window.api = api;

		this.modifyKarmaTestRunner()
	}

	logMobxEvents = () => {
		// if (TestScheduler.isInDebugRunner) {
		// 	spy(e => {
		// 		//console.log(e);
		// 		if (e.type === 'action' && !e.reaction) {
		// 			console.log(`      Action:  ${e.name}`)
		// 		}
		// 	})
		// }
	}

	scrollInterval;

	onAutoScrollChanged = () => {
		if (settings.karma.autoScroll) {
			this.scrollInterval = window.setInterval(() => {
				let mochaReport = $("#mocha-report").get(0)
				if (mochaReport)
					mochaReport.scrollTop = mochaReport.scrollHeight;
			}, 2000)
		}
		else {
			this.scrollInterval && window.clearInterval(this.scrollInterval);
		}
	}

	modifyKarmaTestRunner() {
		const {onAutoScrollChanged} = this;
		const _thisClass            = this;

		before(function () {
			this.timeout(10000);

			$('head').append(`<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,400,300,700" />
							  <link rel="stylesheet" href="/ui/fonts/font-awesome/css/fontawesome-all.min.css" />
							  <link rel="stylesheet" href="/ui/lib/semantic/semantic.css" />
							  <link rel="stylesheet" href="/ui/lib/blueprint/core/lib/css/blueprint.css" />
							  <link rel="stylesheet" href="/ui/lib/blueprint/icons/lib/css/blueprint-icons.css" />
							  <link rel="stylesheet" href="/ui/lib/blueprint/table/lib/css/table.css" />
							  <link rel="stylesheet" href="/ui/lib/blueprint/select/lib/css/blueprint-select.css" />
						      <link rel="stylesheet" href="/ui/lib/wijmo/wijmo.css"/>
						      <link rel="stylesheet" href="/ui/lib/wijmo/themes/wijmo.theme.office.css"/>
							  <link rel="stylesheet" href="/ui/vendors.css" />
							  <link rel="stylesheet" href="/ui/conning-ui-karma.css" />
							`);

			if (TestScheduler.isInDebugRunner) {
				$("#mocha-stats").prepend('<div id="react-header" />');
				let $reactHeader = $("#react-header")
				//ReactDOM.render(<div><JuliaServerChooser/></div>, $reactHeader[0])
				$("#react-header").append(`<input id="autoScroll" ${settings.karma.autoScroll ? 'checked' : ''} type="checkbox"> <label id="autoScrollLabel">Auto scroll</label>`);

				var toggleAutoScroll = function () {
					settings.karma.autoScroll = !settings.karma.autoScroll;

					onAutoScrollChanged();
				}

				$("#autoScroll").change(toggleAutoScroll);
				$("#autoScrollLabel").click(toggleAutoScroll);

				onAutoScrollChanged();

				/*("#react-header").append('<input id="bailOnError" type="checkbox"> <label>Stop on Error</label>');
				const $bailOnError = $("#bailOnError");
				if (window.location.search.indexOf('throwFailures=true') != -1) {
					$bailOnError.attr('checked', 'checked');
				}

				$bailOnError.change(function() {
					if (this.checked) {
						window.location.replace(`${window.location}&throwFailures=true`);
					}
					else {
						window.location.replace(removeURLParameter(window.location, 'throwFailures'));
					}
				});*/
			}
		})

		api.julia.clearConsole();
		api.julia.print(`\nStarting Unit Tests`, 'bold')

		before(async function () {
			const {currentTest} = this;
			// console.log('before', currentTest);
			// await api.julia.println(`\nSuite (Start): '${currentTest.fullTitle()}'`)
		})

		after(async function () {
			const {currentTest} = this;
			// console.log('after', currentTest);
			//await api.julia.println(`\nSuite (End): '${currentTest.fullTitle()}'`)
		})

		beforeEach(function () {
			const {currentTest, currentTest: {state}} = this;
			//console.log(currentTest);

			const oldTimeout = currentTest.timeout;

			currentTest.timeout = function (timeout) {
				if (!arguments.length) {
					return oldTimeout.apply(this, null);
				}
				const base = currentTest.fullTitle().includes(JULIA_TAG) ? 10 * 1000 : 0;
				oldTimeout.apply(this, timeout ? [timeout + base] : []);
				console.log(`set karma timeout for ${currentTest.fullTitle()}: ${timeout + base} / ${oldTimeout.apply(this, null)}`);
			}

			//currentTest.timeout(5000)
			console.log('beforeEach', currentTest.fullTitle());
			julia.print(`\n${currentTest.fullTitle()}\n`, 'bold')
		})

		afterEach(function () {
			const {currentTest} = this;
			//console.log(currentTest);

			const state = currentTest.state != null ? currentTest.state.toString() : null;

			//console.log('afterEach', state, currentTest);

			if (state && state != 'skipped') {
				let color: JuliaColor;
				if (state == 'passed') { color = 'green' }
				else if (state == 'failed') { color = 'red' }

				console.log('afterEach', currentTest.fullTitle());
				julia.print(`${state.capitalize()} - took: ${currentTest.duration}ms - timeout: ${currentTest._timeout}ms\n`, color)
			}
		})

	}

	getAccessToken = async (audience: string, usingTenantTestUser: boolean = false) => {
		const accounts = await xhr.get('/fixtures/testingAccounts.json');
		const account = usingTenantTestUser !== true ? 'WebviseTester' : 'TenantTester';
		const userName = accounts[account]['username'];
		const password = accounts[account]['password'];

		return user.authProvider.loginWithPassword(userName, password, audience);

		// Would prefer to use the auth0 webAPI but it doesn't return the user_id in the profile if the idToken is also requested which is needed by the server.
		/*(user.auth0 as any).client.login({
		realm: 'Username-Password-Authentication',
		username: 'WebviseTester@conning.com',
		password: 'ConningRS',
		scope: 'openid profile user_id'
		}, async (err, authResult) => {
		   debugger;
		   user.setAccessToken(authResult.accessToken, authResult.expiresIn);
		   user.idToken = authResult.idToken;
		   await user.loadProfile();
		   accept();
		});*/
	}

	loginTestUser = async (usingTenantTestUser: boolean = false) => {
		const authResult:any = await this.getAccessToken('https://kui/api', usingTenantTestUser);

		await user.loadProfile();
	}
}

export const testScheduler = new TestScheduler();

if (KARMA) {
	window.confirm = (message) => {
		console.log(`window.confirm(${message}`);
		return true;
	}
}