import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChartContainer from '../components/ChartContainer';
import api from '../api/axios';
import { ArrowLeft, Share2, Settings, Maximize2, MoreHorizontal, Loader2 } from 'lucide-react';

const ChartPage = () => {
    const { symbol } = useParams();
    const [intervals, setIntervals] = useState(['1m', '5m', '15m', '1h', '1d']);
    const [selectedInterval, setSelectedInterval] = useState('5m');
    const [loadingIntervals, setLoadingIntervals] = useState(true);

    useEffect(() => {
        const fetchIntervals = async () => {
            try {
                const { data } = await api.get('/market/intervals');
                if (data.success) {
                    setIntervals(data.data);
                }
            } catch (error) {
                console.error('Error fetching intervals', error);
            } finally {
                setLoadingIntervals(false);
            }
        };
        fetchIntervals();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col pt-16">
            {/* Chart Toolbar / Header */}
            <header className="flex items-center justify-between px-4 h-12 border-b border-slate-900 bg-slate-950 z-10">
                <div className="flex items-center gap-4 h-full">
                    <Link to="/" className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    
                    <div className="h-6 w-[1px] bg-slate-900"></div>
                    
                    {/* Symbol Info */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight text-white">{symbol?.split('.')[0]?.toUpperCase()}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-900 px-1.5 py-0.5 rounded">NSE</span>
                    </div>

                    <div className="h-6 w-[1px] bg-slate-900"></div>

                    {/* Timeframe Selector */}
                    <div className="flex items-center gap-0.5">
                        {loadingIntervals ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-700 mx-4" />
                        ) : (
                            intervals.map(tf => (
                                <button 
                                    key={tf}
                                    onClick={() => setSelectedInterval(tf)}
                                    className={`px-3 h-8 flex items-center justify-center rounded text-xs font-bold transition-all uppercase ${tf === selectedInterval ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'}`}
                                >
                                    {tf}
                                </button>
                            ))
                        )}
                        <button className="p-1.5 text-slate-500 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="h-6 w-[1px] bg-slate-900"></div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 h-8 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors shadow-lg shadow-blue-600/10">
                        <Share2 className="w-3.5 h-3.5" />
                        PUBLISH
                    </button>
                    <div className="h-6 w-[1px] bg-slate-900 mx-1"></div>
                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Chart Area */}
            <main className="flex-1 w-full bg-slate-950 overflow-hidden relative">
                <ChartContainer symbol={symbol} interval={selectedInterval} />
            </main>
        </div>
    );
};

export default ChartPage;
