import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import UserDAL from '../../../dal/UserDAL'
require( 'dotenv' ).config()

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme( 'JWT' ),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: [ process.env.JWT_ALGORITHM ],
  passReqToCallback: true,
}


export default new JwtStrategy( opts, ( payload ) => {
  return UserDAL.findById( payload.sub )
} )