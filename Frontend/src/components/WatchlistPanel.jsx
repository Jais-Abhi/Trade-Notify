import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { useUI } from '../context/UIContext';
import { X, Plus, Trash2, LineChart, Loader2, AlertCircle } from 'lucide-react';

const WatchlistPanel = () => {
    const { isWatchlistOpen, toggleWatchlist, openSearch } = useUI();
    const { items: wishlist, loading, error } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemove = (e, symbol) => {
        e.stopPropagation();
        dispatch(removeFromWishlist(symbol));
    };

    const handleNavigate = (symbol) => {
        navigate(`/charts/${symbol}`);
        if (window.innerWidth < 768) toggleWatchlist();
    };

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
                <div className="flex items-center gap-1">
                    <button 
                        onClick={openSearch}
                        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-blue-400 group"
                        title="Add Stock"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    </button>
                    <button onClick={toggleWatchlist} className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* List Section */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-slate-950/20">
                {loading && wishlist.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin opacity-50" />
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Syncing Data...</p>
                    </div>
                ) : wishlist.length > 0 ? (
                    <div className="space-y-2">
                        {wishlist.map(stock => (
                            <div 
                                key={stock.symbol} 
                                onClick={() => handleNavigate(stock.symbol)}
                                className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex justify-between items-center group cursor-pointer hover:border-blue-500/30 transition-all hover:bg-slate-800/40"
                            >
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                                        {stock.symbol.split('.')[0]}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 uppercase truncate mt-0.5">{stock.name}</p>
                                </div>
                                <button 
                                    onClick={(e) => handleRemove(e, stock.symbol)}
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
                    </div>
                )}
            </div>
            
            {/* Footer Summary */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <p className="text-[10px] text-slate-600 font-bold uppercase text-center tracking-widest">
                    {wishlist.length} {wishlist.length === 1 ? 'SYMBOL' : 'SYMBOLS'} TRACKED
                </p>
            </div>
        </div>
    );
};

export default WatchlistPanel;
