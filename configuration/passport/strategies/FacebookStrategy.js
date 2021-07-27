import FacebookStrategy from 'passport-facebook'
import UserDAL from '../../../model/UserDAL'

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env
import { createAndSignToken } from './JwtUtilities'

export default new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    passReqToCallback: true,
  },
  async function( req, accessToken, refreshToken, profile, done ) {
    console.log(req)
    const existingUser = await UserDAL.findByFacebookId( profile.id )

    if( existingUser ) {
      const token = await createAndSignToken( existingUser, req )
      return done( null, token )
    }

    const user = await UserDAL.registerUser( {
      username: profile.username || profile.displayName.trim().replace( / /g, '_' ),
      registration: { date: new Date(), source: 'facebook' },
      email: ( profile.emails || [] ).find( x => x ),
      facebookInformation: {
        ...profile,
        profileId: profile.id
      },
    } )

    const token = createAndSignToken( user, req )

    return done( null, token )
  },
)