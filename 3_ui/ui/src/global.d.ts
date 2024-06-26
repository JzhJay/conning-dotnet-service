/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/index.d.ts" />
/// <reference path="./components/semantic-ui/semantic-ui.d.ts" />

/// <reference path="./lib/wijmo/controls/wijmo.d.ts" />
/// <reference path="./lib/wijmo/controls/wijmo.input.d.ts" />
/// <reference path="./lib/wijmo/controls/wijmo.grid.d.ts" />
/// <reference path="./lib/wijmo/interop/react/wijmo.react.d.ts" />

declare const karma; // : Karma;

// All of these are set by webpack.config.js
declare const VERSION;
declare const NODE_ENV: 'debug' | 'production';
declare const SPRINT;
declare const IS_PROD;
//declare let JULIA_SERVER_INFO : JuliaServerInfo;
declare const BUILD_USER;
declare const GIT_BRANCH;
declare const GIT_COMMIT;
declare const PLATFORM: 'client' | 'server';
declare const SHOW_ERROR_NOTIFICATIONS: string;
declare const KARMA: boolean;
declare const CDN: boolean;
declare const ADVISE_JULIA_SERVER : string | undefined;
declare const ADVISE_HORIZON_SERVER : string | undefined;
declare const CONSOLE_NOTIFY: boolean;
declare const BUILD_PLATFORM: string | 'darwin';
declare const DEV_BUILD: boolean;
declare const BUILD_DIRECTORY: string | undefined; // Only set for karma
declare const DEV_DOCS: boolean;
declare const JIRA: boolean; // try to ask for jira info from local api?
declare const BUILD_UTC_TIME: string;

declare module '*.css' {
    const classes: any;
    export = classes;
}

declare module '*.graphql' {
	import {DocumentNode} from 'graphql';
	const e: DocumentNode;
	export = e;
}

declare module "*.json" {
	const value: any;
	export default value;
}

declare module "*.graphql" {
	const value: any;
	export default value;
}

declare const uuid: {v4()};

interface String {
    capitalize(): string;
	startsWith(value: string) : boolean;
}

interface IRange {
    from: number,
    to: number
}

interface JuliaServerInfo {
    instance: string;
    host: string;
    url: string;
}

interface Console {
    table(...args: any[]);
}

interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

interface Window {
	devToolsExtension?: Function;
    process?: any;
    previousUrl?: string;
    kuiStore?: any;
    api?: any;
    conning?: {globals: ConningGlobals};

    // From CDN/UMD
	auth0: auth0
	Auth0Lock: Auth0LockStatic;
	Push?: Push;
	$RefreshReg$?: Function;
	$RefreshSig$?: Function;
}

interface ConningGlobals {
	authProvider: string;
	authClientId?: string;
	authDomain?: string;
	sentryServerDsn?: string;
	sentryDsn?: string;
	product?: string; // Default shown when user is not logged and in url
	features?: {
		classic?: boolean,
	//	omdb?: boolean,
		billing?: boolean;
	}
}

interface Math {
    trunc(n: number);
}

declare module __React {
    interface DOMAttributes {
        _grid?: any;
    }

    interface HTMLAttributes {
        'data-tip'?: boolean | string;
        'data-for'?: string;
    }
}

interface Window {
    mozRequestAnimationFrame?: any;
//    webkitRequestAnimationFrame?: any;
    mozCancelAnimationFrame;
//    webkitCancelAnimationFrame;
}

interface JQueryStatic {
    QueryString: any;
    popup();
}

interface ConningGlobals {
	authClientId?: string;
	authDomain?: string;
	sentryServerDsn?: string;
	sentryDsn?: string;
}

interface Window {
	__karma__;
	mocha: Mocha;
	waitingTests: number;
	conning?: {globals: ConningGlobals};
}

interface Array<T> {
	move(oldIndex: number, newIndex: number);
}

interface HtmlElement {
	react: React.ReactElement;
}