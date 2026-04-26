import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../context/UIContext';
import { Activity, LogOut, LogIn, UserPlus, LayoutList } from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { toggleWatchlist } = useUI();
    const navigate = useNavigate();
    const location = useLocation();

    // Hide Navbar on authentication pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900 border-b border-slate-800 shadow-sm font-sans">
            <div className="w-full px-4 sm:px-6">
                <div className="flex justify-between h-16">
                    {/* Brand Section & Search */}
                    <div className="flex items-center">
                        <div className="flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-500" />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                                TradeNotify
                            </h1>
                        </div>
                        
                        {user && <SearchBar />}
                    </div>

                    {/* Navigation Links & Shortcuts */}
                    <div className="flex items-center">
                        {user && (
                            <div className="hidden md:flex items-center space-x-8 mr-8">
                                <button 
                                    onClick={toggleWatchlist}
                                    className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                                >
                                    <LayoutList className="w-4 h-4" />
                                    Watchlist
                                </button>
                                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white hover:underline decoration-blue-500 decoration-2 underline-offset-8 transition-all">Documentation</a>
                                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white hover:underline decoration-blue-500 decoration-2 underline-offset-8 transition-all">Strategy</a>
                            </div>
                        )}

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <div className="h-4 w-[1px] bg-slate-700 hidden sm:block mx-2"></div>
                                    
                                    <span className="text-slate-300 font-medium text-sm hidden sm:block">
                                        {user.name}
                                    </span>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-700 hover:text-white transition-all font-medium text-sm ml-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink 
                                        to="/login"
                                        className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </NavLink>
                                    <NavLink 
                                        to="/register"
                                        className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Register
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
