import DashboardLeft from '../components/DashboardLeft';

const Dashboard = () => {
    return (
        <div className="relative min-h-screen flex bg-slate-950 pt-16">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                <DashboardLeft />
            </main>
        </div>
    );
};

export default Dashboard;
