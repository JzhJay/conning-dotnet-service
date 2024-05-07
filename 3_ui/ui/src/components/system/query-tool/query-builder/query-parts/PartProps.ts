import {Query, QueryAxis, AxisCoordinate, QueryOptions, QueryPart} from 'stores/query';

export interface PartProps {
	part?: QueryPart;
    query: Query;
    onUpdateUserOptions?:(userOptions:QueryOptions)=>void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>, superPanel: QueryPart, accordionPanelPart: 'axis' | 'coordinates', axis: QueryAxis, values?: AxisCoordinate[]) => void;
}
