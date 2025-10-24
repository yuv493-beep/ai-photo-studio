import { Pool } from 'pg';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error("FATAL: DATABASE_URL environment variable is not set.");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Recommended settings for a serverless environment
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
});

export const testConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('Database connection successful.');
        client.release();
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit if the DB connection is not available on startup
    }
};

export default pool;
