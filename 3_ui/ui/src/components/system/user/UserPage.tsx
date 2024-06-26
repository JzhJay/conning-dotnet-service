import {sem, bp, LoadingIndicator, ApplicationPage, QueryBrowser, ErrorMessage, SimulationBrowser, UserCard, dialogs} from 'components';
import {site, appIcons, settings, user as userStore} from 'stores';
import { observable, computed, autorun, reaction, makeObservable } from 'mobx';
import {observer} from 'mobx-react'
import {UserBrowser} from './UserBrowser';
import type {JuliaUser} from 'stores';
import {ActiveTool, mobx} from 'stores';

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	params?: { id?: string }
}

@observer
export class UserPage extends React.Component<MyProps, {}> {
    _toDispose = [];

    constructor(props) {
        super(props);

        makeObservable(this);
    }

    componentDidMount() {
		const {_toDispose} = this;
		_toDispose.push(
			autorun(() => {
				const {user, userId: id, isBrowser, isCreating} = this;

				site.activeTool = {
					tool: ActiveTool.user,
					title: () => 'Users',
					tag:  () => this.user
				};
			}, {name: `Sync site header (Users Page)`}))
	}

    componentWillUnmount() {
		this._toDispose.forEach(d => d());
	}

    get preferences() { return settings.searchers.simulation }

    @computed
	get user(): JuliaUser {
		return this.userId ? mobx.values(userStore.users).find(u => u.email == this.userId) : null;
	}

    @computed
	get userId() {
		return this.props.params.id
	}

    @computed
	get isBrowser() {
		return this.userId == null
	}

    render() {
		const {isBrowser, user} = this;

		//!api.julia.connected
		return (
			<ApplicationPage id="simulations-page">
				{userStore.loading ? <LoadingIndicator/>
					: isBrowser
					 ? <UserBrowser/>
					 : <div>
						  {user ? <UserCard user={user}/>
							  : !userStore.hasLoadedUsers
							   ? <LoadingIndicator text={"Loading User Profile..."}/>
							   : <ErrorMessage message={`Unable to find user '${this.userId}'`}/>}

						  {user && this.renderAssociatedUserObjects()}
					  </div>
				}
			</ApplicationPage>)
	}

    renderAssociatedUserObjects = () => {
		const {user} = this;

		if (!user) return null;

		return <div className={classNames(bp.Classes.CARD, bp.Classes.INTERACTIVE)} style={{flexGrow:1, padding:5}}>
			<bp.Tabs  vertical renderActiveTabPanelOnly id="associated">
				<bp.Tab id="sims" title="Simulations" panel={<SimulationBrowser/>}/>
				<bp.Tab id="query" title="Queries" panel={<QueryBrowser/>}/>
			</bp.Tabs>
		</div>
	}

    @observable isCreating = false;
}
