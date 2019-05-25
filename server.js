import path from 'path'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import webpackConfig from './webpack.config'
import hotMiddleware from 'webpack-hot-middleware'

const typeDefs = gql`
  type Query {
	hello: String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
	hello: () => 'Hello world!',
  },
}
const server = new ApolloServer({typeDefs, resolvers})

const app = express(),
  DIST_DIR = `${__dirname}/public`

server.applyMiddleware({app})
app.use(express.static(DIST_DIR))

const compiler = webpack(webpackConfig)
app.use(middleware(compiler, {
 noInfo: true, publicPath: webpackConfig.output.publicPath
}))
app.use(hotMiddleware(compiler))

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`)
  console.log('Press Ctrl+C to quit.')
})