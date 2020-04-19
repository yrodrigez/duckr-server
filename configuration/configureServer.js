import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import configureApollo from './apollo/ApolloConfiguration'
import { passport } from './passport'
import bodyParser from 'body-parser'


const devOrigin = ( 'http://localhost:8081' )

const configureServer = () => {

  const app = express()
  const PORT = parseInt( process.env.PORT ) || 8080

  app.use( passport.initialize() )
  app.use( passport.session() )
  app.use( bodyParser.json() ) // support json encoded bodies
  app.use( bodyParser.urlencoded( { extended: true } ) )

  app.get( '/', ( req, res ) => {
    res.send( `Here! user auth? ${ req.isAuthenticated() }` )
  } )

  /**
   * Login
   */
  app.post( '/login', ( req, res, next ) => {
    console.log( 'Inside POST /login callback' )
    console.log( `req body: ${ JSON.stringify( req.body ) }` )
    passport.authenticate(
      'local',
      { successRedirect: '/graphql', failureRedirect: '/login' },
      ( err, user ) => {

        if( err ) return next( err )
        if( !user ) return res.redirect( '/login' )

        req.login( user, ( err ) => {
          if( err ) return next( err )
          return res.json( { data: { token: user } } )
        } )
      },
    )( req, res, next )
  } )

  if( process.env.__MODE__ === 'development' ) {
    app.use( cors( ( origin, callback ) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if( !origin ) return callback( null, {} )
      if( devOrigin.startsWith( origin ) ) return callback( null, {} )
      return callback( null, {} )
    } ) )
  }

  const server = createServer( app )
  const apolloServer = configureApollo( { app }, server )

  return {
    server,
    apolloServer,
    PORT,
  }
}

export default configureServer