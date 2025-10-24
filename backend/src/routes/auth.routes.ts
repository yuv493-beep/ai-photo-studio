import { Router } from 'express';
import { getOrCreateUser } from '../controllers/auth.controller';
import { firebaseAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected route to get (or create on first login) the current user's app profile
router.get('/me', firebaseAuthMiddleware, getOrCreateUser);

export default router;
