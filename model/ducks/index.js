import {Schema} from 'mongoose'

export default new Schema(
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