import {GraphQLError} from 'graphql';
import * as css from './ErrorMessage.css';
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {sem} from 'components';
import {ApolloError} from '@apollo/client';

const {Message} = sem;

interface MyProps {
	message?: string;
	error?: Error;
}

interface DotNetGraphQlException {
	message: string
	code: string
}

interface DotNetGraphQlNetworkError {
	result?: Array<{ errors: Array<DotNetGraphQlException> }>
}

@observer
export class ErrorMessage extends React.Component<MyProps, {}> {
	render() {
		const {error, message} = this.props;

		return (<Message negative className={css.root}>
			<Message.Header content="A system error has occurred"/>

			<div className={css.errorPanel}>
				{message && <Message.Content content={message}/>}

				{error && <Message.Content content={error.toString()}/>}

				{NODE_ENV == "debug" &&
				<>
					{error instanceof ApolloError && <GraphQlErrorsComponent error={error}/>}
				</>}
			</div>

		</Message>)
	}
}

class GraphQlErrorsComponent extends React.Component<{ error: ApolloError }, {}> {
	render() {
		const {error, error: {graphQLErrors}} = this.props;

		var networkError = error.networkError as DotNetGraphQlNetworkError;

		return (
			<div className={css.graphQlErrors}>
				<Message.Header content="GraphQL Specific Errors"/>
				{_.some(graphQLErrors) &&
				<Message.List>
					{graphQLErrors.map((e, i) => <GraphQlErrorComponent key={i.toString()} error={e}/>)}
				</Message.List>}

				{/* .NET with expose exceptions on sends up back useful error information */}
				{!_.isEmpty(networkError.result) &&
				<Message.List>
					{networkError.result.map((e, i) => <>
						{e.errors && e.errors.map((exception, j) => <DotNetGraphQlExceptionComponent key={(i * j).toString()} error={exception}/>)}
					</>)}
				</Message.List>}
			</div>)
	}
}

class GraphQlErrorComponent extends React.Component<{ error: GraphQLError }, {}> {
	render() {
		const {error} = this.props;
		return <Message.Item className={css.graphQlError}>
			<span data-property='message'>{error.message}</span>
			<span data-property='path'>{error.path}</span>
			<span data-property='source'>{error.source}</span>
		</Message.Item>
	}
}

class DotNetGraphQlExceptionComponent extends React.Component<{ error: DotNetGraphQlException }, {}> {
	render() {
		const {error} = this.props;
		return <Message.Item className={css.dotnetGraphQlError}>
			{error.message}
		</Message.Item>
	}
}