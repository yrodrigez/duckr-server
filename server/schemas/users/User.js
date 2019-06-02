import { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
		},
		email: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
		},
		loginHistory: {
			type: Array,
		},
		registrationDate: {
			type: Date
		},
		registrationSource: String
	}
)
const cryptPassword = (password, cb) => {
	bcrypt.genSalt(10, (err, salt) => {
		if(err) return cb(err)
		console.log(`Generated salt: ${salt}`)
		bcrypt.hash(password, salt, null, (err, hash) => cb(err, hash))
	})
}

const comparePasswords = (plainPass, hashword, callback) => {
	bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {
		return err == null ?
			callback(null, isPasswordMatch) :
			callback(err)
	})
}
userSchema.statics.registerUser = async function(user) {
	console.log(`Received user ${JSON.stringify(user)}`)
	await cryptPassword(user.password, (err, hash) => {
		if(err) console.error(err)
		console.log(`Received hash ${hash}`)

		user.password = hash
		this.create(user)
	})
}

userSchema.statics.findByUsername = async function(username) {
	return (await this.findOne({
		username,
	}))
}

userSchema.statics.findByUsernameAndPassword = async function(username, password) {
	await this.findOne({ username }).exec(null, (err, user) => {
		if(err) console.error(err)

		let match = false
		comparePasswords(password, user.password, (err, isPasswordMatch) => {
			if(err) console.error(err)
			match = isPasswordMatch
		})

		if(match) return
		throw new Error('User not found')
	})
}

userSchema.statics.findAll = async function() {
	return (await this.find())
}

export default model('User', userSchema)