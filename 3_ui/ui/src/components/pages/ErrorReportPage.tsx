import {Icon, Message} from 'semantic-ui-react';
import * as css from './ErrorReportPage.css';
import {site, routing} from 'stores'
import {ErrorMessage, ApplicationPage, sem} from 'components'
import {observer} from 'mobx-react';

@observer
export class ErrorReportPage extends React.Component<{}, {}> {
	componentDidMount() {
		if (site.errors.length == 0) {
			routing.push(routing.urls.home)
		}
	}

	componentWillUnmount() {
		site.errors.clear();
		site.errorPageMessage = null;
	}
	render() {
		const {errors, errorPageMessage} = site;

		return (
			<ApplicationPage className={css.root} title={() => 'System Error'}>
				<Message icon negative error>
					<Message.Content>
						<Message.Header>
							<Icon name='warning sign'/>
							{errorPageMessage ? errorPageMessage : 'An error has occured'}</Message.Header>
						<Message.List>
							{errors.reverse().map((e,i) => <sem.Message.Item key={i.toString()}>{e.message}</sem.Message.Item>)}
						</Message.List>
					</Message.Content>
				</Message>
			</ApplicationPage>);
	}
}
