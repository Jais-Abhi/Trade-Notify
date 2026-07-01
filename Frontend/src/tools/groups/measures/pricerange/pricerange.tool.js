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

    const tolerance = 6;
    const withinX = point.x >= metrics.left && point.x <= metrics.right;
    const onTopLine = Math.abs(point.y - metrics.top) <= tolerance && withinX;
    const onBottomLine = Math.abs(point.y - metrics.bottom) <= tolerance && withinX;

    return onTopLine || onBottomLine;
};

const updateDom = (groupElement, metrics, style) => {
    if (!groupElement) return;

    const visible = metrics?.visible;
    groupElement.setAttribute('display', visible ? 'block' : 'none');
    if (!visible) return;

    const rect = groupElement.querySelector('rect');
    const lines = Array.from(groupElement.querySelectorAll('line'));
    const fillColor = style.color || '#22c55e';
    const strokeColor = style.color || '#22c55e';
    const opacity = style.opacity ?? 0.18;
    const arrowHeadSize = 7;
    const isUp = metrics.direction === 'up';

    if (rect) {
        rect.setAttribute('x', metrics.left);
        rect.setAttribute('y', metrics.top);
        rect.setAttribute('width', metrics.width);
        rect.setAttribute('height', metrics.height);
        rect.setAttribute('fill', fillColor);
        rect.setAttribute('opacity', opacity);
    }

    if (lines.length < 5) return;

    // line order in PriceRangeRenderer:
    // 0 = top border, 1 = bottom border, 2 = center line, 3 = arrow head line1, 4 = arrow head line2
    lines[0].setAttribute('x1', metrics.left);
    lines[0].setAttribute('y1', metrics.top);
    lines[0].setAttribute('x2', metrics.right);
    lines[0].setAttribute('y2', metrics.top);
    lines[0].setAttribute('stroke', strokeColor);

    lines[1].setAttribute('x1', metrics.left);
    lines[1].setAttribute('y1', metrics.bottom);
    lines[1].setAttribute('x2', metrics.right);
    lines[1].setAttribute('y2', metrics.bottom);
    lines[1].setAttribute('stroke', strokeColor);

    const arrowX = metrics.centerX;
    const arrowY1 = metrics.top + (metrics.height * 0.35);
    const arrowY2 = metrics.bottom - (metrics.height * 0.35);

    lines[2].setAttribute('x1', arrowX);
    lines[2].setAttribute('y1', arrowY1);
    lines[2].setAttribute('x2', arrowX);
    lines[2].setAttribute('y2', arrowY2);
    lines[2].setAttribute('stroke', strokeColor);

    if (isUp) {
        lines[3].setAttribute('x1', arrowX);
        lines[3].setAttribute('y1', arrowY1);
        lines[3].setAttribute('x2', arrowX - arrowHeadSize);
        lines[3].setAttribute('y2', arrowY1 + arrowHeadSize);
        lines[4].setAttribute('x1', arrowX);
        lines[4].setAttribute('y1', arrowY1);
        lines[4].setAttribute('x2', arrowX + arrowHeadSize);
        lines[4].setAttribute('y2', arrowY1 + arrowHeadSize);
    } else {
        lines[3].setAttribute('x1', arrowX);
        lines[3].setAttribute('y1', arrowY2);
        lines[3].setAttribute('x2', arrowX - arrowHeadSize);
        lines[3].setAttribute('y2', arrowY2 - arrowHeadSize);
        lines[4].setAttribute('x1', arrowX);
        lines[4].setAttribute('y1', arrowY2);
        lines[4].setAttribute('x2', arrowX + arrowHeadSize);
        lines[4].setAttribute('y2', arrowY2 - arrowHeadSize);
    }

    lines.slice(0, 5).forEach(line => {
        line.setAttribute('stroke-width', 2);
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('pointer-events', 'none');
    });
};

export default {
    META,
    render,
    hitTest,
    updateDom,
    Renderer: PriceRangeRenderer,
};
