import { Router } from "express";
import { getQuestions } from "../controllers/questionsController.js";

const router = Router();

router.get('/questions', getQuestions)

export default router;
