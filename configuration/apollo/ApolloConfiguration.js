import { ApolloServer } from 'apollo-server-express'
import UserDAL from '../../dal/UserDAL'
import DucksDAL from '../../dal/DucksDAL'
import resolvers from '../../schemas/graphql/resolvers'
import typeDefs from './typeDefs'
import { LOGIN_STRATEGY, passport } from '../passport'
import jwt from 'jsonwebtoken'

console.log( `resolvers --> `, resolvers )

const verifyJWTToken = ( token ) => new Promise( ( resolve, reject ) => {
  jwt.verify( token, process.env.JWT_SECRET, ( err, decodedToken ) => {
    if( err || !decodedToken ) {
      return reject( err )
    }

    resolve( decodedToken )
  } )
} )

const passportAuthJWT = ( req, res ) => new Promise( ( resolve, reject ) => {
  passport.authenticate( LOGIN_STRATEGY.JWT, { session: false }, ( error, info ) => {
    if( error ) reject( error )
    if( info ) console.error( info )

    resolve()
  } )( req, res )
} )

const configureApollo = ( middleware, subscriptionHandlers ) => {
  const apolloServer = new ApolloServer(
    {
      ...typeDefs,
      resolvers,
      context: async( { req, res } ) => {

        const { authorization } = req.headers
        const decoded = await verifyJWTToken( authorization )
        const user = await UserDAL.findById( decoded.sub )
        console.log(user)
        // await passportAuthJWT(req, res)
        return { user }
      },
      dataSources: () => ( {
        userAPI: UserDAL,
        duckAPI: DucksDAL,
      } ),
      subscriptions: {
        onConnect: () => console.log( 'Subscriptions connected!' ),
      },
    } )

  apolloServer.applyMiddleware( middleware )
  apolloServer.installSubscriptionHandlers( subscriptionHandlers )

  return apolloServer
}

export default configureApollo