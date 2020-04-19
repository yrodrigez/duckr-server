import mongoose from 'mongoose'
import User from '../schemas/users/User'
import Duck from '../schemas/ducks/Duck'


const connectDB = () => mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/rduckr')

export { connectDB }
export default { User, Duck }