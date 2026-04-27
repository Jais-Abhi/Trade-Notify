import React, { useState, useRef, useEffect } from 'react';

/**
 * DrawingLayer handles the SVG overlay for manual chart drawings.
 * Optimized for maximum performance and TradingView behavior:
 * - Uses chart.subscribeClick and chart.subscribeCrosshairMove to keep native crosshair alive
 * - SVG is pointer-events-none so it NEVER blocks the chart engine
 */
const DrawingLayer = ({ activeTool, lines, setLines, chart, series }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null); // { time, price }
    
    const svgRef = useRef(null);
    const previewLineRef = useRef(null);
    const linesGroupRef = useRef(null);
    
    // Store mouse position in a ref to avoid React state updates during drawing movement
    const mousePosRef = useRef({ x: 0, y: 0 });

    // 1. Animation loop for smooth line updates
    useEffect(() => {
        if (!chart || !series || !svgRef.current) return;
        
        let animationFrameId;

        const updateAllDrawings = () => {
            // Update Preview Line if drawing
            if (isDrawing && startPoint && previewLineRef.current) {
                const p1 = {
                    x: chart.timeScale().timeToCoordinate(startPoint.time),
                    y: series.priceToCoordinate(startPoint.price)
                };
                
                if (p1.x !== null && p1.y !== null) {
                    previewLineRef.current.setAttribute('x1', p1.x);
                    previewLineRef.current.setAttribute('y1', p1.y);
                    previewLineRef.current.setAttribute('x2', mousePosRef.current.x);
                    previewLineRef.current.setAttribute('y2', mousePosRef.current.y);
                    previewLineRef.current.setAttribute('display', 'block');
                } else {
                    previewLineRef.current.setAttribute('display', 'none');
                }
            } else if (previewLineRef.current) {
                previewLineRef.current.setAttribute('display', 'none');
            }

            // Update all finalized lines
            if (linesGroupRef.current) {
                const lineElements = linesGroupRef.current.querySelectorAll('[data-line-id]');
                lineElements.forEach(g => {
                    const id = g.getAttribute('data-line-id');
                    const lineData = lines.find(l => l.id.toString() === id);
                    if (!lineData) return;

                    const p1 = {
                        x: chart.timeScale().timeToCoordinate(lineData.start.time),
                        y: series.priceToCoordinate(lineData.start.price)
                    };
                    const p2 = {
                        x: chart.timeScale().timeToCoordinate(lineData.end.time),
                        y: series.priceToCoordinate(lineData.end.price)
                    };

                    const line = g.querySelector('line');
                    const c1 = g.querySelector('.c1');
                    const c2 = g.querySelector('.c2');

                    if (p1.x !== null && p1.y !== null && p2.x !== null && p2.y !== null) {
                        g.setAttribute('display', 'block');
                        line.setAttribute('x1', p1.x);
                        line.setAttribute('y1', p1.y);
                        line.setAttribute('x2', p2.x);
                        line.setAttribute('y2', p2.y);
                        
                        c1.setAttribute('cx', p1.x);
                        c1.setAttribute('cy', p1.y);
                        c2.setAttribute('cx', p2.x);
                        c2.setAttribute('cy', p2.y);
                    } else {
                        g.setAttribute('display', 'none');
                    }
                });
            }

            animationFrameId = requestAnimationFrame(updateAllDrawings);
        };

        animationFrameId = requestAnimationFrame(updateAllDrawings);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [chart, series, lines, isDrawing, startPoint]);

    // 2. Subscribe to chart events for drawing logic
    useEffect(() => {
        if (!chart || !series || activeTool !== 'trendline') {
            setIsDrawing(false);
            setStartPoint(null);
            return;
        }

        const handleChartClick = (param) => {
            if (!param.point || !param.time) return;

            const price = series.coordinateToPrice(param.point.y);
            const time = param.time;

            if (!isDrawing) {
                // Start drawing
                setStartPoint({ time, price });
                setIsDrawing(true);
            } else {
                // Finalize drawing
                const newLine = {
                    start: startPoint,
                    end: { time, price },
                    id: Date.now()
                };
                setLines(prev => [...prev, newLine]);
                setIsDrawing(false);
                setStartPoint(null);
            }
        };

        const handleCrosshairMove = (param) => {
            if (param.point) {
                mousePosRef.current = { x: param.point.x, y: param.point.y };
            }
        };

        chart.subscribeClick(handleChartClick);
        chart.subscribeCrosshairMove(handleCrosshairMove);

        return () => {
            chart.unsubscribeClick(handleChartClick);
            chart.unsubscribeCrosshairMove(handleCrosshairMove);
        };
    }, [chart, series, activeTool, isDrawing, startPoint, setLines]);

    return (
        <svg
            ref={svgRef}
            className="absolute inset-0 z-30 w-full h-full overflow-hidden pointer-events-none"
        >
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Finalized Lines Group */}
            <g ref={linesGroupRef}>
                {lines.map((line) => (
                    <g key={line.id} data-line-id={line.id} display="none">
                        <line
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            filter="url(#glow)"
                        />
                        <circle className="c1" r="3" fill="#3b82f6" />
                        <circle className="c2" r="3" fill="#3b82f6" />
                    </g>
                ))}
            </g>

            {/* Preview Line */}
            <line
                ref={previewLineRef}
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4, 4"
                opacity="0.6"
                display="none"
            />
        </svg>
    );
};

export default DrawingLayer;


