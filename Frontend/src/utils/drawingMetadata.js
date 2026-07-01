import resolveRenderableTime from './resolveRenderableTime';

export const formatTimeValue = (value) => {
    if (value == null || Number.isNaN(Number(value))) return '—';
    const time = new Date(Number(value) * 1000);
    return time.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatPriceValue = (value) => {
    if (value == null || Number.isNaN(Number(value))) return '—';
    return Number(value).toFixed(2);
};

export const getDrawingMetadata = ({ drawing, chart, series, candles = [] }) => {
    if (!drawing) return [];

    const resolvedStartTime = resolveRenderableTime(drawing?.start?.time, candles);
    const resolvedEndTime = resolveRenderableTime(drawing?.end?.time, candles);

    const rows = [
        {
            label: 'Tool',
            value: drawing.tool || 'trendline',
        },
        {
            label: 'Start Time',
            value: formatTimeValue(resolvedStartTime),
        },
        {
            label: 'End Time',
            value: formatTimeValue(resolvedEndTime),
        },
        {
            label: 'Start Price',
            value: formatPriceValue(drawing?.start?.price),
        },
        {
            label: 'End Price',
            value: formatPriceValue(drawing?.end?.price),
        },
        {
            label: 'Interval',
            value: drawing.createdInterval || '—',
        },
    ];

    if (chart && series && drawing?.start && drawing?.end) {
        const startCoord = {
            x: chart.timeScale().timeToCoordinate(resolvedStartTime),
            y: series.priceToCoordinate(drawing.start.price),
        };
        const endCoord = {
            x: chart.timeScale().timeToCoordinate(resolvedEndTime),
            y: series.priceToCoordinate(drawing.end.price),
        };

        rows.push({
            label: 'Coordinates',
            value: `(${Number.isFinite(startCoord.x) ? startCoord.x.toFixed(1) : '—'}, ${Number.isFinite(startCoord.y) ? startCoord.y.toFixed(1) : '—'}) → (${Number.isFinite(endCoord.x) ? endCoord.x.toFixed(1) : '—'}, ${Number.isFinite(endCoord.y) ? endCoord.y.toFixed(1) : '—'})`,
        });
    }

    return rows;
};
