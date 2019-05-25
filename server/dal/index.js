import mongoose from 'mongoose'
import User from '../schemas/users/User'


const connectDB = () => mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/rduckr')

const models = {User}
export { connectDB }
export default models