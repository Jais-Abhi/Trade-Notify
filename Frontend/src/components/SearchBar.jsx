import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { Search, Loader2, X, Star } from 'lucide-react';
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

const categories = [
    { key: 'stocks', label: 'Stocks', placeholder: 'Search by name or symbol (e.g. RELIANCE)' },
    { key: 'crypto', label: 'Crypto', placeholder: 'Search by name or symbol (e.g. BTC-USD)' },
    { key: 'forex', label: 'Forex', placeholder: 'Search by name or symbol (e.g. EURUSD=X)' }
];

const SearchBar = () => {
    const { isSearchOpen, setIsSearchOpen, openSearch, closeSearch } = useUI();
    const { items: wishlist } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('stocks');

    const activeCategory = categories.find((category) => category.key === selectedCategory) || categories[0];

    // Shortcuts handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                openSearch();
            }
            if (e.key === 'Escape') {
                closeSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [openSearch, closeSearch]);

    const getCategoryEndpoint = useCallback((category = selectedCategory) => {
        if (category === 'crypto') return '/crypto';
        if (category === 'forex') return '/forex';
        return '/stocks';
    }, [selectedCategory]);

    const getSearchEndpoint = useCallback((category = selectedCategory) => {
        if (category === 'crypto') return '/crypto/search';
        if (category === 'forex') return '/forex/search';
        return '/stocks/search';
    }, [selectedCategory]);

    const fetchAssets = useCallback(async (searchTerm = '') => {
        setLoading(true);
        try {
            const endpoint = searchTerm
                ? `${getSearchEndpoint()}?q=${encodeURIComponent(searchTerm)}&limit=100`
                : `${getCategoryEndpoint()}?limit=100`;
            const { data } = await api.get(endpoint);
            if (data.success) {
                setResults(data.data);
            }
        } catch (error) {
            console.error(`Error fetching ${selectedCategory}`, error);
        } finally {
            setLoading(false);
        }
    }, [getCategoryEndpoint, getSearchEndpoint, selectedCategory]);

    useEffect(() => {
        if (isSearchOpen && !query.trim() && results.length === 0) {
            fetchAssets();
        }
    }, [isSearchOpen, query, results.length, fetchAssets]);

    useEffect(() => {
        setResults([]);
        setQuery('');
    }, [selectedCategory]);

    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            if (!searchTerm.trim()) {
                fetchAssets();
            } else {
                fetchAssets(searchTerm);
            }
        }, 800),
        [fetchAssets]
    );

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setIsSearchOpen(true);
        if (val.trim()) setLoading(true);
        debouncedSearch(val);
    };

    const handleFocus = () => {
        openSearch();
        if (!query.trim() && results.length === 0) {
            fetchAssets();
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setResults([]);
        setQuery('');
        setIsSearchOpen(true);
    };

    const handleSelect = (asset) => {
        setQuery('');
        closeSearch();
        navigate(`/charts/${asset.symbol}`);
    };

    const handleToggleWishlist = (e, asset) => {
        e.stopPropagation();
        const isInWishlist = wishlist.some(item => item.symbol === asset.symbol);
        if (isInWishlist) {
            dispatch(removeFromWishlist(asset.symbol));
        } else {
            dispatch(addToWishlist({
                symbol: asset.symbol,
                name: asset.name,
                series: asset.series || (selectedCategory === 'crypto' ? 'CRYPTO' : selectedCategory === 'forex' ? 'FX' : 'EQ'),
                isin: asset.isin || null
            }));
        }
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
                    placeholder="Search assets... (Alt + S)"
                    className="w-full pl-9 pr-8 py-1.5 bg-slate-950/60 border border-slate-700/50 rounded-lg text-sm text-slate-400 cursor-pointer hover:border-slate-600 transition-all shadow-inner"
                />
            </div>

            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={closeSearch}></div>

                    <div className="relative w-full max-w-3xl h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                        <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
                            <Search className="h-6 w-6 text-blue-500" />
                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder={activeCategory.placeholder}
                                className="flex-1 bg-transparent border-none outline-none text-xl text-slate-200 placeholder-slate-600"
                            />
                            {loading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                            <button onClick={closeSearch} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-slate-200">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/70 flex gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.key}
                                    onClick={() => handleCategoryChange(category.key)}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategory === category.key ? 'bg-blue-600 text-white' : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-slate-950/20">
                            {loading && results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-500/50" />
                                    <p className="text-lg font-medium">Fetching {activeCategory.label.toLowerCase()}...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-1 gap-1">
                                    {results.map((asset, idx) => {
                                        const isInWishlist = wishlist.some(item => item.symbol === asset.symbol);
                                        const badgeLabel = asset.series || (selectedCategory === 'crypto' ? 'CRYPTO' : selectedCategory === 'forex' ? 'FX' : 'EQ');
                                        return (
                                            <button
                                                key={`${asset.symbol}-${idx}`}
                                                onClick={() => handleSelect(asset)}
                                                className="w-full text-left px-4 py-4 rounded-xl hover:bg-blue-600/10 transition-all group flex justify-between items-center border border-transparent hover:border-blue-500/20"
                                            >
                                                <div className="flex flex-col overflow-hidden">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg font-bold text-slate-200 group-hover:text-blue-400">
                                                            {asset?.symbol?.split('.')[0] || 'Unknown'}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                            {badgeLabel}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-slate-500 group-hover:text-slate-400 truncate mt-1">
                                                        {asset.name}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col items-end opacity-0 transition-opacity sm:opacity-100">
                                                        <span className="text-xs font-bold text-blue-500/80 uppercase tracking-tighter">View Chart</span>
                                                        <span className="text-[10px] text-slate-600 font-mono mt-1">{asset.isin || asset.symbol}</span>
                                                    </div>

                                                    <button
                                                        onClick={(e) => handleToggleWishlist(e, asset)}
                                                        className={`p-3 rounded-xl transition-all ${isInWishlist ? 'bg-blue-600/20 text-blue-500' : 'bg-slate-800/50 text-slate-600 hover:text-slate-300 hover:bg-slate-800'}`}
                                                        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                                    >
                                                        <Star className={`w-5 h-5 ${isInWishlist ? 'fill-blue-500' : ''}`} />
                                                    </button>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : query ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <Search className="h-16 w-16 mb-4 opacity-10" />
                                    <p className="text-xl font-medium">No results found for "{query}"</p>
                                    <p className="text-sm mt-2">Try searching with a different symbol or company name in {activeCategory.label.toLowerCase()}.</p>
                                </div>
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">Popular {activeCategory.label}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                            <div className="flex gap-4">
                                <span><span className="text-slate-400">Click Row</span> to View</span>
                                <span><span className="text-slate-400">Star</span> to Wishlist</span>
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
