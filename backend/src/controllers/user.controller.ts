// Fix: Corrected express import to resolve type errors with the response object.
import express from 'express';
import pool from '../db';

// Fix: Use express.Response and express.NextFunction for correct type inference.
export const getPaymentHistory = async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
        const historyQuery = await pool.query(
            "SELECT id, created_at, description, amount FROM payments WHERE user_id = $1 AND status = 'success' ORDER BY created_at DESC",
            [req.user!.uid]
        );
        
        const history = historyQuery.rows.map(item => ({
            id: item.id,
            date: item.created_at,
            description: item.description,
            amount: (item.amount / 100).toFixed(2), // Convert from paise
        }));

        res.status(200).json({ history });
    } catch (error) {
        next(error);
    }
};