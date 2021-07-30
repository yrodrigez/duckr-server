import LocalStrategy from "./strategies/LocalStrategy";

import passport from "passport";
import jwt from "jsonwebtoken";
import JwtStrategy from "./strategies/JwtStrategy";
import FacebookStrategy from "./strategies/FacebookStrategy";
import GoogleStrategy from "./strategies/GoogleStrategy";

const {JWT_SECRET, JWT_ALGORITHM} = process.env
console.log(JWT_SECRET, JWT_ALGORITHM)


const LOGIN_STRATEGY = {
  LOCAL: "local",
  JWT: "jwt",
  FACEBOOK: "facebook",
  GOOGLE: "google",
}

passport.use(LOGIN_STRATEGY.JWT, JwtStrategy)
passport.use(LOGIN_STRATEGY.LOCAL, LocalStrategy)
passport.use(LOGIN_STRATEGY.FACEBOOK, FacebookStrategy)
passport.use(LOGIN_STRATEGY.GOOGLE, GoogleStrategy)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

export { passport, LOGIN_STRATEGY }