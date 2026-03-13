import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/index';
import { clearCart } from '../store/cartSlice';
import { Mail, Lock, User, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);

            if (data.success) {
                if (isLogin) {
                    dispatch(clearCart());
                    dispatch(loginSuccess(data.user));
                    const role = data.user.role;
                    if (role === 'admin') navigate('/admin');
                    else if (role === 'seller') navigate('/seller');
                    else navigate('/profile');
                } else {
                    setIsLogin(true);
                    alert('Account created! Please login.');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-300">
            <div className="max-w-md w-full relative">

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200 dark:bg-primary-900/40 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob transition-colors"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 dark:bg-blue-900/40 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000 transition-colors"></div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden relative z-10 border border-slate-100 dark:border-slate-700 transition-colors">
                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {isLogin ? 'Welcome back' : 'Create an account'}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                {isLogin ? 'Enter your details to access your account' : 'Join Vertex to start shopping smarter'}
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleAuth}>
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800/50">
                                    {error}
                                </div>
                            )}

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User size={18} className="text-slate-400 dark:text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow sm:text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow sm:text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow sm:text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {isLogin && (
                                    <div className="flex justify-end mt-2">
                                        <Link to="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">I want to join as</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${formData.role === 'buyer' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'}`}
                                        >
                                            <ShoppingBag size={24} className="mb-2" />
                                            <span className="font-bold text-sm">Buyer</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'seller' })}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${formData.role === 'seller' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'}`}
                                        >
                                            <ShieldCheck size={24} className="mb-2" />
                                            <span className="font-bold text-sm">Seller</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
                            >
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                                {!loading && <ArrowRight size={18} className="ml-2" />}
                            </button>


                        </form>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                            </span>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors focus:outline-none"
                            >
                                {isLogin ? 'Sign up here' : 'Log in here'}
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
                            <div className="flex justify-center space-x-4">
                                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                                    By signing in, you agree to our <br />
                                    <Link to="#" className="text-slate-900 dark:text-slate-300 border-b border-slate-900 dark:border-slate-300 pb-0.5 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-600 dark:hover:border-primary-400 transition-colors">Terms of Service</Link> and <Link to="#" className="text-slate-900 dark:text-slate-300 border-b border-slate-900 dark:border-slate-300 pb-0.5 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-600 dark:hover:border-primary-400 transition-colors">Privacy Policy</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

