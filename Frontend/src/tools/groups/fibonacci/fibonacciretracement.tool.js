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

const updateDom = (groupElement, metrics, style = {}) => {
    if (!groupElement) return;
    
    const visible = metrics?.visible;
    groupElement.setAttribute('display', visible ? 'block' : 'none');
    if (!visible) return;

    // Update all horizontal level lines and fills
    const levelGroups = groupElement.querySelectorAll('.fibo-level-group');
    levelGroups.forEach((levelGroup, index) => {
        const level = metrics.levels[index];
        if (!level) return;

        // Update fill rect if present
        const fillRect = levelGroup.querySelector('.fibo-fill');
        if (fillRect) {
            const nextLevel = metrics.levels[index + 1];
            if (nextLevel) {
                fillRect.setAttribute('x', Math.min(metrics.start.x, metrics.end.x));
                fillRect.setAttribute('y', Math.min(level.y, nextLevel.y));
                fillRect.setAttribute('width', Math.max(2, Math.abs(metrics.end.x - metrics.start.x)));
                fillRect.setAttribute('height', Math.abs(nextLevel.y - level.y));
            }
        }

        // Update level line
        const levelLine = levelGroup.querySelector('.fibo-line');
        if (levelLine) {
            levelLine.setAttribute('x1', metrics.start.x);
            levelLine.setAttribute('y1', level.y);
            levelLine.setAttribute('x2', metrics.end.x);
            levelLine.setAttribute('y2', level.y);
        }

        // Update level label
        const levelLabel = levelGroup.querySelector('.fibo-label');
        if (levelLabel) {
            levelLabel.setAttribute('x', Math.min(metrics.start.x, metrics.end.x) + 8);
            levelLabel.setAttribute('y', level.y - 6);
        }
    });

    // Update selection rectangle (only visible when selected)
    const rects = Array.from(groupElement.querySelectorAll('rect'));
    const selectionRect = rects.find(rect => 
        rect.getAttribute('fill') === 'none' && 
        rect.getAttribute('stroke-dasharray') === '4, 4'
    );
    if (selectionRect) {
        selectionRect.setAttribute('x', Math.min(metrics.start.x, metrics.end.x));
        selectionRect.setAttribute('y', Math.min(metrics.start.y, metrics.end.y));
        selectionRect.setAttribute('width', Math.max(2, Math.abs(metrics.end.x - metrics.start.x)));
        selectionRect.setAttribute('height', Math.max(2, Math.abs(metrics.end.y - metrics.start.y)));
    }

    // Update diagonal lines (both visible and transparent hit-test)
    const lines = Array.from(groupElement.querySelectorAll('line'));
    lines.forEach((line) => {
        // Skip level lines - they were already updated above
        if (line.classList.contains('fibo-line')) return;
        
        // Update all other lines (diagonal visible + hit-test transparent)
        line.setAttribute('x1', metrics.start.x);
        line.setAttribute('y1', metrics.start.y);
        line.setAttribute('x2', metrics.end.x);
        line.setAttribute('y2', metrics.end.y);
    });

    // Update handle circles
    const circles = groupElement.querySelectorAll('circle');
    if (circles.length >= 2) {
        const c1 = Array.from(circles).find(c => c.classList.contains('c1'));
        const c2 = Array.from(circles).find(c => c.classList.contains('c2'));
        
        if (c1) {
            c1.setAttribute('cx', metrics.start.x);
            c1.setAttribute('cy', metrics.start.y);
        }
        if (c2) {
            c2.setAttribute('cx', metrics.end.x);
            c2.setAttribute('cy', metrics.end.y);
        }
    }
};

export default {
    META,
    render,
    hitTest,
    updateDom,
    Renderer: FibonacciRenderer,
};
