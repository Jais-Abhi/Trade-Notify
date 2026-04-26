import React from 'react';
import { MousePointer2, TrendingUp, Eraser } from 'lucide-react';

/**
 * DrawingToolbar provides the user interface to switch between different
 * drawing tools and the default cursor mode.
 */
const DrawingToolbar = ({ activeTool, setActiveTool, onClearAll }) => {
    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 p-1.5 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
            {/* Cursor Mode */}
            <button 
                onClick={() => setActiveTool(null)}
                className={`p-2.5 rounded-xl transition-all duration-200 group relative ${
                    !activeTool ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                }`}
                title="Cursor (Select)"
            >
                <MousePointer2 className="w-5 h-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Cursor (V)
                </span>
            </button>

            <div className="h-[1px] bg-slate-800 mx-2"></div>

            {/* Trendline Tool */}
            <button 
                onClick={() => setActiveTool('trendline')}
                className={`p-2.5 rounded-xl transition-all duration-200 group relative ${
                    activeTool === 'trendline' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                }`}
                title="Trendline"
            >
                <TrendingUp className="w-5 h-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Trendline (T)
                </span>
            </button>

            <div className="h-[1px] bg-slate-800 mx-2"></div>

            {/* Clear Button (Utility) */}
            <button 
                onClick={onClearAll}
                className="p-2.5 rounded-xl text-slate-600 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group relative"
                title="Clear All"
            >
                <Eraser className="w-5 h-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Clear All Drawings
                </span>
            </button>
        </div>
    );
};

export default DrawingToolbar;
