import { FTF_CONFIG } from "../config/ftfConfig.js";

/**
 * Candle Body
 */
export const getBody = (candle) =>
    Math.abs(candle.close - candle.open);

/**
 * Candle Range
 */
export const getRange = (candle) =>
    candle.high - candle.low;

/**
 * Upper Wick
 */
export const getUpperWick = (candle) =>
    candle.high - Math.max(candle.open, candle.close);

/**
 * Lower Wick
 */
export const getLowerWick = (candle) =>
    Math.min(candle.open, candle.close) - candle.low;

/**
 * Body %
 */
export const getBodyPercent = (candle) => {

    const range = getRange(candle);

    if (range === 0) return 0;

    return getBody(candle) / range;
};

/**
 * Is Base Candle
 */
export const isBaseCandle = (candle) =>
    getBodyPercent(candle) <
    FTF_CONFIG.base.maxBodyPercentOfRange;

/**
 * Required Leg Body
 */
export const requiredLegBody = (largestBaseBody) =>
    largestBaseBody *
    (1 + FTF_CONFIG.legOut.bodyIncreasePercent / 100);

/**
 * Is Valid Leg-In
 */
export const isValidLegIn = (legBody, largestBaseBody) =>
    legBody >=
    largestBaseBody *
    (1 + FTF_CONFIG.legIn.bodyIncreasePercent / 100);

/**
 * Is Valid Leg-Out
 */
export const isValidLegOut = (legBody, largestBaseBody) =>
    legBody >= requiredLegBody(largestBaseBody);