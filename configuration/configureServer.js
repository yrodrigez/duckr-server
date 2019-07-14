import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import configureApollo from './apollo/ApolloConfiguration'
import { passport, session } from './passport'

const devOrigin = ('http://localhost:8081')

const configureServer = () => {

	const app = express()
	const PORT = Number.parseInt(process.env.PORT) || 8080

	app.use(session)
	app.use(passport.initialize())
	app.use(passport.session())
	if(process.env.__MODE__ === 'development')
		app.use(cors((origin, callback) => {
			// allow requests with no origin
			// (like mobile apps or curl requests)
			if(!origin) return callback(null, {})
			if(devOrigin.startsWith(String(origin))) return callback(null, {})
			return callback(null, {})
		}))

	const server = createServer(app)
	const apolloServer = configureApollo({ app }, server)

	return {
		server,
		apolloServer,
		PORT,
	}
}

export default configureServer