import { FTF_CONFIG } from '../../config/ftfConfig.js';
import {
    getBody,
    isBaseCandle,
    isValidLegIn,
    isValidLegOut,
    requiredLegBody
} from '../../utils/ftfCalculations.js';
import marketDataService from '../marketData.service.js';

const MIN_BASE_CANDLES = FTF_CONFIG.base.minCandles;
const MAX_BASE_CANDLES = FTF_CONFIG.base.maxCandles;

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

const logCandidateSequence = ({ sequenceLength, baseStartIndex, baseEndIndex, candles }) => {
    console.log('================================================');
    console.log('Candidate Sequence');
    console.log(`Length ${sequenceLength}`);
    console.log(`Base Start Index ${baseStartIndex}`);
    console.log(`Base End Index ${baseEndIndex}`);
    console.log(`Base Start Time ${toIST(candles[baseStartIndex].time)}`);
    console.log(`Base End Time ${toIST(candles[baseEndIndex].time)}`);
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

const logValidationSummary = ({ validation, legIn, legOut, largestBaseBody }) => {
    console.log('================================================');
    console.log('Leg-In');
    console.log(`Time ${toIST(legIn.time)}`);
    console.log(`Body ${getBody(legIn).toFixed(4)}`);
    console.log('================================================');
    console.log('Leg-Out');
    console.log(`Time ${toIST(legOut.time)}`);
    console.log(`Body ${getBody(legOut).toFixed(4)}`);
    console.log('================================================');
    console.log('Largest Base Body');
    console.log(largestBaseBody.toFixed(4));
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

export const debugLatestThreeBaseGroups = async () => {

    const candles = await marketDataService.getCandles(
        "BTC-USD",
        "5m",
        "60d"
    );

    if (!Array.isArray(candles) || candles.length < 3) {
        return [];
    }

    let startIndex = candles.length - 1;

    const groups = [];

    for (let i = 0; i < 3; i++) {

        console.log(`\n\n============== BASE GROUP ${i + 1} ==============\n`);

        const group = findBaseCandleGroup(
            candles,
            startIndex
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

export const findBaseCandleGroup = (candles, startIndex) => {
    // const candles = candlesInput || await marketDataService.getCandles('JIOFIN.NS', '5m', '60d');

    if (!Array.isArray(candles) || candles.length < 3) {
        return null;
    }

    let scanIndex = startIndex;

    while (scanIndex >= 0) {
        const candle = candles[scanIndex];
        const body = getBody(candle);
        const isBaseCandidate = isBaseCandle(candle);

        console.log('================================================');
        console.log('Scanning Candle');
        console.log(`Time ${toIST(candle.time)}`);
        console.log(`Body ${body.toFixed(4)}`);
        console.log(`Base Candidate ${isBaseCandidate ? 'YES' : 'NO'}`);
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

        logCandidateSequence({
            sequenceLength,
            baseStartIndex: sequenceEndIndex,
            baseEndIndex: sequenceStartIndex,
            candles
        });

        const baseStartIndex = sequenceEndIndex;
        const baseEndIndex = sequenceStartIndex;
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

        const baseCandles = candles.slice(baseStartIndex, baseEndIndex + 1);
        const legIn = candles[legInIndex];
        const legOut = candles[legOutIndex];
        const largestBaseBody = Math.max(...baseCandles.map((baseCandle) => getBody(baseCandle)));
        const validation = buildValidationResult({
            legInBody: getBody(legIn),
            legOutBody: getBody(legOut),
            largestBaseBody
        });

        logValidationSummary({ validation, legIn, legOut, largestBaseBody });

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