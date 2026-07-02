import React, { useState, useRef, useEffect } from 'react';
import resolveRenderableTime from '../utils/resolveRenderableTime';
import { getToolImplementation } from '../tools/registry/registry';
import { createDrawing, getDrawingVisualStyle, DEFAULT_DRAWING_STYLE } from '../utils/drawingUtils';
import DrawingRenderer from './DrawingRenderer';
import PriceRangePreview from '../tools/groups/measures/pricerange/pricerange.preview.jsx';

/**
 * DrawingLayer handles the SVG overlay for manual chart drawings.
 * Optimized for maximum performance:
 * - Uses requestAnimationFrame for perfectly synced updates
 * - Direct DOM manipulation (refs) to bypass React's render cycle during chart interactions
 * - Zero jitter during zoom/drag
 * - Mouse interaction and selection system
 */
const DrawingLayer = ({ 
    activeTool, 
    activeToolConfig,
    lines, 
    setLines, 
    updateDrawingLinesWithHistory,
    selectedDrawingId, 
    setSelectedDrawingId, 
    onDragStart,
    chart, 
    series,
    candles = [],
    currentInterval = '5m'
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null); // { time, price }
    const [previewPoint, setPreviewPoint] = useState(null);
    
    const svgRef = useRef(null);
    const previewLineRef = useRef(null);
    const linesGroupRef = useRef(null);
    
    // Store mouse position in a ref to avoid React state updates during move
    const mousePosRef = useRef({ x: 0, y: 0 });
    
    // Store drag state in a ref to avoid React re-renders during active drag
    const dragStateRef = useRef(null);

    // Helper to convert pixel to chart coordinates
    const pixelToCoords = (x, y) => {
        if (!chart || !series) return null;
        const time = chart.timeScale().coordinateToTime(x);
        const price = series.coordinateToPrice(y);
        return { time, price, x, y };
    };

    const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

    const getTool = (tool) => getToolImplementation(tool);

    const getDrawingAtPoint = (x, y) => {
        if (!chart || !series) return null;

        const point = { x, y };
        for (let index = lines.length - 1; index >= 0; index -= 1) {
            const drawing = lines[index];
            const toolImpl = getTool(drawing.tool);
            const renderData = toolImpl.render(drawing, { chart, series, candles });
            if (renderData.visible && toolImpl.hitTest?.(drawing, point, { chart, series, candles })) {
                return drawing;
            }
        }

        return null;
    };

    // Animation loop for perfectly smooth real-time updates
    useEffect(() => {
        if (!chart || !series || !svgRef.current) return;
        
        const parent = svgRef.current.parentElement;
        let animationFrameId;

        const updateAllDrawings = () => {
            // Align the SVG overlay with the main canvas (chart pane)
            const mainCanvas = parent?.querySelector('canvas');
            if (mainCanvas && svgRef.current) {
                const mainRect = mainCanvas.getBoundingClientRect();
                const parentRect = parent.getBoundingClientRect();
                const left = mainRect.left - parentRect.left;
                const top = mainRect.top - parentRect.top;
                
                svgRef.current.style.left = `${left}px`;
                svgRef.current.style.top = `${top}px`;
                svgRef.current.style.width = `${mainRect.width}px`;
                svgRef.current.style.height = `${mainRect.height}px`;
            }

            // 1. Update Preview Line if drawing for tools that use line preview
            if (activeTool !== 'pricerange' && isDrawing && startPoint && previewLineRef.current) {
                const resolvedStartTime = resolveRenderableTime(startPoint.time, candles);
                const p1 = {
                    x: resolvedStartTime == null ? null : chart.timeScale().timeToCoordinate(resolvedStartTime),
                    y: series.priceToCoordinate(startPoint.price)
                };
                const previewStyle = getDrawingVisualStyle({ style: activeToolConfig?.style }, false, activeToolConfig);
                
                if (p1.x !== null && p1.y !== null) {
                    previewLineRef.current.setAttribute('x1', p1.x);
                    previewLineRef.current.setAttribute('y1', p1.y);
                    previewLineRef.current.setAttribute('x2', mousePosRef.current.x);
                    previewLineRef.current.setAttribute('y2', mousePosRef.current.y);
                    previewLineRef.current.setAttribute('stroke', previewStyle.color);
                    previewLineRef.current.setAttribute('stroke-width', previewStyle.width);
                    previewLineRef.current.setAttribute('stroke-dasharray', previewStyle.dasharray);
                    previewLineRef.current.setAttribute('opacity', previewStyle.opacity);
                    previewLineRef.current.setAttribute('display', 'block');
                } else {
                    previewLineRef.current.setAttribute('display', 'none');
                }
            } else if (previewLineRef.current) {
                previewLineRef.current.setAttribute('display', 'none');
            }

            // 2. Update all finalized lines in the group
            if (linesGroupRef.current) {
                const lineElements = linesGroupRef.current.querySelectorAll('[data-line-id]');
                lineElements.forEach(g => {
                    const id = g.getAttribute('data-line-id');
                    const lineData = lines.find(l => l.id.toString() === id);
                    if (!lineData) return;

                    const toolImpl = getTool(lineData.tool);
                    const renderData = toolImpl.render(lineData, {
                        chart,
                        series,
                        candles,
                    });

                    const svgLines = g.querySelectorAll('line');
                    const hitLine = svgLines[0];
                    const visualLine = svgLines[1];
                    const c1 = g.querySelector('.c1');
                    const c2 = g.querySelector('.c2');

                            if (renderData.visible) {
                        g.setAttribute('display', 'block');
                        if (toolImpl.Renderer) {
                            toolImpl.updateDom?.(g, renderData, getDrawingVisualStyle(lineData, lineData.id === selectedDrawingId, activeToolConfig));
                            return;
                        }

                        if (renderData.start && renderData.end) {
                            if (hitLine) {
                                hitLine.setAttribute('x1', renderData.start.x);
                                hitLine.setAttribute('y1', renderData.start.y);
                                hitLine.setAttribute('x2', renderData.end.x);
                                hitLine.setAttribute('y2', renderData.end.y);
                            }
                            if (visualLine) {
                                const style = getDrawingVisualStyle(lineData, lineData.id === selectedDrawingId, activeToolConfig);
                                visualLine.setAttribute('x1', renderData.start.x);
                                visualLine.setAttribute('y1', renderData.start.y);
                                visualLine.setAttribute('x2', renderData.end.x);
                                visualLine.setAttribute('y2', renderData.end.y);
                                visualLine.setAttribute('stroke', style.color);
                                visualLine.setAttribute('stroke-width', style.selectedWidth);
                                visualLine.setAttribute('stroke-dasharray', style.dasharray);
                                visualLine.setAttribute('opacity', style.opacity);
                            }
                            if (c1) {
                                c1.setAttribute('cx', renderData.start.x);
                                c1.setAttribute('cy', renderData.start.y);
                            }
                            if (c2) {
                                c2.setAttribute('cx', renderData.end.x);
                                c2.setAttribute('cy', renderData.end.y);
                            }
                        }
                    } else {
                        g.setAttribute('display', 'none');
                    }
                });
            }

            animationFrameId = requestAnimationFrame(updateAllDrawings);
        };

        // --- Event Listeners ---
        const onMouseDown = (e) => {
            // Ignore if clicking on any UI element (buttons, toolbar, etc.)
            if (e.target.closest('button') || e.target.closest('.z-40') || e.target.closest('.z-50')) return;

            // Only handle left click
            if (e.button !== 0) return;

            const mainCanvas = parent.querySelector('canvas');
            if (!mainCanvas) return;

            const rect = mainCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 1. Check if clicking on an endpoint handle of a selected drawing
            const circleTarget = e.target.closest('[data-handle]');
            if (circleTarget) {
                const lineId = circleTarget.getAttribute('data-line-id');
                const handleIndex = circleTarget.getAttribute('data-handle'); // '1' or '2'
                const line = lines.find(l => l.id.toString() === lineId);
                if (line) {
                    // Snapshot will be pushed on first actual mouse movement, not here
                    dragStateRef.current = {
                        type: handleIndex === '1' ? 'point1' : 'point2',
                        lineId: line.id,
                        startMouseX: e.clientX,
                        startMouseY: e.clientY,
                        originalStart: { ...line.start },
                        originalEnd: { ...line.end },
                        snapshotLines: [...lines], // Pre-drag snapshot for history
                        hasMoved: false            // Only push history after first real move
                    };
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
            }

            const hitDrawing = getDrawingAtPoint(x, y);
            if (hitDrawing) {
                setSelectedDrawingId(hitDrawing.id);
                dragStateRef.current = {
                    type: 'body',
                    lineId: hitDrawing.id,
                    startMouseX: e.clientX,
                    startMouseY: e.clientY,
                    originalStart: { ...hitDrawing.start },
                    originalEnd: { ...hitDrawing.end },
                    originalStartPix: {
                        x: chart.timeScale().timeToCoordinate(resolveRenderableTime(hitDrawing.start.time, candles)),
                        y: series.priceToCoordinate(hitDrawing.start.price)
                    },
                    originalEndPix: {
                        x: chart.timeScale().timeToCoordinate(resolveRenderableTime(hitDrawing.end.time, candles)),
                        y: series.priceToCoordinate(hitDrawing.end.price)
                    },
                    snapshotLines: [...lines],
                    hasMoved: false
                };
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            // 3. Clicked empty space
            if (!activeTool) {
                setSelectedDrawingId(null);
                return;
            }

            // Drawing creation mode
            const pos = pixelToCoords(x, y);
            if (!pos || pos.time === null || pos.price === null) return;
            
            if (!isDrawing) {
                setStartPoint({ time: pos.time, price: pos.price });
                setPreviewPoint(null);
                setIsDrawing(true);
            } else {
                const newLine = createDrawing({
                    tool: activeTool,
                    startPoint,
                    endPoint: { time: pos.time, price: pos.price },
                    activeToolConfig,
                    currentInterval,
                });
                updateDrawingLinesWithHistory(prev => [...prev, newLine]);
                setIsDrawing(false);
                setStartPoint(null);
                setPreviewPoint(null);
            }
        };

        const onMouseMove = (e) => {
            const mainCanvas = parent.querySelector('canvas');
            if (!mainCanvas) return;
            const rect = mainCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            mousePosRef.current = { x, y };

            const clampPoint = (point) => ({
                x: clampValue(point.x, 0, rect.width),
                y: clampValue(point.y, 0, rect.height),
            });

            if (isDrawing && startPoint) {
                const pos = pixelToCoords(x, y);
                if (pos && pos.time !== null && pos.price !== null) {
                    setPreviewPoint(pos);
                }
            }

            if (!dragStateRef.current) return;

            e.preventDefault();
            e.stopPropagation();

            const dx = e.clientX - dragStateRef.current.startMouseX;
            const dy = e.clientY - dragStateRef.current.startMouseY;
            const lineId = dragStateRef.current.lineId;

            // Push history snapshot on first actual movement (not on mere click)
            if (!dragStateRef.current.hasMoved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
                onDragStart(dragStateRef.current.snapshotLines);
                dragStateRef.current.hasMoved = true;
            }

            if (!dragStateRef.current.hasMoved) return;

            if (dragStateRef.current.type === 'point1') {
                const pos = pixelToCoords(x, y);
                if (pos && pos.time !== null && pos.price !== null) {
                    setLines(prev => prev.map(l => {
                        if (l.id === lineId) {
                            return { ...l, start: { time: pos.time, price: pos.price } };
                        }
                        return l;
                    }));
                }
            } else if (dragStateRef.current.type === 'point2') {
                const pos = pixelToCoords(x, y);
                if (pos && pos.time !== null && pos.price !== null) {
                    setLines(prev => prev.map(l => {
                        if (l.id === lineId) {
                            return { ...l, end: { time: pos.time, price: pos.price } };
                        }
                        return l;
                    }));
                }
            } else if (dragStateRef.current.type === 'body') {
                const rawNewStart = {
                    x: dragStateRef.current.originalStartPix.x + dx,
                    y: dragStateRef.current.originalStartPix.y + dy,
                };
                const rawNewEnd = {
                    x: dragStateRef.current.originalEndPix.x + dx,
                    y: dragStateRef.current.originalEndPix.y + dy,
                };
                const clampedStart = clampPoint(rawNewStart);
                const clampedEnd = clampPoint(rawNewEnd);

                const startPos = pixelToCoords(clampedStart.x, clampedStart.y);
                const endPos = pixelToCoords(clampedEnd.x, clampedEnd.y);

                if (startPos && endPos && startPos.time !== null && startPos.price !== null && endPos.time !== null && endPos.price !== null) {
                    setLines(prev => prev.map(l => {
                        if (l.id === lineId) {
                            return {
                                ...l,
                                start: { time: startPos.time, price: startPos.price },
                                end: { time: endPos.time, price: endPos.price }
                            };
                        }
                        return l;
                    }));
                }
            }
        };

        const onMouseUp = (e) => {
            if (dragStateRef.current) {
                e.preventDefault();
                e.stopPropagation();
                dragStateRef.current = null;
            }
        };

        const onContextMenu = (e) => {
            if (isDrawing) {
                e.preventDefault();
                setIsDrawing(false);
                setStartPoint(null);
                setPreviewPoint(null);
            }
        };

        const onKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedDrawingId !== null) {
                // Delete selected drawing, pushing operation to history
                updateDrawingLinesWithHistory(prev => prev.filter(l => l.id !== selectedDrawingId));
                setSelectedDrawingId(null);
            }
        };

        // Attach listeners
        parent.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        parent.addEventListener('contextmenu', onContextMenu);
        window.addEventListener('keydown', onKeyDown);

        animationFrameId = requestAnimationFrame(updateAllDrawings);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            parent.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            parent.removeEventListener('contextmenu', onContextMenu);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [chart, series, candles, lines, isDrawing, startPoint, activeTool, selectedDrawingId]);

    return (
        <svg
            ref={svgRef}
            className="absolute z-30 overflow-hidden"
            style={{ pointerEvents: 'none' }}
        >
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Finalized Lines Group */}
            <g ref={linesGroupRef}>
                {lines.map((line) => {
                    const isSelected = line.id === selectedDrawingId;
                    return (
                        <g key={line.id} data-line-id={line.id} data-tool={line.tool} display="none">
                            <DrawingRenderer
                                drawing={line}
                                isSelected={isSelected}
                                selectedDrawingId={selectedDrawingId}
                                chart={chart}
                                series={series}
                                candles={candles}
                                activeToolConfig={activeToolConfig}
                            />
                        </g>
                    );
                })}
            </g>

            {/* Preview Line (Only shown during active drawing) */}
            <line
                ref={previewLineRef}
                stroke={activeToolConfig?.style?.color ?? DEFAULT_DRAWING_STYLE.color}
                strokeWidth={activeToolConfig?.style?.width ?? DEFAULT_DRAWING_STYLE.width}
                strokeDasharray="0"
                opacity="0.6"
                display="none"
                pointerEvents="none"
            />
            {isDrawing && startPoint && previewPoint && activeTool === 'pricerange' && (
                <g>
                    <PriceRangePreview
                        startPoint={startPoint}
                        currentPoint={previewPoint}
                        chart={chart}
                        series={series}
                        candles={candles}
                        style={activeToolConfig?.style || {}}
                    />
                </g>
            )}
        </svg>
    );
};

export default DrawingLayer;
