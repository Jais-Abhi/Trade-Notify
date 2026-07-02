import React from 'react';
import { DEFAULT_DRAWING_STYLE } from '../../../../utils/drawingUtils';

const PriceRangeRenderer = ({ metrics, style }) => {
    if (!metrics?.visible) {
        return null;
    }

    const fillColor = style.color ?? DEFAULT_DRAWING_STYLE.color;
    const strokeColor = style.color ?? DEFAULT_DRAWING_STYLE.color;
    const fillOpacity = style.fillOpacity ?? DEFAULT_DRAWING_STYLE.fillOpacity;
    const lineWidth = style.selectedWidth ?? style.width ?? DEFAULT_DRAWING_STYLE.width;
    const arrowX = metrics.centerX;
    const arrowY1 = metrics.top + (metrics.height * 0.35);
    const arrowY2 = metrics.bottom - (metrics.height * 0.35);
    const arrowHeadSize = 7;
    const isUp = metrics.direction === 'up';

    return (
        <>
            <rect
                x={metrics.left}
                y={metrics.top}
                width={metrics.width}
                height={metrics.height}
                fill={fillColor}
                opacity={fillOpacity}
                pointerEvents="none"
            />
            <line
                x1={metrics.left}
                y1={metrics.top}
                x2={metrics.right}
                y2={metrics.top}
                stroke={strokeColor}
                strokeWidth={lineWidth}
                strokeLinecap="round"
                pointerEvents="none"
            />
            <line
                x1={metrics.left}
                y1={metrics.bottom}
                x2={metrics.right}
                y2={metrics.bottom}
                stroke={strokeColor}
                strokeWidth={lineWidth}
                strokeLinecap="round"
                pointerEvents="none"
            />
            <line
                x1={arrowX}
                y1={arrowY1}
                x2={arrowX}
                y2={arrowY2}
                stroke={strokeColor}
                strokeWidth={lineWidth}
                strokeLinecap="round"
                pointerEvents="none"
            />
            {isUp ? (
                <>
                    <line
                        x1={arrowX}
                        y1={arrowY1}
                        x2={arrowX - arrowHeadSize}
                        y2={arrowY1 + arrowHeadSize}
                        stroke={strokeColor}
                        strokeWidth={lineWidth}
                        strokeLinecap="round"
                        pointerEvents="none"
                    />
                    <line
                        x1={arrowX}
                        y1={arrowY1}
                        x2={arrowX + arrowHeadSize}
                        y2={arrowY1 + arrowHeadSize}
                        stroke={strokeColor}
                        strokeWidth={lineWidth}
                        strokeLinecap="round"
                        pointerEvents="none"
                    />
                </>
            ) : (
                <>
                    <line
                        x1={arrowX}
                        y1={arrowY2}
                        x2={arrowX - arrowHeadSize}
                        y2={arrowY2 - arrowHeadSize}
                        stroke={strokeColor}
                        strokeWidth={lineWidth}
                        strokeLinecap="round"
                        pointerEvents="none"
                    />
                    <line
                        x1={arrowX}
                        y1={arrowY2}
                        x2={arrowX + arrowHeadSize}
                        y2={arrowY2 - arrowHeadSize}
                        stroke={strokeColor}
                        strokeWidth={lineWidth}
                        strokeLinecap="round"
                        pointerEvents="none"
                    />
                </>
            )}
        </>
    );
};

export default PriceRangeRenderer;
