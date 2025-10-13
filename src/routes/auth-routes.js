import express from "express";
import { siginup } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/register", siginup);

export default router;
