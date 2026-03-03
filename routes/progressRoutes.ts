import { Router } from "express";
import { completeAndUnlockNext, getUserProgress} from "../controllers/progressController.js";

const router = Router();

router.put('/progress', completeAndUnlockNext)
router.get('/progress/:user_id/:module_id', getUserProgress)

export default router;
