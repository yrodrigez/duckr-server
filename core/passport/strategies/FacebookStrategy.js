import FacebookStrategy from 'passport-facebook'
import UserDAL from '../../../model/UserDAL'

const {FACEBOOK_APP_ID, FACEBOOK_APP_SECRET} = process.env
import {createAndSignToken} from './JwtUtilities'

export default new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'https://localhost:8080/auth/facebook/callback',
    passReqToCallback: true,
  },
  async function (req, accessToken, refreshToken, profile, done) {
    let user = undefined
    try {
      user = await UserDAL.findByFacebookId(profile.id)
    } catch (e) {
      console.error(e)
    }
    if (user) {
      const token = await createAndSignToken(user, req)
      return done(null, token)
    }

    const newUser = {
      username: profile.username || profile.displayName.trim().replace(/ /g, '_'),
      registration: {date: new Date(), source: 'facebook'},
      email: (profile.emails || []).find(x => x),
      facebookInformation: {
        ...profile,
        profileId: profile.id
      },
    }

    try {
      user = await UserDAL.registerUser(newUser)
    } catch (e) {
      console.error(e)
    }

    const token = createAndSignToken(user, req)

    return done(null, token)
  },
)