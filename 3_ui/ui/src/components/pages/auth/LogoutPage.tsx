import { user, routing, site } from 'stores';
import { ApplicationPage, sem } from 'components';
import { AnchorButton } from "@blueprintjs/core";
import * as css from './LogoutPage.css';

export class LogoutPage extends React.Component<{isAction?: boolean}, any> {
	componentDidMount() {
		if (user.isLoggedIn) {
			routing.replace(routing.urls.home)
		}

		const {isAction} = this.props;

		// Todo - forward to landing page with a toast instead
		site.setPageHeader(`You ${isAction ? 'have' : 'are'} Logged Out`)
	}

	render() {
		const {isAction} = this.props;
		return (
			<ApplicationPage className={classNames(css.root, "ui segment")}>
				<sem.Message icon floating success>
					<sem.Icon size="large" name="power" />
					<sem.Message.Content>
						<sem.Message.Header>You have logged out of {`${site.productName}`}</sem.Message.Header>

						{/* How do you detect if you are really still logged in to google?  Also, why do we care? */}

						<sem.Message.List>
							<sem.Message.Item>
								<a onClick={() => user.login()}>Click here</a> to log back in
							</sem.Message.Item>

							{/*<sem.Message.Item>*/}
								{/*<AnchorButton href={"https://www.google.com/accounts/Logout"} text="Log out of Google"/>*/}
							{/*</sem.Message.Item>*/}

							{/*<sem.Message.Item>*/}
								{/*<AnchorButton href={""} text="Remain Logged in to Google"/>*/}
							{/*</sem.Message.Item>*/}

						</sem.Message.List>
					</sem.Message.Content>
				</sem.Message>
			</ApplicationPage>
		)
	}
}

