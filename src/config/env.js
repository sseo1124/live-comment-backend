import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 8000,
  mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/otp-auth",
  redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://127.0.0.1:5672",
  jwtSecretKey: process.env.JWT_SECRET,
};

export default config;
