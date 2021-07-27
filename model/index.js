import mongoose from "mongoose";

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

const connectDB = () =>
  mongoose.connect(
    process.env.DATABASE_URL_PROD ||
    process.env.DATABASE_URL_DEV ||
    "mongodb://localhost:27017/rduckr",
    connectionOptions
  );

export { connectDB };