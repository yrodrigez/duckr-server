require( 'dotenv' ).config()
import passport from 'passport'
import LocalStrategy from 'passport-local'
import uuid from 'uuid/v4'
import UserDAL from '../../dal/UserDAL'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jsonwebtoken'


const LOGIN_STRATEGY = {
  LOCAL: 'local',
  JWT: 'jwt',
}

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: [ process.env.JWT_ALGORITHM ],
}
console.log( JSON.stringify( opts ) )
passport.use( LOGIN_STRATEGY.JWT, new JwtStrategy( opts, async ( payload, done ) => {
  console.log(`${LOGIN_STRATEGY.JWT} strategy`, JSON.stringify(payload))

  return await UserDAL.findById( payload.sub ) ;
} ) )

passport.use( LOGIN_STRATEGY.LOCAL, new LocalStrategy(
  { usernameField: 'email', session: false },
  async( email, password, onFinish ) => {
    console.log( `Inside local strategy callback`, email, password, onFinish )
    await UserDAL.findByEmailAndPassword( email, password, ( err, user ) => {
      if( err ) return onFinish( err )
      else {
        console.log( `User found: ${ user }` )

        const payload = {
          sub: user._id,
          iat: Date.now() + parseInt( process.env.JWT_EXPIRATION ),
          username: user.username,
        }
        const token = jwt.sign(
          JSON.stringify( payload ),
          process.env.JWT_SECRET,
          { algorithm: process.env.JWT_ALGORITHM },
        )

        return onFinish( err, token )
      }
    } )
  },
) )

passport.serializeUser( ( user, done ) => {
  done( null, user )
} )

passport.deserializeUser( ( user, done ) => {
  done( null, user )
} )

export { passport, LOGIN_STRATEGY }