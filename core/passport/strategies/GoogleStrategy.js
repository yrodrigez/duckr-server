import { OAuth2Strategy } from "passport-google-oauth";

require("dotenv").config();
const { GOOGLE_APP_ID, GOOGLE_APP_SECRET } = process.env;
import { createAndSignToken } from "./JwtUtilities";

export default new OAuth2Strategy(
  {
    clientID: GOOGLE_APP_ID,
    clientSecret: GOOGLE_APP_SECRET,
    callbackURL: "https://localhost:8080/auth/google/callback",
  },
  async function (accessToken, refreshToken, profile, done) {
    const existingUser = await UserDAL.findByGoogleProfileId(profile.id);
    if (existingUser) {
      const token = await createAndSignToken(existingUser, req);
      return done(null, token);
    }

    const user = await UserDAL.registerUser({
      username:
        profile.username || profile.displayName.trim().replace(/ /g, "_"),
      registration: { date: new Date(), source: "google" },
      email: (profile.emails || []).find((x) => x),
      googleInformation: {
        ...profile,
        profileId: profile.id,
      },
    });
    const token = createAndSignToken(user, req);

    return done(null, token);
  }
);
