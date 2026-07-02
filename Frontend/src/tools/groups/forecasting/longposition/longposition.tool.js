import { getLongPositionMetrics } from './longposition.metrics.js';
import LongPositionRenderer from './longposition.renderer.jsx';
import { DEFAULT_DRAWING_STYLE } from '../../../../utils/drawingUtils';

export const META = {
    tool: 'longposition',
    displayName: 'Long Position',
    group: 'forecasting',
    icon: 'long-position',
    supports: {
        color: true,
        width: true,
        fillOpacity: true,
        labels: true,
    },
};

const render = (drawing, state) => {
    const metrics = getLongPositionMetrics({ drawing, ...state });
    return {
        ...metrics,
        id: drawing.id,
        type: 'longposition',
    };
};

const hitTest = (drawing, point, state) => {
    const metrics = getLongPositionMetrics({ drawing, ...state });
    if (!metrics.visible) return false;

    const tol = 8;
    const left = metrics.left;
    const right = metrics.left + metrics.width;
    const top = Math.min(metrics.tpY, metrics.entryY);
    const bottom = Math.max(metrics.slY, metrics.entryY);

    // Only consider clicks near horizontal lines (tp, entry, sl)
    const nearTop = Math.abs(point.y - metrics.tpY) <= tol && point.x >= left && point.x <= right;
    const nearEntry = Math.abs(point.y - metrics.entryY) <= tol && point.x >= left && point.x <= right;
    const nearBottom = Math.abs(point.y - metrics.slY) <= tol && point.x >= left && point.x <= right;

    return nearTop || nearEntry || nearBottom;
};

const updateDom = (groupElement, metrics, style) => {
    if (!groupElement) return;
    groupElement.setAttribute('display', metrics.visible ? 'block' : 'none');
    if (!metrics.visible) return;

    const rects = groupElement.querySelectorAll('rect');
    const lines = groupElement.querySelectorAll('line');
    const circles = groupElement.querySelectorAll('circle');

    const profitColor = style.profitColor ?? DEFAULT_DRAWING_STYLE.color;
    const lossColor = style.lossColor ?? '#ef4444';
    const borderColor = style.borderColor ?? '#9ca3af';
    const entryColor = style.entryColor ?? '#3b82f6';
    const fillOpacity = style.fillOpacity ?? DEFAULT_DRAWING_STYLE.fillOpacity;
    const lineWidth = style.selectedWidth ?? style.width ?? DEFAULT_DRAWING_STYLE.width;

    if (rects[0]) {
        rects[0].setAttribute('x', metrics.left);
        rects[0].setAttribute('y', Math.min(metrics.tpY, metrics.entryY));
        rects[0].setAttribute('width', Math.max(2, metrics.width));
        rects[0].setAttribute('height', Math.max(2, metrics.entryY - metrics.tpY));
        rects[0].setAttribute('fill', profitColor);
        rects[0].setAttribute('opacity', fillOpacity);
        rects[0].setAttribute('stroke', borderColor);
    }
    if (rects[1]) {
        rects[1].setAttribute('x', metrics.left);
        rects[1].setAttribute('y', metrics.entryY);
        rects[1].setAttribute('width', Math.max(2, metrics.width));
        rects[1].setAttribute('height', Math.max(2, metrics.slY - metrics.entryY));
        rects[1].setAttribute('fill', lossColor);
        rects[1].setAttribute('opacity', fillOpacity);
        rects[1].setAttribute('stroke', borderColor);
    }

    if (lines[0]) {
        lines[0].setAttribute('x1', metrics.left);
        lines[0].setAttribute('y1', metrics.tpY);
        lines[0].setAttribute('x2', metrics.left + Math.max(2, metrics.width));
        lines[0].setAttribute('y2', metrics.tpY);
        lines[0].setAttribute('stroke', profitColor);
        lines[0].setAttribute('stroke-width', lineWidth);
    }
    if (lines[1]) {
        lines[1].setAttribute('x1', metrics.left);
        lines[1].setAttribute('y1', metrics.entryY);
        lines[1].setAttribute('x2', metrics.left + Math.max(2, metrics.width));
        lines[1].setAttribute('y2', metrics.entryY);
        lines[1].setAttribute('stroke', entryColor);
        lines[1].setAttribute('stroke-width', lineWidth);
    }
    if (lines[2]) {
        lines[2].setAttribute('x1', metrics.left);
        lines[2].setAttribute('y1', metrics.slY);
        lines[2].setAttribute('x2', metrics.left + Math.max(2, metrics.width));
        lines[2].setAttribute('y2', metrics.slY);
        lines[2].setAttribute('stroke', lossColor);
        lines[2].setAttribute('stroke-width', lineWidth);
    }

    const cxLeft = metrics.left;
    const cxRight = metrics.left + Math.max(2, metrics.width);
    const cyMid = (Math.min(metrics.tpY, metrics.entryY) + Math.max(metrics.slY, metrics.entryY)) / 2;

    if (circles[0]) {
        circles[0].setAttribute('cx', metrics.centerX);
        circles[0].setAttribute('cy', metrics.tpY);
        circles[0].setAttribute('stroke', profitColor);
    }
    if (circles[1]) {
        circles[1].setAttribute('cx', metrics.centerX);
        circles[1].setAttribute('cy', metrics.entryY);
        circles[1].setAttribute('stroke', entryColor);
    }
    if (circles[2]) {
        circles[2].setAttribute('cx', metrics.centerX);
        circles[2].setAttribute('cy', metrics.slY);
        circles[2].setAttribute('stroke', lossColor);
    }
    if (circles[3]) {
        circles[3].setAttribute('cx', cxLeft);
        circles[3].setAttribute('cy', cyMid);
        circles[3].setAttribute('stroke', borderColor);
    }
    if (circles[4]) {
        circles[4].setAttribute('cx', cxRight);
        circles[4].setAttribute('cy', cyMid);
        circles[4].setAttribute('stroke', borderColor);
    }
};

export default {
    META,
    render,
    hitTest,
    updateDom,
    Renderer: LongPositionRenderer,
};
