import React from 'react';
import resolveRenderableTime from '../../../../utils/resolveRenderableTime';

const getPreviewMetrics = ({ startPoint, currentPoint, chart, series, candles = [] }) => {
    if (!startPoint || !currentPoint || !chart || !series) {
        return { visible: false };
    }

    const startX = chart.timeScale().timeToCoordinate(resolveRenderableTime(startPoint.time, candles));
    const startY = series.priceToCoordinate(startPoint.price);
    const endX = chart.timeScale().timeToCoordinate(resolveRenderableTime(currentPoint.time, candles));
    const endY = series.priceToCoordinate(currentPoint.price);

    if ([startX, startY, endX, endY].some((coord) => coord == null || Number.isNaN(coord))) {
        return { visible: false };
    }

    return {
        visible: true,
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
    };
};

const FibonacciPreview = ({ startPoint, currentPoint, chart, series, candles, style = {}, activeToolConfig = {} }) => {
    const metrics = getPreviewMetrics({ startPoint, currentPoint, chart, series, candles });
    if (!metrics.visible) return null;

    const diagonalColor = activeToolConfig?.style?.diagonalColor ?? style.color;
    const diagonalWidth = activeToolConfig?.style?.diagonalWidth ?? style.width;
    const diagonalLineStyle = activeToolConfig?.style?.diagonalLineStyle ?? style.lineStyle;

    const levels = activeToolConfig?.options?.levels || [];
    const enabledLevels = levels.filter((level) => level?.enabled).sort((a, b) => b.value - a.value);
    const rangeHeight = metrics.end.y - metrics.start.y;
    const fillOpacity = activeToolConfig?.style?.fillOpacity ?? style.fillOpacity;

    return (
        <>
            {enabledLevels.map((level, index) => {
                const y = metrics.start.y + rangeHeight * (1 - level.value);
                const nextLevel = enabledLevels[index + 1];
                const nextY = nextLevel ? metrics.start.y + rangeHeight * (1 - nextLevel.value) : null;
                return (
                    <g key={`preview-level-${level.value}`}>
                        {nextY !== null && (
                            <rect
                                x={Math.min(metrics.start.x, metrics.end.x)}
                                y={Math.min(y, nextY)}
                                width={Math.max(2, Math.abs(metrics.end.x - metrics.start.x))}
                                height={Math.abs(nextY - y)}
                                fill={level.color ?? style.color}
                                opacity={fillOpacity}
                                pointerEvents="none"
                            />
                        )}
                        <line
                            x1={metrics.start.x}
                            y1={y}
                            x2={metrics.end.x}
                            y2={y}
                            stroke={level.color ?? style.color}
                            strokeWidth={activeToolConfig?.style?.levelWidth ?? style.width}
                            strokeDasharray={diagonalLineStyle === 'dashed' ? '6, 4' : '0'}
                            strokeLinecap="round"
                            pointerEvents="none"
                        />
                        <text
                            x={Math.min(metrics.start.x, metrics.end.x) + 8}
                            y={y - 6}
                            fill={activeToolConfig?.style?.textColor ?? style.color}
                            fontSize="10"
                            fontWeight="600"
                            pointerEvents="none"
                        >
                            {level.label}
                        </text>
                    </g>
                );
            })}
            <line
                x1={metrics.start.x}
                y1={metrics.start.y}
                x2={metrics.end.x}
                y2={metrics.end.y}
                stroke={diagonalColor}
                strokeWidth={diagonalWidth}
                strokeDasharray={diagonalLineStyle === 'dashed' ? '6, 4' : '0'}
                strokeLinecap="round"
                pointerEvents="none"
            />
        </>
    );
};

export default FibonacciPreview;
