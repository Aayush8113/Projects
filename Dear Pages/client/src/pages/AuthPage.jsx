import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Library, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Auth Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-10 bg-white dark:bg-slate-900 border shadow-2xl rounded-[40px] border-slate-100 dark:border-slate-800">
        
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 mb-4 text-white bg-indigo-600 rounded-[24px] shadow-lg shadow-indigo-200 dark:shadow-none">
            <Library size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Join the Vault'}
          </h1>
          <p className="mt-2 text-sm font-medium text-center text-slate-400">
            <Sparkles size={14} className="inline mr-1 text-amber-400" />
            {isLogin ? 'Your private DearPages collection is waiting.' : 'Start your family library journey today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
              <input required type="text" placeholder="Aayush Sharma" className="w-full px-6 py-4 font-bold transition-all border-none outline-none rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
            <input required type="email" placeholder="name@example.com" className="w-full px-6 py-4 font-bold transition-all border-none outline-none rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
            <div className="relative">
              <input required type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-6 py-4 pr-12 font-bold transition-all border-none outline-none rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute -translate-y-1/2 text-slate-400 right-4 top-1/2 hover:text-indigo-600 focus:outline-none">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button disabled={isSubmitting} className="flex items-center justify-center w-full py-5 mt-6 font-bold text-white transition-all shadow-xl bg-slate-900 dark:bg-indigo-600 rounded-[24px] hover:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 active:scale-95 shadow-indigo-200 dark:shadow-none">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Enter My Vault' : 'Create My Vault')}
          </button>
        </form>

        <p className="mt-8 text-sm font-medium text-center text-slate-500">
          {isLogin ? "New to the family?" : "Already have a vault?"}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 font-black text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4">
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;