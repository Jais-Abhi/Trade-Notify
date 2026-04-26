import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';
import DashboardLeft from '../components/DashboardLeft';
import WatchlistPanel from '../components/WatchlistPanel';

const Dashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);
    return (
        <div className="relative min-h-screen flex bg-slate-950 pt-16">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                <DashboardLeft />
            </main>

            {/* Watchlist Overlay/Panel */}
            <WatchlistPanel />
        </div>
    );
};

export default Dashboard;
