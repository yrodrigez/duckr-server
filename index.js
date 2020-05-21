import configureServer from './configuration/configureServer'
import { connectDB } from './dal'


connectDB().then(() => {
  const { server, apolloServer, PORT } = configureServer()
  server.listen( PORT, () => {
    console.log( `App listening to ${ PORT }....` )
    console.log( `App environment ${ process.env.__MODE__ }....` )
    console.log( `🚀 Server ready at http://localhost:${ PORT }${ apolloServer.graphqlPath }` )
    console.log( `🚀 Subscriptions ready at ws://localhost:${ PORT }${ apolloServer.subscriptionsPath }` )
    console.log( 'Press Ctrl+C to quit.' )
  } )
} )
