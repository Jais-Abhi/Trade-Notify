import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="max-w-md w-full mx-4 z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-2xl mb-5">
                        <Activity className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        TradeNotify
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide uppercase">
                        Setup Detection Terminal
                    </p>
                </div>
                
                <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-800/60">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
