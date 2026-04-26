import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);

    const toggleWatchlist = useCallback(() => setIsWatchlistOpen(prev => !prev), []);
    const openSearch = useCallback(() => setIsSearchOpen(true), []);
    const closeSearch = useCallback(() => setIsSearchOpen(false), []);
    
    const addToWatchlist = useCallback((stock) => {
        setWatchlist(prev => {
            if (!prev.find(s => s.symbol === stock.symbol)) {
                return [...prev, stock];
            }
            return prev;
        });
    }, []);

    const removeFromWatchlist = useCallback((symbol) => {
        setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
    }, []);

    return (
        <UIContext.Provider value={{ 
            isWatchlistOpen, 
            setIsWatchlistOpen,
            toggleWatchlist, 
            isSearchOpen,
            setIsSearchOpen,
            openSearch,
            closeSearch,
            watchlist, 
            setWatchlist,
            selectedStock,
            setSelectedStock,
            addToWatchlist,
            removeFromWatchlist
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
