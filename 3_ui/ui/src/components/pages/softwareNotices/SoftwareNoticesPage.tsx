import { AnchorButton, Button, ButtonGroup, Classes, Divider, Callout, Dialog } from '@blueprintjs/core';
import { observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { AppIcon, bp, ApplicationPage, LoadingUntil } from 'components'
import {FormattedMessage} from 'react-intl';
import {appIcons, i18n, site, softwareNoticesStore} from 'stores';
import ReactMarkdown from 'react-markdown'
import allLicensesContent from './licensesInfo';

import * as css from './SoftwareNoticesPage.css';

@observer
export class SoftwareNoticesPage extends React.Component {
	static get APPLICATION_TITLE() { return i18n.intl.formatMessage({defaultMessage: "Software Legal Notices", description: "[SoftwareNoticesPage] the page title display on the browser tab, system application menu and the page's top-left button"}) }

    @observable.ref softwareNotices = [];
    @observable currentPage : string = '';
    @observable showCurrentLicense : string = '';

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    async componentDidMount() {
		const softwareNotices = (await softwareNoticesStore.loadSoftwareNotices()) || [];

		this.softwareNotices = softwareNotices;
		this.currentPage = softwareNotices && softwareNotices.length > 0 ? softwareNotices[0].displayName : '';
	}

    renderLicensesList(licenses) {
		return licenses.map((license) => (
				<a href="#" role="button" className={css.licenseLink} onClick={()=> this.showCurrentLicense = license
				}>
					{license}
				</a>
			)
		);
	}

    renderSoftwareNotices() {
		const { currentPage, softwareNotices } = this;
		const currentCategory = softwareNotices.find((category)=>category.displayName === currentPage);
		const libraries = currentCategory ? currentCategory.libraries : [];

		return libraries.map((library) => (
				<Callout key={library.library} title={library.library} className={css.libraryCallout}>
					<p className={css.license}>
						{this.renderLicensesList(library.licenses)}
					</p>
					{library.copyrights && library.copyrights.length > 0 &&
					<p className={css.copyright}>
						{library.copyrights.join(' ')}
					</p>}
					{library.notices &&
					<p className={css.notices}>
						<ReactMarkdown>{library.notices}</ReactMarkdown>
					</p>}
				</Callout>
			)
		);
	}

    renderPaginations() {
		const { currentPage, softwareNotices } = this;
		const lastIndex = softwareNotices.length - 1;
		return this.softwareNotices.map((category, index)=> {
			const { displayName } = category;
			return (
				<React.Fragment key={displayName}>
					<Button className={Classes.FIXED} onClick={this.changePage(displayName)} text={category.displayName} active={displayName === currentPage} value={displayName} />
					{ lastIndex !== index && <Divider /> }
				</React.Fragment>
			);
		});
	}

    changePage(newPage: string) {
		return () => {
			this.currentPage = newPage;
		};
	}

    render() {
		const { showCurrentLicense } = this;

		return (
			<ApplicationPage title={() => SoftwareNoticesPage.APPLICATION_TITLE} breadcrumbs={() => [
				<div key="bc" className={bp.Classes.BREADCRUMB}>
					<AnchorButton className={bp.Classes.MINIMAL} icon={<AppIcon icon={appIcons.tools.notices} />}>{SoftwareNoticesPage.APPLICATION_TITLE}</AnchorButton>
				</div>
			]}>
				<LoadingUntil loaded={!softwareNoticesStore.isLoading}>
					<div className={css.root}>
						<div className={css.header}>
							<h1>{SoftwareNoticesPage.APPLICATION_TITLE}</h1>
							<div>
								<FormattedMessage
									defaultMessage={"{productName} software products use or incorporate third party software and other copyright material that are subject to the acknowledgements and terms set out below."}
									description={"[SoftwareNoticesPage] description of this notice page. let user know they can find the materials below"}
									values={{productName: site.productName}}
								/>
							</div>
						</div>
						<div className={css.filter}>
							<FormattedMessage defaultMessage={"Quick Filters:"} description={"[SoftwareNoticesPage] Indicates a text before the quick filters"} />
							<ButtonGroup fill={true} minimal={true} className={css.filterButtonGroup}>
								{this.renderPaginations()}
							</ButtonGroup>
						</div>
						<div className={css.divider} />
						<ul className={css.libraryContainer}>
							{this.renderSoftwareNotices()}
						</ul>
					</div>
				</LoadingUntil>
				<Dialog isOpen={!!showCurrentLicense} onClose={()=> this.showCurrentLicense = ''} title={showCurrentLicense}>
					<div className={`${Classes.DIALOG_BODY} ${css.licenseContent}`}>
						<ReactMarkdown>{allLicensesContent[showCurrentLicense] ||''}</ReactMarkdown>
					</div>
				</Dialog>
			</ApplicationPage>);
	}
}
