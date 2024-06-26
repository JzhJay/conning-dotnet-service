import {ClimateRiskAnalysisViewName, ClimateRiskAnalysisViewTemplate} from '../climateRiskAnalysis';
import {BookPage} from './BookPage';
import {BookView} from './BookView';

export interface IBook {
	defaultUserOptions: (name) => any;
	availableViews: {[name:string]: ViewTemplate};
	pages: BookPage[];
	sendPageUpdate: (pages: ApiPage[]) => Promise<any>;
	isLoading: boolean;
	viewAnimationInProgress: boolean;
}

export interface ApiView {
	view?: string;
	title?: string;
	controls?: string;
	index?: number;
	newIndex?: number;
}

export interface ApiPage {
	title?: string;
	index?: number;
	newIndex?: number;
	views?: ApiView[];
	additionalControls?: string;
}

export type ExportPdfOptions = {
	targetSelector: string;
	customFonts?: string[];
	ignoreCSS?: string[];
}

export type ViewTemplate = {name: string, label: string, height?: number, isInput?: boolean}