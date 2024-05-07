import {SuperAgent, Response} from 'superagent';
import {julia} from './julia'
import {site} from './site';
import {user} from './user';
import {reaction, observable} from 'mobx';
import {Intent} from '@blueprintjs/core'
import {i18n} from 'stores';

export interface SuperAgentOptions {
	timeout?: boolean | number;
}

interface RequestError extends Error {
	url?: string;
	method?: 'GET' | 'OPTIONS' | 'POST' | 'PUT' | 'DELETE';
	response?: Response;
	crossDomain: boolean;
}

interface JuliaError {
	backtrace: string[];
	message: string;
}

interface TimeoutRetry {
	limit: number;
	count: number;
	isTimeoutRetry?: boolean;
}

interface XhrAgentOptions extends SuperAgentOptions {
	shouldAddToken?: boolean;
}

const SERVER_TIMEOUT_RETRY_LIMIT = 5;

const API_LAST_ACCESS = "api_last_access";

export class SuperAgentWrapper {
	superAgent: SuperAgent<any>;
	defaultTimeout = 5000;
	lastNetworkActivity = null;

	constructor() {
		this.superAgent = require('superagent') as any;

		if (PLATFORM === 'client') {
			const ISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

			// @ts-ignore superagent's types definition cannot recognize parse
			this.superAgent.parse['application/json'] = text => JSON.parse(text, (key, value) => {
				if (typeof value === 'string' && ISO.test(value)) {
					return new Date(value)
				}
				return value
			})
		}
	}

	_registeredAuthReaction = false;

	registerAuthReaction() {
		if (!this._registeredAuthReaction) {
			reaction(() => user.accessToken, () => {
				// Trigger/resume blocked requests when we have a valid access token.
				if (user.accessToken) {
					this.preAuthRequestTriggers.forEach((r) => r());
					this.preAuthRequestTriggers.length = 0;
				}
			})
			this._registeredAuthReaction = true;
		}
	}

	preAuthRequestTriggers = [];

	get lastAccess() {
		return parseInt(localStorage.getItem(API_LAST_ACCESS));
	}

	set lastAccess(value) {
		localStorage.setItem(API_LAST_ACCESS, JSON.stringify(value))
	}

	addHeaders = async (agent, options?: XhrAgentOptions) => {
		//agent = agent.set({'Access-Control-Expose-Headers': `link`});

		let shouldAddToken = agent.url.startsWith(julia.url) || agent.url.startsWith(window.location.origin)
		if (options && typeof options["shouldAddToken"] === 'boolean') {
			shouldAddToken = options["shouldAddToken"];
		}

		// Block requests until we have a valid access token
		if (user.accessToken == null && shouldAddToken) {
			this.registerAuthReaction()
			await new Promise((accept) => this.preAuthRequestTriggers.push(accept));
		}

		if (agent.url.startsWith(julia.url)) {
			agent.set({[user.LOCALE]: "en-TEST"});
			agent.set({[user.LANGUAGE]: user?.language || 'en-TEST'});
		}
		
		const token = user.accessToken;

		if (token && shouldAddToken) {
			user.validationId && agent.set({[user.VALIDATION_ID]: user.validationId})
			this.lastAccess = Date.now();
			this.lastNetworkActivity = Date.now();

			// Wrap agent in an object to allows this function to be thenable without triggering the request.
			// Without the wrapper doing await addHeaders(agent) would trigger the request
			return {agent: agent.set({Authorization: `Bearer ${token}`})};
		}
		else if (!KARMA && PLATFORM !== 'server' && shouldAddToken) {
			//throw new Error("Julia may not be called by a non-authenticated user.");
			// TODO - Julia should handle rights here, not us.
		}

		return {agent};
	}

	isPrematureTimeout = (error: RequestError | any, requestTime: number) => {
		// Gateway Timeouts (504s) should always take at least 60 seconds.
		// There seems to be a configuration issue that causes requests to sometimes timeout prematurely in less than 10 seconds.
		// When this happens the request doesn't actually make it to the back-end and can be safely retried.
		const requestDuration = Date.now() - requestTime;
		const isPremature = error.status == 504 && (requestDuration < 60 * 1000);
		isPremature && console.warn(`Encountered Premature Timeout. Request duration: ${requestDuration}` );
		return isPremature;
	}

	handleError = (error: RequestError | any, retry: (TimeoutRetry) => any, timeoutRetry?: TimeoutRetry) => {
		const {response} = error;  // Only exists if not-crossdomain

		const url    = error.crossDomain ? error.url : response ? response.req.url : 'unknown';
		const status = error.crossDomain ? 502 : response ? response.status : null;

		if (error.status == 200 && error.parse) {
			// Eat this error for now - these happen when reading from the .NET server and then the server cancels (I think).  It's a json parse error.
			return;
		}

		if (julia.isJuliaUrl(url)) {
			// Julia error

			let _timeoutRetry: TimeoutRetry;
			if (timeoutRetry == null) {
				_timeoutRetry = {limit: SERVER_TIMEOUT_RETRY_LIMIT, count: 0};
			} else if (typeof (timeoutRetry) == "number") {
				_timeoutRetry = {limit: timeoutRetry, count: 0};
			} else {
				_timeoutRetry = Object.assign({}, timeoutRetry);
			}

			if ((error.status == 504 || error.status == 408) && _timeoutRetry.limit > _timeoutRetry.count ) {
				_timeoutRetry.isTimeoutRetry = true;
				_timeoutRetry.count++;
				console.log(`Server timeout, retry(${_timeoutRetry.count}/${_timeoutRetry.limit})`);
				return retry(_timeoutRetry);
			}
			// Timeout or server name not resolved
			if (status === 502) {
				try {
					julia.onDisconnected();
				}
				finally {
					throw new Error(`Julia is not responding to requests, it is likely not started or is in a failed state\n${url}`);
				}

			}
			else if (status === 500 && response.text) {
				const parsedError: JuliaError = JSON.parse(response.text) as JuliaError;
				{DEV_BUILD && console.error(parsedError.message, parsedError.backtrace ? parsedError.backtrace.join('\n') : null); }

				site.raiseError(error, 'julia', parsedError);

				if (PLATFORM === 'client') {
					site.toaster.show({
						message: `${site.productName} has encountered a problem. Check '${url}' is available and try again.`,
						action:  !IS_PROD && {
							text:    'retry',
							onClick: () => {
								retry({limit: _timeoutRetry.limit, count: 0});
							}
						},
						intent:  Intent.DANGER,
						timeout: IS_PROD ? 5000 : 0
					});
				}
			}
			else if (status !== 404 && status !== 406) {
				site.raiseError(error, 'julia');
			}
			else {
				// The error should be caught elsewhere
			}
		}
		else {
			if (status === 500 && response && response.body && response.body.message) {
				throw new Error(response.body.message);
			}
			// The error should be caught elsewhere
			// site.raiseError(error);
		}

		//console.error('Error handler!', error)

		throw error;
	}

	storeValidationID(r) {
		const requestValidationId = r.header[user.VALIDATION_ID.toLowerCase()];

		// Only set when present. E.g. not present for requests to .NET
		if (requestValidationId != null)
			user.validationId = requestValidationId;
	}

	/**
	 * Returns a url that can be used with links to correctly authenticate requests.
	 * This link provides the validation id for the JWT which should be sent in the header(cookie) to the server
	 * access token can be included when the url is not visible to the user and can be safe guarded against logging.
	 * @returns {string}
	 */
	createAuthUrl(url: string, useAccessToken=false) {
		const delim = url.includes("?") ? "&" : "?"
		return url + delim + user.VALIDATION_ID + "=" + user.validationId + (useAccessToken ? `&accessToken=${user.accessToken}` : "");
	}

	get = async <T>(url: string, options?: XhrAgentOptions, responseType?:string, fullResponse?: boolean, timeoutRetry?: TimeoutRetry): Promise<T> => {
		let agent = this.superAgent.get(url);
		if (responseType)
			agent.responseType(responseType);

		agent = (await this.addHeaders(agent, options)).agent;

		if (options) {
			if (options.timeout === true) {
				agent = agent.timeout(this.defaultTimeout);
			}
			else if (options.timeout) {
				agent = agent.timeout(options.timeout);
			}
		}

		const retry = async (tr: TimeoutRetry) => {
			return await this.get(url, options, responseType, tr.isTimeoutRetry ? true : fullResponse, tr);
		}

		return agent.catch(err => this.handleError( err, retry, timeoutRetry))
			.then(r => {
				if (julia.isJuliaUrl(url)) { julia.connected = true; }
				this.storeValidationID(r);
				return fullResponse ? r : r.body as T;
			});
	}

	post = async <T>(url: string, payload?: any, options: {fullResponse?: boolean, allowRetry?: boolean, timeoutRetry?: TimeoutRetry, responseType?: string, shouldAddToken?: boolean} = {allowRetry: false}): Promise<T> => {
		const {responseType, fullResponse, timeoutRetry, allowRetry} = options;

		const retry = async (tr: TimeoutRetry) => {
			return await this.post(url, payload, { allowRetry, fullResponse: tr.isTimeoutRetry ? true : fullResponse,  timeoutRetry: tr });
		}

		let agent = this.superAgent.post(url);

		if (responseType)
			agent.responseType(responseType);

		agent = (await this.addHeaders(agent, options)).agent;

		const requestTime = Date.now();
		return agent.send(payload)
			.catch(err => this.handleError(err, retry, (allowRetry || this.isPrematureTimeout(err, requestTime)) ? timeoutRetry : {limit: 0, count: 0}))
			.then(r => {
				if (julia.isJuliaUrl(url)) { julia.connected = true; }
				this.storeValidationID(r);
				return fullResponse ? r : r.body as T;
			});
	}

	put = async <T>(url: string, payload, fullResponse?: boolean, timeoutRetry?: TimeoutRetry): Promise<T> => {
		if (PLATFORM === 'server') {
			console.log(`put(${url})`, payload)
		}

		const retry = async (tr: TimeoutRetry) => {
			return await this.put(url, payload, tr.isTimeoutRetry ? true : fullResponse,  tr);
		}

		return (await this.addHeaders(this.superAgent.put(url))).agent
			.send(payload)
			.catch(err => this.handleError(err, retry, timeoutRetry))
			.then(r => {
				if (julia.isJuliaUrl(url)) { julia.connected = true; }
				this.storeValidationID(r);
				return fullResponse ? r : r.body as T;
			});
	}

	delete = async <T>(url, fullResponse?: boolean, timeoutRetry?: TimeoutRetry) => {
		if (PLATFORM === 'server') {
			console.log(`delete(${url})`)
		}

		const retry = async (tr: TimeoutRetry) => {
			return await this.delete(url, tr.isTimeoutRetry ? true : fullResponse,  tr);
		}

		return (await this.addHeaders(this.superAgent.del(url))).agent
			.catch(err => this.handleError(err, retry, timeoutRetry))
			.then(r => {
				if (julia.isJuliaUrl(url)) { julia.connected = true; }
				this.storeValidationID(r);
				return fullResponse ? r : r.body as T;
			});
	}

	putUntilSuccess = async <T>(url: string, initialPayload, payloadFieldNameForSubsequentRequest: string, onResponse?: (body: any, willRetry: boolean) => void, shouldCancelRetry?: () => boolean): Promise<T> => {
		let payload = initialPayload;
		let resp;
		while(true){
			resp = await (await this.addHeaders(this.superAgent.put(url))).agent
				.send(payload)
				.catch((err) => {
					return this.handleError(err, (timeoutRetry) => this.put(url, payload, true, timeoutRetry));
				});

			const shouldRetry = resp.status == 202;

			if (shouldCancelRetry && shouldCancelRetry())
				return;

			onResponse && onResponse(resp.body, shouldRetry);

			if (!shouldRetry)
				break;

			payload = { [payloadFieldNameForSubsequentRequest]: resp.body as string}
			await new Promise((accept, err) => {
				setTimeout(() => {
					accept(null);
				}, 1000);
			})
		}
		return resp.body as T;
	}

	// TODO: Factor
	postUntilSuccess = async <T>(url: string, initialPayload, payloadFieldNameForSubsequentRequest: string, onResponse?: (body: any, willRetry: boolean) => void, shouldCancelRetry?: () => boolean): Promise<T> => {
		let payload = initialPayload;
		let resp;
		while(true){
			resp = await (await this.addHeaders(this.superAgent.post(url))).agent
				.send(payload)
				.catch((err) => {
					return this.handleError(err, (timeoutRetry) => this.post(url, payload, { allowRetry: true, fullResponse: true, timeoutRetry }));
				});

			const shouldRetry = resp.status == 202;

			if (shouldCancelRetry && shouldCancelRetry())
				return;

			onResponse && onResponse(resp.body, shouldRetry);

			if (!shouldRetry)
				break;

			payload = { [payloadFieldNameForSubsequentRequest]: resp.body as string}
			await new Promise((accept, err) => {
				setTimeout(() => {
					accept(null);
				}, 1000);
			})
		}
		return resp.body as T;
	}
}

export const xhr = new SuperAgentWrapper();

export enum HTTP_STATUS_CODES {
	unauthorized        = 401,
	forbidden           = 403,
	notFound            = 404,
	notAcceptable       = 406,
	conflict            = 409,
	internalServerError = 500
}
