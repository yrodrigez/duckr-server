import configureServer from './configuration/configureServer'

configureServer().then(({server, apolloServer, PORT}) => {
  server.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log(`App environment ${process.env.__MODE__}....`)
    console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`)
    console.log('Press Ctrl+C to quit.')
  })
})

