import { FTF_CONFIG } from '../../config/ftfConfig.js';
import {
    getBody,
    getRange,
    isBaseCandle,
    isValidLegIn,
    isValidLegOut,
    requiredLegBody
} from '../../utils/ftfCalculations.js';
import marketDataService from '../marketData.service.js';
import FTF from '../../models/baseCandle.schema.js';
import { notifyNewBaseCandleGroup } from '../notificationService.js';

const MIN_BASE_CANDLES = FTF_CONFIG.base.minCandles;
const MAX_BASE_CANDLES = FTF_CONFIG.base.maxCandles;
const DEFAULT_SYMBOL = 'BTC-USD';
const DEFAULT_INTERVAL = '5m';

const toIST = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

const getCandleMetrics = (candle) => {
    const body = getBody(candle);
    const range = getRange(candle);
    const bodyPercentage = range === 0 ? 100 : (body / range) * 100;

    return {
        body,
        range,
        bodyPercentage
    };
};

const logCandidateSequence = ({ sequenceLength, baseStartIndex, baseEndIndex, candles, baseCandles }) => {
    const largestBaseBody = Math.max(...baseCandles.map((baseCandle) => getBody(baseCandle)));
    const largestBaseBodyPercentage = (() => {
        const largestBaseRange = getRange(baseCandles.find((baseCandle) => getBody(baseCandle) === largestBaseBody) || baseCandles[0]);
        return largestBaseRange === 0 ? 100 : (largestBaseBody / largestBaseRange) * 100;
    })();

    console.log('================================================');
    console.log('Candidate Sequence');
    console.log(`Length ${sequenceLength}`);
    console.log(`Base Start Index ${baseStartIndex}`);
    console.log(`Base End Index ${baseEndIndex}`);
    console.log(`Base Start Time ${toIST(candles[baseStartIndex].time)}`);
    console.log(`Base End Time ${toIST(candles[baseEndIndex].time)}`);
    console.log(`Number of Base Candles ${baseCandles.length}`);

    baseCandles.forEach((baseCandle, index) => {
        const { bodyPercentage } = getCandleMetrics(baseCandle);
        console.log(`Base Candle ${index + 1} Body Percentage : ${bodyPercentage.toFixed(2)}%`);
    });

    console.log(`Largest Base Body ${largestBaseBody.toFixed(4)}`);
    console.log(`Largest Base Body Percentage ${largestBaseBodyPercentage.toFixed(2)}%`);
    console.log('================================================');
};

const buildValidationResult = ({ legInBody, legOutBody, largestBaseBody }) => {
    const requiredBody = requiredLegBody(largestBaseBody);
    const legInPassed = isValidLegIn(legInBody, largestBaseBody);
    const legOutPassed = isValidLegOut(legOutBody, largestBaseBody);

    return {
        requiredLegBody: requiredBody,
        legInBody,
        legOutBody,
        legIn: {
            passed: legInPassed,
            reason: legInPassed ? 'PASS' : 'Leg-In Body too small'
        },
        legOut: {
            passed: legOutPassed,
            reason: legOutPassed ? 'PASS' : 'Leg-Out Body too small'
        },
        overall: legInPassed && legOutPassed
    };
};

const logValidationSummary = ({ validation, legIn, legOut, largestBaseBody, baseCandles }) => {
    const legInMetrics = getCandleMetrics(legIn);
    const legOutMetrics = getCandleMetrics(legOut);
    const largestBaseCandle = baseCandles.find((baseCandle) => getBody(baseCandle) === largestBaseBody) || baseCandles[0];
    const largestBaseMetrics = getCandleMetrics(largestBaseCandle);

    console.log('================================================');
    console.log('Leg-In');
    console.log(`Time ${toIST(legIn.time)}`);
    console.log(`Body ${legInMetrics.body.toFixed(4)}`);
    console.log(`Range ${legInMetrics.range.toFixed(4)}`);
    console.log(`Body Percentage ${legInMetrics.bodyPercentage.toFixed(2)}%`);
    console.log('================================================');
    console.log('Leg-Out');
    console.log(`Time ${toIST(legOut.time)}`);
    console.log(`Body ${legOutMetrics.body.toFixed(4)}`);
    console.log(`Range ${legOutMetrics.range.toFixed(4)}`);
    console.log(`Body Percentage ${legOutMetrics.bodyPercentage.toFixed(2)}%`);
    console.log('================================================');
    console.log('Largest Base');
    console.log(`Body ${largestBaseBody.toFixed(4)}`);
    console.log(`Range ${largestBaseMetrics.range.toFixed(4)}`);
    console.log(`Body Percentage ${largestBaseMetrics.bodyPercentage.toFixed(2)}%`);
    console.log('================================================');
    console.log('Required Leg Body');
    console.log(validation.requiredLegBody.toFixed(4));
    console.log('================================================');
    console.log('Leg-In Validation');
    console.log(validation.legIn.reason);
    console.log('================================================');
    console.log('Leg-Out Validation');
    console.log(validation.legOut.reason);
    console.log('================================================');
};

const fetchCandles = async () => {
    const candles = await marketDataService.getCandles(
        "BTC-USD",
        "5m",
        "60d"
    );
    return candles;
}

export const debugLatestThreeBaseGroups = async () => {

    const candles = await fetchCandles();

    if (!Array.isArray(candles) || candles.length < 3) {
        return [];
    }

    let startIndex = candles.length - 3;

    const groups = [];

    for (let i = 0; i < 3; i++) {

        console.log(`\n\n============== BASE GROUP ${i + 1} ==============\n`);

        const group = await findBaseCandleGroup(
            candles,
            { startIndex, symbol: DEFAULT_SYMBOL, interval: DEFAULT_INTERVAL }
        );

        if (!group) {
            break;
        }

        groups.push(group);

        startIndex = group.nextStartIndex;

        if (startIndex < 0) {
            break;
        }
    }

    return groups;
};

export const findBaseCandleGroup = async (candlesInput, options = {}) => {
    const normalizedOptions = typeof options === 'number' ? { startIndex: options } : options;
    const symbol = normalizedOptions.symbol || DEFAULT_SYMBOL;
    const interval = normalizedOptions.interval || DEFAULT_INTERVAL;
    const candles = Array.isArray(candlesInput)
        ? candlesInput
        : await marketDataService.getCandles(symbol, interval, '60d');

    if (!Array.isArray(candles) || candles.length < 3) {
        return null;
    }

    let ftf = await FTF.findOne({ symbol, interval });

    if (!ftf) {
        ftf = new FTF({
            symbol,
            interval,
            latestBaseTimestamp: 0,
            baseCandleGroups: []
        });
    }

    const latestBaseTimestamp = ftf.latestBaseTimestamp;
    let startIndex = typeof normalizedOptions.startIndex === 'number'
        ? normalizedOptions.startIndex
        : candles.length - 3;
    let scanIndex = startIndex;

    while (scanIndex >= 0) {
        const candle = candles[scanIndex];

        if (candle.time <= latestBaseTimestamp) {
            console.log('================================================');
            console.log('Scanner Stopped');
            console.log('================================================');
            console.log('Reason :');
            console.log('Already processed candles reached.');
            console.log('');
            console.log('Latest Base Timestamp :');
            console.log(latestBaseTimestamp);
            console.log('Scanner stopped successfully.');
            console.log('================================================');
            return null;
        }
        const isBaseCandidate = isBaseCandle(candle);
        const { body, range, bodyPercentage } = getCandleMetrics(candle);

        console.log('================================================');
        console.log('Scanning Candle');
        console.log(`Time            : ${toIST(candle.time)}`);
        console.log(`Open            : ${candle.open.toFixed(4)}`);
        console.log(`High            : ${candle.high.toFixed(4)}`);
        console.log(`Low             : ${candle.low.toFixed(4)}`);
        console.log(`Close           : ${candle.close.toFixed(4)}`);
        console.log('');
        console.log(`Body            : ${body.toFixed(4)}`);
        console.log(`Range           : ${range.toFixed(4)}`);
        console.log(`Body Percentage : ${bodyPercentage.toFixed(2)}%`);
        console.log('');
        console.log(`Base Candidate  : ${isBaseCandidate ? 'YES' : 'NO'}`);
        console.log('================================================');

        if (!isBaseCandidate) {
            scanIndex -= 1;
            continue;
        }

        const sequenceStartIndex = scanIndex;
        let sequenceEndIndex = scanIndex;
        let sequenceLength = 1;
        let nextIndex = scanIndex - 1;

        while (nextIndex >= 0 && isBaseCandle(candles[nextIndex])) {
            sequenceLength += 1;
            sequenceEndIndex = nextIndex;
            nextIndex -= 1;
        }

        if (sequenceLength > MAX_BASE_CANDLES) {
            console.log('================================================');
            console.log('Rejected');
            console.log('Reason');
            console.log('More than 3 consecutive base candidates');
            console.log('================================================');
            scanIndex = sequenceEndIndex - 1;
            continue;
        }

        const baseStartIndex = sequenceEndIndex;
        const baseEndIndex = sequenceStartIndex;
        const baseCandles = candles.slice(baseStartIndex, baseEndIndex + 1);

        logCandidateSequence({
            sequenceLength,
            baseStartIndex: sequenceEndIndex,
            baseEndIndex: sequenceStartIndex,
            candles,
            baseCandles
        });
        const legInIndex = baseStartIndex - 1;
        const legOutIndex = baseEndIndex + 1;

        if (legInIndex < 0 || legOutIndex >= candles.length) {
            console.log('================================================');
            console.log('Rejected');
            console.log('Reason');
            console.log('Leg-In or Leg-Out index is out of bounds');
            console.log('================================================');
            scanIndex = baseStartIndex - 1;
            continue;
        }

        const legIn = candles[legInIndex];
        const legOut = candles[legOutIndex];
        const largestBaseBody = Math.max(...baseCandles.map((baseCandle) => getBody(baseCandle)));
        const validation = buildValidationResult({
            legInBody: getBody(legIn),
            legOutBody: getBody(legOut),
            largestBaseBody
        });

        logValidationSummary({ validation, legIn, legOut, largestBaseBody, baseCandles });

        if (!validation.overall) {
            console.log('================================================');
            console.log('Rejected');
            console.log('Reason');
            console.log(validation.legIn.reason === 'PASS' ? validation.legOut.reason : validation.legIn.reason);
            console.log('================================================');
            scanIndex = baseStartIndex - 1;
            continue;
        }

        const result = {
    baseCandles,
    legIn,
    legOut,

    baseStartIndex,
    baseEndIndex,

    legInIndex,
    legOutIndex,

    baseStartTime: baseCandles[0].time,
    baseEndTime: baseCandles[baseCandles.length - 1].time,

    largestBaseBody,

    requiredLegBody: validation.requiredLegBody,

    legInBody: validation.legInBody,
    legOutBody: validation.legOutBody,

    validation,

    nextStartIndex: baseStartIndex - 1
};

        ftf.baseCandleGroups.push({
            baseCandles,
            legIn,
            legOut,
            baseStartTime: result.baseStartTime,
            baseEndTime: result.baseEndTime,
            detectedAt: new Date()
        });

        ftf.latestBaseTimestamp = result.baseEndTime;
        await ftf.save();

        await notifyNewBaseCandleGroup({
            symbol,
            interval,
            baseCandleGroup: {
                ...ftf.baseCandleGroups[ftf.baseCandleGroups.length - 1],
                baseCandles,
                legIn,
                legOut,
                baseStartTime: result.baseStartTime,
                baseEndTime: result.baseEndTime
            }
        });

        console.log('================================================');
        console.log('MongoDB Save');
        console.log('================================================');
        console.log(`Symbol                : ${symbol}`);
        console.log(`Interval              : ${interval}`);
        console.log(`Base Start Time (IST) : ${toIST(result.baseStartTime)}`);
        console.log(`Base End Time (IST)   : ${toIST(result.baseEndTime)}`);
        console.log(`Updated Timestamp     : ${result.baseEndTime}`);
        console.log(`Status                : SUCCESS`);
        console.log('================================================');

        console.log('================================================');
        console.log('Base Candle Set Found');
        console.log('================================================');
        console.log(JSON.stringify(result, null, 2));
        return result;
    }

    return null;
};

export default {
    findBaseCandleGroup,
    debugLatestThreeBaseGroups
};