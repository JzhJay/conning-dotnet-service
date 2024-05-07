import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {julia} from 'stores/julia';
import * as css from './InstallerDownloadPage.css'
import {observer} from 'mobx-react';
import {bp, sem, ApplicationPage, LoadingUntil} from 'components'
import {user, xhr, routing, site, i18n} from 'stores'
import { computed, observable, when, IReactionDisposer, makeObservable } from 'mobx';
import {AnchorButton, Button, Card, HTMLTable} from '@blueprintjs/core';

@observer
export class InstallerDownloadPage extends React.Component<{}, {}> {

	static get APPLICATION_TITLE() { return i18n.intl.formatMessage({defaultMessage: 'Installer Download', description: "[InstallerDownloadPage] the page title display on the browser tab, system application menu and the page's top-left button"}) }

    @observable versionList: string[];

    @observable displayAllVersions: boolean = false;

    _disposers: IReactionDisposer[] = [];

    constructor(props: {}) {
        super(props);
        makeObservable(this);
    }

    componentDidMount(): void {
		if (user.license) {
			this.updateVersionList();
		} else {
			this._disposers.push(
				when(() => !!user.license,
				() => {
					this.updateVersionList();
				})
			);
		}
	}

    componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

	updateVersionList() {
		// NOTE: for more information on julia.installerUrl:
		// see julia/packages/RestApi.jl/src/routes/v1/windowsec2manager.jl:47
	    //   @route GET    "/v1/software/:product"                          req->versions_available(req)
		// see julia/packages/WindowsEC2Manager.jl/src/software.jl:6
		//   function versions_available(product::AbstractString)
		// This gets filtered by the available_software.json file in the Legacy Advise Bucket in s3 if present
		// see julia/packages/ResourceInventory.jl/scripts/get_available_software_json.sh
		// to get the list of avaliable software spec'ed for each stack/customer.
		xhr.get<string[]>( julia.installerUrl).then( (result) => {
			this.versionList = ( result || [] ).sort( (a , b) => {
				let aVerArray = a.split('.');
				let bVerArray = b.split('.');
				for (let i = 0 ; i < Math.min(aVerArray.length, bVerArray.length) ; i++ ){
					if ( aVerArray[i] == bVerArray[i]) {
						continue;
					}
					return parseInt(bVerArray[i]) - parseInt(aVerArray[i]);
				}
				return bVerArray.length - aVerArray.length;
			});
		});
	}

    @computed get isLoading() {
		return this.versionList == null;
	}

    download = (version?) => {
		if (KARMA) {
			return;
		}  // Always treat as authenticated
		julia.downloadInstaller(version||this.versionList[0]);
	}

    render() {
		const applicationPageTitle = InstallerDownloadPage.APPLICATION_TITLE;
	    const downloadBtnText = i18n.intl.formatMessage({defaultMessage: 'Download', description: "[InstallerDownloadPage] download application button text"});

	    const drawerTriggerOn = i18n.intl.formatMessage({defaultMessage: 'Older Versions', description: "[InstallerDownloadPage] drawer trigger, will show the older version application download links"});
	    const drawerTriggerOff = i18n.intl.formatMessage({defaultMessage: 'Hide', description: "[InstallerDownloadPage] drawer trigger, will hide the older version application download links"});

		return <ApplicationPage className={css.root}
				                title={() => applicationPageTitle}
				                loaded={user.isLoggedIn && user.currentUser}
				                breadcrumbs={() => [
				                	<div key="bc" className={bp.Classes.BREADCRUMB}>
						                <AnchorButton className={bp.Classes.MINIMAL} icon="download">{applicationPageTitle}</AnchorButton>
					                </div>
				                ]}>

			<LoadingUntil className={css.details} loaded={!this.isLoading}>
				{!this.isLoading && <>
					{this.versionList.length == 0 && <sem.Message icon floating success>
						<sem.Icon size="large" name="exclamation circle" />
						<br/>
						<sem.Message.Content>
							<sem.Message.Header>
								<FormattedMessage
									defaultMessage={"There has no {productName} installer available."}
									values={{productName: site.productName}}
									description={"[InstallerDownloadPage] Indicates no installer available"}
								/>
							</sem.Message.Header>
							<sem.Message.List>
								<sem.Message.Item>
									<FormattedMessage defaultMessage={"Please"} description={"[InstallerDownloadPage] Indicates return homepage messages - before the link"} />
                                    &nbsp;
									<a href={routing.urls.home}>
										<FormattedMessage defaultMessage={"click here"} description={"[InstallerDownloadPage] Indicates return homepage messages - link text"} />
									</a>
                                    &nbsp;
									<FormattedMessage defaultMessage={"to get back to the homepage."} description={"[InstallerDownloadPage] Indicates return homepage messages - after the link"} />
								</sem.Message.Item>
							</sem.Message.List>
						</sem.Message.Content>
					</sem.Message>}

					{this.versionList.length > 0 && <div id="hero-block" className={css.hero}>
						<div className={css.card}>
							<div className={css.title}>
								<FormattedMessage
									defaultMessage={"{productName} Installer"}
									values={{productName: site.productName}}
									description={"[InstallerDownloadPage] Indicates page banner of this page"}
								/>
							</div>
							<Button className={css.downloadBtn} onClick={ () => this.download() } large={true}>
								<div className={css.btnLargeText}>
									<FormattedMessage defaultMessage={"Download latest version"} description={"[InstallerDownloadPage] Indicates download latest version link button"} />
								</div>
								<div className={css.version}>{this.versionList[0]}</div>
							</Button>
						</div>
					</div>}
					{this.versionList.length > 1 && <div className={css.versionBlock}>
						<Card className={css.versionBlockInner}>
							{this.displayAllVersions && <div className={css.versionList}>
								<HTMLTable interactive={true}>
									<thead><tr><th colSpan={2}>{drawerTriggerOn}</th></tr></thead>
									<tbody>{
										this.versionList.filter((v,i) => { return i > 0; } ).map( (v) => <tr key={v}>
											<td className={css.versionCell}>{v}</td>
											<td>
												<Button onClick={ () => this.download(v) } text={downloadBtnText} small={true}/>
											</td>
										</tr> )
									}</tbody>
								</HTMLTable>
							</div> }
							<Button className={css.versionToggle} onClick={() => this.displayAllVersions = !this.displayAllVersions} text={this.displayAllVersions ? drawerTriggerOff : drawerTriggerOn} minimal={true}/>
						</Card>
					</div>}
				</>}
			</LoadingUntil>

		</ApplicationPage>
	}
}
