import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * DrawingLayer handles the SVG overlay for manual chart drawings.
 * Now synchronized with Price and Time coordinates for TradingView behavior.
 */
const DrawingLayer = ({ activeTool, lines, setLines, chart, series }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null); // { time, price }
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Pixel coordinates for preview
    const [renderTrigger, setRenderTrigger] = useState(0); // Dummy state to force re-render on chart move
    const svgRef = useRef(null);

    // Animation loop for perfectly smooth real-time updates during interactions
    useEffect(() => {
        if (!chart || !series) return;
        
        let animationFrameId;

        const syncWithChart = () => {
            // Trigger React re-render every frame to catch price scale drags/autoscales
            setRenderTrigger(prev => prev + 1);
            animationFrameId = requestAnimationFrame(syncWithChart);
        };

        animationFrameId = requestAnimationFrame(syncWithChart);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [chart, series]);

    // Helper to convert pixel to chart coordinates
    const pixelToCoords = (e) => {
        if (!svgRef.current || !chart || !series) return null;
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const time = chart.timeScale().coordinateToTime(x);
        const price = series.coordinateToPrice(y);

        return { time, price, x, y };
    };

    // Helper to convert chart coordinates back to pixels for rendering
    const coordsToPixel = (point) => {
        if (!chart || !series || !point) return { x: -100, y: -100 };
        const x = chart.timeScale().timeToCoordinate(point.time);
        const y = series.priceToCoordinate(point.price);
        return { x, y };
    };

    const handleMouseDown = (e) => {
        if (activeTool !== 'trendline' || !chart || !series) return;

        const pos = pixelToCoords(e);
        if (!pos || pos.time === null || pos.price === null) return;
        
        if (!isDrawing) {
            // First click: Start point (Store Time + Price)
            setStartPoint({ time: pos.time, price: pos.price });
            setIsDrawing(true);
        } else {
            // Second click: Finalize (Store Time + Price)
            const newLine = {
                start: startPoint,
                end: { time: pos.time, price: pos.price },
                id: Date.now()
            };
            setLines(prev => [...prev, newLine]);
            setIsDrawing(false);
            setStartPoint(null);
        }
    };

    const handleMouseMove = (e) => {
        if (activeTool !== 'trendline') return;
        
        if (isDrawing) {
            const pos = pixelToCoords(e);
            if (pos) setMousePos({ x: pos.x, y: pos.y });
        }
    };

    const handleContextMenu = (e) => {
        if (isDrawing) {
            e.preventDefault();
            setIsDrawing(false);
            setStartPoint(null);
        }
    };

    return (
        <svg
            ref={svgRef}
            key={renderTrigger} // Optional: help React distinguish render cycles on move
            className={`absolute inset-0 z-30 w-full h-full overflow-hidden transition-opacity duration-300 ${
                activeTool === 'trendline' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onContextMenu={handleContextMenu}
        >
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Render Finalized Trendlines (Converted back to Pixels) */}
            {lines.map((line) => {
                const p1 = coordsToPixel(line.start);
                const p2 = coordsToPixel(line.end);

                // Don't render if coordinates are null (off-chart or invalid)
                if (p1.x === null || p1.y === null || p2.x === null || p2.y === null) return null;

                return (
                    <g key={line.id}>
                        <line
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            filter="url(#glow)"
                        />
                        <circle cx={p1.x} cy={p1.y} r="3" fill="#3b82f6" />
                        <circle cx={p2.x} cy={p2.y} r="3" fill="#3b82f6" />
                    </g>
                );
            })}

            {/* Render Preview Line */}
            {isDrawing && startPoint && (() => {
                const p1 = coordsToPixel(startPoint);
                return (
                    <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={mousePos.x}
                        y2={mousePos.y}
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        strokeDasharray="4, 4"
                        opacity="0.6"
                    />
                );
            })()}
        </svg>
    );
};

export default DrawingLayer;
