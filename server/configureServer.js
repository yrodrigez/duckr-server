import express from 'express'
import { createServer } from 'http'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'
import configureApollo from './ApolloConfiguration'
import uuid from 'uuid/v4'
import path from 'path'
import session from 'express-session'
import connectMongo from 'connect-mongo/'
import mongoose from 'mongoose'
import passport from 'passport'
import LocalStrategy from 'passport-local'

const WithSessionMongoStore = connectMongo(session)
const users = [{ id: `1234123123`, email: 'hello@world.com', password: `123456` }]
passport.use('localStrategy', new LocalStrategy(
	{ usernameField: 'email' },
	(email, password, onSuccess) => {
		console.log(`Inside local strategy callback`)


	}
))

const configureServer = () => {
	const app = express(),
		DIST_DIR = path.join(__dirname, '../public'),
		PORT = process.env.PORT || 8080,
		compiler = webpack(webpackConfig)

	app.use(session({
			genid: () => {
				console.log('Generating session')
				return uuid()
			},
			store: new WithSessionMongoStore({
				mongooseConnection: mongoose.connection,
				collection: 'session'
			}),
			secret: 'changeThisASAP',
			resave: false,
			saveUninitialized: true
		})
	)
	app.use(express.static(DIST_DIR))
	app.use(middleware(compiler, {
		noInfo: true, publicPath: webpackConfig.output.publicPath,
	}))
	app.use(hotMiddleware(compiler))
	app.use(/^(?!\/graphql).*/, (req, res) => {
		res.sendFile(`${DIST_DIR}/index.html`)
	})

	const server = createServer(app)
	const apolloServer = configureApollo({ app }, server)

	return {
		server,
		apolloServer,
		PORT,
	}
}

export default configureServer