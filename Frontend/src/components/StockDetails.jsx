import { useNavigate } from 'react-router-dom';
import { LineChart, TrendingUp, ArrowRight } from 'lucide-react';

const StockDetails = ({ stock }) => {
    const navigate = useNavigate();

    if (!stock) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                    <LineChart className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-70" />
                    <p className="text-slate-400 font-medium">Select a stock from the watchlist to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="p-6 sm:p-10 flex-1 flex flex-col">
                <div className="mb-8 z-10">
                    <div className="inline-block px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold tracking-wider rounded-md mb-4 border border-slate-700/50">
                        {stock.symbol}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                        {stock.name}
                    </h2>
                    
                    {/* Dummy Price Data Placeholder */}
                    <div className="flex items-end gap-4 mt-8">
                        <span className="text-5xl font-bold text-white tracking-tighter">₹2,954.20</span>
                        <div className="flex items-center gap-1 text-emerald-400 font-medium pb-1 bg-emerald-500/10 px-2.5 py-1 rounded-md text-sm border border-emerald-500/20">
                            <TrendingUp className="w-4 h-4" />
                            +1.24%
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10 border-y border-slate-800/60 py-8 z-10">
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 font-medium">Open</p>
                        <p className="text-slate-200 font-semibold text-lg">₹2,920.00</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 font-medium">High</p>
                        <p className="text-slate-200 font-semibold text-lg">₹2,965.50</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 font-medium">Low</p>
                        <p className="text-slate-200 font-semibold text-lg">₹2,910.10</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 font-medium">Volume</p>
                        <p className="text-slate-200 font-semibold text-lg">12.4M</p>
                    </div>
                </div>

                <div className="mt-auto pt-4 z-10">
                    <button 
                        onClick={() => navigate('/chart')}
                        className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-8 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                    >
                        <LineChart className="w-5 h-5" />
                        Launch Chart Terminal
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-slate-500 text-sm mt-4 max-w-md">
                        Launching the terminal will load real-time candlestick data and activate the automated setup detection engine.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StockDetails;
