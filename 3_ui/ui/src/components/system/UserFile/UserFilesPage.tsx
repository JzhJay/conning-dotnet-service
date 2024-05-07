import {ApplicationPage, ApplicationPopoverMenu, LoadingIndicator, sem, SimulationBrowser, SmartCard} from 'components';
import {RelatedObjectBrowser} from 'components/widgets/SmartBrowser/RelatedObjectBrowser';
import * as css from './UserFilesPage.css';
import {UserFileCard} from 'components/system/UserFile/UserFileCard';
import {UserFileUploadComponent} from 'components/system/UserFile/UserFileUploadComponent';
import {CSSProperties} from 'react';
import * as React from 'react';
import { observable, computed, autorun, runInAction, makeObservable } from 'mobx';
import {observer} from 'mobx-react'
import {appIcons, routing, settings, Simulation, site, UserFile, userFileStore, i18n} from 'stores';
import {ActiveTool} from 'stores/site';
import {UserFileBrowser} from './UserFileBrowser';
import {UserFileContextMenu} from './UserFileContextMenu';
import { i18nMessages } from './i18nMessages';

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	params?: { id?: string }
}

@observer
export class UserFilesPage extends React.Component<MyProps, {}> {
    _toDispose = [];
    @observable.ref loadError: Error;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
		const {_toDispose} = this;

		_toDispose.push(
			autorun(() => {
				const {userFileId: id} = this;
				runInAction(async () => {
					if (id && !userFileStore.userFiles.has(id)) {
						try {
							this.loadError = null
							await userFileStore.loadDescriptor(id);
						}
						catch (err) {
							site.raiseError(err, "userFile")
							this.loadError = err;
						}
					}
				});
			}, {name: 'Load user file if needed'}));
	}

    componentWillUnmount() {
		this._toDispose.forEach(d => d());
	}

    get preferences() {
		return settings.searchers.userFile
	}

    @computed
	get userFile(): UserFile {
		return this.userFileId ? userFileStore.userFiles.get(this.userFileId) : null;
	}

    @computed
	get userFileId() {
		return this.props.params.id
	}

    @computed
	get isBrowser() {
		return this.userFileId == null;
	}

    @observable uploadFile: boolean = false;
    fileBrowser: UserFileBrowser = null;

    refresh = () => {
		this.fileBrowser.catalogContext.refresh();
	}

    render() {
		const {props: {location}, userFile, isBrowser} = this;
		const showActiveSessions = routing.query.activeSessions != null;

		const userFileUploaderContainerStyle: CSSProperties = {
			position:'absolute',
			top: 0,
			left: 0,
			width: 0,
			height: 0
		}

		return (
			<ApplicationPage id="user-files-page"
			                 className={classNames({[css.specificUserFile]: this.userFileId != null})}
			                 tool={ActiveTool.userFile}
			                 title={() => i18n.intl.formatMessage(i18nMessages.userFileBrowser)}
			                 applicationButtonText={() => i18n.intl.formatMessage(i18nMessages.userFileBrowser)}
			                 breadcrumbs={() => {

				                 let result = [];
				                 result.push(<ApplicationPopoverMenu/>)

				                 if (this.fileBrowser && !_.isEmpty(this.fileBrowser.catalogContext.path)) {
					                 this.fileBrowser.panel.addToBreadcrumbs(result);
				                 }

				                 return result;
			                 }}
			                 renderApplicationMenuItems={() => <UserFileContextMenu pageRef={this} />}>
				<div style={userFileUploaderContainerStyle}>
					<UserFileUploadComponent
						windowMode={true}
						windowActive={this.uploadFile}
						dropEnabled={!this.uploadFile}
						showChooseTypeItems={this.uploadFile}
						onClose={() => {this.uploadFile = false;}}
						onRefresh={this.refresh}
					/>
				</div>
				{
					(isBrowser || !userFile) ?
					<UserFileBrowser ref={r => this.fileBrowser = r} queryParams={location.query} multiselect onSelect={this.browser_onSelect}/> :
					<RelatedObjectBrowser model={userFile} defaultRelatedObjectTypes={[Simulation.ObjectType]} />
				}

			</ApplicationPage>)
	}

    browser_onSelect = () => {
	}
}
