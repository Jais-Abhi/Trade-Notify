const resolveRenderableTime = (drawingTime, candles = []) => {
    if (!Array.isArray(candles) || candles.length === 0) {
        return null;
    }

    const normalizedDrawingTime = Number(drawingTime);
    if (!Number.isFinite(normalizedDrawingTime)) {
        return null;
    }

    const firstCandleTime = Number(candles[0]?.time);
    const lastCandleTime = Number(candles[candles.length - 1]?.time);

    if (!Number.isFinite(firstCandleTime) || !Number.isFinite(lastCandleTime)) {
        return null;
    }

    if (normalizedDrawingTime <= firstCandleTime) {
        return firstCandleTime;
    }

    if (normalizedDrawingTime >= lastCandleTime) {
        return lastCandleTime;
    }

    let left = 0;
    let right = candles.length - 1;
    let bestMatch = null;

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const candleTime = Number(candles[middle]?.time);

        if (!Number.isFinite(candleTime)) {
            return null;
        }

        if (candleTime === normalizedDrawingTime) {
            return candleTime;
        }

        if (candleTime < normalizedDrawingTime) {
            bestMatch = candleTime;
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    // Return the candle whose open time is <= the drawing timestamp.
    // This is the candle that CONTAINS the drawing, not the nearest one.
    // For cross-timeframe rendering, we need the candle that includes the timestamp,
    // not whichever candle happens to be closest.
    return bestMatch;
};

export default resolveRenderableTime;
