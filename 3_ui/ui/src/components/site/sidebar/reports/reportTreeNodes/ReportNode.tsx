import type {IconName} from '@blueprintjs/core';
import { SidebarTreeNode } from 'components/site/sidebar/tree/SidebarTreeNode';
import { Link, Report, appIcons, ReportDescriptor, settings, routing,reportStore } from 'stores';
import { bp, mobx } from 'components';
import { autorun, computed, observable } from 'mobx';
import { ReportItemNode, ReportDescriptorTreeNode } from "./";

export class ReportNode extends ReportItemNode {
	icon : IconName = 'book' as IconName;
	isExpanded = true;
	canRename = true;
}

export class ReportsTreeNode extends SidebarTreeNode {
	constructor() {
		super({ id: 'reports', label: '', icon: 'book' });

		this.isExpanded = true;

		this._toDispose.push(
			autorun( () => {
				this.label = <Link to={this.url}>Reports
					({!reportStore.hasLoadedDescriptors ? 'loading...' : reportStore.descriptors.size})</Link>;


				const { loadedReports, descriptors } = reportStore;

				const loaded = mobx.values(loadedReports);

				let reports = settings.sidebar.reports.filter
					? loaded
					: [...loaded, ...mobx.values(descriptors).filter(s => !loadedReports.has(s.id))];

				reports = _.orderBy(reports,
				                    ['loading', 'isActivePage', 'name'],
				                    ['desc', 'desc', 'asc']
				);

				this.childNodes = reports.map(
					(r: ReportDescriptor | Report) => {
						if (r instanceof ReportDescriptor) {
							return new ReportDescriptorTreeNode(r);
						}
						else if (r instanceof Report) {
							return new ReportNode(r);
						}
					});
			}, {name: `Update Report Treenode`}))
	}

	get url() {
		return routing.urls.reportBrowser
	}
}