import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { X, Plus, Trash2, LineChart } from 'lucide-react';

const WatchlistPanel = () => {
    const { isWatchlistOpen, toggleWatchlist, watchlist, removeFromWatchlist, setSelectedStock } = useUI();
    const navigate = useNavigate();

    return (
        <div 
            className={`fixed top-16 right-0 h-[calc(100vh-64px)] w-[300px] bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 z-40 flex flex-col ${
                isWatchlistOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-blue-500" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Watchlist</h2>
                </div>
                <button onClick={toggleWatchlist} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            {/* List Section */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-slate-950/20">
                {watchlist.length > 0 ? (
                    <div className="space-y-2">
                        {watchlist.map(stock => (
                            <div 
                                key={stock.symbol} 
                                onClick={() => navigate(`/charts/${stock.symbol}`)}
                                className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex justify-between items-center group cursor-pointer hover:border-blue-500/30 transition-all hover:bg-slate-800/40"
                            >
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                                        {stock.symbol.split('.')[0]}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 uppercase truncate mt-0.5">{stock.name}</p>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromWatchlist(stock.symbol);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-slate-600 hover:text-red-500 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 mb-4 shadow-inner">
                            <Plus className="w-8 h-8 text-slate-800" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Your watchlist is empty.<br />Start by adding some symbols.
                        </p>
                        <button 
                            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            ADD STOCK
                        </button>
                    </div>
                )}
            </div>
            
            {/* Footer Summary */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <p className="text-[10px] text-slate-600 font-bold uppercase text-center tracking-widest">
                    {watchlist.length} {watchlist.length === 1 ? 'SYMBOL' : 'SYMBOLS'} TRACKED
                </p>
            </div>
        </div>
    );
};

export default WatchlistPanel;
