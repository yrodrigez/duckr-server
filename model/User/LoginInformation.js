import { Schema } from 'mongoose'

const loginInformationSchema = new Schema( {
  date: Date,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  token: String,
  ip: String,
  location: Object,
} )

loginInformationSchema.index( { date: 1, userId: 1 }, { unique: true } )
export default loginInformationSchema