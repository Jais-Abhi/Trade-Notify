const resolveRenderableTime = (drawingTime, candles = []) => {
    if (!Array.isArray(candles) || candles.length === 0) {
        return null;
    }

    const normalizedDrawingTime = Number(drawingTime);
    if (!Number.isFinite(normalizedDrawingTime)) {
        return null;
    }

    const candleTimes = candles
        .map((candle) => Number(candle?.time))
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);

    if (candleTimes.length === 0) {
        return null;
    }

    if (normalizedDrawingTime < candleTimes[0]) {
        return null;
    }

    if (normalizedDrawingTime > candleTimes[candleTimes.length - 1]) {
        return null;
    }

    let left = 0;
    let right = candleTimes.length - 1;

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const candleTime = candleTimes[middle];

        if (candleTime === normalizedDrawingTime) {
            return candleTime;
        }

        if (candleTime < normalizedDrawingTime) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return candleTimes[Math.max(0, right)] ?? null;
};

export default resolveRenderableTime;
