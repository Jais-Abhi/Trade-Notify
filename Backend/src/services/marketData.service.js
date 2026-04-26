import axios from 'axios';

class MarketDataService {
    /**
     * Fetches raw market data from Yahoo Finance and cleans it into standard candles
     * @param {string} symbol - Stock symbol (e.g. RELIANCE.NS)
     * @param {string} interval - Timeframe interval (e.g. 5m, 15m, 60m)
     * @param {string} range - Data range (e.g. 5d)
     * @returns {Array} - Array of clean candle objects
     */
    async getCandles(symbol, interval, range) {
        try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
            
            const response = await axios.get(url, {
                headers: {
                    // Added User-Agent to prevent Yahoo Finance from blocking the request
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                }
            });

            const data = response.data;
            
            // Validate response structure
            if (!data || !data.chart || !data.chart.result || data.chart.result.length === 0) {
                throw new Error('Invalid data received from external API');
            }

            const result = data.chart.result[0];
            
            // Extract raw data arrays
            const timestamps = result.timestamp || [];
            const indicators = result.indicators.quote[0] || {};
            const { open, high, low, close } = indicators;

            if (!timestamps.length || !open || !high || !low || !close) {
                throw new Error('No historical data available for this symbol');
            }

            // Transform into clean candle array
            const candles = [];
            
            for (let i = 0; i < timestamps.length; i++) {
                // Remove entries with null/invalid values (Yahoo sometimes returns nulls for market halts)
                if (
                    open[i] === null || 
                    high[i] === null || 
                    low[i] === null || 
                    close[i] === null
                ) {
                    continue;
                }

                candles.push({
                    time: timestamps[i],
                    open: Number(open[i].toFixed(2)),
                    high: Number(high[i].toFixed(2)),
                    low: Number(low[i].toFixed(2)),
                    close: Number(close[i].toFixed(2))
                });
            }

            return candles;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error('Symbol not found');
            }
            throw new Error(`Failed to fetch market data: ${error.message}`);
        }
    }
}

export default new MarketDataService();
