// Fix: Corrected express import to resolve type errors with middleware and response objects.
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { testConnection } from './db'; // Import test function
import './services/firebase.service'; // Import to initialize Firebase Admin SDK

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT || 8080);
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Basic security & limits
app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting (tweak values for production)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api', apiRoutes);

// Health check
// Fix: Use express.Request and express.Response for correct type inference.
app.get('/', (req: express.Request, res: express.Response) => res.send('AI Studio Backend is running'));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  testConnection(); // Test DB connection on startup
});
