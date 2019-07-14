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
	async(email, password, onSuccess) => {
		console.log(`Inside local strategy callback`, email, password, onSuccess)
		const user = await UserDAL.findByUsernameAndPassword(email, password)
		onSuccess(user)
	},
))

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