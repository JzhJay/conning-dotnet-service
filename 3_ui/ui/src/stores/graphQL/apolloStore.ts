import {Intent} from '@blueprintjs/core';
import {ApolloClient, ApolloLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import {getMainDefinition} from '@apollo/client/utilities';
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { RetryLink } from '@apollo/client/link/retry';
import { createClient } from 'graphql-ws';
import {OperationDefinitionNode} from 'graphql';
import gql from 'graphql-tag';
import { action, autorun, observable, reaction, makeObservable } from 'mobx';
import {notificationGraph} from '../notifications';
import {user} from '../user';
import {site} from '../site';
import {onError} from "@apollo/client/link/error";
import {fragments} from './Fragments';

const possibleTypes = require('./possibleTypes.json') as any;

class ApolloStore {
	@observable.ref client: ApolloClient<any>;

	constructor() {
        makeObservable(this);
        autorun(() => {
			const {accessTokenObservable} = user;

			this._initializeApolloClient();
		}, {name: `Attach access token to graphQL requests`})
    }

	first = true;

	@action private _initializeApolloClient = () => {
		const {location} = window;
		var host         = location.host;

		const httpUrl = `${location.protocol}//${host}/graphql`;

		const httpLink = new BatchHttpLink({
			uri:          httpUrl,
			batchInterval: 40
		});

		const websocketUrl = !KARMA ? `${location.protocol == 'https:' ? 'wss' : 'ws'}://${host}/graphql`
		                            : `ws://${location.hostname}:5000/graphql`;

		this.first && console.log(
			`GraphQL Endpoints:
				websocketUrl:  ${websocketUrl}
				httpUrl: ${httpUrl}`);

		let reconnectionCount = 0;
		let lastConnectionTime = null;
		let shouldAbortReconnect = false;

		const wsLink = new GraphQLWsLink(createClient({
			url:     websocketUrl,
			shouldRetry: () => true,
			connectionParams: () => {
				console.log("Apollo Websocket reconnect");

				// WS connection is terminated after 1 minute on production stacks and reconnected through this flow, however these should not be counted.
				// Therefore only count reconnections that happen within 30 seconds of each other as failures.
				(Date.now() - lastConnectionTime < 30 * 1000) && reconnectionCount++;
				lastConnectionTime = Date.now();

				// Avoid spamming the server with reconnection. Most likely caused by an expired token
				if (reconnectionCount == 5 && !KARMA) {

					const abortReconnect = () => {
						// Halt reconnect by throwing an exception
						throw new Error("Websocket retry exceeded");
					}

					if (shouldAbortReconnect)
						abortReconnect();

					site.toaster.show({
						message: "Web server connection lost",
						action: {
							text:    'Reconnect',
							onClick: () => {} // Noop - This will trigger onDismiss which will reconnect
						},
						onDismiss: () => {
							this.client.stop();
							this._initializeApolloClient();
						},
						intent: Intent.DANGER,
						timeout: 0
					});

					shouldAbortReconnect = true;
					abortReconnect();
				}

				return { Authorization: `Bearer ${user.accessToken}` };
			}
		}));
		
		this.first = false;

		const authLink = setContext((_, {headers}) => {
			let token = user.accessToken;

			return (async () => {
				if (token == null) {
					token = await new Promise( (accept, reject) => {
						reaction(() => user.accessTokenObservable, () => {
							// Trigger/resume blocked requests when we have a valid access token.
							if (user.accessToken) {
								accept(user.accessToken);
							}
						})

						if (KARMA) {
							// Resolve after x seconds in karma tests so we can validate unauthorized requests.
							window.setTimeout(()=> accept(null), 5000)
						}
					})
				}

				// return the headers to the context so httpLink can read them
				return {
					headers: {
						...headers,
						authorization: token ? `Bearer ${token}` : "",
					}
				}

			})();
		});

		const errorLink = onError(({graphQLErrors, networkError, operation}) => {
			if (graphQLErrors)
				graphQLErrors.forEach(({message, locations, path}) =>
					console.log(
						`[GraphQL Error] Message: ${message}, Location: ${locations}, Path: ${path}`),
				);

			if (networkError) {
				var e = networkError as any
				if (_.some(e.result)) {
					for (var detail of e.result) {
						const {data, errors} = detail;
						if (errors) {
							if (errors.length == 1) {
								Object.assign(networkError, errors[0]);
							}

							// Otherwise print them all
							errors.forEach(e => console.error(e.message, e));
						}
					}
				}
				else {
					const { stack = '' } = networkError;
					console.log(`[Network error] ${networkError}`);
					console.log(`[Operation] ${JSON.stringify(operation)}`);
					if (stack) {
						console.log(stack);
					}
				}
			}
		});
		
		const retryLink = new RetryLink({
			delay: {
				initial: 500,
				jitter: false
			}
		});

		const observeMutations = new ApolloLink((operation, forward) => {
			//
			// // add the authorization to the headers
			// operation.setContext(({headers = {}}) => ({
			// 	headers: {
			// 		...headers,
			// 		'recent-activity': localStorage.getItem('lastOnlineTime') || null,
			// 	}
			// }));

			let isMutation = _.some(operation.query.definitions, d => d['operation'] == "mutation");

			if (isMutation) {
				//this.mutations++;
				console.log(operation.operationName, 'mutation')
				var result = forward(operation);
				// Causes things to double fire...
				// var s      = result.subscribe(() => {
				// 	this.mutations--;
				// 	s.unsubscribe();
				// })
				return result;
			}
			else {
				return forward(operation);
			}
		})

		this.client = new ApolloClient({
			//connectToDevTools: DEV_BUILD,
			link: split(
				// split based on operation type
				({query}) => {
					const {kind, operation} = getMainDefinition(query) as OperationDefinitionNode;
					return kind === 'OperationDefinition' && operation === 'subscription';
				},
				observeMutations.concat(errorLink).concat(wsLink),
				observeMutations.concat(authLink).concat(errorLink).concat(retryLink).concat(httpLink),
			),
			cache: new InMemoryCache({
				possibleTypes,
				typePolicies: {
					/*  Default root query's __typename is "Query" (Same as our Query object's __typename) in 3.0. It causes Query objects are incorrectly cached.
						So use the option to modify __typename of default root query.
						https://www.apollographql.com/docs/react/caching/cache-configuration#overriding-root-operation-types-uncommon */
					UnconventionalRootQuery: {
						queryType: true,
						fields: {
							omdb: {
								merge: true
							},
							user: {
								merge: true
							},
							notification: {
								merge: true
							}
						}
					},
					OmdbQuery: {
						fields: {
							objectType(_, { args, toReference }) {
								// Maps _id + __typename in incoming query result records to corresponding ObjectType:Id cache records in apollo so that if we update the record later due to a mutation, the corresponding query result query will update
								const typename = 'OmdbObjectType';
								return toReference({__typename: typename, id: args.id});
							}
						}
					}
				}
			}),
		});
	}

	graph = {
		notification: notificationGraph,
		user:         {
			get: gql`query getUser($id: ID!) {
				user {
					get(id: $id) {
						...conningUser
					}
				}
			}

			${fragments.conningUser}`
		}
	}
}

export const apolloStore = new ApolloStore();
