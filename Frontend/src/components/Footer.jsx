import { useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Footer = () => {
    const location = useLocation();

    // Hide Footer on authentication pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 font-sans mt-auto z-10 relative">
            <div className="w-full px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-300 font-semibold tracking-tight">TradeNotify</span>
                    </div>
                    
                    <div className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} TradeNotify. All rights reserved.
                    </div>
                    
                    <div className="flex gap-6 text-sm font-medium">
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
