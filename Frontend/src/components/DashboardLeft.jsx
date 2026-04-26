import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { LineChart, Zap, ArrowRight, Sparkles } from 'lucide-react';

const DashboardLeft = () => {
    const navigate = useNavigate();
    const { watchlist, openSearch } = useUI();

    const handleLaunchChart = () => {
        if (watchlist && watchlist.length > 0) {
            // Take the first stock in the watchlist
            const firstStock = watchlist[0].symbol;
            navigate(`/charts/${firstStock}`);
        } else {
            // Watchlist is empty, trigger the search experience
            openSearch();
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-20 bg-slate-950/20">
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
                    <Sparkles className="w-3 h-3" />
                    Professional Trading Terminal
                </div>
                
                <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
                    Welcome to <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Trading Dashboard</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl">
                    Our high-performance platform helps you analyze stocks in real-time, detect institutional setups, and manage complex strategies with ease.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5">
                    <button 
                        onClick={handleLaunchChart}
                        className="group flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                        <LineChart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        Launch Chart
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </button>
                    
                    <button className="flex items-center justify-center gap-4 bg-slate-900 hover:bg-slate-800 text-slate-300 px-10 py-5 rounded-2xl font-bold text-lg border border-slate-800 transition-all hover:-translate-y-1 active:translate-y-0 shadow-xl">
                        <Zap className="w-6 h-6 text-emerald-500" />
                        Manage Strategy
                    </button>
                </div>
                
                <div className="mt-16 flex items-center gap-8 border-t border-slate-900 pt-10">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white">1,500+</span>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Symbols</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-900"></div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white">50ms</span>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Latency</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-900"></div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white">24/7</span>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Monitoring</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLeft;
