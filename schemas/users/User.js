import { Schema } from 'mongoose'

const userSchema = new Schema( {
  username: {
    type: String,
    unique: true,
  },
  facebookInformation: new Schema({
    profileId: String,
    provider: String,
    displayName: String,
    name: new Schema({
      familyName: String,
      givenName: String,
      middleName: String,
    }),
    emails: Array,

  }),
  email: {
    type: String,
    unique: true,
  },
  following: {
    type: Array,
  },
  password: {
    type: String,
  },
  firstName: String,
  lastName: String,
  registration: {
    date: Date,
    source: String,
  },
  isLogged: Boolean,
} )


userSchema.index( { registration: 1 } )
export default userSchema