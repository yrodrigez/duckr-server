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
  })

userSchema.statics.findByUsername = async function (login) {
  return (await this.findOne({
								   username: login,
								 }))
}

userSchema.statics.findAll = async function () {
  return (await this.find())
}

export default model('User', userSchema)