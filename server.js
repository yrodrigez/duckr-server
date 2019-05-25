import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import User from './server/schemas/users/User'
import webpackConfig from './webpack.config'
import hotMiddleware from 'webpack-hot-middleware'
import { connectDB } from './server/dal'
import resolvers from './server/resolvers'
import typeDefs from './server/typeDefs'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'


const server = new ApolloServer(
	{
		...typeDefs,
		...resolvers,
		dataSources: () => ({
			userAPI: User,
		}),
		subscriptions: {
			onConnect: ()=> console.log('Subscriptions connected!')
		}
	})

const app = express(),
	DIST_DIR = `${__dirname}/public`

server.applyMiddleware({app})
app.use(express.static(DIST_DIR))

const compiler = webpack(webpackConfig)
app.use(middleware(compiler, {
	noInfo: true, publicPath: webpackConfig.output.publicPath,
}))
app.use(hotMiddleware(compiler))

const PORT = process.env.PORT || 8080

const ws = createServer(app)
server.installSubscriptionHandlers(ws)
connectDB().then(async () => {
	ws.listen(PORT, () => {
		console.log(`App listening to ${PORT}....`)
		console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`)
		console.log('Press Ctrl+C to quit.')
		console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
	})
})
