import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../db';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth credentials are not set. Google Sign-In will not work.");
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const { id: googleId, displayName: name, emails } = profile;
        const email = emails?.[0]?.value;

        if (!email) {
            return done(new Error("Google profile did not return an email."), false);
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            let userResult = await client.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

            if (userResult.rows.length > 0) {
                await client.query('COMMIT');
                return done(null, userResult.rows[0]);
            }

            userResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userResult.rows.length > 0) {
                const updatedUserResult = await client.query(
                    'UPDATE users SET google_id = $1, auth_provider = $2 WHERE email = $3 RETURNING *',
                    [googleId, 'google', email]
                );
                await client.query('COMMIT');
                return done(null, updatedUserResult.rows[0]);
            }

            // Create new user, automatically verified
            const newUserResult = await client.query(
                'INSERT INTO users (name, email, google_id, auth_provider, credits, is_verified) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *',
                [name, email, googleId, 'google', 5]
            );
            const newUser = newUserResult.rows[0];
            
            await client.query(
                'INSERT INTO subscriptions (user_id, plan_id, status) VALUES ($1, $2, $3)',
                [newUser.id, 'starter', 'active']
            );
            await client.query('COMMIT');

            return done(null, newUser);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        return done(error, false);
    }
}));
