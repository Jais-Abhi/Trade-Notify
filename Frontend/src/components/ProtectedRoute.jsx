import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';
import WatchlistPanel from './WatchlistPanel';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            dispatch(fetchWishlist());
        }
    }, [user, dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Outlet />
            <WatchlistPanel />
        </>
    );
};

export default ProtectedRoute;
