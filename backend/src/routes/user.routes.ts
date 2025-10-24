import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middleware/auth.middleware';
import { getPaymentHistory } from '../controllers/user.controller';

const router = Router();

router.use(firebaseAuthMiddleware);

router.get('/payment-history', getPaymentHistory);

export default router;
