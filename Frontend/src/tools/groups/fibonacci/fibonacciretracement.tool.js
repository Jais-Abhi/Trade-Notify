import FibonacciRenderer from './fibonacciretracement.renderer.jsx';
import { getFibonacciMetrics } from './fibonacci.metrics.js';
import { getStrokeDasharray } from '../../../utils/drawingUtils';

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

const updateDom = (groupElement, metrics, style, activeToolConfig = {}) => {
    if (!groupElement || !metrics?.visible) {
        if (groupElement) groupElement.setAttribute('display', 'none');
        return;
    }

    const toolStyle = activeToolConfig?.style || {};
    const diagonalColor = style.color;
    const diagonalWidth = style.selectedWidth ?? style.width;
    const diagonalLineStyle = toolStyle.diagonalLineStyle || style.lineStyle;
    const levelLineWidth = toolStyle.levelWidth ?? style.width;
    const levelLineStyle = toolStyle.levelLineStyle || style.lineStyle;
    const fillOpacity = toolStyle.fillOpacity ?? style.fillOpacity;
    const textColor = toolStyle.textColor ?? style.color;

    const left = Math.min(metrics.start.x, metrics.end.x);
    const width = Math.max(2, Math.abs(metrics.end.x - metrics.start.x));

    groupElement.innerHTML = '';

    const createSvgElement = (name) => document.createElementNS('http://www.w3.org/2000/svg', name);

    metrics.levels.forEach((level, index) => {
        const nextLevel = metrics.levels[index + 1];
        const y = level.y;

        if (nextLevel) {
            const nextY = nextLevel.y;
            const fillRect = createSvgElement('rect');
            fillRect.setAttribute('x', left.toString());
            fillRect.setAttribute('y', Math.min(y, nextY).toString());
            fillRect.setAttribute('width', width.toString());
            fillRect.setAttribute('height', Math.abs(nextY - y).toString());
            fillRect.setAttribute('fill', level.color ?? style.color);
            fillRect.setAttribute('opacity', fillOpacity.toString());
            fillRect.setAttribute('pointer-events', 'none');
            groupElement.appendChild(fillRect);
        }

        const line = createSvgElement('line');
        line.setAttribute('x1', metrics.start.x.toString());
        line.setAttribute('y1', y.toString());
        line.setAttribute('x2', metrics.end.x.toString());
        line.setAttribute('y2', y.toString());
        line.setAttribute('stroke', level.color ?? style.color);
        line.setAttribute('stroke-width', levelLineWidth.toString());
        line.setAttribute('stroke-dasharray', getStrokeDasharray(levelLineStyle));
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('pointer-events', 'none');
        groupElement.appendChild(line);

        const text = createSvgElement('text');
        text.setAttribute('x', (left + 8).toString());
        text.setAttribute('y', (y - 6).toString());
        text.setAttribute('fill', textColor);
        text.setAttribute('font-size', '10');
        text.setAttribute('font-weight', '600');
        text.setAttribute('pointer-events', 'none');
        text.textContent = level.label;
        groupElement.appendChild(text);
    });

    const diagonal = createSvgElement('line');
    diagonal.setAttribute('x1', metrics.start.x.toString());
    diagonal.setAttribute('y1', metrics.start.y.toString());
    diagonal.setAttribute('x2', metrics.end.x.toString());
    diagonal.setAttribute('y2', metrics.end.y.toString());
    diagonal.setAttribute('stroke', diagonalColor);
    diagonal.setAttribute('stroke-width', diagonalWidth.toString());
    diagonal.setAttribute('stroke-dasharray', getStrokeDasharray(diagonalLineStyle));
    diagonal.setAttribute('stroke-linecap', 'round');
    diagonal.setAttribute('pointer-events', 'none');
    groupElement.appendChild(diagonal);

    const hitLine = createSvgElement('line');
    hitLine.setAttribute('stroke', 'transparent');
    hitLine.setAttribute('stroke-width', '12');
    hitLine.setAttribute('data-line-body-id', metrics.id);
    hitLine.setAttribute('style', 'pointer-events: stroke; cursor: pointer;');
    hitLine.setAttribute('x1', metrics.start.x.toString());
    hitLine.setAttribute('y1', metrics.start.y.toString());
    hitLine.setAttribute('x2', metrics.end.x.toString());
    hitLine.setAttribute('y2', metrics.end.y.toString());
    groupElement.appendChild(hitLine);

    const circle1 = createSvgElement('circle');
    circle1.setAttribute('class', 'c1');
    circle1.setAttribute('data-line-id', metrics.id);
    circle1.setAttribute('data-handle', '1');
    circle1.setAttribute('r', '5');
    circle1.setAttribute('fill', '#ffffff');
    circle1.setAttribute('stroke', diagonalColor);
    circle1.setAttribute('stroke-width', '2.5');
    circle1.setAttribute('cx', metrics.start.x.toString());
    circle1.setAttribute('cy', metrics.start.y.toString());
    circle1.setAttribute('style', 'pointer-events: all; cursor: move; display: block;');
    groupElement.appendChild(circle1);

    const circle2 = createSvgElement('circle');
    circle2.setAttribute('class', 'c2');
    circle2.setAttribute('data-line-id', metrics.id);
    circle2.setAttribute('data-handle', '2');
    circle2.setAttribute('r', '5');
    circle2.setAttribute('fill', '#ffffff');
    circle2.setAttribute('stroke', diagonalColor);
    circle2.setAttribute('stroke-width', '2.5');
    circle2.setAttribute('cx', metrics.end.x.toString());
    circle2.setAttribute('cy', metrics.end.y.toString());
    circle2.setAttribute('style', 'pointer-events: all; cursor: move; display: block;');
    groupElement.appendChild(circle2);
};

export default {
    META,
    render,
    hitTest,
    updateDom,
    Renderer: FibonacciRenderer,
};
