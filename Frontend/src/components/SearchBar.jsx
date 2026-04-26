import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToWishlist } from '../features/wishlist/wishlistSlice';
import { Search, Loader2, X } from 'lucide-react';
import api from '../api/axios';
import { useUI } from '../context/UIContext';

// Reusable debounce function
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

const SearchBar = () => {
    const { isSearchOpen, setIsSearchOpen, openSearch, closeSearch } = useUI();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);

    // Shortcuts handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Alt + S to open
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                openSearch();
            }
            // ESC to close
            if (e.key === 'Escape') {
                closeSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [openSearch, closeSearch]);

    const fetchTopStocks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/stocks?limit=100');
            if (data.success) {
                setResults(data.data);
            }
        } catch (error) {
            console.error('Error fetching top stocks', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSearchStocks = useCallback(async (searchTerm) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/stocks/search?q=${searchTerm}&limit=100`);
            if (data.success) {
                setResults(data.data);
            }
        } catch (error) {
            console.error('Error searching stocks', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch top stocks automatically when modal opens and query is empty
    useEffect(() => {
        if (isSearchOpen && !query.trim() && results.length === 0) {
            fetchTopStocks();
        }
    }, [isSearchOpen, query, results.length, fetchTopStocks]);

    // Use useCallback to persist the debounced function across re-renders
    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            if (!searchTerm.trim()) {
                fetchTopStocks();
            } else {
                fetchSearchStocks(searchTerm);
            }
        }, 1000), // 1 second delay
        []
    );

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setIsSearchOpen(true);
        
        // Show loading immediately to give UX feedback that a search is pending
        if (val.trim()) setLoading(true);
        
        debouncedSearch(val);
    };

    const handleFocus = () => {
        openSearch();
        // Only fetch top 100 if we have no query and no results yet
        if (!query.trim() && results.length === 0) {
            fetchTopStocks();
        }
    };

    const handleSelect = (stock) => {
        dispatch(addToWishlist({
            symbol: stock.symbol,
            name: stock.name,
            series: stock.series,
            isin: stock.isin
        }));
        setQuery('');
        closeSearch();
        navigate(`/charts/${stock.symbol}`);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        closeSearch();
    };

    return (
        <div className="ml-8 hidden md:block flex-1 max-w-sm">
            <div className="relative" onClick={handleFocus}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input
                    type="text"
                    readOnly
                    placeholder="Search stocks... (Alt + S)"
                    className="w-full pl-9 pr-8 py-1.5 bg-slate-950/60 border border-slate-700/50 rounded-lg text-sm text-slate-400 cursor-pointer hover:border-slate-600 transition-all shadow-inner"
                />
            </div>

            {/* Modal-style Search Experience */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        onClick={closeSearch}
                    ></div>
                    
                    {/* Centered Search Container (80% Height) */}
                    <div className="relative w-full max-w-3xl h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        
                        {/* Search Input Section */}
                        <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
                            <Search className="h-6 w-6 text-blue-500" />
                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Search by name or symbol (e.g. RELIANCE)"
                                className="flex-1 bg-transparent border-none outline-none text-xl text-slate-200 placeholder-slate-600"
                            />
                            {loading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                            <button 
                                onClick={closeSearch}
                                className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-slate-200"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Results Section */}
                        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-slate-950/20">
                            {loading && results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-500/50" />
                                    <p className="text-lg font-medium">Fetching stocks...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-1 gap-1">
                                    {results.map((stock, idx) => (
                                        <button
                                            key={`${stock.symbol}-${idx}`}
                                            onClick={() => handleSelect(stock)}
                                            className="w-full text-left px-4 py-4 rounded-xl hover:bg-blue-600/10 transition-all group flex justify-between items-center border border-transparent hover:border-blue-500/20"
                                        >
                                            <div className="flex flex-col overflow-hidden">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-slate-200 group-hover:text-blue-400">
                                                        {stock?.symbol?.split('.')[0] || 'Unknown'}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        {stock.series || 'EQ'}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-slate-500 group-hover:text-slate-400 truncate mt-1">
                                                    {stock.name}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs font-bold text-blue-500/80 uppercase tracking-tighter">View Chart</span>
                                                <span className="text-[10px] text-slate-600 font-mono mt-1">{stock.isin}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : query ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <Search className="h-16 w-16 mb-4 opacity-10" />
                                    <p className="text-xl font-medium">No results found for "{query}"</p>
                                    <p className="text-sm mt-2">Try searching with a different symbol or company name.</p>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Popular Stocks</h3>
                                    {/* Placeholder for top stocks will be handled by results logic */}
                                </div>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                            <div className="flex gap-4">
                                <span><span className="text-slate-400">↑↓</span> to navigate</span>
                                <span><span className="text-slate-400">Enter</span> to select</span>
                            </div>
                            <span>ESC to close</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
