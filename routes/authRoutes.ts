import express from "express";
const router = express.Router();
import { registerUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/authController.js';

router.post("/register", registerUser);
router.post("/login", loginUser)

export default router