import * as css from './SidebarAdminPanel.css';

import {observer} from 'mobx-react';
import {routing} from 'stores';
import {Simulation} from 'stores/simulation';
import {Link} from "react-router";
import {sem, dialogs} from 'components';
import { observable, action, makeObservable } from 'mobx';

@observer
export class SidebarAdminPanel extends React.Component<{}, {}> {
    @observable renamingSim: Simulation;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {urls} = routing;

		const iconographyActive = routing.isActive(urls.iconography);
		const preferencesActive = routing.isActive(urls.preferences);
		const userActive = routing.isActive(urls.userBrowser);

		return (
			<sem.Menu.Item key="sidebar-admin" className={classNames(css.root)} active={userActive || iconographyActive || preferencesActive}>
				<sem.Menu.Header>
					<Link className="ui fluid" to={urls.preferences}><sem.Icon name="settings"/> Administration</Link>
				</sem.Menu.Header>
				<sem.Menu vertical>
					<sem.Menu.Item active={iconographyActive} as={Link} to={urls.iconography} icon="fonticons" content="Iconography" />
					<sem.Menu.Item active={userActive} as={Link} to={urls.userBrowser} icon="users" content="Users" />
					<sem.Menu.Item icon="wrench" active={preferencesActive} as={Link} to={urls.preferences} content="Preferences" />
				</sem.Menu>
			</sem.Menu.Item>
		)
	}
}