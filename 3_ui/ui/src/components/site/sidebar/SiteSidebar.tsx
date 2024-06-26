/* Todo / Nice to Haves

 Make it resizable:  https://github.com/DanFessler/react-panelgroup
 */

import {observer} from 'mobx-react';
import * as css from './SiteSidebar.css';
import {SidebarSimulationsPanel, SidebarQueryPanel, ToggleSidebarButton, ActiveWorkspacePanel, SidebarWorkspacePanel} from './';
import {site, SidebarView, sidebar, SidebarViewMode} from 'stores';
import {sem} from 'components';

import {SidebarTree} from './tree/SidebarTree';
import {SidebarAdminPanel} from './admin-panel/SidebarAdminPanel';
import {SidebarResizer} from './SidebarResizer';
import {SidebarReportsPanel} from './reports/SidebarReportsPanel';
import {observable} from 'mobx';
import {SidebarPanel} from './SidebarPanel';

@observer
export class SiteSidebar extends React.Component<{activeTab}, {}> {

	render() {
		const {activeTab} = this.props;
		const {currentView, viewMode} = sidebar;

		const panels = {
			workspace:   <SidebarWorkspacePanel key="workspace"/>,
			simulation:  <SidebarSimulationsPanel key="sims"/>,
			query:       <SidebarQueryPanel key="queries"/>,
			report:      <SidebarReportsPanel key="reports"/>,
			settings:       <SidebarAdminPanel key='admin'/>
		}
		
		// let panels = {
		// 	[SidebarView.tree]:        <SidebarTree key="tree"/>,
		// 	//[SidebarView.ActiveWorkspace]: <ActiveWorkspacePanel key="active-workspace"/>,
		// 	[SidebarView.workspace]:   <SidebarWorkspacePanel key="workspace"/>,
		// 	[SidebarView.simulation]:  <SidebarSimulationsPanel key="sims"/>,
		// 	[SidebarView.query]:       <SidebarQueryPanel key="queries"/>,
		// 	[SidebarView.queryResult]: <SidebarQueryResultsPanel key="results"/>,
		// 	[SidebarView.report]:      <SidebarReportsPanel key="reports"/>,
		// 	[SidebarView.admin]:       <SidebarAdminPanel key='admin'/>
		// }

		let views = [
			/*SidebarView.tree, */
			SidebarView.report,
			SidebarView.simulation,
			SidebarView.query,
			//SidebarView.queryResult,
			SidebarView.admin
		];

		return (
			<sem.Sidebar visible={sidebar.show}
			         animation="push"
			         style={{width: sidebar.width}}
			         className={css.sidebar}>
				<sem.Menu vertical>
					{panels[activeTab]}

					{/*{false && <SidebarPanel icon={<sem.Icon name="database"/>}*/}
					                        {/*showChooser*/}
					                        {/*title={SidebarView[currentView]}*/}
					{/*/> }*/}

					{/*{viewMode == SidebarViewMode.accordion && views.map(v => panels[v])}*/}
					{/*{viewMode == SidebarViewMode.chooser && currentPanel}*/}
					{/*{viewMode == SidebarViewMode.chooser && panels[SidebarView.ActiveWorkspace]}*/}
				</sem.Menu>

				{sidebar.show && <SidebarResizer/>}

			</sem.Sidebar>
		)
	}
}
