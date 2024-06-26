import {Intent} from '@blueprintjs/core';
import {action, makeObservable, observable} from 'mobx';
import {site, xhr} from 'stores';

export interface BaseEventSourceOptions {
	url: string;
	retryTime?: number;
	onMessage: (event) => Promise<void>;
	onConnect?: () => void;
	onError?: (event) => void;
}

export class BaseEventSource {
    eventSourceUrl: string = '';
    es: EventSource = null;
    retryTime: number = null;
	_timer: number = null;
	lastErrorTime: number = 0;
	onMessage: (event) => Promise<void> = null;
	onConnect: () => void = null;
	onErrorCb: (event) => void;
	failureCount: { [url: string]: number } = {};
	maxRetryTime = 10;
	toastKey: string = null;

	@observable isConnected = true;

	constructor({ url, retryTime = 1_000, onMessage, onConnect, onError } : BaseEventSourceOptions) {
		makeObservable(this);

		this.eventSourceUrl = url;
		this.retryTime = retryTime;
		this.onMessage = onMessage;
		this.onConnect = onConnect;
		this.onErrorCb = onError;

        this.hookEventSource();
    }

    hookEventSource = () => {
        try {
            if (this.es) {
                this.es.close();
            }

			if (this.onConnect) {
				this.onConnect();
			}
			
            const es = this.es = new EventSource(this.eventSourceUrl);
            es.onmessage = this.onMessage;
            es.onerror = this.onError;
        }
        catch (err) {
            site.raiseError(err);
        }
    }

	getStatusCode = (url: string) => {
		return new Promise((accept, reject) => {
			const req              = new XMLHttpRequest();
			req.onreadystatechange = function () {
				// Get the status code as soon as headers are received (readyState 2 is HEADERS_RECEIVED)
				// This will avoid issues/ long delays where the connection is kept open because the back-end is sending a stream (text/event-stream)
				if (this.readyState == 2) {
					accept(this.status);
				}
			};

			req.onerror = function (ev) {
				reject(ev);
			};

			req.ontimeout = function (ev) {
				console.log("getStatusCode timeout")
				reject(ev);
			};

			req.open("GET", url, true);
			req.timeout = 10 * 1000;
			req.send();
		})
	}

    onError = async (event) => {
		if (this.onErrorCb) {
			const currentEventSourceUrl = this.eventSourceUrl;
			this.onErrorCb(event);
			if (currentEventSourceUrl !== this.eventSourceUrl) { // access token may already change
				Reflect.deleteProperty(this.failureCount, currentEventSourceUrl);
			}
		}

		// Make a GET request to verify that there are no errors and retrieve the http code.
	    let statusCode;
	    try {
			statusCode = await this.getStatusCode(this.eventSourceUrl);
			console.log("Status code: ", statusCode);
	    }
		catch (e) {
			statusCode = null;
			console.log("getStatusCode exception")
	    }

		if (statusCode == 401) {
			this.showAndThrowError("Could not authenticate SSE connection");
		}
		else if (statusCode == null) {
			// No network connection, just keep retrying until the server comes back
			this.reconnect(10_000);
		}
		else if (statusCode != 200) {
			const { eventSourceUrl } = this;
			this.failureCount[eventSourceUrl] = this.failureCount[eventSourceUrl] ? this.failureCount[eventSourceUrl] + 1 : 1;

			if (this.failureCount[eventSourceUrl] <= this.maxRetryTime)
				this.reconnect(this.retryTime);
			else
				this.showAndThrowError(`Failed to establish SSE connection`, false);
		}
		else {
			// If multiple errors are received in a small window and a GET on the url works fine, something might be wrong with the event stream so destroy and recreate.
		    if (Date.now() - this.lastErrorTime < 10 * 1000) {
			    this.reconnect(30 * 1000);
				console.warn("Reconnecting SSE connection due to rapid failure")
		    }

		    this.lastErrorTime = Date.now();

			// The ES might have closed because of an error, if it is, lets reconnect immediately
			if (this.es && this.es.readyState == this.es.CLOSED) {
				this.reconnect(0);
			}
	    }
    }

    reconnect = (timeout: number) => {
	    this.es && this.es.close();
	    this.es = null;

        // reconnect with new object
        this._timer = (setTimeout(this.hookEventSource, timeout) as any) as number;
        console.log(`Retrying status connection in ${timeout / 1000} seconds`);
    }

    dispose = () => {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        this.es && this.es.close();
        this.es = null;
		this.failureCount = {};
    }

	setEventSourceUrl(url: string) {
		this.eventSourceUrl = url;
	}

	@action showAndThrowError(error: string, showToast = true) {
		if (showToast) {
			site.toaster.dismiss(this.toastKey)
			this.toastKey = site.toaster.show({
				message: error,
				intent:  Intent.DANGER,
				timeout: 0
			})
		}
		this.isConnected = false;
		throw new Error(error);
	}
}
