import {bp, sem, ApplicationPage, SimulationBrowser, QueryBrowser} from 'components'
import {api, ActiveTool} from 'stores';

import * as css from './WorkspacePage.css';

export class WorkspacePage extends React.Component<{}, {}> {
	render() {
		return (
			<ApplicationPage className={css.root}>


			</ApplicationPage>)
	}

	componentDidMount() {
		const {site} = api;


		site.activeTool = {
			tool: null,
			tag:  null
		}
	}
}

