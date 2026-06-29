import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ChartContainer from '../components/ChartContainer';
import api from '../api/axios';
import { ArrowLeft, Share2, Settings, Maximize2, ChevronDown, Loader2, Clock, Star, Save, CheckCircle2, XCircle, Undo2, Redo2 } from 'lucide-react';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { setActiveTool } from '../features/drawingTool/drawingToolSlice';

const ChartPage = () => {
    const { symbol } = useParams();
    const dispatch = useDispatch();
    const { items: wishlist } = useSelector((state) => state.wishlist);
    const { tools, activeTool } = useSelector((state) => state.drawingTool);
    
    const [intervals, setIntervals] = useState(['1m', '5m', '15m', '1h', '1d']);
    const [selectedInterval, setSelectedInterval] = useState('5m');
    const [loadingIntervals, setLoadingIntervals] = useState(true);
    const [isIntervalOpen, setIsIntervalOpen] = useState(false);
    const [stockInfo, setStockInfo] = useState(null);
    
    const [drawingLines, setDrawingLines] = useState([]);
    const [historyPast, setHistoryPast] = useState([]);
    const [historyFuture, setHistoryFuture] = useState([]);
    const [selectedDrawingId, setSelectedDrawingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const isInWishlist = wishlist.some(item => item.symbol === symbol);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // Helper to update drawings with a new history entry (e.g. create, delete, clear)
    const updateDrawingLinesWithHistory = (newLinesOrUpdater) => {
        setDrawingLines(prev => {
            const next = typeof newLinesOrUpdater === 'function' ? newLinesOrUpdater(prev) : newLinesOrUpdater;
            setHistoryPast(past => [...past, prev]);
            setHistoryFuture([]);
            return next;
        });
    };

    // Save history snapshot before drag begins
    const handleDragStart = (linesBeforeDrag) => {
        setHistoryPast(past => [...past, linesBeforeDrag]);
        setHistoryFuture([]);
    };

    const handleUndo = () => {
        if (historyPast.length === 0) return;
        const previous = historyPast[historyPast.length - 1];
        const newPast = historyPast.slice(0, -1);
        
        setHistoryFuture(prev => [drawingLines, ...prev]);
        setHistoryPast(newPast);
        setDrawingLines(previous);
        setSelectedDrawingId(null);
    };

    const handleRedo = () => {
        if (historyFuture.length === 0) return;
        const next = historyFuture[0];
        const newFuture = historyFuture.slice(1);

        setHistoryPast(prev => [...prev, drawingLines]);
        setHistoryFuture(newFuture);
        setDrawingLines(next);
        setSelectedDrawingId(null);
    };

    // Fetch drawings on symbol/interval change
    useEffect(() => {
        if (!symbol) return;
        // Reset all drawing state when navigating to a new chart
        setDrawingLines([]);
        setHistoryPast([]);
        setHistoryFuture([]);
        setSelectedDrawingId(null);

        const fetchDrawings = async () => {
            try {
                const response = await api.get(`/chart-drawings?symbol=${symbol}`);
                if (response.data && response.data.success) {
                    const loaded = response.data.data.map(d => {
                        if (d.tool === 'trendline' && d.points && d.points.length >= 2) {
                            return {
                                id: d.id,
                                tool: d.tool,
                                start: d.points[0],
                                end: d.points[1],
                                style: d.style || {},
                                options: d.options || {}
                            };
                        }
                        return null;
                    }).filter(Boolean);
                    setDrawingLines(loaded);
                }
            } catch (err) {
                console.error('Failed to load drawings', err);
            }
        };

        fetchDrawings();
    }, [symbol]); // Only re-fetch when symbol changes — interval switches reuse the same drawings in React state

    const handleSaveDrawings = async () => {
        setIsSaving(true);
        try {
            if (drawingLines.length === 0) {
                await api.delete(`/chart-drawings?symbol=${symbol}`);
            } else {
                const defaultTool = tools.find((tool) => tool.tool === 'trendline');
                const payload = {
                    symbol,
                    drawings: drawingLines.map(line => ({
                        id: line.id.toString(),
                        tool: line.tool || 'trendline',
                        points: [
                            { time: line.start.time, price: line.start.price },
                            { time: line.end.time, price: line.end.price }
                        ],
                        style: {
                            color: line.style?.color || defaultTool?.style?.color || '#3b82f6',
                            width: line.style?.width || defaultTool?.style?.width || 2,
                            lineStyle: line.style?.lineStyle || defaultTool?.style?.lineStyle || 'solid'
                        },
                        options: line.options || defaultTool?.options || {},
                        locked: false,
                        visible: true
                    }))
                };
                await api.post('/chart-drawings/save', payload);
            }
            showToast('Drawings saved successfully', 'success');
        } catch (err) {
            console.error('Error saving drawings:', err);
            showToast('Failed to save drawings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const fetchStockInfo = async () => {
            try {
                // Fetch full stock info to ensure we have name/series/isin for wishlist
                const { data } = await api.get(`/stocks/search?q=${symbol}&limit=1`);
                if (data.success && data.data.length > 0) {
                    setStockInfo(data.data[0]);
                }
            } catch (error) {
                console.error('Error fetching stock info', error);
            }
        };
        fetchStockInfo();
    }, [symbol]);

    const handleToggleWishlist = () => {
        if (isInWishlist) {
            dispatch(removeFromWishlist(symbol));
        } else if (stockInfo) {
            dispatch(addToWishlist({
                symbol: stockInfo.symbol,
                name: stockInfo.name,
                series: stockInfo.series,
                isin: stockInfo.isin
            }));
        }
    };

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
                        <button 
                            onClick={handleToggleWishlist}
                            className={`p-1 hover:bg-slate-900 rounded-lg transition-all ${isInWishlist ? 'text-blue-500' : 'text-slate-600 hover:text-slate-300'}`}
                            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <Star className={`w-4 h-4 ${isInWishlist ? 'fill-blue-500' : ''}`} />
                        </button>
                        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-900 px-1.5 py-0.5 rounded">NSE</span>
                    </div>

                    <div className="h-6 w-[1px] bg-slate-900"></div>

                    {/* Timeframe Selector Dropdown */}
                    <div className="relative">
                        {loadingIntervals ? (
                            <div className="flex items-center gap-2 px-3 h-8 bg-slate-900/40 rounded-lg">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700" />
                            </div>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setIsIntervalOpen(!isIntervalOpen)}
                                    className={`flex items-center gap-2 px-3 h-8 rounded-lg border transition-all text-xs font-bold uppercase tracking-wider ${isIntervalOpen ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-900/50 border-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
                                >
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{selectedInterval}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isIntervalOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isIntervalOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsIntervalOpen(false)}></div>
                                        <div className="absolute top-full left-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-white/5">
                                            <div className="px-3 py-2 mb-1 border-b border-slate-800/50">
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Timeframe</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-0.5">
                                                {intervals.map(tf => (
                                                    <button
                                                        key={tf}
                                                        onClick={() => {
                                                            setSelectedInterval(tf);
                                                            setIsIntervalOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all uppercase flex justify-between items-center ${tf === selectedInterval ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'}`}
                                                    >
                                                        {tf}
                                                        {tf === selectedInterval && <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="h-6 w-[1px] bg-slate-900"></div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleUndo}
                        disabled={historyPast.length === 0}
                        className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                        title="Undo"
                    >
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleRedo}
                        disabled={historyFuture.length === 0}
                        className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                        title="Redo"
                    >
                        <Redo2 className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-[1px] bg-slate-900 mx-1"></div>
                    <button 
                        onClick={handleSaveDrawings}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-3 h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition-colors shadow-lg shadow-emerald-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        SAVE DRAWINGS
                    </button>
                    <div className="h-6 w-[1px] bg-slate-900 mx-1"></div>
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
                <ChartContainer 
                    symbol={symbol} 
                    interval={selectedInterval} 
                    drawingLines={drawingLines}
                    setDrawingLines={setDrawingLines}
                    updateDrawingLinesWithHistory={updateDrawingLinesWithHistory}
                    selectedDrawingId={selectedDrawingId}
                    setSelectedDrawingId={setSelectedDrawingId}
                    onDragStart={handleDragStart}
                    activeTool={activeTool}
                    setActiveTool={(tool) => dispatch(setActiveTool(tool))}
                    tools={tools}
                    selectedTool={tools.find((tool) => tool.tool === activeTool) || null}
                />
            </main>

            {/* Custom Premium Toast Notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 ${
                    toast.type === 'success' 
                        ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200' 
                        : 'bg-red-950/90 border-red-800 text-red-200'
                }`}>
                    {toast.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-xs font-semibold">{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default ChartPage;
