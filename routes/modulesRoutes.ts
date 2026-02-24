import { Router } from "express";
import { getModules } from "../controllers/modulesController.js";
const router = Router();

router.get('/modules', getModules)
// router.get('/quiz')
// router.get('/quiz-answer')

export default router;
