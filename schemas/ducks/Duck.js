import { Schema } from 'mongoose'
import User from '../users/User'

const Duck = new Schema(
  {
    stars: {
      type: Number,
    },
    created: {
      type: Number,
    },
    data: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    visible: {
      type: Boolean,
    },
    likeCount: Number,
    reDuck: {
      type: Schema.Types.ObjectId,
      ref: 'Duck'
    },
  },
)


export default Duck