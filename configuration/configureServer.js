import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import configureApollo from './apollo/ApolloConfiguration'
import { LOGIN_STRATEGY, passport } from './passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'


const devOrigin = ( 'http://localhost:8081' )

const configureServer = () => {

  const app = express()
  const PORT = parseInt( process.env.PORT ) || 8080

  app.use( passport.initialize() )
  app.use( passport.session( {} ) )
  app.use( bodyParser.json() ) // support json encoded bodies
  app.use( cookieParser( process.env.COOKIE_SECRET ) )
  app.use( bodyParser.urlencoded( { extended: true } ) )

  app.get( '/', ( req, res ) => {
    res.send( 'OK' )
  } )

  app.get( '/auth/facebook', passport.authenticate( LOGIN_STRATEGY.FACEBOOK ) )

  app.get( '/auth/facebook/callback', passport.authenticate(
    LOGIN_STRATEGY.FACEBOOK,
    {
      successRedirect: '/',
      failureRedirect: '/login',
    },
  ) )
  /**
   * Login
   */
  app.post(
    '/login',
    ( req, res, next ) => passport.authenticate(
      LOGIN_STRATEGY.LOCAL,
      { successRedirect: '/graphql', failureRedirect: '/login' },
      ( err, token ) => {
        req.login( token, ( err ) => {
          if( err ) return res
            .status( 500 )
            .send( 'Authentication failure due to an internal server error' )

          if( !token ) return res.redirect( '/login' )
          res.setHeader( 'Authorization', token )
          res.cookie( '__sessionToken', token, { httpOnly: true } )

          return res.send( { token } )
        } )
      },
    )( req, res, next ),
  )

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