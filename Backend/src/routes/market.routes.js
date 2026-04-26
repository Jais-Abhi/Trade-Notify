import express from 'express';
import { getMarketCandles, getMarketIntervals } from '../controllers/market.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply auth middleware if you only want logged-in users to fetch market data
router.get('/candles', protect, getMarketCandles);
router.get('/intervals', protect, getMarketIntervals);

export default router;
