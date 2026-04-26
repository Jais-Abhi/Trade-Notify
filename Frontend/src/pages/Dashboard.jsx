import { useState } from 'react';
import DashboardLeft from '../components/DashboardLeft';
import WatchlistPanel from '../components/WatchlistPanel';

const Dashboard = () => {
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
