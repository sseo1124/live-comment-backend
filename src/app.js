import express from "express";
import { createServer } from "http";
import cors from "cors";

import { Server } from "socket.io";

import passport from "passport";
import configPassport from "./config/passport.js";

import authRoutes from "./routes/auth-routes.js";
import projectRoutes from "./routes/project-routes.js";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // 향후 정해진 프론트 서버의 origin 등록

configPassport();
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

const io = new Server(httpServer, {
  cors: { origin: true, credentials: true },
  path: "/socket.io",
});

io.engine.use((req, res, next) => {
  const isHandshake = req._query.sid === undefined;

  if (isHandshake) {
    passport.authenticate("jwt", { session: false })(req, res, next);
  } else {
    next();
  }
});

io.on("connection", (socket) => {
  const req = socket.request;

  socket.join(`user:${req.user._id}`);

  socket.on("whoami", (cb) => {
    cb(req.user.name);
  });
});

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

export default httpServer;
