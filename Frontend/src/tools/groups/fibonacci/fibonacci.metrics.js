import resolveRenderableTime from '../../../../utils/resolveRenderableTime';

const getLevelRows = ({ drawing, activeToolConfig }) => {
    const levels = activeToolConfig?.options?.levels || [];
    return levels.filter((level) => level?.enabled);
};

export const getFibonacciMetrics = ({ drawing, chart, series, candles = [], activeToolConfig = {} }) => {
    if (!drawing || !chart || !series) {
        return {
            visible: false,
            start: null,
            end: null,
            levels: [],
            direction: 'down',
        };
    }

    const resolvedStartTime = resolveRenderableTime(drawing.start?.time, candles);
    const resolvedEndTime = resolveRenderableTime(drawing.end?.time, candles);

    if (resolvedStartTime == null || resolvedEndTime == null) {
        return {
            visible: false,
            start: null,
            end: null,
            levels: [],
            direction: 'down',
        };
    }

    const start = {
        x: chart.timeScale().timeToCoordinate(resolvedStartTime),
        y: series.priceToCoordinate(drawing.start?.price),
    };
    const end = {
        x: chart.timeScale().timeToCoordinate(resolvedEndTime),
        y: series.priceToCoordinate(drawing.end?.price),
    };

    const visible = start.x !== null && start.y !== null && end.x !== null && end.y !== null;
    if (!visible) {
        return {
            visible: false,
            start: null,
            end: null,
            levels: [],
            direction: 'down',
        };
    }

    const levels = getLevelRows({ drawing, activeToolConfig });
    const rangeHeight = end.y - start.y;
    const direction = rangeHeight < 0 ? 'up' : 'down';

    const sortedLevels = [...levels].sort((a, b) => b.value - a.value);
    const levelMetrics = sortedLevels.map((level) => {
        const y = start.y + rangeHeight * (1 - level.value);
        return {
            ...level,
            y,
        };
    });

    return {
        visible,
        start,
        end,
        levels: levelMetrics,
        direction,
    };
};

export default {
    getFibonacciMetrics,
};
