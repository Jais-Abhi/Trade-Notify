import React from 'react';
import { getDrawingVisualStyle, getStrokeDasharray } from '../../../utils/drawingUtils';

const FibonacciRenderer = ({ drawing, metrics, style, activeToolConfig, isSelected }) => {
    if (!metrics?.visible) return null;

    const toolStyle = activeToolConfig?.style || {};
    const diagonalColor = drawing?.style?.diagonalColor ?? toolStyle.diagonalColor ?? style.color;
    const diagonalWidth = drawing?.style?.diagonalWidth ?? toolStyle.diagonalWidth ?? style.width;
    const diagonalLineStyle = drawing?.style?.diagonalLineStyle ?? toolStyle.diagonalLineStyle ?? style.lineStyle;

    const levelLineWidth = drawing?.style?.levelWidth ?? toolStyle.levelWidth ?? style.width;
    const levelLineStyle = drawing?.style?.levelLineStyle ?? toolStyle.levelLineStyle ?? style.lineStyle;
    const fillOpacity = drawing?.style?.fillOpacity ?? toolStyle.fillOpacity ?? style.fillOpacity;
    const textColor = drawing?.style?.textColor ?? toolStyle.textColor ?? style.color;

    const showLabels = activeToolConfig?.options?.showLabels ?? true;
    const showBackground = activeToolConfig?.options?.showBackground ?? true;

    const horizontalLines = metrics.levels.map((level, index) => {
        const nextLevel = metrics.levels[index + 1];
        const lineColor = level.color ?? style.color;
        return (
            <g key={`level-${level.value}`} className="fibo-level-group">
                {showBackground && nextLevel && (
                    <rect
                        className="fibo-fill"
                        x={Math.min(metrics.start.x, metrics.end.x)}
                        y={Math.min(level.y, nextLevel.y)}
                        width={Math.max(2, Math.abs(metrics.end.x - metrics.start.x))}
                        height={Math.abs(nextLevel.y - level.y)}
                        fill={level.color ?? style.color}
                        opacity={fillOpacity}
                        pointerEvents="none"
                    />
                )}
                <line
                    className="fibo-line"
                    x1={metrics.start.x}
                    y1={level.y}
                    x2={metrics.end.x}
                    y2={level.y}
                    stroke={lineColor}
                    strokeWidth={levelLineWidth}
                    strokeDasharray={getStrokeDasharray(levelLineStyle)}
                    strokeLinecap="round"
                    pointerEvents="none"
                />
                {showLabels && (
                    <text
                        className="fibo-label"
                        x={Math.min(metrics.start.x, metrics.end.x) + 8}
                        y={level.y - 6}
                        fill={textColor}
                        fontSize="10"
                        fontWeight="600"
                        pointerEvents="none"
                    >
                        {level.label}
                    </text>
                )}
            </g>
        );
    });

    return (
        <>
            {horizontalLines}

            {isSelected && (
                <rect
                    x={Math.min(metrics.start.x, metrics.end.x)}
                    y={Math.min(metrics.start.y, metrics.end.y)}
                    width={Math.max(2, Math.abs(metrics.end.x - metrics.start.x))}
                    height={Math.max(2, Math.abs(metrics.end.y - metrics.start.y))}
                    fill="none"
                    stroke={style.color}
                    strokeWidth="1"
                    strokeDasharray="4, 4"
                    opacity="0.65"
                    pointerEvents="none"
                />
            )}

            <line
                x1={metrics.start.x}
                y1={metrics.start.y}
                x2={metrics.end.x}
                y2={metrics.end.y}
                stroke={diagonalColor}
                strokeWidth={diagonalWidth}
                strokeDasharray={getStrokeDasharray(diagonalLineStyle)}
                strokeLinecap="round"
                pointerEvents="none"
            />

            <line
                stroke="transparent"
                strokeWidth="12"
                data-line-body-id={drawing.id}
                style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                x1={metrics.start.x}
                y1={metrics.start.y}
                x2={metrics.end.x}
                y2={metrics.end.y}
            />

            <circle
                className="c1"
                data-line-id={drawing.id}
                data-handle="1"
                r="5"
                fill="#ffffff"
                stroke={diagonalColor}
                strokeWidth="2.5"
                style={{ pointerEvents: 'all', cursor: 'move', display: 'block' }}
                cx={metrics.start.x}
                cy={metrics.start.y}
            />
            <circle
                className="c2"
                data-line-id={drawing.id}
                data-handle="2"
                r="5"
                fill="#ffffff"
                stroke={diagonalColor}
                strokeWidth="2.5"
                style={{ pointerEvents: 'all', cursor: 'move', display: 'block' }}
                cx={metrics.end.x}
                cy={metrics.end.y}
            />
        </>
    );
};

export default FibonacciRenderer;
