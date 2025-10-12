import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl, { dbName: "liveComment" });
    console.log("MongoDB 연결 성공");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB 연결 오류:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB 연결이 끊어졌습니다...");
    });
  } catch (err) {
    console.error("MongoDB 초기 연결 실패:", err);
    process.exit(1);
  }
};

export default connectDB;
