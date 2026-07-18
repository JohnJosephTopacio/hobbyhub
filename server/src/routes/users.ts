import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getUserInformation } from "../controllers/auth.js";

const usersRouter = Router();

usersRouter.get('/me', authenticateToken, getUserInformation);

export default usersRouter;