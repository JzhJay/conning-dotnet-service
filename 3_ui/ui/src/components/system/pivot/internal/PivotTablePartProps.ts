import {QueryResult, Query, QueryDescriptor} from 'stores';
import {PivotTable} from '../'

/**
 * Props for our children tables: row, columns, details
 */
export interface PivotTablePartProps<T> {
    pivot: PivotTable;
    queryResult: QueryResult;
	query?: Query | QueryDescriptor;

	isContextMenuTarget?: boolean;
	minimumAxisWidth?: number;

    getActionMenuItems ?: () => JSX.Element[] | JSX.Element;
    getAxisValue?: (i: number) => any;
}
