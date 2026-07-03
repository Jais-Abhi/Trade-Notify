import FibonacciRenderer from './fibonacci.renderer.jsx';
import { getFibonacciMetrics } from './fibonacci.metrics.js';

export const META = {
    tool: 'fibonacciretracement',
    displayName: 'Fibonacci Retracement',
    group: 'fibonacci',
    icon: 'fibonacci-retracement',
    supports: {
        color: true,
        width: true,
        fillOpacity: true,
        labels: true,
        background: true,
        movable: true,
        resizable: true,
    },
};

const render = (drawing, state) => {
    const metrics = getFibonacciMetrics({ drawing, ...state });
    return {
        ...metrics,
        id: drawing.id,
        type: 'fibonacciretracement',
    };
};

const hitTest = (drawing, point, state) => {
    const metrics = getFibonacciMetrics({ drawing, ...state });
    if (!metrics.visible) return false;

    const tolerance = 8;
    const left = Math.min(metrics.start.x, metrics.end.x) - tolerance;
    const right = Math.max(metrics.start.x, metrics.end.x) + tolerance;
    const top = Math.min(metrics.start.y, metrics.end.y) - tolerance;
    const bottom = Math.max(metrics.start.y, metrics.end.y) + tolerance;

    return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
};

export default {
    META,
    render,
    hitTest,
    Renderer: FibonacciRenderer,
};
