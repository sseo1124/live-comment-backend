import express from "express";
import passport from "passport";
import { handleCreateProject } from "../controllers/project-controller.js";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  handleCreateProject
);

export default router;
