import express from 'express'
import { createServer } from 'http'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'
import configureApollo from './ApolloConfiguration'


const configureServer = () => {
	const app = express(),
		DIST_DIR = `${__dirname}/public`,
		PORT = process.env.PORT || 8080,
		compiler = webpack(webpackConfig)

	app.use(express.static(DIST_DIR))
	app.use(middleware(compiler, {
		noInfo: true, publicPath: webpackConfig.output.publicPath,
	}))
	app.use(hotMiddleware(compiler))

	const server = createServer(app)
	const apolloServer = configureApollo({app}, server)

	return {
		server,
		apolloServer,
		PORT,
	}
}

export default configureServer