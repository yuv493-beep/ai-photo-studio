import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middleware/auth.middleware';
import { getHistory } from '../controllers/history.controller';

const router = Router();

router.get('/', firebaseAuthMiddleware, getHistory);

export default router;
