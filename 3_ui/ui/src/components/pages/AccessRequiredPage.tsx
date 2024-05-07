import * as css from './AccessRequiredPage.css';
import {site, user, routing} from 'stores'
import {when} from 'mobx'
import {ErrorMessage, ApplicationPage} from 'components'

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
}

export class AccessRequiredPage extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

		site.setPageHeader('Access Denied');

		if (user.isLoggedIn) {
			const {returnUrl} = this;

			if (returnUrl) {
				routing.push(returnUrl);
			}
			else {
				routing.push(routing.urls.home);
			}
		}
	}

	get returnUrl() { return this.props.location.query['returnUrl']; }

	render() {
		const {returnUrl} = this;

		return (
			<ApplicationPage className={css.root}>
				<div>
					You must be <a onClick={() => user.login()}>logged in</a> to view {returnUrl ? (<a href={returnUrl}>{returnUrl}</a>) : 'the page you were on.'}
				</div>
			</ApplicationPage>
		);
	}
}
