import * as css from './UserCard.css'
import type {JuliaUser} from 'stores';
import {appIcons, user as userStore} from 'stores';
import {observer} from 'mobx-react'
import {computed, observable, runInAction} from 'mobx'
import {sem, SmartCard, SortableCardsPanel} from 'components';

interface MyProps {
	user?: JuliaUser;
	isTooltip?: boolean;
	sortBy?: string;
	style?: React.CSSProperties;
	className?: string;
	panel?: SortableCardsPanel;
}

@observer
export class UserCard extends React.Component<MyProps, {}> {
	render() {
		const {props: {style, className, panel, isTooltip, user, user: {fullName, email, created_at, last_login, picture}}} = this;

		const {Card, Segment, Icon, List} = sem;
		const icons                       = appIcons.cards;

		return (
			<SmartCard style={style}
			      className={classNames(css.root, className)}
			      icon={<img src={picture} className={css.userPicture}/>}
			      panel={panel}
			      title={{name: 'name'}}
			      to={userStore.clientUrlFor(user)}
			      sections={[
				              {
					              tags: [
						              {name: 'email', label: 'E-mail', icon: icons.email},
						              {label: 'Creation Date', icon: icons.date, name: 'created_at'},
						              {label: 'Last Login', icon: icons.date,  name: 'last_login'},
					              ]
				              }
			              ]}
			      model={user}
			/>);
	}
}
