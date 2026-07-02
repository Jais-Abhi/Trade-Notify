import resolveRenderableTime from '../../../../utils/resolveRenderableTime';

const getBounds = ({ start, end }) => {
    const left = Math.min(start.x, end.x);
    const right = Math.max(start.x, end.x);
    const width = Math.max(2, right - left);
    return { left, right, width };
};

export const getLongPositionMetrics = ({ drawing, chart, series, candles = [] }) => {
    if (!drawing || !chart || !series) {
        return { visible: false };
    }

    const resolvedStart = resolveRenderableTime(drawing.start.time, candles);
    const resolvedEnd = resolveRenderableTime(drawing.end.time, candles);

    const start = {
        x: resolvedStart == null ? null : chart.timeScale().timeToCoordinate(resolvedStart),
        y: series.priceToCoordinate(drawing.start.price),
    };
    const end = {
        x: resolvedEnd == null ? null : chart.timeScale().timeToCoordinate(resolvedEnd),
        y: series.priceToCoordinate(drawing.end.price),
    };

    if (start.x == null || start.y == null || end.x == null || end.y == null) {
        return { visible: false };
    }

    const bounds = getBounds({ start, end });
    const centerX = bounds.left + bounds.width / 2;
    const entryY = start.y;

    // offsets in pixels (defaults)
    const tpOffsetPx = drawing.options?.tpOffsetPx ?? drawing.options?.tpOffset ?? 40;
    const slOffsetPx = drawing.options?.slOffsetPx ?? drawing.options?.slOffset ?? 40;

    // if explicit prices provided in options, prefer them
    const tpPrice = (drawing.options?.tpPrice != null)
        ? drawing.options.tpPrice
        : series.coordinateToPrice(entryY - tpOffsetPx);
    const slPrice = (drawing.options?.slPrice != null)
        ? drawing.options.slPrice
        : series.coordinateToPrice(entryY + slOffsetPx);

    const tpY = series.priceToCoordinate(tpPrice);
    const slY = series.priceToCoordinate(slPrice);

    const top = Math.min(tpY, entryY);
    const bottom = Math.max(slY, entryY);

    return {
        visible: bounds.width >= 2 && (bottom - top) > 2,
        start,
        end,
        left: bounds.left,
        right: bounds.right,
        width: bounds.width,
        centerX,
        entryY,
        tpY,
        slY,
        tpPrice,
        slPrice,
        tpOffsetPx,
        slOffsetPx,
    };
};

export default {
    getLongPositionMetrics,
};
