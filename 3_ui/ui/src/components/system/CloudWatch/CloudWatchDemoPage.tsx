import * as css from './CloudWatchDemoPage.css';
import {ApplicationPage, bp, LoadingUntil, sem} from 'components';
import {observer} from 'mobx-react';
import { observable, autorun, computed, runInAction, action, makeObservable } from "mobx";
import {cloudwatch, settings} from 'stores';
import {AnchorButton, Button, Tooltip} from '@blueprintjs/core';
import Splitter from 'm-react-splitters';
import {AutoSizer} from 'react-virtualized'
import {CloudWatchTree} from './CloudWatchTree';
import {routing} from 'stores';
import {CloudWatchPageContext} from './CloudWatchPageContext';
import {CloudWatchDetails} from './CloudWatchDetails';
import {ActiveTool} from '../../../stores/site';

interface QueryString {
	group?: string;
	stream?: string;
}

interface MyProps {
	location?: HistoryModule.LocationDescriptorObject;
}

@observer
export class CloudWatchDemoPage extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

		makeObservable(this);

		cloudwatch.loadGroups();

		this._toDispose.push(
			autorun( () => {
				const {query: {group, stream}} = routing;
				runInAction(() => {
					this.pageContext.group  = group as string;
					this.pageContext.stream = stream as string;
				});
			}, {name: `Watch URL for changes`}))
	}

    _toDispose = [];

    componentWillUnmount() {
		this._toDispose.forEach(f => f());
		this.pageContext.dispose();
	}

    @observable pageContext   = new CloudWatchPageContext();
    splitter;
    tree: CloudWatchTree;

    // Set via query string

    @computed get settings() {
		return settings.pages.cloudWatchDemo;
	}

    render() {
		const {settings, settings: {splitLocation, sidebar}, tree, pageContext} = this;

		return (
			<ApplicationPage id="cloud-watch-demo-page"
			                 className={classNames(css.root)}
			                 title={() => 'Cloudwatch Logs (Demo)'}
			                 data-show-sidebar={sidebar}
			                 tool={ActiveTool.simulation}
			                 breadcrumbs={() => [
				                 <div key="bc" className={bp.Classes.BREADCRUMB}>
					                 <AnchorButton className={bp.Classes.MINIMAL} icon="lightbulb">Cloudwatch Logs (Demo)</AnchorButton>
				                 </div>
			                 ]}
			                 afterBreadcrumbs={() => [
				                 <Tooltip key="toggle-sidebar" content="Toggle Sidebar">
					                 <Button className={css.sidebarToggle} icon='menu' active={sidebar} onClick={() => settings.sidebar = !sidebar}/>
				                 </Tooltip>
			                 ]}>
				<LoadingUntil className={classNames("pusher")}
				              message={'Loading CloudWatch Group List...'}
				              loaded={cloudwatch.hasLoadedGroups}>
					<AutoSizer>
						{({width, height}) => {
							return (
								<div style={{width, height}} >
									<Splitter
										className={css.splitter}
										key="splitter"
										position="vertical"
										ref={s => this.splitter = s}
										primaryPaneMaxWidth="100%"
										primaryPaneMinWidth="20%"
										primaryPaneWidth={splitLocation}
										dispatchResize={true}

										onDragFinished={(e) => {
											settings.splitLocation = this.splitter.state.primaryPane;
										}}
										postPoned={false}>
										<CloudWatchTree context={pageContext}/>

										<LoadingUntil key="right-details"
										              className={css.contents} loaded={cloudwatch.hasLoadedGroups}>
											<CloudWatchDetails context={pageContext}/>
										</LoadingUntil>
									</Splitter>
								</div>)
						}}
					</AutoSizer>
				</LoadingUntil>
			</ApplicationPage>
		)
	}
}
