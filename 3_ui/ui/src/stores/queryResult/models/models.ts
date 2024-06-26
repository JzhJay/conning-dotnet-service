import type {ChartUserOptions} from '../../charting';
import type {QueryOptions} from '../../query';

export type QueryViewUserOptions = ChartUserOptions | QueryOptions | PivotUserOptions;

export interface PivotUserOptions {
	showStatisticsPivot: boolean;
	showStatisticsPivotBeforeEnableSensitivity: boolean;
}