import LocalStrategy from 'passport-local'
import UserDAL from '../../../model/UserDAL'
import { UserNotFoundError } from '../../../graphql/errors'
import { createAndSignToken } from './JwtUtilities'

const localStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}

export default new LocalStrategy(
  localStrategyOptions,
  async( req, email, password, done ) => {
    const user = await UserDAL.findByEmailAndPassword( email, password )
    if( !user && !user._id ) throw new UserNotFoundError()

    const token = await createAndSignToken( user, req )

    return done( null, token )
  },
)