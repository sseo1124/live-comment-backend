import express from "express";
import { siginup, login } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/register", siginup);
router.post("/login", login);

export default router;
