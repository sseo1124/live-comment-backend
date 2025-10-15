import express from "express";
import passport from "passport";
import {
  handleCreateProject,
  handleGetProjects,
  handleUpsertRoom,
} from "../controllers/project-controller.js";

const router = express.Router();
const authenticate = passport.authenticate("jwt", { session: false });

router.get("/", authenticate, handleGetProjects);

router.post("/", authenticate, handleCreateProject);

router.post("/:projectId/rooms", authenticate, handleUpsertRoom);

export default router;
