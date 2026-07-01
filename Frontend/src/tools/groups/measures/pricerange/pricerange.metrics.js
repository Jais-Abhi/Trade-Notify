import resolveRenderableTime from '../../../../utils/resolveRenderableTime';

const getRectBounds = ({ start, end }) => {
    const left = Math.min(start.x, end.x);
    const right = Math.max(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const bottom = Math.max(start.y, end.y);
    return { left, right, top, bottom, width: right - left, height: bottom - top };
};

export const getPriceRangeMetrics = ({ drawing, chart, series, candles = [] }) => {
    if (!drawing || !chart || !series) {
        return {
            visible: false,
            left: null,
            right: null,
            top: null,
            bottom: null,
            centerX: null,
            direction: 'up',
        };
    }

    const resolvedStartTime = resolveRenderableTime(drawing.start.time, candles);
    const resolvedEndTime = resolveRenderableTime(drawing.end.time, candles);

    const start = {
        x: resolvedStartTime == null ? null : chart.timeScale().timeToCoordinate(resolvedStartTime),
        y: series.priceToCoordinate(drawing.start.price),
    };
    const end = {
        x: resolvedEndTime == null ? null : chart.timeScale().timeToCoordinate(resolvedEndTime),
        y: series.priceToCoordinate(drawing.end.price),
    };

    if (start.x == null || start.y == null || end.x == null || end.y == null) {
        return {
            visible: false,
            left: null,
            right: null,
            top: null,
            bottom: null,
            centerX: null,
            direction: 'up',
        };
    }

    const bounds = getRectBounds({ start, end });
    const direction = drawing.end.price > drawing.start.price ? 'up' : drawing.end.price < drawing.start.price ? 'down' : 'up';
    const centerX = bounds.left + bounds.width / 2;

    return {
        visible: bounds.width > 0 && bounds.height > 0,
        ...bounds,
        start,
        end,
        centerX,
        direction,
    };
};

export const getPriceRangePreviewMetrics = ({ startPoint, currentPoint, chart, series, candles = [] }) => {
    if (!startPoint || !currentPoint || !chart || !series) {
        return {
            visible: false,
            left: null,
            right: null,
            top: null,
            bottom: null,
            centerX: null,
            direction: 'up',
        };
    }

    const previewDrawing = {
        start: startPoint,
        end: currentPoint,
    };

    return getPriceRangeMetrics({ drawing: previewDrawing, chart, series, candles });
};
