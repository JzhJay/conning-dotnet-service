import {determineJuliaHost} from './shared';
import { observable, computed, action, autorun, reaction, makeObservable } from 'mobx';
import {localStorageKeys} from 'stores/site/constants';
import {utility, xhr, routing, simulationStore, queryStore, site, reportStore, queryResultStore, omdb, slugs} from 'stores'
import {user} from '../user'; // Breaks at runtime if you combine with stores import
const {settings} = user;
import {Intent} from '@blueprintjs/core'

export type JuliaColor = 'bold' | 'normal' | 'red' | 'green' | 'blue' | 'yellow' | 'black' | 'white' | 'magenta' | 'cyan';

export class JuliaApiStore {
    @observable hostname = determineJuliaHost().host;

    constructor() {
        makeObservable(this);
    }

    @computed get https() { return (PLATFORM == 'client' && window.location.protocol == "https:") || _.endsWith(this.hostname, '.advise-conning.com') || _.endsWith(this.hostname, '.advise.conning.com')}

    @computed
	get url() {
		let protocol = this.https ? "https" : "http";
		return `${protocol}://${this.hostname}/julia`;
	}

    @observable private _connected = true;
	@computed get connected() {
		return this._connected;
	}
	set connected(status) {
		action(() => this._connected = status)();
	}

    get recentHosts() {
		return settings.julia.recentHosts
	}

    set recentHosts(val) {
		settings.julia.recentHosts = val
	}

    @observable _version;

    @action
	async loadAbout() {
		try {
			return await xhr.get(`${this.url}/about`);
		}
		catch (err) {
			throw err;
		}
	}

    @action
	async loadVersion() {
		try {
			return await xhr.get(`${this.url}/v1/version`);
		}
		catch (err) {
			throw err;
		}
	}

    @action
	reset() {
		this.connected = true;
		this.resetHostname();
	}

    @action
	resetStores(reload = true) {
		simulationStore.reset();
		queryStore.resetStore();
		queryResultStore.resetStore();
		reportStore.reset();

		reload && this.tryLoadDescriptors();
	}

    @action removeHost = (host) => {
		this.recentHosts = this.recentHosts.filter(h => h != host);
		if (this.hostname === host) {
			this.overrideHost(_.first(this.recentHosts));
		}
	}

    private websocketPort = 8003;
    private socket: WebSocket;

    navigatedToErrorPage     = false;
    @observable disconnected = false;

    onConnected = () => {
		if (this.attemptingToConnectToastKey) {
			site.toaster.dismiss(this.attemptingToConnectToastKey);
			this.attemptingToConnectToastKey = null;
		}

		if (this.navigatedToErrorPage) {
			this.navigatedToErrorPage = false;
			routing.push(routing.urls.home);
		}

		if (this.disconnected) {
			this.disconnected = false;
			site.toaster.show({icon: "cloud", timeout: 10000, message: `Reconnected to ${site.productName}}`, intent: Intent.SUCCESS})
		}
	}

    @action onDisconnected = (raiseErrorEvenIfDisconnected = false) => {
		if (this.attemptingToConnectToastKey) {
			site.toaster.dismiss(this.attemptingToConnectToastKey);
			this.attemptingToConnectToastKey = null;
		}

		this.disconnected = true;

		if (this.connected || raiseErrorEvenIfDisconnected) {
			this.connected = false;
			//site.errors.clear();
			site.raiseError(new Error(`Unable to connect to the ${site.productName} Julia backend.\n'${julia.url}' may be down.`), 'julia', `Unable to contact ${julia.hostname}`);

			//routing.push(routing.urls.disconnected);
			//this.navigatedToErrorPage = true;
		}
	}

    @action resetHostname() {
		let hostname;
		if (PLATFORM === 'client') {
			settings.julia.host = null;
			if (window.location.hostname === 'localhost') {
				const hostInfo = determineJuliaHost(true);
				hostname       = hostInfo.host;
			}
			else {
				hostname = window.location.hostname;
			}
		}
		// Serverside
		else if (hostname == null) {
			hostname = 'localhost';
		}

		this.hostname  = hostname;
		this.connected = true;
	}

    @action overrideHost = (host?: string) => {
		if (PLATFORM === 'client') {
			if (host != null) {
				settings.julia.host = host;
			}
			else {
				settings.julia.host = null;
				if (window.location.hostname === 'localhost' || window.location.hostname === 'advise.test') {
					const hostInfo = determineJuliaHost(true);
					host           = hostInfo.host;
				}
				else {
					host = window.location.hostname;
				}
			}
		}
		// Serverside
		else if (host == null) {
			host = 'localhost';
		}

		this.hostname  = host;
		this.connected = true;
	}

    clearConsole = async () => {
		await xhr.post(`${this.url}/dev-only/console/clear`);
	}

    print = async (text: string, color?: JuliaColor) => {
		//console.log(`Julia:  ${line}`);
		// print_with_color doesn't add a newline

		await xhr.post(`${this.url}/dev-only/console/print`, {text: text, color: color}).catch(reason => {
			console.log(`trying sand message to the julia console. but failed. (${text})`);
			console.log(JSON.stringify(reason));
		});
		//this.socket.send(JSON.stringify({action: 'println', line: line}));
	}

    clearLocalTables = async () => {
		await xhr.get(`${this.url}/v1/cleanupTables`);
	}

    attemptingToConnectToastKey: string;

    get settings() { return settings.julia }

    tryLoadDescriptors = async () => {
		const wasConnected = this.connected;

		try {
			//api.site.busy = true;

			if (this.settings.disabled) {
				return;
			}

			if (!this.connected) {
				site.toaster.clear();
				this.attemptingToConnectToastKey = site.toaster.show({icon: "cloud", timeout: 10000, message: `Attempting to reconnect to ${site.productName}...`, intent: Intent.PRIMARY})
			}

			if (user.isLoggedIn) {
				await user.loadLicense();
				await omdb.startup();
				await user.loadDescriptors();

			}

			this.onConnected();
		}
		catch (err) {
			console.error("Error loading descriptors", err)
			//console.error(err);
			//this.onDisconnected(!wasConnected);
		}
		finally {
			//api.site.busy = false;
		}
	}

    isJuliaUrl = (url: string) => {
		return url.startsWith(this.url)
	}

    @computed get installerUrl() {
		return `${this.url}/v1/software/${user.customerName}`;
	}

    @action downloadInstaller = (version?:string) => {
		if (!user.isLoggedIn) {
			throw new Error("You must be logged in to access the installer");
		}

		utility.downloadFile(xhr.createAuthUrl(`${this.installerUrl}/installer${version?`/${version}`:''}`), false);
	}
}

export const julia = new JuliaApiStore();

