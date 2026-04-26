import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import connectDB from './src/config/db.js';
import marketRoutes from './src/routes/market.routes.js';
import stockRoutes from './src/routes/stock.routes.js';
import wishlistRoutes from './src/routes/wishlist.routes.js';
import cookieParser from 'cookie-parser';

// Load environment variables

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://tradenotify.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && !origin.endsWith('.vercel.app')) {
            return callback(new Error('CORS Policy: Origin not allowed'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Simple route
app.get('/api/test', (req, res) => {
    res.send('API is working');
});

app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
