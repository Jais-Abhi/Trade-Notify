import React, { useEffect, useRef, useState } from 'react';
import resolveRenderableTime from '../utils/resolveRenderableTime';

const FloatingDrawingToolbar = ({
    selectedDrawing,
    chart,
    series,
    chartContainerRef,
    candles = [],
    onStyleChange,
    onSave,
    onDelete,
    isSaving,
    onClose
}) => {
    const toolbarRef = useRef(null);
    const selectedDrawingColor = selectedDrawing?.style?.color || '#3b82f6';
    const [color, setColor] = useState(selectedDrawingColor);

    useEffect(() => {
        setColor((prevColor) => (prevColor === selectedDrawingColor ? prevColor : selectedDrawingColor));
    }, [selectedDrawingColor]);

    useEffect(() => {
        if (!selectedDrawing || !chart || !series || !chartContainerRef?.current || !toolbarRef.current) {
            return;
        }

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

            if (
                typeof startCoord.x !== 'number' ||
                typeof startCoord.y !== 'number' ||
                typeof endCoord.x !== 'number' ||
                typeof endCoord.y !== 'number' ||
                Number.isNaN(startCoord.x) ||
                Number.isNaN(startCoord.y) ||
                Number.isNaN(endCoord.x) ||
                Number.isNaN(endCoord.y)
            ) {
                toolbarRef.current.style.display = 'none';
                rafId = requestAnimationFrame(updatePosition);
                return;
            }

            const midX = (startCoord.x + endCoord.x) / 2;
            const topY = Math.min(startCoord.y, endCoord.y) - 12;

            toolbarRef.current.style.display = 'flex';
            toolbarRef.current.style.left = `${canvasRect.left - chartRect.left + midX}px`;
            toolbarRef.current.style.top = `${canvasRect.top - chartRect.top + topY}px`;

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

            if (isClickInsideChart && isClickOnDrawing) {
                return;
            }

            onClose?.();
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => document.removeEventListener('mousedown', handleDocumentClick);
    }, [selectedDrawing?.id, chartContainerRef, onClose]);

    if (!selectedDrawing) return null;

    const handleColorChange = (event) => {
        setColor(event.target.value);
    };

    const handleSave = () => {
        const nextStyle = { color };

        if (color !== selectedDrawingColor) {
            onStyleChange?.(nextStyle);
        }

        window.requestAnimationFrame(() => {
            onSave?.(nextStyle);
        });
    };

    return (
        <div
            ref={toolbarRef}
            className="absolute z-50 flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl shadow-slate-950/40 backdrop-blur-xl text-slate-100 pointer-events-auto transition-all"
            style={{ transform: 'translate(-50%, -100%)', minWidth: '240px', display: 'none' }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-2">
                <label htmlFor="toolbar-color-picker" className="text-[11px] text-slate-400 uppercase tracking-[0.2em]">Color</label>
                <input
                    id="toolbar-color-picker"
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer"
                />
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
                onClick={onDelete}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] rounded-xl bg-rose-600 hover:bg-rose-500"
            >
                Delete
            </button>
        </div>
    );
};

export default FloatingDrawingToolbar;
