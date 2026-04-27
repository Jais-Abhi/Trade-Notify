import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import api from '../api/axios';
import { Loader2, AlertCircle } from 'lucide-react';
import DrawingLayer from './DrawingLayer';
import DrawingToolbar from './DrawingToolbar';

const ChartContainer = ({ symbol, interval = '5m' }) => {
    const chartContainerRef = useRef();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTool, setActiveTool] = useState(null); // 'trendline' or null
    const [drawingLines, setDrawingLines] = useState([]); // Array of manual trendlines
    const [chartInstance, setChartInstance] = useState(null);
    const [seriesInstance, setSeriesInstance] = useState(null);

    useEffect(() => {
        if (!symbol) return;

        let chart;
        let candlestickSeries;

        const initChart = () => {
            if (!chartContainerRef.current) return;
            
            chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: '#020617' },
                    textColor: '#64748b',
                    fontSize: 12,
                    fontFamily: 'Inter, sans-serif',
                    attributionLogo: false,
                },
                grid: {
                    vertLines: { color: '#0f172a' },
                    horzLines: { color: '#0f172a' },
                },
                width: chartContainerRef.current.clientWidth,
                height: 600,
                crosshair: {
                    mode: 1, // CrosshairMode.Normal
                    vertLine: {
                        width: 1,
                        color: '#475569',
                        style: 3,
                        labelBackgroundColor: '#1e293b',
                    },
                    horzLine: {
                        width: 1,
                        color: '#475569',
                        style: 3,
                        labelBackgroundColor: '#1e293b',
                    },
                },
                timeScale: {
                    borderColor: '#1e293b',
                    timeVisible: true,
                    secondsVisible: false,
                },
                rightPriceScale: {
                    borderColor: '#1e293b',
                }
            });

            candlestickSeries = chart.addSeries(CandlestickSeries, {
                upColor: '#10b981',
                downColor: '#ef4444',
                borderVisible: false,
                wickUpColor: '#10b981',
                wickDownColor: '#ef4444',
            });

            setChartInstance(chart);
            setSeriesInstance(candlestickSeries);
        };

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch real data from backend
                const response = await api.get(`/market/candles?symbol=${symbol}&interval=${interval}`);
                const data = response.data;
                
                console.log(`API Response received for ${symbol} (${interval}):`, data);

                if (data.success && data.data && Array.isArray(data.data.candles)) {
                    // 1. Filter out any malformed objects
                    // 2. Sort strictly by time (required by Lightweight Charts)
                    const cleanData = data.data.candles
                        .filter(candle => candle && typeof candle.time === 'number')
                        .sort((a, b) => a.time - b.time);

                    if (cleanData.length === 0) {
                        throw new Error('No valid data points found for this timeframe');
                    }

                    console.log(`Setting ${cleanData.length} candles to chart`);
                    candlestickSeries.setData(cleanData);
                    chart.timeScale().fitContent();
                } else {
                    throw new Error(data.message || 'Malformed API response structure');
                }
            } catch (err) {
                console.error('Chart Data Error:', err);
                setError(err.response?.data?.message || err.message || 'Connection error while loading chart');
            } finally {
                setLoading(false);
            }
        };

        initChart();
        fetchData();

        const handleResize = () => {
            if (chartContainerRef.current && chart) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chart) {
                chart.remove();
                setChartInstance(null);
                setSeriesInstance(null);
            }
        };
    }, [symbol, interval]);

    return (
        <div className="w-full h-full relative group bg-slate-950 rounded-xl overflow-hidden border border-slate-900 shadow-2xl">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] animate-pulse">Synchronizing Market Data...</p>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500/50 mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">Network Error</h3>
                    <p className="text-slate-500 max-w-xs text-sm leading-relaxed">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20"
                    >
                        Retry Connection
                    </button>
                </div>
            )}

            {/* Chart Canvas */}
            <div ref={chartContainerRef} className="w-full h-full min-h-[600px]" />

            {/* Drawing Layer Overlay */}
            <DrawingLayer 
                activeTool={activeTool} 
                lines={drawingLines}
                setLines={setDrawingLines}
                chart={chartInstance}
                series={seriesInstance}
            />

            {/* Drawing Tools Sidebar */}
            <DrawingToolbar 
                activeTool={activeTool} 
                setActiveTool={setActiveTool} 
                onClearAll={() => setDrawingLines([])}
            />
            
            {/* Attribution */}
            <a 
                href="https://www.tradingview.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute bottom-2 right-12 text-[9px] text-slate-700 hover:text-blue-500 font-bold tracking-[0.2em] uppercase transition-all opacity-40 hover:opacity-100 z-10"
            >
                Powered by TradingView
            </a>
        </div>
    );
};

export default ChartContainer;
