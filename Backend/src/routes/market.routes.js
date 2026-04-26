import express from 'express';
import { getMarketCandles } from '../controllers/market.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply auth middleware if you only want logged-in users to fetch market data
router.get('/candles', protect, getMarketCandles);

export default router;
