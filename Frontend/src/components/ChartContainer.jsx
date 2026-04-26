import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

const ChartContainer = ({ symbol }) => {
    const chartContainerRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
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
                mode: 0,
                vertLine: {
                    width: 1,
                    color: '#334155',
                    style: 3,
                },
                horzLine: {
                    width: 1,
                    color: '#334155',
                    style: 3,
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

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        // Generate Dummy Candle Data
        const generateDummyData = () => {
            const data = [];
            let date = new Date(Date.UTC(2024, 0, 1, 0, 0, 0));
            let open = 1500;
            for (let i = 0; i < 100; i++) {
                const close = open + (Math.random() - 0.5) * 50;
                const high = Math.max(open, close) + Math.random() * 20;
                const low = Math.min(open, close) - Math.random() * 20;
                data.push({
                    time: date.getTime() / 1000,
                    open: parseFloat(open.toFixed(2)),
                    high: parseFloat(high.toFixed(2)),
                    low: parseFloat(low.toFixed(2)),
                    close: parseFloat(close.toFixed(2)),
                });
                open = close;
                date.setMinutes(date.getMinutes() + 5);
            }
            return data;
        };

        candlestickSeries.setData(generateDummyData());

        // Fit content
        chart.timeScale().fitContent();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="w-full h-full relative group">
            <div ref={chartContainerRef} className="w-full h-full min-h-[600px]" />
            
            {/* Custom subtle attribution to satisfy license requirements */}
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
