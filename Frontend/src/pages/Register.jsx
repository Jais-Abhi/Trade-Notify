import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { register, user, loading, error, resetError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
        return () => resetError();
    }, [user, navigate, resetError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        register({ name, email, password });
    };

    return (
        <div>
            <div className="mb-8 text-center">
                <h2 className="text-xl font-semibold text-white">Create Account</h2>
                <p className="text-slate-400 text-sm mt-1">Join the ultimate setup detection platform.</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                            placeholder="trader@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] mt-4"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    Sign in here
                </Link>
            </p>
        </div>
    );
};

export default Register;
