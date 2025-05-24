import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully, Maybe ;)");
  } catch (error) {
    console.error("MongoDB Connection Failure")
    if (error instanceof Error) {
      console.error("Error Message: ", error.message)
    } else {
      console.error("Unexpected Error", error)
    }
    process.exit(1)
  }
}

export default connectDB;
