import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthLayout from './components/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChartPage from './pages/ChartPage';
import { fetchToolset } from './features/drawingTool/drawingToolSlice';

function App() {
  const dispatch = useDispatch();
  const { load } = useAuth();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchToolset());
    }
  }, [user, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/charts/:symbol" element={<ChartPage />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;