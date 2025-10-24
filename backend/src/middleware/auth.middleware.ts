// Fix: Corrected express import to resolve type errors with the response object.
import express from 'express';
import { AppError } from './errorHandler';
import { auth } from '../services/firebase.service';

// Fix: Use express.Response and express.NextFunction for correct type inference.
export const firebaseAuthMiddleware = async (req: any, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Unauthorized: No token provided.', 401));
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken; // Attach decoded token to request object
        next();
    } catch (error) {
        console.error('Firebase token verification error:', error);
        return next(new AppError('Unauthorized: Invalid token.', 401));
    }
};