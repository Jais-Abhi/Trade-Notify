import React from 'react';

const ShortPositionRenderer = ({ drawing, metrics, style, activeToolConfig }) => {
    if (!metrics?.visible) return null;

    // Prefer drawing-specific styles (from backend), then tool config, then provided visual style
    const profitColor = drawing?.style?.profitColor ?? activeToolConfig?.style?.profitColor ?? style.color;
    const lossColor = drawing?.style?.lossColor ?? activeToolConfig?.style?.lossColor ?? style.color;
    const borderColor = drawing?.style?.borderColor ?? activeToolConfig?.style?.borderColor ?? style.color;
    const entryColor = drawing?.style?.entryColor ?? activeToolConfig?.style?.entryColor ?? style.color;
    const fillOpacity = drawing?.style?.fillOpacity ?? activeToolConfig?.style?.fillOpacity ?? style.fillOpacity ?? style.opacity;
    const lineWidth = drawing?.style?.width ?? activeToolConfig?.style?.width ?? style.width;

    const left = metrics.left;
    const width = Math.max(2, metrics.width);
    const centerX = metrics.centerX;

    const top = Math.min(metrics.slY, metrics.entryY);
    const entryY = metrics.entryY;
    const bottom = Math.max(metrics.tpY, metrics.entryY);

    const lossHeight = Math.max(2, entryY - top);
    const profitHeight = Math.max(2, bottom - entryY);

    return (
        <>
            {/* Loss rectangle (top, red) */}
            <rect
                x={left}
                y={top}
                width={width}
                height={lossHeight}
                fill={lossColor}
                opacity={fillOpacity}
                stroke={borderColor}
                pointerEvents="none"
            />

            {/* Profit rectangle (bottom, green) */}
            <rect
                x={left}
                y={entryY}
                width={width}
                height={profitHeight}
                fill={profitColor}
                opacity={fillOpacity}
                stroke={borderColor}
                pointerEvents="none"
            />

            {/* Stop Loss line (top) */}
            <line
                x1={left}
                y1={metrics.slY}
                x2={left + width}
                y2={metrics.slY}
                stroke={lossColor}
                strokeWidth={style.selectedWidth ?? lineWidth}
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
                strokeWidth={style.selectedWidth ?? lineWidth}
                strokeLinecap="round"
                pointerEvents="none"
            />

            {/* Take Profit line (bottom) */}
            <line
                x1={left}
                y1={metrics.tpY}
                x2={left + width}
                y2={metrics.tpY}
                stroke={profitColor}
                strokeWidth={style.selectedWidth ?? lineWidth}
                strokeLinecap="round"
                pointerEvents="none"
            />

            {/* Handles: sl (top), entry, tp (bottom), left, right */}
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

export default ShortPositionRenderer;
