import {FormattedMessage} from 'react-intl';
import {ApplicationPage, bp, AppIcon, dialogs} from 'components'
import {dashboardTypeSettings} from 'components/pages/dashboard/DashboardTypeSettings';
import {observer} from 'mobx-react';
import {user, appIcons, routing, SUPPORT_EMAIL, Simulation, Query, IO, ClimateRiskAnalysis, UserFile, site, rsSimulationStore, i18n} from 'stores';
import * as css from './DashboardPage.css';
import {DashboardPanel, RecentPanel} from './DashboardPanel';

@observer
export class DashboardPage extends React.Component<{}, {}> {

	render() {
		const {enableGEMSOnlyMode} = user;

		return (
			<ApplicationPage loaded={user.isLicenseLoaded} title={() => i18n.intl.formatMessage({defaultMessage: 'Dashboard', description: 'Dashboard Title'})}>
				<div className={css.root}>
					<div className={classNames([css.container])}>
						<div className={classNames([css.left, css.dashboardPanels])}>
							{dashboardTypeSettings.get().map((setting, i) => {
								if (!setting || !setting.applicable) {
									return null;
								}
								return <div key={`${setting.type}_${i}`} className={css.block}><DashboardPanel setting={setting} /></div>
							})}
						</div>

						<div className={css.center}>
							{!enableGEMSOnlyMode && !site.isOnPrem &&
								<div className={css.block}>
									<div className={css.header}>
										<div className={css.iconRound}><AppIcon icon={appIcons.tools.billing}></AppIcon></div>
										<h3><FormattedMessage defaultMessage="Billing" description="Billing Card Title" /></h3>
										<div className={css.headerRight}>
											<bp.Button text={<FormattedMessage defaultMessage="Report..." description="View Billing Report" />} className={css.roundBtn} onClick={()=> routing.push(routing.urls.billing)} />
										</div>
									</div>
								</div>
							}
							<div className={css.block}>
								<div className={css.header}>
									<div className={css.iconRound}><AppIcon icon={{type: 'blueprint', name: 'envelope'}}></AppIcon></div>
									<h3><FormattedMessage defaultMessage="Support" description="Customer Support" /></h3>
									<div className={css.headerRight}>
										<bp.Button text={<FormattedMessage defaultMessage="Contact Us" description="Contact Supprt" />} className={css.roundBtn} onClick={dialogs.support} />
									</div>
								</div>

							</div>
						</div>
						<div className={css.right}>
							<div className={css.block}>
								<RecentPanel />
							</div>
						</div>
					</div>
				</div>
			</ApplicationPage>)
	}
}

