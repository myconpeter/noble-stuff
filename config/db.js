import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
let mongoURL = "";

if (process.env.NODE_ENV === "production") {
  mongoURL = process.env.MONGO_URI_PROD;
  console.log("Running in Production environment");
} else if (process.env.NODE_ENV === "development") {
  mongoURL = process.env.MONGO_URI_LOCAL;
  console.log("Running in local environment");
} else {
  console.log("ENVIRONMENT NOT SET CORRECTLY, PLEASE CHECK");
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log(`connected to database ${mongoURL}`);
  } catch (error) {
    console.error("connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
