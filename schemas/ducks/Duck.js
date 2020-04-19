import { Schema } from 'mongoose'
import User from '../users/User'

const Duck = new Schema(
  {
    stars: {
      type: Number,
    },
    created: {
      type: Date,
    },
    content: {
      type: String,
    },
    createdBy: {
      type: User,
    },
    visible: {
      type: Boolean,
    },
    viewers: {
      type: Array,
    },
    reDuck: {
      type: Schema.Types.ObjectId,
      ref: 'Duck'
    },
  },
)


export default Duck