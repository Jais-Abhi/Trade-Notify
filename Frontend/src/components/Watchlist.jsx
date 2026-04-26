import { Search } from 'lucide-react';

const dummyStocks = [
    { symbol: "RELIANCE.NS", name: "Reliance Industries Limited" },
    { symbol: "TCS.NS", name: "Tata Consultancy Services" },
    { symbol: "INFY.NS", name: "Infosys Limited" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited" },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank Limited" },
    { symbol: "SBIN.NS", name: "State Bank of India" },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel Limited" },
    { symbol: "ITC.NS", name: "ITC Limited" },
];

const Watchlist = ({ selectedStock, onSelectStock }) => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header & Search */}
            <div className="p-4 border-b border-slate-800/60">
                <h2 className="text-lg font-semibold text-white mb-3 tracking-tight">Watchlist</h2>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search symbols..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                <div className="space-y-1">
                    {dummyStocks.map((stock) => {
                        const isSelected = selectedStock?.symbol === stock.symbol;
                        return (
                            <button
                                key={stock.symbol}
                                onClick={() => onSelectStock(stock)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-200 group flex justify-between items-center ${
                                    isSelected 
                                    ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                                    : 'hover:bg-slate-800/50 border-transparent'
                                } border`}
                            >
                                <div>
                                    <h3 className={`font-medium tracking-tight ${isSelected ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                                        {stock.symbol}
                                    </h3>
                                    <p className="text-xs text-slate-500 truncate max-w-[160px] mt-0.5">
                                        {stock.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                                        —
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        —
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Watchlist;
