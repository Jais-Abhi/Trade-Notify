import React from 'react';
import { DEFAULT_DRAWING_STYLE } from '../../../../utils/drawingUtils';

const LongPositionRenderer = ({ metrics, style }) => {
    if (!metrics?.visible) return null;

    const profitColor = style.profitColor ?? DEFAULT_DRAWING_STYLE.color;
    const lossColor = style.lossColor ?? '#ef4444';
    const borderColor = style.borderColor ?? '#9ca3af';
    const entryColor = style.entryColor ?? '#3b82f6';
    const fillOpacity = style.fillOpacity ?? DEFAULT_DRAWING_STYLE.fillOpacity;

    const left = metrics.left;
    const width = Math.max(2, metrics.width);
    const centerX = metrics.centerX;

    const top = Math.min(metrics.tpY, metrics.entryY);
    const entryY = metrics.entryY;
    const bottom = Math.max(metrics.slY, metrics.entryY);

    const profitHeight = Math.max(2, entryY - top);
    const lossHeight = Math.max(2, bottom - entryY);

    return (
        <>
            {/* Profit rectangle (behind) */}
            <rect
                x={left}
                y={top}
                width={width}
                height={profitHeight}
                fill={profitColor}
                opacity={fillOpacity}
                stroke={borderColor}
                pointerEvents="none"
            />

            {/* Loss rectangle (behind) */}
            <rect
                x={left}
                y={entryY}
                width={width}
                height={lossHeight}
                fill={lossColor}
                opacity={fillOpacity}
                stroke={borderColor}
                pointerEvents="none"
            />

            {/* Take Profit line (top) */}
            <line
                x1={left}
                y1={metrics.tpY}
                x2={left + width}
                y2={metrics.tpY}
                stroke={profitColor}
                strokeWidth={style.selectedWidth ?? style.width ?? DEFAULT_DRAWING_STYLE.width}
                strokeLinecap="round"
                pointerEvents="none"
            />

            {/* Entry line (center) */}
            <line
                x1={left}
                y1={entryY}
                x2={left + width}
                y2={entryY}
                stroke={entryColor}
                strokeWidth={style.selectedWidth ?? style.width ?? DEFAULT_DRAWING_STYLE.width}
                strokeLinecap="round"
                pointerEvents="none"
            />

            {/* Stop Loss line (bottom) */}
            <line
                x1={left}
                y1={metrics.slY}
                x2={left + width}
                y2={metrics.slY}
                stroke={lossColor}
                strokeWidth={style.selectedWidth ?? style.width ?? DEFAULT_DRAWING_STYLE.width}
                strokeLinecap="round"
                pointerEvents="none"
            />

            {/* Handles: tp, entry, sl, left, right */}
            <circle
                data-line-id={metrics.id}
                data-handle="tp"
                r="5"
                cx={centerX}
                cy={metrics.tpY}
                fill="#fff"
                stroke={profitColor}
                strokeWidth="2"
                style={{ pointerEvents: 'all', cursor: 'ns-resize', display: 'block' }}
            />
            <circle
                data-line-id={metrics.id}
                data-handle="entry"
                r="5"
                cx={centerX}
                cy={entryY}
                fill="#fff"
                stroke={entryColor}
                strokeWidth="2"
                style={{ pointerEvents: 'all', cursor: 'ns-resize', display: 'block' }}
            />
            <circle
                data-line-id={metrics.id}
                data-handle="sl"
                r="5"
                cx={centerX}
                cy={metrics.slY}
                fill="#fff"
                stroke={lossColor}
                strokeWidth="2"
                style={{ pointerEvents: 'all', cursor: 'ns-resize', display: 'block' }}
            />

            {/* left / right width handles */}
            <circle
                data-line-id={metrics.id}
                data-handle="left"
                r="5"
                cx={left}
                cy={(top + bottom) / 2}
                fill="#fff"
                stroke={borderColor}
                strokeWidth="2"
                style={{ pointerEvents: 'all', cursor: 'ew-resize', display: 'block' }}
            />
            <circle
                data-line-id={metrics.id}
                data-handle="right"
                r="5"
                cx={left + width}
                cy={(top + bottom) / 2}
                fill="#fff"
                stroke={borderColor}
                strokeWidth="2"
                style={{ pointerEvents: 'all', cursor: 'ew-resize', display: 'block' }}
            />
        </>
    );
};

export default LongPositionRenderer;
