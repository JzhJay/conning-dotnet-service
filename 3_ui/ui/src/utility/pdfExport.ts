import { observable, makeObservable } from 'mobx';
import jsPDF, { jsPDFOptions, HTMLFontFace } from 'jspdf';
import Canvg from 'canvg';
import { iconUrls, xhr, user, UserPdfLogoOptions, site } from '../stores';
import { sleep } from './utility';

import * as css from './pdfExport.css';
import * as highchartCSS from '../components/system/highcharts/highchartsComponent.css';
import * as highchartToolbarCSS from '../components/system/highcharts/toolbar/highchartsToolbar.css';

export const ignoreCssInPrintPDF = {
	default: '__advise_conning_igore_print_css',
	resize: 'resize-sensor',
	highchartsToolbar: highchartToolbarCSS.highchartsToolbar
};

interface PageMargins {
	top: number;
	right: number;
	left: number;
	bottom: number;
}

export interface ExportPdfOptions {
	documentSize?: string;
	jspdfOptions?: jsPDFOptions,
	ignoreCSS?: string[],
	customFonts?: string[];
	sandboxContainer?: HTMLElement;
	pageMargins?: PageMargins;
}

const internalCustomFontsObj= {
	LucidaGrande : [{
		src: [{
			url: '/ui/fonts/LucidaGrande/LucidaGrande.ttf',
			format: 'truetype'
		}],
		style: 'normal',
		weight: 400,
	}, {
		src: [{
			url: '/ui/fonts/LucidaGrande/LucidaGrandeBold.ttf',
			format: 'truetype'
		}],
		style: 'normal',
		weight: 600,
	}],
	OpenSans: [{
		src: [{
			url: '/ui/fonts/OpenSans/OpenSans.ttf',
			format: 'truetype'
		}],
		stretch: 'normal',
		style: 'normal',
		weight: 400,
	}, {
		src: [{
			url: '/ui/fonts/OpenSans/OpenSansItalic.ttf',
			format: 'truetype'
		}],
		stretch: 'normal',
		style: 'italic',
		weight: 400,
	}, {
		src: [{
			url: '/ui/fonts/OpenSans/OpenSansBold.ttf',
			format: 'truetype'
		}],
		stretch: 'normal',
		style: 'normal',
		weight: 600,
	}],
	Lato: [{
		src: [{
			url: '/ui/fonts/Lato/Lato-Regular.ttf',
			format: 'truetype'
		}],
		stretch: 'normal',
		style: 'normal',
		weight: 400,
	}, {
		src: [{
			url: '/ui/fonts/Lato/Lato-Bold.ttf',
			format: 'truetype'
		}],
		stretch: 'normal',
		style: 'normal',
		weight: 600,
	}]
};

const defaultDocumentSize = {
	'a4' : {
		width: 793, 
		height: 1122,
		ratio: 0.706
	}
};

function svgToDataUrl(svg) {
	// Webkit and not chrome
	const userAgent = window.navigator.userAgent;
	const webKit = (
		userAgent.indexOf('WebKit') > -1 &&
		userAgent.indexOf('Chrome') < 0
	);
	const isFireFox = userAgent.indexOf('Firefox') !== -1;

	try {
		// Safari requires data URI since it doesn't allow navigation to blob
		// URLs. Firefox has an issue with Blobs and internal references,
		// leading to gradients not working using Blobs (#4550).
		// foreignObjects also dont work well in Blobs in Chrome (#14780).
		if (!webKit && isFireFox && svg.indexOf('<foreignObject') === -1) {
			return window.URL.createObjectURL(new window.Blob([svg], {
				type: 'image/svg+xml;charset-utf-16'
			}));
		}
	} catch (e) {
		// Ignore
	}
	return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function getCanvasFromDataUrl(dataUrl, chart) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext && canvas.getContext('2d');
			const pixelRatio = window.devicePixelRatio || 1;

			// lets scale the canvas and change its CSS width/height to make it high res.
			canvas.style.width = chart.chartWidth + 'px';
			canvas.style.height = chart.chartHeight + 'px';
			canvas.width = chart.chartWidth * pixelRatio;
			canvas.height = chart.chartHeight * pixelRatio;

			ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
			ctx.drawImage(img, 0, 0);
			resolve(canvas);
		};
		img.onerror = () => {
			resolve(img);
		};
		img.src = dataUrl;
	});
}

// not sure why the render result of getSVGForLocalExport is blurry
async function getSvgFromHighcharts(chart) {
	return new Promise((resolve, reject)=> {
		chart.getSVGForLocalExport(
			Object.assign({}, chart.options.exporting, {	
				sourceWidth: chart.chartWidth,
				sourceHeight: chart.chartHeight
			}),
			{},
			reject,
			resolve
		)
	});
}

async function getCloneElementAndConvertChart(hideRootNode, targetElement, ignoreCSS): Promise<void> {
	const traverseAndCopyDom = async (element, cloneNode) => {
		if (element.classList && element.classList.contains('highcharts-container')) {
			const { id } = element;
			const { charts } = Highcharts;
			const chart = charts.find((_chart) => _.get(_chart, ['container', 'id'], '') === id);
			if (chart) {
				const svg = chart.getSVGForExport({
					sourceWidth: chart.chartWidth,
					sourceHeight: chart.chartHeight
				});
				const dataUrl = svgToDataUrl(svg);
				const canvas = await getCanvasFromDataUrl(dataUrl, chart);
				window.URL.revokeObjectURL(dataUrl);
				cloneNode.appendChild(canvas);
			}
		} else if (element.childNodes && element.childNodes.length > 0) {
			const nodes = Array.prototype.slice.call(element.childNodes);
			for (let i = 0; i < nodes.length; i++) {
				const node = nodes[i];
				const classNameList = typeof node.className === 'string' ? node.className.split(' ') : [];
				
				if (classNameList.some((className) => ignoreCSS.has(className))) {
					continue;
				} else if (node.tagName === 'svg') {
					const width =  node.width.baseVal.value;
					const height = node.height.baseVal.value;
					const img = await getImageFromSvgByCanvg(node.outerHTML, width, height);
					cloneNode.appendChild(img);
				}
				else if (classNameList.indexOf(highchartCSS.highchartsComponent) >= 0) {
					const newCloneNode = node.cloneNode();
					cloneNode.appendChild(newCloneNode);

					const chartContainer = node.querySelector('.highcharts-container');
					const cloneChartContainer = chartContainer.cloneNode();
					newCloneNode.appendChild(cloneChartContainer);
					await traverseAndCopyDom(chartContainer, cloneChartContainer);
				} else {
					const newCloneNode = node.cloneNode();
					if (newCloneNode.style) {
						newCloneNode.style.transitionProperty = 'none';
					}
					cloneNode.appendChild(newCloneNode);
					await traverseAndCopyDom(node, newCloneNode);
				}
			}
		}
	}

	const cloneNode = targetElement.cloneNode();
	await traverseAndCopyDom(targetElement, cloneNode);
	hideRootNode.appendChild(cloneNode);
}

async function blobToBinaryString(blob): Promise<string> {
	return new Promise((resolve, reject)=> {
		const reader = new FileReader();
		reader.onload = (e) => { 
			resolve(reader.result as string);
		};
		reader.onerror = reject;
		reader.readAsBinaryString(blob);
	});
}

/*
	load fonts by manually download ttf as binary string, temporaily not used
*/
async function loadFonts(doc: jsPDF) {
	const blob = await xhr.get('/ui/fonts/LucidaGrande/LucidaGrande.ttf', null, 'blob');
	const binaryString = await blobToBinaryString(blob);
	const blob2 = await xhr.get('/ui/fonts/LucidaGrande/LucidaGrandeBold.ttf', null, 'blob');
	const binaryString2 = await blobToBinaryString(blob2);

	doc.addFileToVFS('LucidaGrande-normal.ttf', binaryString);
	doc.addFileToVFS('LucidaGrande-bold.ttf', binaryString2);
	doc.addFont('LucidaGrande-normal.ttf', 'LucidaGrande', 'normal');
	doc.addFont('LucidaGrande-bold.ttf', 'LucidaGrande', 'normal', 'bold');
}

const pixelRatio = window.devicePixelRatio || 1;
let _cacheCanvas;
function getCachedCanvas(width, height) {
	if (!_cacheCanvas) {
		_cacheCanvas = document.createElement('canvas');
	}

	const scaleWidth = width * pixelRatio;
	const scaleHeight = height * pixelRatio;
	if (_cacheCanvas.width !== scaleWidth || _cacheCanvas.height !== scaleHeight) {
		_cacheCanvas.style.width = `${width}px`;
		_cacheCanvas.style.height = `${height}px`;
		_cacheCanvas.width = scaleWidth;
		_cacheCanvas.height = scaleHeight;
	}

	return _cacheCanvas;
}

async function getCanvasFromSvgByCanvg(svg, width, height): Promise<HTMLCanvasElement> {
	const canvas = getCachedCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const v = await Canvg.from(ctx, svg, { ignoreClear: true });
    v.render();
	return canvas;
}

async function loadImage(imageUrl): Promise<HTMLImageElement> {
	return new Promise((resolve, reject)=> {
		const img = new Image();
		img.onload = () => {
			resolve(img);
		};
		img.onerror = (e) => {
			reject(e);
		};
		img.src = imageUrl;
	});
}
async function getImageFromSvgByCanvg(svg, width, height): Promise<HTMLImageElement> {
	const canvas = await getCanvasFromSvgByCanvg(svg, width, height);
	const pngDataUrl = canvas.toDataURL('image/png');
	const img = new Image();
	img.src = pngDataUrl;
	img.width = width;
	img.height = height;
	return img;
}

async function addWaterMark(doc, pageMargin, logoImg) {
	const { img, width: imgWidth, height: imgHeight, type } = logoImg;
	if (img) {
		const positionX = doc.internal.pageSize.getWidth() - (pageMargin.right) - imgWidth;
		const positionY = pageMargin.top/2;
		const totalPages = doc.internal.getNumberOfPages();
	
		for (let i = 1; i <= totalPages; i++) {
			doc.setPage(i);
			doc.addImage(img, type, positionX, positionY, imgWidth, imgHeight);
		}
	}
}

async function getLogoImg() {
	const logoStyle = user.getPdfReportLogoStyle();
	if (logoStyle === UserPdfLogoOptions.none) {
		return {
			img: null,
			width: 0,
			height: 0,
		};
	} else {
		let imgWidth;
		let imgHeight;
		let logoImg;
		let imgType = 'PNG';
		if (logoStyle === UserPdfLogoOptions.custom) {
			const logoUrl = user.getPdfReportCustomLogo();
			try {
				logoImg = await loadImage(logoUrl);
				imgWidth = logoImg.naturalWidth;
				imgHeight = logoImg.naturalHeight;
				if (imgWidth > 200 || imgHeight >= 200) {
					imgWidth = imgWidth/2;
					imgHeight = imgHeight/2;
					logoImg.width = imgWidth;
					logoImg.imgHeight = imgHeight;
				}

				if (logoUrl.substring(logoUrl.indexOf(':')+1, logoUrl.indexOf(';')) === 'image/jpeg') {
					imgType = 'JPEG';
				}
			} catch(e) {
				logoImg = null;
				site.raiseError(new Error('Custom logo is not uploaded or saved correctly.\nPlease upload it in page setting again.'));
			}
		}
		
		if (!logoImg) { // fallback to use default conning logo
			imgWidth = 147;
			imgHeight = 35;
			const canvas = await getCanvasFromSvgByCanvg(iconUrls.conningLogo, imgWidth, imgHeight);
			logoImg = canvas.toDataURL('image/png');
		}

		return {
			img: logoImg,
			width: imgWidth,
			height: imgHeight,
			type: imgType 
		};
	}
}

export class PdfExporter {
    @observable isPrinting: boolean = false;
    @observable progress: number = 0;

    print = async function (elements, downloadFileName, options: ExportPdfOptions = {}) {
		let _sandboxContainer, hideRootNode;
		try {
			this.isPrinting = true;
			await sleep(1); // let loading dialog is able to open first
			const { 
				documentSize = 'a4',
				customFonts = [],
				ignoreCSS = [],
				sandboxContainer = null,
				pageMargins = {
					top: 100,
					right: 60,
					bottom: 100,
					left: 60,
				},
				jspdfOptions = {},
			} = options;
		
			const _ignoreCSS = new Set<string>(ignoreCSS.concat(_.values(ignoreCssInPrintPDF)));
			_sandboxContainer = sandboxContainer || (elements.length ? elements.length[0].parentNode : elements.parentNode);
			hideRootNode = document.createElement('div');
			hideRootNode.style.width = '100%';
			hideRootNode.style.height = '0px';
			hideRootNode.style.overflow = 'auto';
			
			if (!elements.length) {
				elements = [elements];
			}
			
			const firstNode = document.createElement('div');
			firstNode.className = css.pdfReportRoot;
			const totalElementsLength = elements.length;
			hideRootNode.appendChild(firstNode);
			for (let i=0; i < totalElementsLength; i++) {
				try {
					const element = elements[i];
					if (!element) {
						continue;
					}
					const viewContainer = document.createElement('div');		
					viewContainer.className = css.viewContainer;
					firstNode.appendChild(viewContainer);
					await getCloneElementAndConvertChart(viewContainer, element, _ignoreCSS);
				} finally {
					this.progress = (i+1)/totalElementsLength*0.9;
					await sleep(50);
				}
			}
		
			_sandboxContainer.appendChild(hideRootNode);
			
			const { scrollWidth, scrollHeight } = hideRootNode;	
			let orientation: 'portrait' | 'landscape' = 'portrait';
			let { width, height, ratio } = defaultDocumentSize[documentSize] || defaultDocumentSize.a4;	
			let finalDocWidth = width;
			let finalDocHeight = height;
			if (scrollWidth > scrollHeight) {
				orientation = 'landscape';
				finalDocWidth = height;
				finalDocHeight = width;
			}
			
			const logoImg = await getLogoImg();
			if (logoImg.img) {
				if ((logoImg.height - pageMargins.top) > 0) {
					pageMargins.top = 10;
				} else {
					pageMargins.top = pageMargins.top - logoImg.height;
				}
			}

			if (scrollWidth > finalDocWidth || scrollHeight > finalDocHeight) { // not fit default a4 size
				width = scrollWidth + pageMargins.left + pageMargins.right;
				height = scrollHeight + pageMargins.top + pageMargins.bottom + logoImg.height;
				/* tempoarily comment, wait requirement of paginiation is more clear 
				if (orientation === 'landscape') {
					height = width * ratio;
				} else {
					height = width / ratio;
				}*/
			}
		
			const contentPosition = {	// put content in document center
				x: pageMargins.left,
				y: pageMargins.top + logoImg.height
			};
			
			const doc = new jsPDF(Object.assign({
				compress: false,
				orientation, 
				unit: 'px', 
				format: [ width, height ]
			}, jspdfOptions));
		
			const fonts: HTMLFontFace[] = [];
			customFonts.forEach((fontFamilyName: string) => {
				if (internalCustomFontsObj[fontFamilyName]) {
					fonts.push(...internalCustomFontsObj[fontFamilyName].map((fontSetting) => ({
							family: fontFamilyName,
							...fontSetting
						}))
					);
				}
			});
			
			await doc.html(hideRootNode.firstChild as HTMLElement, {
				fontFaces: fonts,
				...contentPosition 
			});
			this.progress = 1;
			await addWaterMark(doc, pageMargins, logoImg);
			doc.save(`${downloadFileName}.pdf`);
		} finally {
			if (_sandboxContainer && hideRootNode && hideRootNode.parentNode === _sandboxContainer) {
				_sandboxContainer.removeChild(hideRootNode);
			}
			this.isPrinting = false;
			this.progress = 0;
		}
	}

    constructor() {
        makeObservable(this);
    }
}
