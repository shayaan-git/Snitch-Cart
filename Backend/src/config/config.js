import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.MONGO_URI ||
  !process.env.JWT_SECRET ||
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET
) {
  throw new Error(
    "MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET must be defined in the environment variables",
  );
}

export const configs = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
