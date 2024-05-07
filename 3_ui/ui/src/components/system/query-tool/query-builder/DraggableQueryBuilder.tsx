import * as css from './DraggableQueryBuilder.css'
import {LoadingUntil} from 'components';
import {api} from 'stores/index';
import {QueryOptions, Query} from 'stores/query'

import {QueryDragPreview} from './QueryDragPreview'
import {QueryBuilder} from './QueryBuilder';
import { observer } from 'mobx-react'
import { computed, makeObservable } from 'mobx';

/**
 * Move storing queries into a store via a lookup table
 * Don't rely upon any report store access
 * Strip out any report specific props
 *
 */
interface MyProps extends React.CSSProperties {
	name?: string;
	isLayoutDragging?: boolean;
	onUpdateUserOptions?: (userOptions: QueryOptions)=>void;
	queryId?: string;

	onLoaded?: () => void;

	/**
	 * The query builder may be contained by a report item, in which case when the query is created
	 * we need to update the report item to point to the new GUID.
	 * @param query
	 */
	onQueryUpdated?: (query?: Query) => void;
}

@observer
export class DraggableQueryBuilder extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const {queryId, onLoaded, isLayoutDragging, name, onQueryUpdated, children, ...props} = this.props;
		const {simulations} = api.simulationStore;
		const {query} = this;
		const loaded = simulations != null && (query != null || queryId == null);

		return (
			<div className={classNames(css.queryBuilderComponent, {[css.isRunnning]: query && query.isRunning})}>
				<LoadingUntil key="loader" loaded={loaded} onLoad={onLoaded}
				              message={!simulations ? "Loading Simulations..." : `Loading query...`}>
					{loaded ? <QueryDragPreview key="drag" query={query} isLayoutDragging={isLayoutDragging} name={name}/> : null}
					{loaded ? <QueryBuilder key="definition" query={query} isLayoutDragging={isLayoutDragging} onQueryUpdated={onQueryUpdated}/> : null}
				</LoadingUntil>
			</div>)
	}

    @computed get query() {
		return api.queryStore.querySessions.get(this.props.queryId);
	}
}
