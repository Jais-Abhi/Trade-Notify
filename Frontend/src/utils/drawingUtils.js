import resolveRenderableTime from './resolveRenderableTime';

export const DEFAULT_DRAWING_STYLE = {
    color: '#3b82f6',
    width: 2,
    lineStyle: 'solid',
    opacity: 0.75,
    fillOpacity: 0.16,
};

export const getDefaultDrawingStyle = (toolConfig = {}) => ({
    color: toolConfig?.style?.color || DEFAULT_DRAWING_STYLE.color,
    width: toolConfig?.style?.width || DEFAULT_DRAWING_STYLE.width,
    lineStyle: toolConfig?.style?.lineStyle || DEFAULT_DRAWING_STYLE.lineStyle,
    opacity: toolConfig?.style?.opacity ?? DEFAULT_DRAWING_STYLE.opacity,
    fillOpacity: toolConfig?.style?.fillOpacity ?? DEFAULT_DRAWING_STYLE.fillOpacity,
});

export const mergeDrawingStyle = (baseStyle = {}, overrideStyle = {}) => ({
    ...baseStyle,
    ...overrideStyle,
});

export const getStrokeDasharray = (lineStyle = 'solid') => (
    lineStyle === 'dashed' ? '6, 4' : '4, 4'
);

export const getDrawingVisualStyle = (drawing = {}, isSelected = false, toolConfig = {}) => {
    const baseStyle = mergeDrawingStyle(getDefaultDrawingStyle(toolConfig), drawing?.style || {});
    const lineWidth = baseStyle.width || 2;

    return {
        color: baseStyle.color,
        width: lineWidth,
        selectedWidth: isSelected ? Math.max(lineWidth + 1, 2.5) : lineWidth,
        lineStyle: baseStyle.lineStyle || 'solid',
        dasharray: getStrokeDasharray(baseStyle.lineStyle),
        opacity: isSelected ? 1 : (baseStyle.opacity ?? 0.75),
    };
};

export const createDrawing = ({
    tool = 'trendline',
    startPoint,
    endPoint,
    activeToolConfig = {},
    currentInterval,
    id = Date.now(),
}) => ({
    id,
    tool,
    start: startPoint,
    end: endPoint,
    style: getDefaultDrawingStyle(activeToolConfig),
    createdInterval: currentInterval,
    options: {
        ...(activeToolConfig?.options || {}),
    },
});

export const getLineDrawingMetrics = ({ drawing, chart, series, candles = [] }) => {
    if (!drawing || !chart || !series) {
        return {
            visible: false,
            start: null,
            end: null,
        };
    }

    const resolvedStartTime = resolveRenderableTime(drawing?.start?.time, candles);
    const resolvedEndTime = resolveRenderableTime(drawing?.end?.time, candles);

    const start = {
        x: resolvedStartTime == null ? null : chart.timeScale().timeToCoordinate(resolvedStartTime),
        y: series.priceToCoordinate(drawing?.start?.price),
    };
    const end = {
        x: resolvedEndTime == null ? null : chart.timeScale().timeToCoordinate(resolvedEndTime),
        y: series.priceToCoordinate(drawing?.end?.price),
    };

    return {
        visible: start.x !== null && start.y !== null && end.x !== null && end.y !== null,
        start,
        end,
    };
};

export const getTrendLineMetrics = (args) => getLineDrawingMetrics(args);
