import { QueryDescriptor, appIcons, Link } from "stores";
import {QueryCard, AppIcon, bp} from 'components';
import * as css from './QueryListItem.css';
import { QueryContextMenu } from "./query-builder";

@bp.ContextMenuTarget
export class QueryListItem extends React.Component<{query: QueryDescriptor} & bp.IPopoverProps, {}> {
	render() {
		const {query, ...props} = this.props;

		return <bp.Popover className={classNames('item', css.root, props.className)} {...props}
		                 interactionKind={bp.PopoverInteractionKind.HOVER}
		                 content={<QueryCard query={query} isTooltip />}>
	             <span>
		             <AppIcon icon={appIcons.cards.query.cardIcon}/><Link to={query.clientUrl}>{query.name}</Link>
	             </span>
		</bp.Popover>;
	}

	renderContextMenu() {
		debugger;
		return <QueryContextMenu {...this.props} />
	}
}