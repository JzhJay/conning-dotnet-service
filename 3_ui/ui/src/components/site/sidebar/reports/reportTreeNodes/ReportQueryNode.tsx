import { SidebarTreeNode, SidebarTreeNodeType } from 'components/site/sidebar/tree/SidebarTreeNode';
import { appIcons, ReportQuery} from 'stores';
import { AppIcon, QueryCard} from 'components';
import { autorun} from 'mobx';
import * as css from './ReportTreeNode.css';
import { ReportItemNode } from "./ReportItemNode";
import { observer } from "mobx-react";

export class ReportQueryNode extends ReportItemNode {
	className = css.queryViewTreeNode;

	constructor(public item: ReportQuery) {
		super(item);

		this._toDispose.push(autorun(() => {
			const { name, view, queryId, query, queryResult: qr } = this.item;

			let iconView = qr ? qr.currentView : 'query';

			//this.icon = <AppIcon key={view} icon={appIcons.queryTool.views[iconView]}/>
			this.setupInfoTooltip(query ? () => <QueryCard query={query} isTooltip/> : null);
		}))
	}
}
