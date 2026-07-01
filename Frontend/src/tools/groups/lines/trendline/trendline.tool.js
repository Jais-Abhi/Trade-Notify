import { getTrendLineMetrics } from './trendline.metrics.js';
import TrendlineFloatingToolbar from './components/TrendlineFloatingToolbar.jsx';

export const META = {
    tool: 'trendline',
    displayName: 'Trend Line',
    group: 'lines',
    icon: 'trendline',
    supports: {
        color: true,
        width: true,
    },
};

const render = (drawing, state) => {
    const metrics = getTrendLineMetrics({ drawing, ...state });
    return {
        ...metrics,
        type: 'trendline',
    };
};

export const UI = {
    FloatingToolbar: TrendlineFloatingToolbar,
};

const hitTest = (drawing, point, state) => {
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
};

export default {
    META,
    render,
    hitTest,
    FloatingToolbar: TrendlineFloatingToolbar,
};
