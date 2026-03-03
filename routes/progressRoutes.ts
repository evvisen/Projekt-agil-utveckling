import { Router } from "express";
import { completeAndUnlockNext} from "../controllers/progressController.js";

const router = Router();

router.put('/progress', completeAndUnlockNext)


export default router;
