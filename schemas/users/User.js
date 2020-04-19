import { Schema } from 'mongoose'

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
    following: {
      type: Array
    },
    password: {
      type: String,
    },
    loginHistory: {
      type: Array,
    },
    registration: {
      date: Date,
      source: String,
    },
    isLogged: Boolean,
  },
)

export default userSchema