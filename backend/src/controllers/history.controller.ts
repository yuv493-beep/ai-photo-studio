// Fix: Corrected express import to resolve type errors with the response object.
import express from 'express';
import pool from '../db';

// Fix: Use express.Response and express.NextFunction for correct type inference.
export const getHistory = async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
        const historyQuery = await pool.query(
            'SELECT id, theme, original_image_base64, generated_images, created_at FROM generation_history WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user!.uid]
        );

        // Map database result to frontend format
        const history = historyQuery.rows.map(item => ({
            id: item.id,
            timestamp: item.created_at,
            theme: item.theme,
            images: item.generated_images, // a JSONB array of objects
            originalImageBase64: item.original_image_base64,
        }));
        
        res.status(200).json({ history });

    } catch (error) {
        next(error);
    }
};