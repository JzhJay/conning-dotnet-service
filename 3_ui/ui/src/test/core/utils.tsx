const Ajv: any           = require('ajv');

import * as React from 'react';
import {api, i18n} from "stores";
import {QueryResult} from 'stores/queryResult';
import {enzyme} from 'test';
import ReactWrapper from 'enzyme'
import {waitCondition} from 'utility';
import {RawIntlProvider} from 'react-intl';

let resemblejs: any = null;//require('resemblejs')

let GENERATE_BASELINE          = false; // Set to true so new result files that are not present in baseline should be added to the baseline.
let visualRegressionBaseFolder = "visual_regression";


const expect: any = chai.expect;

interface IRect {
	top: number
	left: number
	height: number
	width: number
}

interface IPhantomJSOptions {
	type: string
	fname: string
	content?: string
	clipRect?: IRect
}

const LOAD_METADATA_TIMEOUT = 60000;

export async function loadValidQueryResults(): Promise<QueryResult[]> {
	let available = await api.queryResultStore.loadResultDescriptors();
	let results   = [];

	for (let qr of available) {
		try {
			await promiseWithTimeout(
				qr.loadMetadata({
					subpivot:    true,
					arrangement: qr.descriptor.default_arrangement
				}),
				LOAD_METADATA_TIMEOUT);
			results.push(qr);
		}
		catch (err) {
			console.log(`Failed to fetch query result: ${qr.id} Error:${err}`);
		}
	}

	return results;
}

function promiseWithTimeout(promise, ms) {
	return new Promise((resolve, reject) => {
		promise.then((data) => resolve(data), (err) => reject(err));

		setTimeout(() => {
			reject(`Promise timed out after ${ms} ms`)
		}, ms)
	})
}

/**
 * Saves the current page as an image using phantomJS
 * @param filename  The location where the file is to be saved.
 * @param clipRect  A cliprect representing the portion of the screen that is desired. Null if not applicable.
 */
export function takeScreenshot(filename: string, clipRect: IRect) {
	$(window.parent.document.body).find("#banner, #browsers").css({display: "none"});
	callPhantomJS({type: 'render', clipRect: clipRect, fname: filename});
	$(window.parent.document.body).find("#banner, #browsers").css({display: "block"});
}

/**
 * Saves the html of the page to a file
 * @param filename  The location where the file is to be saved.
 */
export function saveHtmlFile(filename: string) {
	callPhantomJS({type: 'save', fname: filename, content: $("html").html()});
}

function savePageAsImage() {
	// let bounds = {top:0, left:0, height:document.body.scrollHeight, width:document.body.scrollWidth}
	let bounds          = document.body.getBoundingClientRect();
	let newBounds       = $.extend({}, bounds);
	newBounds['height'] = Math.max(document.body.scrollHeight, 2000);
	takeScreenshot(`${visualRegressionBaseFolder}/diffResult.png`, null);
}

/**
 * Calls through tot he phantomjs server to perform operations that cannot be done clientside.
 * @param options
 */
export function callPhantomJS(options: IPhantomJSOptions) {
	let callPhantom: any = (window as any).top.callPhantom;

	// check if we are in PhantomJS
	if (callPhantom === undefined) return;

	// this calls the onCallback function of PhantomJS
	callPhantom(options);
}

let jsondiffpatch: any   = require('jsondiffpatch') as any;
// jsondiffpatch.formatters = require('jsondiffpatch/src/formatters');
require('jsondiffpatch/dist/formatters-styles/html.css');
let DiffMatchPatch: any = require('diff-match-patch') as any;

/**
 * Creates a screenshot of the current page and compares it to the baseline image.
 * @param filePath  Path to the baseline
 * @param done      mocha done callback
 */
export function generateAndCompareScreenshot(filePath: string, done: Function) {
	/*
	 let bounds = renderNode.getBoundingClientRect();

	 let iFrame = window.parent.document.getElementById('context');

	 if(iFrame) {
	 bounds = $.extend({}, bounds);
	 bounds.top = window.parent.document.getElementById('context').offsetTop;
	 }
	 */

	// Save the screenshot to result.png which was created and is being served up by karma.
	// Note: we can only compare existing files, so we must overwrite an existing file to run the comparison
	// client side.
	let resultFileName = `${visualRegressionBaseFolder}/result.png`;

	// For some weird reason the first screenshot has an empty area at the bottom, so lets take 2 screenshots.
	takeScreenshot(resultFileName, null);
	takeScreenshot(resultFileName, null);

	// Add a duplicate screenshots to a result dir, so baselines can easily be overridden if needed.
	takeScreenshot(`${visualRegressionBaseFolder}/results/${filePath}`, null);

	let baselineFileName = `${visualRegressionBaseFolder}/baselines/${filePath}`;

	if (GENERATE_BASELINE && !UrlExists(baselineFileName)) {
		takeScreenshot(`${baselineFileName}`, null);
		console.log(`Added ${filePath} to baseline`);

		done();
	}
	else {
		let diff = resemblejs(baselineFileName).compareTo(resultFileName).ignoreColors().onComplete(function (data) {
			if (data.misMatchPercentage !== 0) {
				// Remove any leftover diff containers
				$('#diffContainer').remove();

				let $container = $(`<div id='diffContainer' style="display:flex;"></div>`);
				$(document.body).append($container);

				let diffImage = new Image();
				diffImage.src = data.getImageDataUrl();

				// Add diff to page
				$container.html((diffImage as any));

				saveHtmlFile(`${visualRegressionBaseFolder}/page.html`);

				$('#diffContainer').remove();
			}

			if (data.misMatchPercentage > 0)
				console.log(`Mismatch of ${data.misMatchPercentage} for ${baselineFileName}`)

			//expect(parseFloat(data.misMatchPercentage), "Mismatch percentage").to.equal(0);

			done();
		});
	}
}

export function compareImages(filePath1, filePath2) {
	let diff = resemblejs(filePath1).compareTo(filePath2).ignoreColors().onComplete(function (data) {
		if (data.misMatchPercentage !== 0) {
			console.log("mismatch " + data.misMatchPercentage)
		}
	});
}

function UrlExists(url) {
	let http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	http.send();
	return http.status !== 404;
}

/**
 * Deep compares complex objects such as strings, arrays and nested object then produce a pretty diff on failure that is human readable
 * @param actual    The current object
 * @param expected  The object that was expected
 */
export function compareComplexObject(actual, expected) {
	let isString = $.type(actual) === 'string';

	try {
		expect(actual).to.eql(expected);
	}
	catch (err) {
		let diff = "";

		if (isString) {
			// We use a different plugin for string diff which provides a better context.
			// Its actually the same text diff library that is used by jsondiffpatch, but they
			// use the patching methods instead of the diff which strips the context.
			let dmp = new DiffMatchPatch.diff_match_patch();
			diff    = dmp.diff_main(actual, expected);
			//dmp.diff_cleanupSemantic(diff);
			diff    = dmp.diff_prettyHtml(diff);

			//console.log(diff);
		}
		else {
			let delta = jsondiffpatch.diff(actual, expected);
			diff      = jsondiffpatch.formatters.html.format(delta, actual);
		}

		let $diffContainer = $('<div id="diffContainer"></div>');
		$diffContainer.append(diff);

		// Remove some of the context so the diffs are easier to spot
		if (isString) {
			let context = 100;
			let $spans  = $diffContainer.find("span");

			$.each($spans, (index, $span) => {
				if ($span.innerHTML.length > context * 2) {
					$span.innerHTML = $span.innerHTML.substring(0, context) + "<p>...</p>" + $span.innerHTML.slice(-context);
				}
			})
		}

		$(document.body).append($diffContainer);
		saveHtmlFile(`${visualRegressionBaseFolder}/page.html`);
		throw(err);
	}
}

$.expr[':'].truncated = function (obj) {
	let $this = $(obj);
	let $c    = $this
		.clone()
		.css({display: 'inline', width: 'auto', visibility: 'hidden'})
		.appendTo('body');

	let c_width = $c.width();
	$c.remove();

	if (c_width > $this.width() + 1) {
		return true;
	}
	else {
		return false;
	}
};

export function validateSchema(schema, data) {
	let ajv       = new Ajv({});
	const isValid = ajv.validate(schema, data)
	if (!isValid) {
		throw new Error(ajv.errorsText());
	}
}

export function sendNativeEventToElement(element : Element, event)
{
	if (!element) { return; }

	if (element.tagName == 'A') {
		(element as HTMLElement).click();
	}
	else {
		const bounds = element.getBoundingClientRect();

		//e.preventDefault();
		//e.stopPropagation();

		let eNative = new MouseEvent(event, {
			'view':       window,
			'bubbles':    true,
			'cancelable': false,
			clientX:      bounds.left + bounds.width / 2,
			clientY:      bounds.top + bounds.height / 2
		});
		//node.dispatchEvent(event);

		element.dispatchEvent(eNative);
	}
	//$element.trigger(e);
}

export function sendJQueryEventToElement($element, event)
{
	const bounds = $element.get(0).getBoundingClientRect();

	// create a jQuery event
	let e = $.Event(event);

	// set coordinates
	e.pageX = bounds.left + bounds.width/2;
	e.pageY = bounds.top + bounds.height/2;
	e.clientX = e.pageX;
	e.clientY = e.pageY;

	$element.trigger(e);
}

export function sleep(timeout) {
	return new Promise<void>((accept, reject) => window.setTimeout(() => accept(), timeout))
}

export function simulateMouseEvent(element, eventType) {
	const mouseEvent = document.createEvent('MouseEvents');
	mouseEvent.initEvent(eventType, true, true);
	element.focus();
	element.dispatchEvent(mouseEvent);
}

export function simulateMetaKeyClickEvent(element) {
	element.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true, metaKey: true }));
}

export function simulateEnterKeyEvent(element) {
	// @ts-ignore keyCode is deprecated but blueprint still uses it. So ignore TypeScript checking here.
	const simulateEnterKeyEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', code: 'Enter', keyCode: 13 });
	element.dispatchEvent(simulateEnterKeyEvent);
}

export async function verifyDownloadFile(expect, expectData: {type?:string, fileName:string}, timeout = 30000) {
	let div;
	await waitCondition(() => {
		div = document.getElementById("KARMA_DOWNLOAD_RESULT");
		return !!div && !!div.innerHTML;
	}, 100, timeout);

	let data = JSON.parse(`${div.innerHTML}`);
	div.parentNode.removeChild(div);

	expect(_.get(data, 'statusCode')).to.eq(200);
	expect(_.get(data, 'type')).to.eq(_.get(data, 'header.content-type'));
	expect(_.get(data, 'type')).to.eq(_.get(expectData, 'type', 'application/octet-stream'));
	expect(_.get(data, 'header.content-disposition')).to.eq(`attachment; filename=${expectData.fileName}`);
	expect(_.get(data, 'bodySize')).to.gt(0);
}

export function enzymeMount(elem: JSX.Element, containerId: string = "testContainer"): ReactWrapper{
	enzymeUnmount(null, containerId);

	const container = $(`<div />`)
		.attr('id', containerId)
		.data('keepUrl', location.href)
		.addClass('conning').addClass('app').addClass('ui').addClass('react-app')
		.css({
			display: "flex",
			minHeight: `1000px`,
			minWidth: `1000px`,
			background: `rgba(255,255,255,0.3)`,
			border: `5px solid navy`,
			position: `fixed`,
			top: `30px`,
			right: `0`,
			width: `calc(100vw - 400px)`,
			height: `calc(100vh - 30px)`,
		}).appendTo(document.body);

	$('<button/>')
		.attr('id', 'testContainerMover')
		.attr('type', 'button')
		.text('<- Move container ->')
		.css({
			position: `fixed`,
			top: `5px`,
			right: `300px`,
			zIndex: `100`
		}).click(()=> {
			const $container = get$Container(containerId);
			if ($container.data('hide') === true) {
				$container.data('hide',false).css({right: 0, left: 'unset'})
			} else {
				$container.data('hide',true).css({right: 'unset', left: '90%'})
			}
		})
		.appendTo(document.body)

	return enzyme.mount(<RawIntlProvider value={i18n.intl}>{elem}</RawIntlProvider>, { attachTo: container[0]});
}

export function get$Container(containerId: string = "testContainer"): JQuery {
	return $(`#${containerId}`);
}

export function enzymeUnmount(wrapper: ReactWrapper, containerId: string = "testContainer") {
	try {
		if (wrapper && wrapper?.unmount && wrapper?.exists && wrapper.exists())
			wrapper.unmount();
	} catch (e) {
		console.log('exception at tryToUnmount: ');
		console.log(e);
	}

	const $container = get$Container(containerId);
	const keepUrl = $container.data('keepUrl');
	if (keepUrl) {
		window.setTimeout(() => { window.history.pushState(null, null, keepUrl); }, 2000);
	}
	$container.remove();
	// remove bp3 overlays if had.
	$(document.body).removeClass('bp3-overlay-open');
	$(document.body).children('.bp3-portal').remove();

	$('#testContainerMover').remove();
}

