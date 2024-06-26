import {Option} from 'components';
import {IModelDefinition} from 'stores/rsSimulation/rwRecalibration/models';

export interface IModelChartingResult {
	hasGroupedSeries: boolean;
	xAxisDefinition: Option | IModelDefinition;
	seriesGroupDefinitions: Option[] | IModelDefinition[];
	categories: string[];
	data: any[];
	yMap?: {target: string, computed: string, computedTitle?: string, targetTitle?: string}[];
	yAxisTitle?: string;
}