import { ApolloServer } from 'apollo-server-express'
import UserDAL from './dal/UserDAL'
import resolvers from './resolvers'
import typeDefs from './typeDefs'


const configureApollo = (middleware, subscriptionHandlers) => {
	const apolloServer = new ApolloServer(
		{
			...typeDefs,
			...resolvers,
			dataSources: () => ({
				userAPI: UserDAL,
			}),
			subscriptions: {
				onConnect: () => console.log('Subscriptions connected!'),
			},
		})

	apolloServer.applyMiddleware(middleware)
	apolloServer.installSubscriptionHandlers(subscriptionHandlers)

	return apolloServer
}

export default configureApollo