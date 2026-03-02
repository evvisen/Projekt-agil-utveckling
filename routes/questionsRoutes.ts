import { Router } from "express";
import { getQuestions, postAnswer } from "../controllers/questionsController.js";

const router = Router();

router.get('/questions', getQuestions)
router.post('/answer', postAnswer)

export default router;
