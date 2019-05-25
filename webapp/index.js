import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'


const client = new ApolloClient(
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  {
	link: new HttpLink(),
	cache: new InMemoryCache(),
  })

const HELLO_WORLD = gql`
  {
	hello
	
  }
`

ReactDOM.render(
  <ApolloProvider client={client}>
	<Query query={HELLO_WORLD}>
	  {({loading, error, data}) => {
		if (loading) return 'Loading!...'
		if (error) return `Error! ${error.message}`
		return <div>{data.hello}</div>
	  }}
	</Query>
  </ApolloProvider>,
  document.getElementById('root'),
)