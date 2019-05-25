import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo-hooks'
import { WebSocketLink } from 'apollo-link-ws'
import UserView from './UserView'
import { getMainDefinition } from 'apollo-utilities'


const httpLink = createHttpLink({
																	uri: 'http://localhost:8080/graphql',
																})
const wsLink = new WebSocketLink({
																	 uri: 'ws://localhost:8080/graphql',
																 })

const client = new ApolloClient({
																	// By default, this client will send queries to the
																	//  `/graphql` endpoint on the same host
																	// Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
																	// to a different host

																	link: split(({query}) => {
																		const {kind, operation} = getMainDefinition(query)
																		return kind === 'OperationDefinition' && operation === 'subscription'
																	}, wsLink, httpLink),
																	cache: new InMemoryCache(),
																})

ReactDOM.render(
	<ApolloProvider client={client}>
		<UserView/>
	</ApolloProvider>,
	document.getElementById('root'),
)