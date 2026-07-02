import React from 'react';
import { getDrawingVisualStyle } from '../utils/drawingUtils';
import { getToolImplementation } from '../tools/registry/registry';

const DrawingRenderer = ({
    drawing,
    isSelected,
    selectedDrawingId,
    chart,
    series,
    candles,
    activeToolConfig,
}) => {
    const impl = getToolImplementation(drawing?.tool);
    const renderState = {
        chart,
        series,
        candles,
        activeToolConfig,
    };
    const renderData = impl.render(drawing, renderState);
    const style = getDrawingVisualStyle(drawing, isSelected, activeToolConfig);

    if (!renderData.visible) {
        return null;
    }

    if (impl.Renderer) {
        return <impl.Renderer drawing={drawing} metrics={renderData} style={style} activeToolConfig={activeToolConfig} />;
    }

    if (!renderData.start || !renderData.end) {
        return null;
    }

    return (
        <>
            <line
                stroke="transparent"
                strokeWidth="12"
                data-line-body-id={drawing.id}
                style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                x1={renderData.start.x}
                y1={renderData.start.y}
                x2={renderData.end.x}
                y2={renderData.end.y}
            />
            <line
                stroke={style.color}
                strokeWidth={style.selectedWidth}
                strokeLinecap="round"
                filter="url(#glow)"
                strokeDasharray={style.dasharray}
                style={{ pointerEvents: 'none', opacity: style.opacity }}
                x1={renderData.start.x}
                y1={renderData.start.y}
                x2={renderData.end.x}
                y2={renderData.end.y}
            />
            <circle
                className="c1"
                data-line-id={drawing.id}
                data-handle="1"
                r="5"
                fill="#ffffff"
                stroke={style.color}
                strokeWidth="2.5"
                display={isSelected ? 'block' : 'none'}
                style={{ pointerEvents: isSelected ? 'all' : 'none', cursor: 'move' }}
                cx={renderData.start.x}
                cy={renderData.start.y}
            />
            <circle
                className="c2"
                data-line-id={drawing.id}
                data-handle="2"
                r="5"
                fill="#ffffff"
                stroke={style.color}
                strokeWidth="2.5"
                display={isSelected ? 'block' : 'none'}
                style={{ pointerEvents: isSelected ? 'all' : 'none', cursor: 'move' }}
                cx={renderData.end.x}
                cy={renderData.end.y}
            />
        </>
    );
};

export default DrawingRenderer;
