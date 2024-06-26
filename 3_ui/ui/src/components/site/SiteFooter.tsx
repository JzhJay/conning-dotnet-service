import {Link} from 'react-router';
import * as css from './SiteFooter.css'
import {api, user, site} from 'stores';
import {AnchorButton} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {bp} from 'components';

@observer
export class SiteFooter extends React.Component<{}, {}> {
	render() {
		const {site: {activeTool}} = api;

		return (<div className={css.siteFooter}>
			{/*<div className={css.appSection}><AppIcon icon={api.appIcons.query}/>Query Tool</div>*/}

			{activeTool && activeTool.renderFooter && activeTool.renderFooter()}

			<div className={css.fill}/>

			{DEV_BUILD && <div>
					<label>Branch:</label>
					<span className={css.gitBranch}>{GIT_BRANCH.replace('feature/', '')}</span>

					{/*<Button icon="lightbulb" title="TeamCity" href={`http://${GIT_BRANCH.replace('feature/', '')}.advise-conning.com`} />*/}
			</div>}

			<div>
				<label>Revision:</label>
				<span>{GIT_COMMIT}</span>
			</div>

			{DEV_BUILD &&
			<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
				<AnchorButton text="DevSite" rightIcon="pulse" target="_blank" href={`http://${GIT_BRANCH.replace('feature/', '')}.advise-conning.com`}/>
				<AnchorButton text="Commits" rightIcon="git-branch" target="_blank"
				              href={`https://git.advise-conning.com/projects/AD/repos/advise/commits?until=refs%2Fheads%2F${GIT_BRANCH.replace('/', '%2F')}`}/>
			</div>}

			{/*<div><span>Built on: {BUILD_PLATFORM}</span></div>*/}

			{/*<div>Environment:<span>{NODE_ENV}</span></div>*/}
			{/*<div>Sprint:<span>{SPRINT}</span></div>*/}


			<div>
				<Link to={`/release-notes?version=${VERSION}`}
				      className={css.gitVersion}>{VERSION}</Link>
			</div>
			<div>
				{site.copyrightNotice}
			</div>
			<div>
				<div className={css.product}>{site.productName}</div>
			</div>
		</div>)
	}
}

