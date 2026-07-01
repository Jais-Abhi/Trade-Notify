import { getPriceRangeMetrics } from './pricerange.metrics.js';
import PriceRangeRenderer from './pricerange.renderer.jsx';

export const META = {
    tool: 'pricerange',
    displayName: 'Price Range',
    group: 'measures',
    icon: 'pricerange',
    supports: {
        color: true,
        width: true,
    },
};

const render = (drawing, state) => {
    const metrics = getPriceRangeMetrics({ drawing, ...state });
    return {
        ...metrics,
        type: 'pricerange',
    };
};

const hitTest = (drawing, point, state) => {
    const metrics = getPriceRangeMetrics({ drawing, ...state });
    if (!metrics.visible) return false;
    return point.x >= metrics.left && point.x <= metrics.right && point.y >= metrics.top && point.y <= metrics.bottom;
};

export default {
    META,
    render,
    hitTest,
    Renderer: PriceRangeRenderer,
};
