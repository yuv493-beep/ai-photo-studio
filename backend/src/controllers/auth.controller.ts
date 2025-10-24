// Fix: Corrected express import to resolve type errors with the response object.
import express from 'express';
import pool from '../db';
import { AppError } from '../middleware/errorHandler';

// Fix: Use express.Response and express.NextFunction for correct type inference.
export const getOrCreateUser = async (req: any, res: express.Response, next: express.NextFunction) => {
    const firebaseUser = req.user; // from firebaseAuthMiddleware
    if (!firebaseUser?.uid || !firebaseUser?.email) {
        return next(new AppError('Invalid user data from authentication provider.', 400));
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Check if user exists
        let userQuery = await client.query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUser.uid]);
        let user = userQuery.rows[0];

        // 2. If user does NOT exist, create them
        if (!user) {
            console.log(`Creating new user profile for UID: ${firebaseUser.uid}`);
            const newUserQuery = await client.query(
                'INSERT INTO users (firebase_uid, name, email, credits, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [firebaseUser.uid, firebaseUser.name || 'New User', firebaseUser.email, 5, firebaseUser.email_verified]
            );
            user = newUserQuery.rows[0];

            // Assign starter subscription
            await client.query(
                "INSERT INTO subscriptions (user_id, plan_id, status) VALUES ($1, 'starter', 'active')",
                [user.firebase_uid]
            );
        } else {
             // 3. If user exists, sync their verification status from Firebase
             if (user.is_verified !== firebaseUser.email_verified) {
                console.log(`Syncing verification status for UID: ${firebaseUser.uid}`);
                const updatedUserQuery = await client.query(
                    'UPDATE users SET is_verified = $1 WHERE firebase_uid = $2 RETURNING *',
                    [firebaseUser.email_verified, firebaseUser.uid]
                );
                user = updatedUserQuery.rows[0];
             }
        }

        // 4. Get subscription details to attach to the final user object
        const subQuery = await client.query(
            "SELECT plan_id, status as subscription_status FROM subscriptions WHERE user_id = $1",
            [user.firebase_uid]
        );
        
        const subscription = subQuery.rows[0] || { plan_id: 'starter', subscription_status: 'inactive' };

        await client.query('COMMIT');
        
        // 5. Return the full application user profile
        const userPayload = {
            id: user.firebase_uid, // Keep 'id' for frontend compatibility
            name: user.name,
            email: user.email,
            role: user.role,
            credits: user.credits,
            is_verified: user.is_verified,
            plan_id: subscription.plan_id,
            subscription_status: subscription.subscription_status
        };
        
        res.status(200).json({ user: userPayload });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};