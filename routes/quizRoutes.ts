import express from "express";
const router = express.Router();
import { getEkonomiquiz } from "../controllers/quizController.js";
import { getJuridikquiz } from "../controllers/quizController.js";

router.get("/ekonomiquiz", getEkonomiquiz)
router.get("/juridikquiz", getJuridikquiz)


export default router
