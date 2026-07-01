import React, { useEffect, useRef, useState } from 'react';
import resolveRenderableTime from '../../../../../utils/resolveRenderableTime';
import { getDrawingMetadata } from '../../../../../utils/drawingMetadata';
import { DEFAULT_DRAWING_STYLE } from '../../../../../utils/drawingUtils';

const TrendlineFloatingToolbar = ({
    selectedDrawing,
    chart,
    series,
    chartContainerRef,
    candles = [],
    toolDefinition,
    onStyleChange,
    onSave,
    onDelete,
    isSaving,
    onClose
}) => {
    const toolbarRef = useRef(null);
    const supports = toolDefinition?.supports || {};
    const selectedDrawingColor = selectedDrawing?.style?.color ?? toolDefinition?.style?.color ?? DEFAULT_DRAWING_STYLE.color;
    const selectedDrawingWidth = selectedDrawing?.style?.width ?? toolDefinition?.style?.width ?? DEFAULT_DRAWING_STYLE.width;
    const [color, setColor] = useState(selectedDrawingColor);
    const [width, setWidth] = useState(selectedDrawingWidth);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const metadataRows = getDrawingMetadata({ drawing: selectedDrawing, chart, series, candles, toolDefinition });

    useEffect(() => setColor(selectedDrawingColor), [selectedDrawingColor]);
    useEffect(() => setWidth(selectedDrawingWidth), [selectedDrawingWidth]);

    useEffect(() => {
        if (!selectedDrawing || !chart || !series || !chartContainerRef?.current || !toolbarRef.current) return;

        let rafId;
        const updatePosition = () => {
            const canvas = chartContainerRef.current.querySelector('canvas');
            if (!canvas) {
                toolbarRef.current.style.display = 'none';
                rafId = requestAnimationFrame(updatePosition);
                return;
            }

            const chartRect = chartContainerRef.current.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();

            const resolvedStartTime = resolveRenderableTime(selectedDrawing.start.time, candles);
            const resolvedEndTime = resolveRenderableTime(selectedDrawing.end.time, candles);
            const startCoord = {
                x: chart.timeScale().timeToCoordinate(resolvedStartTime),
                y: series.priceToCoordinate(selectedDrawing.start.price)
            };
            const endCoord = {
                x: chart.timeScale().timeToCoordinate(resolvedEndTime),
                y: series.priceToCoordinate(selectedDrawing.end.price)
            };

            if ([startCoord.x, startCoord.y, endCoord.x, endCoord.y].some((v) => typeof v !== 'number' || Number.isNaN(v))) {
                toolbarRef.current.style.display = 'none';
                rafId = requestAnimationFrame(updatePosition);
                return;
            }

            const midX = (startCoord.x + endCoord.x) / 2;
            const topY = Math.min(startCoord.y, endCoord.y) - 12;
            const maxLeft = Math.max(16, Math.min(chartRect.width - 340, canvasRect.left - chartRect.left + midX));
            const maxTop = Math.max(16, Math.min(chartRect.height - 220, canvasRect.top - chartRect.top + topY));

            toolbarRef.current.style.display = 'flex';
            toolbarRef.current.style.left = `${maxLeft}px`;
            toolbarRef.current.style.top = `${maxTop}px`;

            rafId = requestAnimationFrame(updatePosition);
        };

        rafId = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(rafId);
    }, [selectedDrawing?.id, selectedDrawing?.start?.time, selectedDrawing?.start?.price, selectedDrawing?.end?.time, selectedDrawing?.end?.price, chart, series, chartContainerRef, candles]);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (!toolbarRef.current || !selectedDrawing) return;
            if (toolbarRef.current.contains(event.target)) return;

            const chartRoot = chartContainerRef?.current;
            const isClickInsideChart = chartRoot?.contains(event.target);
            const isClickOnDrawing = event.target.closest('[data-line-body-id], [data-handle]');

            if (isClickInsideChart && isClickOnDrawing) return;

            onClose?.();
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => document.removeEventListener('mousedown', handleDocumentClick);
    }, [selectedDrawing?.id, chartContainerRef, onClose]);

    if (!selectedDrawing) return null;

    const handleColorChange = (event) => setColor(event.target.value);
    const handleWidthChange = (event) => {
        const parsedWidth = Number.parseInt(event.target.value, 10);
        if (Number.isNaN(parsedWidth)) return;
        setWidth(Math.max(1, Math.min(12, parsedWidth)));
    };

    const handleSave = async () => {
        const nextStyle = { color, width: Number(width) };
        const hasColorChanged = color !== selectedDrawing?.style?.color ?? toolDefinition?.style?.color ?? DEFAULT_DRAWING_STYLE.color;
        const hasWidthChanged = Number(width) !== Number(selectedDrawing?.style?.width ?? toolDefinition?.style?.width ?? DEFAULT_DRAWING_STYLE.width);

        if (hasColorChanged || hasWidthChanged) onStyleChange?.(nextStyle);

        try {
            setErrorMessage('');
            await onSave?.(nextStyle);
        } catch (error) {
            console.error('Failed to save drawing style:', error);
            setErrorMessage(error?.message || 'Unable to save drawing style.');
        }
    };

    return (
        <div
            ref={toolbarRef}
            className="absolute z-50 flex flex-col gap-2 px-3 py-3 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl shadow-slate-950/40 backdrop-blur-xl text-slate-100 pointer-events-auto transition-all"
            style={{ transform: 'translate(-50%, -100%)', minWidth: '320px', maxWidth: '360px', display: 'none' }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="flex flex-wrap items-center gap-2">
                {supports.color && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="toolbar-color-picker" className="text-[11px] text-slate-400 uppercase tracking-[0.2em]">Color</label>
                        <input id="toolbar-color-picker" type="color" value={color} onChange={handleColorChange} className="w-9 h-9 p-0 border-0 rounded-lg cursor-pointer" />
                    </div>
                )}

                {supports.width && (
                    <div className="flex items-center gap-2 min-w-[140px]">
                        <label htmlFor="toolbar-width-range" className="text-[11px] text-slate-400 uppercase tracking-[0.2em]">Width</label>
                        <input id="toolbar-width-range" type="range" min="1" max="12" step="1" value={width} onChange={handleWidthChange} className="w-24 accent-sky-500" />
                        <span className="text-[11px] text-slate-300 min-w-[16px] text-center">{width}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end">
                <button type="button" onClick={() => setShowDetails((prev) => !prev)} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-200">
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
            </div>

            {showDetails && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 mb-2">Drawing Details</div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11px] text-slate-300">
                        {metadataRows.map((row) => (
                            <React.Fragment key={row.label}>
                                <span className="text-slate-500 whitespace-nowrap">{row.label}</span>
                                <span className="break-words">{row.value}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {errorMessage && <div className="text-[11px] text-rose-400">{errorMessage}</div>}

            <div className="flex items-center justify-end gap-2">
                <button onClick={handleSave} disabled={isSaving} className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? 'Saving...' : 'Save'}
                </button>

                <button onClick={onDelete} className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] rounded-xl bg-rose-600 hover:bg-rose-500">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TrendlineFloatingToolbar;
