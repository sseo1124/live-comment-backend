import express from "express";
import { createServer } from "http";
import cors from "cors";

import { Server } from "socket.io";

import passport from "passport";
import configPassport from "./config/passport.js";

import Room from "./model/Room.js";
import ProjectMember from "./model/ProjectMembership.js";
import Thread from "./model/Thread.js";

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
  socket.on("join_room", async ({ roomId }, ack) => {
    try {
      if (!roomId) return ack?.({ ok: false, code: "BAD_REQUEST" });

      const room = await Room.findById(roomId).select("_id projectId").lean();
      if (!room) return ack?.({ ok: false, code: "ROOM_NOT_FOUND" });

      const isMember = await ProjectMember.findOne({
        projectId: room.projectId,
        userId: socket.request.user._id,
      })
        .select("_id")
        .lean();

      if (!isMember) return ack?.({ ok: false, code: "FORBIDDEN" });

      const roomName = `room:${roomId}`;
      await socket.join(roomName);
      socket.data.currentRoomId = roomId;

      socket.emit("room_joined", { roomId });
      ack?.({ ok: true, roomId });
    } catch (e) {
      ack?.({ ok: false, code: "SERVER_ERROR", message: e.message });
    }
  });

  socket.on("thread:create", async (payload, ack) => {
    try {
      const { roomId, content, tempId } = payload || {};
      if (!roomId || !content || !String(content).trim()) {
        return ack?.({ ok: false, code: "BAD_REQUEST" });
      }

      const room = await Room.findById(roomId).select("_id projectId").lean();
      if (!room) return ack?.({ ok: false, code: "ROOM_NOT_FOUND" });

      const m = await ProjectMember.findOne({
        projectId: room.projectId,
        userId: socket.request.user._id,
      })
        .select("_id")
        .lean();
      if (!m) return ack?.({ ok: false, code: "FORBIDDEN" });

      const t = await Thread.create({
        projectId: room.projectId,
        roomId,
        content: String(content).trim(),
        createdBy: socket.request.user._id,
      });

      const out = {
        _id: t._id,
        content: t.content,
        resolved: t.resolved,
        createdAt: t.createdAt,
        createdBy: t.createdBy,
        updatedAt: t.updatedAt,
        __v: t.__v,
      };

      const roomName = `room:${roomId}`;
      io.to(roomName).emit("thread:created", out);

      ack?.({ ok: true, tempId, threadId: String(t._id) });
    } catch (e) {
      ack?.({ ok: false, code: "SERVER_ERROR", message: e.message });
    }
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
