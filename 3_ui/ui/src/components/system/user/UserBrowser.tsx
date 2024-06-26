import {api, settings} from "stores";

import {SortableCardsPanel, dialogs, GridPanel, sem, bp, UserCard} from 'components';

import {observer} from 'mobx-react'
import {computed, observable, runInAction, action} from 'mobx'

interface MyProps {
	label?: string;
	className?: string;
	// allowDelete?: boolean;
	// allowSelection?: boolean;
	view?: 'table' | 'card';
	//onSelect?: (user: string[]) => void;
}

@observer
export class UserBrowser extends React.Component<MyProps, {}> {
	get preferences() { return settings.searchers.users }


	render() {
		const {preferences: prefs, props: {label, className,  view: propsView} }                          = this;
		const {users} = api.user;

		return <SortableCardsPanel renderCard={(user, panel) => <UserCard key={user.user_id} user={user} panel={panel}/>}
		                           cards={Array.from(users.values())}
		                           hideToolbar={propsView != null}
		                           view={propsView || prefs.view} onSetView={v => prefs.view = v}
		                           tableColumns={[
			                          {name: 'name'},
			                          {name: 'email', label: 'Email'},
		                          ]}/>
	}
}
