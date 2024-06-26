import {bp} from 'components';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {i18n} from 'stores';
import {Repository} from 'stores/respository';
import * as css from './RepositoryMessagesView.css';
import {Switch, Checkbox, InputGroup, Button} from '@blueprintjs/core';
import {Loader} from 'semantic-ui-react';


interface MyProps {
	repository: Repository
}

@observer
export class RepositoryMessagesView extends React.Component<MyProps, {}> {

	messageBlock = (level: 'E'|'W') => {
		const {repository: {messages}} = this.props;

		const messageType = level == 'E' ?
		                    i18n.intl.formatMessage({defaultMessage: "Error", description: "[RepositoryMessagesView] the type of the failure message"}) :
		                    i18n.intl.formatMessage({defaultMessage: "Warning", description: "[RepositoryMessagesView] the type of the failure message"});

		return <>{_.map(
			_.filter(messages, msg => msg.code == level),
			(msg, i) => {
				const rowInfo = msg.rowNumber >= 0 ? i18n.intl.formatMessage({defaultMessage: `in row {row}`, description: "[RepoTool] row information in the failure message"}, {row: msg.rowNumber}) : "";
				const colInfo = msg.columnName != "" ? i18n.intl.formatMessage({defaultMessage: `in column {col}`, description: "[RepoTool] column information in the failure message"}, {col:msg.columnName}) : "";
				const fileInfo = msg.fileName != "" ? i18n.intl.formatMessage({defaultMessage: `in file {file}`, description: "[RepoTool] file information in the failure message"}, {file:msg.fileName}) : "";
				return <div className={css.error} key={`${level}${i}`}>
					{`${messageType}: ${msg.message} ${rowInfo} ${colInfo} ${fileInfo}`}
				</div>
			}
		)}</>
	}

	render() {
		const {repository} = this.props;
		const hasError = repository.messages.findIndex(m => m.code == "E") > -1 || repository.hasError;
		let callout;

		if (repository.isApplyingTransform) {
			callout = <div className={css.titleText}>
				<FormattedMessage defaultMessage={"Generating simulation results"}
				                  description={"[RepositoryMessagesView] message displayed when simulation is running"}/>
				<Loader active inline='centered'/>
			</div>;
		} else if (hasError) {
			callout = <bp.Callout title={i18n.intl.formatMessage({defaultMessage: "Definition Error", description: "[RepositoryMessagesView] message displayed when simulation can not run successfully"})}
			                      intent={bp.Intent.DANGER}>
				<FormattedMessage defaultMessage={"Error exists in definition, please fix before generating simulation results"}
				                  description={"[RepositoryMessagesView] result status description when simulation can not run successfully"}/>
			</bp.Callout>;
		} else if (repository.doneApplyingTransform) {
			callout = <bp.Callout title={i18n.intl.formatMessage({defaultMessage: "Results Generated", description: "[RepositoryMessagesView] message displayed when simulation run successfully"})}
			                      intent={bp.Intent.SUCCESS}>
				<FormattedMessage defaultMessage={"The simulation results has been successfully generated and can now be referenced and queried from other applications."}
				                  description={"[RepositoryMessagesView] result status description when simulation run successfully"}/>
			</bp.Callout>;
		} else {
			callout = <bp.Callout title={i18n.intl.formatMessage({defaultMessage: "No Results Available", description: "[RepositoryMessagesView] message displayed when simulation not run yet"})}
			                      intent={bp.Intent.WARNING}>
				<FormattedMessage defaultMessage={"Run simulation to generate results."}
				                  description={"[RepositoryMessagesView] result status description when simulation not run yet"}/>
			</bp.Callout>;
		}

		return <div className={css.root}>
			{callout}
			<div className={css.messagesDiv}>
				{this.messageBlock('E')}
				{this.messageBlock('W')}
			</div>
		</div>
	}
}
