import configureServer from './core/configureServer'
import {connectDB} from "./model";



connectDB().then(() => {
  console.log(`Connected to db`)
  configureServer().then(({server, apolloServer, PORT}) => {
    server.listen(PORT, () => {
      console.log(`App listening to ${PORT}....`)
      console.log(`App environment ${process.env.__MODE__}....`)
      console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
      console.log('Press Ctrl+C to quit.')
    })
  })
})


