import resolveRenderableTime from '../../../../utils/resolveRenderableTime';

export const getLineDrawingMetrics = ({ drawing, chart, series, candles = [] }) => {
    if (!drawing || !chart || !series) {
        return {
            visible: false,
            start: null,
            end: null,
        };
    }

    const resolvedStartTime = resolveRenderableTime(drawing?.start?.time, candles);
    const resolvedEndTime = resolveRenderableTime(drawing?.end?.time, candles);

    const start = {
        x: resolvedStartTime == null ? null : chart.timeScale().timeToCoordinate(resolvedStartTime),
        y: series.priceToCoordinate(drawing?.start?.price),
    };
    const end = {
        x: resolvedEndTime == null ? null : chart.timeScale().timeToCoordinate(resolvedEndTime),
        y: series.priceToCoordinate(drawing?.end?.price),
    };

    return {
        visible: start.x !== null && start.y !== null && end.x !== null && end.y !== null,
        start,
        end,
    };
};

export const getTrendLineMetrics = (args) => getLineDrawingMetrics(args);

export default {
    getTrendLineMetrics,
    getLineDrawingMetrics,
};
