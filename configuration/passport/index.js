import LocalStrategy from './strategies/LocalStrategy'


import passport from 'passport'
import jwt from 'jsonwebtoken'
import JwtStrategy from './strategies/JwtStrategy'
import FacebookStrategy from './strategies/FacebookStrategy'


const LOGIN_STRATEGY = {
  LOCAL: 'local',
  JWT: 'jwt',
  FACEBOOK: 'facebook',
}

passport.use( LOGIN_STRATEGY.JWT, JwtStrategy )

passport.use( LOGIN_STRATEGY.LOCAL, LocalStrategy )
passport.use( LOGIN_STRATEGY.FACEBOOK, FacebookStrategy )

passport.serializeUser( ( user, done ) => {
  done( null, user )
} )

passport.deserializeUser( ( user, done ) => {
  done( null, user )
} )

export { passport, LOGIN_STRATEGY }