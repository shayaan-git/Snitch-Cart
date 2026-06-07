import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  throw new Error(
    "MONGO_URI and JWT_SECRET must be defined in the environment variables",
  );
}

export const configs = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
