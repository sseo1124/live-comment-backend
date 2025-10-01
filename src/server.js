import app from "./app.js";
import config from "./config/env.js";
import connectDB from "./config/database.js";

const startServer = async () => {
  try {
    await connectDB();

    const port = config.port;

    app.listen(port, () => {
      console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error("서버 시작 실패:", error);
    process.exit(1);
  }
};

startServer();
