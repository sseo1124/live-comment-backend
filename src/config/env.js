import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 8000,
  mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/",
  jwtSecretKey: process.env.JWT_SECRET,
};

export default config;
