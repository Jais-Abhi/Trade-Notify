import marketDataService from '../services/marketData.service.js';
import { intervalRangeMap } from '../config/market.config.js';

// @desc    Get historical candle data for a stock
// @route   GET /api/market/candles
export const getMarketCandles = async (req, res) => {
    try {
        const symbol = req.query.symbol;
        const interval = req.query.interval || '5m';

        // 1. Validate inputs
        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: 'Symbol is required'
            });
        }

        // Validate interval using the config map
        if (!intervalRangeMap[interval]) {
            return res.status(400).json({
                success: false,
                message: `Invalid interval. Allowed intervals: ${Object.keys(intervalRangeMap).join(', ')}`
            });
        }

        // 2. Resolve default range from config mapping
        const range = intervalRangeMap[interval] || '5d';

        // 3. Call service to fetch and transform data
        const candles = await marketDataService.getCandles(symbol, interval, range);

        // 3. Return response in strictly expected format
        return res.status(200).json({
            success: true,
            data: {
                symbol: symbol.toUpperCase(),
                interval,
                candles
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
