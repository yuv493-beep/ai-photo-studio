import { Router } from 'express';
import authRoutes from './auth.routes';
import studioRoutes from './studio.routes';
import userRoutes from './user.routes';
import historyRoutes from './history.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/studio', studioRoutes);
router.use('/user', userRoutes);
router.use('/history', historyRoutes);
router.use('/payments', paymentRoutes);

export default router;