import { Router } from "express";
import { getModules } from "../controllers/modulesController.js";
const router = Router();

router.get('/modules', getModules)


export default router;
