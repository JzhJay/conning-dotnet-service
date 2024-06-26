import type {IconName} from '@blueprintjs/core';
import { SidebarTreeNode } from 'components/site/sidebar/tree/SidebarTreeNode';
import { Link, Report, ReportPage} from 'stores';
import { bp } from 'components';
import { autorun} from 'mobx';
import { ReportItemNode } from "./ReportItemNode";

export class ReportPagesNode extends SidebarTreeNode {
	constructor(public report: Report) {
		super(
			{
				id: 'pages',
				label: '',
				isExpanded: true,
				secondaryLabel: (
					<bp.Tooltip  content="Add a Page">
						<bp.AnchorButton minimal icon="plus" onClick={() => report.addPage()}/>
					</bp.Tooltip>)
			});

		this._toDispose.push(
			autorun( () => {
				this.icon = this.isExpanded ? 'folder-open' : 'folder-close';
				this.label = <Link to={this.url}>Pages
					({report.pages.length})</Link>;
				this.childNodes = report.pages.map((page: ReportPage) => new ReportPageNode(page));
			}, {name: `Update Report Pages Treenode`}))
	}

	get url() {
		return this.report.clientUrl
	}
}

export class ReportPageNode extends ReportItemNode {
	icon : IconName = "document" as IconName;
	canRename = true;
}
