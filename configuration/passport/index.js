require( 'dotenv' ).config()
import passport from 'passport'
import LocalStrategy from 'passport-local'
import UserDAL from '../../dal/UserDAL'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jsonwebtoken'


const LOGIN_STRATEGY = {
  LOCAL: 'local',
  JWT: 'jwt',
}

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme( 'JWT' ),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: [ process.env.JWT_ALGORITHM ],
  passReqToCallback: true,
}
passport.use( LOGIN_STRATEGY.JWT, new JwtStrategy( opts, ( payload, done ) => {
  console.log( `${ LOGIN_STRATEGY.JWT } strategy`, JSON.stringify( payload ) )

  return UserDAL.findById( payload.sub )
} ) )

passport.use( LOGIN_STRATEGY.LOCAL, new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', session: false, passReqToCallback: true },
  async( req, email, password, done ) => {
    console.log(email, password, done)
    console.log(`strategy ${LOGIN_STRATEGY.LOCAL} `)
    const user = await UserDAL.findByEmailAndPassword( email, password )
    const { JWT_EXPIRATION, JWT_SECRET, JWT_ALGORITHM } = process.env
    const payload = {
      sub: user._id,
      iat: Date.now() + parseInt( JWT_EXPIRATION ),
      username: user.username,
    }
    const token = jwt.sign(
      JSON.stringify( payload ),
      JWT_SECRET,
      { algorithm: JWT_ALGORITHM },
    )

    return done( null, token )
  },
) )

passport.serializeUser( ( user, done ) => {
  done( null, user )
} )

passport.deserializeUser( ( user, done ) => {
  console.log(`deserializeUser Call!`)
  done( null, user )
} )

export { passport, LOGIN_STRATEGY }