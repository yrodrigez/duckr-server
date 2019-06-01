import { model, Schema } from 'mongoose'


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
	})

userSchema.statics.findByUsername = async function(username) {
	return (await this.findOne({
		username: username,
	}))
}

userSchema.statics.findAll = async function() {
	return (await this.find())
}

export default model('User', userSchema)