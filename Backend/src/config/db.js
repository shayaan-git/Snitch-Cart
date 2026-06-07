import mongoose from "mongoose";
import { configs } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(configs.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
