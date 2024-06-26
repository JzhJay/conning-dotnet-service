import * as css from './ReleaseNotesPage.css';
import {site, ActiveTool} from 'stores'
import {ApplicationPage} from 'components'
import {observer} from 'mobx-react';
import ReactMarkdown from 'react-markdown'

const releaseNotes = require('../../../../release-notes.md') as {default: string};
const buildDate = new Date(parseInt(BUILD_UTC_TIME)); 

@observer
export class ReleaseNotesPage extends React.Component<{}, {}> {
	constructor(props) {
		super(props);

		site.setPageHeader('Release Notes');
		site.activeTool = {
			tool                 : ActiveTool.preferences,
			title                : () => 'Release Notes',
			renderTitle          : () => 'Release Notes',
			applicationButtonText: () => 'Release Notes'
		}
	};

	render() {
		/* With inspiration from https://get.slack.help/hc/en-us/articles/115004846068-Slack-updates-and-changes */
		console.log(releaseNotes)
		return (
			<ApplicationPage className={css.root}>
				{/*<span className={css.title}>Changelog</span>
				<span className={css.subtitle}>{PRODUCT} updates and changes</span>
*/}
				<ReactMarkdown className={css.markdown}>{releaseNotes.default}</ReactMarkdown>
				<div className={css.buildDate}>Build Date: {buildDate.toString()}</div>
			</ApplicationPage>);
	}
}
