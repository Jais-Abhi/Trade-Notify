import assert from 'node:assert/strict';
import { findBaseCandleGroup } from './baseCandleScanner.js';

const candles = [
  { time: 1, open: 100, high: 110, low: 100, close: 110 },
  { time: 2, open: 100, high: 105, low: 95, close: 101 },
  { time: 3, open: 100, high: 105, low: 95, close: 101 },
  { time: 4, open: 100, high: 105, low: 95, close: 101 },
  { time: 5, open: 100, high: 110, low: 100, close: 110 }
];

const result = await findBaseCandleGroup(candles);

assert.equal(result.baseCandles.length, 3, 'Expected three base candles');
assert.equal(result.legIn.time, 1, 'Expected the candle before the base group as leg-in');
assert.equal(result.legOut.time, 5, 'Expected the candle after the base group as leg-out');
assert.ok(result.largestBaseBody > 0, 'Expected a largest base body to be calculated');

console.log('Base candle scanner test passed');
