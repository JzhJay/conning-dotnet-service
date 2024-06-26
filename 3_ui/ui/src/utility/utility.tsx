import LocationDescriptorObject = HistoryModule.LocationDescriptorObject;
import {site} from 'stores/site';
import {routing} from 'stores/routing';
import {reaction} from "mobx";
import {Intent, Icon} from '@blueprintjs/core'
import {i18n, julia as juliaStore, user, xhr} from '../stores';
import { get as _get } from 'lodash';
import { ErrorTracking } from '../client';

const fieldsToCustomTexts = {
	InvestmentOptimization: 'Allocation Optimization',
	InvestmentOptimizations: 'Allocation Optimizations' // ment optimiz
};

export const FlexGridRowDefaultHeight = 24;
export type Guid = string;

export function areEqualShallow(a, b) {
	for (const key in a) {
		if (!(key in b) || a[key] !== b[key]) {
			return false;
		}
	}
	for (const key in b) {
		if (!(key in a) || a[key] !== b[key]) {
			return false;
		}
	}
	return true;
}

export function isE2ETesting() {
	const customerName = _get(window, ['conning', 'globals', 'customerName']);
	return customerName === 'End-to-End Testing';
}

export function deepEqJSON(obj1, obj2) {
	return JSON.stringify(obj1) == JSON.stringify(obj2);
}

export function enumerateEnum(e: any) {
	return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v))
}

export function makeOpaque(colorStr) {
	return colorStr.split(",").slice(0, -1).concat("1)").join(",");
}

export function mapHexColorsToRgb(hexColors: string[]) {
	return hexColors.map(color => parseInt(color.substring(1, 3), 16) + "," + parseInt(color.substring(3, 5), 16) + "," + parseInt(color.substring(5, 7), 16));
}

export function camelTo(character, camelCased) {
	return camelCased.replace(/([a-z][A-Z])/g, function (g) {
		return g[0] + character + g[1].toLowerCase()
	});
}

export function camelToRegular(camelCased) {
	return camelCased.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase() });
}

export function formatLabelText(fieldName) {
	if (Reflect.has(fieldsToCustomTexts, fieldName)) {
		return fieldsToCustomTexts[fieldName];
	}

	return camelToRegular(fieldName);
}

export function formatNumberWithCommas(value: number, precision = 2) {
	// Taken from http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
	let formatted     = value.toFixed(precision);
	let periodIndex   = formatted.indexOf('.');
	let beforeDecimal = precision > 0 ? formatted.substring(0, periodIndex) : formatted;
	beforeDecimal     = beforeDecimal.replace(/(\d)(?=(\d{3})+$)/g, '$1,');

	return precision === 0 ? beforeDecimal : beforeDecimal + formatted.substring(periodIndex);
}

export function deletePrivateProperties(o: Object) {
	_.keys(o).forEach(key => {
		let value = o[key];

		if (key.startsWith('_')) {
			delete o[key];
		}
		else if (wijmo.isArray(value)) {
			for (let child of value) {
				deletePrivateProperties(child);
			}
		}
		else if (wijmo.isObject(value)) {
			deletePrivateProperties(value)
		}
	})
}

export function deepClone(item: any) {
	// Remove any private _ variables from what we send the backend
	let clone = _.cloneDeep(item);
	deletePrivateProperties(clone);
	return clone;
}

export function locationToUrl(location: LocationDescriptorObject): string {
	let url = location.pathname;

	if (location.query) {
		url += `?${_.join(_.map(_.keys(location.query), k => `${k}=${location.query[k]}`), '&')}`
	}

	return url;
}

export function buildURL(baseUrl: string, ...params): string {
	let url          = baseUrl + (params.length > 0 ? "?" : "");
	let argumentList = [];
	for (let p of params) {
		if ("enabled" in p && !p["enabled"]) continue;
		let key   = Object.keys(p).filter(s => s != "enabled")[0];
		let value = p[key];
		argumentList.push(key + (value != null ? "=" + value : ""));
	}
	return url + argumentList.join("&");
}

export enum KeyCode {
	Backspace = 8,
	Tab       = 9,
	Shift     = 16,
	Ctrl      = 17,
	Alt       = 18,
	Space     = 32,
	Escape    = 27,
	Enter     = 13,
	PageUp    = 33,
	PageDown  = 34,
	End       = 35,
	Home      = 36,
	Left      = 37,
	Up        = 38,
	Right     = 39,
	Down      = 40,
	Delete    = 46,
	F12       = 123,
}

export const MOUSE_LEFT_BUTTON  = 0;
export const MOUSE_RIGHT_BUTTON = 2;

export const ENTER_KEY_CODE     = 13;
export const PAGE_UP_KEY_CODE   = 33;
export const PAGE_DOWN_KEY_CODE = 34;

export const HOME_KEY_CODE       = 36;
export const END_KEY_CODE        = 35;
export const ESC_KEY_CODE        = 27;
export const UP_ARROW_KEY_CODE   = 38;
export const DOWN_ARROW_KEY_CODE = 40;
export const SPACEBAR_KEY_CODE   = 32;
export const TAB_KEY_CODE        = 9;

export const F_KEY_CODE = 70;

export function CopyProperties(source: any, target: any): void {
	for (let prop in source) {
		if (target[prop] !== undefined) {
			target[prop] = source[prop];
		}
		else {
			console.error("Cannot set undefined property: " + prop);
		}
	}
}

export function newGuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export function numberWithCommas(x?: number) {
	if (x == null) {
		return '---'
	}

	let parts = x.toString().split(".");
	parts[0]  = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

export const animation = {
	fast:   200,
	medium: 400,
	slow:   600,
}

// Taken from http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
export function forceReflow($node: JQuery) {
	if ($node.length == 0) return;

	const display = $node.css('display');

	$node.css('display', 'none');
	$node[0].offsetHeight;
	$node.css('display', display ? display : '');

	// node.style.display = 'none';
	// node.style.offsetHeight;
	// node.style.display = '';
}

export function isInScrollingContainer(elem: Element) {
	if (elem == null) {
		return false;
	}
	else if (elem.scrollHeight > elem.clientHeight ||
		elem.scrollWidth > elem.clientWidth) {
		return true;
	}
	else {
		return isInScrollingContainer(elem.parentElement)
	}
}

export function triggerWindowResize() {
	window.dispatchEvent(new Event('resize'));
}

Math.trunc = Math.trunc || function (x) {
	return x < 0 ? Math.ceil(x) : Math.floor(x);
}

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

//export {addResizeListener,removeResizeListener} from './utility/detectElementResize'

export function openInNewTab(url: string) {
	const win = window.open(url, '_blank');
	if (win) {
		win.focus();
	}
	else {
		// Unable to open the tab
		const toast = site.toaster.show({
			message: (<div>Popup blocked. Unable to navigate to: <a href={url}>{url}</a></div>),
			action:  {
				onClick: () => openInNewTab(url),
				text:    "Retry",
			},
			intent:  Intent.WARNING
		})
		//routing.push(url);
	}

	return win;
}

Array.prototype.move = function (old_index, new_index) {
	if (new_index >= this.length) {
		let k = new_index - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}
	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	return this; // for testing purposes
};

export function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

export const doNotAutocloseClassname = "do-not-autoclose";

/*
	When we lose focus from the active window and a tooltip is open, David has requested that we close said tooltip.
	This attempts to do so.
 */
export function closeActiveTooltips() {
	const $overlay = $(":not(body).bp3-overlay-open");

	if ($overlay.find(`.${doNotAutocloseClassname}`).length > 0) {
		return;
	}

	// Only close tooltips (not modals or dialogs)
	if ($overlay.find('.bp3-tether-element.bp3-tether-enabled .bp3-popover-content').length > 0
		&& $overlay.find('.bp3-popover-content > div > .bp3-menu').length == 0) {     // Don't close context menus
		$overlay.fadeOut(800, () => $overlay.remove());
	}
}

export function asyncAction(f: () => void) {
	return () => {
		// Give the switch a chance to animate the change before running the action.
		site.busy = true;
		setTimeout(() => {
			try {
				f();
			}
			finally {
				site.busy = false;
			}
		}, 100);
	}
}

export async function busyAction(f: () => Promise<void>) {
	site.busy = true;
	try {
		await f();
	}
	finally {
		site.busy = false;
	}
}

export function createBusyAction<T extends (...args: any[]) => Promise<any>>(func: T): T {
	return (async (...args: any[]) => {
		site.busy = true;
		try {
			return await func(...args);
		}
		finally {
			site.busy = false;
		}
	}) as T;
}


export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function reactionToPromise(dataFunction, triggerValue = null) {
	return new Promise<void>((resolve) => {
		let remove = reaction(dataFunction, (value) => {
			if (triggerValue === null || value === triggerValue) {
				remove();
				resolve();
			}
		})
	})
}

export async function waitAction(action, promise) {
	action();
	return promise
}

export function waitCondition(condition, interval = 100, timeout = 120 * 1000) {
	let startTime = Date.now();
	return new Promise<void>((resolve) => {
		const handle = setInterval(() => {
			if (condition()) {
				clearInterval(handle);
				resolve();
			}

			if (timeout > 0 && Date.now() - startTime >= timeout) {
				clearInterval(handle);
				throw new Error(`Timeout waiting for condition: ${condition.toString()}`);
			}
		}, interval)
	})
}

export function removeURLParameter(url, parameter) {
	//prefer to use l.search if you have a location/link object
	var urlparts = url.split('?');
	if (urlparts.length >= 2) {

		var prefix = encodeURIComponent(parameter) + '=';
		var pars   = urlparts[1].split(/[&;]/g);

		//reverse iteration as may be destructive
		for (var i = pars.length; i-- > 0;) {
			//idiom for string.startsWith
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {
				pars.splice(i, 1);
			}
		}

		url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
		return url;
	} else {
		return url;
	}
}

export function isHyperlink(target: EventTarget) {
	const $target = $(target);

	// Don't override hyperlinks
	return $target.is('a[href]') || $target.parents('a[href]').length > 0;
}

export function pluralize(s: string) {
	if (s.endsWith('y')) {
		return s.substring(0, s.length - 1) + 'ies';
	}
	else {
		return s + 's';
	}
}

export function logException(ex, context) {
	if (typeof context === 'string') {
		context = {message: context};
	}

	ErrorTracking.captureException(ex, context);

	/*eslint no-console:0*/
	window.console && console.error && console.error(ex);
}

export function findReactInstance(dom: Node): React.ReactInstance {
	for (var key in dom) {
		if (key.startsWith('__reactInternalInstance$')) {
			const fiberNode = dom[key];

			return fiberNode && fiberNode.return && fiberNode.return.stateNode;
		}
		return null;
	}
	return null;
}

export function migrateField(from: any, fromField: string, to: any, toField: string) {
	if (from[fromField]) {
		to[toField] = from[fromField];
		delete from[fromField];
	}
}

export async function requestAnimationFrame() {
	return sleep(1);
	// return new Promise(res => {
	// 	window.requestAnimationFrame(res);
	// })
}

export function findNestedPropertyValue(object: any, field: string) {
	var fields = field.split('.');
	var result = object;
	for (var f of fields) {
		if (!result) {
			break;
		}
		result = result[f];
	}

	return result;
}

export function randomString(min = 5, max = 20) {
	let text     = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	var length = _.random(min, max);
	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;


	return btoa(Math.random().toString()).substr(5, _.random(min, max))
}

export function remToPixels(rem) {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function displayUnit(max: number) {

	if (max >= 1000000000000) {
		return {scale: 1000000000000, unit: "Trillions"};
	}
	else if (max >= 1000000000) {
		return {scale: 1000000000, unit: "Billions"};
	}
	else if (max >= 1000000) {
		return {scale: 1000000, unit: "Millions"};
	}
	else if (max >= 1000) {
		return {scale: 1000, unit: "Thousands"};
	}

	return {scale: 1, unit: null};
}

export async function downloadFile(url, useXHR = true, fileName?: string, silentDownload = false) {

	if (useXHR || isE2ETesting()) { // a workaround for Cypress, it cannot handle file download by link. https://github.com/cypress-io/cypress/issues/14857

		await xhrDownloadHandler(
			// OK for smaller downloads that won't blow up memory. Benefits are that we can send the access token with the request and we can await the actual download
			() => xhr.get(url, null, "blob", true),
			fileName,
			silentDownload
		);

		return;
	}
	else {

		if(!KARMA && !silentDownload) {
			site.toaster.show({
				message: `Preparing File for Download...`,
				intent:  Intent.SUCCESS,
				timeout: 5000
			});
		}

		// NOTE: url should include access token since we cannot detect authentication failures with this approach

		let a = document.createElement('a');

		//document.body.appendChild(a);
		a.href = url;
		if (fileName) {
			a.download = fileName;
		}
		a.click();

		// let retry = true;
		// const inner = async () => {
		// 	// Make a dummy request to see if token is still valid and renew it if its not.
		// 	await xhr.get(xhr.createAuthUrl(`${juliaStore.url}/v1/validateToken`))
		//
		// 	$(".downloadFrame").remove();
		// 	let frame: HTMLIFrameElement = document.createElement("iframe");
		// 	frame.setAttribute("src", url);
		// 	frame.setAttribute("class", "downloadFrame");
		// 	frame.style.display = "none";
		// 	frame.onload        = (e) => {
		// 		console.log("Frame loaded", e);
		//
		// 		// In chrome onload is only triggered if there is a failure (go figure)
		// 		// Detect failures and retry once. e.g. Its possible (though unlikely) that JWT expired in between making the validation request and actually triggering the download, in which case the retry will
		// 		// will generate a new JWT which will be guaranteed to still be valid when download request is issued.
		// 		if (retry) {
		// 			retry = false;
		// 			frame.setAttribute("src", url);
		// 		} else {
		// 			site.raiseError(new Error("Download Failed"))
		// 		}
		// 	}
		// 	document.body.appendChild(frame);
		//
		// 	/*
		// 	// Another approach but no way to detect failure.
		// 	let a = document.createElement('a');
		// 	document.body.appendChild(a);
		// 	a.download = name;
		// 	a.href = url;
		// 	a.click();
		// 	*/
		//
		// 	/*
		// 	// Build download url and redirect
		// 	let res = window.open(url, '_blank');
		// 	setTimeout(() => {
		// 		try {
		// 			res.location.href; // If page is loaded this will work fine. If not it will generate a cross-origin failure.
		// 		} catch (e) {
		// 			if (retry) {
		// 				retry = false;
		// 				res.close();
		// 				inner();
		// 			} else {
		// 				site.raiseError(new Error("Download Failed"))
		// 			}
		// 		}
		// 	}, 1000);*/
		// };
		//
		// return inner();
	}
}

export async function downloadCSVFile(data, fileName?: string, usingRegion: boolean = true, skipRows: number = 1, skipCols: number = 0, silentDownload?: boolean) {

	await xhrDownloadHandler(
		() => xhr.post(`${juliaStore.url}/v1/export/csv`, {
			[user.VALIDATION_ID]:user.validationId,
			data: data,
			fileName: fileName,
			skipRows: skipRows,
			skipCols: skipCols,
			separators: usingRegion ? getCsvSeparators(user.region) : null
		}, {fullResponse: true, responseType: "blob"}),
		fileName,
		silentDownload
	);

}

export async function downloadXLSXFile(data, fileName?: string, silentDownload = false) {
	await xhrDownloadHandler(
		() => xhr.post(`${juliaStore.url}/v1/export/xlsx`, {
			[user.VALIDATION_ID]:user.validationId,
			data: data,
			fileName: fileName,
		}, {fullResponse: true, responseType: "blob"}),
		fileName,
		silentDownload
	);
}

async function xhrDownloadHandler(xhrExecutor: () => Promise<any>, fileName: string, silentDownload = false) {
	let toastKey;
	if (!KARMA && !silentDownload) {
		site.busy = true;
		toastKey = site.toaster.show({
			message: `Preparing ${fileName||'File'} for Download...`,
			intent:  Intent.PRIMARY,
			timeout: 0
		});
	}

	const response = await xhrExecutor().finally(() => {
		if (toastKey) {
			site.busy = false;
			site.toaster.dismiss(toastKey);
		}
	});

	const isSuccess = !!(response && response.body);

	if (KARMA) {
		let div = document.getElementById("KARMA_DOWNLOAD_RESULT");
		if (!div) {
			div = document.createElement("div");
			div.id = "KARMA_DOWNLOAD_RESULT";
			div.style.display = 'none';
			document.body.appendChild(div);
		}
		if (isSuccess) {
			response.bodySize = response.body.size;
			div.innerHTML = JSON.stringify(response);
		} else {
			div.innerHTML = "{}";
		}
	} else if (isSuccess) {

		fileName = fileName || response.headers["content-disposition"].match(/filename=(.*)/)[1];

		if (!silentDownload) {
			site.toaster.show({
				message: `${fileName || 'File'} Is Ready for Download.`,
				intent:  Intent.SUCCESS,
				timeout: 5000
			});
		}

		let a = document.createElement("a");
		a.href = window.URL.createObjectURL(response.body);
		a.download = fileName;
		a.click();
	}

}

export function kTimestampToUnixTimestamp(kTime) {
	return new Date((new Date("01/01/2035Z").getTime()/1000 + kTime) * 1000);
}

/*
	Parse a date string in the format YYYYmmdd to a Javascript Date
 */
export function juliaDateStringToLocaleDateString(dateString: string): string {
	return new Date(parseInt(dateString.substr(0, 4)), parseInt(dateString.substr(4, 2)) - 1, parseInt(dateString.substr(6, 2))).toLocaleDateString();
}

/*
 * Processes requests in sequence and await any outstanding requests. e.g. 3 -> 2 -> 1. 3 waits for 2 and 2 waits for 1.
 */
export function requestSequencer() {
	let sequencer = {
		run: async function (f) {
			sequencer.pendingSequencePromise = (async () => {
				await sequencer.pendingSequencePromise;

				let result = null;
				try {
					result = await f();
				}
				catch(e) {
					// Reset sequencePromise so new requests are not immediately rejected.
					sequencer.pendingSequencePromise = Promise.resolve();
					throw e;
				}

				return result;
			})();

			return sequencer.pendingSequencePromise;
		},
		pendingSequencePromise: Promise.resolve()
	}

	return sequencer;
}

function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// function to replace Rainbow
export function getHexColorFrom3ColorGradient(offset: number, color1: number[], color2: number[], color3: number[]) {
    let r, g, b;
    if (offset >= 0 && offset <= .5) {
        offset = offset / 0.5;
        r = color1[0] + offset * (color2[0] - color1[0]);
        g = color1[1] + offset * (color2[1] - color1[1]);
        b = color1[2] + offset * (color2[2] - color1[2]);
    } else if (offset > .5 && offset <= 1) {
        offset = offset/0.5 - 1;
        r = color2[0] + offset * (color3[0] - color2[0]);
        g = color2[1] + offset * (color3[1] - color2[1]);
        b = color2[2] + offset * (color3[2] - color2[2]);
    } else {
        throw new Error('Offset is out of range');
	}

    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

export function hexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	  return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
}

export function isDarkColor(r: number, g: number, b: number, a:number = 1) {
	if( a <= 0.33) {
		return false;
	}
	return  0.213 * r + 0.715 * g + 0.072 * b <= 255 / 2;
}

export function getCsvSeparators(regionCode:string) : { decimal:String;	thousand:String; list:String} {
	// base on wiki - Decimal separator, Comma-separated values
	// https://en.wikipedia.org/wiki/Decimal_separator
	// https://en.wikipedia.org/wiki/Comma-separated_values
	// European CSV/DSV file (where the decimal separator is a comma and the value separator is a semicolon)
	if (regionCode) {
		regionCode = regionCode.toUpperCase();
		if (["CA","CN","NA","LK","UK"].indexOf(regionCode) >= 0) {
			return {decimal: ".", thousand: " ", list: ","};
		} else if (["AL","BE","BG","CR","HR","CZ","EE","FI","FR","HU","LV","LT","NO","PE","PL","PT","RU","SK","ES","SE","CH","UA"].indexOf(regionCode) >= 0) {
			return {decimal: ",", thousand: " ", list: ";"};
		} else if (["AR","AT","BA","BR","CL","CO","DK","DE","GR","ID","IT","NL","RO","SI","RS","TR","VN"].indexOf(regionCode) >= 0) {
			return {decimal: ",", thousand: ".", list: ";"};
		} else if (["LI"].indexOf(regionCode) >= 0) {
			return {decimal: ".", thousand: "'", list: ","};
		}
	}
	return { decimal:".",thousand:",",list:","}
}

export function dateToStringWithTimezone(date: Date): string {
	const tzo = -date.getTimezoneOffset(),
		dif = tzo >= 0 ? '+' : '-',
		pad = function(num) {
			const norm = Math.floor(Math.abs(num));
			return (norm < 10 ? '0' : '') + norm;
		};
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} GMT${dif}${pad(tzo/60)}${pad(tzo%60)}`;
}

export function dateToFormattedStringWithTimezone(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {dateStyle: 'long', timeStyle: 'long'} as any).format(date);
}

/**
 * Determines if a react node has any truthy children
 * @param node
 */
export function hasChildren(node: React.ReactElement) {
	const flatten = (item) => [item, (_ as any).flatMapDeep(item?.props?.children, flatten)];

	return _.some((_ as any).flatMapDeep(node?.props?.children, flatten));
}

export function validateYMFormat(value: any) :boolean {
	return /(^[1-9]\d{0,2}y$)|(^[1-9]\d{0,2}m$)|(^[1-9]\d{0,2}y[1-9]{1}\d{0,2}m$)|(^[1-9][0-9]*)/.test(_.toString(value));
}

export function convertMonthToYM(value: string | number) : string {
	if (typeof value === 'string') {
		if (/(^[1-9]\d{0,2}y$)|(^[1-9]\d{0,2}m$)|(^[1-9]\d{0,2}y[1-9]{1}\d{0,2}m$)/.test(value)) {
			return value;
		} else {
			value = parseInt(value);
		}
	}

	const year = Math.floor(value/12);
	const month = value % 12;
	let ym = year > 0 ? `${year}y` : '';
	if (month > 0) {
		ym += `${month}m`;
	}
	return ym || '0';
}

export function convertYMtoMonth(maturity, unit = 'year'): number {
	let monthNumber = 0;

	if (/(^[1-9]\d{0,2}y$)|(^[1-9]\d{0,2}m$)|(^[1-9]\d{0,2}y[1-9]{1}\d{0,2}m$)/.test(maturity)) {
		const matchYearResult = maturity.match(/[1-9]\d{0,2}y/);
		if (matchYearResult) {
			const year = parseInt(matchYearResult[0].replace('y'));
			monthNumber += 12*year;
		}

		const matchMonthResult = maturity.match(/[1-9]\d{0,2}m/);
		if (matchMonthResult) {
			const month = parseInt(matchMonthResult[0].replace('m'));
			monthNumber += month;
		}
	} else {

		let totalMonth = maturity;
		if (unit === 'year') {
			totalMonth = maturity * 12;
		}
		const month = Math.floor(totalMonth % 12);
		monthNumber = Math.floor(totalMonth - month) + month;
	}

	return monthNumber;
}

export function createDisposableTimeout() {
	const timerSet = new Set<NodeJS.Timeout>();
	let isDisposed = false;

	return {
		setTimeout(func: Function, timeout: number) {
			if (isDisposed) {
				return;
			}

			const timer = setTimeout(() => {
				try {
					func();
				} finally {
					if (timerSet.has(timer)) {
						timerSet.delete(timer);
					}
				}
			}, timeout);
			timerSet.add(timer);
		},
		dispose() {
			timerSet.forEach(clearTimeout);
			timerSet.clear();
			isDisposed = true;
		}
	};
}

export function stripHtml(html: string) {
	let doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.body.textContent || "";
}

function getPrecision(n:number): number {
	try {
		return `${n}`.split(".")[1].length;
	} catch(e) {
		return 0;
	}
}

function getInteger(n:number): number {
	return Number(`${n}`.replace(".",""))
}

export function multiple(arg1:number, arg2:number): number {

	const i1 = getInteger(arg1);
	const i2 = getInteger(arg2);
	const m = Math.pow(10, getPrecision(arg1) + getPrecision(arg2));
	return (i1*i2)/m;
}

export function divide(arg1:number, arg2:number, maxPrecision?: number): number {
	const p1 = getPrecision(arg1);
	const p2 = getPrecision(arg2);
	const i1 = getInteger(arg1);
	const i2 = getInteger(arg2);
	let rtn = (i1/i2) * Math.pow(10,p2-p1);
	if (maxPrecision != null) {
		rtn = Number(rtn.toFixed(maxPrecision));
	}
	return rtn;
}

export function add(arg1:number,arg2:number): number {
	const m = Math.pow(10, Math.max(getPrecision(arg1), getPrecision(arg2)));
	return (arg1*m+arg2*m)/m;
}

export function subtract(arg1:number, arg2:number): number {
	const pMax = Math.max(getPrecision(arg1), getPrecision(arg2));
	const m = Math.pow(10, pMax);
	return Number(((arg1*m-arg2*m)/m).toFixed(pMax));
}

export function equal(x, y, tolerance = Number.EPSILON) {
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
	return Math.abs(x - y) < tolerance;
}

export function unlockInputsConfirm(objectType, cb?) {
	return site.confirm(
		i18n.intl.formatMessage({
			defaultMessage: "Are you sure you want to unlock the inputs?",
			description: "[unlockInputsConfirm] conform dialog title: to disable the page lock which is used to avoid the result lost"
		}),
		i18n.intl.formatMessage({
			defaultMessage: `Modifying a completed {objectTypeName} after unlocking will delete the output results.`,
			description:    "[unlockInputsConfirm] conform dialog message: to disable the page lock which is used to avoid the result lost"
		}, {objectTypeName: i18n.translateObjectName(objectType)}),
		<Icon icon={'unlock'} size={36} />,
		i18n.common.OBJECT_CTRL.UNLOCK
	).then((r) => {
		r && cb && cb();
		return r;
	})
}
