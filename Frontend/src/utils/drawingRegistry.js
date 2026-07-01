import { getTrendLineMetrics, getPriceRangeMetrics } from './drawingUtils';

const TOOL_RENDERERS = {
    trendline: {
        render: (drawing, state) => {
            const metrics = getTrendLineMetrics({ drawing, ...state });
            return {
                ...metrics,
                type: 'trendline',
            };
        },
        hitTest: (drawing, point, state) => {
            const metrics = getTrendLineMetrics({ drawing, ...state });
            if (!metrics.visible || !metrics.start || !metrics.end) return false;

            const dx = metrics.end.x - metrics.start.x;
            const dy = metrics.end.y - metrics.start.y;
            const lengthSq = dx * dx + dy * dy;
            if (lengthSq === 0) return false;

            const t = ((point.x - metrics.start.x) * dx + (point.y - metrics.start.y) * dy) / lengthSq;
            const clamped = Math.max(0, Math.min(1, t));
            const nearestX = metrics.start.x + clamped * dx;
            const nearestY = metrics.start.y + clamped * dy;
            const dist = Math.hypot(point.x - nearestX, point.y - nearestY);
            return dist <= 8;
        },
    },
    pricerange: {
        render: (drawing, state) => {
            const metrics = getPriceRangeMetrics({ drawing, ...state });
            return {
                ...metrics,
                type: 'pricerange',
            };
        },
        hitTest: (drawing, point, state) => {
            const metrics = getPriceRangeMetrics({ drawing, ...state });
            if (!metrics.visible || !metrics.bounds) return false;

            const { x, y, width, height } = metrics.bounds;
            return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
        },
    },
};

export const getToolRenderer = (tool = 'trendline') => TOOL_RENDERERS[tool] || TOOL_RENDERERS.trendline;

export const TOOL_DEFINITIONS = [
    {
        tool: 'trendline',
        displayName: 'Trend Line',
        category: 'Lines',
        icon: 'trend-line',
        order: 1,
        enabled: true,
        style: {
            color: '#3b82f6',
            width: 2,
            lineStyle: 'solid',
            opacity: 0.75,
            fillOpacity: 0.16,
        },
        options: {
            extendLeft: false,
            extendRight: false,
        },
        supports: {
            color: true,
            width: true,
            lineStyle: true,
            opacity: true,
        },
    },
];
