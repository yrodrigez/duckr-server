import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import UserDAL from '../../../model/UserDAL'

require( 'dotenv' ).config({
  path: process.cwd()+ '/config.env'
})

const {JWT_SECRET, JWT_ALGORITHM} = process.env

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme( 'JWT' ),
  secretOrKey: JWT_SECRET,
  algorithms:  JWT_ALGORITHM,
  passReqToCallback: true,
}


export default new JwtStrategy( opts, ( payload ) => {
  return UserDAL.findById( payload.sub )
} )