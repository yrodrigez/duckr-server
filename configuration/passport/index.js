import passport from 'passport'
import LocalStrategy from 'passport-local'
import connectMongo from 'connect-mongo/'
import _session from 'express-session'
import uuid from 'uuid/v4'
import mongoose from 'mongoose'
import UserDAL from '../../dal/UserDAL'

const WithSessionMongoStore = connectMongo(_session)

const LOGIN_STRATEGY = {
	LOCAL: 'local',
}

passport.use(LOGIN_STRATEGY.LOCAL, new LocalStrategy(
	{ usernameField: 'email' },
	async(email, password, onFinish) => {
		console.log(`Inside local strategy callback`, email, password, onFinish)
		await UserDAL.findByEmailAndPassword(email, password, (err, user) => {
			err && console.error(err)
			if(!err) {
				console.log(`User found: ${user}`)
				onFinish(err, user)
			}
		})
	},
))
passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})
const session = _session({
	genid: () => {
		console.log('Generating session...')
		return uuid()
	},
	store: new WithSessionMongoStore({
		mongooseConnection: mongoose.connection,
		collection: 'session',
	}),
	secret: process.env.__MODE__ === 'development' ? `changeThisASAP` : `${uuid()}`,
	resave: false,
	saveUninitialized: true,
})

export { session, passport, LOGIN_STRATEGY }