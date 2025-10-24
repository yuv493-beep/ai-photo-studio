import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middleware/auth.middleware';
import { createOrder, handlePaytmCallback } from '../controllers/payment.controller';

const router = Router();

// Protected route to create a payment order
router.post('/create-order', firebaseAuthMiddleware, createOrder);

// Public route for Paytm to send callback data
// This route should be whitelisted from CSRF protection if you use it
router.post('/callback', handlePaytmCallback);

export default router;
