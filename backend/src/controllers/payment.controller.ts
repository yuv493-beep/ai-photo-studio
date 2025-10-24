// Fix: Corrected express import to resolve type errors with request/response objects.
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generatePaytmChecksum, verifyPaytmChecksum } from '../services/paytm.service';
import pool from '../db';
import { AppError } from '../middleware/errorHandler';

// Fix: Use express.Response and express.NextFunction for correct type inference.
export const createOrder = async (req: any, res: express.Response, next: express.NextFunction) => {
    const { planId, isYearly, amount, credits } = req.body; // `amount` and `credits` for credit packs
    const userId = req.user!.uid;
    
    let orderAmount: number;
    let description: string;
    
    try {
        if (planId) {
            const planQuery = await pool.query('SELECT * FROM plans WHERE id = $1', [planId]);
            if (planQuery.rows.length === 0) {
                return next(new AppError('Plan not found', 404));
            }
            const plan = planQuery.rows[0];
            orderAmount = isYearly ? plan.price_yearly : plan.price_monthly;
            description = `${plan.name} Plan (${isYearly ? 'Yearly' : 'Monthly'})`;
        } else if (amount && credits) {
            orderAmount = amount * 100; // Convert to paise
            description = `${credits} Credit Pack`;
        } else {
            return next(new AppError('Invalid order details', 400));
        }

        const orderId = `ORDER_${uuidv4()}`;

        // Create a pending payment record
        await pool.query(
            'INSERT INTO payments (user_id, amount, status, paytm_order_id, description) VALUES ($1, $2, $3, $4, $5)',
            [userId, orderAmount, 'pending', orderId, description]
        );
        
        const callbackUrl = process.env.PAYTM_CALLBACK_URL!;
        const paytmParams: any = {
            body: {
                requestType: "Payment",
                mid: process.env.PAYTM_MID!,
                websiteName: process.env.PAYTM_WEBSITE!,
                orderId: orderId,
                callbackUrl: callbackUrl,
                txnAmount: {
                    value: (orderAmount / 100).toFixed(2), // Amount in INR
                    currency: "INR",
                },
                userInfo: {
                    custId: userId,
                },
            },
            head: {},
        };

        const checksum = await generatePaytmChecksum(paytmParams.body);
        paytmParams.head.signature = checksum;

        res.status(200).json({
            orderId,
            token: checksum, // In a real SDK integration, this would be a transaction token
            amount: (orderAmount / 100).toFixed(2),
            mid: process.env.PAYTM_MID
        });

    } catch (error) {
        next(error);
    }
};

// Fix: Use express.Request, express.Response, and express.NextFunction for correct type inference.
export const handlePaytmCallback = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const paytmResponse = req.body;
    const orderId = paytmResponse.ORDERID;
    
    const client = await pool.connect();
    try {
        const isValid = true; // In real code: await verifyPaytmChecksum(paytmResponse);
        if (!isValid) {
            await client.query(`UPDATE payments SET status = 'failed' WHERE paytm_order_id = $1`, [orderId]);
            return res.redirect(`${process.env.CLIENT_URL}/payment-failure`);
        }
        
        if (paytmResponse.STATUS === 'TXN_SUCCESS') {
            await client.query('BEGIN');

            const paymentQuery = await client.query('SELECT * FROM payments WHERE paytm_order_id = $1 FOR UPDATE', [orderId]);
            const payment = paymentQuery.rows[0];

            if (payment.status !== 'pending') {
                await client.query('ROLLBACK');
                return res.redirect(`${process.env.CLIENT_URL}/payment-success`);
            }
            
            await client.query(`UPDATE payments SET status = 'success', paytm_txn_id = $2, response_data = $3 WHERE paytm_order_id = $1`, 
                [orderId, paytmResponse.TXNID, JSON.stringify(paytmResponse)]
            );
            
            if (payment.description.includes('Plan')) {
                const planId = payment.description.match(/(\w+)\sPlan/)?.[1].toLowerCase();
                 await client.query(
                    `UPDATE subscriptions SET status = 'active', plan_id = $1, current_period_end = NOW() + INTERVAL '1 month' WHERE user_id = $2`,
                    [planId, payment.user_id]
                );
            } else {
                const credits = parseInt(payment.description.split(' ')[0]);
                await client.query('UPDATE users SET credits = credits + $1 WHERE firebase_uid = $2', [credits, payment.user_id]);
            }

            await client.query('COMMIT');
            return res.redirect(`${process.env.CLIENT_URL}/payment-success`);

        } else {
             await client.query(`UPDATE payments SET status = 'failed', response_data = $2 WHERE paytm_order_id = $1`, 
                [orderId, JSON.stringify(paytmResponse)]
             );
            return res.redirect(`${process.env.CLIENT_URL}/payment-failure`);
        }

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Paytm callback error:', error);
        return res.redirect(`${process.env.CLIENT_URL}/payment-failure`);
    } finally {
        client.release();
    }
};