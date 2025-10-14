import express from "express";
import cors from "cors";

import passport from "passport";
import configPassport from "./config/passport.js";

import authRoutes from "./routes/auth-routes.js";
import projectRoutes from "./routes/project-routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // 향후 정해진 프론트 서버의 origin 등록

configPassport();
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "아무것도 없습니다." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
